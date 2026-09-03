// src/lib/server/questionImages.ts
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import {
	QUESTION_SOCIAL_CARD_VARIANT,
	buildQuestionSocialCardPath
} from '$lib/socialCards/questionSocialCard';

const DATA_URL_REGEX = /^data:(image\/(?:png|jpeg|webp));base64,/;
const DEFAULT_EXTENSION = 'png';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export interface ParsedImageDataUrl {
	buffer: Buffer;
	contentType: string;
	extension: string;
}

export interface UploadQuestionImageOptions {
	supabase: any;
	dataUrl: string;
	questionUrl: string;
	maxBytes?: number;
	imageId?: string;
	variant?: string;
}

export interface UploadQuestionImageBufferOptions {
	supabase: any;
	buffer: Buffer;
	contentType: string;
	questionUrl: string;
	maxBytes?: number;
	imageId?: string;
	variant?: string;
}

export const parseImageDataUrl = (dataUrl: string): ParsedImageDataUrl => {
	const match = DATA_URL_REGEX.exec(dataUrl);
	if (!match) {
		throw new Error('Invalid image data URL');
	}
	const contentType = match[1];
	const base64Data = dataUrl.replace(DATA_URL_REGEX, '');
	if (
		base64Data.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4 ||
		!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64Data)
	) {
		throw new Error('Invalid or oversized image data');
	}
	const buffer = Buffer.from(base64Data, 'base64');
	const rawExtension = contentType.split('/')[1]?.toLowerCase() || DEFAULT_EXTENSION;
	const extension = rawExtension === 'jpeg' ? 'jpg' : rawExtension;
	return { buffer, contentType, extension };
};

export const buildQuestionImagePath = ({
	questionUrl,
	extension,
	imageId = uuidv4()
}: {
	questionUrl: string;
	extension: string;
	imageId?: string;
}) => {
	if (
		!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,199}$/.test(questionUrl) ||
		!/^[a-zA-Z0-9_-]+$/.test(imageId) ||
		!['png', 'jpg', 'webp'].includes(extension)
	) {
		throw new Error('Invalid question image path');
	}
	return `images/${questionUrl}/${imageId}.${extension}`;
};

const resolveQuestionImagePath = ({
	questionUrl,
	extension,
	imageId,
	variant
}: {
	questionUrl: string;
	extension: string;
	imageId?: string;
	variant?: string;
}) => {
	if (variant === QUESTION_SOCIAL_CARD_VARIANT) {
		buildQuestionImagePath({ questionUrl, extension, imageId });
		return buildQuestionSocialCardPath(questionUrl);
	}
	return buildQuestionImagePath({ questionUrl, extension, imageId });
};

export const uploadQuestionImageBuffer = async ({
	supabase,
	buffer,
	contentType,
	questionUrl,
	maxBytes,
	imageId,
	variant
}: UploadQuestionImageBufferOptions): Promise<{
	path: string;
	bytes: number;
	contentType: string;
}> => {
	if (buffer.length > Math.min(maxBytes ?? MAX_IMAGE_BYTES, MAX_IMAGE_BYTES)) {
		throw new Error('Image file too large');
	}
	if (!['image/png', 'image/jpeg', 'image/webp'].includes(contentType)) {
		throw new Error('Unsupported image format');
	}
	// Decode and re-encode raster pixels. MIME labels and filename extensions
	// alone do not prove that an uploaded file is an image.
	const image = sharp(buffer, { limitInputPixels: 25_000_000, animated: false });
	const metadata = await image.metadata();
	if (!['png', 'jpeg', 'webp'].includes(metadata.format ?? ''))
		throw new Error('Invalid raster image');
	buffer = await image.png().toBuffer();
	contentType = 'image/png';
	if (buffer.length > Math.min(maxBytes ?? MAX_IMAGE_BYTES, MAX_IMAGE_BYTES))
		throw new Error('Image file too large');

	const rawExtension = contentType.split('/')[1]?.toLowerCase() || DEFAULT_EXTENSION;
	const extension = rawExtension === 'jpeg' ? 'jpg' : rawExtension;
	const path = resolveQuestionImagePath({ questionUrl, extension, imageId, variant });

	const { error } = await supabase.storage
		.from('questions')
		.upload(path, buffer, { upsert: true, contentType, cacheControl: '3600' });

	if (error) {
		throw error;
	}

	return { path, bytes: buffer.length, contentType };
};

export const uploadQuestionImage = async ({
	supabase,
	dataUrl,
	questionUrl,
	maxBytes,
	imageId,
	variant
}: UploadQuestionImageOptions): Promise<{ path: string; bytes: number; contentType: string }> => {
	const { buffer, contentType } = parseImageDataUrl(dataUrl);
	return uploadQuestionImageBuffer({
		supabase,
		buffer,
		contentType,
		questionUrl,
		maxBytes,
		imageId,
		variant
	});
};

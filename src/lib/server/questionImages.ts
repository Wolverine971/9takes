// src/lib/server/questionImages.ts
import { v4 as uuidv4 } from 'uuid';
import {
	QUESTION_SOCIAL_CARD_VARIANT,
	buildQuestionSocialCardPath
} from '$lib/socialCards/questionSocialCard';

const DATA_URL_REGEX = /^data:(image\/[a-zA-Z0-9.+-]+);base64,/;
const DEFAULT_EXTENSION = 'png';

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
}) => `images/${questionUrl}/${imageId}.${extension}`;

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
	if (maxBytes && buffer.length > maxBytes) {
		throw new Error('Image file too large');
	}

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

// src/routes/social-image.png/+server.ts
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

const CACHE_CONTROL = 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000';
const STATIC_ROOT = path.resolve('static');
const ALLOWED_PATH_PREFIX = '/types/';
const ALLOWED_EXTENSION = /\.(?:png|webp|jpe?g)$/i;
const FALLBACK_IMAGE_PATH = '/brand/aero.png';
const convertedImageCache = new Map<string, Buffer>();

function resolveStaticAssetPath(requestedPath: string | null): string | null {
	if (!requestedPath?.startsWith(ALLOWED_PATH_PREFIX) || !ALLOWED_EXTENSION.test(requestedPath)) {
		return null;
	}

	const normalizedPath = path.posix.normalize(requestedPath);
	if (!normalizedPath.startsWith(ALLOWED_PATH_PREFIX) || normalizedPath.includes('\0')) {
		return null;
	}

	const resolvedPath = path.resolve(STATIC_ROOT, `.${normalizedPath}`);
	if (!resolvedPath.startsWith(`${STATIC_ROOT}${path.sep}`)) {
		return null;
	}

	return resolvedPath;
}

async function readStaticAsset(filePath: string, request: Request): Promise<Buffer> {
	try {
		return await readFile(filePath);
	} catch {
		const staticPath = `/${path.relative(STATIC_ROOT, filePath).split(path.sep).join('/')}`;
		const response = await fetch(new URL(staticPath, request.url));
		if (!response.ok) {
			throw new Error(`Failed to load static asset: ${staticPath}`);
		}
		return Buffer.from(await response.arrayBuffer());
	}
}

async function toPngBuffer(sourcePath: string, request: Request): Promise<Buffer> {
	const cached = convertedImageCache.get(sourcePath);
	if (cached) {
		return cached;
	}

	const sourceBuffer = await readStaticAsset(sourcePath, request);
	const pngBuffer = sourcePath.toLowerCase().endsWith('.png')
		? sourceBuffer
		: await sharp(sourceBuffer).png().toBuffer();

	convertedImageCache.set(sourcePath, pngBuffer);
	return pngBuffer;
}

export const GET: RequestHandler = async ({ url, request }) => {
	const requestedPath = url.searchParams.get('path');
	const sourcePath = resolveStaticAssetPath(requestedPath);
	const fallbackPath = path.resolve(STATIC_ROOT, `.${FALLBACK_IMAGE_PATH}`);

	try {
		const imageBuffer = await toPngBuffer(sourcePath ?? fallbackPath, request);
		return new Response(new Uint8Array(imageBuffer), {
			headers: {
				'content-type': 'image/png',
				'cache-control': CACHE_CONTROL
			}
		});
	} catch {
		const imageBuffer = await readStaticAsset(fallbackPath, request);
		return new Response(new Uint8Array(imageBuffer), {
			headers: {
				'content-type': 'image/png',
				'cache-control': CACHE_CONTROL
			}
		});
	}
};

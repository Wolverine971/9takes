// src/routes/social-image.png/+server.ts
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import type { RequestHandler } from './$types';
import { renderBrandCard } from '$lib/server/brandCards/renderBrandCard';
import { PERSON_SOCIAL_CARD_MAX_NAME_LENGTH } from '$lib/utils/socialImage';
import { formatPersonalityDisplayName } from '$lib/utils/personalityAnalysis';

const CACHE_CONTROL = 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000';
const STATIC_ROOT = path.resolve('static');
const ALLOWED_PATH_PREFIX = '/types/';
const ALLOWED_EXTENSION = /\.(?:png|webp|jpe?g)$/i;
// Cold Light site-default card (1200x630 JPEG), see src/lib/brand/brandCardPresets.ts.
const FALLBACK_IMAGE_PATH = '/brand/og/default.jpg';
const MAX_CONVERTED_IMAGE_CACHE_ENTRIES = 256;
const convertedImageCache = new Map<string, Buffer>();

/** One LRU-ish map for converted portraits and rendered person cards (keyed by portrait, name, type). */
function setCachedImage(cacheKey: string, buffer: Buffer): void {
	convertedImageCache.set(cacheKey, buffer);

	if (convertedImageCache.size > MAX_CONVERTED_IMAGE_CACHE_ENTRIES) {
		const firstKey = convertedImageCache.keys().next().value;
		if (firstKey) {
			convertedImageCache.delete(firstKey);
		}
	}
}

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

	setCachedImage(sourcePath, pngBuffer);
	return pngBuffer;
}

function imageResponse(buffer: Buffer, contentType: 'image/png' | 'image/jpeg'): Response {
	return new Response(new Uint8Array(buffer), {
		headers: {
			'content-type': contentType,
			'cache-control': CACHE_CONTROL
		}
	});
}

interface PersonCardParams {
	portrait: string;
	/** The portrait's own display name, the only spelling that is rendered. */
	name: string;
	type: number | null;
	/** False when the request spelled the name any other way. */
	nameIsCanonical: boolean;
}

/**
 * `name` (1-80 chars) + a valid /types/ `path` switch the endpoint to the 1200x630 Cold Light
 * person card. `type` is optional and ignored unless it is 1-9. Only name, type and portrait go
 * on the card, never take or comment text.
 *
 * The card always carries the display name derived from the portrait's filename, which is the
 * name the site's own links send. One portrait therefore has one rendered card per type, and any
 * other spelling of `name` is redirected to that card's URL instead of being rendered again.
 */
function readPersonCardParams(url: URL, sourcePath: string | null): PersonCardParams | null {
	const requestedName = url.searchParams.get('name') ?? '';
	const name = requestedName.replace(/\s+/g, ' ').trim();
	if (!sourcePath || !name || name.length > PERSON_SOCIAL_CARD_MAX_NAME_LENGTH) return null;

	const portrait = `/${path.relative(STATIC_ROOT, sourcePath).split(path.sep).join('/')}`;
	const stem = path.posix.basename(portrait).replace(ALLOWED_EXTENSION, '');
	const fileName = formatPersonalityDisplayName(stem);
	if (!fileName) return null;

	const rawType = url.searchParams.get('type');
	const typeNumber = rawType && /^[1-9]$/.test(rawType) ? Number(rawType) : null;
	return {
		portrait,
		name: fileName,
		type: typeNumber,
		nameIsCanonical: requestedName === fileName
	};
}

/** Same request with the canonical `name`, so every spelling shares one cached card. */
function canonicalNameRedirect(url: URL, name: string): Response {
	const params = new URLSearchParams(url.searchParams);
	params.set('name', name);
	return new Response(null, {
		status: 301,
		headers: {
			location: `${url.pathname}?${params.toString()}`,
			'cache-control': CACHE_CONTROL
		}
	});
}

async function renderPersonCard({
	portrait,
	name,
	type
}: Pick<PersonCardParams, 'portrait' | 'name' | 'type'>): Promise<Buffer> {
	const cacheKey = `person-card|${portrait}|${name}|${type ?? ''}`;
	const cached = convertedImageCache.get(cacheKey);
	if (cached) return cached;

	const jpeg = await renderBrandCard(
		{ template: 'person', name, type, portrait },
		{ format: 'og', output: 'jpeg' }
	);
	setCachedImage(cacheKey, jpeg);
	return jpeg;
}

async function fallbackResponse(request: Request): Promise<Response> {
	const fallbackPath = path.resolve(STATIC_ROOT, `.${FALLBACK_IMAGE_PATH}`);
	return imageResponse(await readStaticAsset(fallbackPath, request), 'image/jpeg');
}

export const GET: RequestHandler = async ({ url, request }) => {
	const requestedPath = url.searchParams.get('path');
	const sourcePath = resolveStaticAssetPath(requestedPath);
	const personCard = readPersonCardParams(url, sourcePath);

	try {
		if (personCard) {
			if (!personCard.nameIsCanonical) return canonicalNameRedirect(url, personCard.name);
			return imageResponse(await renderPersonCard(personCard), 'image/jpeg');
		}
		if (!sourcePath) {
			return await fallbackResponse(request);
		}
		return imageResponse(await toPngBuffer(sourcePath, request), 'image/png');
	} catch {
		return fallbackResponse(request);
	}
};

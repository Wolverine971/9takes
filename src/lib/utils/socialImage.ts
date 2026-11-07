// src/lib/utils/socialImage.ts
const SITE_ORIGIN = 'https://9takes.com';
const SOCIAL_IMAGE_ROUTE = '/social-image.png';

function toSameSitePath(image: string): string {
	if (!image) return '';
	if (image.startsWith('/')) return image;

	try {
		const url = new URL(image);
		return url.origin === SITE_ORIGIN ? url.pathname : '';
	} catch {
		return '';
	}
}

function isProxyableTypeImagePath(pathname: string): boolean {
	return pathname.startsWith('/types/') && /\.(?:webp|jpe?g)$/i.test(pathname);
}

export function buildSocialImageUrl(image: string | null | undefined): string {
	if (!image) return '';

	const sameSitePath = toSameSitePath(image);
	if (!sameSitePath) return image;

	if (!isProxyableTypeImagePath(sameSitePath)) {
		return `${SITE_ORIGIN}${sameSitePath}`;
	}

	const params = new URLSearchParams({ path: sameSitePath });
	return `${SITE_ORIGIN}${SOCIAL_IMAGE_ROUTE}?${params.toString()}`;
}

export const PERSON_SOCIAL_CARD_WIDTH = 1200;
export const PERSON_SOCIAL_CARD_HEIGHT = 630;
export const PERSON_SOCIAL_CARD_MAX_NAME_LENGTH = 80;

/**
 * 1200x630 Cold Light person card for /personality-analysis/[slug] link previews:
 * the /types/ portrait framed on the right, name + type on the left (rendered by
 * /social-image.png with `name`). Falls back to the plain portrait proxy when the
 * portrait isn't a /types/ asset or there is no usable name.
 */
export function buildPersonSocialCardUrl({
	imagePath,
	name,
	type
}: {
	imagePath: string | null | undefined;
	name: string | null | undefined;
	type?: string | number | null;
}): string {
	if (!imagePath) return '';

	const sameSitePath = toSameSitePath(imagePath).split(/[?#]/)[0];
	const cleanName = (name ?? '').replace(/\s+/g, ' ').trim();
	if (
		!sameSitePath ||
		!isProxyableTypeImagePath(sameSitePath) ||
		!cleanName ||
		cleanName.length > PERSON_SOCIAL_CARD_MAX_NAME_LENGTH
	) {
		return buildSocialImageUrl(imagePath);
	}

	const params = new URLSearchParams({ path: sameSitePath, name: cleanName });
	const typeNumber = Number(type);
	if (Number.isInteger(typeNumber) && typeNumber >= 1 && typeNumber <= 9) {
		params.set('type', String(typeNumber));
	}
	// Carry the portrait's cache-buster so platforms refetch when the portrait changes.
	const version = getSearchParam(imagePath, 'v');
	if (version) params.set('v', version);
	return `${SITE_ORIGIN}${SOCIAL_IMAGE_ROUTE}?${params.toString()}`;
}

function getSearchParam(image: string, key: string): string {
	try {
		return new URL(image, SITE_ORIGIN).searchParams.get(key) ?? '';
	} catch {
		return '';
	}
}

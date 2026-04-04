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

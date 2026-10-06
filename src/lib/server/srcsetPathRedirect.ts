// src/lib/server/srcsetPathRedirect.ts

const SRCSET_CANDIDATE_LIST = /^(\/(?![/\\])[^\s,\\]+)\s+\d+(?:\.\d+)?[wx]\s*(?:,|$)/;
const IMAGE_PATH = /\.(?:webp|png|jpe?g|avif|gif)$/i;

/**
 * Some crawlers read an `<img srcset>` as a single URL and request the whole
 * candidate list: `/blogs/s-x.webp%20218w,%20/blogs/x.webp%20560w`. Resolve that
 * to its first candidate instead of a 404. Same-origin image paths only, so this
 * can't be turned into an open redirect.
 */
export function getSrcsetCandidatePath(pathname: string): string | null {
	if (!pathname.includes('%20')) return null;

	let decoded: string;
	try {
		decoded = decodeURIComponent(pathname);
	} catch {
		return null;
	}

	const firstCandidate = decoded.match(SRCSET_CANDIDATE_LIST)?.[1];
	if (!firstCandidate || !IMAGE_PATH.test(firstCandidate)) return null;
	return encodeURI(firstCandidate);
}

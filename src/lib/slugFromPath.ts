// src/lib/slugFromPath.ts
export const slugFromPath = (path: string): string => {
	const slug = path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1];
	if (slug) {
		return slug;
	}

	const lastSegment = path.split('/').pop() ?? path;
	return lastSegment.replace(/\.(svelte\.md|md|svx)$/i, '') || lastSegment;
};

// src/lib/slugFromPath.ts
export const slugFromPath = (path: string): string | null =>
	path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

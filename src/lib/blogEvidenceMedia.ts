// src/lib/blogEvidenceMedia.ts
import rawRegistry from '$lib/data/blog-evidence-media.json';
import type { BlogEvidenceMedia } from '$lib/types/blogEvidenceMedia';

type BlogEvidenceRegistry = {
	schema_version: number;
	updated_at: string;
	items: BlogEvidenceMedia[];
};

const registry = rawRegistry as BlogEvidenceRegistry;
const evidenceById = new Map(registry.items.map((item) => [item.id, item]));

export function getBlogEvidenceMedia(evidenceId: string): BlogEvidenceMedia | undefined {
	return evidenceById.get(evidenceId);
}

export function getAllBlogEvidenceMedia(): readonly BlogEvidenceMedia[] {
	return registry.items;
}

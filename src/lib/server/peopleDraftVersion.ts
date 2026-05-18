// src/lib/server/peopleDraftVersion.ts
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export interface PeopleDraftVersion {
	content: string;
	modifiedAt: Date | null;
	filePath: string;
}

const DEFAULT_PEOPLE_DRAFTS_DIR = path.join(process.cwd(), 'src/blog/people/drafts');
const RAW_PEOPLE_DRAFT_MODULES = import.meta.glob('/src/blog/people/drafts/*.{md,svx,svelte.md}', {
	query: '?raw',
	import: 'default'
}) as Record<string, () => Promise<string>>;

function normalizeDraftKey(value: string | null | undefined): string {
	return path
		.basename(value?.trim() ?? '')
		.replace(/\.(?:svelte\.md|md|svx)$/i, '')
		.toLowerCase();
}

function stripFrontmatter(raw: string): string {
	const frontmatter = /^---\s*[\r\n][\s\S]*?[\r\n]---\s*/.exec(raw);
	return (frontmatter ? raw.slice(frontmatter[0].length) : raw).trim();
}

function isMissingDefaultDraftsDir(rootDir: string, err: unknown): boolean {
	if (path.resolve(rootDir) !== path.resolve(DEFAULT_PEOPLE_DRAFTS_DIR)) return false;
	return typeof err === 'object' && err !== null && 'code' in err && err.code === 'ENOENT';
}

async function loadPeopleDraftVersionFromFs(
	key: string,
	rootDir: string
): Promise<PeopleDraftVersion | null> {
	const entries = await readdir(rootDir, { withFileTypes: true });
	const match = entries
		.filter((entry) => entry.isFile() && /\.(?:svelte\.md|md|svx)$/i.test(entry.name))
		.find((entry) => normalizeDraftKey(entry.name) === key);

	if (!match) return null;

	const filePath = path.join(rootDir, match.name);
	const [raw, stats] = await Promise.all([readFile(filePath, 'utf8'), stat(filePath)]);

	return {
		content: stripFrontmatter(raw),
		modifiedAt: stats.mtime,
		filePath: path.relative(process.cwd(), filePath)
	};
}

async function loadPeopleDraftVersionFromModules(key: string): Promise<PeopleDraftVersion | null> {
	const match = Object.entries(RAW_PEOPLE_DRAFT_MODULES)
		.sort(([a], [b]) => a.localeCompare(b))
		.find(([filePath]) => normalizeDraftKey(filePath) === key);

	if (!match) return null;

	const [filePath, resolver] = match;
	const raw = await resolver();

	return {
		content: stripFrontmatter(raw),
		modifiedAt: null,
		filePath: filePath.replace(/^\//, '')
	};
}

export async function loadPeopleDraftVersion(
	person: string | null | undefined,
	rootDir = DEFAULT_PEOPLE_DRAFTS_DIR
): Promise<PeopleDraftVersion | null> {
	const key = normalizeDraftKey(person);
	if (!key) return null;

	try {
		return await loadPeopleDraftVersionFromFs(key, rootDir);
	} catch (err) {
		if (isMissingDefaultDraftsDir(rootDir, err)) {
			return loadPeopleDraftVersionFromModules(key);
		}

		throw err;
	}
}

// src/lib/server/peopleDraftVersion.spec.ts
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it } from 'vitest';

import { loadPeopleDraftVersion } from './peopleDraftVersion';

let tempDirs: string[] = [];

async function makeTempDraftDir(): Promise<string> {
	const dir = await mkdtemp(join(tmpdir(), 'people-draft-version-'));
	tempDirs.push(dir);
	return dir;
}

afterEach(async () => {
	await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
	tempDirs = [];
});

describe('people draft version loader', () => {
	it('finds mixed-case draft filenames from normalized database slugs', async () => {
		const dir = await makeTempDraftDir();
		await writeFile(
			join(dir, "Charli-D'Amelio.md"),
			`---
title: "Charli D'Amelio"
---

Draft body.
`
		);

		const draft = await loadPeopleDraftVersion("charli-d'amelio", dir);

		expect(draft).toMatchObject({
			content: 'Draft body.'
		});
		expect(draft?.filePath).toContain("Charli-D'Amelio.md");
		expect(draft?.modifiedAt).toBeInstanceOf(Date);
	});

	it('returns null when no matching draft exists', async () => {
		const dir = await makeTempDraftDir();
		await writeFile(join(dir, 'Taylor-Swift.md'), 'Published draft');

		await expect(loadPeopleDraftVersion('missing-person', dir)).resolves.toBeNull();
	});
});

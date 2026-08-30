// src/lib/server/perspectiveReview.spec.ts
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';

import {
	getPerspectivePublishStatus,
	hashReaderVisiblePerspectiveBody
} from '../../../scripts/lib/perspectiveReview.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
	await Promise.all(
		temporaryRoots
			.splice(0)
			.map((temporaryRoot) => fs.rm(temporaryRoot, { recursive: true, force: true }))
	);
});

describe('perspective review publish gate', () => {
	it('ignores grade metadata and comments but stales on editorial frontmatter or body changes', () => {
		const first = `---
title: 'First title'
content_quality:
  overall: 8.7
---

## Visible section

Same reader-visible copy.

<!-- QUALITY GRADE
overall: 8.7
-->
`;
		const metadataOnlyChange = `---
title: 'First title'
content_quality:
  overall: 9.1
---

## Visible section

Same reader-visible copy.

<!-- QUALITY GRADE
overall: 9.1
-->
`;
		const editorialFrontmatterChange = metadataOnlyChange.replace(
			"title: 'First title'",
			"title: 'Changed reader title'"
		);
		const visibleChange = metadataOnlyChange.replace('Same reader-visible copy.', 'Changed copy.');

		expect(hashReaderVisiblePerspectiveBody(first)).toBe(
			hashReaderVisiblePerspectiveBody(metadataOnlyChange)
		);
		expect(hashReaderVisiblePerspectiveBody(first)).not.toBe(
			hashReaderVisiblePerspectiveBody(editorialFrontmatterChange)
		);
		expect(hashReaderVisiblePerspectiveBody(first)).not.toBe(
			hashReaderVisiblePerspectiveBody(visibleChange)
		);
	});

	it('passes only while the latest verified hash matches the draft body', async () => {
		const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'perspective-review-'));
		temporaryRoots.push(temporaryRoot);
		const draftDir = path.join(temporaryRoot, 'src', 'blog', 'people', 'drafts');
		const subjectRoot = path.join(
			temporaryRoot,
			'docs',
			'content-analysis',
			'perspective-reviews',
			'Example-Person'
		);
		const reviewDir = path.join(subjectRoot, '2026-08-04_120000');
		const draftPath = path.join(draftDir, 'Example-Person.md');
		const markdown = `---\ntitle: Example\n---\n\n## Analysis\n\nVisible copy.\n`;

		await fs.mkdir(draftDir, { recursive: true });
		await fs.mkdir(reviewDir, { recursive: true });
		await fs.writeFile(draftPath, markdown);

		const missing = await getPerspectivePublishStatus(draftPath, temporaryRoot);
		expect(missing.valid).toBe(false);
		expect(missing.blocker).toContain('missing_perspective_review');

		const verifiedContentSha256 = hashReaderVisiblePerspectiveBody(markdown);
		await fs.writeFile(
			path.join(reviewDir, 'verification-final.md'),
			`---
artifact: perspective-verification
schema_version: 1
subject: Example-Person
draft_sha256: frozen-hash
final_content_sha256: ${verifiedContentSha256}
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: '2026-08-04T12:00:00.000Z'
---

## Verification verdict

Pass.
`
		);
		await fs.writeFile(
			path.join(subjectRoot, 'latest.json'),
			JSON.stringify({
				schema_version: 1,
				subject: 'Example-Person',
				review_dir: 'docs/content-analysis/perspective-reviews/Example-Person/2026-08-04_120000',
				verification_file:
					'docs/content-analysis/perspective-reviews/Example-Person/2026-08-04_120000/verification-final.md',
				verification_status: 'pass',
				verified_content_sha256: verifiedContentSha256
			})
		);

		const valid = await getPerspectivePublishStatus(draftPath, temporaryRoot);
		expect(valid.valid).toBe(true);
		expect(valid.blocker).toBeNull();

		await fs.writeFile(draftPath, markdown.replace('Visible copy.', 'Reader-visible edit.'));
		const stale = await getPerspectivePublishStatus(draftPath, temporaryRoot);
		expect(stale.valid).toBe(false);
		expect(stale.blocker).toContain('perspective_review_stale');
	});
});

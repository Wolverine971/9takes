import { execFile } from 'child_process';
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { promisify } from 'util';
import { afterEach, describe, expect, it } from 'vitest';

import { hashReaderVisiblePerspectiveBody } from '../../../scripts/lib/perspectiveReview.js';

const execFileAsync = promisify(execFile);
const temporaryRoots: string[] = [];
const gateScript = path.resolve(process.cwd(), 'scripts/perspective-review-gate.mjs');

afterEach(async () => {
	await Promise.all(
		temporaryRoots
			.splice(0)
			.map((temporaryRoot) => fs.rm(temporaryRoot, { recursive: true, force: true }))
	);
});

async function runGate(temporaryRoot: string, ...args: string[]) {
	const nestedWorkingDirectory = path.join(temporaryRoot, 'scripts');
	await fs.mkdir(nestedWorkingDirectory, { recursive: true });
	return execFileAsync(process.execPath, [gateScript, '--repo-root', temporaryRoot, ...args], {
		cwd: nestedWorkingDirectory
	});
}

describe('perspective-review-gate CLI', () => {
	it('validates the full artifact chain from a nested working directory', async () => {
		const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'perspective-gate-'));
		temporaryRoots.push(temporaryRoot);
		const subject = 'Example-Person';
		const draftRelative = `src/blog/people/drafts/${subject}.md`;
		const reviewRelative = `docs/content-analysis/perspective-reviews/${subject}/2026-08-04_120000`;
		const draftPath = path.join(temporaryRoot, draftRelative);
		const reviewDir = path.join(temporaryRoot, reviewRelative);
		const draft = `---\ntitle: Example\n---\n\n## Analysis\n\nVisible copy.\n`;

		await fs.mkdir(path.dirname(draftPath), { recursive: true });
		await fs.writeFile(draftPath, draft);
		await runGate(
			temporaryRoot,
			'--phase',
			'snapshot',
			'--draft',
			draftRelative,
			'--review-dir',
			reviewRelative,
			'--subject',
			subject
		);

		const context = JSON.parse(await fs.readFile(path.join(reviewDir, 'context.json'), 'utf8'));
		await fs.writeFile(
			path.join(reviewDir, 'evidence-packet.md'),
			`---
artifact: perspective-evidence-packet
schema_version: 1
subject: ${subject}
draft_sha256: ${context.draft_sha256}
packet_status: complete
compiled_at: '2026-08-04T12:00:00.000Z'
---

## Identity and scope
Scope.
## Dated timeline
Timeline.
## First-person evidence
Evidence.
## Third-party testimony
Testimony.
## Draft claim inventory
Claims.
## Disputes and unresolved questions
None.
## Source ledger
Sources.
`
		);
		await runGate(temporaryRoot, '--phase', 'packet', '--review-dir', reviewRelative);

		for (const perspective of ['subject', 'fan', 'critic', 'unfamiliar', 'enneagram', 'future']) {
			await fs.writeFile(
				path.join(reviewDir, `${perspective}.md`),
				`---
artifact: perspective-review
schema_version: 1
subject: ${subject}
perspective: ${perspective}
draft_sha256: ${context.draft_sha256}
review_status: complete
trust: intact
value: useful
delight: clear_hit
recommendation: pass
blockers: 0
concerns: 0
reviewed_at: '2026-08-04T12:00:00.000Z'
---

## Bottom-line verdict
Pass.
## What landed
The analysis.
## What missed
None.
## What I expected
Present.
## What surprised me
The connection.
## Red flags
None.
## Specific improvements
None.
## Follow-on questions
None.
## Preserve list
The analysis.
## Research log
Shared packet only.
## Limits of this review
Proxy perspective.
`
			);
		}
		await runGate(temporaryRoot, '--phase', 'reviews', '--review-dir', reviewRelative);

		await fs.writeFile(
			path.join(reviewDir, 'synthesis.md'),
			`---
artifact: perspective-synthesis
schema_version: 1
subject: ${subject}
draft_sha256: ${context.draft_sha256}
synthesis_status: complete
delight_target: fan
p0_open: 0
p1_accepted: 0
research_required: 0
protected_hits: 1
requires_revision: false
synthesized_at: '2026-08-04T12:00:00.000Z'
---

## Executive verdict
Pass.
## P0 — mandatory red-flag repairs
None.
## P1 — accepted high-value improvements
None.
## P2 — optional opportunities
None.
## Research required before deciding
None.
## Conflicts and editorial tradeoffs
None.
## Rejected feedback
None.
## Protected hits
PROTECT-01: analysis.
## Revision brief
Protect PROTECT-01.
`
		);
		await runGate(temporaryRoot, '--phase', 'synthesis', '--review-dir', reviewRelative);
		await fs.writeFile(
			path.join(reviewDir, 'editor-resolution.md'),
			`---
artifact: perspective-editor-resolution
schema_version: 1
subject: ${subject}
draft_sha256: ${context.draft_sha256}
resolution_status: complete
resolved_at: '2026-08-04T12:00:00.000Z'
---

## Resolution log
No edits required.
## Protected hits checked
PROTECT-01 survived.
## Unresolved decisions
None.
`
		);
		await runGate(
			temporaryRoot,
			'--phase',
			'resolution',
			'--review-dir',
			reviewRelative,
			'--resolution-file',
			'editor-resolution.md'
		);

		const finalContentSha256 = hashReaderVisiblePerspectiveBody(draft);
		await fs.writeFile(
			path.join(reviewDir, 'verification-initial.md'),
			`---
artifact: perspective-verification
schema_version: 1
subject: ${subject}
draft_sha256: ${context.draft_sha256}
final_content_sha256: ${finalContentSha256}
verification_status: pass
open_p0: 0
protected_hit_regressions: 0
verified_at: '2026-08-04T12:00:00.000Z'
---

## Verification verdict
Pass.
## P0 resolution check
None.
## Accepted improvements check
None.
## Protected-hit regression check
PROTECT-01 survived.
## Remaining work
None.
`
		);

		await runGate(
			temporaryRoot,
			'--phase',
			'finalize',
			'--draft',
			draftRelative,
			'--review-dir',
			reviewRelative,
			'--verification-file',
			'verification-initial.md'
		);

		const manifest = JSON.parse(
			await fs.readFile(
				path.join(
					temporaryRoot,
					'docs/content-analysis/perspective-reviews/Example-Person/latest.json'
				),
				'utf8'
			)
		);
		expect(manifest).toMatchObject({
			schema_version: 1,
			subject,
			verification_status: 'pass',
			verified_content_sha256: finalContentSha256
		});
	});
});

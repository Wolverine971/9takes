// scripts/carry-over-immutable-assets.spec.mjs
import { describe, expect, it } from 'vitest';
import { planCarryOver } from './carry-over-immutable-assets.mjs';

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_760_000_000_000;

function plan(liveFiles, currentFiles, retentionDays = 10) {
	return planCarryOver({ liveFiles, currentFiles, now: NOW, retentionDays });
}

describe('planCarryOver', () => {
	it('carries forward assets the new build dropped', () => {
		const { toDownload } = plan({ '_app/immutable/nodes/94.OLD.js': NOW - DAY }, [
			'_app/immutable/nodes/94.NEW.js'
		]);

		expect(toDownload.map((entry) => entry.file)).toEqual(['_app/immutable/nodes/94.OLD.js']);
	});

	it('leaves unchanged hashes alone so a deploy only pulls its own diff', () => {
		const shared = '_app/immutable/chunks/shared.KEEP.js';
		const { toDownload } = plan({ [shared]: NOW - DAY }, [shared]);

		expect(toDownload).toEqual([]);
	});

	it('prunes assets older than the retention window', () => {
		const { toDownload, manifest } = plan(
			{
				'_app/immutable/nodes/1.STALE.js': NOW - 11 * DAY,
				'_app/immutable/nodes/2.FRESH.js': NOW - 9 * DAY
			},
			[]
		);

		expect(toDownload.map((entry) => entry.file)).toEqual(['_app/immutable/nodes/2.FRESH.js']);
		expect(manifest['_app/immutable/nodes/1.STALE.js']).toBeUndefined();
	});

	it('keeps the original first-seen date so retention measures age, not rebuilds', () => {
		const file = '_app/immutable/chunks/shared.KEEP.js';
		const { manifest } = plan({ [file]: NOW - 6 * DAY }, [file]);

		expect(manifest[file]).toBe(NOW - 6 * DAY);
	});

	it('dates assets this build introduced as new', () => {
		const { manifest } = plan({}, ['_app/immutable/nodes/3.NEW.js']);

		expect(manifest['_app/immutable/nodes/3.NEW.js']).toBe(NOW);
	});

	it('only carries the file types that break hydration or styling', () => {
		const { toDownload } = plan(
			{
				'_app/immutable/nodes/4.OLD.js': NOW - DAY,
				'_app/immutable/assets/0.OLD.css': NOW - DAY,
				'_app/immutable/assets/hero.OLD.webp': NOW - DAY
			},
			[]
		);

		expect(toDownload.map((entry) => entry.file).sort()).toEqual([
			'_app/immutable/assets/0.OLD.css',
			'_app/immutable/nodes/4.OLD.js'
		]);
	});
});

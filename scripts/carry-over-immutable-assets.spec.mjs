// scripts/carry-over-immutable-assets.spec.mjs
import { describe, expect, it } from 'vitest';
import {
	MAX_CARRIED_FILES,
	normalizeManifestEntry,
	planCarryOver,
	recordCarried
} from './carry-over-immutable-assets.mjs';

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_760_000_000_000;

function plan(liveFiles, currentFiles, retentionDays = 10, extra = {}) {
	return planCarryOver({ liveFiles, currentFiles, now: NOW, retentionDays, ...extra });
}

/** A version-2 entry for an asset the live deploy was only carrying. */
function carriedEntry(firstSeen, lastSeen) {
	return { firstSeen, lastSeen };
}

/** A version-2 entry for an asset the live deploy emitted itself. */
function ownEntry(firstSeen, lastSeen) {
	return { firstSeen, lastSeen, inBuild: true };
}

describe('planCarryOver', () => {
	it('carries forward assets the new build dropped', () => {
		const { toDownload } = plan(
			{ '_app/immutable/nodes/94.OLD.js': ownEntry(NOW - DAY, NOW - DAY) },
			['_app/immutable/nodes/94.NEW.js']
		);

		expect(toDownload.map((entry) => entry.file)).toEqual(['_app/immutable/nodes/94.OLD.js']);
	});

	it('leaves unchanged hashes alone so a deploy only pulls its own diff', () => {
		const shared = '_app/immutable/chunks/shared.KEEP.js';
		const { toDownload } = plan({ [shared]: ownEntry(NOW - DAY, NOW - DAY) }, [shared]);

		expect(toDownload).toEqual([]);
	});

	it('prunes carried assets whose HTML stopped being served before the retention window', () => {
		const { toDownload, manifest, expired } = plan(
			{
				'_app/immutable/nodes/1.STALE.js': carriedEntry(NOW - 40 * DAY, NOW - 11 * DAY),
				'_app/immutable/nodes/2.FRESH.js': carriedEntry(NOW - 40 * DAY, NOW - 9 * DAY)
			},
			[]
		);

		expect(toDownload.map((entry) => entry.file)).toEqual(['_app/immutable/nodes/2.FRESH.js']);
		expect(manifest['_app/immutable/nodes/1.STALE.js']).toBeUndefined();
		expect(expired).toBe(1);
	});

	it('measures retention from when an asset was retired, not when it first shipped', () => {
		// A chunk unchanged for a month is finally re-hashed. The live deploy's
		// HTML still loads it, so it must be carried even though it is "old".
		const longLived = '_app/immutable/chunks/longLived.OLD.js';
		const { toDownload } = plan({ [longLived]: ownEntry(NOW - 30 * DAY, NOW - 2 * DAY) }, [
			'_app/immutable/chunks/longLived.NEW.js'
		]);

		expect(toDownload).toEqual([{ file: longLived, firstSeen: NOW - 30 * DAY, lastSeen: NOW }]);
	});

	it("restarts the clock for the live deploy's own assets even after a long deploy gap", () => {
		// The live deploy was built 14 days ago and served its HTML until now.
		const { toDownload } = plan(
			{ '_app/immutable/nodes/7.LIVE.js': ownEntry(NOW - 14 * DAY, NOW - 14 * DAY) },
			[]
		);

		expect(toDownload.map((entry) => entry.lastSeen)).toEqual([NOW]);
	});

	it('keeps first-seen and stamps this build as last seen for assets it still ships', () => {
		const file = '_app/immutable/chunks/shared.KEEP.js';
		const { manifest } = plan({ [file]: ownEntry(NOW - 6 * DAY, NOW - DAY) }, [file]);

		expect(manifest[file]).toEqual({ firstSeen: NOW - 6 * DAY, lastSeen: NOW, inBuild: true });
	});

	it('dates assets this build introduced as new', () => {
		const { manifest } = plan({}, ['_app/immutable/nodes/3.NEW.js']);

		expect(manifest['_app/immutable/nodes/3.NEW.js']).toEqual({
			firstSeen: NOW,
			lastSeen: NOW,
			inBuild: true
		});
	});

	it('records carried assets without the inBuild flag so their clock keeps running', () => {
		const { manifest, toDownload } = plan(
			{ '_app/immutable/nodes/5.OLD.js': ownEntry(NOW - 3 * DAY, NOW - DAY) },
			[]
		);
		for (const entry of toDownload) recordCarried(manifest, entry);

		expect(manifest['_app/immutable/nodes/5.OLD.js']).toEqual({
			firstSeen: NOW - 3 * DAY,
			lastSeen: NOW
		});
	});

	it('only carries the file types that break hydration or styling', () => {
		const { toDownload } = plan(
			{
				'_app/immutable/nodes/4.OLD.js': ownEntry(NOW - DAY, NOW - DAY),
				'_app/immutable/assets/0.OLD.css': ownEntry(NOW - DAY, NOW - DAY),
				'_app/immutable/assets/hero.OLD.webp': ownEntry(NOW - DAY, NOW - DAY)
			},
			[]
		);

		expect(toDownload.map((entry) => entry.file).sort()).toEqual([
			'_app/immutable/assets/0.OLD.css',
			'_app/immutable/nodes/4.OLD.js'
		]);
	});

	it('spends the cap on the most recently retired assets, whatever their age', () => {
		const { toDownload, skipped } = plan(
			{
				// Re-hashed by the Vite upgrade weeks ago, retired by the live deploy.
				'_app/immutable/chunks/a.VITE8.js': ownEntry(NOW - 20 * DAY, NOW - DAY),
				// Newer file, but its HTML was retired five days ago.
				'_app/immutable/chunks/b.NEWER.js': carriedEntry(NOW - 6 * DAY, NOW - 5 * DAY),
				'_app/immutable/chunks/c.OLDEST.js': carriedEntry(NOW - 9 * DAY, NOW - 8 * DAY)
			},
			[],
			10,
			{ maxFiles: 2 }
		);

		expect(toDownload.map((entry) => entry.file)).toEqual([
			'_app/immutable/chunks/a.VITE8.js',
			'_app/immutable/chunks/b.NEWER.js'
		]);
		expect(skipped).toBe(1);
	});
});

describe('version 1 manifest compatibility', () => {
	it('reads bare first-seen numbers as assets the live deploy emitted', () => {
		expect(normalizeManifestEntry(NOW - 9 * DAY)).toEqual({
			firstSeen: NOW - 9 * DAY,
			lastSeen: NOW - 9 * DAY,
			inBuild: true
		});
	});

	it('ignores entries it cannot date', () => {
		expect(normalizeManifestEntry('soon')).toBeNull();
		expect(normalizeManifestEntry(null)).toBeNull();
		expect(normalizeManifestEntry({})).toBeNull();
		expect(normalizeManifestEntry(Number.NaN)).toBeNull();
		expect(normalizeManifestEntry({ lastSeen: NOW })).toEqual({
			firstSeen: NOW,
			lastSeen: NOW,
			inBuild: false
		});
	});

	it('carries every js/css asset in the live v1 manifest on the transition build', () => {
		// Shape of the 2026-09-28 production manifest: 1,752 entries, most of them
		// first seen in the 2026-09-23 Vite 8 re-hash, all over a week old.
		const liveFiles = {};
		for (let i = 0; i < 1752; i += 1) {
			const firstSeen = NOW - (i < 1115 ? 9 : 4) * DAY;
			liveFiles[`_app/immutable/chunks/legacy-${i}.js`] = firstSeen;
		}

		const { toDownload, skipped, expired } = plan(liveFiles, []);

		expect(toDownload).toHaveLength(1752);
		expect(skipped).toBe(0);
		expect(expired).toBe(0);
		expect(new Set(toDownload.map((entry) => entry.lastSeen))).toEqual(new Set([NOW]));
	});
});

// ---------------------------------------------------------------------------
// Deploy replay. Fixture builds mirror production between 2026-09-19 and
// 2026-09-28 (counts from the live carry-over manifests): a ~1,130-file client
// build, small deploys, the Vite 8 upgrade re-hashing 1,115 files at once, then
// deploys changing 76-340 files each. The 2026-09-28 build under the version 1
// rule dropped chunks the 2026-09-25 HTML loads (geRp63eH.js, Dn2AZiMk.js),
// which turned /personality-analysis/zendaya into an error page.
// ---------------------------------------------------------------------------

const BUILD_SIZE = 1130;
// Shared chunks and layout nodes that nearly every deploy re-hashes. Their
// retired copies are what crowded the Vite 8 batch out of the version 1 cap.
const HOT_SLOTS = 120;

function slotFile(label, slot) {
	return slot % 7 === 0
		? `_app/immutable/assets/${label}-${slot}.css`
		: `_app/immutable/chunks/${label}-${slot}.js`;
}

/**
 * Build file lists: each deploy re-hashes the hot slots first, then a window
 * of cold slots that rotates through the rest of the build.
 */
function buildHistory(changes) {
	const slots = Array.from({ length: BUILD_SIZE }, (_, slot) => slotFile('base', slot));
	const coldSlots = BUILD_SIZE - HOT_SLOTS;
	let cursor = 0;
	return changes.map(({ at, changed, label }) => {
		const hot = Math.min(changed, HOT_SLOTS);
		for (let slot = 0; slot < hot; slot += 1) slots[slot] = slotFile(label, slot);
		const cold = Math.min(changed - hot, coldSlots);
		for (let n = 0; n < cold; n += 1) {
			const slot = HOT_SLOTS + ((cursor + n) % coldSlots);
			slots[slot] = slotFile(label, slot);
		}
		cursor = (cursor + cold) % coldSlots;
		return { at, label, files: [...slots] };
	});
}

/** The version 1 rule (firstSeen retention + order, 600-file cap), for contrast. */
function legacyPlan({ liveFiles, currentFiles, now, retentionDays }) {
	const cutoff = now - retentionDays * DAY;
	const present = new Set(currentFiles);
	const manifest = {};
	for (const file of currentFiles) manifest[file] = liveFiles[file] ?? now;
	const toDownload = Object.entries(liveFiles)
		.filter(([file, firstSeen]) => !present.has(file) && firstSeen >= cutoff)
		.map(([file, firstSeen]) => ({ file, firstSeen }))
		.sort((a, b) => b.firstSeen - a.firstSeen)
		.slice(0, 600);
	return { manifest, toDownload, skipped: 0 };
}

/**
 * Run the deploys in order. A carried download succeeds only when the live
 * deploy actually serves that file, exactly like production.
 */
function replay(builds, { retentionDays = 10, maxFiles, legacy = false } = {}) {
	let liveFiles = {};
	let served = new Set();
	return builds.map((build) => {
		const { manifest, toDownload, skipped } = (legacy ? legacyPlan : planCarryOver)({
			liveFiles,
			currentFiles: build.files,
			now: build.at,
			retentionDays,
			...(maxFiles ? { maxFiles } : {})
		});
		for (const entry of toDownload) {
			if (!served.has(entry.file)) continue;
			if (legacy) manifest[entry.file] = entry.firstSeen;
			else recordCarried(manifest, entry);
		}
		liveFiles = JSON.parse(JSON.stringify(manifest));
		served = new Set(Object.keys(manifest));
		return { ...build, served, carried: toDownload.length, skipped };
	});
}

const at = (iso) => Date.parse(iso);

const PRODUCTION_SEPTEMBER = [
	{ label: 'd0919', at: at('2026-09-19T22:51:00Z'), changed: BUILD_SIZE },
	{ label: 'd0920', at: at('2026-09-20T04:29:00Z'), changed: 86 },
	{ label: 'd0921a', at: at('2026-09-21T03:41:00Z'), changed: 76 },
	{ label: 'd0921b', at: at('2026-09-21T14:32:00Z'), changed: 76 },
	{ label: 'd0922', at: at('2026-09-22T22:59:00Z'), changed: 73 },
	{ label: 'vite8', at: at('2026-09-23T01:11:00Z'), changed: 1115 },
	{ label: 'd0923a', at: at('2026-09-23T02:31:00Z'), changed: 182 },
	{ label: 'd0923b', at: at('2026-09-23T22:24:00Z'), changed: 76 },
	{ label: 'd0924a', at: at('2026-09-24T02:38:00Z'), changed: 340 },
	{ label: 'd0924b', at: at('2026-09-24T21:12:00Z'), changed: 92 },
	{ label: 'd0925', at: at('2026-09-25T04:21:00Z'), changed: 216 },
	{ label: 'd0927', at: at('2026-09-27T00:58:00Z'), changed: 144 },
	{ label: 'd0928', at: at('2026-09-28T21:29:00Z'), changed: 80 }
];

function missingFrom(deploy, files) {
	return files.filter((file) => !deploy.served.has(file));
}

describe('deploy replay: mass re-hash followed by several deploys', () => {
	it('reproduces the production failure under the version 1 rule (fixture guard)', () => {
		const history = replay(buildHistory(PRODUCTION_SEPTEMBER), { legacy: true });
		const html0925 = history.find((deploy) => deploy.label === 'd0925');
		const live0928 = history.find((deploy) => deploy.label === 'd0928');

		expect(missingFrom(live0928, html0925.files).length).toBeGreaterThan(0);
	});

	it('serves every asset the 2026-09-25 HTML loads from the 2026-09-28 deploy', () => {
		const history = replay(buildHistory(PRODUCTION_SEPTEMBER));
		const html0925 = history.find((deploy) => deploy.label === 'd0925');
		const live0928 = history.find((deploy) => deploy.label === 'd0928');

		expect(missingFrom(live0928, html0925.files)).toEqual([]);
	});

	it('serves every superseded deploy whose HTML was retired within the retention window', () => {
		const history = replay(buildHistory(PRODUCTION_SEPTEMBER));

		for (let older = 0; older < history.length - 1; older += 1) {
			// Deploy `older`'s HTML was served until the next deploy went live.
			const retiredAt = history[older + 1].at;
			for (let later = older + 1; later < history.length; later += 1) {
				if (history[later].at - retiredAt > 10 * DAY) continue;
				expect(
					missingFrom(history[later], history[older].files),
					`${history[later].label} must still serve ${history[older].label}'s assets`
				).toEqual([]);
			}
		}
	});

	it('never needs the cap for a full re-hash plus normal churn', () => {
		const history = replay(buildHistory(PRODUCTION_SEPTEMBER));

		for (const deploy of history) {
			expect(deploy.skipped, deploy.label).toBe(0);
			expect(deploy.carried, deploy.label).toBeLessThan(MAX_CARRIED_FILES);
		}
	});

	it('keeps the re-hashed batch even when a cap the size of the old one would bind', () => {
		// The version 1 cap was 600 files. Same history, same cap: the batch the
		// 09-25 HTML depends on was retired most recently, so it now wins the cap.
		const history = replay(buildHistory(PRODUCTION_SEPTEMBER), { maxFiles: 600 });
		const html0925 = history.find((deploy) => deploy.label === 'd0925');
		const live0928 = history.find((deploy) => deploy.label === 'd0928');

		expect(live0928.skipped).toBeGreaterThan(0);
		expect(missingFrom(live0928, html0925.files)).toEqual([]);
	});

	it('prunes a retired build once its HTML has been gone longer than the retention window', () => {
		const builds = buildHistory([
			...PRODUCTION_SEPTEMBER,
			{ label: 'd1003', at: at('2026-10-03T12:00:00Z'), changed: 60 },
			{ label: 'd1010', at: at('2026-10-10T12:00:00Z'), changed: 60 }
		]);
		const history = replay(builds);
		const base = history.find((deploy) => deploy.label === 'd0919');
		const latest = history.at(-1);

		// The pre-Vite-8 build stopped being served on 2026-09-23, 17 days earlier.
		const baseOnly = base.files.filter(
			(file) => !history.at(-2).files.includes(file) && !latest.files.includes(file)
		);
		expect(baseOnly.length).toBeGreaterThan(0);
		expect(baseOnly.filter((file) => latest.served.has(file))).toEqual([]);
		// ...while the 2026-09-28 HTML, retired on 2026-10-03, is still whole.
		const html0928 = history.find((deploy) => deploy.label === 'd0928');
		expect(missingFrom(latest, html0928.files)).toEqual([]);
	});
});

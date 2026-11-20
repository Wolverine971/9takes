// scripts/lib/dailyPeoplePublish.test.mjs
import { test } from 'vitest';
import assert from 'node:assert/strict';
import {
	dailyReleaseState,
	publishingDay,
	rankPublishCandidates,
	validNineTakes,
	pageIncludesQuestion
} from './dailyPeoplePublish.js';

test('public verification accepts an inline question without a gated outbound link', () => {
	assert.equal(
		pageIncludesQuestion(
			'<p class="question">What&#39;s your first reaction?</p>',
			"What's your first reaction?"
		),
		true
	);
	assert.equal(
		pageIncludesQuestion('<p>Something else?</p>', "What's your first reaction?"),
		false
	);
	assert.equal(
		pageIncludesQuestion('<p>Who handles food &amp; drinks?</p>', 'Who handles food & drinks?'),
		true
	);
});

test('quota follows New York calendar days across both DST transitions', () => {
	assert.equal(publishingDay('2026-03-08T04:59:59Z'), '2026-03-07');
	assert.equal(publishingDay('2026-03-08T05:00:00Z'), '2026-03-08');
	assert.equal(publishingDay('2026-11-02T04:59:59Z'), '2026-11-01');
	assert.equal(publishingDay('2026-11-02T05:00:00Z'), '2026-11-02');
});
test('reruns count distinct new releases, including manual publishes, but not republishing', () => {
	const base = {
		content_type: 'people',
		event_type: 'published',
		event_at: '2026-11-17T12:00:00Z'
	};
	const events = [
		{ ...base, content_slug: 'Hunter-Schafer' },
		{ ...base, content_slug: 'hunter-schafer' },
		{ ...base, content_slug: 'old-profile', event_type: 'republished' },
		{ ...base, content_slug: 'yesterday', event_at: '2026-11-17T04:59:59Z' }
	];
	assert.equal(dailyReleaseState(events, '2026-11-17T15:00:00Z').remaining, 1);
	events.push({ ...base, content_slug: 'ludwig-ahgren', source: 'manual' });
	assert.equal(dailyReleaseState(events, '2026-11-17T15:00:00Z').remaining, 0);
});
test('blocked and already-published profiles cannot enter the ranked queue', () => {
	const entry = (person, score, date, blockers = [], dbPublished = false) => ({
		entry: { person, date },
		qualityOverall: score,
		blockers,
		dbPublished
	});
	const result = rankPublishCandidates([
		entry('blocked', 10, '2026-11-17', ['stale_release']),
		entry('live', 9, '2026-11-17', [], true),
		entry('older', 8.5, '2026-11-01'),
		entry('newer', 8.5, '2026-11-07'),
		entry('best', 8.6, '2026-10-29')
	]);
	assert.deepEqual(
		result.map((c) => c.entry.person),
		['best', 'newer', 'older']
	);
});
test('CTA requires nine distinct populated perspectives', () => {
	const row = {
		takes: Array.from({ length: 9 }, (_, i) => ({ type: i + 1, take: 'A real answer.' }))
	};
	assert.equal(validNineTakes(row), true);
	assert.equal(validNineTakes({ takes: row.takes.slice(1) }), false);
	assert.equal(validNineTakes({ takes: row.takes.map((t) => ({ ...t, type: 1 })) }), false);
	assert.equal(validNineTakes({ takes: row.takes.map((t) => ({ ...t, take: '' })) }), false);
});

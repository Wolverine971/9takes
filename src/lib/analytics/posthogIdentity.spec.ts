// src/lib/analytics/posthogIdentity.spec.ts
import { describe, expect, it } from 'vitest';
import { buildIdentityProperties, createIdentityTransitionTracker } from './posthogIdentity';

describe('PostHog identity continuity', () => {
	it('does not reset a browser merely because it loads anonymous routes', () => {
		const tracker = createIdentityTransitionTracker();

		expect(tracker.transition(null)).toEqual({ kind: 'none' });
		expect(tracker.transition(null)).toEqual({ kind: 'none' });
	});

	it('identifies after anonymous activity and resets only on a real logout transition', () => {
		const tracker = createIdentityTransitionTracker();

		expect(tracker.transition(null)).toEqual({ kind: 'none' });
		expect(tracker.transition({ id: 'user-1', admin: false })).toEqual({
			kind: 'identify',
			identity: { id: 'user-1', admin: false }
		});
		expect(tracker.transition(null)).toEqual({ kind: 'reset' });
		expect(tracker.transition(null)).toEqual({ kind: 'none' });
	});

	it('builds only non-PII person properties', () => {
		expect(
			buildIdentityProperties({
				id: 'user-1',
				enneagram: 5,
				admin: false,
				// Runtime callers cannot smuggle an email into the allowlisted result.
				...({ email: 'private@example.com' } as Record<string, unknown>)
			})
		).toEqual({ enneagram_type: 5, admin: false });
	});
});

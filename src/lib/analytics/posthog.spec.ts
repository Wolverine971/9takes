// src/lib/analytics/posthog.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { posthogMock, persistedUserId } = vi.hoisted(() => {
	const persistedUserId = { value: null as unknown };
	return {
		persistedUserId,
		posthogMock: {
			init: vi.fn(),
			identify: vi.fn(),
			reset: vi.fn(),
			capture: vi.fn(),
			has_opted_out_capturing: vi.fn(() => false),
			get_distinct_id: vi.fn(() => '019a0000-0000-7000-8000-000000000001'),
			get_session_id: vi.fn(() => '019a0000-0000-7000-8000-000000000002'),
			get_property: vi.fn(() => persistedUserId.value)
		}
	};
});

vi.mock('$app/environment', () => ({ browser: true, dev: false }));
vi.mock('$env/static/public', () => ({
	PUBLIC_POSTHOG_KEY: 'test-key',
	PUBLIC_POSTHOG_HOST: 'https://example.posthog.test',
	PUBLIC_POSTHOG_ENABLE_IN_DEV: 'false'
}));
vi.mock('posthog-js', () => ({ default: posthogMock }));

async function loadFreshWrapper() {
	vi.resetModules();
	return import('./posthog');
}

describe('PostHog wrapper identity safety', () => {
	beforeEach(() => {
		persistedUserId.value = null;
		vi.clearAllMocks();
		posthogMock.has_opted_out_capturing.mockReturnValue(false);
	});

	it('links server events to the browser identity but honors analytics opt-out', async () => {
		const analytics = await loadFreshWrapper();
		await expect(analytics.getPostHogRequestContext()).resolves.toEqual({
			distinctId: '019a0000-0000-7000-8000-000000000001',
			sessionId: '019a0000-0000-7000-8000-000000000002'
		});
		posthogMock.has_opted_out_capturing.mockReturnValue(true);
		await expect(analytics.getPostHogRequestContext()).resolves.toBeNull();
	});

	it('keeps an ordinary anonymous device journey intact', async () => {
		const analytics = await loadFreshWrapper();
		analytics.setUserIdentity(null);
		await analytics.loadPostHog();

		expect(posthogMock.reset).not.toHaveBeenCalled();
		expect(posthogMock.identify).not.toHaveBeenCalled();
	});

	it('clears a user identity persisted across an anonymous full reload', async () => {
		persistedUserId.value = 'user-a';
		const analytics = await loadFreshWrapper();
		analytics.setUserIdentity(null);
		await analytics.loadPostHog();

		expect(posthogMock.reset).toHaveBeenCalledTimes(1);
		expect(posthogMock.identify).not.toHaveBeenCalled();
	});

	it('resets before identifying a different account on a shared browser', async () => {
		persistedUserId.value = 'user-a';
		const analytics = await loadFreshWrapper();
		analytics.setUserIdentity({ id: 'user-b', enneagram: 5, admin: false });
		await analytics.loadPostHog();

		expect(posthogMock.reset).toHaveBeenCalledTimes(1);
		expect(posthogMock.identify).toHaveBeenCalledWith('user-b', {
			enneagram_type: 5,
			admin: false
		});
		expect(posthogMock.reset.mock.invocationCallOrder[0]).toBeLessThan(
			posthogMock.identify.mock.invocationCallOrder[0]
		);
	});

	it('does not reset when the persisted account already matches', async () => {
		persistedUserId.value = 'user-a';
		const analytics = await loadFreshWrapper();
		analytics.setUserIdentity({ id: 'user-a' });
		await analytics.loadPostHog();

		expect(posthogMock.reset).not.toHaveBeenCalled();
		expect(posthogMock.identify).toHaveBeenCalledWith('user-a', {});
	});
});

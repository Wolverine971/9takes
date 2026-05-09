// src/lib/analytics/posthog.ts
//
// Lightweight PostHog wrapper.
//
// - Dynamic import so posthog-js is not in the initial JS bundle.
// - `loadPostHog()` is invoked from inside the layout's `requestIdleCallback`,
//   so init never blocks first paint or interaction.
// - Skips load entirely when no key is configured, in dev (unless explicitly
//   enabled), or during SSR.
// - Identity calls placed before init are queued and flushed once posthog
//   resolves, so callers don't need to care about load ordering.
import { browser, dev } from '$app/environment';
import {
	PUBLIC_POSTHOG_KEY,
	PUBLIC_POSTHOG_HOST,
	PUBLIC_POSTHOG_ENABLE_IN_DEV
} from '$env/static/public';
import type { PostHog } from 'posthog-js';

const POSTHOG_KEY = PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const ENABLE_IN_DEV = String(PUBLIC_POSTHOG_ENABLE_IN_DEV ?? '').toLowerCase() === 'true';

export type UserIdentity = {
	id: string;
	email?: string | null;
	enneagram?: number | null;
	admin?: boolean;
};

let cached: PostHog | null = null;
let initPromise: Promise<PostHog | null> | null = null;
let pendingIdentity: UserIdentity | null = null;
let pendingReset = false;

export function isPostHogEnabled(): boolean {
	return browser && !!POSTHOG_KEY && (!dev || ENABLE_IN_DEV);
}

export function loadPostHog(): Promise<PostHog | null> {
	if (!isPostHogEnabled()) return Promise.resolve(null);
	if (cached) return Promise.resolve(cached);
	if (initPromise) return initPromise;

	initPromise = import('posthog-js')
		.then(({ default: posthog }) => {
			posthog.init(POSTHOG_KEY, {
				api_host: POSTHOG_HOST,
				defaults: '2026-01-30',
				person_profiles: 'identified_only'
			});
			cached = posthog;

			if (pendingReset) {
				posthog.reset();
				pendingReset = false;
			}
			if (pendingIdentity?.id) {
				applyIdentity(posthog, pendingIdentity);
				pendingIdentity = null;
			}
			return posthog;
		})
		.catch((err) => {
			console.warn('[posthog] failed to load', err);
			initPromise = null;
			return null;
		});

	return initPromise;
}

function applyIdentity(posthog: PostHog, identity: UserIdentity): void {
	const props: Record<string, unknown> = {};
	if (identity.email) props.email = identity.email;
	if (identity.enneagram != null) props.enneagram_type = identity.enneagram;
	if (identity.admin != null) props.admin = identity.admin;
	posthog.identify(identity.id, props);
}

export function setUserIdentity(identity: UserIdentity | null): void {
	if (!isPostHogEnabled()) return;

	if (cached) {
		if (identity?.id) {
			applyIdentity(cached, identity);
		} else {
			cached.reset();
		}
		return;
	}

	if (identity?.id) {
		pendingIdentity = identity;
		pendingReset = false;
	} else {
		pendingIdentity = null;
		pendingReset = true;
	}
}

export async function capture(event: string, props?: Record<string, unknown>): Promise<void> {
	const posthog = cached ?? (await loadPostHog());
	posthog?.capture(event, props);
}

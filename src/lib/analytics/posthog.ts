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
import {
	buildIdentityProperties,
	createIdentityTransitionTracker,
	type UserIdentity
} from '$lib/analytics/posthogIdentity';

export type { UserIdentity } from '$lib/analytics/posthogIdentity';

const POSTHOG_KEY = PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const ENABLE_IN_DEV = String(PUBLIC_POSTHOG_ENABLE_IN_DEV ?? '').toLowerCase() === 'true';

let cached: PostHog | null = null;
let initPromise: Promise<PostHog | null> | null = null;
let pendingIdentity: UserIdentity | null = null;
let pendingReset = false;
const identityTransitions = createIdentityTransitionTracker();

let identityResolutionPending = false;
let identityResolutionPromise: Promise<void> = Promise.resolve();
let resolveIdentityResolution: (() => void) | null = null;

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
	posthog.identify(identity.id, buildIdentityProperties(identity));
}

/** Hold eligible captures while a cacheable public route resolves client auth. */
export function beginUserIdentityResolution(): void {
	if (identityResolutionPending) return;
	identityResolutionPending = true;
	identityResolutionPromise = new Promise<void>((resolve) => {
		resolveIdentityResolution = resolve;
	});
}

function completeUserIdentityResolution(): void {
	if (!identityResolutionPending) return;
	identityResolutionPending = false;
	resolveIdentityResolution?.();
	resolveIdentityResolution = null;
}

export function setUserIdentity(identity: UserIdentity | null): void {
	const transition = identityTransitions.transition(identity);
	completeUserIdentityResolution();
	if (!isPostHogEnabled() || transition.kind === 'none') return;

	if (cached) {
		if (transition.kind === 'identify') {
			applyIdentity(cached, transition.identity);
		} else if (transition.kind === 'reset') {
			cached.reset();
		}
		return;
	}

	if (transition.kind === 'identify') {
		pendingIdentity = transition.identity;
		pendingReset = false;
	} else if (transition.kind === 'reset') {
		pendingIdentity = null;
		pendingReset = true;
	}
}

export async function capture(event: string, props?: Record<string, unknown>): Promise<void> {
	await identityResolutionPromise;
	const posthog = cached ?? (await loadPostHog());
	posthog?.capture(event, props);
}

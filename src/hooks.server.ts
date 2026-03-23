// src/hooks.server.ts
import { dev } from '$app/environment';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '../database.types';
import {
	CONTENT_ACCESS_ANON_COOKIE_MAX_AGE_SECONDS,
	CONTENT_ACCESS_ANON_COOKIE_NAME,
	CONTENT_GUARD_CACHE_CONTROL,
	createAnonymousContentAccessId,
	getContentAccessDecision,
	getContentRequestKind,
	getContentRequester,
	getHardBlockedReason,
	getProtectedContentPath,
	isTrackableContentRequester
} from '$lib/server/contentAccessGuard';
import { recordSharedContentAccessEvent } from '$lib/server/contentAccessStore';

import type { Handle } from '@sveltejs/kit';

// import * as amp from '@sveltejs/amp';
// import dropcss from 'dropcss';

// import schedule from 'node-schedule';
// import { tagQuestions } from './utils/server/openai';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				get: (key) => event.cookies.get(key),
				set: (key, value, options) => {
					event.cookies.set(key, value, { ...options, path: '/' });
				},
				remove: (key, options) => {
					event.cookies.delete(key, { ...options, path: '/' });
				}
			}
		}
	) as unknown as App.Locals['supabase'];

	const userAgent = event.request.headers.get('user-agent');
	const protectedContentPath = getProtectedContentPath(event.url.pathname);
	const clientIp = getClientIp(event);
	const anonCookieValue = event.cookies.get(CONTENT_ACCESS_ANON_COOKIE_NAME) ?? null;
	const pendingAnonCookieValue =
		!dev && protectedContentPath && !anonCookieValue ? createAnonymousContentAccessId() : null;

	const hardBlockedReason = dev
		? null
		: getHardBlockedReason({
				method: event.request.method,
				pathname: event.url.pathname,
				userAgent
			});

	if (hardBlockedReason) {
		console.warn('Blocked content scraper request', {
			reason: hardBlockedReason,
			path: protectedContentPath ?? event.url.pathname,
			clientIp,
			userAgent
		});

		return createContentGuardResponse({
			event,
			status: 403,
			message: 'Content access denied.',
			cacheControl: CONTENT_GUARD_CACHE_CONTROL
		});
	}

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	const { session } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = session?.user ?? null;

	const requester =
		dev || !protectedContentPath
			? null
			: getContentRequester({
					method: event.request.method,
					pathname: event.url.pathname,
					userAgent,
					isAuthenticated: !!session?.user,
					anonymousId: anonCookieValue ?? pendingAnonCookieValue
				});

	let shouldSetAnonCookie = false;

	if (requester?.kind === 'anonymous_human' && pendingAnonCookieValue) {
		shouldSetAnonCookie = true;
	}

	if (protectedContentPath && isTrackableContentRequester(requester)) {
		const counters = await recordSharedContentAccessEvent({
			requester,
			path: protectedContentPath,
			requestKind: getContentRequestKind(event.url.pathname)
		});

		if (counters) {
			const rateLimitDecision = getContentAccessDecision(requester, counters);

			if (rateLimitDecision.action === 'throttle') {
				console.warn('Throttled article crawl', {
					requester: requester.name,
					reason: rateLimitDecision.reason,
					path: protectedContentPath,
					clientIp,
					userAgent,
					counters
				});

				return createContentGuardResponse({
					event,
					status: 429,
					message:
						requester.kind === 'allowed_ai_crawler'
							? 'Crawler article budget exceeded for now.'
							: 'Too many article requests from this browser session. Slow down and try again later.',
					cacheControl: CONTENT_GUARD_CACHE_CONTROL,
					retryAfterSeconds: rateLimitDecision.retryAfterSeconds,
					anonCookieValue: shouldSetAnonCookie ? pendingAnonCookieValue : null
				});
			}
		}
	}

	// const job = schedule.scheduleJob('*/1 * * * *', async function () {
	// 	await tagQuestions();
	// });

	const response = await resolve(event);

	if (protectedContentPath) {
		response.headers.set('Cache-Control', CONTENT_GUARD_CACHE_CONTROL);
	}

	if (shouldSetAnonCookie && pendingAnonCookieValue) {
		response.headers.append(
			'set-cookie',
			event.cookies.serialize(
				CONTENT_ACCESS_ANON_COOKIE_NAME,
				pendingAnonCookieValue,
				getAnonCookieOptions()
			)
		);
	}

	return response;
	// let buffer = '';

	// return await resolve(event, {
	// 	transformPageChunk: ({ html, done }) => {
	// 		buffer += html;

	// 		if (done) {
	// 			let css = '';
	// 			const markup = amp
	// 				.transform(buffer)
	// 				.replace('⚡', 'amp') // dropcss can't handle this character
	// 				.replace(/<style amp-custom([^>]*?)>([^]+?)<\/style>/, (match, attributes, contents) => {
	// 					css = contents;
	// 					return `<style amp-custom${attributes}></style>`;
	// 				});

	// 			css = dropcss({ css, html: markup }).css;
	// 			return markup.replace('</style>', `${css}</style>`);
	// 		}
	// 	}
	// });
};

function getClientIp(event: Parameters<Handle>[0]['event']): string {
	const forwardedFor =
		event.request.headers.get('x-forwarded-for') ??
		event.request.headers.get('x-real-ip') ??
		event.request.headers.get('cf-connecting-ip');

	if (forwardedFor) {
		return forwardedFor.split(',')[0]?.trim() || 'unknown';
	}

	try {
		return event.getClientAddress();
	} catch {
		return 'unknown';
	}
}

function createContentGuardResponse({
	event,
	status,
	message,
	cacheControl,
	retryAfterSeconds,
	anonCookieValue = null
}: {
	event: Parameters<Handle>[0]['event'];
	status: 403 | 429;
	message: string;
	cacheControl: string;
	retryAfterSeconds?: number;
	anonCookieValue?: string | null;
}): Response {
	const headers = new Headers({
		'Cache-Control': cacheControl,
		'Content-Type': 'text/plain; charset=utf-8'
	});

	if (retryAfterSeconds) {
		headers.set('Retry-After', String(retryAfterSeconds));
	}

	if (anonCookieValue) {
		headers.append(
			'set-cookie',
			event.cookies.serialize(
				CONTENT_ACCESS_ANON_COOKIE_NAME,
				anonCookieValue,
				getAnonCookieOptions()
			)
		);
	}

	return new Response(message, { status, headers });
}

function getAnonCookieOptions() {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		maxAge: CONTENT_ACCESS_ANON_COOKIE_MAX_AGE_SECONDS
	};
}

// src/lib/server/authCallback.ts
import type { RequestEvent } from '@sveltejs/kit';
import type { EmailOtpType } from '@supabase/supabase-js';
import { logger } from '$lib/utils/logger';

export type AuthRedirectResult = {
	/** True when an auth code / token in the URL was successfully exchanged for a session. */
	exchanged: boolean;
	/** True when a code / token was present in the URL but could not be exchanged. */
	failed: boolean;
};

const VERIFIABLE_OTP_TYPES: ReadonlySet<EmailOtpType> = new Set([
	'signup',
	'invite',
	'magiclink',
	'recovery',
	'email_change',
	'email'
]);

/**
 * Complete a Supabase auth redirect that lands with credentials in the query
 * string. Supabase email links (password recovery, signup confirmation) come
 * back either as a PKCE `?code=` or, when the email template uses
 * `{{ .TokenHash }}`, as `?token_hash=&type=`. Both must be exchanged for a
 * session before any session-dependent action (e.g. `updateUser`) can run.
 *
 * Returns immediately when neither param is present, so it is safe to call from
 * the `load` of any page an email link might redirect to.
 *
 * Note: the implicit flow (`#access_token` hash fragment) cannot be handled
 * server-side — fragments are never sent to the server. This project uses the
 * @supabase/ssr default PKCE flow, so links arrive as query params.
 */
export async function establishSessionFromAuthRedirect(
	event: RequestEvent
): Promise<AuthRedirectResult> {
	const code = event.url.searchParams.get('code');
	const tokenHash = event.url.searchParams.get('token_hash');
	const rawType = event.url.searchParams.get('type');

	if (code) {
		const { error } = await event.locals.supabase.auth.exchangeCodeForSession(code);
		if (error) {
			// A consumed / expired code is expected on a re-run after the session
			// already exists, so log at warn rather than error.
			logger.warn('Failed to exchange auth code for session', { message: error.message });
			return { exchanged: false, failed: true };
		}
		return { exchanged: true, failed: false };
	}

	if (tokenHash && rawType && VERIFIABLE_OTP_TYPES.has(rawType as EmailOtpType)) {
		const { error } = await event.locals.supabase.auth.verifyOtp({
			token_hash: tokenHash,
			type: rawType as EmailOtpType
		});
		if (error) {
			logger.warn('Failed to verify auth OTP token', { message: error.message, type: rawType });
			return { exchanged: false, failed: true };
		}
		return { exchanged: true, failed: false };
	}

	return { exchanged: false, failed: false };
}

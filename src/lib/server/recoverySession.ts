// src/lib/server/recoverySession.ts
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** How long after an emailed link is opened its session may set a password without the old one. */
export const RECOVERY_SESSION_MAX_AGE_SECONDS = 60 * 60;

// Sign-in methods Supabase records when a link sent to the account's inbox is
// opened: `recovery` for PKCE reset links, `otp` / `magiclink` for token links.
const EMAIL_LINK_METHODS = new Set(['recovery', 'otp', 'magiclink']);
const CLOCK_SKEW_SECONDS = 60;

/** True when the token's sign-in history shows an emailed link opened within the window. */
export function hasRecentEmailLinkSignIn(
	amr: unknown,
	nowSeconds: number = Math.floor(Date.now() / 1000)
): boolean {
	if (!Array.isArray(amr)) return false;

	return amr.some((entry) => {
		if (!entry || typeof entry !== 'object') return false;
		const { method, timestamp } = entry as { method?: unknown; timestamp?: unknown };
		if (typeof method !== 'string' || !EMAIL_LINK_METHODS.has(method)) return false;
		if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) return false;

		const ageSeconds = nowSeconds - timestamp;
		return ageSeconds >= -CLOCK_SKEW_SECONDS && ageSeconds <= RECOVERY_SESSION_MAX_AGE_SECONDS;
	});
}

/**
 * Whether the current session was just established from an emailed reset link.
 * Reads the verified token claims, so the answer cannot come from the browser.
 */
export async function isRecoverySession(
	auth: Pick<SupabaseClient['auth'], 'getClaims'>
): Promise<boolean> {
	try {
		const { data, error } = await auth.getClaims();
		if (error || !data?.claims) return false;
		return hasRecentEmailLinkSignIn(data.claims.amr);
	} catch {
		return false;
	}
}

/**
 * Check a signed-in user's current password without touching their session.
 * Uses a throwaway client that stores nothing, then ends the session it opened.
 */
export async function verifyCurrentPassword({
	userId,
	email,
	password
}: {
	userId: string;
	email: string;
	password: string;
}): Promise<boolean> {
	const client = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
		auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
	});

	try {
		const { data, error } = await client.auth.signInWithPassword({ email, password });
		if (error || !data.user) return false;

		const matches = data.user.id === userId;
		await client.auth.signOut({ scope: 'local' }).catch(() => undefined);
		return matches;
	} catch {
		return false;
	}
}

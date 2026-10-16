import type { SupabaseClient } from '@supabase/supabase-js';
import type { VerifiedAuth, VerifiedUser } from '$lib/types/auth';

/** Ordinary reads can use a signed token; writes and sensitive routes need a fresh user. */
export function requiresFreshUser(method: string, route: string): boolean {
	return (
		!['GET', 'HEAD'].includes(method.toUpperCase()) ||
		/^\/(?:admin|account|login|register|resetPassword|forgotPassword|logout|auth)(?:\/|$)/.test(
			route
		) ||
		/^\/api\/(?:admin|blog-versions|update-questions)(?:\/|$)/.test(route)
	);
}

/**
 * getClaims verifies the signature/expiry and refreshes expiring tokens through
 * the SSR cookie adapter. With asymmetric signing keys it uses cached public
 * keys; legacy HS256 sessions fall back to Auth until their next token refresh.
 * Never build identity or permissions from getSession().user or user_metadata.
 */
export async function getVerifiedSession(
	auth: Pick<SupabaseClient['auth'], 'getClaims' | 'getUser'>,
	freshUser: boolean
): Promise<VerifiedAuth> {
	let user: VerifiedUser;
	if (freshUser) {
		const { data, error } = await auth.getUser();
		if (error || !data.user) return { session: null, user: null };
		user = { id: data.user.id, aud: data.user.aud, email: data.user.email };
	} else {
		const { data, error } = await auth.getClaims();
		if (error || !data?.claims) return { session: null, user: null };
		const { sub, aud, email, role } = data.claims;
		const authenticatedAudience =
			aud === 'authenticated' || (Array.isArray(aud) && aud.includes('authenticated'));
		if (typeof sub !== 'string' || !sub || !authenticatedAudience || role !== 'authenticated') {
			return { session: null, user: null };
		}
		user = {
			id: sub,
			aud: 'authenticated',
			...(typeof email === 'string' ? { email } : {})
		};
	}

	return { session: { user }, user };
}

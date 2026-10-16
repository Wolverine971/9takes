import type { User } from '@supabase/supabase-js';

/** Identity verified by Supabase, not the untrusted user object in a session cookie. */
export type VerifiedUser = Pick<User, 'id' | 'aud' | 'email'>;

export interface VerifiedSession {
	user: VerifiedUser;
}

export interface VerifiedAuth {
	session: VerifiedSession | null;
	user: VerifiedUser | null;
}

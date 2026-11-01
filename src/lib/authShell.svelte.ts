// src/lib/authShell.svelte.ts
// The signed-in user as the app shell (header, nav, signup prompts) knows it. The root layout creates
// it; anything below reads it with getAuthShell(). Only `id` and `admin` are kept so cached pages
// never carry private profile fields.
import { createContext } from 'svelte';

export type AuthShellUser = {
	id: string;
	admin: boolean;
};

export function normalizeAuthShellUser(user: unknown): AuthShellUser | null {
	if (!user || typeof user !== 'object' || !('id' in user) || typeof user.id !== 'string') {
		return null;
	}

	return {
		id: user.id,
		admin: 'admin' in user && user.admin === true
	};
}

export class AuthShell {
	/** null = anonymous, or not resolved yet on client-auth pages. */
	user = $state<AuthShellUser | null>(null);

	constructor(initialUser: unknown = null) {
		this.user = normalizeAuthShellUser(initialUser);
	}

	/** Accepts any user-shaped payload and keeps only the shell fields. */
	set(user: unknown) {
		this.user = normalizeAuthShellUser(user);
	}
}

export type AuthShellReader = { readonly user: AuthShellUser | null };

const [getContextAuthShell, setContextAuthShell, hasContextAuthShell] = createContext<AuthShell>();

// Components rendered outside the root layout (isolated specs, mount() islands) see an anonymous user.
const anonymousAuthShell: AuthShellReader = Object.freeze({ user: null });

/** Root layout only: creates the shell user and provides it to the component tree. */
export function createAuthShell(initialUser: unknown): AuthShell {
	return setContextAuthShell(new AuthShell(initialUser));
}

export function getAuthShell(): AuthShellReader {
	return hasContextAuthShell() ? getContextAuthShell() : anonymousAuthShell;
}

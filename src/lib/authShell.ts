// src/lib/authShell.ts
import { getContext, setContext } from 'svelte';
import { readable, writable, type Readable, type Writable } from 'svelte/store';

export type AuthShellUser = {
	id: string;
	admin: boolean;
};

const AUTH_SHELL_CONTEXT = '9takes:auth-shell-user';
const anonymousAuthShell = readable<AuthShellUser | null>(null);

export function normalizeAuthShellUser(user: unknown): AuthShellUser | null {
	if (!user || typeof user !== 'object' || !('id' in user) || typeof user.id !== 'string') {
		return null;
	}

	return {
		id: user.id,
		admin: 'admin' in user && user.admin === true
	};
}

export function createAuthShellUser(initialUser: unknown): Writable<AuthShellUser | null> {
	const store = writable(normalizeAuthShellUser(initialUser));
	setContext(AUTH_SHELL_CONTEXT, store);
	return store;
}

export function getAuthShellUser(): Readable<AuthShellUser | null> {
	return (
		getContext<Readable<AuthShellUser | null> | undefined>(AUTH_SHELL_CONTEXT) ?? anonymousAuthShell
	);
}

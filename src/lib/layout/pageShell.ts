// src/lib/layout/pageShell.ts

export const OWNED_PAGE_SHELL = 'owned' as const;
export const CONTAINED_PAGE_SHELL = 'contained' as const;

export type PageShell = typeof OWNED_PAGE_SHELL | typeof CONTAINED_PAGE_SHELL;

export function withOwnedPageShell<T extends object>(data: T): T & { pageShell: 'owned' } {
	return { ...data, pageShell: OWNED_PAGE_SHELL };
}

export function resolvePageShell(data?: { pageShell?: PageShell } | null): PageShell {
	return data?.pageShell === OWNED_PAGE_SHELL ? OWNED_PAGE_SHELL : CONTAINED_PAGE_SHELL;
}

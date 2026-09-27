// src/routes/design-preview/homepage-live-take/+page.ts
import type { PageLoad } from './$types';
import { withOwnedPageShell } from '$lib/layout/pageShell';

export const load: PageLoad = ({ data }) => ({
	...data,
	...withOwnedPageShell({ pageChrome: 'owned' as const })
});

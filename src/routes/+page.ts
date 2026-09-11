// src/routes/+page.ts
import type { PageLoad } from './$types';
import { withOwnedPageShell } from '$lib/layout/pageShell';

export const load: PageLoad = () => withOwnedPageShell({ pageChrome: 'header' as const });

// src/routes/old-home/+page.ts
// it so that it gets served as a static asset in production
// export const prerender = true;

import type { PageLoad } from './$types';
import { withOwnedPageShell } from '$lib/layout/pageShell';

export const load: PageLoad = ({ data }) => withOwnedPageShell(data);

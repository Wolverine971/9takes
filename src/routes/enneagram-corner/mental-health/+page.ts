// src/routes/enneagram-corner/mental-health/+page.ts
import type { PageLoad } from './$types';
import { withOwnedPageShell } from '$lib/layout/pageShell';

export const load: PageLoad = ({ data }) => withOwnedPageShell(data);

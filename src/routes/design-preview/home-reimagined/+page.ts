// src/routes/design-preview/home-reimagined/+page.ts
import type { PageLoad } from './$types';
import { withOwnedPageShell } from '$lib/layout/pageShell';

export const load: PageLoad = ({ data }) => withOwnedPageShell(data ?? {});

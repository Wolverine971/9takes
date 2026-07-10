// src/routes/personality-analysis/+layout.ts
import type { LayoutLoad } from './$types';
import { withOwnedPageShell } from '$lib/layout/pageShell';

export const load: LayoutLoad = ({ data }) => withOwnedPageShell(data ?? {});

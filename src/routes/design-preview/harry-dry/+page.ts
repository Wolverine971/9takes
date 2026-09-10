// src/routes/design-preview/harry-dry/+page.ts
import { withOwnedPageShell } from '$lib/layout/pageShell';

export const load = () => withOwnedPageShell({ pageChrome: 'owned' as const });

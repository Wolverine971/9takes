// src/routes/+layout.ts
import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

// Vercel's same-origin endpoint attributes visits to the deployed 9takes project.
// The SvelteKit integration tracks both the initial page and client-side navigation.
if (!dev) {
	injectAnalytics({ mode: 'production' });
}

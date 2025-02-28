// +page.server.ts (or the file containing your PageServerLoad)

import { dev } from '$app/environment';

import type { PageServerLoad } from './$types';

// Example: 5 minutes in production
const MAX_AGE = 60 * 5;

export const load: PageServerLoad = async ({ setHeaders }) => {
    // 1. Set HTTP Cache-Control headers. In production, allow a 5-minute cache
    if (!dev) {
        setHeaders({
            'Cache-Control': `public, max-age=${MAX_AGE}`
            // optional: you could also add `s-maxage` or `stale-while-revalidate`
            // 'Cache-Control': `public, s-maxage=${MAX_AGE}, stale-while-revalidate=300`
        });
    } else {
        // In dev mode, disable caching so changes appear instantly
        setHeaders({
            'Cache-Control': 'no-store'
        });
    }

    // 2. Then proceed with your existing load logic:

};

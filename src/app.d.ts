// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Session } from '@supabase/supabase-js';

interface TakesUser extends User {
	first_name: string;
	last_name: string;
	email: string;
	id: number;
	username?: string;

	external_id?: string;
	canAskQuestion?: boolean;
	created_at?: string;
	avatar_url?: string;

	admin?: boolean;
	website?: string;
	enneagram?: string;
}
interface SbSession extends Session {
	user?: TakesUser;
}

declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			sb: TypedSupabaseClient;
			session: SbSession | Session | null;
		}
		interface PageData {
			session: SbSession | null;
			flags?: string[];
		}

		// interface Platform {}
		interface MdsvexFile {
			default: import('svelte/internal').SvelteComponent;
			metadata: Record<string, string> | BlogPost;
		}

		type MdsvexResolver = () => Promise<MdsvexFile>;

		interface BlogPost {
			slug: string;
			title: string;
			meta_title?: string;
			author: string;
			description: string;
			date: string;
			loc: string;
			lastmod: string;
			changefreq: string;
			priority: string;
			published: boolean;
			enneagram?: number;
			type?: string[];
			suggestions?: string[];
			person?: string;
			wikipedia?: string;
			twitter?: string;
			instagram?: string;
			tiktok?: string;
			blog?: boolean;
			jsonld: string;
			pic?: string;
		}
	}
}

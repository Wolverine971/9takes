// src/app.d.ts
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '../database.types';

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

// Google reCAPTCHA global
interface Window {
	grecaptcha: {
		reset: (widgetId?: number) => void;
		getResponse: (widgetId?: number) => string;
		execute: (widgetId?: number) => void;
		render: (container: string | HTMLElement, parameters: object) => number;
	};
}

declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: SbSession | null;
			flags?: string[];
		}

		// interface Platform {}
		interface MdsvexFile {
			default: import('svelte').Component;
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
			jsonld_snippet?: any;
			pic?: string;
		}
	}
}

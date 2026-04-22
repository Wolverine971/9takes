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
	first_name?: string;
	last_name?: string;
	email?: string;
	id: string;
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
	interface MediumEditorInstance {
		subscribe: (event: string, callback: () => void) => void;
		serialize: () => Record<string, { value: string }>;
		destroy?: () => void;
	}

	var MediumEditor:
		| (new (
				elements: Element | Element[] | NodeListOf<Element>,
				options?: Record<string, unknown>
		  ) => MediumEditorInstance)
		| undefined;

	interface Window {
		grecaptcha?: {
			reset: (widgetId?: number) => void;
			getResponse: (widgetId?: number) => string;
			execute: (widgetId?: number) => void;
			render: (container: string | HTMLElement, parameters: object) => number;
		};
		mapboxgl?: {
			accessToken: string;
			Map: new (options: Record<string, unknown>) => unknown;
		};
		MapboxGeocoder?: new (options: Record<string, unknown>) => {
			addTo: (selector: string) => void;
			setInput: (value: string) => void;
			on: (handler: string, callback: (ev: unknown) => void) => void;
			off: (handler: string, callback: (ev: unknown) => void) => void;
			remove?: () => void;
		};
		gtag: (...args: unknown[]) => void;
		dataLayer?: unknown[];
	}

	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'custom-element'?: string;
			'on:ready'?: (event: CustomEvent<unknown>) => void;
			'on:recentre'?: (event: CustomEvent<unknown>) => void;
			'on:zoomstart'?: (event: CustomEvent<unknown>) => void;
			'on:zoom'?: (event: CustomEvent<unknown>) => void;
			'on:zoomend'?: (event: CustomEvent<unknown>) => void;
			'on:results'?: (event: CustomEvent<unknown>) => void;
			'on:result'?: (event: CustomEvent<unknown>) => void;
			'on:loading'?: (event: CustomEvent<unknown>) => void;
			'on:clear'?: (event: CustomEvent<unknown>) => void;
			'on:geolocate'?: (event: CustomEvent<unknown>) => void;
			'on:outofmaxbounds'?: (event: CustomEvent<unknown>) => void;
			'on:trackuserlocationend'?: (event: CustomEvent<unknown>) => void;
			'on:trackuserlocationstart'?: (event: CustomEvent<unknown>) => void;
			'on:popupClicked'?: (event: CustomEvent<unknown>) => void;
		}
	}

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
			metadata: BlogPost;
		}

		type MdsvexResolver = () => Promise<MdsvexFile>;

		interface TocHeading {
			level: number;
			text: string;
			id: string;
		}

		interface BlogPostFaq {
			question: string;
			answer: string;
			anchor?: string;
		}

		interface BlogPost {
			id?: number;
			slug: string;
			title: string;
			meta_title?: string;
			persona_title?: string;
			author: string;
			description: string;
			date: string;
			loc: string;
			lastmod: string;
			changefreq: string;
			priority: string;
			published: boolean;
			enneagram?: string | number;
			type?: string[] | string;
			stage?: number;
			stageName?: string;
			tags?: string[];
			suggestions?: string[];
			person?: string;
			wikipedia?: string;
			twitter?: string;
			instagram?: string;
			tiktok?: string;

			// Phase 1 structured-data fields (see docs/planning/people-jsonld-unification-2026-04-19.md)
			keywords?: string[];
			same_as?: string[];
			faqs?: BlogPostFaq[] | null;
			wikidata_qid?: string;
			imdb_id?: string;
			birth_date?: string;
			birth_place?: string;
			nationality?: string;
			occupation?: string[];
			knows_about?: string[];
			citations?: string[];

			// Computed at page load, not persisted.
			word_count?: number;
			time_required?: string;

			blog?: boolean;
			jsonld?: string | null;
			jsonld_snippet?: unknown;
			howToSteps?: Array<{ name?: string; text?: string } | string>;
			totalTime?: string;
			pic?: string;
			picGroup?: Array<{ image: string; text: string; enneagramType?: number; subtext?: string }>;
			headings?: TocHeading[];
		}
	}
}

declare module 'opentype.js';

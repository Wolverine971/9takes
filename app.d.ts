// app.d.ts
// https://supabase.com/blog/supabase-auth-helpers-with-sveltekit-support
declare namespace App {
	interface Supabase {
		Database: import('./src/schema').Database;
		SchemaName: 'public';
	}

	// interface Locals {}
	interface PageData {
		session: import('@supabase/supabase-js').Session | null;
	}
	// interface Error {}
	// interface Platform {}

	interface MdsvexFile {
		default: import('svelte').Component;
		metadata: Record<string, string>;
	}

	type MdsvexResolver = () => Promise<MdsvexFile>;

	interface BlogPost {
		slug: string;
		title: string;
		author: string;
		description: string;
		date: string;
		loc: string;
		lastmod: string;
		changefreq: string;
		priority: string;
		published: boolean;
		type?: string[];
		blog?: boolean;
		previewHtml?: string;
		pic?: string;
		path?: string;
		rssDate?: string;
		rssUpdateDate?: string;
	}
}

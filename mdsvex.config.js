// import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import path from 'path';
import { join } from 'path';
import rehypeSlug from 'rehype-slug';
import remarkAbbr from 'remark-abbr';
import remarkGithub from 'remark-github';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const path_to_layout = join(__dirname, './src/lib/components/blog/layout.svelte');

const config = defineConfig({
	layout: path_to_layout,
	// C:\Users\djway\Desktop\svelte\9takes\src\routes\+layout.svelte
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},

	remarkPlugins: [
		[
			(remarkGithub,
			{
				// TODO: Replace with your own repository
				repository: 'https://github.com/mvasigh/sveltekit-mdsvex-blog.git'
			})
		],
		remarkAbbr
	],
	rehypePlugins: [
		rehypeSlug
		// [
		// 	rehypeAutolinkHeadings,
		// 	{
		// 		behavior: 'wrap'
		// 	}
		// ]
	]
});

export default config;

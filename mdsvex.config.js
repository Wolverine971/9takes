import remarkGithub from 'remark-github';
import remarkAbbr from 'remark-abbr';
import rehypeSlug from 'rehype-slug';
// import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import { defineMDSveXConfig as defineConfig } from 'mdsvex';

import path from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';
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
		remarkAbbr,
		rehypeExternalLinks({
			content: {
				type: 'element',
				tagName: 'svg',
				properties: {
					className: ['w-4', 'h-4', 'ml-1', '-mt-1', 'stroke-2'],
					style: [
						'stroke-linecap: round;',
						'stroke-linejoin: round; width: 1rem; display: block; margin: auto;'
					],
					fill: 'none',
					viewBox: '0 0 24 24',
					stroke: 'currentColor'
				},
				children: [
					{
						type: 'element',
						tagName: 'path',
						properties: {
							d: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
						}
					}
				]
			},
			contentProperties: {
				className: ['inline-block', 'align-middle', 'text-gray-600', 'dark:text-gray-400']
			}
		})
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

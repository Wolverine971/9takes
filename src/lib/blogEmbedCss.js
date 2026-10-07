// src/lib/blogEmbedCss.js

// Components that blog posts embed compile with `css: 'injected'`, like the posts
// themselves (svelte.config.js). A post page links the stylesheet of every module its lazy
// import.meta.glob can reach, so each of these, while linked, cost every post a
// render-blocking request whether or not that post rendered it (15 sheets on
// /enneagram-corner/*). Injected, SSR inlines only the styles a page actually renders.
//
// Entries ending in '/' cover a whole directory. blogEmbedCss.spec.ts fails when a post
// embeds a styled component that is neither listed here nor already linked by the post
// page itself.
export const BLOG_EMBED_CSS_PATHS = [
	'src/lib/components/blog/callouts/',
	'src/lib/components/blog/stress/',
	'src/lib/components/blog/blackpill/',
	'src/lib/components/blog/compatibility/',
	'src/lib/components/blog/BehaviorDecoder.svelte',
	'src/lib/components/blog/HornevianMatrix.svelte',
	'src/lib/components/blog/PodcasterPersonalityMapTable.svelte',
	'src/lib/components/blog/StrategicQuestion.svelte',
	'src/lib/components/atoms/DateTip.svelte',
	'src/lib/components/atoms/MarqueeHorizontal.svelte',
	'src/lib/components/icons/rubix.svelte',
	'src/lib/components/molecules/FamousTypes.svelte',
	'src/lib/components/molecules/VoiceRecorder.svelte'
];

/** @param {string | undefined} filename */
export const isBlogEmbedComponent = (filename) => {
	if (!filename?.endsWith('.svelte')) return false;
	const file = '/' + filename.replaceAll('\\', '/');
	return BLOG_EMBED_CSS_PATHS.some((entry) =>
		entry.endsWith('/') ? file.includes('/' + entry) : file.endsWith('/' + entry)
	);
};

// vitest.setup.ts
// jsdom ships no window.matchMedia, but svelte/motion's `prefersReducedMotion`
// calls it the moment the module is imported — so any component that respects
// reduced motion would crash its spec. Default every query to "no match"; specs
// that need a specific answer still stub it with vi.stubGlobal('matchMedia', …).
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener() {},
			removeListener() {},
			addEventListener() {},
			removeEventListener() {},
			dispatchEvent: () => false
		}) as MediaQueryList;
}

// jsdom also ships no Web Animations API. Svelte's `animate:` directive (e.g.
// animate:flip on the take list) reads element.getAnimations() when keyed
// items move; report "no running animations" so reorder specs can run.
if (typeof Element !== 'undefined' && typeof Element.prototype.getAnimations !== 'function') {
	Element.prototype.getAnimations = () => [];
}

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

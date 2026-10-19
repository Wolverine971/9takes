// src/lib/analytics/qualifiedVisibility.ts
/** Count a real view once: half the element (or viewport) visible for 750ms. */
export function qualifiedVisibility(node: HTMLElement, onVisible: () => void) {
	if (typeof IntersectionObserver === 'undefined') return;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let reported = false;
	const clear = () => {
		clearTimeout(timer);
		timer = undefined;
	};
	const observer = new IntersectionObserver(
		([entry]) => {
			const visible =
				entry?.isIntersecting &&
				(entry.intersectionRatio >= 0.5 ||
					entry.intersectionRect.height >= window.innerHeight * 0.5);
			if (!visible) return clear();
			if (timer || reported) return;
			timer = setTimeout(() => {
				reported = true;
				observer.disconnect();
				onVisible();
			}, 750);
		},
		{ threshold: [0, 0.25, 0.5, 0.75, 1] }
	);
	observer.observe(node);
	return {
		destroy() {
			clear();
			observer.disconnect();
		}
	};
}

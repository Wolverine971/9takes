// src/lib/components/map/event-binding.ts
type MapLike = {
	on: (handler: string, callback: (ev: unknown) => void) => void;
	off: (handler: string, callback: (ev: unknown) => void) => void;
};

type EventHandler<T extends MapLike> = (el: T, ev: unknown, mapbox: unknown) => [string, unknown];

function bindEvents<T extends MapLike>(
	el: T,
	handlers: Record<string, EventHandler<T>>,
	mapbox: unknown,
	node: { dispatchEvent: (event: Event) => boolean }
): () => void {
	const unbindings: Array<[string, (ev: unknown) => void]> = [];

	for (const [handler, fn] of Object.entries(handlers)) {
		const cmd = (ev: unknown) => {
			const [eventName, detail] = fn(el, ev, mapbox);
			node.dispatchEvent(new CustomEvent(eventName, { detail }));
		};
		el.on(handler, cmd);
		unbindings.push([handler, cmd]);
	}

	return () => {
		for (const [handler, cmd] of unbindings) {
			el.off(handler, cmd);
		}
	};
}

export { bindEvents };

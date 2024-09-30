type Listener = [CallableFunction, HTMLElement];

const ClickOutsideManager = {
	registeredListeners: new Set<Listener>(),
	boundFunction: undefined as ((event: MouseEvent) => void) | undefined,

	handleOnClick(event: MouseEvent): void {
		if (!(event.target instanceof Node)) return;

		this.registeredListeners.forEach(([func, el]) => {
			if (el && !el.contains(event.target) && !event.defaultPrevented) {
				func();
			}
		});
	},

	addListener(func: CallableFunction, el: HTMLElement): () => void {
		if (this.registeredListeners.size === 0) {
			// Start listening to document clicks
			this.boundFunction = this.handleOnClick.bind(this);
			document.addEventListener('click', this.boundFunction);
		}
		const listener: Listener = [func, el];
		this.registeredListeners.add(listener);

		return () => {
			this.registeredListeners.delete(listener);
			if (this.registeredListeners.size === 0 && this.boundFunction) {
				// Stop listening to document clicks
				document.removeEventListener('click', this.boundFunction);
				this.boundFunction = undefined;
			}
		};
	}
};

export const clickOutside = (
	node: HTMLElement,
	params: { callback: () => void }
): { destroy: () => void } => {
	return {
		destroy: ClickOutsideManager.addListener(params.callback, node)
	};
};

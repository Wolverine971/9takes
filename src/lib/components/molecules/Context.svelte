<!-- src/lib/components/molecules/Context.svelte -->
<script module lang="ts">
	import type { Action } from 'svelte/action';

	let id = 1;

	export function uid(): string {
		return `ui:${id++}`;
	}

	export function clone<T>(json: T): T {
		return JSON.parse(JSON.stringify(json)) as T;
	}

	type OutsideClickCallback = () => void;

	export const onClickOutside: Action<HTMLElement, OutsideClickCallback> = (
		element,
		callback = () => {}
	) => {
		const onClick = (event: MouseEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (!element.contains(target)) {
				callback();
			}
		};

		document.body.addEventListener('mousedown', onClick);

		return {
			update(newCallback = () => {}) {
				callback = newCallback;
			},

			destroy() {
				document.body.removeEventListener('mousedown', onClick);
			}
		};
	};
</script>

<div class="ui">
	<slot />
</div>

<style>
	/* Default styles */
	.ui :global(*) {
		box-sizing: border-box;
	}

	/* Utility classes */
	.ui :global(.visually-hidden) {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}

	.ui :global(.label) {
		font-weight: bold;
	}

	.ui :global(.icon) {
		width: 24px;
		height: 24px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>

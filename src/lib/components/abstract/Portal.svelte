<!-- src/lib/components/abstract/Portal.svelte -->
<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	type PortalTarget = HTMLElement | string;

	function getTargetElement(target: PortalTarget): HTMLElement {
		if (typeof target === 'string') {
			const el = document.querySelector(target);
			if (el instanceof HTMLElement) {
				return el;
			}
			throw new Error(`No element found matching CSS selector: "${target}"`);
		}
		if (target instanceof HTMLElement) {
			return target;
		}
		throw new TypeError(
			`Unknown portal target type: ${target === null ? 'null' : typeof target}. Allowed types: string (CSS selector) or HTMLElement.`
		);
	}

	// Re-runs (and re-parents the node) whenever `target` changes.
	function portal(target: PortalTarget = 'body'): Attachment<HTMLElement> {
		return (node) => {
			void (async () => {
				if (typeof target === 'string') {
					await tick();
				}
				getTargetElement(target).appendChild(node);
				node.hidden = false;
			})();

			return () => {
				node.parentNode?.removeChild(node);
			};
		};
	}

	interface Props {
		target?: PortalTarget;
		children?: Snippet;
	}

	let { target = 'body', children }: Props = $props();
</script>

<div {@attach portal(target)} hidden>
	{@render children?.()}
</div>

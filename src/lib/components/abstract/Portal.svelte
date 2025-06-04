<!-- lib/components/abstract/Portal.svelte -->
<script lang="ts">
	import { tick } from 'svelte';

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

	function portal(node: HTMLElement, target: PortalTarget = 'body') {
		let targetEl: HTMLElement;

		async function update(newTarget: PortalTarget) {
			if (typeof newTarget === 'string') {
				await tick();
			}
			targetEl = getTargetElement(newTarget);
			targetEl.appendChild(node);
			node.hidden = false;
		}

		function destroy() {
			node.parentNode?.removeChild(node);
		}

		update(target);

		return { update, destroy };
	}

	export let target: PortalTarget = 'body';
</script>

<div use:portal={target} hidden>
	<slot />
</div>

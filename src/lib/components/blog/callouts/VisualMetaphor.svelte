<!-- src/lib/components/blog/callouts/VisualMetaphor.svelte -->
<!--
  Visual metaphor callout for blog content — analogies, examples, concepts.
  Shell renders through the shared <Callout> base (2026-06-10 consolidation);
  the floating icon disc stays as this component's signature mark.
  Public props unchanged.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Callout from './Callout.svelte';

	interface Props {
		title?: string;
		/**
		 * Body content: an HTML string when dynamically mounted from Supabase
		 * content, or the markdown/default content snippet otherwise.
		 */
		children?: Snippet | string;
	}

	let { title = '', children = '' }: Props = $props();
</script>

<Callout {title}>
	<div class="visual-metaphor__icon" aria-hidden="true">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="10"></circle>
			<path d="M12 16v-4"></path>
			<path d="M12 8h.01"></path>
		</svg>
	</div>

	{#if typeof children === 'string' && children.trim() !== ''}
		{@html children}
	{:else if typeof children === 'function'}
		{@render children()}
	{/if}
</Callout>

<style lang="scss">
	/* Floating icon disc — anchored to the Callout shell (position: relative). */
	.visual-metaphor__icon {
		position: absolute;
		top: -12px;
		right: 16px;
		width: 28px;
		height: 28px;
		background: var(--surface-raised);
		border: 1px solid var(--rule);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 16px;
			height: 16px;
			color: var(--highlight);
		}
	}

	@media (max-width: 640px) {
		.visual-metaphor__icon {
			top: -10px;
			right: 12px;
			width: 24px;
			height: 24px;

			svg {
				width: 14px;
				height: 14px;
			}
		}
	}
</style>

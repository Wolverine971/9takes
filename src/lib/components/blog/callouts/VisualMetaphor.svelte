<!-- src/lib/components/blog/callouts/VisualMetaphor.svelte -->
<!--
  Visual metaphor callout for blog content — analogies, examples, concepts.
  Shell renders through the shared <Callout> base (2026-06-10 consolidation);
  the floating icon disc stays as this component's signature mark.
  Public props unchanged.
-->
<script lang="ts">
	import Callout from './Callout.svelte';

	export let title = '';

	/**
	 * Optional children content (used when dynamically mounted from Supabase content)
	 * Falls back to slot content when not provided
	 */
	export let children: string | ((...args: unknown[]) => unknown) = '';
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
	{:else}
		<slot />
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
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 30%, var(--stone-edge));
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 16px;
			height: 16px;
			color: var(--lamp-glow);
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

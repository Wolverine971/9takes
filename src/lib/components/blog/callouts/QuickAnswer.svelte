<!-- src/lib/components/blog/callouts/QuickAnswer.svelte -->
<!--
  SEO-optimized Quick Answer component for featured snippets.
  Used at the top of blog posts to provide direct answers to search queries.
  Shell renders through the shared <Callout> base (2026-06-10 consolidation);
  public props and the schema.org Question/Answer markup are unchanged.
-->
<script lang="ts">
	import Callout from './Callout.svelte';

	/**
	 * Optional explicit question to display
	 * If not provided, the slot content should include the question
	 */
	export let question: string = '';

	/**
	 * Visual style variant
	 * - 'default': brand amber accent
	 * - 'subtle': neutral ink accent
	 */
	export let variant: 'default' | 'subtle' = 'default';

	/**
	 * Optional children content (used when dynamically mounted from Supabase content)
	 * Falls back to slot content when not provided
	 */
	export let children: string | ((...args: unknown[]) => unknown) = '';
</script>

<Callout
	tone={variant === 'subtle' ? 'neutral' : 'lamp'}
	label="Quick Answer"
	icon="question"
	itemscope
	itemtype="https://schema.org/Question"
>
	{#if question}
		<p class="quick-answer__question" itemprop="name">{question}</p>
	{/if}

	<div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
		<div itemprop="text">
			{#if typeof children === 'string' && children.trim() !== ''}
				{@html children}
			{:else}
				<slot />
			{/if}
		</div>
	</div>
</Callout>

<style lang="scss">
	.quick-answer__question {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--ink-bright);
		margin: 0 0 0.75rem;
		line-height: 1.4;
	}

	@media (max-width: 640px) {
		.quick-answer__question {
			font-size: 1rem;
		}
	}
</style>

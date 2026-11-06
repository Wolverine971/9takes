<!-- src/lib/components/blog/callouts/QuickAnswer.svelte -->
<!--
  SEO-optimized Quick Answer component for featured snippets.
  Used at the top of blog posts to provide direct answers to search queries.
  Shell renders through the shared <Callout> base (2026-06-10 consolidation);
  public props and the schema.org Question/Answer markup are unchanged.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Callout from './Callout.svelte';

	interface Props {
		/**
		 * Optional explicit question to display
		 * If not provided, the body content should include the question
		 */
		question?: string;
		/**
		 * Visual style variant
		 * - 'default': indigo --accent bar
		 * - 'subtle': faint neutral bar
		 */
		variant?: 'default' | 'subtle';
		/**
		 * Body content: an HTML string when dynamically mounted from Supabase
		 * content, or the markdown/default content snippet otherwise.
		 */
		children?: Snippet | string;
	}

	let { question = '', variant = 'default', children = '' }: Props = $props();
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
			{:else if typeof children === 'function'}
				{@render children()}
			{/if}
		</div>
	</div>
</Callout>

<style lang="scss">
	/* Cold Light: Archivo semibold question in --text; the answer stays --text-muted
	   via the Callout base. Anchored to the shell so article <p> rules can't win. */
	:global(.callout) .quick-answer__question {
		font-family: var(--font-talk);
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--text);
		margin: 0 0 0.75rem;
		line-height: 1.4;
	}

	@media (max-width: 640px) {
		:global(.callout) .quick-answer__question {
			font-size: var(--font-size-base);
		}
	}
</style>

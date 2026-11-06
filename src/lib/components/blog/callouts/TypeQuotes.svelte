<!-- src/lib/components/blog/callouts/TypeQuotes.svelte -->
<!--
  Displays characteristic quotes/statements from Enneagram types.
  Shell renders through the shared <Callout> base (2026-06-10 consolidation);
  the title becomes the base's Archivo label. The 'minimal' variant
  (no shell) keeps its bare rendering. Public props unchanged.

  Cold Light (2026-11-06): one tint. Per-type colors no longer paint the
  badges or bars; every badge is --text-faint on a --rule ring, and the quote
  itself is the inner voice (Playfair italic, lavender).

  Usage:
  <TypeQuotes
    title="The Body Types: Anger Deniers"
    quotes={[
      { type: 8, quote: "I'm not angry, I'm just passionate." },
      { type: 9, quote: "I never get angry.", note: "Narrator: They're seething inside" }
    ]}
  />
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Callout from './Callout.svelte';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';

	interface TypeQuote {
		type: number;
		quote: string;
		note?: string;
	}

	interface Props {
		/** Optional title/heading for the quote group */
		title?: string;
		/** Array of quotes with type, quote text, and optional note */
		quotes?: TypeQuote[];
		/**
		 * Visual style variant
		 * - 'default': indigo --accent bar
		 * - 'subtle': faint neutral bar
		 * - 'minimal': no shell, just styled quotes
		 */
		variant?: 'default' | 'subtle' | 'minimal';
		/**
		 * Body content: an HTML string when dynamically mounted from Supabase
		 * content, or the markdown/default content snippet otherwise.
		 */
		children?: Snippet | string;
	}

	let { title = '', quotes = [], variant = 'default', children = '' }: Props = $props();

	const typeNames: Record<number, string> = Object.fromEntries(
		Object.entries(ENNEAGRAM_TYPE_COLORS).map(([k, v]) => [Number(k), v.name])
	);
</script>

{#if variant === 'minimal'}
	<aside class="type-quotes--minimal">
		{#if title}
			<h4 class="type-quotes__title">{title}</h4>
		{/if}
		<div class="type-quotes__list">
			{#each quotes as { type, quote, note } (`${type}:${quote}`)}
				<div class="type-quote">
					<span class="type-quote__badge" title={typeNames[type]}>Type {type}</span>
					<span class="type-quote__text">"{quote}"</span>
					{#if note}
						<span class="type-quote__note">({note})</span>
					{/if}
				</div>
			{/each}
		</div>
		{#if typeof children === 'string' && children.trim() !== ''}
			<div class="type-quotes__content">{@html children}</div>
		{:else if typeof children === 'function'}
			{@render children()}
		{/if}
	</aside>
{:else}
	<Callout tone={variant === 'subtle' ? 'neutral' : 'lamp'} label={title}>
		<div class="type-quotes__list">
			{#each quotes as { type, quote, note } (`${type}:${quote}`)}
				<div class="type-quote">
					<span class="type-quote__badge" title={typeNames[type]}>Type {type}</span>
					<span class="type-quote__text">"{quote}"</span>
					{#if note}
						<span class="type-quote__note">({note})</span>
					{/if}
				</div>
			{/each}
		</div>
		{#if typeof children === 'string' && children.trim() !== ''}
			<div class="type-quotes__content">{@html children}</div>
		{:else if typeof children === 'function'}
			{@render children()}
		{/if}
	</Callout>
{/if}

<style lang="scss">
	.type-quotes--minimal {
		margin: 1.5rem 0;
		padding: 0.5rem 0;
	}

	.type-quotes--minimal .type-quotes__title {
		font-family: var(--font-talk);
		font-size: var(--font-size-base);
		font-weight: 600;
		color: var(--text);
		margin: 0 0 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--rule);
	}

	.type-quotes__list {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}

	.type-quote {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--bg);
		border-radius: 0 0.625rem 0.625rem 0;
		border-left: 2px solid color-mix(in srgb, var(--accent) 70%, transparent);
		transition: background 0.2s ease;

		&:hover {
			background: var(--surface-raised);
		}
	}

	.type-quote__badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.625rem;
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
		background: transparent;
		border: 1px solid var(--rule);
		border-radius: 999px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	/* The type's inner voice: Playfair italic in lavender. */
	.type-quote__text {
		font-family: var(--font-voice);
		font-size: var(--font-size-lg);
		font-weight: 400;
		color: var(--highlight);
		font-style: italic;
		line-height: 1.45;
	}

	.type-quote__note {
		font-family: var(--font-talk);
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		font-style: normal;
		margin-left: 0.25rem;
	}

	.type-quotes__content {
		margin-top: 1rem;
	}

	@media (max-width: 640px) {
		.type-quote {
			padding: 0.625rem 0.875rem;
		}

		.type-quote__text {
			font-size: var(--font-size-base);
		}

		.type-quote__note {
			display: block;
			width: 100%;
			margin-left: 0;
			margin-top: 0.25rem;
		}
	}
</style>

<!-- src/lib/components/blog/callouts/TypeQuotes.svelte -->
<!--
  Displays characteristic quotes/statements from Enneagram types.
  Shell renders through the shared <Callout> base (2026-06-10 consolidation);
  the title becomes the base's mono kicker label. The 'minimal' variant
  (no shell) keeps its bare rendering. Public props unchanged.

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
	import Callout from './Callout.svelte';
	import { getTypeColorSet, ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';

	interface TypeQuote {
		type: number;
		quote: string;
		note?: string;
	}

	/** Optional title/heading for the quote group */
	export let title: string = '';

	/** Array of quotes with type, quote text, and optional note */
	export let quotes: TypeQuote[] = [];

	/**
	 * Visual style variant
	 * - 'default': brand amber accent
	 * - 'subtle': neutral ink accent
	 * - 'minimal': no shell, just styled quotes
	 */
	export let variant: 'default' | 'subtle' | 'minimal' = 'default';

	/** Optional children content (used when dynamically mounted from Supabase content) */
	export let children: string | ((...args: unknown[]) => unknown) = '';

	const typeNames: Record<number, string> = Object.fromEntries(
		Object.entries(ENNEAGRAM_TYPE_COLORS).map(([k, v]) => [Number(k), v.name])
	);

	function getTypeColor(type: number) {
		return getTypeColorSet(type);
	}
</script>

{#if variant === 'minimal'}
	<aside class="type-quotes--minimal">
		{#if title}
			<h4 class="type-quotes__title">{title}</h4>
		{/if}
		<div class="type-quotes__list">
			{#each quotes as { type, quote, note }}
				{@const colors = getTypeColor(type)}
				<div
					class="type-quote"
					style="--type-bg: {colors.bg}; --type-text: {colors.text}; --type-border: {colors.border};"
				>
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
		{:else}
			<slot />
		{/if}
	</aside>
{:else}
	<Callout tone={variant === 'subtle' ? 'neutral' : 'lamp'} label={title}>
		<div class="type-quotes__list">
			{#each quotes as { type, quote, note }}
				{@const colors = getTypeColor(type)}
				<div
					class="type-quote"
					style="--type-bg: {colors.bg}; --type-text: {colors.text}; --type-border: {colors.border};"
				>
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
		{:else}
			<slot />
		{/if}
	</Callout>
{/if}

<style lang="scss">
	.type-quotes--minimal {
		margin: 1.5rem 0;
		padding: 0.5rem 0;
	}

	.type-quotes__title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--ink-bright);
		margin: 0 0 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--stone-edge);
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
		background: rgba(255, 255, 255, 0.03);
		border-radius: 0.625rem;
		border-left: 4px solid var(--type-border);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			background 0.2s ease;

		&:hover {
			transform: translateX(4px);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
			background: var(--type-bg);
		}
	}

	.type-quote__badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.625rem;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--type-text);
		background: var(--type-bg);
		border: 1px solid var(--type-border);
		border-radius: 0.25rem;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.type-quote__text {
		font-size: 1rem;
		font-weight: 500;
		color: var(--ink-bright);
		font-style: italic;
		line-height: 1.5;
	}

	.type-quote__note {
		font-size: 0.875rem;
		color: var(--ink-mid);
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
			font-size: 0.9375rem;
		}

		.type-quote__note {
			font-size: 0.8125rem;
			display: block;
			width: 100%;
			margin-left: 0;
			margin-top: 0.25rem;
		}
	}
</style>

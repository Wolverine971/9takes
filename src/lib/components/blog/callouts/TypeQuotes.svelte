<!-- src/lib/components/blog/callouts/TypeQuotes.svelte -->
<!--
  Solo Leveling Dark Theme - Displays characteristic quotes/statements from Enneagram types
  Perfect for showing how different types express themselves

  Usage:
  <TypeQuotes
    title="The Body Types: Anger Deniers"
    quotes={[
      { type: 8, quote: "I'm not angry, I'm just passionate." },
      { type: 9, quote: "I never get angry.", note: "Narrator: They're seething inside" },
      { type: 1, quote: "I'm not angry, I'm just frustrated things aren't done correctly." }
    ]}
  />
-->
<script lang="ts">
	interface TypeQuote {
		type: number;
		quote: string;
		note?: string;
	}

	/**
	 * Optional title/heading for the quote group
	 */
	export let title: string = '';

	/**
	 * Array of quotes with type, quote text, and optional note
	 */
	export let quotes: TypeQuote[] = [];

	/**
	 * Visual style variant
	 * - 'default': Purple accent (matches 9takes brand)
	 * - 'subtle': Neutral gray accent
	 * - 'minimal': No background, just styled quotes
	 */
	export let variant: 'default' | 'subtle' | 'minimal' = 'default';

	/**
	 * Optional children content (used when dynamically mounted from Supabase content)
	 */
	export let children: string | ((...args: unknown[]) => unknown) = '';

	// Solo Leveling dark theme - Enneagram type colors adjusted for dark backgrounds
	const typeColors: Record<number, { bg: string; text: string; border: string }> = {
		1: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: '#3b82f6' }, // Blue - Perfectionist
		2: { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: '#ec4899' }, // Pink - Helper
		3: { bg: 'rgba(249, 115, 22, 0.15)', text: '#fb923c', border: '#f97316' }, // Orange - Achiever
		4: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: '#a855f7' }, // Purple - Individualist
		5: { bg: 'rgba(20, 184, 166, 0.15)', text: '#2dd4bf', border: '#14b8a6' }, // Teal - Investigator
		6: { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15', border: '#eab308' }, // Yellow - Loyalist
		7: { bg: 'rgba(253, 224, 71, 0.15)', text: '#fde047', border: '#facc15' }, // Bright Yellow - Enthusiast
		8: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: '#ef4444' }, // Red - Challenger
		9: { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', border: '#22c55e' } // Green - Peacemaker
	};

	const typeNames: Record<number, string> = {
		1: 'The Perfectionist',
		2: 'The Helper',
		3: 'The Achiever',
		4: 'The Individualist',
		5: 'The Investigator',
		6: 'The Loyalist',
		7: 'The Enthusiast',
		8: 'The Challenger',
		9: 'The Peacemaker'
	};

	function getTypeColor(type: number) {
		return typeColors[type] || typeColors[1];
	}
</script>

<aside
	class="type-quotes"
	class:type-quotes--subtle={variant === 'subtle'}
	class:type-quotes--minimal={variant === 'minimal'}
>
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
				<span class="type-quote__badge" title={typeNames[type]}>
					Type {type}
				</span>
				<span class="type-quote__text">"{quote}"</span>
				{#if note}
					<span class="type-quote__note">({note})</span>
				{/if}
			</div>
		{/each}
	</div>

	{#if typeof children === 'string' && children.trim() !== ''}
		<div class="type-quotes__content">
			{@html children}
		</div>
	{:else}
		<slot />
	{/if}
</aside>

<style lang="scss">
	/* Solo Leveling Dark Theme */
	.type-quotes {
		margin: 1.5rem 0;
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		background: linear-gradient(135deg, #1a1a2e 0%, #16161e 50%, #12121a 100%);
		border: 1px solid rgba(124, 58, 237, 0.2);
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(124, 58, 237, 0.1);

		&--subtle {
			background: linear-gradient(135deg, #16161e 0%, #0a0a0f 100%);
			border-color: rgba(100, 116, 139, 0.2);
			box-shadow:
				0 2px 12px rgba(0, 0, 0, 0.25),
				0 1px 3px rgba(0, 0, 0, 0.15);
		}

		&--minimal {
			background: transparent;
			border: none;
			box-shadow: none;
			padding: 0.5rem 0;
		}
	}

	.type-quotes__title {
		font-size: 1rem;
		font-weight: 700;
		color: #f1f5f9;
		margin: 0 0 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(124, 58, 237, 0.2);
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
		border-radius: 8px;
		border-left: 4px solid var(--type-border);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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
		border-radius: 6px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.type-quote__text {
		font-size: 1rem;
		font-weight: 500;
		color: #e2e8f0;
		font-style: italic;
		line-height: 1.5;
	}

	.type-quote__note {
		font-size: 0.875rem;
		color: #94a3b8;
		font-style: normal;
		margin-left: 0.25rem;
	}

	.type-quotes__content {
		margin-top: 1rem;
		font-size: 0.9rem;
		line-height: 1.6;
		color: #cbd5e1;
	}

	// Mobile adjustments
	@media (max-width: 640px) {
		.type-quotes {
			padding: 1rem;
			margin: 1rem 0;
		}

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

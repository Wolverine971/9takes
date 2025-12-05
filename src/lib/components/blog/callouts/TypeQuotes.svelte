<!-- src/lib/components/blog/callouts/TypeQuotes.svelte -->
<!--
  Displays characteristic quotes/statements from Enneagram types
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

	// Enneagram type colors - distinct colors for each type
	const typeColors: Record<number, { bg: string; text: string; border: string }> = {
		1: { bg: '#E3F2FD', text: '#1565C0', border: '#42A5F5' }, // Blue - Perfectionist
		2: { bg: '#FCE4EC', text: '#C2185B', border: '#F06292' }, // Pink - Helper
		3: { bg: '#FFF3E0', text: '#E65100', border: '#FF9800' }, // Orange - Achiever
		4: { bg: '#F3E5F5', text: '#7B1FA2', border: '#BA68C8' }, // Purple - Individualist
		5: { bg: '#E0F2F1', text: '#00695C', border: '#26A69A' }, // Teal - Investigator
		6: { bg: '#FFF8E1', text: '#F57F17', border: '#FFCA28' }, // Amber - Loyalist
		7: { bg: '#FFFDE7', text: '#F9A825', border: '#FFEE58' }, // Yellow - Enthusiast
		8: { bg: '#FFEBEE', text: '#C62828', border: '#EF5350' }, // Red - Challenger
		9: { bg: '#E8F5E9', text: '#2E7D32', border: '#66BB6A' } // Green - Peacemaker
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
</aside>

<style lang="scss">
	.type-quotes {
		margin: 1.5rem 0;
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		background: linear-gradient(135deg, #f8f7ff 0%, #f0eeff 50%, #e8e4ff 100%);
		border: 1px solid rgba(108, 92, 231, 0.15);
		box-shadow:
			0 2px 8px rgba(108, 92, 231, 0.08),
			0 1px 3px rgba(0, 0, 0, 0.04);

		&--subtle {
			background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
			border-color: rgba(0, 0, 0, 0.08);
			box-shadow:
				0 1px 4px rgba(0, 0, 0, 0.04),
				0 1px 2px rgba(0, 0, 0, 0.02);
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
		color: #1f2937;
		margin: 0 0 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(108, 92, 231, 0.15);
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
		background: white;
		border-radius: 8px;
		border-left: 4px solid var(--type-border);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateX(4px);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
		border-radius: 6px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.type-quote__text {
		font-size: 1rem;
		font-weight: 500;
		color: #374151;
		font-style: italic;
		line-height: 1.5;
	}

	.type-quote__note {
		font-size: 0.875rem;
		color: #6b7280;
		font-style: normal;
		margin-left: 0.25rem;
	}

	// Dark mode support
	@media (prefers-color-scheme: dark) {
		.type-quotes {
			background: linear-gradient(135deg, #1e1b2e 0%, #252136 50%, #2a2442 100%);
			border-color: rgba(162, 155, 254, 0.2);
			box-shadow:
				0 2px 8px rgba(0, 0, 0, 0.3),
				0 1px 3px rgba(0, 0, 0, 0.2);

			&--subtle {
				background: linear-gradient(135deg, #1a1a1a 0%, #222 100%);
				border-color: rgba(255, 255, 255, 0.1);
			}

			&--minimal {
				background: transparent;
			}
		}

		.type-quotes__title {
			color: #f3f4f6;
			border-bottom-color: rgba(162, 155, 254, 0.2);
		}

		.type-quote {
			background: rgba(255, 255, 255, 0.05);
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

			&:hover {
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
			}
		}

		.type-quote__text {
			color: #e5e7eb;
		}

		.type-quote__note {
			color: #9ca3af;
		}
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

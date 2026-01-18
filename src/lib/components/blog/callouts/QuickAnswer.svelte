<!-- src/lib/components/blog/callouts/QuickAnswer.svelte -->
<!--
  SEO-optimized Quick Answer component for featured snippets
  Used at the top of blog posts to provide direct answers to search queries
-->
<script lang="ts">
	/**
	 * Optional explicit question to display
	 * If not provided, the slot content should include the question
	 */
	export let question: string = '';

	/**
	 * Visual style variant
	 * - 'default': Purple gradient (matches 9takes brand)
	 * - 'subtle': Light gray with accent
	 */
	export let variant: 'default' | 'subtle' = 'default';

	/**
	 * Optional children content (used when dynamically mounted from Supabase content)
	 * Falls back to slot content when not provided
	 */
	export let children: string | ((...args: unknown[]) => unknown) = '';
</script>

<aside
	class="quick-answer"
	class:quick-answer--subtle={variant === 'subtle'}
	itemscope
	itemtype="https://schema.org/Answer"
>
	<div class="quick-answer__header">
		<svg
			class="quick-answer__icon"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="10"></circle>
			<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
			<line x1="12" y1="17" x2="12.01" y2="17"></line>
		</svg>
		<span class="quick-answer__label">Quick Answer</span>
	</div>

	{#if question}
		<p class="quick-answer__question" itemprop="name">{question}</p>
	{/if}

	<div class="quick-answer__content" itemprop="text">
		{#if typeof children === 'string' && children.trim() !== ''}
			{@html children}
		{:else}
			<slot />
		{/if}
	</div>
</aside>

<style lang="scss">
	/* Solo Leveling Dark Theme */
	.quick-answer {
		position: relative;
		margin: 1.5rem 0 2rem;
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		background: linear-gradient(135deg, #1a1a2e 0%, #16161e 50%, #12121a 100%);
		border: 1px solid rgba(124, 58, 237, 0.25);
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(124, 58, 237, 0.1);

		// Purple accent line on left
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			background: linear-gradient(180deg, #7c3aed 0%, #a78bfa 100%);
			border-radius: 12px 0 0 12px;
		}

		&--subtle {
			background: linear-gradient(135deg, #16161e 0%, #0a0a0f 100%);
			border-color: rgba(100, 116, 139, 0.2);
			box-shadow:
				0 2px 12px rgba(0, 0, 0, 0.25),
				0 1px 3px rgba(0, 0, 0, 0.15);

			&::before {
				background: linear-gradient(180deg, #64748b 0%, #94a3b8 100%);
			}

			.quick-answer__label {
				color: #94a3b8;
			}

			.quick-answer__icon {
				color: #64748b;
			}
		}
	}

	.quick-answer__header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.quick-answer__icon {
		width: 20px;
		height: 20px;
		color: #a78bfa;
		flex-shrink: 0;
	}

	.quick-answer__label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #a78bfa;
	}

	.quick-answer__question {
		font-size: 1.1rem;
		font-weight: 600;
		color: #f1f5f9;
		margin: 0 0 0.75rem;
		line-height: 1.4;
	}

	.quick-answer__content {
		font-size: 1rem;
		line-height: 1.7;
		color: #cbd5e1;

		// Style any bold text within the content
		:global(strong),
		:global(b) {
			color: #f1f5f9;
			font-weight: 600;
		}

		// Handle paragraphs inside
		:global(p) {
			margin: 0;
			color: #cbd5e1;

			& + :global(p) {
				margin-top: 0.75rem;
			}
		}

		// First paragraph with first letter styling shouldn't have it here
		:global(p.firstLetter::first-letter) {
			font-size: inherit;
			float: none;
			line-height: inherit;
			margin: 0;
			padding: 0;
		}

		// Links
		:global(a) {
			color: #a78bfa;

			&:hover {
				color: #c4b5fd;
			}
		}
	}

	// Mobile adjustments
	@media (max-width: 640px) {
		.quick-answer {
			padding: 1rem 1.25rem;
			margin: 1rem 0 1.5rem;
			border-radius: 10px;
		}

		.quick-answer__question {
			font-size: 1rem;
		}

		.quick-answer__content {
			font-size: 0.95rem;
		}
	}
</style>

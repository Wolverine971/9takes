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
	export let children: string = '';
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
		{#if children}
			{@html children}
		{:else}
			<slot />
		{/if}
	</div>
</aside>

<style lang="scss">
	.quick-answer {
		position: relative;
		margin: 1.5rem 0 2rem;
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		background: linear-gradient(135deg, #f8f7ff 0%, #f0eeff 50%, #e8e4ff 100%);
		border: 1px solid rgba(108, 92, 231, 0.15);
		box-shadow:
			0 2px 8px rgba(108, 92, 231, 0.08),
			0 1px 3px rgba(0, 0, 0, 0.04);

		// Subtle accent line on left
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			background: linear-gradient(180deg, #6c5ce7 0%, #a29bfe 100%);
			border-radius: 12px 0 0 12px;
		}

		&--subtle {
			background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
			border-color: rgba(0, 0, 0, 0.08);
			box-shadow:
				0 1px 4px rgba(0, 0, 0, 0.04),
				0 1px 2px rgba(0, 0, 0, 0.02);

			&::before {
				background: linear-gradient(180deg, #6b7280 0%, #9ca3af 100%);
			}

			.quick-answer__label {
				color: #4b5563;
			}

			.quick-answer__icon {
				color: #6b7280;
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
		color: #6c5ce7;
		flex-shrink: 0;
	}

	.quick-answer__label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6c5ce7;
	}

	.quick-answer__question {
		font-size: 1.1rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0.75rem;
		line-height: 1.4;
	}

	.quick-answer__content {
		font-size: 1rem;
		line-height: 1.7;
		color: #374151;

		// Style any bold text within the content
		:global(strong),
		:global(b) {
			color: #1f2937;
			font-weight: 600;
		}

		// Handle paragraphs inside
		:global(p) {
			margin: 0;

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
	}

	// Dark mode support
	@media (prefers-color-scheme: dark) {
		.quick-answer {
			background: linear-gradient(135deg, #1e1b2e 0%, #252136 50%, #2a2442 100%);
			border-color: rgba(162, 155, 254, 0.2);
			box-shadow:
				0 2px 8px rgba(0, 0, 0, 0.3),
				0 1px 3px rgba(0, 0, 0, 0.2);

			&::before {
				background: linear-gradient(180deg, #a29bfe 0%, #6c5ce7 100%);
			}
		}

		.quick-answer__label {
			color: #a29bfe;
		}

		.quick-answer__icon {
			color: #a29bfe;
		}

		.quick-answer__question {
			color: #f3f4f6;
		}

		.quick-answer__content {
			color: #d1d5db;

			:global(strong),
			:global(b) {
				color: #f3f4f6;
			}
		}
	}

	// Mobile adjustments
	@media (max-width: 640px) {
		.quick-answer {
			padding: 1rem 1.25rem;
			margin: 1rem 0 1.5rem;
		}

		.quick-answer__question {
			font-size: 1rem;
		}

		.quick-answer__content {
			font-size: 0.95rem;
		}
	}
</style>

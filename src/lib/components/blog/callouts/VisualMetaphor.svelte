<!-- src/lib/components/blog/callouts/VisualMetaphor.svelte -->
<!--
  9takes Warm Tech Theme - Visual metaphor callout for blog content
  Used to present analogies, examples, or visual concepts
-->
<script lang="ts">
	export let title = '';

	/**
	 * Optional children content (used when dynamically mounted from Supabase content)
	 * Falls back to slot content when not provided
	 */
	export let children: string | ((...args: unknown[]) => unknown) = '';
</script>

<figure class="visual-metaphor">
	<div class="visual-metaphor__icon">
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
	{#if title}
		<figcaption class="visual-metaphor__title">{title}</figcaption>
	{/if}
	<div class="visual-metaphor__content">
		{#if typeof children === 'string' && children.trim() !== ''}
			{@html children}
		{:else}
			<slot />
		{/if}
	</div>
</figure>

<style lang="scss">
	.visual-metaphor {
		position: relative;
		margin: 1.5rem 0;
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		background: linear-gradient(
			135deg,
			var(--bg-surface) 0%,
			var(--bg-deep) 50%,
			var(--bg-base) 100%
		);
		border: 1px solid rgba(45, 212, 191, 0.2);
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(45, 212, 191, 0.1);

		// Primary accent line on left
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			background: linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%);
			border-radius: 12px 0 0 12px;
		}
	}

	.visual-metaphor__icon {
		position: absolute;
		top: -12px;
		right: 16px;
		width: 28px;
		height: 28px;
		background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-deep) 100%);
		border: 1px solid rgba(45, 212, 191, 0.3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 16px;
			height: 16px;
			color: var(--primary);
		}
	}

	.visual-metaphor__title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--primary);
		margin: 0 0 0.75rem;
		line-height: 1.4;
	}

	.visual-metaphor__content {
		font-size: 0.9rem;
		line-height: 1.7;
		color: var(--text-secondary);

		:global(strong),
		:global(b) {
			color: var(--text-primary);
			font-weight: 600;
		}

		:global(p) {
			margin: 0;
			color: var(--text-secondary);

			& + :global(p) {
				margin-top: 0.75rem;
			}
		}

		:global(a) {
			color: var(--accent-light);

			&:hover {
				color: var(--primary-lightest);
			}
		}

		:global(em),
		:global(i) {
			color: var(--text-secondary);
			font-style: italic;
		}
	}

	// Mobile adjustments
	@media (max-width: 640px) {
		.visual-metaphor {
			padding: 1rem 1.25rem;
			margin: 1rem 0;
		}

		.visual-metaphor__title {
			font-size: 0.95rem;
		}

		.visual-metaphor__content {
			font-size: 0.85rem;
		}

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

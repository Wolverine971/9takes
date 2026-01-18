<!-- src/lib/components/blog/callouts/VisualMetaphor.svelte -->
<!--
  Solo Leveling Dark Theme - Visual metaphor callout for blog content
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
		background: linear-gradient(135deg, #1a1a2e 0%, #16161e 50%, #12121a 100%);
		border: 1px solid rgba(56, 189, 248, 0.2);
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(56, 189, 248, 0.1);

		// Cyan accent line on left
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			background: linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%);
			border-radius: 12px 0 0 12px;
		}
	}

	.visual-metaphor__icon {
		position: absolute;
		top: -12px;
		right: 16px;
		width: 28px;
		height: 28px;
		background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
		border: 1px solid rgba(56, 189, 248, 0.3);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 16px;
			height: 16px;
			color: #38bdf8;
		}
	}

	.visual-metaphor__title {
		font-size: 1rem;
		font-weight: 700;
		color: #38bdf8;
		margin: 0 0 0.75rem;
		line-height: 1.4;
	}

	.visual-metaphor__content {
		font-size: 0.9rem;
		line-height: 1.7;
		color: #cbd5e1;

		:global(strong),
		:global(b) {
			color: #f1f5f9;
			font-weight: 600;
		}

		:global(p) {
			margin: 0;
			color: #cbd5e1;

			& + :global(p) {
				margin-top: 0.75rem;
			}
		}

		:global(a) {
			color: #a78bfa;

			&:hover {
				color: #c4b5fd;
			}
		}

		:global(em),
		:global(i) {
			color: #94a3b8;
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

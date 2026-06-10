<!-- src/lib/components/blog/callouts/InsightBox.svelte -->
<!--
  9takes Warm Tech Theme - Insight callout boxes for blog content
  Used to highlight key insights, tips, warnings, or neutral information
-->
<script lang="ts">
	type Tone = 'success' | 'info' | 'warning' | 'neutral';

	export let title = '';
	export let tone: Tone = 'success';

	/**
	 * Optional children content (used when dynamically mounted from Supabase content)
	 * Falls back to slot content when not provided
	 */
	export let children: string | ((...args: unknown[]) => unknown) = '';

	// Solo Leveling dark theme accent colors for each tone
	const toneConfig: Record<Tone, { accent: string; glow: string }> = {
		success: {
			accent: 'var(--success)',
			glow: 'color-mix(in srgb, var(--success) 15%, transparent)'
		},
		info: { accent: 'var(--lamp-glow)', glow: 'var(--lamp-soft)' },
		warning: {
			accent: 'var(--warning)',
			glow: 'color-mix(in srgb, var(--warning) 15%, transparent)'
		},
		neutral: {
			accent: 'var(--ink-dim)',
			glow: 'color-mix(in srgb, var(--ink-dim) 15%, transparent)'
		}
	};

	const currentTone = toneConfig[tone] ?? toneConfig.success;
</script>

<aside
	class="insight-box insight-box--{tone}"
	style="--accent-color: {currentTone.accent}; --glow-color: {currentTone.glow};"
>
	<div class="insight-box__accent"></div>
	{#if title}
		<h4 class="insight-box__title">{title}</h4>
	{/if}
	<div class="insight-box__content">
		{#if typeof children === 'string' && children.trim() !== ''}
			{@html children}
		{:else}
			<slot />
		{/if}
	</div>
</aside>

<style lang="scss">
	.insight-box {
		position: relative;
		margin: 1.5rem 0;
		padding: 1rem 1.25rem;
		border-radius: 10px;
		background: linear-gradient(
			135deg,
			var(--stone-warm) 0%,
			var(--night-deep) 50%,
			var(--night-deep) 100%
		);
		border: 1px solid color-mix(in srgb, var(--ink-dim) 20%, transparent);

		&--success {
			border-color: color-mix(in srgb, var(--success) 25%, transparent);
		}

		&--info {
			border-color: color-mix(in srgb, var(--lamp-glow) 20%, var(--stone-edge));
		}

		&--warning {
			border-color: color-mix(in srgb, var(--warning) 25%, transparent);
		}

		&--neutral {
			border-color: color-mix(in srgb, var(--ink-dim) 20%, transparent);
		}
	}

	.insight-box__accent {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: var(--accent-color);
		border-radius: 10px 0 0 10px;
	}

	.insight-box__title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--accent-color);
		margin: 0 0 0.5rem;
		line-height: 1.4;
	}

	.insight-box__content {
		font-size: 0.9rem;
		line-height: 1.65;
		color: var(--ink-mid);

		:global(strong),
		:global(b) {
			color: var(--ink-bright);
			font-weight: 600;
		}

		:global(p) {
			margin: 0;
			color: var(--ink-mid);

			& + :global(p) {
				margin-top: 0.5rem;
			}
		}

		:global(a) {
			color: var(--lamp-glow);

			&:hover {
				color: var(--lamp-glow);
			}
		}

		:global(ul),
		:global(ol) {
			margin: 0.5rem 0;
			padding-left: 1.25rem;
			color: var(--ink-mid);
		}

		:global(li) {
			margin: 0.25rem 0;
		}
	}

	// Mobile adjustments
	@media (max-width: 640px) {
		.insight-box {
			padding: 0.875rem 1rem;
			margin: 1rem 0;
		}

		.insight-box__title {
			font-size: 0.9rem;
		}

		.insight-box__content {
			font-size: 0.85rem;
		}
	}
</style>

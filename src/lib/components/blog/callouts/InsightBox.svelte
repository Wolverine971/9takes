<!-- src/lib/components/blog/callouts/InsightBox.svelte -->
<!--
  Solo Leveling Dark Theme - Insight callout boxes for blog content
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
		success: { accent: '#22c55e', glow: 'rgba(34, 197, 94, 0.15)' },
		info: { accent: '#7c3aed', glow: 'rgba(124, 58, 237, 0.15)' },
		warning: { accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.15)' },
		neutral: { accent: '#64748b', glow: 'rgba(100, 116, 139, 0.15)' }
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
		background: linear-gradient(135deg, #1a1a2e 0%, #16161e 50%, #12121a 100%);
		border: 1px solid rgba(100, 116, 139, 0.2);
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.25),
			0 0 0 1px var(--glow-color);

		&--success {
			border-color: rgba(34, 197, 94, 0.25);
		}

		&--info {
			border-color: rgba(124, 58, 237, 0.25);
		}

		&--warning {
			border-color: rgba(245, 158, 11, 0.25);
		}

		&--neutral {
			border-color: rgba(100, 116, 139, 0.2);
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
				margin-top: 0.5rem;
			}
		}

		:global(a) {
			color: #a78bfa;

			&:hover {
				color: #c4b5fd;
			}
		}

		:global(ul),
		:global(ol) {
			margin: 0.5rem 0;
			padding-left: 1.25rem;
			color: #cbd5e1;
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

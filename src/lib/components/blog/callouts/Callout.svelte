<!-- src/lib/components/blog/callouts/Callout.svelte -->
<!--
  Callout — the single base shell for blog callout boxes.
  Created 2026-06-10 (design audit): eight callout components carried eight
  hand-rolled shells with drifting radii/borders/labels. This is the one
  treatment: 10px radius, 1px tone-tinted border, 4px left accent, mono
  kicker label (the §NN system voice), shared prose styles in the content.

  Tones map to the V5 palette: lamp (default brand), success, warning,
  error, data (teal — stat/data moments), neutral (ink).

  Consumers (QuickAnswer, InsightBox, Checklist, TypeQuotes, VisualMetaphor,
  CorpusStatCallout) keep their public props/slots and render through this.
  BookSessionCTA / EnneagramTypingFlow are conversion banners, not callouts —
  intentionally separate.

  Extra attributes (e.g. itemscope/itemtype for schema.org) pass through to
  the <aside>.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'lamp' | 'success' | 'warning' | 'error' | 'data' | 'neutral';
	// Built-in header icons (string preset, not a slot — legacy-mode consumers
	// can't pass snippets without tripping the slot/snippet interop typing).
	type Icon = 'question' | 'info';

	let {
		tone = 'lamp',
		label = '',
		title = '',
		class: extraClass = '',
		icon = undefined,
		children,
		...rest
	}: {
		tone?: Tone;
		label?: string;
		title?: string;
		class?: string;
		icon?: Icon;
		children?: Snippet;
		[key: string]: unknown;
	} = $props();

	const ICON_PATHS: Record<Icon, string> = {
		question:
			'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
		info: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10ZM12 16v-4M12 8h.01'
	};

	const TONES: Record<Tone, { accent: string; border: string }> = {
		lamp: {
			accent: 'var(--lamp-glow)',
			border: 'color-mix(in srgb, var(--lamp-glow) 20%, var(--stone-edge))'
		},
		success: {
			accent: 'var(--success)',
			border: 'color-mix(in srgb, var(--success) 25%, transparent)'
		},
		warning: {
			accent: 'var(--warning)',
			border: 'color-mix(in srgb, var(--warning) 25%, transparent)'
		},
		error: {
			accent: 'var(--error)',
			border: 'color-mix(in srgb, var(--error) 25%, transparent)'
		},
		data: {
			accent: 'var(--data-teal)',
			border: 'color-mix(in srgb, var(--data-teal) 25%, var(--stone-edge))'
		},
		neutral: {
			accent: 'var(--ink-dim)',
			border: 'color-mix(in srgb, var(--ink-dim) 20%, transparent)'
		}
	};

	let toneVars = $derived(
		`--callout-accent: ${(TONES[tone] ?? TONES.lamp).accent}; --callout-border: ${(TONES[tone] ?? TONES.lamp).border};`
	);
</script>

<aside class="callout {extraClass}" style={toneVars} {...rest}>
	<div class="callout__accent" aria-hidden="true"></div>

	{#if icon || label}
		<div class="callout__header">
			{#if icon}
				<span class="callout__icon" aria-hidden="true">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d={ICON_PATHS[icon]} />
					</svg>
				</span>
			{/if}
			{#if label}
				<span class="callout__label">{label}</span>
			{/if}
		</div>
	{/if}

	{#if title}
		<h4 class="callout__title">{title}</h4>
	{/if}

	<div class="callout__content">
		{@render children?.()}
	</div>
</aside>

<style lang="scss">
	.callout {
		position: relative;
		margin: 1.5rem 0;
		padding: 1.25rem 1.5rem;
		border-radius: 0.625rem;
		background: linear-gradient(
			135deg,
			var(--stone-warm) 0%,
			var(--night-deep) 50%,
			var(--night-deep) 100%
		);
		border: 1px solid var(--callout-border);
	}

	.callout__accent {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: var(--callout-accent);
		border-radius: 0.625rem 0 0 0.625rem;
	}

	.callout__header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.callout__icon {
		display: inline-flex;
		width: 20px;
		height: 20px;
		color: var(--callout-accent);
		flex-shrink: 0;

		:global(svg) {
			width: 100%;
			height: 100%;
		}
	}

	/* The system label voice — mono kicker, accent-colored. */
	.callout__label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--callout-accent);
	}

	.callout__title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--callout-accent);
		margin: 0 0 0.5rem;
		line-height: 1.4;
		padding: 0;
	}

	/* Shared prose styles for slotted content. */
	.callout__content {
		font-size: 0.95rem;
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
		}

		:global(p + p) {
			margin-top: 0.75rem;
		}

		:global(a) {
			color: var(--lamp-glow);
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

		/* Defuse the article first-letter treatment inside callouts. */
		:global(p.firstLetter::first-letter) {
			font-size: inherit;
			float: none;
			line-height: inherit;
			margin: 0;
			padding: 0;
		}
	}

	@media (max-width: 640px) {
		.callout {
			padding: 1rem 1.25rem;
			margin: 1rem 0;
		}

		.callout__content {
			font-size: 0.9rem;
		}
	}
</style>

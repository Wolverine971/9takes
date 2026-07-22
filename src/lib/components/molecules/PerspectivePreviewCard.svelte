<script lang="ts">
	import { ENNEAGRAM_TYPE_COLORS, TYPE_COLOR_MAP } from '$lib/constants/enneagramColors';

	interface Props {
		typeNumber: number;
		text: string;
		source: 'ai' | 'human';
		delay?: number;
	}

	let { typeNumber, text, source, delay = 0 }: Props = $props();

	let typeColor = $derived(TYPE_COLOR_MAP[typeNumber] ?? 'var(--lamp-glow)');
	let archetype = $derived(ENNEAGRAM_TYPE_COLORS[typeNumber]?.name ?? 'Enneagram perspective');
	let sourceLabel = $derived(source === 'human' ? 'Community answer' : 'AI perspective');
</script>

<article
	class="take-preview-card"
	style:--comment-type-color={typeColor}
	style:--take-delay={`${delay}ms`}
>
	<header class="take-preview-card__head">
		<div class="take-preview-card__identity">
			<span class="take-preview-card__badge">Type {typeNumber}</span>
			<span class="take-preview-card__archetype">{archetype}</span>
		</div>
		<span class="take-preview-card__source">{sourceLabel}</span>
	</header>
	<p>{text}</p>
</article>

<style>
	.take-preview-card {
		position: relative;
		min-width: 0;
		padding: 0.95rem 1rem 1rem;
		border: 1px solid var(--stone-edge);
		border-left: 3px solid var(--comment-type-color, var(--stone-edge));
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.take-preview-card__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.7rem;
	}

	.take-preview-card__identity {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-width: 0;
	}

	.take-preview-card__badge {
		display: inline-flex;
		height: 1.75rem;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		padding: 0 0.625rem;
		border: 1px solid color-mix(in srgb, var(--comment-type-color) 38%, transparent);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--comment-type-color) 16%, transparent);
		color: color-mix(in srgb, var(--comment-type-color) 65%, white);
		font-size: 0.75rem;
		font-weight: 650;
	}

	:global(:root.light) .take-preview-card__badge {
		color: color-mix(in srgb, var(--comment-type-color) 66%, black);
	}

	.take-preview-card__archetype,
	.take-preview-card__source {
		min-width: 0;
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.62rem;
		letter-spacing: 0.045em;
		text-transform: uppercase;
	}

	.take-preview-card__archetype {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.take-preview-card__source {
		flex: 0 0 auto;
		text-align: right;
	}

	.take-preview-card p {
		margin: 0;
		color: var(--ink-bright);
		font-size: 0.9rem;
		line-height: 1.55;
		overflow-wrap: anywhere;
		white-space: pre-line;
	}

	@media (prefers-reduced-motion: no-preference) {
		.take-preview-card {
			animation: take-preview-enter 360ms both;
			animation-delay: var(--take-delay);
		}
	}

	@keyframes take-preview-enter {
		from {
			transform: translateY(6px);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@media (max-width: 35rem) {
		.take-preview-card__head,
		.take-preview-card__identity {
			align-items: flex-start;
		}

		.take-preview-card__head {
			flex-direction: column;
			gap: 0.45rem;
		}

		.take-preview-card__identity {
			width: 100%;
		}

		.take-preview-card__source {
			padding-left: 0.1rem;
			text-align: left;
		}
	}
</style>

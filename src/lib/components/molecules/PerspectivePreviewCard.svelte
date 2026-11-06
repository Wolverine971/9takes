<!-- src/lib/components/molecules/PerspectivePreviewCard.svelte -->
<script lang="ts">
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';

	interface Props {
		typeNumber: number;
		text: string;
		source: 'ai' | 'human';
		delay?: number;
	}

	let { typeNumber, text, source, delay = 0 }: Props = $props();

	let archetype = $derived(ENNEAGRAM_TYPE_COLORS[typeNumber]?.name ?? 'Enneagram perspective');
	let sourceLabel = $derived(source === 'human' ? 'Community answer' : 'AI perspective');
</script>

<!-- Same grammar as a take in the thread: type chip, words, quiet labels, a rule. -->
<article class="take-preview-card" style:--take-delay={`${delay}ms`}>
	<span class="take-preview-card__chip" aria-hidden="true">{typeNumber}</span>
	<div class="take-preview-card__body">
		<header class="take-preview-card__head">
			<span class="take-preview-card__badge">Type {typeNumber}</span>
			<span class="take-preview-card__archetype">{archetype}</span>
			<span class="take-preview-card__source">{sourceLabel}</span>
		</header>
		<p>{text}</p>
	</div>
</article>

<style>
	.take-preview-card {
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		align-items: start;
		gap: 14px;
		min-width: 0;
		padding: 18px 0;
		margin: 0;
		border-bottom: 1px solid var(--rule);
		border-radius: 0;
	}

	.take-preview-card__chip {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--accent-deep);
		color: var(--highlight);
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-base);
		line-height: 1;
	}

	.take-preview-card__body {
		min-width: 0;
	}

	.take-preview-card__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 10px;
		margin-bottom: 6px;
	}

	.take-preview-card__badge {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		font-weight: 600;
	}

	.take-preview-card__archetype,
	.take-preview-card__source {
		color: var(--text-faint);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.take-preview-card__source {
		margin-left: auto;
	}

	.take-preview-card p {
		margin: 0;
		color: var(--text);
		font-size: var(--font-size-base);
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
		.take-preview-card {
			grid-template-columns: 28px minmax(0, 1fr);
			gap: 12px;
		}

		.take-preview-card__chip {
			width: 28px;
			height: 28px;
		}

		.take-preview-card__source {
			flex-basis: 100%;
			margin-left: 0;
		}
	}
</style>

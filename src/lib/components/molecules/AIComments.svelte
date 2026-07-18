<!-- src/lib/components/molecules/AIComments.svelte -->
<!--
  The reveal moment. After a user posts their answer, this renders all nine
  Enneagram takes at once as the homepage-style color-coded grid
  (.chorus-perspectives on src/routes/+page.svelte) — not a one-at-a-time
  carousel. Each card is honestly labeled "AI-seeded", matching the
  homepage's attribution vocabulary.
-->
<script lang="ts">
	import { TYPE_COLOR_MAP, formatTypeLabel } from '$lib/constants/enneagramColors';
	import type { AIComment, QuestionPageData } from '$lib/types/questions';

	interface Props {
		parentType?: 'question' | 'comment';
		data: QuestionPageData;
		showAiComments?: boolean;
	}

	let { parentType = 'comment', data, showAiComments = true }: Props = $props();

	// Each row carries a real Enneagram type number (enneagram_type, with the
	// legacy `enneagram` column as fallback), so labels and colors derive from
	// the data itself. Sorted 1 → 9 for the full nine-pattern sweep.
	function typeNumberOf(take: AIComment): number {
		const candidate = Number(take.enneagram_type ?? take.enneagram);
		return Number.isFinite(candidate) && candidate >= 1 && candidate <= 9 ? candidate : 0;
	}

	let takes = $derived(
		[...(data?.aiComments ?? [])]
			.map((take) => ({ ...take, typeNumber: typeNumberOf(take) }))
			.sort((a, b) => a.typeNumber - b.typeNumber)
	);

	function typeColor(typeNumber: number): string {
		return TYPE_COLOR_MAP[typeNumber] ?? 'var(--lamp-glow)';
	}

	function takeLabel(typeNumber: number): string {
		return typeNumber ? formatTypeLabel(typeNumber) : 'Enneagram pattern';
	}
</script>

{#if takes.length && parentType === 'question' && data?.flags?.userHasAnswered && showAiComments}
	<section class="nine-takes" aria-label="The nine takes">
		<header class="nine-takes__head">
			<h3 class="nine-takes__title">The nine takes</h3>
			<p class="nine-takes__sub">Nine patterns, nine reads on the same question.</p>
		</header>

		<div class="chorus-perspectives">
			{#each takes as take (take.id)}
				<article class="perspective" style:--perspective-color={typeColor(take.typeNumber)}>
					<div class="perspective-meta">
						<span class="perspective-label">{takeLabel(take.typeNumber)}</span>
						<small>AI-seeded</small>
					</div>
					<p>&ldquo;{take.comment}&rdquo;</p>
				</article>
			{/each}
		</div>
	</section>
{/if}

<style>
	/* Ported from the homepage .chorus-perspectives / .perspective system
	   (src/routes/+page.svelte) so the question page delivers the same reveal
	   the homepage demos. V5 tokens flip via :root.light. */
	.nine-takes {
		margin: 0 1rem 1.25rem;
	}

	.nine-takes__head {
		margin-bottom: 0.75rem;
	}

	.nine-takes__title {
		margin: 0;
		color: var(--ink-bright);
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.nine-takes__sub {
		margin: 0.2rem 0 0;
		color: var(--ink-dim);
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.chorus-perspectives {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.7rem;
	}

	@media (min-width: 640px) {
		.chorus-perspectives {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.perspective {
		position: relative;
		overflow: hidden;
		min-width: 0;
		padding: 1rem 1rem 1rem 1.15rem;
		border: 1px solid color-mix(in srgb, var(--perspective-color) 38%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--perspective-color) 8%, var(--stone-warm));
	}

	.perspective::before {
		position: absolute;
		inset: 0 auto 0 0;
		width: 3px;
		background: var(--perspective-color);
		content: '';
	}

	.perspective-meta {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.perspective-label {
		min-width: 0;
		color: var(--perspective-color);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 0.65rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	/* Type hexes are tuned for dark surfaces — deepen them on the light theme
	   (same pattern as .public-perspective-card__eyebrow in QuestionContent). */
	:global(:root.light) .perspective-label {
		color: color-mix(in srgb, var(--perspective-color) 72%, black);
	}

	.perspective-meta small {
		flex: 0 0 auto;
		color: var(--ink-dim);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 0.58rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.perspective p {
		margin: 0.45rem 0 0;
		color: var(--ink-bright);
		font-size: 0.83rem;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	@media (prefers-reduced-motion: no-preference) {
		.perspective {
			animation: perspective-enter 420ms both;
		}

		.perspective:nth-child(2) {
			animation-delay: 45ms;
		}

		.perspective:nth-child(3) {
			animation-delay: 90ms;
		}

		.perspective:nth-child(4) {
			animation-delay: 135ms;
		}

		.perspective:nth-child(5) {
			animation-delay: 180ms;
		}

		.perspective:nth-child(6) {
			animation-delay: 225ms;
		}

		.perspective:nth-child(7) {
			animation-delay: 270ms;
		}

		.perspective:nth-child(8) {
			animation-delay: 315ms;
		}

		.perspective:nth-child(9) {
			animation-delay: 360ms;
		}
	}

	@keyframes perspective-enter {
		from {
			transform: translateY(8px);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>

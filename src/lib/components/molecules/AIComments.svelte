<!-- src/lib/components/molecules/AIComments.svelte -->
<!--
  A secondary comparison set shown after the real community discussion.
  Cards share the same visual grammar as user takes while keeping their
  AI origin explicit.
-->
<script lang="ts">
	import PerspectivePreviewCard from './PerspectivePreviewCard.svelte';
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
</script>

{#if takes.length && parentType === 'question' && data?.flags?.userHasAnswered && showAiComments}
	<section class="nine-takes" aria-label="The nine takes">
		<header class="nine-takes__head">
			<h3 class="nine-takes__title">The nine takes</h3>
			<p class="nine-takes__sub">Nine patterns, nine reads on the same question.</p>
		</header>

		<div class="chorus-perspectives">
			{#each takes as take, index (take.id)}
				<PerspectivePreviewCard
					typeNumber={take.typeNumber}
					text={take.comment}
					source="ai"
					delay={index * 45}
				/>
			{/each}
		</div>
	</section>
{/if}

<style>
	.nine-takes {
		margin: 0.9rem 0 0;
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
</style>

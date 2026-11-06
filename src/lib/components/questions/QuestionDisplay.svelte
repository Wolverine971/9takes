<!-- src/lib/components/questions/QuestionDisplay.svelte -->
<script lang="ts">
	interface Props {
		question: {
			id: string;
			url: string;
			question: string;
			question_formatted?: string;
		};
		addQuestionMark?: boolean;
		/** `card` (print-outs) or `poster` (the question page's headline). */
		variant?: 'card' | 'poster';
	}

	let { question, addQuestionMark = false, variant = 'card' }: Props = $props();

	// Tier by text length (known at SSR time); viewport scaling is pure CSS via
	// clamp(), so the server renders the correct size at every width. Replaces
	// a JS innerWidth-driven table that SSR'd the desktop size for everyone and
	// swapped after hydration (design audit 2026-06-09).
	// clamp ranges preserve the old table's mobile (≤500px) and desktop (>1024px)
	// endpoints, interpolating between ~400px and ~1100px viewports.
	const SIZE_TIERS: Array<{ maxLength: number; size: string }> = [
		{ maxLength: 45, size: 'clamp(1.5rem, 1.07rem + 1.71vw, 2.25rem)' },
		{ maxLength: 60, size: 'clamp(1.375rem, 1.02rem + 1.43vw, 2rem)' },
		{ maxLength: 80, size: 'clamp(1.25rem, 0.89rem + 1.43vw, 1.875rem)' },
		{ maxLength: 105, size: 'clamp(1.125rem, 0.77rem + 1.43vw, 1.75rem)' },
		{ maxLength: 130, size: 'clamp(1rem, 0.64rem + 1.43vw, 1.625rem)' },
		{ maxLength: 150, size: 'clamp(0.9375rem, 0.62rem + 1.29vw, 1.5rem)' },
		{ maxLength: 200, size: 'clamp(0.875rem, 0.59rem + 1.14vw, 1.375rem)' },
		{ maxLength: 250, size: 'clamp(0.875rem, 0.66rem + 0.86vw, 1.25rem)' },
		{ maxLength: 300, size: 'clamp(0.8125rem, 0.63rem + 0.71vw, 1.125rem)' }
	];

	function calculateFontSize(text: string): string {
		for (const tier of SIZE_TIERS) {
			if (text.length < tier.maxLength) return tier.size;
		}
		// Very long text
		return 'clamp(0.8rem, 0.66rem + 0.5vw, 1rem)';
	}

	// Must come after SIZE_TIERS: $derived evaluates eagerly during SSR, and a
	// const referenced before its declaration throws (took down every question
	// detail page; caught in the 2026-06-11 mobile audit).
	let fontSize = $derived(question.question ? calculateFontSize(question.question) : '2rem');

	// Poster sizes step down with length so a long question still leaves the
	// composer on a phone's first screen.
	let posterTier = $derived.by(() => {
		const length = (question.question_formatted || question.question || '').length;
		return length < 70 ? 'short' : length < 140 ? 'medium' : length < 200 ? 'long' : 'xlong';
	});
</script>

{#if variant === 'poster'}
	<h1 class={['question-poster', `question-poster--${posterTier}`]} itemprop="name">
		{question.question_formatted ||
			question.question}{#if !question.question_formatted && addQuestionMark}?{/if}
	</h1>
{:else}
	<div
		class="question-display-card relative overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-4 py-6 sm:p-6"
	>
		<h1
			class="relative m-0 w-full text-center font-bold leading-snug text-[var(--text)]"
			style="font-size: {fontSize};"
			itemprop="name"
		>
			{question.question_formatted || question.question}
			{#if !question.question_formatted && addQuestionMark}?{/if}
		</h1>
	</div>
{/if}

<style>
	.question-poster {
		--poster-size: clamp(2.125rem, 1.4rem + 2.9vw, 3.75rem);
		margin: 0;
		max-width: 22ch;
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 500;
		font-size: var(--poster-size);
		line-height: 1.06;
		letter-spacing: -0.01em;
		color: var(--text);
		text-wrap: balance;
		overflow-wrap: anywhere;
	}
	.question-poster--medium {
		--poster-size: clamp(1.75rem, 1.25rem + 2vw, 2.875rem);
		max-width: 28ch;
		line-height: 1.1;
	}
	.question-poster--long {
		--poster-size: clamp(1.375rem, 1.1rem + 1.2vw, 2.125rem);
		max-width: 36ch;
		line-height: 1.18;
	}
	.question-poster--xlong {
		--poster-size: clamp(1.25rem, 1.05rem + 0.8vw, 1.75rem);
		max-width: 44ch;
		line-height: 1.22;
	}
</style>

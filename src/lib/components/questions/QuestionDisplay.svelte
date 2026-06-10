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
	}

	let { question, addQuestionMark = false }: Props = $props();

	let fontSize = $derived(question.question ? calculateFontSize(question.question) : '2rem');

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
</script>

<div
	class="question-display-card relative overflow-hidden rounded-xl border border-[var(--stone-edge)] bg-[var(--stone-warm)] px-4 py-6 sm:p-6"
>
	<h1
		class="relative m-0 w-full text-center font-bold leading-snug text-[var(--ink-bright)]"
		style="font-size: {fontSize};"
		itemprop="name"
	>
		{question.question_formatted || question.question}
		{#if !question.question_formatted && addQuestionMark}?{/if}
	</h1>
</div>

<!-- src/lib/components/questions/QuestionDisplay.svelte -->
<script lang="ts">
	import { viewportWidth } from '$lib/stores/viewport';

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

	// Use shared viewport store
	let innerWidth = $derived($viewportWidth);
	let fontSize = $derived(question.question ? calculateFontSize(question.question) : '2rem');

	type Question = {
		id: string;
		url: string;
		question: string;
		question_formatted?: string;
	};

	function calculateFontSize(text: Question['question']): string {
		// Optimized breakpoints for better desktop readability
		const breakpoints = {
			xs: {
				length: 45,
				size:
					innerWidth > 1024
						? '2.25rem'
						: innerWidth > 768
							? '2rem'
							: innerWidth > 500
								? '1.75rem'
								: '1.5rem'
			},
			sm: {
				length: 60,
				size:
					innerWidth > 1024
						? '2rem'
						: innerWidth > 768
							? '1.875rem'
							: innerWidth > 500
								? '1.625rem'
								: '1.375rem'
			},
			md: {
				length: 80,
				size:
					innerWidth > 1024
						? '1.875rem'
						: innerWidth > 768
							? '1.75rem'
							: innerWidth > 500
								? '1.5rem'
								: '1.25rem'
			},
			lg: {
				length: 105,
				size:
					innerWidth > 1024
						? '1.75rem'
						: innerWidth > 768
							? '1.625rem'
							: innerWidth > 500
								? '1.375rem'
								: '1.125rem'
			},
			xl: {
				length: 130,
				size:
					innerWidth > 1024
						? '1.625rem'
						: innerWidth > 768
							? '1.5rem'
							: innerWidth > 500
								? '1.25rem'
								: '1rem'
			},
			xxl: {
				length: 150,
				size:
					innerWidth > 1024
						? '1.5rem'
						: innerWidth > 768
							? '1.375rem'
							: innerWidth > 500
								? '1.125rem'
								: '0.9375rem'
			},
			xxxl: {
				length: 200,
				size:
					innerWidth > 1024
						? '1.375rem'
						: innerWidth > 768
							? '1.25rem'
							: innerWidth > 500
								? '1rem'
								: '0.875rem'
			},
			huge: {
				length: 250,
				size:
					innerWidth > 1024
						? '1.25rem'
						: innerWidth > 768
							? '1.125rem'
							: innerWidth > 500
								? '0.9375rem'
								: '0.875rem'
			},
			massive: {
				length: 300,
				size:
					innerWidth > 1024
						? '1.125rem'
						: innerWidth > 768
							? '1rem'
							: innerWidth > 500
								? '0.875rem'
								: '0.8125rem'
			}
		};

		// Find the appropriate size
		for (const [key, value] of Object.entries(breakpoints)) {
			if (text.length < value.length) {
				return value.size;
			}
		}

		// Default size for very long text
		return innerWidth > 500 ? '1rem' : '0.8rem';
	}
</script>

<div
	class="question-display-card bg-[var(--bg-surface)]/70 relative overflow-hidden rounded-2xl border border-[var(--primary-subtle)] px-4 py-6 shadow-[var(--glow-sm)] backdrop-blur-md sm:p-6"
>
	<h1
		class="relative m-0 w-full text-center font-bold leading-snug text-[var(--text-primary)] drop-shadow-[0_0_12px_var(--primary-glow)]"
		style="font-size: {fontSize};"
		itemprop="name"
	>
		{question.question_formatted || question.question}
		{#if !question.question_formatted && addQuestionMark}?{/if}
	</h1>
</div>

<style>
	.question-display-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: radial-gradient(ellipse at 50% 0%, rgba(45, 212, 191, 0.08) 0%, transparent 60%);
		pointer-events: none;
	}
</style>

<!-- src/lib/components/questions/QuestionItem.svelte -->
<script lang="ts">
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { viewportWidth } from '$lib/stores/viewport';

	export let questionData: {
		id: number;
		url: string;
		question_formatted?: string;
		question: string;
		comment_count: number;
		created_at: string;
	};
	export let showDetails = true;

	let commentColor = '#a78bfa'; // Purple-400 for dark theme
	let hovered = false;

	// Use shared viewport store
	$: innerWidth = $viewportWidth;

	// Format date - use Intl.DateTimeFormat for efficiency
	$: formattedDate = formatDate(questionData.created_at, innerWidth > 400);

	function formatDate(dateString: string, showYear: boolean): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		const month = date.getUTCMonth() + 1;
		const day = date.getUTCDate();
		const year = date.getUTCFullYear();
		return showYear ? `${month}/${day}/${year}` : `${month}/${day}`;
	}

	// Precomputed question text for display
	$: displayQuestion = questionData.question_formatted || questionData.question;

	// Memoize hover/leave handlers
	const handleMouseEnter = () => {
		hovered = true;
		commentColor = '#c4b5fd'; // Purple-300 for hover
	};
	const handleMouseLeave = () => {
		hovered = false;
		commentColor = '#a78bfa'; // Purple-400 for dark theme
	};
</script>

<a
	href="/questions/{questionData.url}"
	class="greek-question-card my-1 flex min-h-12 transform-gpu cursor-pointer items-center justify-between gap-2 rounded px-3 py-2.5 text-inherit no-underline transition-all duration-200 will-change-auto sm:px-4 sm:py-3"
	class:focus:outline-primary-light={true}
	class:focus:outline-offset-2={true}
	class:w-full={showDetails}
	data-sveltekit-preload-data="tap"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	aria-label="View question: {displayQuestion}"
>
	<div class="question-content flex-1">
		<!-- Optional philosopher quote mark -->
		<div class="flex items-start">
			<p
				class="font-greek-body m-0 line-clamp-2 overflow-hidden text-ellipsis break-words text-sm sm:text-base"
				style:--tag={`h-question-${questionData.question.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}
			>
				{displayQuestion}
			</p>
		</div>
	</div>

	{#if showDetails}
		<div
			class="xs:flex-row xs:items-center xs:gap-2 flex flex-shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center"
		>
			<span
				class="flex min-w-[2rem] items-center text-xs font-bold text-slate-200 sm:min-w-[2.5rem] sm:text-sm"
			>
				<span class="min-w-3 text-right sm:min-w-4">{questionData.comment_count || ''}</span>
				<MasterCommentIcon
					iconStyle="margin-left: 0.25rem; min-width: 1rem; min-height: 1rem;"
					height="1rem"
					fill={commentColor}
					type={questionData.comment_count ? 'multiple' : 'empty'}
				/>
			</span>
			<span
				class="xs:min-w-14 xs:px-2 flex min-w-12 justify-center rounded border border-slate-600 bg-[#12121a] px-1.5 py-0.5 text-center text-xs text-slate-300 sm:min-w-16 sm:text-sm"
			>
				{formattedDate}
			</span>
		</div>
	{/if}
</a>

<style>
	/* Solo Leveling dark theme styles for question cards */
	:global(.greek-question-card) {
		@apply relative overflow-hidden shadow-sm;
		background-color: #1a1a2e;
		border-left: 3px solid #7c3aed;
		color: #e2e8f0;
	}

	:global(.greek-question-card:hover) {
		border-left: 3px solid #a78bfa;
		background: linear-gradient(to right, rgba(124, 58, 237, 0.1), rgba(26, 26, 46, 1));
		box-shadow: 0 0 15px rgba(124, 58, 237, 0.2);
	}

	.question-content {
		position: relative;
	}

	.question-quote {
		font-size: 1.5rem;
		line-height: 1;
		transition: opacity 0.3s ease;
	}

	.question-hover-text {
		opacity: 0;
		height: 0;
		transition:
			opacity 0.3s ease,
			height 0.3s ease;
		overflow: hidden;
	}

	:global(.greek-question-card:hover) .question-hover-text {
		opacity: 0.9;
		height: 1.2em;
	}

	/* Add responsive utilities for extra small screens */
	@media (max-width: 576px) {
		.xs\:flex-col {
			flex-direction: column;
		}

		.xs\:items-end {
			align-items: flex-end;
		}

		.xs\:gap-1 {
			gap: 0.25rem;
		}

		.xs\:py-0\.5 {
			padding-top: 0.125rem;
			padding-bottom: 0.125rem;
		}

		.xs\:px-2 {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}

		.xs\:text-xs {
			font-size: 0.75rem;
			line-height: 1rem;
		}

		.xs\:min-w-14 {
			min-width: 3.5rem;
		}
	}

	/* For reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.duration-200 {
			transition-duration: 0s;
		}

		:global(.greek-question-card:hover) .question-hover-text,
		.question-hover-text,
		.question-quote {
			transition: none;
		}
	}

	/* Add in Tailwind's built-in line-clamp if unavailable */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	:global(.greek-circle) {
		@apply rounded-full shadow-sm transition-all duration-300;
		border: 1px solid #334155;
	}

	:global(.greek-question-card:hover .greek-circle) {
		background-color: rgba(124, 58, 237, 0.2) !important;
	}
</style>

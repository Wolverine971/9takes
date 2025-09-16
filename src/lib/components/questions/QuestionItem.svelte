<!-- src/lib/components/questions/QuestionItem.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { browser } from '$app/environment';

	export let questionData: {
		id: string;
		url: string;
		question_formatted: string;
		question: string;
		comment_count: number;
		created_at: string;
	};
	export let showDetails = true;

	let innerWidth = 0;
	let commentColor = '#a29bfe'; // Primary light color - will be replaced with Tailwind classes
	let hovered = false;

	// Format date using date format cache to avoid repeated calculations
	const dateFormatCache = new Map();
	$: formattedDate = getFormattedDate(questionData.created_at, innerWidth);

	function getFormattedDate(dateString: string, width: number): string {
		if (!dateString) return '';

		const cacheKey = `${dateString}-${width > 400 ? 'large' : 'small'}`;
		if (dateFormatCache.has(cacheKey)) {
			return dateFormatCache.get(cacheKey);
		}

		const date = new Date(dateString);
		const month = date.getUTCMonth() + 1;
		const day = date.getUTCDate();
		const year = date.getUTCFullYear();
		const formatted = `${month}/${day}${width > 400 ? '/' + year : ''}`;

		dateFormatCache.set(cacheKey, formatted);
		return formatted;
	}

	onMount(() => {
		// Initialize width immediately to prevent layout shift
		innerWidth = window.innerWidth;

		// Use ResizeObserver for better performance
		if (browser && 'ResizeObserver' in window) {
			const resizeObserver = new ResizeObserver((entries) => {
				// Throttled update
				requestAnimationFrame(() => {
					innerWidth = window.innerWidth;
				});
			});

			resizeObserver.observe(document.documentElement);
			return () => resizeObserver.disconnect();
		} else {
			// Fallback to throttled resize event
			let resizeTimeout: ReturnType<typeof setTimeout>;
			const handleResize = () => {
				if (resizeTimeout) clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(() => {
					innerWidth = window.innerWidth;
				}, 100);
			};

			window.addEventListener('resize', handleResize, { passive: true });
			return () => {
				if (resizeTimeout) clearTimeout(resizeTimeout);
				window.removeEventListener('resize', handleResize);
			};
		}
	});

	// Precomputed question text for display
	$: displayQuestion = questionData.question_formatted || questionData.question;

	// Memoize hover/leave handlers
	const handleMouseEnter = () => {
		hovered = true;
		commentColor = '#6c5ce7'; // Primary color - will be replaced with Tailwind classes
	};
	const handleMouseLeave = () => {
		hovered = false;
		commentColor = '#a29bfe'; // Primary light color - will be replaced with Tailwind classes
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
				class="flex min-w-[2rem] items-center text-xs font-bold text-gray-800 sm:min-w-[2.5rem] sm:text-sm"
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
				class="xs:min-w-14 xs:px-2 flex min-w-12 justify-center rounded border border-neutral-300 bg-white px-1.5 py-0.5 text-center text-xs sm:min-w-16 sm:text-sm"
			>
				{formattedDate}
			</span>
		</div>
	{/if}
</a>

<style>
	/* Greek-inspired styles for question cards - converted to use Tailwind theme colors */
	:global(.greek-question-card) {
		@apply relative overflow-hidden bg-white shadow-sm;
		border-left: 3px solid theme('colors.primary.400');
	}

	:global(.greek-question-card:hover) {
		border-left: 3px solid theme('colors.primary.700');
		background: linear-gradient(to right, rgba(247, 247, 255, 0.9), rgba(255, 255, 255, 1));
		@apply shadow-md;
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
		@apply rounded-full border border-neutral-200 shadow-sm transition-all duration-300;
	}

	:global(.greek-question-card:hover .greek-circle) {
		@apply bg-primary-100 !important;
	}
</style>

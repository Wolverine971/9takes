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
	let commentColor = '#B3A6C9';

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
	const handleMouseEnter = () => (commentColor = '#833BFF');
	const handleMouseLeave = () => (commentColor = '#B3A6C9');
</script>

<a
	href="/questions/{questionData.url}"
	class="my-0.5 flex min-h-12 transform-gpu cursor-pointer items-center justify-between gap-2 rounded border border-transparent px-4 py-2 text-inherit no-underline transition-colors duration-200 will-change-auto"
	class:shimmer-button={innerWidth > 1500}
	class:border-accent={showDetails}
	class:hover:bg-gray-200={true}
	class:hover:border-primary-light={true}
	class:focus:outline-primary-light={true}
	class:focus:outline-offset-2={true}
	class:w-full={showDetails}
	data-sveltekit-preload-data="tap"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	aria-label="View question: {displayQuestion}"
>
	<p class="m-0 line-clamp-2 flex-1 overflow-hidden text-ellipsis break-words">
		{displayQuestion}
	</p>
	{#if showDetails}
		<div
			class="xs:flex-col xs:items-end xs:gap-1 flex flex-shrink-0 items-center gap-2 sm:flex-row sm:items-center"
		>
			<span class="flex min-w-[2.5rem] items-center font-bold text-gray-800">
				<span class="min-w-4 text-right">{questionData.comment_count || ''}</span>
				<MasterCommentIcon
					iconStyle="margin-left: 0.25rem; min-width: 1.25rem; min-height: 1.25rem;"
					height="1.25rem"
					fill={commentColor}
					type={questionData.comment_count ? 'multiple' : 'empty'}
				/>
			</span>
			<span
				class="xs:py-0.5 xs:px-2 xs:text-xs xs:min-w-14 flex min-w-16 justify-center rounded border border-white px-0.5 py-0.5 text-center text-sm"
			>
				{formattedDate}
			</span>
		</div>
	{/if}
</a>

<style>
	/* Only adding styles that can't be easily done with Tailwind */
	.border-accent {
		border-color: var(--accent);
	}

	.border-primary-light {
		border-color: var(--primary-light);
	}

	.outline-primary-light {
		outline: 2px solid var(--primary-light);
	}

	/* Add in Tailwind's built-in line-clamp if unavailable */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
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
	}
</style>

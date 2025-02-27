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
	class="question-card"
	class:shimmer-button={innerWidth > 1500}
	class:question-card-details={showDetails}
	data-sveltekit-preload-data="tap"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	aria-label="View question: {displayQuestion}"
>
	<p class="question-display">
		{displayQuestion}
	</p>
	{#if showDetails}
		<div class="meta-info">
			<span class="comment-span-display">
				<span class="comment-count">{questionData.comment_count || ''}</span>
				<MasterCommentIcon
					iconStyle="margin-left: 0.25rem; min-width: 1.25rem; min-height: 1.25rem;"
					height="1.25rem"
					fill={commentColor}
					type={questionData.comment_count ? 'multiple' : 'empty'}
				/>
			</span>
			<span class="date-span">
				{formattedDate}
			</span>
		</div>
	{/if}
</a>

<style lang="scss">
	/* Variables */
	$spacing-xs: 0.25rem;
	$spacing-sm: 0.5rem;
	$spacing-md: 1rem;
	$border-radius: var(--base-border-radius, 3px);
	$transition-duration: 0.2s;
	$breakpoint-sm: 576px;

	/* Card styling */
	.question-card {
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: $spacing-sm $spacing-md;
		margin: $spacing-xs 0;
		border-radius: $border-radius;
		border: 1px solid transparent;
		transition:
			background-color $transition-duration ease,
			border-color $transition-duration ease;
		text-decoration: none;
		color: inherit;
		gap: $spacing-sm;
		will-change: background-color, border-color;
		transform: translateZ(0); /* Force GPU rendering */
		min-height: 3rem;
		contain: content; /* CSS containment for performance */

		&:hover {
			background-color: var(--base-white-outline, #cfcfcf);
			border-color: var(--color-theme-purple-light);
		}

		&:focus-visible {
			outline: 2px solid var(--color-theme-purple-light);
			outline-offset: 2px;
		}

		&.question-card-details {
			border-color: var(--accent);
			width: 100%;

			&:hover {
				border-color: var(--color-theme-purple-light);
			}
		}
	}

	.question-display {
		word-break: break-word;
		margin: 0;
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Meta information styling */
	.meta-info {
		display: flex;
		gap: $spacing-sm;
		align-items: center;
		flex-shrink: 0;
	}

	.comment-span-display {
		display: flex;
		align-items: center;
		font-weight: bold;
		color: var(--color-p-dark, #333);
		min-width: 2.5rem;
	}

	.comment-count {
		min-width: 1rem;
		text-align: right;
	}

	.date-span {
		border: 1px solid white;
		border-radius: $border-radius;
		padding: 0.2rem;
		min-width: 4rem;
		display: flex;
		justify-content: center;
		text-align: center;
		font-size: 0.9rem;
	}

	/* Responsive adjustments */
	@media (max-width: $breakpoint-sm) {
		.question-card {
			padding: $spacing-xs $spacing-sm;
			margin: $spacing-xs 0;
		}

		.meta-info {
			flex-direction: column;
			align-items: flex-end;
			gap: $spacing-xs;
		}

		.date-span {
			padding: 0.1rem 0.2rem;
			font-size: 0.8rem;
			min-width: 3.5rem;
		}
	}

	/* Optimize rendering performance */
	@media (prefers-reduced-motion: reduce) {
		.question-card {
			transition: none;
		}
	}
</style>

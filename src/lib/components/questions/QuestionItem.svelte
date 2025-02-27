<script lang="ts">
	import { onMount } from 'svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';

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
	let formattedDate = '';
	let commentColor = '#B3A6C9';

	// Format date only once on component initialization and when innerWidth changes
	$: formattedDate = formatDate(questionData.created_at, innerWidth);

	function formatDate(dateString: string, width: number): string {
		if (!dateString) return '';

		const date = new Date(dateString);
		const month = date.getUTCMonth() + 1;
		const day = date.getUTCDate();
		const year = date.getUTCFullYear();
		return `${month}/${day}${width > 400 ? '/' + year : ''}`;
	}

	onMount(() => {
		// Initialize width immediately to prevent layout shift
		innerWidth = window.innerWidth;

		// Throttled resize handler for better performance
		let resizeTimeout: ReturnType<typeof setTimeout>;
		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				innerWidth = window.innerWidth;
			}, 100);
		};

		window.addEventListener('resize', handleResize, { passive: true });

		return () => {
			clearTimeout(resizeTimeout);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<a
	href="/questions/{questionData.url}"
	class="question-card"
	class:shimmer-button={innerWidth > 1500}
	class:question-card-details={showDetails}
	data-sveltekit-preload-data="tap"
	on:mouseenter={() => (commentColor = '#833BFF')}
	on:mouseleave={() => (commentColor = '#B3A6C9')}
	aria-label="View question: {questionData.question_formatted || questionData.question}"
>
	<p class="question-display">
		{questionData.question_formatted || questionData.question}
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
	.question-card {
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		margin: 0.25rem 0;
		border-radius: 3px;
		border: 1px solid transparent;
		transition: all 0.2s ease;
		text-decoration: none;
		color: inherit;
		gap: 0.5rem;
		will-change: background-color, border-color;
		transform: translateZ(0); /* Force GPU rendering */
		min-height: 3rem; /* Fixed height to prevent layout shift */

		&:hover {
			background-color: var(--base-white-outline, #cfcfcf);
			border-color: var(--color-theme-purple-light);
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

	.meta-info {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		flex-shrink: 0; /* Prevent shrinking */
	}

	.comment-span-display {
		display: flex;
		align-items: center;
		font-weight: bold;
		color: var(--color-p-dark, #333);
		min-width: 2.5rem; /* Fixed width to prevent layout shift */
	}

	.comment-count {
		min-width: 1rem; /* Fixed width for number */
		text-align: right;
	}

	.date-span {
		border: 1px solid white;
		border-radius: var(--base-border-radius, 3px);
		padding: 0.2rem;
		min-width: 4rem; /* Smaller fixed width for better mobile layout */
		display: flex;
		justify-content: center;
		text-align: center;
	}

	@media (max-width: 576px) {
		.question-card {
			padding: 0.5rem 0.75rem;
			margin: 0.25rem 0 0.25rem 0;
		}

		.meta-info {
			flex-direction: column;
			align-items: flex-end;
			gap: 0.25rem;
		}

		.date-span {
			padding: 0.1rem 0.2rem;
			font-size: 0.85rem;
		}
	}

	/* Optimize rendering performance */
	@media (prefers-reduced-motion: reduce) {
		.question-card {
			transition: none;
		}
	}
</style>

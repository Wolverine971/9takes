<!-- src/lib/components/questions/QuestionItem.svelte -->
<script lang="ts">
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { viewportWidth } from '$lib/stores/viewport';

	export let questionData: {
		id: number;
		url: string | null;
		question_formatted?: string | null;
		question: string | null;
		comment_count: number | null;
		created_at: string | null;
	};
	export let showDetails = true;

	let commentColor = 'var(--lamp-glow)';
	let hovered = false;

	// Use shared viewport store
	$: innerWidth = $viewportWidth;

	// Format date - use Intl.DateTimeFormat for efficiency
	$: formattedDate = formatDate(questionData.created_at, innerWidth > 400);

	function formatDate(dateString: string | null, showYear: boolean): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		const month = date.getUTCMonth() + 1;
		const day = date.getUTCDate();
		const year = date.getUTCFullYear();
		return showYear ? `${month}/${day}/${year}` : `${month}/${day}`;
	}

	// Precomputed question text for display
	$: displayQuestion = questionData.question_formatted || questionData.question || '';

	// Memoize hover/leave handlers
	const handleMouseEnter = () => {
		hovered = true;
		commentColor = 'var(--lamp-glow)';
	};
	const handleMouseLeave = () => {
		hovered = false;
		commentColor = 'var(--lamp-glow)';
	};
</script>

<a
	href="/questions/{questionData.url}"
	class="greek-question-card my-1 flex min-h-12 transform-gpu cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2.5 text-inherit no-underline transition-all duration-200 will-change-auto sm:px-4 sm:py-3"
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
				style:--tag={`h-question-${(questionData.question ?? '').toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}
			>
				{displayQuestion}
			</p>
		</div>
	</div>

	{#if showDetails}
		<div class="flex flex-shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
			<span
				class="flex min-w-[2rem] items-center text-xs font-bold text-[var(--ink-bright)] sm:min-w-[2.5rem] sm:text-sm"
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
				class="xs:min-w-14 xs:px-2 bg-[var(--night-deep)]/60 flex min-w-12 justify-center rounded-md border border-[var(--lamp-soft)] px-1.5 py-0.5 text-center text-xs text-[var(--ink-mid)] sm:min-w-16 sm:text-sm"
			>
				{formattedDate}
			</span>
		</div>
	{/if}
</a>

<style>
	/* Solo Leveling dark theme styles for question cards */
	:global(.greek-question-card) {
		position: relative;
		overflow: hidden;
		background-color: var(--stone-warm);
		border-left: 3px solid color-mix(in srgb, var(--lamp-glow) 60%, transparent);
		border-radius: 0.625rem;
		color: var(--ink-bright);
	}

	:global(.greek-question-card:hover) {
		border-left: 3px solid var(--lamp-glow);
		background: linear-gradient(to right, var(--lamp-soft), var(--stone-warm));
		box-shadow: var(--glow-sm);
	}

	:global(.greek-question-card:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.question-content {
		position: relative;
	}

	/* Extra-small screens (no `xs` screen exists in the Tailwind config) */
	@media (max-width: 576px) {
		.xs\:px-2 {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
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

	/* Add in Tailwind's built-in line-clamp if unavailable */
	.line-clamp-2 {
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>

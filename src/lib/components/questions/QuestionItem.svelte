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

	let innerWidth: number;
	let formattedDate: string;

	$: formattedDate = formatDate(questionData.created_at, innerWidth);

	function formatDate(dateString: string, width: number): string {
		const date = new Date(dateString);
		const month = date.getUTCMonth() + 1;
		const day = date.getUTCDate();
		const year = date.getUTCFullYear();
		return `${month}/${day}${width > 400 ? '/' + year : ''}`;
	}

	onMount(() => {
		const updateWidth = () => (innerWidth = window.innerWidth);
		window.addEventListener('resize', updateWidth);
		updateWidth();
		return () => window.removeEventListener('resize', updateWidth);
	});
</script>

<a
	href="/questions/{questionData.url}"
	class="question-card"
	class:shimmer-button={innerWidth > 1500}
	class:question-card-details={showDetails}
	data-sveltekit-preload-data="tap"
>
	<p class="question-display" style:--tag={`h-question-${questionData.id}`}>
		{questionData.question_formatted || questionData.question}
	</p>
	{#if showDetails}
		<div class="meta-info">
			<span class="comment-span-display" style:--tag={`a-comment${questionData.id}`}>
				{questionData.comment_count || ''}
				<MasterCommentIcon
					iconStyle="margin-left: .5rem"
					height="1.5rem"
					fill={questionData.comment_count ? 'var(--primary)' : ''}
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		margin: 0.25rem 0;
		border-radius: 3px;
		border: 1px solid transparent;
		transition: all 0.3s ease;
		text-decoration: none;
		color: inherit;

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
	}

	.meta-info {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.comment-span-display {
		display: flex;
		align-items: center;
		font-weight: bold;
		color: var(--color-p-dark, #333);
	}

	.date-span {
		border: 1px solid white;
		border-radius: var(--base-border-radius, 3px);
		padding: 0.3rem;
		min-width: 47px;
		display: flex;
		justify-content: center;
	}

	@media (max-width: 576px) {
		.question-card {
			padding: 0.5rem 0.75rem;
			margin: 0.25rem 0 0.25rem 0.5rem;
			min-height: 3rem;
		}

		.meta-info {
			flex-direction: column;
			align-items: flex-end;
		}
	}
</style>

<script lang="ts">
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';

	export let questionData: any;
	export let showDetails = true;
	let innerWidth = 0;

	const dateObj = new Date(questionData?.created_at);
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newDate = `${month}/${day}${innerWidth > 400 ? '/' + year : ''}`;
</script>

<svelte:window bind:innerWidth />

<div style="display: flex; justify-content: flex-start; align-items: center;">
	<a
		href="/questions/{questionData.url}"
		class="question-card {innerWidth > 1500 && 'shimmer-button'} {showDetails &&
			'question-card-details'}"
		data-sveltekit-preload-data="tap"
	>
		<p class="question-display" style:--tag={`h-question-${questionData.id}`}>
			{questionData.question_formatted || questionData.question}
		</p>
		{#if showDetails}
			<div class="small-div">
				<span class="comment-span-display" style:--tag={`a-comment${questionData.id}`}>
					{#if questionData.comment_count}
						{questionData.comment_count}
					{/if}
					<MasterCommentIcon
						iconStyle={'margin-left: .5rem'}
						height={'1.5rem'}
						fill={questionData.comment_count ? '#5407d9' : ''}
						type={questionData.comment_count ? 'multiple' : 'empty'}
					/>
				</span>
				<span class="date-span">
					{newDate}
				</span>
			</div>
		{/if}
	</a>
</div>

<style lang="scss">
	.comment-span-display {
		display: flex;
		justify-content: space-between;
		font-weight: bold;
		color: var(--color-p-dark); //var(--color-theme-purple);
	}

	.question-display {
		word-break: break-word;
	}
	.date-span {
		// position: absolute;
		// top: -1px;
		// right: -1px;
		// border-radius: 0 0 0 5px;
		text-decoration: none;
		border: 1px solid white;
		border-radius: var(--base-border-radius);
		word-break: keep-all;
		padding: 0.3rem;
		min-width: 47px;
		display: flex;
		justify-content: center;
	}
	.small-div {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.question-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
		position: relative;
		margin: 0.25rem 0 0.25rem 0;
		padding: 0 1rem;
		border-top: 1px solid transparent;
		border-bottom: 1px solid transparent;
		border-radius: 3px;
		// border: var(--classic-border);
		// box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
		// 	0 1px 5px 0 rgb(0 0 0 / 12%);
	}
	.question-card-details {
		border: 1px solid white;
		width: 100%;
	}

	.question-card-details:hover {
		border: 1px solid var(--color-theme-purple-light);
	}

	.question-card:hover {
		// background-color: rgba(255, 255, 255, 0.5);
		// background-color: var(--color-theme-purple-light);

		// background-color: rgb(207, 198, 255, 0.5);
		background-color: #cfcfcf; // var(--base-white-outline);
		// border: 0.1px solid var(--color-theme-purple-light);
		// box-shadow: 0 2px 0px -1px var(--color-theme-purple-light),
		// 	0 3px 3px 1px var(--color-theme-purple-light), 0 1px 5px 0 var(--color-theme-purple-light);
		border-bottom: 1px solid var(--color-theme-purple-light);
		border-top: 1px solid var(--color-theme-purple-light);
		// border-left: 1px solid var(--color-theme-purple-light);
		text-decoration: none;
		// box-shadow: inset 0.2em 0.2em 0.2em var(--color-theme-purple-light);
	}

	@media all and (max-width: 576px) {
		.small-div {
			flex-direction: column;
			margin: 0.5rem 0;
		}
		.question-display {
			margin: 0;
		}
		.question-card {
			// margin: 0.25rem;
			// padding: 0.25rem;
			margin: 0.25rem 0 0.25rem 0.5rem;
			padding: 0 0.75rem;
			min-height: 3rem;
		}
	}
</style>

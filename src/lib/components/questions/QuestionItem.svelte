<script lang="ts">
	import MasterCommentIcon from '../icons/masterCommentIcon.svelte';

	export let questionData: any;

	const dateObj = new Date(questionData.created_at);
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newdate = month + '/' + day + '/' + year;
</script>

<a
	href="/questions/{questionData.url}"
	style=""
	class="question-card"
	style:--tag="h-{questionData.question}"
>
	<p class="question-display" style:--tag={questionData.question}>
		{questionData.question}
	</p>
	<div class="small-div">
		<span class="comment-span-display">
			{#if questionData.comment_count}
				{questionData.comment_count}
			{/if}
			<!-- <CommentsIcon  /> -->
			<MasterCommentIcon
				iconStyle={'margin-left: .5rem'}
				height={'1.5rem'}
				fill={questionData.comment_count ? '#5407d9' : ''}
				type={questionData.comment_count ? 'multiple' : 'empty'}
			/>
		</span>
		<span class="date-span">
			{newdate}
		</span>
	</div>
</a>

<style lang="scss">
	.comment-span-display {
		display: flex;
		justify-content: space-between;
		font-weight: bold;
		color: var(--color-p-dark); //var(--color-theme-purple);
	}

	.question-display {
		word-break: break-word;
		align-self: flex-start;
	}
	.date-span {
		// position: absolute;
		// top: -1px;
		// right: -1px;
		// border-radius: 0 0 0 5px;
		text-decoration: none;
		border: var(--classic-border);
		border-radius: 5px;
		word-break: keep-all;

		padding: 0.3rem;
	}
	.small-div {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.question-card {
		display: flex;
		// flex-direction: column;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
		position: relative;
		margin: var(--card-margin);
		padding: var(--card-padding);
		box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
			0 1px 5px 0 rgb(0 0 0 / 12%);
	}
	.question-card:hover {
		// background-color: rgba(255, 255, 255, 0.5);
		// background-color: var(--color-p-light);

		// background-color: rgb(207, 198, 255, 0.5);
		background-color: var(--color-bg-0);
		// border: 0.1px solid var(--color-theme-purple-v);
		box-shadow: 0 2px 0px -1px var(--color-p-light), 0 3px 3px 1px var(--color-p-light),
			0 1px 5px 0 var(--color-p-light);
		text-decoration: none;
		// box-shadow: inset 0.2em 0.2em 0.2em var(--color-theme-purple-v);
	}

	@media all and (max-width: 576px) {
		.small-div {
			flex-direction: column;
			margin: 1rem;
			width: 20%;
		}
		.question-display {
			width: 80%;
		}
	}
</style>

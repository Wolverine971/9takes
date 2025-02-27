<script lang="ts">
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { convertDateToReadable } from '../../../utils/conversions';

	export let questionData: any;

	const newdate = convertDateToReadable(questionData.created_at);
</script>

<a href="/questions/{questionData.url}" style="" class="question-card">
	<p class="question-display">
		{questionData.question_formatted}
	</p>
	<div class="small-div">
		<span class="comment-span-display">
			{#if questionData.comment_count}
				{questionData.comment_count}
			{/if}
			<MasterCommentIcon
				iconStyle={'margin-left: .5rem'}
				height={'1.5rem'}
				fill={questionData.comment_count ? 'var(--primary)' : ''}
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
		color: var(--color-p-dark); //var(--primary);
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
	}
	.small-div {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.question-card {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
		position: relative;
		margin: var(--card-margin);
		padding: var(--card-padding);
		box-shadow:
			0 3px 1px -2px rgb(0 0 0 / 20%),
			0 2px 2px 0 rgb(0 0 0 / 14%),
			0 1px 5px 0 rgb(0 0 0 / 12%);
	}
	.question-card:hover {
		background-color: #cfcfcf; // var(--base-white-outline);
		box-shadow:
			0 2px 0px -1px var(--primary-light),
			0 3px 3px 1px var(--primary-light),
			0 1px 5px 0 var(--primary-light);
		text-decoration: none;
	}

	@media all and (max-width: 576px) {
		.small-div {
			flex-direction: column;
			margin: 0.5rem;
			width: 20%;
		}
		.question-display {
			width: 80%;
			margin: 0;
		}
		.question-card {
			margin: 0.5rem;
			padding: 0.5rem;
		}
	}
</style>

<script lang="ts">
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { createEventDispatcher } from 'svelte';

	export let questionData: any;
	export let isAdmin: boolean;

	const dateObj = new Date(questionData.created_at);
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newdate = month + '/' + day + '/' + year;

	const dispatch = createEventDispatcher();

	const remove = async () => {
		let body = new FormData();
		body.append('questionId', questionData.id);

		const resp = await fetch('/questions?/remove', {
			method: 'POST',
			body
		});

		dispatch('questionRemoved');
	};
</script>

<div style="display: flex; justify-content: center; align-items: center;">
	<a href="/questions/{questionData.url}" class="question-card">
		<p class="question-display" style:--tag={`h-question-${questionData.id}`}>
			{questionData.question_formatted || questionData.question}
		</p>
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
				{newdate}
			</span>
		</div>
	</a>
	{#if isAdmin}
		<button
			class="btn btn-primary"
			type="button"
			style="height: 3rem;"
			on:click={async () => {
				await remove();
			}}
		>
			Remove
		</button>
	{/if}
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
		width: 100%;
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
		background-color: var(--color-paladin-1);
		// border: 0.1px solid var(--color-theme-purple-v);
		box-shadow: 0 2px 0px -1px var(--color-p-light), 0 3px 3px 1px var(--color-p-light),
			0 1px 5px 0 var(--color-p-light);
		text-decoration: none;
		// box-shadow: inset 0.2em 0.2em 0.2em var(--color-theme-purple-v);
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

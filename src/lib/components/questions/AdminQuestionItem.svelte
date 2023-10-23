<script lang="ts">
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	import XmarkIcon from '$lib/components/icons/xmarkIcon.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

	export let questionData: any;
	export let isAdmin: boolean;
	let innerWidth = 0;

	const dateObj = new Date(questionData?.created_at);
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newDate = `${month}/${day}${innerWidth > 400 ? '/' + year : ''}`;
	console.log('questionData', questionData);

	let editing = false;

	const dispatch = createEventDispatcher();

	const remove = async () => {
		let body = new FormData();
		body.append('questionId', questionData.id);

		await fetch('/questions?/remove', {
			method: 'POST',
			body
		});

		dispatch('questionRemoved');
	};
</script>

<svelte:window bind:innerWidth />

<div style="display: flex; justify-content: center; align-items: center;">
	<div class="question-card">
		<a href="/questions/{questionData.url}" class="top-right">Go to</a>
		<div style="width: 60%;">
			<p class="question-display" style:--tag={`h-question-${questionData.id}`}>
				<b>Regular:</b>
				{questionData.question}
			</p>
			<p class="question-display">
				<b>Formatted:</b>
				{#if !editing}
					{questionData.question_formatted}
				{:else}
					<input bind:value={questionData.question_formatted} />
				{/if}
			</p>

			<div class="small-div">
				<span class="comment-span-display">
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
		</div>
		<div>
			<div class="small-div">
				<span class="">
					Flagged: {questionData.flagged}
				</span>
				<span class="">
					Removed: {questionData.removed}
				</span>
			</div>
			{#if questionData.question_tag.length}
				<div class="small-div ">
					Tags:
					<div class="tags-div">
						{#each questionData.question_tag as tag}
							<span class="tag">{tag.tag_name}</span>
						{/each}
					</div>
				</div>
			{:else}
				<span class="">
					Tagged: {questionData.tagged}
				</span>
			{/if}
		</div>

		{#if editing}
			<button
				class="btn btn-primary"
				type="button"
				style="padding: 0.25rem; display: flex;"
				on:click={async () => {
					getModal().open();
				}}
			>
				<XmarkIcon iconStyle={'padding: 0.25rem;'} height={'1rem'} fill={'red'} />
			</button>
		{/if}
		<button
			class="btn btn-primary bottom-right"
			type="button"
			style="padding: 0.25rem; display: flex;"
			on:click={async () => {
				editing = !editing;
			}}
		>
			{editing ? 'Editing' : 'Edit'}
		</button>
	</div>
	<!-- <button
		class="btn btn-primary"
		type="button"
		style="padding: 0.25rem; display: flex;"
		on:click={async () => {
			getModal().open();
		}}
	>
		<XmarkIcon iconStyle={'padding: 0.25rem;'} height={'1rem'} fill={'red'} />
	</button> -->

	<Modal2>
		<p>Kill it fr real?</p>
		<button
			class="btn btn-primary"
			type="button"
			style="padding: 0.25rem; display: flex;"
			on:click={async () => {
				await remove();
			}}
		>
			yes
		</button>
	</Modal2>
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

	.top-right {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0.25rem;
		border: var(--classic-border);
		border-radius: 0 0 0 5px;
	}
	.bottom-right {
		position: absolute;
		bottom: 0;
		right: 0;
		padding: 0.25rem;
		border: var(--classic-border);
		border-radius: 5px 0 0 0;
	}

	.tags-div {
		margin: 0.5rem;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		max-height: 50px;
		overflow-y: scroll;
		width: 200px;
	}

	.tag {
		border-radius: 5px;
		margin: 0.25rem;
		padding: 0.25rem;
		border: var(--classic-border);
		width: fit-content;
	}

	.small-div {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.question-card {
		width: 100%;
		display: flex;
		gap: 1rem;
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

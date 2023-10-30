<script lang="ts">
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import { createEventDispatcher } from 'svelte';
	import XmarkIcon from '$lib/components/icons/xmarkIcon.svelte';
	import EditIcon from '$lib/components/icons/editIcon.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

	export let questionData: any;
	export let isAdmin: boolean;

	export let tags: any[];

	let innerWidth = 0;
	let selectedTags = questionData.question_tag;

	const dateObj = new Date(questionData?.created_at);
	const month = dateObj.getUTCMonth() + 1; //months from 1-12
	const day = dateObj.getUTCDate();
	const year = dateObj.getUTCFullYear();
	const newDate = `${month}/${day}${innerWidth > 400 ? '/' + year : ''}`;
	console.log('questionData', questionData);

	let editing = false;

	$: selectedTags, checkTags();

	const checkTags = () => {
		console.log('selectedTags', selectedTags);
		tags = tags.filter((t: any) => {
			return !selectedTags.find((st: any) => st.tag_id === t.tag_id);
		});
	};

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

	const removeTag = async (tag: any) => {
		selectedTags = selectedTags.filter((t: any) => t.tag_id !== tag.tag_id);
	};
	const addTag = async (tag: any) => {
		selectedTags = [...selectedTags, tag];
		// tags = tags.filter((t: any) => t.tag_id !== tag.tag_id);
	};

	const save = async () => {
		let body = new FormData();
		body.append('questionId', questionData.id);
		body.append('flagged', questionData.flagged);
		body.append('removed', questionData.removed);
		body.append('question', questionData.question);
		body.append('question_formatted', questionData.question_formatted);
		body.append('tags', JSON.stringify(selectedTags));

		await fetch('/questions?/update', {
			method: 'POST',
			body
		});

		editing = false;
	};
</script>

<svelte:window bind:innerWidth />

<div style="display: flex; justify-content: center; align-items: center;">
	<div class="question-card">
		<a href="/questions/{questionData.url}" class="top-right">Go to</a>
		<div style="width: 60%;">
			<p class="question-display" style:--tag={`h-question-${questionData.id}`}>
				<b>Original:</b>
				{questionData.question}
			</p>
			<p class="question-display">
				<b>Formatted:</b>
				{#if !editing}
					{questionData.question_formatted}
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
			{#if selectedTags.length}
				<div class="small-div ">
					Selected Tags

					<div class="tags-div">
						{#each selectedTags as tag}
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
					getModal('kill-modal').open();
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
				getModal(`edit-modal-${questionData.id}`).open();
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

	<Modal2 id="kill-modal">
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

	<Modal2 id={`edit-modal-${questionData.id}`}>
		<div style="max-height: 500px;">
			<div style="max-width: 60%;">
				<div>
					<p class="question-display" style:--tag={`h-question-${questionData.id}`}>
						<b>Original:</b>
					</p>
					{questionData.question}
				</div>
				<div>
					<p class="question-display">
						<b>Formatted:</b>
					</p>
					<textarea bind:value={questionData.question_formatted} />
				</div>

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
					<div class="">
						Flagged:
						<button
							class="remove-tag-btn"
							type="button"
							on:click={() => {
								questionData.flagged = !questionData.flagged;
							}}
						>
							{questionData.flagged}
						</button>
					</div>
					<div class="">
						Removed:
						<button
							class="remove-tag-btn"
							type="button"
							on:click={() => {
								questionData.removed = !questionData.removed;
							}}
						>
							{questionData.removed}
						</button>
					</div>
				</div>

				<div>
					<h2>Selected Tags</h2>
					<div class="big-tags">
						{#if selectedTags?.length}
							{#each selectedTags as tag}
								<span class="tag"
									>{tag.tag_name}
									<button
										class="remove-tag-btn"
										type="button"
										on:click={() => {
											removeTag(tag);
										}}
									>
										<XmarkIcon iconStyle={''} height={'1rem'} fill={'red'} />
									</button>
								</span>
							{/each}
						{/if}
					</div>
				</div>

				<div>
					<h2>Add Tags</h2>
					<div class="big-tags">
						{#if tags?.length}
							{#each tags as tag}
								<button
									class="tag"
									type="button"
									on:click={() => {
										addTag(tag);
									}}
								>
									{tag.tag_name}
								</button>
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<button
				class="btn btn-primary save-btn"
				type="button"
				style="padding: 0.25rem; display: flex;"
				on:click={async () => {
					await save();
				}}
			>
				Save
			</button>
		</div>
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
		display: flex;
		align-items: center;
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
		color: var(--purple) !important;
		border-radius: 5px 0 0 0;
	}

	.tags-div {
		margin: 0.5rem;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		max-height: 100px;
		overflow-y: scroll;
	}

	.big-tags {
		display: flex;
		flex-wrap: wrap;
		max-width: 800px;
		max-height: 500px;
		overflow-y: scroll;
	}

	.tag {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 15px;
		font-size: 0.8rem;
		margin: 0.25rem;
		padding: 0.25rem;
		border: var(--classic-border);
		width: fit-content;
	}

	.save-btn {
		border: var(--classic-border);
		color: var(--purple);
		float: inline-end;
	}

	.remove-tag-btn {
		margin: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
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

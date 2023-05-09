<script lang="ts">
	import { deserialize, enhance } from '$app/forms';
	import BellIcon from '../icons/bellIcon.svelte';
	import CommentsIcon from '../icons/commentsIcon.svelte';
	import ShareIcon from '../icons/shareIcon.svelte';
	import ThumbsUpIcon from '../icons/thumbsUpIcon.svelte';
	import Comment from './Comment.svelte';

	import { notifications } from './notifications.js';

	let page = 0;

	export let data: any;

	/** @type {import('./$types').PageData} */
	// export let data: PageData;

	let comment: string;

	export let parentType: string;

	export const createComment = async () => {
		let body = new FormData();
		if (parentType === 'comment') {
			body.append('comment', comment);
			body.append('parent_id', data.id);
			body.append('author_id', data.session.user.id);
			body.append('parent_type', parentType);
			body.append('es_id', data.question.es_id);
		} else if (parentType === 'question') {
			body.append('comment', comment);
			body.append('parent_id', data.question.id);
			body.append('author_id', data.session.user.id);
			body.append('parent_type', parentType);
			body.append('es_id', data.question.es_id);
		}

		const resp = await fetch('?/createComment', {
			method: 'POST',
			body
		}).then(async (response) => {
			notifications.info('Comment Added', 3000);
		});
		comment = '';
	};
	const expand = () => {
		console.log('please-expand');
	};
</script>

<!-- 
	question popout
	either pop down under the question like fb
	or pop out in a dialog like qra
-->
<div class="actions">
	<button
		title="Comment"
		class="tablinks"
		style={parentType === 'question' ? '' : 'padding: 0.25rem;'}
		on:click={() => console.log('comment')}
	>
		{#if parentType === 'question'}
			Comment
		{/if}

		<CommentsIcon
			iconStyle={parentType === 'question' ? 'margin-left: .5rem;' : 'padding: 0.25rem;'}
			height={'1.5rem'}
			fill={''}
		/>
	</button>

	{#if parentType === 'question'}
		<button
			title="Subscribe"
			class="tablinks "
			style={parentType === 'question' ? '' : 'padding: 0.25rem;'}
			on:click={() => console.log('Subscribe')}
		>
			{#if parentType === 'question'}
				Subscribe
			{/if}
			<BellIcon
				iconStyle={parentType === 'question' ? 'margin-left: .5rem;' : 'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={''}
			/>
		</button>
	{/if}
	{#if parentType !== 'question'}
		<button
			title="Like"
			class="tablinks "
			style={parentType === 'question' ? '' : 'padding: 0.25rem;'}
			on:click={() => console.log('Subscribe')}
		>
			{#if parentType === 'question'}
				Like
			{/if}
			<ThumbsUpIcon
				iconStyle={parentType === 'question' ? 'margin-left: .5rem;' : 'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={''}
			/>
		</button>
	{/if}
	<button
		title="Share"
		class="tablinks "
		style={parentType === 'question' ? '' : 'padding: 0.25rem;'}
		on:click={() => console.log('share')}
	>
		{#if parentType === 'question'}
			Share
		{/if}
		<ShareIcon
			iconStyle={parentType === 'question' ? 'margin-left: .5rem;' : 'padding: 0.25rem;'}
			height={'1.5rem'}
			fill={''}
		/>
	</button>
</div>

<!-- <form class="interact-card">


	<div class="interact-text-container">
		<textarea placeholder="Speak your mind" class="interact-textbox" bind:value={comment} />
	</div>
	<button
		class="btn btn-primary"
		type="button"
		on:click={createComment}
		disabled={comment?.length < 1}
	>
		Submit Answer
	</button>
</form> -->
<style lang="scss">
	.actions {
		overflow: hidden;
		display: flex;
	}

	.actions button {
		background-color: var(--color-bg-0);
		// float: left;
		border: none;
		outline: none;
		cursor: pointer;
		padding: .5rem;
		transition: 0.3s;
		font-size: 1rem;
		border-radius: 5px;
	}

	/* Change background color of buttons on hover */
	.actions button:hover {
		background-color: var(--color-bg-0);
		border-radius: 5px;
		border: 1px solid var(--color-bg-2);
	}
	.tablinks {
		display: flex;
		margin: 0 0 0.25rem 0.25rem;
	}
	// .interact-card {
	// 	margin: 2rem;
	// 	padding: 1rem;
	// 	box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
	// 		0 1px 5px 0 rgb(0 0 0 / 12%);
	// }
	.interact-text-container {
		position: relative;
		width: 100%;
		height: 100px;
	}
	.interact-textbox {
		border-radius: 5px;
		box-sizing: border-box;
		padding: 1rem;
		width: 100%;
		/* max-width: 900px; */

		position: relative;
	}
	.interact-expand {
		z-index: 10;
		position: absolute;
		top: 5px;
		left: calc(100% - 73px);
	}
	.interact-button {
	}
</style>

<script lang="ts">
	import { deserialize, enhance } from '$app/forms';
	import BellIcon from '../icons/bellIcon.svelte';
	import CommentsIcon from '../icons/commentsIcon.svelte';
	import ShareIcon from '../icons/shareIcon.svelte';
	import ThumbsUpIcon from '../icons/thumbsUpIcon.svelte';
	import RightIcon from '../icons/rightIcon.svelte';

	import { notifications } from './notifications.js';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let page = 0;

	export let data: any;
	export let user: any;

	// update this to like_count and add boolean for if user liked
	let likes: any[] = data.comment_like ? [...data.comment_like] : [];
	let subscriptions: any[] = data?.question?.subscriptions
		? [...data?.question?.subscriptions]
		: [];

	console.log(likes);

	/** @type {import('./$types').PageData} */
	// export let data: PageData;

	$: data, watchData();

	const watchData = () => {
		console.log('interact data change');

		console.log(data.comment_like);
		likes = data.comment_like ? [...data.comment_like] : [];
		subscriptions = data?.question?.subscriptions ? [...data?.question?.subscriptions] : [];
	};

	let comment: string = '';
	let commenting: boolean = false;

	export let parentType: string;

	const createComment = async () => {
		let body = new FormData();
		if (parentType === 'comment') {
			console.log('send comment');
			body.append('comment', comment);
			body.append('parent_id', data.id);
			body.append('author_id', user.id);
			body.append('parent_type', parentType);
			body.append('es_id', data.es_id);
		} else if (parentType === 'question') {
			body.append('comment', comment);
			body.append('parent_id', data.question.id);
			body.append('author_id', user?.id);
			body.append('parent_type', parentType);
			body.append('es_id', data.question.es_id);
		}

		const resp = await fetch('?/createComment', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result.error) {
			notifications.danger('Error adding comment', 3000);
			console.log(result.error);
		} else {
			notifications.info('Comment Added', 3000);
			dispatch('commentAdded', result?.data);
			comment = '';
		}
	};

	const likeComment = async () => {
		const operation = likes && likes.some((e) => e.user_id === user.id) ? 'remove' : 'add';
		let body = new FormData();
		body.append('parent_id', data.id);
		body.append('user_id', user.id);
		body.append('es_id', data.es_id);
		body.append('operation', operation);

		const resp = await fetch('?/likeComment', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		notifications.info(operation === 'add' ? 'Like Added' : 'Like Removed', 3000);
		const newLike = result?.data;
		if (newLike) {
			likes = [newLike, ...likes];
		} else {
			likes = likes.filter((c) => {
				c.user_id !== user.id;
			});
		}
	};

	const subscribe = async () => {
		const operation =
			subscriptions && subscriptions.some((e) => e.user_id === user.id) ? 'remove' : 'add';
		let body = new FormData();
		body.append('parent_id', data.question.id);
		body.append('user_id', user.id);
		body.append('es_id', data.question.es_id);
		body.append('operation', operation);

		const resp = await fetch('?/subscribe', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		notifications.info(operation === 'add' ? 'Subscription Added' : 'Subscription Removed', 3000);
		const newSubscriptions = result?.data;
		if (newSubscriptions) {
			subscriptions = [newSubscriptions, ...subscriptions];
		} else {
			const alteredSubscriptions = subscriptions.filter((c) => {
				c.user_id !== user.id;
			});
			subscriptions = [...alteredSubscriptions];
		}
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
		on:click={() => (commenting = true)}
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
			class="tablinks"
			style={parentType === 'question' ? '' : 'padding: 0.25rem;'}
			on:click={subscribe}
		>
			{#if parentType === 'question'}
				{subscriptions && user?.id && subscriptions.some((e) => e.user_id === user?.id)
					? 'Subscribed'
					: 'Subscribe'}
			{/if}
			<BellIcon
				iconStyle={parentType === 'question' ? 'margin-left: .5rem;' : 'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={(subscriptions &&
					user?.id &&
					subscriptions.some((e) => e.user_id === user.id) &&
					'#5407d9') ||
					''}
			/>
		</button>
	{/if}
	{#if parentType !== 'question'}
		<button
			title="Like"
			class="tablinks"
			style="{parentType === 'question' ? '' : 'padding: 0.25rem;'}color: {likes &&
				user?.id &&
				likes.some((e) => e.user_id === user?.id) &&
				'#5407d9'}"
			on:click={likeComment}
		>
			{#if likes.length}
				{likes.length}
			{/if}
			<!-- {#if parentType === 'question'}
				Like
			{/if} -->
			<ThumbsUpIcon
				iconStyle={parentType === 'question' ? 'margin-left: .5rem;' : 'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={(likes && user?.id && likes.some((e) => e.user_id === user.id) && '#5407d9') || ''}
			/>
		</button>
	{/if}
	{#if parentType === 'question'}
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
	{/if}
</div>

{#if commenting}
	<div class="interact-text-container">
		<textarea placeholder="Speak your mind" class="interact-textbox" bind:value={comment} />
	</div>
	<button
		class="btn btn-primary sub-comment"
		type="button"
		on:click={createComment}
		disabled={comment?.length < 1}
	>
		Send it
		{#if comment?.length > 1}
			<!-- <ArrowRight /> -->
			<RightIcon
				iconStyle={'margin-left: .5rem; padding: 0.25rem;'}
				height={'1.5rem'}
				fill={'#5407d9'}
			/>
		{/if}
	</button>
{/if}

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
	.sub-comment {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		&:disabled {
			background-color: white;
			color: grey;
			border: 1px solid grey;
			opacity: 1;
			cursor: auto;
		}
	}
	textarea {
		width: 100%;
		border: hsl(212, 15%, 48%) 2px solid;
		border-radius: 5px;
		padding: 10px 20px;
		color: hsl(222, 15%, 19%);
		font-size: 16px;
		margin-bottom: 20px;
	}
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
		padding: 0.5rem;
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
		justify-content: center;
		align-items: center;
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

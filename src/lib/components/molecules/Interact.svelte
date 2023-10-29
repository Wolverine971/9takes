<script lang="ts">
	import { deserialize } from '$app/forms';
	import BellIcon from '$lib/components/icons/bellIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import ShareIcon from '$lib/components/icons/shareIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	import { notifications } from '$lib/components/molecules/notifications.js';
	// import { page } from '$app/stores';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let parentType: string;

	export let data: any; // QuestionObject | CommentObject;
	export let user: any;
	export let questionId: number;

	// if (parentType === 'question') {
	// 	data;
	// } else if (parentType === 'comment') {
	// }

	// update this to like_count and add boolean for if user liked
	let likes: any[] = data?.comment_like ? [...data.comment_like] : [];
	let subscriptions: any[] = data?.question?.subscriptions
		? [...data?.question?.subscriptions]
		: [];

	$: data, watchData();

	let anonymousComment = false;

	const watchData = () => {
		if (!data?.flags?.userHasAnswered && parentType === 'question') {
			commenting = true;
		}
		likes = data?.comment_like ? [...data.comment_like] : [];
		subscriptions = data?.question?.subscriptions ? [...data?.question?.subscriptions] : [];
	};

	let comment: string = '';
	let commenting: boolean = false;
	let loading: boolean = false;

	const createComment = async () => {
		if (!data?.flags?.userSignedIn && !user?.id) {
			if (data?.flags?.userHasAnswered || anonymousComment) {
				notifications.info('Must register or login to comment multiple times', 3000);
				return;
			} else if (parentType === 'comment') {
				notifications.info('Must register or login to comment on other comments', 3000);
				return;
			}
			anonymousComment = true;
		}
		loading = true;

		let body = new FormData();
		if (parentType === 'comment') {
			body.append('comment', comment);
			body.append('parent_id', data.id);
			body.append('author_id', user.id);
			body.append('parent_type', parentType);
			body.append('es_id', data.es_id);
			body.append('question_id', questionId.toString());
		} else if (parentType === 'question') {
			body.append('comment', comment);
			body.append('parent_id', data.question.id);
			body.append('author_id', user?.id);
			body.append('parent_type', parentType);
			body.append('es_id', data.question.es_id);
			body.append('question_id', questionId.toString());
		}

		const resp = await fetch('?/createCommentRando', {
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
		loading = false;
	};

	const subscribe = async () => {
		if (!user) {
			notifications.info('Must register or login to subscribe to questions', 3000);
			return;
		}
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

	const share = () => {
		if (navigator?.share) {
			const shareData = {
				url: `https:9takes.com/questions/${data.question.url}`,
				text: '9takes Question',
				title: data.question.question
			};
			navigator.share(shareData);
		} else {
			alert('Copy the URL, it is shareable');
		}
	};

	let innerWidth: number = 0;
</script>

<svelte:window bind:innerWidth />
<!-- 
	question popout
	either pop down under the question like fb
	or pop out in a dialog like qra
-->
<div class="interaction-div-display">
	<button
		title="Comment"
		class=""
		style="padding: 0.25rem; {parentType === 'question' ? 'width: 8rem;' : ''}"
		on:click={() => (commenting = !commenting)}
	>
		<MasterCommentIcon
			iconStyle={'padding: 0.25rem;'}
			height={'1.5rem'}
			fill={'#5407d9'}
			type={comment.length ? 'full' : 'empty'}
		/>
	</button>

	{#if parentType === 'question'}
		<button title="Subscribe" class="corner-btn" style={'padding: 0.25rem;'} on:click={subscribe}>
			<BellIcon
				iconStyle={'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={(subscriptions &&
					user?.id &&
					subscriptions.some((e) => e.user_id === user.id) &&
					'#5407d9') ||
					''}
			/>
		</button>
		<button title="Share" class="corner-btn" on:click={() => share()}>
			<ShareIcon iconStyle={'padding: 0.25rem;'} height={'1.5rem'} fill={''} />
		</button>
	{/if}
</div>

{#if commenting}
	<div class="interact-text-container">
		<textarea
			placeholder="Speak your mind"
			class="interact-textbox"
			bind:value={comment}
			id="comment-box"
		/>
	</div>
	<button
		class="btn btn-primary sub-comment"
		type="button"
		on:click={createComment}
		disabled={comment?.length < 1}
		id="comment-button"
	>
		Send it
		{#if loading}
			<div class="loader" />
		{:else if comment?.length >= 1}
			<!-- <ArrowRight /> -->
			<RightIcon iconStyle={'margin-left: .5rem;'} height={'1.5rem'} fill={'#5407d9'} />
		{/if}
	</button>
{/if}

<!-- 
interface QuestionObject {
		session?: any;
		question: Question;
		comments: Comment[];
		comment_count: number;
		flags: Flags;
	}

	interface Flags {
		userHasAnswered: boolean;
		userSignedIn: boolean;
	}

	interface Comment {
		id: number;
		created_at: string;
		comment: string;
		author_id: string;
		ip: string;
		comment_count: number;
		parent_type: string;
		es_id: string;
		parent_id: number;
		like_count: number;
		comment_like: Commentlike[];
	}

	interface Commentlike {
		id: number;
		comment_id: number;
		user_id: string;
	}

	interface Question {
		id: number;
		question: string;
		created_at: string;
		updated_at: string;
		data?: any;
		name?: any;
		author_id: string;
		context: string;
		url: string;
		img_url: string;
		es_id: string;
		comment_count: number;
		subscriptions: any[];
	}

	interface CommentObject {
		id: number;
		created_at: string;
		comment: string;
		author_id: string;
		ip: string;
		comment_count: number;
		parent_type: string;
		es_id: string;
		parent_id: number;
		like_count: number;
		comment_like: any[];
	} -->

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
	.top-right-corner {
		// position: absolute;
		// top: 0;
		// right: 0;
		display: flex;
		align-items: center;
		margin: 0.25rem;
		margin-left: auto;
		// gap: 0.25rem;
	}
	.corner-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin: 0.25rem;
		padding: 0.1rem;
		border-radius: 5px;
		padding: 0.25rem;

		&:hover {
			background: var(--color-paladin-1);
		}
	}
	.sub-comment {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		&:disabled {
			background-color: var(--color-paladin-1, white);
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
	.interaction-div-display {
		overflow: hidden;
		display: flex;
	}

	.interaction-div-display button {
		background-color: var(--color-paladin-1);
		// float: left;
		border: 1px solid var(--color-paladin-1);
		outline: none;
		cursor: pointer;
		transition: 0.3s;
		font-size: 0.75rem;
		border-radius: 5px;
		display: flex;
		margin: 0 0 0.25rem 0.25rem;
		justify-content: center;
		align-items: center;
	}

	/* Change background color of buttons on hover */
	.interaction-div-display button:hover {
		background-color: var(--color-paladin-2);
		border-radius: 5px;
		border: 1px solid var(--color-paladin-2);
	}

	.interaction-div-column {
		flex-direction: column;
		width: 5%;
	}

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

	@media all and (max-width: 576px) {
		.interaction-div-display {
			gap: 0.25rem;
			margin: 0.25rem;
		}

		.interaction-div-display button {
			flex: 1;
			margin: 0;
		}
	}
</style>

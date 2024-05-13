<script lang="ts">
	import BellIcon from '$lib/components/icons/bellIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import ShareIcon from '$lib/components/icons/shareIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import FingerprintJS from '@fingerprintjs/fingerprintjs';

	import { notifications } from '$lib/components/molecules/notifications';
	// import { page } from '$app/stores';

	import { createEventDispatcher, onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	const dispatch = createEventDispatcher();

	export let parentType: string;
	export let data: any;
	export let user: any;
	export let questionId: number;

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

		const fp = await FingerprintJS.load();
		const fpval = await fp.get();

		let body = new FormData();
		if (parentType === 'comment') {
			body.append('comment', comment);
			body.append('parent_id', data.id);
			body.append('author_id', user.id);
			body.append('parent_type', parentType);
			body.append('es_id', data.es_id);
			body.append('question_id', questionId.toString());
			body.append('fingerprint', fpval?.visitorId?.toString());
		} else if (parentType === 'question') {
			body.append('comment', comment);
			body.append('parent_id', data.question.id);
			body.append('author_id', user?.id);
			body.append('parent_type', parentType);
			body.append('es_id', data.question.es_id);
			body.append('question_id', questionId.toString());
			body.append('fingerprint', fpval?.visitorId?.toString());
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

	let width = innerWidth > 768 ? 125 : 40;

	let wrap = 1;

	
	onMount(() => {
		let textAreas = document.getElementsByTagName('textarea');

		Array.prototype.forEach.call(textAreas, function (elem) {
			elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
		});
	});
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
		class="corner-btn"
		style="padding: 0.25rem; {parentType === 'question' ? 'width: 8rem;' : ''}"
		on:click={() => (commenting = !commenting)}
	>
		<MasterCommentIcon
			iconStyle={'padding: 0.25rem;'}
			height={'1.5rem'}
			fill={'#5407d9'}
			type={comment?.length ? 'full' : 'empty'}
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
			<ShareIcon iconStyle={'padding: 0.25rem;'} height={'1.5rem'} fill={'#5407d9'} />
		</button>
	{/if}
</div>

{#if commenting}
	<div class="interact-text-container" id="interact-text-container">
		<textarea
			contenteditable
			placeholder={`Speak your mind \n . \n . \n . \n Say it with your chest`}
			class="interact-textbox"
			bind:value={comment}
			id="comment-box"
			rows="5"
			on:keydown={() => {
				if (comment.toString().length > width * wrap) {
					const interactText = document.querySelector('#interact-text-container');
					if (interactText?.dataset) {
						interactText.dataset.replicatedValue = comment;
					}
					wrap++;
				}
			}}
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
	.corner-btn {
		background-color: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin: 0.25rem;
		padding: 0.1rem;
		border-radius: 5px;
		padding: 0.25rem;

		&:hover {
			background-color: var(--color-paladin-2);
		}
	}

	.interact-text-container {
		/* easy way to plop the elements on top of each other and have them both sized based on the tallest one's height */
		display: grid;
		height: 100%;
	}
	.interact-text-container::after {
		/* Note the weird space! Needed to preventy jumpy behavior */
		content: attr(data-replicated-value) ' ';

		/* This is how textarea text behaves */
		white-space: pre-wrap;

		/* Hidden from view, clicks, and screen readers */
		visibility: hidden;
	}
	.interact-text-container > textarea {
		/* You could leave this, but after a user resizes, then it ruins the auto sizing */
		resize: none;

		/* Firefox shows scrollbar on growth, you can hide like this. */
		overflow: hidden;
	}
	.interact-text-container > textarea,
	.interact-text-container::after {
		/* Identical styling required!! */
		border: 1px solid black;
		padding: 0.5rem;
		font: inherit;

		/* Place on top of each other */
		grid-area: 1 / 1 / 2 / 2;
		overflow-y: auto;
	}
</style>

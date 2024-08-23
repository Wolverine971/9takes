<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import { notifications } from '$lib/components/molecules/notifications';
	import BellIcon from '$lib/components/icons/bellIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	export let parentType: string;
	export let data: any;
	export let user: any;
	export let questionId: number;

	const dispatch = createEventDispatcher();

	let likes: any[] = [];
	let subscriptions: any[] = [];
	let comment: string = '';
	let commenting: boolean = false;
	let loading: boolean = false;
	let anonymousComment = false;
	let innerWidth: number = 0;

	$: {
		likes = data?.comment_like || [];
		subscriptions = data?.question?.subscriptions || [];
		if (!data?.flags?.userHasAnswered && parentType === 'question') {
			commenting = true;
		}
	}

	const createComment = async () => {
		if (!canComment()) return;

		loading = true;
		const fp = await FingerprintJS.load();
		const fpval = await fp.get();

		const body = new FormData();
		appendCommonFormData(body, fpval);

		const result = await submitComment(body);
		handleCommentResult(result);

		loading = false;
	};

	const canComment = () => {
		if (!data?.flags?.userSignedIn && !user?.id) {
			if (data?.flags?.userHasAnswered || anonymousComment) {
				notifications.info('Must register or login to comment multiple times', 3000);
				return false;
			} else if (parentType === 'comment') {
				notifications.info('Must register or login to comment on other comments', 3000);
				return false;
			}
			anonymousComment = true;
		}
		return true;
	};

	const appendCommonFormData = (body: FormData, fpval: any) => {
		body.append('comment', comment);
		body.append('parent_id', parentType === 'comment' ? data.id : data.question.id);
		body.append('author_id', user?.id);
		body.append('parent_type', parentType);
		body.append('es_id', parentType === 'comment' ? data.es_id : data.question.es_id);
		body.append('question_id', questionId.toString());
		body.append('fingerprint', fpval?.visitorId?.toString());
	};

	const submitComment = async (body: FormData) => {
		const resp = await fetch('?/createCommentRando', {
			method: 'POST',
			body
		});
		return deserialize(await resp.text());
	};

	const handleCommentResult = (result: any) => {
		if (result.error) {
			notifications.danger('Error adding comment', 3000);
			console.log(result.error);
		} else {
			notifications.info('Comment Added', 3000);
			dispatch('commentAdded', result?.data);
			comment = '';
		}
	};

	const subscribe = async () => {
		if (!user) {
			notifications.info('Must register or login to subscribe to questions', 3000);
			return;
		}

		const operation = subscriptions.some((e) => e.user_id === user.id) ? 'remove' : 'add';
		const body = new FormData();
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
		updateSubscriptions(result?.data, operation);
	};

	const updateSubscriptions = (newSubscription: any, operation: string) => {
		if (operation === 'add') {
			subscriptions = [newSubscription, ...subscriptions];
		} else {
			subscriptions = subscriptions.filter((c) => c.user_id !== user.id);
		}
	};

	onMount(() => {
		document.querySelectorAll('textarea').forEach((elem) => {
			elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
		});
	});
</script>

<svelte:window bind:innerWidth />

<div class="interaction-div-display">
	<button
		title="Comment"
		class="corner-btn primary-btn"
		style="margin-left: 0; {parentType === 'question' ? 'width: 8rem;' : ''}"
		on:click={() => (commenting = !commenting)}
	>
		<MasterCommentIcon
			iconStyle={'padding: 0.25rem;'}
			height={'1.5rem'}
			fill={'var(--accent)'}
			type={comment?.length ? 'full' : 'empty'}
		/>
	</button>

	{#if parentType === 'question'}
		<button
			title={subscriptions.some((e) => e.user_id === user?.id) ? 'Subscribed' : 'Subscribe'}
			class="corner-btn secondary-btn"
			on:click={subscribe}
		>
			<BellIcon
				iconStyle={'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={subscriptions.some((e) => e.user_id === user?.id)
					? 'var(--primary)'
					: 'var(--accent)'}
			/>
		</button>
	{/if}
</div>

{#if commenting}
	<div class="interact-text-container" id="interact-text-container">
		<textarea
			placeholder={`Speak your mind \n . \n . \n . \n Say it with your chest`}
			class="interact-textbox"
			bind:value={comment}
			id="comment-box"
			rows="5"
			on:keydown={(e) => {
				const container = e.target.parentNode;
				container.dataset.replicatedValue = e.target.value;
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
			<RightIcon iconStyle={'margin-left: .5rem;'} height={'1.5rem'} fill={'var(--accent)'} />
		{/if}
	</button>
{/if}

<style lang="scss">
	.corner-btn {
		background-color: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin: 0.25rem;
		border-radius: var(--base-border-radius);
		padding: 0.25rem;

		&:hover {
			background-color: var(--base-white-outline);
		}
	}

	.interact-text-container {
		display: grid;
		height: 100%;

		&::after {
			content: attr(data-replicated-value) ' ';
			white-space: pre-wrap;
			visibility: hidden;
		}

		> textarea {
			resize: none;
			overflow: hidden;
			margin: 0.25rem 0;
		}

		&::after,
		> textarea {
			border: 1px solid black;
			padding: 0.5rem;
			font: inherit;
			grid-area: 1 / 1 / 2 / 2;
			overflow-y: auto;
		}
	}
</style>

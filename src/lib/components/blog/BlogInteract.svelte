<script lang="ts">
	import { deserialize } from '$app/forms';
	import ShareIcon from '$lib/components/icons/shareIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	import { notifications } from '$lib/components/molecules/notifications.js';
	// import { page } from '$app/stores';

	import { createEventDispatcher } from 'svelte';
	import type { Session } from '@supabase/supabase-js';

	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	const dispatch = createEventDispatcher();

	export let parentType: string;

	export let data: {
		session: Session | null;
		component: any;
		comments: any[];
		metadata: App.BlogPost;
		slug: string;
		suggestions: {
			niche: {
				type: string;
				posts: App.BlogPost[];
			};
			sameEnneagram: any;
		};
		flags: {
			userHasAnswered: boolean;
			userSignedIn: boolean;
		};
	};
	export let user: any;

	$: data, watchData();

	let anonymousComment = false;

	const watchData = () => {
		if (!data?.flags?.userHasAnswered) {
			commenting = true;
		}
	};

	let comment: string = '';
	let commenting: boolean = false;

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

		const fp = await FingerprintJS.load();
		const fpval = await fp.get();

		let body = new FormData();

		body.append('comment', comment);
		body.append('author_id', user?.id);
		body.append('parent_type', parentType);
		body.append('blog_link', data.slug);
		body.append('fingerprint', fpval?.visitorId?.toString());

		const resp = await fetch(`/blog/${parentType}?/createComment`, {
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

	const share = () => {
		if (navigator?.share) {
			const shareData = {
				url: data.metadata.loc,
				text: data.metadata.description,
				title: data.metadata.title
			};
			navigator.share(shareData);
		} else {
			alert('Copy the URL, it is shareable');
		}
	};

	let innerWidth: number = 0;
</script>

<svelte:window bind:innerWidth />

<div class="interact-text-container">
	<textarea
		placeholder="What are your thoughts on {data.slug.split('-').join(' ')}?"
		class="interact-textbox"
		bind:value={comment}
	/>
</div>

<div class="interaction-div-display">
	<button
		class="btn btn-primary sub-comment"
		type="button"
		style={comment?.length > 1 ? 'color: #5407d9; border: 1px solid #5407d9;' : ''}
		title="You only YOLO once"
		on:click={createComment}
		disabled={comment?.length < 1}
	>
		Submit Comment
		{#if comment?.length > 1}
			<RightIcon
				iconStyle={'margin-left: .5rem; padding: 0.25rem;'}
				height={'1.5rem'}
				fill={'#5407d9'}
			/>
		{/if}
	</button>
	<button
		title="Share"
		type="button"
		class="btn btn-primary sub-comment share-btn"
		on:click={() => share()}
	>
		Share Blog
		<ShareIcon iconStyle={'padding: 0.25rem;'} height={'1.5rem'} fill={''} />
	</button>
</div>

<style lang="scss">
	.sub-comment {
		text-align: center;
		display: flex;
		// border: 1px solid #5407d9;
		justify-content: center;
		align-items: center;
		&:disabled {
			background-color: white;

			color: var(--color-paladin-5) !important;
			border: 1px solid var(--color-paladin-5) !important;
			opacity: 1;
			cursor: auto;
		}
	}
	.share-btn:hover {
		color: #5407d9;
		border: 1px solid #5407d9;
	}
	textarea {
		width: 100%;
		border: 2px solid #5407d9;
		border-radius: 5px;
		padding: 10px 20px;
		color: hsl(222, 15%, 19%);
		font-size: 16px;
		margin-bottom: 20px;
	}
	.interaction-div-display {
		overflow: hidden;
		display: flex;
		gap: 0.5rem;
	}

	/* Change background color of buttons on hover */
	.interaction-div-display button:hover {
		background-color: var(--color-paladin-2);
		border-radius: 5px;

		// color: var(--color-paladin-5);
		// border: 1px solid var(--color-paladin-5);

		color: #5407d9;
		border: 1px solid #5407d9;
	}

	.interact-text-container {
		margin-top: 2rem;
		position: relative;
		width: 100%;
		height: 100px;
	}
	.interact-textbox {
		border-radius: 5px;
		box-sizing: border-box;
		padding: 1rem;
		width: 100%;
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

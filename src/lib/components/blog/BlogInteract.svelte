<!-- src/lib/components/blog/BlogInteract.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	import { notifications } from '$lib/components/molecules/notifications';
	// import { page } from '$app/stores';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let parentType: string;

	export let data: {
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

	$: (data, watchData());

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

		// Dynamically import FingerprintJS to avoid bundling in main chunk
		const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
		const fp = await FingerprintJS.load();
		const fpval = await fp.get();

		let body = new FormData();

		body.append('comment', comment);
		body.append('author_id', user?.id);
		body.append('parent_type', parentType);
		body.append('blog_link', data.slug);
		body.append('fingerprint', fpval?.visitorId?.toString());

		const resp = await fetch(`/${parentType}?/createComment`, {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result.error) {
			notifications.danger('Error adding comment', 3000);
			console.log(result.error);
		} else {
			notifications.success('Comment Added', 3000);
			dispatch('commentAdded', result?.data);
			comment = '';
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
		class="btn btn-primary flex"
		type="button"
		style="{comment?.length > 1
			? 'color: var(--accent); border: 1px solid var(--accent);'
			: ''} display: flex;"
		title="You only YOLO once"
		on:click={createComment}
		disabled={comment?.length < 1}
	>
		Submit Comment
		{#if comment?.length >= 1}
			<RightIcon
				iconStyle={'margin-left: .5rem; padding: 0 0.25rem;'}
				height={'1.5rem'}
				fill={'var(--accent)'}
			/>
		{/if}
	</button>
</div>

<style lang="scss">
	.interact-text-container {
		position: relative;
		width: 100%;
		height: 100px;
	}

	.interact-textbox {
		box-sizing: border-box;
		position: relative;
		border-radius: var(--base-border-radius);
		padding: 1rem;
		width: 100%;
		background-color: var(--medium-gray);
		border: 1px solid var(--base-white-outline) !important;

		&:focus {
			outline: none !important;
			box-shadow: 0 0 10px var(--accent);
		}
	}
</style>

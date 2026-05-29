<!-- src/lib/components/blog/BlogInteract.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import { Button } from '$lib/components/atoms';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import { formatPersonalityDisplayName } from '$lib/utils/personalityAnalysis';

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
		}

		let body = new FormData();

		body.append('comment', comment);
		body.append('author_id', user?.id);
		body.append('parent_type', parentType);
		body.append('blog_link', data.slug);
		body.append('fingerprint', getOrCreateVisitorId());

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
			if (!data?.flags?.userSignedIn && !user?.id && parentType === 'question') {
				anonymousComment = true;
			}
			dispatch('commentAdded', result?.data);
			comment = '';
		}
	};

	let innerWidth: number = 0;
</script>

<svelte:window bind:innerWidth />

<div class="interact-text-container">
	<textarea
		placeholder="What are your thoughts on {formatPersonalityDisplayName(data.slug)}?"
		class="interact-textbox"
		bind:value={comment}
	></textarea>
</div>

<div class="interaction-div-display">
	{#snippet submitIcon()}
		<RightIcon
			iconStyle={'margin-left: .5rem; padding: 0 0.25rem;'}
			height={'1.5rem'}
			fill={'var(--lamp-glow)'}
		/>
	{/snippet}
	<Button
		type="button"
		style={comment?.length > 1
			? 'color: var(--lamp-glow); border: 1px solid var(--lamp-glow);'
			: ''}
		title="You only YOLO once"
		onclick={createComment}
		disabled={comment?.length < 1}
		iconRight={comment?.length >= 1 ? submitIcon : undefined}
	>
		Submit Comment
	</Button>
</div>

<style lang="scss">
	.interact-text-container {
		position: relative;
		width: 100%;
		min-height: 100px;
	}

	.interact-textbox {
		box-sizing: border-box;
		display: block;
		position: relative;
		border-radius: var(--base-border-radius);
		padding: 1rem;
		width: 100%;
		min-height: 100px;
		resize: vertical;
		background-color: var(--stone-warm);
		border: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent) !important;
		color: var(--ink-bright);
		caret-color: var(--lamp-glow);
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&::placeholder {
			color: var(--ink-dim);
		}

		&:hover {
			border-color: color-mix(in srgb, var(--lamp-glow) 25%, var(--stone-warm));
		}

		&:focus {
			outline: none !important;
			background-color: var(--stone-warm);
			border-color: color-mix(in srgb, var(--lamp-glow) 60%, var(--stone-warm));
			box-shadow:
				0 0 0 3px color-mix(in srgb, var(--lamp-glow) 14%, transparent),
				0 0 18px color-mix(in srgb, var(--lamp-glow) 20%, transparent);
		}
	}
</style>

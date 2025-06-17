<!-- lib/components/blog/BlogComments.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import BlogComment from '$lib/components/blog/BlogComment.svelte';

	export let slug: string;
	export let comments: any[];
	export let parentType: string;
	export let userHasAnswered: boolean;
	export let user: any;

	$: comment_count = comments.length;
	let loading = false;

	const refreshComments = async (data: any) => {
		// Implement refresh logic here if needed
	};
</script>

<div class="blog-comments">
	{#if comment_count > 0 && !userHasAnswered}
		<p class="comment-info">Must answer question first</p>
	{:else if loading}
		<div class="comment-info">Loading comments...</div>
	{:else if !browser || (comments?.length && userHasAnswered) || (comments?.length && parentType === 'comment')}
		{#if comments?.length}
			<div class="comment-list">
				{#each comments as comment (comment.id)}
					<BlogComment
						{comment}
						{slug}
						{user}
						{userHasAnswered}
						on:commentAdded={({ detail }) => refreshComments(detail)}
					/>
				{/each}
			</div>
		{:else}
			<p class="comment-info">No comments yet</p>
		{/if}
	{/if}
</div>

<style lang="scss">
	@import '../molecules/comment.scss';

	.blog-comments {
		margin-top: var(--comment-margin);
	}

	.comment-info {
		padding: var(--comment-padding);
		color: var(--color-text);
		font-style: italic;
	}

	.comment-list {
		display: flex;
		flex-direction: column;
		gap: var(--comment-margin);
	}
</style>

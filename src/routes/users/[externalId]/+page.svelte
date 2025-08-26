<!-- src/routes/users/[externalId]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	interface IComment {
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
		fingerprint: string;
	}
</script>

<div class="glass-card pretty-div">
	<h1 style="">User: Enneagram {data?.user.enneagram}</h1>

	{#if data.subscriptions?.length}
		<h2>Question Subscriptions</h2>

		{#each data.subscriptions as subscription}
			<div class="row" style="justify-content: flex-start;">
				<a href="/questions/{subscription.questions.url}"
					>{subscription.questions.question_formatted || subscription.questions.question}</a
				>
			</div>
		{/each}
	{/if}

	{#if data.comments?.length}
		<h2>Comments</h2>

		{#each data.comments as comment}
			<div class="row" style="justify-content: flex-start;">
				<div>
					<a href="/questions/{comment.url}">Q: {comment.question_formatted || comment.question}</a>
					<p>A: {comment.comment}</p>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style lang="scss">
</style>

<!-- src/routes/users/[externalId]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	interface QuestionInfo {
		id: number;
		question: string;
		question_formatted: string | null;
		url: string;
	}

	interface Subscription {
		id: number;
		user_id: string;
		question_id: number;
		questions: QuestionInfo;
	}

	interface UserComment {
		id: number;
		comment: string;
		url: string;
		question: string;
		question_formatted: string | null;
	}

	// Cast the data to proper types
	$: subscriptions = (data.subscriptions || []) as Subscription[];
	$: comments = (data.comments || []) as UserComment[];
</script>

<div class="glass-card pretty-div">
	<h1 style="">User: Enneagram {data?.user.enneagram}</h1>

	{#if subscriptions.length}
		<h2>Question Subscriptions</h2>

		{#each subscriptions as subscription}
			<div class="row" style="justify-content: flex-start;">
				<a href="/questions/{subscription.questions.url}"
					>{subscription.questions.question_formatted || subscription.questions.question}</a
				>
			</div>
		{/each}
	{/if}

	{#if comments.length}
		<h2>Comments</h2>

		{#each comments as comment}
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

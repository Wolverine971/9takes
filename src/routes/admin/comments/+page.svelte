<script lang="ts">
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { convertDateToReadable } from '../../../utils/conversions';

	export let data: PageData;

	const remove = async (commentId: number) => {
		let body = new FormData();
		body.append('commentId', commentId.toString());
		const resp = await fetch(`?/removeComment`, {
			method: 'POST',
			body
		});
		const data = await resp.json();
		invalidateAll();
	};

	const unflag = async (commentId: number) => {
		let body = new FormData();
		body.append('commentId', commentId.toString());
		const resp = await fetch(`?/unflagComment`, {
			method: 'POST',
			body
		});
		const data = await resp.json();
		invalidateAll();
	};
</script>

{#if data.user?.admin}
	<div class="glass-card">
		<div class="row">
			<a href="/admin/users">Users</a> |
			<a href="/admin/questions">Questions</a> |
			<a href="/admin/comments" class="active-link">Comments</a> |
			<a href="/admin/messages">Messages</a>
		</div>
		<div>
			<h1 style="">Comments</h1>

			<div class="pretty-div">
				<h3>Flagged Comments</h3>
				{#if data?.flaggedComments?.length}
					<div class="scrollable-div">
						{#each data?.flaggedComments as comment}
							<div class="comment-border">
								<div>
									<p style="width: 100%;">{comment?.comments?.comment}</p>
									<p style="padding-left: .5rem">
										Reason: {comment.description} - From {comment?.profiles?.email}
									</p>
								</div>
								<div>
									<div>
										<button
											class="btn btn-primary"
											on:click={() => {
												unflag(comment?.comments?.id);
											}}>Green light comment 🟢</button
										>
										<button
											class="btn btn-secondary"
											on:click={() => {
												remove(comment?.comments?.id);
											}}>Remove</button
										>
									</div>
									<p>Flagged on {convertDateToReadable(comment.created_at)}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p>No flagged comments</p>
				{/if}
			</div>

			{#if data?.comments?.length}
				<div class="pretty-div">
					<h3>Comments</h3>
					<div class="scrollable-div">
						{#each data?.comments as comment}
							<div class="comment-border">
								<p style="color: {comment.removed ? 'red' : ''}; width: 100%;">
									{comment?.comment}
								</p>
								<div class="column" style="align-items: end">
									{#if comment?.parentQuestion}
										<a href="/questions/{comment?.parentQuestion?.url}"
											>{comment?.parentQuestion?.question_formatted?.slice(0, 30)}</a
										>
									{/if}
									<a href="/users/{comment?.profiles?.external_id}">{comment?.profiles?.email}</a>
									<p>{convertDateToReadable(comment.created_at)}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if data?.blogComments?.length}
				<div class="pretty-div">
					<h3>Blog Comments</h3>
					<div class="scrollable-div">
						{#each data?.blogComments as blogComment}
							<div class="comment-border">
								<p>{blogComment?.comment}</p>
								<div class="column" style="align-items: end">
									<a href="/blog/{blogComment.blog_type}/{blogComment?.blog_link}"
										>{blogComment?.blog_link.replace('-', ' ')}</a
									>
									<p>{convertDateToReadable(blogComment.created_at)}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="pretty-div">
		<h1>Error</h1>
	</div>
{/if}

<style lang="scss">
	.comment-border {
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		padding: 0.5rem;
		margin: 0.2rem;
		display: flex;
		flex-direction: 'column';
		justify-content: space-between;
	}
	h1 {
		font-size: 1.5rem;
	}

	td {
		text-align: start;
		margin: 0.2rem;
		padding: 0.5rem;
	}
</style>

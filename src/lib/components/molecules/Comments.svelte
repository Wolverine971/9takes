<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import Comment from './Comment.svelte';
	import { debounce } from '../../utils/debounce';

	const dispatch = createEventDispatcher();

	export let parentType: string = 'comment';
	export let user: any;
	export let questionId: number;
	export let comments: any[];
	export let comment_count: number;
	export let parentData: any;

	$: lastDate = comments.length ? comments[comments.length - 1]?.created_at || null : null;

	let loading = false;

	const loadMore = debounce(async () => {
		if (loading) return;
		loading = true;
		try {
			const response = await fetch(
				`/comments?type=${parentType}&parentId=${
					parentType === 'question' ? questionId : parentData.id
				}&lastDate=${lastDate}&range=${comments.length || 0}`
			);
			const newComments = await response.json();
			if (Array.isArray(newComments) && newComments.length) {
				comments = [...comments, ...newComments];
			}
		} catch (error) {
			console.error('Error loading comments:', error);
		} finally {
			loading = false;
		}
	}, 300);

	const refreshComments = async () => {
		if (parentType !== 'question') return;
		dispatch('commentAdded');
		loading = true;
		try {
			const response = await fetch(
				`/comments?type=${parentType}&parentId=${questionId}&lastDate=${lastDate}`
			);
			const newComments = await response.json();
			if (Array.isArray(newComments) && newComments.length) {
				comments = newComments;
				comment_count += 1;
			}
		} catch (error) {
			console.error('Error refreshing comments:', error);
		} finally {
			loading = false;
		}
	};
</script>

{#if comment_count > 0 && comments?.length && parentType === 'question' && parentData?.flags?.userHasAnswered}
	<button class="btn btn-secondary" type="button" on:click={loadMore}>See Comments</button>
{/if}

{#if browser && ((comments.length && parentType === 'question' && parentData?.flags?.userHasAnswered) || (comments.length && parentType === 'comment'))}
	{#each comments as comment (comment.id)}
		<div transition:fade>
			<Comment {questionId} {comment} {user} {parentData} on:commentAdded={refreshComments} />
		</div>
	{/each}
	{#if comments.length < comment_count && parentData?.flags?.userHasAnswered}
		<button class="btn btn-secondary" on:click={loadMore} disabled={loading}>
			{loading ? 'Loading...' : 'Load More'}
		</button>
	{/if}
{/if}

<style lang="scss">
	.btn {
		/* Add your button styles here */
	}
	.loader {
		/* Add your loader styles here */
	}
</style>

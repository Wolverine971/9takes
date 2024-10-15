<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';
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
	let observer: IntersectionObserver;
	let bottomSentinel: HTMLDivElement;

	const loadMore = debounce(async () => {
		if (loading || comments.length >= comment_count) return;
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

	onMount(() => {
		if (browser) {
			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						loadMore();
					}
				},
				{ rootMargin: '100px' }
			);

			if (bottomSentinel) {
				observer.observe(bottomSentinel);
			}
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});
</script>

{#if browser && ((comments.length && parentType === 'question' && parentData?.flags?.userHasAnswered) || (comments.length && parentType === 'comment'))}
	{#each comments as comment (comment.id)}
		<div transition:fade>
			<Comment {questionId} {comment} {user} {parentData} on:commentAdded={refreshComments} />
		</div>
	{/each}
	{#if comments.length < comment_count && parentData?.flags?.userHasAnswered}
		<div bind:this={bottomSentinel} class="sentinel">
			{#if loading}
				<div>Loading...</div>
			{/if}
		</div>
	{/if}
{/if}

<style lang="scss">
	.sentinel {
		height: 20px;
		margin-top: 20px;
	}
</style>

<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount } from 'svelte';
	import Link from './Link.svelte';

	const dispatch = createEventDispatcher();

	export let parentType: 'comment' | 'question' = 'comment';
	export let data: any;
	export let user: any;
	export let questionId: number;

	let loading = false;
	let links: any[] = [];
	let linksCount = 0;

	$: if (data) {
		updateLinksData();
	}

	onMount(() => {
		updateLinksData();
	});

	function updateLinksData() {
		links = data.links?.length ? [...data.links] : [];
		linksCount = data.links_count || 0;
	}

	const lastDate = data.comments?.length
		? data.comments[data.comments.length - 1]?.created_at
		: null;

	async function loadMore() {
		if (loading) return;
		loading = true;

		try {
			const response = await fetch(
				`/comments?type=${parentType}&parentId=${getParentId()}&lastDate=${lastDate}&range=${
					links.length
				}`
			);
			const commentData = await response.json();

			if (!commentData?.message) {
				links = [...links, ...commentData];
				linksCount += commentData.length;
			}
		} catch (error) {
			console.error('Error loading more comments:', error);
		} finally {
			loading = false;
		}
	}

	async function refreshLinks() {
		if (parentType !== 'question') return;

		dispatch('commentAdded');
		loading = true;

		try {
			const response = await fetch(
				`/comments?type=${parentType}&parentId=${getParentId()}&lastDate=${lastDate}`
			);
			const commentData = await response.json();

			if (!commentData?.message) {
				links = commentData;
				linksCount = commentData.length;
			}
		} catch (error) {
			console.error('Error refreshing links:', error);
		} finally {
			loading = false;
		}
	}

	function getParentId(): number {
		return parentType === 'question' ? questionId : data.id;
	}
</script>

{#if browser && links.length && parentType === 'question' && data?.flags?.userHasAnswered}
	<div class="flex-down">
		{#each links as link (link.id)}
			{#if link}
				<Link {questionId} {link} {user} {data} on:commentAdded={refreshLinks} />
			{/if}
		{/each}
	</div>

	{#if links.length < linksCount}
		<button class="btn btn-secondary" on:click={loadMore} disabled={loading}>
			{#if loading}
				<div class="loader" />
			{:else}
				Load More
			{/if}
		</button>
	{/if}
{:else if !links.length}
	<p>Nothing right now</p>
{/if}

<style lang="scss">
	flex-down {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>

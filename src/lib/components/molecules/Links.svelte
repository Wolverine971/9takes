<!-- src/lib/components/molecules/Links.svelte -->
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
	<div class="flex flex-col gap-2">
		{#each links as link (link.id)}
			{#if link}
				<Link {questionId} {link} {user} {data} on:commentAdded={refreshLinks} />
			{/if}
		{/each}
	</div>

	{#if links.length < linksCount}
		<button
			class="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-primary-500 px-5 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
			on:click={loadMore}
			disabled={loading}
		>
			{#if loading}
				<div class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
			{:else}
				Load More
			{/if}
		</button>
	{/if}
{:else if !links.length}
	<h2
		class="relative mb-4 py-2 text-center text-xl font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-[60px] after:-translate-x-1/2 after:rounded-sm after:bg-primary-500 after:content-['']"
	>
		None
	</h2>
{/if}

<!-- src/lib/components/molecules/Links.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import Link from './Link.svelte';

	interface Props {
		parentType?: 'comment' | 'question';
		data: any;
		questionId: number;
		oncommentAdded?: () => void;
	}

	let { parentType = 'comment', data, questionId, oncommentAdded }: Props = $props();

	let loading = $state(false);
	let links = $state<any[]>([]);
	let linksCount = $state(0);

	$effect(() => {
		if (data) {
			links = data.links?.length ? [...data.links] : [];
			linksCount = data.links_count || 0;
		}
	});

	async function loadMore() {
		if (loading) return;
		loading = true;

		try {
			const response = await fetch(
				`/links?type=${parentType}&parentId=${getParentId()}&range=${links.length}`
			);
			const linkData = await response.json();

			if (!linkData?.message) {
				links = [...links, ...linkData];
				linksCount += linkData.length;
			}
		} catch (error) {
			console.error('Error loading more links:', error);
		} finally {
			loading = false;
		}
	}

	async function refreshLinks() {
		if (parentType !== 'question') return;

		oncommentAdded?.();
		loading = true;

		try {
			const response = await fetch(`/links?type=${parentType}&parentId=${getParentId()}&range=0`);
			const linkData = await response.json();

			if (!linkData?.message) {
				links = linkData;
				linksCount = linkData.length;
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
				<Link {link} />
			{/if}
		{/each}
	</div>

	{#if links.length < linksCount}
		<button
			class="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-primary-500 px-5 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
			onclick={loadMore}
			disabled={loading}
		>
			{#if loading}
				<div
					class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
				></div>
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

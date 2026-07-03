<!-- src/lib/components/molecules/Links.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/atoms';
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
		<div class="links-load-more">
			<Button onclick={loadMore} disabled={loading} {loading}>Load more articles</Button>
		</div>
	{/if}
{:else if !links.length}
	<div class="links-empty-state">
		No linked articles yet. Sources and follow-up reading will appear here when the thread has them.
	</div>
{/if}

<style>
	.links-load-more {
		margin-top: 1rem;
		text-align: center;
	}

	.links-empty-state {
		margin-bottom: 1rem;
		padding: 1.1rem;
		border: 1px dashed color-mix(in srgb, var(--lamp-glow) 18%, var(--stone-edge));
		border-radius: 1rem;
		background: color-mix(in srgb, var(--lamp-soft) 36%, transparent);
		color: var(--ink-mid);
		font-size: 0.95rem;
		font-weight: 600;
		text-align: center;
	}
</style>

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
	// Follow `data`; "load more" and refreshes append/replace locally until it changes.
	let links = $derived<any[]>(data?.links?.length ? [...data.links] : []);
	let linksCount = $derived<number>(data?.links_count || 0);

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
	<div class="links-list">
		{#each links as link (link.id)}
			{#if link}
				<Link {link} />
			{/if}
		{/each}
	</div>

	{#if links.length < linksCount}
		<div class="links-load-more">
			<Button variant="secondary" onclick={loadMore} disabled={loading} {loading}
				>Load more articles</Button
			>
		</div>
	{/if}
{:else if !links.length}
	<div class="links-empty-state">
		No linked articles yet. Sources and follow-up reading will appear here when the thread has them.
	</div>
{/if}

<style>
	.links-list {
		display: flex;
		flex-direction: column;
		min-width: 0;
		margin-inline: 1rem;
	}

	.links-load-more {
		margin-top: 1rem;
		text-align: center;
	}

	.links-empty-state {
		margin: 0 1rem 1rem;
		padding: 1.1rem;
		border: 1px dashed color-mix(in srgb, var(--highlight) 24%, transparent);
		border-radius: var(--border-radius-lg);
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		text-align: center;
	}

	@media (max-width: 520px) {
		.links-list,
		.links-empty-state {
			margin-inline: 0.75rem;
		}
	}
</style>

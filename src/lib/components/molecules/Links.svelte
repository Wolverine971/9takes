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
		<button class="links-load-more" onclick={loadMore} disabled={loading}>
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
	<div class="links-empty-state">No linked articles yet.</div>
{/if}

<style>
	.links-load-more {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1rem;
		padding: 0.8rem 1.2rem;
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		border-radius: 0.9rem;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
		color: var(--text-on-primary);
		font-weight: 600;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			background-color 0.2s ease;
	}

	.links-load-more:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: var(--glow-md);
	}

	.links-load-more:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.links-empty-state {
		margin-bottom: 1rem;
		padding: 1.1rem;
		border: 1px dashed color-mix(in srgb, var(--primary) 18%, var(--border-color));
		border-radius: 1rem;
		background: color-mix(in srgb, var(--primary-subtle) 36%, transparent);
		color: var(--text-secondary);
		font-size: 0.95rem;
		font-weight: 600;
		text-align: center;
	}
</style>

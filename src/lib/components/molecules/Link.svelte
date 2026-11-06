<!-- src/lib/components/molecules/Link.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface LinkData {
		id: string;
		url: string;
		meta_title?: string;
		meta_description?: string;
		meta_image?: string;
		summary?: string;
	}

	interface Props {
		link: LinkData;
	}

	let { link }: Props = $props();

	let loading = $state(true);
	let hasMetaData = $state(false);

	const saveLinkClick = async (linkId: string) => {
		const body = new FormData();
		body.append('linkId', linkId);
		await fetch('?/saveLinkClick', { method: 'POST', body });
	};

	function truncateUrl(url: string, maxLength: number = 50): string {
		return url.length > maxLength ? url.substring(0, maxLength - 3) + '...' : url;
	}

	onMount(() => {
		hasMetaData = !!(link.meta_title || link.meta_description || link.meta_image);
		loading = false;
	});
</script>

<!-- An article row: thumbnail (when the page has one), title, description. Flat, like the takes. -->
<div class="link-row">
	{#if loading}
		<div class="loader" aria-hidden="true"></div>
	{:else}
		<a href={link.url} class="link-item" onclick={() => saveLinkClick(link.id)}>
			{#if hasMetaData}
				{#if link.meta_image}
					<img src={link.meta_image} alt="" class="meta-image" loading="lazy" />
				{/if}
				<div class="content">
					<h3>{link.meta_title || 'No Title'}</h3>
					<p>{link.meta_description || 'No Description'}</p>
				</div>
			{:else}
				<div class="content">
					<h3>{truncateUrl(link.url)}</h3>
					{#if link.summary}
						<p>{link.summary}</p>
					{/if}
				</div>
			{/if}
		</a>
	{/if}
</div>

<style>
	.link-row {
		border-bottom: 1px solid var(--rule);
	}

	.link-item {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		padding: 16px 0;
		color: inherit;
		text-decoration: none;
	}

	.link-item:hover h3 {
		color: var(--highlight);
	}

	.link-item:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}

	.meta-image {
		flex: 0 0 auto;
		width: 96px;
		aspect-ratio: 4 / 3;
		border-radius: 8px;
		object-fit: cover;
	}

	.content {
		min-width: 0;
	}

	h3 {
		margin: 0 0 4px;
		color: var(--text);
		font-size: var(--font-size-base);
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--highlight) 40%, transparent);
		text-underline-offset: 3px;
		overflow-wrap: anywhere;
		transition: color 0.2s;
	}

	p {
		margin: 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		line-height: 1.5;
		white-space: pre-line;
	}

	.loader {
		width: 24px;
		height: 24px;
		margin: 16px 0;
		border: 2px solid var(--rule);
		border-left-color: var(--highlight);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

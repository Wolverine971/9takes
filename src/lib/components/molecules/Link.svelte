<!-- src/lib/components/molecules/Link.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/atoms/card.svelte';

	interface LinkData {
		id: string;
		url: string;
		meta_title?: string;
		meta_description?: string;
		meta_image?: string;
		summary?: string;
	}

	export let link: LinkData;

	let loading = true;
	let hasMetaData = false;

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

<Card>
	{#if loading}
		<div class="loader"></div>
	{:else}
		<a href={link.url} class="link-item" on:click={() => saveLinkClick(link.id)}>
			{#if hasMetaData}
				{#if link.meta_image}
					<img src={link.meta_image} alt={link.meta_title || 'Link preview image'} class="meta-image" />
				{/if}
				<div class="content meta-content">
					<h3>{link.meta_title || 'No Title'}</h3>
					<p>{link.meta_description || 'No Description'}</p>
				</div>
			{:else}
				<div class="content fallback-content">
					<h3>{truncateUrl(link.url)}</h3>
					{#if link.summary}
						<p>{link.summary}</p>
					{/if}
				</div>
			{/if}
		</a>
	{/if}
</Card>

<style lang="scss">
	.link-item {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: relative;
		height: 300px;
		padding: 1rem;
		border-radius: 10px;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.4s ease-in-out;
		text-decoration: none;
		color: inherit;

		&:hover {
			opacity: 0.9;
		}

		.meta-image {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.content {
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.7);
			padding: 1rem;
			border-radius: 5px;
			color: var(--accent);
		}

		.meta-content {
			text-align: right;
		}

		.fallback-content {
			text-align: left;
		}

		h3,
		p {
			margin: 0.5rem 0;
		}

		h3 {
			font-size: 1.2rem;
			font-weight: bold;
		}

		p {
			font-size: 0.9rem;
			white-space: pre-line;
		}
	}

	.loader {
		width: 24px;
		height: 24px;
		border: 2px solid rgba(0, 0, 0, 0.1);
		border-left-color: #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

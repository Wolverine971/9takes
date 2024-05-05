<script lang="ts">
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import BlogTiles from '$lib/components/molecules/BlogTiles.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<BlogPageHead
	data={{
		title: 'All the 9takes Blogs',
		description:
			'List of blogs about the Enneagram, guides, personality analysis of famous people and the ideas behind 9takes',
		pic: 'rome'
	}}
	slug={'blog'}
/>

<svelte:head />
<h1>All the 9takes Blogs</h1>

<BlogTiles blogs={data} />

<style lang="scss">
	.blog-headings {
		font-size: 1.5rem;
		text-decoration: none;
		font-weight: bold;
		border-radius: 5px;
		padding: 0.25rem;
	}
	li::marker {
		display: none;
		content: '';
	}
	ul {
		margin: 0;
		padding: 0;
	}
	.btn-container-right {
		display: flex;
		justify-content: flex-end;
	}
	.view-btn {
		margin: 1rem 0 1rem 1rem;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 3rem;
		width: 3rem;
		// margin-left: auto;
		border: var(--classic-border);
		border-radius: 5px;
	}
	.view-btn:hover {
		background-color: var(--color-paladin-2);
	}
</style>

<script lang="ts">
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import BlogTiles from '$lib/components/molecules/BlogTiles.svelte';
	import type { PageData } from './$types';

	import ObjectsColumnOutlineIcon from '$lib/components/icons/objectsColumnOutlineIcon.svelte';
	import SiteMapIcon from '$lib/components/icons/siteMapIcon.svelte';

	import StructuredBlogView from '$lib/components/blog/StructuredBlogView.svelte';

	export let data: PageData;

	let structuredView = false;
</script>

<BlogPageHead
	data={{
		title: '9takes Blog',
		description: 'List of blogs about the Enneagram and 9takes',
		pic: 'rome'
	}}
	slug={'blog'}
/>

<svelte:head />
<h1>The 9takes Blog</h1>
{#if structuredView}
	<div class="btn-container-right">
		<button
			aria-label="structured view of blogs button"
			title="structured view of blogs"
			class="view-btn"
			style=""
			on:click={() => {
				structuredView = false;
			}}
		>
			<ObjectsColumnOutlineIcon
				iconStyle={'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={!structuredView ? '#5407d9' : ''}
			/>
		</button>

		<button
			aria-label="image preview view of blogs button"
			title="image preview view of blogs"
			class="view-btn"
			style=""
			on:click={() => {
				structuredView = true;
			}}
		>
			<SiteMapIcon
				iconStyle={'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={structuredView ? '#5407d9' : ''}
			/>
		</button>
	</div>
	<div class="flex-columns">
		<StructuredBlogView />
	</div>
{:else}
	<div>
		<div style="display: flex; justify-content: space-between">
			<div>
				<ul>
					<li><a href="#ideas" class="blog-headings">Ideas</a></li>
					<li><a href="#guides" class="blog-headings">Guides</a></li>
					<li><a href="#enneagram" class="blog-headings">Enneagram</a></li>
					<li><a href="#people" class="blog-headings">Famous People</a></li>
				</ul>
			</div>

			<div>
				<button
					aria-label="structured view of blogs button"
					title="structured view of blogs"
					class="view-btn"
					style=""
					on:click={() => {
						structuredView = false;
					}}
				>
					<ObjectsColumnOutlineIcon
						iconStyle={'padding: 0.25rem;'}
						height={'1.5rem'}
						fill={!structuredView ? '#5407d9' : ''}
					/>
				</button>

				<button
					aria-label="image preview view of blogs button"
					title="image preview view of blogs"
					class="view-btn"
					style=""
					on:click={() => {
						structuredView = true;
					}}
				>
					<SiteMapIcon
						iconStyle={'padding: 0.25rem;'}
						height={'1.5rem'}
						fill={structuredView ? '#5407d9' : ''}
					/>
				</button>
			</div>
		</div>
		<BlogTiles blogs={data} />
	</div>
{/if}

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
		background-color: lightgrey;
	}
</style>

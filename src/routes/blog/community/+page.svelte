<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import Layout from '$lib/components/blog/layout.svelte';
	// import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	// import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	// import Card from '$lib/components/atoms/card.svelte';
	export let data: PageData;
</script>

<svelte:head>
	<link rel="canonical" href="https://9takes.com/blog/community" />
</svelte:head>

<BlogPageHead
	data={{
		title: '9takes Community Blogs',
		description: 'List blogs outlining the ideas behind 9takes.'
	}}
	slug={`blog/community`}
/>

<div style="width: 100%;">
	<h1 id="">9takes Community Blogs</h1>

	<p>Here are the different blogs discussing the inspiration and ideas behind 9takes.</p>
	<h2>The inspiration behind 9takes</h2>
	<div class="blog-grid-container">
		{#each data.posts as blog}
			{#if blog?.type?.[0] === 'inspiration'}
				<a
					href={`/blog/community/${blog.slug}`}
					class="grid-item inline-it"
					style={blog.pic &&
						`background-image: url(${`/blogs/s-${blog.pic}.webp`}); background-size: cover;`}
				>
					<div class={blog.pic ? 'txt-white' : 'txt-dark'}>
						<h3 style:--tag={`h-blog-${blog.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}>
							{blog.title}
						</h3>
						<p class="font-adjust-p">{blog.description}</p>
					</div>
				</a>
			{/if}
		{/each}
	</div>

	<h2>The ideas behind 9takes</h2>

	<div class="blog-grid-container">
		{#each data.posts as blog}
			{#if blog?.type?.[0] === 'idea'}
				<a
					href={`/blog/community/${blog.slug}`}
					class="grid-item inline-it"
					style:--tag={`h-blog-${blog.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}
					style={blog.pic &&
						`background-image: url(${`/blogs/s-${blog.pic}.webp`}); background-size: cover;`}
				>
					<div class={blog.pic ? 'txt-white' : 'txt-dark'}>
						<h3>
							{blog.title}
						</h3>
						<p class="font-adjust-p">{blog.description}</p>
					</div>
				</a>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	h3 {
		font-size: 1.5rem;
	}
	p {
		font-size: 1rem;
	}
	a::after {
		display: none !important;
	}

	.blog-grid-container {
		column-count: 3;
		column-gap: 0.5rem;
		orphans: 1;
		gap: 1.5rem;
	}

	.blog-grid-container .grid-item {
		margin-bottom: 0.5rem;
		background-color: rgba(255, 255, 255, 0.5);
		background-size: cover;
		background-position: center;
		text-align: center;
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		position: relative;
		padding: 0.5rem;
		height: 100%;
		width: 100%;
		gap: 1rem;
		// overflow: hidden;
		&:hover {
			text-decoration: none;
			filter: sepia(100%) hue-rotate(160deg);
			border: 1px solid var(--color-theme-purple) !important;
		}
	}
	.fit-card {
		position: absolute;
		/* top: 0;
		right: 0; */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		padding: 1rem;
		width: 100%;
	}
	.inline-it {
		display: inline-block;
	}

	@media (max-width: 550px) {
		h3 {
			font-size: 1rem;
		}
		p {
			font-size: 0.7rem;
		}

		.blog-grid-container {
			grid-template-columns: 30vw 30vw 30vw;
		}
		.inline-it {
			width: 30vw; // !important;
		}
		.fit-card {
			padding: 0.5rem;
		}
	}

	@media (min-width: 850px) {
		.blog-grid-container {
			grid-auto-rows: 300px;
		}
	}
</style>

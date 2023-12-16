<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import Layout from '$lib/components/blog/layout.svelte';
	// import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	// import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	// import Card from '$lib/components/atoms/card.svelte';
	export let data: PageData;
</script>

<BlogPageHead
	data={{
		title: '9takes Enneagram Blogs',
		description: 'List of blogs explaining different parts of the enneagram'
	}}
	slug={'blog/enneagram'}
/>

<div style="width: 100%;">
	<h2 id="enneagram">Enneagram Blogs</h2>
	<div class="blog-grid-container">
		{#each data.enneagramBlogs as eBlog}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class="txt-white {eBlog.pic ? 'txt-white' : 'txt-dark'}">
					<h3>
						{eBlog.title}
					</h3>
					<p class="font-adjust-p">{eBlog.description}</p>
				</div>
			</a>
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
	a:hover {
		text-decoration: none;
		filter: sepia(100%) hue-rotate(160deg);
		border: 1px solid var(--color-theme-purple) !important;
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
		border-radius: 5px;
		position: relative;
		padding: 0.5rem;
		height: 100%;
		width: 100%;
		gap: 1rem;
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

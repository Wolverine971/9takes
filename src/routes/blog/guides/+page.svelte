<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<link rel="canonical" href="https://9takes.com/blog/guides" />
</svelte:head>

<BlogPageHead
	data={{
		title: '9takes Guides',
		description: 'Guides to various topics'
	}}
	slug={`blog/guides`}
/>

<div style="width: 100%;">
	<h1 id="guides">9takes Guides</h1>

	<div class="blog-grid-container temp-three-row">
		{#each data.posts as blog}
			<a
				href={`/blog/guides/${blog.slug}`}
				class="grid-item inline-it"
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
		{/each}
	</div>
	<br />
	<p>WIP 🚧</p>
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
		overflow: hidden;
	}

	.temp-three-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 0.7fr;
		gap: 0.5rem;
		grid-row: inherit;
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

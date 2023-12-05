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
	slug={`blog/community`}
/>

<h1 style="text-align: center;">9takes Guides</h1>
<div class="blog-list">
	<ol>
		{#each data.posts as blog}
			<li>
				<a href={`/blog/guides/${blog.slug}`}>
					<!-- {blog.slug.split('_').join(' ')}  -->
					<!-- <pre>{blog.title}</pre> -->
					{blog.title}
				</a>
			</li>
		{/each}
	</ol>
</div>

<style lang="scss">
	h3 {
		margin-top: 1rem;
		text-decoration: underline;
	}
	.position-center {
		text-align: center;
		margin: 1rem auto;
	}

	.section-content {
		border-right: solid;
		margin: 10px;
		padding: 10px;
	}

	.section-meta {
		margin: 10px;
		padding: 10px;
		transform: rotate(90deg);
	}
	.blog-list {
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: inherit;
		margin: 1rem;

		.preview {
			text-overflow: clip;
			white-space: nowrap;
			overflow-x: clip;
			overflow: hidden;
		}
	}
</style>

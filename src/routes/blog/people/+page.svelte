<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import Layout from '$lib/components/blog/layout.svelte';
	// import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	// import ArticleMeta from '$lib/components/blog/ArticleMeta.svelte';
	// import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	// import Card from '$lib/components/atoms/card.svelte';
	export let data: PageData;
</script>

<BlogPageHead
	data={{
		title: '9takes Analysis of Famous People',
		description: 'List famous people who have their enneagram type analyzed'
	}}
	slug={'/blog/people'}
/>
<Layout>
	<main>
		<h1 style="text-align: center;">9takes Analysis of Famous People</h1>
		<div class=" blog-list">
			<ol>
				{#each data.people as person}
					<li>
						<a href={`/blog/people/${person.slug}`}> {person.slug.split('_').join(' ')} </a>
					</li>
				{/each}
			</ol>
		</div>

		<p>Organization and additional people analysis coming soon 🚧</p>
	</main>
</Layout>

<style lang="scss">
	h3 {
		margin-top: 1rem;
		text-align: center;
	}
	.section-main {
		display: flex;
		justify-content: center;
		align-items: center;
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
		align-items: inherit;
		margin: 1rem;

		// .row {
		// 	display: flex;
		// 	justify-content: space-around;
		// }
		.big-a:hover {
			text-decoration: none;
		}
		.article-preview {
			max-width: none;
			height: clamp(1rem, 145px, 12rem);
			width: clamp(1rem, 345px, 32rem);
		}
		.preview {
			text-overflow: clip;
			white-space: nowrap;
			overflow-x: clip;
			overflow: hidden;
		}
		.row {
			display: flex;
			flex-direction: row;
			justify-content: center;
			flex-wrap: wrap;
			width: 100%;
			padding: 0 10%;
		}

		.column {
			display: flex;
			flex-direction: column;
			flex-basis: 100%;
			flex: 1;
			align-items: center;
		}

		@media all and (max-width: 576px) {
			.row {
				display: flex;
				flex-direction: column;
				width: 100%;
				padding: 0 10%;
			}

			.column {
				display: flex;
				flex-direction: column;
				flex-basis: 100%;
				flex: 1;
				align-items: center;
			}
		}
	}
</style>

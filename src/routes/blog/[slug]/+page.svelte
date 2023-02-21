<script lang="ts">
	import type { PageData } from './$types';
	import type { SvelteComponentTyped } from 'svelte/internal';
	import PageHead from '$lib/components/blog/PageHead.svelte';
	import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	import ArticleMeta from '$lib/components/blog/ArticleMeta.svelte';
	import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	import Card from '$lib/components/atoms/card.svelte';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;
	$: component = data.component as unknown as C;

	console.log(data);
</script>

<div style="align-items: inherit;">
	<PageHead data={data.frontmatter} slug={data.slug} />
	<ArticleTitle title={data.frontmatter.title} />
	<ArticleDescription description={data.frontmatter.description} />
	<ArticleMeta author={data.frontmatter.author} date={data.frontmatter.date} />
</div>
<svelte:component this={data.component} />

<hr style="margin: 5rem;" />
<div style="margin-bottom:5rem;">
	<h3 style="text-align: center;">More Blogs</h3>
	<div class="row">
		<div class="column">
			{#each data?.posts.slice(0, Math.ceil(data?.posts.length / 2)) as { slug, title, author, description, date }}
				<div class="article-preview">
					<Card>
						<a href={slug} class="big-a">
							<h3 class="preview" {title}>{title}</h3>
							<p class="preview" title={description}>
								{description}
							</p>
							<p>Read More &rarr;</p>
						</a>
					</Card>
				</div>
			{/each}
		</div>
		<div class="column">
			{#each data?.posts.slice(Math.ceil(data?.posts.length / 2)) as { slug, title, author, description, date }}
				<div class="article-preview">
					<Card>
						<a href={slug} class="big-a">
							<h3 class="preview" {title}>{title}</h3>
							<p class="preview" title={description}>
								{description}
							</p>
							<p>Read More &rarr;</p>
						</a>
					</Card>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
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
	}
	.row {
		display: flex;
		flex-direction: row;
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
		transition: transform 0.7s ease-in-out;
	}

	.section-meta:hover {
		transform: rotate(360deg);
	}
</style>

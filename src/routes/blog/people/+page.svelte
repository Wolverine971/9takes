<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import Layout from '$lib/components/blog/layout.svelte';
	// import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	// import ArticleMeta from '$lib/components/blog/ArticleMeta.svelte';
	// import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	// import Card from '$lib/components/atoms/card.svelte';
	export let data: PageData;
	const politicians = data.people.filter((person) => {
		return person.type?.includes('politician');
	});
	const celebrities = data.people.filter((person) => {
		return person.type?.includes('celebrity');
	});
	const artists = data.people.filter((person) => {
		return person.type?.includes('artist');
	});
	const musicians = data.people.filter((person) => {
		return person.type?.includes('musician');
	});
	const techies = data.people.filter((person) => {
		return person.type?.includes('techie');
	});
</script>

<BlogPageHead
	data={{
		title: '9takes Analysis of Famous People',
		description: 'List famous people who have their enneagram type analyzed'
	}}
	slug={'/blog/people'}
/>

<h1 style="text-align: center;">Person Analysis/ Character Studies</h1>
<div class="blog-list">
	<h3 class="position-center">Politicians</h3>
	<ul>
		{#each politicians as person}
			<li>
				<a href={`/blog/people/${person.slug}`}> {person.slug.split('_').join(' ')} </a>
			</li>
		{/each}
	</ul>
	<h3 class="position-center">Celebrities</h3>
	<ul>
		{#each celebrities as person}
			<li>
				<a href={`/blog/people/${person.slug}`}> {person.slug.split('_').join(' ')} </a>
			</li>
		{/each}
	</ul>

	<h3 class="position-center">Musicians</h3>
	<ul>
		{#each musicians as person}
			<li>
				<a href={`/blog/people/${person.slug}`}> {person.slug.split('_').join(' ')} </a>
			</li>
		{/each}
	</ul>
	<h3 class="position-center">Artists</h3>
	<ul>
		{#each artists as person}
			<li>
				<a href={`/blog/people/${person.slug}`}> {person.slug.split('_').join(' ')} </a>
			</li>
		{/each}
	</ul>
	<!-- <h3 class="position-center">Techies</h3>
	<ul>
		{#each techies as person}
			<li>
				<a href={`/blog/people/${person.slug}`}> {person.slug.split('_').join(' ')} </a>
			</li>
		{/each}
	</ul> -->

	<br />
	<hr />
	<br />
	<p class="position-center">🚧 More to come</p>
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
		margin: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		max-width: 250px;

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
			width: clamp(1rem, 321px, 32rem);
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

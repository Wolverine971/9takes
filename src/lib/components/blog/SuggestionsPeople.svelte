<script lang="ts">
	import Pluralize from 'pluralize';
	import PersonSuggestion from './PersonSuggestion.svelte';

	export let suggestions: {
		niche: { type: string; posts: App.BlogPost[] };
		sameEnneagram: { type: string; posts: App.BlogPost[] };
	};

	let innerWidth: number;

	$: capitalizedPluralNiche = formatNiche(suggestions.niche.type);

	function formatNiche(niche: string): string {
		const plural = Pluralize(niche);
		return (
			plural.charAt(0).toUpperCase() +
			plural
				.slice(1)
				.split(/(?=[A-Z])/)
				.join(' ')
		);
	}

	function slicePosts(posts: App.BlogPost[]): App.BlogPost[] {
		return posts.slice(0, innerWidth > 920 ? 6 : innerWidth > 576 ? 6 : 4);
	}
</script>

<svelte:window bind:innerWidth />

{#if suggestions.niche.posts.length || suggestions.sameEnneagram.posts.length}
	<section class="suggestions-container" aria-labelledby="suggestions-title">
		<h2 id="suggestions-title" class="suggestions-title">Further Analysis</h2>
		<div class="blog-previews" role="list">
			{#if suggestions.niche.posts.length}
				<PersonSuggestion
					title="More {capitalizedPluralNiche}"
					posts={slicePosts(suggestions.niche.posts)}
					sectionId="niche-suggestions"
				/>
			{/if}
			{#if suggestions.sameEnneagram.posts.length}
				<PersonSuggestion
					title="Other Enneagram {suggestions.sameEnneagram.type}s"
					posts={slicePosts(suggestions.sameEnneagram.posts)}
					sectionId="enneagram-suggestions"
				/>
			{/if}
		</div>
	</section>
{/if}

<style lang="scss">
	.suggestions-container {
		margin: 3rem 0 5rem;
		padding: 0 1rem;
	}

	.suggestions-title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 2rem;
		color: var(--text-color);
	}

	.blog-previews {
		display: flex;
		flex-direction: column;
		gap: 3rem;

		@media (min-width: 768px) {
			flex-direction: row;
			justify-content: space-between;
		}
	}
</style>

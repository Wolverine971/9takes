<script lang="ts">
	import Pluralize from 'pluralize';
	import PersonSuggestion from './PersonSuggestion.svelte';

	export let suggestions: {
		niche: { type: string; posts: App.BlogPost[] };
		sameEnneagram: { type: string; posts: App.BlogPost[] };
	};

	let innerWidth = 0;

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
		return posts.slice(0, innerWidth > 920 ? 5 : 3);
	}
</script>

<svelte:window bind:innerWidth />

{#if suggestions.niche.posts.length || suggestions.sameEnneagram.posts.length}
	<div class="suggestions-container">
		<h3 class="suggestions-title">Further Analysis</h3>
		<div class="blog-previews stack">
			{#if suggestions.niche.posts.length}
				<PersonSuggestion
					title="More {capitalizedPluralNiche}"
					posts={slicePosts(suggestions.niche.posts)}
				/>
			{/if}
			{#if suggestions.sameEnneagram.posts.length}
				<PersonSuggestion
					title="Other Enneagram {suggestions.sameEnneagram.type}s"
					posts={slicePosts(suggestions.sameEnneagram.posts)}
				/>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.suggestions-container {
		margin-bottom: 5rem;
	}

	.suggestions-title {
		text-align: center;
		margin-bottom: 1rem;
	}

	.blog-previews {
		display: flex;
		justify-content: space-evenly;
	}

	@media all and (max-width: 576px) {
		.stack {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
</style>

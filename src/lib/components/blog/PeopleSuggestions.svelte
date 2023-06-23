<script lang="ts">
	import Card from '../atoms/card.svelte';
	import Pluralize from 'pluralize';

	export let suggestions: {
		niche: { type: string; posts: App.BlogPost[] };
		sameEnneagram: { type: string; posts: App.BlogPost[] };
	};

	const pluralNiche = Pluralize(suggestions.niche.type);
	const firstLetter = pluralNiche.charAt(0);
	const firstLetterCap = firstLetter.toUpperCase();
	const remainingLetters = pluralNiche.slice(1);
	const capitalizedPluralNiche = firstLetterCap + remainingLetters;
</script>

<div style="margin-bottom:5rem;">
	<h3 style="text-align: center; margin-bottom: 3rem;">Explore Further</h3>
	<div class="blog-previews">
		<div style="column">
			<h3>More {capitalizedPluralNiche}</h3>
			{#each suggestions.niche.posts.slice(0, 5) as { slug, title, author, description, date }}
				<a class="card1" href={slug}>
					<h3 class="small-h3" {title}>{title}</h3>
					<p class="small" title={description}>{description}</p>
					<div class="go-corner">
						<div class="go-arrow">→</div>
					</div>
				</a>
			{/each}
		</div>

		<div class="column">
			<h3>More Enneagram {suggestions.sameEnneagram.type}s</h3>
			{#each suggestions.sameEnneagram.posts.slice(0, 5) as { slug, title, author, description, date }}
				<a class="card1" href={slug}>
					<h3 class="small-h3" {title}>{title}</h3>
					<p class="small" title={description}>{description}</p>
					<div class="go-corner">
						<div class="go-arrow">→</div>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- </div> -->
</div>

<style lang="scss">
	.small-h3 {
		color: #262626;
		font-size: 17px;
		line-height: 24px;
		font-weight: 700;
		margin-bottom: 4px;
	}

	p {
		font-size: 17px;
		font-weight: 400;
		line-height: 20px;
		color: #666666;

		&.small {
			font-size: 14px;
		}
	}

	.go-corner {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		width: 32px;
		height: 32px;
		overflow: hidden;
		top: 0;
		right: 0;
		background-color: var(--color-theme-purple);
		border-radius: 0 4px 0 32px;
	}

	.go-arrow {
		margin-top: -4px;
		margin-right: -4px;
		color: white;
		font-family: courier, sans;
	}

	.card1 {
		display: block;
		position: relative;
		max-width: 262px;
		//   background-color: #f2f8f9;
		border-radius: 4px;
		padding: 16px 12px;
		margin: 6px;
		text-decoration: none;
		z-index: 0;
		overflow: hidden;

		&:after {
			background-color: white;
		}

		&:before {
			// background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") 0 0 repeat;
			// transform: rotate(45deg);
			content: '';
			position: absolute;
			z-index: -1;
			top: -16px;
			right: -16px;
			background-color: var(--color-theme-purple);
			height: 32px;
			width: 32px;
			border-radius: 32px;
			transform: scale(1);
			transform-origin: 50% 50%;
			transition: transform 0.25s ease-out;
		}

		&:hover:before {
			transform: scale(21);
		}
	}

	.card1:hover {
		transform: rotate(1deg);
		p {
			transition: all 0.3s ease-out;
			color: rgba(255, 255, 255, 0.8);
		}
		h3 {
			transition: all 0.3s ease-out;
			color: #ffffff;
		}
	}

	.blog-previews {
		display: flex;
		justify-content: space-evenly;
	}
	.blog-preview {
		box-sizing: border-box;
		max-width: none;
		height: clamp(1rem, 145px, 12rem);
		width: clamp(1rem, 321px, 32rem);
		background: border-box;
		// margin-bottom: 20px;
		display: flex;
		flex-direction: column;
		flex: 1;
		max-height: 500px;
		max-width: 460px;
		margin: 1rem;
	}
	.big-a:hover {
		text-decoration: none;
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
		flex-wrap: wrap;
		width: 100%;
		padding: 0 10%;
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
			width: 100%;
			flex: 1;
			align-items: center;
		}
	}
</style>

<script lang="ts">
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
	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<div style="margin-bottom:5rem;">
	<h3 style="text-align: center; margin-bottom: 3rem;">Explore Further</h3>
	<div class="blog-previews stack">
		<div style="column">
			<h4 style="text-align: center;">More {capitalizedPluralNiche}</h4>
			{#each suggestions.niche.posts.slice(0, innerWidth > 920 ? 5 : 3) as { slug, title, author, description, date }}
				<a class="suggestion-link" href={slug}>
					<h3 class="small-h3" {title}>{title}</h3>
					<p class="small" title={description}>{description}</p>
					<div class="go-corner">
						<div class="go-arrow">→</div>
					</div>
				</a>
			{/each}
		</div>

		<div class="column">
			<h4 style="text-align: center;">More Enneagram {suggestions.sameEnneagram.type}s</h4>
			{#each suggestions.sameEnneagram.posts.slice(0, innerWidth > 920 ? 5 : 3) as { slug, title, author, description, date }}
				<a class="suggestion-link" href={slug}>
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
		background-color: var(--color-p-origin-v);
		border-radius: 0 4px 0 32px;
	}

	.go-arrow {
		margin-top: -4px;
		margin-right: -4px;
		color: white;
		font-family: courier, sans;
	}

	.suggestion-link {
		display: block;
		position: relative;
		max-width: 262px;
		width: 100%;
		//   background-color: #f2f8f9;
		border-radius: 4px;
		padding: 16px 12px;
		margin: 6px;
		text-decoration: none;
		z-index: 0;
		overflow: hidden;
		border: 1px solid var(--color-theme-purple-v);
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
			// background-color: var(--color-p-origin-v);
			// background-image: radial-gradient(
			// 	circle,
			// 	var(--color-p-origin-v) 1px,
			// 	var(--color-p-origin-v) 1px
			// );
			// background-size: 40px 40px;
			// background-image: linear-gradient(to right, var(--color-p-origin-v) 1px, transparent 1px),
			// 	linear-gradient(to bottom, var(--color-p-origin-v) 1px, transparent 1px);
			height: 32px;
			width: 32px;
			border-radius: 32px;
			transform: scale(1);
			transform-origin: 50% 50%;
			// transition: transform 0.25s ease-out;
		}

		&:hover:before {
			transform: scale(21);
		}
	}

	.suggestion-link:hover {
		transform: rotate(1deg);
		background-size: 10px 10px;
		background-image: radial-gradient(circle, var(--color-p-light) 1px, rgba(0, 0, 0, 0) 1px);
		p {
			transition: all 0.3s ease-out;
			// color: rgba(255, 255, 255, 0.8);
		}
		h3 {
			transition: all 0.3s ease-out;
			// color: #ffffff;
		}
	}

	.blog-previews {
		display: flex;
		justify-content: space-evenly;
	}

	@media all and (max-width: 576px) {
		.column {
			display: flex;
			flex-direction: column;
			flex-basis: 100%;
			width: 100%;
			flex: 1;
			align-items: center;
		}
		.stack {
			display: flex;
			flex-direction: column;
			flex-basis: 100%;
			width: 100%;
			flex: 1;
			align-items: center;
		}
	}
</style>

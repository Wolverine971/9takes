<script lang="ts">
	import Card from '../atoms/card.svelte';

	export let posts: any[];
</script>

<div style="margin-bottom:5rem;">
	<h3 style="text-align: center;">More Blogs</h3>
	<div class="row">
		<div class="column">
			{#each posts.slice(0, Math.ceil(posts.length / 2)) as { slug, title, author, description, date }}
				<div class="article-preview">
					<Card>
						<a href={slug} class="big-a">
							<h3 class="preview" {title}>{title}</h3>
							<p class="preview" title={description}>
								{description}
							</p>
							<p>Read More</p>
						</a>
					</Card>
				</div>
			{/each}
		</div>
		<div class="column">
			{#each posts.slice(Math.ceil(posts.length / 2)) as { slug, title, author, description, date }}
				<div class="article-preview">
					<Card>
						<a href={slug} class="big-a">
							<h3 class="preview" {title}>{title}</h3>
							<p class="preview" title={description}>
								{description}
							</p>
							<p>Read More</p>
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
		flex-wrap: wrap;
		width: 100%;
		padding: 0 10%;
	}

	.column {
		display: flex;
		flex-direction: column;
		flex-basis: 100%;
		justify-content: space-evenly;
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

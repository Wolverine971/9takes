<script lang="ts">
	import Card from '../atoms/card.svelte';

	export let posts: any[];
</script>

<div style="margin-bottom:5rem;">
	<h3 style="text-align: center;">More Blogs</h3>
	<!-- <div class="row"> -->
	<div class="blog-previews">
		{#each posts as { slug, title, author, description, date }}
			<div class="blog-preview">
				<Card>
					<a href={slug} class="big-a">
						<h4 class="preview" {title}>{title}</h4>
						<p class="preview" title={description}>
							{description}
						</p>
						<p>Read More</p>
					</a>
				</Card>
			</div>
		{/each}
	</div>

	<!-- </div> -->
</div>

<style lang="scss">
	.blog-previews {
		display: flex;
		flex-wrap: wrap;
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

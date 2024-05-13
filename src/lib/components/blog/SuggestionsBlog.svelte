<script lang="ts">
	export let posts: App.BlogPost[];
	export let blogType: string;
	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<div style="margin-bottom:5rem;">
	<h3 style="text-align: center;">More</h3>
	<div class="blog-grid-container">
		{#each posts.slice(0, innerWidth > 920 ? 10 : 6) as eBlog}
			<a
				href="/blog/{blogType}/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
				data-sveltekit-preload-data="tap"
			>
				<div class="txt-white {eBlog.pic ? 'txt-white' : 'txt-dark'}">
					<h3>
						{eBlog.title}
					</h3>
					<p class="font-adjust-p">{eBlog.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<style lang="scss">
	h3 {
		font-size: 1.5rem;
	}
	h2 {
		margin-top: 2rem;
	}
	p {
		font-size: 1rem;
	}
	a::after {
		display: none !important;
	}
	
	.blog-grid-container {
		column-count: 3;
		column-gap: 0.5rem;
		orphans: 1;
	}
	.inline-it {
		display: inline-block;
	}
	@media (max-width: 550px) {
		h3 {
			font-size: 1rem;
		}
		p {
			font-size: 0.7rem;
		}

		.blog-grid-container {
			grid-template-columns: 30vw 30vw 30vw;
		}
		.inline-it {
			width: 30vw;
		}
	}

	@media (min-width: 850px) {
		.blog-grid-container {
			grid-auto-rows: 300px;
		}
	}

	.grid-item {
		margin-bottom: 0.5rem;
		background-color: rgba(255, 255, 255, 0.5);
		background-size: cover;
		background-position: center;
		text-align: center;
		border: var(--classic-border);
		border-radius: 5px;
		position: relative;
		height: 100%;
		width: 100%;
		gap: 1rem;
		overflow: hidden;
		text-overflow: clip;

		&:hover {
			text-decoration: none;
			filter: sepia(100%) hue-rotate(160deg);
			border: 1px solid var(--color-theme-purple) !important;
		}
	}
</style>

<script lang="ts">
	export let blogs: {
		people: App.BlogPost[];
		enneagram: App.BlogPost[];
		community: App.BlogPost[];
	};
</script>

<div style="width: 100%;">
	<h2>Ideas behind 9takes</h2>
	<div class="blog-grid-container temp-three-row">
		{#each blogs?.community as cBlog}
			<a
				href="/blog/community/{cBlog.slug}"
				class="grid-item"
				style={cBlog.pic &&
					`background-image: url(${`/blogs/${cBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class="card text-white border-0 {cBlog.pic ? 'txt-white' : 'txt-dark'}">
					<h3>
						{cBlog.title}
					</h3>
					<p>{cBlog.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<div style="width: 100%;">
	<h2>People Analysis</h2>
	<div class="people-grid-container">
		{#each blogs?.people as person}
			<a
				href="/blog/famous-enneagram-types/{person.slug}"
				class="grid-item"
				style="background-image: url({`/types/${person.enneagram}s/${person.slug}.webp`}); background-size: cover; min-height:125px"
			>
				<div class="card text-white border-0 txt-white">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>
</div>

<div style="width: 100%;">
	<h2>Enneagram explained</h2>
	<div class="blog-grid-container">
		{#each blogs?.enneagram as eBlog}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class="card text-white border-0 {eBlog.pic ? 'txt-white' : 'txt-dark'}">
					<h3>
						{eBlog.title}
					</h3>
					<p>{eBlog.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<style class="scss">
	h3 {
		font-size: 1.5rem;
	}
	p {
		font-size: 1rem;
	}
	a::after {
		display: none !important;
	}
	a:hover {
		text-decoration: none;
		filter: sepia(100%) hue-rotate(160deg);
		border: 1px solid var(--color-theme-purple) !important;
	}

	.temp-three-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}

	.inline-it {
		display: inline-block;
	}

	.blog-grid-container {
		column-count: 3;
		column-gap: 0.5rem;
		orphans: 1;
	}
	.blog-grid-container .grid-item {
		margin-bottom: 0.5rem;
		background-color: rgba(255, 255, 255, 0.5);
		padding: 20px;
		font-size: 30px;
		text-align: center;
		border: var(--classic-border);
		border-radius: 5px;
	}
	.people-grid-container {
		width: 100%;
		display: grid;
		/* grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); */
		grid-template-columns: 1fr 1fr 1fr;
		column-count: 3;
		column-gap: 1.25rem;
		grid-gap: 0.5rem;
		/* padding: 20px; */
		/* column-count: 3;
		column-gap: 0.5rem;
		orphans: 1; */
	}

	.people-grid-container .grid-item {
		background-color: rgba(255, 255, 255, 0.5);
		padding: 20px;
		font-size: 30px;
		text-align: center;
		border: var(--classic-border);
		border-radius: 5px;
	}

	@media (max-width: 800px) {
		h3 {
			font-size: 1rem;
		}
		.people-grid-container {
			grid-template-columns: 1fr 1fr !important;
		}
		.blog-grid-container {
			column-count: 2 !important;
			grid-template-columns: 1fr 1fr !important;
		}
		/* .grid-container {
			display: grid;
			grid-template-columns: auto auto auto; 
			grid-gap: 20px;
			padding: 20px;
		} */
	}
</style>

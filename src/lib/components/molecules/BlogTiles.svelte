<!-- lib/components/molecules/BlogTiles.svelte -->
<script lang="ts">
	export let blogs: {
		people: App.BlogPost[];
		enneagram: App.BlogPost[];
		community: App.BlogPost[];
		guides: App.BlogPost[];
	};
</script>

<details open>
	<summary class="accordion">Table of Contents</summary>
	<ul>
		<li><a href="#ideas">Ideas behind 9takes</a></li>
		<li><a href="#guides">How to guides</a></li>
		<li><a href="#enneagram">Enneagram Corner</a></li>
		<li><a href="#people">Personality Analysis Corner</a></li>

		<ul>
			<li><a href="#musicians">Musicians/ Artists</a></li>
			<li><a href="#celebrities">Celebrities</a></li>
			<li><a href="#creators">Creators</a></li>
			<li><a href="#politicians">Politicians</a></li>
			<li><a href="#movie-stars">Movie Stars</a></li>
			<li><a href="#historical-figures">Historical Figures</a></li>
			<li><a href="#Techies">Techies</a></li>
		</ul>
	</ul>
</details>

<div style="width: 100%;">
	<h2 id="ideas">9takes Takes</h2>
	<div class="blog-grid-container temp-three-row">
		{#each blogs?.community as cBlog}
			<a
				href="/community/{cBlog.slug}"
				class="grid-item inline-it"
				style={cBlog.pic &&
					`background-image: url(${`/blogs/s-${cBlog.pic}.webp`}); background-size: cover;`}
				data-sveltekit-preload-data="tap"
			>
				<div class="txt-white {cBlog.pic ? 'txt-white' : 'txt-dark'}">
					<h3>
						{cBlog.title}
					</h3>
					<p class="font-adjust-p">{cBlog.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>

<div style="width: 100%;">
	<h2 id="guides">How to Guides</h2>
	<div class="blog-grid-container temp-three-row">
		{#each blogs?.guides as eBlog}
			<a
				href="/how-to-guides/{eBlog.slug}"
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

<div style="width: 100%;">
	<h2 id="enneagram">Enneagram Corner</h2>
	<div class="blog-grid-container temp-three-row">
		{#each blogs?.enneagram as eBlog}
			<a
				href="/enneagram-corner/{eBlog.slug}"
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

<div style="width: 100%;">
	<h2 id="people">Personality Analysis</h2>

	<div class="blog-grid-container temp-three-row">
		{#each blogs?.people as person}
			<a
				href="/personality-analysis/{person.slug}"
				class="grid-item max-high"
				data-sveltekit-preload-data="tap"
			>
				{#if person.enneagram}
					<img
						fetchPriority="low"
						loading="lazy"
						class="grid-img"
						srcset={`/types/${person.enneagram}s/s-${person.slug}.webp 218w`}
						src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
						alt={person.slug.split('-').join(' ')}
					/>
				{/if}
				<div class="fit-card txt-white">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>
</div>

<style class="scss">
	li::marker {
		display: none;
		content: '';
	}
	ul {
		/* // margin: 0;
		// padding: 0; */
	}
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

	.temp-three-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 0.5rem;
		grid-row: inherit;
	}

	.inline-it {
		display: inline-block;
	}

	.grid-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		border-radius: var(--base-border-radius);
	}

	/* cd */
	.fit-card {
		position: absolute;
		/* top: 0;
		right: 0; */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		padding: 1rem;
		width: 100%;
	}

	.blog-grid-container {
		column-count: 3;
		column-gap: 0.5rem;
		orphans: 1;
	}

	.blog-grid-container .grid-item {
		margin-bottom: 0.5rem;
		background-color: rgba(255, 255, 255, 0.5);
		background-size: cover;
		background-position: center;
		text-align: center;
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		position: relative;
		height: 100%;
		width: 100%;
		gap: 1rem;
		overflow: hidden;
		text-overflow: clip;

		&:hover {
			text-decoration: none;
			filter: sepia(100%) hue-rotate(160deg);
			border: 1px solid var(--primary) !important;
		}
	}
	.people-grid-container {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		column-count: 3;
		column-gap: 1.25rem;
		grid-gap: 0.5rem;
	}

	.people-grid-container .grid-item {
		overflow: hidden;
		background-color: rgba(255, 255, 255, 0.5);
		text-align: center;
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		position: relative;
		height: 100%;
	}

	.max-high {
		max-height: 220px;
	}

	@media (max-width: 550px) {
		h3 {
			font-size: 1rem;
		}
		p {
			font-size: 0.7rem;
		}

		.temp-three-row {
			display: grid;
			grid-template-columns: 30vw 30vw 30vw;
		}
		.people-grid-container {
			grid-template-columns: 30vw 30vw 30vw;
		}
		.blog-grid-container {
			grid-template-columns: 30vw 30vw 30vw;
		}
		.inline-it {
			width: 30vw;
		}
		.fit-card {
			padding: 0.5rem;
		}
	}

	@media (min-width: 850px) {
		.people-grid-container {
			grid-auto-rows: 300px;
		}

		.blog-grid-container {
			grid-auto-rows: 300px;
		}
	}
</style>

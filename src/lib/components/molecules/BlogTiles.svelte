<script lang="ts">
	// import { useLazyImage as lazyImage } from 'svelte-lazy-image';
	import { lazyLoad } from '../abstract/lazyLoad';

	export let blogs: {
		people: App.BlogPost[];
		enneagram: App.BlogPost[];
		community: App.BlogPost[];
		guides: App.BlogPost[];
	};
</script>

<div style="width: 100%;">
	<h2>Ideas behind 9takes</h2>
	<div class="blog-grid-container temp-three-row">
		{#each blogs?.community as cBlog}
			<a href="/blog/community/{cBlog.slug}" class="grid-item">
				{#if cBlog.pic}
					<img
						class="grid-img"
						src={`/blogs/s-${cBlog.pic}.webp`}
						alt={cBlog.pic.split('-').join(' ')}
					/>
				{/if}
				<div
					class="card text-white border-0 {cBlog.pic
						? 'txt-white fit-card'
						: 'txt-dark fit-card-center'}"
				>
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
	<h2>Guides</h2>
	<div class="blog-grid-container temp-three-row">
		{#each blogs?.guides as eBlog}
			<a
				href="/blog/guides/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class="card txt-white border-0  {eBlog.pic ? 'txt-white' : 'txt-dark'}">
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
	<h2>Enneagram explained</h2>
	<div class="blog-grid-container">
		{#each blogs?.enneagram as eBlog}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class="card txt-white border-0  {eBlog.pic ? 'txt-white' : 'txt-dark'}">
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
	<h2>People Analysis</h2>

	<h3 class="position-center">Musicians/ Artists</h3>
	<div class="people-grid-container">
		{#each blogs?.people.filter((person) => {
			return person.type?.includes('musician');
		}) as person}
			<a href="/blog/famous-enneagram-types/{person.slug}" class="grid-item">
				{#if person.enneagram}
					<img
						class="grid-img"
						src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
						alt={person.slug.split('-').join(' ')}
					/>
				{/if}
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="position-center">Celebrities</h3>
	<div class="people-grid-container">
		{#each blogs?.people.filter((person) => {
			return person.type?.includes('celebrity');
		}) as person}
			<a href="/blog/famous-enneagram-types/{person.slug}" class="grid-item">
				{#if person.enneagram}
					<img
						class="grid-img"
						src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
						alt={person.slug.split('-').join(' ')}
					/>
				{/if}
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="position-center">Creators</h3>
	<div class="people-grid-container">
		{#each blogs?.people.filter((person) => {
			return person.type?.includes('creator');
		}) as person}
			<a href="/blog/famous-enneagram-types/{person.slug}" class="grid-item">
				{#if person.enneagram}
					<img
						class="grid-img"
						src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
						alt={person.slug.split('-').join(' ')}
					/>
				{/if}
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="position-center">Politicians</h3>
	<div class="people-grid-container">
		{#each blogs?.people.filter((person) => {
			return person.type?.includes('politician');
		}) as person}
			<a href="/blog/famous-enneagram-types/{person.slug}" class="grid-item">
				{#if person.enneagram}
					<img
						class="grid-img"
						src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
						alt={person.slug.split('-').join(' ')}
					/>
				{/if}
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="position-center">Historical Figures</h3>
	<div class="people-grid-container">
		{#each blogs?.people.filter((person) => {
			return person.type?.includes('historical');
		}) as person}
			<a href="/blog/famous-enneagram-types/{person.slug}" class="grid-item">
				{#if person.enneagram}
					<img
						class="grid-img"
						src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
						alt={person.slug.split('-').join(' ')}
					/>
				{/if}
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
				</div>
			</a>
		{/each}
	</div>

	<h3 class="position-center">Movie Stars</h3>
	<div class="people-grid-container">
		{#each blogs?.people.filter((person) => {
			return person.type?.includes('movieStar');
		}) as person}
			<a href="/blog/famous-enneagram-types/{person.slug}" class="grid-item">
				{#if person.enneagram}
					<img
						class="grid-img"
						src={`/types/${person.enneagram}s/s-${person.slug}.webp`}
						alt={person.slug.split('-').join(' ')}
					/>
				{/if}
				<div class="card fit-card txt-white border-0 ">
					<h3>
						{person.slug.split('-').join(' ')}
					</h3>
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

	.grid-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.fit-card {
		position: absolute;
		/* top: 0;
		right: 0; */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		padding: 1rem;
	}

	.fit-card-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.blog-grid-container {
		column-count: 3;
		column-gap: 0.5rem;
		orphans: 1;
	}

	.blog-grid-container .grid-item {
		margin-bottom: 0.5rem;
		background-color: rgba(255, 255, 255, 0.5);
		text-align: center;
		border: var(--classic-border);
		border-radius: 5px;
		position: relative;
		padding: 0.5rem;
		box-sizing: border-box;
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
		background-color: rgba(255, 255, 255, 0.5);
		text-align: center;
		border: var(--classic-border);
		border-radius: 5px;
		position: relative;
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
	}
</style>

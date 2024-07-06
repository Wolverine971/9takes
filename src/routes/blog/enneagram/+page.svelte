<script lang="ts">
	import type { PageData } from './$types';
	import BlogPageHead from '$lib/components/blog/BlogPageHead.svelte';
	import ArrowRightIcon from '$lib/components/icons/arrowRightIcon.svelte';
	// import ArticleTitle from '$lib/components/blog/ArticleTitle.svelte';
	// import ArticleDescription from '$lib/components/blog/ArticleDescription.svelte';
	// import Card from '$lib/components/atoms/card.svelte';
	export let data: PageData;
	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<BlogPageHead
	data={{
		title: '9takes Enneagram Blogs',
		description:
			'Topics related to the Enneagram including the nine types, personal development, relationships, and more.'
	}}
	slug={'blog/enneagram'}
/>

<h1 id="enneagram">Enneagram Blogs</h1>
<details open>
	<summary class="accordion">Table of Contents</summary>
	<ul>
		<li><a href="#understanding">Understanding the Enneagram</a></li>
		<li><a href="#9types">The Nine Enneagram Types</a></li>
		<li><a href="#personal-development">The Enneagram for Personal Development</a></li>
		<li><a href="#relationships">The Enneagram in Relationships</a></li>
		<li><a href="#workplace">The Enneagram in the Workplace</a></li>
		<li><a href="#resources">The Enneagram Resources</a></li>
		<li><a href="#situations">The Enneagram Types in Specific Situations</a></li>
	</ul>
</details>

<h2 id="understanding">Understanding the Enneagram</h2>
<div class="blog-grid-container temp-three-row">
	{#each data.enneagramBlogs as eBlog}
		{#if eBlog.type[0] === 'overview'}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
					<h3>
						{eBlog.title}
					</h3>
					<p class="font-adjust-p">{eBlog.description}</p>
				</div>
			</a>
		{/if}
	{/each}
	{#if innerWidth > 550}
		<a href="/blog/enneagram/subtopic/overview" class="grid-item">
			<div class="fit-card black-white">
				<h3 style="">
					<span>All Enneagram topic blogs </span>
					<br />
					<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
				</h3>
			</div>
		</a>
	{/if}
</div>

{#if innerWidth <= 550}
	<a href="/blog/enneagram/subtopic/overview" class="">
		<div class="black-white">
			<h3 style="display: flex; align-items: center;">
				<span>All Enneagram topic blogs </span>

				<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
			</h3>
		</div>
	</a>
{/if}

<h2 id="9types">The Nine Enneagram Types</h2>
<div class="blog-grid-container">
	{#each data.enneagramBlogs as eBlog}
		{#if eBlog.type[0] === 'nine-types'}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
					<h3>
						{eBlog.title}
					</h3>
					<p class="font-adjust-p">{eBlog.description}</p>
				</div>
			</a>
		{/if}
	{/each}
</div>

<h2 id="personal-development">Using the Enneagram for Personal Development</h2>
<div class="blog-grid-container temp-three-row">
	{#each data.enneagramBlogs as eBlog}
		{#if eBlog.type[0] === 'development'}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
					<h3>
						{eBlog.title}
					</h3>
					<p class="font-adjust-p">{eBlog.description}</p>
				</div>
			</a>
		{/if}
	{/each}
	{#if innerWidth > 550}
		<a href="/blog/enneagram/subtopic/development" class="grid-item">
			<div class="fit-card black-white">
				<h3 style="">
					<span>All personal development blogs </span>
					<br />
					<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
				</h3>
			</div>
		</a>
	{/if}
</div>
{#if innerWidth <= 550}
	<a href="/blog/enneagram/subtopic/development" class="">
		<div class="black-white">
			<h3 style="display: flex; align-items: center;">
				<span>All personal development blogs </span>
				<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
			</h3>
		</div>
	</a>
{/if}

<h2 id="relationships">Enneagram in Relationships</h2>
<div class="blog-grid-container temp-three-row three-small">
	{#each data.enneagramBlogs as eBlog}
		{#if eBlog.type[0] === 'relationships'}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
					<h3>
						{eBlog.title}
					</h3>
					<p class="font-adjust-p">{eBlog.description}</p>
				</div>
			</a>
		{/if}
	{/each}
	{#if innerWidth > 550}
		<a href="/blog/enneagram/subtopic/relationships" class="grid-item">
			<div class="fit-card black-white">
				<h3 style="">
					<span>All relationship blogs </span>
					<br />
					<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
				</h3>
			</div>
		</a>
	{/if}
</div>

{#if innerWidth <= 550}
	<a href="/blog/enneagram/subtopic/relationships" class="">
		<div class="black-white">
			<h3 style="display: flex; align-items: center;">
				<span>All relationship blogs </span>
				<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
			</h3>
		</div>
	</a>
{/if}

<h2 id="workplace">Enneagram in the Workplace</h2>
<div class="blog-grid-container temp-three-row">
	{#each data.enneagramBlogs as eBlog}
		{#if eBlog.type[0] === 'workplace'}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
					<h3>
						{eBlog.title}
					</h3>
					<p class="font-adjust-p">{eBlog.description}</p>
				</div>
			</a>
		{/if}
	{/each}
	{#if innerWidth > 550}
		<a href="/blog/enneagram/subtopic/workplace" class="grid-item">
			<div class="fit-card black-white">
				<h3 style="">
					<span>All workplace blogs </span>
					<br />
					<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
				</h3>
			</div>
		</a>
	{/if}
</div>

{#if innerWidth <= 550}
	<a href="/blog/enneagram/subtopic/workplace" class="">
		<div class="black-white">
			<h3 style="display: flex; align-items: center;">
				<span>All workplace blogs </span>
				<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
			</h3>
		</div>
	</a>
{/if}

<h2 id="resources">Enneagram Resources</h2>
<div class="blog-grid-container temp-three-row">
	{#each data.enneagramBlogs as eBlog}
		{#if eBlog.type[0] === 'resources'}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
					<h3>
						{eBlog.title}
					</h3>
					<p class="font-adjust-p">{eBlog.description}</p>
				</div>
			</a>
		{/if}
	{/each}
	{#if innerWidth > 550}
		<a href="/blog/enneagram/subtopic/resources" class="grid-item">
			<div class="fit-card black-white">
				<h3 style="">
					<span>All resource blogs </span>
					<br />
					<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
				</h3>
			</div>
		</a>
	{/if}
</div>
{#if innerWidth <= 550}
	<a href="/blog/enneagram/subtopic/resources" class="">
		<div class="black-white">
			<h3 style="display: flex; align-items: center;">
				<span>All resource blogs </span>
				<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
			</h3>
		</div>
	</a>
{/if}

<h2 id="situations">Enneagram Situational Topics</h2>
<div class="blog-grid-container temp-three-row">
	{#each data.enneagramBlogs as eBlog}
		{#if eBlog.type[0] === 'situational'}
			<a
				href="/blog/enneagram/{eBlog.slug}"
				class="grid-item inline-it"
				style={eBlog.pic &&
					`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
			>
				<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
					<h3>
						{eBlog.title}
					</h3>
					<p class="font-adjust-p">{eBlog.description}</p>
				</div>
			</a>
		{/if}
	{/each}
	{#if innerWidth > 550}
		<a href="/blog/enneagram/subtopic/situational" class="grid-item">
			<div class="fit-card black-white">
				<h3 style="">
					<span>All situational blogs </span>
					<br />
					<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
				</h3>
			</div>
		</a>
	{/if}
</div>
{#if innerWidth <= 550}
	<a href="/blog/enneagram/subtopic/situational" class="">
		<div class="black-white">
			<h3 style="display: flex; align-items: center;">
				<span>All situational blogs </span>
				<ArrowRightIcon iconStyle={'margin-left: .5rem'} height={'1.5rem'} fill={'#5407d9'} />
			</h3>
		</div>
	</a>
{/if}

<style lang="scss">
	h3 {
		font-size: 1.5rem;
	}
	p {
		font-size: 1rem;
	}
	a::after {
		display: none !important;
	}
	// a:hover {
	// 	text-decoration: none;
	// 	filter: sepia(100%) hue-rotate(160deg);
	// 	border: 1px solid var(--color-theme-purple) !important;
	// }
	.blog-grid-container {
		column-count: 3;
		column-gap: 0.5rem;
		orphans: 1;
		gap: 1.5rem;
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
		padding: 0.5rem;
		// height: 100%;
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

	.temp-three-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 0.7fr;
		gap: 0.5rem;
		grid-row: inherit;
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
		width: 100%;
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

		.temp-three-row {
			display: grid;
			grid-template-columns: 30vw 30vw 30vw;
		}

		.blog-grid-container {
			grid-template-columns: 30vw 30vw 30vw;
			column-gap: 0.5rem;
		}
		.inline-it {
			width: 30vw; // !important;
		}
		.fit-card {
			padding: 0.5rem;
		}
	}

	@media (min-width: 850px) {
		.blog-grid-container {
			grid-auto-rows: 300px;
		}
	}
</style>

<!-- src/lib/components/blog/ArticleSubTitle.svelte -->
<script lang="ts">
	export let metaData: App.BlogPost;

	// import twitter from '$lib/images/twitter.svg';

	const createdDate = new Date(metaData.date);
	$: year = createdDate.getFullYear();
	$: month = createdDate.getMonth() + 1;
	$: day = createdDate.getDate();

	const lastUpdated = new Date(metaData.lastmod);
	$: lastUpdatedYear = lastUpdated.getFullYear();
	$: lastUpdatedMonth = lastUpdated.getMonth() + 1;
	$: lastUpdatedDay = lastUpdated.getDate();
</script>

<p>
	<span
		class="author"
		title="he is so cool"
		itemprop="author"
		itemscope
		itemtype="https://schema.org/Person"
	>
		<a
			itemprop="url"
			class="external-link"
			target="_blank"
			rel="noreferrer"
			href="https://twitter.com/djwayne3"
			style="padding: 0.5rem"
		>
			<span itemprop="name">{metaData.author}</span>
		</a>
	</span>
	{#if createdDate.toDateString() !== lastUpdated.toDateString()}
		<time class="date" itemprop="dateModified" datetime={metaData.lastmod}>
			(Updated: {lastUpdatedMonth}/{lastUpdatedDay}/{lastUpdatedYear})
		</time>
		<meta itemprop="datePublished" content={metaData.date} />
	{:else}
		<time class="date" itemprop="datePublished" datetime={metaData.date}>
			{month}/{day}/{year}
		</time>
	{/if}
</p>

<style>
	p {
		margin: 0;
		margin-bottom: calc(var(--spacing-unit) * 4);
		color: #cbd5e1;
	}
	.author {
		font-weight: bold;
		margin-right: calc(var(--spacing-unit) * 1);
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}
	.author a {
		color: #a78bfa;
		text-decoration: none;
		transition: color 0.2s ease;
	}
	.author a:hover {
		color: #c4b5fd;
	}
	.date {
		color: #94a3b8;
	}

	@media (max-width: 500px) {
		p {
			margin: calc(var(--spacing-unit));
			margin-bottom: calc(var(--spacing-unit));
		}
	}
</style>

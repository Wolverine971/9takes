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

<p class="article-meta">
	<span class="author" itemprop="author" itemscope itemtype="https://schema.org/Person">
		<a
			itemprop="url"
			class="external-link"
			target="_blank"
			rel="noreferrer"
			href="https://twitter.com/djwayne3"
		>
			<span itemprop="name">{metaData.author}</span>
		</a>
	</span>
	<span class="separator">|</span>
	<time class="date" itemprop="datePublished" datetime={metaData.date}>
		Published: {month}/{day}/{year}
	</time>
	{#if createdDate.toDateString() !== lastUpdated.toDateString()}
		<span class="separator">|</span>
		<time class="date updated" itemprop="dateModified" datetime={metaData.lastmod}>
			Updated: {lastUpdatedMonth}/{lastUpdatedDay}/{lastUpdatedYear}
		</time>
	{/if}
</p>

<style>
	.article-meta {
		margin: 0;
		margin-bottom: calc(var(--spacing-unit) * 4);
		color: #cbd5e1;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9375rem;
	}
	.author {
		font-weight: 600;
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
	.separator {
		color: #475569;
	}
	.date {
		color: #94a3b8;
	}
	.date.updated {
		color: #22c55e;
		font-weight: 500;
	}

	@media (max-width: 500px) {
		.article-meta {
			margin: calc(var(--spacing-unit));
			margin-bottom: calc(var(--spacing-unit) * 2);
			font-size: 0.8125rem;
			gap: 0.375rem;
		}
	}
</style>

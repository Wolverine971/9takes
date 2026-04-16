<!-- src/lib/components/blog/ArticleSubTitle.svelte -->
<script lang="ts">
	export let metaData: App.BlogPost;

	// import twitter from '$lib/images/twitter.svg';

	type DisplayDate = {
		key: string;
		label: string;
	};

	function formatStoredDate(value: string | null | undefined): DisplayDate | null {
		if (!value) return null;

		const literalDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (literalDateMatch) {
			const [, year, month, day] = literalDateMatch;
			return {
				key: `${year}-${month}-${day}`,
				label: `${Number(month)}/${Number(day)}/${year}`
			};
		}

		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) return null;

		const year = parsed.getUTCFullYear();
		const month = parsed.getUTCMonth() + 1;
		const day = parsed.getUTCDate();

		return {
			key: parsed.toISOString().slice(0, 10),
			label: `${month}/${day}/${year}`
		};
	}

	$: publishedDate = formatStoredDate(metaData.date);
	$: modifiedDate = formatStoredDate(metaData.lastmod);
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
		Published: {publishedDate?.label ?? metaData.date}
	</time>
	{#if modifiedDate && modifiedDate.key !== publishedDate?.key}
		<span class="separator">|</span>
		<time class="date updated" itemprop="dateModified" datetime={metaData.lastmod}>
			Updated: {modifiedDate.label}
		</time>
	{/if}
</p>

<style>
	.article-meta {
		margin: 0;
		margin-bottom: calc(var(--spacing-unit) * 4);
		color: var(--neutral-700);
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
		color: var(--accent-light);
		text-decoration: none;
		transition: color 0.2s ease;
	}
	.author a:hover {
		color: var(--primary-lightest);
	}
	.separator {
		color: var(--text-secondary);
	}
	.date {
		color: var(--text-secondary);
	}
	.date.updated {
		color: #22c55e;
		font-weight: 500;
	}

	:global(:root.light) .date.updated {
		color: #15803d;
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

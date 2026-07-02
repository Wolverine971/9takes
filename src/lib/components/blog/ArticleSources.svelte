<!-- src/lib/components/blog/ArticleSources.svelte -->
<script lang="ts">
	export let citations: string[] | null | undefined = [];
	export let articleCitations: App.BlogPostCitation[] | null | undefined = [];

	type DisplaySource = {
		key: string;
		label: string;
		href?: string;
		meta?: string;
	};

	function publisherName(value: App.BlogPostCitation['publisher']): string {
		if (!value) return '';
		if (typeof value === 'string') return value;
		return value.name ?? '';
	}

	function formatUrlLabel(value: string): string {
		try {
			const url = new URL(value);
			const host = url.hostname.replace(/^www\./, '');
			const pathParts = url.pathname
				.replace(/\/+$/, '')
				.split('/')
				.filter(Boolean)
				.slice(-2)
				.map((part) => decodeURIComponent(part).replace(/[-_]+/g, ' '));

			return pathParts.length ? `${host}: ${pathParts.join(' / ')}` : host;
		} catch {
			return value;
		}
	}

	function normalizeSources(
		rawCitations: string[] | null | undefined,
		rawArticleCitations: App.BlogPostCitation[] | null | undefined
	): DisplaySource[] {
		const seen = new Set<string>();
		const sources: DisplaySource[] = [];

		for (const citation of rawArticleCitations ?? []) {
			if (!citation?.name) continue;
			const href =
				typeof citation.url === 'string' && citation.url.trim() ? citation.url.trim() : '';
			const key = href || citation.name;
			if (seen.has(key)) continue;
			seen.add(key);

			const meta = [citation.author, publisherName(citation.publisher), citation.datePublished]
				.filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
				.join(' / ');

			sources.push({
				key,
				label: citation.name,
				...(href && { href }),
				...(meta && { meta })
			});
		}

		for (const citation of rawCitations ?? []) {
			if (typeof citation !== 'string') continue;
			const trimmed = citation.trim();
			if (!trimmed || seen.has(trimmed)) continue;
			seen.add(trimmed);

			sources.push({
				key: trimmed,
				label: formatUrlLabel(trimmed),
				href: /^https?:\/\//i.test(trimmed) ? trimmed : undefined
			});
		}

		return sources;
	}

	$: sources = normalizeSources(citations, articleCitations);
</script>

{#if sources.length > 0}
	<aside class="article-sources" aria-labelledby="article-sources-heading">
		<div class="article-sources__eyebrow">Source Trail</div>
		<h2 id="article-sources-heading">Sources Behind This Read</h2>
		<ol>
			{#each sources as source}
				<li>
					{#if source.href}
						<a href={source.href}>{source.label}</a>
					{:else}
						<span>{source.label}</span>
					{/if}
					{#if source.meta}
						<small>{source.meta}</small>
					{/if}
				</li>
			{/each}
		</ol>
	</aside>
{/if}

<style lang="scss">
	.article-sources {
		width: 100%;
		max-width: var(--prose-measure);
		margin: 3rem auto 3.5rem;
		padding: 1.25rem 0 0;
		border-top: 1px solid var(--stone-edge);
		font-family: var(--font-display);
		color: var(--ink-bright);
	}

	.article-sources__eyebrow {
		margin-bottom: 0.5rem;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--data-teal);
	}

	h2 {
		margin: 0 0 0.85rem;
		font-family: var(--font-display);
		font-size: clamp(20px, 2.2vw, 24px);
		line-height: 1.2;
		font-weight: 700;
		letter-spacing: 0;
		color: var(--ink-bright);
	}

	ol {
		display: grid;
		gap: 0.65rem;
		margin: 0;
		padding-left: 1.15rem;
	}

	li {
		padding-left: 0.25rem;
		color: var(--ink-mid);
		line-height: 1.45;
	}

	a {
		color: var(--lamp-glow);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		overflow-wrap: anywhere;

		&:hover {
			color: var(--lamp-light);
			border-bottom-color: currentColor;
		}
	}

	span {
		overflow-wrap: anywhere;
	}

	small {
		display: block;
		margin-top: 0.2rem;
		font-size: 0.82rem;
		color: var(--ink-dim);
	}
</style>

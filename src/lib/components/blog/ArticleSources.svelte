<!-- src/lib/components/blog/ArticleSources.svelte -->
<script lang="ts">
	interface Props {
		citations?: string[] | null | undefined;
		articleCitations?: App.BlogPostCitation[] | null | undefined;
	}

	let { citations = [], articleCitations = [] }: Props = $props();

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
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- local dedupe set inside a pure function, never reactive
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

	let sources = $derived(normalizeSources(citations, articleCitations));
</script>

{#if sources.length > 0}
	<aside class="article-sources" aria-labelledby="article-sources-heading">
		<div class="article-sources__eyebrow">Source Trail</div>
		<h2 id="article-sources-heading">Sources Behind This Read</h2>
		<ol>
			{#each sources as source (source.key)}
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
		border-top: 1px solid var(--rule);
		font-family: var(--font-talk);
		color: var(--text);
	}

	.article-sources__eyebrow {
		margin-bottom: 0.5rem;
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	h2 {
		margin: 0 0 0.85rem;
		font-family: var(--font-talk);
		font-size: clamp(20px, 2.2vw, 24px);
		line-height: 1.2;
		font-weight: 600;
		letter-spacing: 0;
		color: var(--text);
	}

	/* Tailwind preflight strips list markers, which left the list indented
	   for numbers that never rendered. Show them: a numbered trail. */
	ol {
		display: grid;
		gap: 0.65rem;
		margin: 0;
		padding-left: 1.75rem;
		list-style: decimal;
	}

	li {
		padding-left: 0.25rem;
		color: var(--text-muted);
		line-height: 1.45;

		&::marker {
			font-family: var(--font-talk);
			font-size: var(--font-size-xs);
			font-variant-numeric: tabular-nums;
			color: var(--text-faint);
		}
	}

	a {
		color: var(--highlight);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		text-decoration-color: color-mix(in srgb, var(--highlight) 45%, transparent);
		overflow-wrap: anywhere;

		&:hover {
			color: var(--text);
			text-decoration-color: currentColor;
		}
	}

	span {
		overflow-wrap: anywhere;
	}

	small {
		display: block;
		margin-top: 0.2rem;
		font-size: var(--font-size-sm);
		color: var(--text-faint);
	}
</style>

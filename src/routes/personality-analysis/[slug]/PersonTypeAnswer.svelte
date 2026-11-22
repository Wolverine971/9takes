<!-- src/routes/personality-analysis/[slug]/PersonTypeAnswer.svelte -->
<script lang="ts">
	// The direct answer at the top of a person page (search-term analysis,
	// 2026-11-21): searchers ask "what is X's personality type", and the page
	// should answer before the long read. Data comes from buildPersonTypeAnswer.
	import {
		buildPersonalityAnalysisPath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';

	let {
		name,
		typeNum,
		typeName,
		wing = null,
		tell = null,
		peers = [],
		mbti = null
	}: {
		name: string;
		typeNum: number;
		typeName: string;
		wing?: string | null;
		tell?: string | null;
		peers?: string[];
		/** MBTI-line test pages only (src/lib/data/mbtiTestReads.ts). */
		mbti?: string | null;
	} = $props();

	const typeLabel = $derived(wing ?? `Type ${typeNum}`);
	const peerLinks = $derived(
		peers.map((slug) => ({
			slug,
			name: formatPersonalityDisplayName(slug),
			href: buildPersonalityAnalysisPath(slug)
		}))
	);
</script>

<section class="type-answer" aria-labelledby="type-answer-heading">
	<p class="kicker">The short answer</p>
	<h2 id="type-answer-heading">
		{name}’s Enneagram type: <span class="type">{typeLabel}</span>{#if typeName}<span
				class="type-name">, {typeName}</span
			>{/if}
	</h2>
	{#if tell}
		<p class="tell"><span class="label">The tell:</span> {tell}</p>
	{/if}
	{#if mbti}
		<p class="tell">
			<span class="label">Looking for MBTI?</span> The most common read online is {mbti}. We use the
			Enneagram because it shows why someone acts, not just how.
			<a href="/enneagram-corner/enneagram-vs-meyers-briggs">The difference</a>
		</p>
	{/if}
	<p class="peers">
		{#if peerLinks.length}
			<span class="label">Also Type {typeNum}:</span>
			{#each peerLinks as peer (peer.slug)}
				<a href={peer.href}>{peer.name}</a><span class="sep" aria-hidden="true">·</span>
			{/each}
		{/if}
		<a class="hub" href={`/personality-analysis/type/${typeNum}`}
			>See every famous Type {typeNum} →</a
		>
	</p>
</section>

<style>
	.type-answer {
		display: grid;
		gap: 0.55rem;
		max-width: 46rem;
		margin: 0 auto;
		padding: 1rem 1.15rem;
		border: 1px solid var(--rule);
		border-left: 3px solid var(--highlight);
		border-radius: 10px;
		background: var(--surface);
		color: var(--text);
	}

	.kicker {
		margin: 0;
		font-size: var(--font-size-xs, 0.75rem);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	h2 {
		margin: 0;
		font-family: inherit;
		font-size: var(--font-size-xl);
		font-weight: 600;
		line-height: 1.3;
		text-transform: none;
		letter-spacing: 0;
		color: var(--text);
		text-wrap: balance;
	}

	.type {
		color: var(--highlight);
	}

	.type-name {
		color: var(--text-muted);
		font-weight: 500;
	}

	.tell,
	.peers {
		margin: 0;
		font-size: var(--font-size-sm, 0.95rem);
		line-height: 1.55;
		color: var(--text-muted);
	}

	.label {
		font-weight: 600;
		color: var(--text);
	}

	.peers {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.45rem;
	}

	a {
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	a:focus-visible {
		outline: 2px solid var(--highlight);
		outline-offset: 2px;
	}

	.sep {
		color: var(--text-faint);
	}

	.hub {
		font-weight: 600;
	}
</style>

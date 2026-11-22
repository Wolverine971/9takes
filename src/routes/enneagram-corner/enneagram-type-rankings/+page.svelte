<!-- src/routes/enneagram-corner/enneagram-type-rankings/+page.svelte -->
<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';
	import RankingCard from './RankingCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const TYPE_KEY = '9takes:my-type';
	const VOTES_KEY = '9takes:rankings-votes';
	type Votes = Record<string, { me?: boolean; pick?: number }>;

	let myType = $state<number | null>(null);
	let votes = $state<Votes>({});
	let typeNudge = $state(false);
	let typePicker = $state<HTMLElement | null>(null);

	// The reader's type and past votes live in their own browser only.
	$effect(() => {
		try {
			const savedType = Number(localStorage.getItem(TYPE_KEY));
			if (savedType >= 1 && savedType <= 9) myType = savedType;
			votes = JSON.parse(localStorage.getItem(VOTES_KEY) ?? '{}') ?? {};
		} catch {
			/* storage blocked: the page still works, it just forgets */
		}
	});

	function chooseType(n: number) {
		myType = myType === n ? null : n;
		typeNudge = false;
		try {
			if (myType) localStorage.setItem(TYPE_KEY, String(myType));
			else localStorage.removeItem(TYPE_KEY);
		} catch {
			/* ignore */
		}
	}

	function recordVote(trait: string, vote: { me?: boolean; pick?: number }) {
		votes = { ...votes, [trait]: vote };
		try {
			localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
		} catch {
			/* ignore */
		}
	}

	function needType() {
		typeNudge = true;
		typePicker?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		typePicker?.querySelector('button')?.focus({ preventScroll: true });
	}

	const title = 'Which Enneagram Type Is the Most…? Every Pick, Ranked';
	const description =
		'Which Enneagram type is the most jealous, emotional, selfish, successful or hardest to love? Our pick for each, why, and what readers of every type voted.';
	const canonical = 'https://9takes.com/enneagram-corner/enneagram-type-rankings';

	let jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: title,
		url: canonical,
		itemListElement: data.rows
			.filter((row) => row.isLive)
			.map((row, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: `${row.question} Type ${row.pick}`,
				url: `https://9takes.com${row.postPath}`
			}))
	});
</script>

<SEOHead {title} {description} {canonical} noindex={data.noindex} nofollow={false} {jsonLd} />

<main class="rankings">
	<header class="intro">
		<p class="kicker">Enneagram Corner</p>
		<h1>Which type is the most…?</h1>
		<p class="voice">Every pick we’ve made, and what you think of it.</p>
		<p class="lede">
			Most Enneagram sites won’t name one type. We do, and we show our reasons. Then it’s your turn:
			tell us if a trait is you, or vote your own pick if ours is wrong. You see what other readers
			said after you vote.
		</p>
	</header>

	<section
		class={['your-type', { nudge: typeNudge }]}
		bind:this={typePicker}
		aria-labelledby="your-type-heading"
	>
		<h2 id="your-type-heading">Your type</h2>
		<p class="hint">
			{#if typeNudge}
				Pick your type first, so “This is me” counts for the right type.
			{:else}
				Needed for “This is me”. Saved in this browser only.
			{/if}
		</p>
		<div class="type-row" role="group" aria-label="Your Enneagram type">
			{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n (n)}
				<button
					type="button"
					class="type-chip"
					aria-pressed={myType === n}
					title={ENNEAGRAM_TYPE_COLORS[n]?.name}
					onclick={() => chooseType(n)}>{n}</button
				>
			{/each}
			<a class="test-link" href="/enneagram-test">Not sure? Take the test</a>
		</div>
	</section>

	{#each data.groups as group (group.slug)}
		<section class="group" aria-labelledby={`group-${group.slug}`}>
			<h2 id={`group-${group.slug}`}>{group.title}</h2>
			<div class="cards">
				{#each data.rows.filter((row) => row.group === group.slug) as row (row.trait)}
					<RankingCard
						{row}
						initialResults={data.summary[row.trait]}
						{myType}
						voted={votes[row.trait] ?? null}
						onvoted={recordVote}
						onneedtype={needType}
					/>
				{/each}
			</div>
		</section>
	{/each}

	<p class="footnote">
		Picks are ours and come from each linked post. A reader’s “why” stays private; we read them when
		we revise a page. Missing a trait you want ranked? Vote “wrong pick” anywhere and tell us in the
		why box.
	</p>
</main>

<style>
	.rankings {
		--rankings-title: clamp(2.5rem, 7vw, 4rem);
		display: grid;
		gap: 2.5rem;
		max-width: 52rem;
		margin: 0 auto;
		padding-block: 3rem 4rem;
		padding-left: max(16px, env(safe-area-inset-left, 0px));
		padding-right: max(16px, env(safe-area-inset-right, 0px));
		color: var(--text);
	}

	.intro {
		display: grid;
		gap: 0.75rem;
	}

	.kicker {
		margin: 0;
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	h1 {
		margin: 0;
		font-family: var(--font-shout);
		font-size: var(--rankings-title);
		line-height: 1;
		text-transform: uppercase;
		color: var(--text);
		text-wrap: balance;
	}

	.voice {
		margin: 0;
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-xl);
		color: var(--highlight);
	}

	.lede {
		margin: 0;
		max-width: 62ch;
		line-height: 1.6;
		color: var(--text-muted);
	}

	h2 {
		margin: 0;
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--text);
	}

	.your-type {
		display: grid;
		gap: 0.5rem;
		padding: 1rem 1.2rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--surface);
	}

	.your-type.nudge {
		border-color: var(--highlight);
	}

	.hint {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}

	.type-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
	}

	.type-chip {
		min-width: 2.6rem;
		font: inherit;
		font-size: var(--font-size-sm);
		text-align: center;
		color: var(--text);
		background: var(--surface-raised);
		border: 1px solid var(--rule);
		border-radius: 10px;
		padding: 0.45rem 0.6rem;
		cursor: pointer;
	}

	.type-chip[aria-pressed='true'] {
		border-color: var(--highlight);
		color: var(--highlight);
	}

	.type-chip:focus-visible {
		outline: 2px solid var(--highlight);
		outline-offset: 2px;
	}

	.test-link {
		margin-left: 0.4rem;
		font-size: var(--font-size-sm);
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.group {
		display: grid;
		gap: 1rem;
	}

	.cards {
		display: grid;
		gap: 1rem;
	}

	.footnote {
		margin: 0;
		font-size: var(--font-size-sm);
		line-height: 1.6;
		color: var(--text-faint);
	}
</style>

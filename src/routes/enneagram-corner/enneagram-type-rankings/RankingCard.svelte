<!-- src/routes/enneagram-corner/enneagram-type-rankings/RankingCard.svelte -->
<script lang="ts">
	// One trait on the rankings hub: our pick, then two ways to answer before you
	// see the crowd: "This is me" (with your type) and "Wrong pick?" (your own
	// answer, an optional private why). Results show for this card after you vote.
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import { MIN_PICK_VOTES } from '$lib/data/superlativeRankings.js';

	type Results = {
		pickCounts: number[];
		pickTotal: number;
		readersPick: number | null;
		meCounts: number[];
		meTotal: number;
		meRates: (number | null)[];
	};
	type Row = {
		trait: string;
		label: string;
		question: string;
		pick: number;
		runnerUp: number | null;
		least: number | null;
		reason: string;
		postPath: string;
		selfReport: boolean;
		isLive: boolean;
	};

	let {
		row,
		initialResults = null,
		myType = null,
		voted = null,
		onvoted,
		onneedtype
	}: {
		row: Row;
		initialResults?: Results | null;
		myType?: number | null;
		/** What this visitor already did here (remembered in their browser). */
		voted?: { me?: boolean; pick?: number } | null;
		onvoted?: (trait: string, vote: { me?: boolean; pick?: number }) => void;
		onneedtype?: () => void;
	} = $props();

	const typeName = (n: number | null) => (n ? (ENNEAGRAM_TYPE_COLORS[n]?.name ?? '') : '');
	const TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	// Fresh results from a vote replace the page's copy; deriveds are writable.
	let results = $derived<Results | null>(initialResults);
	let meOn = $derived(Boolean(voted?.me));
	let myPick = $derived<number | null>(voted?.pick ?? null);
	let revealed = $derived(Boolean(voted?.me || voted?.pick));
	let pickerOpen = $state(false);
	let draftPick = $state<number | null>(null);
	let reason = $state('');
	let busy = $state(false);
	let error = $state('');

	const pct = (value: number) => `${Math.round(value * 100)}%`;
	let topMe = $derived(
		(results?.meRates ?? [])
			.map((rate, i) => ({ type: i + 1, rate }))
			.filter(
				(entry): entry is { type: number; rate: number } => entry.rate !== null && entry.rate > 0
			)
			.sort((a, b) => b.rate - a.rate)
			.slice(0, 3)
	);
	let pickMax = $derived(Math.max(1, ...(results?.pickCounts ?? [0])));

	async function send(body: Record<string, unknown>): Promise<boolean> {
		busy = true;
		error = '';
		try {
			getOrCreateVisitorId(); // sets the visitor cookie the server keys votes on
			const res = await fetch('/api/superlatives/vote', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ trait: row.trait, ...body })
			});
			if (res.status === 429) {
				error = 'Too many votes in a row. Give it a few minutes.';
				return false;
			}
			if (!res.ok) {
				error = 'That vote didn’t save. Try again in a moment.';
				return false;
			}
			const payload = await res.json();
			if (payload?.results) results = payload.results;
			return true;
		} catch {
			error = 'That vote didn’t save. Check your connection and try again.';
			return false;
		} finally {
			busy = false;
		}
	}

	async function toggleMe() {
		if (!myType) {
			onneedtype?.();
			return;
		}
		const next = !meOn;
		if (await send({ kind: 'me', voterType: myType, on: next })) {
			meOn = next;
			revealed = true;
			onvoted?.(row.trait, { me: next, pick: myPick ?? undefined });
		}
	}

	async function submitPick() {
		if (!draftPick) return;
		if (
			await send({
				kind: 'pick',
				pickedType: draftPick,
				voterType: myType ?? null,
				reason: reason.trim() || null
			})
		) {
			myPick = draftPick;
			revealed = true;
			pickerOpen = false;
			onvoted?.(row.trait, { me: meOn, pick: draftPick });
		}
	}

	function openPicker() {
		draftPick = myPick;
		pickerOpen = !pickerOpen;
	}
</script>

<article class="rank-card" aria-labelledby={`q-${row.trait}`}>
	<header class="head">
		<h3 id={`q-${row.trait}`}>{row.question}</h3>
		{#if !row.isLive}<span class="draft">Draft: hidden until the post is published</span>{/if}
	</header>

	<p class="pick">
		<span class="pick-label">Our pick</span>
		<span class="pick-type">Type {row.pick}</span>
		<span class="pick-name">{typeName(row.pick)}</span>
	</p>
	{#if row.runnerUp || row.least}
		<p class="also">
			{#if row.runnerUp}Runner-up: <strong>Type {row.runnerUp}</strong>{/if}
			{#if row.runnerUp && row.least}<span aria-hidden="true"> · </span>{/if}
			{#if row.least}Least: <strong>Type {row.least}</strong>{/if}
		</p>
	{/if}
	<p class="reason">
		{row.reason}
		{#if row.isLive}<a href={row.postPath}>Read the case</a>{/if}
	</p>

	<div class="actions">
		{#if row.selfReport}
			<button type="button" class="vote" aria-pressed={meOn} disabled={busy} onclick={toggleMe}>
				{meOn ? '✓ This is me' : 'This is me'}
			</button>
		{/if}
		<button
			type="button"
			class="vote"
			aria-expanded={pickerOpen}
			disabled={busy}
			onclick={openPicker}
		>
			{myPick ? `Your pick: Type ${myPick}` : 'Wrong pick? Vote yours'}
		</button>
	</div>

	{#if pickerOpen}
		<form
			class="picker"
			onsubmit={(event) => {
				event.preventDefault();
				submitPick();
			}}
		>
			<fieldset>
				<legend>{row.question.replace(/\?$/, '')}, in your experience?</legend>
				<div class="type-grid">
					{#each TYPES as n (n)}
						<button
							type="button"
							class="type-chip"
							aria-pressed={draftPick === n}
							onclick={() => (draftPick = n)}
						>
							{n}
						</button>
					{/each}
				</div>
			</fieldset>
			<label class="why" for={`why-${row.trait}`}>
				Why? <span class="optional">Optional, private. We read these when we revise the page.</span>
			</label>
			<textarea id={`why-${row.trait}`} maxlength="500" rows="2" bind:value={reason}></textarea>
			<button type="submit" class="submit" disabled={!draftPick || busy}>
				{busy ? 'Saving…' : 'Submit my pick'}
			</button>
		</form>
	{/if}

	{#if error}<p class="error" role="alert">{error}</p>{/if}

	<div class="crowd" aria-live="polite">
		{#if !revealed}
			<p class="locked">Vote to see what readers said.</p>
		{:else if !results || results.pickTotal < MIN_PICK_VOTES}
			<p class="early">
				Early days: {results?.pickTotal ?? 0} reader {results?.pickTotal === 1 ? 'pick' : 'picks'}
				so far{#if (results?.meTotal ?? 0) > 0}, and {results?.meTotal} said “this is me”{/if}.
				Reader results show at {MIN_PICK_VOTES} picks.
			</p>
		{:else}
			<p class="verdict">
				{#if results.readersPick === row.pick}
					Readers agree: <strong>Type {row.pick}</strong>.
				{:else if results.readersPick}
					Readers say <strong>Type {results.readersPick}</strong>, not {row.pick}.
				{:else}
					Readers are split.
				{/if}
				<span class="n">{results.pickTotal} picks</span>
			</p>
			<ol class="bars" aria-label="Reader picks by type">
				{#each results.pickCounts as count, i (i)}
					<li class={{ ours: i + 1 === row.pick }}>
						<span class="bar" style:--h={`${(count / pickMax) * 100}%`}></span>
						<span class="bar-label">{i + 1}</span>
						<span class="sr-only">Type {i + 1}: {count} picks</span>
					</li>
				{/each}
			</ol>
		{/if}
		{#if revealed && row.selfReport && topMe.length}
			<p class="me-line">
				Said “this is me”:
				{#each topMe as entry, i (entry.type)}{i ? ' · ' : ''}<strong>{pct(entry.rate)}</strong> of
					{entry.type}s{/each}
			</p>
		{/if}
	</div>
</article>

<style>
	.rank-card {
		margin: 0;
		display: grid;
		gap: 0.6rem;
		padding: 1.1rem 1.2rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--surface);
		color: var(--text);
		min-width: 0;
	}

	.head {
		display: grid;
		gap: 0.3rem;
	}

	h3 {
		margin: 0;
		font-size: var(--font-size-lg);
		font-weight: 600;
		line-height: 1.3;
		color: var(--text);
		text-wrap: balance;
	}

	.draft {
		font-size: var(--font-size-xs);
		color: var(--text-faint);
	}

	.pick {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 0.6rem;
		margin: 0;
	}

	.pick-label {
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.pick-type {
		font-family: var(--font-shout);
		font-size: var(--font-size-xl);
		text-transform: uppercase;
		color: var(--highlight);
	}

	.pick-name {
		color: var(--text-muted);
	}

	.also,
	.reason {
		margin: 0;
		font-size: var(--font-size-sm);
		line-height: 1.55;
		color: var(--text-muted);
	}

	.also strong {
		color: var(--text);
		font-weight: 600;
	}

	a {
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 3px;
		white-space: nowrap;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.vote,
	.type-chip,
	.submit {
		font: inherit;
		font-size: var(--font-size-sm);
		color: var(--text);
		background: var(--surface-raised);
		border: 1px solid var(--rule);
		border-radius: 10px;
		padding: 0.45rem 0.85rem;
		cursor: pointer;
	}

	.vote[aria-pressed='true'],
	.type-chip[aria-pressed='true'] {
		border-color: var(--highlight);
		color: var(--highlight);
	}

	.submit {
		justify-self: start;
		background: var(--action);
		color: var(--text-on-action);
		border-color: transparent;
		font-weight: 600;
	}

	button:disabled {
		opacity: 0.55;
		cursor: default;
	}

	button:focus-visible,
	textarea:focus-visible {
		outline: 2px solid var(--highlight);
		outline-offset: 2px;
	}

	.picker {
		display: grid;
		gap: 0.55rem;
	}

	fieldset {
		margin: 0;
		padding: 0;
		border: 0;
		display: grid;
		gap: 0.45rem;
	}

	legend {
		padding: 0;
		font-size: var(--font-size-sm);
		color: var(--text);
	}

	.type-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.type-chip {
		min-width: 2.6rem;
		text-align: center;
	}

	.why {
		font-size: var(--font-size-sm);
		color: var(--text);
	}

	.optional {
		color: var(--text-faint);
	}

	textarea {
		width: 100%;
		font: inherit;
		font-size: var(--font-size-sm);
		color: var(--text);
		background: var(--surface-raised);
		border: 1px solid var(--rule);
		border-radius: 10px;
		padding: 0.5rem 0.65rem;
		resize: vertical;
	}

	.error {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--highlight);
	}

	.crowd {
		display: grid;
		gap: 0.5rem;
		padding-top: 0.6rem;
		border-top: 1px solid var(--rule);
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}

	.crowd p {
		margin: 0;
	}

	.locked {
		color: var(--text-faint);
	}

	.verdict strong,
	.me-line strong {
		color: var(--text);
	}

	.n {
		color: var(--text-faint);
		margin-left: 0.35rem;
	}

	.bars {
		display: grid;
		grid-template-columns: repeat(9, minmax(0, 1fr));
		gap: 0.3rem;
		align-items: end;
		height: 4.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.bars li {
		display: grid;
		grid-template-rows: 1fr auto;
		height: 100%;
		gap: 0.2rem;
	}

	.bar {
		align-self: end;
		height: max(2px, var(--h));
		border-radius: 4px 4px 0 0;
		background: color-mix(in srgb, var(--highlight) 40%, transparent);
	}

	.bars li.ours .bar {
		background: var(--highlight);
	}

	.bar-label {
		text-align: center;
		font-size: var(--font-size-xs);
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
</style>

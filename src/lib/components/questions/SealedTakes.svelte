<!-- src/lib/components/questions/SealedTakes.svelte -->
<!--
  The takes a visitor can't read yet. Give-first: it shows that takes exist, which types
  wrote them and when, never what they say. The bars are placeholders, not blurred text.
-->
<script lang="ts">
	import AnsweredTypes from './AnsweredTypes.svelte';
	import { listTypes, missingTypes } from '$lib/data/homepageLiveTypes';
	import { SEALED_ROWS, type SealedTakes } from './sealedTakes';

	let {
		sealed = null,
		count,
		oncompose
	}: {
		sealed?: SealedTakes | null;
		/** Takes on the question; the rows never outnumber it. */
		count: number;
		/** Moves the visitor to the composer. */
		oncompose?: () => void;
	} = $props();

	// Placeholder bar widths, so the sealed rows read as text without being text.
	const BAR_WIDTHS = [[92, 64], [78], [88, 41], [70], [95, 58], [66]];

	let rows = $derived.by(() => {
		const known = sealed?.rows ?? [];
		const shown = Math.min(Math.max(count, known.length), SEALED_ROWS);
		return Array.from({ length: shown }, (_, index) => ({
			key: index,
			type: known[index]?.type ?? null,
			bars: BAR_WIDTHS[index % BAR_WIDTHS.length]
		}));
	});
	let answered = $derived(sealed?.answered ?? []);
	let missing = $derived(answered.length > 0 ? missingTypes(answered) : []);

	function plural(value: number, one: string, many: string) {
		return `${value.toLocaleString('en-US')} ${value === 1 ? one : many}`;
	}
</script>

<section class="sealed" aria-labelledby="sealed-heading">
	{#if count > 0}
		<header class="sealed__head">
			<p class="sealed__kicker">Sealed</p>
			<h2 id="sealed-heading">What did everyone else say?</h2>
		</header>

		{#if sealed}
			<div class="sealed__types">
				<AnsweredTypes {answered} />
				<p class="sealed__hint">
					Lit numbers are the types who've answered, each picked by the person. A dash means they
					skipped it.
				</p>
			</div>
		{/if}

		<ol class="sealed__rows" aria-hidden="true">
			{#each rows as row (row.key)}
				<li class="sealed__row">
					<span class={['sealed__chip', row.type === null && 'is-none']}>{row.type ?? '–'}</span>
					<span class="sealed__bars">
						{#each row.bars as width, i (i)}
							<span class="sealed__bar" style:width="{width}%"></span>
						{/each}
					</span>
				</li>
			{/each}
		</ol>

		<p class="sealed__count">
			<b>{plural(count, 'take', 'takes')}</b>
			{count === 1 ? 'unlocks' : 'unlock'} when you post yours.
		</p>

		{#if missing.length > 0}
			<p class="sealed__missing">
				No {listTypes(missing)} has answered yet.
				{#if oncompose}
					<button type="button" class="sealed__link" onclick={oncompose}>Be the first.</button>
				{/if}
			</p>
		{/if}
	{:else}
		<header class="sealed__head">
			<p class="sealed__kicker">Nobody yet</p>
			<h2 id="sealed-heading">Yours will be the first take here.</h2>
		</header>
		<p class="sealed__hint">
			Whoever answers next reads yours only after they've written their own.
		</p>
	{/if}
</section>

<style>
	.sealed {
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-width: 0;
	}
	.sealed__head {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.sealed__kicker {
		margin: 0;
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--highlight);
	}
	h2 {
		--sealed-title: clamp(1.5rem, 1.2rem + 1.2vw, 2rem);
		margin: 0;
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 500;
		font-size: var(--sealed-title);
		line-height: 1.15;
		color: var(--text);
		text-wrap: balance;
	}
	.sealed__types {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.sealed__hint,
	.sealed__missing {
		margin: 0;
		font-size: var(--font-size-sm);
		line-height: 1.5;
		color: var(--text-muted);
	}

	.sealed__rows {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
		mask-image: linear-gradient(black 55%, transparent);
	}
	.sealed__row {
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		align-items: center;
		gap: 14px;
		padding: 12px 14px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--highlight) 5%, transparent);
	}
	.sealed__chip {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--accent-deep);
		color: var(--highlight);
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-base);
	}
	.sealed__chip.is-none {
		background: transparent;
		border: 1px dashed color-mix(in srgb, var(--highlight) 35%, transparent);
		color: var(--text-faint);
		font-family: var(--font-talk);
		font-style: normal;
		font-size: var(--font-size-sm);
	}
	.sealed__bars {
		display: flex;
		flex-direction: column;
		gap: 7px;
		min-width: 0;
	}
	.sealed__bar {
		display: block;
		height: 8px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--highlight) 22%, transparent);
		filter: blur(2.5px);
	}

	.sealed__count {
		margin: 0;
		font-size: var(--font-size-base);
		color: var(--text-muted);
	}
	.sealed__count b {
		font-weight: 600;
		color: var(--text);
	}
	.sealed__link {
		min-height: 44px;
		padding: 0 2px;
		border: 0;
		background: none;
		color: var(--highlight);
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
</style>

<!-- src/lib/components/blog/compatibility/CompatibilityCalculator.svelte -->
<!--
  Pick-two-types Enneagram compatibility calculator.

  SSR-first: the server renders the pair named by ?a=&b= (or the default pair),
  so the read is in the HTML before any JS runs, and without JS the GET form
  still submits to a server-rendered deep link. With JS, picking a type swaps
  the read in place and rewrites the URL via replaceState (no navigation), so
  the address bar is always a shareable link. Order does not matter: 8 + 4
  shows the 4 + 8 read.

  Content: $lib/data/enneagramCompatibility (shared with the chart and the
  full reads). Nothing inside the result may be an h2-h6: the article TOC is
  rebuilt from DOM headings whenever the article mutates.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import { Button, Field, Select } from '$lib/components/atoms';
	import { capture } from '$lib/analytics/posthog';
	import { readStoredEnneagramType } from '$lib/enneagram/selfReportedType';
	import {
		CALCULATOR_ANCHOR_ID,
		COMPATIBILITY_TYPE_NAMES,
		ENNEAGRAM_TYPES,
		calculatorSearch,
		getCompatibilityPairing,
		parseTypeParam,
		resolveCalculatorPair,
		type EnneagramType
	} from '$lib/data/enneagramCompatibility';
	import PairingText from './PairingText.svelte';

	const initialPair = resolveCalculatorPair(page.url.searchParams);
	const formAction = `${page.url.pathname}#${CALCULATOR_ANCHOR_ID}`;

	let typeA = $state<EnneagramType>(initialPair.a);
	let typeB = $state<EnneagramType>(initialPair.b);
	let announcement = $state('');
	let copyState = $state<'idle' | 'copied' | 'failed'>('idle');
	let copyResetTimer: ReturnType<typeof setTimeout> | undefined;

	const pairing = $derived(getCompatibilityPairing(typeA, typeB));
	const pairCode = $derived(`${pairing.types[0]} + ${pairing.types[1]}`);
	const copyMessage = $derived(
		copyState === 'copied'
			? 'Link copied.'
			: copyState === 'failed'
				? 'Copy failed. The address bar has the link.'
				: ''
	);

	onMount(() => {
		// A reader who already told us their type (test, question gate) gets it
		// preselected as "Your type", unless the link they followed names a pair.
		if (!parseTypeParam(page.url.searchParams.get('a'))) {
			const storedType = readStoredEnneagramType();
			if (storedType) typeA = storedType;
		}

		return () => clearTimeout(copyResetTimer);
	});

	function selectType(side: 'a' | 'b', event: Event) {
		const next = parseTypeParam((event.currentTarget as HTMLSelectElement).value);
		if (!next) return;

		if (side === 'a') typeA = next;
		else typeB = next;

		copyState = 'idle';
		announcement = `Showing ${pairCode}: ${pairing.title}.`;

		try {
			replaceState(calculatorSearch(typeA, typeB), page.state);
		} catch {
			// URL sync is a nicety; the read already updated.
		}

		void capture('compatibility_calculator_pair_selected', {
			type_a: typeA,
			type_b: typeB,
			pair: `${pairing.types[0]}-${pairing.types[1]}`,
			changed: side
		});
	}

	async function copyPairLink() {
		const link = new URL(calculatorSearch(typeA, typeB), window.location.href).toString();

		try {
			await navigator.clipboard.writeText(link);
			copyState = 'copied';
		} catch {
			copyState = 'failed';
		}

		clearTimeout(copyResetTimer);
		copyResetTimer = setTimeout(() => (copyState = 'idle'), 3000);

		void capture('compatibility_calculator_link_copied', {
			pair: `${pairing.types[0]}-${pairing.types[1]}`,
			copied: copyState === 'copied'
		});
	}
</script>

{#snippet typeSelect(side: 'a' | 'b', value: EnneagramType)}
	<span class="calc__select">
		<Select
			id={`compat-type-${side}`}
			name={side}
			{value}
			onchange={(event: Event) => selectType(side, event)}
		>
			{#each ENNEAGRAM_TYPES as type (type)}
				<option value={type}>{type} · {COMPATIBILITY_TYPE_NAMES[type]}</option>
			{/each}
		</Select>
	</span>
{/snippet}

<section id={CALCULATOR_ANCHOR_ID} class="calc" aria-label="Enneagram compatibility calculator">
	<form class="calc__form" method="get" action={formAction}>
		<div class="calc__fields">
			<Field for="compat-type-a" label="Your type">{@render typeSelect('a', typeA)}</Field>

			<span class="calc__plus" aria-hidden="true">+</span>

			<Field for="compat-type-b" label="Their type">{@render typeSelect('b', typeB)}</Field>
		</div>

		<noscript>
			<div class="calc__submit">
				<Button type="submit" fullWidth>Show this pairing</Button>
			</div>
		</noscript>
	</form>

	<p class="calc__hint">Not sure of your type? <a href="/enneagram-test">Take the test</a>.</p>

	<p class="sr-only" role="status" aria-live="polite">{announcement}</p>

	<div class="calc__result">
		<p class="calc__pair">
			Type {typeA}
			{COMPATIBILITY_TYPE_NAMES[typeA]} + Type {typeB}
			{COMPATIBILITY_TYPE_NAMES[typeB]}
		</p>
		<p class="calc__title">{pairing.title}</p>
		<p class="calc__fault">
			<span class="calc__fault-label">Fault line</span>
			<span class="calc__fault-text">{pairing.faultLine}</span>
		</p>

		<dl class="calc__reads">
			<div class="calc__read">
				<dt>What pulls you together</dt>
				<dd><PairingText text={pairing.draw} /></dd>
			</div>
			<div class="calc__read">
				<dt>Where it cracks</dt>
				<dd><PairingText text={pairing.crack} /></dd>
			</div>
			<div class="calc__read calc__read--works">
				<dt>What makes it work</dt>
				<dd><PairingText text={pairing.works} /></dd>
			</div>
		</dl>

		<div class="calc__actions">
			<Button variant="secondary" size="sm" onclick={copyPairLink}>Copy link to {pairCode}</Button>
			<a class="calc__chart-link" href="#compatibility-chart"
				>Compare every Type {typeA} pairing on the chart</a
			>
			<span class="calc__copy-status" role="status">{copyMessage}</span>
		</div>
	</div>
</section>

<style>
	.calc {
		margin: 1.5rem 0 1.25rem;
		overflow: hidden;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--night-mid);
		color: var(--ink-bright);
		scroll-margin-top: 5rem;
	}

	.calc__form {
		padding: var(--space-lg) var(--space-lg) var(--space-sm);
		background:
			radial-gradient(
				circle at 100% 0%,
				color-mix(in srgb, var(--lamp-glow) 12%, transparent),
				transparent 55%
			),
			var(--night-deep);
	}

	.calc__fields {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--space-md);
	}

	/* The shared Select atom has no chevron (global appearance reset); a picker
	   needs one, so draw it here in tokens rather than editing the atom. */
	.calc__select {
		position: relative;
		display: block;
	}

	.calc__select::after {
		content: '';
		position: absolute;
		top: 50%;
		right: 1rem;
		width: 0.5rem;
		height: 0.5rem;
		border-right: 2px solid var(--ink-dim);
		border-bottom: 2px solid var(--ink-dim);
		transform: translateY(-70%) rotate(45deg);
		pointer-events: none;
	}

	.calc__select :global(select.select) {
		padding-right: 2.5rem;
	}

	.calc__plus {
		display: none;
	}

	.calc__submit {
		margin-top: var(--space-md);
	}

	.calc__hint {
		margin: 0;
		padding: 0 var(--space-lg) var(--space-md);
		background: var(--night-deep);
		border-bottom: 1px solid var(--stone-edge);
		color: var(--ink-dim);
		font-size: 0.875rem;
		line-height: 1.45;
	}

	.calc__result {
		display: grid;
		gap: var(--space-md);
		padding: var(--space-lg);
	}

	.calc__result p {
		margin: 0;
	}

	.calc__pair {
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		line-height: 1.4;
		text-transform: uppercase;
	}

	.calc__title {
		color: var(--ink-bright);
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1.2;
	}

	.calc__fault {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-xs) var(--space-sm);
		justify-self: start;
		max-width: 100%;
		padding: var(--space-xs) var(--space-md);
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 45%, transparent);
		border-radius: 0.625rem;
		background: var(--lamp-soft);
		line-height: 1.4;
	}

	.calc__fault-label {
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.calc__fault-text {
		color: var(--ink-bright);
		font-size: 1rem;
		font-weight: 600;
	}

	.calc__reads {
		display: grid;
		gap: var(--space-md);
		margin: var(--space-xs) 0 0;
	}

	.calc__read {
		padding-left: var(--space-md);
		border-left: 2px solid var(--stone-edge);
	}

	.calc__read--works {
		border-left-color: var(--lamp-glow);
	}

	.calc__read dt {
		margin: 0 0 var(--space-xs);
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		line-height: 1.4;
		text-transform: uppercase;
	}

	.calc__read dd {
		margin: 0;
		color: var(--ink-bright);
		font-size: 1rem;
		line-height: 1.6;
	}

	.calc__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-sm) var(--space-lg);
		padding-top: var(--space-sm);
		border-top: 1px solid var(--stone-edge);
	}

	.calc__chart-link {
		font-size: 0.875rem;
		line-height: 1.45;
	}

	.calc__copy-status {
		color: var(--ink-mid);
		font-size: 0.875rem;
	}

	.calc__copy-status:empty {
		display: none;
	}

	.calc :global(a:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
		border-radius: 0.25rem;
	}

	@media (min-width: 30rem) {
		.calc__fields {
			grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
			align-items: end;
		}

		.calc__plus {
			display: block;
			padding-bottom: 0.6rem;
			color: var(--lamp-glow);
			font-family: var(--font-display);
			font-size: 1.5rem;
			font-weight: 700;
			line-height: 1;
		}
	}
</style>

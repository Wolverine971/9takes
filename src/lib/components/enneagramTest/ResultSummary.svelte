<!-- src/lib/components/enneagramTest/ResultSummary.svelte -->
<!--
  The Enneagram test result: one type ("You're most likely a 6.") or two
  ("You're between a 5 and a 6."), with the person's own picks played back in
  DJ's language. Shared by the result page and the unsaved fallback.
-->
<script lang="ts">
	import TypeBadge from './TypeBadge.svelte';
	import {
		EMOTIONS,
		RELATIONS,
		TEST_TYPES,
		withArticle,
		type TestType
	} from '$lib/enneagramTest/content';

	type Props = { types: TestType[] };

	let { types }: Props = $props();

	const single = $derived(types.length === 1);
</script>

<header class="result-head">
	<p class="kicker">Your result</p>
	{#if single}
		<h1>You’re most likely {withArticle(types[0])}.</h1>
		<p class="sub">{TEST_TYPES[types[0]].name}</p>
	{:else}
		<h1>You’re between {withArticle(types[0])} and {withArticle(types[1])}.</h1>
		<p class="sub">{TEST_TYPES[types[0]].name} or {TEST_TYPES[types[1]].name}</p>
	{/if}
</header>

<div class="readback" class:split={!single}>
	{#each types as type (type)}
		{@const content = TEST_TYPES[type]}
		<section class="read-card" aria-label="Type {type}: {content.name}">
			{#if !single}
				<p class="read-title"><TypeBadge {type} small /> {content.name}</p>
			{/if}
			<dl>
				<dt>Emotion</dt>
				<dd>
					<span class="dot" style:background={EMOTIONS[content.emotion].color}></span>
					{EMOTIONS[content.emotion].name}. {RELATIONS[content.relation].you}
				</dd>
				{#if single}
					<dt>Strength</dt>
					<dd>{content.strength}</dd>
				{/if}
				<dt>Core fear</dt>
				<dd>{content.fear}</dd>
				<dt>Chasing</dt>
				<dd>{content.chasing}</dd>
			</dl>
		</section>
	{/each}
</div>

<p class="honesty">
	This test doesn’t measure you. It walks you through how to recognize your type. People sometimes
	pick who they want to be, which is why the best check is someone who knows you.
</p>

<style>
	.result-head {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.kicker {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	h1 {
		margin: 0;
		padding: 0;
		font-size: clamp(2rem, 6vw, 2.75rem);
		font-weight: 800;
		line-height: 1.08;
		letter-spacing: -0.03em;
		text-wrap: balance;
		color: var(--ink-bright);
	}

	.sub {
		margin: 0;
		font-size: 1.15rem;
		color: var(--ink-mid);
	}

	.readback {
		display: grid;
		gap: 0.75rem;
	}

	.readback.split {
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
	}

	.read-card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 1rem 1.1rem;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);
		border-radius: 16px;
		min-width: 0;
	}

	.read-title {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		font-weight: 700;
	}

	dl {
		display: grid;
		grid-template-columns: 5.6rem 1fr;
		gap: 0.4rem 0.75rem;
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.45;
	}

	dt {
		padding-top: 0.2rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	dd {
		margin: 0;
		min-width: 0;
	}

	.dot {
		display: inline-block;
		width: 0.6rem;
		height: 0.6rem;
		margin-right: 0.2rem;
		border-radius: 9999px;
		vertical-align: 0.05em;
	}

	.honesty {
		margin: 0;
		font-size: 0.92rem;
		color: var(--ink-mid);
	}
</style>

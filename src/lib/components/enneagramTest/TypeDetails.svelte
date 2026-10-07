<!-- src/lib/components/enneagramTest/TypeDetails.svelte -->
<!--
  The body of a type card in the Enneagram test. `full` is the test-taker's
  card (how you carry the emotion, core fear, chasing, strength, patterns,
  what you might say). `compact` is the friend's quicker version, written so
  it reads about someone else.
-->
<script lang="ts">
	import TypeBadge from './TypeBadge.svelte';
	import { TEST_TYPES, relationTag, type TestType } from '$lib/enneagramTest/content';

	type Props = {
		type: TestType;
		variant?: 'full' | 'compact';
		/** Shows the selection check (multi-select cards only). */
		selected?: boolean;
	};

	let { type, variant = 'full', selected }: Props = $props();

	const content = $derived(TEST_TYPES[type]);
</script>

<span class="head">
	<TypeBadge {type} />
	<span class="names">
		<span class="name">{type} · {content.name}</span>
		<span class="tag">{relationTag(type)}</span>
	</span>
	{#if selected !== undefined}
		<span class="check" class:on={selected} aria-hidden="true">{selected ? '✓' : ''}</span>
	{/if}
</span>

{#if variant === 'full'}
	<span class="carries">{content.carries}</span>
{/if}

<span class="facts">
	<span class="fact"><span class="label">Core fear</span><span>{content.fear}</span></span>
	<span class="fact"><span class="label">Chasing</span><span>{content.chasing}</span></span>
	{#if variant === 'full'}
		<span class="fact"><span class="label">Strength</span><span>{content.strength}</span></span>
	{/if}
</span>

{#if variant === 'full'}
	<span class="patterns">
		{#each content.patterns as pattern (pattern)}
			<span class="pattern">{pattern}</span>
		{/each}
	</span>
{/if}

<span class="say">
	{variant === 'full' ? 'You might say' : 'Might say'}: <q>{content.say}</q>
</span>

<style>
	.head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.names {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
	}

	.name {
		font-weight: 750;
		font-size: 1.1rem;
		line-height: 1.25;
	}

	.tag,
	.label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.check {
		display: grid;
		place-items: center;
		flex: none;
		width: 1.5rem;
		height: 1.5rem;
		margin-left: auto;
		border: 1.5px solid var(--stone-edge);
		border-radius: 9999px;
		font-size: 0.8rem;
		font-weight: 800;
	}

	.check.on {
		border-color: var(--lamp-glow);
		background: var(--lamp-glow);
		color: var(--night-deep);
	}

	.carries {
		font-size: 1rem;
		line-height: 1.55;
	}

	.facts {
		display: grid;
		grid-template-columns: 5.6rem 1fr;
		gap: 0.35rem 0.75rem;
		font-size: 0.93rem;
		line-height: 1.45;
	}

	.fact {
		display: contents;
	}

	.label {
		padding-top: 0.2rem;
	}

	.patterns {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding-left: 1rem;
		font-size: 0.93rem;
		color: var(--ink-mid);
	}

	.pattern {
		display: list-item;
		list-style: disc;
	}

	.say {
		font-size: 0.93rem;
		color: var(--ink-mid);
	}

	.say q {
		color: var(--ink-bright);
		font-weight: 600;
	}
</style>

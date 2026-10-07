<!-- src/routes/enneagram-test/read/[token]/+page.svelte -->
<!--
  The friend side of the Enneagram test (T-42): someone sent you their link
  and wants your honest read. You pick their emotion, their strength and
  their type before you see what they picked (answer before the crowd), then
  the reveal shows both reads side by side and invites you to take the test.
-->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button, Field, Input, Textarea } from '$lib/components/atoms';
	import ChoiceCard from '$lib/components/enneagramTest/ChoiceCard.svelte';
	import TypeDetails from '$lib/components/enneagramTest/TypeDetails.svelte';
	import {
		EMOTIONS,
		EMOTION_ORDER,
		TEST_TYPES,
		typeList,
		typesForEmotion,
		withArticle,
		type Emotion,
		type TestType
	} from '$lib/enneagramTest/content';
	import {
		captureFriendLinkOpened,
		captureFriendReadSubmitted
	} from '$lib/analytics/enneagramTestEvents';
	import type { PageData } from './$types';

	type Screen = 'landing' | 'emotion' | 'strength' | 'type' | 'note' | 'reveal';

	let { data }: { data: PageData } = $props();

	let screen = $state<Screen>('landing');
	let emotion = $state<Emotion | null>(null);
	let strength = $state<Emotion | null>(null);
	let pickedType = $state<TestType | null>(null);
	let allNine = $state(false);
	let readerName = $state('');
	let note = $state('');
	let submitting = $state(false);
	let submitError = $state('');
	let theirTypes = $state<TestType[]>([]);
	let root: HTMLElement | undefined = $state();

	const name = $derived(data.displayName?.trim() || '');
	const Name = $derived(name || 'Your friend');
	const them = $derived(name || 'your friend');
	const typeGroups = $derived<Emotion[]>(allNine ? EMOTION_ORDER : emotion ? [emotion] : []);
	const STEP_NUMBER: Partial<Record<Screen, number>> = { emotion: 1, strength: 2, type: 3 };
	const stepNumber = $derived(STEP_NUMBER[screen] ?? null);
	const match = $derived.by(() => {
		if (!pickedType || theirTypes.length === 0) return null;
		if (theirTypes.length === 1 && theirTypes[0] === pickedType) return 'same' as const;
		if (theirTypes.includes(pickedType)) return 'one_of_two' as const;
		return 'different' as const;
	});

	onMount(() => {
		void captureFriendLinkOpened();
	});

	async function go(next: Screen) {
		screen = next;
		await tick();
		if (!root) return;
		const top = root.getBoundingClientRect().top + window.scrollY - 96;
		if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top) });
		root.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true });
	}

	function back() {
		const previous: Partial<Record<Screen, Screen>> = {
			emotion: 'landing',
			strength: 'emotion',
			type: 'strength',
			note: 'type'
		};
		const target = previous[screen];
		if (target) void go(target);
	}

	async function submit(event?: SubmitEvent) {
		event?.preventDefault();
		if (!pickedType || !emotion || !strength || submitting) return;
		submitting = true;
		submitError = '';
		try {
			const response = await fetch(
				`/api/enneagram-test/reads/${encodeURIComponent(data.readToken)}`,
				{
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						pickedType,
						emotion,
						strength,
						readerName: readerName.trim(),
						note: note.trim()
					})
				}
			);
			const body = (await response.json().catch(() => null)) as {
				ok?: boolean;
				types?: number[];
				message?: string;
			} | null;
			if (!response.ok || !body?.ok || !Array.isArray(body.types)) {
				throw new Error(body?.message ?? 'We couldn’t save your read. Please try again.');
			}
			theirTypes = body.types.filter((type): type is TestType => type >= 1 && type <= 9);
			if (match) void captureFriendReadSubmitted({ match, withNote: note.trim().length > 0 });
			await go('reveal');
		} catch (error) {
			submitError = error instanceof Error ? error.message : 'We couldn’t save your read.';
		} finally {
			submitting = false;
		}
	}
</script>

<SEOHead
	title="{Name} wants your honest read | 9takes"
	description="Someone who knows you took the 9takes Enneagram test and wants your read on them."
	noindex
/>

<div class="friend-page" bind:this={root}>
	{#if stepNumber !== null || screen === 'note'}
		<div class="step-row">
			<p class="step-label">
				Your read on {them}{stepNumber !== null ? ` · ${stepNumber} of 3` : ''}
			</p>
			<button type="button" class="back" onclick={back}>← Back</button>
		</div>
	{/if}

	{#if screen === 'landing'}
		<p class="kicker">9takes · Enneagram test</p>
		<h1 data-step-heading tabindex="-1">{Name} wants your honest read.</h1>
		<p class="lede">3 minutes. You answer before you see what {them} picked.</p>
		<p class="muted">
			Three hard emotions shape personality: anger, shame and fear. Everyone feels all three, but
			one shows up most. You’re picking which one shows up most in {them}, then which type sounds
			most like them.
		</p>
		<Button size="lg" fullWidth onclick={() => go('emotion')}>Start</Button>
	{:else if screen === 'emotion'}
		<h2 data-step-heading tabindex="-1">Which of these shows up most in {them}?</h2>
		<div class="stack">
			{#each EMOTION_ORDER as option (option)}
				<ChoiceCard
					onclick={() => {
						emotion = option;
						allNine = false;
						void go('strength');
					}}
				>
					<span class="choice-title">
						<span class="dot" style:background={EMOTIONS[option].color}></span>
						{EMOTIONS[option].name}
					</span>
					<span class="chips">
						{#each EMOTIONS[option].words as word (word)}
							<span class="chip">{word}</span>
						{/each}
					</span>
					<span class="hidden-line">{EMOTIONS[option].hiddenThey}</span>
				</ChoiceCard>
			{/each}
		</div>
	{:else if screen === 'strength'}
		<h2 data-step-heading tabindex="-1">Which strength is most {them}?</h2>
		<div class="stack">
			{#each EMOTION_ORDER as option (option)}
				<ChoiceCard
					onclick={() => {
						strength = option;
						void go('type');
					}}
				>
					<span class="choice-title">{EMOTIONS[option].strength.name}</span>
					<span>{EMOTIONS[option].strength.they}</span>
				</ChoiceCard>
			{/each}
		</div>
	{:else if screen === 'type'}
		<h2 data-step-heading tabindex="-1">Which sounds most like {them}?</h2>
		<div class="stack">
			{#each typeGroups as group (group)}
				{#each typesForEmotion(group) as type (type)}
					<ChoiceCard
						onclick={() => {
							pickedType = type;
							void go('note');
						}}
					>
						<TypeDetails {type} variant="compact" />
					</ChoiceCard>
				{/each}
			{/each}
		</div>
		{#if !allNine}
			<button type="button" class="text-link" onclick={() => (allNine = true)}>
				None of these
			</button>
		{/if}
	{:else if screen === 'note' && pickedType}
		<h2 data-step-heading tabindex="-1">Want to say why?</h2>
		<p class="muted">{Name} will see this. Skip anything you want.</p>
		<form class="stack" onsubmit={submit} novalidate>
			<Field for="et-reader-name" label="Your name" optional>
				<Input
					id="et-reader-name"
					bind:value={readerName}
					maxlength={40}
					autocomplete="given-name"
					placeholder="e.g. Mom"
				/>
			</Field>
			<Field for="et-reader-note" label="Why you picked {withArticle(pickedType)}" optional>
				<Textarea
					id="et-reader-note"
					bind:value={note}
					rows={3}
					maxlength={280}
					placeholder="One line is plenty."
				/>
			</Field>
			{#if submitError}
				<p class="error" role="alert">{submitError}</p>
			{/if}
			<Button type="submit" size="lg" fullWidth loading={submitting}>
				See what {them} picked
			</Button>
		</form>
	{:else if screen === 'reveal' && pickedType}
		<p class="kicker">The reveal</p>
		<h1 data-step-heading tabindex="-1">
			You said {pickedType}. {Name} said {typeList(theirTypes)}.
		</h1>
		<p class="lede">
			{#if match === 'same'}
				Same read. You see {them} the way they see themselves.
			{:else if match === 'one_of_two'}
				You picked one of {them}’s two. That might settle it.
			{:else}
				You see {them} differently than they see themselves. That’s the conversation worth having.
			{/if}
		</p>
		<div class="stack">
			<Button href="/enneagram-test?from=read" size="lg" fullWidth>Now find yours</Button>
			<Button
				href="/enneagram-corner/enneagram-type-{pickedType}"
				size="lg"
				variant="secondary"
				fullWidth
			>
				Read about Type {pickedType}: {TEST_TYPES[pickedType].name}
			</Button>
		</div>
	{/if}
</div>

<style>
	.friend-page {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
		max-width: 40rem;
		margin-inline: auto;
		padding-block: clamp(1rem, 5vw, 3rem) 3rem;
		color: var(--ink-bright);
	}

	.friend-page :global([data-step-heading]:focus) {
		outline: none;
	}

	.step-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.kicker,
	.step-label {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	.back {
		margin: 0;
		padding: 0.35rem 0;
		border: 0;
		background: none;
		color: var(--ink-mid);
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
	}

	h1,
	h2 {
		margin: 0;
		padding: 0;
		color: var(--ink-bright);
		text-wrap: balance;
	}

	h1 {
		font-size: clamp(2rem, 7vw, 2.75rem);
		font-weight: 800;
		line-height: 1.08;
		letter-spacing: -0.03em;
	}

	h2 {
		font-size: clamp(1.35rem, 4.5vw, 1.65rem);
		font-weight: 750;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	p {
		margin: 0;
		line-height: 1.6;
	}

	.lede {
		font-size: 1.15rem;
		color: var(--ink-mid);
	}

	.muted {
		color: var(--ink-mid);
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.choice-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 750;
		font-size: 1.15rem;
	}

	.dot {
		display: inline-block;
		flex: none;
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 9999px;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.chip {
		padding: 0.1rem 0.6rem;
		border: 1px solid var(--stone-mid);
		border-radius: 9999px;
		font-size: 0.84rem;
		color: var(--ink-mid);
	}

	.hidden-line {
		font-size: 0.92rem;
		font-style: italic;
		color: var(--ink-dim);
	}

	.text-link {
		align-self: flex-start;
		margin: 0;
		padding: 0.25rem 0;
		border: 0;
		background: none;
		color: var(--lamp-glow);
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.error {
		color: var(--lamp-glow);
	}
</style>

<!-- src/lib/components/enneagramTest/TestFlow.svelte -->
<!--
  The 9takes Enneagram test (T-42): DJ's typing conversation as a self-pick
  flow. All step logic lives in $lib/enneagramTest/flow.ts; this component
  renders the current screen, remembers progress in the browser, and saves
  the finished result before sending the person to their private result URL.
  The intro renders on the server so search engines see a real test page.
-->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/atoms';
	import ChoiceCard from './ChoiceCard.svelte';
	import ResultSummary from './ResultSummary.svelte';
	import StepHeader from './StepHeader.svelte';
	import TypeBadge from './TypeBadge.svelte';
	import TypeDetails from './TypeDetails.svelte';
	import {
		EMOTIONS,
		EMOTION_ORDER,
		RELATIONS,
		RELATION_ORDER,
		TEST_TYPES,
		typesForEmotion,
		type Emotion
	} from '$lib/enneagramTest/content';
	import {
		groupsInPlay,
		initialTestState,
		reduce,
		restoreTestState,
		stepIndex,
		type Screen,
		type TestAction,
		type TestState
	} from '$lib/enneagramTest/flow';
	import {
		captureFriendStartedOwnTest,
		captureTestBranch,
		captureTestResultShown,
		captureTestStarted,
		captureTestStepCompleted,
		type TestStep
	} from '$lib/analytics/enneagramTestEvents';

	type Props = {
		/** Called with true once the person starts, so the page can hide its explainer. */
		onActiveChange?: (active: boolean) => void;
	};

	let { onActiveChange }: Props = $props();

	const STORAGE_KEY = '9takes:enneagram-test:v1';
	const STEP_FOR: Partial<Record<Screen, TestStep>> = {
		groundwork: 'groundwork',
		emotion: 'emotion',
		strength: 'strength',
		strengthOther: 'strength',
		mismatch: 'strength',
		ways: 'ways',
		types: 'types',
		tiebreak: 'tiebreak'
	};

	let test = $state<TestState>(initialTestState());
	let resumed = $state(false);
	let saving = $state(false);
	let saveError = $state<string | null>(null);
	let source: 'direct' | 'friend_link' = 'direct';
	let root: HTMLElement | undefined = $state();

	const step = $derived(stepIndex(test.screen));
	const groups = $derived(groupsInPlay(test));

	$effect(() => {
		onActiveChange?.(test.screen !== 'intro');
	});

	onMount(() => {
		if (page.url.searchParams.get('from') === 'read') {
			source = 'friend_link';
			void captureFriendStartedOwnTest();
		}
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			const restored = raw ? restoreTestState(JSON.parse(raw)) : null;
			if (restored) {
				test = restored;
				resumed = true;
			}
		} catch {
			// Storage can be blocked or hold junk; the test just starts fresh.
		}
	});

	function persist(next: TestState) {
		try {
			if (next.screen === 'intro' || next.screen === 'done') localStorage.removeItem(STORAGE_KEY);
			else localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		} catch {
			// Progress saving is a convenience; ignore storage failures.
		}
	}

	function track(prev: TestState, next: TestState, action: TestAction) {
		if (action.type === 'start') void captureTestStarted(source);
		if (action.type === 'toggleAlt' && !prev.path.altPrompt)
			void captureTestBranch('emotion_alt_used');
		if (action.type === 'showBoth') void captureTestBranch('strength_mismatch_both');
		if (action.type === 'repickEmotion') void captureTestBranch('strength_mismatch_repick');
		if (action.type === 'noneFit' && !prev.allNine) void captureTestBranch('none_fit');

		const from = stepIndex(prev.screen);
		const to = next.screen === 'done' ? 6 : stepIndex(next.screen);
		const completed = STEP_FOR[prev.screen];
		if (from !== null && to !== null && to > from && completed) {
			void captureTestStepCompleted(completed);
		}
	}

	async function afterScreenChange() {
		await tick();
		if (!root) return;
		const top = root.getBoundingClientRect().top + window.scrollY - 96;
		if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top) });
		root.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true });
	}

	function dispatch(action: TestAction) {
		const prev = test;
		const next = reduce(prev, action);
		test = next;
		if (action.type === 'restart') resumed = false;
		track(prev, next, action);
		persist(next);
		if (next.screen !== prev.screen) void afterScreenChange();
		if (next.screen === 'done' && prev.screen !== 'done') void save(next);
	}

	async function save(finished: TestState) {
		if (!finished.emotion || finished.result.length === 0) {
			dispatch({ type: 'restart' });
			return;
		}
		saving = true;
		saveError = null;
		const split = finished.result.length > 1;
		try {
			const response = await fetch('/api/enneagram-test/results', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					types: finished.result,
					emotion: finished.emotion,
					strength: finished.strengthEmotion ?? finished.emotion,
					path: finished.path
				})
			});
			const body = (await response.json().catch(() => null)) as {
				ok?: boolean;
				resultToken?: string;
				message?: string;
			} | null;
			if (!response.ok || !body?.ok || !body.resultToken) {
				throw new Error(body?.message ?? 'We couldn’t save your result.');
			}
			void captureTestResultShown({ split, tiebreak: finished.path.tiebreak, saved: true });
			await goto(`/enneagram-test/result/${encodeURIComponent(body.resultToken)}`);
		} catch (error) {
			saveError = error instanceof Error ? error.message : 'We couldn’t save your result.';
			void captureTestResultShown({ split, tiebreak: finished.path.tiebreak, saved: false });
			saving = false;
		}
	}

	function emotionLabel(emotion: Emotion) {
		return EMOTIONS[emotion].name.toLowerCase();
	}
</script>

<div class="flow" class:has-foot={test.screen === 'types'} bind:this={root}>
	{#if test.screen === 'intro'}
		<section class="intro" aria-labelledby="et-title">
			<p class="kicker">9takes · Enneagram</p>
			<h1 id="et-title" data-step-heading tabindex="-1">Free Enneagram Test</h1>
			<p class="lede">
				Start with the emotion, not the behavior. About 5 to 10 minutes. No email, and your result
				shows on screen.
			</p>
			<Button size="lg" fullWidth onclick={() => dispatch({ type: 'start' })}>Start the test</Button
			>
			<ul class="facts" aria-label="About this test">
				<li>Free</li>
				<li>No email wall</li>
				<li>Ends with 1 or 2 types, not a score sheet</li>
			</ul>
		</section>
	{:else}
		{#if step !== null}
			<StepHeader {step} onBack={() => dispatch({ type: 'back' })} />
		{/if}
		{#if resumed && test.screen !== 'done'}
			<p class="resumed">
				Picking up where you left off.
				<button type="button" class="text-link" onclick={() => dispatch({ type: 'restart' })}>
					Start over
				</button>
			</p>
		{/if}

		{#if test.screen === 'groundwork'}
			<h2 data-step-heading tabindex="-1">Your personality is built around an emotion.</h2>
			<p>
				When people talk about what shaped them, they usually point to something hard, not something
				easy. The Enneagram starts there. There are three hard emotions: <strong
					>anger, shame and fear.</strong
				> You develop a complicated relationship with one of them, and your personality forms around handling
				it.
			</p>
			<p class="muted">Most other hard feelings are versions of these three.</p>
			<div class="panel-box">
				{#each EMOTION_ORDER as emotion (emotion)}
					<div class="emo-row">
						<span class="emo-name">
							<span class="dot" style:background={EMOTIONS[emotion].color}></span>
							{EMOTIONS[emotion].name}
						</span>
						<span class="chips">
							{#each EMOTIONS[emotion].words as word (word)}
								<span class="chip">{word}</span>
							{/each}
						</span>
					</div>
				{/each}
			</div>
			<p>
				<strong>Everyone feels all three. One of them shows up more than the others.</strong> That’s the
				one we’re looking for.
			</p>
			<Button size="lg" fullWidth onclick={() => dispatch({ type: 'groundworkDone' })}
				>Got it</Button
			>
		{:else if test.screen === 'emotion'}
			<h2 data-step-heading tabindex="-1">
				{test.altPrompt
					? 'Which person do you understand best without trying?'
					: 'Which one shows up for you most in a normal week?'}
			</h2>
			<div class="stack">
				{#each EMOTION_ORDER as emotion (emotion)}
					<ChoiceCard onclick={() => dispatch({ type: 'pickEmotion', emotion })}>
						{#if test.altPrompt}
							<span class="choice-title">
								<span class="dot" style:background={EMOTIONS[emotion].color}></span>
								{EMOTIONS[emotion].empathy}
							</span>
							<span class="mono-tag">{EMOTIONS[emotion].name}</span>
						{:else}
							<span class="choice-title">
								<span class="dot" style:background={EMOTIONS[emotion].color}></span>
								{EMOTIONS[emotion].name}
							</span>
							<span class="chips">
								{#each EMOTIONS[emotion].words as word (word)}
									<span class="chip">{word}</span>
								{/each}
							</span>
							<span class="hidden-line">{EMOTIONS[emotion].hiddenYou}</span>
						{/if}
					</ChoiceCard>
				{/each}
			</div>
			<button type="button" class="text-link" onclick={() => dispatch({ type: 'toggleAlt' })}>
				{test.altPrompt ? 'Back to the first question' : 'Hard to say? Try a different question'}
			</button>
		{:else if test.screen === 'strength' && test.emotion}
			<h2 data-step-heading tabindex="-1">
				Hard feelings build coping skills, and those skills become strengths.
			</h2>
			<p class="muted">{EMOTIONS[test.emotion].name} usually comes with this one:</p>
			<div class="panel-box">
				<p class="choice-title">
					<span class="dot" style:background={EMOTIONS[test.emotion].color}></span>
					{EMOTIONS[test.emotion].strength.name}
				</p>
				<p class="flush">{EMOTIONS[test.emotion].strength.you}</p>
			</div>
			<div class="stack">
				<Button size="lg" fullWidth onclick={() => dispatch({ type: 'confirmStrength' })}>
					Yes, that’s me
				</Button>
				<Button
					size="lg"
					variant="secondary"
					fullWidth
					onclick={() => dispatch({ type: 'otherStrength' })}
				>
					Another one fits better
				</Button>
			</div>
		{:else if test.screen === 'strengthOther' && test.emotion}
			<h2 data-step-heading tabindex="-1">Which strength fits you better?</h2>
			<div class="stack">
				{#each EMOTION_ORDER.filter((emotion) => emotion !== test.emotion) as emotion (emotion)}
					<ChoiceCard onclick={() => dispatch({ type: 'pickStrength', emotion })}>
						<span class="choice-title">{EMOTIONS[emotion].strength.name}</span>
						<span>{EMOTIONS[emotion].strength.you}</span>
					</ChoiceCard>
				{/each}
			</div>
		{:else if test.screen === 'mismatch' && test.emotion && test.strengthEmotion}
			<h2 data-step-heading tabindex="-1">Your emotion and your strength point different ways.</h2>
			<p>That’s common. It often means the emotion that runs you is the one you notice least.</p>
			<div class="panel-box">
				<dl class="pairs">
					<dt>You picked</dt>
					<dd>
						<span class="dot" style:background={EMOTIONS[test.emotion].color}></span>
						{EMOTIONS[test.emotion].name}
					</dd>
					<dt>Your strength</dt>
					<dd>
						{EMOTIONS[test.strengthEmotion].strength.name}, which usually comes with {emotionLabel(
							test.strengthEmotion
						)}
					</dd>
				</dl>
			</div>
			<div class="stack">
				<Button size="lg" fullWidth onclick={() => dispatch({ type: 'showBoth' })}>
					Show me both groups
				</Button>
				<Button
					size="lg"
					variant="secondary"
					fullWidth
					onclick={() => dispatch({ type: 'repickEmotion' })}
				>
					Re-pick my emotion
				</Button>
			</div>
		{:else if test.screen === 'ways'}
			{#each groups as emotion, index (emotion)}
				{#if index === 0}
					<h2 data-step-heading tabindex="-1">
						Three types share {emotionLabel(emotion)}. What separates them is what they do with it.
					</h2>
				{:else}
					<h3>And three share {emotionLabel(emotion)}.</h3>
				{/if}
				<div class="panel-box">
					{#each RELATION_ORDER as relation (relation)}
						{@const type = EMOTIONS[emotion].ways[relation]}
						<div class="way">
							<span class="way-text">
								<span class="way-label">{RELATIONS[relation].label}</span>
								<span class="way-line">
									{RELATIONS[relation].line}
									<span class="mono-tag">· {type} {TEST_TYPES[type].name}</span>
								</span>
							</span>
							<TypeBadge {type} small />
						</div>
					{/each}
				</div>
			{/each}
			<Button size="lg" fullWidth onclick={() => dispatch({ type: 'meetTypes' })}>
				Meet the {groups.length === 1 ? 'three' : 'six'}
			</Button>
		{:else if test.screen === 'types'}
			<h2 data-step-heading tabindex="-1">
				{test.allNine
					? 'All nine types.'
					: groups.length === 1
						? 'Meet the three.'
						: 'Meet the six.'}
				Pick the one that sounds most like you. If two do, pick both.
			</h2>
			<div class="stack">
				{#each groups as emotion (emotion)}
					{#if groups.length > 1}
						<p class="group-label">
							<span class="dot" style:background={EMOTIONS[emotion].color}></span>
							{EMOTIONS[emotion].name}
						</p>
					{/if}
					{#each typesForEmotion(emotion) as type (type)}
						{@const selected = test.picks.includes(type)}
						<ChoiceCard
							pressed={selected}
							onclick={() => dispatch({ type: 'togglePick', pick: type })}
						>
							<TypeDetails {type} {selected} />
						</ChoiceCard>
					{/each}
				{/each}
			</div>
			{#if !test.allNine}
				<button type="button" class="text-link" onclick={() => dispatch({ type: 'noneFit' })}>
					None of these sound like me
				</button>
			{/if}
			<div class="foot-bar">
				<div class="foot-inner">
					{#if test.pickLimitHit}
						<p class="hint" role="status">Two at most. Unpick one first.</p>
					{/if}
					<Button
						size="lg"
						fullWidth
						disabled={test.picks.length === 0}
						onclick={() => dispatch({ type: 'continueTypes' })}
					>
						{test.picks.length === 0
							? 'Pick one or two'
							: test.picks.length === 1
								? 'Continue with 1 pick'
								: 'Continue with 2 picks'}
					</Button>
				</div>
			</div>
		{:else if test.screen === 'tiebreak' && test.picks.length === 2}
			<h2 data-step-heading tabindex="-1">
				Go back to the root. Which of these fears would actually wreck your week?
			</h2>
			<div class="tiebreak">
				{#each test.picks as type (type)}
					<ChoiceCard onclick={() => dispatch({ type: 'tiebreak', pick: type })}>
						<span class="choice-title"><TypeBadge {type} small /> Type {type}</span>
						<span class="mono-tag">Core fear</span>
						<span class="fear">{TEST_TYPES[type].fear}</span>
						<span class="mono-tag">Chasing</span>
						<span>{TEST_TYPES[type].chasing}</span>
					</ChoiceCard>
				{/each}
			</div>
			<button type="button" class="text-link" onclick={() => dispatch({ type: 'tiebreakBoth' })}>
				Honestly, both
			</button>
		{:else if test.screen === 'done'}
			{#if saveError}
				<ResultSummary types={test.result} />
				<div class="notice" role="alert">
					<p class="flush">
						{saveError} Your result is above, but without a saved link a friend can’t check it.
					</p>
					<Button onclick={() => save(test)} loading={saving}>Try saving again</Button>
				</div>
				<div class="stack">
					{#each test.result as type (type)}
						<Button href="/enneagram-corner/enneagram-type-{type}" variant="secondary" fullWidth>
							Read the Type {type} page
						</Button>
					{/each}
				</div>
			{:else}
				<p class="saving" role="status" data-step-heading tabindex="-1">Saving your result…</p>
			{/if}
		{/if}
	{/if}
</div>

<style>
	.flow {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		width: 100%;
		max-width: 40rem;
		margin-inline: auto;
		color: var(--ink-bright);
	}

	.flow :global([data-step-heading]:focus) {
		outline: none;
	}

	.intro {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		padding-block: clamp(1.5rem, 5vw, 3.5rem) 0.5rem;
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

	h1,
	h2,
	h3 {
		margin: 0;
		padding: 0;
		color: var(--ink-bright);
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	h1 {
		font-size: clamp(2.4rem, 8vw, 3.5rem);
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: -0.04em;
	}

	h2 {
		font-size: clamp(1.35rem, 4.5vw, 1.65rem);
		font-weight: 750;
		line-height: 1.2;
	}

	h3 {
		font-size: 1.15rem;
		font-weight: 700;
		line-height: 1.3;
	}

	p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.6;
	}

	.flush {
		margin: 0;
	}

	.lede {
		font-size: 1.15rem;
		color: var(--ink-mid);
	}

	.muted {
		color: var(--ink-mid);
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.1rem;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 0.92rem;
		color: var(--ink-mid);
	}

	.facts li::before {
		content: '✓ ';
		color: var(--lamp-glow);
		font-weight: 800;
	}

	.resumed {
		font-size: 0.9rem;
		color: var(--ink-mid);
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.panel-box {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem 1.1rem;
		background: var(--night-mid);
		border: 1px solid var(--stone-mid);
		border-radius: 16px;
	}

	.emo-row {
		display: grid;
		grid-template-columns: 5.5rem 1fr;
		gap: 0.75rem;
		align-items: start;
	}

	.emo-row + .emo-row {
		padding-top: 0.75rem;
		border-top: 1px solid var(--stone-mid);
	}

	.emo-name,
	.choice-title,
	.group-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		font-weight: 750;
	}

	.choice-title {
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

	.mono-tag {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
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

	.resumed .text-link {
		display: inline;
		margin-left: 0.25rem;
	}

	.pairs {
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: 0.4rem 0.75rem;
		margin: 0;
	}

	.pairs dt {
		color: var(--ink-dim);
		font-weight: 600;
	}

	.pairs dd {
		margin: 0;
	}

	.way {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.way + .way {
		padding-top: 0.75rem;
		border-top: 1px solid var(--stone-mid);
	}

	.way-text {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.way-label {
		font-weight: 700;
	}

	.way-line {
		font-size: 0.94rem;
		color: var(--ink-mid);
	}

	.group-label {
		margin-top: 0.5rem;
	}

	/* Fixed, not sticky: the app wrapper's overflow-x: hidden turns it into the
	   sticky containing block, so position: sticky never engages. */
	.flow.has-foot {
		padding-bottom: 7rem;
	}

	.foot-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 30;
		padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0px));
		background: var(--night-deep);
		border-top: 1px solid var(--stone-mid);
	}

	.foot-inner {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-width: 40rem;
		margin-inline: auto;
	}

	.hint {
		font-size: 0.88rem;
		color: var(--lamp-glow);
	}

	.tiebreak {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 0.75rem;
	}

	.fear {
		font-size: 1.08rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.notice {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--lamp-glow);
		border-radius: 16px;
		background: var(--lamp-soft);
	}

	.saving {
		padding-block: 3rem;
		text-align: center;
		color: var(--ink-mid);
	}
</style>

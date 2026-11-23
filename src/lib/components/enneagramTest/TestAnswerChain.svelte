<!-- src/lib/components/enneagramTest/TestAnswerChain.svelte -->
<!--
  The answer chain on an Enneagram test result (growth bet #1, 2026-11-23): up to three
  questions in a row, each a real take behind the give-first gate. Answer one, see how the
  other types answered, then take the next. Once two are answered, the parent's `capture`
  snippet (the "email me when the other types answer" box) renders under the card.

  Answered questions collapse to a row that reopens their unlocked takes. A returning visitor
  (the result link, on any device) sees every answered question open, because that is what the
  "new takes" email sends them back for.
-->
<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import { ArrowRight, Check } from '@lucide/svelte';
	import LiveQuestionCard from '$lib/components/marketing/home/LiveQuestionCard.svelte';
	import type { LiveTakePostResult } from '$lib/data/homepageLiveTake';
	import { CHAIN_CAPTURE_AFTER } from '$lib/enneagramTest/chain';
	import type { ChainStep, ChainStepResponse, ChainView } from '$lib/enneagramTest/chain';
	import { withArticle } from '$lib/enneagramTest/content';
	import {
		captureTestChainNext,
		captureTestTakePosted,
		captureTestTakeStarted
	} from '$lib/analytics/enneagramTestEvents';

	type Props = {
		chain: ChainView;
		/** /api/enneagram-test/results/<token> */
		resultApi: string;
		split: boolean;
		/** Path reported to analytics instead of the private result URL. */
		sourcePath: string;
		/** Rendered under the card once CHAIN_CAPTURE_AFTER questions are answered. */
		capture?: Snippet;
		/** A take was posted (an exit from the result page into the Q&A). */
		onposted?: () => void;
	};

	let { chain, resultApi, split, sourcePath, capture, onposted }: Props = $props();

	const uid = $props.id();

	// Seeded from the server; posting and "Next question" edit them locally.
	let steps = $derived(chain.steps);
	let current = $derived(chain.current);
	// A returning visitor sees every answered question open; in-session, finished ones fold away.
	let expanded = $derived(
		new SvelteSet(chain.steps.filter((step) => step.done).map((step) => step.url))
	);
	let nextStatus = $state<'idle' | 'loading' | 'error'>('idle');
	let nextError = $state('');
	let cards = $state<Record<string, HTMLElement | undefined>>({});

	let answeredCount = $derived(steps.filter((step) => step.done).length);
	let allDone = $derived(current >= steps.length);
	let showCapture = $derived(Boolean(capture) && answeredCount >= CHAIN_CAPTURE_AFTER);

	function labelFor(step: ChainStep) {
		return step.answeredAs ? `A question for ${withArticle(step.answeredAs)}` : 'Open question';
	}

	function composeLabelFor(step: ChainStep) {
		return step.answeredAs ? `Your take, as ${withArticle(step.answeredAs)}` : 'Your take';
	}

	function updateStep(index: number, patch: Partial<ChainStep>) {
		steps = steps.map((step, at) => (at === index ? { ...step, ...patch } : step));
	}

	function posted(index: number, result: LiveTakePostResult) {
		const step = steps[index];
		// Fold the post into the step's card data, so reopening it later shows the unlocked state.
		updateStep(index, {
			done: true,
			live: step.live
				? {
						...step.live,
						answered: true,
						ownTake: result.ownTake ?? step.live.ownTake,
						answers: result.answers,
						responses: result.responses
					}
				: null
		});
		void captureTestTakePosted({
			split,
			alreadyAnswered: result.alreadyAnswered,
			step: index + 1
		});
		onposted?.();
	}

	async function focusStep(url: string) {
		await tick();
		const card = cards[url];
		card?.scrollIntoView({ block: 'start', behavior: 'instant' });
		// The composer if the question is open to answer, otherwise the unlocked card's heading.
		card?.querySelector<HTMLElement>('textarea, h4[tabindex="-1"]')?.focus({ preventScroll: true });
	}

	async function openNext() {
		const nextIndex = current + 1;
		const next = steps[nextIndex];
		if (!next || nextStatus === 'loading') return;
		nextStatus = 'loading';
		nextError = '';
		try {
			const response = await fetch(`${resultApi}/chain/${nextIndex}`);
			const body = (await response.json().catch(() => null)) as
				(ChainStepResponse & { error?: string }) | null;
			if (!response.ok || !body?.live) {
				throw new Error(body?.error ?? 'We couldn’t load the next question. Try again.');
			}
			updateStep(nextIndex, {
				live: body.live,
				types: body.types,
				done: body.live.answered
			});
			expanded.delete(steps[current].url);
			current = nextIndex;
			nextStatus = 'idle';
			void captureTestChainNext({ split, step: nextIndex + 1 });
			await focusStep(next.url);
		} catch (error) {
			nextStatus = 'error';
			nextError =
				error instanceof Error && error.message
					? error.message
					: 'We couldn’t load the next question. Try again.';
		}
	}

	function toggle(url: string) {
		if (expanded.has(url)) expanded.delete(url);
		else expanded.add(url);
	}
</script>

{#snippet arrow()}<ArrowRight size={16} aria-hidden="true" />{/snippet}

{#snippet card(step: ChainStep, index: number)}
	{#if step.live}
		<LiveQuestionCard
			live={step.live}
			types={step.types}
			surface="enneagram_test"
			endpoint="{resultApi}/answer"
			{sourcePath}
			label={labelFor(step)}
			composeLabel={composeLabelFor(step)}
			onstart={() => captureTestTakeStarted({ split, step: index + 1 })}
			onpost={(result) => posted(index, result)}
		/>
	{:else}
		<p class="fallback">
			<a href={resolve('/questions/[slug]', { slug: step.url })}>{step.question}</a>
		</p>
	{/if}
{/snippet}

{#snippet afterCard()}
	{#if showCapture}
		<div class="capture">{@render capture?.()}</div>
	{/if}
{/snippet}

<div class="chain">
	<ol class="progress" aria-label="Your answers">
		{#each steps as step, index (step.url)}
			<li
				class={[
					'dot',
					step.done && 'done',
					index === current && !step.done && 'now',
					index === current && 'active'
				]}
			>
				<span class="sr-only">
					Question {index + 1} of {steps.length}: {step.done
						? 'answered'
						: index === current
							? 'up now'
							: 'next'}
				</span>
			</li>
		{/each}
		<li class="progress-label" aria-hidden="true">
			{allDone ? `All ${steps.length} answered` : `Question ${current + 1} of ${steps.length}`}
		</li>
	</ol>

	{#each steps as step, index (step.url)}
		{#if index === current}
			<div class="step" bind:this={cards[step.url]}>
				{@render card(step, index)}
				{#if step.done}
					{@render afterCard()}
					{#if index < steps.length - 1}
						<div class="next">
							<button
								type="button"
								class="next-btn"
								disabled={nextStatus === 'loading'}
								onclick={openNext}
							>
								{nextStatus === 'loading'
									? 'Loading…'
									: `Next question (${index + 2} of ${steps.length})`}
								{@render arrow()}
							</button>
							{#if nextStatus === 'error'}
								<p class="form-error" role="alert">{nextError}</p>
							{/if}
						</div>
					{:else}
						<p class="finish">
							That’s all {steps.length}. As the other types answer, their takes show up here.
							<a href={resolve('/questions')}>More open questions</a>
						</p>
					{/if}
				{/if}
			</div>
		{:else if step.done || index < current}
			{@const open = expanded.has(step.url)}
			<div class="step answered" bind:this={cards[step.url]}>
				<div class="answered-row">
					<span class="tick" aria-hidden="true"><Check size={14} /></span>
					<p class="answered-q">{step.question}</p>
					{#if step.live}
						<button
							type="button"
							class="toggle"
							aria-expanded={open}
							aria-controls="{uid}-step-{index}"
							onclick={() => toggle(step.url)}
						>
							{open ? 'Hide' : 'See the takes'}
						</button>
					{/if}
				</div>
				{#if open}
					<div id="{uid}-step-{index}">{@render card(step, index)}</div>
				{/if}
			</div>
		{/if}
	{/each}

	{#if allDone}
		{@render afterCard()}
		<p class="finish">
			You answered all {steps.length}. New takes land here as the other types answer.
			<a href={resolve('/questions')}>More open questions</a>
		</p>
	{/if}
</div>

<style>
	.chain {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.progress {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.dot {
		width: 10px;
		height: 10px;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--highlight) 45%, transparent);
	}
	.dot.done {
		background: var(--highlight);
		border-color: var(--highlight);
	}
	.dot.now {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--highlight) 25%, transparent);
	}
	.progress-label {
		margin-left: 6px;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}

	.step {
		display: flex;
		flex-direction: column;
		gap: 12px;
		scroll-margin-top: 96px;
	}

	.answered-row {
		display: grid;
		grid-template-columns: 24px minmax(0, 1fr) auto;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--surface);
	}
	.tick {
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: 999px;
		background: var(--highlight);
		color: var(--bg);
	}
	.answered-q {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--text);
		overflow-wrap: anywhere;
	}
	.toggle {
		min-height: 44px;
		padding: 0 4px;
		border: 0;
		background: none;
		color: var(--highlight);
		font: inherit;
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.capture {
		display: flex;
		flex-direction: column;
	}

	.next {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}
	.next-btn {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 48px;
		padding: 13px 22px;
		border: 1px solid var(--highlight);
		border-radius: 999px;
		background: transparent;
		color: var(--text);
		font: 700 var(--font-size-sm) / 1 var(--font-talk);
		letter-spacing: 0.02em;
		cursor: pointer;
	}
	.next-btn:hover:not(:disabled),
	.next-btn:focus-visible {
		background: color-mix(in srgb, var(--highlight) 10%, transparent);
	}
	.next-btn:disabled {
		cursor: progress;
		opacity: 0.75;
	}

	.form-error {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--error-text);
	}
	.finish,
	.fallback {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.finish a,
	.fallback a {
		color: var(--highlight);
		font-weight: 600;
	}

	@media (max-width: 520px) {
		.next,
		.next-btn {
			width: 100%;
		}
		.next-btn {
			justify-content: center;
		}
	}
</style>

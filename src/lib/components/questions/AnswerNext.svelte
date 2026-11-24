<!-- src/lib/components/questions/AnswerNext.svelte -->
<!--
  "Answer the next one": the step after a reveal. The 2026-11-20 baseline found that 0 of 21
  people who answered went on to a second question, so every reveal (a celebrity page's
  Chorus, the homepage card) ends by offering one more question they haven't answered,
  answerable right here. Posting unlocks its real takes in place, then the next one appears,
  up to `max` in a row.

  The teaser names the question before anything loads, so the visitor sees what they'd be
  answering. The card itself (and its gate_shown event) loads only when they open it, from
  /api/questions/live/<slug>, and posts back to the same route with the host page as
  attribution.
-->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import LiveQuestionCard from '$lib/components/marketing/home/LiveQuestionCard.svelte';
	import type { LiveTake } from '$lib/data/homepageLiveTake';
	import type { LiveTakeTypes } from '$lib/data/homepageLiveTypes';
	import {
		captureAnswerNextOpened,
		captureAnswerNextShown,
		captureAnswerNextSkipped,
		type AnswerNextHost
	} from '$lib/analytics/answerChainEvents';

	type NextQuestion = { url: string; title: string; responses: number };
	type Step = { live: LiveTake; types: LiveTakeTypes | null; done: boolean };

	type Props = {
		/** The question the reveal was for; never offered again. */
		afterSlug: string;
		/** Public path of the host page: gate and contribution attribution. */
		sourcePath: string;
		host: AnswerNextHost;
		/** Most extra questions offered in a row. */
		max?: number;
	};

	let { afterSlug, sourcePath, host, max = 3 }: Props = $props();

	let teaser = $state<NextQuestion | null>(null);
	let status = $state<'loading' | 'ready' | 'opening' | 'none' | 'error'>('loading');
	let errorText = $state('');
	let steps = $state<Step[]>([]);
	let cards = $state<Record<string, HTMLElement | undefined>>({});
	// Skipped teasers stay skipped for the rest of the visit.
	let skipped: string[] = [];

	let reduceMotion = $derived(prefersReducedMotion.current);
	let answeredCount = $derived(steps.filter((step) => step.done).length);
	let current = $derived(steps.at(-1) ?? null);
	// The next teaser shows once the open card is answered (or before any card is open).
	let awaitingAnswer = $derived(Boolean(current && !current.done));
	let finished = $derived(steps.length >= max && !awaitingAnswer);
	let stepNumber = $derived(steps.length + 1);

	function enter(delay = 0) {
		return {
			y: 10,
			duration: reduceMotion ? 0 : 280,
			delay: reduceMotion ? 0 : delay,
			easing: cubicOut
		};
	}

	function liveEndpoint(slug: string) {
		const from = encodeURIComponent(sourcePath);
		return `${resolve('/api/questions/live/[slug]', { slug })}?from=${from}`;
	}

	async function loadTeaser() {
		status = 'loading';
		teaser = null;
		const skip = [...steps.map((step) => step.live.slug), ...skipped].join(',');
		const query = `after=${encodeURIComponent(afterSlug)}${skip ? `&skip=${encodeURIComponent(skip)}` : ''}`;
		try {
			const response = await fetch(`${resolve('/api/questions/next')}?${query}`);
			const body = (await response.json().catch(() => null)) as {
				next?: NextQuestion | null;
			} | null;
			if (!response.ok) throw new Error();
			teaser = body?.next ?? null;
			status = teaser ? 'ready' : 'none';
			if (teaser) void captureAnswerNextShown({ host, step: stepNumber, sourcePath });
		} catch {
			// Nothing to offer is a quiet ending, not an error the reader has to deal with.
			status = 'none';
		}
	}

	// The step exists only after a reveal, so the first teaser loads as soon as it mounts.
	// (onMount, not $effect: loadTeaser reads `steps`, which must not re-trigger it.)
	onMount(() => {
		void loadTeaser();
	});

	async function open() {
		if (!teaser || status === 'opening') return;
		const question = teaser;
		status = 'opening';
		errorText = '';
		try {
			const response = await fetch(liveEndpoint(question.url));
			const body = (await response.json().catch(() => null)) as {
				live?: LiveTake;
				types?: LiveTakeTypes | null;
				error?: string;
			} | null;
			if (!response.ok || !body?.live) throw new Error(body?.error ?? '');
			steps.push({ live: body.live, types: body.types ?? null, done: body.live.answered });
			void captureAnswerNextOpened({ host, step: steps.length, sourcePath });
			teaser = null;
			status = 'ready';
			if (body.live.answered && steps.length < max) void loadTeaser();
			await tick();
			const card = cards[question.url];
			card?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'instant' : 'smooth' });
			card?.querySelector<HTMLElement>('textarea')?.focus({ preventScroll: true });
		} catch (failure) {
			status = 'error';
			errorText =
				failure instanceof Error && failure.message
					? failure.message
					: 'We couldn’t open that question. Try again.';
		}
	}

	function skip() {
		if (!teaser) return;
		skipped.push(teaser.url);
		void captureAnswerNextSkipped({ host, step: stepNumber, sourcePath });
		void loadTeaser();
	}

	function posted(index: number) {
		steps[index].done = true;
		if (steps.length < max) void loadTeaser();
	}

	function takesLabel(count: number) {
		if (count <= 0) return 'No takes yet. Yours would be the first.';
		return `${count.toLocaleString('en-US')} ${count === 1 ? 'take' : 'takes'} waiting behind it`;
	}
</script>

{#snippet arrow()}<ArrowRight size={16} aria-hidden="true" />{/snippet}

<section class="answer-next" aria-label="Answer another question">
	{#each steps as step, index (step.live.slug)}
		<div class="step" bind:this={cards[step.live.slug]} in:fly|global={enter()}>
			<LiveQuestionCard
				live={step.live}
				types={step.types}
				surface="answer_chain"
				endpoint={liveEndpoint(step.live.slug)}
				{sourcePath}
				label={`One more · ${index + 1} of ${max}`}
				onpost={() => posted(index)}
			/>
		</div>
	{/each}

	{#if finished}
		<p class="finish" in:fly|global={enter(120)}>
			That’s {answeredCount + 1} questions answered.
			<a href={resolve('/questions')}>Browse every open question</a>
		</p>
	{:else if !awaitingAnswer && status !== 'none'}
		<div class="teaser" aria-live="polite" aria-busy={status === 'loading'}>
			{#if teaser}
				{#key teaser.url}
					<div class="teaser-body" in:fly|global={enter(steps.length ? 160 : 0)}>
						<span class="kicker">{steps.length ? 'Keep going' : 'One more?'}</span>
						<p class="teaser-question">{teaser.title}</p>
						<p class="teaser-meta">{takesLabel(teaser.responses)}</p>
						<div class="actions">
							<button type="button" class="next-btn" disabled={status === 'opening'} onclick={open}>
								{status === 'opening' ? 'Opening…' : 'Answer this one'}
								{@render arrow()}
							</button>
							<button type="button" class="skip" disabled={status === 'opening'} onclick={skip}
								>Different question</button
							>
						</div>
						{#if status === 'error'}
							<p class="form-error" role="alert">{errorText}</p>
						{/if}
					</div>
				{/key}
			{:else}
				<p class="loading">Finding another question…</p>
			{/if}
		</div>
	{/if}
</section>

<style>
	.answer-next {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.step {
		display: flex;
		flex-direction: column;
		scroll-margin-top: 96px;
	}

	.teaser {
		min-height: 5rem;
	}
	.teaser-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 18px 20px 20px;
		border: 1px solid color-mix(in srgb, var(--highlight) 35%, var(--rule));
		border-radius: 16px;
		background: color-mix(in srgb, var(--highlight) 5%, var(--surface));
	}
	.kicker {
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--highlight);
	}
	.teaser-question {
		margin: 0;
		font-size: var(--font-size-lg);
		font-weight: 600;
		line-height: 1.35;
		color: var(--text);
		overflow-wrap: anywhere;
	}
	.teaser-meta {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 16px;
		margin-top: 6px;
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
	.next-btn:disabled,
	.skip:disabled {
		cursor: progress;
		opacity: 0.75;
	}
	.skip {
		min-height: 44px;
		padding: 0 4px;
		border: 0;
		background: none;
		color: var(--text-muted);
		font: inherit;
		font-size: var(--font-size-sm);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
	.skip:hover:not(:disabled) {
		color: var(--text);
	}

	.loading,
	.finish {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.finish a {
		color: var(--highlight);
		font-weight: 600;
	}
	.form-error {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--error-text);
	}

	@media (max-width: 520px) {
		.next-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>

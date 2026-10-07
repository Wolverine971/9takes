<!-- src/routes/enneagram-test/result/[token]/+page.svelte -->
<!--
  A test-taker's private Enneagram test result (T-42). DJ's three exits:
  answer a question as your type, read your type page, ask someone who knows
  you (the friend link). Friend reads land here, and the only email ask in the
  whole flow is the optional "email me when someone answers."
-->
<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button, Field, Input } from '$lib/components/atoms';
	import InviteSheet from '$lib/components/enneagramTest/InviteSheet.svelte';
	import ResultSummary from '$lib/components/enneagramTest/ResultSummary.svelte';
	import TypeBadge from '$lib/components/enneagramTest/TypeBadge.svelte';
	import { TEST_TYPES, typeListWithArticles, withArticle } from '$lib/enneagramTest/content';
	import {
		captureTestExitClicked,
		captureTestNotifyOptIn,
		type TestExit
	} from '$lib/analytics/enneagramTestEvents';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const result = $derived(data.result);
	const types = $derived(result.types);
	const split = $derived(types.length > 1);
	const questionLinks = $derived(
		types.flatMap((type) => {
			const link = data.questions[type];
			return link ? [{ type, ...link }] : [];
		})
	);

	// svelte-ignore state_referenced_locally
	let notifyOn = $state(data.result.notifyOn);
	let email = $state('');
	let notifyStatus = $state<'idle' | 'saving' | 'error'>('idle');
	let notifyError = $state('');
	let justOptedIn = $state(false);

	function exitClicked(exit: TestExit) {
		void captureTestExitClicked(exit, split);
	}

	async function setNotifyEmail(value: string) {
		notifyStatus = 'saving';
		notifyError = '';
		try {
			const response = await fetch(
				`/api/enneagram-test/results/${encodeURIComponent(data.resultToken)}`,
				{
					method: 'PATCH',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ notifyEmail: value })
				}
			);
			const body = (await response.json().catch(() => null)) as {
				ok?: boolean;
				message?: string;
			} | null;
			if (!response.ok || !body?.ok) throw new Error(body?.message ?? 'We couldn’t save that.');
			notifyOn = value !== '';
			justOptedIn = value !== '';
			if (value) void captureTestNotifyOptIn();
			notifyStatus = 'idle';
		} catch (error) {
			notifyStatus = 'error';
			notifyError = error instanceof Error ? error.message : 'We couldn’t save that.';
		}
	}

	function submitNotify(event: SubmitEvent) {
		event.preventDefault();
		const value = email.trim();
		if (!/^\S+@\S+\.\S+$/.test(value)) {
			notifyStatus = 'error';
			notifyError = 'Enter an email address like you@example.com.';
			return;
		}
		void setNotifyEmail(value);
	}
</script>

<SEOHead
	title="Your Enneagram Test Result | 9takes"
	description="Your private 9takes Enneagram test result."
	noindex
/>

<div class="result-page">
	<ResultSummary {types} />

	{#if data.emailsStopped}
		<p class="notice" role="status">Done. You won’t get any more emails about reads.</p>
	{/if}

	<section class="block" aria-labelledby="next-title">
		<h2 id="next-title">Where to next</h2>
		<div class="exits">
			{#snippet askExit(order: number)}
				<a class="exit" class:lead={split} href="#ask" onclick={() => exitClicked('friend')}>
					<span class="exit-num">0{order}</span>
					<span class="exit-body">
						<span class="exit-title">
							{split ? 'Stuck? Ask someone who knows you' : 'Ask someone who knows you'}
						</span>
						<span class="exit-sub">
							Send a link. They pick for you before they see your answer, and their read shows up
							here.
						</span>
					</span>
				</a>
			{/snippet}
			{#snippet questionExit(order: number)}
				<div class="exit">
					<span class="exit-num">0{order}</span>
					<span class="exit-body">
						<span class="exit-title">Answer a question as {typeListWithArticles(types)}</span>
						<span class="exit-sub">
							Answer before the crowd, then see how {split ? 'your two types' : `${types[0]}s`} and the
							other {split ? 'seven' : 'eight'} answered.
						</span>
						{#if questionLinks.length}
							<span class="exit-links">
								{#each questionLinks as link (link.type)}
									<a href="/questions/{link.url}" onclick={() => exitClicked('question')}>
										{split ? `As ${withArticle(link.type)}: ` : ''}{link.question}
									</a>
								{/each}
							</span>
						{:else}
							<span class="exit-links">
								<a href="/questions" onclick={() => exitClicked('question')}>Pick a question</a>
							</span>
						{/if}
					</span>
				</div>
			{/snippet}
			{#snippet pageExit(order: number)}
				<div class="exit">
					<span class="exit-num">0{order}</span>
					<span class="exit-body">
						<span class="exit-title">Read your type page</span>
						<span class="exit-links">
							{#each types as type (type)}
								<a
									href="/enneagram-corner/enneagram-type-{type}"
									onclick={() => exitClicked('type_page')}
								>
									Type {type}: {TEST_TYPES[type].name}
								</a>
							{/each}
						</span>
					</span>
				</div>
			{/snippet}

			{#if split}
				{@render askExit(1)}
				{@render questionExit(2)}
				{@render pageExit(3)}
			{:else}
				{@render questionExit(1)}
				{@render pageExit(2)}
				{@render askExit(3)}
			{/if}
		</div>
	</section>

	<section class="block" id="ask" aria-labelledby="ask-title">
		<h2 id="ask-title">Ask someone who knows you</h2>
		<p class="muted">
			They answer the same questions about you before they see your pick. One link works for as many
			people as you want: a parent, a partner, a friend.
		</p>
		<InviteSheet
			resultToken={data.resultToken}
			readToken={result.readToken}
			{split}
			initialName={result.displayName}
		/>
	</section>

	<section class="block" aria-labelledby="reads-title">
		<h2 id="reads-title">Reads from people who know you</h2>
		{#if result.reads.length}
			<ul class="reads">
				{#each result.reads as read, index (index)}
					<li class="read">
						<TypeBadge type={read.pickedType} small />
						<span class="read-body">
							<span
								><strong>{read.readerName ?? 'Someone'}</strong> read you as {withArticle(
									read.pickedType
								)}.</span
							>
							{#if read.note}
								<q>{read.note}</q>
							{/if}
						</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="muted">No reads yet. Send your link.</p>
		{/if}

		<div class="notify">
			{#if notifyOn}
				<p class="muted">
					{justOptedIn ? 'Done. ' : ''}We’ll email you when someone answers your link.
					<button
						type="button"
						class="text-link"
						disabled={notifyStatus === 'saving'}
						onclick={() => setNotifyEmail('')}
					>
						Stop these emails
					</button>
				</p>
			{:else}
				<form class="notify-form" onsubmit={submitNotify} novalidate>
					<Field
						for="et-notify-email"
						label="Email me when someone answers my link"
						optional
						error={notifyStatus === 'error' ? notifyError : undefined}
					>
						<Input
							id="et-notify-email"
							type="email"
							bind:value={email}
							autocomplete="email"
							placeholder="you@example.com"
						/>
					</Field>
					<Button type="submit" variant="secondary" loading={notifyStatus === 'saving'}>
						Notify me
					</Button>
				</form>
			{/if}
		</div>
	</section>

	<footer class="foot">
		<p class="muted small">
			This page is your result’s private link. Bookmark it to come back and see new reads.
		</p>
		<a href="/enneagram-test" class="retake">Retake the test</a>
	</footer>
</div>

<style>
	.result-page {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
		width: 100%;
		max-width: 40rem;
		margin-inline: auto;
		padding-block: clamp(1rem, 4vw, 2.5rem) 3rem;
		color: var(--ink-bright);
	}

	.block {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		scroll-margin-top: 6rem;
	}

	h2 {
		margin: 0;
		padding: 0;
		font-size: 1.35rem;
		font-weight: 750;
		line-height: 1.2;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
	}

	p {
		margin: 0;
		line-height: 1.6;
	}

	.muted {
		color: var(--ink-mid);
	}

	.small {
		font-size: 0.9rem;
	}

	.notice {
		padding: 0.8rem 1rem;
		border: 1px solid var(--lamp-glow);
		border-radius: 10px;
		background: var(--lamp-soft);
	}

	.exits {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.exit {
		display: grid;
		grid-template-columns: 2rem 1fr;
		gap: 0.75rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--stone-mid);
		border-radius: 16px;
		background: var(--stone-warm);
		color: var(--ink-bright);
		text-decoration: none;
	}

	a.exit:hover,
	a.exit:focus-visible,
	.exit.lead {
		border-color: var(--lamp-glow);
	}

	.exit-num {
		padding-top: 0.1rem;
		font-family: var(--font-mono);
		font-weight: 600;
		color: var(--lamp-glow);
	}

	.exit-body {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-width: 0;
	}

	.exit-title {
		font-weight: 700;
		font-size: 1.05rem;
	}

	.exit-sub {
		font-size: 0.93rem;
		color: var(--ink-mid);
	}

	.exit-links {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-weight: 600;
	}

	.exit-links a,
	.retake {
		color: var(--lamp-glow);
	}

	.reads {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.read {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.read-body {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
	}

	.read-body q {
		color: var(--ink-mid);
	}

	.notify {
		padding-top: 0.5rem;
	}

	.notify-form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.6rem;
	}

	.notify-form :global(.field) {
		width: 100%;
	}

	.text-link {
		display: inline;
		margin: 0 0 0 0.25rem;
		padding: 0;
		border: 0;
		background: none;
		color: var(--lamp-glow);
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.foot {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--stone-mid);
	}
</style>

<!-- src/routes/enneagram-test/result/[token]/+page.svelte -->
<!--
  A test-taker's private Enneagram test result (T-42). DJ's three exits (answer
  a question as your type, read your type page, ask someone who knows you) each
  happen on this page now instead of behind a link:

  1. Keep this result: one optional email sends the private link, turns on the
     friend-read notes, and subscribes them. Signed-in test-takers can also copy
     the type onto their profile.
  2. Answer as your type: the answer-first card posts a real take here and
     unlocks the other answers in place.
  3. Go deeper: the type page and the people who share the type.
  4. Ask someone who knows you: the friend link and the reads that come back.

  A two-type result leads with the friend link, because that is what settles it.
  The result still shows with no email, as the test promises.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { ogImageUrl } from '$lib/brand/brandCardPresets';
	import { Button, Field, Input } from '$lib/components/atoms';
	import InviteSheet from '$lib/components/enneagramTest/InviteSheet.svelte';
	import ResultSummary from '$lib/components/enneagramTest/ResultSummary.svelte';
	import TypeBadge from '$lib/components/enneagramTest/TypeBadge.svelte';
	import LiveQuestionCard from '$lib/components/marketing/home/LiveQuestionCard.svelte';
	import { TEST_TYPES, typeListWithArticles, withArticle } from '$lib/enneagramTest/content';
	import {
		captureTestExitClicked,
		captureTestNotifyOptIn,
		captureTestResultEmailed,
		captureTestSavedToProfile,
		captureTestTakePosted,
		captureTestTakeStarted,
		type TestExit
	} from '$lib/analytics/enneagramTestEvents';
	import { prepareEmailSignup } from '$lib/analytics/marketingEvents';
	import type { PageData } from './$types';

	// Reported to analytics instead of the page URL, which carries the private token.
	const RESULT_PATH = '/enneagram-test/result';

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
	// Questions that are not already in the answer-first card.
	const otherQuestionLinks = $derived(
		questionLinks.filter((link) => !data.live || link.type !== data.answerType)
	);
	const updateUrl = $derived(`/api/enneagram-test/results/${encodeURIComponent(data.resultToken)}`);

	// Seeded from the result; a successful save overrides it until the result changes.
	let notifyOn = $derived(data.result.notifyOn);
	let email = $state('');
	let keepStatus = $state<'idle' | 'saving' | 'error'>('idle');
	let keepError = $state('');
	let justKept = $state<'sent' | 'saved' | null>(null);
	const pageOpenedAt = Date.now();

	// Signed-in test-takers with one type can copy it onto their profile.
	let profileType = $derived(data.viewer.profileType);
	let profileStatus = $state<'idle' | 'saving' | 'error'>('idle');
	const canSaveToProfile = $derived(data.viewer.signedIn && !split && profileType !== types[0]);

	function exitClicked(exit: TestExit) {
		void captureTestExitClicked(exit, split);
	}

	async function patchResult(body: Record<string, unknown>) {
		const response = await fetch(updateUrl, {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		});
		const payload = (await response.json().catch(() => null)) as {
			ok?: boolean;
			message?: string;
			resultEmail?: string;
		} | null;
		if (!response.ok || !payload?.ok) throw new Error(payload?.message ?? 'We couldn’t save that.');
		return payload;
	}

	/** The same list the article forms feed, so the address is reachable later. */
	async function subscribe(address: string) {
		const body = new FormData();
		body.append('email', address);
		body.append('form_extra', '');
		body.append('_timeToken', String(Date.now() - pageOpenedAt));
		try {
			await prepareEmailSignup(body, { surface: 'enneagram_test_result', sourcePath: RESULT_PATH });
			await fetch('/api/signups', { method: 'POST', body });
		} catch {
			// The result email already went out; the list is a bonus.
		}
	}

	async function keepResult(event: SubmitEvent) {
		event.preventDefault();
		if (keepStatus === 'saving') return;
		const address = email.trim().toLowerCase();
		if (!/^\S+@\S+\.\S+$/.test(address)) {
			keepStatus = 'error';
			keepError = 'Enter an email address like you@example.com.';
			return;
		}
		keepStatus = 'saving';
		keepError = '';
		try {
			const saved = await patchResult({ notifyEmail: address, sendResult: true });
			const sent = saved.resultEmail === 'sent';
			notifyOn = true;
			justKept = sent ? 'sent' : 'saved';
			keepStatus = 'idle';
			email = '';
			void captureTestNotifyOptIn();
			void captureTestResultEmailed({ split, sent });
			void subscribe(address);
		} catch (error) {
			keepStatus = 'error';
			keepError = error instanceof Error ? error.message : 'We couldn’t save that.';
		}
	}

	async function stopEmails() {
		if (keepStatus === 'saving') return;
		keepStatus = 'saving';
		keepError = '';
		try {
			await patchResult({ notifyEmail: '' });
			notifyOn = false;
			justKept = null;
			keepStatus = 'idle';
		} catch (error) {
			keepStatus = 'error';
			keepError = error instanceof Error ? error.message : 'We couldn’t save that.';
		}
	}

	async function saveToProfile() {
		if (profileStatus === 'saving') return;
		profileStatus = 'saving';
		try {
			await patchResult({ saveToProfile: true });
			profileType = types[0];
			profileStatus = 'idle';
			void captureTestSavedToProfile();
		} catch {
			profileStatus = 'error';
		}
	}
</script>

<SEOHead
	title="Your Enneagram Test Result | 9takes"
	description="Your private 9takes Enneagram test result."
	ogImage={ogImageUrl('enneagram-test')}
	ogImageWidth={1200}
	ogImageHeight={630}
	twitterImageAlt="Free Enneagram test on 9takes: what's your type? It starts with emotion, not behavior."
	noindex
/>

{#snippet keepSection()}
	<section class="keep block" id="keep" aria-labelledby="keep-title">
		<h2 id="keep-title">Keep this result</h2>
		{#if notifyOn}
			<p class="muted" role="status">
				{#if justKept === 'sent'}
					Sent. Your private link is in your inbox.
				{:else if justKept === 'saved'}
					Saved. Bookmark this page too, in case the email is slow.
				{:else}
					Your email is saved with this result.
				{/if}
				We’ll also email you when someone answers your link.
				<button
					type="button"
					class="text-link"
					disabled={keepStatus === 'saving'}
					onclick={stopEmails}
				>
					Stop these emails
				</button>
			</p>
			{#if keepStatus === 'error'}
				<p class="form-error" role="alert">{keepError}</p>
			{/if}
		{:else}
			<p class="muted">
				This page is the only copy, and it isn’t tied to an account. Email yourself the private link
				so you can come back to it.
			</p>
			<form class="keep-form" onsubmit={keepResult} novalidate>
				<Field
					for="et-keep-email"
					label="Email"
					optional
					error={keepStatus === 'error' ? keepError : undefined}
				>
					<Input
						id="et-keep-email"
						type="email"
						bind:value={email}
						autocomplete="email"
						placeholder="you@example.com"
					/>
				</Field>
				<Button type="submit" variant="primary" loading={keepStatus === 'saving'}>
					Email me my result
				</Button>
			</form>
			<p class="muted small">
				You’ll get your link now, a note when someone answers it, and an occasional email from
				9takes. One click stops them.
			</p>
		{/if}

		{#if canSaveToProfile}
			<div class="profile-save">
				<Button variant="secondary" loading={profileStatus === 'saving'} onclick={saveToProfile}>
					Save Type {types[0]} to my profile
				</Button>
				<p class="muted small">
					{#if profileStatus === 'error'}
						We couldn’t save that. Try again.
					{:else if profileType}
						Your profile says Type {profileType}. This replaces it, and your takes will show {withArticle(
							types[0]
						)}.
					{:else}
						Your takes will show {withArticle(types[0])} next to them.
					{/if}
				</p>
			</div>
		{:else if data.viewer.signedIn && !split && profileType === types[0]}
			<p class="muted small">Type {types[0]} is on your profile. Your takes show it.</p>
		{/if}
	</section>
{/snippet}

{#snippet answerSection()}
	<section class="block" id="answer-as" aria-labelledby="answer-title">
		<h2 id="answer-title">Answer one question as {typeListWithArticles(types)}</h2>
		<p class="muted">
			Answer before the crowd. Then see how {split ? 'your two types' : `other ${types[0]}s`} and the
			other {split ? 'seven' : 'eight'} answered it.
		</p>
		{#if data.live}
			<LiveQuestionCard
				live={data.live}
				types={data.liveTypes}
				surface="enneagram_test"
				endpoint="{updateUrl}/answer"
				sourcePath={RESULT_PATH}
				label={data.answerType ? `A question for ${withArticle(data.answerType)}` : 'Open question'}
				composeLabel={data.answerType
					? `Your take, as ${withArticle(data.answerType)}`
					: 'Your take'}
				onstart={() => captureTestTakeStarted(split)}
				onpost={(posted) => {
					exitClicked('question');
					void captureTestTakePosted({ split, alreadyAnswered: posted.alreadyAnswered });
				}}
			/>
		{/if}
		{#if otherQuestionLinks.length}
			<p class="more-links">
				{#each otherQuestionLinks as link (link.type)}
					<a
						href={resolve('/questions/[slug]', { slug: link.url })}
						onclick={() => exitClicked('question')}
					>
						{data.live ? 'Or as' : 'As'}
						{withArticle(link.type)}: {link.question}
					</a>
				{/each}
			</p>
		{:else if !data.live}
			<p class="more-links">
				<a href={resolve('/questions')} onclick={() => exitClicked('question')}>Pick a question</a>
			</p>
		{/if}
	</section>
{/snippet}

{#snippet deeperSection()}
	<section class="block" aria-labelledby="deeper-title">
		<h2 id="deeper-title">Go deeper on {split ? 'your two types' : `Type ${types[0]}`}</h2>
		<div class="deeper">
			{#each types as type (type)}
				<a
					class="deeper-card"
					href={resolve('/enneagram-corner/[slug]', { slug: `enneagram-type-${type}` })}
					onclick={() => exitClicked('type_page')}
				>
					<TypeBadge {type} small />
					<span class="deeper-body">
						<span class="deeper-title">Type {type}: {TEST_TYPES[type].name}</span>
						<span class="deeper-sub">How it shows up at work, in love and under stress.</span>
					</span>
				</a>
				<a
					class="deeper-card"
					href={resolve('/personality-analysis/type/[slug]', { slug: String(type) })}
					onclick={() => exitClicked('famous_people')}
				>
					<TypeBadge {type} small />
					<span class="deeper-body">
						<span class="deeper-title">Public figures we read as {withArticle(type)}</span>
						<span class="deeper-sub">See the type in people you already know.</span>
					</span>
				</a>
			{/each}
		</div>
	</section>
{/snippet}

{#snippet askSection()}
	<section class="block" id="ask" aria-labelledby="ask-title">
		<h2 id="ask-title">
			{split ? 'Stuck between two? Ask someone who knows you' : 'Ask someone who knows you'}
		</h2>
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
		{#if !notifyOn}
			<p class="muted small">
				Want to hear when someone answers? <a class="inline-link" href="#keep">Add your email</a>.
			</p>
		{/if}
	</section>
{/snippet}

<div class="result-page">
	<ResultSummary {types} />

	{#if data.emailsStopped}
		<p class="notice" role="status">Done. You won’t get any more emails about this result.</p>
	{/if}

	{@render keepSection()}

	{#if split}
		{@render askSection()}
		{@render answerSection()}
		{@render deeperSection()}
	{:else}
		{@render answerSection()}
		{@render deeperSection()}
		{@render askSection()}
	{/if}

	<footer class="foot">
		<p class="muted small">
			This page is your result’s private link. Anyone with the link can open it.
		</p>
		<a href={resolve('/enneagram-test')} class="retake">Retake the test</a>
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

	.keep {
		padding: 1.1rem 1.2rem;
		border: 1px solid var(--highlight);
		border-radius: 16px;
		background: var(--surface);
	}

	.keep-form {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 0.6rem;
	}

	.keep-form :global(.field) {
		flex: 1 1 14rem;
		min-width: 0;
	}

	.form-error {
		color: var(--error-text);
		font-size: 0.93rem;
	}

	.profile-save {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 0.9rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--rule);
	}

	.more-links {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-weight: 600;
	}

	.more-links a,
	.inline-link,
	.retake {
		color: var(--highlight);
	}

	.deeper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 0.75rem;
	}

	.deeper-card {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.9rem 1rem;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background: var(--surface);
		color: var(--text);
		text-decoration: none;
	}

	.deeper-card:hover,
	.deeper-card:focus-visible {
		border-color: var(--highlight);
	}

	.deeper-body {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		min-width: 0;
	}

	.deeper-title {
		font-weight: 700;
	}

	.deeper-sub {
		font-size: 0.93rem;
		color: var(--text-muted);
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

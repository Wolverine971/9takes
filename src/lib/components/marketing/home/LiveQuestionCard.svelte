<!-- src/lib/components/marketing/home/LiveQuestionCard.svelte -->
<!--
  The answer-first card: a live question with a composer that posts a real take. Built for the
  homepage (POST /api/homepage/answer) and reused on the Enneagram test result page, which
  passes its own endpoint and surface. Give-first: before the visitor posts, the card shows
  the take count, which types answered and blurred placeholder rows, never take text. After a
  post (or for a visitor who already answered) it shows their take and the unlocked answers.
-->
<script lang="ts">
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import { ArrowRight, Check } from '@lucide/svelte';
	import type { LiveTake, LiveTakePostResult } from '$lib/data/homepageLiveTake';
	import { listTypes, missingTypes, type LiveTakeTypes } from '$lib/data/homepageLiveTypes';
	import {
		captureCommentCreated,
		captureCommentFailed,
		normalizeServerCommentAnalytics,
		type CommentFailureCategory,
		type CommentFailureStage
	} from '$lib/analytics/commentEvents';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import { qualifiedVisibility } from '$lib/analytics/qualifiedVisibility';
	import ReplyOptInTray, {
		type ReplyOptInOffer
	} from '$lib/components/questions/ReplyOptInTray.svelte';
	import { trackHomePractice } from './homeAnalytics';

	type Props = {
		live: LiveTake | null;
		types?: LiveTakeTypes | null;
		/** Where the card sits. Anything but the homepage must pass its own `endpoint`. */
		surface?: 'homepage' | 'enneagram_test';
		/** POST target that accepts { slug, comment, fingerprint } and returns LiveTakePostResult. */
		endpoint?: string;
		/** Path reported to analytics. Set it when the page URL carries a private token. */
		sourcePath?: string;
		/** The small label above the question. */
		label?: string;
		/** The composer's label. */
		composeLabel?: string;
		onstart?: () => void;
		onpost?: (result: LiveTakePostResult) => void;
	};

	let {
		live,
		types = null,
		surface = 'homepage',
		endpoint,
		sourcePath,
		label = 'Open question',
		composeLabel = 'Your take',
		onstart,
		onpost
	}: Props = $props();

	// The homepage reports its own gate impression and practice events from the browser.
	// Other surfaces record gate_shown in their server load and get callbacks instead.
	let onHomepage = $derived(surface === 'homepage');

	// Blurred stand-ins for locked takes. Never real text: the gate decides who reads takes.
	const LOCKED_TEXT = [
		'xxxxxx xxx xxxxxxxx xxxx xx xxxxx',
		'xxxx xxxxxxx xx xxxxxx',
		'xxxxxxxxx, xxxxx, xxxxxxx xxxx',
		'xxx xxxxxx xxxx xxxxxxxx'
	];
	const REPLY_OPT_IN_DISMISSED_KEY = '9t-reply-opt-in-dismissed';

	let answer = $state('');
	let submittedAnswer = $state('');
	let error = $state('');
	let postError = $state('');
	let postState = $state<'idle' | 'posting' | 'posted'>('idle');
	let postResult = $state<LiveTakePostResult | null>(null);
	let replyOffer = $state<ReplyOptInOffer | null>(null);
	let replyOptInState = $state<'hidden' | 'shown' | 'dismissed' | 'subscribed'>('hidden');
	let composer = $state<HTMLTextAreaElement>();
	let unlockedHeading = $state<HTMLHeadingElement>();
	let started = false;
	let gateReported = false;

	// The server already passed the give-first gate for this visitor, so they start unlocked.
	let answeredBefore = $derived(Boolean(live?.answered));
	let posted = $derived(postState === 'posted' || answeredBefore);
	let alreadyAnswered = $derived(postResult ? postResult.alreadyAnswered : answeredBefore);
	let signedIn = $derived(Boolean(live?.signedIn));
	// The visitor's take as the server has it; never an unposted draft.
	let ownText = $derived(
		postResult
			? (postResult.ownTake?.text ?? (postResult.alreadyAnswered ? '' : submittedAnswer))
			: (live?.ownTake?.text ?? '')
	);
	let answers = $derived(postResult?.answers ?? live?.answers ?? []);
	let responses = $derived(postResult?.responses ?? live?.responses ?? 0);
	let liveHref = $derived(
		live ? resolve('/questions/[slug]', { slug: live.slug }) : resolve('/questions')
	);
	let newest = $derived(
		types?.newestAt
			? new Date(types.newestAt).toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					timeZone: 'America/New_York'
				})
			: null
	);
	let missing = $derived(types && types.answered.length > 0 ? missingTypes(types.answered) : []);
	let lockedRows = $derived(
		(types?.recent.length ? types.recent : [null, null, null])
			.slice(0, Math.min(LOCKED_TEXT.length, Math.max(responses, 0)))
			.map((type, index) => ({ key: index, type, text: LOCKED_TEXT[index] }))
	);
	let moreTakes = $derived(Math.max(0, responses - answers.length - (ownText ? 1 : 0)));

	function plural(count: number, one: string, many: string) {
		return `${count.toLocaleString('en-US')} ${count === 1 ? one : many}`;
	}

	function reportGateImpression() {
		if (!onHomepage || !live || posted || gateReported) return;
		gateReported = true;
		void fetch(resolve('/api/nine/impression'), {
			method: 'POST',
			keepalive: true,
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				questionUrl: live.slug,
				sourcePath: '/',
				fingerprint: getOrCreateVisitorId()
			})
		}).catch(() => {});
	}

	function handleInput() {
		error = '';
		postError = '';
		if (started || !answer.trim()) return;
		started = true;
		if (onHomepage) trackHomePractice('started', live?.slug);
		else onstart?.();
	}

	function replyOptInWasDismissed(): boolean {
		try {
			return sessionStorage.getItem(REPLY_OPT_IN_DISMISSED_KEY) === '1';
		} catch {
			return false;
		}
	}

	function offerReplyOptIn(take: LiveTake, result: LiveTakePostResult) {
		// Question page eligibility: an anonymous visitor's first take ever.
		const analytics = normalizeServerCommentAnalytics(result.commentAnalytics);
		if (
			result.alreadyAnswered ||
			!result.isAnonymous ||
			analytics.isFirstCommentEver !== true ||
			result.commentId === null ||
			replyOptInWasDismissed()
		) {
			return;
		}
		replyOffer = {
			fingerprint: getOrCreateVisitorId(),
			context: {
				questionId: take.questionId,
				questionUrl: take.slug,
				commentId: result.commentId,
				surface,
				isFirstCommentEver: true
			}
		};
		replyOptInState = 'shown';
	}

	async function submitTake(take: LiveTake): Promise<LiveTakePostResult | null> {
		// Bounded labels only: the answer text never goes to analytics.
		const context = {
			questionId: take.questionId,
			questionUrl: take.slug,
			commentKind: 'answer' as const,
			surface,
			sourcePath: sourcePath ?? window.location.pathname,
			isAnonymous: !take.signedIn
		};
		let failureStage: CommentFailureStage = 'request';
		let errorCategory: CommentFailureCategory = 'network_error';
		try {
			const response = await fetch(endpoint ?? resolve('/api/homepage/answer'), {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					slug: take.slug,
					comment: submittedAnswer,
					// Also sets the 9tfingerprint cookie the question page reads.
					fingerprint: getOrCreateVisitorId()
				})
			});
			const result = await response.json().catch(() => null);
			if (!response.ok) {
				errorCategory = 'http_error';
				throw new Error(typeof result?.error === 'string' ? result.error : '');
			}
			failureStage = 'response';
			errorCategory = 'invalid_response';
			if (result?.ok !== true || !Array.isArray(result.answers)) throw new Error('');

			const body = result as LiveTakePostResult;
			if (!body.alreadyAnswered) {
				void captureCommentCreated({
					...context,
					isAnonymous: body.isAnonymous,
					commentId: body.commentId,
					parentType: 'question',
					...normalizeServerCommentAnalytics(body.commentAnalytics)
				});
			}
			return body;
		} catch (failure) {
			void captureCommentFailed({ ...context, failureStage, errorCategory });
			postError =
				failure instanceof Error && failure.message
					? failure.message
					: 'We couldn’t post your take. It’s still here, so try again.';
			return null;
		}
	}

	async function postTake(event: SubmitEvent) {
		event.preventDefault();
		if (!live || postState === 'posting' || posted) return;
		if (answer.trim().length < 2) {
			error = 'Add a few words of your own first.';
			composer?.focus();
			return;
		}
		error = '';
		postError = '';
		submittedAnswer = answer.trim();
		reportGateImpression();
		if (onHomepage) trackHomePractice('live_post_clicked', live.slug);
		postState = 'posting';
		const result = await submitTake(live);
		if (!result) {
			postState = 'idle';
			return;
		}
		postResult = result;
		onpost?.(result);
		offerReplyOptIn(live, result);
		postState = 'posted';
		await tick();
		unlockedHeading?.focus({ preventScroll: true });
		unlockedHeading?.scrollIntoView({ block: 'center', behavior: 'instant' });
	}

	function focusComposer() {
		composer?.focus({ preventScroll: true });
		composer?.scrollIntoView({ block: 'center', behavior: 'instant' });
	}
</script>

{#snippet arrow()}<ArrowRight size={17} aria-hidden="true" />{/snippet}

{#if !live}
	<div class="live" id="answer">
		<div class="live-meta"><span class="pill-open">Open questions</span></div>
		<h3>Pick a question. Answer it before you read anyone else's.</h3>
		<a class="btn" href={resolve('/questions')} data-track="link" data-placement="live_fallback"
			>Browse open questions {@render arrow()}</a
		>
	</div>
{:else}
	<div class="live ph-no-capture" id="answer" {@attach qualifiedVisibility(reportGateImpression)}>
		<div class="live-meta">
			<span class="pill-open">{label}</span>
			{#if responses > 0}
				<span class="count"
					>{plural(responses, 'take', 'takes')}{newest ? ` · newest ${newest}` : ''}</span
				>
			{/if}
		</div>
		<h3 id="live-question">{live.title}</h3>

		{#if !posted}
			<form class="compose" onsubmit={postTake} novalidate>
				<label for="live-take">{composeLabel}</label>
				<textarea
					id="live-take"
					bind:this={composer}
					bind:value={answer}
					maxlength="600"
					rows="2"
					placeholder="A few honest words. Don't overthink it."
					aria-describedby={error || postError ? 'live-note live-error' : 'live-note'}
					aria-invalid={!!error || !!postError}
					disabled={postState === 'posting'}
					oninput={handleInput}></textarea>
				{#if error || postError}
					<p class="form-error" id="live-error" role="alert">{error || postError}</p>
				{/if}
				<div class="compose-row">
					<p class="note" id="live-note">
						{#if signedIn}
							<b>Public.</b> Posts from your account.
						{:else}
							<b>Anonymous.</b> No account needed.
						{/if}
						<a
							href={resolve('/posting-and-privacy#editing-and-removal')}
							target="_blank"
							rel="noopener noreferrer"
							data-track="link"
							data-placement="posting_guidance"
							>Editing &amp; removal<span class="sr-only"> (opens in a new tab)</span></a
						>
					</p>
					<button
						class="btn"
						type="submit"
						aria-describedby="live-note"
						disabled={postState === 'posting'}
					>
						{postState === 'posting'
							? 'Posting…'
							: responses > 0
								? `Post & see all ${responses.toLocaleString('en-US')}`
								: 'Post your take'}
						{@render arrow()}
					</button>
				</div>
			</form>

			{#if responses > 0}
				<div class="preview">
					<p class="preview-label">
						Each number is the type that person picked for themselves. A dash means they skipped it.
					</p>
					<div class="locked" aria-hidden="true">
						{#each lockedRows as row (row.key)}
							<div class="take-row">
								<span class={['chip', row.type === null && 'none']}>{row.type ?? '–'}</span>
								<p>{row.text}</p>
							</div>
						{/each}
					</div>
					{#if missing.length > 0}
						<p class="missing">
							No {listTypes(missing)} has answered yet.
							<button type="button" class="link-button" onclick={focusComposer}
								>Be the first.</button
							>
						</p>
					{/if}
					<p class="lock-count">
						<b>{plural(responses, 'take', 'takes')}</b>
						{responses === 1 ? 'unlocks' : 'unlock'} when you post yours.
					</p>
				</div>
			{/if}
		{:else}
			<div class="unlocked">
				<p class="kicker">
					<Check size={14} aria-hidden="true" />
					{alreadyAnswered ? 'You answered this one' : signedIn ? 'Posted' : 'Posted anonymously'}
				</p>
				<h4 tabindex="-1" bind:this={unlockedHeading}>You’re in. Here’s how others answered.</h4>
				{#if ownText}
					<div class="take-row own">
						<span class="chip you">You</span>
						<p>{ownText}</p>
					</div>
				{/if}
				{#if replyOffer && replyOptInState !== 'dismissed'}
					<ReplyOptInTray
						offer={replyOffer}
						action={`${liveHref}?/subscribeToCommentReplies`}
						lead="DJ reads every take and replies."
						onstatechange={(state) => (replyOptInState = state)}
					/>
				{:else if postResult && !postResult.alreadyAnswered}
					<p class="host-note">
						{signedIn
							? 'DJ reads every take and replies. You’ll hear back.'
							: 'DJ reads every take.'}
					</p>
				{/if}
				{#each answers as other (other.id)}
					<div class="take-row">
						<span class={['chip', other.type === null && 'none']}
							><span class="sr-only">Type </span>{other.type ?? '–'}</span
						>
						<p>{other.text}</p>
					</div>
				{:else}
					<p class="host-note">
						{responses > 1
							? 'Read everyone’s takes in the full conversation.'
							: 'You’re the first take. Yours will be waiting for the next person who writes theirs.'}
					</p>
				{/each}
				{#if moreTakes > 0}
					<p class="lock-count">
						<b>{plural(moreTakes, 'more take', 'more takes')}</b> in the full conversation.
					</p>
				{/if}
				<a
					class="btn"
					href={resolve('/questions/[slug]', { slug: live.slug })}
					data-track="handoff"
					data-placement="live_posted">Open the full conversation {@render arrow()}</a
				>
			</div>
		{/if}
	</div>
{/if}

<style>
	.live {
		--live-title: clamp(28px, 2.8vw, 36px);
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-width: 0;
		padding: 26px;
		border: 1px solid color-mix(in srgb, var(--highlight) 24%, transparent);
		border-radius: 16px;
		background: var(--surface);
		box-shadow: 0 30px 80px color-mix(in srgb, var(--accent) 20%, transparent);
		scroll-margin-top: 96px;
	}
	.live-meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.pill-open {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		color: var(--highlight);
	}
	.pill-open::before {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--highlight);
	}
	h3 {
		margin: 0;
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 500;
		font-size: var(--live-title);
		line-height: 1.15;
		color: var(--text);
		text-wrap: balance;
	}
	p {
		margin: 0;
	}

	.compose {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.compose label {
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--highlight);
	}
	textarea {
		width: 100%;
		min-height: 60px;
		padding: 14px;
		resize: vertical;
		border: 1px solid var(--accent);
		border-radius: 10px;
		background: var(--bg);
		color: var(--text);
		font: 16px/1.5 var(--font-talk);
	}
	textarea::placeholder {
		color: var(--text-faint);
	}
	textarea:focus {
		outline: none;
		border-color: var(--highlight);
		box-shadow: 0 0 0 1px var(--highlight);
	}
	.form-error {
		font-size: var(--font-size-sm);
		color: var(--text);
	}
	.form-error::before {
		content: '! ';
		color: var(--highlight);
		font-weight: 700;
	}
	.compose-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 14px;
	}
	.note {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 10px;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.note b {
		font-weight: 600;
		color: var(--text);
	}
	a:not(.btn),
	.link-button {
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		min-height: 48px;
		padding: 13px 22px;
		border: 0;
		border-radius: 999px;
		background: var(--action);
		color: var(--text-on-action);
		font: 700 14px/1 var(--font-talk);
		letter-spacing: 0.02em;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}
	.btn:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 10px 28px color-mix(in srgb, var(--action) 22%, transparent);
	}
	.btn:disabled {
		cursor: progress;
		opacity: 0.75;
	}
	.live > .btn,
	.unlocked > .btn {
		align-self: flex-start;
	}

	.preview,
	.unlocked {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 16px;
		border-top: 1px solid var(--rule);
	}
	.unlocked {
		border-top: 0;
		padding-top: 0;
	}
	.preview-label {
		margin-bottom: 2px;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.take-row {
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		align-items: center;
		gap: 12px;
		padding: 9px 14px;
		border-radius: 10px;
		background: color-mix(in srgb, var(--highlight) 5%, transparent);
	}
	.take-row p {
		font-size: var(--font-size-base);
		line-height: 1.4;
		color: var(--text);
		overflow-wrap: anywhere;
	}
	.take-row.own {
		background: color-mix(in srgb, var(--highlight) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--highlight) 24%, transparent);
	}
	.chip {
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
	.chip.none {
		background: transparent;
		border: 1px dashed color-mix(in srgb, var(--highlight) 35%, transparent);
		color: var(--text-faint);
		font-family: var(--font-talk);
		font-style: normal;
		font-size: var(--font-size-sm);
	}
	.chip.you {
		background: var(--highlight);
		color: var(--bg);
		font-family: var(--font-talk);
		font-style: normal;
		font-size: var(--font-size-xs);
		font-weight: 700;
	}
	.locked {
		display: flex;
		flex-direction: column;
		gap: 8px;
		mask-image: linear-gradient(black 45%, transparent);
	}
	.locked .take-row p {
		filter: blur(4px);
		user-select: none;
		color: var(--highlight);
	}
	.missing {
		padding: 4px 2px 2px;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.link-button {
		min-height: 44px;
		padding: 0 2px;
		border: 0;
		background: none;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}
	.lock-count {
		font-size: var(--font-size-base);
		text-align: center;
		color: var(--text-muted);
	}
	.lock-count b {
		font-weight: 600;
		color: var(--text);
	}

	.kicker {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--highlight);
	}
	h4 {
		margin: 0 0 6px;
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--text);
	}
	h4:focus {
		outline: none;
	}
	.host-note {
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}

	@media (max-width: 520px) {
		.live {
			padding: 18px;
		}
		.compose-row .btn {
			width: 100%;
		}
	}
</style>

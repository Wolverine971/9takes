<!-- src/lib/components/marketing/HomeLandingV2.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { resolve } from '$app/paths';
	import { ArrowRight, Check, ChevronDown, LockKeyhole, RotateCcw } from '@lucide/svelte';
	import { Button } from '$lib/components/atoms';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ThemeToggle from '$lib/components/atoms/ThemeToggle.svelte';
	import { faqs, practiceQuestions } from '$lib/data/homepagePracticeV2';
	import {
		LIVE_TAKE_ANSWER_FAQ,
		type LiveTake,
		type LiveTakePostResult
	} from '$lib/data/homepageLiveTake';
	import {
		captureHomepageLinkClicked,
		captureHomepagePractice,
		type HomepagePracticeStep
	} from '$lib/analytics/marketingEvents';
	import {
		captureCommentCreated,
		captureCommentFailed,
		normalizeServerCommentAnalytics,
		type CommentFailureCategory,
		type CommentFailureStage
	} from '$lib/analytics/commentEvents';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import type { CommunityProof } from '$lib/data/homepageCommunity';
	import ReplyOptInTray, {
		type ReplyOptInOffer
	} from '$lib/components/questions/ReplyOptInTray.svelte';
	import ConversationScenes from './ConversationScenes.svelte';

	type PreviewNav = {
		badge: string;
		title: string;
		compareHref: '/' | '/design-preview/harry-dry';
		compareLabel: string;
	};

	let {
		preview = false,
		previewNav = {
			badge: 'V2',
			title: 'Harry Dry V2 — 1 question. 9 perspectives. | 9takes',
			compareHref: '/design-preview/harry-dry',
			compareLabel: 'Compare V1'
		},
		live = null
	}: { preview?: boolean; previewNav?: PreviewNav; live?: LiveTake | null } = $props();

	let proof = $state<CommunityProof | null>(null);
	onMount(() => {
		const controller = new AbortController();
		async function loadProof() {
			try {
				const response = await fetch(resolve('/api/homepage/community'), {
					signal: controller.signal
				});
				if (response.ok && !controller.signal.aborted) proof = await response.json();
			} catch {
				// Public activity is optional; keep the private exercise available.
			}
		}
		void loadProof();
		return () => controller.abort();
	});

	// Funnel analytics: ids, slugs and placements only — never the visitor's answer text.
	let surface = $derived(preview ? 'homepage_preview' : 'homepage');
	let root = $state<HTMLDivElement>();
	let startedQuestionId = '';

	function trackPractice(step: HomepagePracticeStep, placement?: string) {
		void captureHomepagePractice({
			surface,
			step,
			practiceId: question.id,
			liveSlug: question.liveSlug,
			placement
		});
	}

	function trackAnswerStarted() {
		error = '';
		if (startedQuestionId === question.id) return;
		startedQuestionId = question.id;
		trackPractice('started');
	}

	$effect(() => {
		const element = root;
		if (!element) return;
		function handleTrackedClick(event: MouseEvent) {
			const target = (event.target as Element | null)?.closest<HTMLElement>('[data-track]');
			if (!target) return;
			const placement = target.dataset.placement ?? 'unknown';
			if (target.dataset.track === 'handoff') trackPractice('handoff_clicked', placement);
			else if (target.dataset.track === 'link')
				void captureHomepageLinkClicked({
					surface,
					placement,
					destination: target.getAttribute('href') ?? ''
				});
		}
		element.addEventListener('click', handleTrackedClick);
		return () => element.removeEventListener('click', handleTrackedClick);
	});
	// Four published analyses from the most-read personality pages (Sept 2026), one per type.
	const featuredPeople = [
		{
			slug: 'jack-black',
			name: 'Jack Black',
			type: 7,
			hook: 'Why he acts so crazy',
			image: '/types/7s/s-Jack-Black.webp'
		},
		{
			slug: 'dario-amodei',
			name: 'Dario Amodei',
			type: 5,
			hook: 'Why he can’t stop building the thing he fears most',
			image: '/types/5s/s-Dario-Amodei.webp'
		},
		{
			slug: 'alex-karp',
			name: 'Alex Karp',
			type: 4,
			hook: 'Why he can’t sit still or fit Silicon Valley',
			image: '/types/4s/s-Alex-Karp.webp'
		},
		{
			slug: 'sydney-sweeney',
			name: 'Sydney Sweeney',
			type: 3,
			hook: 'What her interviews reveal',
			image: '/types/3s/s-Sydney-Sweeney.webp'
		}
	];
	const description =
		'A question-and-answer community for seeing why people react differently. Try a private question, compare 9 perspectives, then join a real conversation.';

	let questionIndex = $state(0);
	let answer = $state('');
	let submittedAnswer = $state('');
	let revealed = $state(false);
	let selectedType = $state(2);
	let error = $state('');
	let composer = $state<HTMLTextAreaElement>();
	let revealHeading = $state<HTMLHeadingElement>();
	let question = $derived(practiceQuestions[questionIndex]);
	let selected = $derived(question.perspectives.find((item) => item.id === selectedType)!);
	let contrasting = $derived(question.perspectives.find((item) => item.id === selected.contrast)!);
	let answerLength = $derived(answer.trim().length);
	let nextQuestionLabel = $derived(
		question.id === 'friendship' ? 'Try the dinner question' : 'Try friendship again'
	);

	// Live-take mode: the hero question is a real live question and the visitor can opt in to
	// post the answer they already wrote (POST /api/homepage/answer). The design preview
	// simulates the post instead and saves nothing.
	let isLive = $derived(live !== null && question.liveSlug === live.slug);
	let cardTitle = $derived(isLive && live ? live.title : question.question);
	let liveHref = $derived(
		live ? resolve('/questions/[slug]', { slug: live.slug }) : resolve('/questions')
	);
	let postState = $state<'idle' | 'posting' | 'posted' | 'private'>('idle');
	let postError = $state('');
	let postResult = $state<LiveTakePostResult | null>(null);
	// The server already passed the give-first gate for this visitor, so they start unlocked.
	let answeredBefore = $derived(isLive && Boolean(live?.answered));
	let posted = $derived(postState === 'posted' || answeredBefore);
	let showReveal = $derived(revealed || answeredBefore);
	let alreadyAnswered = $derived(
		postResult ? postResult.alreadyAnswered : answeredBefore && postState !== 'posted'
	);
	// What the visitor's take actually says on the live question. Before a post (and in the
	// preview) that is the draft; after one it is the server's copy, never an unposted draft.
	let shownAnswer = $derived(
		postResult
			? (postResult.ownTake?.text ?? (postResult.alreadyAnswered ? '' : submittedAnswer))
			: answeredBefore
				? (live?.ownTake?.text ?? '')
				: submittedAnswer
	);
	let otherAnswers = $derived(postResult?.answers ?? live?.answers ?? []);
	let liveResponses = $derived(postResult?.responses ?? live?.responses ?? 0);
	let signedIn = $derived(Boolean(live?.signedIn));
	let postedLabel = $derived(signedIn ? 'POSTED' : 'POSTED ANONYMOUSLY');
	let postedHeading = $state<HTMLHeadingElement>();
	let faqItems = $derived(
		isLive
			? faqs.map((faq) =>
					faq.question === 'What happens to my answer here?'
						? { ...faq, answer: LIVE_TAKE_ANSWER_FAQ }
						: faq
				)
			: faqs
	);

	// Reply opt-in after a real post: the same tray, rules and endpoint as the question page.
	const REPLY_OPT_IN_DISMISSED_KEY = '9t-reply-opt-in-dismissed';
	let replyOffer = $state<ReplyOptInOffer | null>(null);
	let replyOptInState = $state<'hidden' | 'shown' | 'dismissed' | 'subscribed'>('hidden');

	function plural(count: number, one: string, many: string) {
		return `${count} ${count === 1 ? one : many}`;
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
				surface: 'homepage',
				isFirstCommentEver: true
			}
		};
		replyOptInState = 'shown';
	}

	async function submitLiveTake(take: LiveTake): Promise<LiveTakePostResult | null> {
		// Bounded labels only: the answer text never goes to analytics.
		const context = {
			questionId: take.questionId,
			questionUrl: take.slug,
			commentKind: 'answer' as const,
			surface: 'homepage' as const,
			sourcePath: window.location.pathname,
			isAnonymous: !take.signedIn
		};
		let failureStage: CommentFailureStage = 'request';
		let errorCategory: CommentFailureCategory = 'network_error';
		try {
			const response = await fetch(resolve('/api/homepage/answer'), {
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
					: 'We couldn’t post your answer. It’s still here, so try again.';
			return null;
		}
	}

	async function postAnswer() {
		if (!live || postState === 'posting' || posted) return;
		const stateBefore = postState;
		trackPractice('live_post_clicked');
		postState = 'posting';
		postError = '';
		if (preview) {
			// Design preview: stands in for the anonymous post + give-first unlock. Nothing is saved.
			await new Promise((done) => setTimeout(done, 650));
		} else {
			const result = await submitLiveTake(live);
			if (!result) {
				postState = stateBefore;
				return;
			}
			postResult = result;
			offerReplyOptIn(live, result);
		}
		postState = 'posted';
		await tick();
		postedHeading?.focus({ preventScroll: true });
		postedHeading?.scrollIntoView({ block: 'center', behavior: 'instant' });
	}

	function keepPrivate() {
		trackPractice('live_kept_private');
		postState = 'private';
	}

	async function goToOptIn() {
		await tick();
		document.getElementById('live-optin')?.scrollIntoView({ block: 'center', behavior: 'instant' });
	}

	async function revealPerspectives(event: SubmitEvent) {
		event.preventDefault();
		if (answerLength < 2) {
			error = 'Add a few words of your own first.';
			composer?.focus();
			return;
		}
		error = '';
		submittedAnswer = answer.trim();
		revealed = true;
		trackPractice('revealed');
		await tick();
		revealHeading?.focus({ preventScroll: true });
		revealHeading?.scrollIntoView({ block: 'start', behavior: 'instant' });
	}

	async function focusAnswer() {
		composer?.focus({ preventScroll: true });
		composer?.scrollIntoView({ block: 'center', behavior: 'instant' });
	}

	async function editAnswer() {
		revealed = false;
		await tick();
		await focusAnswer();
	}

	async function tryAnother() {
		trackPractice('next_question');
		questionIndex = (questionIndex + 1) % practiceQuestions.length;
		answer = '';
		submittedAnswer = '';
		error = '';
		selectedType = 2;
		revealed = false;
		await tick();
		await focusAnswer();
	}
</script>

<SEOHead
	title={preview ? previewNav.title : '1 Question, 9 Perspectives | 9takes'}
	{description}
	canonical="https://9takes.com"
	noindex={preview}
	nofollow={preview}
	twitterImageAlt="Nine people gathered in conversation beneath a streetlamp"
	jsonLd={preview
		? null
		: {
				'@context': 'https://schema.org',
				'@type': 'WebPage',
				'@id': 'https://9takes.com/#webpage',
				url: 'https://9takes.com',
				name: '1 Question, 9 Perspectives | 9takes',
				description,
				inLanguage: 'en-US',
				isPartOf: { '@id': 'https://9takes.com/#website' }
			}}
/>

{#snippet liveOptIn(take: LiveTake)}
	<div class="live-optin ph-no-capture" id="live-optin">
		{#if posted}
			<p class="mono kicker posted-kicker">
				<Check size={14} aria-hidden="true" />
				{alreadyAnswered ? 'YOU ANSWERED THIS ONE' : postedLabel}
			</p>
			<h3 tabindex="-1" bind:this={postedHeading}>You’re in. Here’s how others answered.</h3>
			<div class="live-takes">
				{#if shownAnswer}
					<article class="live-take own-take">
						<p class="mono">{alreadyAnswered ? 'YOUR TAKE' : 'YOUR TAKE · JUST NOW'}</p>
						<p>{shownAnswer}</p>
					</article>
				{/if}
				{#if replyOffer && replyOptInState !== 'dismissed'}
					<div class="live-take-note">
						<ReplyOptInTray
							offer={replyOffer}
							action={`${liveHref}?/subscribeToCommentReplies`}
							lead="DJ reads every take and replies."
							onstatechange={(state) => (replyOptInState = state)}
						/>
					</div>
				{:else if postResult && !postResult.alreadyAnswered}
					<p class="live-take-note host-promise">
						{signedIn
							? 'DJ reads every take and replies. You’ll hear back.'
							: 'DJ reads every take.'}
					</p>
				{/if}
				{#if otherAnswers.length > 0}
					{#each otherAnswers as other (other.id)}
						<article class="live-take">
							<p class="mono">{other.type ? `ENNEAGRAM ${other.type}` : 'ANONYMOUS'}</p>
							<p>{other.text}</p>
						</article>
					{/each}
				{:else if preview}
					{#each [1, 2, 3] as placeholder (placeholder)}
						<div class="live-take locked" aria-hidden="true">
							<span></span><span></span><span></span>
						</div>
					{/each}
					<p class="preview-note">
						Preview: real answers appear here after a real post. Sign in as an admin to preview
						them.
					</p>
				{:else}
					<p class="live-take-note live-empty">
						{liveResponses > 1
							? 'Read everyone’s answers in the full conversation.'
							: 'You’re the first answer. Yours will be waiting for the next person who writes theirs.'}
					</p>
				{/if}
			</div>
			<Button size="lg" data-track="handoff" data-placement="live_posted" href={liveHref}
				>Open the full conversation <ArrowRight size={18} aria-hidden="true" /></Button
			>
		{:else if postState === 'private'}
			<h3>Kept private.</h3>
			<p>
				Your answer stays in this tab. You can still add it to the conversation before you leave.
			</p>
			{#if postError}<p class="form-error" role="alert">{postError}</p>{/if}
			<div class="next-actions">
				<Button onclick={postAnswer}>{signedIn ? 'Post it' : 'Post it anonymously'}</Button>
				<Button
					variant="secondary"
					data-track="link"
					data-placement="live_private"
					href={resolve('/questions')}>Browse other questions</Button
				>
			</div>
		{:else}
			<p class="mono kicker">THE REAL CONVERSATION</p>
			<h3>
				{take.responses > 0
					? `${plural(take.responses, 'response from a real person is', 'responses from real people are')} waiting.`
					: 'Be the first real answer.'}
			</h3>
			<p>
				{signedIn
					? 'Post your answer to read theirs. It goes up exactly as you wrote it, from your account.'
					: 'Post your answer anonymously to read theirs. It goes up exactly as you wrote it.'}
			</p>
			<blockquote>{submittedAnswer}</blockquote>
			{#if postError}<p class="form-error" role="alert">{postError}</p>{/if}
			<div class="next-actions">
				<Button size="lg" loading={postState === 'posting'} onclick={postAnswer}
					>{signedIn ? 'Post and read them' : 'Post anonymously and read them'}
					<ArrowRight size={18} aria-hidden="true" /></Button
				>
				<Button variant="ghost" disabled={postState === 'posting'} onclick={keepPrivate}
					>Keep it private</Button
				>
			</div>
			<p class="optin-fine">
				{signedIn
					? 'Posts from your account. One answer per question here.'
					: 'No name or account attached. One answer per question.'}{#if preview}{' '}Preview:
					posting is simulated and nothing is saved.{/if}
			</p>
		{/if}
	</div>
{/snippet}

{#snippet communityFallback()}
	<div class="community-fallback">
		<h3>Your next perspective starts with a question.</h3>
		<p>Explore the live questions and add your own answer.</p>
		<a class="text-link" href={resolve('/questions')}
			>Browse questions <ArrowRight size={16} aria-hidden="true" /></a
		>
	</div>
{/snippet}

<div class="dry-home" bind:this={root}>
	{#if preview}
		<header class="home-nav shell">
			<a class="home-brand" href={resolve('/')} aria-label="9takes home"
				>9takes<span>{previewNav.badge}</span></a
			>
			<nav aria-label="Version comparison">
				<a href={resolve(previewNav.compareHref)}
					>{previewNav.compareLabel} <ArrowRight size={13} aria-hidden="true" /></a
				>
				<ThemeToggle />
			</nav>
		</header>
	{/if}

	<section class="hero shell" aria-labelledby="hero-title">
		<div class="hero-intro">
			<h1 id="hero-title">1 question.<br /><span>9 perspectives.</span></h1>
			<p class="hero-benefit">
				A question-and-answer community for understanding why someone else’s reaction makes sense to
				them.
			</p>
		</div>

		<div class="hero-action">
			<div class="question-panel ph-no-capture" id="try-a-question">
				<div class="panel-topline">
					<span class="mono">{isLive ? 'LIVE QUESTION' : 'YOUR FIRST REACTION'}</span>
					{#if isLive && liveResponses > 0}
						<span class="live-count"
							><span class="signal-dot" aria-hidden="true"></span>{plural(
								liveResponses,
								'response',
								'responses'
							)} so far</span
						>
					{/if}
				</div>
				{#if !showReveal}
					<form onsubmit={revealPerspectives}>
						<h2 id="practice-question">{cardTitle}</h2>
						<p class="answer-reason" id="answer-reason">
							Write yours first, before another take shapes it.
						</p>
						<textarea
							id="practice-answer"
							bind:this={composer}
							bind:value={answer}
							maxlength="600"
							rows="3"
							aria-labelledby="practice-question"
							aria-describedby={error
								? 'answer-reason practice-note practice-error'
								: 'answer-reason practice-note'}
							aria-invalid={!!error}
							placeholder={question.hint}
							oninput={trackAnswerStarted}></textarea>
						{#if error}<p class="form-error" id="practice-error" role="alert">{error}</p>{/if}
						<Button type="submit" size="lg" fullWidth class="reveal-button"
							>Reveal 9 perspectives <ArrowRight size={17} aria-hidden="true" /></Button
						>
						<p class="practice-note" id="practice-note">
							<LockKeyhole size={13} aria-hidden="true" />
							<span
								>{isLive
									? 'Nothing is posted unless you choose to. No account needed. First, compare 9 AI-written examples.'
									: 'Nothing is posted. No account needed. You’ll compare 9 AI-written examples.'}</span
							>
						</p>
					</form>
				{:else}
					<div class="answer-receipt">
						<div class="receipt-icon"><Check size={23} aria-hidden="true" /></div>
						<h2>
							{alreadyAnswered ? 'You already answered this one.' : 'Your first take is yours.'}
						</h2>
						<p class="receipt-question">{cardTitle}</p>
						{#if shownAnswer}<blockquote>{shownAnswer}</blockquote>{/if}
						<p class="privacy">
							{posted
								? signedIn
									? 'Posted to the live conversation.'
									: 'Posted anonymously to the live conversation.'
								: isLive
									? 'Still private until you choose to post it.'
									: 'Still private. Saved only until this page refreshes.'}
						</p>
						{#if isLive && !posted}
							<Button onclick={goToOptIn}>Post it to the conversation</Button>
						{:else if !posted}
							<Button variant="secondary" onclick={editAnswer}>Edit my answer</Button>
						{/if}
					</div>
				{/if}
			</div>
			<div class="community-signal-slot">
				{#if proof && proof.totalResponses > 0 && proof.totalQuestions > 0}
					<a class="community-signal" href="#community"
						><span class="signal-dot" aria-hidden="true"></span><span
							><strong>{proof.totalResponses.toLocaleString('en-US')}</strong> responses across
							<strong>{proof.totalQuestions.toLocaleString('en-US')}</strong>
							questions <ArrowRight size={13} aria-hidden="true" /></span
						></a
					>
				{/if}
			</div>
		</div>

		<div class="hero-visual">
			<figure
				class="perspective-visual"
				aria-label="How are you? I’m fine. Two possible meanings and the thoughts behind them."
			>
				<figcaption>Same words. Different perspectives.</figcaption>
				<div class="perspective-sketch">
					<div class="spoken-exchange">
						<p class="asked-words">“How are you?”</p>
						<p class="spoken-words"><strong>“I’m fine.”</strong></p>
					</div>
					<p class="could-mean">Could mean</p>
					<svg
						class="perspective-paths"
						viewBox="0 0 480 28"
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<path d="M240 0V5C240 19 120 5 120 24M240 5C240 19 360 5 360 24" />
						<circle cx="120" cy="24" r="2.5" />
						<circle cx="360" cy="24" r="2.5" />
					</svg>
					<div class="possible-meanings">
						<div class="meaning-path" role="group" aria-labelledby="space-meaning">
							<p class="meaning-title" id="space-meaning">“Give me space.”</p>
							<ul class="thought-cloud" aria-label="Possible thoughts behind wanting space">
								<li>I’m not talking to you.</li>
								<li>I’m not comfortable opening up to you.</li>
								<li>Why would you even ask?</li>
								<li class="thought-emphasis">Fuck off.</li>
							</ul>
						</div>
						<div class="meaning-path" role="group" aria-labelledby="notice-meaning">
							<p class="meaning-title" id="notice-meaning">“Please notice I’m not.”</p>
							<ul class="thought-cloud" aria-label="Possible thoughts behind wanting help">
								<li>I’m actually terrible.</li>
								<li>There’s too much to explain.</li>
								<li>Do you really want to know?</li>
								<li class="thought-emphasis">Please help me.</li>
							</ul>
						</div>
					</div>
					<p class="thought-note">You won’t know until you ask.</p>
				</div>
			</figure>
		</div>
	</section>

	{#if showReveal}
		<section class="reveal-section section shell" aria-labelledby="reveal-title">
			<div class="section-heading">
				<h2 id="reveal-title" tabindex="-1" bind:this={revealHeading}>{question.revealTitle}</h2>
				<p>
					Everyone sees the same 9 AI-written examples. Which feels familiar, and which is
					different?
				</p>
			</div>
			<div class="starting-point ph-no-capture">
				<div>
					<p class="mono">
						{posted ? `YOUR TAKE · ${postedLabel}` : 'YOUR STARTING POINT · STILL PRIVATE'}
					</p>
					{#if shownAnswer}<blockquote>{shownAnswer}</blockquote>{/if}
				</div>
				{#if !posted}
					<Button variant="ghost" size="sm" onclick={editAnswer}>Edit answer</Button>
				{/if}
			</div>
			<p class="picker-instruction">
				Choose a priority to compare. The numbers refer to Enneagram types.
			</p>
			<label class="mobile-picker" for="mobile-perspective">
				<span>Compare a priority</span>
				<span class="mobile-select">
					<select id="mobile-perspective" bind:value={selectedType}>
						{#each question.perspectives as perspective (perspective.id)}
							<option value={perspective.id}>{perspective.id} · {perspective.priority}</option>
						{/each}
					</select>
					<ChevronDown size={18} aria-hidden="true" />
				</span>
			</label>
			<div class="perspective-picker" role="group" aria-label="Choose a perspective to compare">
				{#each question.perspectives as perspective (perspective.id)}
					<button
						class:chosen={selectedType === perspective.id}
						aria-pressed={selectedType === perspective.id}
						onclick={() => (selectedType = perspective.id)}
						><span class="type-number">{String(perspective.id).padStart(2, '0')}</span
						>{perspective.priority}</button
					>
				{/each}
			</div>
			<div class="comparison" aria-live="polite" aria-atomic="true">
				<article class="perspective-card selected-card">
					<p class="perspective-eyebrow">
						<span class="type-number">{String(selected.id).padStart(2, '0')}</span>
						{selected.priority}
					</p>
					<blockquote>“{selected.take}”</blockquote>
					<div class="underneath">
						<p class="mono">WHAT COULD BE UNDERNEATH</p>
						<p>{selected.underneath}</p>
					</div>
					<p class="example-label">AI-written example · Enneagram {selected.id}</p>
				</article>
				<article class="perspective-card contrast-card">
					<p class="perspective-eyebrow">
						<span class="type-number">{String(contrasting.id).padStart(2, '0')}</span> Another
						priority: {contrasting.priority.toLowerCase()}
					</p>
					<blockquote>“{contrasting.take}”</blockquote>
					<div class="underneath">
						<p class="mono">WHAT COULD BE UNDERNEATH</p>
						<p>{contrasting.underneath}</p>
					</div>
					<p class="example-label">AI-written example · Enneagram {contrasting.id}</p>
				</article>
			</div>
			<div class="reflection">
				<span class="reflection-mark" aria-hidden="true">↳</span>
				<p>
					What would you ask someone who values {contrasting.priority.toLowerCase()} before assuming they
					want the same thing you do?
				</p>
			</div>
			<p class="type-note">
				These examples explore motivations. They do not determine your type, and a priority can
				belong to more than one type.
			</p>
			{#if isLive && live}
				{@render liveOptIn(live)}
			{:else}
				<div class="next-experience">
					<div>
						<h3>Take that curiosity into a conversation.</h3>
						<p>
							Bring your own take to a live question. Answer first, then read and reply to other
							people.
						</p>
						<p class="handoff-note">Your practice answer won’t be carried over.</p>
					</div>
					<div class="next-actions">
						<Button
							data-track="handoff"
							data-placement="reveal"
							href={question.liveSlug
								? resolve('/questions/[slug]', { slug: question.liveSlug })
								: resolve('/questions')}
							>{question.liveSlug
								? 'Join the friendship conversation'
								: 'Find a live question'}<ArrowRight size={15} aria-hidden="true" /></Button
						>
						<Button variant="secondary" onclick={tryAnother}
							><RotateCcw size={16} aria-hidden="true" />{nextQuestionLabel}</Button
						>
					</div>
				</div>
			{/if}
		</section>
	{/if}

	<section class="ritual-band" aria-labelledby="ritual-title">
		<div class="shell">
			<h2 id="ritual-title">Answer before the crowd.</h2>
			<ol class="ritual-steps">
				<li>
					<span class="step-number">01</span>
					<h3>Your own reaction.</h3>
					<p>Answer before you see anyone else’s.</p>
				</li>
				<li>
					<span class="step-number">02</span>
					<h3>Get a different perspective.</h3>
					<p>Then compare it with how other people read the same moment.</p>
				</li>
				<li>
					<span class="step-number">03</span>
					<h3>Ask a better question.</h3>
					<p>Stop guessing what someone meant. Ask what mattered to them.</p>
				</li>
			</ol>
		</div>
	</section>

	<section class="live-section section shell" id="community" aria-labelledby="live-title">
		<div class="section-intro">
			<p class="mono kicker">IN THE COMMUNITY</p>
			<h2 id="live-title">Real questions. Your own words.</h2>
			<p>Pick one that gets you thinking. You answer first, then see everyone else’s take.</p>
		</div>
		{#if proof && proof.questions.length > 0}
			<div class="live-questions">
				{#each proof.questions as thread (thread.slug)}
					<a
						class="live-question"
						data-track="link"
						data-placement="live_questions"
						href={resolve('/questions/[slug]', { slug: thread.slug })}
					>
						<span class="response-count"
							>{thread.responses > 0
								? `${thread.responses} ${thread.responses === 1 ? 'response' : 'responses'}`
								: 'Be the first to answer'}</span
						>
						<h3>{thread.title}</h3>
						<span class="thread-action"
							>Add your perspective <ArrowRight size={16} aria-hidden="true" /></span
						>
					</a>
				{/each}
			</div>
			<a
				class="text-link"
				data-track="link"
				data-placement="live_questions"
				href={resolve('/questions')}
				>Browse all questions <ArrowRight size={16} aria-hidden="true" /></a
			>
		{:else}
			{@render communityFallback()}
		{/if}
	</section>

	<section class="why-section section shell" aria-labelledby="why-title">
		<ConversationScenes />
		<div class="why-copy">
			<h2 id="why-title">Nine ways to see<br />the same moment.</h2>
			<div>
				<p>
					On 9takes, people bring their own answers to questions about friendship, work, and the
					things they don’t always say out loud.
				</p>
				<p>
					The Enneagram’s 9 patterns of motivation give you another way to explore the difference.
					You don’t need to know your type to begin.
				</p>
			</div>
		</div>
	</section>

	<section class="reading-section section shell" aria-labelledby="reading-title">
		<div class="reading-heading">
			<h2 id="reading-title">People are more interesting<br />than their labels.</h2>
			<p>Read the thinking behind 9takes.<br />Then try it on a situation you know.</p>
		</div>
		<ul class="people-row">
			{#each featuredPeople as person (person.slug)}
				<li>
					<a
						data-track="link"
						data-placement="people_row"
						href={resolve('/personality-analysis/[slug]', { slug: person.slug })}
					>
						<img src={person.image} alt="" width="1080" height="1080" loading="lazy" />
						<span class="mono person-type">ENNEAGRAM {person.type}</span>
						<h3>{person.name}</h3>
						<p>{person.hook}</p>
					</a>
				</li>
			{/each}
		</ul>
		<a
			class="text-link"
			data-track="link"
			data-placement="people_row"
			href={resolve('/personality-analysis')}
			>Explore all personality analyses <ArrowRight size={16} aria-hidden="true" /></a
		>
		<div class="reading-links">
			<a data-track="link" data-placement="reading_links" href={resolve('/enneagram-corner')}
				><span class="mono">NEW TO THE ENNEAGRAM</span>
				<h3>Learn the 9 patterns behind every take.</h3>
				<span>Visit Enneagram Corner <ArrowRight size={16} aria-hidden="true" /></span></a
			>
			<a data-track="link" data-placement="reading_links" href={resolve('/how-to-guides')}
				><span class="mono">SITUATIONS YOU RECOGNIZE</span>
				<h3>Put a different perspective to work in your own life.</h3>
				<span>Read practical guides <ArrowRight size={16} aria-hidden="true" /></span></a
			>
			<a data-track="link" data-placement="reading_links" href={resolve('/book-session')}
				><span class="mono">SOMETHING MORE PERSONAL</span>
				<h3>Bring a real situation you’re trying to understand.</h3>
				<span>Talk to DJ <ArrowRight size={16} aria-hidden="true" /></span></a
			>
		</div>
	</section>

	<section class="faq-band" aria-labelledby="faq-title">
		<div class="faq-section section shell">
			<h2 id="faq-title">Before you jump in.</h2>
			<div class="faqs">
				{#each faqItems as faq (faq.question)}<details>
						<summary>{faq.question}<ChevronDown size={18} aria-hidden="true" /></summary>
						<p>{faq.answer}</p>
					</details>{/each}
			</div>
		</div>
	</section>

	<section class="founder-section section shell" aria-labelledby="founder-title">
		<img
			class="founder-photo"
			src="/brand/djface.webp"
			alt="DJ Wayne, founder of 9takes"
			width="1080"
			height="1080"
			loading="lazy"
		/>
		<div class="founder-story">
			<h2 id="founder-title">The same situation.<br />Two different emergencies.</h2>
			<blockquote>
				“I wanted her to trust my judgment. She wanted me to slow down enough to address her
				worries.”
			</blockquote>
			<p>
				Early in my marriage, I tried to push through my wife’s fear. The harder I pushed, the less
				safe she felt. The Enneagram gave us language for what each of us was trying to protect.
			</p>
			<p>I built 9takes to make those buried perspectives visible.</p>
			<div class="founder">
				<p class="mono">DJ WAYNE · FOUNDER</p>
				<a href={resolve('/about')}>Read my story <ArrowRight size={16} aria-hidden="true" /></a>
			</div>
		</div>
	</section>

	<section class="closing-band" aria-labelledby="closing-title">
		<div class="closing shell">
			<h2 id="closing-title">See the emotions<br />behind every take.</h2>
			<p>
				{showReveal
					? 'You’ve seen what another perspective can open up. Bring yours to a real conversation.'
					: 'Start with your own answer. See what someone else might be seeing.'}
			</p>
			{#if showReveal && isLive && !posted}
				<Button size="lg" onclick={goToOptIn}
					>Post your take <ArrowRight size={18} aria-hidden="true" /></Button
				>
			{:else if showReveal}
				<Button
					size="lg"
					data-track="handoff"
					data-placement="closing"
					href={question.liveSlug
						? resolve('/questions/[slug]', { slug: question.liveSlug })
						: resolve('/questions')}
					>Join a real conversation <ArrowRight size={18} aria-hidden="true" /></Button
				>
			{:else}
				<Button size="lg" onclick={focusAnswer}
					>Start with your take <ArrowRight size={18} aria-hidden="true" /></Button
				>
			{/if}
		</div>
	</section>
</div>

<style lang="scss">
	/* Type scale (V5 + one lead step, HOMEPAGE_AUDIT_2026-09-26 T2-4):
	   12 mono labels + diagram chips only · 14 small body · 16 body · 18 large body ·
	   22 lead · 28 display-sm · clamp(28–40) section headings · h1. */
	.dry-home {
		color: var(--ink-bright);
		background: var(--night-deep);
		font-family: 'Inter Variable', Inter, sans-serif;
	}
	.shell {
		width: min(100%, 1280px);
		margin-inline: auto;
		padding-inline: var(--space-3xl);
	}
	.section {
		padding-block: 72px;
	}
	.mono {
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.07em;
		line-height: 1.5;
	}
	h1,
	h2,
	h3,
	p,
	blockquote {
		margin: 0;
	}
	h1,
	h2,
	h3 {
		padding: 0;
		text-wrap: balance;
	}
	section {
		margin-block: 0;
	}
	ol,
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		margin: 0;
	}

	/* Preview-only navigation */
	.home-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		min-height: 72px;
		padding-block: var(--space-sm);
		color: var(--ink-mid);
		font-size: 14px;
		border-bottom: 1px solid var(--stone-mid);
	}
	.home-nav nav,
	.home-nav a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
	}
	.home-nav nav {
		gap: var(--space-xl);
	}
	.home-brand {
		color: var(--ink-bright);
		font-size: 22px;
		font-weight: 750;
		letter-spacing: -0.06em;
	}
	.home-brand span {
		margin-left: var(--space-xs);
		white-space: nowrap;
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--lamp-glow);
	}
	.home-nav nav > a {
		min-height: 44px;
		color: var(--ink-mid);
		white-space: nowrap;
	}

	/* Hero */
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		grid-template-rows: auto 1fr;
		grid-template-areas:
			'intro panel'
			'visual panel';
		align-items: start;
		gap: var(--space-xl) var(--space-3xl);
		padding-block: var(--space-3xl);
	}
	.hero-intro {
		grid-area: intro;
		min-width: 0;
	}
	.hero-visual {
		grid-area: visual;
		min-width: 0;
	}
	.hero-action {
		grid-area: panel;
		min-width: 0;
	}
	h1 {
		margin-top: 0;
		font-size: clamp(38px, 4.6vw, 64px);
		line-height: 1.03;
		letter-spacing: -0.055em;
		font-weight: 760;
	}
	h1 span {
		color: var(--lamp-glow);
	}
	.hero-benefit {
		font-size: 22px;
		line-height: 1.4;
		margin-top: var(--space-xl);
		max-width: 32ch;
		letter-spacing: -0.015em;
	}

	/* "I'm fine" diagram */
	.perspective-visual {
		margin: 0;
		max-width: 540px;
	}
	.perspective-visual figcaption {
		font-size: 12px;
		font-family: 'JetBrains Mono', monospace;
		font-style: normal;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ink-mid);
		margin-bottom: var(--space-md);
	}
	.perspective-sketch {
		text-align: center;
	}
	.spoken-exchange {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--space-xs);
	}
	.asked-words {
		font-size: 16px;
		color: var(--ink-mid);
	}
	.spoken-words {
		padding: var(--space-sm) var(--space-lg);
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		text-align: center;
	}
	.spoken-words strong {
		display: block;
		font-size: 22px;
		line-height: 1.2;
		font-weight: 600;
		letter-spacing: -0.03em;
	}
	.could-mean {
		margin-top: var(--space-sm);
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ink-mid);
	}
	.perspective-paths {
		display: block;
		width: 100%;
		height: 28px;
		overflow: visible;
	}
	.perspective-paths path {
		fill: none;
		stroke: var(--lamp-glow);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
		opacity: 0.55;
	}
	.perspective-paths circle {
		fill: var(--lamp-glow);
	}
	.possible-meanings {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-md);
	}
	.meaning-title {
		margin-top: var(--space-xs);
		font-size: 16px;
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: -0.025em;
	}
	.thought-cloud {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: start;
		gap: 7px;
		margin: var(--space-md) 0 0;
	}
	.thought-cloud li {
		max-width: 100%;
		padding: 6px 11px;
		border: 1px solid var(--stone-mid);
		border-radius: 999px;
		background: var(--night-mid);
		color: var(--ink-mid);
		font-size: 12px;
		line-height: 1.35;
		text-wrap: balance;
	}
	.thought-cloud li:nth-child(2) {
		margin-right: 12px;
	}
	.thought-cloud li:nth-child(3) {
		margin-left: 12px;
	}
	.thought-cloud .thought-emphasis {
		color: var(--ink-bright);
		border-color: var(--stone-edge);
		font-weight: 550;
	}
	.thought-note {
		margin-top: var(--space-xl);
		font-size: 18px;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
	}

	/* Question card */
	.question-panel {
		min-width: 0;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-mid);
		overflow: hidden;
	}
	.panel-topline {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-md);
		padding: var(--space-lg) var(--space-xl);
		border-bottom: 1px solid var(--stone-edge);
		color: var(--ink-mid);
	}
	.panel-topline > .mono {
		color: var(--lamp-glow);
	}
	form,
	.answer-receipt {
		padding: var(--space-xl);
	}
	form h2,
	.answer-receipt h2 {
		font-size: 28px;
		line-height: 1.2;
		letter-spacing: -0.035em;
		max-width: 24ch;
	}
	form h2 {
		margin-bottom: var(--space-sm);
	}
	.answer-reason {
		margin: 0 0 var(--space-lg);
		color: var(--ink-mid);
		font-size: 14px;
		line-height: 1.5;
	}
	textarea {
		display: block;
		width: 100%;
		margin: 0;
		min-height: 96px;
		padding: var(--space-md);
		resize: vertical;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		color: var(--ink-bright);
		background: var(--night-deep);
		font: inherit;
		font-size: 16px;
		line-height: 1.5;
	}
	textarea::placeholder {
		color: var(--ink-dim);
	}
	textarea:global(:focus-visible),
	select:global(:focus-visible),
	a:global(:focus-visible),
	button:global(:focus-visible),
	summary:global(:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 4px;
	}
	.dry-home :global(.reveal-button) {
		white-space: normal;
		min-height: 48px;
		margin-top: var(--space-lg);
	}
	.dry-home :global(.btn-label) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
	}
	.practice-note {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		margin-top: var(--space-md);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
	}
	.practice-note :global(svg) {
		flex-shrink: 0;
		margin-top: 0.25em;
	}
	.form-error {
		color: var(--error-text);
		font-size: 14px;
		margin-top: var(--space-sm);
	}
	.receipt-icon {
		color: var(--lamp-glow);
		margin-bottom: var(--space-md);
	}
	.answer-receipt h2 {
		margin-bottom: var(--space-md);
	}
	.receipt-question {
		color: var(--ink-mid);
		font-size: 14px;
	}
	.answer-receipt blockquote {
		margin-top: var(--space-lg);
		font-size: 22px;
		line-height: 1.45;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}
	.privacy {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin-block: var(--space-md) var(--space-lg);
	}
	.community-signal-slot {
		display: flex;
		justify-content: center;
		min-height: 44px;
		margin-top: var(--space-md);
	}
	.community-signal {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: 44px;
		color: var(--ink-mid);
		font-size: 14px;
		line-height: 1.5;
	}
	.community-signal :global(svg) {
		display: inline;
		vertical-align: middle;
		margin-left: var(--space-xs);
	}
	.community-signal strong {
		color: var(--ink-bright);
		font-weight: 600;
	}
	.signal-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--lamp-glow);
		flex-shrink: 0;
	}

	/* Shared section headings */
	.section-heading h2,
	.ritual-band h2,
	.section-intro h2,
	.why-copy h2,
	.reading-heading h2,
	.faq-section h2,
	.founder-story h2,
	.closing h2 {
		font-size: clamp(28px, 3.2vw, 40px);
		letter-spacing: -0.04em;
		line-height: 1.12;
	}
	.text-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		color: var(--lamp-glow);
		font-size: 14px;
		min-height: 44px;
		margin-top: var(--space-xl);
	}

	/* Reveal */
	.reveal-section {
		border-top: 1px solid var(--stone-edge);
		padding-top: var(--space-3xl);
	}
	.section-heading h2 {
		scroll-margin-top: 110px;
	}
	.section-heading h2:focus {
		outline: none;
	}
	.section-heading > p {
		font-size: 16px;
		color: var(--ink-mid);
		margin-top: var(--space-lg);
		line-height: 1.6;
	}
	.starting-point {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: var(--space-lg);
		margin-top: var(--space-xl);
		padding: var(--space-lg) var(--space-xl);
		background: var(--night-mid);
		border-left: 2px solid var(--lamp-glow);
	}
	.starting-point > div {
		min-width: 0;
	}
	.starting-point .mono {
		color: var(--ink-mid);
		margin-bottom: var(--space-sm);
	}
	.starting-point blockquote {
		font-size: 16px;
		line-height: 1.6;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}
	.picker-instruction {
		color: var(--ink-mid);
		font-size: 14px;
		margin-top: var(--space-xl);
	}
	.perspective-picker {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-sm);
		margin-block: var(--space-2xl);
	}
	.mobile-picker {
		display: none;
	}
	.perspective-picker button {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		text-align: left;
		padding: var(--space-md) var(--space-lg);
		min-height: 48px;
		color: var(--ink-mid);
		background: transparent;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		font: inherit;
		font-size: 14px;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}
	.perspective-picker button:hover {
		color: var(--ink-bright);
		background: var(--night-mid);
	}
	.perspective-picker button.chosen {
		color: var(--ink-bright);
		background: var(--lamp-soft);
		border-color: var(--lamp-glow);
	}
	.type-number {
		font-family: 'JetBrains Mono', monospace;
		color: var(--lamp-glow);
		font-size: 12px;
		flex-shrink: 0;
	}
	.comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xl);
	}
	.perspective-card {
		display: flex;
		flex-direction: column;
		padding: var(--space-2xl);
		border-radius: 16px;
		border: 1px solid var(--stone-edge);
		background: var(--night-mid);
		min-width: 0;
	}
	.selected-card {
		border-color: var(--lamp-glow);
	}
	.perspective-eyebrow {
		display: flex;
		gap: var(--space-md);
		align-items: baseline;
		font-size: 14px;
		font-weight: 600;
	}
	.perspective-card blockquote {
		font-size: 28px;
		letter-spacing: -0.025em;
		line-height: 1.35;
		margin-block: var(--space-xl);
	}
	.underneath {
		margin-top: auto;
		padding-top: var(--space-lg);
		border-top: 1px solid var(--stone-edge);
	}
	.underneath .mono {
		color: var(--lamp-glow);
		margin-bottom: var(--space-sm);
	}
	.underneath p + p {
		color: var(--ink-mid);
		font-size: 16px;
		line-height: 1.65;
	}
	.example-label {
		margin-top: var(--space-xl);
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		letter-spacing: 0.04em;
		color: var(--ink-mid);
	}
	.reflection {
		display: flex;
		gap: var(--space-lg);
		margin-top: var(--space-xl);
		align-items: baseline;
	}
	.reflection-mark {
		color: var(--lamp-glow);
		font-size: 28px;
	}
	.reflection p {
		font-size: 22px;
		line-height: 1.45;
		max-width: 70ch;
	}
	.type-note {
		color: var(--ink-mid);
		font-size: 14px;
		line-height: 1.6;
		margin-top: var(--space-md);
	}
	.next-experience {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--space-xl);
		border-top: 1px solid var(--stone-edge);
		margin-top: var(--space-2xl);
		padding-top: var(--space-2xl);
	}
	.next-experience h3 {
		font-size: 18px;
	}
	.next-experience p {
		color: var(--ink-mid);
		font-size: 14px;
		margin-top: var(--space-sm);
	}
	.next-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
	}
	.next-actions :global(.btn) {
		white-space: normal;
	}

	/* Live take (design preview) */
	.live-count {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 14px;
		white-space: nowrap;
	}
	.live-optin {
		margin-top: var(--space-2xl);
		padding: var(--space-2xl);
		border: 1px solid var(--lamp-glow);
		border-radius: 16px;
		background: var(--night-mid);
	}
	.live-optin h3 {
		font-size: 28px;
		line-height: 1.2;
		letter-spacing: -0.035em;
	}
	.live-optin h3:focus {
		outline: none;
	}
	.live-optin > p:not(.mono):not(.optin-fine):not(.form-error) {
		max-width: 60ch;
		margin-top: var(--space-md);
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
	}
	.live-optin blockquote {
		margin-top: var(--space-xl);
		padding: var(--space-lg) var(--space-xl);
		border-left: 2px solid var(--lamp-glow);
		background: var(--night-deep);
		font-size: 18px;
		line-height: 1.55;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}
	.live-optin .next-actions {
		margin-top: var(--space-xl);
	}
	.optin-fine {
		margin-top: var(--space-md);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
	}
	.posted-kicker {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}
	.live-takes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-lg);
		margin-block: var(--space-xl);
	}
	.live-take {
		min-width: 0;
		padding: var(--space-xl);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-deep);
	}
	.live-take .mono {
		color: var(--ink-mid);
	}
	.live-take p + p {
		margin-top: var(--space-sm);
		font-size: 16px;
		line-height: 1.6;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}
	.own-take {
		grid-column: 1 / -1;
		border-color: var(--lamp-glow);
	}
	.live-take-note {
		grid-column: 1 / -1;
		min-width: 0;
	}
	.host-promise,
	.live-empty {
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-mid);
	}
	.own-take .mono {
		color: var(--lamp-glow);
	}
	.live-take.locked span {
		display: block;
		height: 12px;
		margin-top: var(--space-md);
		border-radius: 999px;
		background: var(--stone-mid);
	}
	.live-take.locked span:first-child {
		width: 40%;
		margin-top: 0;
	}
	.live-take.locked span:nth-child(2) {
		width: 90%;
	}
	.live-take.locked span:nth-child(3) {
		width: 70%;
	}
	.preview-note {
		grid-column: 1 / -1;
		font-size: 14px;
		color: var(--ink-mid);
	}

	/* Answer before the crowd */
	.ritual-band {
		background: var(--night-mid);
	}
	.ritual-band > .shell {
		padding-block: 64px;
	}
	.ritual-steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-2xl);
		margin-top: var(--space-2xl);
	}
	.ritual-steps li {
		min-width: 0;
		padding-top: var(--space-lg);
		border-top: 1px solid var(--stone-edge);
	}
	.step-number {
		font-family: 'JetBrains Mono', monospace;
		font-size: 12px;
		letter-spacing: 0.07em;
		color: var(--lamp-glow);
	}
	.ritual-steps h3 {
		margin-top: var(--space-md);
		font-size: 22px;
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: -0.025em;
	}
	.ritual-steps p {
		margin-top: var(--space-sm);
		font-size: 16px;
		line-height: 1.6;
		color: var(--ink-mid);
	}

	/* Live questions */
	.section-intro {
		max-width: 640px;
	}
	.kicker {
		color: var(--lamp-glow);
		margin-bottom: var(--space-md);
	}
	.section-intro > p:last-child {
		margin-top: var(--space-lg);
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
	}
	.live-questions {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-xl);
		margin-top: var(--space-2xl);
	}
	.live-question {
		display: flex;
		flex-direction: column;
		min-width: 0;
		padding: var(--space-xl);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-mid);
		color: var(--ink-bright);
		transition: border-color 0.15s;
	}
	.live-question:hover {
		border-color: color-mix(in srgb, var(--lamp-glow) 55%, var(--stone-edge));
	}
	.response-count {
		font-size: 14px;
		color: var(--ink-mid);
	}
	.live-question h3 {
		margin-top: var(--space-sm);
		font-size: 22px;
		font-weight: 550;
		line-height: 1.3;
		letter-spacing: -0.025em;
		overflow-wrap: anywhere;
	}
	.thread-action {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
		margin-top: auto;
		padding-top: var(--space-lg);
		color: var(--lamp-glow);
		font-size: 14px;
	}
	.thread-action :global(svg) {
		flex-shrink: 0;
	}
	.community-fallback {
		margin-top: var(--space-2xl);
		padding: var(--space-xl);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-mid);
	}
	.community-fallback h3 {
		font-size: 22px;
		letter-spacing: -0.025em;
	}
	.community-fallback p {
		margin-top: var(--space-md);
		font-size: 16px;
		line-height: 1.6;
		color: var(--ink-mid);
	}

	/* Nine ways to see the same moment */
	.why-section {
		display: grid;
		gap: var(--space-2xl);
		padding-top: 0;
	}
	.why-copy {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
		gap: var(--space-3xl);
		align-items: start;
	}
	.why-copy p {
		font-size: 16px;
		line-height: 1.7;
	}
	.why-copy p + p {
		margin-top: var(--space-lg);
		color: var(--ink-mid);
	}

	/* Reading */
	.reading-section {
		border-top: 1px solid var(--stone-edge);
	}
	.reading-heading {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: var(--space-xl);
	}
	.reading-heading > p {
		color: var(--ink-mid);
		font-size: 16px;
		line-height: 1.6;
	}
	.people-row {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--space-xl);
		margin-top: var(--space-3xl);
	}
	.people-row li {
		min-width: 0;
	}
	.people-row a {
		display: block;
		color: var(--ink-bright);
	}
	.people-row img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 16px;
		background: var(--night-mid);
	}
	.person-type {
		display: block;
		margin-top: var(--space-lg);
		color: var(--ink-mid);
	}
	.people-row h3 {
		margin-top: var(--space-xs);
		font-size: 18px;
		font-weight: 600;
		letter-spacing: -0.02em;
		transition: color 0.15s;
	}
	.people-row a:hover h3 {
		color: var(--lamp-glow);
	}
	.people-row p {
		margin-top: var(--space-xs);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
	}
	.reading-links {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-2xl);
		margin-top: var(--space-3xl);
	}
	.reading-links > a {
		border-top: 1px solid var(--stone-edge);
		padding-top: var(--space-xl);
		color: var(--ink-bright);
	}
	.reading-links .mono {
		color: var(--ink-mid);
	}
	.reading-links h3 {
		font-size: 22px;
		font-weight: 550;
		letter-spacing: -0.03em;
		line-height: 1.3;
		margin-block: var(--space-lg) var(--space-md);
	}
	.reading-links > a > span:last-child {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		color: var(--lamp-glow);
		font-size: 14px;
		min-height: 44px;
	}

	/* FAQ */
	.faq-band {
		background: var(--night-mid);
	}
	.faq-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
		gap: var(--space-3xl);
	}
	/* Reset the site-wide details/summary card chrome (src/scss/index.scss) to hairline rows. */
	details,
	details:hover {
		padding: 0;
		border: 0;
		border-bottom: 1px solid var(--stone-edge);
		border-radius: 0;
		background: none;
	}
	summary {
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-lg);
		cursor: pointer;
		padding: var(--space-xl) 0;
		font-size: 16px;
		font-weight: 500;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary :global(svg) {
		flex-shrink: 0;
		transition: transform 0.15s;
		color: var(--ink-mid);
	}
	details[open] summary :global(svg) {
		transform: rotate(180deg);
	}
	details > p {
		font-size: 16px;
		line-height: 1.7;
		color: var(--ink-mid);
		padding-bottom: var(--space-xl);
	}

	/* Founder */
	.founder-section {
		display: grid;
		grid-template-columns: 160px minmax(0, 760px);
		gap: var(--space-3xl);
		align-items: start;
	}
	.founder-photo {
		display: block;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		object-fit: cover;
	}
	.founder-story {
		min-width: 0;
	}
	.founder-story blockquote {
		font-size: 22px;
		line-height: 1.5;
		letter-spacing: -0.025em;
		margin-block: var(--space-xl);
		color: var(--ink-bright);
	}
	.founder-story > p {
		font-size: 16px;
		line-height: 1.7;
		color: var(--ink-mid);
		margin-top: var(--space-md);
		max-width: 62ch;
	}
	.founder {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-sm) var(--space-xl);
		margin-top: var(--space-xl);
	}
	.founder .mono {
		color: var(--ink-mid);
	}
	.founder a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 14px;
		color: var(--lamp-glow);
		min-height: 44px;
	}

	/* Closing */
	.closing-band {
		background: var(--night-mid);
	}
	.closing {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-block: 80px;
		text-align: center;
	}
	.closing > p {
		max-width: 40ch;
		margin-block: var(--space-lg) var(--space-xl);
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	@media (min-width: 1440px) {
		.hero {
			padding-block: 64px;
		}
	}
	@media (max-width: 1000px) {
		.shell {
			padding-inline: var(--space-2xl);
		}
		.hero {
			column-gap: var(--space-2xl);
		}
		h1 {
			font-size: 45px;
		}
		.spoken-words strong {
			font-size: 18px;
		}
		.panel-topline {
			padding-inline: var(--space-lg);
		}
		form,
		.answer-receipt {
			padding: var(--space-lg);
		}
		.live-questions {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-lg);
		}
		.reading-links {
			gap: var(--space-xl);
		}
		.founder-section {
			grid-template-columns: 120px minmax(0, 1fr);
			gap: var(--space-2xl);
		}
		.founder-photo {
			width: 120px;
			height: 120px;
		}
	}
	@media (max-width: 760px) {
		.shell {
			padding-inline: var(--space-xl);
		}
		.section {
			padding-block: var(--space-3xl);
		}
		.home-nav {
			font-size: 12px;
			min-height: 64px;
		}
		.home-nav nav {
			gap: var(--space-sm);
		}
		.hero {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto;
			grid-template-areas:
				'intro'
				'panel'
				'visual';
			gap: var(--space-xl);
			padding-block: var(--space-lg) var(--space-2xl);
		}
		.hero-visual {
			margin-top: var(--space-lg);
		}
		h1 {
			font-size: clamp(35px, 8.8vw, 52px);
			line-height: 1.02;
		}
		.hero-benefit {
			font-size: 18px;
			margin-top: var(--space-md);
		}
		.perspective-visual figcaption {
			margin-bottom: var(--space-sm);
		}
		.thought-note {
			margin-top: var(--space-lg);
		}
		.spoken-words {
			padding: var(--space-sm) var(--space-md);
		}
		.possible-meanings {
			gap: var(--space-sm);
		}
		.meaning-title {
			font-size: 14px;
		}
		.thought-cloud {
			margin-top: var(--space-sm);
			gap: 6px;
		}
		.thought-cloud li {
			padding: 5px 9px;
		}
		.thought-cloud li:nth-child(2),
		.thought-cloud li:nth-child(3) {
			margin-left: 0;
			margin-right: 0;
		}
		.panel-topline {
			padding-block: var(--space-md);
		}
		.answer-reason {
			margin-bottom: var(--space-md);
		}
		textarea {
			min-height: 72px;
			height: 72px;
		}
		.community-signal-slot {
			min-height: 32px;
			margin-top: var(--space-xs);
		}
		.community-signal {
			min-height: 32px;
		}
		.comparison {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
		}
		.perspective-card {
			padding: var(--space-xl);
		}
		.perspective-card blockquote {
			font-size: 22px;
		}
		.perspective-picker {
			display: none;
		}
		.mobile-picker {
			display: grid;
			gap: var(--space-sm);
			margin-block: var(--space-lg) var(--space-xl);
			font-size: 14px;
			color: var(--ink-mid);
		}
		.mobile-picker select {
			appearance: none;
			width: 100%;
			min-height: 48px;
			padding: var(--space-md);
			padding-right: var(--space-3xl);
			border: 1px solid var(--stone-edge);
			border-radius: 10px;
			color: var(--ink-bright);
			background: var(--night-mid);
			font: inherit;
			font-size: 16px;
		}
		.mobile-select {
			position: relative;
			display: block;
		}
		.mobile-select :global(svg) {
			position: absolute;
			right: var(--space-lg);
			top: 50%;
			transform: translateY(-50%);
			pointer-events: none;
		}
		.reflection p {
			font-size: 18px;
		}
		.live-optin {
			padding: var(--space-xl);
		}
		.live-optin h3 {
			font-size: 22px;
		}
		.live-optin > p:not(.mono):not(.optin-fine):not(.form-error) {
			font-size: 16px;
		}
		.live-takes {
			grid-template-columns: minmax(0, 1fr);
		}
		.next-actions {
			flex-direction: column;
			width: 100%;
		}
		.section-heading h2 {
			scroll-margin-top: 88px;
		}
		.ritual-band > .shell {
			padding-block: var(--space-3xl);
		}
		.ritual-steps {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-xl);
			margin-top: var(--space-xl);
		}
		.ritual-steps h3 {
			font-size: 18px;
		}
		.section-intro > p:last-child {
			font-size: 16px;
		}
		.live-questions {
			margin-top: var(--space-xl);
		}
		.why-copy {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-lg);
		}
		.reading-heading {
			display: block;
		}
		.reading-heading > p {
			margin-top: var(--space-lg);
		}
		.people-row {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--space-xl) var(--space-lg);
			margin-top: var(--space-2xl);
		}
		.person-type {
			margin-top: var(--space-md);
		}
		.people-row h3 {
			font-size: 16px;
		}
		.reading-links {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-xl);
			margin-top: var(--space-2xl);
		}
		.reading-links h3 {
			font-size: 18px;
			margin-block: var(--space-md);
		}
		.faq-section {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-lg);
		}
		.founder-section {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--space-xl);
		}
		.founder-photo {
			width: 96px;
			height: 96px;
		}
		.founder-story blockquote {
			font-size: 18px;
		}
		.closing {
			padding-block: var(--space-3xl);
		}
		.closing > p {
			font-size: 16px;
		}
	}
	@media (max-width: 380px) {
		.shell {
			padding-inline: var(--space-lg);
		}
		form h2 {
			font-size: 22px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			transition: none !important;
			scroll-behavior: auto !important;
		}
	}
</style>

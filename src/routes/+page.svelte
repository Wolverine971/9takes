<!-- src/routes/+page.svelte -->
<!-- src/routes/+page.svelte — production homepage, promoted from the home-reimagined preview. -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { tick } from 'svelte';
	import { ArrowUpRight, CircleCheck, EyeOff, LockKeyhole, UnlockKeyhole } from '@lucide/svelte';
	import type { PageData } from './$types';
	import { capture } from '$lib/analytics/posthog';
	import { captureCommentCreated } from '$lib/analytics/commentEvents';
	import { getOrCreateVisitorId } from '$lib/analytics/visitorIdentity';
	import { Button, SectionKicker } from '$lib/components/atoms';
	import PerspectivePreviewCard from '$lib/components/molecules/PerspectivePreviewCard.svelte';
	import TimeMirror from '$lib/components/marketing/TimeMirror.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import {
		CHORUS_TAKE_MAX_CHARACTERS,
		CHORUS_TAKE_MIN_CHARACTERS,
		CHORUS_TAKE_MIN_WORDS,
		CHORUS_TAKE_WARNING_CHARACTERS
	} from '$lib/constants/answerLimits';
	import { formatTypeLabel } from '$lib/constants/enneagramColors';

	let { data }: { data: PageData } = $props();

	const siteUrl = 'https://9takes.com';
	const homepageTitle = 'One Question, Nine Perspectives | 9takes';
	const homepageDescription =
		'Answer anonymously before reading the crowd, then unlock nine Enneagram perspectives and see the emotions behind every take.';
	const socialImageUrl = `${siteUrl}/images/home-reimagined/streetlamp-nine.webp`;
	const socialImageAlt = 'Nine people gathered in conversation beneath a streetlamp';

	type Center = {
		name: string;
		label: string;
		types: string;
		question: string;
		detail: string;
		className: string;
	};

	type Perspective = {
		center: string;
		take: string;
		className: string;
	};

	type ChorusTake = {
		type: number;
		archetype: string;
		take: string;
		source: 'ai' | 'human';
	};

	type Mirror = {
		reflection: string;
		resonantType: number;
		resonantArchetype: string;
	};

	const centers: Center[] = [
		{
			name: 'Anger',
			label: 'Instinct center',
			types: 'Types 8 · 9 · 1',
			question: 'What needs to be protected, corrected, controlled, or kept at peace?',
			detail:
				'These perspectives often register impact, boundaries, and what feels right before anything else.',
			className: 'center--anger'
		},
		{
			name: 'Shame',
			label: 'Identity center',
			types: 'Types 2 · 3 · 4',
			question: 'What makes me valuable, lovable, successful, or real?',
			detail:
				'These perspectives often notice relationship, recognition, and the meaning an answer carries.',
			className: 'center--shame'
		},
		{
			name: 'Fear',
			label: 'Mind center',
			types: 'Types 5 · 6 · 7',
			question: 'What will keep me capable, prepared, supported, or free?',
			detail:
				'These perspectives often scan for information, certainty, options, and what could happen next.',
			className: 'center--fear'
		}
	];

	const revealedPerspectives: Perspective[] = [
		{
			center: 'Instinct',
			take: 'I swallow my frustration and keep moving so nobody else has to deal with it.',
			className: 'perspective--anger'
		},
		{
			center: 'Identity',
			take: 'I make sure everyone else feels okay before I admit that I am exhausted.',
			className: 'perspective--shame'
		},
		{
			center: 'Mind',
			take: 'I rehearse every possible problem until being prepared looks effortless.',
			className: 'perspective--fear'
		}
	];

	let previewTake = $state('');
	let previewRevealed = $state(false);
	let submitting = $state(false);
	let submitError = $state<string | null>(null);
	let mirror = $state<Mirror | null>(null);
	let mirrorUnavailable = $state(false);
	let alreadyAnswered = $state(false);
	let chorusTakes = $state.raw<ChorusTake[]>([]);
	let revealEl = $state<HTMLElement | null>(null);

	const trimmedTake = $derived(previewTake.trim());
	const wordCount = $derived(trimmedTake ? trimmedTake.split(/\s+/).length : 0);
	const wordsNeeded = $derived(Math.max(0, CHORUS_TAKE_MIN_WORDS - wordCount));
	const charactersNeeded = $derived(Math.max(0, CHORUS_TAKE_MIN_CHARACTERS - trimmedTake.length));
	const charactersRemaining = $derived(CHORUS_TAKE_MAX_CHARACTERS - previewTake.length);
	const answerReady = $derived(wordsNeeded === 0 && charactersNeeded === 0);
	const canSubmit = $derived(answerReady && charactersRemaining >= 0 && !submitting);
	const characterProgress = $derived(
		`${Math.min(100, Math.max(0, (previewTake.length / CHORUS_TAKE_MAX_CHARACTERS) * 100))}%`
	);
	const answerGuidance = $derived.by(() => {
		if (wordsNeeded > 0) {
			return `${wordsNeeded} more word${wordsNeeded === 1 ? '' : 's'} to post`;
		}
		if (charactersNeeded > 0) {
			return `${charactersNeeded} more character${charactersNeeded === 1 ? '' : 's'} to post`;
		}
		return 'Ready to post';
	});
	const characterCounterClass = $derived([
		'character-budget',
		charactersRemaining <= CHORUS_TAKE_WARNING_CHARACTERS && 'character-budget--warning',
		charactersRemaining <= 50 && 'character-budget--critical'
	]);
	const questionHref = $derived(`/questions/${data.featuredQuestion.url}`);
	const questionThreadHref = $derived(`${questionHref}?from=homepage-answer#comments-panel`);
	const homepageStructuredData = $derived.by(() => ({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${siteUrl}/#webpage`,
		url: siteUrl,
		name: homepageTitle,
		description: homepageDescription,
		inLanguage: 'en-US',
		isPartOf: { '@id': `${siteUrl}/#website` },
		primaryImageOfPage: {
			'@type': 'ImageObject',
			url: socialImageUrl,
			width: 1400,
			height: 788,
			caption: socialImageAlt
		},
		mainEntity: {
			'@type': 'Question',
			'@id': `${siteUrl}${questionHref}`,
			name: data.featuredQuestion.question,
			url: `${siteUrl}${questionHref}`
		}
	}));

	async function submitTake() {
		if (submitting) return;
		if (!answerReady) {
			submitError = 'Say a little more. A short sentence is enough.';
			return;
		}

		submitting = true;
		submitError = null;

		try {
			const visitorId = browser ? getOrCreateVisitorId() : undefined;

			const response = await fetch('/api/nine/mirror', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					subjectType: 'question',
					questionUrl: data.featuredQuestion.url,
					take: trimmedTake,
					sourcePath: browser ? window.location.pathname : undefined,
					fingerprint: visitorId
				})
			});
			const result = await response.json().catch(() => null);

			if (!response.ok) {
				throw new Error(result?.error ?? result?.message ?? 'Something slipped. Try once more.');
			}
			if (!result?.answerRecorded) {
				throw new Error('We could not add your answer to the live question. Please try again.');
			}
			if (!Array.isArray(result?.takes) || result.takes.length !== 9) {
				throw new Error('Your answer was posted, but the nine perspectives are not ready yet.');
			}

			const hasMirror =
				typeof result?.reflection === 'string' &&
				Number.isInteger(result?.resonantType) &&
				typeof result?.resonantArchetype === 'string';
			mirror = hasMirror
				? {
						reflection: result.reflection,
						resonantType: result.resonantType,
						resonantArchetype: result.resonantArchetype
					}
				: null;
			mirrorUnavailable = Boolean(result?.mirrorUnavailable || !hasMirror);
			chorusTakes = result.takes;
			alreadyAnswered = Boolean(result.alreadyAnswered);
			previewRevealed = true;
			if (!alreadyAnswered) {
				void captureCommentCreated({
					commentId: result.commentId,
					questionId: data.featuredQuestion.id,
					questionUrl: data.featuredQuestion.url,
					parentType: 'question',
					commentKind: 'answer',
					surface: 'homepage',
					sourcePath: browser ? window.location.pathname : undefined,
					isAnonymous: !data.user?.id
				});
			}
			void capture('homepage_question_answered', {
				question_url: data.featuredQuestion.url,
				source_path: browser ? window.location.pathname : undefined
			});
			await tick();
			revealEl?.focus();
		} catch (error) {
			submitError = error instanceof Error ? error.message : 'Something slipped. Try once more.';
		} finally {
			submitting = false;
		}
	}

	function trackDiscussionOpen() {
		void capture('homepage_discussion_opened', {
			question_url: data.featuredQuestion.url
		});
	}
</script>

<SEOHead
	title={homepageTitle}
	description={homepageDescription}
	canonical={siteUrl}
	ogImage={socialImageUrl}
	ogImageWidth={1400}
	ogImageHeight={788}
	twitterImage={socialImageUrl}
	twitterImageAlt={socialImageAlt}
	jsonLd={homepageStructuredData}
	author="DJ Wayne"
	additionalMeta={[
		{
			property: 'og:image:secure_url',
			content: socialImageUrl
		},
		{
			property: 'og:image:type',
			content: 'image/webp'
		}
	]}
/>

<div class="home-reimagined">
	<section class="hero" aria-labelledby="hero-title">
		<div class="hero-atmosphere" aria-hidden="true"></div>
		<div class="shell hero-grid">
			<div class="hero-copy">
				<SectionKicker num="01" label="THE OPEN QUESTION" />
				<h1 id="hero-title">One question.<br /><span>Nine ways to see it.</span></h1>
				<p class="hero-lede">
					Say what you actually think before the crowd can shape your take. Then unlock the other
					perspectives—and notice what someone else can see that you cannot.
				</p>

				<div class="hero-action">
					<Button href="#live-question" size="lg">Answer the question</Button>
					<p>No type knowledge needed.</p>
				</div>

				<ul class="proof-line" aria-label="How 9takes is different">
					<li>Anonymous answers</li>
					<li>Answer first</li>
					<li>Reveal through response</li>
				</ul>
			</div>

			<TimeMirror />
		</div>
	</section>

	<section id="live-question" class="product-proof" aria-labelledby="proof-title">
		<div class="shell proof-layout">
			<header class="section-heading proof-heading">
				<SectionKicker num="02" label="ANSWER BEFORE THE ROOM OPENS" />
				<h2 id="proof-title">Read the question before you read the room.</h2>
				<p>
					Your answer comes first. Other responses stay out of sight until you contribute, giving
					your take a chance to be yours.
				</p>
			</header>

			<div class="question-stage">
				<div class="proof-meta">
					<span>Open question · {String(data.featuredQuestion.id).padStart(4, '0')}</span>
					<span class="status">
						{#if previewRevealed}
							<CircleCheck size={14} aria-hidden="true" /> Answer posted
						{:else}
							<LockKeyhole size={14} aria-hidden="true" /> Other takes hidden
						{/if}
					</span>
				</div>

				<div class="question-display-card">
					<h3>{data.featuredQuestion.question}</h3>
				</div>

				{#if !previewRevealed}
					<form
						class="question-composer"
						aria-busy={submitting || undefined}
						onsubmit={(event) => {
							event.preventDefault();
							void submitTake();
						}}
						novalidate
					>
						<div class="composer-body">
							<div class="composer-heading">
								<label for="preview-take">Your answer</label>
								<span>Live question</span>
							</div>

							<textarea
								id="preview-take"
								bind:value={previewTake}
								oninput={() => (submitError = null)}
								rows="4"
								maxlength={CHORUS_TAKE_MAX_CHARACTERS}
								placeholder="Answer honestly. A short sentence is enough."
								aria-invalid={submitError ? 'true' : 'false'}
								aria-describedby={submitError
									? 'answer-help answer-count answer-error'
									: 'answer-help answer-count'}
								disabled={submitting}></textarea>
						</div>

						<div class="composer-footer">
							<div class="answer-foot">
								<div class="answer-readiness">
									<span
										id="answer-help"
										class={['answer-guidance', answerReady && 'answer-guidance--ready']}
									>
										{answerGuidance}
									</span>
									<span>Anonymous · no account required</span>
								</div>
								<div class={characterCounterClass} style:--character-progress={characterProgress}>
									<span id="answer-count">
										{Math.max(0, charactersRemaining).toLocaleString('en-US')} characters left
									</span>
									<span class="character-track" aria-hidden="true"><span></span></span>
								</div>
							</div>

							<div class="composer-action">
								<Button size="md" type="submit" disabled={!canSubmit} loading={submitting}>
									{submitting ? 'Posting your answer…' : 'Post answer and reveal'}
								</Button>
							</div>
						</div>
						{#if submitError}
							<p id="answer-error" class="composer-error" role="alert">{submitError}</p>
						{/if}
					</form>
				{:else}
					<div class="question-composer submitted-answer" bind:this={revealEl} tabindex="-1">
						<div class="submitted-answer-head">
							<span class="submitted-check"><CircleCheck size={18} aria-hidden="true" /></span>
							<div>
								<strong>
									{alreadyAnswered
										? 'You already answered this one.'
										: 'Your answer is in the conversation.'}
								</strong>
								<span>The nine perspectives are open.</span>
							</div>
						</div>
						<blockquote>{trimmedTake}</blockquote>
						{#if mirror}
							<div class="mirror-read">
								<span>Your mirror</span>
								<p>{mirror.reflection}</p>
								<small>Closest lens: {formatTypeLabel(mirror.resonantType)}</small>
							</div>
						{:else if mirrorUnavailable}
							<div class="mirror-read mirror-read--unavailable">
								<span>Your mirror</span>
								<p>
									Your answer is posted and the room is open. The personal reflection did not load
									this time, but the nine perspectives are ready below.
								</p>
							</div>
						{/if}
					</div>
				{/if}

				<div class="takes-shell" class:is-revealed={previewRevealed} aria-live="polite">
					<div class="takes-nav">
						<div class="takes-tab">
							<span class="takes-icon">
								{#if previewRevealed}
									<UnlockKeyhole size={17} aria-hidden="true" />
								{:else}
									<EyeOff size={17} aria-hidden="true" />
								{/if}
							</span>
							<span><strong>9</strong> perspective previews</span>
						</div>
						<span class="takes-state"
							>{previewRevealed ? 'Seeded starting points' : 'Hidden until you post'}</span
						>
					</div>

					<div class="takes-body">
						{#if previewRevealed}
							<header class="reveal-intro">
								<div>
									<span>Perspective preview</span>
									<h4>One question. Nine different instincts.</h4>
								</div>
								<p>
									These seeded examples open the lens and each one is labeled by source. Community
									answers are waiting in the live discussion.
								</p>
							</header>
							<div class="discussion-takes">
								{#each chorusTakes as take, index (take.type)}
									<PerspectivePreviewCard
										typeNumber={take.type}
										text={take.take}
										source={take.source}
										delay={index * 55}
									/>
								{/each}
							</div>
						{:else}
							<div class="blurred-perspectives" aria-hidden="true">
								{#each revealedPerspectives as perspective (perspective.center)}
									<article class="perspective {perspective.className}">
										<span class="perspective-label">{perspective.center}</span>
										<p>&ldquo;{perspective.take}&rdquo;</p>
									</article>
								{/each}
							</div>
							<div class="lock-message">
								<span class="lock-icon"><LockKeyhole size={18} aria-hidden="true" /></span>
								<span>
									<strong>Other answers stay blurred.</strong>
									Post yours to reveal them.
								</span>
							</div>
						{/if}
					</div>
				</div>

				{#if previewRevealed}
					<section class="discussion-door" aria-labelledby="discussion-door-title">
						<div class="discussion-door__copy">
							<span>The live discussion</span>
							<h4 id="discussion-door-title">Now read what people actually said.</h4>
							<p>
								Your answer is already in the room. Compare it with the community, reply to a
								perspective, or send the question to someone who would answer differently.
							</p>
						</div>
						<Button
							href={questionThreadHref}
							size="lg"
							onpointerup={trackDiscussionOpen}
							onkeydown={(event: KeyboardEvent) => {
								if (event.key === 'Enter') trackDiscussionOpen();
							}}
						>
							Read everyone’s answers <ArrowUpRight size={17} aria-hidden="true" />
						</Button>
					</section>
				{:else}
					<div class="proof-card-foot">
						<p>
							<strong>This is the real room.</strong> Your answer is added to the live question.
						</p>
						<Button href={questionHref} variant="ghost">Open this question</Button>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<section class="centers-section" id="perspectives" aria-labelledby="centers-title">
		<div class="center-orbit" aria-hidden="true"></div>
		<div class="shell">
			<header class="section-heading centers-heading">
				<SectionKicker num="03" label="THE PATTERN UNDERNEATH" tone="data" />
				<h2 id="centers-title">The same question can hold more than one honest perspective.</h2>
				<p>
					Once the room opens, the differences are the point. We are more alike—and more
					different—than we think: we all navigate anger, shame, and fear, but develop different
					ways of managing them. Those strategies shape what we notice, what feels at stake, and how
					we respond. The Enneagram maps those recurring strategies into nine personality patterns.
				</p>
			</header>

			<div class="center-grid">
				{#each centers as center, index (center.name)}
					<article class="center-card {center.className}">
						<div class="center-card-top">
							<span class="center-index">0{index + 1}</span>
							<span class="center-types">{center.types}</span>
						</div>
						<p class="center-label">{center.label}</p>
						<h3>{center.name}</h3>
						<p class="center-question">{center.question}</p>
						<p class="center-detail">{center.detail}</p>
					</article>
				{/each}
			</div>

			<p class="centers-note">
				<span aria-hidden="true"></span>
				Nine patterns. Three emotional centers. You don&rsquo;t need a label to notice what someone sees
				first.
			</p>
		</div>
	</section>

	<section class="paths-section" aria-labelledby="paths-title">
		<div class="shell">
			<header class="section-heading paths-heading">
				<SectionKicker num="04" label="CHOOSE YOUR DEPTH" />
				<h2 id="paths-title">Start with a question. Follow the pattern when you&rsquo;re ready.</h2>
			</header>

			<div class="path-grid">
				<article class="path-card">
					<div class="path-number">A</div>
					<div class="path-content">
						<p class="path-label">I am new to this</p>
						<h3>Start with what feels real.</h3>
						<p>
							You do not need to know your type. Answer a question and notice which perspectives
							feel familiar—or completely foreign.
						</p>
						<Button href={resolve('/questions')} size="lg">Start with a question</Button>
					</div>
				</article>

				<article class="path-card path-card--data">
					<div class="path-number">B</div>
					<div class="path-content">
						<p class="path-label">I know my type</p>
						<h3>Look beneath the opinion.</h3>
						<p>
							Notice the strategy underneath: what is this answer trying to protect, prove, avoid,
							or understand?
						</p>
						<Button href={resolve('/enneagram-corner')} size="lg" variant="secondary"
							>Explore the Enneagram</Button
						>
					</div>
				</article>
			</div>
		</div>
	</section>

	<section class="final-section" aria-labelledby="final-title">
		<div class="final-pool" aria-hidden="true"></div>
		<div class="shell final-inner">
			<div class="final-copy">
				<SectionKicker num="05" label="YOUR TAKE IS MISSING" />
				<h2 id="final-title">What do you see that everyone else misses?</h2>
				<p>Add your take. Then enter the conversation.</p>
				<Button href={resolve('/questions')} size="lg">Browse the questions</Button>
			</div>

			<div class="deeper-row" aria-label="Go deeper with 9takes">
				<span class="deeper-label">Go deeper</span>
				<a href={resolve('/personality-analysis')}>
					Personality analysis <ArrowUpRight size={16} aria-hidden="true" />
				</a>
				<a href={resolve('/how-to-guides')}>
					Practical guides <ArrowUpRight size={16} aria-hidden="true" />
				</a>
				<a href={resolve('/community')}>
					The takes of 9takes <ArrowUpRight size={16} aria-hidden="true" />
				</a>
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	.home-reimagined {
		--cta-text: var(--night-deep);
		--preview-anger: #b9683c;
		--preview-anger-soft: rgba(185, 104, 60, 0.14);
		--preview-shame: #b8797f;
		--preview-shame-soft: rgba(184, 121, 127, 0.14);
		--preview-fear: #2f8f8c;
		--preview-fear-soft: rgba(47, 143, 140, 0.14);
		position: relative;
		z-index: 26;
		isolation: isolate;
		width: 100%;
		max-width: none;
		margin: 0;
		padding: 0;
		overflow: clip;
		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
	}

	:global(html.light) .home-reimagined {
		--cta-text: #faf8f4;
		--preview-anger-soft: rgba(185, 104, 60, 0.1);
		--preview-shame-soft: rgba(184, 121, 127, 0.1);
		--preview-fear-soft: rgba(47, 143, 140, 0.1);
	}

	.home-reimagined,
	.home-reimagined * {
		box-sizing: border-box;
	}

	.home-reimagined > section {
		margin: 0;
	}

	.shell {
		width: min(100% - 3rem, 86rem);
		margin-inline: auto;
	}

	.hero {
		position: relative;
		padding: clamp(4.5rem, 8vw, 8rem) 0 clamp(5rem, 9vw, 9rem);
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--night-mid) 28%, transparent),
				transparent 28%
			),
			var(--night-deep);
	}

	.hero-atmosphere {
		position: absolute;
		z-index: -1;
		inset: 0;
		background:
			radial-gradient(circle at 74% 26%, rgba(245, 158, 11, 0.13), transparent 28%),
			radial-gradient(circle at 87% 46%, rgba(13, 148, 136, 0.06), transparent 22%);
		pointer-events: none;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(19rem, 0.78fr) minmax(34rem, 1.32fr);
		align-items: center;
		gap: clamp(3rem, 6vw, 6.5rem);
	}

	.hero-copy {
		position: relative;
		z-index: 1;
	}

	.hero h1 {
		max-width: 10ch;
		margin: 1.5rem 0 1.75rem;
		color: var(--ink-bright);
		font-size: clamp(3.35rem, 5.8vw, 5.9rem);
		font-weight: 780;
		letter-spacing: -0.055em;
		line-height: 0.94;
		text-wrap: balance;
	}

	.hero h1 span {
		color: color-mix(in srgb, var(--ink-bright) 70%, var(--lamp-glow));
	}

	.hero-lede {
		max-width: 37rem;
		margin: 0;
		color: var(--ink-mid);
		font-size: clamp(1.05rem, 1.5vw, 1.25rem);
		line-height: 1.65;
	}

	.hero-action {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.hero-action p {
		margin: 0;
		color: var(--ink-dim);
		font-size: 0.82rem;
	}

	.proof-line {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem 1.3rem;
		margin: 2.5rem 0 0;
		padding: 1.2rem 0 0;
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 64%, transparent);
		list-style: none;
	}

	.proof-line li {
		position: relative;
		padding-left: 0.8rem;
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.67rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.proof-line li::before {
		position: absolute;
		left: 0;
		top: 0.45em;
		width: 0.25rem;
		height: 0.25rem;
		border-radius: 9999px;
		background: var(--lamp-glow);
		content: '';
	}

	.product-proof {
		scroll-margin-top: 5.5rem;
		padding: clamp(5rem, 9vw, 8rem) 0;
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 58%, transparent);
		background: var(--night-mid);
	}

	.proof-layout {
		display: grid;
		grid-template-columns: minmax(17rem, 0.56fr) minmax(0, 1.44fr);
		align-items: start;
		gap: clamp(2.5rem, 7vw, 7rem);
	}

	.section-heading h2 {
		margin: 1.25rem 0 1.1rem;
		color: var(--ink-bright);
		font-size: clamp(2.35rem, 4.6vw, 4.35rem);
		font-weight: 760;
		letter-spacing: -0.045em;
		line-height: 1.02;
		text-wrap: balance;
	}

	.section-heading > p {
		max-width: 45rem;
		margin: 0;
		color: var(--ink-mid);
		font-size: 1.05rem;
		line-height: 1.7;
	}

	.question-stage {
		display: grid;
		gap: 0.85rem;
		min-width: 0;
	}

	.proof-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 0.2rem;
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.68rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--lamp-glow);
	}

	.question-display-card {
		padding: clamp(1.7rem, 4vw, 2.6rem);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.question-display-card h3 {
		max-width: 25ch;
		margin: 0 auto;
		color: var(--ink-bright);
		font-size: clamp(1.55rem, 3vw, 2.35rem);
		font-weight: 720;
		letter-spacing: -0.035em;
		line-height: 1.18;
		text-align: center;
		text-wrap: balance;
	}

	.question-composer {
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 18%, var(--stone-edge));
		border-radius: 1rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--lamp-soft) 36%, transparent),
				transparent 38%
			),
			color-mix(in srgb, var(--stone-warm) 97%, var(--night-deep));
	}

	.composer-body {
		padding: 1rem;
	}

	.composer-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.55rem;
	}

	.composer-heading label {
		color: var(--ink-bright);
		font-size: 0.875rem;
		font-weight: 600;
	}

	.composer-heading span {
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.65rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.question-composer textarea {
		display: block;
		width: 100%;
		min-height: 7.5rem;
		resize: vertical;
		padding: 1rem;
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		outline: 0;
		background: color-mix(in srgb, var(--night-deep) 80%, transparent);
		color: var(--ink-bright);
		font: inherit;
		font-size: 1rem;
		line-height: 1.5;
	}

	.question-composer textarea::placeholder {
		color: var(--ink-mid);
	}

	.question-composer textarea:disabled {
		cursor: wait;
		opacity: 0.72;
	}

	:global(.home-reimagined .question-composer textarea:focus-visible) {
		border-color: var(--lamp-glow);
		box-shadow: 0 0 0 1px var(--lamp-glow);
	}

	.composer-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem 1rem;
		border-top: 1px solid color-mix(in srgb, var(--lamp-glow) 16%, var(--stone-edge));
		background: color-mix(in srgb, var(--night-deep) 74%, transparent);
	}

	.answer-foot {
		display: grid;
		min-width: 0;
		flex: 1 1 auto;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 1rem;
		margin: 0;
		color: var(--ink-dim);
		line-height: 1.4;
	}

	.answer-readiness {
		display: flex;
		min-width: 0;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 0.55rem;
		font-size: 0.75rem;
	}

	.answer-readiness > span:last-child {
		color: var(--ink-dim);
	}

	.answer-guidance {
		color: var(--ink-mid);
		font-weight: 650;
	}

	.answer-guidance--ready {
		color: var(--success-text);
	}

	.character-budget {
		display: grid;
		min-width: 9.5rem;
		justify-items: end;
		gap: 0.35rem;
		color: var(--ink-mid);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.67rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.025em;
		white-space: nowrap;
	}

	.character-track {
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 0.25rem;
		border-radius: 0.25rem;
		background: color-mix(in srgb, var(--stone-edge) 52%, transparent);
	}

	.character-track > span {
		position: absolute;
		inset: 0 auto 0 0;
		width: var(--character-progress);
		border-radius: inherit;
		background: var(--data-teal);
	}

	.character-budget--warning {
		color: var(--warning-text);
	}

	.character-budget--warning .character-track > span {
		background: var(--warning-text);
	}

	.character-budget--critical {
		color: var(--error-text);
	}

	.character-budget--critical .character-track > span {
		background: var(--error-text);
	}

	.composer-action {
		flex: 0 0 auto;
	}

	.composer-error {
		margin: 0;
		padding: 0.85rem 1rem;
		border-top: 1px solid color-mix(in srgb, var(--error-text) 35%, var(--stone-edge));
		color: var(--error-text);
		font-size: 0.82rem;
		line-height: 1.45;
	}

	.submitted-answer {
		padding: 1.1rem;
	}

	.submitted-answer:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 3px;
	}

	.submitted-answer-head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.submitted-answer-head > div {
		display: grid;
		gap: 0.15rem;
	}

	.submitted-answer-head strong {
		color: var(--ink-bright);
		font-size: 0.92rem;
	}

	.submitted-answer-head div > span {
		color: var(--ink-dim);
		font-size: 0.76rem;
	}

	.submitted-check {
		display: grid;
		width: 2.35rem;
		height: 2.35rem;
		flex: 0 0 2.35rem;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--success-text) 35%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--success-text) 8%, var(--night-mid));
		color: var(--success-text);
	}

	.submitted-answer blockquote {
		margin: 1rem 0 0;
		padding: 0.9rem 1rem;
		border-left: 3px solid var(--lamp-glow);
		background: color-mix(in srgb, var(--night-deep) 72%, transparent);
		color: var(--ink-bright);
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.mirror-read {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--stone-edge);
	}

	.mirror-read > span,
	.mirror-read small {
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.mirror-read > span {
		color: var(--lamp-glow);
	}

	.mirror-read p {
		margin: 0.5rem 0;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.55;
	}

	.mirror-read--unavailable p {
		margin-bottom: 0;
	}

	.mirror-read small {
		color: var(--ink-dim);
	}

	.takes-shell {
		overflow: hidden;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.takes-shell.is-revealed {
		border-color: color-mix(in srgb, var(--lamp-glow) 34%, var(--stone-edge));
	}

	.takes-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.55rem;
		border-bottom: 1px solid var(--stone-edge);
		background: var(--night-mid);
	}

	.takes-tab {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		padding: 0.7rem 0.8rem;
		border-radius: 0.625rem;
		background: var(--lamp-soft);
		color: var(--ink-bright);
		font-size: 0.88rem;
		font-weight: 600;
		box-shadow: inset 0 -2px 0 var(--lamp-glow);
	}

	.takes-icon {
		display: inline-flex;
		flex: 0 0 auto;
		color: var(--lamp-glow);
	}

	.takes-state {
		min-width: 0;
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.64rem;
		letter-spacing: 0.05em;
		text-align: right;
		text-transform: uppercase;
	}

	.takes-body {
		position: relative;
		min-height: 17.2rem;
		padding: 1rem;
		background: radial-gradient(circle at 50% 50%, var(--lamp-soft), transparent 64%);
	}

	.takes-shell.is-revealed .takes-body {
		background: color-mix(in srgb, var(--night-deep) 72%, var(--stone-warm));
	}

	.reveal-intro {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(14rem, 0.8fr);
		align-items: end;
		gap: 1.5rem;
		padding: 0.3rem 0.15rem 1rem;
		border-bottom: 1px solid var(--stone-edge);
	}

	.reveal-intro span,
	.discussion-door__copy > span {
		color: var(--lamp-glow);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.64rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.reveal-intro h4,
	.discussion-door h4 {
		margin: 0.35rem 0 0;
		color: var(--ink-bright);
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.015em;
	}

	.reveal-intro p {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.78rem;
		line-height: 1.5;
	}

	.discussion-takes {
		display: grid;
		gap: 0.7rem;
		margin-top: 0.85rem;
	}

	.blurred-perspectives {
		display: grid;
		gap: 0.7rem;
		filter: blur(5px);
		opacity: 0.38;
		pointer-events: none;
		transform: scale(0.985);
		user-select: none;
	}

	.lock-message {
		position: absolute;
		inset: 50% auto auto 50%;
		display: flex;
		align-items: center;
		gap: 0.7rem;
		width: min(calc(100% - 2rem), 22rem);
		padding: 0.9rem 1rem;
		transform: translate(-50%, -50%);
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 24%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--stone-warm) 96%, var(--night-deep));
		color: var(--ink-mid);
		font-size: 0.8rem;
		line-height: 1.45;
		box-shadow: var(--shadow-sm);
	}

	.lock-icon {
		display: grid;
		width: 2.25rem;
		height: 2.25rem;
		flex: 0 0 2.25rem;
		place-items: center;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--night-mid);
		color: var(--lamp-glow);
	}

	.lock-message strong {
		display: block;
		color: var(--ink-bright);
	}

	.perspectives {
		display: grid;
		gap: 0.7rem;
	}

	.chorus-perspectives {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.perspective {
		position: relative;
		overflow: hidden;
		padding: 1rem 1rem 1rem 1.15rem;
		border: 1px solid color-mix(in srgb, var(--perspective-color) 38%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--perspective-color) 8%, var(--stone-warm));
	}

	.perspective::before {
		position: absolute;
		inset: 0 auto 0 0;
		width: 3px;
		background: var(--perspective-color);
		content: '';
	}

	.perspective-label {
		color: var(--perspective-color);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.65rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.perspective-meta {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.perspective p {
		margin: 0.45rem 0 0;
		color: var(--ink-bright);
		font-size: 0.83rem;
		line-height: 1.45;
	}

	.perspective--anger {
		--perspective-color: var(--preview-anger);
	}

	.perspective--shame {
		--perspective-color: var(--preview-shame);
	}

	.perspective--fear {
		--perspective-color: var(--preview-fear);
	}

	.discussion-door {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 1.5rem;
		padding: 1.35rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 34%, var(--stone-edge));
		border-radius: 1rem;
		background:
			radial-gradient(
				circle at 92% 50%,
				color-mix(in srgb, var(--lamp-glow) 12%, transparent),
				transparent 38%
			),
			var(--stone-warm);
	}

	.discussion-door h4 {
		font-size: 1.2rem;
	}

	.discussion-door p {
		max-width: 43rem;
		margin: 0.45rem 0 0;
		color: var(--ink-mid);
		font-size: 0.84rem;
		line-height: 1.55;
	}

	:global(.home-reimagined .discussion-door .btn-label) {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.proof-card-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 0.85rem 0.2rem 0;
		border-top: 1px solid var(--stone-edge);
	}

	.proof-card-foot p {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.78rem;
	}

	.proof-card-foot strong {
		color: var(--ink-bright);
	}

	.centers-section {
		position: relative;
		padding: clamp(5.5rem, 10vw, 9.5rem) 0;
		background: var(--night-deep);
	}

	.center-orbit {
		position: absolute;
		top: 13rem;
		left: 50%;
		width: min(76vw, 64rem);
		aspect-ratio: 1;
		transform: translateX(-50%);
		border: 1px solid color-mix(in srgb, var(--stone-edge) 24%, transparent);
		border-radius: 9999px;
		background: radial-gradient(circle, var(--data-teal-rgba), transparent 63%);
		pointer-events: none;
	}

	.centers-heading {
		position: relative;
		max-width: 62rem;
		margin: 0 auto clamp(3rem, 6vw, 5rem);
		text-align: center;
	}

	.centers-heading > p {
		margin-inline: auto;
	}

	.center-grid {
		position: relative;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.center-card {
		--center-color: var(--lamp-glow);
		--center-soft: var(--lamp-soft);
		min-width: 0;
		padding: clamp(1.4rem, 3vw, 2.25rem);
		border: 1px solid color-mix(in srgb, var(--center-color) 34%, var(--stone-edge));
		border-radius: 1rem;
		background: linear-gradient(180deg, var(--center-soft), transparent 44%), var(--stone-warm);
	}

	.center--anger {
		--center-color: var(--preview-anger);
		--center-soft: var(--preview-anger-soft);
	}

	.center--shame {
		--center-color: var(--preview-shame);
		--center-soft: var(--preview-shame-soft);
	}

	.center--fear {
		--center-color: var(--preview-fear);
		--center-soft: var(--preview-fear-soft);
	}

	.center-card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.center-index {
		color: var(--center-color);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
	}

	.center-types {
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.65rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.center-label {
		margin: clamp(2.8rem, 6vw, 5.25rem) 0 0.5rem;
		color: var(--ink-dim);
		font-size: 0.74rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.center-card h3 {
		margin: 0;
		color: var(--center-color);
		font-size: clamp(2.15rem, 4vw, 3.6rem);
		font-weight: 760;
		letter-spacing: -0.045em;
	}

	.center-question {
		min-height: 6.2rem;
		margin: 1.1rem 0 0;
		color: var(--ink-bright);
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.5;
	}

	.center-detail {
		margin: 1.4rem 0 0;
		padding-top: 1.2rem;
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 64%, transparent);
		color: var(--ink-mid);
		font-size: 0.88rem;
		line-height: 1.62;
	}

	.centers-note {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin: 2rem 0 0;
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-align: center;
		text-transform: uppercase;
	}

	.centers-note span {
		width: 0.35rem;
		height: 0.35rem;
		border-radius: 9999px;
		background: var(--data-teal);
	}

	.paths-section {
		padding: clamp(5rem, 9vw, 8.5rem) 0;
		border-block: 1px solid color-mix(in srgb, var(--stone-edge) 64%, transparent);
		background: var(--night-mid);
	}

	.paths-heading {
		display: grid;
		grid-template-columns: 0.42fr 1.58fr;
		align-items: end;
		gap: 2rem;
		margin-bottom: clamp(2.5rem, 5vw, 4rem);
	}

	.paths-heading h2 {
		margin: 0;
	}

	.path-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.path-card {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 1.5rem;
		min-width: 0;
		padding: clamp(1.5rem, 4vw, 2.5rem);
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 28%, var(--stone-edge));
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.path-card--data {
		border-color: color-mix(in srgb, var(--data-teal) 34%, var(--stone-edge));
	}

	.path-number {
		display: grid;
		width: 2.75rem;
		height: 2.75rem;
		place-items: center;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		color: var(--lamp-glow);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.8rem;
		background: var(--night-mid);
	}

	.path-card--data .path-number {
		color: var(--data-teal);
	}

	.path-label {
		margin: 0;
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.path-content h3 {
		margin: 0.8rem 0 0;
		color: var(--ink-bright);
		font-size: clamp(1.75rem, 3vw, 2.55rem);
		font-weight: 720;
		letter-spacing: -0.035em;
		line-height: 1.08;
	}

	.path-content > p:not(.path-label) {
		max-width: 34rem;
		min-height: 5.5rem;
		margin: 1rem 0 1.75rem;
		color: var(--ink-mid);
		font-size: 0.98rem;
		line-height: 1.65;
	}

	.final-section {
		position: relative;
		padding: clamp(6rem, 12vw, 11rem) 0 3rem;
		background: var(--night-deep);
	}

	.final-pool {
		position: absolute;
		top: 2rem;
		left: 50%;
		width: min(78vw, 60rem);
		height: 34rem;
		transform: translateX(-50%);
		background: radial-gradient(ellipse, rgba(245, 158, 11, 0.14), transparent 66%);
		pointer-events: none;
	}

	.final-inner {
		position: relative;
	}

	.final-copy {
		max-width: 68rem;
		margin: 0 auto;
		text-align: center;
	}

	.final-copy h2 {
		margin: 1.35rem auto 1.2rem;
		color: var(--ink-bright);
		font-size: clamp(3rem, 7vw, 6.5rem);
		font-weight: 790;
		letter-spacing: -0.06em;
		line-height: 0.96;
		text-wrap: balance;
	}

	.final-copy p {
		margin: 0 0 2rem;
		color: var(--ink-mid);
		font-size: 1.1rem;
	}

	.deeper-row {
		display: grid;
		grid-template-columns: 0.7fr repeat(3, 1fr);
		align-items: center;
		margin-top: clamp(5rem, 10vw, 9rem);
		border-block: 1px solid color-mix(in srgb, var(--stone-edge) 64%, transparent);
	}

	.deeper-label,
	.deeper-row a {
		padding: 1.25rem 1rem;
	}

	.deeper-label {
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.deeper-row a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		border-left: 1px solid color-mix(in srgb, var(--stone-edge) 64%, transparent);
		color: var(--ink-mid);
		font-size: 0.84rem;
		text-decoration: none;
	}

	:global(.home-reimagined .deeper-row a:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: -2px;
	}

	@media (prefers-reduced-motion: no-preference) {
		.takes-shell,
		.perspective,
		.deeper-row a {
			transition:
				opacity 280ms ease,
				background-color 180ms ease,
				border-color 180ms ease,
				color 180ms ease;
		}

		.takes-shell.is-revealed .perspective {
			animation: perspective-enter 420ms both;
		}

		.takes-shell.is-revealed .perspective:nth-child(2) {
			animation-delay: 70ms;
		}

		.takes-shell.is-revealed .perspective:nth-child(3) {
			animation-delay: 140ms;
		}

		.deeper-row a:hover {
			background: var(--stone-warm);
			color: var(--ink-bright);
		}
	}

	@keyframes perspective-enter {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@media (max-width: 72rem) {
		.hero-grid {
			grid-template-columns: minmax(17rem, 0.72fr) minmax(30rem, 1.28fr);
			gap: 3rem;
		}

		.proof-layout {
			grid-template-columns: 1fr;
		}

		.proof-heading {
			max-width: 52rem;
		}
	}

	@media (max-width: 61rem) {
		.hero-grid {
			grid-template-columns: 1fr;
		}

		.hero-copy {
			max-width: 48rem;
		}

		.hero h1 {
			max-width: 11ch;
		}

		.center-grid,
		.path-grid {
			grid-template-columns: 1fr;
		}

		.center-question,
		.path-content > p:not(.path-label) {
			min-height: auto;
		}

		.center-label {
			margin-top: 2.5rem;
		}

		.paths-heading {
			grid-template-columns: 1fr;
		}

		.deeper-row {
			grid-template-columns: 1fr 1fr;
		}

		.deeper-row a:nth-of-type(2) {
			border-left: 0;
		}

		.deeper-row a:nth-of-type(3) {
			border-top: 1px solid color-mix(in srgb, var(--stone-edge) 64%, transparent);
		}
	}

	@media (max-width: 46rem) {
		.shell {
			width: min(100% - 2rem, 86rem);
		}

		.hero {
			padding-top: 4.25rem;
		}

		.hero h1 {
			font-size: clamp(3rem, 15vw, 4.35rem);
		}

		.hero-action {
			align-items: flex-start;
			flex-direction: column;
		}

		.hero-action p {
			padding-left: 0.1rem;
		}

		.proof-meta {
			align-items: flex-start;
			flex-direction: column;
		}

		.question-display-card {
			padding-inline: 1.1rem;
		}

		.composer-footer {
			align-items: stretch;
			flex-direction: column;
		}

		.answer-foot {
			width: 100%;
		}

		.composer-action {
			display: grid;
		}

		:global(.home-reimagined .composer-action .btn) {
			width: 100%;
		}

		.takes-state {
			max-width: 7.5rem;
		}

		.chorus-perspectives,
		.reveal-intro,
		.discussion-door {
			grid-template-columns: 1fr;
		}

		.discussion-door {
			align-items: stretch;
		}

		:global(.home-reimagined .discussion-door .btn) {
			width: 100%;
		}

		.proof-card-foot {
			align-items: stretch;
			flex-direction: column;
		}

		.center-card,
		.path-card {
			padding: 1.25rem;
		}

		.path-card {
			grid-template-columns: 1fr;
		}

		.center-orbit {
			display: none;
		}

		.deeper-row {
			grid-template-columns: 1fr;
		}

		.deeper-label {
			padding-bottom: 0.75rem;
		}

		.deeper-row a,
		.deeper-row a:nth-of-type(2),
		.deeper-row a:nth-of-type(3) {
			border-top: 1px solid color-mix(in srgb, var(--stone-edge) 64%, transparent);
			border-left: 0;
		}
	}

	@media (max-width: 25rem) {
		.proof-line {
			align-items: flex-start;
			flex-direction: column;
		}

		.question-display-card h3 {
			font-size: 1.85rem;
		}

		.answer-foot {
			grid-template-columns: 1fr;
		}

		.character-budget {
			width: 100%;
			justify-items: start;
		}
	}
</style>

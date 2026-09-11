<!-- src/lib/components/marketing/HomeLandingV2.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { resolve } from '$app/paths';
	import {
		ArrowRight,
		ArrowUpRight,
		Check,
		ChevronDown,
		LockKeyhole,
		RotateCcw
	} from '@lucide/svelte';
	import { Button } from '$lib/components/atoms';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import ThemeToggle from '$lib/components/atoms/ThemeToggle.svelte';
	import { faqs, practiceQuestions } from '$lib/data/homepagePracticeV2';
	import type { CommunityProof } from '$lib/data/homepageCommunity';
	import ConversationScenes from './ConversationScenes.svelte';

	let { preview = false }: { preview?: boolean } = $props();

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
	title={preview
		? 'Harry Dry V2 — 1 question. 9 perspectives. | 9takes'
		: '1 Question, 9 Perspectives | 9takes'}
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

{#snippet communityFallback()}
	<div class="community-fallback">
		<h3>Your next perspective starts with a question.</h3>
		<p>Explore the live questions and add your own answer.</p>
		<a class="text-link" href={resolve('/questions')}
			>Browse questions <ArrowRight size={16} aria-hidden="true" /></a
		>
	</div>
{/snippet}

<div class="dry-home">
	{#if preview}
		<header class="home-nav shell">
			<a class="home-brand" href={resolve('/')} aria-label="9takes home">9takes<span>V2</span></a>
			<nav aria-label="Version comparison">
				<a href={resolve('/design-preview/harry-dry')}
					>Compare V1 <ArrowUpRight size={13} aria-hidden="true" /></a
				>
				<ThemeToggle />
			</nav>
		</header>
	{/if}

	<section class="hero shell" aria-labelledby="hero-title">
		<div class="hero-copy">
			<h1 id="hero-title">1 question.<br /><span>9 perspectives.</span></h1>
			<p class="hero-benefit">Understand why someone else’s reaction makes sense to them.</p>
			<p class="hero-explanation">
				A question-and-answer community for seeing things differently. Try it privately. Then join a
				real conversation.
			</p>
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

		<div class="question-panel ph-no-capture" id="try-a-question">
			<div class="panel-topline">
				<span class="mono">YOUR FIRST REACTION</span><span class="private-label"
					><LockKeyhole size={13} aria-hidden="true" /> Private practice</span
				>
			</div>
			{#if !revealed}
				<form onsubmit={revealPerspectives}>
					<h2 id="practice-question">{question.question}</h2>
					<p class="answer-reason" id="answer-reason">
						Write yours first, before another take shapes it.
					</p>
					<label class="answer-label" for="practice-answer"
						>Your answer <span id="answer-hint">{question.hint}</span></label
					>
					<textarea
						id="practice-answer"
						bind:this={composer}
						bind:value={answer}
						maxlength="600"
						rows="3"
						aria-labelledby="practice-question"
						aria-describedby={error
							? 'answer-reason answer-hint practice-privacy practice-source practice-error'
							: 'answer-reason answer-hint practice-privacy practice-source'}
						aria-invalid={!!error}
						placeholder="What comes to mind first?"
						oninput={() => (error = '')}></textarea>
					{#if error}<p class="form-error" id="practice-error" role="alert">{error}</p>{/if}
					<p class="privacy" id="practice-privacy">
						<LockKeyhole size={13} aria-hidden="true" /> Stays in this tab. Nothing is posted.
					</p>
					<Button type="submit" size="lg" fullWidth class="reveal-button"
						>Reveal 9 perspectives <ArrowRight size={17} aria-hidden="true" /></Button
					>
					<p class="source-note" id="practice-source">
						You’ll compare 9 AI-written examples. Your answer stays private and doesn’t change the
						examples.
					</p>
				</form>
			{:else}
				<div class="answer-receipt">
					<div class="receipt-icon"><Check size={23} aria-hidden="true" /></div>
					<h2>Your first take is yours.</h2>
					<p class="receipt-question">{question.question}</p>
					<blockquote>{submittedAnswer}</blockquote>
					<p class="privacy">Still private. Saved only until this page refreshes.</p>
					<Button variant="secondary" onclick={editAnswer}>Edit my answer</Button>
				</div>
			{/if}
			<div class="panel-footer">
				<span>No account</span><span>No type knowledge</span><span>Just curiosity</span>
			</div>
		</div>
	</section>

	{#if revealed}
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
					<p class="mono">YOUR STARTING POINT · STILL PRIVATE</p>
					<blockquote>{submittedAnswer}</blockquote>
				</div>
				<Button variant="ghost" size="sm" onclick={editAnswer}>Edit answer</Button>
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
						href={question.liveSlug
							? resolve('/questions/[slug]', { slug: question.liveSlug })
							: resolve('/questions')}
						>{question.liveSlug
							? 'Join the friendship conversation'
							: 'Find a live question'}<ArrowUpRight size={15} aria-hidden="true" /></Button
					>
					<Button variant="secondary" onclick={tryAnother}
						><RotateCcw size={16} aria-hidden="true" />{nextQuestionLabel}</Button
					>
				</div>
			</div>
		</section>
	{/if}

	<div class="ritual-strip">
		<ol class="shell">
			<li><span>01</span> Your own reaction.</li>
			<li><span>02</span> Get a different perspective.</li>
			<li><span>03</span> Ask a better question.</li>
		</ol>
	</div>

	<section class="why-section section shell" id="community" aria-labelledby="why-title">
		<ConversationScenes />
		<div class="why-copy">
			<h2 id="why-title">Practice here.<br />Then join the conversation.</h2>
			<p>
				The practice examples are a starting point. On 9takes, people bring their own answers to
				questions about friendship, work, and the things they don’t always say out loud.
			</p>
			<p>
				You answer before seeing the replies. Then compare what mattered to you with what mattered
				to someone else.
			</p>
			<p class="why-close">
				The Enneagram’s 9 patterns of motivation give you another way to explore the difference. You
				don’t need to know your type to begin.
			</p>
			<a class="text-link" href={resolve('/questions')}
				>Find a question that gets you thinking <ArrowRight size={16} aria-hidden="true" /></a
			>
		</div>
		<div class="community-window" aria-label="Live questions on 9takes">
			<div class="community-window-top">
				<span class="mono">IN THE COMMUNITY</span><span>Real questions. Your own words.</span>
			</div>
			{#if proof && proof.questions.length > 0}
				<div class="community-questions">
					{#each proof.questions as thread (thread.slug)}
						<a
							class="community-question"
							href={resolve('/questions/[slug]', { slug: thread.slug })}
						>
							<span class="response-count"
								>{thread.responses > 0
									? `${thread.responses} ${thread.responses === 1 ? 'response' : 'responses'}`
									: 'Be the first to answer'}</span
							>
							<h3>{thread.title}</h3>
							<span class="thread-action"
								>Add your perspective <ArrowUpRight size={16} aria-hidden="true" /></span
							>
						</a>
					{/each}
				</div>
			{:else}
				{@render communityFallback()}
			{/if}
			<p class="community-window-note">
				Live community responses are separate from the AI-written practice. The number of responses
				and types varies by question.
			</p>
		</div>
	</section>

	<section class="reading-section section shell" aria-labelledby="reading-title">
		<div class="reading-heading">
			<div>
				<h2 id="reading-title">People are more interesting<br />than their labels.</h2>
			</div>
			<p>Read the thinking behind 9takes.<br />Then try it on a situation you know.</p>
		</div>
		<div class="reading-links">
			<a href={resolve('/personality-analysis')}
				><span class="mono">PEOPLE YOU KNOW</span>
				<h3>What drives the people everyone talks about?</h3>
				<span>Explore personality analyses <ArrowUpRight size={17} aria-hidden="true" /></span></a
			>
			<a href={resolve('/how-to-guides')}
				><span class="mono">SITUATIONS YOU RECOGNIZE</span>
				<h3>Put a different perspective to work in your own life.</h3>
				<span>Read practical guides <ArrowUpRight size={17} aria-hidden="true" /></span></a
			>
			<a href={resolve('/book-session')}
				><span class="mono">SOMETHING MORE PERSONAL</span>
				<h3>Bring a real situation you’re trying to understand.</h3>
				<span>Join the coaching waitlist <ArrowUpRight size={17} aria-hidden="true" /></span></a
			>
		</div>
	</section>

	<section class="faq-section section shell" aria-labelledby="faq-title">
		<div>
			<h2 id="faq-title">Before you jump in.</h2>
		</div>
		<div class="faqs">
			{#each faqs as faq (faq.question)}<details>
					<summary>{faq.question}<ChevronDown size={18} aria-hidden="true" /></summary>
					<p>{faq.answer}</p>
				</details>{/each}
		</div>
	</section>

	<section class="founder-section section shell" aria-labelledby="founder-title">
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
				<img
					src="/brand/djface.webp"
					alt="DJ Wayne, founder of 9takes"
					width="56"
					height="56"
					loading="lazy"
				/>
				<div>
					<p class="mono">DJ WAYNE · FOUNDER</p>
					<a href={resolve('/about')}>Read my story <ArrowUpRight size={14} aria-hidden="true" /></a
					>
				</div>
			</div>
		</div>
		<div class="closing">
			<h2>See the emotions<br />behind every take.</h2>
			<p>
				{revealed
					? 'You’ve seen what another perspective can open up. Bring yours to a real conversation.'
					: 'Start with your own answer. See what someone else might be seeing.'}
			</p>
			{#if revealed}
				<Button
					size="lg"
					href={question.liveSlug
						? resolve('/questions/[slug]', { slug: question.liveSlug })
						: resolve('/questions')}
					>Join a real conversation <ArrowRight size={17} aria-hidden="true" /></Button
				>
			{:else}
				<Button size="lg" onclick={focusAnswer}
					>Start with your take <ArrowRight size={17} aria-hidden="true" /></Button
				>
			{/if}
		</div>
	</section>
</div>

<style lang="scss">
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
		font-size: 11px;
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
	.home-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-sm);
		min-height: 72px;
		padding-block: var(--space-sm);
		color: var(--ink-mid);
		font-size: 12px;
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
		font-size: 24px;
		font-weight: 750;
		letter-spacing: -0.06em;
	}
	.home-brand span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		font-weight: 500;
		letter-spacing: 0.04em;
		color: var(--lamp-glow);
	}
	.home-nav nav > a {
		min-height: 44px;
		color: var(--ink-mid);
	}
	.next-actions :global(.btn) {
		white-space: normal;
	}
	.hero {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: var(--space-3xl);
		padding-block: var(--space-3xl);
	}
	.hero-copy {
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
		max-width: 25ch;
		letter-spacing: -0.015em;
	}
	.hero-explanation {
		margin-top: var(--space-md);
		max-width: 44ch;
		font-size: 16px;
		line-height: 1.6;
		color: var(--ink-mid);
	}
	.perspective-visual {
		margin: var(--space-xl) 0 0;
		max-width: 540px;
	}
	.perspective-visual figcaption {
		font-size: 11px;
		font-family: 'JetBrains Mono', monospace;
		font-style: normal;
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
		font-size: 15px;
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
		font-size: 21px;
		line-height: 1.2;
		font-weight: 600;
		letter-spacing: -0.03em;
	}
	.could-mean {
		margin-top: var(--space-sm);
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
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
		padding: 0;
		list-style: none;
	}
	.thought-cloud li {
		max-width: 100%;
		margin: 0;
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
		margin-top: var(--space-md);
		font-size: 11px;
		color: var(--ink-mid);
	}
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
	.private-label {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 11px;
		white-space: nowrap;
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
		margin-bottom: var(--space-xl);
	}
	.answer-label {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs) var(--space-sm);
		justify-content: space-between;
		font-size: 12px;
		font-weight: 600;
		margin-bottom: var(--space-sm);
	}
	.answer-label span {
		color: var(--ink-mid);
		font-weight: 400;
	}
	textarea {
		display: block;
		width: 100%;
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
	.privacy {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 12px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin-block: var(--space-md) var(--space-lg);
	}
	.privacy :global(svg) {
		flex-shrink: 0;
	}
	.source-note {
		font-size: 12px;
		line-height: 1.5;
		color: var(--ink-mid);
		margin-top: var(--space-md);
	}
	.form-error {
		color: var(--error-text);
		font-size: 13px;
		margin-top: var(--space-sm);
	}
	.panel-footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-lg);
		border-top: 1px solid var(--stone-edge);
		padding: var(--space-md);
		font-size: 11px;
		color: var(--ink-mid);
	}
	.panel-footer span + span::before {
		content: '·';
		margin-right: var(--space-lg);
	}
	.receipt-icon {
		color: var(--lamp-glow);
		margin-bottom: var(--space-md);
	}
	.receipt-question {
		color: var(--ink-mid);
		font-size: 13px;
	}
	.answer-receipt h2 {
		margin-bottom: var(--space-md);
	}
	.answer-receipt blockquote {
		margin-top: var(--space-lg);
		font-size: 20px;
		line-height: 1.5;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}
	.reveal-section {
		border-top: 1px solid var(--stone-edge);
		padding-top: var(--space-3xl);
	}
	.section-heading h2 {
		scroll-margin-top: 110px;
		font-size: clamp(30px, 3vw, 42px);
		line-height: 1.1;
		letter-spacing: -0.04em;
		margin-top: 0;
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
		font-size: 12px;
		margin-top: var(--space-xl);
	}
	.dry-home :global(.reveal-button) {
		white-space: normal;
		min-height: 48px;
	}
	.dry-home :global(.btn-label) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
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
		font-size: 26px;
		letter-spacing: -0.02em;
		line-height: 1.4;
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
		font-size: 15px;
		line-height: 1.65;
	}
	.example-label {
		margin-top: var(--space-xl);
		font-size: 11px;
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
		font-size: 20px;
		line-height: 1.5;
		max-width: 70ch;
	}
	.type-note {
		color: var(--ink-mid);
		font-size: 12px;
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
	.ritual-strip {
		border-block: 1px solid var(--stone-edge);
	}
	.ritual-strip ol {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-xl);
		padding-block: var(--space-xl);
	}
	.ritual-strip li {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		font-size: 13px;
	}
	.ritual-strip li span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
		color: var(--lamp-glow);
	}
	.why-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: var(--space-3xl);
	}
	.founder-story h2,
	.why-copy h2,
	.reading-heading h2,
	.faq-section h2,
	.closing h2 {
		font-size: clamp(30px, 3.2vw, 44px);
		letter-spacing: -0.04em;
		line-height: 1.15;
		margin-top: 0;
	}
	.why-copy > p {
		font-size: 16px;
		line-height: 1.7;
		margin-top: var(--space-xl);
	}
	.why-copy .why-close {
		color: var(--ink-mid);
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
		font-size: 15px;
		line-height: 1.6;
	}
	.reading-links {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
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
		font-size: 21px;
		font-weight: 550;
		letter-spacing: -0.03em;
		line-height: 1.35;
		margin-block: var(--space-lg) var(--space-xl);
	}
	.reading-links > a > span:last-child {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		color: var(--lamp-glow);
		font-size: 13px;
		min-height: 44px;
	}
	.faq-section {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: var(--space-3xl);
		border-top: 1px solid var(--stone-edge);
	}
	details {
		border-bottom: 1px solid var(--stone-edge);
	}
	summary {
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-lg);
		cursor: pointer;
		padding-block: var(--space-xl);
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
		font-size: 15px;
		line-height: 1.7;
		color: var(--ink-mid);
		padding-bottom: var(--space-xl);
	}
	.founder-section {
		border-top: 1px solid var(--stone-edge);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3xl);
	}
	.founder {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}
	.founder img {
		border-radius: 50%;
		object-fit: cover;
	}
	.founder .mono {
		color: var(--ink-mid);
		margin-bottom: var(--space-sm);
	}
	.founder a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 13px;
		color: var(--ink-bright);
		min-height: 44px;
	}
	.closing h2 {
		margin-top: 0;
	}
	.closing > p {
		margin-block: var(--space-lg) var(--space-xl);
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
			gap: var(--space-2xl);
		}
		h1 {
			font-size: 45px;
		}
		.hero-benefit {
			font-size: 20px;
		}
		.perspective-visual {
			margin-top: var(--space-xl);
		}
		.perspective-sketch {
			grid-template-columns: 104px 40px minmax(0, 1fr);
		}
		.spoken-words strong {
			font-size: 18px;
		}
		.possible-meanings p {
			font-size: 14px;
		}
		.panel-topline {
			padding-inline: var(--space-lg);
		}
		form,
		.answer-receipt {
			padding: var(--space-lg);
		}
		.reading-links {
			gap: var(--space-xl);
		}
		.panel-footer {
			gap: var(--space-sm);
		}
		.panel-footer span + span::before {
			margin-right: var(--space-sm);
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
			font-size: 11px;
			min-height: 64px;
		}
		.home-nav nav {
			gap: var(--space-sm);
		}
		.hero {
			grid-template-columns: 1fr;
			gap: var(--space-xl);
			padding-block: var(--space-lg) var(--space-2xl);
		}
		h1 {
			font-size: clamp(35px, 8.8vw, 52px);
			margin-top: 0;
			line-height: 1.02;
		}
		.hero-benefit {
			font-size: 18px;
			max-width: 32ch;
			margin-top: var(--space-md);
		}
		.hero-explanation {
			display: block;
			font-size: 13px;
			line-height: 1.45;
			margin-top: var(--space-sm);
		}
		.perspective-visual {
			margin-top: var(--space-md);
		}
		.perspective-visual figcaption {
			font-size: 9px;
			margin-bottom: var(--space-sm);
		}
		.spoken-words {
			padding: var(--space-sm) var(--space-md);
		}
		.spoken-words strong {
			font-size: 17px;
		}
		.possible-meanings {
			gap: var(--space-sm);
		}
		.meaning-title {
			font-size: 13px;
		}
		.thought-cloud {
			margin-top: var(--space-sm);
			gap: 6px;
		}
		.thought-cloud li {
			font-size: 11px;
			padding: 5px 9px;
		}
		.thought-cloud li:nth-child(2),
		.thought-cloud li:nth-child(3) {
			margin-left: 0;
			margin-right: 0;
		}
		form h2 {
			font-size: 25px;
			margin-bottom: var(--space-sm);
		}
		.panel-topline {
			padding-block: var(--space-md);
		}
		.panel-footer {
			padding-block: var(--space-sm);
		}
		.answer-label span {
			font-size: 11px;
		}
		textarea {
			min-height: 72px;
			height: 72px;
		}
		.ritual-strip ol {
			grid-template-columns: 1fr;
			gap: var(--space-md);
			padding-block: var(--space-xl);
		}
		.ritual-strip li {
			font-size: 14px;
		}
		.why-section {
			grid-template-columns: 1fr;
			gap: var(--space-2xl);
		}
		.reading-heading {
			display: block;
		}
		.reading-heading > p {
			margin-top: var(--space-lg);
		}
		.reading-links {
			grid-template-columns: 1fr;
			gap: var(--space-xl);
			margin-top: var(--space-2xl);
		}
		.reading-links h3 {
			margin-block: var(--space-md);
		}
		.faq-section {
			grid-template-columns: 1fr;
			gap: var(--space-xl);
		}
		.founder-section {
			flex-direction: column;
			align-items: start;
		}
		.comparison {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
		}
		.perspective-card {
			padding: var(--space-xl);
		}
		.perspective-card blockquote {
			font-size: 23px;
		}
		.perspective-picker {
			display: none;
		}
		.mobile-picker {
			display: grid;
			gap: var(--space-sm);
			margin-block: var(--space-lg) var(--space-xl);
			font-size: 12px;
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
			font-size: 17px;
		}
		.next-actions {
			flex-direction: column;
			width: 100%;
		}
		.section-heading h2 {
			scroll-margin-top: 88px;
		}
	}
	@media (max-width: 380px) {
		.shell {
			padding-inline: var(--space-lg);
		}
		.private-label {
			font-size: 10px;
		}
		.panel-topline .mono {
			font-size: 10px;
		}
		.hero-benefit {
			font-size: 17px;
		}
	}

	.answer-reason {
		margin: -16px 0 var(--space-lg);
		color: var(--ink-mid);
		font-size: 13px;
		line-height: 1.5;
	}
	.community-signal-slot {
		min-height: 44px;
		margin-top: var(--space-xl);
	}
	.community-signal {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		margin-top: 0;
		min-height: 44px;
		color: var(--ink-mid);
		font-size: 12px;
		line-height: 1.5;
	}
	.community-signal > span:last-child {
		display: inline;
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
	.community-window {
		min-width: 0;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		overflow: hidden;
		background: var(--night-mid);
	}
	.community-window-top {
		display: grid;
		gap: var(--space-xs);
		padding: var(--space-xl);
		border-bottom: 1px solid var(--stone-edge);
	}
	.community-window-top .mono {
		color: var(--lamp-glow);
	}
	.community-window-top > span:last-child {
		font-size: 12px;
		color: var(--ink-mid);
	}
	.community-question {
		display: block;
		padding: var(--space-xl);
		color: var(--ink-bright);
		transition: background 0.15s;
	}
	.community-question + .community-question {
		border-top: 1px solid var(--stone-edge);
	}
	.community-question:hover {
		background: var(--stone-warm);
	}
	.response-count {
		font-size: 11px;
		color: var(--ink-mid);
	}
	.community-question h3 {
		font-size: 22px;
		font-weight: 550;
		line-height: 1.3;
		letter-spacing: -0.025em;
		margin-top: var(--space-sm);
		overflow-wrap: anywhere;
	}
	.thread-action {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
		color: var(--lamp-glow);
		font-size: 12px;
		margin-top: var(--space-lg);
	}
	.thread-action :global(svg) {
		flex-shrink: 0;
	}
	.community-window-note {
		padding: var(--space-lg) var(--space-xl);
		border-top: 1px solid var(--stone-edge);
		font-size: 11px;
		line-height: 1.6;
		color: var(--ink-mid);
	}
	.community-fallback {
		padding: var(--space-xl);
	}
	.community-fallback p {
		margin-top: var(--space-md);
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-mid);
	}
	.founder-section {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		align-items: center;
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
		font-size: 15px;
		line-height: 1.7;
		color: var(--ink-mid);
		margin-top: var(--space-md);
	}
	.founder {
		margin-top: var(--space-xl);
	}
	.founder img {
		flex-shrink: 0;
	}
	.closing {
		min-width: 0;
	}
	.closing p {
		max-width: 35ch;
		line-height: 1.6;
	}
	@media (max-width: 760px) {
		.hero {
			gap: var(--space-lg);
		}
		.answer-reason {
			margin: 0 0 var(--space-md);
			font-size: 12px;
		}
		.community-signal-slot {
			min-height: 32px;
			margin-top: var(--space-xs);
		}
		.community-signal {
			margin-top: 0;
			min-height: 32px;
			font-size: 11px;
		}
		.founder-section {
			grid-template-columns: 1fr;
		}
		.closing {
			padding-top: var(--space-2xl);
			border-top: 1px solid var(--stone-edge);
			width: 100%;
		}
		.founder-story blockquote {
			font-size: 20px;
		}
		.community-question h3 {
			font-size: 21px;
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

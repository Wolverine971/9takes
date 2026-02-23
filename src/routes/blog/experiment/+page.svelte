<!-- src/routes/blog/experiment/+page.svelte -->
<script lang="ts">
	import { stemmer } from 'stemmer';
	import { supabase } from '$lib/supabase';
	import { emotionsMap, type RootEmotion } from './emotionsMap';

	type Categories = Record<RootEmotion | 'other', string[]>;

	let emotionInput = $state('');
	let hasSubmitted = $state(false);
	let categories = $state<Categories>({ anger: [], fear: [], shame: [], other: [] });
	let totalCount = $state(0);
	let insertCount = 0;
	let lightboxOpen = $state(false);

	function parseInput(input: string): string[] {
		const seen = new Set<string>();
		return input
			.toLowerCase()
			.split(/[\s,\n\t]+/)
			.map((w) => w.replace(/[^\w-]/g, '').trim())
			.filter((w) => {
				if (w.length < 2 || seen.has(w)) return false;
				seen.add(w);
				return true;
			});
	}

	async function handleSubmit() {
		const words = parseInput(emotionInput);
		if (!words.length) return;

		const result: Categories = { anger: [], fear: [], shame: [], other: [] };
		const unknowns: { word: string; stem: string }[] = [];

		for (const word of words) {
			const stem = stemmer(word);
			const entry = emotionsMap[stem];
			if (entry) {
				result[entry.root].push(word);
			} else {
				result.other.push(word);
				unknowns.push({ word, stem });
			}
		}

		categories = result;
		totalCount = words.length;
		hasSubmitted = true;

		// Track unknown words for future map expansion (max 3 batches per session)
		if (unknowns.length && insertCount < 3) {
			insertCount++;
			try {
				const rows = unknowns.map(({ word, stem }) => ({ word, stem }));
				await (supabase.from as any)('new-words').insert(rows);
			} catch {
				// Non-critical tracking — silent fail
			}
		}
	}

	function reset() {
		hasSubmitted = false;
		categories = { anger: [], fear: [], shame: [], other: [] };
		totalCount = 0;
	}

	const recognizedCount = $derived(
		categories.anger.length + categories.fear.length + categories.shame.length
	);
</script>

<svelte:head>
	<title>Emotions Experiment | Map Your Feelings to 3 Root Emotions | 9takes</title>
	<meta
		name="description"
		content="Take the 1-minute emotions experiment. List negative emotions and discover how they all trace back to three root emotions: anger, fear, and shame. Based on the Enneagram."
	/>
	<meta
		name="keywords"
		content="emotions experiment, emotion analyzer, root emotions, anger fear shame, enneagram emotions, emotional intelligence, 9takes"
	/>
	<meta name="author" content="DJ Wayne" />
	<meta property="og:title" content="Emotions Experiment | Map Your Feelings to 3 Root Emotions" />
	<meta
		property="og:description"
		content="List all the negative emotions you can think of. We'll show you how every single one traces back to anger, fear, or shame."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://9takes.com/blog/experiment" />
	<meta property="og:image" content="https://9takes.com/blogs/experiment.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:title" content="Emotions Experiment | Map Your Feelings to 3 Root Emotions" />
	<meta
		name="twitter:description"
		content="List negative emotions for 60 seconds. Then see how every one maps to anger, fear, or shame."
	/>
	<meta name="twitter:image" content="https://9takes.com/blogs/experiment.webp" />
	<link rel="canonical" href="https://9takes.com/blog/experiment" />
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@graph": [
				{
					"@type": "WebPage",
					"@id": "https://9takes.com/blog/experiment",
					"url": "https://9takes.com/blog/experiment",
					"name": "Emotions Experiment | Map Your Feelings to 3 Root Emotions | 9takes",
					"description": "Take the 1-minute emotions experiment. List negative emotions and discover how they all trace back to three root emotions: anger, fear, and shame.",
					"inLanguage": "en-US",
					"isPartOf": {
						"@type": "WebSite",
						"@id": "https://9takes.com",
						"name": "9takes",
						"url": "https://9takes.com/"
					},
					"author": {
						"@type": "Person",
						"name": "DJ Wayne",
						"sameAs": [
							"https://www.instagram.com/djwayne3/",
							"https://www.youtube.com/@djwayne3",
							"https://www.linkedin.com/in/davidtwayne/",
							"https://twitter.com/djwayne3"
						]
					},
					"dateModified": "2026-02-23",
					"datePublished": "2024-02-01",
					"image": {
						"@type": "ImageObject",
						"height": 900,
						"url": "https://9takes.com/blogs/experiment.webp",
						"width": 900
					},
					"headline": "Emotions Experiment: Map Every Negative Feeling to 3 Root Emotions",
					"publisher": {
						"@type": "Organization",
						"name": "9takes",
						"sameAs": [
							"https://www.instagram.com/9takesdotcom/",
							"https://twitter.com/9takesdotcom"
						],
						"logo": {
							"@type": "ImageObject",
							"url": "https://9takes.com/brand/aero.png"
						}
					}
				}
			]
		}
	</script>
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</svelte:head>

<article class="experiment-page">
	<!-- Hero -->
	<header class="hero">
		<h1>The One-Minute Emotions Experiment</h1>
		<p class="subtitle">
			Every negative emotion you can name traces back to one of three roots.
			<br />Don't believe it? Try it.
		</p>
	</header>

	<!-- The Experiment -->
	<section class="experiment-section">
		<h2>The Experiment</h2>
		<div class="instructions">
			<p>
				Set a timer for <strong>60 seconds</strong>. Write down every
				<span class="underline">negative emotion</span> you can think of — one word each.
			</p>
			<p class="hint">Separate with commas, spaces, or new lines. English only.</p>
		</div>

		<textarea
			name="emotions"
			rows="8"
			placeholder="angry&#10;anxious&#10;ashamed&#10;frustrated&#10;..."
			bind:value={emotionInput}
			disabled={hasSubmitted}
		></textarea>

		<div class="button-row">
			{#if !hasSubmitted}
				<button
					class="btn btn-primary"
					onclick={handleSubmit}
					disabled={!emotionInput.trim().length}
				>
					Categorize My Emotions
				</button>
			{:else}
				<button class="btn btn-secondary" onclick={reset}> Try Again </button>
			{/if}
		</div>
	</section>

	<!-- Results -->
	{#if hasSubmitted}
		<section class="results-section">
			<div class="results-summary">
				<p>
					You listed <strong>{totalCount}</strong> emotions.
					{#if recognizedCount === totalCount}
						<strong>Every single one</strong> maps to anger, fear, or shame.
					{:else if categories.other.length}
						<strong>{recognizedCount}</strong> mapped to the three root emotions.
						{categories.other.length} were unrecognized.
					{/if}
				</p>
			</div>

			<div class="results-grid">
				{#each [{ key: 'anger' as RootEmotion, label: 'Anger', desc: 'Gut / Body Center' }, { key: 'fear' as RootEmotion, label: 'Fear', desc: 'Head / Mind Center' }, { key: 'shame' as RootEmotion, label: 'Shame', desc: 'Heart / Image Center' }] as category, colIdx}
					<div class="result-column result-{category.key}">
						<div class="column-header">
							<h3>{category.label}</h3>
							<span class="column-desc">{category.desc}</span>
							<span class="column-count">{categories[category.key].length}</span>
						</div>
						<div class="chips">
							{#each categories[category.key] as word, i}
								<span
									class="chip chip-{category.key}"
									style="animation-delay: {colIdx * 80 + i * 60}ms"
								>
									{word}
								</span>
							{/each}
							{#if !categories[category.key].length}
								<span class="chip-empty">none listed</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			{#if categories.other.length}
				<div class="result-other">
					<h4>Unrecognized ({categories.other.length})</h4>
					<div class="chips">
						{#each categories.other as word}
							<span class="chip chip-other">{word}</span>
						{/each}
					</div>
					<p class="other-note">
						These words weren't in our dictionary yet. They may still fit one of the three roots —
						try rephrasing them.
					</p>
				</div>
			{/if}
		</section>

		<!-- What This Means -->
		<section class="explanation">
			<h2>What This Reveals</h2>

			<p>
				Every negative emotion you just listed falls into one of three buckets:
				<strong>anger</strong>, <strong>fear</strong>, or <strong>shame</strong>.
			</p>

			<p>
				<strong>Try to think of one that doesn't.</strong> You'll find that if you dig deep enough, every
				negative feeling is a flavor of one of these three.
			</p>

			<hr />

			<p>
				Positive emotions are mostly derivatives of happiness. But happiness doesn't shape
				personality — everyone wants to be happy. It's the pain and discomfort you've been exposed
				to that shapes who you become.
			</p>

			<div class="reflection-questions">
				<h3>Ask yourself:</h3>
				<ul>
					<li>Which of these three root emotions do you feel <em>most regularly</em>?</li>
					<li>Which one feels most <em>familiar</em> — almost like a default?</li>
					<li>Which one seems <em>foreign</em>, like you rarely go there?</li>
				</ul>
			</div>

			<p>
				We all experience the full range of emotions. But there's usually one core emotion you're
				most sensitive to — one you've built coping mechanisms around. The Enneagram calls this your <strong
					>center of intelligence</strong
				>.
			</p>

			<p>
				If you gravitate toward one bucket, that's a clue in
				<a href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
					>determining your Enneagram type</a
				>.
			</p>
		</section>

		<!-- Additional Reading -->
		<section class="additional-reading">
			<h2>Additional Reading</h2>
			<p>How to regulate your emotions:</p>
			<div class="tweet-grid">
				<blockquote class="twitter-tweet">
					<p lang="en" dir="ltr">
						Everyone gets stressed, but not everyone acts the same when stressed.<br /><br />How
						come?<br /><br />Well its because everyone makes the same mistake.<br /><br />Its not
						the situation that stressed you out. Its the emotions that come up because of that
						situation.<br /><br />Let me explain
					</p>
					&mdash; DJocrates (@9takesdotcom)<a
						href="https://twitter.com/9takesdotcom/status/1788777882149425212?ref_src=twsrc%5Etfw"
						>May 10, 2024</a
					>
				</blockquote>
				<blockquote class="twitter-tweet">
					<p lang="en" dir="ltr">
						How To (Actually) Regulate Your Emotions<br /><br />A STEP BY STEP GUIDE:
					</p>
					&mdash; Dr. Nicole LePera (@Theholisticpsyc)<a
						href="https://twitter.com/Theholisticpsyc/status/1717556727510634854?ref_src=twsrc%5Etfw"
						>October 26, 2023</a
					>
				</blockquote>
			</div>
		</section>
	{/if}

	<!-- Color Wheel Analysis (always visible) -->
	<section class="color-wheel-section">
		<h2>The Emotions Color Wheel — and What It Almost Got Right</h2>

		<p>
			You've probably seen the "emotions color wheel" floating around the internet. It does
			something most frameworks miss: it organizes all negative feelings around three core roots — <strong
				>Sad</strong
			>, <strong>Mad</strong>, and <strong>Scared</strong>.
		</p>
		<p>
			These map almost perfectly to the Enneagram's three centers of human experience. Almost. The
			wheel gets two of the three categories right, but fumbles the most important one.
		</p>

		<figure class="color-wheel-figure">
			<button
				class="color-wheel-btn"
				onclick={() => (lightboxOpen = true)}
				type="button"
				aria-label="View full-size emotions color wheel"
			>
				<img
					src="/blogs/emotions-color-wheel.webp"
					alt="Emotions color wheel showing Sad, Mad, and Scared as the three root negative emotions"
					loading="lazy"
				/>
				<span class="expand-hint">Click to expand</span>
			</button>
			<figcaption>The classic emotions color wheel</figcaption>
		</figure>

		{#if lightboxOpen}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="lightbox"
				onclick={() => (lightboxOpen = false)}
				onkeydown={(e) => e.key === 'Escape' && (lightboxOpen = false)}
			>
				<button
					class="lightbox-close"
					onclick={() => (lightboxOpen = false)}
					type="button"
					aria-label="Close">&#10005;</button
				>
				<img src="/blogs/emotions-color-wheel.webp" alt="Emotions color wheel — full size" />
			</div>
		{/if}

		<div class="color-wheel-mapping">
			<div class="triad-box anger-box">
				<h3>Mad = Anger (Gut / Body Center)</h3>
				<p>
					This one the wheel nails. Hurt, hostile, angry, hateful, critical, jealous, frustrated —
					these are all direct expressions of anger. When something violates your boundaries or
					sense of justice, anger is the signal. It's the most legible of the three roots.
				</p>
				<p class="triad-verdict">The wheel gets this right.</p>
			</div>

			<div class="triad-box fear-box">
				<h3>Scared = Fear (Head / Mind Center)</h3>
				<p>
					Confused, helpless, anxious, overwhelmed, insecure — these flow from fear. When the future
					is uncertain, when you feel out of control, when you can't trust what comes next — that's
					fear operating as the root. The head center processes threat, and when it can't resolve
					what it finds, it generates this cluster.
				</p>
				<p class="triad-verdict">The wheel gets this mostly right.</p>
			</div>

			<div class="triad-box shame-box">
				<h3>Sad = Shame (Heart / Image Center)</h3>
				<p>
					Here's where the wheel falls apart. It labels this group "Sad" — but sadness isn't the
					root emotion. <strong>Shame</strong> is. Sadness is what you
					<em>feel</em> when shame is operating underneath. The real question is always:
					<em>"Why are you sad?"</em>
				</p>
				<p>
					Guilty? That's shame about an action. Ashamed? That's shame about who you are. The wheel
					places these under "Sad," but they're clearly shame derivatives.
				</p>
				<p class="triad-verdict">The wheel mislabels this — "Sad" should be "Shame."</p>
			</div>
		</div>

		<div class="wheel-critique">
			<h3>Where the Color Wheel Gets It Wrong</h3>
			<p>
				Beyond the "Sad vs. Shame" mislabel, several words under "Sad" don't belong there at all:
			</p>
			<ul>
				<li>
					<strong>Tired</strong> is not an emotion — it's a physical state. You can be tired
					<em>because of</em> fear (running on adrenaline), anger (bottled tension), or shame (depression
					draining you). But "tired" itself isn't an emotion.
				</li>
				<li>
					<strong>Bored</strong> isn't a root emotion either. It's disengagement — a downstream symptom.
					Why are you bored? Maybe you feel unchallenged (shame — "I'm not good enough to have interesting
					problems"). Maybe something feels off and you can't name it (fear). Boredom always points somewhere
					deeper.
				</li>
				<li>
					<strong>Lonely</strong> is mislabeled as sadness. Loneliness is really
					<em>shame about disconnection</em>. You want attention, company, validation. You feel like
					you don't belong, aren't worth someone's time, can't connect. That's an identity wound —
					shame, not just sadness.
				</li>
				<li>
					<strong>Depressed</strong> is a symptom, not a source. Depression is what happens when one
					of the three root emotions gets compounded over time and you feel stuck. Dig into any case
					of depression and you'll find one of three things:
					<ul class="depression-examples">
						<li>
							<em>"I'm depressed because I have no friends and wish I did"</em> — that's a
							<strong>shame</strong> wound (disconnection, feeling unworthy of belonging)
						</li>
						<li>
							<em>"I'm depressed because the world is so scary and there's nothing I can do"</em>
							— that's <strong>fear</strong> (helplessness, loss of control)
						</li>
						<li>
							<em>"I'm depressed because I got screwed over and nothing will fix it"</em> — that's
							<strong>anger</strong> compounded over time with no outlet
						</li>
					</ul>
					Depression is the<em>result</em>, not the root.
				</li>
			</ul>
		</div>

		<div class="key-insight">
			<h3>The Enneagram's Deeper Insight</h3>
			<p>
				The color wheel shows that negative emotions cluster around three roots. The Enneagram goes
				further: we each have a <strong>dominant</strong> root emotion that shapes how we see the world,
				how we cope, and who we become. Understanding which one runs your operating system is the beginning
				of real self-knowledge.
			</p>
			<div class="centers-grid">
				<div class="center-card center-anger">
					<h4>Body Center (8, 9, 1)</h4>
					<p>Core emotion: <strong>Anger</strong></p>
					<p>Focused on autonomy, boundaries, and justice</p>
				</div>
				<div class="center-card center-fear">
					<h4>Head Center (5, 6, 7)</h4>
					<p>Core emotion: <strong>Fear</strong></p>
					<p>Focused on security, certainty, and preparation</p>
				</div>
				<div class="center-card center-shame">
					<h4>Heart Center (2, 3, 4)</h4>
					<p>Core emotion: <strong>Shame</strong></p>
					<p>Focused on identity, image, and belonging</p>
				</div>
			</div>
		</div>

		<p class="section-cta">
			Ready to find your type?
			<a href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type">Start here.</a>
		</p>
	</section>
</article>

<style lang="scss">
	.experiment-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		color: var(--text-primary);
	}

	/* Hero */
	.hero {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.hero h1 {
		margin-bottom: 0.5rem;
		color: var(--text-primary);
	}

	.subtitle {
		font-size: 1.15rem;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	/* Experiment Section */
	.experiment-section {
		margin-bottom: 2rem;
	}

	.instructions p {
		margin-bottom: 0.5rem;
	}

	.hint {
		font-size: 0.85rem;
		color: var(--text-tertiary);
	}

	.underline {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	textarea {
		width: 100%;
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		padding: 0.75rem;
		font-size: 1rem;
		font-family: inherit;
		resize: vertical;
		min-height: 160px;
		background: var(--void-surface);
		color: var(--text-primary);

		&::placeholder {
			color: var(--text-muted);
		}

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	.button-row {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 0.75rem;
	}

	.btn {
		padding: 0.6rem 1.4rem;
		border: none;
		border-radius: var(--base-border-radius);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s;

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}

		&:hover:not(:disabled) {
			opacity: 0.85;
		}
	}

	.btn-primary {
		background: var(--color-theme-purple, #7c3aed);
		color: white;
	}

	.btn-secondary {
		background: var(--void-elevated);
		color: var(--text-primary);
	}

	/* Results */
	.results-section {
		margin-bottom: 2.5rem;
	}

	.results-summary {
		text-align: center;
		padding: 1rem;
		background: var(--void-surface);
		border-radius: var(--base-border-radius);
		margin-bottom: 1.5rem;
		color: var(--text-primary);
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.result-column {
		border-radius: var(--base-border-radius);
		padding: 1rem;
		border-top: 3px solid;
	}

	.result-anger {
		background: rgba(239, 68, 68, 0.1);
		border-top-color: #ef4444;
	}

	.result-fear {
		background: rgba(245, 158, 11, 0.1);
		border-top-color: #f59e0b;
	}

	.result-shame {
		background: rgba(124, 58, 237, 0.1);
		border-top-color: #7c3aed;
	}

	.column-header {
		margin-bottom: 0.75rem;

		h3 {
			margin: 0;
			font-size: 1.05rem;
			color: var(--text-primary);
		}
	}

	.column-desc {
		display: block;
		font-size: 0.75rem;
		color: var(--text-tertiary);
	}

	.column-count {
		display: inline-block;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--text-secondary);
		margin-top: 0.2rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.chip {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.82rem;
		font-weight: 500;
		animation: chipFadeIn 0.4s ease-out both;
	}

	@keyframes chipFadeIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.chip-anger {
		background-color: rgba(239, 68, 68, 0.15);
		color: #fca5a5;
		border: 1px solid rgba(239, 68, 68, 0.3);
	}

	.chip-fear {
		background-color: rgba(245, 158, 11, 0.15);
		color: #fcd34d;
		border: 1px solid rgba(245, 158, 11, 0.3);
	}

	.chip-shame {
		background-color: rgba(124, 58, 237, 0.15);
		color: #c4b5fd;
		border: 1px solid rgba(124, 58, 237, 0.3);
	}

	.chip-other {
		background-color: var(--void-elevated);
		color: var(--text-secondary);
		border: 1px solid var(--void-highlight);
	}

	.chip-empty {
		font-size: 0.82rem;
		color: var(--text-muted);
		font-style: italic;
	}

	.result-other {
		margin-top: 0.75rem;
		padding: 1rem;
		background: var(--void-surface);
		border-radius: var(--base-border-radius);
		border: 1px dashed var(--void-elevated);

		h4 {
			margin: 0 0 0.5rem;
			font-size: 0.9rem;
			color: var(--text-secondary);
		}
	}

	.other-note {
		font-size: 0.82rem;
		color: var(--text-muted);
		margin-top: 0.5rem;
		margin-bottom: 0;
	}

	/* Explanation */
	.explanation {
		margin-bottom: 2.5rem;

		hr {
			margin: 1.5rem 0;
			border: none;
			border-top: var(--classic-border);
		}
	}

	.reflection-questions {
		background: var(--void-surface);
		padding: 1rem 1.25rem;
		border-radius: var(--base-border-radius);
		border-left: 3px solid var(--color-theme-purple, #7c3aed);
		margin: 1.25rem 0;
		color: var(--text-primary);

		h3 {
			margin-top: 0;
			font-size: 1rem;
			color: var(--text-primary);
		}

		ul {
			margin-bottom: 0;
		}

		li {
			margin-bottom: 0.4rem;
		}
	}

	/* Tweet Grid */
	.additional-reading {
		margin-bottom: 2.5rem;
	}

	.tweet-grid {
		display: flex;
		gap: 1rem;

		:global(.twitter-tweet) {
			flex: 1;
		}
	}

	/* Color Wheel Section */
	.color-wheel-section {
		padding-top: 2rem;
		border-top: var(--classic-border);
	}

	.color-wheel-figure {
		margin: 1.5rem auto;
		text-align: center;
		max-width: 480px;

		figcaption {
			font-size: 0.82rem;
			color: var(--text-tertiary);
			margin-top: 0.4rem;
		}
	}

	.color-wheel-btn {
		display: block;
		width: 100%;
		padding: 0;
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		background: none;
		cursor: zoom-in;
		position: relative;
		overflow: hidden;
		transition: border-color 0.2s;

		&:hover,
		&:focus-visible {
			border-color: var(--shadow-monarch-light);

			.expand-hint {
				opacity: 1;
			}
		}

		img {
			display: block;
			width: 100%;
			border-radius: calc(var(--base-border-radius) - 1px);
		}
	}

	.expand-hint {
		position: absolute;
		bottom: 0.5rem;
		right: 0.5rem;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 0.75rem;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		opacity: 0;
		transition: opacity 0.2s;
		pointer-events: none;
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: zoom-out;
		padding: 2rem;

		img {
			max-width: 90vw;
			max-height: 90vh;
			border-radius: var(--base-border-radius);
			object-fit: contain;
		}
	}

	.lightbox-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(255, 255, 255, 0.15);
		border: none;
		color: #fff;
		font-size: 1.5rem;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s;

		&:hover {
			background: rgba(255, 255, 255, 0.25);
		}
	}

	.color-wheel-mapping {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.triad-box {
		padding: 1rem;
		border-radius: var(--base-border-radius);
		border-left: 4px solid;

		h3 {
			margin-top: 0;
			font-size: 1rem;
			color: var(--text-primary);
		}

		p {
			color: var(--text-secondary);
		}

		p:last-child {
			margin-bottom: 0;
		}
	}

	.triad-verdict {
		font-size: 0.85rem;
		font-weight: 600;
		font-style: italic;
	}

	.shame-box {
		background-color: rgba(124, 58, 237, 0.1);
		border-left-color: #7c3aed;
	}

	.anger-box {
		background-color: rgba(239, 68, 68, 0.1);
		border-left-color: #ef4444;
	}

	.fear-box {
		background-color: rgba(245, 158, 11, 0.1);
		border-left-color: #f59e0b;
	}

	/* Wheel Critique */
	.wheel-critique {
		margin: 2rem 0;

		li {
			margin-bottom: 1rem;
			line-height: 1.6;
		}
	}

	.depression-examples {
		margin-top: 0.5rem;
		list-style: none;
		padding-left: 0;

		li {
			padding: 0.5rem 0.75rem;
			margin-bottom: 0.5rem;
			border-radius: var(--base-border-radius);
			background: var(--void-surface);
			font-size: 0.9rem;
			color: var(--text-secondary);
		}
	}

	/* Key Insight / Enneagram Connection */
	.key-insight {
		margin: 2rem 0;
		padding: 1.5rem;
		background: var(--void-surface);
		border-radius: var(--base-border-radius);
		border: var(--classic-border);
		color: var(--text-primary);

		h3 {
			margin-top: 0;
			color: var(--text-primary);
		}
	}

	.centers-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.center-card {
		padding: 0.75rem;
		border-radius: var(--base-border-radius);
		border-top: 3px solid;
		text-align: center;

		h4 {
			margin: 0 0 0.25rem;
			font-size: 0.9rem;
			color: var(--text-primary);
		}

		p {
			margin: 0.2rem 0;
			font-size: 0.82rem;
			color: var(--text-secondary);
		}
	}

	.center-anger {
		background: rgba(239, 68, 68, 0.1);
		border-top-color: #ef4444;
	}

	.center-fear {
		background: rgba(245, 158, 11, 0.1);
		border-top-color: #f59e0b;
	}

	.center-shame {
		background: rgba(124, 58, 237, 0.1);
		border-top-color: #7c3aed;
	}

	.section-cta {
		text-align: center;
		font-size: 1.1rem;
		font-weight: 500;
		margin-top: 2rem;

		a {
			color: var(--shadow-monarch-light, #8b5cf6);
			font-weight: 700;
		}
	}

	/* Responsive */
	@media (max-width: 640px) {
		.results-grid {
			grid-template-columns: 1fr;
		}

		.centers-grid {
			grid-template-columns: 1fr;
		}

		.tweet-grid {
			flex-direction: column;
		}
	}
</style>

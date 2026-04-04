<!-- src/routes/book-session/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;

	let submitted = form?.success || data.alreadySignedUp || false;
	let existingSignup = data.alreadySignedUp && !form?.success;
	let loading = false;
	let recaptchaTheme: 'light' | 'dark' = 'dark';
	let formLoadTime = 0;

	const title = 'Enneagram Coaching Waitlist | 1-on-1 Pattern Recognition | 9takes';
	const metaDescription =
		'Join the 1-on-1 Enneagram coaching waitlist. Bring a relationship problem, work dynamic, or blind spot and get first access when sessions open.';
	const keywords =
		'enneagram coaching waitlist, personality coaching, relationship patterns, work dynamics, enneagram feedback';
	const domain = 'https://9takes.com';
	const ogImage = 'https://9takes.com/blogs/greek-statue-enneagram-coaching.webp';
	const twitterHandle = '@djwayne3';
	const imageAlt = '9takes Enneagram coaching waitlist';

	const fitChecks = [
		'You keep hitting the same relationship pattern and want an honest read on it.',
		'You are misreading a work, leadership, or social dynamic and need better pattern recognition.',
		'You know your type might be part of the problem, but you cannot name the blind spot cleanly yet.',
		'You want direct feedback, not vague encouragement or generic self-help advice.'
	];

	const proofStats = [
		{
			value: '200+',
			label: 'published pieces across 9takes',
			description: 'The work already exists. You can judge the thinking before you ever join.'
		},
		{
			value: '95',
			label: 'published Enneagram articles',
			description: 'Type patterns, conflict, self-awareness, and tactical application.'
		},
		{
			value: '80+',
			label: 'personality analyses',
			description: 'Public-figure breakdowns used to sharpen pattern recognition in the real world.'
		}
	];

	const readFirstLinks = [
		{
			href: '/enneagram-corner',
			label: 'Read Enneagram Corner',
			description: 'Start with the core framework and type guides.'
		},
		{
			href: '/personality-analysis',
			label: 'See Personality Analysis',
			description: 'See how the same lens gets applied to real people.'
		},
		{
			href: '/about',
			label: 'Learn About DJ',
			description: 'See the founder context behind the work.'
		}
	];

	const focusAreas = [
		{
			title: 'Relationship loops',
			description:
				'The same fight, the same attraction, the same shutdown, just with different people.'
		},
		{
			title: 'Work and leadership',
			description: 'Read the room better, manage tension, and stop misreading motive as attitude.'
		},
		{
			title: 'Type clarity',
			description:
				'Pressure-test your current guess or figure out your type from patterns, not vibes.'
		},
		{
			title: 'Blind spots',
			description: 'Name the habit that keeps costing you trust, leverage, or peace of mind.'
		},
		{
			title: 'Decision pressure',
			description: 'Separate signal from fear, image management, anger, or wishful thinking.'
		},
		{
			title: 'Direct feedback',
			description:
				'Get a cleaner read on what is actually happening and what your next move should be.'
		}
	];

	const sessionOutcomes = [
		{
			number: '01',
			title: 'Name the real pattern',
			description:
				'Get specific about the emotional logic driving the situation instead of staying stuck at the surface.'
		},
		{
			number: '02',
			title: 'Pressure-test your read',
			description:
				'Look at the situation through multiple type lenses so you stop assuming everyone sees it your way.'
		},
		{
			number: '03',
			title: 'Leave with next moves',
			description:
				'Walk away with practical language, cleaner framing, and a sharper sense of what to do next.'
		}
	];

	const waitlistSteps = [
		{
			number: '01',
			title: 'Join the waitlist',
			description: 'Leave your details today. No payment and no booking step yet.'
		},
		{
			number: '02',
			title: 'Get first access',
			description:
				'When the first round opens, waitlist members hear about timing and pricing first.'
		},
		{
			number: '03',
			title: 'Confirm fit',
			description: 'If it feels right, you will get the intake form and booking details.'
		},
		{
			number: '04',
			title: 'Start with the real issue',
			description:
				'The first session is for the situation you actually care about, not generic theory.'
		}
	];

	const faqs = [
		{
			question: 'Is this a waitlist or can I book today?',
			answer:
				'This page is a waitlist. There is no booking calendar on this page yet. Joining now gets you first access when sessions open.'
		},
		{
			question: 'What kind of coaching is this?',
			answer:
				'This is 1-on-1 Enneagram-informed coaching for pattern recognition, conflict, self-awareness, decision-making, and relationship dynamics.'
		},
		{
			question: 'Do I need to know my type already?',
			answer:
				'No. If you are unsure, type clarity can be part of the work. The point is to understand your patterns well enough to use them.'
		},
		{
			question: 'Is this therapy?',
			answer:
				'No. This is coaching, not therapy, diagnosis, or crisis support. If you need mental health treatment or urgent care, this is not the right container.'
		},
		{
			question: 'Will I see pricing before anything is booked?',
			answer:
				'Yes. Waitlist members will get the details before sessions open publicly. There is no payment collected on this page.'
		}
	];

	function syncRecaptchaTheme() {
		if (!browser) return;
		recaptchaTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
	}

	function resetRecaptcha() {
		if (browser && window.grecaptcha) {
			window.grecaptcha.reset();
		}
	}

	onMount(() => {
		formLoadTime = Date.now();
		syncRecaptchaTheme();

		const observer = new MutationObserver(() => {
			syncRecaptchaTheme();
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'data-theme']
		});

		if (!document.getElementById('recaptcha-script')) {
			const script = document.createElement('script');
			script.id = 'recaptcha-script';
			script.src = 'https://www.google.com/recaptcha/api.js';
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		}

		return () => observer.disconnect();
	});

	$: existingSignup = data.alreadySignedUp && !form?.success;
	$: submitted = form?.success || existingSignup;

	$: if (form?.success) {
		loading = false;
	} else if (form && !form.success) {
		loading = false;
		resetRecaptcha();
	}
</script>

<SEOHead
	{title}
	description={metaDescription}
	canonical={`${domain}/book-session`}
	twitterCardType="summary_large_image"
	{ogImage}
	twitterCreator={twitterHandle}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: '1-on-1 Enneagram Coaching Waitlist',
		description: 'Join the waitlist for upcoming 1-on-1 Enneagram coaching from 9takes.',
		provider: {
			'@type': 'Organization',
			name: '9takes',
			url: 'https://9takes.com'
		},
		serviceType: 'Personality coaching waitlist'
	}}
	additionalMeta={[
		{ name: 'keywords', content: keywords },
		{ name: 'twitter:image:alt', content: imageAlt }
	]}
/>

<div class="page-shell">
	<div class="page-backdrop"></div>

	<div class="page-container">
		<section class="hero-grid" id="top" aria-labelledby="book-session-title">
			<div class="hero-copy">
				<div class="section-eyebrow">1-on-1 coaching waitlist</div>
				<h1 id="book-session-title" class="hero-title">
					Join the waitlist for <span class="nowrap">1-on-1</span> Enneagram coaching.
				</h1>
				<p class="hero-lede">
					Bring a relationship problem, work dynamic, or blind spot you keep circling. I will use
					the same pattern-recognition lens behind 200+ published 9takes pieces to help you see what
					you are missing and what to do next.
				</p>

				<div class="hero-truth">
					<div class="truth-kicker">What this page is</div>
					<p>
						This is a waitlist, not a booking calendar. No payment today. Waitlist members get first
						access when sessions open.
					</p>
				</div>

				<div class="hero-list">
					<div class="list-title">Good reasons to join</div>
					<ul>
						{#each fitChecks as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>

				<div class="hero-mini-proof">
					<span>Why trust the lens?</span>
					95 published Enneagram articles. 80+ personality analyses. You can read the work before you
					ever decide this is for you.
				</div>
			</div>

			<aside class="waitlist-panel" id="waitlist" aria-labelledby="waitlist-title">
				{#if !submitted}
					<div class="panel-topline">Priority waitlist</div>
					<h2 id="waitlist-title">Get first access when sessions open.</h2>
					<p class="panel-copy">
						Leave your details here. I will email the first round before anything goes public.
					</p>

					<form
						method="POST"
						action="?/coachSub"
						use:enhance={({ formData }) => {
							loading = true;
							formData.set('_timeToken', String(Date.now() - formLoadTime));
							return async ({ update }) => {
								await update();
								loading = false;
							};
						}}
						class="waitlist-form"
					>
						<div class="honeypot" aria-hidden="true">
							<label for="website">Website</label>
							<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
						</div>

						<div class="field-group">
							<label for="name">First name</label>
							<input
								id="name"
								name="name"
								type="text"
								placeholder="Your name"
								value={form?.name || ''}
								required
								autocomplete="name"
								disabled={loading}
								class="form-input"
							/>
						</div>

						<div class="field-group">
							<label for="email">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								placeholder="you@example.com"
								value={form?.email || ''}
								required
								autocomplete="email"
								disabled={loading}
								class="form-input"
							/>
						</div>

						<div class="field-group">
							<label for="enneagramType">Enneagram type (optional)</label>
							<select
								id="enneagramType"
								name="enneagramType"
								value={form?.enneagramType || ''}
								disabled={loading}
								class="form-input"
							>
								<option value="">I am not sure yet</option>
								<option value="1">Type 1 - The Perfectionist</option>
								<option value="2">Type 2 - The Helper</option>
								<option value="3">Type 3 - The Achiever</option>
								<option value="4">Type 4 - The Individualist</option>
								<option value="5">Type 5 - The Investigator</option>
								<option value="6">Type 6 - The Loyalist</option>
								<option value="7">Type 7 - The Enthusiast</option>
								<option value="8">Type 8 - The Challenger</option>
								<option value="9">Type 9 - The Peacemaker</option>
							</select>
						</div>

						<div class="field-group">
							<label for="sessionGoal"
								>Anything you already know you want help with? (optional)</label
							>
							<textarea
								id="sessionGoal"
								name="sessionGoal"
								placeholder="Example: same conflict with my partner, trouble reading my boss, not sure if I am a 3 or a 6..."
								maxlength="600"
								rows="4"
								disabled={loading}
								class="form-input form-textarea">{form?.sessionGoal || ''}</textarea
							>
							<p class="field-hint">Optional, but helpful. Keep it under 600 characters.</p>
						</div>

						<div
							class="g-recaptcha"
							data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
							data-theme={recaptchaTheme}
						></div>

						{#if form?.message && !form?.success}
							<div class="form-error" role="alert">{form.message}</div>
						{/if}

						<button type="submit" class="btn-primary" disabled={loading} aria-busy={loading}>
							{loading ? 'Processing...' : 'Join the Waitlist'}
						</button>

						<div class="panel-footnotes">
							<span>No payment today.</span>
							<span>Waitlist gets the first invite.</span>
						</div>
					</form>
				{:else}
					<div class="success-panel">
						<div class="success-icon" aria-hidden="true">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="52"
								height="52"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
								<polyline points="22 4 12 14.01 9 11.01" />
							</svg>
						</div>

						<h2>
							{existingSignup ? "You're already on the waitlist." : "You're on the waitlist."}
						</h2>
						<p>
							{#if form?.email}
								I will reach out at <strong>{form.email}</strong> when the first sessions open.
							{:else}
								You will hear from me when the first sessions open.
							{/if}
						</p>

						<div class="success-actions">
							<a href="/enneagram-corner" class="btn-primary">Read the Guides</a>
							<a href="#proof" class="text-link">See why this fits</a>
						</div>
					</div>
				{/if}
			</aside>
		</section>

		<section class="signal-strip" aria-label="Read first">
			<div>
				<div class="section-eyebrow">Proof first</div>
				<h2>Want proof before people stories exist? Start with the work.</h2>
				<p>
					If you want to know how I think, do not take this page's word for it. Read the published
					9takes work first.
				</p>
			</div>
			<div class="signal-links">
				{#each readFirstLinks as link}
					<a href={link.href} class="signal-link">
						<span>{link.label}</span>
						<small>{link.description}</small>
					</a>
				{/each}
			</div>
		</section>

		<section class="proof-section" id="proof" aria-labelledby="proof-title">
			<div class="proof-copy">
				<div class="section-eyebrow">Credibility</div>
				<h2 id="proof-title">No testimonials yet. So here is the honest proof.</h2>
				<p>
					9takes already publishes the kind of pattern-recognition I would bring into a session:
					long-form Enneagram writing, practical guides, and personality analysis built to explain
					motive without flattening people into stereotypes.
				</p>
				<p>
					The cleanest trust signal I can offer right now is not "trust me." It is: read the work,
					see how I think, and decide if that is the kind of feedback you want on your situation.
				</p>
			</div>

			<div class="founder-card">
				<img
					src="/brand/djface.webp"
					alt="DJ Wayne"
					class="founder-photo"
					width="180"
					height="180"
					loading="lazy"
					decoding="async"
				/>
				<div class="founder-copy">
					<div class="founder-label">Built by DJ Wayne</div>
					<p>
						9takes was created by DJ Wayne, a former USMC infantry Marine turned software
						entrepreneur. The project applies the Enneagram to conflict, motive, relationships, and
						public personalities with a practical bias: explain the pattern, then make it usable.
					</p>
				</div>
			</div>

			<div class="stats-grid">
				{#each proofStats as stat}
					<div class="stat-card">
						<div class="stat-value">{stat.value}</div>
						<div class="stat-label">{stat.label}</div>
						<p>{stat.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="focus-section" aria-labelledby="focus-title">
			<div class="section-heading">
				<div class="section-eyebrow">Use cases</div>
				<h2 id="focus-title">What this is good for</h2>
				<p>
					The strongest fit is a real situation with friction in it, not a vague wish to "work on
					yourself."
				</p>
			</div>

			<div class="card-grid card-grid-3">
				{#each focusAreas as area}
					<div class="content-card">
						<h3>{area.title}</h3>
						<p>{area.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="outcomes-section" aria-labelledby="outcomes-title">
			<div class="section-heading">
				<div class="section-eyebrow">Session design</div>
				<h2 id="outcomes-title">What the first session is designed to do</h2>
				<p>
					This is not meant to be abstract. The first session should leave you seeing the situation
					more clearly than when you walked in.
				</p>
			</div>

			<div class="card-grid card-grid-3">
				{#each sessionOutcomes as item}
					<div class="content-card numbered-card">
						<div class="card-number">{item.number}</div>
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="process-section" aria-labelledby="process-title">
			<div class="section-heading">
				<div class="section-eyebrow">How it works</div>
				<h2 id="process-title">What happens after you join the waitlist</h2>
				<p>
					The point of the waitlist is simple: keep the first round small and give interested people
					first access.
				</p>
			</div>

			<div class="card-grid card-grid-4">
				{#each waitlistSteps as step}
					<div class="content-card step-card">
						<div class="step-number">{step.number}</div>
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="faq-section" aria-labelledby="faq-title">
			<div class="section-heading">
				<div class="section-eyebrow">FAQ</div>
				<h2 id="faq-title">Questions people should have before joining</h2>
			</div>

			<div class="card-grid card-grid-2">
				{#each faqs as faq}
					<div class="content-card faq-card">
						<h3>{faq.question}</h3>
						<p>{faq.answer}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="final-cta" aria-labelledby="final-cta-title">
			<div class="final-copy">
				<div class="section-eyebrow">Next step</div>
				<h2 id="final-cta-title">If you want first access, get on the waitlist.</h2>
				<p>
					If you want proof first, read the work. If the lens fits, join the list and I will email
					you when the first sessions are ready.
				</p>
			</div>

			<div class="final-actions">
				<a href="#top" class="btn-primary">Join the Waitlist</a>
				<a href="/personality-analysis" class="text-link">Read Personality Analysis</a>
			</div>
		</section>
	</div>
</div>

<style lang="scss">
	:global(html) {
		scroll-behavior: smooth;
	}

	/* ── Shell ── */

	.page-shell {
		position: relative;
		min-height: 100vh;
		background:
			radial-gradient(
				circle at top left,
				color-mix(in srgb, var(--primary) 10%, transparent) 0%,
				transparent 42%
			),
			linear-gradient(180deg, var(--bg-base) 0%, var(--bg-deep) 100%);
		overflow: hidden;
	}

	.page-backdrop {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				circle at 80% 6%,
				color-mix(in srgb, var(--primary) 12%, transparent) 0%,
				transparent 24%
			),
			radial-gradient(
				circle at 8% 55%,
				color-mix(in srgb, var(--accent-light) 6%, transparent) 0%,
				transparent 30%
			);
		pointer-events: none;
	}

	.page-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 2rem 1.25rem 5rem;
	}

	/* ── Shared ── */

	.hero-grid,
	.proof-section,
	.signal-strip,
	.focus-section,
	.outcomes-section,
	.process-section,
	.faq-section,
	.final-cta {
		position: relative;
		z-index: 1;
	}

	.waitlist-panel,
	.signal-strip,
	.proof-section,
	.focus-section,
	.outcomes-section,
	.process-section,
	.faq-section,
	.final-cta {
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 12%, transparent);
		border-radius: 1.25rem;
		background: color-mix(in srgb, var(--bg-surface) 88%, transparent);
		box-shadow: var(--shadow-lg);
		backdrop-filter: blur(14px);
	}

	.section-eyebrow {
		margin-bottom: 0.75rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--primary);
	}

	/* ── Hero ── */

	.hero-grid {
		display: grid;
		gap: 2rem;
		margin-bottom: 1rem;
	}

	.hero-copy {
		padding: 0;
	}

	.hero-title {
		margin: 0 0 1.5rem;
		font-size: clamp(2.1rem, 4vw, 3.2rem);
		line-height: 1.12;
		font-weight: 800;
		letter-spacing: -0.025em;
		color: var(--text-primary);
	}

	.nowrap {
		white-space: nowrap;
	}

	.hero-lede {
		max-width: 42rem;
		margin: 0 0 2.25rem;
		font-size: 1.1rem;
		line-height: 1.75;
		color: var(--text-secondary);
	}

	.hero-truth,
	.hero-mini-proof {
		margin-bottom: 2rem;
		border-radius: 0.875rem;
		padding: 1.25rem 1.5rem;
	}

	.hero-truth {
		border: 1px solid color-mix(in srgb, var(--primary) 18%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--primary) 8%, transparent) 0%,
			color-mix(in srgb, var(--bg-surface) 96%, transparent) 100%
		);
	}

	.truth-kicker {
		margin-bottom: 0.5rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--primary);
	}

	.hero-truth p,
	.hero-mini-proof {
		margin: 0;
		line-height: 1.7;
		color: var(--text-secondary);
	}

	.hero-list {
		margin-bottom: 2.25rem;
	}

	.list-title {
		margin-bottom: 1rem;
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.hero-list ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 1rem;
	}

	.hero-list li {
		position: relative;
		padding-left: 1.5rem;
		line-height: 1.65;
		color: var(--text-secondary);
	}

	.hero-list li::before {
		content: '';
		position: absolute;
		top: 0.6rem;
		left: 0;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--primary);
		box-shadow: 0 0 0 0.25rem color-mix(in srgb, var(--primary) 14%, transparent);
	}

	.hero-mini-proof {
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 12%, transparent);
		background: color-mix(in srgb, var(--bg-elevated) 50%, transparent);
	}

	.hero-mini-proof span {
		display: block;
		margin-bottom: 0.4rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	/* ── Waitlist panel ── */

	.waitlist-panel {
		padding: 2rem 1.75rem;
		align-self: start;
	}

	.panel-topline {
		margin-bottom: 0.5rem;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--primary);
	}

	.waitlist-panel h2 {
		margin: 0 0 0.75rem;
		font-size: 1.5rem;
		line-height: 1.2;
		font-weight: 800;
		color: var(--text-primary);
	}

	.panel-copy {
		margin: 0 0 1.75rem;
		line-height: 1.65;
		color: var(--text-secondary);
	}

	.waitlist-form {
		display: grid;
		gap: 1.25rem;
	}

	.honeypot {
		position: absolute;
		left: -9999px;
		top: -9999px;
	}

	.field-group {
		display: grid;
		gap: 0.4rem;
	}

	.field-group label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.form-input {
		width: 100%;
		border-radius: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 18%, transparent);
		background: color-mix(in srgb, var(--bg-elevated) 55%, transparent);
		padding: 0.8rem 1rem;
		font-size: 1rem;
		color: var(--text-primary);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.form-input::placeholder {
		color: var(--text-tertiary);
	}

	.form-input:focus {
		border-color: color-mix(in srgb, var(--primary) 65%, white);
		box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--primary) 14%, transparent);
		outline: none;
	}

	.form-input:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	.form-input option {
		background: var(--bg-surface);
		color: var(--text-primary);
	}

	.form-textarea {
		min-height: 6rem;
		resize: vertical;
	}

	.field-hint {
		margin: 0;
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--text-tertiary);
	}

	.form-error {
		border-radius: 0.75rem;
		border: 1px solid color-mix(in srgb, #ef4444 30%, transparent);
		background: color-mix(in srgb, #ef4444 8%, transparent);
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		color: #fca5a5;
	}

	/* ── Buttons ── */

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		border: none;
		border-radius: 999px;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-darker) 100%);
		box-shadow:
			var(--shadow-md),
			0 0 20px color-mix(in srgb, var(--primary) 14%, transparent);
		padding: 0.9rem 1.75rem;
		font-size: 1rem;
		font-weight: 700;
		color: white;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			filter 0.2s ease;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow:
			var(--shadow-lg),
			0 0 28px color-mix(in srgb, var(--primary) 22%, transparent);
		filter: brightness(1.06);
	}

	.btn-primary:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.panel-footnotes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		padding-top: 0.25rem;
		font-size: 0.8rem;
		color: var(--text-tertiary);
	}

	/* ── Success ── */

	.success-panel {
		display: grid;
		gap: 1.25rem;
		padding: 1.5rem 0;
	}

	.success-icon {
		display: flex;
		justify-content: center;
		color: #34d399;
	}

	.success-panel h2 {
		margin: 0;
		font-size: 1.6rem;
		text-align: center;
		color: var(--text-primary);
	}

	.success-panel p {
		margin: 0;
		text-align: center;
		line-height: 1.65;
		color: var(--text-secondary);
	}

	.success-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.text-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: var(--primary);
		text-decoration: none;
	}

	.text-link:hover {
		color: color-mix(in srgb, var(--primary) 78%, white);
	}

	/* ── Sections ── */

	.signal-strip,
	.proof-section,
	.focus-section,
	.outcomes-section,
	.process-section,
	.faq-section,
	.final-cta {
		margin-top: 2rem;
		padding: 2rem 1.75rem;
	}

	.signal-strip h2,
	.section-heading h2,
	.proof-copy h2,
	.final-copy h2 {
		margin: 0 0 0.75rem;
		font-size: clamp(1.5rem, 2.8vw, 2.1rem);
		line-height: 1.18;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: var(--text-primary);
	}

	.signal-strip p,
	.section-heading p,
	.proof-copy p,
	.founder-copy p,
	.final-copy p {
		margin: 0;
		line-height: 1.7;
		color: var(--text-secondary);
	}

	.proof-copy p + p {
		margin-top: 0.75rem;
	}

	/* ── Signal strip ── */

	.signal-strip {
		display: grid;
		gap: 2rem;
	}

	.signal-links {
		display: grid;
		gap: 0.75rem;
	}

	.signal-link {
		display: grid;
		gap: 0.25rem;
		border-radius: 0.875rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 12%, transparent);
		background: color-mix(in srgb, var(--bg-elevated) 50%, transparent);
		padding: 1.125rem 1.25rem;
		text-decoration: none;
		transition:
			transform 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.signal-link span {
		font-weight: 700;
		color: var(--text-primary);
	}

	.signal-link small {
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--text-secondary);
	}

	.signal-link:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--primary) 28%, transparent);
		box-shadow: var(--shadow-md);
	}

	/* ── Proof ── */

	.proof-section {
		display: grid;
		gap: 2rem;
	}

	.proof-copy {
		display: grid;
		gap: 0.5rem;
	}

	.founder-card {
		display: grid;
		gap: 1.5rem;
		align-items: center;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 10%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--primary) 7%, transparent) 0%,
			color-mix(in srgb, var(--bg-surface) 96%, transparent) 100%
		);
		padding: 1.75rem;
	}

	.founder-photo {
		width: 100%;
		max-width: 9rem;
		border-radius: 0.875rem;
		border: 1px solid color-mix(in srgb, var(--primary) 14%, transparent);
	}

	.founder-label {
		margin-bottom: 0.5rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--primary);
	}

	/* ── Cards ── */

	.stats-grid,
	.card-grid {
		display: grid;
		gap: 1rem;
	}

	.stat-card,
	.content-card {
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 10%, transparent);
		background: color-mix(in srgb, var(--bg-elevated) 48%, transparent);
		padding: 1.5rem;
		transition:
			transform 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.stat-card:hover,
	.content-card:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--primary) 22%, transparent);
		box-shadow: var(--shadow-md);
	}

	.stat-value {
		margin-bottom: 0.35rem;
		font-size: 2.5rem;
		font-weight: 800;
		line-height: 1;
		color: var(--text-primary);
	}

	.stat-label {
		margin-bottom: 0.5rem;
		font-size: 0.92rem;
		font-weight: 700;
		color: var(--primary);
	}

	.stat-card p,
	.content-card p {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.65;
		color: var(--text-secondary);
	}

	.section-heading {
		margin-bottom: 1.5rem;
	}

	.content-card h3 {
		margin: 0 0 0.5rem;
		font-size: 1.08rem;
		line-height: 1.3;
		font-weight: 700;
		color: var(--text-primary);
	}

	.numbered-card,
	.step-card {
		position: relative;
	}

	.card-number,
	.step-number {
		margin-bottom: 0.75rem;
		font-size: 0.82rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--primary);
		opacity: 0.75;
	}

	.faq-card h3 {
		font-size: 1.02rem;
	}

	/* ── Final CTA ── */

	.final-cta {
		display: grid;
		gap: 1.75rem;
		align-items: center;
		background:
			radial-gradient(
				circle at top right,
				color-mix(in srgb, var(--primary) 10%, transparent) 0%,
				transparent 40%
			),
			color-mix(in srgb, var(--bg-surface) 88%, transparent);
	}

	.final-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* ── Responsive ── */

	@media (min-width: 640px) {
		.page-container {
			padding: 3rem 2.5rem 5rem;
		}

		.signal-strip,
		.proof-section,
		.focus-section,
		.outcomes-section,
		.process-section,
		.faq-section,
		.final-cta {
			padding: 2.5rem;
		}

		.stats-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.card-grid-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.card-grid-3 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.founder-card {
			grid-template-columns: auto minmax(0, 1fr);
		}

		.success-actions,
		.final-actions {
			flex-direction: row;
			align-items: center;
		}

		.success-actions .btn-primary,
		.final-actions .btn-primary {
			width: auto;
		}
	}

	@media (min-width: 960px) {
		.page-container {
			padding: 3.5rem 3rem 6rem;
		}

		.hero-grid {
			grid-template-columns: minmax(0, 1fr) 26rem;
			gap: 3.5rem;
			align-items: start;
			margin-bottom: 1.5rem;
		}

		.hero-copy {
			padding-top: 1rem;
		}

		.hero-title {
			margin-bottom: 1.75rem;
		}

		.waitlist-panel {
			position: sticky;
			top: 5rem;
			padding: 2.25rem;
		}

		.signal-strip,
		.proof-section,
		.focus-section,
		.outcomes-section,
		.process-section,
		.faq-section,
		.final-cta {
			margin-top: 2.75rem;
			padding: 3rem;
		}

		.signal-strip,
		.final-cta {
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
			align-items: center;
			gap: 3rem;
		}

		.card-grid-3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.card-grid-4 {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.card-grid {
			gap: 1.125rem;
		}

		.section-heading {
			margin-bottom: 2rem;
		}

		.proof-section {
			gap: 2.5rem;
		}

		.founder-card {
			padding: 2rem;
		}
	}

	:global(*:focus-visible) {
		outline: 2px solid var(--primary-dark);
		outline-offset: 2px;
	}
</style>

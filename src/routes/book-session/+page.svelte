<!-- src/routes/book-session/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import EnneagramDiagram from '$lib/components/blog/EnneagramDiagram.svelte';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;

	let submitted = form?.success || false;
	let loading = false;
	let recaptchaTheme: 'light' | 'dark' = 'dark';

	function syncRecaptchaTheme() {
		if (!browser) return;
		recaptchaTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
	}

	// Bot protection: track form load time
	let formLoadTime = 0;
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

		// Load Google reCAPTCHA script
		if (browser && !document.getElementById('recaptcha-script')) {
			const script = document.createElement('script');
			script.id = 'recaptcha-script';
			script.src = 'https://www.google.com/recaptcha/api.js';
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		}

		return () => observer.disconnect();
	});

	/* -------------------- SEO -------------------- */
	const title = '1‑on‑1 Enneagram Coaching | Stress‑Test Your Ideas & Grow EQ | 9takes';
	const metaDescription =
		'One situation, 9 ways to see it. Stress‑test your situations in your life with Enneagram coaching. Decode personality dynamics, boost situational awareness, and max out your personality.';
	const keywords =
		'stress test ideas, enneagram coaching, situational awareness, personality maxing, decode people, blind spot analysis';
	const domain = 'https://9takes.com';
	const ogImage = 'https://9takes.com/blogs/greek-statue-enneagram-coaching.webp';
	const twitterHandle = '@djwayne3';
	const imageAlt = '1‑on‑1 Enneagram coaching session illustration';

	/* ---------------- Benefits ---------------- */
	const benefits = [
		{
			title: 'Stress‑Test Real Scenarios',
			description:
				'Bring your toughest decision, pitch, or relationship dilemma. We run it through 9 distinct mindsets to expose hidden gaps.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 12l2 2 4-4'/><path d='M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.21 0 4.21.8 5.77 2.13'/></svg>`
		},
		{
			title: 'Boost Situational Awareness',
			description:
				'Learn how each type reads the room so you can anticipate reactions and steer conversations with confidence.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='3'/><path d='M12 1v6m0 6v6m11-7h-6m-6 0H1'/></svg>`
		},
		{
			title: 'Decode People Fast',
			description:
				'Master personality archetypes to understand motives, predict stress responses, and build rapport quickly.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 15a2 2 0 0 1-2 2H5l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/></svg>`
		},
		{
			title: 'Personal growth via Personality Maxing',
			description:
				'Walk away with a targeted growth plan for your type—no generic advice, just precise moves to level up.',
			icon: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='23 6 13.5 15.5 8.5 10.5 1 18'/><polyline points='17 6 23 6 23 12'/></svg>`
		}
	];

	/* ---------------- Session Steps ---------------- */
	const sessionSteps = [
		{
			number: '01',
			title: 'Set the Scenario',
			description: 'Outline the decision, pitch, or conflict you want to stress‑test.'
		},
		{
			number: '02',
			title: 'Type Verification',
			description:
				'Confirm your Enneagram type (or discover it) to anchor coaching in accurate data.'
		},
		{
			number: '03',
			title: 'Blind‑Spot Analysis',
			description: 'Run your scenario through 9 archetypes to surface hidden assumptions and gaps.'
		},
		{
			number: '04',
			title: 'Action Blueprint',
			description:
				'Get customized scripts, communication tactics, and a personality‑maxing roadmap.'
		}
	];

	function resetRecaptcha() {
		if (browser && window.grecaptcha) {
			window.grecaptcha.reset();
		}
	}

	/* ---------------- Reactive checks ---------------- */
	$: if (data.alreadySignedUp && !form?.success) submitted = true;

	// Update submitted state when form response comes back
	$: if (form?.success) {
		submitted = true;
		loading = false;
	} else if (form && !form.success) {
		loading = false;
		// Reset reCAPTCHA on failure so user can try again
		resetRecaptcha();
	}

	onMount(() => {
		if (browser) {
			setTimeout(() => {
				document
					.querySelectorAll('.animate-on-scroll')
					.forEach((el) => el.classList.add('animate-in'));
			}, 100);
		}
	});
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
		name: 'Enneagram Coaching by 9takes',
		description:
			'Stress-test decisions and max personality stats with personalized Enneagram coaching sessions.',
		provider: {
			'@type': 'Organization',
			name: '9takes',
			url: 'https://9takes.com'
		},
		serviceType: 'Personality Coaching',
		offers: {
			'@type': 'Offer',
			availability: 'https://schema.org/PreOrder',
			price: '297',
			priceCurrency: 'USD'
		}
	}}
	additionalMeta={[
		{ name: 'keywords', content: keywords },
		{ name: 'twitter:image:alt', content: imageAlt }
	]}
/>

<div class="page-wrapper">
	<div class="mx-auto max-w-7xl px-4">
		<!-- Hero -->
		<section id="top" class="py-16 md:py-20">
			<!-- Main headline and CTA aligned horizontally -->
			<div class="mb-16 flex flex-col gap-12 lg:flex-row lg:items-start">
				<div class="flex-1 lg:pr-8">
					<h1 class="hero-title mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
						Know thyself, <br /> everything else will get easier.
					</h1>
					<p class="mb-8 text-xl font-medium text-[var(--text-secondary)]">
						In any given situation → 9 ways to see it.
					</p>

					<!-- Clean Question Stack -->
					<div class="mb-8 space-y-4">
						<div class="flex items-start gap-3">
							<div class="mt-1 flex-shrink-0">
								<div
									class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/20 text-sm"
								>
									<span>🎯</span>
								</div>
							</div>
							<span class="text-lg font-medium text-[var(--text-secondary)]"
								>Want to sharpen your situational awareness?</span
							>
						</div>

						<div class="flex items-start gap-3">
							<div class="mt-1 flex-shrink-0">
								<div
									class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/20 text-sm"
								>
									<span>💭</span>
								</div>
							</div>
							<span class="text-lg font-medium text-[var(--text-secondary)]"
								>Need perspective? <span class="font-normal italic text-[var(--text-tertiary)]"
									>(as abstract as that sounds)</span
								></span
							>
						</div>

						<div class="flex items-start gap-3">
							<div class="mt-1 flex-shrink-0">
								<div
									class="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/20 text-sm"
								>
									<span>🧪</span>
								</div>
							</div>
							<span class="text-lg font-medium text-[var(--text-secondary)]"
								>Want to stress-test your ideas?</span
							>
						</div>
					</div>
				</div>

				<!-- Waitlist card -->
				<div class="w-full flex-shrink-0 lg:w-96">
					<div class="waitlist-card rounded-2xl border border-teal-500/30 p-8 shadow-xl">
						{#if !submitted}
							<div class="mb-6 text-center">
								<div class="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-400">
									Join the Priority Waitlist
								</div>
							</div>

							<h2 class="mb-2 text-xl font-bold text-[var(--text-primary)]">
								Lock In Early Access
							</h2>
							<p class="mb-6 text-[var(--text-secondary)]">
								First spots open soon—get notified before anyone else.
							</p>

							<form
								method="POST"
								action="?/coachSub"
								use:enhance={({ formData }) => {
									loading = true;
									// Add time token for bot detection (time since page load)
									formData.set('_timeToken', String(Date.now() - formLoadTime));
									return async ({ result, update }) => {
										await update();
										loading = false;
									};
								}}
								class="space-y-4"
							>
								<!-- Honeypot field - hidden from humans, bots will fill it -->
								<div style="position: absolute; left: -9999px; top: -9999px;" aria-hidden="true">
									<label for="website">Website</label>
									<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
								</div>
								<div>
									<label for="name" class="sr-only">Your name</label>
									<input
										id="name"
										name="name"
										type="text"
										placeholder="Your name"
										value={form?.name || ''}
										required
										disabled={loading}
										class="form-input bg-[var(--bg-elevated)]/50 w-full rounded-lg border border-[var(--bg-elevated)] p-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</div>
								<div>
									<label for="email" class="sr-only">Your email</label>
									<input
										id="email"
										name="email"
										type="email"
										placeholder="you@example.com"
										value={form?.email || ''}
										required
										disabled={loading}
										class="form-input bg-[var(--bg-elevated)]/50 w-full rounded-lg border border-[var(--bg-elevated)] p-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</div>
								<div>
									<label for="enneagramType" class="sr-only">Your Enneagram Type (optional)</label>
									<select
										id="enneagramType"
										name="enneagramType"
										value={form?.enneagramType || ''}
										disabled={loading}
										class="form-input bg-[var(--bg-elevated)]/50 w-full rounded-lg border border-[var(--bg-elevated)] p-3 text-[var(--text-primary)] transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									>
										<option value="">Your Enneagram Type (optional)</option>
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
								<div>
									<label for="sessionGoal" class="sr-only"
										>What are you looking for in this coaching session?</label
									>
									<textarea
										id="sessionGoal"
										name="sessionGoal"
										placeholder="What do you want to walk away with? (context, a decision, a script, etc.)"
										maxlength="600"
										required
										rows="3"
										disabled={loading}
										class="form-input bg-[var(--bg-elevated)]/50 w-full rounded-lg border border-[var(--bg-elevated)] p-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										>{form?.sessionGoal || ''}</textarea
									>
									<p class="mt-1 text-xs text-[var(--text-tertiary)]">
										Helps tailor your session (600 characters max).
									</p>
								</div>

								<!-- Google reCAPTCHA -->
								<div
									class="g-recaptcha"
									data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
									data-theme={recaptchaTheme}
								></div>

								{#if form?.message && !form?.success}
									<div class="text-sm text-red-400">{form.message}</div>
								{/if}
								<button
									type="submit"
									class="btn-primary w-full rounded-lg px-6 py-4 text-lg font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
									disabled={loading}
									aria-busy={loading}
								>
									{loading ? 'Processing…' : 'Join Waitlist'}
								</button>
								<div class="text-center text-xs text-[var(--text-tertiary)]">
									💳 No payment until sessions launch
								</div>
							</form>
						{:else}
							<div class="py-4 text-center">
								<div class="mb-4 flex justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="48"
										height="48"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="text-green-400"
										><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline
											points="22 4 12 14.01 9 11.01"
										/></svg
									>
								</div>
								<h2 class="mb-4 text-2xl font-bold text-green-400">You're on the list!</h2>
								<p class="mb-6 text-[var(--text-secondary)]">
									We'll email you as soon as sessions open.
								</p>
								<p class="mb-8 text-sm text-[var(--text-tertiary)]">
									{#if form?.email}Confirmation sent to <strong class="text-[var(--text-secondary)]"
											>{form.email}</strong
										>{:else}Welcome to the priority list!{/if}
								</p>
								<a
									href="/"
									class="btn-primary inline-block rounded-lg px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md"
									>Back to 9takes</a
								>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<div class="mx-auto mb-16 max-w-4xl">
				<!-- Value Proposition -->
				<div class="value-prop rounded-lg border-l-4 border-teal-500 p-6">
					<p class="text-lg leading-relaxed text-[var(--text-secondary)]">
						<span class="font-semibold text-[var(--text-primary)]"
							>Review your life up to this point.</span
						><br />
						Identify your relationship to the 3 core emotions that form your personality. Walk away understanding
						your strengths and weaknesses, identifying your personality's blind spots and work 1‑on‑1
						to create your own
						<span class="font-semibold text-teal-400">personalized life strategy.</span>
					</p>
				</div>
			</div>

			<!-- Clean Benefits Section -->
			<div class="mx-auto max-w-4xl">
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<div class="benefit-card flex items-start gap-4 rounded-xl p-6">
						<div class="flex-shrink-0">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 font-bold text-white"
							>
								✓
							</div>
						</div>
						<div>
							<h3 class="mb-1 text-lg font-semibold text-[var(--text-primary)]">
								60‑minute deep‑dive
							</h3>
							<p class="text-sm text-[var(--text-secondary)]">Comprehensive personality analysis</p>
						</div>
					</div>

					<div class="benefit-card flex items-start gap-4 rounded-xl p-6">
						<div class="flex-shrink-0">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 font-bold text-white"
							>
								✓
							</div>
						</div>
						<div>
							<h3 class="mb-1 text-lg font-semibold text-[var(--text-primary)]">
								Type‑specific growth blueprint
							</h3>
							<p class="text-sm text-[var(--text-secondary)]">
								<span class="font-semibold text-teal-400">Max out your personality</span>
							</p>
						</div>
					</div>

					<div class="benefit-card flex items-start gap-4 rounded-xl p-6">
						<div class="flex-shrink-0">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-white"
							>
								✓
							</div>
						</div>
						<div>
							<h3 class="mb-1 text-lg font-semibold text-[var(--text-primary)]">
								Relationship insights
							</h3>
							<p class="text-sm text-[var(--text-secondary)]">Communication tools & strategies</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Benefits -->
		<section class="benefits-section my-16 rounded-2xl py-16">
			<h2 class="mb-10 text-center text-3xl font-bold text-[var(--text-primary)]">
				Why 9‑Lens Beats Solo Thinking/ DIY
			</h2>
			<div class="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each benefits as benefit}
					<div
						class="card h-full rounded-xl p-6 text-center transition duration-300 hover:-translate-y-1"
					>
						<div
							class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/20"
						>
							<div class="text-teal-400">{@html benefit.icon}</div>
						</div>
						<h3 class="mb-3 text-xl font-semibold text-teal-400">{benefit.title}</h3>
						<p class="text-sm text-[var(--text-secondary)]">{benefit.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Session Steps -->
		<section class="py-16">
			<h2 class="mb-10 text-center text-3xl font-bold text-[var(--text-primary)]">
				Inside Your 60‑Minute Session
			</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each sessionSteps as step}
					<div class="card flex rounded-xl p-6 transition duration-300 hover:-translate-y-1">
						<div class="mr-4 text-3xl font-bold text-teal-500 opacity-80">{step.number}</div>
						<div>
							<h3 class="mb-2 text-xl font-semibold text-teal-400">{step.title}</h3>
							<p class="text-sm text-[var(--text-secondary)]">{step.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Personality-Maxing Section -->
		<section class="personality-max-section my-16 rounded-2xl p-12 text-center">
			<h2 class="mb-6 text-3xl font-bold text-teal-400">"Max Out" Your Personality.</h2>
			<p class="mx-auto mb-6 max-w-3xl text-lg text-[var(--text-secondary)]">
				Every personality type has <strong class="text-[var(--text-primary)]"
					>baseline strengths and predictable blind spots</strong
				>. Think of it as your personality's starting stats—before you level up.
			</p>
			<p class="mx-auto mb-8 max-w-3xl text-lg text-[var(--text-secondary)]">
				Coaching doesn't just give you insights; it gives you <em>targeted drills</em> to turn your type's
				weak points into competitive advantages.
			</p>
			<div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
				<div class="card rounded-lg p-6">
					<div class="mb-2 text-2xl">📊</div>
					<h3 class="mb-2 font-semibold text-[var(--text-primary)]">Personality Audit</h3>
					<p class="text-sm text-[var(--text-secondary)]">
						Baseline assessment of your type's patterns & blind spots
					</p>
				</div>
				<div class="card rounded-lg p-6">
					<div class="mb-2 text-2xl">🎯</div>
					<h3 class="mb-2 font-semibold text-[var(--text-primary)]">Targeted Drills</h3>
					<p class="text-sm text-[var(--text-secondary)]">
						Type‑specific exercises to sharpen weak areas
					</p>
				</div>
				<div class="card rounded-lg p-6">
					<div class="mb-2 text-2xl">⚡</div>
					<h3 class="mb-2 font-semibold text-[var(--text-primary)]">Precise Moves</h3>
					<p class="text-sm text-[var(--text-secondary)]">
						Tactical scripts & timing strategies for real scenarios
					</p>
				</div>
			</div>
		</section>

		<!-- Enneagram Visual -->
		<section class="enneagram-visual-section my-16 rounded-2xl py-16 text-white">
			<div class="flex flex-col gap-8 md:flex-row md:items-center">
				<div class="flex-1 p-8">
					<h2 class="mb-6 text-3xl font-bold text-white">Why the Enneagram Works</h2>
					<p class="mb-4 text-lg text-white/90">
						Nine archetypes. Infinite context. Coaching translates theory into precise moves for
						your real‑world challenges.
					</p>
					<p class="mb-4 text-lg text-white/90">
						Stop guessing why people react the way they do—start anticipating.
					</p>
					<div class="mt-8 flex flex-col items-center gap-4 sm:flex-row">
						<a
							href="#top"
							class="inline-block rounded-lg bg-white px-6 py-3.5 font-semibold text-teal-700 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
							>Join Waitlist</a
						><a
							href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
							class="border-b border-white/30 pb-0.5 transition hover:border-white focus-visible:border-white focus-visible:outline-none"
							>Learn the basics →</a
						>
					</div>
				</div>
				<div class="flex flex-1 items-center justify-center p-4"><EnneagramDiagram /></div>
			</div>
		</section>

		<!-- FAQ Section -->
		<section class="py-16">
			<h2 class="mb-10 text-center text-3xl font-bold text-[var(--text-primary)]">
				Frequently Asked Questions
			</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="card rounded-xl p-6">
					<h3 class="relative mb-3 pl-6 text-xl font-semibold text-teal-400">
						<span class="absolute left-0 text-teal-500">Q:</span>
						How long are the coaching sessions?
					</h3>
					<p class="relative pl-6 text-[var(--text-secondary)]">
						<span class="absolute left-0 font-semibold text-teal-400">A:</span>
						Each session is 60 minutes. Follow‑up sessions available in 30 or 60‑minute formats based
						on your needs.
					</p>
				</div>
				<div class="card rounded-xl p-6">
					<h3 class="relative mb-3 pl-6 text-xl font-semibold text-teal-400">
						<span class="absolute left-0 text-teal-500">Q:</span>
						Do I need to know my Enneagram type already?
					</h3>
					<p class="relative pl-6 text-[var(--text-secondary)]">
						<span class="absolute left-0 font-semibold text-teal-400">A:</span>
						No. Type discovery is part of the coaching process—we use behavioral patterns, not just tests.
					</p>
				</div>
				<div class="card rounded-xl p-6">
					<h3 class="relative mb-3 pl-6 text-xl font-semibold text-teal-400">
						<span class="absolute left-0 text-teal-500">Q:</span>
						How are sessions conducted?
					</h3>
					<p class="relative pl-6 text-[var(--text-secondary)]">
						<span class="absolute left-0 font-semibold text-teal-400">A:</span>
						Secure video calls. Connect from anywhere—no travel, no waiting rooms, just focused strategy
						time.
					</p>
				</div>
				<div class="card rounded-xl p-6">
					<h3 class="relative mb-3 pl-6 text-xl font-semibold text-teal-400">
						<span class="absolute left-0 text-teal-500">Q:</span>
						When will coaching sessions become available?
					</h3>
					<p class="relative pl-6 text-[var(--text-secondary)]">
						<span class="absolute left-0 font-semibold text-teal-400">A:</span>
						We're currently finalizing our coaching team and platform. Waitlist members will be the first
						to know when sessions launch and will receive priority booking.
					</p>
				</div>
			</div>
		</section>

		<!-- Final CTA -->
		<section class="final-cta my-16 rounded-2xl px-8 py-12 text-center">
			<div class="mx-auto max-w-2xl">
				<h2 class="mb-4 text-3xl font-bold text-teal-400">Go from Blind Spots to Breakthroughs</h2>
				<p class="mb-8 text-lg text-[var(--text-secondary)]">
					Join the waitlist now—openings are limited
				</p>
				<a
					href="#top"
					class="btn-primary inline-block rounded-lg px-8 py-4 text-lg font-semibold text-white transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
					>Join the Waitlist</a
				>
				<div class="mt-4 text-sm text-[var(--text-tertiary)]">
					⏱ First to know when sessions launch
				</div>
			</div>
		</section>
	</div>
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme - Book Session */
	:global(html) {
		scroll-behavior: smooth;
	}

	.page-wrapper {
		min-height: 100vh;
		background: linear-gradient(180deg, var(--bg-base) 0%, var(--bg-deep) 100%);
	}

	/* Hero Title */
	.hero-title {
		background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Waitlist Card */
	.waitlist-card {
		background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-deep) 100%);
		box-shadow:
			var(--shadow-xl),
			0 0 30px var(--primary-subtle);
	}

	/* Form Inputs */
	.form-input {
		&::placeholder {
			color: var(--text-tertiary);
		}

		option {
			background: var(--bg-surface);
			color: var(--text-primary);
		}
	}

	/* Primary Button */
	.btn-primary {
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-darker) 100%);
		box-shadow: var(--glow-sm);

		&:hover:not(:disabled) {
			background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
			box-shadow: var(--glow-md);
		}
	}

	/* Value Proposition */
	.value-prop {
		background: var(--bg-surface);
	}

	/* Benefit Cards */
	.benefit-card {
		background: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 15%, transparent);
		transition: all 0.25s ease;

		&:hover {
			border-color: var(--primary-glow);
			box-shadow: var(--glow-sm);
		}
	}

	/* Benefits Section */
	.benefits-section {
		background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-deep) 100%);
	}

	/* Generic Card */
	.card {
		background: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 15%, transparent);
		transition: all 0.25s ease;

		&:hover {
			border-color: var(--primary-glow);
			box-shadow: var(--shadow-lg), var(--glow-sm);
		}
	}

	/* Personality Max Section */
	.personality-max-section {
		background: linear-gradient(135deg, var(--primary-subtle) 0%, var(--bg-surface) 100%);
		border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
	}

	/* Enneagram Visual Section */
	.enneagram-visual-section {
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--bg-surface) 100%);
	}

	/* Final CTA */
	.final-cta {
		background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-deep) 100%);
		border: 2px solid color-mix(in srgb, var(--primary) 30%, transparent);
		box-shadow: var(--glow-lg);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: -50%;
			left: 50%;
			transform: translateX(-50%);
			width: 400px;
			height: 200px;
			background: radial-gradient(ellipse, var(--primary-subtle) 0%, transparent 70%);
			pointer-events: none;
		}
	}

	/* Focus visible improvements for accessibility */
	:global(*:focus-visible) {
		outline: 2px solid var(--primary-dark);
		outline-offset: 2px;
	}
</style>

<!-- src/routes/+page.svelte -->
<!-- Home: "Do you know about the Enneagram?" decision-fork landing page. -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import { buildBreadcrumbSchemaForGraph } from '$lib/utils/schema';
	import type { PageData } from './$types';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';

	let { data }: { data: PageData } = $props();
	let observer: IntersectionObserver | null = null;
	// Funnel sections after the fork: give-first, qotd, blogs, famous, coaching, final
	let sectionsVisible = $state(Array(6).fill(browser ? false : true));

	// Emotional stance phrases per type
	const stancePhrases: Record<number, string> = {
		1: 'internalizes anger',
		2: 'represses shame',
		3: 'compensates for shame',
		4: 'identifies with shame',
		5: 'withdraws from fear',
		6: 'engages with fear',
		7: 'reframes fear',
		8: 'expresses anger',
		9: 'suppresses anger'
	};

	const shadowTypes: Record<
		number,
		{ name: string; title: string; color: string; stancePhrase: string }
	> = Object.fromEntries(
		Object.entries(ENNEAGRAM_TYPE_COLORS).map(([k, v]) => [
			Number(k),
			{ name: v.name, title: v.title, color: v.color, stancePhrase: stancePhrases[Number(k)] }
		])
	);

	// "No" path — three quick reads to get someone up to speed on the Enneagram
	const noPathBlogs = [
		{
			url: '/enneagram-corner/beginners-guide-to-determining-your-enneagram-type',
			title: "Beginner's Guide",
			subtitle: 'Find your type, step by step.'
		},
		{
			url: '/enneagram-corner/enneagram-tldr',
			title: 'Enneagram TL;DR',
			subtitle: 'Five-minute crash course.'
		},
		{
			url: '/enneagram-corner/enneagram-test-comparison-2025',
			title: 'Which Test Should You Take?',
			subtitle: 'We compared the popular ones.'
		}
	];

	// Blog category cards — each is a whole library, not a single post.
	const blogCategories = [
		{
			label: 'The Takes of 9takes',
			href: '/community',
			icon: 'bubbles' as const,
			desc: 'Essays on how minds change, why groupthink wins online, and what 9takes is trying to fix.',
			peeks: [
				'How minds actually change — and how they don\u2019t',
				'Why Reddit can\u2019t give you real answers',
				'MBTI vs. Enneagram: what holds up',
				'The philosophy behind "9 ways to see it"'
			],
			count: '20+ essays'
		},
		{
			label: 'Enneagram Corner',
			href: '/enneagram-corner',
			icon: 'nonagon' as const,
			desc: 'The biggest section. Type-by-type breakdowns and the full system in plain English.',
			peeks: [
				'Each type, up close (all 9)',
				'Dating, compatibility, attachment styles',
				'Anxiety, depression, and ADHD by type',
				'The criticisms, the history, the honest take'
			],
			count: '80+ deep-dives'
		},
		{
			label: 'How-to Guides',
			href: '/how-to-guides',
			icon: 'checklist' as const,
			desc: 'Tactical playbooks for the moments where personality theory has to meet real life.',
			peeks: [
				'Relationship conflict, start to finish',
				'How to actually read people',
				'Productivity systems tuned to your type',
				'The emotions crash course school skipped'
			],
			count: '15+ playbooks'
		}
	];

	// SEO / structured data
	const siteUrl = 'https://9takes.com';
	const organizationId = `${siteUrl}/#organization`;
	const websiteId = `${siteUrl}/#website`;
	const webpageId = `${siteUrl}/#webpage`;
	const founderId = `${siteUrl}/about/#person`;
	const breadcrumbId = `${siteUrl}/#breadcrumb`;

	const homepageStructuredData = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Organization',
				'@id': organizationId,
				name: '9takes',
				url: siteUrl,
				description:
					'9takes helps people decode social dynamics, personality patterns, and emotional blind spots using the Enneagram.',
				foundingDate: '2022',
				logo: {
					'@type': 'ImageObject',
					url: `${siteUrl}/brand/aero.png`,
					width: 200,
					height: 200
				},
				founder: { '@id': founderId },
				contactPoint: [
					{
						'@type': 'ContactPoint',
						contactType: 'customer support',
						email: 'usersup@9takes.com',
						url: `${siteUrl}/about`,
						availableLanguage: ['English']
					}
				],
				sameAs: ['https://www.instagram.com/9takesdotcom/', 'https://twitter.com/9takesdotcom']
			},
			{
				'@type': 'Person',
				'@id': founderId,
				name: 'DJ Wayne',
				jobTitle: 'Founder',
				description:
					'Founder of 9takes, a former USMC infantry Marine turned software entrepreneur who writes about personality, self-awareness, and the Enneagram.',
				image: `${siteUrl}/brand/djface.webp`,
				url: `${siteUrl}/about`,
				worksFor: { '@id': organizationId },
				sameAs: ['https://twitter.com/djwayne3', 'https://www.linkedin.com/in/djwayne3']
			},
			{
				'@type': 'WebSite',
				'@id': websiteId,
				name: '9takes',
				url: siteUrl,
				description:
					'An Enneagram site for personality analysis, emotional intelligence, and understanding social dynamics.',
				inLanguage: 'en-US',
				publisher: { '@id': organizationId }
			},
			{
				'@type': 'WebPage',
				'@id': webpageId,
				name: '9takes - See the Emotions Behind Every Take',
				url: siteUrl,
				description:
					'Decode social dynamics using the Enneagram. Explore nine personality perspectives, improve emotional intelligence, and read in-depth personality analysis on 9takes.',
				inLanguage: 'en-US',
				isPartOf: { '@id': websiteId },
				publisher: { '@id': organizationId },
				about: {
					'@type': 'Thing',
					name: 'Enneagram of Personality'
				},
				primaryImageOfPage: {
					'@type': 'ImageObject',
					url: `${siteUrl}/greek_pantheon.png`,
					width: 1200,
					height: 630,
					caption: '9takes - One situation, 9 ways to see it'
				},
				breadcrumb: { '@id': breadcrumbId }
			},
			{
				'@id': breadcrumbId,
				...buildBreadcrumbSchemaForGraph([{ name: 'Home', url: siteUrl }])
			}
		]
	};

	function getTransition() {
		return { y: 30, duration: 500, delay: 100 };
	}

	function setupIntersectionObserver() {
		if (!browser || typeof IntersectionObserver === 'undefined') {
			sectionsVisible = Array(6).fill(true);
			return;
		}

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = parseInt(entry.target.getAttribute('data-section-index') || '0');
						if (!isNaN(index) && index >= 0 && index < sectionsVisible.length) {
							sectionsVisible[index] = true;
						}
					}
				});
			},
			{ threshold: 0.1, rootMargin: '50px 0px' }
		);

		setTimeout(() => {
			const sections = document.querySelectorAll('.section-observer');
			sections.forEach((section, idx) => {
				section.setAttribute('data-section-index', idx.toString());
				observer?.observe(section);
			});
		}, 100);
	}

	onMount(() => {
		tick().then(() => {
			setupIntersectionObserver();
		});

		return () => {
			observer?.disconnect();
		};
	});
</script>

<svelte:head>
	<title>9takes - See the Emotions Behind Every Take</title>
	<meta name="title" content="9takes - See the Emotions Behind Every Take" />
	<meta
		name="description"
		content="Decode social dynamics with the Enneagram on 9takes. Explore nine personality perspectives, deepen emotional intelligence, and read practical personality analysis for work, dating, and conflict."
	/>
	<meta
		name="keywords"
		content="enneagram, enneagram types, personality analysis, emotional intelligence, social dynamics, communication patterns, conflict, self-awareness"
	/>
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<meta name="language" content="English" />
	<meta name="author" content="DJ Wayne" />

	<!-- Links -->
	<link rel="canonical" href="https://9takes.com" />
	<link rel="alternate" href="https://9takes.com" hreflang="x-default" />
	<link rel="alternate" href="https://9takes.com" hreflang="en-US" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://9takes.com" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes - See the Emotions Behind Every Take" />
	<meta
		property="og:description"
		content="Use the Enneagram to decode social dynamics, compare nine personality perspectives, and build emotional intelligence on 9takes."
	/>
	<meta property="og:image" content="https://9takes.com/greek_pantheon.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="9takes - One situation, 9 ways to see it" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@9takesdotcom" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta name="twitter:title" content="9takes - See the Emotions Behind Every Take" />
	<meta
		name="twitter:description"
		content="Explore the nine Enneagram perspectives, sharpen emotional intelligence, and read personality analysis that helps you understand people better."
	/>
	<meta name="twitter:image" content="https://9takes.com/greek_pantheon.png" />
	<meta name="twitter:image:alt" content="9takes - One situation, 9 ways to see it" />
	{@html `<script type="application/ld+json">${JSON.stringify(homepageStructuredData)}</script>`}
</svelte:head>

<div class="sl-page">
	<div class="bg-void"></div>
	<div class="bg-ambient"></div>
	<div class="bg-grid"></div>

	<main class="content">
		<!-- ========== MOBILE FORK SECTION (mobile only) ========== -->
		<section class="mobile-fork-section mobile-only" in:fly={getTransition()}>
			<header class="mobile-fork-header">
				<div class="section-badge accent">
					<span class="badge-dot"></span>
					<span>START HERE</span>
				</div>
				<h1 class="mobile-fork-h1">Do you know about<br />the Enneagram?</h1>
			</header>

			<!-- Branching tree visual: root → trunk → split → drops -->
			<div class="mfork-tree" aria-hidden="true">
				<span class="tree-root"></span>
				<span class="tree-trunk"></span>
				<span class="tree-cross"></span>
				<span class="tree-drop tree-drop-no"></span>
				<span class="tree-drop tree-drop-yes"></span>
			</div>

			<!-- Pills row aligned with each path -->
			<div class="mfork-labels">
				<span class="label-pill no-pill">NO</span>
				<span class="label-pill yes-pill">YES</span>
			</div>

			<!-- Twin columns: NO holds the basics, YES is just an intro before expanding -->
			<div class="mfork-cols">
				<article class="mfork-col no-col">
					<h2 class="mfork-col-title">Start with the basics</h2>
					<p class="mfork-col-sub">Three quick reads.</p>
					<ol class="mfork-links">
						{#each noPathBlogs as blog, i}
							<li>
								<a href={blog.url}>
									<span class="link-num">{(i + 1).toString().padStart(2, '0')}</span>
									<span class="link-text">
										<span class="link-title">{blog.title}</span>
										<span class="link-sub">{blog.subtitle}</span>
									</span>
								</a>
							</li>
						{/each}
					</ol>
					<div class="no-end">
						<span class="end-mark" aria-hidden="true">×</span>
						<span>Come back when you know your type.</span>
					</div>
				</article>

				<article class="mfork-col yes-col">
					<div class="yes-card">
						<h2 class="mfork-col-title">9takes is your place</h2>
						<p class="mfork-col-tease">Like Reddit — with personality types on every reply.</p>
					</div>
					<div class="yes-trail" aria-hidden="true">
						<span class="trail-line"></span>
					</div>
				</article>
			</div>

			<!-- YES path takes over the full width -->
			<div class="mfork-takeover">
				<span class="takeover-bridge" aria-hidden="true"></span>
				<p class="takeover-headline">
					<em>Reddit — but every comment is tagged with the writer's Enneagram type.</em>
				</p>
				<p class="takeover-body">
					One question. Nine emotional lenses. You stop assuming everyone reacts the way you do —
					and start seeing situations through eyes that work nothing like yours.
				</p>
				<div class="takeover-cta">
					<span class="cta-label">Keep scrolling</span>
					<span class="cta-arrow" aria-hidden="true">↓</span>
				</div>
			</div>
		</section>

		<!-- ========== DESKTOP FORK SECTION (desktop only) ========== -->
		<section class="fork-section desktop-only" in:fly={getTransition()}>
			<header class="fork-header">
				<div class="section-badge accent">
					<span class="badge-dot"></span>
					<span>START HERE</span>
				</div>
				<h1 class="fork-h1">Do you know about the Enneagram?</h1>
			</header>

			<div class="fork-tree" aria-hidden="true">
				<div class="line trunk"></div>
				<div class="line crossbar"></div>
				<div class="line drop drop-no"></div>
				<div class="line drop drop-yes"></div>
			</div>

			<div class="fork-grid">
				<article class="branch branch-no">
					<span class="branch-label no-label">NO</span>
					<h2 class="branch-title">Start with the basics</h2>
					<p class="branch-intro">Three quick reads to get you up to speed.</p>
					<ul class="branch-links">
						{#each noPathBlogs as blog}
							<li>
								<a href={blog.url} class="branch-link">
									<span class="branch-link-title">{blog.title}</span>
									<span class="branch-link-sub">{blog.subtitle}</span>
								</a>
							</li>
						{/each}
					</ul>
					<div class="branch-end">
						<span class="terminus-dot" aria-hidden="true"></span>
						<span class="terminus-text">Come back when you know your type.</span>
					</div>
				</article>

				<article class="branch branch-yes">
					<span class="branch-label yes-label">YES</span>
					<h2 class="branch-title">Then 9takes is your kind of place</h2>
					<p class="branch-tagline">
						<em>Think Reddit — but every comment is tagged with the commenter's Enneagram type.</em>
					</p>
					<p class="branch-body">
						One question, nine emotional lenses. So you stop assuming everyone reacts the way you do
						— and start seeing situations through eyes that work nothing like yours.
					</p>
				</article>
			</div>

			<div class="fork-merge" aria-hidden="true">
				<div class="line merge-down-yes"></div>
				<div class="line merge-horizontal"></div>
				<div class="line merge-into-trunk"></div>
				<div class="merge-node"></div>
			</div>
		</section>

		<!-- ========== GIVE-FIRST MECHANIC ========== -->
		<div class="section-observer">
			{#if sectionsVisible[0] || !browser}
				<section class="section funnel-section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge accent">
							<span class="badge-dot"></span>
							<span>HOW IT WORKS</span>
						</div>
						<h2 class="section-title">Give first. Then see the rest.</h2>
						<p class="section-desc">
							Every other comment section rewards the loudest voice in the room. Ours does the
							opposite — it captures your honest reaction <em>before</em> the crowd has a chance to shape
							it.
						</p>
					</header>

					<div class="give-first-row">
						<div class="give-step">
							<span class="step-num">1</span>
							<h3>Answer before you see anything</h3>
							<p>
								You write your take first. No scrolling past other comments, no anchoring to the
								loudest voice, no quietly copying whoever posted first.
							</p>
						</div>

						<div class="give-step">
							<span class="step-num">2</span>
							<h3>Then see how each type answered</h3>
							<p>
								Every response is tagged with the commenter's Enneagram type. When a Type 8 lands
								somewhere a Type 4 never would, you see <em>why</em> — not just <em>what</em>.
							</p>
						</div>

						<div class="give-step give-step-why">
							<span class="step-num">3</span>
							<h3>What you get: answers you can actually trust</h3>
							<p>
								Most comment sections just echo whoever posted first. Ours don't — so we end up with
								a library of honest reactions from real people. The kind of data you won't find
								anywhere else online.
							</p>
						</div>
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== QUESTION OF THE DAY ========== -->
		<div class="section-observer">
			{#if sectionsVisible[1] || !browser}
				<section class="section funnel-section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge accent">
							<span class="badge-dot"></span>
							<span>BUILDING THE BASE</span>
						</div>
						<h2 class="section-title">Slowly, novel answer by novel answer</h2>
						<p class="section-desc">
							We're growing a base of unbiased takes from real people across all nine types. Here's
							today's question.
						</p>
					</header>

					{#if data.questionOfTheDay}
						<div class="qotd-wrap">
							<a href={`/questions/${data.questionOfTheDay.url}`} class="quest-card">
								<div class="quest-header">
									<div class="quest-badge">
										<span class="quest-icon">!</span>
										<span class="quest-label">TODAY'S QUESTION</span>
									</div>
									<div class="quest-responses">
										<span class="response-count">{data.questionOfTheDay.comment_count || 0}</span>
										<span class="response-label">responses</span>
									</div>
								</div>

								<h3 class="quest-title">{data.questionOfTheDay.question_formatted}</h3>

								<div class="quest-cta">
									<span class="cta-text">Give Your Take</span>
									<span class="cta-arrow">→</span>
								</div>
							</a>
						</div>
					{/if}
				</section>
			{/if}
		</div>

		<!-- ========== BLOGS ON THE ENNEAGRAM ========== -->
		<div class="section-observer">
			{#if sectionsVisible[2] || !browser}
				<section class="section funnel-section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge accent">
							<span class="badge-dot"></span>
							<span>DIG DEEPER</span>
						</div>
						<h2 class="section-title">We write a lot about the Enneagram</h2>
						<p class="section-desc">
							Type breakdowns, relationship dynamics, growth paths, communication patterns — all in
							plain English.
						</p>
					</header>

					<div class="blogs-grid">
						{#each blogCategories as cat}
							<a href={cat.href} class="blog-card">
								<div class="blog-card-icon" aria-hidden="true">
									{#if cat.icon === 'bubbles'}
										<svg
											viewBox="0 0 48 48"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path
												d="M8 12a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H22l-8 6v-6h-2a4 4 0 0 1-4-4z"
											/>
											<circle cx="18" cy="20" r="1.6" fill="currentColor" stroke="none" />
											<circle cx="24" cy="20" r="1.6" fill="currentColor" stroke="none" />
											<circle cx="30" cy="20" r="1.6" fill="currentColor" stroke="none" />
										</svg>
									{:else if cat.icon === 'nonagon'}
										<svg
											viewBox="0 0 48 48"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<circle cx="24" cy="24" r="18" />
											<circle cx="24" cy="24" r="10" opacity="0.55" />
											<circle cx="24" cy="6" r="1.8" fill="currentColor" stroke="none" />
											<circle cx="36" cy="10" r="1.8" fill="currentColor" stroke="none" />
											<circle cx="42" cy="21" r="1.8" fill="currentColor" stroke="none" />
											<circle cx="40" cy="33" r="1.8" fill="currentColor" stroke="none" />
											<circle cx="30" cy="41" r="1.8" fill="currentColor" stroke="none" />
											<circle cx="18" cy="41" r="1.8" fill="currentColor" stroke="none" />
											<circle cx="8" cy="33" r="1.8" fill="currentColor" stroke="none" />
											<circle cx="6" cy="21" r="1.8" fill="currentColor" stroke="none" />
											<circle cx="12" cy="10" r="1.8" fill="currentColor" stroke="none" />
										</svg>
									{:else if cat.icon === 'checklist'}
										<svg
											viewBox="0 0 48 48"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<rect x="9" y="6" width="30" height="36" rx="3" />
											<path d="M15 16l3 3 6-6" />
											<path d="M26 17h8" />
											<path d="M15 28l3 3 6-6" />
											<path d="M26 29h8" />
											<path d="M15 37h14" />
										</svg>
									{/if}
								</div>

								<h3 class="blog-card-title">{cat.label}</h3>
								<p class="blog-card-desc">{cat.desc}</p>

								<ul class="blog-card-peek">
									{#each cat.peeks as peek}
										<li>{peek}</li>
									{/each}
								</ul>

								<div class="blog-card-footer">
									<span class="blog-card-count">{cat.count}</span>
									<span class="blog-card-cta">Browse →</span>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== FAMOUS PEOPLE GRID ========== -->
		<div class="section-observer">
			{#if sectionsVisible[3] || !browser}
				<section class="section types-section funnel-section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge accent">
							<span class="badge-dot"></span>
							<span>SEE IT IN ACTION</span>
						</div>
						<h2 class="section-title">We analyze famous people on purpose</h2>
						<p class="section-desc">
							Reading real people is the fastest way to understand yourself — and everyone around
							you.
						</p>
					</header>

					<div class="types-grid">
						{#each data.typeRepresentatives as person, i}
							{@const typeNum = person.type}
							{@const typeInfo = shadowTypes[typeNum]}
							<a
								href={person.hasLink
									? buildPersonalityAnalysisPath(person.name)
									: `/enneagram-corner/enneagram-type-${typeNum}`}
								class="type-card"
								style="--type-color: {typeInfo.color}"
							>
								<div class="card-bg"></div>
								<div class="card-content">
									<div class="type-number">{typeNum}</div>

									<div class="avatar-wrap">
										{#if person.hasImage}
											<img
												src={buildPersonalityImagePath(typeNum, person.name, 'thumbnail')}
												alt={formatPersonalityDisplayName(person.name)}
												class="avatar"
												loading={i < 3 ? 'eager' : 'lazy'}
												fetchpriority={i < 3 ? 'high' : 'low'}
												width="160"
												height="160"
												decoding="async"
											/>
										{:else}
											<div class="avatar-placeholder">
												<span>{typeNum}</span>
											</div>
										{/if}
									</div>

									<div class="type-info">
										{#if person.personaTitle}
											<span class="type-title">{person.personaTitle}</span>
										{/if}
										<span class="type-name">{typeInfo.name} - {typeInfo.stancePhrase}</span>
									</div>

									<div class="type-meta">
										<span class="meta-value">{formatPersonalityDisplayName(person.name)}</span>
									</div>
								</div>
							</a>
						{/each}
					</div>

					<div class="section-ctas">
						<a href="/personality-analysis" class="btn-shadow">
							<span>Browse All Famous Types</span>
						</a>
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== COACHING ========== -->
		<div class="section-observer">
			{#if sectionsVisible[4] || !browser}
				<section class="section" in:fly={getTransition()}>
					<div class="coaching-card">
						<div class="coaching-glow"></div>
						<div class="coaching-content">
							<div class="coaching-badge">
								<span class="badge-icon">★</span>
								<span>1-ON-1 SESSIONS</span>
							</div>

							<h2 class="coaching-title">Ready to Go Deeper?</h2>

							<p class="coaching-desc">
								Apply Enneagram insights directly to your situation. Personalized coaching for
								relationships, career decisions, or personal growth.
							</p>

							<ul class="coaching-features">
								<li>
									<span class="feature-check">✓</span>
									<span>Identify your type with precision</span>
								</li>
								<li>
									<span class="feature-check">✓</span>
									<span>Map your triggers and growth edges</span>
								</li>
								<li>
									<span class="feature-check">✓</span>
									<span>Decode specific relationships or conflicts</span>
								</li>
							</ul>

							<a href="/book-session" class="btn-shadow lg">
								<span>Join the Waitlist</span>
							</a>

							<p class="coaching-note">Join the waitlist for personalized Enneagram coaching</p>
						</div>
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== FINAL CTA ========== -->
		{#if !data?.user}
			<div class="section-observer">
				{#if sectionsVisible[5] || !browser}
					<section class="final-section" in:fly={getTransition()}>
						<div class="final-glow"></div>
						<div class="final-inner">
							<div class="final-badge">
								<span class="badge-pulse"></span>
								<span>START HERE</span>
							</div>

							<h2 class="final-title">
								See. Act. <span class="text-glow">Connect.</span>
							</h2>

							<p class="final-desc">See what you're missing. Know what to do. Feel understood.</p>

							<div class="final-actions">
								<a href="/questions" class="btn-shadow lg">
									<span>Answer Today's Question</span>
								</a>
								<a href="/register" class="btn-system">Create Free Account</a>
							</div>
						</div>
					</section>
				{/if}
			</div>
		{/if}
	</main>
</div>

<style>
	/* ==========================================
	   HOMEPAGE-SHADE VARIABLES
	   ========================================== */
	.sl-page {
		--void-shadow: var(--bg-base);
		--void-umbra: var(--bg-deep);
		--void-penumbra: var(--bg-surface);

		--text-pale: var(--text-primary);
		--text-mist: var(--text-secondary);
		--text-faded: var(--text-muted);

		--shadow-flame: var(--primary);
		--shadow-ethereal: var(--primary-light);
		--shadow-deep: var(--primary-dark);

		--system-hologram: var(--secondary);
		--system-stream: var(--secondary-light);
		--system-deep: var(--secondary-dark);

		--status-gold: var(--secondary);
		--status-gold-bright: var(--secondary-light);

		--ease-out: cubic-bezier(0.4, 0, 0.2, 1);

		/* Fork-specific tree variables */
		--col-gap: 2rem;
		--no-width: calc((100% - var(--col-gap)) / 3);
		--no-center: calc(var(--no-width) / 2);
		--yes-start: calc(var(--no-width) + var(--col-gap));
		--yes-width: calc((100% - var(--col-gap)) * 2 / 3);
		--yes-center: calc(var(--yes-start) + var(--yes-width) / 2);

		--line-color: rgba(45, 212, 191, 0.55);
		--line-glow: rgba(45, 212, 191, 0.35);
	}

	.sl-page {
		position: relative;
		min-height: 100vh;
		background: var(--bg-base);
		color: var(--text-pale);
		font-family: var(--font-family);
		overflow-x: hidden;
	}

	.content {
		position: relative;
		z-index: 10;
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* Background layers */
	.bg-void {
		position: fixed;
		inset: 0;
		background: var(--bg-base);
		z-index: 0;
	}
	.bg-ambient {
		position: fixed;
		inset: 0;
		background:
			radial-gradient(ellipse at 25% 0%, rgba(45, 212, 191, 0.1) 0%, transparent 50%),
			radial-gradient(ellipse at 75% 100%, rgba(251, 113, 133, 0.08) 0%, transparent 50%);
		z-index: 1;
		pointer-events: none;
	}
	.bg-grid {
		position: fixed;
		inset: 0;
		background-image:
			linear-gradient(rgba(45, 212, 191, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(45, 212, 191, 0.02) 1px, transparent 1px);
		background-size: 60px 60px;
		z-index: 2;
		pointer-events: none;
	}

	.text-glow {
		color: var(--shadow-flame);
		text-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
	}

	/* ==========================================
	   FORK SECTION
	   ========================================== */
	.fork-section {
		padding: 5rem 0 1rem;
		text-align: center;
	}

	.fork-header {
		max-width: 760px;
		margin: 0 auto;
	}

	.fork-h1 {
		font-family: var(--font-display);
		font-size: clamp(2rem, 5.5vw, 3.25rem);
		font-weight: 700;
		line-height: 1.15;
		color: var(--text-pale);
		margin: 1rem 0 0;
	}

	/* ----- Top tree connector (trunk + crossbar + drops) ----- */
	.fork-tree {
		position: relative;
		height: 90px;
		margin-top: 1.25rem;
	}

	.line {
		position: absolute;
		background: var(--line-color);
		box-shadow: 0 0 10px var(--line-glow);
		border-radius: 1px;
	}

	.trunk {
		top: 0;
		left: 50%;
		width: 2px;
		height: 36px;
		transform: translateX(-1px);
	}

	.crossbar {
		top: 36px;
		left: var(--no-center);
		right: calc(100% - var(--yes-center));
		height: 2px;
	}

	.drop {
		top: 36px;
		width: 2px;
		height: 54px;
	}

	.drop-no {
		left: var(--no-center);
		transform: translateX(-1px);
	}

	.drop-yes {
		left: var(--yes-center);
		transform: translateX(-1px);
	}

	/* ----- Branches grid ----- */
	.fork-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: var(--col-gap);
		align-items: stretch;
	}

	.branch {
		position: relative;
		text-align: left;
		padding: 1.75rem 1.5rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(45, 212, 191, 0.18);
		border-radius: 16px;
		box-shadow:
			0 0 30px rgba(45, 212, 191, 0.06),
			inset 0 1px 0 rgba(45, 212, 191, 0.08);
	}

	.branch-no {
		align-self: start;
		border-color: rgba(251, 113, 133, 0.22);
		box-shadow:
			0 0 30px rgba(251, 113, 133, 0.06),
			inset 0 1px 0 rgba(251, 113, 133, 0.08);
	}

	.branch-yes {
		border-color: rgba(45, 212, 191, 0.28);
	}

	.branch-label {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.15em;
		padding: 0.3rem 0.65rem;
		border-radius: 4px;
		margin-bottom: 0.85rem;
	}

	.no-label {
		background: rgba(251, 113, 133, 0.12);
		color: var(--system-hologram);
		border: 1px solid rgba(251, 113, 133, 0.28);
	}

	.yes-label {
		background: rgba(45, 212, 191, 0.12);
		color: var(--shadow-flame);
		border: 1px solid rgba(45, 212, 191, 0.32);
	}

	.branch-title {
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.4vw, 1.6rem);
		font-weight: 700;
		color: var(--text-pale);
		margin: 0 0 0.65rem;
		line-height: 1.25;
	}

	.branch-intro,
	.branch-tagline,
	.branch-body {
		color: var(--text-mist);
		line-height: 1.6;
		margin: 0 0 1rem;
	}

	.branch-tagline em {
		color: var(--shadow-ethereal);
		font-style: italic;
	}

	.branch-links {
		list-style: none;
		padding: 0;
		margin: 1rem 0 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.branch-link {
		display: block;
		padding: 0.85rem 1rem;
		border-radius: 10px;
		background: color-mix(in srgb, var(--bg-deep) 70%, transparent);
		border: 1px solid rgba(251, 113, 133, 0.18);
		text-decoration: none;
		transition: all 200ms var(--ease-out);
	}

	.branch-link:hover {
		border-color: rgba(251, 113, 133, 0.45);
		background: color-mix(in srgb, var(--bg-deep) 60%, transparent);
		transform: translateX(2px);
		box-shadow: 0 0 20px rgba(251, 113, 133, 0.12);
	}

	.branch-link-title {
		display: block;
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-pale);
	}

	.branch-link-sub {
		display: block;
		font-size: 0.8rem;
		color: var(--text-faded);
		margin-top: 0.15rem;
	}

	.branch-end {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px dashed rgba(251, 113, 133, 0.2);
	}

	.terminus-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--system-hologram);
		box-shadow: 0 0 12px rgba(251, 113, 133, 0.6);
		flex-shrink: 0;
	}

	.terminus-text {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-faded);
		letter-spacing: 0.04em;
	}

	/* ----- Merge connector (yes branch → next full-width section) ----- */
	.fork-merge {
		position: relative;
		height: 110px;
	}

	.merge-down-yes {
		top: 0;
		left: var(--yes-center);
		width: 2px;
		height: 50px;
		transform: translateX(-1px);
	}

	.merge-horizontal {
		top: 50px;
		left: 50%;
		right: calc(100% - var(--yes-center));
		height: 2px;
	}

	.merge-into-trunk {
		top: 50px;
		left: 50%;
		width: 2px;
		height: 50px;
		transform: translateX(-1px);
	}

	.merge-node {
		position: absolute;
		top: calc(100px - 6px);
		left: 50%;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--shadow-flame);
		box-shadow:
			0 0 18px rgba(45, 212, 191, 0.7),
			0 0 4px rgba(45, 212, 191, 0.9);
		transform: translateX(-50%);
	}

	/* ==========================================
	   FUNNEL SECTIONS (post-fork)
	   ========================================== */
	.section {
		padding: 3rem 0;
	}

	.section-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.section-header em {
		color: var(--shadow-ethereal);
		font-style: italic;
	}

	.section-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: rgba(251, 113, 133, 0.08);
		border: 1px solid rgba(251, 113, 133, 0.15);
		border-radius: 4px;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--system-hologram);
	}

	.section-badge.accent {
		background: rgba(45, 212, 191, 0.08);
		border-color: rgba(45, 212, 191, 0.15);
		color: var(--shadow-flame);
	}

	.section-badge.accent .badge-dot {
		background: var(--shadow-flame);
		box-shadow: 0 0 8px var(--primary);
	}

	.badge-dot {
		width: 5px;
		height: 5px;
		background: var(--system-hologram);
		border-radius: 50%;
		box-shadow: 0 0 8px var(--secondary);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.6rem, 3.6vw, 2.25rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.5rem;
	}

	.section-desc {
		font-size: 1rem;
		color: var(--text-mist);
		max-width: 580px;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* ----- Give-first row ----- */
	.give-first-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
		align-items: stretch;
		max-width: 1000px;
		margin: 0 auto;
	}

	.give-step {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 1.75rem 1.5rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(45, 212, 191, 0.18);
		border-radius: 14px;
		text-align: left;
	}

	.give-step-why {
		border-color: rgba(45, 212, 191, 0.35);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--primary) 6%, var(--void-shadow)) 0%,
			var(--void-umbra) 100%
		);
		box-shadow:
			0 0 30px rgba(45, 212, 191, 0.08),
			inset 0 1px 0 rgba(45, 212, 191, 0.1);
	}

	.step-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.85rem;
		height: 1.85rem;
		background: color-mix(in srgb, var(--primary) 18%, var(--bg-deep));
		border: 1px solid rgba(45, 212, 191, 0.4);
		color: var(--shadow-flame);
		border-radius: 6px;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 0.9rem;
		margin-bottom: 0.85rem;
	}

	.give-step h3 {
		font-family: var(--font-display);
		font-size: 1.1rem;
		line-height: 1.3;
		color: var(--text-pale);
		margin: 0 0 0.55rem;
	}

	.give-step p {
		margin: 0;
		font-size: 0.92rem;
		color: var(--text-mist);
		line-height: 1.55;
	}

	.give-step p em {
		color: var(--shadow-ethereal);
		font-style: italic;
	}

	/* ----- Question of the Day card ----- */
	.qotd-wrap {
		display: flex;
		justify-content: center;
	}

	.quest-card {
		display: block;
		width: 100%;
		max-width: 600px;
		padding: 1.5rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(45, 212, 191, 0.2);
		border-radius: 16px;
		text-decoration: none;
		box-shadow:
			0 0 40px rgba(45, 212, 191, 0.1),
			inset 0 1px 0 rgba(45, 212, 191, 0.1);
		transition: all 300ms var(--ease-out);
	}

	.quest-card:hover {
		border-color: rgba(45, 212, 191, 0.4);
		box-shadow:
			0 0 60px rgba(45, 212, 191, 0.2),
			inset 0 1px 0 rgba(45, 212, 191, 0.15);
		transform: translateY(-4px);
	}

	.quest-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.quest-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.quest-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		background: color-mix(in srgb, var(--primary-subtle) 70%, var(--bg-deep));
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		color: var(--shadow-flame);
		border-radius: 4px;
		font-weight: 700;
		font-size: 0.9rem;
	}

	.quest-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--shadow-flame);
		letter-spacing: 0.08em;
	}

	.quest-responses {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--text-mist);
	}

	.response-count {
		color: var(--system-hologram);
		font-weight: 600;
	}

	.quest-title {
		font-family: var(--font-display);
		font-size: clamp(1.125rem, 3vw, 1.5rem);
		font-weight: 600;
		color: var(--text-pale);
		line-height: 1.35;
		margin: 0 0 1rem;
		text-align: left;
	}

	.quest-cta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-on-primary);
		transition:
			transform 200ms ease,
			box-shadow 200ms ease,
			background 200ms ease;
	}

	.cta-arrow {
		transition: transform 200ms ease;
	}

	.quest-card:hover .quest-cta {
		background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
	}

	.quest-card:hover .cta-arrow {
		transform: translateX(4px);
	}

	/* ----- Blogs grid ----- */
	.blogs-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 720px) {
		.blogs-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.blog-card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.75rem 1.5rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(45, 212, 191, 0.18);
		border-radius: 16px;
		text-decoration: none;
		overflow: hidden;
		transition: all 240ms var(--ease-out);
	}

	.blog-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 0%, rgba(45, 212, 191, 0.1) 0%, transparent 55%);
		opacity: 0;
		transition: opacity 240ms ease;
		pointer-events: none;
	}

	.blog-card:hover {
		border-color: rgba(45, 212, 191, 0.42);
		transform: translateY(-4px);
		box-shadow: 0 0 40px rgba(45, 212, 191, 0.14);
	}

	.blog-card:hover::before {
		opacity: 1;
	}

	.blog-card-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3.25rem;
		height: 3.25rem;
		background: color-mix(in srgb, var(--primary) 10%, var(--bg-deep));
		border: 1px solid rgba(45, 212, 191, 0.3);
		border-radius: 12px;
		color: var(--shadow-flame);
		margin-bottom: 0.25rem;
		box-shadow: inset 0 0 16px rgba(45, 212, 191, 0.12);
	}

	.blog-card-icon svg {
		width: 1.9rem;
		height: 1.9rem;
	}

	.blog-card:hover .blog-card-icon {
		border-color: rgba(45, 212, 191, 0.55);
		box-shadow: inset 0 0 16px rgba(45, 212, 191, 0.2);
	}

	.blog-card-title {
		font-family: var(--font-display);
		font-size: 1.2rem;
		color: var(--text-pale);
		margin: 0;
		line-height: 1.25;
	}

	.blog-card-desc {
		font-size: 0.9rem;
		color: var(--text-mist);
		margin: 0;
		line-height: 1.5;
	}

	.blog-card-peek {
		list-style: none;
		padding: 0.75rem 0 0;
		margin: 0.25rem 0 0;
		border-top: 1px dashed rgba(45, 212, 191, 0.18);
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.blog-card-peek li {
		position: relative;
		padding-left: 1.1rem;
		font-size: 0.82rem;
		color: var(--text-mist);
		line-height: 1.45;
	}

	.blog-card-peek li::before {
		content: '›';
		position: absolute;
		left: 0;
		top: -1px;
		color: var(--shadow-flame);
		font-weight: 700;
		font-size: 0.95rem;
	}

	.blog-card-footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem 0.75rem;
		margin-top: auto;
		padding-top: 0.85rem;
	}

	.blog-card-count {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		padding: 0.25rem 0.5rem;
		background: rgba(45, 212, 191, 0.08);
		border: 1px solid rgba(45, 212, 191, 0.2);
		border-radius: 4px;
		color: var(--shadow-ethereal);
		letter-spacing: 0.04em;
		white-space: nowrap;
	}

	.blog-card-cta {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--shadow-flame);
		letter-spacing: 0.05em;
		white-space: nowrap;
	}

	/* ==========================================
	   FAMOUS PEOPLE GRID
	   ========================================== */
	.types-section {
		background: linear-gradient(
			180deg,
			var(--void-umbra) 0%,
			var(--void-shadow) 50%,
			var(--void-umbra) 100%
		);
		border-radius: 24px;
		margin: 1rem 0;
		padding: 3rem 1rem;
	}

	@media (min-width: 640px) {
		.types-section {
			padding: 4rem 2rem;
		}
	}

	.section-ctas {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		align-items: center;
		margin-top: 2.5rem;
	}

	@media (min-width: 480px) {
		.section-ctas {
			flex-direction: row;
			gap: 1.25rem;
		}
	}

	.types-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.types-grid {
			gap: 1rem;
		}
	}

	.type-card {
		--type-color: var(--primary);
		position: relative;
		display: block;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid color-mix(in srgb, var(--type-color) 15%, transparent);
		border-radius: 12px;
		padding: 1rem;
		text-decoration: none;
		overflow: hidden;
		transition: all 250ms var(--ease-out);
	}

	.type-card:hover {
		border-color: color-mix(in srgb, var(--type-color) 40%, transparent);
		box-shadow: 0 0 30px color-mix(in srgb, var(--type-color) 20%, transparent);
		transform: translateY(-4px);
	}

	.card-bg {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 50% 0%,
			color-mix(in srgb, var(--type-color) 10%, transparent) 0%,
			transparent 60%
		);
		opacity: 0;
		transition: opacity 250ms ease;
	}

	.type-card:hover .card-bg {
		opacity: 1;
	}

	.card-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.type-number {
		position: absolute;
		top: -0.5rem;
		left: -0.5rem;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--type-color) 15%, var(--bg-base));
		border: 1px solid color-mix(in srgb, var(--type-color) 40%, transparent);
		border-radius: 4px;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--type-color);
	}

	.avatar-wrap {
		margin: 0.5rem 0;
	}

	.avatar {
		width: 4rem;
		height: 4rem;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid var(--type-color);
		box-shadow: 0 0 15px color-mix(in srgb, var(--type-color) 35%, transparent);
	}

	@media (min-width: 640px) {
		.avatar {
			width: 5rem;
			height: 5rem;
		}
	}

	.avatar-placeholder {
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--void-penumbra);
		border-radius: 50%;
		border: 2px solid var(--type-color);
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--type-color);
	}

	@media (min-width: 640px) {
		.avatar-placeholder {
			width: 5rem;
			height: 5rem;
		}
	}

	.type-info {
		margin-top: 0.5rem;
	}

	.type-title {
		display: none;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 600;
		color: var(--type-color);
		letter-spacing: 0.04em;
		margin-bottom: 0.15rem;
	}

	@media (min-width: 640px) {
		.type-title {
			display: block;
		}
	}

	.type-name {
		display: none;
		font-size: 0.75rem;
		color: var(--text-pale);
	}

	@media (min-width: 640px) {
		.type-name {
			display: block;
			font-size: 0.85rem;
		}
	}

	.type-meta {
		margin-top: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
	}

	@media (min-width: 640px) {
		.type-meta {
			display: block;
			font-size: 0.6rem;
		}
	}

	.meta-value {
		color: var(--type-color);
		font-weight: 600;
	}

	/* ==========================================
	   BUTTONS
	   ========================================== */
	.btn-shadow {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.875rem 1.75rem;
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		border-radius: 8px;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-on-primary);
		text-decoration: none;
		cursor: pointer;
		overflow: hidden;
		transition: all 250ms var(--ease-out);
	}

	.btn-shadow:hover {
		background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
		transform: translateY(-2px);
	}

	.btn-shadow.lg {
		padding: 1rem 2rem;
		font-size: 1.05rem;
	}

	.btn-system {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.875rem 1.75rem;
		background: color-mix(in srgb, var(--bg-deep) 88%, transparent);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 25%, transparent);
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-decoration: none;
		cursor: pointer;
		transition: all 250ms var(--ease-out);
	}

	.btn-system:hover {
		border-color: color-mix(in srgb, var(--primary) 35%, transparent);
		background: var(--primary-subtle);
		color: var(--primary);
		transform: translateY(-2px);
	}

	.btn-shadow:focus-visible,
	.btn-system:focus-visible,
	.quest-card:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 3px;
	}

	/* ==========================================
	   COACHING
	   ========================================== */
	.coaching-card {
		position: relative;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(245, 158, 11, 0.2);
		border-radius: 20px;
		overflow: hidden;
	}

	.coaching-glow {
		position: absolute;
		top: -50%;
		left: 50%;
		transform: translateX(-50%);
		width: 120%;
		height: 100%;
		background: radial-gradient(ellipse at center, rgba(245, 158, 11, 0.1) 0%, transparent 60%);
		pointer-events: none;
	}

	.coaching-content {
		position: relative;
		padding: 2.5rem 1.5rem;
		text-align: center;
	}

	@media (min-width: 640px) {
		.coaching-content {
			padding: 3.5rem 2rem;
		}
	}

	.coaching-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid rgba(245, 158, 11, 0.2);
		border-radius: 4px;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--status-gold-bright);
	}

	.badge-icon {
		font-size: 0.8rem;
	}

	.coaching-title {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.75rem;
	}

	.coaching-desc {
		font-size: 1rem;
		color: var(--text-mist);
		max-width: 500px;
		margin: 0 auto 1.5rem;
		line-height: 1.6;
	}

	.coaching-features {
		list-style: none;
		padding: 0;
		margin: 0 auto 1.5rem;
		max-width: 350px;
		text-align: left;
	}

	.coaching-features li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		font-size: 0.9rem;
		color: var(--text-mist);
	}

	.feature-check {
		color: var(--status-gold-bright);
		font-weight: 700;
	}

	.coaching-note {
		margin-top: 1rem;
		font-size: 0.8rem;
		color: var(--text-faded);
	}

	/* ==========================================
	   FINAL CTA
	   ========================================== */
	.final-section {
		position: relative;
		margin: 2rem 0 4rem;
		border-radius: 20px;
		background: linear-gradient(
			135deg,
			rgba(45, 212, 191, 0.12) 0%,
			rgba(251, 113, 133, 0.12) 50%,
			var(--void-umbra) 100%
		);
		border: 1px solid rgba(45, 212, 191, 0.25);
		overflow: hidden;
	}

	.final-glow {
		position: absolute;
		top: -40%;
		left: 50%;
		transform: translateX(-50%);
		width: 140%;
		height: 100%;
		background: radial-gradient(ellipse at center, rgba(45, 212, 191, 0.15) 0%, transparent 60%);
		pointer-events: none;
	}

	.final-inner {
		position: relative;
		padding: 3rem 1.5rem;
		text-align: center;
	}

	@media (min-width: 640px) {
		.final-inner {
			padding: 4rem 2rem;
		}
	}

	.final-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: rgba(45, 212, 191, 0.1);
		border: 1px solid rgba(45, 212, 191, 0.2);
		border-radius: 4px;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--shadow-flame);
	}

	.badge-pulse {
		width: 6px;
		height: 6px;
		background: var(--shadow-flame);
		border-radius: 50%;
		animation: pulse-dot 1.5s ease-in-out infinite;
	}

	@keyframes pulse-dot {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	.final-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.5rem;
	}

	.final-desc {
		font-size: 1rem;
		color: var(--text-mist);
		margin-bottom: 1.5rem;
	}

	.final-actions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	@media (min-width: 480px) {
		.final-actions {
			flex-direction: row;
		}
	}

	/* ==========================================
	   MOBILE FORK SECTION (<768px only)
	   ========================================== */
	.mobile-fork-section {
		position: relative;
		padding: 2.5rem 0 0.5rem;
		text-align: center;
		/* Geometry: column gap drives where the tree drops, rails, and bridge land */
		--mfork-gap: 0.85rem;
		--no-x: calc(25% - var(--mfork-gap) / 4);
		--yes-x: calc(75% + var(--mfork-gap) / 4);
	}

	.mobile-fork-header {
		max-width: 560px;
		margin: 0 auto;
		padding: 0 0.25rem;
	}

	.mobile-fork-h1 {
		font-family: var(--font-display);
		font-size: clamp(1.85rem, 8.5vw, 2.4rem);
		font-weight: 700;
		line-height: 1.12;
		letter-spacing: -0.015em;
		color: var(--text-pale);
		margin: 0.85rem 0 0;
	}

	/* ----- Branching tree (root → trunk → split → drops) ----- */
	.mfork-tree {
		position: relative;
		height: 58px;
		margin: 1.5rem 0 0.65rem;
	}

	.tree-root {
		position: absolute;
		left: 50%;
		top: 0;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--shadow-flame);
		box-shadow:
			0 0 14px rgba(45, 212, 191, 0.85),
			0 0 4px rgba(45, 212, 191, 1);
		transform: translate(-50%, -50%);
		z-index: 2;
	}

	.tree-trunk {
		position: absolute;
		left: 50%;
		top: 4px;
		width: 2px;
		height: 18px;
		background: var(--line-color);
		box-shadow: 0 0 8px var(--line-glow);
		border-radius: 1px;
		transform: translateX(-50%);
	}

	.tree-cross {
		position: absolute;
		top: 22px;
		left: var(--no-x);
		right: calc(100% - var(--yes-x));
		height: 2px;
		background: var(--line-color);
		box-shadow: 0 0 8px var(--line-glow);
		border-radius: 1px;
	}

	.tree-drop {
		position: absolute;
		top: 22px;
		width: 2px;
		height: 36px;
		border-radius: 1px;
	}

	.tree-drop-no {
		left: var(--no-x);
		background: linear-gradient(180deg, var(--line-color) 0%, rgba(251, 113, 133, 0.78) 100%);
		box-shadow: 0 0 8px rgba(251, 113, 133, 0.45);
		transform: translateX(-1px);
	}

	.tree-drop-yes {
		left: var(--yes-x);
		background: linear-gradient(180deg, var(--line-color) 0%, rgba(45, 212, 191, 0.85) 100%);
		box-shadow: 0 0 9px rgba(45, 212, 191, 0.55);
		transform: translateX(-1px);
	}

	/* ----- Pills row aligned with the drops ----- */
	.mfork-labels {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--mfork-gap);
		margin-bottom: 0.75rem;
	}

	.label-pill {
		justify-self: center;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		padding: 0.34rem 0.95rem;
		border-radius: 999px;
		line-height: 1;
	}

	.label-pill.no-pill {
		background: rgba(251, 113, 133, 0.14);
		color: var(--system-hologram);
		border: 1px solid rgba(251, 113, 133, 0.45);
		box-shadow: 0 0 14px rgba(251, 113, 133, 0.18);
	}

	.label-pill.yes-pill {
		background: rgba(45, 212, 191, 0.14);
		color: var(--shadow-flame);
		border: 1px solid rgba(45, 212, 191, 0.5);
		box-shadow: 0 0 16px rgba(45, 212, 191, 0.24);
	}

	/* ----- Twin columns ----- */
	.mfork-cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--mfork-gap);
		align-items: stretch;
	}

	.mfork-col {
		position: relative;
		display: flex;
		flex-direction: column;
		text-align: left;
		padding: 1rem 0.85rem 1.05rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border-radius: 14px;
		min-width: 0;
	}

	.no-col {
		border: 1px solid rgba(251, 113, 133, 0.36);
		box-shadow:
			0 8px 28px rgba(0, 0, 0, 0.32),
			0 0 22px rgba(251, 113, 133, 0.08),
			inset 0 1px 0 rgba(251, 113, 133, 0.12);
	}

	/* The YES column is a transparent wrapper: a small card on top + a long rail below.
	   This keeps the YES card compact while letting the rail bridge the empty space. */
	.yes-col {
		background: none;
		border: none;
		box-shadow: none;
		padding: 0;
		border-radius: 0;
	}

	.yes-card {
		padding: 1rem 0.95rem 1.1rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(45, 212, 191, 0.45);
		border-radius: 14px;
		box-shadow:
			0 8px 28px rgba(0, 0, 0, 0.32),
			0 0 26px rgba(45, 212, 191, 0.12),
			inset 0 1px 0 rgba(45, 212, 191, 0.16);
	}

	.mfork-col-title {
		font-family: var(--font-display);
		font-size: 0.98rem;
		font-weight: 700;
		line-height: 1.22;
		color: var(--text-pale);
		margin: 0 0 0.45rem;
		letter-spacing: -0.005em;
	}

	.mfork-col-sub,
	.mfork-col-tease {
		font-size: 0.78rem;
		color: var(--text-mist);
		line-height: 1.5;
		margin: 0 0 0.75rem;
	}

	.mfork-col-tease {
		color: var(--shadow-ethereal);
	}

	/* ----- Quick-read links inside the NO column ----- */
	.mfork-links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.mfork-links li {
		display: block;
	}

	.mfork-links a {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		padding: 0.5rem 0.55rem 0.55rem;
		border-radius: 9px;
		background: color-mix(in srgb, var(--bg-deep) 70%, transparent);
		border: 1px solid rgba(251, 113, 133, 0.22);
		text-decoration: none;
		transition: all 180ms var(--ease-out);
	}

	.mfork-links a:active {
		border-color: rgba(251, 113, 133, 0.55);
		background: color-mix(in srgb, var(--bg-deep) 50%, transparent);
		transform: translateY(1px);
	}

	.mfork-links .link-num {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		color: var(--system-hologram);
		letter-spacing: 0.05em;
		padding-top: 0.22rem;
		flex-shrink: 0;
		line-height: 1;
	}

	.mfork-links .link-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
		flex: 1;
	}

	.mfork-links .link-title {
		font-family: var(--font-display);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-pale);
		line-height: 1.25;
	}

	.mfork-links .link-sub {
		font-size: 0.7rem;
		color: var(--text-faded);
		line-height: 1.32;
		margin-top: 0.15rem;
	}

	/* ----- NO terminus (the path stops here) ----- */
	.no-end {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		margin-top: 0.85rem;
		padding-top: 0.75rem;
		border-top: 1px dashed rgba(251, 113, 133, 0.32);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		color: var(--text-faded);
		line-height: 1.4;
		letter-spacing: 0.02em;
	}

	.end-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.05rem;
		height: 1.05rem;
		border-radius: 50%;
		background: rgba(251, 113, 133, 0.14);
		border: 1px solid rgba(251, 113, 133, 0.5);
		color: var(--system-hologram);
		font-size: 0.78rem;
		font-weight: 700;
		line-height: 1;
		flex-shrink: 0;
	}

	/* ----- YES trail (the rail that visually carries the path into the takeover) ----- */
	.yes-trail {
		position: relative;
		flex: 1;
		min-height: 80px;
		margin-top: 0.85rem;
	}

	.trail-line {
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0; /* yes-col has no padding now — extends to col bottom */
		width: 2px;
		transform: translateX(-1px);
		background: linear-gradient(
			180deg,
			rgba(45, 212, 191, 0.55) 0%,
			rgba(45, 212, 191, 0.85) 100%
		);
		box-shadow:
			0 0 10px rgba(45, 212, 191, 0.55),
			0 0 22px rgba(45, 212, 191, 0.25);
		border-radius: 1px;
		overflow: hidden;
	}

	/* A glowing pulse traveling down the rail to suggest the path is alive */
	.trail-line::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: -30%;
		height: 30%;
		background: linear-gradient(
			180deg,
			transparent 0%,
			rgba(255, 255, 255, 0.85) 50%,
			transparent 100%
		);
		filter: blur(0.5px);
		animation: trail-pulse 2.4s ease-in-out infinite;
	}

	@keyframes trail-pulse {
		0% {
			top: -30%;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			top: 100%;
			opacity: 0;
		}
	}

	/* ----- YES Takeover (full-width section the YES path expands into) ----- */
	.mfork-takeover {
		position: relative;
		margin-top: 1.8rem;
		padding: 1.6rem 1.25rem 1.4rem;
		background:
			radial-gradient(
				140% 140px at var(--yes-x) 0%,
				color-mix(in srgb, var(--primary) 22%, transparent) 0%,
				transparent 65%
			),
			linear-gradient(180deg, color-mix(in srgb, var(--primary) 6%, var(--void-shadow)) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(45, 212, 191, 0.42);
		border-radius: 16px;
		box-shadow:
			0 14px 36px rgba(0, 0, 0, 0.36),
			0 0 30px rgba(45, 212, 191, 0.12),
			inset 0 1px 0 rgba(45, 212, 191, 0.2);
		text-align: left;
	}

	/* The bridge: a glowing rail in the gap above the takeover, capped with a node */
	.takeover-bridge {
		position: absolute;
		left: var(--yes-x);
		top: -1.8rem;
		width: 2px;
		height: 1.8rem;
		transform: translateX(-1px);
		background: linear-gradient(180deg, rgba(45, 212, 191, 0.55) 0%, var(--shadow-flame) 100%);
		box-shadow: 0 0 10px rgba(45, 212, 191, 0.55);
		border-radius: 1px;
	}

	.takeover-bridge::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: -7px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--shadow-flame);
		box-shadow:
			0 0 22px rgba(45, 212, 191, 1),
			0 0 8px rgba(45, 212, 191, 1),
			0 0 0 3px color-mix(in srgb, var(--primary) 28%, transparent);
		transform: translateX(-50%);
		animation: bridge-pulse 3s ease-in-out infinite;
	}

	@keyframes bridge-pulse {
		0%,
		100% {
			box-shadow:
				0 0 22px rgba(45, 212, 191, 1),
				0 0 8px rgba(45, 212, 191, 1),
				0 0 0 3px color-mix(in srgb, var(--primary) 28%, transparent);
		}
		50% {
			box-shadow:
				0 0 28px rgba(45, 212, 191, 1),
				0 0 12px rgba(45, 212, 191, 1),
				0 0 0 6px color-mix(in srgb, var(--primary) 16%, transparent);
		}
	}

	.takeover-headline {
		position: relative;
		z-index: 2;
		font-family: var(--font-display);
		font-size: 1rem;
		line-height: 1.4;
		margin: 0 0 0.75rem;
		color: var(--text-pale);
		font-weight: 500;
	}

	.takeover-headline em {
		color: var(--shadow-ethereal);
		font-style: italic;
	}

	.takeover-body {
		position: relative;
		z-index: 2;
		font-size: 0.9rem;
		color: var(--text-mist);
		line-height: 1.55;
		margin: 0 0 1.1rem;
	}

	/* Distinct "go to next section" CTA — visually clear handoff */
	.takeover-cta {
		position: relative;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.55rem 0.95rem 0.55rem 1rem;
		background: color-mix(in srgb, var(--primary) 16%, var(--bg-deep));
		border: 1px solid rgba(45, 212, 191, 0.55);
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--text-pale);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		box-shadow:
			0 6px 18px rgba(0, 0, 0, 0.3),
			0 0 14px rgba(45, 212, 191, 0.3);
	}

	.cta-arrow {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.1rem;
		height: 1.1rem;
		border-radius: 50%;
		background: var(--shadow-flame);
		color: var(--bg-deep);
		font-size: 0.85rem;
		font-weight: 900;
		line-height: 1;
		animation: cta-arrow-bounce 2s ease-in-out infinite;
	}

	@keyframes cta-arrow-bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(3px);
		}
	}

	/* ==========================================
	   RESPONSIVE — collapse the tree on small screens
	   ========================================== */
	@media (max-width: 720px) {
		.fork-grid {
			grid-template-columns: 1fr;
		}

		.fork-tree,
		.fork-merge {
			display: none;
		}

		.branch {
			padding: 1.5rem 1.25rem;
		}

		.give-first-row {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 960px) and (min-width: 721px) {
		.give-first-row {
			grid-template-columns: 1fr 1fr;
		}

		.give-step-why {
			grid-column: 1 / -1;
		}
	}

	/* ==========================================
	   MOBILE OVERRIDES — the rest of the page
	   ========================================== */
	@media (max-width: 767px) {
		.content {
			padding: 0 1rem;
		}

		.section {
			padding: 2.25rem 0;
		}

		.section-header {
			margin-bottom: 1.5rem;
			padding: 0 0.25rem;
		}

		.section-title {
			font-size: clamp(1.45rem, 6.5vw, 1.8rem);
			line-height: 1.2;
			letter-spacing: -0.01em;
		}

		.section-desc {
			font-size: 0.95rem;
			line-height: 1.55;
		}

		/* ----- Give-first: vertical timeline ----- */
		.give-first-row {
			position: relative;
			grid-template-columns: 1fr;
			gap: 0;
			padding-left: 2.25rem;
		}

		.give-first-row::before {
			content: '';
			position: absolute;
			left: 1rem;
			top: 1.1rem;
			bottom: 1.1rem;
			width: 2px;
			background: linear-gradient(180deg, rgba(45, 212, 191, 0.55), rgba(45, 212, 191, 0.15));
			box-shadow: 0 0 10px rgba(45, 212, 191, 0.25);
			border-radius: 1px;
		}

		.give-step {
			padding: 1.15rem 1.2rem 1.2rem;
			margin-bottom: 0.85rem;
			border-radius: 12px;
		}

		.give-step:last-child {
			margin-bottom: 0;
		}

		.give-step .step-num {
			position: absolute;
			left: -2.25rem;
			top: 0.9rem;
			width: 2rem;
			height: 2rem;
			border-radius: 50%;
			background: color-mix(in srgb, var(--primary) 22%, var(--bg-deep));
			border: 2px solid var(--shadow-flame);
			color: var(--text-pale);
			font-size: 0.95rem;
			box-shadow:
				0 0 0 4px var(--bg-base),
				0 0 14px rgba(45, 212, 191, 0.45);
			margin-bottom: 0.5rem;
		}

		.give-step h3 {
			font-size: 1rem;
			margin-bottom: 0.4rem;
		}

		.give-step p {
			font-size: 0.88rem;
			line-height: 1.5;
		}

		/* ----- Question of the day card ----- */
		.quest-card {
			padding: 1.25rem;
			border-radius: 14px;
		}

		.quest-header {
			flex-wrap: wrap;
			gap: 0.5rem;
			margin-bottom: 0.85rem;
		}

		.quest-title {
			font-size: 1.15rem;
			line-height: 1.35;
			margin-bottom: 1rem;
		}

		.quest-cta {
			padding: 0.9rem;
			font-size: 1rem;
		}

		/* ----- Blog category cards ----- */
		.blogs-grid {
			gap: 0.85rem;
		}

		.blog-card {
			padding: 1.3rem 1.25rem 1.4rem;
			gap: 0.65rem;
		}

		.blog-card-icon {
			width: 2.75rem;
			height: 2.75rem;
			border-radius: 10px;
		}

		.blog-card-icon svg {
			width: 1.55rem;
			height: 1.55rem;
		}

		.blog-card-title {
			font-size: 1.1rem;
		}

		.blog-card-desc {
			font-size: 0.88rem;
			line-height: 1.5;
		}

		.blog-card-peek li {
			font-size: 0.8rem;
		}

		/* ----- Famous people grid ----- */
		.types-section {
			padding: 2.5rem 1rem;
			border-radius: 18px;
			margin: 0.5rem 0;
		}

		.types-grid {
			gap: 0.55rem;
		}

		.type-card {
			padding: 0.85rem 0.6rem 0.9rem;
			border-radius: 10px;
		}

		.type-card .avatar,
		.type-card .avatar-placeholder {
			width: 3.5rem;
			height: 3.5rem;
		}

		.type-card .type-number {
			top: -0.35rem;
			left: -0.35rem;
			width: 1.3rem;
			height: 1.3rem;
			font-size: 0.65rem;
		}

		.type-meta {
			font-size: 0.68rem;
			line-height: 1.25;
			margin-top: 0.35rem;
		}

		.meta-value {
			display: block;
			word-break: break-word;
		}

		/* ----- Coaching ----- */
		.coaching-card {
			border-radius: 16px;
		}

		.coaching-content {
			padding: 2rem 1.25rem 2.25rem;
		}

		.coaching-title {
			font-size: 1.55rem;
			line-height: 1.2;
		}

		.coaching-desc {
			font-size: 0.95rem;
		}

		.coaching-features li {
			font-size: 0.88rem;
		}

		/* ----- Final CTA ----- */
		.final-section {
			margin: 1rem 0 2.5rem;
			border-radius: 18px;
		}

		.final-inner {
			padding: 2.25rem 1.25rem 2.5rem;
		}

		.final-title {
			font-size: 1.85rem;
			line-height: 1.15;
		}

		.final-desc {
			font-size: 0.95rem;
		}

		.final-actions {
			gap: 0.75rem;
			width: 100%;
		}

		.final-actions .btn-shadow,
		.final-actions .btn-system {
			width: 100%;
		}

		/* Make big CTA buttons full-width on mobile for easier tapping */
		.section-ctas .btn-shadow {
			width: 100%;
			max-width: 320px;
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.001ms !important;
			transition-duration: 0.001ms !important;
		}
	}
</style>

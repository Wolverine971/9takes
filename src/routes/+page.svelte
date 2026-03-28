<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import { buildBreadcrumbSchemaForGraph, buildFAQSchemaForGraph } from '$lib/utils/schema';
	import type { PageData } from './$types';
	import type { FamousPerson } from './+page.server';
	import EnneagramDiagram from '$lib/components/blog/EnneagramDiagram.svelte';

	let { data }: { data: PageData } = $props();
	let innerWidth = $state(0);
	let observer: IntersectionObserver | null = null;
	let sectionsVisible = $state(Array(6).fill(browser ? false : true));

	// The 9 Shadow Types with colors and emotional stance phrases
	const shadowTypes: Record<
		number,
		{ name: string; title: string; color: string; stancePhrase: string }
	> = {
		1: {
			name: 'The Perfectionist',
			title: 'Knight of Order',
			color: '#a8dadc',
			stancePhrase: 'internalizes anger'
		},
		2: {
			name: 'The Helper',
			title: 'Heart Guardian',
			color: '#ff6b6b',
			stancePhrase: 'represses shame'
		},
		3: {
			name: 'The Achiever',
			title: 'Victory Blade',
			color: '#fbbf24',
			stancePhrase: 'compensates for shame'
		},
		4: {
			name: 'The Individualist',
			title: 'Soul Weaver',
			color: '#c084fc',
			stancePhrase: 'identifies with shame'
		},
		5: {
			name: 'The Investigator',
			title: 'Mind Phantom',
			color: '#22d3ee',
			stancePhrase: 'withdraws from fear'
		},
		6: {
			name: 'The Loyalist',
			title: 'Iron Guard',
			color: '#64748b',
			stancePhrase: 'engages with fear'
		},
		7: {
			name: 'The Enthusiast',
			title: 'Storm Rider',
			color: '#fb923c',
			stancePhrase: 'reframes fear'
		},
		8: {
			name: 'The Challenger',
			title: 'War Commander',
			color: '#ef4444',
			stancePhrase: 'expresses anger'
		},
		9: {
			name: 'The Peacemaker',
			title: 'Harmony Sage',
			color: '#4ade80',
			stancePhrase: 'suppresses anger'
		}
	};

	// The Three Pillars — mapped to Enneagram intelligence triads
	const pillars = [
		{
			icon: '◉',
			title: 'See It Coming',
			triad: 'Head Center',
			types: '5, 6, 7',
			color: '#3b82f6',
			description:
				"Most bad outcomes aren't from stupidity — they're from blind spots. Your blind spot is someone else's obvious.",
			tagline: "Reveal what you're missing",
			link: '/questions'
		},
		{
			icon: '⚡',
			title: 'Know What To Do',
			triad: 'Gut Center',
			types: '8, 9, 1',
			color: '#ef4444',
			description:
				'Personality insight is useless if it stays abstract. We turn understanding into the actual move.',
			tagline: 'Equip yourself to act',
			link: '/how-to-guides'
		},
		{
			icon: '◈',
			title: 'Feel Understood',
			triad: 'Heart Center',
			types: '2, 3, 4',
			color: '#c084fc',
			description:
				"Your reaction isn't broken — it's one of 9 valid emotional realities. Every type's response makes sense.",
			tagline: 'Connect through understanding',
			link: '/personality-analysis'
		}
	];

	const siteUrl = 'https://9takes.com';
	const organizationId = `${siteUrl}/#organization`;
	const websiteId = `${siteUrl}/#website`;
	const webpageId = `${siteUrl}/#webpage`;
	const founderId = `${siteUrl}/about/#person`;
	const breadcrumbId = `${siteUrl}/#breadcrumb`;
	const faqId = `${siteUrl}/#faq`;

	const typeSummaries = [
		{
			type: 1,
			title: 'Type 1: The Perfectionist',
			description:
				'Type 1 scans for the standard, the flaw, and the better way to do things. Their gift is principled clarity, and their blind spot is treating tension like something that has to be corrected immediately.'
		},
		{
			type: 2,
			title: 'Type 2: The Helper',
			description:
				'Type 2 reads people fast and notices where care, warmth, or reassurance is missing. Their strength is emotional attunement, while their growth edge is learning to name their own needs as clearly as everyone else’s.'
		},
		{
			type: 3,
			title: 'Type 3: The Achiever',
			description:
				'Type 3 tracks momentum, status, and visible wins. They excel at adapting to what works, but they can lose touch with what they actually feel when performance becomes the whole story.'
		},
		{
			type: 4,
			title: 'Type 4: The Individualist',
			description:
				'Type 4 searches for meaning, emotional truth, and the deeper pattern under the surface. They bring originality and honesty, but they can mistake intensity for accuracy when a moment feels personal.'
		},
		{
			type: 5,
			title: 'Type 5: The Investigator',
			description:
				'Type 5 wants understanding before action. They observe, analyze, and conserve energy well, yet they can remain outside the room too long when life demands a messy first move.'
		},
		{
			type: 6,
			title: 'Type 6: The Loyalist',
			description:
				'Type 6 models risk, loyalty, and the hidden downside. They are excellent at stress-testing plans, though they can confuse vigilance with certainty when fear starts steering interpretation.'
		},
		{
			type: 7,
			title: 'Type 7: The Enthusiast',
			description:
				'Type 7 spots possibility, opportunity, and the route around pain. Their energy keeps groups moving, but they can skip the hard conversation that would create real freedom later.'
		},
		{
			type: 8,
			title: 'Type 8: The Challenger',
			description:
				'Type 8 values strength, directness, and protecting what matters. They cut through fog quickly, yet they can over-rely on force when vulnerability would actually create better leverage.'
		},
		{
			type: 9,
			title: 'Type 9: The Peacemaker',
			description:
				'Type 9 sees the full field and instinctively looks for what will keep connection intact. They calm conflict well, but they can disappear inside accommodation instead of stating what they know.'
		}
	];

	const faqItems = [
		{
			question: 'What is 9takes?',
			answer:
				'9takes is an Enneagram-based platform for people who want better personality analysis, stronger emotional intelligence, and a clearer read on social dynamics. Instead of giving you one take on a situation, it shows how all nine Enneagram types would likely interpret the same moment.'
		},
		{
			question: 'How does the give-first system work?',
			answer:
				'On 9takes, you answer first and read second. That structure matters because it captures your unedited instinct before groupthink takes over, then lets you compare your reaction with nine distinct personality perspectives.'
		},
		{
			question: 'What is the Enneagram, in plain English?',
			answer:
				'The Enneagram is a personality framework built around nine core strategies for navigating anger, fear, shame, belonging, and control. It is useful because it explains motivation, not just behavior, which makes it easier to decode why two people can see the same event so differently.'
		},
		{
			question: 'Who is 9takes for?',
			answer:
				'It is for curious readers, coaches, founders, partners, and anyone trying to understand people better. If you care about conflict, dating, work dynamics, self-awareness, or reading public figures with more nuance, 9takes is built for that use case.'
		},
		{
			question: 'Is 9takes a medical or clinical authority?',
			answer:
				'No. 9takes is an interpretation and analysis site, not a medical provider. The site uses the Enneagram to help people think more clearly about motivation, communication, and self-awareness, and coaching is offered as personality-informed guidance rather than clinical treatment.'
		}
	];

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
			},
			{
				'@type': 'FAQPage',
				'@id': faqId,
				...buildFAQSchemaForGraph(faqItems)
			}
		]
	};

	function getTransition() {
		return { y: 30, duration: 500, delay: 100 };
	}

	function setupIntersectionObserver() {
		if (!browser || typeof IntersectionObserver === 'undefined') {
			sectionsVisible = Array(7).fill(true);
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

		const handleResize = () => {
			innerWidth = window.innerWidth;
		};
		window.addEventListener('resize', handleResize, { passive: true });

		return () => {
			observer?.disconnect();
			window.removeEventListener('resize', handleResize);
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

<svelte:window bind:innerWidth />

<div class="sl-page">
	<!-- Background layers -->
	<div class="bg-void"></div>
	<div class="bg-ambient"></div>
	<div class="bg-grid"></div>

	<main class="content">
		<!-- ========== HERO SECTION ========== -->
		<section class="hero" in:fly={getTransition()}>
			<div class="hero-inner">
				<!-- Tagline badge -->
				<div class="tagline-badge" in:fade={{ delay: 200, duration: 400 }}>
					<span class="badge-glow"></span>
					<span class="badge-text">One situation, 9 ways to see it</span>
				</div>

				<h1 class="hero-title">
					<span class="title-line">See the</span>
					<span class="title-glow">Emotions Behind</span>
					<span class="title-line">Every Take</span>
				</h1>

				<p class="hero-desc">
					See what you're missing. Know what to do about it. Feel understood along the way.
				</p>
			</div>

			<!-- Daily Quest Card -->
			<a href={`/questions/${data.questionOfTheDay?.url}`} class="quest-card">
				<div class="quest-header">
					<div class="quest-badge">
						<span class="quest-icon">!</span>
						<span class="quest-label">TODAY'S QUESTION</span>
					</div>
					<div class="quest-responses">
						<span class="response-count">{data.questionOfTheDay?.comment_count || 0}</span>
						<span class="response-label">responses</span>
					</div>
				</div>

				<h2 class="quest-title">
					{data.questionOfTheDay ? data.questionOfTheDay.question_formatted : 'Loading...'}
				</h2>

				<div class="quest-cta">
					<span class="cta-text">Give Your Take</span>
					<span class="cta-arrow">→</span>
				</div>
			</a>

			<!-- Secondary actions -->
			<div class="hero-actions">
				<a href="/questions" class="btn-system">Browse All Questions</a>
			</div>

			<p class="hero-note">Free to join. No personality test required.</p>
		</section>

		<section class="prose-section overview-section">
			<div class="section-header prose-header">
				<div class="section-badge accent">
					<span class="badge-dot"></span>
					<span>WHAT 9TAKES ACTUALLY DOES</span>
				</div>
				<h2 class="section-title">An Enneagram Site Built for Real-Life Social Dynamics</h2>
			</div>

			<div class="overview-grid">
				<div class="overview-card">
					<h3>Understand why people see the same event differently</h3>
					<p>
						Most personality content stays abstract. 9takes uses the
						<a href="/enneagram-corner">Enneagram</a> as a practical language for reading conflict, attraction,
						work friction, family tension, and public behavior. Instead of collapsing everyone into one
						moral explanation, it shows how nine different motivational structures can produce nine very
						different reactions to the same moment.
					</p>
				</div>

				<div class="overview-card">
					<h3>Practice perspective-taking without surrendering your own judgment</h3>
					<p>
						The give-first format on <a href="/questions">anonymous questions</a> makes the site useful
						for emotional intelligence. You answer before you read. That preserves your original instinct,
						then forces a comparison between your take and the interpretations other personality types
						would naturally make. The result is better pattern recognition, not just more opinions.
					</p>
				</div>

				<div class="overview-card">
					<h3>Move from personality labels to usable analysis</h3>
					<p>
						9takes connects three things that are usually separated: educational
						<a href="/enneagram-corner">Enneagram explainers</a>, practical
						<a href="/how-to-guides">relationship and communication guides</a>, and long-form
						<a href="/personality-analysis">personality analysis</a> of public figures. That makes it
						easier to see how a framework behaves in theory, in your own life, and in the wider culture.
					</p>
				</div>
			</div>

			<div class="resource-grid" aria-label="Primary site resources">
				<a href="/questions" class="resource-card">
					<h3>Answer questions from your own point of view</h3>
					<p>Use live prompts to compare your instinct with how other Enneagram types respond.</p>
				</a>
				<a href="/personality-analysis" class="resource-card">
					<h3>Read famous people personality analysis</h3>
					<p>
						Study celebrities, founders, politicians, and creators through a motivation-first lens.
					</p>
				</a>
				<a href="/how-to-guides" class="resource-card">
					<h3>Apply personality insight to dating, work, and conflict</h3>
					<p>Turn framework knowledge into concrete communication moves and better decisions.</p>
				</a>
			</div>
		</section>

		<!-- ========== THREE PILLARS ========== -->
		<div class="section-observer">
			{#if sectionsVisible[0] || !browser}
				<section class="section pillars-section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge accent">
							<span class="badge-dot"></span>
							<span>WHY 9TAKES EXISTS</span>
						</div>
						<h2 class="section-title">Every Person Wants 3 Things</h2>
						<p class="section-desc">
							These map to the 3 types of human intelligence the Enneagram reveals.
						</p>
					</header>

					<div class="pillars-grid">
						{#each pillars as pillar}
							<a href={pillar.link} class="pillar-card" style="--pillar-color: {pillar.color}">
								<div class="pillar-bg"></div>
								<div class="pillar-content">
									<div class="pillar-icon">{pillar.icon}</div>
									<div class="pillar-triad">
										<span class="triad-label">{pillar.triad}</span>
										<span class="triad-types">Types {pillar.types}</span>
									</div>
									<h3 class="pillar-title">{pillar.title}</h3>
									<p class="pillar-desc">{pillar.description}</p>
									<span class="pillar-tagline">{pillar.tagline} →</span>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== UNIFIED 9 TYPES SECTION ========== -->
		<div class="section-observer">
			{#if sectionsVisible[1] || !browser}
				<section class="section types-section" in:fly={getTransition()}>
					<header class="section-header">
						<div class="section-badge accent">
							<span class="badge-dot"></span>
							<span>THE 9 PERSPECTIVES</span>
						</div>
						<h2 class="section-title">Master the 9 Types</h2>
						<p class="section-desc">
							Each personality type sees different details. Learn their patterns, decode people
							faster.
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
						<a
							href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
							class="btn-system"
						>
							Find Your Type →
						</a>
						<a href="/personality-analysis" class="btn-shadow">
							<span>Explore All Famous Types</span>
						</a>
					</div>

					<div class="type-summary-grid">
						{#each typeSummaries as summary}
							<a
								href={`/enneagram-corner/enneagram-type-${summary.type}`}
								class="type-summary-card"
							>
								<span class="type-summary-label">Type {summary.type}</span>
								<h3>{summary.title}</h3>
								<p>{summary.description}</p>
							</a>
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== WHY ENNEAGRAM ========== -->
		<div class="section-observer">
			{#if sectionsVisible[2] || !browser}
				<section class="feature-section" in:fly={getTransition()}>
					<div class="feature-inner">
						<h2 class="feature-title">
							Why the <span class="text-glow">Enneagram</span>?
						</h2>

						<p class="feature-text">
							Your brain defaults to <span class="text-system">one lens</span>, missing 8 others.
							The Enneagram maps <strong>3 types of intelligence</strong> — Head (foresight), Gut (agency),
							Heart (belonging) — across 9 personality types. Everyone leads with one. All 3 matter.
						</p>

						<!-- Interactive Enneagram Diagram -->
						<div class="diagram-showcase">
							<EnneagramDiagram size="lg" showLabels={true} interactive={true} />
						</div>

						<div class="feature-points">
							<div class="point">
								<span class="point-icon">▸</span>
								<span>Not behavior. <strong>Motivation.</strong></span>
							</div>
							<div class="point">
								<span class="point-icon">▸</span>
								<span>Not stereotypes. <strong>Patterns.</strong></span>
							</div>
							<div class="point">
								<span class="point-icon">▸</span>
								<span>Not labels. <strong>Lenses.</strong></span>
							</div>
						</div>
					</div>
				</section>
			{/if}
		</div>

		<!-- ========== COACHING SECTION ========== -->
		<div class="section-observer">
			{#if sectionsVisible[3] || !browser}
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
								<span>Book a Session</span>
							</a>

							<p class="coaching-note">Join the waitlist for personalized Enneagram coaching</p>
						</div>
					</div>
				</section>
			{/if}
		</div>

		<section class="prose-section founder-section">
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
				<div class="founder-content">
					<div class="section-badge accent">
						<span class="badge-dot"></span>
						<span>ABOUT THE FOUNDER</span>
					</div>
					<h2>Built by DJ Wayne to make personality insight more practical</h2>
					<p>
						9takes was created by <a href="/about">DJ Wayne</a>, a former USMC infantry Marine
						turned software entrepreneur who writes about personality, communication, and
						self-awareness. The site is opinionated in one specific way: it treats personality
						analysis as a tool for understanding motive, not as a shortcut for judging people.
					</p>
					<p>
						That is why the site combines educational Enneagram writing, practical guides, community
						questions, and public-figure character studies. The goal is to help readers get better
						at reading people, handling conflict, and spotting the blind spots that show up in
						relationships, leadership, and culture.
					</p>
				</div>
			</div>
		</section>

		<section class="prose-section faq-section" aria-labelledby="homepage-faq-title">
			<div class="section-header prose-header">
				<div class="section-badge accent">
					<span class="badge-dot"></span>
					<span>FAQ</span>
				</div>
				<h2 id="homepage-faq-title" class="section-title">Common Questions About 9takes</h2>
			</div>
			<div class="faq-grid">
				{#each faqItems as faq}
					<article class="faq-card">
						<h3>{faq.question}</h3>
						<p>{faq.answer}</p>
					</article>
				{/each}
			</div>
		</section>

		<!-- ========== FINAL CTA ========== -->
		{#if !data?.user}
			<div class="section-observer">
				{#if sectionsVisible[4] || !browser}
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
	   CSS VARIABLES
	   ========================================== */
	.sl-page {
		/* Homepage-specific void shades (supplement the global --void-* tokens) */
		--void-shadow: #0a0a12;
		--void-umbra: #12121c;
		--void-penumbra: #1a1a28;

		/* Homepage-specific text shades */
		--text-pale: #e8e8f0;
		--text-mist: #9898a8;
		--text-faded: #585868;

		/* Homepage-specific accent colors */
		--shadow-flame: #a855f7;
		--shadow-ethereal: #c084fc;

		/* System */
		--system-interface: #3b82f6;
		--system-hologram: #60a5fa;
		--system-stream: #93c5fd;
		--system-deep: #1d4ed8;

		/* Status */
		--status-gold: #f59e0b;
		--status-gold-bright: #fbbf24;
		--status-success: #14b8a6;

		/* Transitions */
		--ease-out: cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* ==========================================
	   BASE LAYOUT
	   ========================================== */
	.sl-page {
		position: relative;
		min-height: 100vh;
		background: var(--void-abyss);
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

	/* ==========================================
	   BACKGROUNDS
	   ========================================== */
	.bg-void {
		position: fixed;
		inset: 0;
		background: var(--void-abyss);
		z-index: 0;
	}

	.bg-ambient {
		position: fixed;
		inset: 0;
		background:
			radial-gradient(ellipse at 25% 0%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
			radial-gradient(ellipse at 75% 100%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
		z-index: 1;
		pointer-events: none;
	}

	.bg-grid {
		position: fixed;
		inset: 0;
		background-image:
			linear-gradient(rgba(124, 58, 237, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(124, 58, 237, 0.02) 1px, transparent 1px);
		background-size: 60px 60px;
		z-index: 2;
		pointer-events: none;
	}

	/* ==========================================
	   TEXT UTILITIES
	   ========================================== */
	.text-glow {
		color: var(--shadow-flame);
		text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
	}

	.text-system {
		color: var(--system-hologram);
		text-shadow: 0 0 15px rgba(96, 165, 250, 0.5);
	}

	/* ==========================================
	   HERO SECTION
	   ========================================== */
	.hero {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5rem 0 3rem;
		text-align: center;
	}

	.hero-placeholder {
		height: 100vh;
	}

	.hero-inner {
		max-width: 700px;
		margin-bottom: 2rem;
	}

	.tagline-badge {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 6px;
		margin-bottom: 1.5rem;
		overflow: hidden;
	}

	.badge-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
		animation: badge-pulse 3s ease-in-out infinite;
	}

	@keyframes badge-pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}

	.badge-text {
		position: relative;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--shadow-ethereal);
		letter-spacing: 0.05em;
	}

	.hero-title {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 8vw, 4.5rem);
		font-weight: 700;
		line-height: 1.1;
		margin-bottom: 1rem;
	}

	.title-line {
		display: block;
		color: var(--text-pale);
	}

	.title-glow {
		display: block;
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--system-interface) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 0 30px rgba(124, 58, 237, 0.4));
	}

	.hero-desc {
		font-size: clamp(1rem, 2vw, 1.125rem);
		color: var(--text-mist);
		max-width: 500px;
		margin: 0 auto;
		line-height: 1.6;
	}

	/* Quest Card */
	.quest-card {
		display: block;
		width: 100%;
		max-width: 600px;
		padding: 1.5rem;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 16px;
		margin-bottom: 1.5rem;
		text-decoration: none;
		box-shadow:
			0 0 40px rgba(124, 58, 237, 0.1),
			inset 0 1px 0 rgba(124, 58, 237, 0.1);
		transition: all 300ms var(--ease-out);
	}

	.quest-card:hover {
		border-color: rgba(124, 58, 237, 0.4);
		box-shadow:
			0 0 60px rgba(124, 58, 237, 0.2),
			inset 0 1px 0 rgba(124, 58, 237, 0.15);
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
		background: var(--shadow-deep);
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
		margin-bottom: 1rem;
		text-align: left;
	}

	.quest-cta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-monarch) 100%);
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 0.95rem;
		font-weight: 600;
		color: white;
	}

	.cta-arrow {
		transition: transform 200ms ease;
	}

	.quest-card:hover .cta-arrow {
		transform: translateX(4px);
	}

	/* Hero Actions */
	.hero-actions {
		margin-bottom: 1rem;
	}

	.hero-note {
		font-size: 0.85rem;
		color: var(--text-faded);
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
		background: linear-gradient(135deg, var(--shadow-deep) 0%, var(--shadow-monarch) 100%);
		border: none;
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: white;
		text-decoration: none;
		cursor: pointer;
		overflow: hidden;
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
		transition: all 250ms var(--ease-out);
	}

	.btn-shadow:hover {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-flame) 100%);
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.5);
		transform: translateY(-2px);
	}

	.btn-shadow.lg {
		padding: 1rem 2rem;
		font-size: 1.05rem;
	}

	.btn-shadow::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
		transition: left 400ms ease;
	}

	.btn-shadow:hover::after {
		left: 100%;
	}

	.btn-system {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.875rem 1.75rem;
		background: transparent;
		border: 1px solid rgba(59, 130, 246, 0.35);
		border-radius: 8px;
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--system-hologram);
		text-decoration: none;
		cursor: pointer;
		transition: all 250ms var(--ease-out);
	}

	.btn-system:hover {
		background: rgba(59, 130, 246, 0.08);
		border-color: var(--system-hologram);
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
	}

	/* ==========================================
	   SECTIONS
	   ========================================== */
	.section {
		padding: 4rem 0;
	}

	.section-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.section-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.15);
		border-radius: 4px;
		margin-bottom: 1rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: var(--system-hologram);
	}

	.section-badge.accent {
		background: rgba(124, 58, 237, 0.08);
		border-color: rgba(124, 58, 237, 0.15);
		color: var(--shadow-flame);
	}

	.section-badge.accent .badge-dot {
		background: var(--shadow-flame);
		box-shadow: 0 0 8px var(--shadow-monarch);
	}

	.badge-dot {
		width: 5px;
		height: 5px;
		background: var(--system-hologram);
		border-radius: 50%;
		box-shadow: 0 0 8px var(--system-interface);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.5rem;
	}

	.section-desc {
		font-size: 1rem;
		color: var(--text-mist);
		max-width: 500px;
		margin: 0 auto;
	}

	.prose-section {
		margin: 1rem 0 2rem;
		padding: 2rem 0;
	}

	.prose-header {
		text-align: left;
		max-width: 760px;
		margin-bottom: 1.5rem;
	}

	.overview-grid,
	.resource-grid,
	.faq-grid {
		display: grid;
		gap: 1rem;
	}

	.overview-card,
	.resource-card,
	.type-summary-card,
	.faq-card {
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid rgba(124, 58, 237, 0.18);
		border-radius: 16px;
		padding: 1.35rem;
		box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.04);
	}

	.overview-card h3,
	.resource-card h3,
	.type-summary-card h3,
	.faq-card h3 {
		padding: 0;
		margin: 0 0 0.75rem;
		font-family: var(--font-display);
		font-size: 1.2rem;
		color: var(--text-pale);
	}

	.overview-card p,
	.resource-card p,
	.type-summary-card p,
	.faq-card p,
	.founder-content p {
		margin: 0;
		color: var(--text-mist);
		line-height: 1.7;
	}

	.resource-card,
	.type-summary-card {
		text-decoration: none;
		transition: all 250ms var(--ease-out);
	}

	.resource-card:hover,
	.type-summary-card:hover {
		border-color: rgba(124, 58, 237, 0.35);
		transform: translateY(-3px);
		box-shadow: 0 0 28px rgba(124, 58, 237, 0.14);
	}

	@media (min-width: 768px) {
		.overview-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.resource-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.faq-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* ==========================================
	   UNIFIED TYPES SECTION
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

	/* Diagram Showcase */
	.diagram-showcase {
		margin: 2rem auto;
		overflow: visible;
	}

	@media (min-width: 768px) {
		.diagram-showcase {
			margin: 2.5rem auto;
		}
	}

	/* Section CTAs - Multiple buttons */
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

	/* ==========================================
	   9 TYPES GRID
	   ========================================== */
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
		--type-color: var(--shadow-monarch);
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
		background: color-mix(in srgb, var(--type-color) 15%, var(--void-abyss));
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

	.meta-label {
		color: var(--text-faded);
	}

	.meta-value {
		color: var(--type-color);
		font-weight: 600;
	}

	.type-summary-grid {
		display: grid;
		gap: 1rem;
		margin-top: 2rem;
	}

	.type-summary-card {
		display: block;
	}

	.type-summary-label {
		display: inline-flex;
		padding: 0.2rem 0.55rem;
		margin-bottom: 0.75rem;
		border-radius: 999px;
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.2);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--system-stream);
		letter-spacing: 0.04em;
	}

	@media (min-width: 768px) {
		.type-summary-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.founder-card {
		display: grid;
		gap: 1.5rem;
		align-items: center;
		padding: 1.5rem;
		background: linear-gradient(
			135deg,
			rgba(124, 58, 237, 0.1) 0%,
			rgba(59, 130, 246, 0.08) 50%,
			var(--void-umbra) 100%
		);
		border: 1px solid rgba(124, 58, 237, 0.22);
		border-radius: 20px;
	}

	.founder-photo {
		width: 180px;
		height: 180px;
		object-fit: cover;
		border-radius: 24px;
		border: 1px solid rgba(124, 58, 237, 0.28);
		box-shadow: 0 0 30px rgba(124, 58, 237, 0.2);
	}

	.founder-content h2 {
		padding: 0;
		margin: 0 0 0.9rem;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		color: var(--text-pale);
	}

	.founder-content p + p {
		margin-top: 1rem;
	}

	@media (min-width: 768px) {
		.founder-card {
			grid-template-columns: 180px 1fr;
			padding: 2rem;
		}
	}

	/* ==========================================
	   THREE PILLARS
	   ========================================== */
	.pillars-section {
		background: linear-gradient(180deg, var(--void-umbra) 0%, var(--void-abyss) 100%);
		border-radius: 20px;
		margin: 1rem 0;
	}

	.pillars-grid {
		display: grid;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.pillars-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.25rem;
		}
	}

	.pillar-card {
		--pillar-color: var(--shadow-monarch);
		position: relative;
		display: block;
		background: linear-gradient(180deg, var(--void-shadow) 0%, var(--void-umbra) 100%);
		border: 1px solid color-mix(in srgb, var(--pillar-color) 20%, transparent);
		border-radius: 16px;
		padding: 1.75rem 1.5rem;
		text-decoration: none;
		overflow: hidden;
		transition: all 300ms var(--ease-out);
	}

	.pillar-card:hover {
		border-color: color-mix(in srgb, var(--pillar-color) 50%, transparent);
		box-shadow: 0 0 40px color-mix(in srgb, var(--pillar-color) 20%, transparent);
		transform: translateY(-4px);
	}

	.pillar-bg {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 50% 0%,
			color-mix(in srgb, var(--pillar-color) 10%, transparent) 0%,
			transparent 70%
		);
		opacity: 0;
		transition: opacity 300ms ease;
	}

	.pillar-card:hover .pillar-bg {
		opacity: 1;
	}

	.pillar-content {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.pillar-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background: color-mix(in srgb, var(--pillar-color) 12%, var(--void-abyss));
		border: 1px solid color-mix(in srgb, var(--pillar-color) 30%, transparent);
		border-radius: 10px;
		font-size: 1.25rem;
		color: var(--pillar-color);
		margin-bottom: 1rem;
	}

	.pillar-triad {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.triad-label {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		font-weight: 600;
		color: var(--pillar-color);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.triad-types {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--text-faded);
	}

	.pillar-title {
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 0.6rem;
	}

	.pillar-desc {
		font-size: 0.9rem;
		color: var(--text-mist);
		line-height: 1.55;
		margin-bottom: 1rem;
		flex-grow: 1;
	}

	.pillar-tagline {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--pillar-color);
		transition: transform 200ms ease;
	}

	.pillar-card:hover .pillar-tagline {
		transform: translateX(4px);
	}

	/* ==========================================
	   FEATURE SECTION (Why Enneagram)
	   ========================================== */
	.feature-section {
		margin: 2rem 0;
		border-radius: 20px;
		background: linear-gradient(
			135deg,
			rgba(124, 58, 237, 0.08) 0%,
			rgba(59, 130, 246, 0.08) 50%,
			var(--void-umbra) 100%
		);
		border: 1px solid rgba(124, 58, 237, 0.15);
		overflow: visible;
	}

	.feature-inner {
		padding: 3rem 1.5rem;
		text-align: center;
		overflow: visible;
	}

	@media (min-width: 640px) {
		.feature-inner {
			padding: 4rem 2rem;
		}
	}

	.feature-title {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--text-pale);
		margin-bottom: 1rem;
	}

	.feature-text {
		font-size: 1rem;
		color: var(--text-mist);
		max-width: 550px;
		margin: 0 auto 2rem;
		line-height: 1.6;
	}

	.feature-points {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 300px;
		margin: 0 auto;
	}

	.point {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.95rem;
		color: var(--text-mist);
	}

	.point-icon {
		color: var(--shadow-flame);
	}

	.point strong {
		color: var(--text-pale);
	}

	/* ==========================================
	   COACHING SECTION
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
	   FINAL CTA SECTION
	   ========================================== */
	.final-section {
		position: relative;
		margin: 2rem 0 4rem;
		border-radius: 20px;
		background: linear-gradient(
			135deg,
			rgba(124, 58, 237, 0.12) 0%,
			rgba(59, 130, 246, 0.12) 50%,
			var(--void-umbra) 100%
		);
		border: 1px solid rgba(124, 58, 237, 0.25);
		overflow: hidden;
	}

	.final-glow {
		position: absolute;
		top: -40%;
		left: 50%;
		transform: translateX(-50%);
		width: 140%;
		height: 100%;
		background: radial-gradient(ellipse at center, rgba(124, 58, 237, 0.15) 0%, transparent 60%);
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
		background: rgba(124, 58, 237, 0.1);
		border: 1px solid rgba(124, 58, 237, 0.2);
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
	   REDUCED MOTION
	   ========================================== */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.001ms !important;
			transition-duration: 0.001ms !important;
		}
	}
</style>

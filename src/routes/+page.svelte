<!-- src/routes/+page.svelte -->
<!-- Home: "Do you know about the Enneagram?" decision-fork landing page. -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import CorpusStatsPanel from '$lib/components/marketing/CorpusStatsPanel.svelte';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityAnalysisUrl,
		buildPersonalityImagePath,
		buildPersonalityImageUrl,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import type { PageData } from './$types';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';

	let { data }: { data: PageData } = $props();
	let observer: IntersectionObserver | null = null;
	// Funnel sections after the fork: give-first, qotd, blogs, famous, corpus-stats, coaching, final
	let sectionsVisible = $state(Array(7).fill(browser ? false : true));

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

	const typeGuideSummaries: Record<number, string> = {
		1: 'Principled, improvement-driven, and sensitive to what feels wrong.',
		2: 'Warm, relational, and highly attuned to what other people need.',
		3: 'Adaptive, ambitious, and focused on momentum, image, and results.',
		4: 'Emotionally intense, identity-driven, and tuned to what feels missing.',
		5: 'Private, analytical, and protective of time, energy, and competence.',
		6: 'Security-minded, skeptical, and quick to scan for risk and trust.',
		7: 'Future-oriented, energetic, and always looking for freedom and options.',
		8: 'Direct, forceful, and instinctively protective of autonomy and strength.',
		9: 'Steady, receptive, and skilled at reducing tension and conflict.'
	};

	const typeGuideLinks = Array.from({ length: 9 }, (_, index) => {
		const type = index + 1;
		const typeInfo = shadowTypes[type];

		return {
			type,
			href: `/enneagram-corner/enneagram-type-${type}`,
			name: typeInfo.name,
			title: typeInfo.title,
			color: typeInfo.color,
			stancePhrase: typeInfo.stancePhrase,
			summary: typeGuideSummaries[type]
		};
	});

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

	const demoReplyTypes = [
		{
			type: 4,
			hint: 'Looks for the emotional thing nobody is saying.'
		},
		{
			type: 6,
			hint: 'Checks what is trustworthy, risky, or unstable.'
		},
		{
			type: 8,
			hint: 'Reads power, control, and what needs direct action.'
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

	const siteUrl = 'https://9takes.com';
	const organizationId = `${siteUrl}/#organization`;
	const websiteId = `${siteUrl}/#website`;
	const webpageId = `${siteUrl}/#webpage`;
	const primarySectionsId = `${siteUrl}/#primary-sections`;
	const enneagramTypesId = `${siteUrl}/#enneagram-types`;
	const featuredAnalysisId = `${siteUrl}/#featured-analysis`;
	const homepageTitle =
		'Enneagram Personality Types, Social Dynamics, and Emotional Intelligence | 9takes';
	const homepageDescription =
		'Explore the nine Enneagram personality types, famous-person analysis, community questions, and practical guides for relationships, conflict, and emotional intelligence.';
	const socialImageUrl = `${siteUrl}/greek_pantheon.png`;
	const socialImageAlt = '9takes - One situation, 9 ways to see it';

	const primaryResources = [
		{
			name: 'Questions',
			path: '/questions',
			url: `${siteUrl}/questions`,
			description:
				'Give your take first, then compare how each Enneagram type answers the same question.'
		},
		{
			name: 'Enneagram Corner',
			path: '/enneagram-corner',
			url: `${siteUrl}/enneagram-corner`,
			description: 'Deep guides on all nine types, relationships, growth, and emotional patterns.'
		},
		{
			name: 'Famous Personality Analysis',
			path: '/personality-analysis',
			url: `${siteUrl}/personality-analysis`,
			description:
				'See how celebrities, historical figures, and public personalities map to each type.'
		},
		{
			name: 'How-to Guides',
			path: '/how-to-guides',
			url: `${siteUrl}/how-to-guides`,
			description:
				'Practical playbooks for conflict, communication, boundaries, and self-awareness.'
		},
		{
			name: 'Community Essays',
			path: '/community',
			url: `${siteUrl}/community`,
			description:
				'Opinionated essays about the internet, personality theory, and how people change.'
		}
	];

	// SEO / structured data
	const homepageStructuredData = $derived.by(() => {
		const featuredPeople = data.typeRepresentatives.map((person, index) => {
			const displayName = formatPersonalityDisplayName(person.name);
			const fallbackUrl = `${siteUrl}/enneagram-corner/enneagram-type-${person.type}`;
			const analysisUrl = person.hasLink ? buildPersonalityAnalysisUrl(person.name) : fallbackUrl;

			return {
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': 'WebPage',
					'@id': analysisUrl,
					name: `${displayName} Enneagram analysis`,
					url: analysisUrl,
					description:
						person.personaTitle && person.personaTitle.trim().length > 0
							? `${displayName} through the lens of Enneagram Type ${person.type}: ${person.personaTitle}.`
							: `${displayName} through the lens of Enneagram Type ${person.type}.`,
					...(person.hasImage && {
						image: buildPersonalityImageUrl(person.type, person.name, 'thumbnail')
					})
				}
			};
		});

		return {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebPage',
					'@id': webpageId,
					url: siteUrl,
					name: homepageTitle,
					description: homepageDescription,
					inLanguage: 'en-US',
					isPartOf: { '@id': websiteId },
					publisher: { '@id': organizationId },
					mainEntity: { '@id': primarySectionsId },
					hasPart: [
						{ '@id': enneagramTypesId },
						...(featuredPeople.length ? [{ '@id': featuredAnalysisId }] : [])
					],
					about: [
						{
							'@type': 'Thing',
							name: 'Enneagram personality types',
							sameAs: 'https://en.wikipedia.org/wiki/Enneagram_of_Personality'
						},
						{ '@type': 'Thing', name: 'Social dynamics' },
						{ '@type': 'Thing', name: 'Emotional intelligence' },
						{ '@type': 'Thing', name: 'Personality analysis' }
					],
					significantLink: [
						...primaryResources.map((resource) => resource.url),
						...typeGuideLinks.map((typeGuide) => `${siteUrl}${typeGuide.href}`)
					],
					primaryImageOfPage: {
						'@type': 'ImageObject',
						url: socialImageUrl,
						width: 1200,
						height: 630,
						caption: socialImageAlt
					}
				},
				{
					'@type': 'ItemList',
					'@id': primarySectionsId,
					name: 'Primary 9takes sections',
					numberOfItems: primaryResources.length,
					itemListOrder: 'https://schema.org/ItemListUnordered',
					itemListElement: primaryResources.map((resource, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						item: {
							'@type': 'WebPage',
							'@id': resource.url,
							name: resource.name,
							url: resource.url,
							description: resource.description
						}
					}))
				},
				{
					'@type': 'ItemList',
					'@id': enneagramTypesId,
					name: 'Enneagram type guides',
					numberOfItems: typeGuideLinks.length,
					itemListOrder: 'https://schema.org/ItemListOrderAscending',
					itemListElement: typeGuideLinks.map((typeGuide, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						item: {
							'@type': 'WebPage',
							'@id': `${siteUrl}${typeGuide.href}`,
							name: `Enneagram Type ${typeGuide.type}: ${typeGuide.name}`,
							url: `${siteUrl}${typeGuide.href}`,
							description: typeGuide.summary
						}
					}))
				},
				...(featuredPeople.length
					? [
							{
								'@type': 'ItemList',
								'@id': featuredAnalysisId,
								name: 'Featured personality analysis examples',
								numberOfItems: featuredPeople.length,
								itemListOrder: 'https://schema.org/ItemListUnordered',
								itemListElement: featuredPeople
							}
						]
					: [])
			]
		};
	});

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

		return () => {
			observer?.disconnect();
		};
	});
</script>

<SEOHead
	title={homepageTitle}
	description={homepageDescription}
	canonical={siteUrl}
	ogImage={socialImageUrl}
	ogImageWidth={1200}
	ogImageHeight={630}
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
			content: 'image/png'
		}
	]}
/>

<div class="sl-page">
	<div class="bg-void"></div>
	<div class="bg-ambient"></div>
	<div class="bg-grid"></div>

	<main class="content">
		<section class="hero-section" in:fly={getTransition()}>
			<div class="hero-copy">
				<div class="section-badge accent">
					<span class="badge-dot"></span>
					<span>START HERE</span>
				</div>
				<h1 class="page-title">Do you know your Enneagram type?</h1>
				<p class="page-lede">
					9takes turns one situation into nine emotional lenses. Give your take first, then see how
					every type reads the same question.
				</p>

				<div class="hero-actions">
					<a
						href={data.questionOfTheDay?.url
							? `/questions/${data.questionOfTheDay.url}`
							: '/questions'}
						class="btn-shadow lg"
					>
						<span>Give Today's Take</span>
					</a>
					<a
						href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
						class="btn-system"
					>
						I'm New to This
					</a>
				</div>
			</div>

			<div class="hero-decision" aria-label="Choose where to start">
				<article class="decision-panel decision-no">
					<span class="branch-label no-label">I'M NEW</span>
					<h2 class="branch-title">Start with the basics</h2>
					<p class="branch-intro">
						Get your footing first. These three reads explain the system without making it weird.
					</p>
					<ol class="branch-links">
						{#each noPathBlogs as blog}
							<li>
								<a href={blog.url} class="branch-link">
									<span class="branch-link-title">{blog.title}</span>
									<span class="branch-link-sub">{blog.subtitle}</span>
								</a>
							</li>
						{/each}
					</ol>
				</article>

				<article class="decision-panel decision-yes">
					<span class="branch-label yes-label">I KNOW MY TYPE</span>
					<h2 class="branch-title">Answer first. Then compare the nine lenses.</h2>
					<p class="branch-tagline">
						<em>Reddit — but every comment is tagged with the writer's Enneagram type.</em>
					</p>

					<div class="demo-preview" aria-label="Preview of the 9takes answer-first mechanic">
						<div class="demo-topline">
							<span>Today's question</span>
							<span>{data.questionOfTheDay?.comment_count || 0} responses</span>
						</div>
						<h3 class="demo-question">
							{data.questionOfTheDay?.question_formatted ??
								'What is something people misunderstand about you?'}
						</h3>

						<div class="demo-compose">
							<span class="demo-user">You</span>
							<span>Write your take before the room can shape it.</span>
						</div>

						<div class="demo-replies">
							{#each demoReplyTypes as reply}
								<div class="demo-reply" style="--type-color: {shadowTypes[reply.type].color}">
									<div class="demo-reply-head">
										<span>Type {reply.type}</span>
										<span>Locked</span>
									</div>
									<p>{reply.hint}</p>
								</div>
							{/each}
						</div>
					</div>

					<div class="decision-actions">
						<a
							href={data.questionOfTheDay?.url
								? `/questions/${data.questionOfTheDay.url}`
								: '/questions'}
							class="btn-shadow"
						>
							<span>Give Your Take</span>
						</a>
						<a href="/questions" class="btn-system">Browse Questions</a>
					</div>
				</article>
			</div>

			<nav class="resource-pills" aria-label="Explore the main sections of 9takes">
				<span class="resource-kicker">Explore</span>
				{#each primaryResources as resource}
					<a href={resource.path} class="resource-pill" title={resource.description}>
						{resource.name}
					</a>
				{/each}
			</nav>
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

					<div class="type-guide-block">
						<div class="type-guide-header">
							<h3 class="type-guide-heading">Jump straight to your Enneagram type.</h3>
							<p class="type-guide-copy">
								Each guide breaks down the core motivation, blind spots, relationships, and growth
								path for one of the nine personality types.
							</p>
						</div>

						<div class="type-guide-grid">
							{#each typeGuideLinks as typeGuide}
								<a
									href={typeGuide.href}
									class="type-guide-card"
									style="--type-color: {typeGuide.color}"
									aria-label={`Read the Enneagram Type ${typeGuide.type} guide for ${typeGuide.name}`}
								>
									<span class="type-guide-eyebrow">Type {typeGuide.type}</span>
									<h4 class="type-guide-title">{typeGuide.name}</h4>
									<p class="type-guide-summary">{typeGuide.summary}</p>
									<span class="type-guide-meta">
										{typeGuide.title} · {typeGuide.stancePhrase}
									</span>
								</a>
							{/each}
						</div>
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

		<!-- ========== CORPUS STATS ========== -->
		<div class="section-observer">
			{#if sectionsVisible[4] || !browser}
				<div in:fly={getTransition()}>
					<CorpusStatsPanel />
				</div>
			{/if}
		</div>

		<!-- ========== COACHING ========== -->
		<div class="section-observer">
			{#if sectionsVisible[5] || !browser}
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
				{#if sectionsVisible[6] || !browser}
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
		--card-surface-top: color-mix(in srgb, var(--bg-surface) 78%, var(--bg-base));
		--card-surface-bottom: color-mix(in srgb, var(--bg-deep) 88%, var(--bg-surface));
		--card-surface-raised: color-mix(in srgb, var(--bg-surface) 90%, var(--bg-deep));
		--card-highlight: inset 0 1px 0 color-mix(in srgb, var(--bg-surface) 78%, transparent);
		--card-shadow-soft: 0 12px 28px color-mix(in srgb, var(--shadow-color) 72%, transparent);
		--card-shadow-strong: 0 16px 36px color-mix(in srgb, var(--shadow-color) 80%, transparent);
		--card-border-accent: color-mix(in srgb, var(--primary) 24%, var(--border-color));
		--card-border-accent-strong: color-mix(in srgb, var(--primary) 42%, var(--border-color));

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
		max-width: 1120px;
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
	   HERO DECISION
	   ========================================== */
	.hero-section {
		padding: 4rem 0 2.75rem;
	}

	.hero-copy {
		max-width: 820px;
		margin: 0 auto 2rem;
		text-align: center;
	}

	.page-title {
		font-family: var(--font-display);
		font-size: 3.35rem;
		font-weight: 700;
		line-height: 1.08;
		letter-spacing: 0;
		color: var(--text-pale);
		max-width: 780px;
		margin: 0 auto 0.85rem;
		text-wrap: balance;
	}

	.page-lede {
		max-width: 660px;
		margin: 0 auto;
		font-size: 1.08rem;
		line-height: 1.7;
		color: var(--text-mist);
		text-wrap: pretty;
	}

	.hero-actions,
	.decision-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.hero-actions {
		margin-top: 1.35rem;
	}

	.hero-decision {
		display: grid;
		grid-template-columns: minmax(250px, 0.82fr) minmax(0, 1.5fr);
		gap: 1rem;
		align-items: stretch;
	}

	.decision-panel {
		position: relative;
		display: flex;
		flex-direction: column;
		text-align: left;
		padding: 1.35rem;
		background: linear-gradient(
			180deg,
			var(--card-surface-top) 0%,
			var(--card-surface-bottom) 100%
		);
		border: 1px solid var(--card-border-accent);
		border-radius: 8px;
		box-shadow: 0 12px 24px color-mix(in srgb, var(--shadow-color) 48%, transparent);
	}

	.decision-no {
		border-color: color-mix(in srgb, var(--secondary) 26%, var(--border-color));
	}

	.decision-yes {
		border-color: color-mix(in srgb, var(--primary) 42%, var(--border-color));
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--primary) 6%, var(--card-surface-top)) 0%,
				var(--card-surface-bottom) 100%
			),
			var(--card-surface-bottom);
		box-shadow:
			0 16px 32px color-mix(in srgb, var(--shadow-color) 56%, transparent),
			0 0 30px color-mix(in srgb, var(--primary) 12%, transparent);
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
		font-size: 1.45rem;
		font-weight: 700;
		color: var(--text-pale);
		margin: 0 0 0.65rem;
		line-height: 1.25;
	}

	.decision-yes .branch-title {
		font-size: 1.8rem;
		line-height: 1.15;
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
		margin: 1rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.branch-link {
		display: block;
		padding: 0.85rem 1rem;
		border-radius: 8px;
		background: color-mix(in srgb, var(--bg-deep) 70%, transparent);
		border: 1px solid color-mix(in srgb, var(--secondary) 20%, var(--border-color));
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

	.demo-preview {
		margin: 0.25rem 0 1.25rem;
		padding: 1rem;
		background: color-mix(in srgb, var(--bg-deep) 72%, transparent);
		border: 1px solid color-mix(in srgb, var(--primary) 20%, var(--border-color));
		border-radius: 8px;
	}

	.demo-topline {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		line-height: 1.4;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--shadow-flame);
	}

	.demo-question {
		font-family: var(--font-display);
		font-size: 1.35rem;
		line-height: 1.25;
		color: var(--text-pale);
		margin: 0.65rem 0 0.9rem;
	}

	.demo-compose {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.75rem;
		border: 1px dashed color-mix(in srgb, var(--primary) 32%, var(--border-color));
		border-radius: 8px;
		color: var(--text-mist);
		font-size: 0.9rem;
	}

	.demo-user {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: var(--primary);
		color: var(--text-on-primary);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.demo-replies {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.55rem;
		margin-top: 0.75rem;
	}

	.demo-reply {
		min-width: 0;
		padding: 0.7rem;
		border: 1px solid color-mix(in srgb, var(--type-color) 30%, var(--border-color));
		border-radius: 8px;
		background: color-mix(in srgb, var(--type-color) 6%, transparent);
	}

	.demo-reply-head {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--type-color);
		text-transform: uppercase;
	}

	.demo-reply p {
		margin: 0.45rem 0 0;
		font-size: 0.78rem;
		line-height: 1.4;
		color: var(--text-mist);
	}

	.resource-pills {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		margin-top: 1.25rem;
		color: var(--text-faded);
	}

	.resource-kicker,
	.resource-pill {
		font-family: var(--font-mono);
		font-size: 0.76rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.resource-pill {
		display: inline-flex;
		align-items: center;
		min-height: 2.15rem;
		padding: 0.45rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--primary) 18%, var(--border-color));
		border-radius: 8px;
		background: color-mix(in srgb, var(--bg-surface) 72%, transparent);
		color: var(--text-mist);
		text-decoration: none;
		transition:
			color 180ms var(--ease-out),
			border-color 180ms var(--ease-out),
			background 180ms var(--ease-out),
			transform 180ms var(--ease-out);
	}

	.resource-pill:hover {
		color: var(--primary-light);
		border-color: color-mix(in srgb, var(--primary) 38%, var(--border-color));
		background: var(--primary-subtle);
		transform: translateY(-1px);
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
		font-size: 2.1rem;
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
		border-radius: 8px;
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
		border-radius: 8px;
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
		font-size: 1.35rem;
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
		border-radius: 8px;
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
		border-radius: 8px;
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

	.type-guide-block {
		margin-top: 2.5rem;
		padding: 1.5rem;
		background: linear-gradient(
			180deg,
			var(--card-surface-top) 0%,
			var(--card-surface-bottom) 100%
		);
		border: 1px solid var(--card-border-accent);
		border-radius: 8px;
		box-shadow:
			var(--card-shadow-soft),
			0 0 36px color-mix(in srgb, var(--primary) 10%, transparent),
			var(--card-highlight);
	}

	.type-guide-header {
		max-width: 720px;
		margin-bottom: 1.5rem;
	}

	.type-guide-heading {
		font-family: var(--font-display);
		font-size: 1.6rem;
		line-height: 1.2;
		color: var(--text-pale);
		margin: 0 0 0.55rem;
	}

	.type-guide-copy {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--text-mist);
	}

	.type-guide-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 0.85rem;
	}

	.type-guide-card {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		min-height: 100%;
		padding: 1rem;
		background: var(--card-surface-raised);
		border: 1px solid color-mix(in srgb, var(--type-color) 30%, var(--border-color));
		border-radius: 8px;
		text-decoration: none;
		box-shadow: 0 10px 20px color-mix(in srgb, var(--shadow-color) 42%, transparent);
		transition:
			transform 220ms var(--ease-out),
			border-color 220ms var(--ease-out),
			box-shadow 220ms var(--ease-out);
	}

	.type-guide-card:hover {
		transform: translateY(-3px);
		border-color: color-mix(in srgb, var(--type-color) 65%, var(--border-color));
		box-shadow:
			0 14px 28px color-mix(in srgb, var(--shadow-color) 52%, transparent),
			0 0 24px color-mix(in srgb, var(--type-color) 20%, transparent);
	}

	.type-guide-eyebrow {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--type-color);
	}

	.type-guide-title {
		font-family: var(--font-display);
		font-size: 1rem;
		line-height: 1.25;
		color: var(--text-pale);
		margin: 0;
	}

	.type-guide-summary {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.55;
		color: var(--text-mist);
	}

	.type-guide-meta {
		margin-top: auto;
		padding-top: 0.35rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		line-height: 1.5;
		color: color-mix(in srgb, var(--type-color) 75%, white 20%);
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
		border-radius: 8px;
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
		border-radius: 8px;
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
		border-radius: 8px;
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
		font-size: 1.85rem;
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
		border-radius: 8px;
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
		font-size: 2.25rem;
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

	@media (max-width: 960px) and (min-width: 721px) {
		.page-title {
			font-size: 2.75rem;
		}

		.hero-decision {
			grid-template-columns: 1fr;
		}

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

		.hero-section {
			padding: 2.7rem 0 2rem;
		}

		.hero-copy {
			margin-bottom: 1.25rem;
		}

		.page-title {
			font-size: 2.25rem;
			line-height: 1.12;
		}

		.page-lede {
			font-size: 0.97rem;
			line-height: 1.6;
		}

		.hero-decision {
			grid-template-columns: 1fr;
			gap: 0.85rem;
		}

		.decision-panel {
			padding: 1.15rem;
		}

		.decision-yes {
			order: 1;
		}

		.decision-no {
			order: 2;
		}

		.decision-yes .branch-title {
			font-size: 1.55rem;
		}

		.demo-replies {
			grid-template-columns: 1fr;
		}

		.hero-actions .btn-shadow,
		.hero-actions .btn-system,
		.decision-actions .btn-shadow,
		.decision-actions .btn-system {
			width: 100%;
		}

		.section {
			padding: 2.25rem 0;
		}

		.section-header {
			margin-bottom: 1.5rem;
			padding: 0 0.25rem;
		}

		.section-title {
			font-size: 1.65rem;
			line-height: 1.2;
			letter-spacing: 0;
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
			border-radius: 8px;
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
			border-radius: 8px;
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
			border-radius: 8px;
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

		.type-guide-block {
			margin-top: 1.5rem;
			padding: 1.15rem;
			border-radius: 8px;
		}

		.type-guide-grid {
			grid-template-columns: 1fr;
		}

		.type-guide-card {
			padding: 0.95rem;
		}

		/* ----- Famous people grid ----- */
		.types-section {
			padding: 2.5rem 1rem;
			border-radius: 8px;
			margin: 0.5rem 0;
		}

		.types-grid {
			gap: 0.55rem;
		}

		.type-card {
			padding: 0.85rem 0.6rem 0.9rem;
			border-radius: 8px;
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
			border-radius: 8px;
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
			border-radius: 8px;
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

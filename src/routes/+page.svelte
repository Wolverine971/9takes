<!-- src/routes/+page.svelte -->
<!--
  Production homepage — Streetlamp Symposium V5.
  Phase 4 of docs/design/2026-05-04-rollout-plan.md.

  Visual ground truth: /design-preview/v5  (kept alive 2 weeks for rollback).
  Spec: docs/design/2026-05-04-streetlamp-symposium-v5.md.
  Locked tokens (warm stone surfaces, sodium-amber primary, Inter + JetBrains Mono)
  live in src/scss/index.scss bridge blocks; this file references them via var(--…).
-->
<script lang="ts">
	import { browser } from '$app/environment';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button, SectionKicker } from '$lib/components/atoms';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityAnalysisUrl,
		buildPersonalityImagePath,
		buildPersonalityImageUrl,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import { ENNEAGRAM_TYPE_COLORS } from '$lib/constants/enneagramColors';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// ------------------------------------------------------------------
	// SEO + structured-data — preserved verbatim from the previous homepage.
	// ------------------------------------------------------------------
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
		const info = ENNEAGRAM_TYPE_COLORS[type];
		return {
			type,
			href: `/enneagram-corner/enneagram-type-${type}`,
			name: info.name,
			color: info.color,
			summary: typeGuideSummaries[type]
		};
	});

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
						...primaryResources.map((r) => r.url),
						...typeGuideLinks.map((t) => `${siteUrl}${t.href}`)
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
					itemListElement: typeGuideLinks.map((t, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						item: {
							'@type': 'WebPage',
							'@id': `${siteUrl}${t.href}`,
							name: `Enneagram Type ${t.type}: ${t.name}`,
							url: `${siteUrl}${t.href}`,
							description: t.summary
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

	// ------------------------------------------------------------------
	// V5 §03 — 9-in-9-lines primer (each type leads with a different read).
	// ------------------------------------------------------------------
	type NineType = { num: number; name: string; read: string };
	const nineTypes: NineType[] = [
		{ num: 1, name: 'THE PERFECTIONIST', read: "what's broken" },
		{ num: 2, name: 'THE HELPER', read: 'what people need' },
		{ num: 3, name: 'THE ACHIEVER', read: 'what wins' },
		{ num: 4, name: 'THE INDIVIDUALIST', read: "what's missing" },
		{ num: 5, name: 'THE INVESTIGATOR', read: 'the system underneath' },
		{ num: 6, name: 'THE LOYALIST', read: 'the threat' },
		{ num: 7, name: 'THE ENTHUSIAST', read: "what's next" },
		{ num: 8, name: 'THE CHALLENGER', read: 'the power dynamic' },
		{ num: 9, name: 'THE PEACEMAKER', read: 'the harmony' }
	];

	// ------------------------------------------------------------------
	// V5 §05 — locked Type-take teasers shown on the open-question section.
	// Production wires real data for the question itself; the 3 teasers stay
	// locked per the give-first promise.
	// ------------------------------------------------------------------
	type LockedTake = { type: number; typeName: string; hint: string };
	const lockedTakes: LockedTake[] = [
		{
			type: 4,
			typeName: 'The Individualist',
			hint: "They think I'm dramatic. I'm trying to feel something real..."
		},
		{
			type: 6,
			typeName: 'The Loyalist',
			hint: "They think I'm anxious. I'm scanning for the threat they missed..."
		},
		{
			type: 8,
			typeName: 'The Challenger',
			hint: "They think I'm angry. I'm refusing to fold for fake politeness..."
		}
	];

	// ------------------------------------------------------------------
	// V5 §07 — corpus stats. Real numbers from src/lib/data/corpus-stats.json
	// (regenerated by `pnpm gen:all`). Lineage stays a constant.
	// ------------------------------------------------------------------
	type StatBlock = { label: string; value: string; annotation: string };
	const numberFmt = new Intl.NumberFormat('en-US');
	const corpusStats: StatBlock[] = $derived.by(() => [
		{
			label: 'PERSONALITY BREAKDOWNS',
			value: numberFmt.format(data.corpusStats.published),
			annotation: `+${numberFmt.format(data.corpusStats.inDraft)} in pipeline`
		},
		{ label: 'EMOTIONAL FRAMES', value: '9', annotation: 'exact' },
		{ label: 'LINEAGE', value: '2,500 yr', annotation: 'plato → now' },
		{
			label: 'NEW LAST 30 DAYS',
			value: numberFmt.format(data.corpusStats.publishedLast30Days),
			annotation: `~${Math.round(data.corpusStats.avgNewPerMonth)}/mo avg`
		}
	]);

	// ------------------------------------------------------------------
	// V5 §05 — time-dynamic open-question kicker.
	// SSR renders a neutral default; the client-only $effect below swaps in
	// the per-visitor local-time variant. Slight mismatch is invisible.
	// ------------------------------------------------------------------
	type TimeWindow = { title: string; kicker: string };

	function getTimeWindow(): TimeWindow {
		const hour = new Date().getHours();
		if (hour >= 5 && hour < 12) {
			return { title: "This morning's open question", kicker: 'MORNING' };
		} else if (hour >= 12 && hour < 17) {
			return { title: "This afternoon's open question", kicker: 'AFTERNOON' };
		} else if (hour >= 17 && hour < 22) {
			return { title: "This evening's open question", kicker: 'EVENING' };
		}
		return { title: 'Still open at midnight', kicker: 'LATE' };
	}

	function getDateLabel(): string {
		const months = [
			'JAN',
			'FEB',
			'MAR',
			'APR',
			'MAY',
			'JUN',
			'JUL',
			'AUG',
			'SEP',
			'OCT',
			'NOV',
			'DEC'
		];
		const d = new Date();
		const day = String(d.getDate()).padStart(2, '0');
		return `${months[d.getMonth()]} ${day}`;
	}

	let timeWindow = $state<TimeWindow>({ title: "Today's open question", kicker: 'TODAY' });
	let dateLabel = $state<string>('');

	$effect(() => {
		if (!browser) return;
		timeWindow = getTimeWindow();
		dateLabel = getDateLabel();
	});

	// ------------------------------------------------------------------
	// Helpers used by the §06 Library cards (real data).
	// ------------------------------------------------------------------
	function personLink(person: { name: string; type: number; hasLink: boolean }): string {
		return person.hasLink
			? buildPersonalityAnalysisPath(person.name)
			: `/enneagram-corner/enneagram-type-${person.type}`;
	}
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

<div class="home">
	<!-- =====================================================================
	  §01 OBSERVATION — tagline + statue + give-first subtext
	  ===================================================================== -->
	<section class="anatomy">
		<div class="grain" aria-hidden="true"></div>
		<div class="anatomy-pool" aria-hidden="true"></div>

		<div class="anatomy-inner">
			<div class="anatomy-top">
				<div class="anatomy-text">
					<div class="anatomy-eyebrow">
						<SectionKicker num="01" label="OBSERVATION" />
					</div>

					<h1 class="display-xl">See the emotions behind every take.</h1>

					<div class="scale-marker" aria-hidden="true">
						<span class="tick"></span>
						<span class="tick"></span>
						<span class="tick"></span>
						<span class="tick"></span>
						<span class="tick"></span>
						<span class="tick tick--major"></span>
						<span class="tick"></span>
						<span class="tick"></span>
						<span class="tick"></span>
						<span class="tick"></span>
						<span class="tick"></span>
					</div>

					<p class="hero-subhead hero-subhead-line-1">
						One situation. 9 emotional reads &mdash; one per personality type.
					</p>
					<p class="hero-subhead hero-subhead-line-2">
						Drop yours first &mdash; anonymously, before you see anyone else&rsquo;s.
					</p>
				</div>

				<div class="anatomy-subject" aria-hidden="true">
					<div class="subject-frame">
						<!-- .anatomy-subject is display:none ≤968px; media-gated so phones
						     never download the statue (2026-06-11 audit) -->
						<picture>
							<source media="(min-width: 969px)" srcset="/greek_distorted_statue_face.webp" />
							<source
								media="(max-width: 968px)"
								srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
							/>
							<img
								src="/greek_distorted_statue_face.webp"
								alt=""
								class="statue"
								loading="eager"
								decoding="async"
							/>
						</picture>
						<div class="subject-vignette"></div>
						<div class="subject-mono">
							<span class="mono">9TAKES · ONE SUBJECT · NINE READS</span>
						</div>
					</div>
				</div>
			</div>

			<div class="anatomy-divider" aria-hidden="true"></div>

			<!-- §02 — two-column NO | YES path split (with locked teasers in YES) -->
			<div class="path-split" aria-label="Do you know the Enneagram?">
				<div class="path-split-kicker">
					<SectionKicker
						size="md"
						num="02"
						label="DO YOU KNOW THE ENNEAGRAM?"
						class="region-label"
					/>
				</div>

				<div class="path-split-grid">
					<!-- LEFT — NO panel: send curious newcomers to the primer below -->
					<div class="path-panel path-panel--no">
						<SectionKicker num="02A" label="NO" tone="lamp" class="path-label path-label--no" />
						<p class="path-body">
							Never heard of it. That&rsquo;s most people. The Enneagram is a 2,500-year-old
							framework that maps 9 ways emotions drive behavior. Once you see the patterns, you
							can&rsquo;t unsee them.
						</p>
						<a href="#primer" class="path-cta path-cta--no">
							<span class="mono path-cta-kicker">New here</span>
							<span class="path-cta-label">Start with the 9 in 9 lines</span>
							<span class="mono path-cta-arrow" aria-hidden="true">&darr;</span>
						</a>
					</div>

					<!-- RIGHT — YES panel: drop a take + locked teasers preserve give-first -->
					<div class="path-panel path-panel--yes">
						<SectionKicker num="02B" label="YES" tone="data" class="path-label path-label--yes" />
						<p class="path-body">
							You know the rabbit hole. 9takes uses it to break down real situations &mdash; yours,
							others&rsquo;, public figures&rsquo;. The give-first mechanic keeps every comment
							honest.
						</p>

						<div
							class="locked-preview"
							aria-label="Three locked takes — drop yours to unlock the room"
						>
							{#each lockedTakes as t}
								<div class="locked-take" style="--type-stripe: var(--type-{t.type}-color);">
									<div class="locked-take-head">
										<span class="mono">TYPE {t.type} · {t.typeName.toUpperCase()}</span>
										<span class="mono locked-take-status">LOCKED</span>
									</div>
									<p class="locked-take-hint">{t.hint}</p>
								</div>
							{/each}
						</div>

						<a href="#open-question" class="path-cta path-cta--yes">
							<span class="mono path-cta-kicker">Ready</span>
							<span class="path-cta-label">Drop today&rsquo;s take</span>
							<span class="mono path-cta-arrow" aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- =====================================================================
	  §03 — THE 9 IN 9 LINES (primer table, anchor target #primer)
	  ===================================================================== -->
	<section id="primer" class="primer">
		<header class="primer-header">
			<SectionKicker class="section-tag" num="03" label="THE 9 IN 9 LINES" />
			<h2 class="display-md">The 9 in 9 lines.</h2>
			<p class="primer-sub">
				Each type leads with a different emotional read of the same situation.
			</p>
		</header>

		<div class="primer-table-wrap">
			<div
				class="primer-table"
				role="table"
				aria-label="Nine personality types and what each leads with"
			>
				<div class="primer-row primer-row--head" role="row">
					<span class="primer-col-num mono" role="columnheader">№</span>
					<span class="primer-col-type mono" role="columnheader">TYPE</span>
					<span class="primer-col-read mono" role="columnheader">WHAT THEY SEE FIRST</span>
				</div>

				{#each nineTypes as t}
					<a
						href={`/enneagram-corner/enneagram-type-${t.num}`}
						class="primer-row"
						role="row"
						style="--type-stripe: var(--type-{t.num}-color);"
					>
						<span class="primer-col-num mono" role="cell">{String(t.num).padStart(2, '0')}</span>
						<span class="primer-col-type" role="cell">{t.name}</span>
						<span class="primer-col-read" role="cell">{t.read}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- =====================================================================
	  §04 — THE FLOW (connected SVG flow chart)
	  ===================================================================== -->
	<section class="flow">
		<div class="flow-pool" aria-hidden="true"></div>

		<header class="flow-header">
			<SectionKicker class="section-tag" num="04" label="THE FLOW" />
			<h2 class="display-md">How a situation becomes 9 reads.</h2>
			<p class="flow-sub">One moment in. Give-first lock. 9 typed reads out. Then the pattern.</p>
		</header>

		<div class="flow-diagram" aria-label="9takes mechanism flow chart">
			<svg
				viewBox="0 0 800 980"
				xmlns="http://www.w3.org/2000/svg"
				class="flow-svg"
				role="img"
				aria-label="Flow chart: situation to give-first lock to 9 reads to pattern"
				preserveAspectRatio="xMidYMid meet"
			>
				<defs>
					<marker
						id="home-flow-arrowhead"
						markerWidth="10"
						markerHeight="10"
						refX="9"
						refY="5"
						orient="auto"
						markerUnits="strokeWidth"
					>
						<path d="M0,0 L0,10 L10,5 z" fill="var(--lamp-glow)" />
					</marker>
				</defs>

				<!-- NODE 1 — YOUR SITUATION -->
				<g aria-label="Your situation">
					<rect
						x="270"
						y="20"
						width="260"
						height="100"
						rx="8"
						ry="8"
						fill="var(--stone-warm)"
						stroke="var(--stone-edge)"
						stroke-width="1"
					/>
					<text x="400" y="52" text-anchor="middle" class="flow-label" fill="var(--lamp-glow)"
						>YOUR SITUATION</text
					>
					<text x="400" y="80" text-anchor="middle" class="flow-body" fill="var(--ink-bright)"
						>a real moment</text
					>
					<text x="400" y="100" text-anchor="middle" class="flow-body" fill="var(--ink-bright)"
						>from your life</text
					>
				</g>

				<line
					x1="400"
					y1="120"
					x2="400"
					y2="170"
					stroke="var(--lamp-glow)"
					stroke-width="2"
					marker-end="url(#home-flow-arrowhead)"
				/>

				<!-- NODE 2 — GIVE-FIRST LOCK -->
				<g aria-label="Give-first lock">
					<rect
						x="250"
						y="180"
						width="300"
						height="120"
						rx="8"
						ry="8"
						fill="var(--stone-warm)"
						stroke="var(--stone-edge)"
						stroke-width="1"
					/>
					<text x="400" y="212" text-anchor="middle" class="flow-label" fill="var(--lamp-glow)"
						>GIVE-FIRST LOCK</text
					>
					<text x="400" y="240" text-anchor="middle" class="flow-body" fill="var(--ink-bright)"
						>your honest take,</text
					>
					<text x="400" y="260" text-anchor="middle" class="flow-body" fill="var(--ink-bright)"
						>written before</text
					>
					<text x="400" y="280" text-anchor="middle" class="flow-body" fill="var(--ink-bright)"
						>the room shapes it</text
					>
				</g>

				<line
					x1="400"
					y1="300"
					x2="400"
					y2="350"
					stroke="var(--lamp-glow)"
					stroke-width="2"
					marker-end="url(#home-flow-arrowhead)"
				/>

				<!-- NODE 3 — 9 READS UNLOCK -->
				<g aria-label="Nine reads unlock">
					<rect
						x="290"
						y="360"
						width="220"
						height="68"
						rx="8"
						ry="8"
						fill="var(--stone-warm)"
						stroke="var(--stone-edge)"
						stroke-width="1"
					/>
					<text x="400" y="392" text-anchor="middle" class="flow-label" fill="var(--lamp-glow)"
						>9 READS UNLOCK</text
					>
					<text
						x="400"
						y="412"
						text-anchor="middle"
						class="flow-body flow-body--mid"
						fill="var(--ink-mid)">fan-out by type</text
					>
				</g>

				<line
					x1="400"
					y1="428"
					x2="135"
					y2="510"
					stroke="var(--lamp-glow)"
					stroke-width="2"
					marker-end="url(#home-flow-arrowhead)"
				/>
				<line
					x1="400"
					y1="428"
					x2="400"
					y2="510"
					stroke="var(--lamp-glow)"
					stroke-width="2"
					marker-end="url(#home-flow-arrowhead)"
				/>
				<line
					x1="400"
					y1="428"
					x2="665"
					y2="510"
					stroke="var(--lamp-glow)"
					stroke-width="2"
					marker-end="url(#home-flow-arrowhead)"
				/>

				<!-- T1 SAMPLE READ -->
				<g aria-label="Type 1 read">
					<rect
						x="40"
						y="520"
						width="190"
						height="120"
						rx="8"
						ry="8"
						fill="var(--stone-warm)"
						stroke="var(--stone-edge)"
						stroke-width="1"
					/>
					<rect x="40" y="520" width="190" height="4" fill="var(--type-1-color)" />
					<text x="135" y="552" text-anchor="middle" class="flow-label" fill="var(--lamp-glow)"
						>T1 · THE PERFECTIONIST</text
					>
					<text
						x="135"
						y="582"
						text-anchor="middle"
						class="flow-body flow-body--italic"
						fill="var(--ink-bright)">leads with</text
					>
					<text
						x="135"
						y="610"
						text-anchor="middle"
						class="flow-body flow-body--strong"
						fill="var(--ink-bright)">&ldquo;what&rsquo;s broken&rdquo;</text
					>
				</g>

				<!-- T5 SAMPLE READ -->
				<g aria-label="Type 5 read">
					<rect
						x="305"
						y="520"
						width="190"
						height="120"
						rx="8"
						ry="8"
						fill="var(--stone-warm)"
						stroke="var(--stone-edge)"
						stroke-width="1"
					/>
					<rect x="305" y="520" width="190" height="4" fill="var(--type-5-color)" />
					<text x="400" y="552" text-anchor="middle" class="flow-label" fill="var(--lamp-glow)"
						>T5 · THE INVESTIGATOR</text
					>
					<text
						x="400"
						y="582"
						text-anchor="middle"
						class="flow-body flow-body--italic"
						fill="var(--ink-bright)">leads with</text
					>
					<text
						x="400"
						y="610"
						text-anchor="middle"
						class="flow-body flow-body--strong"
						fill="var(--ink-bright)">&ldquo;the system underneath&rdquo;</text
					>
				</g>

				<!-- T9 SAMPLE READ -->
				<g aria-label="Type 9 read">
					<rect
						x="570"
						y="520"
						width="190"
						height="120"
						rx="8"
						ry="8"
						fill="var(--stone-warm)"
						stroke="var(--stone-edge)"
						stroke-width="1"
					/>
					<rect x="570" y="520" width="190" height="4" fill="var(--type-9-color)" />
					<text x="665" y="552" text-anchor="middle" class="flow-label" fill="var(--lamp-glow)"
						>T9 · THE PEACEMAKER</text
					>
					<text
						x="665"
						y="582"
						text-anchor="middle"
						class="flow-body flow-body--italic"
						fill="var(--ink-bright)">leads with</text
					>
					<text
						x="665"
						y="610"
						text-anchor="middle"
						class="flow-body flow-body--strong"
						fill="var(--ink-bright)">&ldquo;the harmony&rdquo;</text
					>
				</g>

				<text x="400" y="675" text-anchor="middle" class="flow-annotation" fill="var(--ink-dim)"
					>... 6 MORE TYPED READS (T2, T3, T4, T6, T7, T8) ...</text
				>

				<line
					x1="135"
					y1="700"
					x2="395"
					y2="780"
					stroke="var(--lamp-glow)"
					stroke-width="2"
					marker-end="url(#home-flow-arrowhead)"
				/>
				<line
					x1="400"
					y1="700"
					x2="400"
					y2="780"
					stroke="var(--lamp-glow)"
					stroke-width="2"
					marker-end="url(#home-flow-arrowhead)"
				/>
				<line
					x1="665"
					y1="700"
					x2="405"
					y2="780"
					stroke="var(--lamp-glow)"
					stroke-width="2"
					marker-end="url(#home-flow-arrowhead)"
				/>

				<!-- FINAL — THE PATTERN -->
				<g aria-label="The pattern">
					<rect
						x="220"
						y="790"
						width="360"
						height="160"
						rx="8"
						ry="8"
						fill="var(--stone-warm)"
						stroke="var(--lamp-glow)"
						stroke-width="2"
					/>
					<text x="400" y="824" text-anchor="middle" class="flow-label" fill="var(--lamp-glow)"
						>THE PATTERN</text
					>
					<text x="400" y="858" text-anchor="middle" class="flow-body" fill="var(--ink-bright)"
						>you see what each type</text
					>
					<text x="400" y="880" text-anchor="middle" class="flow-body" fill="var(--ink-bright)"
						>leads with &mdash; and what</text
					>
					<text x="400" y="902" text-anchor="middle" class="flow-body" fill="var(--ink-bright)"
						>you&rsquo;ve been missing</text
					>
					<text x="400" y="932" text-anchor="middle" class="flow-annotation" fill="var(--ink-dim)"
						>&mdash; OUTPUT &mdash;</text
					>
				</g>
			</svg>

			<div class="flow-mobile-list" aria-label="9takes mechanism flow">
				<article class="flow-mobile-card">
					<p class="mono flow-mobile-kicker">01 · YOUR SITUATION</p>
					<h3>A real moment from your life</h3>
				</article>

				<div class="flow-mobile-arrow" aria-hidden="true">&darr;</div>

				<article class="flow-mobile-card">
					<p class="mono flow-mobile-kicker">02 · GIVE-FIRST LOCK</p>
					<h3>Your honest take, written before the room shapes it</h3>
				</article>

				<div class="flow-mobile-arrow" aria-hidden="true">&darr;</div>

				<article class="flow-mobile-card flow-mobile-card--accent">
					<p class="mono flow-mobile-kicker">03 · 9 READS UNLOCK</p>
					<h3>Fan-out by type</h3>
				</article>

				<div class="flow-mobile-fan" aria-label="Example type reads">
					<article class="flow-mobile-read" style="--type-stripe: var(--type-1-color);">
						<p class="mono flow-mobile-kicker">T1 · THE PERFECTIONIST</p>
						<h3>Leads with &ldquo;what&rsquo;s broken&rdquo;</h3>
					</article>
					<article class="flow-mobile-read" style="--type-stripe: var(--type-5-color);">
						<p class="mono flow-mobile-kicker">T5 · THE INVESTIGATOR</p>
						<h3>Leads with &ldquo;the system underneath&rdquo;</h3>
					</article>
					<article class="flow-mobile-read" style="--type-stripe: var(--type-9-color);">
						<p class="mono flow-mobile-kicker">T9 · THE PEACEMAKER</p>
						<h3>Leads with &ldquo;the harmony&rdquo;</h3>
					</article>
				</div>

				<p class="mono flow-mobile-note">+ 6 more typed reads</p>

				<div class="flow-mobile-arrow" aria-hidden="true">&darr;</div>

				<article class="flow-mobile-card flow-mobile-card--output">
					<p class="mono flow-mobile-kicker">04 · THE PATTERN</p>
					<h3>You see what each type leads with, and what you have been missing</h3>
				</article>
			</div>
		</div>
	</section>

	<!-- =====================================================================
	  §05 — THE FLOOR IS OPEN (real questionOfTheDay, anchor #open-question)
	  ===================================================================== -->
	<section id="open-question" class="open-floor">
		<div class="open-floor-pool" aria-hidden="true"></div>
		<header class="open-floor-header">
			<SectionKicker class="section-tag" num="05" label="THE FLOOR IS OPEN" />
			<h2 class="display-md">{timeWindow.title}.</h2>
			<p class="mono open-floor-kicker">
				OPEN · {timeWindow.kicker}{dateLabel ? ` · ${dateLabel}` : ''} · {data.questionOfTheDay
					?.comment_count ?? 0} RESPONSES
			</p>
			<blockquote class="open-floor-question">
				&ldquo;{data.questionOfTheDay?.question_formatted ??
					'What is something people misunderstand about you?'}&rdquo;
			</blockquote>
		</header>

		<ul class="open-floor-takes">
			{#each lockedTakes as t}
				<li class="take-card" style="--type-stripe: var(--type-{t.type}-color);">
					<div class="take-card-top">
						<span class="mono take-card-label">
							TYPE {t.type} · {t.typeName.toUpperCase()} · LOCKED
						</span>
					</div>
					<p class="take-body">{t.hint}</p>
					<div class="take-meta">
						<span class="mono">DROP YOURS TO UNLOCK</span>
					</div>
				</li>
			{/each}
		</ul>

		<div class="open-floor-cta-row">
			<Button
				size="lg"
				variant="primary"
				href={data.questionOfTheDay?.url ? `/questions/${data.questionOfTheDay.url}` : '/questions'}
			>
				Drop your take →
			</Button>
			<p class="mono open-floor-footnote">the platform locks responses until you give yours</p>
		</div>
	</section>

	<!-- =====================================================================
	  §06 — THE LIBRARY (famous-people dossier grid; real data)
	  ===================================================================== -->
	<section class="library">
		<header class="library-header">
			<SectionKicker class="section-tag" num="06" label="CASE FILES" />
			<h2 class="display-md">The Library.</h2>
			<p class="library-sub">
				Personality breakdowns of public figures, fictional characters, athletes, and founders. Read
				at the depth you&rsquo;d expect from a real psychologist, not a clickbait listicle.
			</p>
			<p class="mono library-kicker">
				THE LIBRARY · {numberFmt.format(data.corpusStats.published)} BREAKDOWNS · 9 TYPES · GROWING
			</p>
		</header>

		<div class="library-grid">
			{#each data.typeRepresentatives as person}
				{@const typeNum = person.type}
				{@const info = ENNEAGRAM_TYPE_COLORS[typeNum]}
				{@const displayName = formatPersonalityDisplayName(person.name)}
				{@const personaTitle = person.personaTitle?.trim() || info.name}
				<a
					href={personLink(person)}
					class="library-card"
					style="--type-stripe: var(--type-{typeNum}-color);"
				>
					<div class="library-image-wrap">
						{#if person.hasImage}
							<img
								src={buildPersonalityImagePath(typeNum, person.name, 'thumbnail')}
								alt={displayName}
								class="library-image"
								loading="lazy"
								fetchpriority="low"
								width="320"
								height="240"
								decoding="async"
							/>
						{:else}
							<div class="library-image-stub" aria-hidden="true">
								<span class="mono">[PORTRAIT]</span>
							</div>
						{/if}
						<span class="mono library-type-chip" aria-hidden="true">T{typeNum}</span>
					</div>
					<div class="library-card-body">
						<span class="mono library-id">
							TYPE {typeNum} · {personaTitle.toUpperCase()}
						</span>
						<h3 class="library-name">{displayName}</h3>
						<p class="library-subtitle">{info.name}.</p>
					</div>
				</a>
			{/each}
		</div>

		<div class="library-cta-row">
			<Button size="lg" variant="ghost" href="/personality-analysis">
				Browse all breakdowns →
			</Button>
		</div>
	</section>

	<!-- =====================================================================
	  §07 — BY THE NUMBERS (4 stat blocks)
	  ===================================================================== -->
	<section class="compiled">
		<div class="compiled-pool" aria-hidden="true"></div>
		<header class="compiled-header">
			<SectionKicker class="section-tag" num="07" label="CORPUS" />
			<h2 class="display-md">By the numbers.</h2>
		</header>

		<div class="compiled-grid">
			{#each corpusStats as s}
				<div class="compiled-stat">
					<span class="mono compiled-stat-label">{s.label}</span>
					<span class="compiled-stat-value">{s.value}</span>
					<span class="mono compiled-stat-annotation">— {s.annotation} —</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- =====================================================================
	  §08 — COACHING (production-only quiet CTA; not in V5 prototype)
	  ===================================================================== -->
	<section class="coaching">
		<div class="coaching-inner">
			<SectionKicker class="section-tag" num="08" label="COACHING" />
			<h2 class="display-md">Want to take it deeper?</h2>
			<p class="coaching-sub">
				Direct application. Personalized EQ work. 1-on-1 sessions with DJ &mdash; for relationships,
				career decisions, or the patterns you can&rsquo;t name yet.
			</p>
			<div class="coaching-cta-row">
				<Button size="lg" variant="primary" href="/book-session">Book a session</Button>
			</div>
		</div>
	</section>

	<!-- =====================================================================
	  Footer is rendered by +layout.svelte — no inline footer here.
	  ===================================================================== -->
</div>

<style lang="scss">
	/* =========================================================
	  Streetlamp Symposium — production homepage.
	  Brand tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*,
	  --pool-rgb, --pool-deep-rgb, --type-N-color) are bridge tokens
	  shipped globally in src/scss/index.scss. The few preview-only
	  tokens (--cta-text, --pool-alpha-*, --statue-blend, --grain-opacity,
	  --lamp-glow-rgba, --data-cyan, --marble-*) are declared on .home
	  here so they only apply to this page until Phase 7 cleanup.
	  ========================================================= */
	.home {
		--cta-text: var(--night-deep);
		--pool-alpha-strong: 0.28;
		--pool-alpha-mid: 0.18;
		--pool-alpha-soft: 0.08;
		--statue-blend: screen;
		--grain-opacity: 0.05;

		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-display);
		min-height: 100vh;
		position: relative;
		overflow: hidden;
		scroll-behavior: smooth;

		@media (prefers-reduced-motion: reduce) {
			scroll-behavior: auto;
		}

		/* Light-mode adjustments — global :root.light flips brand tokens for us;
		   here we only soften pool intensity + statue blend. */
		:global(:root.light) & {
			--pool-alpha-strong: 0.14;
			--pool-alpha-mid: 0.08;
			--pool-alpha-soft: 0.04;
			--statue-blend: normal;
			--grain-opacity: 0.025;
			--cta-text: #faf8f4;
		}
	}

	/* ---------- shared utilities ---------- */
	/* .mono / .display-xl / .display-md are global utilities in index.scss
	   (promoted 2026-06-10 — identical copies lived in three route files). */

	.home :global(.section-tag) {
		display: inline-block;
		margin-bottom: 16px;
		color: var(--lamp-glow);
	}

	.home :global(p),
	.home :global(h1),
	.home :global(h2),
	.home :global(h3) {
		margin: 0;
	}

	.home :global(ul),
	.home :global(ol) {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.home :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.home :global(blockquote) {
		margin: 0;
	}

	/* ---------- subtle paper grain ---------- */
	.grain {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--grain-opacity);
		mix-blend-mode: overlay;
		z-index: 1;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.85 0 0 0 0 0.6 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
	}

	/* =========================================================
	  §01 + §02 — anatomy
	  ========================================================= */
	.anatomy {
		position: relative;
		padding: 96px 48px 72px;
		background: var(--night-deep);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 64px 20px 56px;
		}
	}

	.anatomy-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 60% 55% at 18% 8%,
				rgba(var(--pool-rgb), var(--pool-alpha-strong)) 0%,
				rgba(var(--pool-rgb), var(--pool-alpha-soft)) 30%,
				transparent 60%
			),
			radial-gradient(
				ellipse 90% 70% at 22% 12%,
				rgba(var(--pool-deep-rgb), var(--pool-alpha-mid)) 0%,
				transparent 55%
			);
		z-index: 0;
	}

	.anatomy-inner {
		position: relative;
		z-index: 2;
		max-width: 1280px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.anatomy-top {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 56px;
		align-items: center;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}

	.anatomy-text {
		max-width: 680px;
	}

	.anatomy-eyebrow {
		margin-bottom: 22px;
	}

	.scale-marker {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 18px;
		margin: 24px 0 14px;
		opacity: 0.7;

		.tick {
			width: 1px;
			height: 8px;
			background: var(--stone-edge);

			&--major {
				height: 16px;
				background: var(--lamp-glow);
				width: 1.5px;
			}
		}
	}

	.hero-subhead {
		font-family: var(--font-display);
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 600px;
		font-weight: 400;

		@media (max-width: 540px) {
			font-size: 16px;
		}
	}

	.hero-subhead-line-1 {
		margin-bottom: 10px;
	}

	.anatomy-subject {
		position: relative;

		@media (max-width: 968px) {
			display: none;
		}
	}

	.subject-frame {
		position: relative;
		aspect-ratio: 4 / 5;
		max-height: 460px;
		margin-left: auto;
		overflow: hidden;
	}

	.statue {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
		filter: contrast(1.18) brightness(1.04) saturate(0.88);
		mix-blend-mode: var(--statue-blend);
	}

	:global(:root.light) .home .statue {
		filter: contrast(1.05) brightness(1) saturate(1);
	}

	.subject-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.22) 0%, transparent 55%),
			linear-gradient(135deg, transparent 35%, rgba(10, 8, 7, 0.65) 100%),
			linear-gradient(180deg, transparent 60%, rgba(10, 8, 7, 0.85) 100%);
	}

	:global(:root.light) .home .subject-vignette {
		background:
			radial-gradient(ellipse at 25% 25%, rgba(var(--pool-rgb), 0.08) 0%, transparent 55%),
			linear-gradient(135deg, transparent 60%, rgba(180, 83, 9, 0.06) 100%);
	}

	.subject-mono {
		position: absolute;
		left: 12px;
		bottom: 12px;
		color: var(--ink-mid);

		.mono {
			color: var(--ink-mid);
		}
	}

	.anatomy-divider {
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--stone-edge) 12%,
			var(--stone-edge) 88%,
			transparent 100%
		);
		opacity: 0.65;
	}

	/* ---------- §02 PATH SPLIT (NO | YES) ---------- */
	.path-split {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.path-split-kicker {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		text-align: center;
	}

	.home :global(.region-label) {
		color: var(--lamp-glow);
	}

	.path-split-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		position: relative;
		margin-top: 28px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 16px;
			margin-top: 0;
		}

		@media (min-width: 769px) {
			&::before {
				content: '';
				position: absolute;
				top: -28px;
				left: 50%;
				transform: translateX(-50%);
				width: 2px;
				height: 14px;
				background: linear-gradient(180deg, transparent, var(--lamp-glow));
				border-radius: 9999px;
			}

			&::after {
				content: '';
				position: absolute;
				top: -14px;
				left: 22%;
				right: 22%;
				height: 2px;
				background: linear-gradient(
					90deg,
					transparent 0%,
					var(--lamp-glow) 12%,
					var(--lamp-glow) 88%,
					transparent 100%
				);
				border-radius: 9999px;
			}
		}
	}

	/* labeled diagram regions, NOT cards: 1px stone-edge, no fill, no shadow */
	.path-panel {
		background: transparent;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		padding: 26px 26px;
		display: flex;
		flex-direction: column;
		gap: 0;
		box-shadow: none;
		transition: border-color 0.18s ease;
		position: relative;

		&:hover {
			border-color: var(--ink-dim);
		}

		@media (min-width: 769px) {
			&::before {
				content: '';
				position: absolute;
				top: -14px;
				left: 50%;
				transform: translateX(-50%);
				width: 2px;
				height: 14px;
				background: linear-gradient(180deg, var(--lamp-glow), transparent);
				border-radius: 9999px;
			}
		}

		@media (max-width: 480px) {
			padding: 22px 20px;
		}
	}

	.home :global(.path-label) {
		font-size: 12px;
		letter-spacing: 0.08em;
	}

	.home :global(.path-label--no) {
		color: var(--lamp-glow);
	}

	.home :global(.path-label--yes) {
		color: var(--data-teal);
	}

	.path-body {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 18px;
		line-height: 1.5;
		color: var(--ink-bright);
		margin-top: 12px;
		margin-bottom: 16px;

		@media (max-width: 540px) {
			font-size: 16px;
		}
	}

	.path-cta {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 12px;
		width: 100%;
		margin-top: auto;
		padding: 14px 0 0;
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 500;
		line-height: 1.25;
		border-top: 1px solid var(--stone-edge);
		transition:
			border-color 0.18s ease,
			color 0.18s ease;

		.path-cta-kicker {
			font-size: 10px;
			line-height: 1;
			color: var(--ink-dim);
			white-space: nowrap;
		}

		.path-cta-arrow {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 28px;
			height: 28px;
			font-family: var(--font-mono);
			font-size: 16px;
			line-height: 1;
			border: 1px solid currentColor;
			border-radius: 999px;
			background: rgba(245, 158, 11, 0.07);
			transition:
				background 0.18s ease,
				transform 0.18s ease;
		}

		.path-cta-label {
			font-family: var(--font-display);
			overflow-wrap: anywhere;
		}

		&:hover {
			border-top-color: currentColor;
		}

		&:hover .path-cta-arrow {
			background: var(--lamp-soft);
			transform: translateY(1px);
		}

		@media (max-width: 768px) {
			margin-top: 0;
		}

		@media (max-width: 480px) {
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 10px;

			.path-cta-kicker {
				grid-column: 1 / -1;
			}
		}
	}

	.path-cta--no {
		color: var(--lamp-glow);

		&:hover {
			color: var(--lamp-deep);
		}
	}

	.path-cta--yes {
		color: var(--data-teal);

		&:hover {
			opacity: 0.78;
		}

		.path-cta-arrow {
			background: rgba(13, 148, 136, 0.08);
		}

		&:hover .path-cta-arrow {
			background: var(--data-teal-rgba, rgba(13, 148, 136, 0.14));
			transform: translateX(1px);
		}
	}

	/* ---------- locked-take preview inside YES panel ---------- */
	.locked-preview {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 18px;
		padding: 14px;
		border: 1px dashed var(--stone-edge);
		border-radius: 0.625rem;
		background: rgba(0, 0, 0, 0);
	}

	.locked-take {
		--type-stripe: var(--lamp-glow);
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 10px 12px 12px;
		border-left: 2px solid var(--type-stripe);
		background: var(--stone-warm);
		border-radius: 4px;
	}

	.locked-take-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.locked-take-head .mono {
		color: var(--type-stripe);
		font-size: 10.5px;
	}

	.locked-take-status {
		color: var(--ink-dim) !important;
	}

	.locked-take-hint {
		font-family: var(--font-display);
		font-size: 13.5px;
		line-height: 1.45;
		color: var(--ink-mid);
		font-style: italic;
	}

	/* =========================================================
	  §03 PRIMER — THE 9 IN 9 LINES
	  ========================================================= */
	.primer {
		padding: 96px 48px;
		background: var(--night-deep);
		border-top: 1px solid var(--stone-edge);
		scroll-margin-top: 72px;

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.primer-header {
		max-width: 820px;
		margin: 0 auto 36px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.primer-sub {
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
	}

	.primer-table-wrap {
		max-width: 980px;
		margin: 0 auto;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		overflow: hidden;
		background: var(--stone-warm);
	}

	.primer-table {
		display: block;
		width: 100%;
	}

	.primer-row {
		--type-stripe: var(--lamp-glow);
		display: grid;
		grid-template-columns: 80px 1.4fr 1.6fr;
		align-items: center;
		gap: 16px;
		padding: 16px 22px 16px 19px;
		border-bottom: 1px solid var(--stone-edge);
		border-left: 3px solid var(--type-stripe);
		transition: background 0.18s ease;

		&:last-child {
			border-bottom: none;
		}

		&:hover {
			background: var(--lamp-soft);
		}

		@media (max-width: 640px) {
			grid-template-columns: 56px 1.2fr 1.4fr;
			gap: 12px;
			padding: 14px 14px 14px 11px;
		}

		@media (max-width: 480px) {
			grid-template-columns: 44px 1.1fr 1.2fr;
			gap: 10px;
			padding: 12px 10px 12px 7px;
		}
	}

	.primer-row--head {
		border-left-color: var(--stone-edge);
		background: var(--night-mid);

		&:hover {
			background: var(--night-mid);
		}
	}

	.primer-col-num {
		font-family: var(--font-mono);
		font-size: 14px;
		color: var(--ink-dim);
		letter-spacing: 0.06em;

		.primer-row--head & {
			color: var(--ink-mid);
			font-size: 11px;
		}
	}

	.primer-col-type {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 16px;
		line-height: 1.3;
		color: var(--ink-bright);
		text-transform: uppercase;
		letter-spacing: 0.04em;

		.primer-row--head & {
			font-family: var(--font-mono);
			font-size: 11px;
			font-weight: 500;
			color: var(--ink-mid);
			letter-spacing: 0.08em;
		}

		@media (max-width: 480px) {
			font-size: 14px;
			letter-spacing: 0.02em;
		}
	}

	.primer-col-read {
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.4;
		color: var(--ink-mid);
		font-style: italic;
		font-weight: 400;

		.primer-row--head & {
			font-family: var(--font-mono);
			font-size: 11px;
			font-weight: 500;
			font-style: normal;
			color: var(--ink-mid);
			letter-spacing: 0.08em;
		}

		@media (max-width: 480px) {
			font-size: 14px;
		}
	}

	/* =========================================================
	  §04 FLOW
	  ========================================================= */
	.flow {
		position: relative;
		padding: 96px 48px;
		background: var(--night-mid);
		overflow: hidden;
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.flow-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 70% 55% at 50% 30%,
			rgba(var(--pool-rgb), var(--pool-alpha-mid)) 0%,
			transparent 55%
		);
	}

	.flow-header {
		position: relative;
		z-index: 1;
		max-width: 820px;
		margin: 0 auto 48px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.flow-sub {
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
	}

	.flow-diagram {
		position: relative;
		z-index: 1;
		max-width: 880px;
		margin: 0 auto;
		padding: 8px;
	}

	.flow-svg {
		display: block;
		width: 100%;
		height: auto;
		max-width: 100%;
	}

	.flow-mobile-list {
		display: none;
	}

	.flow-svg :global(.flow-label) {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.flow-svg :global(.flow-body) {
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 400;
	}

	.flow-svg :global(.flow-body--mid) {
		font-style: italic;
	}

	.flow-svg :global(.flow-body--italic) {
		font-style: italic;
		font-size: 13px;
	}

	.flow-svg :global(.flow-body--strong) {
		font-weight: 600;
		font-size: 14px;
	}

	.flow-svg :global(.flow-annotation) {
		font-family: var(--font-mono);
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	@media (max-width: 768px) {
		.flow-diagram {
			padding: 0;
		}

		.flow-svg {
			display: none;
		}

		.flow-mobile-list {
			display: grid;
			gap: 12px;
		}

		.flow-mobile-card,
		.flow-mobile-read {
			position: relative;
			overflow: hidden;
			border: 1px solid var(--stone-edge);
			border-radius: 1rem;
			background: var(--stone-warm);
			box-shadow: var(--shadow-sm);
		}

		.flow-mobile-card {
			padding: 18px;
		}

		.flow-mobile-card--accent {
			border-color: color-mix(in srgb, var(--lamp-glow) 42%, var(--stone-edge));
		}

		.flow-mobile-card--output {
			border-color: var(--lamp-glow);
		}

		.flow-mobile-read {
			padding: 16px;
		}

		.flow-mobile-read::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 4px;
			background: var(--type-stripe);
		}

		.flow-mobile-kicker {
			margin: 0 0 8px;
			color: var(--lamp-glow);
			font-size: 12px;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		.flow-mobile-card h3,
		.flow-mobile-read h3 {
			margin: 0;
			color: var(--ink-bright);
			font-family: var(--font-display);
			font-size: 16px;
			line-height: 1.35;
			font-weight: 500;
		}

		.flow-mobile-fan {
			display: grid;
			gap: 10px;
		}

		.flow-mobile-arrow,
		.flow-mobile-note {
			justify-self: center;
			color: var(--ink-dim);
		}

		.flow-mobile-arrow {
			font-size: 20px;
			line-height: 1;
		}

		.flow-mobile-note {
			margin: 0;
			font-size: 12px;
			letter-spacing: 0.1em;
			text-transform: uppercase;
		}
	}

	/* =========================================================
	  §05 OPEN FLOOR
	  ========================================================= */
	.open-floor {
		position: relative;
		padding: 96px 48px;
		background: var(--night-deep);
		overflow: hidden;
		border-top: 1px solid var(--stone-edge);
		scroll-margin-top: 72px;

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.open-floor-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 80% 60% at 50% 0%,
			rgba(var(--pool-rgb), var(--pool-alpha-mid)) 0%,
			transparent 55%
		);
	}

	.open-floor-header {
		position: relative;
		z-index: 1;
		max-width: 820px;
		margin: 0 auto 56px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.open-floor-kicker {
		color: var(--ink-dim);
	}

	.open-floor-question {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 500;
		font-size: clamp(24px, 3.4vw, 36px);
		line-height: 1.25;
		color: var(--ink-bright);
		padding: 16px 0 16px 24px;
		margin-top: 12px;
		border-left: 3px solid var(--lamp-glow);
		text-align: left;
		max-width: 720px;
		letter-spacing: -0.015em;
	}

	.open-floor-takes {
		position: relative;
		z-index: 1;
		max-width: 880px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.take-card {
		--type-stripe: var(--lamp-glow);
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-left: 3px solid var(--type-stripe);
		border-radius: 1rem;
		padding: 22px 26px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease;

		&:hover {
			border-color: var(--type-stripe);
		}

		@media (max-width: 540px) {
			padding: 18px 20px;
		}
	}

	.take-card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.take-card-label {
		color: var(--type-stripe);
	}

	.take-body {
		font-family: var(--font-display);
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-bright);
		font-style: italic;
	}

	.take-meta {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		padding-top: 8px;
		border-top: 1px dashed var(--stone-mid);

		.mono {
			color: var(--ink-dim);
		}
	}

	.open-floor-cta-row {
		position: relative;
		z-index: 1;
		max-width: 880px;
		margin: 40px auto 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
		align-items: center;
		text-align: center;
	}

	.open-floor-footnote {
		color: var(--ink-dim);
		text-transform: none;
		letter-spacing: 0.04em;
		font-size: 11.5px;
	}

	/* =========================================================
	  §06 LIBRARY
	  ========================================================= */
	.library {
		padding: 96px 48px;
		background: var(--night-deep);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.library-header {
		max-width: 820px;
		margin: 0 auto 48px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.library-sub {
		font-family: var(--font-display);
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 720px;
	}

	.library-kicker {
		color: var(--ink-dim);
		margin-top: 4px;
	}

	.library-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 22px;

		@media (max-width: 968px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 640px) {
			/* 2-across (was 3) — 3-across forced 12.5px names below legibility
			   on small phones. Design audit 2026-06-10. */
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
		}
	}

	.library-card {
		--type-stripe: var(--lamp-glow);
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		min-width: 0;
		transition:
			background 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			background: var(--stone-mid);
			border-color: var(--type-stripe);
		}

		@media (prefers-reduced-motion: no-preference) {
			transition:
				background 0.2s ease,
				border-color 0.2s ease,
				transform 0.2s ease;

			&:hover {
				transform: translateY(-2px);
			}
		}
	}

	.library-image-wrap {
		position: relative;
		border-bottom: 1px solid var(--stone-edge);
		border-top: 3px solid var(--type-stripe);
	}

	.library-image {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: center 25%;
		filter: contrast(1.05) brightness(0.96) saturate(0.92);
	}

	.library-type-chip {
		display: none;
	}

	:global(:root.light) .home .library-image {
		filter: contrast(1.02) brightness(1) saturate(0.96);
	}

	.library-image-stub {
		aspect-ratio: 4 / 3;
		background: var(--stone-mid);
		background-image: repeating-linear-gradient(
			45deg,
			transparent 0,
			transparent 14px,
			rgba(var(--pool-rgb), 0.04) 14px,
			rgba(var(--pool-rgb), 0.04) 15px
		);
		display: flex;
		align-items: center;
		justify-content: center;

		.mono {
			color: var(--ink-dim);
			font-size: 11px;
		}
	}

	.library-card-body {
		padding: 18px 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.library-id {
		color: var(--type-stripe);
		font-size: 10.5px;
	}

	.library-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 24px;
		line-height: 1.15;
		color: var(--ink-bright);
		letter-spacing: -0.02em;
	}

	.library-subtitle {
		font-family: var(--font-display);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	@media (max-width: 640px) {
		.library-header {
			margin-bottom: 32px;
		}

		.library-grid {
			max-width: 420px;
		}

		.library-card {
			border-radius: 1rem;

			&:hover {
				transform: none;
			}
		}

		.library-image-wrap {
			border-top-width: 2px;
		}

		.library-image,
		.library-image-stub {
			aspect-ratio: 1 / 1;
		}

		.library-type-chip {
			position: absolute;
			top: 6px;
			left: 6px;
			z-index: 1;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-width: 24px;
			height: 20px;
			padding: 0 6px;
			border: 1px solid var(--type-stripe);
			border-radius: 999px;
			background: rgba(10, 8, 7, 0.78);
			color: var(--type-stripe);
			font-size: 9px;
			letter-spacing: 0.04em;
			line-height: 1;
			backdrop-filter: blur(4px);
		}

		:global(:root.light) .home .library-type-chip {
			background: rgba(250, 248, 244, 0.84);
		}

		.library-card-body {
			min-height: 66px;
			padding: 8px 8px 10px;
			gap: 4px;
		}

		.library-id {
			display: none;
		}

		.library-name {
			display: -webkit-box;
			overflow: hidden;
			font-size: 15px;
			line-height: 1.2;
			letter-spacing: 0;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}

		.library-subtitle {
			overflow: hidden;
			font-size: 12px;
			line-height: 1.3;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.library .library-cta-row {
			margin-top: 28px;
		}
	}

	.library-cta-row {
		max-width: 1280px;
		margin: 40px auto 0;
		text-align: center;
		display: flex;
		justify-content: center;
	}

	/* =========================================================
	  §07 BY THE NUMBERS
	  ========================================================= */
	.compiled {
		position: relative;
		padding: 96px 48px;
		background: var(--night-mid);
		overflow: hidden;
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.compiled-pool {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 80% 60% at 50% 50%,
			rgba(var(--pool-rgb), var(--pool-alpha-mid)) 0%,
			transparent 60%
		);
	}

	.compiled-header {
		position: relative;
		z-index: 1;
		max-width: 820px;
		margin: 0 auto 48px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.compiled-grid {
		position: relative;
		z-index: 1;
		max-width: 1180px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 18px;

		@media (max-width: 968px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 540px) {
			grid-template-columns: 1fr;
		}
	}

	.compiled-stat {
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		text-align: left;
	}

	.compiled-stat-label {
		color: var(--ink-dim);
		font-size: 11px;
	}

	.compiled-stat-value {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(36px, 4.5vw, 56px);
		line-height: 1;
		color: var(--ink-bright);
		letter-spacing: -0.03em;
		font-feature-settings: 'tnum';
	}

	.compiled-stat-annotation {
		color: var(--lamp-glow);
		font-size: 10.5px;
		text-transform: lowercase;
		letter-spacing: 0.08em;
	}

	/* =========================================================
	  §08 COACHING (production-only quiet CTA)
	  ========================================================= */
	.coaching {
		position: relative;
		padding: 96px 48px;
		background: var(--night-deep);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.coaching-inner {
		max-width: 720px;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.coaching-sub {
		font-family: var(--font-display);
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;
	}

	.coaching-cta-row {
		margin-top: 8px;
		display: flex;
		justify-content: center;
	}
</style>

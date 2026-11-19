<!-- src/routes/personality-analysis/type/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { ogImageUrl } from '$lib/brand/brandCardPresets';
	import { serializeJsonLd } from '$lib/utils/jsonLd';
	import EnneagramTypeIntro from '$lib/components/blog/EnneagramTypeIntro.svelte';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import TestYourTypeCTA from '$lib/components/blog/TestYourTypeCTA.svelte';
	import EnneagramTypeBottom from '$lib/components/blog/EnneagramTypeBottom.svelte';
	import CorpusStatCallout from '$lib/components/blog/callouts/CorpusStatCallout.svelte';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		buildPersonalityImageUrl,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import { portraitPhoneSrc } from '$lib/imageVariants.js';
	import TypeVennMap from './TypeVennMap.svelte';
	import { untrack } from 'svelte';

	let { data }: { data: PageData } = $props();

	// The pattern strip: one word at a time lights up every person whose persona
	// title uses it, across every field.
	let activeWord = $state<string | null>(null);
	let activePattern = $derived(
		data.patterns.find((pattern) => pattern.word === activeWord) ?? null
	);
	let litSlugs = $derived(new Set(activePattern?.slugs ?? []));

	function togglePattern(word: string) {
		activeWord = activeWord === word ? null : word;
	}

	type PanelPerson = PageData['people'][number];

	let peopleBySlug = $derived(new Map(data.people.map((person) => [person.slug, person])));

	// The zoomed field: the map zooms in and the panel below lists who's in it.
	let focusedField = $state<string | null>(null);
	let focusedGroup = $derived(
		data.peopleGroups.find((group) => group.slug === focusedField) ?? null
	);
	// Field membership is shared across layouts, even when a portrait has no room in a lens.
	let focusedCrossovers = $derived.by(() => {
		const field = focusedField;
		if (!field) return [];
		return data.peopleGroups
			.map((group) => ({
				field: group.slug,
				label: group.shortLabel,
				people: group.people.filter((person) => person.secondaryFields.includes(field))
			}))
			.filter((group) => group.people.length > 0);
	});
	let alsoInLane = $derived.by(() => {
		const field = focusedGroup;
		const matches = new Map<string, PanelPerson[]>();
		if (!field) return matches;
		const home = new Set(field.people.map((person) => person.slug));
		const members = data.people.filter(
			(person) => home.has(person.slug) || person.secondaryFields.includes(field.slug)
		);
		for (const lane of field.lanes) {
			if (!lane.label) continue;
			const primary = new Set(lane.people.map((person) => person.slug));
			matches.set(
				lane.slug,
				members.filter((person) => !primary.has(person.slug) && person.roles.includes(lane.label))
			);
		}
		return matches;
	});

	// For the "what you're looking at" line under the map.
	let biggestField = $derived(
		data.peopleGroups.find((group) => group.slug !== 'more')?.label ?? ''
	);
	let patternWords = $derived(
		data.patterns
			.slice(0, 3)
			.map((pattern) => pattern.label)
			.join(', ')
	);
	let mapReading = $derived(
		[
			`Each circle is a field where Type ${data.slug}s made their name, sized by how many we've analyzed there${biggestField ? `, and most land in ${biggestField}` : ''}.`,
			'Faces where two circles overlap belong to both.',
			patternWords
				? `The words at the top (${patternWords}) are the ones our analyses keep reaching for when they describe a Type ${data.slug}.`
				: '',
			'Different worlds, same engine underneath:'
		]
			.filter(Boolean)
			.join(' ')
	);

	// Wings are the numbers either side; the lines are where the type moves in
	// growth and under stress (the standard Enneagram arrows).
	const GROWTH: Record<string, string> = {
		'1': '7',
		'2': '4',
		'3': '6',
		'4': '1',
		'5': '8',
		'6': '9',
		'7': '5',
		'8': '2',
		'9': '3'
	};
	const STRESS: Record<string, string> = {
		'1': '4',
		'2': '8',
		'3': '9',
		'4': '2',
		'5': '7',
		'6': '3',
		'7': '1',
		'8': '5',
		'9': '6'
	};
	let neighbors = $derived.by(() => {
		const n = Number(data.slug);
		if (!Number.isInteger(n) || n < 1 || n > 9) return [];
		const wrap = (value: number) => String(((value + 8) % 9) + 1);
		return [
			{ key: 'wing-low', role: 'Wing', type: wrap(n - 1) },
			{ key: 'wing-high', role: 'Wing', type: wrap(n + 1) },
			{ key: 'growth', role: 'Grows toward', type: GROWTH[data.slug] },
			{ key: 'stress', role: 'Under stress', type: STRESS[data.slug] }
		];
	});
	let neighborRole = $derived(new Map(neighbors.map((neighbor) => [neighbor.type, neighbor.role])));

	// "On this page": the map, then every h2 in the reading column.
	let tocItems = $state<{ id: string; text: string }[]>([]);
	let activeTocId = $state('');
	let readingEl = $state<HTMLElement | null>(null);
	let railsOn = $state(false);
	let leftRailEl = $state<HTMLElement | null>(null);
	let rightRailEl = $state<HTMLElement | null>(null);

	function collectHeadings(article: HTMLElement) {
		const used = new Set<string>();
		const items = [{ id: 'type-map', text: `The Type ${data.slug} map` }];
		for (const heading of article.querySelectorAll('h2')) {
			if (!heading.id) {
				let id = (heading.textContent ?? '')
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-|-$/g, '');
				while (used.has(id) || document.getElementById(id)) id += '-x';
				heading.id = id;
			}
			used.add(heading.id);
			items.push({ id: heading.id, text: (heading.textContent ?? '').trim() });
		}
		tocItems = items;
		untrack(updateRails);
	}

	function updateRails() {
		if (!readingEl) return;
		const box = readingEl.getBoundingClientRect();
		// Rails pin at `top: 7rem`. Show them only once the reading column has
		// scrolled up to that line (so the map is fully above them and they never
		// sit over its faces), and hide them before the column runs out under them.
		const railTop = 7 * parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
		const railHeight = Math.max(leftRailEl?.offsetHeight ?? 0, rightRailEl?.offsetHeight ?? 0);
		railsOn = box.top <= railTop && box.bottom >= railTop + railHeight + 24;
		let current = '';
		for (const item of tocItems) {
			const target = document.getElementById(item.id);
			if (target && target.getBoundingClientRect().top < 160) current = item.id;
		}
		activeTocId = current;
	}

	function focusField(slug: string | null) {
		focusedField = slug;
	}

	/** Splits a persona title so the active pattern word can be marked. */
	function titleParts(title: string, word: string | null): { text: string; hit: boolean }[] {
		if (!word) return [{ text: title, hit: false }];
		const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		return title
			.split(new RegExp(`(\\b${escaped}\\b)`, 'i'))
			.filter(Boolean)
			.map((text) => ({ text, hit: text.toLowerCase() === word }));
	}

	type EnneagramTypeMeta = {
		name: string;
		tagline: string;
		archetype: string;
		coreFear: string;
		coreDesire: string;
		summary: string;
	};

	const enneagramTypes: Record<string, EnneagramTypeMeta> = {
		'1': {
			name: 'The Perfectionist',
			tagline: 'Principled, purposeful, self-controlled',
			archetype: 'The Reformer',
			coreFear: 'being corrupt, defective, or wrong',
			coreDesire: 'integrity, goodness, and improvement',
			summary:
				'Type 1s carry an internal compass that points toward how things should be. Principled, ethical, and relentless about doing things right.'
		},
		'2': {
			name: 'The Helper',
			tagline: 'Generous, demonstrative, deeply caring',
			archetype: 'The Caregiver',
			coreFear: 'being unloved or unwanted',
			coreDesire: 'to be loved and appreciated',
			summary:
				'Type 2s read what people need before they say it. Warm, generous, and tuned to the emotional weather of the room.'
		},
		'3': {
			name: 'The Achiever',
			tagline: 'Adaptable, excelling, driven',
			archetype: 'The Performer',
			coreFear: 'being worthless or without value',
			coreDesire: 'to feel valuable and admired',
			summary:
				'Type 3s read the room, adapt their image, and execute. Goal-oriented, polished, and wired for achievement and recognition.'
		},
		'4': {
			name: 'The Individualist',
			tagline: 'Expressive, dramatic, introspective',
			archetype: 'The Romantic',
			coreFear: 'having no identity or significance',
			coreDesire: 'to find themselves and their meaning',
			summary:
				'Type 4s feel things at a depth most people avoid. Creative, introspective, and committed to authenticity over fitting in.'
		},
		'5': {
			name: 'The Investigator',
			tagline: 'Perceptive, innovative, private',
			archetype: 'The Observer',
			coreFear: 'being helpless, useless, or incapable',
			coreDesire: 'to be capable and competent',
			summary:
				'Type 5s disappear into ideas and emerge with frameworks. Curious, analytical, and protective of their time and energy.'
		},
		'6': {
			name: 'The Loyalist',
			tagline: 'Engaging, responsible, vigilant',
			archetype: 'The Skeptic',
			coreFear: 'being without support or guidance',
			coreDesire: 'security and trustworthy support',
			summary:
				'Type 6s scan for what could go wrong and prepare for it. Loyal, vigilant, and the people you want with you in a crisis.'
		},
		'7': {
			name: 'The Enthusiast',
			tagline: 'Spontaneous, versatile, optimistic',
			archetype: 'The Adventurer',
			coreFear: 'being trapped in pain or deprivation',
			coreDesire: 'to be satisfied and stimulated',
			summary:
				'Type 7s chase the next idea, trip, or possibility. Optimistic, energetic, and allergic to anything that feels like a cage.'
		},
		'8': {
			name: 'The Challenger',
			tagline: 'Self-confident, decisive, protective',
			archetype: 'The Protector',
			coreFear: 'being controlled or harmed by others',
			coreDesire: 'to protect themselves and stay in control',
			summary:
				'Type 8s take up space and protect their people. Direct, decisive, and unwilling to be controlled by anyone.'
		},
		'9': {
			name: 'The Peacemaker',
			tagline: 'Receptive, reassuring, easygoing',
			archetype: 'The Mediator',
			coreFear: 'loss of connection and fragmentation',
			coreDesire: 'inner stability and peace of mind',
			summary:
				'Type 9s see every side and resist anything that disrupts the peace. Calm, accepting, and quietly stubborn about harmony.'
		}
	};

	// Matches ArticleTitle's tag so the name morphs into the person page's heading.
	function transitionTag(person: { title: string | null; slug: string }): string {
		return `h-blog-${(person.title ?? person.slug).toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`;
	}

	function portraitAlt(personSlug: string): string {
		return `${formatPersonalityDisplayName(personSlug)}, Enneagram Type ${data.slug} (${typeInfo.name})`;
	}

	function getLatestDate(people: PageData['people']): string | null {
		let latestDate: string | null = null;
		let latestTimestamp = 0;

		for (const person of people) {
			const candidate = person.lastmod ?? person.date;
			if (!candidate) continue;

			const timestamp = new Date(candidate).getTime();
			if (!Number.isFinite(timestamp) || timestamp <= latestTimestamp) continue;

			latestDate = candidate;
			latestTimestamp = timestamp;
		}

		return latestDate;
	}

	const FALLBACK_TYPE_META: EnneagramTypeMeta = {
		name: '',
		tagline: '',
		archetype: '',
		coreFear: '',
		coreDesire: '',
		summary: ''
	};

	const SIBLING_TYPES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

	let typeInfo = $derived(enneagramTypes[data.slug] ?? FALLBACK_TYPE_META);
	let peopleCount = $derived(data.people.length);
	let groupedPeople = $derived(data.peopleGroups.flatMap((group) => group.people));
	let typeUrl = $derived(`https://9takes.com/personality-analysis/type/${data.slug}`);
	let pageId = $derived(`${typeUrl}#webpage`);
	let collectionId = $derived(`${typeUrl}#collection`);
	let articleId = $derived(`${typeUrl}#article`);
	let breadcrumbId = $derived(`${typeUrl}#breadcrumb`);
	let faqId = $derived(`${typeUrl}#faq`);

	let seoTitle = $derived(
		`${peopleCount} Famous Enneagram Type ${data.slug}s: ${typeInfo.name} (Examples & Analyses)`
	);
	// Lands at 136-154 chars for every type at any count from 1 to 150.
	let seoDescription = $derived(
		`${peopleCount} famous Enneagram Type ${data.slug}s (${typeInfo.name}), decoded. ${typeInfo.tagline}. See the pattern in celebrities, leaders, and creators.`
	);

	let latestDate = $derived(getLatestDate(data.people));

	let leadPerson = $derived(data.people.find((person) => person.enneagram && person.slug));
	let leadOgImage = $derived(
		leadPerson ? buildPersonalityImageUrl(leadPerson.enneagram, leadPerson.slug, 'full') : ''
	);
	let ogImage = $derived(leadOgImage || ogImageUrl('personality-analysis'));

	let breadcrumbSchema = $derived({
		'@type': 'BreadcrumbList',
		'@id': breadcrumbId,
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Home',
				item: 'https://9takes.com'
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Personality Analysis',
				item: 'https://9takes.com/personality-analysis'
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: `Type ${data.slug}: ${typeInfo.name}`,
				item: typeUrl
			}
		]
	});

	let webPageSchema = $derived({
		'@type': 'CollectionPage',
		'@id': pageId,
		url: typeUrl,
		name: `Famous Enneagram Type ${data.slug} (${typeInfo.name}) Personalities`,
		description: seoDescription,
		inLanguage: 'en-US',
		isPartOf: { '@id': 'https://9takes.com/#website' },
		breadcrumb: { '@id': breadcrumbId },
		mainEntity: { '@id': collectionId },
		...(latestDate ? { dateModified: latestDate } : {}),
		about: [
			{
				'@type': 'Thing',
				name: 'Enneagram of Personality',
				sameAs: 'https://en.wikipedia.org/wiki/Enneagram_of_Personality'
			},
			{
				'@type': 'Thing',
				name: `Enneagram Type ${data.slug}: ${typeInfo.name}`
			}
		],
		publisher: {
			'@type': 'Organization',
			name: '9takes',
			url: 'https://9takes.com',
			logo: {
				'@type': 'ImageObject',
				url: 'https://9takes.com/brand/9takes-nine-mask-logo-512.png'
			}
		}
	});

	let itemListSchema = $derived({
		'@type': 'ItemList',
		'@id': collectionId,
		name: `Famous Enneagram Type ${data.slug} Personalities`,
		numberOfItems: peopleCount,
		itemListOrder: 'https://schema.org/ItemListUnordered',
		itemListElement: groupedPeople.map((person, index) => {
			const displayName = formatPersonalityDisplayName(person.slug);
			const personUrl = `https://9takes.com${buildPersonalityAnalysisPath(person.slug)}`;
			const imageUrl = person.enneagram
				? buildPersonalityImageUrl(person.enneagram, person.slug, 'full')
				: '';
			return {
				'@type': 'ListItem',
				position: index + 1,
				url: personUrl,
				item: {
					'@type': 'Person',
					'@id': `${personUrl}#person`,
					name: displayName,
					url: personUrl,
					...(imageUrl ? { image: imageUrl } : {}),
					additionalType: `https://9takes.com/personality-analysis/type/${data.slug}`,
					description: `Enneagram Type ${data.slug} (${typeInfo.name}) personality analysis of ${displayName} on 9takes.`
				}
			};
		})
	});

	let articleSchema = $derived({
		'@type': 'Article',
		'@id': articleId,
		headline: `Enneagram Type ${data.slug}: ${typeInfo.name} (Worldview, Wings, and Famous Examples)`,
		description: typeInfo.summary,
		mainEntityOfPage: { '@id': pageId },
		isPartOf: { '@id': pageId },
		inLanguage: 'en-US',
		about: {
			'@type': 'Thing',
			name: `Enneagram Type ${data.slug}: ${typeInfo.name}`
		},
		author: {
			'@type': 'Organization',
			name: '9takes',
			url: 'https://9takes.com'
		},
		publisher: {
			'@type': 'Organization',
			name: '9takes',
			url: 'https://9takes.com',
			logo: {
				'@type': 'ImageObject',
				url: 'https://9takes.com/brand/9takes-nine-mask-logo-512.png'
			}
		},
		...(latestDate ? { dateModified: latestDate } : {})
	});

	let corpusInsight = $derived(data.corpusInsight);

	// Two different facts, two different questions: the most over-represented
	// domain (relative to the corpus baseline) is not the most common one.
	let corpusFaqs = $derived(
		corpusInsight
			? [
					corpusInsight.variant === 'domain-overrep'
						? {
								'@type': 'Question',
								name: `In which domain is Enneagram Type ${data.slug} (${typeInfo.name}) most over-represented on 9takes?`,
								acceptedAnswer: {
									'@type': 'Answer',
									text: `${corpusInsight.claim}${corpusInsight.mostCommonDomainText ? ` By raw count, the most common domain for Type ${data.slug}s on 9takes is ${corpusInsight.mostCommonDomainText}.` : ''} See the full breakdown at https://9takes.com${corpusInsight.corpusAnchorUrl}.`
								}
							}
						: {
								'@type': 'Question',
								name: `Which domain has the most Enneagram Type ${data.slug} (${typeInfo.name}) profiles on 9takes?`,
								acceptedAnswer: {
									'@type': 'Answer',
									text: `${corpusInsight.claim} Full corpus stats: https://9takes.com${corpusInsight.corpusAnchorUrl}.`
								}
							},
					{
						'@type': 'Question',
						name: `How rare is Enneagram Type ${data.slug} (${typeInfo.name}) in the 9takes corpus?`,
						acceptedAnswer: {
							'@type': 'Answer',
							text: `Type ${data.slug} is ${corpusInsight.typeSharePct} of the 9takes corpus: ${corpusInsight.typeCount} of ${corpusInsight.corpusPublished} published profiles, ${corpusInsight.typeRankPhrase}.${corpusInsight.mostCommonDomainText ? ` Its most common domain is ${corpusInsight.mostCommonDomainText}.` : ''} These shares reflect which public figures 9takes has profiled and how its editors typed them, not how common Type ${data.slug} is in the general population. Browse the full Type ${data.slug} gallery at https://9takes.com/personality-analysis/type/${data.slug}.`
						}
					}
				]
			: []
	);

	let faqSchema = $derived({
		'@type': 'FAQPage',
		'@id': faqId,
		mainEntity: [
			{
				'@type': 'Question',
				name: `What does Enneagram Type ${data.slug} (${typeInfo.name}) mean?`,
				acceptedAnswer: {
					'@type': 'Answer',
					text: `Enneagram Type ${data.slug}, also known as ${typeInfo.archetype} or ${typeInfo.name}, is defined by ${typeInfo.tagline.toLowerCase()}. ${typeInfo.summary}`
				}
			},
			{
				'@type': 'Question',
				name: `What is the core fear of Enneagram Type ${data.slug}?`,
				acceptedAnswer: {
					'@type': 'Answer',
					text: `Type ${data.slug}s are driven by a core fear of ${typeInfo.coreFear}, which shapes their motivations, decisions, and relationships.`
				}
			},
			{
				'@type': 'Question',
				name: `What does Enneagram Type ${data.slug} want most?`,
				acceptedAnswer: {
					'@type': 'Answer',
					text: `The core desire of Type ${data.slug} (${typeInfo.name}) is ${typeInfo.coreDesire}. Most of their behavior can be traced back to pursuing this.`
				}
			},
			{
				'@type': 'Question',
				name: `Who are some famous Enneagram Type ${data.slug}s?`,
				acceptedAnswer: {
					'@type': 'Answer',
					text:
						peopleCount > 0
							? `Famous Enneagram Type ${data.slug} examples include ${data.people
									.slice(0, 8)
									.map((p) => formatPersonalityDisplayName(p.slug))
									.filter(Boolean)
									.join(
										', '
									)}. 9takes profiles ${peopleCount} Type ${data.slug} personalities in total.`
							: `9takes is actively building its library of famous Type ${data.slug} (${typeInfo.name}) personalities.`
				}
			},
			...corpusFaqs
		]
	});

	let structuredData = $derived({
		'@context': 'https://schema.org',
		'@graph': [breadcrumbSchema, webPageSchema, articleSchema, itemListSchema, faqSchema]
	});

	let canonicalUrl = $derived(typeUrl);
</script>

<svelte:window onscroll={updateRails} onresize={updateRails} />

<svelte:head>
	{@html `<script type="application/ld+json">${serializeJsonLd(structuredData)}</script>`}
</svelte:head>

<SEOHead
	title={seoTitle}
	description={seoDescription}
	canonical={canonicalUrl}
	twitterCardType="summary_large_image"
	{ogImage}
	ogImageWidth={leadOgImage ? undefined : 1200}
	ogImageHeight={leadOgImage ? undefined : 630}
	twitterImageAlt={`Famous Enneagram Type ${data.slug}: ${typeInfo.name}`}
	author="9takes"
	ogType="website"
	additionalMeta={[
		...(latestDate ? [{ property: 'article:modified_time', content: latestDate }] : []),
		{
			name: 'keywords',
			content: `enneagram type ${data.slug}, famous type ${data.slug}, ${typeInfo.name.toLowerCase()}, ${typeInfo.archetype.toLowerCase()}, enneagram celebrities, personality types`
		}
	]}
/>

<div class="page-wrapper" style={`--type-accent: var(--type-${data.slug}-color);`}>
	<header class="hub-head">
		<nav class="breadcrumbs" aria-label="Breadcrumb">
			<ol>
				<li><a href="/">Home</a></li>
				<li><a href="/personality-analysis">Personality Analysis</a></li>
				<li aria-current="page">Type {data.slug}</li>
			</ol>
		</nav>

		<div class="head-grid">
			<div class="title-row">
				<span class="type-badge" aria-hidden="true">{data.slug}</span>
				<div class="title-copy">
					<h1>
						Famous Enneagram Type {data.slug}s<span class="h1-sep">:</span>
						<span class="h1-name">{typeInfo.name}</span>
					</h1>
					<p class="lede">
						{#if peopleCount > 0}
							<strong>{peopleCount} people</strong>, grouped by where they made their name.
						{/if}
						{typeInfo.tagline}.
					</p>
				</div>
			</div>

			{#if data.patterns.length > 0}
				<div class="pattern-strip">
					<p class="strip-label" id="pattern-label">
						What keeps showing up in Type {data.slug}s
					</p>
					<div class="pattern-chips" role="group" aria-labelledby="pattern-label">
						{#each data.patterns as pattern (pattern.word)}
							<button
								type="button"
								class="pattern-chip"
								aria-pressed={activeWord === pattern.word}
								onclick={() => togglePattern(pattern.word)}
							>
								{pattern.label}
								<span class="chip-count">{pattern.count}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		{#if data.peopleGroups.length > 1}
			<div class="field-nav" role="group" aria-label={`Zoom into a field of Type ${data.slug}s`}>
				<ul>
					{#each data.peopleGroups as group (group.slug)}
						<li>
							<button
								type="button"
								aria-pressed={focusedField === group.slug}
								onclick={() => focusField(focusedField === group.slug ? null : group.slug)}
								style:--group-accent={group.accent ?? 'var(--text-faint)'}
							>
								<span class="field-dot" aria-hidden="true"></span>
								{group.shortLabel}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</header>

	<div class="hub-body">
		<section
			class="famous-people"
			id="type-map"
			aria-label={`Famous Type ${data.slug}s mapped by field`}
		>
			{#if peopleCount === 0}
				<p class="empty">More Type {data.slug} personality profiles are on the way.</p>
			{:else}
				<p class="map-hint"><span class="hint-action">Tap a circle to zoom in.</span></p>
				<div class="map map-wide">
					<TypeVennMap
						layout={data.venn.wide}
						people={peopleBySlug}
						focused={focusedField}
						lit={activePattern ? litSlugs : null}
						typeLabel={`Type ${data.slug} (${typeInfo.name})`}
						listHref="#niche-panel"
						onfocus={focusField}
					/>
				</div>
				<div class="map map-tall">
					<TypeVennMap
						layout={data.venn.tall}
						people={peopleBySlug}
						focused={focusedField}
						lit={activePattern ? litSlugs : null}
						typeLabel={`Type ${data.slug} (${typeInfo.name})`}
						listHref="#niche-panel"
						onfocus={focusField}
					/>
				</div>
			{/if}

			{#if focusedGroup}
				{@const lead = focusedGroup.people[0]}
				<section
					class="niche-panel"
					id="niche-panel"
					aria-labelledby="niche-heading"
					style:--group-accent={focusedGroup.accent ?? 'var(--text-faint)'}
				>
					<header class="field-head">
						<h2 id="niche-heading">
							<span class="field-dot" aria-hidden="true"></span>
							{focusedGroup.label}
						</h2>
						{#if lead?.hook && focusedGroup.people.length > 1}
							<a class="field-hook" href={buildPersonalityAnalysisPath(lead.slug)}>{lead.hook}</a>
						{/if}
					</header>
					<div class="lanes">
						{#each focusedGroup.lanes as lane (lane.slug)}
							{@render laneCards(lane.label, lane.people, lane.slug, alsoInLane.get(lane.slug))}
						{/each}
						{#each focusedCrossovers as shared (shared.field)}
							{@render laneCards(
								`Shared with ${shared.label}`,
								shared.people,
								`shared-${shared.field}`
							)}
						{/each}
					</div>
				</section>
			{/if}
		</section>

		{#snippet laneCards(
			label: string,
			lanePeople: PanelPerson[],
			key: string,
			also: PanelPerson[] = []
		)}
			<div class="lane" data-lane={key}>
				{#if label}
					<h3 class="lane-label">{label}</h3>
				{/if}
				<ul class="faces">
					{#each lanePeople as person (person.slug)}
						{@const fullPath = buildPersonalityImagePath(person.enneagram, person.slug, 'full')}
						{@const isLit = litSlugs.has(person.slug)}
						{@const roles = person.roles.filter(
							(role) => role !== label && role !== focusedGroup?.shortLabel
						)}
						<li class={['face', activePattern && (isLit ? 'face-lit' : 'face-dim')]}>
							<a href={buildPersonalityAnalysisPath(person.slug)} class="face-link">
								<span class="portrait personality-portrait-well">
									{#if person.enneagram}
										<picture>
											{#if portraitPhoneSrc(fullPath)}
												<source type="image/avif" srcset={portraitPhoneSrc(fullPath)} />
											{/if}
											<img
												class="personality-portrait-image"
												src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
												alt={portraitAlt(person.slug)}
												width="240"
												height="240"
												loading="lazy"
												decoding="async"
											/>
										</picture>
									{/if}
									{#if person.hook}
										<span class="hook" aria-hidden="true">{person.hook}</span>
									{/if}
								</span>
								<span class="face-name" style:--tag={transitionTag(person)}>
									{formatPersonalityDisplayName(person.slug)}
								</span>
								{#if roles.length}
									<span class="face-roles">{roles.join(' · ')}</span>
								{/if}
								{#if person.personaTitle}
									<span class="persona">
										{#each titleParts(person.personaTitle, activeWord) as part, partIndex (partIndex)}
											{#if part.hit}<mark>{part.text}</mark>{:else}{part.text}{/if}
										{/each}
									</span>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
				{#if also.length}
					<div class="shared-lane-members">
						<span>Also in this group</span>
						<ul aria-label={`Also in ${label}`}>
							{#each also as person (person.slug)}
								<li>
									<a href={buildPersonalityAnalysisPath(person.slug)}
										>{formatPersonalityDisplayName(person.slug)}</a
									>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/snippet}

		{#if activePattern}
			<div class="pattern-status" role="status">
				<span>
					<strong>{activePattern.label}</strong>
					· {activePattern.count} Type {data.slug}s
				</span>
				<button type="button" onclick={() => (activeWord = null)} aria-label="Clear highlight">
					Clear
				</button>
			</div>
		{/if}

		<div class="hub-reading" bind:this={readingEl}>
			<article class="type-explainer" aria-labelledby="explainer-heading" {@attach collectHeadings}>
				<header class="explainer-head">
					<div class="explainer-intro">
						<p class="explainer-eyebrow">The pattern behind the faces</p>
						<h2 id="explainer-heading">What makes someone a Type {data.slug}</h2>
						{#if peopleCount > 0}
							<p class="explainer-read">{mapReading}</p>
						{/if}
					</div>
					<div class="explainer-core">
						<dl class="core-pair">
							<div>
								<dt>Core fear</dt>
								<dd>{typeInfo.coreFear}</dd>
							</div>
							<div>
								<dt>Core desire</dt>
								<dd>{typeInfo.coreDesire}</dd>
							</div>
						</dl>
						{#if typeInfo.summary}
							<p class="explainer-summary">{typeInfo.summary}</p>
						{/if}
					</div>
				</header>

				<div class="explainer-body">
					<EnneagramTypeIntro type={data.slug} />

					<div class="cta-slot">
						<TestYourTypeCTA
							heading={`Are you a Type ${data.slug} too?`}
							body="Take the free 9takes Enneagram test. It starts with the emotion that runs you, takes 5 to 10 minutes, needs no email, and lets someone who knows you check your result."
							compact
						/>
					</div>

					{#if corpusInsight}
						<CorpusStatCallout
							claim={corpusInsight.claim}
							eyebrow={`9takes Corpus Stat: ${corpusInsight.sampleLabel}`}
							domainLabel={corpusInsight.domainLabel}
							domainUrl={corpusInsight.domainUrl}
							corpusAnchorUrl={corpusInsight.corpusAnchorUrl}
							domainTotal={corpusInsight.sampleSize}
							sharePct={corpusInsight.sharePct}
							deltaPpFormatted={corpusInsight.deltaPpFormatted}
							generatedAt={corpusInsight.generatedAt}
						/>
					{/if}

					<EnneagramTypeBottom type={data.slug} />
				</div>
			</article>

			<nav class="sibling-types" aria-label="Other Enneagram types">
				<h2>See who lands in the other eight types</h2>
				<ul>
					{#each SIBLING_TYPES as siblingSlug (siblingSlug)}
						{@const meta = enneagramTypes[siblingSlug]}
						{#if siblingSlug === data.slug}
							<li
								class="current"
								aria-current="page"
								style={`--sibling-accent: var(--type-${siblingSlug}-color);`}
							>
								<span class="sibling-num">{siblingSlug}</span>
								<span class="sibling-name">{meta.name}</span>
							</li>
						{:else}
							<li style={`--sibling-accent: var(--type-${siblingSlug}-color);`}>
								<a href={`/personality-analysis/type/${siblingSlug}`}>
									<span class="sibling-num">{siblingSlug}</span>
									<span class="sibling-name">{meta.name}</span>
									{#if neighborRole.get(siblingSlug)}
										<span class="sibling-tag">{neighborRole.get(siblingSlug)}</span>
									{/if}
								</a>
							</li>
						{/if}
					{/each}
				</ul>
				<p class="sibling-all">
					<a href="/personality-analysis#enneagram-celebrities"
						>See all nine side by side: Enneagram celebrities by type <span aria-hidden="true"
							>&rarr;</span
						></a
					>
				</p>
			</nav>

			{#if corpusInsight || !data?.user}
				<footer>
					{#if corpusInsight}
						<p class="corpus-links">
							Want the raw numbers? See the
							<a href="/corpus-stats#enneagram-distribution"
								>full type distribution across {corpusInsight.corpusPublished} profiles</a
							>
							or the
							<a href="/corpus-stats#per-type-domains"
								>per-type domain breakdown for Type {data.slug}</a
							>.
						</p>
					{/if}
					{#if !data?.user}
						<div class="email-signup">
							<EmailSignup />
						</div>
					{/if}
				</footer>
			{/if}
		</div>

		<!-- Wide screens: pinned rails beside the reading column, the same pattern as
		     Enneagram Corner posts. position: fixed, because .app-wrapper's overflow
		     makes position: sticky a no-op on this site. -->
		{#if tocItems.length > 0}
			<aside
				class={['rail', 'rail-left', railsOn && 'rail-on']}
				aria-label="On this page"
				bind:this={leftRailEl}
			>
				<p class="rail-title">On this page</p>
				<ul class="rail-toc">
					{#each tocItems as item (item.id)}
						<li>
							<a href={`#${item.id}`} class={[activeTocId === item.id && 'is-active']}
								>{item.text}</a
							>
						</li>
					{/each}
				</ul>
			</aside>
		{/if}
		{#if neighbors.length > 0}
			<aside
				class={['rail', 'rail-right', railsOn && 'rail-on']}
				bind:this={rightRailEl}
				aria-label={`Types next to Type ${data.slug}`}
			>
				<p class="rail-title">Type {data.slug}'s neighbors</p>
				<ul class="rail-neighbors">
					{#each neighbors as neighbor (neighbor.key)}
						<li style={`--sibling-accent: var(--type-${neighbor.type}-color);`}>
							<span class="neighbor-role">{neighbor.role}</span>
							<a href={`/personality-analysis/type/${neighbor.type}`}>
								<span class="sibling-num">{neighbor.type}</span>
								{enneagramTypes[neighbor.type].name}
							</a>
						</li>
					{/each}
				</ul>
			</aside>
		{/if}
	</div>
</div>

<style lang="scss">
	/* Two widths, both centred, matching the person pages: the header and map use
	   the 1280px band; everything below the map reads in one 760px column (the
	   person-page measure). Wide screens add pinned rails either side of it. */
	.page-wrapper {
		--hub-width: 1280px;
		--hub-gutter: 1.5rem;
		--prose-width: 47.5rem;
		--rail-width: 13rem;
		--rail-gap: 2.5rem;
		min-height: 100vh;
		background: var(--bg);
	}

	/* ---------- Header: compact, so the faces start in the first screen ---------- */
	.hub-head {
		max-width: calc(var(--hub-width) + 2 * var(--hub-gutter));
		margin: 0 auto;
		padding: 0.875rem var(--hub-gutter) 0;
	}

	.breadcrumbs {
		font-size: var(--font-size-xs);
		color: var(--text-faint);
		position: relative;

		ol {
			list-style: none;
			display: flex;
			flex-wrap: wrap;
			gap: 0.25rem;
			padding: 0;
			margin: 0;
		}

		li {
			display: inline-flex;
			align-items: center;

			&:not(:last-child)::after {
				content: '/';
				margin: 0 0.4rem;
				opacity: 0.6;
			}

			&[aria-current='page'] {
				color: var(--text-muted);
			}
		}

		a {
			color: var(--text-faint);
			text-decoration: none;

			&:hover {
				color: var(--highlight);
			}
		}
	}

	@media (min-width: 960px) {
		.head-grid {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
			gap: 2.5rem;
			align-items: end;
		}

		.head-grid .pattern-strip {
			margin-top: 0;
		}
	}

	.title-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.875rem;
		position: relative;
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 3.5rem;
		height: 3.5rem;
		font-size: 1.875rem;
		font-weight: 800;
		color: color-mix(in srgb, var(--type-accent) 72%, var(--text));
		background: color-mix(in srgb, var(--type-accent) 18%, var(--surface));
		border: 1px solid color-mix(in srgb, var(--type-accent) 58%, var(--rule));
		border-radius: 1rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.375rem, 3.4vw, 2.125rem);
		line-height: 1.15;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--text);
	}

	.h1-sep {
		color: var(--text-faint);
	}

	.h1-name {
		color: color-mix(in srgb, var(--type-accent) 60%, var(--text));
	}

	.lede {
		margin: 0.3rem 0 0;
		font-size: var(--font-size-base);
		line-height: 1.45;
		color: var(--text-muted);

		strong {
			color: var(--text);
			font-weight: 600;
		}
	}

	/* ---------- Pattern strip ---------- */
	.pattern-strip {
		margin-top: 1.125rem;
		position: relative;
	}

	.strip-label {
		margin: 0 0 0.5rem;
		font-size: var(--font-size-xs);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.pattern-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.pattern-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.4rem 0.8rem;
		font: inherit;
		font-size: var(--font-size-base);
		font-weight: 600;
		color: var(--text);
		background: var(--surface);
		border: 1px solid var(--rule);
		border-radius: 9999px;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease;

		&:hover {
			border-color: color-mix(in srgb, var(--type-accent) 55%, var(--rule));
		}

		&:focus-visible {
			outline: 2px solid var(--type-accent);
			outline-offset: 2px;
		}

		&[aria-pressed='true'] {
			background: color-mix(in srgb, var(--type-accent) 26%, var(--surface));
			border-color: var(--type-accent);
		}
	}

	.chip-count {
		font-size: var(--font-size-xs);
		font-weight: 700;
		color: color-mix(in srgb, var(--type-accent) 70%, var(--text));
	}

	/* ---------- Field jump nav: one scrolling row ---------- */
	.field-nav {
		margin: 1rem calc(-1 * var(--hub-gutter)) 0;
		position: relative;

		ul {
			display: flex;
			gap: 0.375rem;
			list-style: none;
			margin: 0;
			padding: 0 var(--hub-gutter) 0.25rem;
			overflow-x: auto;
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		button {
			display: inline-flex;
			align-items: center;
			gap: 0.4rem;
			padding: 0.3rem 0.7rem;
			white-space: nowrap;
			font: inherit;
			font-size: var(--font-size-sm);
			color: var(--text-muted);
			background: transparent;
			border: 1px solid var(--rule);
			border-radius: 9999px;
			cursor: pointer;

			&:hover,
			&:focus-visible {
				color: var(--text);
				border-color: color-mix(in srgb, var(--group-accent) 55%, var(--rule));
			}

			&:focus-visible {
				outline: 2px solid var(--focus);
				outline-offset: 2px;
			}

			&[aria-pressed='true'] {
				color: var(--text);
				background: color-mix(in srgb, var(--group-accent) 18%, transparent);
				border-color: var(--group-accent);
			}
		}
	}

	.field-dot {
		width: 0.5rem;
		height: 0.5rem;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--group-accent);
	}

	/* ---------- Body ---------- */
	.hub-body {
		max-width: calc(var(--hub-width) + 2 * var(--hub-gutter));
		margin: 0 auto;
		padding: 0 var(--hub-gutter) 4rem;
	}

	.empty {
		margin: 2rem 0;
		color: var(--text-muted);
	}

	/* The site's global section and article padding would nudge these off the
	   shared column edge. */
	.famous-people,
	.niche-panel {
		padding: 0;
	}

	.map-hint {
		margin: 1.25rem 0 0.75rem;
		font-size: var(--font-size-sm);
		line-height: 1.5;
		color: var(--text-faint);
	}

	.hint-action {
		color: var(--text-muted);
		font-weight: 600;
	}

	/* One map per shape: landscape for wide screens, portrait for phones. */
	.map-tall {
		display: none;
	}

	@media (max-width: 719px) {
		.map-wide {
			display: none;
		}

		.map-tall {
			display: block;
		}
	}

	.niche-panel {
		margin-top: 1.75rem;
		scroll-margin-top: 5rem;
	}

	.field-head {
		display: grid;
		grid-template-columns: auto auto 1fr;
		align-items: center;
		column-gap: 0.625rem;
		row-gap: 0.25rem;
		padding-bottom: 0.625rem;
		margin-bottom: 0.875rem;
		border-bottom: 1px solid color-mix(in srgb, var(--group-accent) 30%, var(--rule));

		h2 {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
			margin: 0;
			font-size: var(--font-size-xl);
			font-weight: 700;
			color: var(--text);
		}

		.field-dot {
			width: 0.625rem;
			height: 0.625rem;
		}
	}

	.field-hook {
		grid-column: 1 / -1;
		font-family: var(--font-voice);
		font-size: var(--font-size-base);
		font-style: italic;
		line-height: 1.45;
		color: var(--text-muted);
		text-decoration: none;

		&:hover,
		&:focus-visible {
			color: var(--text);
			text-decoration: underline;
			text-underline-offset: 3px;
		}
	}

	/* Lanes flow side by side on wide screens, so a lane of three doesn't leave a
	   row of empty space; a long lane wraps inside itself. */
	.lanes {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem 2.25rem;
	}

	.lane {
		flex: 0 1 auto;
		max-width: 100%;
	}

	.lane-label {
		margin: 0 0 0.5rem;
		font-size: var(--font-size-xs);
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--group-accent) 55%, var(--text-muted));
	}

	.shared-lane-members {
		margin-top: 0.75rem;
		font-size: var(--font-size-sm);
		color: var(--text-muted);

		ul {
			display: inline;
			list-style: none;
			margin: 0 0 0 0.35rem;
			padding: 0;
		}

		li {
			display: inline;
		}

		li + li::before {
			content: ', ';
		}

		a {
			color: var(--text);
			text-underline-offset: 0.16em;
		}
	}

	/* ---------- Faces ---------- */
	.faces {
		--face-gap: 0.875rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem var(--face-gap);
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.face {
		width: 8.5rem;
		min-width: 0;
		transition:
			opacity 0.2s ease,
			filter 0.2s ease;
	}

	.face-dim {
		opacity: 0.22;
		filter: grayscale(1);
	}

	.face-link {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		color: inherit;
		text-decoration: none;

		&:focus-visible {
			outline: 2px solid var(--type-accent);
			outline-offset: 3px;
			border-radius: 0.625rem;
		}
	}

	.portrait {
		position: relative;
		display: block;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 0.625rem;
		border: 1px solid var(--rule);
		margin-bottom: 0.3rem;
		transition: border-color 0.2s ease;

		picture,
		img {
			display: block;
			width: 100%;
			height: 100%;
		}

		img {
			object-fit: cover;
			transition: transform 0.3s ease;
		}
	}

	.face-lit .portrait {
		border-color: var(--type-accent);
		box-shadow: 0 0 0 1px var(--type-accent);
	}

	.face-name {
		font-size: var(--font-size-base);
		font-weight: 600;
		line-height: 1.25;
		color: var(--text);
	}

	.face-roles {
		font-size: var(--font-size-xs);
		line-height: 1.35;
		color: var(--text-muted);
	}

	.persona {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: var(--font-size-sm);
		line-height: 1.35;
		color: var(--text-faint);

		mark {
			color: var(--text);
			font-weight: 700;
			background: color-mix(in srgb, var(--type-accent) 30%, transparent);
			border-radius: 0.25rem;
			padding: 0 0.15em;
		}
	}

	/* The "why" hook rides over the portrait on hover; touch screens skip it and
	   get the field-level hook under each heading instead. */
	.hook {
		display: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.hook {
			display: block;
			position: absolute;
			inset: auto 0 0 0;
			padding: 2rem 0.625rem 0.625rem;
			font-size: var(--font-size-xs);
			line-height: 1.35;
			color: var(--text);
			background: linear-gradient(
				to top,
				color-mix(in srgb, var(--bg) 94%, transparent) 55%,
				transparent
			);
			opacity: 0;
			transform: translateY(0.375rem);
			transition:
				opacity 0.2s ease,
				transform 0.2s ease;
		}

		.face-link:hover,
		.face-link:focus-visible {
			.hook {
				opacity: 1;
				transform: none;
			}

			.portrait {
				border-color: color-mix(in srgb, var(--group-accent) 70%, var(--rule));
			}

			.portrait img {
				transform: scale(1.04);
			}
		}
	}

	/* ---------- Active pattern status ---------- */
	.pattern-status {
		position: fixed;
		left: 50%;
		bottom: 1rem;
		z-index: 40;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 0.5rem 0.5rem 0.5rem 1rem;
		max-width: calc(100vw - 2rem);
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		white-space: nowrap;
		background: var(--surface);
		border: 1px solid var(--type-accent);
		border-radius: 9999px;
		box-shadow: 0 10px 30px color-mix(in srgb, var(--bg) 80%, transparent);

		strong {
			color: var(--text);
		}

		button {
			padding: 0.3rem 0.75rem;
			font: inherit;
			font-size: var(--font-size-sm);
			font-weight: 600;
			color: var(--text);
			background: color-mix(in srgb, var(--type-accent) 22%, var(--bg));
			border: 1px solid var(--rule);
			border-radius: 9999px;
			cursor: pointer;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.face,
		.portrait img,
		.hook {
			transition: none;
		}
	}

	/* ---------- Sibling types ---------- */
	.sibling-types {
		margin: 2.5rem 0 0;
		padding: 1.5rem;
		background: var(--surface);
		border: 1px solid var(--rule);
		border-radius: 1rem;

		h2 {
			font-size: var(--font-size-lg);
			margin: 0 0 1rem;
			color: var(--text);
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0.5rem;
		}

		li {
			display: flex;
			min-width: 0;

			a,
			&.current {
				min-width: 0;
				display: flex;
				align-items: center;
				gap: 0.625rem;
				padding: 0.625rem 0.75rem;
				border-radius: 0.625rem;
				width: 100%;
				border: 1px solid var(--rule);
				background: var(--bg);
				text-decoration: none;
				color: var(--text-muted);
				font-size: var(--font-size-sm);
				transition: border-color 0.2s ease;
			}

			a:hover {
				border-color: color-mix(in srgb, var(--sibling-accent) 48%, var(--rule));
				color: var(--text);
			}

			&.current {
				background: color-mix(in srgb, var(--sibling-accent) 10%, var(--bg));
				border-color: color-mix(in srgb, var(--sibling-accent) 48%, var(--rule));
				color: var(--text);
				font-weight: 600;
			}
		}

		.sibling-num {
			display: inline-flex;
			width: 1.5rem;
			height: 1.5rem;
			align-items: center;
			justify-content: center;
			background: color-mix(in srgb, var(--sibling-accent) 18%, var(--surface));
			border: 1px solid color-mix(in srgb, var(--sibling-accent) 58%, var(--rule));
			color: color-mix(in srgb, var(--sibling-accent) 72%, var(--text));
			border-radius: 0.25rem;
			font-weight: 700;
			font-size: var(--font-size-xs);
			flex-shrink: 0;
		}

		.sibling-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		/* Wing / growth / stress marker, so phones (no rails) still get it. */
		.sibling-tag {
			margin-left: auto;
			padding-left: 0.5rem;
			flex-shrink: 0;
			font-size: var(--font-size-xs);
			font-weight: 600;
			color: var(--text-faint);
			white-space: nowrap;
		}

		.sibling-all {
			margin: 1rem 0 0;
			font-size: var(--font-size-base);

			a {
				color: var(--highlight);
				font-weight: 600;
				text-decoration: none;

				&:hover,
				&:focus-visible {
					text-decoration: underline;
					text-underline-offset: 3px;
				}
			}
		}
	}

	/* ---------- Explainer (kept for search; below the people) ---------- */
	.type-explainer {
		margin: 2.5rem 0 0;
		/* The site's global article padding would push this off the shared edge. */
		padding: 0;
	}

	/* Everything below the map reads in one centred column. */
	.hub-reading {
		max-width: var(--prose-width);
		margin: 0 auto;
	}

	/* The test card centres itself at 720px; here it fills the reading column. */
	.cta-slot :global(.test-cta) {
		max-width: none;
		margin-left: 0;
		margin-right: 0;
	}

	.explainer-eyebrow {
		margin: 0 0 0.375rem;
		font-size: var(--font-size-xs);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--type-accent) 60%, var(--text-muted));
	}

	.explainer-head {
		margin-bottom: 1.5rem;

		h2 {
			margin: 0;
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--text);
		}
	}

	.explainer-read {
		margin: 0.75rem 0 0;
		font-size: var(--font-size-base);
		line-height: 1.65;
		color: var(--text-muted);
	}

	.explainer-summary {
		margin: 0.75rem 0 0;
		font-size: var(--font-size-base);
		line-height: 1.6;
		color: var(--text-muted);
	}

	.core-pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin: 1.25rem 0 0;

		div {
			padding: 0.875rem 1rem;
			background: var(--surface);
			border: 1px solid var(--rule);
			border-radius: 0.625rem;
		}

		dt {
			font-size: var(--font-size-xs);
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--text-faint);
		}

		dd {
			margin: 0.25rem 0 0;
			font-size: var(--font-size-base);
			line-height: 1.45;
			color: var(--text);
		}
	}

	footer {
		text-align: center;
		margin-top: 3rem;
		padding: 2.5rem 2rem;
		background: linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%);
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--highlight) 20%, transparent);
		color: var(--text);
	}

	.corpus-links {
		margin: 0 auto 1.5rem;
		max-width: 640px;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
		line-height: 1.6;

		a {
			color: var(--highlight);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.email-signup {
		max-width: 500px;
		margin: 0 auto;
	}

	/* ---------- Pinned rails (wide screens only) ---------- */
	/* Solid cards, so nothing behind them shows through. */
	.rail {
		position: fixed;
		top: 7rem;
		z-index: 5;
		width: var(--rail-width);
		max-height: calc(100vh - 9rem);
		overflow-y: auto;
		padding: 1rem 1rem 1.125rem;
		background: var(--surface);
		border: 1px solid color-mix(in srgb, var(--highlight) 16%, var(--surface));
		border-radius: 1rem;
		box-shadow: 0 12px 32px color-mix(in srgb, var(--bg) 75%, transparent);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.25s ease,
			visibility 0.25s ease;
	}

	.rail-on {
		opacity: 1;
		visibility: visible;
	}

	/* The reading column is centred in the viewport, so each rail sits a fixed
	   distance from the middle. */
	.rail-left {
		left: calc(50% - var(--prose-width) / 2 - var(--rail-gap) - var(--rail-width));
	}

	.rail-right {
		right: calc(50% - var(--prose-width) / 2 - var(--rail-gap) - var(--rail-width));
	}

	@media (max-width: 1299px) {
		.rail {
			display: none;
		}
	}

	.rail-title {
		margin: 0 0 0.75rem;
		font-size: var(--font-size-xs);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.rail-toc {
		list-style: none;
		margin: 0;
		padding: 0;
		border-left: 1px solid var(--rule);

		a {
			display: block;
			margin-left: -1px;
			padding: 0.35rem 0 0.35rem 0.875rem;
			font-size: var(--font-size-sm);
			line-height: 1.35;
			color: var(--text-muted);
			text-decoration: none;
			border-left: 2px solid transparent;

			&:hover,
			&:focus-visible {
				color: var(--text);
			}

			&.is-active {
				color: var(--text);
				border-left-color: var(--type-accent);
			}
		}
	}

	.rail-neighbors {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.625rem;

		li {
			display: grid;
			gap: 0.25rem;
		}

		a {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			padding: 0.5rem 0.625rem;
			font-size: var(--font-size-sm);
			color: var(--text-muted);
			text-decoration: none;
			background: var(--bg);
			border: 1px solid var(--rule);
			border-radius: 0.625rem;

			&:hover,
			&:focus-visible {
				color: var(--text);
				border-color: color-mix(in srgb, var(--sibling-accent) 48%, var(--rule));
			}
		}

		.sibling-num {
			display: inline-flex;
			width: 1.5rem;
			height: 1.5rem;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			font-size: var(--font-size-xs);
			font-weight: 700;
			color: color-mix(in srgb, var(--sibling-accent) 72%, var(--text));
			background: color-mix(in srgb, var(--sibling-accent) 18%, var(--surface));
			border: 1px solid color-mix(in srgb, var(--sibling-accent) 58%, var(--rule));
			border-radius: 0.25rem;
		}
	}

	.neighbor-role {
		font-size: var(--font-size-xs);
		font-weight: 600;
		color: var(--text-faint);
	}

	/* ---------- Responsive ---------- */
	@media (max-width: 768px) {
		.page-wrapper {
			--hub-gutter: 1rem;
		}

		.hub-head {
			padding-top: 0.75rem;
		}

		.hub-body {
			padding-bottom: 3rem;
		}

		.sibling-types ul {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		footer {
			padding: 2rem 1.25rem;
		}
	}

	@media (max-width: 560px) {
		/* The breadcrumb trail stays in the JSON-LD; on a phone the faces get the space. */
		.breadcrumbs {
			display: none;
		}

		.title-row {
			gap: 0.75rem;
			margin-top: 0.625rem;
		}

		.type-badge {
			width: 2.75rem;
			height: 2.75rem;
			font-size: 1.5rem;
			border-radius: 0.625rem;
		}

		.lede {
			font-size: var(--font-size-sm);
		}

		.pattern-strip {
			margin-top: 0.875rem;
		}

		.pattern-chip {
			padding: 0.3rem 0.65rem;
			font-size: var(--font-size-sm);
		}

		.field-head h2 {
			font-size: var(--font-size-lg);
		}

		.lane {
			flex-basis: 100%;
		}

		.faces {
			--face-gap: 0.625rem;
			row-gap: 0.875rem;
		}

		.face {
			width: calc((100% - 2 * var(--face-gap)) / 3);
		}

		.face-name {
			font-size: var(--font-size-sm);
		}

		.persona {
			font-size: var(--font-size-xs);
		}

		.core-pair {
			grid-template-columns: 1fr;
		}

		.sibling-types ul {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>

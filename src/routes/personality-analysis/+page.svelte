<!-- src/routes/personality-analysis/+page.svelte -->
<!--
  /personality-analysis index — Streetlamp Symposium V5.
  Phase 5 page #1 of docs/design/2026-05-04-rollout-plan.md.

  Visual ground truth: src/routes/+page.svelte (production homepage, Phase 4).
  Spec: docs/design-system.md §4–§6, /design-preview/v5.

  Server load returns { people, featured, recentlyUpdated, totalPeople, typeCounts,
  celebrityHub, publicFigureCount }. celebrityHub feeds §02 "Enneagram celebrities by
  type" (see ./celebrityHub.ts); publicFigureCount is the rounded "450+" corpus count.
  V5 tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*, --pool-*, --type-N-color)
  live in src/scss/index.scss bridge blocks; this file references them via var(--…).
-->
<script lang="ts">
	import type { PageData } from './$types';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button, SectionKicker } from '$lib/components/atoms';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	// Shared listing atoms — extracted 2026-06-10 (design audit): five listing
	// pages were ~1,000-line near-clones of the same hero/card/grid grammar.
	import IndexHero from '$lib/components/marketing/IndexHero.svelte';
	import CaseCard from '$lib/components/marketing/CaseCard.svelte';
	import CaseGrid from '$lib/components/marketing/CaseGrid.svelte';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';

	let { data }: { data: PageData } = $props();

	// ------------------------------------------------------------------
	// Type metadata — names + the V5 §03 primer "what they see first" reads.
	// Kept in sync with the production homepage primer table.
	// ------------------------------------------------------------------
	type TypeMeta = { num: number; name: string; read: string; tagline: string };
	const typeData: TypeMeta[] = [
		{
			num: 1,
			name: 'Perfectionist',
			read: "what's broken",
			tagline: 'Principled, purposeful, self-controlled'
		},
		{
			num: 2,
			name: 'Helper',
			read: 'what people need',
			tagline: 'Generous, demonstrative, people-pleasing'
		},
		{
			num: 3,
			name: 'Achiever',
			read: 'what wins',
			tagline: 'Adaptable, excelling, driven'
		},
		{
			num: 4,
			name: 'Individualist',
			read: "what's missing",
			tagline: 'Expressive, dramatic, self-absorbed'
		},
		{
			num: 5,
			name: 'Investigator',
			read: 'the system underneath',
			tagline: 'Perceptive, innovative, secretive'
		},
		{
			num: 6,
			name: 'Loyalist',
			read: 'the threat',
			tagline: 'Engaging, responsible, anxious'
		},
		{
			num: 7,
			name: 'Enthusiast',
			read: "what's next",
			tagline: 'Spontaneous, versatile, scattered'
		},
		{
			num: 8,
			name: 'Challenger',
			read: 'the power dynamic',
			tagline: 'Self-confident, decisive, confrontational'
		},
		{
			num: 9,
			name: 'Peacemaker',
			read: 'the harmony',
			tagline: 'Receptive, reassuring, complacent'
		}
	];

	const typeNameByNum: Record<number, string> = Object.fromEntries(
		typeData.map((t) => [t.num, `The ${t.name}`])
	);

	const typeCounts = $derived(data.typeCounts ?? {});

	// "450+" (rounded down from corpus-stats.json); null only if the corpus is tiny.
	const publicFigureCount = $derived(data.publicFigureCount);
	const celebrityHub = $derived(data.celebrityHub ?? []);

	// Head term: "enneagram celebrities". The old title's terms ("famous people",
	// "personality analysis") stay in the title and description.
	const seoTitle = $derived(
		publicFigureCount
			? `Enneagram Celebrities: ${publicFigureCount} Famous People Typed | 9takes`
			: 'Enneagram Celebrities: Famous People Typed | 9takes'
	);
	const seoDescription = $derived(
		`${publicFigureCount ?? 'Hundreds of'} celebrities, leaders, and historical figures sorted by Enneagram type, each with a full personality analysis. See who shares your type.`
	);
	const heroTitle = $derived(
		publicFigureCount
			? `Enneagram celebrities: ${publicFigureCount} famous people, typed.`
			: 'Enneagram celebrities, typed.'
	);

	// ------------------------------------------------------------------
	// SEO + structured data. The ItemList mirrors the "Enneagram celebrities
	// by type" section exactly: nine type groups, each with the names shown.
	// ------------------------------------------------------------------
	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BreadcrumbList',
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
						name: 'Personality Analysis'
					}
				]
			},
			{
				'@type': 'CollectionPage',
				name: 'Enneagram Celebrities',
				description: seoDescription,
				url: 'https://9takes.com/personality-analysis',
				inLanguage: 'en-US',
				about: {
					'@type': 'Thing',
					name: 'Enneagram of Personality',
					sameAs: 'https://en.wikipedia.org/wiki/Enneagram_of_Personality'
				},
				publisher: {
					'@type': 'Organization',
					name: '9takes',
					url: 'https://9takes.com',
					logo: {
						'@type': 'ImageObject',
						url: 'https://9takes.com/brand/9takes-nine-mask-logo-512.png'
					},
					sameAs: ['https://www.instagram.com/9takesdotcom/', 'https://twitter.com/9takesdotcom']
				},
				mainEntity: {
					'@type': 'ItemList',
					name: 'Enneagram celebrities by type',
					numberOfItems: celebrityHub.length,
					itemListOrder: 'https://schema.org/ItemListOrderAscending',
					itemListElement: celebrityHub.map((group, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						item: {
							'@type': 'ItemList',
							name: `Enneagram Type ${group.type} (${typeNameByNum[Number(group.type)]}) celebrities`,
							url: `https://9takes.com/personality-analysis/type/${group.type}`,
							description: `${group.count} profiles, ${group.sharePct} of the 9takes corpus.`,
							numberOfItems: group.people.length,
							itemListOrder: 'https://schema.org/ItemListOrderDescending',
							itemListElement: group.people.map((person, j) => ({
								'@type': 'ListItem',
								position: j + 1,
								name: person.name,
								url: `https://9takes.com${buildPersonalityAnalysisPath(person.slug)}`
							}))
						}
					}))
				}
			}
		]
	});

	// ------------------------------------------------------------------
	// Helpers — recency labels for the case-file cards.
	// ------------------------------------------------------------------

	function getRecencyLabel(lastmod: string | null, date: string | null): string | null {
		const ref = lastmod ?? date;
		if (!ref) return null;
		const days = Math.floor((Date.now() - new Date(ref).getTime()) / 86400000);
		if (days <= 3) return 'NEW';
		if (days <= 7) return 'THIS WEEK';
		if (days <= 30) return 'THIS MONTH';
		return null;
	}

	// Filter people for a given type (data.people is already top-5-per-type).
	function peopleForType(typeNum: number) {
		return data.people.filter((p) => p.enneagram && parseInt(p.enneagram) === typeNum);
	}
</script>

<SEOHead
	title={seoTitle}
	description={seoDescription}
	canonical="https://9takes.com/personality-analysis"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/brand/9takes-nine-mask-social-card.png"
	jsonLd={structuredData}
	author="9takes"
/>

<div class="library-index">
	<!-- =====================================================================
	  §01 OBSERVATION — hero + statue + tagline + subtext (no CTA row here)
	  ===================================================================== -->
	<IndexHero
		title={heroTitle}
		line1="Every analysis starts with the human contradiction — the feud, the reinvention, the decision nobody understood — and finds the emotional logic underneath."
		line2="The Enneagram is the map: core fear, core desire, stress line, growth line, and the moments where those patterns showed up."
		imageSrc="/greek_pantheon.webp"
		imageAlt="Greek pantheon representing the nine Enneagram personality types"
		imageMono="9TAKES · CASE FILES · ENNEAGRAM READS"
	/>

	<!-- =====================================================================
	  §02 ENNEAGRAM CELEBRITIES BY TYPE — all nine types: count, share of the
	  corpus, best-known names (same fame order as the type hubs), hub link.
	  ===================================================================== -->
	{#if celebrityHub.length > 0}
		<section
			class="celebrities"
			id="enneagram-celebrities"
			aria-labelledby="enneagram-celebrities-heading"
		>
			<header class="section-head">
				<SectionKicker class="section-tag" num="02" label="ALL NINE TYPES" />
				<h2 class="display-md" id="enneagram-celebrities-heading">
					Enneagram celebrities by type.
				</h2>
				<p class="section-sub">
					The best-known names in each of the nine types. Every name opens a full analysis of what
					drives them.
				</p>
				<p class="celebrities-total">
					{#if publicFigureCount}<strong>{publicFigureCount} public figures typed.</strong>{/if}
					Each typing is 9takes' editorial read of the public record: interviews, decisions, how they
					act under pressure. None of them took a test.
					<a href="/corpus-stats#enneagram-distribution">See the full type distribution &rarr;</a>
				</p>
			</header>

			<ol class="celebrity-grid">
				{#each celebrityHub as group (group.type)}
					{@const meta = typeData[Number(group.type) - 1]}
					<li class="celebrity-type" style="--type-stripe: var(--type-{group.type}-color);">
						<div class="celebrity-type-head">
							<span class="celebrity-type-num" aria-hidden="true">{group.type}</span>
							<div class="celebrity-type-title">
								<h3>Type {group.type}: The {meta.name}</h3>
								<p class="celebrity-type-stats">
									{group.count} people &middot; {group.sharePct} of the corpus
								</p>
							</div>
						</div>
						<p class="celebrity-type-read">Leads with <em>{meta.read}</em>.</p>
						{#if group.people.length > 0}
							<ul class="celebrity-names" aria-label={`Best-known Type ${group.type}s`}>
								{#each group.people as person (person.slug)}
									<li>
										<a href={buildPersonalityAnalysisPath(person.slug)}>{person.name}</a>
									</li>
								{/each}
							</ul>
						{/if}
						<a class="celebrity-type-link" href={`/personality-analysis/type/${group.type}`}>
							All {group.count} Type {group.type} celebrities <span aria-hidden="true">&rarr;</span>
						</a>
					</li>
				{/each}
			</ol>

			<p class="celebrities-footnote">
				Best-known first, ranked by Wikipedia pageviews over the past year. Shares describe who
				9takes has profiled, not how common each type is in the general population.
			</p>
		</section>
	{/if}

	<!-- =====================================================================
	  §03 FEATURED — two large case-file cards
	  ===================================================================== -->
	{#if data.featured.length > 0}
		<section class="featured">
			<header class="section-head">
				<SectionKicker class="section-tag" num="03" label="FEATURED" />
				<h2 class="display-md">Featured.</h2>
				<p class="section-sub">Most recently updated. Worth your full attention.</p>
			</header>

			<CaseGrid columns={2}>
				{#each data.featured as person, i (person.slug)}
					{@const typeNum = parseInt(person.enneagram ?? '0')}
					{@const typeMeta = typeData[typeNum - 1]}
					{@const displayName = formatPersonalityDisplayName(person.slug)}
					<CaseCard
						href={buildPersonalityAnalysisPath(person.slug)}
						title={displayName}
						eyebrow={`TYPE ${typeNum} · ${typeMeta?.name?.toUpperCase() ?? 'TYPE'}`}
						description={person.persona_title ?? ''}
						imageSrc={person.enneagram && person.slug
							? buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')
							: null}
						imageAlt={displayName}
						imageTreatment="personality"
						stripe={`var(--type-${typeNum}-color)`}
						featured={true}
						recency={getRecencyLabel(person.lastmod, person.date) ?? ''}
						eager={i < 2}
						priority={i < 2}
						stubLabel="[PORTRAIT]"
						ariaLabel={`Read analysis of ${displayName}`}
					/>
				{/each}
			</CaseGrid>
		</section>
	{/if}

	<!-- =====================================================================
	  §04 RECENTLY UPDATED — 6 case-file cards
	  ===================================================================== -->
	{#if data.recentlyUpdated.length > 0}
		<section class="recent">
			<header class="section-head">
				<SectionKicker class="section-tag" num="04" label="RECENTLY UPDATED" />
				<h2 class="display-md">Recently updated.</h2>
				<p class="section-sub">Fresh insights, latest revisions.</p>
			</header>

			<CaseGrid columns={3} compactMobile>
				{#each data.recentlyUpdated as person (person.slug)}
					{@const typeNum = parseInt(person.enneagram ?? '0')}
					{@const displayName = formatPersonalityDisplayName(person.slug)}
					<CaseCard
						href={buildPersonalityAnalysisPath(person.slug)}
						title={displayName}
						eyebrow={`TYPE ${typeNum}`}
						description={person.persona_title ?? ''}
						imageSrc={person.enneagram && person.slug
							? buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')
							: null}
						imageAlt={displayName}
						imageTreatment="personality"
						stripe={`var(--type-${typeNum}-color)`}
						recency={getRecencyLabel(person.lastmod, person.date) ?? ''}
						stubLabel="[PORTRAIT]"
						compactMobile={true}
						ariaLabel={`Read analysis of ${displayName}`}
					/>
				{/each}
			</CaseGrid>
		</section>
	{/if}

	<!-- =====================================================================
		  §05 NEWEST BY TYPE — 9 sub-sections, the six latest reads per type
		  ===================================================================== -->
	<section class="by-type">
		<header class="section-head">
			<SectionKicker class="section-tag" num="05" label="NEWEST BY TYPE" />
			<h2 class="display-md">Newest by type.</h2>
			<p class="section-sub">
				Each type leads with a different emotional read of the same situation. Here are the six
				latest reads for each.
			</p>
		</header>

		{#if !data?.user}
			<div class="type-signup">
				<div class="type-signup-copy">
					<SectionKicker label="CASE FILE DISPATCH" class="type-signup-kicker" />
					<h3>Get the next famous-person read.</h3>
					<p>
						New public-figure breakdowns and pattern notes, sent only when there is a worthwhile
						case file.
					</p>
				</div>
				<div class="type-signup-form">
					<EmailSignup embedded />
				</div>
			</div>
		{/if}

		{#each typeData as t (t.num)}
			{@const typePeople = peopleForType(t.num)}
			{#if typePeople.length > 0}
				{@const totalForType = typeCounts[String(t.num)] ?? 0}
				{@const remaining = Math.max(0, totalForType - typePeople.slice(0, 6).length)}
				<div class="type-block" id="type-{t.num}" style="--type-stripe: var(--type-{t.num}-color);">
					<header class="type-block-head">
						<SectionKicker
							label={`TYPE ${t.num} · THE ${t.name.toUpperCase()}`}
							class="type-block-kicker"
						/>
						<h3 class="display-sm">Type {t.num} &middot; The {t.name}.</h3>
						<p class="type-block-sub">
							Leads with <em>{t.read}</em>. {t.tagline}.
						</p>
					</header>

					<CaseGrid columns={3} compactMobile>
						{#each typePeople.slice(0, 6) as person (person.slug)}
							{@const displayName = formatPersonalityDisplayName(person.slug)}
							<CaseCard
								href={buildPersonalityAnalysisPath(person.slug)}
								title={displayName}
								eyebrow={`TYPE ${t.num}`}
								description={person.persona_title ?? ''}
								imageSrc={person.enneagram && person.slug
									? buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')
									: null}
								imageAlt={displayName}
								imageTreatment="personality"
								stripe={`var(--type-${t.num}-color)`}
								recency={getRecencyLabel(person.lastmod, person.date) ?? ''}
								stubLabel="[PORTRAIT]"
								compactMobile={true}
								ariaLabel={`Read analysis of ${displayName}`}
							/>
						{/each}
					</CaseGrid>

					<div class="type-block-cta">
						<Button size="md" variant="secondary" href={`/personality-analysis/type/${t.num}`}>
							{#if totalForType > 0}
								View all {totalForType} Type {t.num} reads
								{#if remaining > 0}<span class="cta-extra">· {remaining} more →</span>{:else}<span
										class="cta-extra">→</span
									>{/if}
							{:else}
								View all Type {t.num} reads →
							{/if}
						</Button>
					</div>
				</div>
			{/if}
		{/each}
	</section>
</div>

<style lang="scss">
	/* =========================================================
	  /personality-analysis — Streetlamp Symposium index page.
	  Bridge tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*,
	  --pool-rgb, --pool-deep-rgb, --type-N-color) ship globally in
	  src/scss/index.scss. Local-only overrides scoped to .library-index.
	  ========================================================= */
	.library-index {
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

		:global(:root.light) & {
			--pool-alpha-strong: 0.14;
			--pool-alpha-mid: 0.08;
			--pool-alpha-soft: 0.04;
			--statue-blend: normal;
			--grain-opacity: 0.025;
		}
	}

	/* ---------- shared utilities ---------- */
	.library-index :global(.mono) {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.display-md {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(28px, 4vw, 40px);
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--ink-bright);
		margin: 0;
	}

	.display-sm {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(22px, 2.6vw, 28px);
		line-height: 1.18;
		letter-spacing: -0.015em;
		color: var(--ink-bright);
		margin: 0;
	}

	.library-index :global(.section-tag) {
		display: inline-block;
		margin-bottom: 14px;
		color: var(--lamp-glow);
	}

	.library-index :global(p),
	.library-index :global(h1),
	.library-index :global(h2),
	.library-index :global(h3) {
		margin: 0;
	}

	.library-index :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.section-head {
		max-width: 820px;
		margin: 0 auto 40px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.section-sub {
		font-family: var(--font-display);
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 640px;
	}

	/* ---------- subtle paper grain (hero only) ---------- */
	/* §01 hero + grain styles live in marketing/IndexHero.svelte (extracted 2026-06-10). */

	/* =========================================================
	  Section blocks — alternating night-deep / night-mid rhythm
	  ========================================================= */
	.featured,
	.by-type {
		padding: 96px 48px;
		background: var(--night-deep);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	.recent,
	.celebrities {
		padding: 96px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
	}

	/* =========================================================
	  §02 ENNEAGRAM CELEBRITIES BY TYPE — nine type panels
	  (`.library-index :global(p)` zeroes paragraph margins, so spacing here
	  comes from flex/grid gaps or selectors nested under .celebrities.)
	  ========================================================= */
	.celebrities-total {
		max-width: 640px;
		font-family: var(--font-display);
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-mid);

		strong {
			color: var(--ink-bright);
			font-weight: 700;
		}

		a {
			color: var(--lamp-glow);
			font-weight: 600;
			white-space: nowrap;

			&:hover,
			&:focus-visible {
				text-decoration: underline;
				text-underline-offset: 3px;
			}
		}
	}

	.celebrity-grid {
		list-style: none;
		margin: 0 auto;
		padding: 0;
		max-width: 1200px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: 20px;
	}

	.celebrity-type {
		--type-stripe: var(--lamp-glow);
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 22px 22px 18px;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		box-shadow: inset 0 3px 0 var(--type-stripe);

		@media (max-width: 768px) {
			padding: 20px 18px 16px;
		}
	}

	.celebrity-type-head {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.celebrity-type-num {
		flex: none;
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1.5px solid var(--type-stripe);
		border-radius: 50%;
		color: var(--type-stripe);
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 700;
		line-height: 1;
	}

	.celebrity-type-title {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;

		h3 {
			font-family: var(--font-display);
			font-size: 19px;
			font-weight: 700;
			line-height: 1.25;
			letter-spacing: -0.01em;
			color: var(--ink-bright);
		}
	}

	.celebrity-type-stats {
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.celebrity-type-read {
		font-family: var(--font-display);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);

		em {
			color: var(--ink-bright);
			font-style: italic;
			font-weight: 500;
		}
	}

	.celebrity-names {
		list-style: none;
		margin: 0;
		padding: 12px 0 0;
		border-top: 1px solid var(--stone-edge);
		columns: 2;
		column-gap: 16px;

		li {
			break-inside: avoid;
		}

		a {
			display: inline-block;
			padding: 4px 0;
			font-family: var(--font-display);
			font-size: 15px;
			line-height: 1.35;
			color: var(--ink-bright);
			text-decoration: underline;
			text-decoration-color: transparent;
			text-underline-offset: 3px;
			transition:
				color 0.15s ease,
				text-decoration-color 0.15s ease;

			&:hover,
			&:focus-visible {
				color: var(--lamp-glow);
				text-decoration-color: currentColor;
			}
		}
	}

	.celebrity-type-link {
		margin-top: auto;
		align-self: flex-start;
		padding: 6px 0 2px;
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		color: var(--ink-bright);

		span {
			margin-left: 4px;
			color: var(--type-stripe);
		}

		&:hover,
		&:focus-visible {
			text-decoration: underline;
			text-decoration-color: var(--type-stripe);
			text-underline-offset: 3px;
		}
	}

	.celebrities .celebrities-footnote {
		max-width: 720px;
		margin: 28px auto 0;
		text-align: center;
		font-family: var(--font-display);
		font-size: 13px;
		line-height: 1.55;
		color: var(--ink-dim);
	}

	/* Case-file card + grid styles live in marketing/CaseCard.svelte and
	   marketing/CaseGrid.svelte (extracted 2026-06-10). Per-card type color
	   passes through CaseCard's `stripe` prop (--case-stripe). */

	/* =========================================================
	  §04 BY TYPE — per-type sub-blocks
	  ========================================================= */
	.by-type {
		.section-head {
			margin-bottom: 36px;
		}
	}

	.type-signup {
		max-width: 960px;
		margin: 0 auto 56px;
		padding: 24px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
		gap: 24px;
		align-items: center;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
	}

	.type-signup-copy {
		text-align: left;

		h3 {
			margin: 8px 0 8px;
			font-family: var(--font-display);
			font-size: clamp(22px, 2.4vw, 28px);
			line-height: 1.14;
			letter-spacing: -0.015em;
			color: var(--ink-bright);
		}

		p {
			max-width: 520px;
			font-size: 15px;
			line-height: 1.55;
			color: var(--ink-mid);
		}
	}

	.library-index :global(.type-signup-kicker) {
		color: var(--lamp-glow);
	}

	.type-signup-form {
		min-width: 0;
	}

	@media (max-width: 768px) {
		.type-signup {
			grid-template-columns: 1fr;
			margin-bottom: 44px;
			padding: 20px;
		}

		.type-signup-copy {
			text-align: center;

			p {
				margin-inline: auto;
			}
		}
	}

	.type-block {
		--type-stripe: var(--lamp-glow);
		max-width: 1280px;
		margin: 0 auto 72px;
		scroll-margin-top: 72px;

		&:last-child {
			margin-bottom: 0;
		}

		@media (max-width: 768px) {
			margin-bottom: 56px;
		}
	}

	.type-block-head {
		max-width: 720px;
		margin: 0 auto 28px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 18px;
		border-bottom: 1px solid var(--stone-edge);
		position: relative;

		&::after {
			content: '';
			position: absolute;
			left: 50%;
			bottom: -1px;
			width: 80px;
			height: 2px;
			background: var(--type-stripe);
			transform: translateX(-50%);
			border-radius: 9999px;
		}
	}

	.library-index :global(.type-block-kicker) {
		color: var(--type-stripe);
	}

	.type-block-sub {
		font-family: var(--font-display);
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 580px;

		em {
			color: var(--ink-bright);
			font-style: italic;
			font-weight: 500;
		}
	}

	.type-block-cta {
		margin-top: 36px;
		display: flex;
		justify-content: center;

		:global(.btn) {
			border-color: var(--type-stripe);
			color: var(--ink-bright);
			padding-inline: 28px;
			font-size: 15px;
			font-weight: 600;
			letter-spacing: -0.005em;
			box-shadow: 0 0 0 0 transparent;
			transition:
				background 0.18s ease,
				border-color 0.18s ease,
				color 0.18s ease,
				box-shadow 0.18s ease;
		}

		:global(.btn:hover) {
			background: var(--stone-mid);
			border-color: var(--type-stripe);
			color: var(--ink-bright);
			box-shadow: 0 0 0 4px rgba(var(--pool-rgb), 0.12);
		}

		@media (prefers-reduced-motion: no-preference) {
			:global(.btn) {
				transition:
					background 0.18s ease,
					border-color 0.18s ease,
					color 0.18s ease,
					box-shadow 0.18s ease,
					transform 0.18s ease;
			}

			:global(.btn:hover) {
				transform: translateY(-1px);
			}
		}

		.cta-extra {
			margin-left: 8px;
			color: var(--type-stripe);
			font-weight: 600;
		}

		@media (max-width: 540px) {
			:global(.btn) {
				width: 100%;
				justify-content: center;
			}
		}
	}

	/* Card mobile tightening lives in marketing/CaseCard.svelte. */
</style>

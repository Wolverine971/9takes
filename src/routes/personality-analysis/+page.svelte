<!-- src/routes/personality-analysis/+page.svelte -->
<!--
  /personality-analysis index — Streetlamp Symposium V5.
  Phase 5 page #1 of docs/design/2026-05-04-rollout-plan.md.

  Visual ground truth: src/routes/+page.svelte (production homepage, Phase 4).
  Spec: docs/design-system.md §4–§6, /design-preview/v5.

  Server load (untouched): returns { people, featured, recentlyUpdated, totalPeople }.
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

	const totalPeople = $derived(data.totalPeople);
	const typeCounts = $derived(data.typeCounts ?? {});

	// ------------------------------------------------------------------
	// SEO + structured data — preserved verbatim from the legacy file.
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
				name: 'Famous People Personality Analysis',
				description: `Browse ${totalPeople} in-depth Enneagram personality analyses of celebrities, historical figures, and public personalities across music, film, politics, tech, and more.`,
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
					numberOfItems: 9,
					itemListOrder: 'https://schema.org/ItemListOrderAscending',
					itemListElement: Array.from({ length: 9 }, (_, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						name: `Enneagram Type ${i + 1} (${typeNameByNum[i + 1]}) Personalities`,
						url: `https://9takes.com/personality-analysis/type/${i + 1}`,
						description: typeData[i].tagline
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
	title="Famous People Personality Analysis | Enneagram Character Studies | 9takes"
	description={`Explore ${totalPeople} in-depth Enneagram personality analyses of celebrities, historical figures, and influential people. Browse by type or category to decode what drives the world's most fascinating personalities.`}
	canonical="https://9takes.com/personality-analysis"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/personality-analysis-card.webp"
	jsonLd={structuredData}
	author="9takes"
/>

<div class="library-index">
	<!-- =====================================================================
	  §01 OBSERVATION — hero + statue + tagline + subtext (no CTA row here)
	  ===================================================================== -->
	<IndexHero
		title="See public figures through the patterns that drive them."
		line1="We read public figures through the Enneagram — the framework that maps 9 emotional patterns driving behavior."
		line2="Each breakdown goes beyond surface biography. We map their core fear, core desire, stress line, growth line — and the moments where those patterns showed up."
		imageSrc="/greek_pantheon.webp"
		imageMono="9TAKES · CASE FILES · ENNEAGRAM READS"
	/>

	<!-- =====================================================================
	  §02 FEATURED — two large case-file cards
	  ===================================================================== -->
	{#if data.featured.length > 0}
		<section class="featured">
			<header class="section-head">
				<SectionKicker class="section-tag" num="02" label="FEATURED" />
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
						description={`The ${typeMeta?.name ?? ''} — leads with ${typeMeta?.read ?? ''}.`}
						imageSrc={person.enneagram && person.slug
							? buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')
							: null}
						imageAlt={displayName}
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
	  §03 RECENTLY UPDATED — 4 case-file cards
	  ===================================================================== -->
	{#if data.recentlyUpdated.length > 0}
		<section class="recent">
			<header class="section-head">
				<SectionKicker class="section-tag" num="03" label="RECENTLY UPDATED" />
				<h2 class="display-md">Recently updated.</h2>
				<p class="section-sub">Fresh insights, latest revisions.</p>
			</header>

			<CaseGrid columns={3} compactMobile>
				{#each data.recentlyUpdated as person (person.slug)}
					{@const typeNum = parseInt(person.enneagram ?? '0')}
					{@const typeMeta = typeData[typeNum - 1]}
					{@const displayName = formatPersonalityDisplayName(person.slug)}
					<CaseCard
						href={buildPersonalityAnalysisPath(person.slug)}
						title={displayName}
						eyebrow={`TYPE ${typeNum}`}
						description={`The ${typeMeta?.name ?? ''}.`}
						imageSrc={person.enneagram && person.slug
							? buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')
							: null}
						imageAlt={displayName}
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
		  §04 BY TYPE — 9 sub-sections, one per Enneagram type
		  ===================================================================== -->
	<section class="by-type">
		<header class="section-head">
			<SectionKicker class="section-tag" num="04" label="BY TYPE" />
			<h2 class="display-md">By type.</h2>
			<p class="section-sub">
				Each type leads with a different emotional read of the same situation.
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

		{#each typeData as t}
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
								description={`The ${t.name}.`}
								imageSrc={person.enneagram && person.slug
									? buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')
									: null}
								imageAlt={displayName}
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

	.recent {
		padding: 96px 48px;
		background: var(--night-mid);
		border-top: 1px solid var(--stone-edge);

		@media (max-width: 768px) {
			padding: 64px 20px;
		}
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

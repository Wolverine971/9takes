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
						url: 'https://9takes.com/brand/aero.png'
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
	  §01 OBSERVATION — hero + statue + tagline + subtext
	  ===================================================================== -->
	<section class="hero">
		<div class="grain" aria-hidden="true"></div>
		<div class="hero-pool" aria-hidden="true"></div>

		<div class="hero-inner">
			<div class="hero-text">
				<div class="hero-eyebrow">
					<SectionKicker num="01" label="OBSERVATION" />
				</div>

				<h1 class="display-xl">See public figures through the patterns that drive them.</h1>

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
					We read public figures through the Enneagram &mdash; the framework that maps 9 emotional
					patterns driving behavior.
				</p>
				<p class="hero-subhead hero-subhead-line-2">
					Each breakdown goes beyond surface biography. We map their core fear, core desire, stress
					line, growth line &mdash; and the moments where those patterns showed up.
				</p>
			</div>

			<div class="hero-subject" aria-hidden="true">
				<div class="subject-frame">
					<img src="/greek_pantheon.webp" alt="" class="statue" loading="eager" decoding="async" />
					<div class="subject-vignette"></div>
					<div class="subject-mono">
						<span class="mono">9TAKES · CASE FILES · ENNEAGRAM READS</span>
					</div>
				</div>
			</div>
		</div>
	</section>

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

			<div class="featured-grid">
				{#each data.featured as person, i (person.slug)}
					{@const typeNum = parseInt(person.enneagram ?? '0')}
					{@const typeMeta = typeData[typeNum - 1]}
					{@const displayName = formatPersonalityDisplayName(person.slug)}
					{@const label = getRecencyLabel(person.lastmod, person.date)}
					<a
						href={buildPersonalityAnalysisPath(person.slug)}
						class="case-card case-card--featured"
						style="--type-stripe: var(--type-{typeNum}-color);"
						aria-label="Read analysis of {displayName}"
					>
						<div class="case-image-wrap case-image-wrap--featured">
							{#if person.enneagram && person.slug}
								<img
									src={buildPersonalityImagePath(person.enneagram, person.slug)}
									alt={displayName}
									class="case-image"
									loading={i < 2 ? 'eager' : 'lazy'}
									fetchpriority={i < 2 ? 'high' : 'low'}
									width="640"
									height="480"
									decoding="async"
								/>
							{:else}
								<div class="case-image-stub" aria-hidden="true">
									<span class="mono">[PORTRAIT]</span>
								</div>
							{/if}
						</div>
						<div class="case-card-body">
							<span class="mono case-id">
								TYPE {typeNum} · {typeMeta?.name?.toUpperCase() ?? 'TYPE'}
							</span>
							<h3 class="case-name case-name--featured">{displayName}</h3>
							<p class="case-subtitle">
								The {typeMeta?.name ?? ''} &mdash; leads with {typeMeta?.read ?? ''}.
							</p>
							{#if label}
								<span class="mono case-recency">{label}</span>
							{/if}
						</div>
					</a>
				{/each}
			</div>
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

			<div class="case-grid case-grid--four">
				{#each data.recentlyUpdated as person, i (person.slug)}
					{@const typeNum = parseInt(person.enneagram ?? '0')}
					{@const typeMeta = typeData[typeNum - 1]}
					{@const displayName = formatPersonalityDisplayName(person.slug)}
					{@const label = getRecencyLabel(person.lastmod, person.date)}
					<a
						href={buildPersonalityAnalysisPath(person.slug)}
						class="case-card"
						style="--type-stripe: var(--type-{typeNum}-color);"
						aria-label="Read analysis of {displayName}"
					>
						<div class="case-image-wrap">
							{#if person.enneagram && person.slug}
								<img
									src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
									alt={displayName}
									class="case-image"
									loading={i < 4 ? 'eager' : 'lazy'}
									width="320"
									height="240"
									decoding="async"
								/>
							{:else}
								<div class="case-image-stub" aria-hidden="true">
									<span class="mono">[PORTRAIT]</span>
								</div>
							{/if}
						</div>
						<div class="case-card-body">
							<span class="mono case-id">TYPE {typeNum}</span>
							<h3 class="case-name">{displayName}</h3>
							<p class="case-subtitle">
								The {typeMeta?.name ?? ''}.
							</p>
							{#if label}
								<span class="mono case-recency">{label}</span>
							{/if}
						</div>
					</a>
				{/each}
			</div>
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

		{#each typeData as t}
			{@const typePeople = peopleForType(t.num)}
			{#if typePeople.length > 0}
				{@const totalForType = typeCounts[String(t.num)] ?? 0}
				{@const remaining = Math.max(0, totalForType - typePeople.slice(0, 6).length)}
				<div class="type-block" id="type-{t.num}" style="--type-stripe: var(--type-{t.num}-color);">
					<header class="type-block-head">
						<SectionKicker
							num={String(t.num).padStart(2, '0')}
							label={`TYPE ${t.num} · THE ${t.name.toUpperCase()}`}
							class="type-block-kicker"
						/>
						<h3 class="display-sm">Type {t.num} &middot; The {t.name}.</h3>
						<p class="type-block-sub">
							Leads with <em>{t.read}</em>. {t.tagline}.
						</p>
					</header>

					<div class="case-grid case-grid--four">
						{#each typePeople.slice(0, 6) as person, i (person.slug)}
							{@const displayName = formatPersonalityDisplayName(person.slug)}
							{@const label = getRecencyLabel(person.lastmod, person.date)}
							<a
								href={buildPersonalityAnalysisPath(person.slug)}
								class="case-card"
								style="--type-stripe: var(--type-{t.num}-color);"
								aria-label="Read analysis of {displayName}"
							>
								<div class="case-image-wrap">
									{#if person.enneagram && person.slug}
										<img
											src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
											alt={displayName}
											class="case-image"
											loading="lazy"
											width="320"
											height="240"
											decoding="async"
										/>
									{:else}
										<div class="case-image-stub" aria-hidden="true">
											<span class="mono">[PORTRAIT]</span>
										</div>
									{/if}
								</div>
								<div class="case-card-body">
									<span class="mono case-id">TYPE {t.num}</span>
									<h3 class="case-name">{displayName}</h3>
									<p class="case-subtitle">The {t.name}.</p>
									{#if label}
										<span class="mono case-recency">{label}</span>
									{/if}
								</div>
							</a>
						{/each}
					</div>

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

	<!-- =====================================================================
	  §05 EMAIL SIGNUP — quiet V5-styled wrapper around the existing form
	  (wired to /api/signups via Email-Signup component)
	  ===================================================================== -->
	{#if !data?.user}
		<section class="signup">
			<div class="signup-inner">
				<SectionKicker class="section-tag" num="05" label="STAY IN THE LIBRARY" />
				<h2 class="display-md">New reads, in your inbox.</h2>
				<p class="section-sub">
					Fresh personality breakdowns, community questions, and ideas worth stealing &mdash; sent
					when there&rsquo;s something worth reading.
				</p>
				<div class="signup-form">
					<EmailSignup />
				</div>
			</div>
		</section>
	{/if}
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

	.display-xl {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(36px, 6.4vw, 64px);
		line-height: 1.04;
		letter-spacing: -0.04em;
		color: var(--ink-bright);
		margin: 0;
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
	  §01 HERO
	  ========================================================= */
	.hero {
		position: relative;
		padding: 96px 48px 72px;
		background: var(--night-deep);
		overflow: hidden;

		@media (max-width: 768px) {
			padding: 64px 20px 56px;
		}
	}

	.hero-pool {
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

	.hero-inner {
		position: relative;
		z-index: 2;
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 56px;
		align-items: center;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}

	.hero-text {
		max-width: 720px;
	}

	.hero-eyebrow {
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
		max-width: 640px;
		font-weight: 400;

		@media (max-width: 540px) {
			font-size: 16px;
		}
	}

	.hero-subhead-line-1 {
		margin-bottom: 10px;
	}

	.hero-subject {
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

	:global(:root.light) .library-index .statue {
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

	:global(:root.light) .library-index .subject-vignette {
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

	/* =========================================================
	  Section blocks — alternating night-deep / night-mid rhythm
	  ========================================================= */
	.featured,
	.by-type,
	.signup {
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

	/* =========================================================
	  Case-file card grid (shared between §02, §03, §04)
	  ========================================================= */
	.case-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		gap: 22px;
	}

	.case-grid--four {
		grid-template-columns: repeat(3, 1fr);

		@media (max-width: 968px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 540px) {
			grid-template-columns: 1fr;
		}
	}

	.case-card {
		--type-stripe: var(--lamp-glow);
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;

		&:hover {
			background: var(--stone-mid);
			border-color: var(--type-stripe);
			transform: translateY(-2px);
		}
	}

	.case-image-wrap {
		position: relative;
		border-bottom: 1px solid var(--stone-edge);
		border-top: 3px solid var(--type-stripe);
	}

	.case-image {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: center 25%;
		filter: contrast(1.05) brightness(0.96) saturate(0.92);
	}

	:global(:root.light) .library-index .case-image {
		filter: contrast(1.02) brightness(1) saturate(0.96);
	}

	.case-image-stub {
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

	.case-card-body {
		padding: 18px 20px 22px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.case-id {
		color: var(--type-stripe);
		font-size: 10.5px;
	}

	.case-name {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 22px;
		line-height: 1.18;
		color: var(--ink-bright);
		letter-spacing: -0.02em;
	}

	.case-subtitle {
		font-family: var(--font-display);
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	.case-recency {
		color: var(--lamp-glow);
		font-size: 10.5px;
		margin-top: 4px;
	}

	/* =========================================================
	  §02 FEATURED — bigger cards, side-by-side
	  ========================================================= */
	.featured-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 28px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 22px;
		}
	}

	.case-card--featured {
		.case-image-wrap--featured .case-image {
			aspect-ratio: 16 / 11;

			@media (max-width: 540px) {
				aspect-ratio: 4 / 3;
			}
		}
	}

	.case-name--featured {
		font-size: clamp(26px, 2.6vw, 32px);
		line-height: 1.12;
	}

	/* =========================================================
	  §04 BY TYPE — per-type sub-blocks
	  ========================================================= */
	.by-type {
		.section-head {
			margin-bottom: 56px;
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
			border-radius: 1px;
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
				box-shadow 0.18s ease,
				transform 0.18s ease;
		}

		:global(.btn:hover) {
			background: var(--stone-mid);
			border-color: var(--type-stripe);
			color: var(--ink-bright);
			box-shadow: 0 0 0 4px rgba(var(--pool-rgb), 0.12);
			transform: translateY(-1px);
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

	/* =========================================================
	  §05 SIGNUP — quiet wrapper around <EmailSignup>
	  ========================================================= */
	.signup-inner {
		max-width: 720px;
		margin: 0 auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.signup-form {
		width: 100%;
		max-width: 560px;
		margin-top: 16px;
		padding: 24px;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;

		@media (max-width: 540px) {
			padding: 18px;
		}
	}

	/* =========================================================
	  Mobile tightening
	  ========================================================= */
	@media (max-width: 540px) {
		.case-card-body {
			padding: 14px 16px 18px;
		}

		.case-name {
			font-size: 19px;
		}
	}
</style>

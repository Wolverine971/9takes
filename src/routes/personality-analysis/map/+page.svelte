<!-- src/routes/personality-analysis/map/+page.svelte -->
<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button, SectionKicker } from '$lib/components/atoms';
	import peopleWall from '$lib/data/people-wall.json';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath
	} from '$lib/utils/personalityAnalysis';

	type WallPerson = { slug: string; name: string; personaTitle: string };
	type WallRow = {
		type: number;
		name: string;
		read: string;
		people: WallPerson[];
	};

	const typeRows = peopleWall.types as WallRow[];
</script>

<SEOHead
	title="The 9takes People Index"
	description="Take a peek inside the inner worlds of 27 public figures, organized as three people for each Enneagram type."
	canonical="https://9takes.com/personality-analysis/map"
	ogImage="https://9takes.com/email/reactivation/people-wall-v1.jpg"
	ogImageWidth={1400}
	ogImageHeight={1980}
	twitterImageAlt="The 9takes people index: 27 public figures arranged by Enneagram type"
	noindex
	nofollow={false}
/>

<div class="people-wall-page">
	<section class="hero" aria-labelledby="people-wall-title">
		<div class="hero-inner">
			<a class="back-link" href="/personality-analysis">← Personality analysis library</a>
			<SectionKicker num="01" label="PEOPLE INDEX" size="md" />
			<h1 id="people-wall-title">{peopleWall.headline}</h1>
			<p>{peopleWall.description}</p>
			<div class="hero-actions">
				<Button href="#people-map" size="lg">{peopleWall.cta}</Button>
				<span class="hero-note">Three people for each of the nine Enneagram types.</span>
			</div>
		</div>
	</section>

	<main class="map-shell" id="people-map">
		<header class="map-heading">
			<SectionKicker num="02" label="9 PATTERNS · 27 PEOPLE" />
			<h2>One pattern. Three very different lives.</h2>
			<p>
				The same emotional pattern can produce radically different people. Select anyone to see the
				evidence, contradictions, and moments behind the read.
			</p>
		</header>

		<div class="type-map">
			{#each typeRows as row, rowIndex (row.type)}
				<section
					class="type-row"
					style={`--type-color: var(--type-${row.type}-color);`}
					aria-labelledby={`type-${row.type}-heading`}
				>
					<header class="type-heading">
						<span class="type-kicker">TYPE {row.type} · THE {row.name.toUpperCase()}</span>
						<h3 id={`type-${row.type}-heading`}>Sees {row.read} first.</h3>
					</header>

					<div class="people-grid">
						{#each row.people as person, personIndex (person.slug)}
							<a
								class="person-card"
								href={buildPersonalityAnalysisPath(person.slug)}
								aria-label={`Read the Type ${row.type} analysis of ${person.name}: ${person.personaTitle}`}
							>
								<div class="person-media personality-portrait-well">
									<img
										src={buildPersonalityImagePath(row.type, person.slug, 'thumbnail')}
										alt={person.name}
										class="personality-portrait-image"
										width="320"
										height="320"
										loading={rowIndex === 0 ? 'eager' : 'lazy'}
										fetchpriority={rowIndex === 0 && personIndex === 0 ? 'high' : undefined}
										decoding="async"
									/>
								</div>
								<div class="person-copy">
									<span class="person-name">{person.name}</span>
									<span class="person-title">{person.personaTitle}</span>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	</main>

	<section class="closing" aria-labelledby="closing-title">
		<div class="closing-inner">
			<SectionKicker num="03" label="KEEP EXPLORING" />
			<h2 id="closing-title">This is only the condensed view.</h2>
			<p>Browse more than 400 in-depth reads across culture, business, politics, and history.</p>
			<Button href="/personality-analysis" size="lg">Browse all 400+ people</Button>
		</div>
	</section>
</div>

<style lang="scss">
	.people-wall-page {
		min-height: 100vh;
		background: var(--night-deep);
		color: var(--ink-bright);
	}

	.hero {
		border-bottom: 1px solid var(--stone-edge);
		background:
			radial-gradient(
				circle at 18% 0%,
				color-mix(in srgb, var(--lamp-glow) 14%, transparent),
				transparent 52%
			),
			var(--night-mid);
	}

	.hero-inner,
	.map-shell,
	.closing-inner {
		width: min(1120px, calc(100% - 48px));
		margin: 0 auto;
	}

	.hero-inner {
		padding: 48px 0 56px;
	}

	.back-link {
		display: block;
		width: fit-content;
		margin-bottom: 28px;
		color: var(--ink-mid);
		font-size: 14px;
		text-decoration: none;
	}

	.back-link:hover,
	.back-link:focus-visible {
		color: var(--lamp-glow);
	}

	.back-link:focus-visible,
	.person-card:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 3px;
	}

	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1 {
		max-width: 900px;
		margin-top: 18px;
		font-size: clamp(42px, 6vw, 72px);
		font-weight: 800;
		line-height: 1.02;
		letter-spacing: -0.04em;
	}

	.hero-inner > p {
		max-width: 760px;
		margin-top: 22px;
		color: var(--ink-mid);
		font-size: 18px;
		line-height: 1.6;
	}

	.hero-actions {
		display: flex;
		align-items: center;
		gap: 18px;
		margin-top: 30px;
	}

	.hero-note {
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 12px;
		line-height: 1.5;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.map-shell {
		padding: 64px 0 72px;
	}

	.map-heading {
		max-width: 740px;
		margin-bottom: 44px;
	}

	.map-heading h2,
	.closing h2 {
		margin-top: 14px;
		font-size: clamp(30px, 4vw, 44px);
		line-height: 1.1;
		letter-spacing: -0.03em;
	}

	.map-heading p,
	.closing p {
		margin-top: 16px;
		color: var(--ink-mid);
		font-size: 17px;
		line-height: 1.6;
	}

	.type-map {
		display: grid;
		gap: 42px;
	}

	.type-row {
		padding-top: 22px;
		border-top: 1px solid color-mix(in srgb, var(--type-color) 58%, var(--stone-edge));
	}

	.type-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 14px;
	}

	.type-kicker,
	.person-title {
		font-family: var(--font-mono);
	}

	.type-kicker {
		color: var(--type-color);
		font-size: 12px;
		font-weight: 700;
	}

	.type-heading h3 {
		color: var(--ink-mid);
		font-size: 14px;
		font-weight: 500;
		text-align: right;
	}

	.people-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}

	.person-card {
		position: relative;
		display: grid;
		grid-template-columns: 42% minmax(0, 1fr);
		min-width: 0;
		min-height: 148px;
		overflow: hidden;
		border: 1px solid var(--stone-edge);
		border-top: 3px solid var(--type-color);
		border-radius: 1rem;
		background: var(--stone-warm);
		color: var(--ink-bright);
		text-decoration: none;
	}

	.person-media {
		position: relative;
		min-width: 0;
		border-right: 1px solid var(--stone-edge);
		overflow: hidden;
	}

	.person-media img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 22%;
	}

	.person-copy {
		display: flex;
		min-width: 0;
		flex-direction: column;
		justify-content: center;
		gap: 7px;
		padding: 18px;
	}

	.person-name {
		color: var(--ink-bright);
		font-size: 18px;
		font-weight: 700;
		line-height: 1.18;
		letter-spacing: -0.02em;
		overflow-wrap: anywhere;
	}

	.person-title {
		color: var(--ink-mid);
		font-size: 12.5px;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.person-card:hover {
		border-color: var(--type-color);
		background: var(--stone-mid);
	}

	.closing {
		border-top: 1px solid var(--stone-edge);
		background: var(--night-mid);
	}

	.closing-inner {
		padding: 56px 0 64px;
		text-align: center;
	}

	.closing p {
		max-width: 660px;
		margin-right: auto;
		margin-left: auto;
	}

	.closing :global(.btn) {
		margin-top: 26px;
	}

	@media (hover: hover) and (prefers-reduced-motion: no-preference) {
		.person-card {
			transition:
				opacity 180ms ease,
				transform 180ms ease,
				border-color 180ms ease,
				background 180ms ease;
		}

		.people-grid:hover .person-card:not(:hover),
		.people-grid:focus-within .person-card:not(:focus-visible) {
			opacity: 0.48;
		}

		.person-card:hover,
		.person-card:focus-visible {
			transform: translateY(-2px);
		}
	}

	@media (max-width: 700px) {
		.hero-inner,
		.map-shell,
		.closing-inner {
			width: min(100% - 32px, 1120px);
		}

		.hero-inner {
			padding: 34px 0 42px;
		}

		.back-link {
			margin-bottom: 22px;
		}

		h1 {
			font-size: clamp(38px, 12vw, 54px);
		}

		.hero-actions {
			align-items: flex-start;
			flex-direction: column;
		}

		.map-shell {
			padding: 48px 0 56px;
		}

		.map-heading {
			margin-bottom: 36px;
		}

		.type-map {
			gap: 34px;
		}

		.type-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 6px;
		}

		.type-heading h3 {
			font-size: 13px;
			text-align: left;
		}

		.people-grid {
			gap: 8px;
		}

		.person-card {
			display: flex;
			min-height: 0;
			flex-direction: column;
		}

		.person-media {
			width: 100%;
			aspect-ratio: 3 / 4;
			border-right: 0;
			border-bottom: 1px solid var(--stone-edge);
		}

		.person-copy {
			min-height: 96px;
			gap: 4px;
			padding: 9px 8px 10px;
		}

		.person-name {
			font-size: 12.5px;
			line-height: 1.15;
			letter-spacing: 0;
		}

		.person-title {
			font-size: 8.5px;
			line-height: 1.28;
		}

		.closing-inner {
			padding: 48px 0 56px;
		}
	}
</style>

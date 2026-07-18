<!-- src/routes/enneagram-test/+page.svelte -->
<!--
  /enneagram-test — the test, reframed. Streetlamp Symposium V5.
  9takes never assigns a type: you answer real questions, read the nine
  takes, and notice which one you didn't have to translate.
  Tokens (lamp/night/stone/ink/data custom properties) live globally in
  src/scss/index.scss.
-->
<script lang="ts">
	import { Button, SectionKicker } from '$lib/components/atoms';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { TYPE_COLOR_MAP, formatTypeLabel } from '$lib/constants/enneagramColors';
	import { buildBreadcrumbSchemaForGraph } from '$lib/utils/schema';

	const siteUrl = 'https://9takes.com';
	const pageUrl = `${siteUrl}/enneagram-test`;
	const pageTitle = 'The Enneagram Test, Reframed | 9takes';
	const pageDescription =
		'9takes will never type you with a checkbox quiz. Answer real questions anonymously, read the nine takes, and notice which pattern sounds like the inside of your head.';

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebPage',
				'@id': `${pageUrl}#webpage`,
				url: pageUrl,
				name: pageTitle,
				description: pageDescription,
				inLanguage: 'en-US',
				isPartOf: {
					'@type': 'WebSite',
					name: '9takes',
					url: siteUrl
				},
				breadcrumb: { '@id': `${pageUrl}#breadcrumb` }
			},
			{
				'@id': `${pageUrl}#breadcrumb`,
				...buildBreadcrumbSchemaForGraph([
					{ name: 'Home', url: siteUrl },
					{ name: 'Enneagram Test', url: pageUrl }
				])
			}
		]
	};

	type Step = {
		title: string;
		detail: string;
	};

	const steps: Step[] = [
		{
			title: 'Answer honestly',
			detail:
				'You give your take before you see anyone else’s. That is the house rule: no anchoring, no performing for the room. What you write is what you actually think.'
		},
		{
			title: 'Read the nine takes',
			detail:
				'The same question comes back through nine patterns: nine reads on what matters, what is at stake, and what to do next. All of them are honest. None of them is a malfunction.'
		},
		{
			title: 'Notice the one you didn’t have to translate',
			detail:
				'Eight of the reads will sound like other people. One will sound like the inside of your head. Nobody assigns you that result. You recognize it.'
		}
	];

	const typeHooks: Record<number, string> = {
		1: 'Often leads with how it should be done, and grades its own work hardest.',
		2: 'Often leads with what you need, and files its own needs under later.',
		3: 'Often leads with what winning looks like, and adapts to whatever the room rewards.',
		4: 'Often leads with what is missing, and trusts the feelings that run deepest.',
		5: 'Often leads with what it still needs to know, and spends energy like it is scarce.',
		6: 'Often leads with what could go wrong, and keeps testing whether the ground holds.',
		7: 'Often leads with what is next, and keeps every exit open.',
		8: 'Often leads with who is steering, and meets pressure with more force.',
		9: 'Often leads with what keeps the peace, and lets its own agenda go quiet.'
	};

	const nineTypes = Array.from({ length: 9 }, (_, index) => {
		const type = index + 1;
		return {
			type,
			color: TYPE_COLOR_MAP[type],
			label: formatTypeLabel(type),
			hook: typeHooks[type],
			href: `/enneagram-corner/enneagram-type-${type}`
		};
	});
</script>

<SEOHead title={pageTitle} description={pageDescription} canonical={pageUrl} {jsonLd} />

<div class="ennea-test">
	<section class="hero" aria-labelledby="test-hero-title">
		<div class="hero-atmosphere" aria-hidden="true"></div>
		<div class="shell hero-inner">
			<SectionKicker num="01" label="THE TEST YOU WERE PROMISED" />
			<h1 id="test-hero-title">There&rsquo;s no <span>checkbox quiz</span> here.</h1>
			<p class="hero-lede">
				A quiz can only score the person you decided to be for five minutes. Your pattern shows up
				in how you answer real questions: what you defend, what you prove, what you brace for. So we
				skip the scoring and let you catch the pattern yourself.
			</p>
			<p class="hero-sub">
				9takes finds your type the honest way: you answer, then you see which of the nine reads
				sounds like the inside of your head.
			</p>

			<div class="hero-action">
				<Button href="/questions" size="lg">Answer a real question</Button>
				<Button href="/enneagram-corner" size="lg" variant="secondary">
					Learn the nine patterns
				</Button>
			</div>

			<ul class="proof-line" aria-label="How the 9takes test is different">
				<li>No scoring</li>
				<li>No assigned label</li>
				<li>Anonymous answers</li>
			</ul>
		</div>
	</section>

	<section class="steps" aria-labelledby="steps-title">
		<div class="shell">
			<header class="section-heading">
				<SectionKicker num="02" label="ANSWER · READ · RECOGNIZE" />
				<h2 id="steps-title">Three steps. No scoring.</h2>
			</header>

			<ol class="step-grid">
				{#each steps as step, index (step.title)}
					<li class="step-card">
						<span class="step-index" aria-hidden="true">0{index + 1}</span>
						<h3>{step.title}</h3>
						<p>{step.detail}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="patterns" aria-labelledby="patterns-title">
		<div class="shell">
			<header class="section-heading patterns-heading">
				<SectionKicker num="03" label="THE NINE PATTERNS" tone="data" />
				<h2 id="patterns-title">Nine reads. One will sound familiar.</h2>
				<p>
					These are not verdicts. They are reading lenses: one line on what each pattern tends to
					lead with, so you can notice which read you never had to translate. Follow any card to go
					deeper.
				</p>
			</header>

			<div class="type-grid">
				{#each nineTypes as entry (entry.type)}
					<a class="type-card" href={entry.href} style:--type-color={entry.color}>
						<span class="type-card-top">
							<span class="type-index">0{entry.type}</span>
							<span class="type-read">Read the pattern</span>
						</span>
						<span class="type-label">{entry.label}</span>
						<span class="type-hook">{entry.hook}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="closing" aria-labelledby="closing-title">
		<div class="closing-pool" aria-hidden="true"></div>
		<div class="shell closing-inner">
			<SectionKicker num="04" label="THE ONLY RESULT THAT STICKS" />
			<h2 id="closing-title">Your type is the one you recognize, not the one a quiz assigns.</h2>
			<p>Personality is a door you open from the inside. The questions are waiting.</p>
			<Button href="/questions" size="lg">Go answer a question</Button>
		</div>
	</section>
</div>

<style lang="scss">
	.ennea-test {
		--cta-text: var(--night-deep);
		position: relative;
		isolation: isolate;
		width: 100%;
		max-width: none;
		margin: 0;
		padding: 0;
		overflow: clip;
		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
	}

	:global(html.light) .ennea-test {
		--cta-text: #faf8f4;
	}

	.ennea-test,
	.ennea-test * {
		box-sizing: border-box;
	}

	.shell {
		width: min(100% - 3rem, 86rem);
		margin-inline: auto;
	}

	/* ---------------------------------------------------------------- */
	/* Hero                                                             */
	/* ---------------------------------------------------------------- */
	.hero {
		position: relative;
		padding: clamp(4.5rem, 8vw, 8rem) 0 clamp(4rem, 7vw, 7rem);
	}

	.hero-atmosphere {
		position: absolute;
		z-index: -1;
		inset: 0;
		background:
			radial-gradient(
				circle at 72% 18%,
				color-mix(in srgb, var(--lamp-glow) 13%, transparent),
				transparent 34%
			),
			radial-gradient(
				circle at 12% 62%,
				color-mix(in srgb, var(--data-teal) 6%, transparent),
				transparent 26%
			);
		pointer-events: none;
	}

	.hero-inner {
		max-width: 54rem;
	}

	.hero h1 {
		max-width: 16ch;
		margin: 1.5rem 0 1.75rem;
		color: var(--ink-bright);
		font-size: clamp(2.9rem, 5.6vw, 5.4rem);
		font-weight: 780;
		letter-spacing: -0.05em;
		line-height: 0.98;
		text-wrap: balance;
	}

	.hero h1 span {
		color: color-mix(in srgb, var(--ink-bright) 70%, var(--lamp-glow));
	}

	.hero-lede {
		max-width: 40rem;
		margin: 0;
		color: var(--ink-mid);
		font-size: clamp(1.05rem, 1.5vw, 1.25rem);
		line-height: 1.65;
	}

	.hero-sub {
		max-width: 40rem;
		margin: 1.1rem 0 0;
		color: var(--ink-bright);
		font-size: clamp(1rem, 1.4vw, 1.15rem);
		font-weight: 600;
		line-height: 1.6;
	}

	.hero-action {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin-top: 2.25rem;
	}

	.proof-line {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem 1.3rem;
		margin: 2.5rem 0 0;
		padding: 1.2rem 0 0;
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 64%, transparent);
		list-style: none;
	}

	.proof-line li {
		position: relative;
		padding-left: 0.8rem;
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.67rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.proof-line li::before {
		position: absolute;
		left: 0;
		top: 0.45em;
		width: 0.25rem;
		height: 0.25rem;
		border-radius: 9999px;
		background: var(--lamp-glow);
		content: '';
	}

	/* ---------------------------------------------------------------- */
	/* Shared section heading                                           */
	/* ---------------------------------------------------------------- */
	.section-heading h2 {
		margin: 1.25rem 0 1.1rem;
		color: var(--ink-bright);
		font-size: clamp(2.1rem, 4.2vw, 3.8rem);
		font-weight: 760;
		letter-spacing: -0.045em;
		line-height: 1.02;
		text-wrap: balance;
	}

	.section-heading > p {
		max-width: 45rem;
		margin: 0;
		color: var(--ink-mid);
		font-size: 1.05rem;
		line-height: 1.7;
	}

	/* ---------------------------------------------------------------- */
	/* How it works                                                     */
	/* ---------------------------------------------------------------- */
	.steps {
		padding: clamp(4.5rem, 8vw, 7.5rem) 0;
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 58%, transparent);
	}

	.steps .section-heading {
		margin-bottom: clamp(2.25rem, 5vw, 3.5rem);
	}

	.step-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.step-card {
		min-width: 0;
		padding: clamp(1.4rem, 3vw, 2rem);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.step-index {
		display: inline-block;
		color: var(--lamp-glow);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
	}

	.step-card h3 {
		margin: 1.4rem 0 0;
		color: var(--ink-bright);
		font-size: clamp(1.25rem, 2vw, 1.55rem);
		font-weight: 720;
		letter-spacing: -0.03em;
		line-height: 1.15;
		text-wrap: balance;
	}

	.step-card p {
		margin: 0.85rem 0 0;
		color: var(--ink-mid);
		font-size: 0.92rem;
		line-height: 1.62;
	}

	/* ---------------------------------------------------------------- */
	/* Nine patterns grid                                               */
	/* ---------------------------------------------------------------- */
	.patterns {
		padding: clamp(4.5rem, 8vw, 7.5rem) 0;
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 58%, transparent);
	}

	.patterns-heading {
		max-width: 56rem;
		margin-bottom: clamp(2.25rem, 5vw, 3.5rem);
	}

	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.85rem;
	}

	.type-card {
		--type-color: var(--lamp-glow);
		position: relative;
		display: grid;
		gap: 0.55rem;
		align-content: start;
		overflow: hidden;
		min-width: 0;
		padding: 1.1rem 1.1rem 1.2rem 1.3rem;
		border: 1px solid color-mix(in srgb, var(--type-color) 34%, var(--stone-edge));
		border-radius: 0.875rem;
		background: color-mix(in srgb, var(--type-color) 7%, var(--stone-warm));
		color: inherit;
		text-decoration: none;
	}

	.type-card::before {
		position: absolute;
		inset: 0 auto 0 0;
		width: 3px;
		background: var(--type-color);
		content: '';
	}

	.type-card:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 3px;
	}

	.type-card-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.type-index {
		color: var(--type-color);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
	}

	.type-read {
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.58rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.type-label {
		color: var(--type-color);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.type-hook {
		color: var(--ink-bright);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	/* ---------------------------------------------------------------- */
	/* Closing CTA                                                      */
	/* ---------------------------------------------------------------- */
	.closing {
		position: relative;
		padding: clamp(5rem, 10vw, 9rem) 0 clamp(4rem, 8vw, 6.5rem);
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 58%, transparent);
	}

	.closing-pool {
		position: absolute;
		top: 2rem;
		left: 50%;
		width: min(78vw, 56rem);
		height: 26rem;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse,
			color-mix(in srgb, var(--lamp-glow) 13%, transparent),
			transparent 66%
		);
		pointer-events: none;
	}

	.closing-inner {
		position: relative;
		max-width: 62rem;
		text-align: center;
	}

	.closing h2 {
		max-width: 24ch;
		margin: 1.35rem auto 1.2rem;
		color: var(--ink-bright);
		font-size: clamp(2.35rem, 5.4vw, 4.6rem);
		font-weight: 780;
		letter-spacing: -0.05em;
		line-height: 1.02;
		text-wrap: balance;
	}

	.closing p {
		margin: 0 0 2rem;
		color: var(--ink-mid);
		font-size: 1.1rem;
	}

	/* ---------------------------------------------------------------- */
	/* Motion + responsive                                              */
	/* ---------------------------------------------------------------- */
	@media (prefers-reduced-motion: no-preference) {
		.type-card {
			transition:
				border-color 180ms ease,
				background-color 180ms ease,
				transform 180ms ease;
		}

		.type-card:hover {
			border-color: color-mix(in srgb, var(--type-color) 62%, var(--stone-edge));
			transform: translateY(-2px);
		}
	}

	@media (max-width: 61rem) {
		.step-grid,
		.type-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 46rem) {
		.shell {
			width: min(100% - 2rem, 86rem);
		}

		.hero {
			padding-top: 4.25rem;
		}

		.hero h1 {
			font-size: clamp(2.5rem, 12vw, 3.6rem);
		}

		.hero-action {
			align-items: stretch;
			flex-direction: column;
		}

		:global(.ennea-test .hero-action .btn) {
			width: 100%;
		}

		.step-grid,
		.type-grid {
			grid-template-columns: 1fr;
		}

		.step-card {
			padding: 1.25rem;
		}
	}

	@media (max-width: 25rem) {
		.proof-line {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>

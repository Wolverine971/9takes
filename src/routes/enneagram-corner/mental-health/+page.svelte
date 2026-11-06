<!-- src/routes/enneagram-corner/mental-health/+page.svelte -->
<!--
  Mental health section — the shared Enneagram Corner section layout
  (EnneagramSectionPage) plus three blocks only this section has: the crisis
  line, why type matters, and how each type breaks and recovers.
  Lanes come from the `subtopics` frontmatter (enneagramCornerTaxonomy.js).
-->
<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/atoms';
	import EnneagramSectionPage from '$lib/components/blog/EnneagramSectionPage.svelte';
	import { CORNER_SECTION_COPY } from '$lib/data/enneagramCornerSectionCopy';

	let { data }: { data: PageData } = $props();

	const copy = CORNER_SECTION_COPY['mental-health'];

	const benefitCards = [
		{
			title: 'Different types break differently',
			body: 'Type 1 burns out as moral failure. Type 4 falls into identity collapse. Type 6 spirals into anxiety. Same diagnosis, different lived experience.'
		},
		{
			title: 'Symptoms get hidden by personality',
			body: "Type 7 covers depression with plans. Type 8 with control. Type 9 by going quiet. If you don't know the type, you miss it, including in yourself."
		},
		{
			title: 'What helps is type-specific',
			body: "Type 5s need a framework before they'll engage. Type 2s need permission to receive care. Type 8s need to be the agent of their own recovery. Same therapy, different doors in."
		},
		{
			title: 'You can see it coming',
			body: 'Each type has a predictable path into stress and a predictable path out. Knowing yours means catching the slide weeks before it hits the wall.'
		}
	];

	const TYPE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

	const typeData = [
		{
			vulnerabilities: [
				'The inner critic that mutates into clinical anxiety',
				'Compulsions disguised as "high standards"',
				'Burnout that reads to them as moral failure'
			],
			strengths: [
				'Will follow a treatment plan to the letter',
				'Self-monitoring is already a daily habit',
				'Treats recovery like the work it deserves to be'
			]
		},
		{
			vulnerabilities: [
				'Codependency wearing a halo',
				'Boundaries that collapse before resentment surfaces',
				'Caregiver burnout that hits all at once'
			],
			strengths: [
				'A real support network, already built',
				'Emotional fluency most types are still learning',
				'Helping others is genuinely metabolizing for them'
			]
		},
		{
			vulnerabilities: [
				'Workaholism that the culture keeps applauding',
				'Depression that hits when the achievements stop landing',
				'The body sending the bill the mind refused to read'
			],
			strengths: [
				'Will set and hit recovery goals like any other goal',
				'Adapts faster than most when something stops working',
				'Already built for sustained, structured effort'
			]
		},
		{
			vulnerabilities: [
				'Major depressive episodes triggered by identity rupture',
				'Emotion intensity that spills into dysregulation',
				'A shifting sense of self that can feel terrifying inside'
			],
			strengths: [
				'Self-awareness that most therapists envy',
				'Creative expression as a real route through pain',
				'Refuses to perform recovery. Only the real thing counts'
			]
		},
		{
			vulnerabilities: [
				'Social anxiety mistaken for "just an introvert"',
				'Avoidance that quietly shrinks the life',
				'Dissociation as the default exit door'
			],
			strengths: [
				'Will research their condition cold',
				'Self-sufficient in a way that survives bad therapists',
				'Understanding the mechanism is half their healing'
			]
		},
		{
			vulnerabilities: [
				'Generalized anxiety humming under everything',
				'Catastrophizing that feels like prudence',
				'Hypervigilance the body never gets to put down'
			],
			strengths: [
				'Loyal to the support system once it earns trust',
				'Will plan treatment thoroughly and stick to it',
				'Does best with a community, not in isolation'
			]
		},
		{
			vulnerabilities: [
				'ADHD-like overload from constant tab-switching',
				'Addiction risk hiding inside "having fun"',
				'Depression masked by motion until it stops them cold'
			],
			strengths: [
				'Genuine optimism, the kind that survives setbacks',
				'Will try multiple modalities until one clicks',
				'Reframes growth as adventure, which keeps them in it'
			]
		},
		{
			vulnerabilities: [
				'Rage as the only emotion that feels safe to feel',
				'Vulnerability avoided until it bursts the seam',
				'Stress that lands in the body: heart, gut, blood pressure'
			],
			strengths: [
				'Unstoppable once they decide to do the work',
				'Leads their own recovery instead of outsourcing it',
				'Will defend the healing space from anyone who threatens it'
			]
		},
		{
			vulnerabilities: [
				'Clinical depression hiding behind "I\'m fine"',
				'Dissociation that reads to others as calm',
				"Chronic fatigue that nobody sees because nobody's told"
			],
			strengths: [
				'Holistic approach: nothing single-modality survives them',
				'Natural mediator who can hold both sides of an inner conflict',
				'Steady pace that finishes long after the dramatic types quit'
			]
		}
	];
</script>

<EnneagramSectionPage
	view={data.view}
	{copy}
	canonical="https://9takes.com/enneagram-corner/mental-health"
>
	{#snippet notice()}
		<aside class="crisis" aria-label="Crisis resources">
			<strong>If you're in crisis, please reach out:</strong>
			<span><a href="tel:988">988</a> (Suicide &amp; Crisis Lifeline)</span>
			<span>Text HOME to <a href="sms:741741">741741</a></span>
			<span><a href="tel:911">911</a> (Emergency)</span>
		</aside>
	{/snippet}

	{#snippet beforeLanes()}
		<section class="band" id="why" aria-labelledby="why-title">
			<div class="wrap">
				<header class="band-head">
					<h2 id="why-title" class="band-title">Why personality type matters</h2>
					<p class="band-sub">What changes when you read mental health through type.</p>
				</header>
				<div class="why-grid">
					{#each benefitCards as card (card.title)}
						<article class="why-card">
							<h3>{card.title}</h3>
							<p>{card.body}</p>
						</article>
					{/each}
				</div>
			</div>
		</section>
	{/snippet}

	{#snippet afterLanes()}
		<section class="band" id="by-type" aria-labelledby="by-type-title">
			<div class="wrap">
				<header class="band-head">
					<h2 id="by-type-title" class="band-title">
						How each type breaks, and what it brings back
					</h2>
					<p class="band-sub">
						Where each type tends to break, and what tends to put it back together.
					</p>
				</header>
				<nav class="type-jump" aria-label="Jump to a type">
					{#each TYPE_NUMBERS as typeNum (typeNum)}
						<a href="#type-{typeNum}" aria-label="Jump to Type {typeNum}">{typeNum}</a>
					{/each}
				</nav>
				<div class="type-grid">
					{#each TYPE_NUMBERS as typeNum (typeNum)}
						{@const entry = typeData[typeNum - 1]}
						<article class="type-card" id="type-{typeNum}" aria-labelledby="type-{typeNum}-title">
							<h3 id="type-{typeNum}-title">
								<span class="type-badge">{typeNum}</span>
								Type {typeNum}
							</h3>
							<div class="type-cols">
								<div>
									<h4>How they tend to break</h4>
									<ul>
										{#each entry.vulnerabilities as item (item)}
											<li>{item}</li>
										{/each}
									</ul>
								</div>
								<div>
									<h4>What they bring to recovery</h4>
									<ul>
										{#each entry.strengths as item (item)}
											<li>{item}</li>
										{/each}
									</ul>
								</div>
							</div>
							<a class="type-link" href="/enneagram-corner/enneagram-type-{typeNum}">
								Read the full Type {typeNum} profile →
							</a>
						</article>
					{/each}
				</div>
			</div>
		</section>
	{/snippet}

	{#snippet actions()}
		<Button size="lg" href="/enneagram-corner/mental-health/enneagram-anxiety-complete-guide">
			Read the Anxiety Guide
		</Button>
		<Button size="lg" variant="secondary" href="/enneagram-test">Find Your Type</Button>
	{/snippet}
</EnneagramSectionPage>

<style lang="scss">
	/* Blocks only the mental-health section has. Layout tokens mirror
	   EnneagramSectionPage (.wrap / .band) so the bands line up. */
	.wrap {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 48px;

		@media (max-width: 768px) {
			padding: 0 20px;
		}
	}

	.band {
		padding: 72px 0;
		border-top: 1px solid var(--rule);

		@media (max-width: 768px) {
			padding: 48px 0;
		}
	}

	.band-head {
		max-width: 720px;
		margin-bottom: 28px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.band-title {
		margin: 0;
		font-weight: var(--font-weight-semibold);
		font-size: clamp(calc(var(--font-size-xl) * 1.3), 3.4vw, calc(var(--font-size-xl) * 1.8));
		line-height: 1.12;
		letter-spacing: -0.02em;
		color: var(--text);
	}

	.band-sub {
		margin: 0;
		font-size: var(--font-size-lg);
		line-height: 1.55;
		color: var(--text-muted);
	}

	/* ---------- crisis line ---------- */
	.crisis {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 8px 20px;
		padding: 14px 18px;
		border: 1px solid var(--rule);
		border-left: 3px solid var(--accent);
		border-radius: 10px;
		background: var(--surface);
		font-size: var(--font-size-sm);
		color: var(--text-muted);

		strong {
			color: var(--text);
			font-weight: var(--font-weight-semibold);
		}

		a {
			color: var(--highlight);
			font-weight: var(--font-weight-semibold);
			text-decoration: none;
		}
	}

	/* ---------- why type matters ---------- */
	.why-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;

		@media (max-width: 720px) {
			grid-template-columns: 1fr;
		}
	}

	.why-card {
		padding: 24px;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background: var(--surface);

		h3 {
			margin: 0 0 10px;
			font-size: var(--font-size-xl);
			font-weight: var(--font-weight-semibold);
			line-height: 1.3;
			color: var(--text);
		}

		p {
			margin: 0;
			font-size: var(--font-size-base);
			line-height: 1.6;
			color: var(--text-muted);
		}
	}

	/* ---------- by type ---------- */
	.type-jump {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 28px;

		a {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 40px;
			height: 40px;
			border: 1px solid var(--rule);
			border-radius: 9999px;
			color: var(--text);
			font-weight: var(--font-weight-semibold);
			text-decoration: none;

			&:hover {
				border-color: var(--highlight);
				color: var(--highlight);
			}
		}
	}

	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;

		@media (max-width: 1024px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		@media (max-width: 640px) {
			grid-template-columns: 1fr;
		}
	}

	.type-card {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 22px;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background: var(--surface);
		scroll-margin-top: 88px;

		h3 {
			display: flex;
			align-items: center;
			gap: 12px;
			margin: 0;
			font-size: var(--font-size-xl);
			font-weight: var(--font-weight-semibold);
			color: var(--text);
		}

		h4 {
			margin: 0 0 8px;
			font-size: var(--font-size-xs);
			font-weight: var(--font-weight-semibold);
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--text-faint);
		}

		ul {
			margin: 0;
			padding-left: 18px;
			display: flex;
			flex-direction: column;
			gap: 6px;
		}

		li {
			font-size: var(--font-size-sm);
			line-height: 1.5;
			color: var(--text-muted);
		}
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 9999px;
		background: color-mix(in srgb, var(--accent) 24%, transparent);
		color: var(--highlight);
		font-size: var(--font-size-base);
	}

	.type-cols {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.type-link {
		margin-top: auto;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--highlight);
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
</style>

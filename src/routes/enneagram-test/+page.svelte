<!-- src/routes/enneagram-test/+page.svelte -->
<!--
  /enneagram-test: the free 9takes Enneagram test (T-42). DJ's emotion-first
  typing conversation as a self-pick flow (TestFlow). Everything below the
  test (how it works, honest limits, FAQ, the nine types) is server-rendered
  so search engines see a real page, and is hidden while someone is taking
  the test. Design: docs/taskers/T-42-assets/user-flow.md.
-->
<script lang="ts">
	import SEOHead from '$lib/components/SEOHead.svelte';
	import TestFlow from '$lib/components/enneagramTest/TestFlow.svelte';
	import TypeBadge from '$lib/components/enneagramTest/TypeBadge.svelte';
	import { EMOTIONS, EMOTION_ORDER, TEST_TYPES, typesForEmotion } from '$lib/enneagramTest/content';
	import { buildBreadcrumbSchemaForGraph } from '$lib/utils/schema';

	const siteUrl = 'https://9takes.com';
	const pageUrl = `${siteUrl}/enneagram-test`;
	const pageTitle = 'Free Enneagram Test (No Email, 5 to 10 Minutes) | 9takes';
	const pageDescription =
		'A free Enneagram test that starts with emotion, not behavior. About 5 to 10 minutes, no email, and your result shows on screen. Then ask someone who knows you to check it.';

	const faqs = [
		{
			question: 'Is the 9takes Enneagram test free?',
			answer:
				'Yes. The whole test and your result are free, and you don’t need an email address to see your result. After your result you can choose to get an email when a friend checks it.'
		},
		{
			question: 'How long does the test take?',
			answer:
				'About 5 to 10 minutes. Most of that is reading. There are five choices to make, plus a tiebreak if two types sound like you.'
		},
		{
			question: 'How accurate is it?',
			answer:
				'It is a self-report test, so it is only as accurate as your honesty about yourself. It doesn’t measure you or claim scientific validity. It walks you through how to recognize your type, and the last step asks someone who knows you for their read, which is the best check a self-report test has.'
		},
		{
			question: 'Why does it start with emotions instead of behavior?',
			answer:
				'The same behavior can come from different places. The Enneagram groups the nine types by the hard emotion they organize around: anger, shame or fear. Finding that emotion first narrows nine types down to three.'
		},
		{
			question: 'What if two types sound like me?',
			answer:
				'Pick both. The test then puts the two core fears side by side and asks which would actually wreck your week. If both still fit, your result says you’re between the two, and you can send a link to someone who knows you.'
		}
	];

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
				isPartOf: { '@type': 'WebSite', name: '9takes', url: siteUrl },
				breadcrumb: { '@id': `${pageUrl}#breadcrumb` }
			},
			{
				'@id': `${pageUrl}#breadcrumb`,
				...buildBreadcrumbSchemaForGraph([
					{ name: 'Home', url: siteUrl },
					{ name: 'Enneagram Test', url: pageUrl }
				])
			},
			{
				'@type': 'FAQPage',
				'@id': `${pageUrl}#faq`,
				mainEntity: faqs.map((faq) => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: { '@type': 'Answer', text: faq.answer }
				}))
			}
		]
	};

	let testActive = $state(false);
</script>

<SEOHead title={pageTitle} description={pageDescription} canonical={pageUrl} {jsonLd} />

<div class="test-page">
	<TestFlow onActiveChange={(active) => (testActive = active)} />

	<div class="about" hidden={testActive}>
		<section aria-labelledby="how-title">
			<h2 id="how-title">How the test works</h2>
			<ol class="how">
				<li>
					<strong>Find your emotion.</strong> Anger, shame or fear. Everyone feels all three. One shows
					up most.
				</li>
				<li>
					<strong>Check it against your strength.</strong> Each emotion builds one: instinct, emotional
					intelligence or intellect.
				</li>
				<li>
					<strong>Meet the three types who share it.</strong> What separates them is what they do with
					it: use it, push it down, or not notice it.
				</li>
				<li>
					<strong>Still torn? Go back to the core fear,</strong> then ask someone who knows you. The test
					gives you a link to send them.
				</li>
			</ol>
		</section>

		<section aria-labelledby="limits-title">
			<h2 id="limits-title">What a self-report test can and can’t tell you</h2>
			<p>
				This test doesn’t measure you. It walks you through how to recognize your type, the way DJ,
				who built 9takes, walks people through it in person. People sometimes pick who they want to
				be, which is why the last step is a read from someone who knows you.
			</p>
			<p>
				Want to compare free tests? Here’s <a
					href="/enneagram-corner/enneagram-test-comparison-2026">our honest list, ours included</a
				>. New to the system? Start with the
				<a href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
					>four-step guide to finding your type</a
				>.
			</p>
		</section>

		<section aria-labelledby="types-title">
			<h2 id="types-title">The nine types, grouped by emotion</h2>
			<div class="type-groups">
				{#each EMOTION_ORDER as emotion (emotion)}
					<div class="type-group">
						<h3>
							<span class="dot" style:background={EMOTIONS[emotion].color}></span>
							{EMOTIONS[emotion].name}
						</h3>
						<ul class="type-list">
							{#each typesForEmotion(emotion) as type (type)}
								<li>
									<a href="/enneagram-corner/enneagram-type-{type}" class="type-link">
										<TypeBadge {type} small />
										<span class="type-text">
											<span class="type-name">Type {type}: {TEST_TYPES[type].name}</span>
											<span class="type-fear">Core fear: {TEST_TYPES[type].fear.toLowerCase()}</span
											>
										</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</section>

		<section aria-labelledby="faq-title">
			<h2 id="faq-title">Questions about the test</h2>
			<div class="faqs">
				{#each faqs as faq (faq.question)}
					<div class="faq">
						<h3>{faq.question}</h3>
						<p>{faq.answer}</p>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	.test-page {
		display: flex;
		flex-direction: column;
		gap: clamp(2.5rem, 7vw, 4rem);
		width: 100%;
		padding-block: 0.5rem 3rem;
		color: var(--ink-bright);
	}

	.about {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		width: 100%;
		max-width: 40rem;
		margin-inline: auto;
		padding-top: 2rem;
		border-top: 1px solid var(--stone-mid);
	}

	.about[hidden] {
		display: none;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	h2,
	h3 {
		margin: 0;
		padding: 0;
		color: var(--ink-bright);
		text-wrap: balance;
	}

	h2 {
		font-size: 1.45rem;
		font-weight: 750;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	h3 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.05rem;
		font-weight: 700;
		line-height: 1.3;
	}

	p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--ink-mid);
	}

	a {
		color: var(--lamp-glow);
	}

	.how {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		margin: 0;
		padding-left: 1.25rem;
		color: var(--ink-mid);
		line-height: 1.6;
	}

	.how strong {
		color: var(--ink-bright);
	}

	.type-groups {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.type-group {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.dot {
		display: inline-block;
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 9999px;
	}

	.type-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.type-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.7rem 0.9rem;
		border: 1px solid var(--stone-mid);
		border-radius: 10px;
		background: var(--night-mid);
		color: var(--ink-bright);
		text-decoration: none;
	}

	.type-link:hover,
	.type-link:focus-visible {
		border-color: var(--lamp-glow);
	}

	.type-text {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.type-name {
		font-weight: 700;
	}

	.type-fear {
		font-size: 0.9rem;
		color: var(--ink-mid);
	}

	.faqs {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.faq {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
</style>

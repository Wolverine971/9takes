<!-- src/lib/components/marketing/home/HomePage.svelte -->
<!--
  The Cold Light homepage (approved v4, 2026-11-05). The site header and footer come from the
  root layout; this owns everything between them.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import type { LiveTake } from '$lib/data/homepageLiveTake';
	import type { LiveTakeTypes } from '$lib/data/homepageLiveTypes';
	import BeliefPoster from './BeliefPoster.svelte';
	import HomeFaq from './HomeFaq.svelte';
	import HomeHero from './HomeHero.svelte';
	import HomeTriads from './HomeTriads.svelte';
	import LiveQuestionCard from './LiveQuestionCard.svelte';
	import PosterHeading from './PosterHeading.svelte';
	import { trackHomeClicks } from './homeAnalytics';

	let {
		live = null,
		liveTypes = null
	}: { live?: LiveTake | null; liveTypes?: LiveTakeTypes | null } = $props();

	const title = '1 Question, 9 Perspectives | 9takes';
	const description =
		'A question-and-answer community for seeing why people react differently. Answer a question, read other people’s responses, and compare 9 perspectives.';
</script>

<SEOHead
	{title}
	{description}
	canonical="https://9takes.com"
	twitterImageAlt="Nine people gathered in conversation beneath a streetlamp"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': 'https://9takes.com/#webpage',
		url: 'https://9takes.com',
		name: title,
		description,
		inLanguage: 'en-US',
		isPartOf: { '@id': 'https://9takes.com/#website' }
	}}
/>

<div class="home" {@attach trackHomeClicks(() => live?.slug ?? null)}>
	<HomeHero />

	<section class="band" aria-labelledby="band-title">
		<div class="wrap band-grid">
			<div class="band-copy">
				<PosterHeading id="band-title" big="Answer before" ital="the crowd does" />
				<p class="body">
					Most sites show you the top comment first, so the loudest take starts to feel like the
					only one. Here, takes stay locked until you write yours, so the first one you read can't
					steer you. <strong>Then you see everyone's honest version, and the type behind it.</strong
					>
				</p>
				<ul class="promises">
					<li>A take is your honest answer. Three words counts.</li>
					{#if live?.signedIn}
						<li>You're signed in, so your take posts from your account.</li>
					{:else}
						<li>Anonymous. Your name and email are never shown.</li>
					{/if}
					<li>No account needed. Add your type later, or skip it.</li>
				</ul>
				<p class="type-test">
					Not sure of your type? <a
						href={resolve('/enneagram-corner')}
						data-track="link"
						data-placement="band_types">Explore the nine</a
					>
				</p>
			</div>
			<LiveQuestionCard {live} types={liveTypes} />
		</div>
	</section>

	<HomeTriads />
	<HomeFaq />
	<BeliefPoster />
</div>

<style>
	.home {
		background: var(--bg);
		color: var(--text);
		font-family: var(--font-talk);
		font-size: var(--font-size-base);
		line-height: 1.6;
		overflow-x: clip;
	}
	.home :global(:focus-visible) {
		outline: 2px solid var(--highlight);
		outline-offset: 3px;
	}
	.wrap {
		max-width: 1240px;
		margin: 0 auto;
		padding-inline: max(24px, env(safe-area-inset-left, 0px))
			max(24px, env(safe-area-inset-right, 0px));
	}
	.band {
		/* Undo the global section/article element styles. */
		margin: 0;
		padding-inline: 0;
		border-radius: 0;
		padding-block: 96px;
		border-top: 1px solid var(--rule);
	}
	.band-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
		align-items: start;
		gap: 64px;
	}
	.band-copy {
		position: sticky;
		top: 96px;
	}
	.body {
		max-width: 42ch;
		margin: 22px 0 0;
		font-size: var(--font-size-lg);
		color: var(--text-muted);
	}
	.body strong {
		font-weight: 600;
		color: var(--text);
	}
	.promises {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 28px 0 0;
		padding: 0;
		list-style: none;
		font-size: var(--font-size-base);
	}
	.promises li {
		display: flex;
		align-items: baseline;
		gap: 12px;
	}
	.promises li::before {
		content: '';
		flex: none;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--highlight);
		transform: translateY(-2px);
	}
	.type-test {
		margin: 26px 0 0;
		font-size: var(--font-size-base);
		color: var(--text-muted);
	}
	.type-test a {
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	@media (max-width: 980px) {
		.band {
			padding-block: 64px;
		}
		.band-grid {
			grid-template-columns: 1fr;
			gap: 36px;
		}
		.band-copy {
			position: static;
		}
	}
</style>

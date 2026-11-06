<!-- src/lib/components/marketing/home/HomeTriads.svelte -->
<!-- "What's under every take": the three Enneagram triads, each opened by its emotion bust. -->
<script lang="ts">
	import PosterHeading from './PosterHeading.svelte';

	const triads = [
		{
			key: 'heart',
			label: 'Heart types',
			types: '2 · 3 · 4',
			feel: 'Shame',
			image: 'emotion-shame',
			alt: 'Marble bust of a young man, head bowed, fingertips pressed to his brow in shame.',
			title: 'What they’re insecure about',
			lines: [
				['2s', 'win people over.'],
				['3s', 'polish their image.'],
				['4s', 'look inward for what’s missing.']
			]
		},
		{
			key: 'head',
			label: 'Head types',
			types: '5 · 6 · 7',
			feel: 'Fear',
			image: 'emotion-fear',
			alt: 'Marble bust of a young woman, eyes wide and brow raised, one hand frozen at her collarbone in fear.',
			title: 'What they’re anxious about',
			lines: [
				['5s', 'pull back to think.'],
				['6s', 'brace for what could go wrong.'],
				['7s', 'keep every option open.']
			]
		},
		{
			key: 'gut',
			label: 'Gut types',
			types: '8 · 9 · 1',
			feel: 'Anger',
			image: 'emotion-anger',
			alt: 'Marble bust of a bearded man glaring from under a furrowed brow, jaw clenched in held-in anger.',
			title: 'What they’re upset about',
			lines: [
				['8s', 'push back.'],
				['9s', 'go numb to keep the peace.'],
				['1s', 'hold it in and try to do it right.']
			]
		}
	] as const;
</script>

<section class="under" aria-labelledby="under-title">
	<div class="wrap">
		<div class="under-head">
			<PosterHeading id="under-title" big="What's under" ital="every take" />
			<p>
				Understand what people are insecure about, what they're anxious about, and what they're
				upset about. <span>Then see how it shapes what they notice first.</span>
			</p>
		</div>
		<div class="triad">
			{#each triads as triad (triad.key)}
				<article class="tri">
					<p class="tri-types">{triad.label} <i>{triad.types}</i></p>
					<figure class="tri-face">
						<img
							src="/brand/home/{triad.image}-720.webp"
							srcset="/brand/home/{triad.image}-400.webp 400w, /brand/home/{triad.image}-720.webp 720w"
							sizes="(max-width: 980px) calc(100vw - 48px), 400px"
							alt={triad.alt}
							width="720"
							height="900"
							loading="lazy"
							decoding="async"
						/>
						<figcaption class="tri-feel">{triad.feel}</figcaption>
					</figure>
					<h3>{triad.title}</h3>
					<ul>
						{#each triad.lines as [type, line] (type)}
							<li><b>{type}</b> {line}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
		<p class="caveat">
			<b>Everyone picks their own type, and a test can only suggest one.</b> A type describes what drives
			a person, not what they think, so read every take as one person's view.
		</p>
	</div>
</section>

<style>
	.wrap {
		max-width: 1240px;
		margin: 0 auto;
		padding-inline: max(24px, env(safe-area-inset-left, 0px))
			max(24px, env(safe-area-inset-right, 0px));
	}
	.under {
		/* Undo the global section/article element styles. */
		margin: 0;
		padding-inline: 0;
		border-radius: 0;
		--tri-feel: clamp(64px, 7.4vw, 104px);
		--tri-title: clamp(30px, 3vw, 40px);
		padding-block: 104px 96px;
		border-top: 1px solid var(--rule);
		background: radial-gradient(
			60% 60% at 15% 0%,
			color-mix(in srgb, var(--accent) 16%, transparent),
			transparent 70%
		);
	}
	.under-head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		align-items: end;
		gap: 32px 64px;
		margin-bottom: 56px;
	}
	.under-head p {
		max-width: 42ch;
		margin: 0;
		font-size: var(--font-size-xl);
		line-height: 1.5;
		color: var(--text);
	}
	.under-head p span {
		color: var(--text-muted);
	}

	.triad {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		grid-template-rows: repeat(4, auto);
		border-top: 1px solid var(--rule);
	}
	.tri {
		margin: 0;
		border-radius: 0;
		display: grid;
		grid-row: span 4;
		grid-template-rows: subgrid;
		row-gap: 14px;
		align-content: start;
		min-width: 0;
		padding: 32px 32px 8px;
		border-left: 1px solid var(--rule);
	}
	.tri:first-child {
		padding-left: 0;
		border-left: 0;
	}
	.tri-types {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--text-muted);
	}
	.tri-types i {
		font-family: var(--font-voice);
		font-size: var(--font-size-xl);
		color: var(--highlight);
	}
	.tri-face {
		position: relative;
		margin: 0 0 6px;
	}
	.tri-face img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		mix-blend-mode: lighten;
		mask-image: linear-gradient(to bottom, black 62%, transparent 98%);
	}
	.tri-feel {
		position: absolute;
		left: 0;
		bottom: -0.08em;
		font-family: var(--font-shout);
		font-style: normal;
		font-size: var(--tri-feel);
		line-height: 0.9;
		text-transform: uppercase;
		color: var(--highlight);
		transition: color 0.3s;
	}
	.tri:hover .tri-feel {
		color: var(--text);
	}
	h3 {
		align-self: start;
		margin: 0;
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 400;
		font-size: var(--tri-title);
		line-height: 1.08;
		color: var(--text);
		text-wrap: balance;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: var(--font-size-base);
		color: var(--text-muted);
	}
	ul b {
		font-weight: 600;
		color: var(--text);
	}
	.caveat {
		max-width: 70ch;
		margin: 40px 0 0;
		font-size: var(--font-size-base);
		color: var(--text-muted);
	}
	.caveat b {
		font-weight: 600;
		color: var(--text);
	}

	@media (max-width: 980px) {
		.under {
			padding-block: 64px;
		}
		.under-head {
			grid-template-columns: 1fr;
			margin-bottom: 36px;
		}
		.triad {
			grid-template-columns: 1fr;
			grid-template-rows: none;
		}
		.tri,
		.tri:first-child {
			display: flex;
			flex-direction: column;
			gap: 14px;
			padding: 28px 0 24px;
			border-left: 0;
			border-top: 1px solid var(--rule);
		}
		.tri:first-child {
			border-top: 0;
		}
		h3 {
			align-self: stretch;
		}
		.tri-face img {
			aspect-ratio: 1 / 1;
			object-position: 50% 15%;
		}
	}
</style>

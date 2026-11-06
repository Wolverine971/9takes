<!-- src/lib/components/marketing/home/HomeHero.svelte -->
<!-- Cold Light hero: GIVE your take / READ theirs around the whispering statues, then the nine types. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';

	const steps = [
		'Find out what people really think',
		'Find out why they think that way',
		'Understand the other side'
	];
	const types = [
		{ n: 1, name: 'Reformer' },
		{ n: 2, name: 'Helper' },
		{ n: 3, name: 'Achiever' },
		{ n: 4, name: 'Individualist' },
		{ n: 5, name: 'Investigator' },
		{ n: 6, name: 'Loyalist' },
		{ n: 7, name: 'Enthusiast' },
		{ n: 8, name: 'Challenger' },
		{ n: 9, name: 'Peacemaker' }
	];
</script>

<section class="hero" aria-labelledby="hero-title">
	<div class="wrap">
		<div class="stage">
			<figure class="photo">
				<img
					src="/brand/home/home-whisper-760.webp"
					srcset="/brand/home/home-whisper-480.webp 480w, /brand/home/home-whisper-760.webp 760w, /brand/home/home-whisper-1000.webp 1000w"
					sizes="(max-width: 980px) min(560px, 100vw), (max-width: 1280px) 620px, 760px"
					alt="Two marble statues: a young man cups his hand to whisper in a woman's ear, and she raises her fingertips to her lips, scandalized."
					width="1000"
					height="1153"
					fetchpriority="high"
					decoding="async"
				/>
			</figure>

			<div class="side left">
				<h1 id="hero-title" class="word">
					<span class="big">Give</span><span class="ital">your take</span>
				</h1>
				<div class="lede">
					<p class="caps">
						Say what you really think.<br />Anonymously.<br />Before you see anyone else's.
					</p>
					<p>One question, nine perspectives. Your take unlocks theirs.</p>
				</div>
				<a class="cta" href="#answer" data-track="link" data-placement="hero_cta"
					>Give your take <ArrowRight size={18} aria-hidden="true" /></a
				>
			</div>

			<div class="side right">
				<p class="word" aria-label="Read theirs">
					<span class="big">Read</span><span class="ital">theirs</span>
				</p>
				<ol class="steps" aria-label="What you get">
					{#each steps as step, index (step)}
						<li>{step} <span>{index + 1}</span></li>
					{/each}
				</ol>
			</div>
		</div>

		<nav class="nine" aria-label="The nine Enneagram types">
			<p class="eyebrow">One question · nine ways to see it</p>
			<ul class="types">
				{#each types as type (type.n)}
					<li>
						<a
							href={resolve('/enneagram-corner/[slug]', { slug: `enneagram-type-${type.n}` })}
							data-track="link"
							data-placement="nine_types"><i>{type.n}</i>{type.name}</a
						>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</section>

<style>
	.wrap {
		max-width: 1240px;
		margin: 0 auto;
		padding-inline: max(24px, env(safe-area-inset-left, 0px))
			max(24px, env(safe-area-inset-right, 0px));
	}
	.hero {
		/* Undo the global section/article element styles. */
		margin: 0;
		padding-inline: 0;
		border-radius: 0;
		/* Local display scale: the two hero words and the type numerals. */
		--hero-big: clamp(84px, 13vw, 176px);
		--hero-ital: clamp(48px, 7.2vw, 100px);
		--hero-type-num: 22px;
		position: relative;
		isolation: isolate;
		overflow: hidden;
		padding-top: 24px;
		background:
			radial-gradient(
				60% 70% at 50% 30%,
				color-mix(in srgb, var(--accent) 55%, transparent),
				transparent 70%
			),
			radial-gradient(120% 80% at 50% 0%, var(--accent-deep), var(--bg) 75%);
	}
	.hero::after {
		content: '';
		position: absolute;
		inset: auto 0 0 0;
		height: 30%;
		background: linear-gradient(transparent, var(--bg));
		z-index: -1;
	}

	.stage {
		position: relative;
		display: grid;
		grid-template-columns: 1fr minmax(0, 520px) 1fr;
		align-items: end;
	}
	.photo {
		grid-column: 1 / -1;
		grid-row: 1;
		justify-self: center;
		align-self: start;
		position: relative;
		z-index: 0;
		width: min(760px, 100%);
		aspect-ratio: 1000 / 900;
		margin: 0;
		overflow: hidden;
		mask-image: radial-gradient(closest-side at 50% 45%, black 62%, transparent 100%);
	}
	.photo img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 0;
		mix-blend-mode: lighten;
	}

	.side {
		grid-row: 1;
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		gap: 22px;
		align-self: start;
		min-width: 0;
		padding-top: 70px;
		padding-bottom: 40px;
	}
	.side.left {
		grid-column: 1 / 3;
	}
	.side.right {
		grid-column: 2 / 4;
		align-items: flex-end;
		text-align: right;
	}

	.word {
		margin: 0;
		font-weight: 400;
		line-height: 0.86;
	}
	.big {
		display: block;
		font-family: var(--font-shout);
		font-weight: 400;
		font-size: var(--hero-big);
		letter-spacing: -0.005em;
		text-transform: uppercase;
		color: var(--text);
		text-shadow: 0 6px 40px color-mix(in srgb, var(--bg) 35%, transparent);
	}
	.ital {
		display: block;
		margin-top: -0.06em;
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 400;
		font-size: var(--hero-ital);
		letter-spacing: -0.01em;
		line-height: 1;
		color: var(--highlight);
	}

	.lede {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-width: 330px;
	}
	.lede p {
		margin: 0;
		font-size: var(--font-size-base);
		line-height: 1.6;
		color: var(--text-muted);
		text-shadow: 0 1px 14px color-mix(in srgb, var(--bg) 85%, transparent);
	}
	.lede .caps {
		font-size: var(--font-size-sm);
		font-weight: 600;
		letter-spacing: 0.1em;
		line-height: 1.5;
		text-transform: uppercase;
		color: var(--text);
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		align-self: flex-start;
		min-height: 48px;
		padding: 14px 24px;
		border-radius: 999px;
		background: var(--action);
		color: var(--text-on-action);
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}
	.cta:hover {
		transform: translateY(-1px);
		box-shadow: 0 10px 30px color-mix(in srgb, var(--action) 25%, transparent);
	}

	.steps {
		width: 340px;
		max-width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.steps li {
		display: flex;
		justify-content: space-between;
		gap: 14px;
		padding: 10px 0;
		border-bottom: 1px solid var(--rule);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.13em;
		text-align: left;
		text-transform: uppercase;
		color: var(--text);
	}
	.steps li:first-child {
		border-top: 1px solid var(--rule);
	}
	.steps li span {
		color: var(--highlight);
		font-variant-numeric: tabular-nums;
	}

	.nine {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		margin-top: -40px;
		padding-bottom: 48px;
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 14px;
		margin: 0;
		font-size: var(--font-size-xs);
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: var(--text-muted);
	}
	.eyebrow::before,
	.eyebrow::after {
		content: '';
		width: 34px;
		height: 1px;
		background: var(--text-muted);
		opacity: 0.5;
	}
	.types {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.types li + li {
		border-left: 1px solid var(--rule);
	}
	.types a {
		display: flex;
		align-items: baseline;
		gap: 7px;
		padding: 4px 16px;
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--text);
		text-decoration: none;
		opacity: 0.88;
		transition:
			opacity 0.2s,
			color 0.2s;
	}
	.types a:hover {
		opacity: 1;
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.types i {
		font-family: var(--font-voice);
		font-size: var(--hero-type-num);
		color: var(--highlight);
	}

	@media (prefers-reduced-motion: no-preference) {
		.photo img {
			animation: rise 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
		}
	}
	@keyframes rise {
		from {
			transform: translateY(14px) scale(1.02);
			opacity: 0.6;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}

	@media (max-width: 1280px) {
		.photo {
			width: min(620px, 100%);
		}
		.lede {
			max-width: 290px;
		}
	}
	@media (max-width: 980px) {
		.stage {
			grid-template-columns: 1fr;
			padding-bottom: 12px;
		}
		.photo {
			grid-row: 1;
			width: min(560px, 100%);
			margin-top: -10px;
		}
		.side.left,
		.side.right {
			grid-column: 1;
			padding-top: 0;
			padding-bottom: 0;
		}
		.side.left {
			grid-row: 2;
			margin-top: -90px;
		}
		.side.right {
			grid-row: 3;
			margin-top: 56px;
			align-items: flex-start;
			text-align: left;
		}
		.side.right .word {
			align-self: flex-end;
			text-align: right;
		}
		.steps {
			width: 100%;
		}
		.nine {
			margin-top: 40px;
		}
	}
	@media (max-width: 520px) {
		.side.left {
			margin-top: -60px;
		}
		.hero {
			--hero-big: 92px;
			--hero-ital: 52px;
		}
		.eyebrow {
			white-space: nowrap;
			letter-spacing: 0.18em;
		}
		.eyebrow::before,
		.eyebrow::after {
			width: 16px;
		}
		.types {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			row-gap: 4px;
			width: 100%;
		}
		.types li + li {
			border-left: 0;
		}
		.types a {
			justify-content: center;
			min-height: 44px;
			align-items: center;
			padding: 8px 4px;
			font-size: var(--font-size-sm);
		}
	}
</style>

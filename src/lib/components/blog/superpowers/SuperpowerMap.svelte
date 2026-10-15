<!-- src/lib/components/blog/superpowers/SuperpowerMap.svelte -->
<!--
  Emotion → superpower map for the Enneagram strengths and weaknesses post
  (/enneagram-corner/enneagram-strengths-and-weaknesses).

  Three emotion cards. Each names the intelligence that emotion builds, then
  the type that uses it, the type that pushes it down and the type that
  doesn't notice it, with that type's superpower. Emotion names, colors and
  the uses / pushes down / doesn't notice split come from the Enneagram test
  copy bank (DJ's triad map). Do not "correct" the split here.

  Rows link to the post's own H3 anchors (TYPE_POWERS[type].anchor in
  superpowerData.ts). No heading tags inside (the table of contents reads
  h2/h3 from the DOM). Static and server-rendered.
-->
<script lang="ts">
	import {
		EMOTIONS,
		EMOTION_ORDER,
		RELATIONS,
		RELATION_ORDER,
		TEST_TYPES
	} from '$lib/enneagramTest/content';
	import { INTELLIGENCE, TYPE_POWERS } from './superpowerData';

	let { caption }: { caption?: string } = $props();
</script>

<figure class="sp-map">
	<div class="sp-map__grid">
		{#each EMOTION_ORDER as emotion (emotion)}
			{@const content = EMOTIONS[emotion]}
			{@const intelligence = INTELLIGENCE[emotion]}
			<div class="sp-map__card" style="--emo: {content.color}">
				<div class="sp-map__head">
					<span class="sp-map__emotion">{content.name}</span>
					<span class="sp-map__intel"
						><span class="sp-map__arrow" aria-hidden="true">→</span>{intelligence.name}</span
					>
					<span class="sp-map__line">{intelligence.line}</span>
				</div>

				{#each RELATION_ORDER as relation (relation)}
					{@const type = content.ways[relation]}
					<a class="sp-map__row" href="#{TYPE_POWERS[type].anchor}">
						<span class="sp-map__num" aria-hidden="true">{type}</span>
						<span class="sp-map__body">
							<span class="sp-map__tag">{RELATIONS[relation].label}</span>
							<span class="sp-map__name"
								><span class="sp-map__sr">Type {type}, </span>{TEST_TYPES[type].name}</span
							>
							<span class="sp-map__power">{TYPE_POWERS[type].power}</span>
						</span>
					</a>
				{/each}
			</div>
		{/each}
	</div>

	{#if caption}
		<figcaption class="sp-map__caption">{caption}</figcaption>
	{/if}
</figure>

<style lang="scss">
	.sp-map {
		margin: 2rem 0 2.5rem;
	}

	/* Each card spans the same four rows (head + three types) and inherits
	   them as a subgrid, so the rows line up across the three emotions. */
	.sp-map__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		column-gap: 0.75rem;
		row-gap: 0.5rem;
	}

	.sp-map__card {
		display: grid;
		grid-row: span 4;
		grid-template-rows: subgrid;
		min-width: 0;
		padding: 0.9rem 0.75rem 0.75rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--emo) 34%, transparent);
		border-top: 4px solid var(--emo);
		background: color-mix(in srgb, var(--emo) 7%, var(--stone-warm));
	}

	.sp-map__head {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0 0.25rem 0.4rem;
	}

	.sp-map__emotion {
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.sp-map__intel {
		font-size: 1.1rem;
		font-weight: 800;
		line-height: 1.2;
		color: var(--ink-bright);
	}

	.sp-map__arrow {
		margin-right: 0.3em;
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.sp-map__line {
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--ink-mid);
	}

	/* The article's prose-link rule (.blog a:not(...) x5) outranks any sane
	   selector here: it sets the row's color (harmless, every span sets its
	   own) and underlines the whole row on hover, hence the !important. */
	.sp-map .sp-map__row {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		padding: 0.6rem 0.55rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 22%, transparent);
		background: color-mix(in srgb, var(--night-deep) 55%, transparent);
		color: var(--ink-bright);
		text-decoration: none !important;
		transition:
			border-color 0.18s ease,
			background 0.18s ease;

		&:hover {
			border-color: color-mix(in srgb, var(--emo) 60%, transparent);
			background: color-mix(in srgb, var(--emo) 12%, var(--night-deep));
		}

		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}
	}

	.sp-map__num {
		flex: 0 0 1.6rem;
		font-size: 1.7rem;
		font-weight: 800;
		line-height: 1;
		text-align: center;
		font-feature-settings: 'tnum';
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.sp-map__body {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.sp-map__tag {
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.sp-map__name {
		font-size: 0.8rem;
		line-height: 1.3;
		color: var(--ink-mid);
	}

	.sp-map__power {
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1.25;
		color: var(--ink-bright);
	}

	.sp-map__sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* Doubled selector: the article's `.section-content > figure figcaption`
	   rule would otherwise restyle the caption. */
	.sp-map .sp-map__caption {
		margin-top: 0.9rem;
		font-size: 0.82rem;
		line-height: 1.55;
		color: var(--ink-dim);
		text-align: center;
		font-style: italic;
	}

	@media (max-width: 760px) {
		.sp-map__grid {
			grid-template-columns: 1fr;
			row-gap: 0.75rem;
		}

		.sp-map__card {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding: 0.9rem 0.85rem 0.85rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sp-map .sp-map__row {
			transition: none;
		}
	}
</style>

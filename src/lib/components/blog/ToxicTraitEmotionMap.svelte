<!-- src/lib/components/blog/ToxicTraitEmotionMap.svelte -->
<!--
  Anger / shame / fear map for the toxic relationship traits post
  (/enneagram-corner/toxic-traits-relationships-warning-signs).

  Three emotion cards. Inside each: the type that uses the emotion, the type
  that pushes it down and the type that doesn't notice it, with the trait a
  partner ends up living with. Emotion names, colors and the uses / pushes
  down / doesn't notice split come from the Enneagram test copy bank (DJ's
  triad map), so the two stay in step. Do not "correct" the split here.

  Rows link to the post's own H3 anchors; rename a heading there and the
  matching `anchor` below has to change with it. No heading tags inside (the
  table of contents reads h2/h3 from the DOM). Static and server-rendered.
-->
<script lang="ts">
	import {
		EMOTIONS,
		EMOTION_ORDER,
		RELATIONS,
		RELATION_ORDER,
		type TestType
	} from '$lib/enneagramTest/content';

	type Trait = { anchor: string; trait: string; youGet: string };

	const TRAITS: Record<TestType, Trait> = {
		8: {
			anchor: 'type-8-the-armor',
			trait: 'Control and armor',
			youGet: 'Disagreeing costs too much'
		},
		1: {
			anchor: 'type-1-the-nitpick',
			trait: 'Nitpicking',
			youGet: 'Graded on everything'
		},
		9: {
			anchor: 'type-9-the-numb-out',
			trait: 'Numbing out',
			youGet: 'Alone in the same room'
		},
		4: {
			anchor: 'type-4-the-push-and-pull',
			trait: 'Push, pull and drama',
			youGet: 'Calm never lasts'
		},
		2: {
			anchor: 'type-2-the-ledger',
			trait: 'Smothering and scorekeeping',
			youGet: 'In debt for help you never asked for'
		},
		3: {
			anchor: 'type-3-the-mask',
			trait: 'The mask',
			youGet: 'The least of their attention'
		},
		6: {
			anchor: 'type-6-the-loyalty-test',
			trait: 'Loyalty tests',
			youGet: 'Always proving yourself'
		},
		7: {
			anchor: 'type-7-the-dodge',
			trait: 'Dodging anything heavy',
			youGet: 'The hard talk never happens'
		},
		5: {
			anchor: 'type-5-the-microscope',
			trait: 'Cold distance',
			youGet: 'Watched, with nobody joining you'
		}
	};
</script>

<figure class="emotion-map">
	<div class="emotion-map__grid">
		{#each EMOTION_ORDER as emotion (emotion)}
			{@const content = EMOTIONS[emotion]}
			<div class="emotion-map__card" style="--emo: {content.color}">
				<div class="emotion-map__head">
					<span class="emotion-map__name">{content.name}</span>
					<span class="emotion-map__words">{content.words.slice(0, 3).join(' · ')}</span>
				</div>

				{#each RELATION_ORDER as relation (relation)}
					{@const type = content.ways[relation]}
					{@const row = TRAITS[type]}
					<a class="emotion-map__row" href="#{row.anchor}">
						<span class="emotion-map__num" aria-hidden="true">{type}</span>
						<span class="emotion-map__body">
							<span class="emotion-map__tag">{RELATIONS[relation].label}</span>
							<span class="emotion-map__trait">
								<span class="emotion-map__sr">Type {type}: </span>{row.trait}
							</span>
							<span class="emotion-map__get">You get: {row.youGet.toLowerCase()}</span>
						</span>
					</a>
				{/each}
			</div>
		{/each}
	</div>

	<figcaption class="emotion-map__caption">
		Three emotions, and three ways to carry each one. Pick a type to jump to it.
	</figcaption>
</figure>

<style lang="scss">
	.emotion-map {
		margin: 2rem 0 2.5rem;
	}

	/* Each card spans the same four rows (head + three types) and inherits
	   them as a subgrid, so the rows line up across the three emotions. */
	.emotion-map__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		column-gap: 0.75rem;
		row-gap: 0.5rem;
	}

	.emotion-map__card {
		display: grid;
		grid-row: span 4;
		grid-template-rows: subgrid;
		padding: 0.9rem 0.75rem 0.75rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--emo) 34%, transparent);
		border-top: 4px solid var(--emo);
		background: color-mix(in srgb, var(--emo) 7%, var(--stone-warm));
	}

	.emotion-map__head {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0 0.25rem 0.35rem;
	}

	.emotion-map__name {
		font-size: 1.15rem;
		font-weight: 800;
		line-height: 1.2;
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.emotion-map__words {
		font-size: 0.74rem;
		line-height: 1.4;
		color: var(--ink-dim);
	}

	.emotion-map__row {
		display: flex;
		align-items: flex-start;
		gap: 0.6rem;
		padding: 0.6rem 0.55rem;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 22%, transparent);
		background: color-mix(in srgb, var(--night-deep) 55%, transparent);
		color: var(--ink-bright);
		text-decoration: none;
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

	.emotion-map__num {
		flex: 0 0 1.6rem;
		font-size: 1.7rem;
		font-weight: 800;
		line-height: 1;
		text-align: center;
		font-feature-settings: 'tnum';
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.emotion-map__body {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.emotion-map__tag {
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.emotion-map__trait {
		font-size: 0.95rem;
		font-weight: 700;
		line-height: 1.25;
		color: var(--ink-bright);
	}

	.emotion-map__get {
		font-size: 0.8rem;
		line-height: 1.35;
		color: var(--ink-mid);
	}

	.emotion-map__sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.emotion-map__caption {
		margin-top: 0.9rem;
		font-size: 0.82rem;
		line-height: 1.55;
		color: var(--ink-dim);
		text-align: center;
		font-style: italic;
	}

	@media (max-width: 760px) {
		.emotion-map__grid {
			grid-template-columns: 1fr;
			row-gap: 0.75rem;
		}

		.emotion-map__card {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding: 0.9rem 0.85rem 0.85rem;
		}
	}
</style>

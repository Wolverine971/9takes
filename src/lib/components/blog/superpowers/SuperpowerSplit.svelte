<!-- src/lib/components/blog/superpowers/SuperpowerSplit.svelte -->
<!--
  One type's superpower and kryptonite side by side, for the Enneagram
  strengths and weaknesses post. Same emotion color on both panels; the
  kryptonite panel is the shadow version (darker tint, dashed border, muted
  label) so the pair reads as one trait in two lights.

  Used nine times in the post, so it stays short and calm: no heavy shadows,
  no motion. Labels default to TYPE_POWERS[type] in superpowerData.ts; the
  scene text comes from the post. No heading tags inside (the table of
  contents reads h2/h3 from the DOM). Static and server-rendered.

  <SuperpowerSplit type={8} powerScene="..." kryptoniteScene="..." />
-->
<script lang="ts">
	import { EMOTIONS, TEST_TYPES, relationTag, type TestType } from '$lib/enneagramTest/content';
	import { TYPE_POWERS } from './superpowerData';

	let {
		type,
		powerScene,
		kryptoniteScene,
		power,
		kryptonite
	}: {
		type: TestType;
		powerScene: string;
		kryptoniteScene: string;
		power?: string;
		kryptonite?: string;
	} = $props();

	let color = $derived(EMOTIONS[TEST_TYPES[type].emotion].color);
	let powerLabel = $derived(power ?? TYPE_POWERS[type].power);
	let kryptoniteLabel = $derived(kryptonite ?? TYPE_POWERS[type].kryptonite);
</script>

<figure class="sp-split" style="--emo: {color}">
	<figcaption class="sp-split__head">
		<span class="sp-split__type">Type {type}</span>
		<span class="sp-split__dot" aria-hidden="true">·</span>
		<span class="sp-split__relation">{relationTag(type)}</span>
	</figcaption>

	<div class="sp-split__panels">
		<div class="sp-split__panel sp-split__panel--power">
			<span class="sp-split__eyebrow">Superpower</span>
			<span class="sp-split__label">{powerLabel}</span>
			<span class="sp-split__scene">{powerScene}</span>
		</div>

		<div class="sp-split__panel sp-split__panel--kryptonite">
			<span class="sp-split__eyebrow">Kryptonite</span>
			<span class="sp-split__label">{kryptoniteLabel}</span>
			<span class="sp-split__scene">{kryptoniteScene}</span>
		</div>
	</div>
</figure>

<style lang="scss">
	.sp-split {
		margin: 1.5rem 0;
	}

	/* Doubled selectors on the caption: the article's
	   `.section-content > figure figcaption` rule would otherwise restyle it. */
	.sp-split .sp-split__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem;
		margin: 0 0 0.5rem;
		font-size: 0.75rem;
		font-style: normal;
		font-weight: 700;
		letter-spacing: 0.06em;
		line-height: 1.4;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.sp-split__type {
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.sp-split__panels {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem;
	}

	.sp-split__panel {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
		padding: 0.8rem 0.9rem 0.85rem;
		border-radius: 0.625rem;
	}

	.sp-split__panel--power {
		border: 1px solid color-mix(in srgb, var(--emo) 38%, transparent);
		border-top: 3px solid var(--emo);
		background: color-mix(in srgb, var(--emo) 9%, var(--stone-warm));
	}

	/* The shadow version: same hue, pulled toward the page's darkest surface,
	   dashed edge, muted label. --night-mid is darker than --stone-warm in
	   both themes, so the panel reads as the shade side in light mode too. */
	.sp-split__panel--kryptonite {
		border: 1px dashed color-mix(in srgb, var(--emo) 42%, transparent);
		border-top: 3px dashed color-mix(in srgb, var(--emo) 55%, transparent);
		background: color-mix(in srgb, var(--emo) 5%, var(--night-mid));
	}

	.sp-split__eyebrow {
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.sp-split__panel--kryptonite .sp-split__eyebrow {
		color: color-mix(in srgb, var(--emo) 40%, var(--ink-dim));
	}

	.sp-split__label {
		font-size: 1.05rem;
		font-weight: 800;
		line-height: 1.25;
		color: var(--ink-bright);
	}

	.sp-split__panel--kryptonite .sp-split__label {
		color: var(--ink-mid);
	}

	.sp-split__scene {
		margin-top: 0.15rem;
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	@media (max-width: 600px) {
		.sp-split__panels {
			grid-template-columns: 1fr;
		}
	}
</style>

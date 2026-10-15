<!-- src/lib/components/blog/superpowers/SuperpowerScenes.svelte -->
<!--
  "Same moment, nine superpowers" picker for the Enneagram strengths and
  weaknesses post. Scene tabs across the top; each scene shows all nine
  types' reads (the move at their best, and the same wiring overdone). Pick
  a type to zoom in on it: what it notices, its best move, and the overdone
  version. The pick sticks across scenes so a reader can follow one type
  through all three.

  Every scene and every read renders server-side (inactive scenes and the
  zoom-only "Notices" line use `hidden`), so the content is crawlable and
  works without JS. Copy lives in superpowerData.ts; emotion names, colors
  and the type split come from the Enneagram test copy bank (DJ's triad map,
  do not "correct" it). No heading tags inside (the table of contents reads
  h2/h3 from the DOM).
-->
<script lang="ts">
	import {
		EMOTIONS,
		EMOTION_ORDER,
		TEST_TYPES,
		relationTag,
		typesForEmotion,
		type TestType
	} from '$lib/enneagramTest/content';
	import { SCENES, TYPE_POWERS } from './superpowerData';

	const uid = $props.id();

	let activeId = $state(SCENES[0].id);
	let picked = $state<TestType | null>(null);
	let tabEls = $state<HTMLButtonElement[]>([]);

	function shortName(type: TestType): string {
		return TEST_TYPES[type].name.replace(/^The /, '');
	}

	function selectScene(index: number) {
		const next = SCENES[(index + SCENES.length) % SCENES.length];
		activeId = next.id;
		tabEls[SCENES.indexOf(next)]?.focus();
	}

	function onTabKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			event.preventDefault();
			selectScene(index + 1);
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			event.preventDefault();
			selectScene(index - 1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			selectScene(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			selectScene(SCENES.length - 1);
		}
	}

	function pick(type: TestType) {
		picked = picked === type ? null : type;
	}

	/** Back to all nine; focus returns to the type's picker button so it isn't lost with the button that vanished. */
	function showAll() {
		const previous = picked;
		picked = null;
		if (previous !== null) document.getElementById(`${uid}-pick-${activeId}-${previous}`)?.focus();
	}
</script>

<div class="sp-scenes" role="group" aria-labelledby="{uid}-title">
	<span class="sp-scenes__title" id="{uid}-title">Same moment, nine superpowers</span>

	<div class="sp-scenes__tabs" role="tablist" aria-label="Scenes">
		{#each SCENES as scene, i (scene.id)}
			<button
				bind:this={tabEls[i]}
				type="button"
				role="tab"
				id="{uid}-tab-{scene.id}"
				aria-selected={activeId === scene.id}
				aria-controls="{uid}-panel-{scene.id}"
				tabindex={activeId === scene.id ? 0 : -1}
				class="sp-scenes__tab"
				class:sp-scenes__tab--active={activeId === scene.id}
				onclick={() => (activeId = scene.id)}
				onkeydown={(event) => onTabKeydown(event, i)}
			>
				{scene.label}
			</button>
		{/each}
	</div>

	{#each SCENES as scene (scene.id)}
		<div
			class="sp-scenes__panel"
			role="tabpanel"
			id="{uid}-panel-{scene.id}"
			aria-labelledby="{uid}-tab-{scene.id}"
			hidden={activeId !== scene.id}
		>
			<span class="sp-scenes__setup">{scene.setup}</span>

			<div class="sp-scenes__picker" role="group" aria-labelledby="{uid}-pick-label-{scene.id}">
				<span class="sp-scenes__picker-label" id="{uid}-pick-label-{scene.id}">
					Pick a type to zoom in
				</span>
				<div class="sp-scenes__picker-grid">
					{#each EMOTION_ORDER as emotion (emotion)}
						<div
							class="sp-scenes__picker-col"
							style="--emo: {EMOTIONS[emotion].color}"
							role="group"
							aria-label={EMOTIONS[emotion].name}
						>
							<span class="sp-scenes__picker-emotion" aria-hidden="true">
								{EMOTIONS[emotion].name}
							</span>
							{#each typesForEmotion(emotion) as type (type)}
								<button
									type="button"
									id="{uid}-pick-{scene.id}-{type}"
									class="sp-scenes__pick"
									aria-pressed={picked === type}
									aria-controls="{uid}-reads-{scene.id}"
									onclick={() => pick(type)}
								>
									<span class="sp-scenes__pick-num"
										><span class="sp-scenes__sr">Type </span>{type}</span
									>
									<span class="sp-scenes__pick-name">{shortName(type)}</span>
								</button>
							{/each}
						</div>
					{/each}
				</div>
			</div>

			<div
				class="sp-scenes__reads"
				class:sp-scenes__reads--focus={picked !== null}
				id="{uid}-reads-{scene.id}"
			>
				{#each EMOTION_ORDER as emotion (emotion)}
					{@const types = typesForEmotion(emotion)}
					<div
						class="sp-scenes__col"
						style="--emo: {EMOTIONS[emotion].color}"
						hidden={picked !== null && !types.includes(picked)}
					>
						{#each types as type (type)}
							{@const read = scene.reads[type]}
							{@const focused = picked === type}
							<div
								class="sp-scenes__read"
								class:sp-scenes__read--focus={focused}
								hidden={picked !== null && !focused}
							>
								<span class="sp-scenes__read-head">
									<span class="sp-scenes__read-num" aria-hidden="true">{type}</span>
									<span class="sp-scenes__read-name"
										><span class="sp-scenes__sr">Type {type}, </span>{TEST_TYPES[type].name}</span
									>
									{#if focused}
										<span class="sp-scenes__read-tag">{relationTag(type)}</span>
									{/if}
								</span>

								<span class="sp-scenes__line sp-scenes__line--notices" hidden={!focused}>
									<span class="sp-scenes__label">Notices</span>
									<span class="sp-scenes__text">{read.notices}</span>
								</span>

								<span class="sp-scenes__line sp-scenes__line--move">
									<span class="sp-scenes__label" hidden={!focused}>
										At their best
										{#if focused}
											<span class="sp-scenes__sublabel">{TYPE_POWERS[type].power}</span>
										{/if}
									</span>
									<span class="sp-scenes__text">{read.move}</span>
								</span>

								<span class="sp-scenes__line sp-scenes__line--over">
									<span class="sp-scenes__label"
										>Overdone<span class="sp-scenes__colon">:</span>
										{#if focused}
											<span class="sp-scenes__sublabel">{TYPE_POWERS[type].kryptonite}</span>
										{/if}
									</span>
									<span class="sp-scenes__text">{read.kryptonite}</span>
								</span>
							</div>
						{/each}
					</div>
				{/each}
			</div>

			{#if picked !== null}
				<div class="sp-scenes__actions">
					<button type="button" class="sp-scenes__all" onclick={showAll}>Show all nine</button>
					<a class="sp-scenes__jump" href="#{TYPE_POWERS[picked].anchor}">
						Read the Type {picked} section
					</a>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.sp-scenes {
		margin: 2rem 0;
		padding: 1.25rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 20%, var(--stone-edge));
		border-radius: 1rem;
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 60%);
	}

	/* Several elements here set their own `display`, which beats the UA's
	   [hidden] rule; this keeps `hidden` authoritative inside the component. */
	.sp-scenes [hidden] {
		display: none !important;
	}

	.sp-scenes__title {
		display: block;
		margin-bottom: 0.85rem;
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 800;
		line-height: 1.25;
		color: var(--ink-bright);
	}

	.sp-scenes__tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.sp-scenes__tab {
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		background: transparent;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.3;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease;

		&:hover {
			border-color: var(--lamp-glow);
			color: var(--ink-bright);
		}

		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}
	}

	.sp-scenes__tab--active,
	.sp-scenes__tab--active:hover {
		background: var(--lamp-glow);
		border-color: var(--lamp-glow);
		color: var(--text-on-primary);
		font-weight: 600;
	}

	.sp-scenes__panel {
		animation: sp-scenes-in 0.2s ease both;
	}

	.sp-scenes__setup {
		display: block;
		padding-left: 0.8rem;
		border-left: 2px solid var(--lamp-glow);
		font-size: 1.02rem;
		line-height: 1.5;
		color: var(--ink-bright);
	}

	/* Picker: one column per emotion, rows in uses / pushes down / unaware order. */
	.sp-scenes__picker {
		margin-top: 1.1rem;
	}

	.sp-scenes__picker-label {
		display: block;
		margin-bottom: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.sp-scenes__picker-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.sp-scenes__picker-col {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-width: 0;
	}

	.sp-scenes__picker-emotion {
		font-size: 0.66rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.sp-scenes__pick {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		min-width: 0;
		padding: 0.4rem 0.55rem;
		border: 1px solid color-mix(in srgb, var(--emo) 30%, transparent);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--emo) 6%, transparent);
		color: var(--ink-bright);
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;

		&:hover {
			border-color: color-mix(in srgb, var(--emo) 65%, transparent);
		}

		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}

		&[aria-pressed='true'] {
			border-color: var(--emo);
			background: color-mix(in srgb, var(--emo) 24%, var(--stone-warm));
		}
	}

	.sp-scenes__pick-num {
		flex: 0 0 auto;
		font-size: 1.05rem;
		font-weight: 800;
		line-height: 1;
		font-feature-settings: 'tnum';
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.sp-scenes__pick-name {
		min-width: 0;
		font-size: 0.8rem;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}

	/* All nine: three emotion columns. Each column spans the same three rows
	   and inherits them as a subgrid, so the cards line up across columns. */
	.sp-scenes__reads {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		column-gap: 0.6rem;
		row-gap: 0.6rem;
		margin-top: 1.1rem;
	}

	.sp-scenes__col {
		display: grid;
		grid-row: span 3;
		grid-template-rows: subgrid;
		min-width: 0;
	}

	.sp-scenes__read {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-width: 0;
		padding: 0.7rem 0.75rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 22%, transparent);
		border-left: 3px solid var(--emo);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--night-deep) 60%, transparent);
		animation: sp-scenes-in 0.2s ease both;
	}

	.sp-scenes__read-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.45rem;
	}

	.sp-scenes__read-num {
		font-size: 1.25rem;
		font-weight: 800;
		line-height: 1;
		font-feature-settings: 'tnum';
		color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
	}

	.sp-scenes__read-name {
		font-size: 0.8rem;
		font-weight: 700;
		line-height: 1.3;
		color: var(--ink-bright);
	}

	.sp-scenes__read-tag {
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	/* Size and leading live on the line block, not the inline text: the block's
	   strut would otherwise carry the article's 18px / 1.7 leading. */
	.sp-scenes__line {
		display: block;
		font-size: 0.88rem;
		line-height: 1.45;
	}

	.sp-scenes__text {
		color: var(--ink-bright);
	}

	/* Compact card: no labels except an inline, muted "Overdone:". */
	.sp-scenes__label {
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.sp-scenes__line--over {
		padding-top: 0.35rem;
		border-top: 1px dashed color-mix(in srgb, var(--emo) 30%, transparent);
		font-size: 0.8rem;

		.sp-scenes__label {
			margin-right: 0.3rem;
		}

		.sp-scenes__text {
			color: var(--ink-mid);
		}
	}

	.sp-scenes__sublabel {
		display: block;
		margin-top: 0.2rem;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0;
		text-transform: none;
		line-height: 1.3;
	}

	.sp-scenes__sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* Zoomed in on one type: one wide card with labeled rows. */
	.sp-scenes__reads--focus {
		display: block;

		.sp-scenes__col {
			display: block;
		}
	}

	.sp-scenes__read--focus {
		gap: 0.75rem;
		padding: 1rem 1.1rem 1.1rem;
		border: 1px solid color-mix(in srgb, var(--emo) 38%, transparent);
		border-left: 4px solid var(--emo);
		background: color-mix(in srgb, var(--emo) 8%, var(--stone-warm));
		/* A new animation name restarts the fade when a visible card zooms in. */
		animation-name: sp-scenes-focus;

		.sp-scenes__read-num {
			font-size: 2rem;
		}

		.sp-scenes__read-name {
			font-size: 1.05rem;
		}

		.sp-scenes__line {
			display: grid;
			grid-template-columns: 8.5rem minmax(0, 1fr);
			gap: 0.75rem;
			align-items: baseline;
			font-size: 0.98rem;
			line-height: 1.5;
		}

		.sp-scenes__colon {
			display: none;
		}

		.sp-scenes__line--move .sp-scenes__label,
		.sp-scenes__line--move .sp-scenes__sublabel {
			color: color-mix(in srgb, var(--emo) 68%, var(--ink-bright));
		}

		.sp-scenes__line--move .sp-scenes__text {
			font-weight: 600;
		}

		.sp-scenes__line--over {
			padding-top: 0.75rem;

			.sp-scenes__label {
				margin-right: 0;
			}

			.sp-scenes__sublabel {
				color: var(--ink-mid);
			}
		}
	}

	.sp-scenes__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1rem;
		margin-top: 0.75rem;
	}

	.sp-scenes__all {
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		background: transparent;
		color: var(--ink-bright);
		font-size: 0.88rem;
		line-height: 1.3;
		cursor: pointer;
		transition: border-color 0.15s ease;

		&:hover {
			border-color: var(--lamp-glow);
		}

		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}
	}

	.sp-scenes .sp-scenes__jump {
		font-size: 0.88rem;
	}

	@keyframes sp-scenes-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	@keyframes sp-scenes-focus {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	@media (max-width: 760px) {
		.sp-scenes__reads {
			grid-template-columns: 1fr;
		}

		.sp-scenes__col {
			display: flex;
			flex-direction: column;
			gap: 0.6rem;
		}
	}

	@media (max-width: 600px) {
		.sp-scenes {
			padding: 1rem;
		}

		.sp-scenes__picker-grid {
			gap: 0.35rem;
		}

		.sp-scenes__pick {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.2rem;
			padding: 0.4rem 0.45rem;
		}

		.sp-scenes__pick-name {
			font-size: 0.72rem;
		}

		.sp-scenes__read--focus {
			padding: 0.9rem 0.9rem 1rem;

			.sp-scenes__line {
				grid-template-columns: 1fr;
				gap: 0.25rem;
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sp-scenes__panel,
		.sp-scenes__read,
		.sp-scenes__read--focus {
			animation: none;
		}

		.sp-scenes__tab,
		.sp-scenes__pick,
		.sp-scenes__all {
			transition: none;
		}
	}
</style>

<!-- src/lib/components/questions/QuestionSocialCardTemplate.svelte -->
<!--
  Preview of the question share card (v4, Cold Light, 2026-11-06), shown in the create modal.
  The real card is drawn on the server by renderBrandCard ({ template: 'question' }) at
  /questions/[slug]/social-card.png; this mirrors its layout at 1200x630 so the asker sees
  what a shared link will look like. Question text only, never takes.
-->
<script lang="ts">
	import {
		QUESTION_SOCIAL_CARD_HEIGHT,
		QUESTION_SOCIAL_CARD_WIDTH
	} from '$lib/socialCards/questionSocialCard';

	interface Props {
		questionText?: string;
		id?: string;
		className?: string;
	}

	let { questionText = '', id = undefined, className = '' }: Props = $props();

	const TAKE_CHIPS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	let safeQuestionText = $derived(
		questionText.replace(/\s+/g, ' ').trim() || 'Share your perspective'
	);

	// Same range as the server card (62px down to 34px, at most four lines across 1072px).
	let questionFontSize = $derived.by(() => {
		const length = safeQuestionText.length;
		if (length <= 40) return 62;
		if (length <= 70) return 56;
		if (length <= 110) return 50;
		if (length <= 160) return 44;
		if (length <= 220) return 38;
		return 34;
	});
</script>

<div
	{id}
	class={['question-social-card', className]}
	style:width="{QUESTION_SOCIAL_CARD_WIDTH}px"
	style:height="{QUESTION_SOCIAL_CARD_HEIGHT}px"
>
	<div class="glow" aria-hidden="true"></div>

	<div class="content">
		<div class="brand">
			<img src="/brand/9takes-nine-mask-logo.png" alt="" width="52" height="52" />
			<span>9takes</span>
		</div>

		<div class="question-band">
			<p class="kicker">One question, nine perspectives</p>
			<h2 class="question" style:font-size="{questionFontSize}px">{safeQuestionText}</h2>
		</div>

		<div class="card-bottom">
			<ol class="chips" aria-label="Nine takes, hidden until you answer">
				{#each TAKE_CHIPS as chip (chip)}
					<li>{chip}</li>
				{/each}
			</ol>
			<span class="action">Answer before the crowd</span>
		</div>
	</div>
</div>

<style>
	.question-social-card {
		position: relative;
		overflow: hidden;
		border-radius: 1rem;
		background: var(--bg);
		font-family: var(--font-talk);
		color: var(--text);
	}

	/* One light, upper-left (Cold Light rule). */
	.glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 8% 0%,
			color-mix(in srgb, var(--accent) 30%, transparent) 0%,
			color-mix(in srgb, var(--accent-deep) 10%, transparent) 55%,
			transparent 100%
		);
	}

	.content {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100%;
		padding: 64px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 14px;
		font-size: 30px;
		font-weight: 700;
		line-height: 1;
	}

	.brand img {
		display: block;
		width: 52px;
		height: 52px;
	}

	.question-band {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 22px;
		padding: 24px 0 40px;
	}

	.kicker {
		margin: 0;
		color: var(--highlight);
		font-size: 19px;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.question {
		display: -webkit-box;
		margin: 0;
		overflow: hidden;
		color: var(--text);
		font-weight: 600;
		line-height: 1.16;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		line-clamp: 5;
	}

	.card-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}

	.chips {
		display: flex;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.chips li {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 1.5px solid color-mix(in srgb, var(--highlight) 28%, transparent);
		border-radius: 10px;
		background: var(--surface-raised);
		color: var(--text-muted);
		font-size: 18px;
		font-weight: 700;
	}

	.action {
		display: inline-flex;
		align-items: center;
		height: 54px;
		padding: 0 22px;
		border-radius: 999px;
		background: var(--action);
		color: var(--text-on-action);
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
	}
</style>

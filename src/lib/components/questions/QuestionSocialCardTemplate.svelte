<!-- src/lib/components/questions/QuestionSocialCardTemplate.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import type { QuestionCardTextLayout } from '$lib/socialCards/questionCardTextLayout';
	import {
		calculateQuestionCardTextLayout,
		calculateQuestionCardTextLayoutClient
	} from '$lib/socialCards/questionCardTextLayout';
	import {
		QUESTION_SOCIAL_CARD_HEIGHT,
		QUESTION_SOCIAL_CARD_WIDTH
	} from '$lib/socialCards/questionSocialCard';

	export let questionText = '';
	export let questionUrl = '';
	export let id: string | undefined = undefined;
	export let className = '';

	$: safeQuestionText = questionText?.trim() || 'Share your perspective';
	$: safeQuestionUrl = questionUrl?.trim() || '9takes.com/questions';
	$: displayUrl = safeQuestionUrl.replace(/^https?:\/\//, '');
	let textLayout: QuestionCardTextLayout = calculateQuestionCardTextLayout(safeQuestionText);
	let layoutRequest = 0;

	$: textLayout = calculateQuestionCardTextLayout(safeQuestionText);
	$: if (browser) {
		const requestId = ++layoutRequest;
		void calculateQuestionCardTextLayoutClient(safeQuestionText)
			.then((layout) => {
				if (requestId === layoutRequest) {
					textLayout = layout;
				}
			})
			.catch(() => {
				if (requestId === layoutRequest) {
					textLayout = calculateQuestionCardTextLayout(safeQuestionText);
				}
			});
	}
</script>

<div
	{id}
	class={`question-social-card ${className}`.trim()}
	style={`width:${QUESTION_SOCIAL_CARD_WIDTH}px; height:${QUESTION_SOCIAL_CARD_HEIGHT}px;`}
>
	<div class="glow"></div>
	<div class="shade"></div>
	<div class="bracket bracket-tl" aria-hidden="true"></div>
	<div class="bracket bracket-br" aria-hidden="true"></div>

	<div class="content">
		<div class="card-top">
			<p class="brand">9takes</p>
			<p class="tagline">One question &middot; Nine ways to see it</p>
		</div>
		<div class="question-wrap">
			<h2
				class="question"
				style={`font-size:${textLayout.fontSize}px; line-height:${textLayout.lineHeight};`}
			>
				{#each textLayout.lines as line}
					<span>{line}</span>
				{/each}
			</h2>
		</div>
		<div class="card-bottom">
			<span class="rule" aria-hidden="true"></span>
			<p class="url">{displayUrl}</p>
			<p class="strip">Answer first &middot; See all 9 takes</p>
		</div>
	</div>
</div>

<style>
	/* Streetlamp Symposium V5 palette, hardcoded: html2canvas renders this node in an
	   isolated context where the app's CSS custom properties may not resolve. */
	.question-social-card {
		position: relative;
		overflow: hidden;
		border-radius: 1rem;
		background: #0a0807;
		border: 1px solid rgba(92, 79, 71, 0.5);
		font-family: 'Inter Variable', 'Inter', 'Helvetica Neue', sans-serif;
	}

	.glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at 50% 14%,
			rgba(245, 158, 11, 0.16) 0%,
			rgba(245, 158, 11, 0.05) 45%,
			transparent 72%
		);
	}

	.shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 55%, rgba(0, 0, 0, 0.28) 100%);
	}

	.bracket {
		position: absolute;
		z-index: 3;
		width: 64px;
		height: 64px;
		pointer-events: none;
	}

	.bracket-tl {
		top: 32px;
		left: 32px;
		border-top: 2px solid rgba(245, 158, 11, 0.6);
		border-left: 2px solid rgba(245, 158, 11, 0.6);
	}

	.bracket-br {
		right: 32px;
		bottom: 32px;
		border-right: 2px solid rgba(245, 158, 11, 0.6);
		border-bottom: 2px solid rgba(245, 158, 11, 0.6);
	}

	.content {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100%;
		padding: 48px 58px 24px;
		color: #faf8f4;
	}

	.card-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 24px;
	}

	.brand {
		margin: 0;
		color: #f59e0b;
		font-size: 23px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.tagline {
		margin: 0;
		color: #948578;
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.question-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 18px 60px;
	}

	.question {
		margin: 0;
		font-weight: 700;
		color: #faf8f4;
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
	}

	.question span {
		display: block;
	}

	.card-bottom {
		display: grid;
		justify-items: center;
		gap: 14px;
	}

	.rule {
		width: 56px;
		height: 3px;
		border-radius: 1.5px;
		background: rgba(245, 158, 11, 0.85);
	}

	.url {
		margin: 0;
		color: #a8a095;
		font-size: 20px;
		font-weight: 600;
		text-align: center;
	}

	.strip {
		margin: 0;
		color: #948578;
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		text-align: center;
	}
</style>

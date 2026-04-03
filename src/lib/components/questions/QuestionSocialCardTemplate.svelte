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
	<img class="bg-image" src="/greek_pantheon.png" alt="" aria-hidden="true" />
	<div class="overlay"></div>
	<div class="glow"></div>

	<div class="content">
		<p class="brand">9takes</p>
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
		<p class="url">{safeQuestionUrl}</p>
	</div>
</div>

<style>
	.question-social-card {
		position: relative;
		overflow: hidden;
		border-radius: 24px;
		background: #10111f;
		font-family: 'Noticia Text', 'Georgia', 'Times New Roman', serif;
	}

	.bg-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.02);
	}

	.overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(10, 13, 32, 0.68) 0%,
			rgba(9, 10, 20, 0.82) 62%,
			rgba(8, 9, 18, 0.9) 100%
		);
	}

	.glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 20%, rgba(162, 105, 255, 0.24) 0%, transparent 52%);
	}

	.content {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: 100%;
		padding: 46px 62px 38px;
		color: #f6f3ff;
	}

	.brand {
		margin: 0;
		font-family: 'Space Grotesk', 'Helvetica Neue', sans-serif;
		font-size: 26px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
	}

	.question-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 18px 30px;
	}

	.question {
		margin: 0;
		font-weight: 700;
		color: #fdf8ff;
		text-shadow:
			0 2px 10px rgba(0, 0, 0, 0.55),
			0 0 28px rgba(96, 44, 172, 0.35);
	}

	.question span {
		display: block;
	}

	.url {
		margin: 0;
		font-family: 'Space Grotesk', 'Helvetica Neue', sans-serif;
		font-size: 24px;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: rgba(245, 236, 255, 0.94);
		text-align: center;
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.55);
	}
</style>

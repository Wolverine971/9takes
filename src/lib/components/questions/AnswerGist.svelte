<!-- src/lib/components/questions/AnswerGist.svelte -->
<!--
  "The gist so far" (T-43): an AI paraphrase of how people answered, written
  for search engines. The server sends it only to IP-verified Googlebot, never
  to a human (DJ 2026-10-09: readers see the takes, not a summary of them), so
  this component never decides who sees it.

  Markup contract (answerGist.ts + answerGistContract.spec.ts):
  * the root keeps the static class "answer-gist", which the page's paywall
    JSON-LD targets with cssSelector ".answer-gist";
  * data-nosnippet stays on the root in the server-rendered HTML, so Google
    may index the text but never quotes it in a snippet or AI Overview;
  * nothing here is hidden with CSS: Googlebot sees what an unlocked reader
    sees.
-->
<script lang="ts">
	import type { AnswerSummary } from '$lib/types/questions';
	import { describeGistSource } from './answerGist';

	let { gist }: { gist: AnswerSummary } = $props();

	let paragraphs = $derived(
		gist.summary
			.split(/\n{2,}/)
			.map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
			.filter(Boolean)
	);
</script>

<section class="answer-gist" data-nosnippet aria-labelledby="answer-gist-title">
	<p class="answer-gist__kicker">The gist so far</p>
	<h3 id="answer-gist-title" class="answer-gist__title">How everyone else answered</h3>
	{#each paragraphs as paragraph, index (index)}
		<p class="answer-gist__body">{paragraph}</p>
	{/each}
	<p class="answer-gist__meta">{describeGistSource(gist.sourceCommentCount)}</p>
</section>

<style>
	.answer-gist {
		display: grid;
		gap: 0.55rem;
		min-width: 0;
		margin: 0 1rem 1.25rem;
		padding: 0.15rem 0 0.15rem 1rem;
		border-left: 2px solid var(--lamp-glow);
	}

	.answer-gist__kicker {
		margin: 0;
		color: var(--lamp-glow);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.64rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.answer-gist__title {
		margin: 0;
		color: var(--ink-bright);
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.answer-gist__body {
		margin: 0;
		color: var(--ink-bright);
		font-size: 0.95rem;
		line-height: 1.6;
		overflow-wrap: anywhere;
	}

	.answer-gist__meta {
		margin: 0.1rem 0 0;
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.6rem;
		letter-spacing: 0.04em;
	}
</style>

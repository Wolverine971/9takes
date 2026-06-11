<!-- src/lib/components/blog/FAQSection.svelte -->
<!-- FAQSection.svelte - Reusable FAQ component for cluster/index pages -->
<script lang="ts">
	import type { FAQItem } from '$lib/types/faq';
	import SectionKicker from '$lib/components/atoms/SectionKicker.svelte';

	export let faqs: FAQItem[];
	export let title: string = 'Frequently Asked Questions';
	export let sectionId: string = 'faq';
	// §NN kicker number. Listing pages run a numbered-section grammar
	// (§01–§06); FAQ used to render without one, so the sequence visibly
	// skipped a number (design audit 2026-06-09). When set, the standard
	// kicker replaces the old "?" icon badge.
	export let num: string = '';
</script>

<section class="faq-section" id={sectionId}>
	<div class="section-header">
		<div class="section-title-group">
			{#if !num}
				<span class="section-icon">?</span>
			{/if}
			<div>
				{#if num}
					<div class="faq-kicker">
						<SectionKicker {num} label="FAQ" />
					</div>
				{/if}
				<h2>{title}</h2>
				<p class="section-subtitle">Quick answers to common questions</p>
			</div>
		</div>
	</div>

	<div class="faq-list">
		{#each faqs as faq}
			<details class="faq-item" id={faq.anchor || undefined}>
				<summary class="faq-question">
					<span class="question-text">{faq.question}</span>
					<span class="toggle-icon"></span>
				</summary>
				<div class="faq-answer">
					<p>{faq.answer}</p>
				</div>
			</details>
		{/each}
	</div>
</section>

<style lang="scss">
	.faq-section {
		/* Self-contained max-width + horizontal padding: index-page wrappers
		   (enneagram-corner, community, how-to-guides) zero out their own
		   side padding and delegate centering to this component. Without it
		   the FAQ ran edge-to-edge and hugged the left (design audit
		   2026-06-11). */
		max-width: 820px;
		margin: 0 auto 3.5rem;
		padding: 0 1.5rem;
		scroll-margin-top: 80px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid color-mix(in srgb, var(--ink-dim) 15%, transparent);
		gap: 1rem;
	}

	.section-title-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.faq-kicker {
		margin-bottom: 0.4rem;
	}

	.section-icon {
		font-size: 1.25rem;
		width: 2.25rem;
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--lamp-soft);
		border-radius: 0.625rem;
		border: 1px solid var(--lamp-soft);
		color: var(--lamp-glow);
		font-weight: 700;
	}

	.section-title-group h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--ink-bright);
		margin: 0;
		line-height: 1.3;
	}

	.section-subtitle {
		font-size: 0.8125rem;
		color: var(--ink-dim);
		margin: 0.125rem 0 0;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.faq-item {
		/* --stone-warm is the canonical raised-card surface (white in light
		   mode, warm-brown in dark). Using --night-deep made cards collapse
		   into the section background in light mode — see design audit
		   2026-06-11. */
		background: var(--stone-warm);
		border: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);
		border-radius: 0.625rem;
		overflow: hidden;
		box-shadow: 0 1px 2px color-mix(in srgb, var(--ink-bright) 6%, transparent);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			border-color: var(--lamp-glow-rgba);
			box-shadow: 0 2px 8px color-mix(in srgb, var(--ink-bright) 9%, transparent);
		}

		&[open] {
			border-color: var(--lamp-glow-rgba);

			.faq-question {
				border-bottom: 1px solid color-mix(in srgb, var(--ink-dim) 22%, transparent);
			}

			.toggle-icon::after {
				transform: rotate(180deg);
			}
		}
	}

	.faq-question {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.25rem;
		cursor: pointer;
		list-style: none;
		transition: background 0.2s ease;

		&::-webkit-details-marker {
			display: none;
		}

		&:hover {
			background: color-mix(in srgb, var(--lamp-glow) 5%, transparent);
		}
	}

	.question-text {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--ink-bright);
		line-height: 1.4;
	}

	.toggle-icon {
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;

		&::after {
			content: '';
			width: 0.5rem;
			height: 0.5rem;
			border-right: 2px solid var(--ink-dim);
			border-bottom: 2px solid var(--ink-dim);
			transform: rotate(45deg);
			transition: transform 0.2s ease;
		}
	}

	.faq-answer {
		padding: 1rem 1.25rem 1.25rem;
		/* Inherit the card surface; the open-state divider on .faq-question
		   separates question from answer. */
		background: transparent;

		p {
			font-size: 0.9375rem;
			color: var(--ink-mid);
			line-height: 1.7;
			margin: 0;
		}
	}

	/* Responsive */
	@media (max-width: 640px) {
		.faq-section {
			margin-bottom: 2.5rem;
			padding: 0 1.25rem;
			scroll-margin-top: 70px;
		}

		.section-header {
			margin-bottom: 1rem;
			padding-bottom: 0.5rem;
		}

		.section-icon {
			font-size: 1rem;
			width: 1.75rem;
			height: 1.75rem;
		}

		.section-title-group h2 {
			font-size: 1.0625rem;
		}

		.section-subtitle {
			font-size: 0.75rem;
		}

		.faq-item {
			border-radius: 0.625rem;
		}

		.faq-question {
			padding: 0.875rem 1rem;
		}

		.question-text {
			font-size: 0.875rem;
		}

		.faq-answer {
			padding: 0.875rem 1rem 1rem;

			p {
				font-size: 0.875rem;
			}
		}
	}

	@media (max-width: 380px) {
		.section-title-group {
			gap: 0.5rem;
		}

		.section-title-group h2 {
			font-size: 0.9375rem;
		}

		.faq-question {
			padding: 0.75rem;
		}

		.question-text {
			font-size: 0.8125rem;
		}

		.faq-answer {
			padding: 0.75rem;

			p {
				font-size: 0.8125rem;
			}
		}
	}
</style>

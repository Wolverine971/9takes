<!-- src/lib/components/blog/FAQSection.svelte -->
<!-- FAQSection.svelte - Reusable FAQ component for cluster/index pages -->
<script lang="ts">
	import type { FAQItem } from '$lib/types/faq';

	interface Props {
		faqs: FAQItem[];
		title?: string;
		sectionId?: string;
	}

	let { faqs, title = 'Frequently Asked Questions', sectionId = 'faq' }: Props = $props();

	// One entry per question: personality pages pass FAQs from the database, and a
	// repeated question would break the keyed list.
	const uniqueFaqs = $derived(
		faqs.filter((faq, i) => faqs.findIndex((other) => other.question === faq.question) === i)
	);
</script>

<section class="faq-section" id={sectionId}>
	<div class="section-header">
		<div class="section-title-group">
			<div>
				<h2>{title}</h2>
				<p class="section-subtitle">Quick answers to common questions</p>
			</div>
		</div>
	</div>

	<div class="faq-list">
		{#each uniqueFaqs as faq (faq.question)}
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
		border-bottom: 1px solid var(--rule);
		gap: 1rem;
	}

	.section-title-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.section-title-group h2 {
		font-family: var(--font-talk);
		font-size: var(--font-size-xl);
		font-weight: 600;
		color: var(--text);
		margin: 0;
		line-height: 1.3;
	}

	.section-subtitle {
		font-size: var(--font-size-sm);
		color: var(--text-faint);
		margin: 0.125rem 0 0;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.faq-item {
		background: var(--surface);
		border: 1px solid var(--rule);
		border-radius: 10px;
		overflow: hidden;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			border-color: color-mix(in srgb, var(--accent) 45%, var(--rule));
		}

		&[open] {
			border-color: color-mix(in srgb, var(--accent) 55%, var(--rule));

			.faq-question {
				border-bottom: 1px solid var(--rule);
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
			background: var(--surface-raised);
		}
	}

	.question-text {
		font-size: var(--font-size-base);
		font-weight: 600;
		color: var(--text);
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
			border-right: 2px solid var(--text-faint);
			border-bottom: 2px solid var(--text-faint);
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
			font-size: var(--font-size-base);
			color: var(--text-muted);
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

		.section-title-group h2 {
			font-size: var(--font-size-lg);
		}

		.section-subtitle {
			font-size: var(--font-size-xs);
		}

		.faq-question {
			padding: 0.875rem 1rem;
		}

		.faq-answer {
			padding: 0.875rem 1rem 1rem;
		}
	}

	@media (max-width: 380px) {
		.section-title-group {
			gap: 0.5rem;
		}

		.section-title-group h2 {
			font-size: var(--font-size-base);
		}

		.faq-question {
			padding: 0.75rem;
		}

		.faq-answer {
			padding: 0.75rem;
		}
	}
</style>

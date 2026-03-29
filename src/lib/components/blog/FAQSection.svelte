<!-- src/lib/components/blog/FAQSection.svelte -->
<!-- FAQSection.svelte - Reusable FAQ component for cluster/index pages -->
<script lang="ts">
	import type { FAQItem } from '$lib/types/faq';

	export let faqs: FAQItem[];
	export let title: string = 'Frequently Asked Questions';
	export let sectionId: string = 'faq';
</script>

<section class="faq-section" id={sectionId}>
	<div class="section-header">
		<div class="section-title-group">
			<span class="section-icon">?</span>
			<div>
				<h2>{title}</h2>
				<p class="section-subtitle">Quick answers to common questions</p>
			</div>
		</div>
	</div>

	<div class="faq-list">
		{#each faqs as faq}
			<details class="faq-item">
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
		margin-bottom: 3.5rem;
		scroll-margin-top: 80px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid color-mix(in srgb, var(--text-tertiary) 15%, transparent);
		gap: 1rem;
	}

	.section-title-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.section-icon {
		font-size: 1.25rem;
		width: 2.25rem;
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-subtle);
		border-radius: 0.5rem;
		border: 1px solid var(--primary-subtle);
		color: var(--accent-light);
		font-weight: 700;
	}

	.section-title-group h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.3;
	}

	.section-subtitle {
		font-size: 0.8125rem;
		color: var(--text-tertiary);
		margin: 0.125rem 0 0;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.faq-item {
		background: var(--bg-deep);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 15%, transparent);
		border-radius: 0.75rem;
		overflow: hidden;
		transition: all 0.2s ease;

		&:hover {
			border-color: var(--primary-glow);
		}

		&[open] {
			border-color: var(--primary-glow);

			.faq-question {
				border-bottom: 1px solid color-mix(in srgb, var(--text-tertiary) 15%, transparent);
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
			background: color-mix(in srgb, var(--primary) 5%, transparent);
		}
	}

	.question-text {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text-primary);
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
			border-right: 2px solid var(--text-tertiary);
			border-bottom: 2px solid var(--text-tertiary);
			transform: rotate(45deg);
			transition: transform 0.2s ease;
		}
	}

	.faq-answer {
		padding: 1rem 1.25rem 1.25rem;
		background: var(--bg-surface);

		p {
			font-size: 0.9375rem;
			color: var(--text-secondary);
			line-height: 1.7;
			margin: 0;
		}
	}

	/* Responsive */
	@media (max-width: 640px) {
		.faq-section {
			margin-bottom: 2.5rem;
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
			border-radius: 0.5rem;
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

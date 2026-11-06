<!-- src/lib/components/blog/TestYourTypeCTA.svelte -->
<!--
  Inline below-fold CTA pointing readers at /enneagram-test.

  Bridges authority from blog content (/enneagram-corner, /pop-culture, and
  /personality-analysis) into the Enneagram test (T-42). Keep the default
  copy true to what the test does: self-pick, no scores, no email wall, and
  a friend link at the end.

  Bucket 3 — internal linking and graph bridging.
-->
<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';

	interface Props {
		heading?: string;
		body?: string;
		ctaLabel?: string;
		secondaryHref?: string | null;
		secondaryLabel?: string | null;
		compact?: boolean;
	}

	let {
		heading = "Don't know your type yet?",
		body = 'Take the free 9takes Enneagram test. It starts with the emotion that runs you, takes 5 to 10 minutes, needs no email, and lets someone who knows you check your result.',
		ctaLabel = 'Start the Enneagram test',
		secondaryHref = null,
		secondaryLabel = null,
		compact = false
	}: Props = $props();
</script>

<aside class={['test-cta', { compact }]} aria-labelledby="test-cta-heading">
	<h3 id="test-cta-heading" class="test-cta-heading">{heading}</h3>
	<p class="test-cta-body">{body}</p>
	<div class="test-cta-actions">
		<!-- Not mint: "test your type" is never the give-your-take action. -->
		<Button href="/enneagram-test" variant="primary" size="lg" data-track="blog-test-cta">
			{ctaLabel}
		</Button>
		{#if secondaryHref && secondaryLabel}
			<Button href={secondaryHref} variant="secondary" size="lg">{secondaryLabel}</Button>
		{/if}
	</div>
</aside>

<style lang="scss">
	.test-cta {
		margin: 2.5rem auto;
		max-width: 720px;
		padding: 1.5rem 1.75rem;
		border-radius: 1rem;
		background: var(--surface);
		border: 1px solid var(--rule);

		&.compact {
			margin: 1.5rem auto;
			padding: 1rem 1.25rem;
		}
	}

	.test-cta-heading {
		margin: 0 0 0.4rem 0;
		padding: 0;
		font-family: var(--font-talk);
		font-size: var(--font-size-xl);
		font-weight: 600;
		color: var(--text);
		letter-spacing: -0.01em;
	}

	.test-cta-body {
		margin: 0 0 1rem 0;
		font-size: var(--font-size-base);
		line-height: 1.55;
		color: var(--text-muted);
	}

	.test-cta-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-items: center;
	}
</style>

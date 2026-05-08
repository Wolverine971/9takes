<!-- src/lib/components/blog/TestYourTypeCTA.svelte -->
<!--
  Inline below-fold CTA pointing readers at /enneagram-test.

  Bridges authority from blog content (/enneagram-corner, /pop-culture, and
  /personality-analysis) into the typing quiz, which currently leaks
  internal authority despite being the highest-conversion touchpoint.

  Bucket 3 — internal linking and graph bridging.
-->
<script lang="ts">
	export let heading: string = "Don't know your type yet?";
	export let body: string =
		'Take the free 9takes Enneagram test — five minutes, no email wall, returns your dominant pattern with confidence scores.';
	export let ctaLabel: string = 'Start the Enneagram test';
	export let secondaryHref: string | null = null;
	export let secondaryLabel: string | null = null;
	export let compact: boolean = false;
</script>

<aside class="test-cta" class:compact aria-labelledby="test-cta-heading">
	<h3 id="test-cta-heading" class="test-cta-heading">{heading}</h3>
	<p class="test-cta-body">{body}</p>
	<div class="test-cta-actions">
		<a class="test-cta-primary" href="/enneagram-test" data-track="blog-test-cta">{ctaLabel}</a>
		{#if secondaryHref && secondaryLabel}
			<a class="test-cta-secondary" href={secondaryHref}>{secondaryLabel}</a>
		{/if}
	</div>
</aside>

<style lang="scss">
	.test-cta {
		margin: 2.5rem auto;
		max-width: 720px;
		padding: 1.5rem 1.75rem;
		border-radius: 12px;
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 30%, transparent);
		box-shadow: 0 0 18px color-mix(in srgb, var(--lamp-glow) 12%, transparent);

		&.compact {
			margin: 1.5rem auto;
			padding: 1rem 1.25rem;
		}
	}

	.test-cta-heading {
		margin: 0 0 0.4rem 0;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--ink-bright);
		letter-spacing: -0.01em;
	}

	.test-cta-body {
		margin: 0 0 1rem 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	.test-cta-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-items: center;
	}

	.test-cta-primary {
		display: inline-block;
		padding: 0.55rem 1.05rem;
		border-radius: 8px;
		font-weight: 600;
		font-size: 0.92rem;
		text-decoration: none;
		color: var(--night-deep);
		background: var(--lamp-glow);
		border: 1px solid var(--lamp-glow);
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease;

		&:hover {
			transform: translateY(-1px);
			box-shadow: 0 0 14px color-mix(in srgb, var(--lamp-glow) 50%, transparent);
		}
	}

	.test-cta-secondary {
		display: inline-block;
		padding: 0.55rem 0.9rem;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--lamp-glow);
		text-decoration: none;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 35%, transparent);

		&:hover {
			background: color-mix(in srgb, var(--lamp-glow) 12%, transparent);
		}
	}
</style>

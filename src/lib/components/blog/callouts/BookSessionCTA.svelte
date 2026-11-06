<!-- src/lib/components/blog/callouts/BookSessionCTA.svelte -->
<!--
  9takes — Decode Session CTA
  End-of-blog primary CTA. Funnels personality-analysis readers to /book-session
  with UTM attribution. Visually distinct from neutral InsightBox callouts.
  Cold Light (2026-11-06): --surface banner with an --accent bar; the button
  is the Button atom's `primary` (lavender). Booking is never mint: mint is
  reserved for giving your take.
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/atoms';

	type Props = {
		slug?: string;
		surface?: string;
	};

	let { slug = '', surface = 'personality_analysis' }: Props = $props();

	const bookHref = $derived.by((): `/book-session?${string}#waitlist` => {
		const params = new URLSearchParams({
			utm_source: 'blog',
			utm_medium: 'session_cta',
			utm_campaign: surface,
			...(slug ? { utm_content: slug } : {})
		});
		return `/book-session?${params.toString()}#waitlist`;
	});
</script>

<aside class="session-cta" aria-label="Book a 1:1 session">
	<div class="session-cta__accent" aria-hidden="true"></div>
	<div class="session-cta__content">
		<h3 class="session-cta__title">Want to take this further?</h3>
		<p class="session-cta__body">
			Book a 1:1 session with me. We can dig into yourself, into someone in your life who's hard to
			figure out, or both — they usually weave together. The same depth you just read, applied to
			the people you actually deal with (including you).
		</p>
		<p class="session-cta__body session-cta__body--emphasis">
			I love this kind of conversation. Let's have it.
		</p>
		<!-- `session-cta__button` opts out of blog.scss prose-link styling. -->
		<Button
			class="session-cta__button"
			variant="primary"
			size="lg"
			href={resolve(bookHref)}
			data-source={surface}
			data-slug={slug}
		>
			Book a session →
		</Button>
	</div>
</aside>

<style lang="scss">
	.session-cta {
		position: relative;
		margin: 2.5rem 0 2rem;
		padding: 1.75rem 2rem 2rem 2.25rem;
		border-radius: 1rem;
		background: var(--surface);
		border: 1px solid var(--rule);
		overflow: hidden;
	}

	.session-cta__accent {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: var(--accent);
	}

	.session-cta__content {
		position: relative;
	}

	/* Anchor the CTA's typography to its shell so article-level :global(h3/p/a)
	   rules cannot restyle this embedded conversion banner. Under 40px, so
	   Archivo semibold, not Anton. */
	.session-cta .session-cta__title {
		font-family: var(--font-talk);
		font-size: 1.4rem;
		font-weight: 600;
		color: var(--text);
		margin: 0 0 0.875rem;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	.session-cta .session-cta__body {
		font-family: var(--font-talk);
		font-size: var(--font-size-base);
		line-height: 1.7;
		color: var(--text-muted);
		margin: 0 0 0.875rem;
	}

	/* The second line is DJ's own voice: Playfair italic, lavender. */
	.session-cta .session-cta__body--emphasis {
		font-family: var(--font-voice);
		font-size: var(--font-size-lg);
		color: var(--highlight);
		font-style: italic;
		margin-bottom: 1.5rem;
	}

	.session-cta :global(.session-cta__button) {
		min-height: 48px;
	}

	@media (max-width: 640px) {
		.session-cta {
			margin: 2rem 0 1.5rem;
			padding: 1.25rem 1.25rem 1.5rem 1.5rem;
		}

		.session-cta .session-cta__title {
			font-size: var(--font-size-xl);
		}

		.session-cta :global(.session-cta__button) {
			width: 100%;
		}
	}
</style>

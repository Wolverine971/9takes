<!-- src/lib/components/blog/callouts/BookSessionCTA.svelte -->
<!--
  9takes — Decode Session CTA
  End-of-blog primary CTA. Funnels personality-analysis readers to /book-session
  with UTM attribution. Visually distinct from neutral InsightBox callouts.
-->
<script lang="ts">
	type Props = {
		slug?: string;
		surface?: string;
	};

	let { slug = '', surface = 'personality_analysis' }: Props = $props();

	const bookHref = $derived.by(() => {
		const params = new URLSearchParams({
			utm_source: 'blog',
			utm_medium: 'session_cta',
			utm_campaign: surface
		});
		if (slug) params.set('utm_content', slug);
		return `/book-session?${params.toString()}#waitlist`;
	});
</script>

<aside class="session-cta" aria-label="Book a 1:1 session">
	<div class="session-cta__accent"></div>
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
		<a class="session-cta__button" href={bookHref} data-source={surface} data-slug={slug}>
			Book a session →
		</a>
	</div>
</aside>

<style lang="scss">
	.session-cta {
		position: relative;
		margin: 2.5rem 0 2rem;
		padding: 1.75rem 2rem 2rem 2.25rem;
		border-radius: 14px;
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
		border: 1px solid var(--primary-subtle);
		box-shadow:
			0 8px 28px rgba(0, 0, 0, 0.32),
			0 0 0 1px var(--primary-subtle),
			0 0 36px var(--primary-glow);
		overflow: hidden;
	}

	.session-cta__accent {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 5px;
		background: linear-gradient(180deg, var(--lamp-glow) 0%, var(--lamp-glow) 100%);
		border-radius: 14px 0 0 14px;
	}

	.session-cta__content {
		position: relative;
	}

	.session-cta__title {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--lamp-glow);
		margin: 0 0 0.875rem;
		line-height: 1.3;
		letter-spacing: -0.01em;
	}

	.session-cta__body {
		font-size: 1rem;
		line-height: 1.7;
		color: var(--ink-mid);
		margin: 0 0 0.875rem;

		&--emphasis {
			color: var(--ink-bright);
			font-style: italic;
			margin-bottom: 1.5rem;
		}
	}

	.session-cta__button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1.5rem;
		background: var(--lamp-glow);
		color: var(--night-deep);
		font-weight: 600;
		font-size: 1rem;
		border-radius: 8px;
		text-decoration: none;
		transition: all 0.2s ease;
		box-shadow: 0 4px 14px var(--primary-glow);

		&:hover {
			background: var(--lamp-glow);
			transform: translateY(-1px);
			box-shadow: 0 6px 20px var(--primary-glow);
		}

		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}
	}

	@media (max-width: 640px) {
		.session-cta {
			margin: 2rem 0 1.5rem;
			padding: 1.25rem 1.25rem 1.5rem 1.5rem;
			border-radius: 12px;
		}

		.session-cta__title {
			font-size: 1.2rem;
		}

		.session-cta__body {
			font-size: 0.95rem;
		}

		.session-cta__button {
			width: 100%;
			justify-content: center;
		}
	}
</style>

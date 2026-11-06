<!-- src/lib/components/marketing/home/HomeFaq.svelte -->
<!-- "Before you post": the answers a first-time visitor needs before writing a take. -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import PosterHeading from './PosterHeading.svelte';
</script>

<section class="section" aria-labelledby="faq-title">
	<div class="wrap faq-grid">
		<PosterHeading id="faq-title" big="Before" ital="you post" />
		<div>
			<div class="faq">
				<div>
					<h3>What's a take?</h3>
					<p>Your honest answer to the question, in your own words. Three words counts.</p>
				</div>
				<div>
					<h3>Do I need an account?</h3>
					<p>
						No. Most takes on 9takes are posted without one. Make one later if you want to keep
						track of yours.
					</p>
				</div>
				<div>
					<h3>What's anonymous?</h3>
					<p>
						Without an account, your name and email are never shown and your take appears with no
						type. Signed in, it posts from your account with the type on your profile.
					</p>
				</div>
				<div>
					<h3>Who reads what I post?</h3>
					<p>
						DJ, who built 9takes, reads new takes and removes spam, attacks, and anything that
						identifies someone.
					</p>
				</div>
				<div>
					<h3>Why answer first?</h3>
					<p>
						So the first take you read can't steer yours. You get the honest version from everyone,
						not the loudest one repeated.
					</p>
				</div>
				<div>
					<h3>Having a hard time?</h3>
					<p>
						9takes isn't a crisis line. In the US, call or text 988. Anywhere else,
						<a href="https://findahelpline.com" rel="noopener noreferrer">findahelpline.com</a> lists
						free, confidential lines.
					</p>
				</div>
			</div>
			<p class="faq-help">
				<a href={resolve('/posting-and-privacy')} data-track="link" data-placement="faq"
					>Posting &amp; privacy</a
				>
				<span aria-hidden="true">·</span>
				<a
					href={resolve('/posting-and-privacy#community-guidelines')}
					data-track="link"
					data-placement="faq">Community guidelines</a
				>
			</p>
		</div>
	</div>
</section>

<style>
	.wrap {
		max-width: 1240px;
		margin: 0 auto;
		padding-inline: max(24px, env(safe-area-inset-left, 0px))
			max(24px, env(safe-area-inset-right, 0px));
	}
	.section {
		/* Undo the global section/article element styles. */
		margin: 0;
		padding-inline: 0;
		border-radius: 0;
		padding-block: 88px;
		border-top: 1px solid var(--rule);
	}
	.faq-grid {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr);
		align-items: start;
		gap: 40px 72px;
	}
	.faq {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 44px;
	}
	.faq > div {
		min-width: 0;
		padding: 20px 0;
		border-top: 1px solid var(--rule);
	}
	h3 {
		margin: 0 0 6px;
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--text);
	}
	p {
		margin: 0;
		font-size: var(--font-size-base);
		color: var(--text-muted);
	}
	a {
		color: var(--highlight);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.faq-help {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 10px;
		padding-top: 20px;
		border-top: 1px solid var(--rule);
		font-size: var(--font-size-sm);
	}
	.faq-help a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
	}
	.faq-help span {
		align-self: center;
	}

	@media (max-width: 980px) {
		.section {
			padding-block: 64px;
		}
		.faq-grid {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 520px) {
		.faq {
			grid-template-columns: 1fr;
		}
	}
</style>

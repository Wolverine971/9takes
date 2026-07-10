<!-- src/routes/+error.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/atoms';

	let isNotFound = $derived($page.status === 404);
	let title = $derived(isNotFound ? 'That page is not here' : 'Something went sideways');
	let description = $derived(
		isNotFound
			? 'The link may be old, or the page may have moved. Pick a clear route back into 9takes.'
			: 'The page could not be completed right now. You can keep exploring while we straighten it out.'
	);
</script>

<svelte:head>
	<title>{isNotFound ? 'Page not found' : 'Page error'} | 9takes</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="error-page" aria-labelledby="error-title">
	<div class="error-card">
		<p class="error-kicker">ERROR · {$page.status}</p>

		<div class="error-mark" aria-hidden="true">
			<svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
				<circle cx="32" cy="32" r="25"></circle>
				<path d="M32 18v18"></path>
				<path d="M32 45h.01"></path>
			</svg>
		</div>

		<h1 id="error-title">{title}</h1>
		<p class="error-description">{description}</p>

		<nav class="error-actions" aria-label="Error recovery">
			<Button href="/" size="lg" class="error-action">Go home</Button>
			<Button href="/questions" variant="secondary" size="lg" class="error-action">
				Browse questions
			</Button>
			<Button href="/search" variant="ghost" size="lg" class="error-action">Search 9takes</Button>
		</nav>

		<p class="error-footnote">
			If this keeps happening, email
			<a href="mailto:usersup@9takes.com">usersup@9takes.com</a>.
		</p>
	</div>
</section>

<style lang="scss">
	.error-page {
		display: grid;
		min-height: min(72vh, 48rem);
		place-items: center;
		padding: var(--space-2xl) var(--space-lg) var(--space-3xl);
	}

	.error-card {
		width: min(100%, 44rem);
		padding: clamp(1.5rem, 5vw, 3rem);
		border: 1px solid var(--stone-edge);
		border-top: 3px solid var(--error-text);
		border-radius: 1rem;
		background: var(--stone-warm);
		text-align: center;
	}

	.error-kicker {
		margin: 0 0 var(--space-xl);
		color: var(--error-text);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-bold);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.error-mark {
		display: inline-flex;
		width: 4rem;
		height: 4rem;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--space-lg);
		color: var(--error-text);
	}

	.error-mark svg {
		width: 100%;
		height: 100%;
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	h1 {
		margin: 0;
		padding: 0;
		color: var(--ink-bright);
		font-size: clamp(2rem, 7vw, 3.5rem);
		line-height: 1.05;
	}

	.error-description {
		max-width: 36rem;
		margin: var(--space-lg) auto 0;
		color: var(--ink-mid);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
	}

	.error-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-md);
		margin-top: var(--space-2xl);
	}

	.error-footnote {
		margin: var(--space-xl) 0 0;
		color: var(--ink-dim);
		font-size: var(--font-size-sm);
	}

	.error-footnote a {
		color: var(--lamp-glow);
		font-weight: var(--font-weight-semibold);
		text-underline-offset: 0.2em;
	}

	.error-footnote a:hover {
		color: var(--lamp-light);
	}

	:global(.error-footnote a:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 3px;
	}

	@media (max-width: 640px) {
		.error-page {
			min-height: 65vh;
			padding-inline: var(--space-sm);
		}

		.error-card {
			padding: var(--space-xl) var(--space-lg);
		}

		.error-actions {
			align-items: stretch;
			flex-direction: column;
		}

		:global(.error-action) {
			width: 100%;
		}
	}
</style>

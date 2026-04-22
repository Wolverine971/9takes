<!-- src/routes/thanks-for-staying/+page.svelte -->
<svelte:head>
	<title>Thanks for staying - 9takes</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="confirmation">
	<a class="brand" href="/">9takes</a>
	<h1>Cool, see you around.</h1>
	<p>You are still on the 9takes email list.</p>
	<a class="button" href="/questions">Browse current questions</a>
</main>

<style>
	.confirmation {
		width: min(100% - 2rem, 34rem);
		margin: 8rem auto;
		color: var(--text-primary);
	}

	.brand {
		display: inline-block;
		margin-bottom: 2rem;
		color: var(--text-primary);
		font-weight: 700;
		text-decoration: none;
	}

	h1 {
		margin: 0 0 1rem;
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1.05;
	}

	p {
		margin: 0 0 1.5rem;
		color: var(--text-secondary);
		font-size: 1.05rem;
		line-height: 1.6;
	}

	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.75rem;
		padding: 0 1rem;
		border-radius: 0.375rem;
		background: var(--text-primary);
		color: var(--bg-base);
		font-weight: 650;
		text-decoration: none;
	}
</style>

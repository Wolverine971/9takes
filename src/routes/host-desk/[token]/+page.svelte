<!-- src/routes/host-desk/[token]/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Textarea } from '$lib/components/atoms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const ready = $derived(data.state === 'ready' ? data : null);
	// A successful action returns the refreshed draft; prefer it over the load.
	const draft = $derived(form?.draft ?? ready?.draft ?? null);
	const posted = $derived(
		Boolean(form?.success && form?.action === 'post') || draft?.status === 'posted'
	);
	const skipped = $derived(
		!posted && (Boolean(form?.success && form?.action === 'skip') || draft?.status === 'skipped')
	);

	// A failed post echoes the typed text back so nothing is lost.
	const echoedText = $derived(
		form && 'text' in form && typeof form.text === 'string' ? form.text : null
	);

	// Seeded server-side so the draft is visible before hydration.
	let text = $state(data.state === 'ready' ? data.initialText : '');
	let showEditor = $state(data.state === 'ready' ? data.variant !== 'skip' : true);
	let submitting = $state<'post' | 'skip' | null>(null);

	$effect(() => {
		if (echoedText !== null) text = echoedText;
	});

	function useDraft(value: string) {
		text = value;
		showEditor = true;
	}
</script>

<svelte:head>
	<title>Host desk | 9takes</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="desk">
	{#if data.state === 'invalid'}
		<section class="card">
			<p class="eyebrow">Host desk</p>
			<h1>This link is not valid anymore</h1>
			<p class="muted">Links expire after seven days. Open the desk instead.</p>
			<Button href="/admin/host-desk" variant="secondary" fullWidth>Open the host desk</Button>
		</section>
	{:else if data.state === 'missing' || !draft}
		<section class="card">
			<p class="eyebrow">Host desk</p>
			<h1>That draft is gone</h1>
			<p class="muted">The take may have been removed.</p>
			<Button href="/admin/host-desk" variant="secondary" fullWidth>Open the host desk</Button>
		</section>
	{:else}
		<section class="card">
			<p class="eyebrow">
				{#if draft.questionHref}
					<a href={draft.questionHref}>{draft.question?.text || 'Question'}</a>
				{:else}
					{draft.question?.text || 'Question'}
				{/if}
			</p>

			{#if draft.take?.parent_text}
				<p class="muted small">Replying to: {draft.take.parent_text}</p>
			{/if}

			<blockquote class="take">{draft.take?.text ?? ''}</blockquote>
			<p class="muted small">
				{draft.authorLabel}
				{#if draft.take?.removed}
					· take removed
				{/if}
			</p>
		</section>

		{#if form?.message}
			<p class="notice error" role="status">{form.message}</p>
		{/if}

		{#if posted}
			<section class="card">
				<p class="eyebrow">Posted</p>
				<h1>Live as you</h1>
				<blockquote class="reply">{draft.postedText ?? text}</blockquote>
				{#if draft.questionHref}
					<Button href={draft.questionHref} fullWidth>See it on the question</Button>
				{/if}
				<p class="muted small center"><a href="/admin/host-desk">Back to the desk</a></p>
			</section>
		{:else if draft.take?.removed}
			<section class="card">
				<p class="muted">Nothing to reply to. This one is done.</p>
			</section>
		{:else}
			<section class="card">
				{#if skipped}
					<p class="notice" role="status">Skipped. You can still reply if you change your mind.</p>
				{/if}

				{#if showEditor}
					<form
						method="POST"
						action="?/post"
						use:enhance={() => {
							submitting = 'post';
							return async ({ update }) => {
								await update({ reset: false });
								submitting = null;
							};
						}}
					>
						<label class="field">
							<span class="label">Your reply</span>
							<Textarea
								name="text"
								rows={5}
								maxlength={5000}
								bind:value={text}
								placeholder="type it how you'd say it"
								required
							/>
						</label>

						<div class="chips" aria-label="Start from a draft">
							<button
								type="button"
								class="chip"
								class:active={text === draft.draftA}
								onclick={() => useDraft(draft.draftA)}>Draft A</button
							>
							<button
								type="button"
								class="chip"
								class:active={text === draft.draftB}
								onclick={() => useDraft(draft.draftB)}>Draft B</button
							>
							<button
								type="button"
								class="chip"
								class:active={text === ''}
								onclick={() => useDraft('')}>Blank</button
							>
						</div>

						<Button type="submit" size="lg" fullWidth loading={submitting === 'post'}>
							Post as DJ
						</Button>
					</form>
				{:else}
					<p class="muted">Skip this one? It stays in the desk as skipped.</p>
					<Button variant="secondary" fullWidth onclick={() => (showEditor = true)}>
						Reply instead
					</Button>
				{/if}

				{#if !skipped}
					<form
						method="POST"
						action="?/skip"
						class="skip-form"
						use:enhance={() => {
							submitting = 'skip';
							return async ({ update }) => {
								await update({ reset: false });
								submitting = null;
							};
						}}
					>
						<Button
							type="submit"
							variant={showEditor ? 'ghost' : 'primary'}
							fullWidth
							loading={submitting === 'skip'}
						>
							Skip this one
						</Button>
					</form>
				{/if}
			</section>
		{/if}
	{/if}
</main>

<style>
	.desk {
		display: grid;
		gap: 1rem;
		width: 100%;
		max-width: 34rem;
		margin: 0 auto;
		padding: 1.25rem 1rem 4rem;
		color: var(--ink-bright);
	}

	.card {
		display: grid;
		gap: 0.85rem;
		padding: 1.1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--stone-warm);
	}

	h1 {
		margin: 0;
		font-size: 1.35rem;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	p {
		margin: 0;
	}

	.eyebrow {
		font-family: var(--font-mono, monospace);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	.eyebrow a {
		color: inherit;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2rem;
	}

	.muted {
		color: var(--ink-dim);
		line-height: 1.5;
	}

	.small {
		font-size: 0.85rem;
	}

	.center {
		text-align: center;
	}

	.take,
	.reply {
		margin: 0;
		padding: 0.9rem 1rem;
		border-left: 3px solid var(--lamp-glow);
		border-radius: 10px;
		background: var(--stone-mid);
		font-size: 1.05rem;
		line-height: 1.5;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.reply {
		border-left-color: var(--data-teal);
	}

	.field {
		display: grid;
		gap: 0.4rem;
	}

	.label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-mid);
	}

	form {
		display: grid;
		gap: 0.85rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip {
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		background: transparent;
		color: var(--ink-mid);
		font: inherit;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.chip.active {
		border-color: var(--lamp-glow);
		background: var(--lamp-soft);
		color: var(--ink-bright);
	}

	.skip-form {
		margin-top: 0.25rem;
	}

	.notice {
		padding: 0.75rem 0.9rem;
		border-radius: 10px;
		background: var(--lamp-soft);
		color: var(--ink-bright);
		font-size: 0.9rem;
	}

	.notice.error {
		border: 1px solid var(--lamp-deep);
	}
</style>

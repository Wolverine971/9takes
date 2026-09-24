<!-- src/routes/talk/reply/[token]/+page.svelte -->
<script lang="ts">
	import { Button } from '$lib/components/atoms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const reply = $derived(data.reply);

	function formatDate(value: string | null): string {
		if (!value) return '';
		return new Date(value).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function paragraphs(text: string | null): string[] {
		return (text ?? '')
			.split(/\n{2,}/)
			.map((part) => part.trim())
			.filter(Boolean);
	}
</script>

<svelte:head>
	<title>DJ’s reply | 9takes</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="reply-page">
	<div class="reply-container">
		{#if reply}
			<header class="reply-head">
				<img
					src="/brand/djface.webp"
					alt="DJ Wayne"
					class="reply-photo"
					width="64"
					height="64"
					decoding="async"
				/>
				<div>
					<p class="reply-eyebrow">DJ’s reply</p>
					<h1>{reply.name ? `Hey ${reply.name}.` : 'Hey.'}</h1>
					<p class="reply-date">{formatDate(reply.repliedAt)}</p>
				</div>
			</header>

			<section class="reply-card" aria-label="DJ’s reply">
				{#if reply.replyAudioUrl}
					<audio controls preload="metadata" src={reply.replyAudioUrl}></audio>
				{/if}
				{#each paragraphs(reply.replyText) as paragraph, index (index)}
					<p>{paragraph}</p>
				{/each}
				<p class="reply-sign">DJ</p>
			</section>

			<details class="reply-original">
				<summary>Your note from {formatDate(reply.noteCreatedAt)}</summary>
				{#each paragraphs(reply.noteBody) as paragraph, index (index)}
					<p>{paragraph}</p>
				{/each}
			</details>

			<div class="reply-actions">
				<p>Want to keep going? Reply to my email, or leave another note.</p>
				<Button href="/book-session" variant="secondary">Leave another note</Button>
			</div>
		{:else}
			<section class="reply-card reply-card--empty">
				<h1>This link isn’t working.</h1>
				<p>It may be mistyped, or the reply was removed. You can always leave DJ a new note.</p>
				<Button href="/book-session">Talk to DJ</Button>
			</section>
		{/if}
	</div>
</div>

<style>
	.reply-page {
		min-height: 100vh;
		background: var(--night-deep);
	}

	.reply-container {
		display: flex;
		width: min(100%, 40rem);
		box-sizing: border-box;
		flex-direction: column;
		gap: 1.5rem;
		margin: 0 auto;
		padding: 2.5rem 1rem 4rem;
	}

	.reply-head {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.reply-photo {
		width: 4rem;
		height: 4rem;
		border: 2px solid color-mix(in srgb, var(--lamp-glow) 55%, var(--stone-edge));
		border-radius: 999px;
		object-fit: cover;
	}

	.reply-eyebrow {
		margin: 0;
		color: var(--lamp-glow);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.reply-head h1,
	.reply-card--empty h1 {
		margin: 0.15rem 0 0;
		color: var(--ink-bright);
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 6vw, 2.25rem);
		line-height: 1.15;
	}

	.reply-date {
		margin: 0.2rem 0 0;
		color: var(--ink-dim);
		font-size: 0.8125rem;
	}

	.reply-card {
		display: grid;
		gap: 0.875rem;
		padding: 1.5rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-mid);
	}

	.reply-card audio {
		width: 100%;
	}

	.reply-card p,
	.reply-original p {
		margin: 0;
		color: var(--ink-mid);
		line-height: 1.65;
	}

	.reply-card .reply-sign {
		color: var(--ink-bright);
		font-weight: 700;
	}

	.reply-original {
		padding: 1rem 1.25rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
	}

	.reply-original summary {
		color: var(--ink-dim);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
	}

	.reply-original p {
		margin-top: 0.75rem;
		font-size: 0.9375rem;
	}

	.reply-actions {
		display: grid;
		justify-items: start;
		gap: 0.75rem;
	}

	.reply-actions p {
		margin: 0;
		color: var(--ink-dim);
		font-size: 0.9375rem;
	}

	.reply-card--empty {
		justify-items: start;
	}
</style>

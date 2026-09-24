<!-- src/routes/admin/consulting/notes/+page.svelte -->
<script lang="ts">
	import TalkNoteCard from '$lib/components/admin/TalkNoteCard.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const views = [
		{ key: 'open', label: 'New' },
		{ key: 'replied', label: 'Replied' },
		{ key: 'archived', label: 'Archived' },
		{ key: 'all', label: 'All' }
	] as const;

	const result = $derived(
		(form ?? null) as {
			noteId?: string;
			message?: string;
			replied?: boolean;
			emailSent?: boolean;
		} | null
	);
</script>

<svelte:head>
	<title>Notes | Admin | 9takes</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="notes-page">
	<div class="notes-header">
		<div>
			<h1>Notes</h1>
			<p>
				Notes left on <a href="/book-session" target="_blank" rel="noopener">Talk to DJ</a>. Reply
				with text or your own voice note. Anonymous notes have no email, so you can only read them.
			</p>
		</div>
	</div>

	<nav class="notes-tabs" aria-label="Filter notes">
		{#each views as view (view.key)}
			<a
				href={`?view=${view.key}`}
				class={['notes-tab', data.filter === view.key && 'notes-tab--active']}
				aria-current={data.filter === view.key ? 'page' : undefined}
			>
				{view.label}
			</a>
		{/each}
	</nav>

	{#if data.loadError}
		<p class="notes-empty notes-empty--error">{data.loadError}</p>
	{:else if data.notes.length === 0}
		<p class="notes-empty">Nothing here yet.</p>
	{:else}
		<div class="notes-list">
			{#each data.notes as note (note.id)}
				<TalkNoteCard {note} {result} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.notes-page {
		display: grid;
		gap: 1.25rem;
	}

	.notes-header h1 {
		margin: 0 0 0.25rem;
		color: var(--ink-bright);
		font-size: 1.5rem;
	}

	.notes-header p {
		margin: 0;
		color: var(--ink-dim);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.notes-header a {
		color: var(--lamp-light);
	}

	.notes-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.notes-tab {
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		color: var(--ink-mid);
		font-size: 0.8125rem;
		font-weight: 600;
		text-decoration: none;
	}

	.notes-tab--active {
		border-color: var(--lamp-glow);
		background: var(--lamp-soft);
		color: var(--lamp-light);
	}

	.notes-list {
		display: grid;
		gap: 1rem;
	}

	.notes-empty {
		margin: 0;
		padding: 2rem;
		border: 1px dashed var(--stone-edge);
		border-radius: 16px;
		color: var(--ink-dim);
		text-align: center;
	}

	.notes-empty--error {
		color: var(--error-text);
	}
</style>

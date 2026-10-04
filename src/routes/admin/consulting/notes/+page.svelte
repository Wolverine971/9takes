<!-- src/routes/admin/consulting/notes/+page.svelte -->
<script lang="ts">
	import TalkNoteCard from '$lib/components/admin/TalkNoteCard.svelte';
	import { markTalkNotesViewed } from '$lib/admin/talkNotesViewed';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Everything on screen counts as read once the tab is actually visible. This runs after
	// render, never in the load, so a preload can't mark notes seen. It re-runs whenever the
	// list changes: switching tabs (same component, no remount) or the refresh after a reply.
	const markedIds = new Set<string>();
	$effect(() => {
		const unseen = data.notes
			.filter((note) => !note.viewedAt && !markedIds.has(note.id))
			.map((note) => note.id);
		if (unseen.length === 0) return;

		const markWhenVisible = () => {
			if (document.visibilityState !== 'visible') return;
			document.removeEventListener('visibilitychange', markWhenVisible);
			for (const id of unseen) markedIds.add(id);
			void markTalkNotesViewed(unseen).then((saved) => {
				// Let the next list change retry.
				if (!saved) for (const id of unseen) markedIds.delete(id);
			});
		};
		document.addEventListener('visibilitychange', markWhenVisible);
		markWhenVisible();
		return () => document.removeEventListener('visibilitychange', markWhenVisible);
	});

	const views = [
		{ key: 'open', label: 'Open' },
		{ key: 'replied', label: 'Replied' },
		{ key: 'archived', label: 'Archived' },
		{ key: 'all', label: 'All' }
	] as const;

	const tabCounts = $derived<Record<string, number | null>>({
		open: data.overview?.newCount ?? null,
		replied: data.overview?.repliedCount ?? null,
		archived: data.overview?.archivedCount ?? null,
		all: data.overview?.totalCount ?? null
	});

	const stats = $derived(
		data.overview
			? [
					{
						label: 'Open',
						value: data.overview.newCount,
						highlight: data.overview.unseenCount > 0
					},
					{ label: 'Replied', value: data.overview.repliedCount },
					{ label: 'Total notes', value: data.overview.totalCount },
					{ label: 'Left an email', value: data.overview.withEmailCount },
					{ label: 'Want a session', value: data.overview.sessionRequestCount },
					{ label: 'Page visits (7 days)', value: data.pageVisits7d ?? '–' }
				]
			: []
	);

	function formatWhen(iso: string): string {
		return new Date(iso).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

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

	{#if stats.length > 0}
		<dl class="notes-stats">
			{#each stats as stat (stat.label)}
				<div class={['notes-stat', stat.highlight && 'notes-stat--highlight']}>
					<dt>{stat.label}</dt>
					<dd>{stat.value}</dd>
				</div>
			{/each}
		</dl>
	{/if}

	<p class="notes-alert-line">
		{#if data.alertEmail}
			You get an email at <strong>{data.alertEmail}</strong> for every new note, and another when someone
			asks for a session.
		{:else}
			<strong>New-note emails are off:</strong> PRIVATE_ADMIN_EMAIL isn’t set on this server.
		{/if}
		{#if data.overview?.lastNoteAt}
			Last note: {formatWhen(data.overview.lastNoteAt)}.
		{:else if data.overview}
			No notes yet.
		{/if}
	</p>

	<nav class="notes-tabs" aria-label="Filter notes">
		{#each views as view (view.key)}
			<a
				href={`?view=${view.key}`}
				class={['notes-tab', data.filter === view.key && 'notes-tab--active']}
				aria-current={data.filter === view.key ? 'page' : undefined}
			>
				{view.label}{#if tabCounts[view.key]}&nbsp;·&nbsp;{tabCounts[view.key]}{/if}
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

	.notes-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
		gap: 0.6rem;
		margin: 0;
	}

	.notes-stat {
		display: grid;
		gap: 0.2rem;
		padding: 0.75rem 0.9rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
	}

	.notes-stat dt {
		color: var(--ink-dim);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.notes-stat dd {
		margin: 0;
		color: var(--ink-bright);
		font-size: 1.35rem;
		font-weight: 700;
		line-height: 1.1;
	}

	.notes-stat--highlight {
		border-color: var(--lamp-glow);
		background: var(--lamp-soft);
	}

	.notes-stat--highlight dd {
		color: var(--lamp-light);
	}

	.notes-alert-line {
		margin: 0;
		color: var(--ink-dim);
		font-size: 0.8125rem;
		line-height: 1.5;
	}

	.notes-alert-line strong {
		color: var(--ink-mid);
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

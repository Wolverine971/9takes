<!-- src/routes/admin/consulting/resources/[slug]/+page.svelte -->
<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	import MarkdownEditor from '../../../content-board/MarkdownEditor.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PageData } from './$types';

	type ResourceRow = PageData['resource'];

	let { data }: { data: PageData } = $props();

	const categoryInfo = {
		playbook: {
			label: 'Playbook',
			description: 'Step-by-step guide for coaching scenarios'
		},
		framework: {
			label: 'Framework',
			description: 'Reusable models and structures'
		},
		script: {
			label: 'Script',
			description: 'Word-for-word coaching language'
		},
		reference: {
			label: 'Reference',
			description: 'Quick lookup material during sessions'
		},
		exercise: {
			label: 'Exercise',
			description: 'Activities and prompts to give clients'
		}
	} as const;

	type CategoryKey = keyof typeof categoryInfo;
	const categoryEntries = Object.entries(categoryInfo) as Array<
		[CategoryKey, (typeof categoryInfo)[CategoryKey]]
	>;

	function clonePageResource(): ResourceRow {
		return { ...data.resource };
	}

	function getSavedHtml(): string {
		return data.renderedHtml;
	}

	let resourceDraft = $state<ResourceRow>(clonePageResource());
	let originalResource = $state<ResourceRow>(clonePageResource());
	let renderedHtml = $state(getSavedHtml());
	let saving = $state(false);
	let mobileTab = $state<'content' | 'preview' | 'details'>('content');

	$effect(() => {
		resourceDraft = { ...data.resource };
		originalResource = { ...data.resource };
		renderedHtml = data.renderedHtml;
	});

	let isDirty = $derived.by(
		() => JSON.stringify(resourceDraft) !== JSON.stringify(originalResource)
	);
	let categoryMeta = $derived(
		categoryInfo[resourceDraft.category as CategoryKey] ?? {
			label: 'Resource',
			description: 'Internal coaching material'
		}
	);
	let relatedBlogHref = $derived(formatRelatedBlogHref(resourceDraft.related_blog_slug));

	function updateDraft<K extends keyof ResourceRow>(field: K, value: ResourceRow[K]) {
		resourceDraft = { ...resourceDraft, [field]: value };
	}

	function normalizeSlug(value: string): string {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.replace(/-{2,}/g, '-');
	}

	function syncSlugWithTitle() {
		updateDraft('slug', normalizeSlug(resourceDraft.title) as ResourceRow['slug']);
	}

	function formatDate(value: string | null | undefined): string {
		if (!value) return '—';
		return new Date(value).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatRelatedBlogHref(value: string | null | undefined): string | null {
		const normalized = value?.trim();
		if (!normalized) {
			return null;
		}

		if (/^https?:\/\//i.test(normalized)) {
			return normalized;
		}

		return `/${normalized.replace(/^\/+/, '')}`;
	}

	async function saveResource() {
		if (!isDirty || saving) return;

		saving = true;
		try {
			const previousSlug = originalResource.slug;
			const response = await fetch(`/api/admin/consulting/resources/${resourceDraft.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title: resourceDraft.title,
					slug: resourceDraft.slug,
					description: resourceDraft.description,
					category: resourceDraft.category,
					content: resourceDraft.content,
					sort_order: resourceDraft.sort_order ?? 0,
					is_pinned: Boolean(resourceDraft.is_pinned),
					related_blog_slug: resourceDraft.related_blog_slug
				})
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || 'Failed to save resource');
			}

			resourceDraft = result.resource;
			originalResource = { ...result.resource };
			renderedHtml = result.renderedHtml;
			notifications.success('Resource saved.', 3000);

			if (result.resource.slug !== previousSlug) {
				await goto(`/admin/consulting/resources/${result.resource.slug}`, {
					replaceState: true,
					noScroll: true
				});
				return;
			}

			await invalidateAll();
		} catch (caughtError) {
			notifications.danger(
				caughtError instanceof Error ? caughtError.message : 'Failed to save resource',
				5000
			);
		} finally {
			saving = false;
		}
	}

	function resetChanges() {
		resourceDraft = { ...originalResource };
	}

	function goBack() {
		if (isDirty && !window.confirm('You have unsaved changes. Leave this editor anyway?')) {
			return;
		}

		goto('/admin/consulting/resources');
	}

	function handleKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
			event.preventDefault();
			void saveResource();
		}
	}

	function handleBeforeUnload(event: BeforeUnloadEvent) {
		if (!isDirty) {
			return;
		}

		event.preventDefault();
		event.returnValue = '';
	}
</script>

<svelte:head>
	<title>{resourceDraft.title} | Consulting Resource Editor</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} onbeforeunload={handleBeforeUnload} />

<div class="resource-editor-page">
	<header class="page-header">
		<div class="page-header__left">
			<button type="button" class="back-btn" onclick={goBack}>← Resource Library</button>
			<div>
				<p class="page-kicker">Consulting Resource Editor</p>
				<h1>
					{resourceDraft.title || 'Untitled resource'}
					{#if isDirty}
						<span class="dirty-indicator" aria-label="Unsaved changes"></span>
					{/if}
				</h1>
				<p class="page-subtitle">{categoryMeta.description}</p>
			</div>
		</div>

		<div class="page-actions">
			{#if relatedBlogHref}
				<a class="secondary-link" href={relatedBlogHref} target="_blank" rel="noreferrer">
					Open linked blog
				</a>
			{/if}
			<button
				type="button"
				class="secondary-btn"
				disabled={!isDirty || saving}
				onclick={resetChanges}
			>
				Reset
			</button>
			<button
				type="button"
				class="primary-btn"
				disabled={!isDirty || saving}
				onclick={saveResource}
			>
				{saving ? 'Saving…' : 'Save Resource'}
			</button>
		</div>
	</header>

	<section class="summary-grid">
		<article class="summary-card">
			<span class="summary-label">Category</span>
			<strong>{categoryMeta.label}</strong>
			<span>{resourceDraft.is_pinned ? 'Pinned in the library' : 'Standard library item'}</span>
		</article>
		<article class="summary-card">
			<span class="summary-label">Manual Order</span>
			<strong>{resourceDraft.sort_order ?? 0}</strong>
			<span>Lower numbers float higher in manual sort</span>
		</article>
		<article class="summary-card">
			<span class="summary-label">Created</span>
			<strong>{formatDate(resourceDraft.created_at)}</strong>
			<span>ID {resourceDraft.id.slice(0, 8)}</span>
		</article>
		<article class="summary-card">
			<span class="summary-label">Last Saved</span>
			<strong>{formatDate(resourceDraft.updated_at)}</strong>
			<span>{isDirty ? 'Unsaved edits in progress' : 'All changes saved'}</span>
		</article>
	</section>

	<div class="mobile-tabs">
		<button
			type="button"
			class="mobile-tab"
			class:active={mobileTab === 'content'}
			onclick={() => (mobileTab = 'content')}
		>
			Content
		</button>
		<button
			type="button"
			class="mobile-tab"
			class:active={mobileTab === 'preview'}
			onclick={() => (mobileTab = 'preview')}
		>
			Preview
		</button>
		<button
			type="button"
			class="mobile-tab"
			class:active={mobileTab === 'details'}
			onclick={() => (mobileTab = 'details')}
		>
			Details
		</button>
	</div>

	<div class="workspace-grid">
		<section class="editor-card" class:mobile-hidden={mobileTab !== 'content'}>
			<div class="card-head">
				<div>
					<h2>Playbook Content</h2>
					<p>Edit the resource markdown directly. Save with the button above or `Cmd/Ctrl+S`.</p>
				</div>
			</div>

			<div class="field-grid">
				<label class="field">
					<span>Title</span>
					<input
						type="text"
						value={resourceDraft.title}
						oninput={(event) =>
							updateDraft('title', (event.currentTarget as HTMLInputElement).value)}
						placeholder="Intro Call Playbook"
					/>
				</label>

				<label class="field">
					<span>Slug</span>
					<div class="slug-row">
						<input
							type="text"
							value={resourceDraft.slug}
							oninput={(event) =>
								updateDraft('slug', (event.currentTarget as HTMLInputElement).value)}
							placeholder="intro-call-playbook"
						/>
						<button type="button" class="ghost-btn" onclick={syncSlugWithTitle}>Sync</button>
					</div>
				</label>
			</div>

			<label class="field field--stack">
				<span>Description</span>
				<textarea
					rows="3"
					value={resourceDraft.description ?? ''}
					oninput={(event) =>
						updateDraft('description', (event.currentTarget as HTMLTextAreaElement).value)}
					placeholder="What this resource is for and when you use it."
				></textarea>
			</label>

			<div class="editor-shell">
				<MarkdownEditor
					content={resourceDraft.content}
					readonly={false}
					placeholder="Write the resource in markdown..."
					onchange={(content) => updateDraft('content', content)}
				/>
			</div>
		</section>

		<aside class="sidebar" class:mobile-hidden={mobileTab !== 'details'}>
			<section class="sidebar-card">
				<h2>Resource Settings</h2>
				<label class="field field--stack">
					<span>Category</span>
					<select
						value={resourceDraft.category}
						onchange={(event) =>
							updateDraft('category', (event.currentTarget as HTMLSelectElement).value)}
					>
						{#each categoryEntries as [category, info]}
							<option value={category}>{info.label}</option>
						{/each}
					</select>
				</label>

				<label class="field field--stack">
					<span>Manual Order</span>
					<input
						type="number"
						value={resourceDraft.sort_order ?? 0}
						oninput={(event) =>
							updateDraft(
								'sort_order',
								Number.parseInt((event.currentTarget as HTMLInputElement).value, 10) || 0
							)}
					/>
				</label>

				<label class="field field--stack">
					<span>Related Blog Path</span>
					<input
						type="text"
						value={resourceDraft.related_blog_slug ?? ''}
						oninput={(event) =>
							updateDraft('related_blog_slug', (event.currentTarget as HTMLInputElement).value)}
						placeholder="guides/ultimate-guide-to-active-listening"
					/>
				</label>

				<label class="toggle-field">
					<input
						type="checkbox"
						checked={Boolean(resourceDraft.is_pinned)}
						onchange={(event) =>
							updateDraft('is_pinned', (event.currentTarget as HTMLInputElement).checked)}
					/>
					<div>
						<strong>Keep this pinned</strong>
						<span>Show it in the priority section on the resource library page.</span>
					</div>
				</label>
			</section>

			<section class="sidebar-card">
				<h2>Editing Notes</h2>
				<ul class="note-list">
					<li>Markdown preview updates after each save.</li>
					<li>Slug changes update the editor URL automatically.</li>
					<li>Tables, code blocks, quotes, headings, and lists are preserved in preview.</li>
				</ul>
			</section>

			<section class="sidebar-card">
				<h2>More {categoryMeta.label}s</h2>
				{#if data.relatedResources.length > 0}
					<div class="related-list">
						{#each data.relatedResources as resource}
							<a href="/admin/consulting/resources/{resource.slug}" class="related-item">
								<div>
									<strong>{resource.title}</strong>
									{#if resource.description}
										<span>{resource.description}</span>
									{/if}
								</div>
								<small>{resource.is_pinned ? 'Pinned' : formatDate(resource.updated_at)}</small>
							</a>
						{/each}
					</div>
				{:else}
					<p class="empty-note">No sibling resources in this category yet.</p>
				{/if}
			</section>
		</aside>
	</div>

	<section class="preview-card" class:mobile-hidden={mobileTab !== 'preview'}>
		<div class="card-head">
			<div>
				<h2>Saved Preview</h2>
				<p>This is the sanitized HTML preview generated from the last saved markdown.</p>
			</div>
			{#if isDirty}
				<span class="preview-status">Unsaved edits are not shown yet</span>
			{/if}
		</div>

		{#if renderedHtml}
			<div class="resource-preview" data-preview>{@html renderedHtml}</div>
		{:else}
			<p class="empty-note">Save the resource once to generate a preview.</p>
		{/if}
	</section>
</div>

<style lang="scss">
	.resource-editor-page {
		--resource-accent: var(--primary);
		--resource-accent-strong: color-mix(in srgb, var(--primary) 28%, var(--bg-elevated));
		--resource-accent-soft: color-mix(in srgb, var(--primary) 12%, transparent);
		--resource-surface-border: color-mix(in srgb, var(--primary) 12%, var(--bg-elevated));
		--resource-surface-border-strong: color-mix(in srgb, var(--primary) 22%, var(--bg-elevated));
		--resource-surface: color-mix(in srgb, var(--bg-surface) 94%, var(--bg-deep));
		--resource-surface-muted: color-mix(in srgb, var(--bg-surface) 84%, var(--bg-deep));
		--resource-surface-deep: color-mix(in srgb, var(--bg-deep) 66%, var(--bg-surface));
		--resource-hero-top: color-mix(in srgb, var(--bg-surface) 92%, var(--bg-deep));
		--resource-hero-bottom: color-mix(in srgb, var(--bg-surface) 76%, var(--bg-deep));
		--resource-shadow: 0 20px 40px color-mix(in srgb, var(--bg-deep) 20%, transparent);
		--resource-warning: var(--warning, #f59e0b);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		max-width: 1280px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.5rem;
		border: 1px solid var(--resource-surface-border);
		border-radius: 20px;
		background:
			radial-gradient(
				circle at top right,
				color-mix(in srgb, var(--resource-accent) 18%, transparent),
				transparent 28%
			),
			linear-gradient(180deg, var(--resource-hero-top), var(--resource-hero-bottom));
	}

	.page-header__left {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		min-width: 0;
	}

	.back-btn {
		border: 1px solid var(--resource-surface-border);
		background: var(--resource-surface-muted);
		color: var(--text-secondary);
		border-radius: 999px;
		padding: 0.65rem 0.9rem;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			color 0.2s ease;

		&:hover {
			color: var(--text-primary);
			border-color: var(--resource-surface-border-strong);
		}
	}

	.page-kicker {
		margin: 0 0 0.35rem;
		color: var(--resource-accent);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		margin: 0;
		font-size: clamp(1.8rem, 2.8vw, 2.4rem);
		line-height: 1.05;
	}

	.page-subtitle {
		margin: 0.45rem 0 0;
		color: var(--text-secondary);
		max-width: 42rem;
	}

	.dirty-indicator {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 999px;
		background: var(--resource-warning);
		box-shadow: 0 0 0 0.3rem color-mix(in srgb, var(--resource-warning) 18%, transparent);
	}

	.page-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.secondary-link,
	.secondary-btn,
	.primary-btn,
	.ghost-btn,
	.mobile-tab {
		border-radius: 999px;
		font-weight: 600;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			transform 0.2s ease;
	}

	.secondary-link,
	.secondary-btn,
	.ghost-btn {
		border: 1px solid var(--resource-surface-border);
		background: var(--resource-surface-muted);
		color: var(--text-primary);
		padding: 0.72rem 1rem;
		text-decoration: none;
		cursor: pointer;

		&:hover:not(:disabled) {
			border-color: var(--resource-surface-border-strong);
			transform: translateY(-1px);
		}
	}

	.primary-btn {
		border: none;
		background: linear-gradient(135deg, var(--primary), var(--primary-dark));
		color: white;
		padding: 0.78rem 1.1rem;
		cursor: pointer;

		&:hover:not(:disabled) {
			transform: translateY(-1px);
			box-shadow: 0 12px 24px color-mix(in srgb, var(--primary) 24%, transparent);
		}
	}

	button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.9rem;
	}

	.summary-card,
	.editor-card,
	.preview-card,
	.sidebar-card {
		background: var(--resource-surface);
		border: 1px solid var(--resource-surface-border);
		border-radius: 18px;
		box-shadow: var(--resource-shadow);
	}

	.summary-card {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 1rem 1.1rem;

		strong {
			font-size: 1.08rem;
		}

		span:last-child {
			color: var(--text-secondary);
			font-size: 0.86rem;
		}
	}

	.summary-label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--resource-accent);
	}

	.mobile-tabs {
		display: none;
		gap: 0.6rem;
	}

	.mobile-tab {
		flex: 1;
		border: 1px solid var(--resource-surface-border);
		background: var(--resource-surface);
		color: var(--text-secondary);
		padding: 0.72rem 0.95rem;
		cursor: pointer;

		&.active {
			border-color: var(--resource-surface-border-strong);
			background: var(--resource-accent-soft);
			color: var(--text-primary);
		}
	}

	.workspace-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 320px;
		gap: 1rem;
		align-items: start;
	}

	.editor-card,
	.preview-card {
		padding: 1.25rem;
	}

	.editor-card {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.card-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;

		h2 {
			margin: 0 0 0.2rem;
			font-size: 1.1rem;
		}

		p {
			margin: 0;
			color: var(--text-secondary);
			font-size: 0.92rem;
		}
	}

	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.85rem;
		margin-bottom: 0.9rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;

		span {
			font-size: 0.82rem;
			font-weight: 600;
			color: var(--text-secondary);
		}
	}

	.field--stack {
		margin-bottom: 1rem;
	}

	input,
	textarea,
	select {
		width: 100%;
		border: 1px solid var(--resource-surface-border);
		border-radius: 12px;
		background: var(--resource-surface-muted);
		color: var(--text-primary);
		padding: 0.85rem 0.95rem;
		font: inherit;
	}

	textarea {
		resize: vertical;
		min-height: 4.8rem;
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: var(--resource-surface-border-strong);
		box-shadow: 0 0 0 0.18rem color-mix(in srgb, var(--primary) 14%, transparent);
	}

	.slug-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.55rem;
	}

	.editor-shell {
		flex: 1 1 auto;
		height: clamp(38rem, 72vh, 56rem);
		min-height: 38rem;
		display: flex;
		border-radius: 14px;
		overflow: hidden;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sidebar-card {
		padding: 1rem;

		h2 {
			margin: 0 0 0.85rem;
			font-size: 1rem;
		}
	}

	.toggle-field {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.9rem;
		border: 1px solid var(--resource-surface-border);
		border-radius: 14px;
		background: var(--resource-surface-muted);

		input {
			width: auto;
			margin-top: 0.15rem;
		}

		strong,
		span {
			display: block;
		}

		span {
			margin-top: 0.25rem;
			font-size: 0.85rem;
			color: var(--text-secondary);
		}
	}

	.note-list {
		margin: 0;
		padding-left: 1rem;
		color: var(--text-secondary);

		li + li {
			margin-top: 0.55rem;
		}
	}

	.related-list {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.related-item {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.8rem;
		padding: 0.9rem;
		border-radius: 14px;
		border: 1px solid var(--resource-surface-border);
		background: var(--resource-surface-muted);
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease;

		&:hover {
			border-color: var(--resource-surface-border-strong);
			background: color-mix(in srgb, var(--resource-accent-soft) 55%, var(--resource-surface));
			transform: translateY(-1px);
		}

		strong,
		span,
		small {
			display: block;
		}

		span,
		small {
			color: var(--text-secondary);
			font-size: 0.82rem;
			margin-top: 0.25rem;
		}

		small {
			flex-shrink: 0;
			margin-top: 0;
		}
	}

	.preview-status {
		flex-shrink: 0;
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--resource-warning) 14%, transparent);
		color: color-mix(in srgb, var(--resource-warning) 72%, var(--text-primary));
		font-size: 0.78rem;
		font-weight: 600;
	}

	.resource-preview {
		padding: 1.5rem;
		border-radius: 16px;
		background: color-mix(in srgb, var(--bg-surface) 76%, var(--bg-deep));
		border: 1px solid var(--resource-surface-border);
		line-height: 1.75;

		:global(h1),
		:global(h2),
		:global(h3),
		:global(h4) {
			line-height: 1.18;
			margin: 1.5rem 0 0.8rem;
		}

		:global(h1:first-child),
		:global(h2:first-child),
		:global(h3:first-child) {
			margin-top: 0;
		}

		:global(h1) {
			font-size: 1.75rem;
		}

		:global(h2) {
			font-size: 1.35rem;
			color: var(--resource-accent);
		}

		:global(h3) {
			font-size: 1.05rem;
		}

		:global(p),
		:global(ul),
		:global(ol),
		:global(blockquote),
		:global(pre),
		:global(table) {
			margin: 0 0 1rem;
		}

		:global(ul),
		:global(ol) {
			padding-left: 1.25rem;
		}

		:global(blockquote) {
			padding: 0.95rem 1rem;
			border-left: 3px solid var(--resource-accent);
			background: color-mix(in srgb, var(--resource-accent) 10%, transparent);
			color: var(--text-secondary);
		}

		:global(pre),
		:global(code) {
			font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
		}

		:global(code) {
			background: color-mix(in srgb, var(--bg-deep) 72%, var(--bg-surface));
			padding: 0.14rem 0.34rem;
			border-radius: 6px;
		}

		:global(pre) {
			background: color-mix(in srgb, var(--bg-deep) 82%, var(--bg-surface));
			padding: 1rem;
			border-radius: 12px;
			overflow-x: auto;
		}

		:global(pre code) {
			background: transparent;
			padding: 0;
		}

		:global(a) {
			color: var(--resource-accent);
		}

		:global(table) {
			width: 100%;
			border-collapse: collapse;
		}

		:global(th),
		:global(td) {
			padding: 0.7rem;
			border: 1px solid var(--resource-surface-border);
			text-align: left;
		}

		:global(hr) {
			border: 0;
			border-top: 1px solid var(--resource-surface-border);
			margin: 1.5rem 0;
		}
	}

	.empty-note {
		margin: 0;
		color: var(--text-secondary);
	}

	@media (max-width: 1100px) {
		.summary-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.workspace-grid {
			grid-template-columns: 1fr;
		}

		.editor-shell {
			height: clamp(32rem, 68vh, 44rem);
			min-height: 32rem;
		}
	}

	@media (max-width: 768px) {
		.resource-editor-page {
			gap: 1rem;
		}

		.page-header {
			flex-direction: column;
			padding: 1.1rem;
		}

		.page-header__left,
		.page-actions {
			width: 100%;
		}

		.page-actions {
			justify-content: stretch;
		}

		.secondary-link,
		.secondary-btn,
		.primary-btn {
			flex: 1;
			text-align: center;
		}

		.summary-grid {
			grid-template-columns: 1fr;
		}

		.mobile-tabs {
			display: flex;
		}

		.field-grid,
		.slug-row {
			grid-template-columns: 1fr;
		}

		.editor-shell {
			height: 60vh;
			min-height: 60vh;
		}

		.mobile-hidden {
			display: none;
		}

		.resource-preview {
			padding: 1rem;
		}
	}
</style>

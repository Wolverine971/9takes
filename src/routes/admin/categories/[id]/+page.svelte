<!-- src/routes/admin/categories/[id]/+page.svelte -->
<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	import MarkdownEditor from '../../content-board/MarkdownEditor.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PageData } from './$types';

	type CategoryRow = PageData['category'];
	type IntroContext = PageData['context'];

	let { data }: { data: PageData } = $props();

	let categoryOverride = $state<Partial<CategoryRow> | null>(null);
	let contextOverride = $state<IntroContext | null>(null);
	let renderedIntroHtmlOverride = $state<string | null>(null);
	let introMarkdownDraft = $state<string | null>(null);
	let introDescriptionDraft = $state<string | null>(null);
	let saving = $state(false);
	let generating = $state(false);
	let reviewing = $state(false);

	let category = $derived(
		categoryOverride ? ({ ...data.category, ...categoryOverride } as CategoryRow) : data.category
	);
	let context = $derived(contextOverride ?? data.context);
	let renderedIntroHtml = $derived(renderedIntroHtmlOverride ?? data.renderedIntroHtml);
	let introMarkdown = $derived(introMarkdownDraft ?? category.intro_markdown ?? '');
	let introDescription = $derived(introDescriptionDraft ?? category.intro_description ?? '');
	let publicHref = $derived(data.publicHref);

	let isDirty = $derived(
		introMarkdown !== (category.intro_markdown ?? '') ||
			introDescription !== (category.intro_description ?? '')
	);

	let sourceLabel = $derived(
		category.intro_status === 'missing'
			? 'No saved intro yet'
			: category.intro_source === 'ai_edited'
				? 'Manual edit of AI draft'
				: category.intro_source === 'manual'
					? 'Manual intro'
					: 'AI-generated intro'
	);

	let canReview = $derived(
		Boolean(category.intro_markdown) &&
			category.intro_status !== 'processing' &&
			category.intro_status !== 'failed'
	);

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

	function pathLabel(path: string[]) {
		return path.join(' > ');
	}

	async function saveIntro() {
		saving = true;
		try {
			const response = await fetch(`/api/admin/question-categories/${category.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					intro_markdown: introMarkdown,
					intro_description: introDescription
				})
			});
			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || 'Failed to save intro');
			}

			categoryOverride = result.category;
			contextOverride = result.context;
			renderedIntroHtmlOverride = result.renderedIntroHtml;
			introMarkdownDraft = null;
			introDescriptionDraft = null;
			notifications.success('Category intro saved.', 3000);
			await invalidateAll();
		} catch (caughtError) {
			notifications.danger(
				caughtError instanceof Error ? caughtError.message : 'Failed to save category intro',
				5000
			);
		} finally {
			saving = false;
		}
	}

	async function generateIntro() {
		if (
			(category.intro_source === 'manual' || category.intro_source === 'ai_edited') &&
			!window.confirm(
				'This category has manual changes. Regenerating will replace the current intro with a new AI draft. Continue?'
			)
		) {
			return;
		}

		if (isDirty && !window.confirm('You have unsaved changes. Generate a new AI intro anyway?')) {
			return;
		}

		generating = true;
		try {
			const response = await fetch(`/api/admin/question-categories/${category.id}/generate`, {
				method: 'POST'
			});
			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || 'Failed to generate intro');
			}

			categoryOverride = result.category;
			contextOverride = result.context;
			renderedIntroHtmlOverride = result.renderedIntroHtml;
			introMarkdownDraft = null;
			introDescriptionDraft = null;
			notifications.success('AI intro generated.', 3000);
			await invalidateAll();
		} catch (caughtError) {
			notifications.danger(
				caughtError instanceof Error ? caughtError.message : 'Failed to generate category intro',
				6000
			);
		} finally {
			generating = false;
		}
	}

	async function reviewIntro() {
		if (
			isDirty &&
			!window.confirm('You have unsaved changes. Save or discard them before reviewing?')
		) {
			return;
		}

		reviewing = true;
		try {
			const response = await fetch(`/api/admin/question-categories/${category.id}/review`, {
				method: 'POST'
			});
			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || 'Failed to review intro');
			}

			categoryOverride = result.category;
			contextOverride = result.context;
			renderedIntroHtmlOverride = result.renderedIntroHtml;
			introMarkdownDraft = null;
			introDescriptionDraft = null;
			notifications.success('Category intro reviewed.', 3000);
			await invalidateAll();
		} catch (caughtError) {
			notifications.danger(
				caughtError instanceof Error ? caughtError.message : 'Failed to review category intro',
				5000
			);
		} finally {
			reviewing = false;
		}
	}
</script>

<svelte:head>
	<title>{category.category_name} | Admin Categories</title>
</svelte:head>

<div class="category-editor-page">
	<header class="page-header">
		<div class="page-header__left">
			<button type="button" class="back-btn" onclick={() => goto('/admin/categories')}>
				← All Categories
			</button>
			<div>
				<p class="page-kicker">Category Intro Editor</p>
				<h1>{category.category_name}</h1>
				<p class="page-path">{pathLabel(context.path)}</p>
			</div>
		</div>

		<div class="page-actions">
			<a class="secondary-link" href={publicHref} target="_blank" rel="noreferrer"
				>Open Public Page</a
			>
			<button type="button" class="secondary-btn" disabled={saving || !isDirty} onclick={saveIntro}>
				{saving ? 'Saving…' : 'Save Intro'}
			</button>
			<button
				type="button"
				class="secondary-btn"
				disabled={reviewing || !canReview}
				onclick={reviewIntro}
			>
				{reviewing ? 'Reviewing…' : 'Mark Reviewed'}
			</button>
			<button
				type="button"
				class="primary-btn"
				disabled={generating || !context.isEligibleForIntro}
				onclick={generateIntro}
			>
				{generating ? 'Generating…' : 'Generate AI Intro'}
			</button>
		</div>
	</header>

	<section class="summary-grid">
		<article class="summary-card">
			<span class="summary-label">Status</span>
			<strong>{category.intro_status}</strong>
			<span>{sourceLabel}</span>
		</article>
		<article class="summary-card">
			<span class="summary-label">Eligibility</span>
			<strong>{context.isEligibleForIntro ? 'Eligible' : 'Below threshold'}</strong>
			<span>
				{context.subtreeQuestionCount} subtree questions, minimum {context.minimumQuestionCount}
			</span>
		</article>
		<article class="summary-card">
			<span class="summary-label">Last Generated</span>
			<strong>{formatDate(category.intro_generated_at)}</strong>
			<span>Prompt version {category.intro_prompt_version ?? '—'}</span>
		</article>
		<article class="summary-card">
			<span class="summary-label">Last Updated</span>
			<strong>{formatDate(category.intro_updated_at)}</strong>
			<span>Reviewed {formatDate(category.intro_reviewed_at)}</span>
		</article>
	</section>

	<div class="editor-grid">
		<section class="editor-card">
			<div class="card-head">
				<div>
					<h2>Intro Markdown</h2>
					<p>Keep it concise. This content should support the questions, not replace them.</p>
				</div>
			</div>

			<div class="description-field">
				<label for="intro-description">Meta Description</label>
				<textarea
					id="intro-description"
					rows="3"
					value={introDescription}
					oninput={(event) =>
						(introDescriptionDraft = (event.currentTarget as HTMLTextAreaElement).value)}
					placeholder="Optional. Leave blank to derive from the markdown intro."
				></textarea>
			</div>

			<div class="markdown-shell">
				<MarkdownEditor
					content={introMarkdown}
					onchange={(content) => (introMarkdownDraft = content)}
					readonly={false}
					placeholder="Write a short markdown introduction for this category..."
				/>
			</div>
		</section>

		<aside class="sidebar">
			<section class="sidebar-card">
				<h2>Generation Context</h2>
				<ul class="meta-list">
					<li><strong>Direct questions:</strong> {context.directQuestionCount}</li>
					<li><strong>Subtree questions:</strong> {context.subtreeQuestionCount}</li>
					<li><strong>Context hash:</strong> <code>{context.contextHash.slice(0, 12)}</code></li>
				</ul>
			</section>

			<section class="sidebar-card">
				<h2>Child Categories</h2>
				{#if context.childCategories.length}
					<ul class="pill-list">
						{#each context.childCategories as child}
							<li>{child.name} ({child.subtreeQuestionCount})</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-note">No live child categories under this node.</p>
				{/if}
			</section>

			<section class="sidebar-card">
				<h2>Semantic Terms</h2>
				{#if context.semanticTerms.length}
					<ul class="pill-list">
						{#each context.semanticTerms as term}
							<li>{term}</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-note">No semantic terms derived yet.</p>
				{/if}
			</section>

			<section class="sidebar-card">
				<h2>Sample Questions</h2>
				{#if context.sampleQuestionTitles.length}
					<ol class="sample-list">
						{#each context.sampleQuestionTitles as question}
							<li>{question}</li>
						{/each}
					</ol>
				{:else}
					<p class="empty-note">No live questions found in this subtree.</p>
				{/if}
			</section>

			<section class="sidebar-card">
				<h2>Recent Runs</h2>
				{#if data.recentRuns.length}
					<ul class="run-list">
						{#each data.recentRuns as run}
							<li>
								<strong>{run.status}</strong>
								<span>{formatDate(run.created_at)}</span>
								<small>{run.trigger}</small>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="empty-note">No generation attempts yet.</p>
				{/if}
			</section>
		</aside>
	</div>

	<section class="preview-card">
		<div class="card-head">
			<div>
				<h2>Current Public Intro Preview</h2>
				<p>This is the sanitized HTML preview that will render on the category page.</p>
			</div>
		</div>

		{#if renderedIntroHtml}
			<div class="intro-preview prose" data-preview>{@html renderedIntroHtml}</div>
		{:else}
			<p class="empty-note">No intro is saved for this category yet.</p>
		{/if}
	</section>
</div>

<style lang="scss">
	.category-editor-page {
		display: grid;
		gap: 1.25rem;
	}

	.page-header,
	.summary-card,
	.editor-card,
	.sidebar-card,
	.preview-card {
		border: 1px solid var(--bg-elevated);
		background: var(--bg-surface);
		border-radius: 18px;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.4rem;
	}

	.page-header__left {
		display: grid;
		gap: 0.8rem;
	}

	.back-btn,
	.secondary-btn,
	.primary-btn,
	.secondary-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		padding: 0.75rem 1rem;
		font-weight: 600;
		text-decoration: none;
	}

	.back-btn,
	.secondary-btn,
	.secondary-link {
		border: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		color: var(--text-primary);
	}

	.primary-btn {
		border: 1px solid color-mix(in srgb, var(--primary) 55%, var(--bg-elevated));
		background: color-mix(in srgb, var(--primary) 14%, var(--bg-base));
		color: var(--text-primary);
	}

	.back-btn:disabled,
	.secondary-btn:disabled,
	.primary-btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.page-kicker,
	.summary-label {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	h1,
	h2 {
		margin: 0;
		color: var(--text-primary);
	}

	.page-path,
	.card-head p,
	.empty-note {
		margin: 0.4rem 0 0;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.page-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.summary-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}

	.summary-card {
		display: grid;
		gap: 0.4rem;
		padding: 1rem 1.1rem;
	}

	.editor-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.9fr);
		gap: 1rem;
		align-items: start;
	}

	.editor-card,
	.preview-card {
		padding: 1.2rem;
	}

	.card-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.description-field {
		display: grid;
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.description-field label {
		font-weight: 600;
		color: var(--text-primary);
	}

	.description-field textarea {
		width: 100%;
		padding: 0.9rem;
		border-radius: 12px;
		border: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		color: var(--text-primary);
		resize: vertical;
	}

	.markdown-shell {
		min-height: 460px;
		border-radius: 14px;
		overflow: hidden;
	}

	.sidebar {
		display: grid;
		gap: 1rem;
	}

	.sidebar-card {
		padding: 1rem 1.05rem;
	}

	.meta-list,
	.pill-list,
	.sample-list,
	.run-list {
		margin: 0.8rem 0 0;
		padding-left: 1.1rem;
		color: var(--text-secondary);
	}

	.pill-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		padding: 0;
		list-style: none;
	}

	.pill-list li {
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		color: var(--text-primary);
	}

	.run-list li {
		display: grid;
		gap: 0.15rem;
		margin-bottom: 0.85rem;
	}

	.intro-preview {
		color: var(--text-primary);
		line-height: 1.7;
	}

	:global([data-preview] p) {
		margin: 0 0 0.85rem;
	}

	:global([data-preview] ul),
	:global([data-preview] ol) {
		padding-left: 1.3rem;
		margin: 0 0 0.85rem;
	}

	:global([data-preview] a) {
		color: var(--primary);
	}

	@media (max-width: 980px) {
		.page-header,
		.editor-grid {
			grid-template-columns: 1fr;
		}

		.page-actions {
			justify-content: flex-start;
		}
	}
</style>

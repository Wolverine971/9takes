<!-- src/routes/admin/categories/+page.svelte -->
<script lang="ts">
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PageData } from './$types';

	type CategoryFilter = 'eligible' | 'all' | 'below-threshold';
	type BatchMode = 'missing' | 'stale';
	type CategoryRow = PageData['categories'][number];

	let { data }: { data: PageData } = $props();

	let categoryOverrides = $state<Record<number, Partial<CategoryRow>>>({});
	let searchQuery = $state('');
	let activeFilter = $state<CategoryFilter>('eligible');
	let batchSize = $state(5);
	let generatingCategoryIds = $state<number[]>([]);
	let reviewingCategoryIds = $state<number[]>([]);
	let activeBatchMode = $state<BatchMode | null>(null);

	const toCategorySlug = (name: string) => name.trim().replace(/\s+/g, '-');
	const pathLabel = (path: string[]) => path.join(' > ');
	const publicCategoryHref = (name: string) => `/questions/categories/${toCategorySlug(name)}`;
	const adminCategoryHref = (id: number) => `/admin/categories/${id}`;
	let thresholdLabel = $derived(`${data.minimumQuestionCountForIntro} question minimum`);
	let categories = $derived(
		(data.categories ?? []).map((category) => ({
			...category,
			...(categoryOverrides[category.id] ?? {})
		}))
	);

	const filterOptions: Array<{ id: CategoryFilter; label: string }> = [
		{ id: 'eligible', label: 'Eligible' },
		{ id: 'all', label: 'All Visible' },
		{ id: 'below-threshold', label: 'Below Threshold' }
	];

	function formatDate(value: string | null | undefined): string {
		if (!value) return '—';
		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function sourceLabel(category: CategoryRow): string {
		if (category.intro_status === 'missing') return 'No intro saved';
		if (category.intro_source === 'ai_edited') return 'Manual edit of AI';
		if (category.intro_source === 'manual') return 'Manual';
		return 'AI';
	}

	function statusClass(status: string | null | undefined): string {
		switch (status) {
			case 'completed':
				return 'status-pill status-pill--completed';
			case 'stale':
				return 'status-pill status-pill--stale';
			case 'failed':
				return 'status-pill status-pill--failed';
			case 'processing':
				return 'status-pill status-pill--processing';
			default:
				return 'status-pill status-pill--muted';
		}
	}

	function isGenerating(categoryId: number) {
		return generatingCategoryIds.includes(categoryId);
	}

	function isReviewing(categoryId: number) {
		return reviewingCategoryIds.includes(categoryId);
	}

	function canReview(category: CategoryRow) {
		return category.intro_status === 'completed' || category.intro_status === 'stale';
	}

	function generateButtonLabel(category: CategoryRow) {
		if (category.intro_status === 'stale') {
			return category.intro_source === 'ai' ? 'Refresh AI' : 'Regenerate';
		}

		if (category.intro_status === 'completed') {
			return 'Regenerate';
		}

		if (category.intro_status === 'failed') {
			return 'Retry';
		}

		return 'Generate';
	}

	function setCategoryBusy(categoryId: number, busy: boolean, kind: 'generate' | 'review') {
		const currentIds = kind === 'generate' ? generatingCategoryIds : reviewingCategoryIds;
		const nextIds = busy
			? Array.from(new Set([...currentIds, categoryId]))
			: currentIds.filter((id) => id !== categoryId);

		if (kind === 'generate') {
			generatingCategoryIds = nextIds;
			return;
		}

		reviewingCategoryIds = nextIds;
	}

	function mergeCategoryMeta(nextCategory: Partial<CategoryRow> & { id: number }) {
		categoryOverrides = {
			...categoryOverrides,
			[nextCategory.id]: {
				...(categoryOverrides[nextCategory.id] ?? {}),
				...nextCategory
			}
		};
	}

	async function generateCategory(category: CategoryRow) {
		if (category.intro_source === 'manual' || category.intro_source === 'ai_edited') {
			const confirmed = window.confirm(
				'This category has manual changes. Regenerating will replace the current intro with a new AI draft. Continue?'
			);
			if (!confirmed) return;
		}

		setCategoryBusy(category.id, true, 'generate');
		try {
			const response = await fetch(`/api/admin/question-categories/${category.id}/generate`, {
				method: 'POST'
			});
			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || 'Failed to generate intro');
			}

			mergeCategoryMeta({
				id: result.category.id,
				intro_status: result.category.intro_status,
				intro_source: result.category.intro_source,
				intro_generated_at: result.category.intro_generated_at,
				intro_reviewed_at: result.category.intro_reviewed_at,
				intro_updated_at: result.category.intro_updated_at
			});
			notifications.success(`Generated intro for ${category.category_name}.`, 3000);
		} catch (caughtError) {
			mergeCategoryMeta({
				id: category.id,
				intro_status: 'failed',
				intro_updated_at: new Date().toISOString()
			});
			notifications.danger(
				caughtError instanceof Error ? caughtError.message : 'Failed to generate category intro',
				5000
			);
		} finally {
			setCategoryBusy(category.id, false, 'generate');
		}
	}

	async function reviewCategory(category: CategoryRow) {
		setCategoryBusy(category.id, true, 'review');
		try {
			const response = await fetch(`/api/admin/question-categories/${category.id}/review`, {
				method: 'POST'
			});
			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || 'Failed to review intro');
			}

			mergeCategoryMeta({
				id: result.category.id,
				intro_status: result.category.intro_status,
				intro_source: result.category.intro_source,
				intro_generated_at: result.category.intro_generated_at,
				intro_reviewed_at: result.category.intro_reviewed_at,
				intro_updated_at: result.category.intro_updated_at
			});
			notifications.success(`Reviewed ${category.category_name}.`, 3000);
		} catch (caughtError) {
			notifications.danger(
				caughtError instanceof Error ? caughtError.message : 'Failed to review category intro',
				5000
			);
		} finally {
			setCategoryBusy(category.id, false, 'review');
		}
	}

	async function runBatch(mode: BatchMode) {
		if (mode === 'stale') {
			const confirmed = window.confirm(
				'Refresh stale AI intros now? Categories with manual edits are excluded from this batch.'
			);
			if (!confirmed) return;
		}

		activeBatchMode = mode;
		try {
			const response = await fetch('/api/admin/question-categories/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ mode, limit: batchSize })
			});
			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message || 'Failed to run batch generation');
			}

			for (const updatedCategory of result.updatedCategories ?? []) {
				mergeCategoryMeta(updatedCategory);
			}

			for (const failedCategory of result.failures ?? []) {
				mergeCategoryMeta({
					id: failedCategory.id,
					intro_status: 'failed',
					intro_updated_at: new Date().toISOString()
				});
			}

			const summary =
				result.processedCount === 0
					? 'No matching categories were queued.'
					: `Processed ${result.processedCount} categories. ${result.successCount} succeeded, ${result.failureCount} failed.`;
			if ((result.failureCount ?? 0) > 0) {
				notifications.danger(summary, 6000);
			} else {
				notifications.success(summary, 4000);
			}
		} catch (caughtError) {
			notifications.danger(
				caughtError instanceof Error ? caughtError.message : 'Failed to run batch generation',
				5000
			);
		} finally {
			activeBatchMode = null;
		}
	}

	let filteredCategories = $derived.by(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		return categories.filter((category) => {
			if (activeFilter === 'eligible' && !category.isEligibleForIntro) {
				return false;
			}

			if (activeFilter === 'below-threshold' && category.isEligibleForIntro) {
				return false;
			}

			if (!normalizedQuery) {
				return true;
			}

			return (
				category.category_name.toLowerCase().includes(normalizedQuery) ||
				pathLabel(category.path).toLowerCase().includes(normalizedQuery)
			);
		});
	});

	let queueStats = $derived.by(() => {
		return categories.reduce(
			(acc, category) => {
				if (category.intro_status === 'completed') acc.completed += 1;
				if (category.intro_status === 'stale') acc.stale += 1;
				if (category.intro_status === 'missing' || category.intro_status === 'failed')
					acc.pending += 1;
				if (category.intro_reviewed_at) acc.reviewed += 1;
				if (
					category.isEligibleForIntro &&
					(category.intro_status === 'missing' || category.intro_status === 'failed')
				) {
					acc.batchMissing += 1;
				}
				if (
					category.isEligibleForIntro &&
					category.intro_status === 'stale' &&
					category.intro_source === 'ai'
				) {
					acc.batchStale += 1;
				}
				return acc;
			},
			{
				completed: 0,
				stale: 0,
				pending: 0,
				reviewed: 0,
				batchMissing: 0,
				batchStale: 0
			}
		);
	});
</script>

<svelte:head>
	<title>Admin - Categories</title>
</svelte:head>

<div class="admin-categories">
	<header class="page-header">
		<div class="header-copy">
			<span class="page-kicker">Admin taxonomy</span>
			<h1 class="page-title">Categories</h1>
			<p class="page-subtitle">
				This view shows the live category tree that currently renders on the public site and which
				categories are eligible for AI intro generation.
			</p>
		</div>

		<div class="header-links">
			<a href="/admin/questions/hierarchy" class="secondary-link">Question Hierarchy</a>
			<a href="/questions/categories" class="secondary-link">Public Categories</a>
		</div>
	</header>

	<section class="stats-grid" aria-label="Category intro eligibility summary">
		<article class="stat-card">
			<span class="stat-label">Visible Categories</span>
			<strong class="stat-value">{data.totalVisibleCategories}</strong>
			<span class="stat-note">Currently shown on the public category tree</span>
		</article>

		<article class="stat-card eligible">
			<span class="stat-label">Eligible Now</span>
			<strong class="stat-value">{data.eligibleCategoryCount}</strong>
			<span class="stat-note">Meets the {thresholdLabel} using subtree counts</span>
		</article>

		<article class="stat-card">
			<span class="stat-label">Intro Coverage</span>
			<strong class="stat-value">{queueStats.completed}</strong>
			<span class="stat-note">Completed intros currently saved</span>
		</article>

		<article class="stat-card muted">
			<span class="stat-label">Needs Attention</span>
			<strong class="stat-value">{queueStats.pending + queueStats.stale}</strong>
			<span class="stat-note">Missing, failed, or stale intro states</span>
		</article>
	</section>

	<section class="controls-card">
		<div class="controls-head">
			<div>
				<h2>Intro Generation Scope</h2>
				<p>
					Parents qualify when their live descendant question count meets the threshold, even if
					they do not have direct questions of their own.
				</p>
			</div>
			<span class="threshold-badge">{thresholdLabel}</span>
		</div>

		<div class="controls-row">
			<label class="search-field">
				<span>Search</span>
				<input type="text" bind:value={searchQuery} placeholder="Search category name or path..." />
			</label>

			<div class="filter-group" role="tablist" aria-label="Category filter">
				{#each filterOptions as option}
					<button
						type="button"
						class="filter-pill"
						class:active={activeFilter === option.id}
						onclick={() => (activeFilter = option.id)}
					>
						{option.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="batch-row">
			<div class="queue-summary">
				<span>{queueStats.batchMissing} eligible missing or failed</span>
				<span>{queueStats.batchStale} eligible stale AI intros</span>
				<span>{queueStats.reviewed} reviewed</span>
			</div>

			<div class="batch-controls">
				<label class="batch-field">
					<span>Batch Size</span>
					<input type="number" min="1" max="25" bind:value={batchSize} />
				</label>
				<button
					type="button"
					class="batch-btn"
					disabled={activeBatchMode !== null || queueStats.batchMissing === 0}
					onclick={() => runBatch('missing')}
				>
					{activeBatchMode === 'missing' ? 'Generating…' : 'Generate Missing'}
				</button>
				<button
					type="button"
					class="batch-btn batch-btn--secondary"
					disabled={activeBatchMode !== null || queueStats.batchStale === 0}
					onclick={() => runBatch('stale')}
				>
					{activeBatchMode === 'stale' ? 'Refreshing…' : 'Refresh Stale AI'}
				</button>
			</div>
		</div>
	</section>

	<section class="table-card">
		<div class="table-head">
			<div>
				<h2>Live Category Queue</h2>
				<p>{filteredCategories.length} categories shown in the current filter.</p>
			</div>
		</div>

		{#if filteredCategories.length === 0}
			<div class="empty-state">
				<h3>No categories match this filter.</h3>
				<p>Try a different search term or switch the eligibility filter.</p>
			</div>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Category</th>
							<th>Path</th>
							<th>Intro</th>
							<th>Direct</th>
							<th>Subtree</th>
							<th>Eligibility</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredCategories as category (category.id)}
							<tr>
								<td>
									<div class="category-cell">
										<a href={adminCategoryHref(category.id)} class="admin-link">
											<strong>{category.category_name}</strong>
										</a>
										<span>Level {category.level}</span>
									</div>
								</td>
								<td>
									<span class="path-text">{pathLabel(category.path)}</span>
								</td>
								<td>
									<div class="category-cell">
										<span class={statusClass(category.intro_status)}>{category.intro_status}</span>
										<span>{sourceLabel(category)}</span>
										<span>{formatDate(category.intro_updated_at)}</span>
									</div>
								</td>
								<td class="numeric-cell">{category.directQuestionCount}</td>
								<td class="numeric-cell">{category.subtreeQuestionCount}</td>
								<td>
									<span
										class={`status-pill ${category.isEligibleForIntro ? 'status-pill--eligible' : 'status-pill--muted'}`}
									>
										{category.isEligibleForIntro ? 'Eligible' : 'Below threshold'}
									</span>
								</td>
								<td>
									<div class="action-group">
										<a href={adminCategoryHref(category.id)} class="table-link">Edit</a>
										<a href={publicCategoryHref(category.category_name)} class="table-link"
											>Public</a
										>
										<button
											type="button"
											class="table-btn"
											disabled={!category.isEligibleForIntro ||
												category.intro_status === 'processing' ||
												isGenerating(category.id)}
											onclick={() => generateCategory(category)}
										>
											{isGenerating(category.id) ? 'Working…' : generateButtonLabel(category)}
										</button>
										<button
											type="button"
											class="table-btn table-btn--secondary"
											disabled={!canReview(category) || isReviewing(category.id)}
											onclick={() => reviewCategory(category)}
										>
											{isReviewing(category.id) ? 'Reviewing…' : 'Review'}
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>

<style lang="scss">
	.admin-categories {
		display: grid;
		gap: 1.25rem;
	}

	.page-header,
	.controls-card,
	.table-card,
	.stat-card {
		border: 1px solid var(--bg-elevated);
		background: var(--bg-surface);
		border-radius: 18px;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.5rem;
	}

	.page-kicker {
		display: inline-block;
		margin-bottom: 0.4rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.page-title {
		margin: 0;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
		line-height: 1.05;
		color: var(--text-primary);
	}

	.page-subtitle {
		max-width: 52rem;
		margin: 0.7rem 0 0;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.header-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	.secondary-link,
	.admin-link,
	.table-link {
		color: var(--primary);
		text-decoration: none;
		font-weight: 600;
	}

	.admin-link strong {
		color: inherit;
	}

	.secondary-link:hover,
	.admin-link:hover,
	.table-link:hover {
		text-decoration: underline;
	}

	.stats-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}

	.stat-card {
		display: grid;
		gap: 0.45rem;
		padding: 1.15rem 1.2rem;
	}

	.stat-card.eligible {
		border-color: color-mix(in srgb, var(--primary) 28%, var(--bg-elevated));
		background: color-mix(in srgb, var(--primary) 8%, var(--bg-surface));
	}

	.stat-card.muted {
		background: color-mix(in srgb, var(--bg-base) 72%, var(--bg-surface));
	}

	.stat-label {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.stat-value {
		font-size: 2rem;
		line-height: 1;
		color: var(--text-primary);
	}

	.stat-note {
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.controls-card,
	.table-card {
		padding: 1.35rem;
	}

	.controls-head,
	.table-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.controls-head h2,
	.table-head h2 {
		margin: 0;
		font-size: 1.15rem;
		color: var(--text-primary);
	}

	.controls-head p,
	.table-head p {
		margin: 0.35rem 0 0;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.threshold-badge,
	.status-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.42rem 0.72rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.threshold-badge {
		background: color-mix(in srgb, var(--primary) 12%, var(--bg-base));
		color: var(--text-primary);
	}

	.controls-row,
	.batch-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: end;
		justify-content: space-between;
	}

	.batch-row {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid color-mix(in srgb, var(--bg-elevated) 72%, transparent);
	}

	.search-field,
	.batch-field {
		display: grid;
		gap: 0.35rem;
	}

	.search-field {
		min-width: min(100%, 360px);
	}

	.search-field span,
	.batch-field span {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.search-field input,
	.batch-field input {
		padding: 0.85rem 0.95rem;
		border-radius: 12px;
		border: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		color: var(--text-primary);
	}

	.batch-field input {
		min-width: 92px;
	}

	.filter-group,
	.batch-controls,
	.queue-summary,
	.action-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.queue-summary span {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.filter-pill,
	.batch-btn,
	.table-btn {
		padding: 0.72rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		color: var(--text-secondary);
		font-weight: 600;
		cursor: pointer;
	}

	.filter-pill.active {
		border-color: color-mix(in srgb, var(--primary) 48%, var(--bg-elevated));
		background: color-mix(in srgb, var(--primary) 14%, var(--bg-base));
		color: var(--text-primary);
	}

	.batch-btn,
	.table-btn {
		color: var(--text-primary);
	}

	.batch-btn--secondary,
	.table-btn--secondary {
		background: var(--bg-surface);
	}

	.filter-pill:disabled,
	.batch-btn:disabled,
	.table-btn:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.95rem 0.75rem;
		border-top: 1px solid color-mix(in srgb, var(--bg-elevated) 72%, transparent);
		vertical-align: top;
		text-align: left;
	}

	th {
		border-top: none;
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.category-cell {
		display: grid;
		gap: 0.2rem;
	}

	.category-cell strong {
		color: var(--text-primary);
	}

	.category-cell span,
	.path-text {
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.numeric-cell {
		font-variant-numeric: tabular-nums;
		color: var(--text-primary);
	}

	.status-pill {
		background: color-mix(in srgb, var(--bg-base) 82%, var(--bg-deep));
		color: var(--text-secondary);
	}

	.status-pill--completed,
	.status-pill--eligible {
		background: color-mix(in srgb, var(--primary) 14%, var(--bg-base));
		color: var(--text-primary);
	}

	.status-pill--stale {
		background: color-mix(in srgb, #d97706 14%, var(--bg-base));
		color: color-mix(in srgb, #d97706 78%, var(--text-primary));
	}

	.status-pill--failed {
		background: color-mix(in srgb, #dc2626 12%, var(--bg-base));
		color: color-mix(in srgb, #dc2626 76%, var(--text-primary));
	}

	.status-pill--processing {
		background: color-mix(in srgb, #2563eb 12%, var(--bg-base));
		color: color-mix(in srgb, #2563eb 78%, var(--text-primary));
	}

	.status-pill--muted {
		background: color-mix(in srgb, var(--bg-base) 82%, var(--bg-deep));
		color: var(--text-secondary);
	}

	.empty-state {
		padding: 2.5rem 1rem 1.25rem;
		text-align: center;
	}

	.empty-state h3 {
		margin: 0;
		color: var(--text-primary);
	}

	.empty-state p {
		margin: 0.5rem 0 0;
		color: var(--text-secondary);
	}

	@media (max-width: 720px) {
		.page-header,
		.controls-head,
		.table-head {
			flex-direction: column;
		}

		.header-links {
			justify-content: flex-start;
		}

		th,
		td {
			min-width: 120px;
		}
	}
</style>

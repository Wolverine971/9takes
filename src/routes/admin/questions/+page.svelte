<!-- src/routes/admin/questions/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { convertDateToReadable } from '../../../utils/conversions';
	import StatCard from '$lib/components/charts/StatCard.svelte';

	let { data }: { data: PageData } = $props();
	let questions = $state<any[]>([]);
	let initializedQuestions = false;

	$effect(() => {
		if (initializedQuestions) {
			return;
		}

		questions = (data.questions || []).map((question: any) => ({
			...question,
			question_tag: Array.isArray(question.question_tag) ? [...question.question_tag] : [],
			keywords: Array.isArray(question.keywords) ? [...question.keywords] : []
		}));
		initializedQuestions = true;
	});

	// Question sorting functions
	const sortFunctions: Record<string, (questions: any[]) => any[]> = {
		lastComment: (questions) => {
			return [...questions].sort((a, b) => {
				const dateA = a.last_comment_date ? new Date(a.last_comment_date).getTime() : 0;
				const dateB = b.last_comment_date ? new Date(b.last_comment_date).getTime() : 0;
				if (dateB !== dateA) return dateB - dateA;
				return b.comment_count - a.comment_count;
			});
		},
		mostComments: (questions) => {
			return [...questions].sort((a, b) => b.comment_count - a.comment_count);
		},
		newest: (questions) => {
			return [...questions].sort((a, b) => {
				const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
				const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
				return dateB - dateA;
			});
		},
		oldest: (questions) => {
			return [...questions].sort((a, b) => {
				const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
				const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
				return dateA - dateB;
			});
		}
	};

	// Question state management
	let selectedQuestion = $state<any>(null);
	let currentSort = $state('lastComment');
	let searchQuery = $state('');
	let filterStatus = $state<
		'all' | 'active' | 'flagged' | 'removed' | 'tagged' | 'untagged' | 'processed' | 'unprocessed'
	>('all');

	// Stats
	let totalQuestions = $derived(questions.length);
	let totalComments = $derived(
		questions.reduce((sum: number, q: any) => sum + (q.comment_count || 0), 0)
	);
	let taggedCount = $derived(questions.filter((q: any) => hasAssignedTags(q)).length);
	let untaggedCount = $derived(totalQuestions - taggedCount);
	let processedCount = $derived(
		questions.filter((q: any) => q.question_formatted && q.question_formatted !== q.question).length
	);
	let unprocessedCount = $derived(totalQuestions - processedCount);

	// Build unique tag list for category filter
	let allTags = $derived.by(() => {
		const tagMap = new Map<number, string>();
		for (const q of questions) {
			for (const t of q.question_tag || []) {
				if (t.tag_id && t.tag_name) {
					tagMap.set(t.tag_id, t.tag_name);
				}
			}
		}
		return Array.from(tagMap.entries())
			.map(([id, name]) => ({ id, name }))
			.sort((a, b) => a.name.localeCompare(b.name));
	});

	let filterCategory = $state<number | null>(null);

	// Filter and sort questions
	let displayedQuestions = $derived.by(() => {
		let filtered = questions;

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(q: any) =>
					q.question?.toLowerCase().includes(query) ||
					q.question_formatted?.toLowerCase().includes(query)
			);
		}

		if (filterStatus === 'flagged') {
			filtered = filtered.filter((q: any) => q.flagged);
		} else if (filterStatus === 'removed') {
			filtered = filtered.filter((q: any) => q.removed);
		} else if (filterStatus === 'active') {
			filtered = filtered.filter((q: any) => !q.flagged && !q.removed);
		} else if (filterStatus === 'tagged') {
			filtered = filtered.filter((q: any) => hasAssignedTags(q));
		} else if (filterStatus === 'untagged') {
			filtered = filtered.filter((q: any) => !hasAssignedTags(q));
		} else if (filterStatus === 'processed') {
			filtered = filtered.filter(
				(q: any) => q.question_formatted && q.question_formatted !== q.question
			);
		} else if (filterStatus === 'unprocessed') {
			filtered = filtered.filter(
				(q: any) => !q.question_formatted || q.question_formatted === q.question
			);
		}

		if (filterCategory !== null) {
			filtered = filtered.filter((q: any) =>
				q.question_tag?.some((t: any) => t.tag_id === filterCategory)
			);
		}

		return sortFunctions[currentSort](filtered);
	});

	// Helpers
	function hasAssignedTags(question: any): boolean {
		return Array.isArray(question.question_tag) && question.question_tag.length > 0;
	}

	function isProcessed(question: any): boolean {
		return question.question_formatted && question.question_formatted !== question.question;
	}

	function updateQuestion(updatedQuestion: any) {
		const questionIndex = questions.findIndex(
			(question: any) => question.id === updatedQuestion?.id
		);
		if (questionIndex === -1) {
			return;
		}

		questions[questionIndex] = {
			...questions[questionIndex],
			...updatedQuestion,
			question_tag: Array.isArray(updatedQuestion.question_tag)
				? [...updatedQuestion.question_tag]
				: questions[questionIndex].question_tag,
			keywords: Array.isArray(updatedQuestion.keywords)
				? [...updatedQuestion.keywords]
				: questions[questionIndex].keywords
		};

		if (selectedQuestion?.id === updatedQuestion.id) {
			selectedQuestion = questions[questionIndex];
		}
	}

	// Open question details modal
	const openModal = (questionData: any) => {
		selectedQuestion = questionData;
		getModal('question-details-modal').open(() => {
			selectedQuestion = null;
		});
	};
</script>

<svelte:head>
	<title>Admin - Questions</title>
</svelte:head>

<div class="admin-questions">
	<header class="page-header">
		<div class="header-copy">
			<span class="page-kicker">Admin moderation</span>
			<h1 class="page-title">Questions</h1>
			<p class="page-subtitle">
				Review formatting, filter moderation states, and open a cleaner detail editor for each
				question.
			</p>
		</div>
		<div class="header-actions">
			<div class="header-pill">
				<span class="header-pill-label">Visible now</span>
				<strong class="header-pill-value">{displayedQuestions.length}</strong>
			</div>
			<a href="/admin/questions/hierarchy" class="hierarchy-btn">View Hierarchy</a>
		</div>
	</header>

	<section class="stats-section">
		<div class="stats-grid">
			<StatCard icon="❓" label="Total Questions" value={totalQuestions} color="primary" />
			<StatCard icon="💬" label="Total Comments" value={totalComments} color="success" />
			<StatCard
				icon="🏷️"
				label="Tagged"
				value="{taggedCount}/{totalQuestions}"
				color={untaggedCount > 0 ? 'warning' : 'success'}
				subValue="{untaggedCount} untagged"
			/>
			<StatCard
				icon="✅"
				label="Processed"
				value="{processedCount}/{totalQuestions}"
				color={unprocessedCount > 0 ? 'warning' : 'success'}
				subValue="{unprocessedCount} unprocessed"
			/>
		</div>
	</section>

	<section class="questions-section">
		<div class="questions-card">
			<div class="card-header">
				<div class="card-heading">
					<div>
						<h2 class="card-title">All Questions</h2>
						<p class="card-subtitle">
							Search across the original and formatted text, then sort by moderation signals or
							recent activity.
						</p>
					</div>
					<span class="count-badge">{displayedQuestions.length} visible</span>
				</div>

				<div class="controls-grid">
					<label class="control-field control-field-search">
						<span class="control-label">Search</span>
						<input
							type="text"
							placeholder="Search questions..."
							bind:value={searchQuery}
							class="search-input"
						/>
					</label>

					<label class="control-field">
						<span class="control-label">Status</span>
						<select bind:value={filterStatus} class="filter-select">
							<option value="all">All Status</option>
							<option value="active">Active</option>
							<option value="flagged">Flagged</option>
							<option value="removed">Removed</option>
							<optgroup label="Tags">
								<option value="tagged">Has Tags</option>
								<option value="untagged">No Tags</option>
							</optgroup>
							<optgroup label="Processing">
								<option value="processed">Processed</option>
								<option value="unprocessed">Unprocessed</option>
							</optgroup>
						</select>
					</label>

					{#if allTags.length > 0}
						<label class="control-field">
							<span class="control-label">Category</span>
							<select
								class="filter-select"
								value={filterCategory ?? ''}
								onchange={(e) => {
									const val = (e.target as HTMLSelectElement).value;
									filterCategory = val ? Number(val) : null;
								}}
							>
								<option value="">All Categories</option>
								{#each allTags as tag}
									<option value={tag.id}>{tag.name}</option>
								{/each}
							</select>
						</label>
					{/if}
				</div>

				<div class="sort-row">
					<span class="sort-label">Sort by</span>
					<div class="sort-tabs">
						<button
							type="button"
							class="sort-tab"
							class:active={currentSort === 'lastComment'}
							onclick={() => (currentSort = 'lastComment')}
						>
							Recent Activity
						</button>
						<button
							type="button"
							class="sort-tab"
							class:active={currentSort === 'mostComments'}
							onclick={() => (currentSort = 'mostComments')}
						>
							Most Comments
						</button>
						<button
							type="button"
							class="sort-tab"
							class:active={currentSort === 'newest'}
							onclick={() => (currentSort = 'newest')}
						>
							Newest
						</button>
						<button
							type="button"
							class="sort-tab"
							class:active={currentSort === 'oldest'}
							onclick={() => (currentSort = 'oldest')}
						>
							Oldest
						</button>
					</div>
				</div>
			</div>

			{#if displayedQuestions.length}
				<div class="questions-list">
					{#each displayedQuestions as question}
						<article
							class="question-item"
							class:flagged={question.flagged}
							class:removed={question.removed}
						>
							<div class="question-content">
								<div class="question-header">
									<h3 class="question-text">
										{question.question_formatted || question.question}
									</h3>
									<div class="status-badges">
										{#if hasAssignedTags(question)}
											<span class="status-badge tagged">Has Tags</span>
										{:else}
											<span class="status-badge untagged">No Tags</span>
										{/if}
										{#if isProcessed(question)}
											<span class="status-badge processed">Processed</span>
										{:else}
											<span class="status-badge unprocessed">Unprocessed</span>
										{/if}
										{#if question.flagged}
											<span class="status-badge flagged-badge">Flagged</span>
										{/if}
										{#if question.removed}
											<span class="status-badge removed-badge">Removed</span>
										{/if}
									</div>
								</div>

								{#if question.question_tag?.length > 0}
									<div class="category-tags">
										{#each question.question_tag as tag}
											<span class="category-tag">{tag.tag_name}</span>
										{/each}
									</div>
								{/if}

								<div class="question-meta">
									<span class="meta-item comments">
										<span class="meta-icon">💬</span>
										{question.comment_count} comments
									</span>
									<span class="meta-item">
										Created {convertDateToReadable(question.created_at)}
									</span>
									{#if question.last_comment_date}
										<span class="meta-item">
											Last activity {convertDateToReadable(question.last_comment_date)}
										</span>
									{/if}
								</div>
							</div>

							<div class="question-actions">
								<a href="/questions/{question.url}" class="action-btn view" target="_blank">
									View
								</a>
								<button
									type="button"
									class="action-btn details"
									onclick={() => openModal(question)}
								>
									Details
								</button>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<h3>No matching questions</h3>
					<p>Try clearing one of the filters or broadening your search.</p>
				</div>
			{/if}
		</div>
	</section>
</div>

<Modal2 id="question-details-modal">
	<div class="modal-content">
		{#if selectedQuestion}
			<AdminQuestionItem
				questionData={selectedQuestion}
				tags={data.tags || []}
				onQuestionUpdated={updateQuestion}
			/>
		{/if}
	</div>
</Modal2>

<style>
	.admin-questions {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 16px 24px;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
		padding: 24px;
		border: 1px solid color-mix(in srgb, var(--primary) 14%, var(--border-color));
		border-radius: 24px;
		background: linear-gradient(
			145deg,
			color-mix(in srgb, var(--primary) 9%, var(--bg-surface)) 0%,
			var(--bg-surface) 54%,
			var(--bg-deep) 100%
		);
		box-shadow: var(--shadow-md);
	}

	.header-copy {
		max-width: 720px;
	}

	.page-kicker {
		display: inline-flex;
		align-items: center;
		padding: 6px 10px;
		margin-bottom: 12px;
		border-radius: 999px;
		background: var(--primary-subtle);
		color: var(--primary);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.page-title {
		margin: 0;
		font-size: clamp(1.65rem, 2vw, 2.25rem);
		font-weight: 750;
		color: var(--text-primary);
	}

	.page-subtitle {
		margin: 10px 0 0;
		max-width: 62ch;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
	}

	.header-pill {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 110px;
		padding: 12px 14px;
		border: 1px solid var(--border-color);
		border-radius: 16px;
		background: rgba(0, 0, 0, 0.12);
	}

	.header-pill-label {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.header-pill-value {
		font-size: 1.35rem;
		line-height: 1;
		color: var(--text-primary);
	}

	.hierarchy-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 10px 16px;
		border-radius: 12px;
		border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
		background: var(--primary);
		color: white;
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 650;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			opacity 0.2s ease;
	}

	.hierarchy-btn:hover {
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
		opacity: 0.96;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
		gap: 16px;
	}

	.questions-card {
		overflow: hidden;
		border: 1px solid var(--border-color);
		border-radius: 24px;
		background: linear-gradient(
			180deg,
			var(--bg-surface) 0%,
			color-mix(in srgb, var(--bg-surface) 78%, var(--bg-deep)) 100%
		);
		box-shadow: var(--shadow-md);
	}

	.card-header {
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding: 24px;
		border-bottom: 1px solid color-mix(in srgb, var(--primary) 10%, var(--border-color));
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--primary) 6%, var(--bg-deep)) 0%,
			var(--bg-deep) 100%
		);
	}

	.card-heading {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
	}

	.card-title {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.card-subtitle {
		margin: 6px 0 0;
		max-width: 60ch;
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.count-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 12px;
		border-radius: 999px;
		background: var(--primary-subtle);
		color: var(--primary);
		font-size: 0.78rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.controls-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 14px;
	}

	.control-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}

	.control-field-search {
		grid-column: span 2;
	}

	.control-label {
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.search-input,
	.filter-select {
		width: 100%;
		height: 44px;
		padding: 0 14px;
		border: 1px solid var(--border-color);
		border-radius: 12px;
		background: color-mix(in srgb, var(--bg-surface) 82%, var(--bg-deep));
		color: var(--text-primary);
		font-size: 0.9rem;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background 0.2s ease;
	}

	.search-input::placeholder {
		color: color-mix(in srgb, var(--text-secondary) 88%, transparent);
	}

	.search-input:focus,
	.filter-select:focus {
		outline: none;
		border-color: color-mix(in srgb, var(--primary) 70%, var(--border-color));
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent);
		background: var(--bg-surface);
	}

	.filter-select {
		cursor: pointer;
	}

	.sort-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	.sort-label {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	.sort-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.sort-tab {
		padding: 8px 14px;
		border: 1px solid var(--border-color);
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg-surface) 78%, var(--bg-deep));
		color: var(--text-secondary);
		font-size: 0.8rem;
		font-weight: 650;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease,
			transform 0.2s ease;
	}

	.sort-tab:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--primary) 45%, var(--border-color));
		color: var(--text-primary);
	}

	.sort-tab.active {
		border-color: color-mix(in srgb, var(--primary) 35%, transparent);
		background: var(--primary-subtle);
		color: var(--primary);
	}

	.questions-list {
		display: grid;
		gap: 14px;
		padding: 20px;
	}

	.question-item {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 140px;
		gap: 18px;
		align-items: start;
		padding: 18px;
		border: 1px solid var(--border-color);
		border-radius: 20px;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg-surface) 86%, var(--bg-deep)) 0%,
			var(--bg-deep) 100%
		);
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.question-item:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--primary) 18%, var(--border-color));
		box-shadow: var(--shadow-sm);
	}

	.question-item.flagged {
		border-color: color-mix(in srgb, #f59e0b 45%, var(--border-color));
		box-shadow: inset 3px 0 0 rgba(245, 158, 11, 0.7);
	}

	.question-item.removed {
		border-color: color-mix(in srgb, #ef4444 45%, var(--border-color));
		box-shadow: inset 3px 0 0 rgba(239, 68, 68, 0.72);
	}

	.question-content {
		min-width: 0;
	}

	.question-header {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.question-text {
		margin: 0;
		flex: 1;
		min-width: 220px;
		font-size: 1rem;
		line-height: 1.55;
		font-weight: 650;
		color: var(--text-primary);
		word-break: break-word;
	}

	.status-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		justify-content: flex-end;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		padding: 5px 10px;
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1;
		white-space: nowrap;
	}

	.status-badge.tagged {
		background: rgba(16, 185, 129, 0.13);
		color: #34d399;
	}

	.status-badge.untagged {
		background: rgba(245, 158, 11, 0.14);
		color: #fbbf24;
	}

	.status-badge.processed {
		background: rgba(59, 130, 246, 0.14);
		color: #60a5fa;
	}

	.status-badge.unprocessed {
		background: rgba(148, 163, 184, 0.16);
		color: #cbd5e1;
	}

	.status-badge.flagged-badge {
		background: rgba(245, 158, 11, 0.15);
		color: #fbbf24;
	}

	.status-badge.removed-badge {
		background: rgba(239, 68, 68, 0.14);
		color: #fca5a5;
	}

	.category-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 14px;
	}

	.category-tag {
		display: inline-flex;
		align-items: center;
		padding: 6px 10px;
		border: 1px solid color-mix(in srgb, var(--primary) 22%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--primary) 9%, transparent);
		color: color-mix(in srgb, var(--primary) 82%, white);
		font-size: 0.72rem;
		font-weight: 650;
	}

	.question-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 10px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.03);
		color: var(--text-secondary);
		font-size: 0.78rem;
		font-weight: 550;
	}

	.meta-item.comments {
		background: rgba(16, 185, 129, 0.12);
		color: #34d399;
	}

	.meta-icon {
		font-size: 0.82rem;
	}

	.question-actions {
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-self: stretch;
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 42px;
		padding: 0 12px;
		border-radius: 12px;
		font-size: 0.82rem;
		font-weight: 700;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease,
			opacity 0.2s ease;
	}

	.action-btn:hover {
		transform: translateY(-1px);
	}

	.action-btn.view {
		border: 1px solid var(--border-color);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-primary);
	}

	.action-btn.view:hover {
		border-color: color-mix(in srgb, var(--primary) 40%, var(--border-color));
		color: var(--primary);
	}

	.action-btn.details {
		border: 1px solid transparent;
		background: var(--primary);
		color: white;
	}

	.action-btn.details:hover {
		opacity: 0.94;
	}

	.empty-state {
		padding: 72px 24px;
		text-align: center;
	}

	.empty-state h3 {
		margin: 0 0 8px;
		font-size: 1.05rem;
		color: var(--text-primary);
	}

	.empty-state p {
		margin: 0;
		color: var(--text-secondary);
	}

	.modal-content {
		width: min(1080px, calc(100vw - 1.5rem));
		max-width: 100%;
	}

	@media (max-width: 900px) {
		.card-heading {
			flex-direction: column;
			align-items: flex-start;
		}

		.control-field-search {
			grid-column: span 1;
		}

		.question-item {
			grid-template-columns: 1fr;
		}

		.question-actions {
			flex-direction: row;
			width: 100%;
		}
	}

	@media (max-width: 768px) {
		.admin-questions {
			padding: 0 12px 20px;
		}

		.page-header,
		.card-header {
			padding: 20px;
		}

		.stats-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.sort-row {
			align-items: flex-start;
			flex-direction: column;
		}

		.questions-list {
			padding: 16px;
		}
	}

	@media (max-width: 560px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}

		.header-actions,
		.question-actions {
			width: 100%;
		}

		.header-pill {
			flex: 1;
		}

		.question-actions {
			flex-direction: column;
		}
	}
</style>

<!-- src/routes/admin/questions/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { convertDateToReadable } from '../../../utils/conversions';
	import StatCard from '$lib/components/charts/StatCard.svelte';

	let { data }: { data: PageData } = $props();

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
	let totalQuestions = $derived(data.questions?.length || 0);
	let totalComments = $derived(
		data.questions?.reduce((sum: number, q: any) => sum + (q.comment_count || 0), 0) || 0
	);
	let taggedCount = $derived(
		data.questions?.filter((q: any) => q.tagged || q.question_tag?.length > 0).length || 0
	);
	let untaggedCount = $derived(totalQuestions - taggedCount);
	let processedCount = $derived(
		data.questions?.filter((q: any) => q.question_formatted && q.question_formatted !== q.question)
			.length || 0
	);
	let unprocessedCount = $derived(totalQuestions - processedCount);

	// Build unique tag list for category filter
	let allTags = $derived.by(() => {
		const tagMap = new Map<number, string>();
		for (const q of data.questions || []) {
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
		let filtered = data.questions || [];

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
			filtered = filtered.filter((q: any) => q.tagged || q.question_tag?.length > 0);
		} else if (filterStatus === 'untagged') {
			filtered = filtered.filter(
				(q: any) => !q.tagged && (!q.question_tag || q.question_tag.length === 0)
			);
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
	function hasAiTags(question: any): boolean {
		return question.tagged || question.question_tag?.length > 0;
	}

	function isProcessed(question: any): boolean {
		return question.question_formatted && question.question_formatted !== question.question;
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
		<div class="header-content">
			<h1 class="page-title">Questions</h1>
			<a href="/admin/questions/hierarchy" class="hierarchy-btn">View Hierarchy</a>
		</div>
	</header>

	<!-- Stats Grid -->
	<section class="stats-section">
		<div class="stats-grid">
			<StatCard icon="❓" label="Total Questions" value={totalQuestions} color="primary" />
			<StatCard icon="💬" label="Total Comments" value={totalComments} color="success" />
			<StatCard
				icon="🏷️"
				label="AI Tagged"
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

	<!-- Questions List -->
	<section class="questions-section">
		<div class="questions-card">
			<div class="card-header">
				<h3 class="card-title">
					All Questions
					<span class="count-badge">{displayedQuestions.length}</span>
				</h3>
				<div class="controls">
					<input
						type="text"
						placeholder="Search questions..."
						bind:value={searchQuery}
						class="search-input"
					/>
					<select bind:value={filterStatus} class="filter-select">
						<option value="all">All Status</option>
						<option value="active">Active</option>
						<option value="flagged">Flagged</option>
						<option value="removed">Removed</option>
						<optgroup label="AI Tags">
							<option value="tagged">Has AI Tags</option>
							<option value="untagged">No AI Tags</option>
						</optgroup>
						<optgroup label="Processing">
							<option value="processed">Processed</option>
							<option value="unprocessed">Unprocessed</option>
						</optgroup>
					</select>
					{#if allTags.length > 0}
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
					{/if}
					<div class="sort-tabs">
						<button
							class="sort-tab"
							class:active={currentSort === 'lastComment'}
							onclick={() => (currentSort = 'lastComment')}
						>
							Recent Activity
						</button>
						<button
							class="sort-tab"
							class:active={currentSort === 'mostComments'}
							onclick={() => (currentSort = 'mostComments')}
						>
							Most Comments
						</button>
						<button
							class="sort-tab"
							class:active={currentSort === 'newest'}
							onclick={() => (currentSort = 'newest')}
						>
							Newest
						</button>
						<button
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
						<div
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
										{#if hasAiTags(question)}
											<span class="status-badge tagged">AI Tagged</span>
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

								<!-- Category Tags -->
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
						</div>
					{/each}
				</div>
			{:else}
				<div class="empty-state">
					<p>No questions found matching your criteria.</p>
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
				on:questionRemoved={() => invalidateAll()}
			/>
		{/if}
	</div>
</Modal2>

<style>
	.admin-questions {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 16px;
	}

	/* Header */
	.page-header {
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--void-elevated);
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
	}

	.hierarchy-btn {
		padding: 8px 16px;
		background: var(--shadow-monarch);
		color: white;
		border-radius: 8px;
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 500;
		transition: background 0.2s ease;
	}

	.hierarchy-btn:hover {
		opacity: 0.85;
	}

	/* Stats Section */
	.stats-section {
		margin-bottom: 24px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 16px;
	}

	/* Questions Section */
	.questions-section {
		margin-bottom: 24px;
	}

	.questions-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		overflow: hidden;
	}

	.card-header {
		padding: 16px;
		border-bottom: 1px solid var(--void-elevated);
		background: var(--void-deep);
	}

	.card-title {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 12px 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.count-badge {
		padding: 2px 8px;
		background: var(--shadow-monarch);
		color: white;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}

	.search-input {
		padding: 8px 12px;
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		font-size: 0.8rem;
		min-width: 200px;
		background: var(--void-surface);
		color: var(--text-primary);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--shadow-monarch);
	}

	.filter-select {
		padding: 8px 12px;
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		font-size: 0.8rem;
		background: var(--void-surface);
		color: var(--text-primary);
		cursor: pointer;
	}

	.sort-tabs {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
	}

	.sort-tab {
		padding: 6px 12px;
		border: 1px solid var(--void-elevated);
		border-radius: 6px;
		background: var(--void-surface);
		color: var(--text-secondary);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.sort-tab:hover {
		border-color: var(--shadow-monarch);
		color: var(--shadow-monarch);
	}

	.sort-tab.active {
		background: var(--shadow-monarch);
		border-color: var(--shadow-monarch);
		color: white;
	}

	/* Questions List */
	.questions-list {
		/* Full page scrolling - no constrained height */
	}

	.question-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
		padding: 16px;
		border-bottom: 1px solid var(--void-elevated);
		transition: background 0.2s ease;
	}

	.question-item:hover {
		background: var(--void-deep);
	}

	.question-item:last-child {
		border-bottom: none;
	}

	.question-item.flagged {
		background: rgba(245, 158, 11, 0.05);
		border-left: 3px solid #f59e0b;
	}

	.question-item.removed {
		background: rgba(239, 68, 68, 0.05);
		border-left: 3px solid #ef4444;
	}

	.question-content {
		flex: 1;
		min-width: 0;
	}

	.question-header {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		margin-bottom: 6px;
		flex-wrap: wrap;
	}

	.question-text {
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.4;
		flex: 1;
		min-width: 200px;
	}

	.status-badges {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
		flex-shrink: 0;
	}

	.status-badge {
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 0.65rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.status-badge.tagged {
		background: rgba(16, 185, 129, 0.12);
		color: #059669;
	}

	.status-badge.untagged {
		background: rgba(245, 158, 11, 0.12);
		color: #d97706;
	}

	.status-badge.processed {
		background: rgba(99, 102, 241, 0.12);
		color: #6366f1;
	}

	.status-badge.unprocessed {
		background: rgba(156, 163, 175, 0.15);
		color: #6b7280;
	}

	.status-badge.flagged-badge {
		background: rgba(245, 158, 11, 0.1);
		color: #d97706;
	}

	.status-badge.removed-badge {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
	}

	/* Category Tags */
	.category-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-bottom: 6px;
	}

	.category-tag {
		display: inline-flex;
		align-items: center;
		padding: 2px 8px;
		background: rgba(124, 58, 237, 0.1);
		color: #7c3aed;
		border-radius: 10px;
		font-size: 0.7rem;
		font-weight: 500;
	}

	.question-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.meta-item.comments {
		padding: 2px 8px;
		background: rgba(16, 185, 129, 0.1);
		color: #059669;
		border-radius: 12px;
		font-weight: 500;
	}

	.meta-icon {
		font-size: 0.8rem;
	}

	.question-actions {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
	}

	.action-btn {
		padding: 6px 12px;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.action-btn.view {
		background: var(--void-surface);
		color: var(--text-secondary);
		border: 1px solid var(--void-elevated);
	}

	.action-btn.view:hover {
		border-color: var(--shadow-monarch);
		color: var(--shadow-monarch);
	}

	.action-btn.details {
		background: var(--shadow-monarch);
		color: white;
		border: none;
	}

	.action-btn.details:hover {
		opacity: 0.85;
	}

	/* Empty State */
	.empty-state {
		padding: 48px 24px;
		text-align: center;
		color: var(--text-secondary);
	}

	/* Modal */
	.modal-content {
		width: min(600px, 85vw);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.admin-questions {
			padding: 0 12px;
		}

		.page-title {
			font-size: 1.25rem;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.controls {
			flex-direction: column;
			align-items: stretch;
		}

		.search-input {
			min-width: 0;
		}

		.sort-tabs {
			justify-content: flex-start;
		}

		.question-item {
			flex-direction: column;
			gap: 12px;
		}

		.question-actions {
			width: 100%;
		}

		.action-btn {
			flex: 1;
			text-align: center;
		}
	}
</style>

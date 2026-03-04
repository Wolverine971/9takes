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
	let filterStatus = $state<'all' | 'active' | 'flagged' | 'removed'>('all');

	// Stats
	let totalQuestions = $derived(data.questions?.length || 0);
	let totalComments = $derived(
		data.questions?.reduce((sum: number, q: any) => sum + (q.comment_count || 0), 0) || 0
	);
	let flaggedCount = $derived(data.questions?.filter((q: any) => q.flagged).length || 0);
	let removedCount = $derived(data.questions?.filter((q: any) => q.removed).length || 0);

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
		}

		return sortFunctions[currentSort](filtered);
	});

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
			<a href="/admin/questions/hierarchy" class="hierarchy-btn"> View Hierarchy </a>
		</div>
	</header>

	<!-- Stats Grid -->
	<section class="stats-section">
		<div class="stats-grid">
			<StatCard icon="❓" label="Total Questions" value={totalQuestions} color="primary" />
			<StatCard icon="💬" label="Total Comments" value={totalComments} color="success" />
			<StatCard
				icon="🚩"
				label="Flagged"
				value={flaggedCount}
				color={flaggedCount > 0 ? 'warning' : 'default'}
			/>
			<StatCard
				icon="🗑️"
				label="Removed"
				value={removedCount}
				color={removedCount > 0 ? 'danger' : 'default'}
			/>
		</div>
	</section>

	<!-- Questions List -->
	<section class="questions-section">
		<div class="questions-card">
			<div class="card-header">
				<h3 class="card-title">
					<span class="title-icon">❓</span>
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
					</select>
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
									{#if question.flagged}
										<span class="status-badge flagged">Flagged</span>
									{/if}
									{#if question.removed}
										<span class="status-badge removed">Removed</span>
									{/if}
								</div>
								<div class="question-meta">
									<span class="meta-item comments">
										<span class="meta-icon">💬</span>
										{question.comment_count} comments
									</span>
									<span class="meta-item">
										<span class="meta-icon">📅</span>
										Created {convertDateToReadable(question.created_at)}
									</span>
									{#if question.last_comment_date}
										<span class="meta-item">
											<span class="meta-icon">🕐</span>
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
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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

	.title-icon {
		font-size: 1rem;
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
		max-height: calc(100vh - 400px);
		min-height: 400px;
		overflow-y: auto;
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
		margin-bottom: 8px;
		flex-wrap: wrap;
	}

	.question-text {
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--text-primary);
		margin: 0;
		line-height: 1.4;
	}

	.status-badge {
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 0.7rem;
		font-weight: 600;
		flex-shrink: 0;
	}

	.status-badge.flagged {
		background: rgba(245, 158, 11, 0.1);
		color: #d97706;
	}

	.status-badge.removed {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
	}

	.question-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
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

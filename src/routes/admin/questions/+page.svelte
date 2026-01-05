<!-- src/routes/admin/questions/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { convertDateToReadable } from '../../../utils/conversions';
	import { onMount } from 'svelte';
	import StatCard from '$lib/components/charts/StatCard.svelte';

	export let data: PageData;

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
	let selectedQuestion: any = null;
	let displayedQuestions: any[] = [];
	let currentSort = 'lastComment';
	let searchQuery = '';
	let filterStatus: 'all' | 'active' | 'flagged' | 'removed' = 'all';

	// Stats
	$: totalQuestions = data.questions?.length || 0;
	$: totalComments =
		data.questions?.reduce((sum: number, q: any) => sum + (q.comment_count || 0), 0) || 0;
	$: flaggedCount = data.questions?.filter((q: any) => q.flagged).length || 0;
	$: removedCount = data.questions?.filter((q: any) => q.removed).length || 0;

	// Filter and sort questions
	$: {
		let filtered = data.questions || [];

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(q: any) =>
					q.question?.toLowerCase().includes(query) ||
					q.question_formatted?.toLowerCase().includes(query)
			);
		}

		// Apply status filter
		if (filterStatus === 'flagged') {
			filtered = filtered.filter((q: any) => q.flagged);
		} else if (filterStatus === 'removed') {
			filtered = filtered.filter((q: any) => q.removed);
		} else if (filterStatus === 'active') {
			filtered = filtered.filter((q: any) => !q.flagged && !q.removed);
		}

		// Apply sorting
		displayedQuestions = sortFunctions[currentSort](filtered);
	}

	// Open question details modal
	const openModal = (questionData: any) => {
		selectedQuestion = questionData;
		getModal('question-details-modal').open();
	};

	// Initialize on mount
	onMount(() => {
		if (data.questions) {
			displayedQuestions = sortFunctions[currentSort](data.questions);
		}
	});
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
							on:click={() => (currentSort = 'lastComment')}
						>
							Recent Activity
						</button>
						<button
							class="sort-tab"
							class:active={currentSort === 'mostComments'}
							on:click={() => (currentSort = 'mostComments')}
						>
							Most Comments
						</button>
						<button
							class="sort-tab"
							class:active={currentSort === 'newest'}
							on:click={() => (currentSort = 'newest')}
						>
							Newest
						</button>
						<button
							class="sort-tab"
							class:active={currentSort === 'oldest'}
							on:click={() => (currentSort = 'oldest')}
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
									on:click={() => openModal(question)}
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
		border-bottom: 1px solid var(--border-color, #e2e8f0);
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
		color: var(--text-primary, #1e293b);
		margin: 0;
	}

	.hierarchy-btn {
		padding: 8px 16px;
		background: var(--primary, #3b82f6);
		color: white;
		border-radius: 8px;
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 500;
		transition: background 0.2s ease;
	}

	.hierarchy-btn:hover {
		background: #2563eb;
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
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 12px;
		overflow: hidden;
	}

	.card-header {
		padding: 16px;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		background: var(--hover-background, #f8fafc);
	}

	.card-title {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 12px 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
	}

	.title-icon {
		font-size: 1rem;
	}

	.count-badge {
		padding: 2px 8px;
		background: var(--primary, #3b82f6);
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
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 8px;
		font-size: 0.8rem;
		min-width: 200px;
		background: var(--card-background, #fff);
		color: var(--text-primary, #1e293b);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary, #3b82f6);
	}

	.filter-select {
		padding: 8px 12px;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 8px;
		font-size: 0.8rem;
		background: var(--card-background, #fff);
		color: var(--text-primary, #1e293b);
		cursor: pointer;
	}

	.sort-tabs {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
	}

	.sort-tab {
		padding: 6px 12px;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 6px;
		background: var(--card-background, #fff);
		color: var(--text-secondary, #64748b);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.sort-tab:hover {
		border-color: var(--primary, #3b82f6);
		color: var(--primary, #3b82f6);
	}

	.sort-tab.active {
		background: var(--primary, #3b82f6);
		border-color: var(--primary, #3b82f6);
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
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		transition: background 0.2s ease;
	}

	.question-item:hover {
		background: var(--hover-background, #f8fafc);
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
		color: var(--text-primary, #1e293b);
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
		color: var(--text-secondary, #64748b);
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
		background: var(--card-background, #fff);
		color: var(--text-secondary, #64748b);
		border: 1px solid var(--border-color, #e2e8f0);
	}

	.action-btn.view:hover {
		border-color: var(--primary, #3b82f6);
		color: var(--primary, #3b82f6);
	}

	.action-btn.details {
		background: var(--primary, #3b82f6);
		color: white;
		border: none;
	}

	.action-btn.details:hover {
		background: #2563eb;
	}

	/* Empty State */
	.empty-state {
		padding: 48px 24px;
		text-align: center;
		color: var(--text-secondary, #64748b);
	}

	/* Modal */
	.modal-content {
		max-width: 800px;
		width: 100%;
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

<!-- routes/admin/questions/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { convertDateToReadable } from '../../../utils/conversions';
	import { onMount } from 'svelte';

	export let data: PageData;


	// Question sorting functions
	const sortFunctions = {
		lastComment: (questions) => {
			return [...questions].sort((a, b) => {
				const dateA = a.last_comment_date ? new Date(a.last_comment_date).getTime() : 0;
				const dateB = b.last_comment_date ? new Date(b.last_comment_date).getTime() : 0;

				// First, compare by last_comment_date descending
				if (dateB !== dateA) {
					return dateB - dateA;
				}

				// If dates are the same or both are null, compare by comment_count descending
				return b.comment_count - a.comment_count;
			});
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
	let selectedQuestion = null;
	let displayedQuestions = [];
	let currentSort = 'lastComment';

	// Apply sort and update displayed questions
	function applySorting(sortType) {
		currentSort = sortType;
		displayedQuestions = sortFunctions[sortType](data.questions);
	}

	// Open question details modal
	const openModal = (questionData) => {
		selectedQuestion = questionData;
		getModal(`question-details-modal`).open();
	};

	// Get background color based on question status
	function getQuestionBackground(question) {
		if (question.removed) return 'bg-error-50';
		if (question.flagged) return 'bg-warning-50';
		return 'bg-white';
	}

	// Initialize questions on component mount
	onMount(() => {
		applySorting('lastComment');
	});
</script>

<svelte:head>
	<title>Admin - Questions</title>
</svelte:head>

{#if data.user?.admin}
	<div class="admin-questions">
		<!-- Page Header -->
		<div class="page-header">
			<h1>Questions</h1>
			<p class="subtitle">Manage and monitor all platform questions</p>
		</div>

		<!-- Action Buttons -->
		<div class="mb-6 flex flex-wrap gap-4">
			<Button
				href="/admin/questions/hierarchy"
				class="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
			>
				View Hierarchy
			</Button>

			<div class="flex flex-wrap gap-2">
				<Button
					color="light"
					class={currentSort === 'lastComment'
						? 'border-primary-300 bg-primary-100 text-primary-700'
						: 'bg-neutral-100 hover:bg-primary-50'}
					on:click={() => applySorting('lastComment')}
				>
					Last Comment
				</Button>
				<Button
					color="light"
					class={currentSort === 'newest'
						? 'border-primary-300 bg-primary-100 text-primary-700'
						: 'bg-neutral-100 hover:bg-primary-50'}
					on:click={() => applySorting('newest')}
				>
					Newest
				</Button>
				<Button
					color="light"
					class={currentSort === 'oldest'
						? 'border-primary-300 bg-primary-100 text-primary-700'
						: 'bg-neutral-100 hover:bg-primary-50'}
					on:click={() => applySorting('oldest')}
				>
					Oldest
				</Button>
			</div>
		</div>

		{#if displayedQuestions.length}
			<div class="section-card">
				<div class="questions-list">
					{#each displayedQuestions as question}
						<div
							class="question-item {getQuestionBackground(question)}"
						>
							<h2 class="question-title">
								{question.question_formatted || question.question}
							</h2>
							<div class="question-meta">
								<div class="meta-info">
									<span class="comment-badge">
										{question.comment_count} Comments
									</span>
									<span>Created: {convertDateToReadable(question.created_at)}</span>
									{#if question.last_comment_date}
										<span>Last Comment: {convertDateToReadable(question.last_comment_date)}</span>
									{/if}
								</div>
								<button
									type="button"
									class="btn-action"
									on:click={() => openModal(question)}
								>
									Details
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="empty-state">
				<p>No questions found.</p>
			</div>
		{/if}
	</div>
{:else}
	<div class="rounded-lg bg-white p-6 text-center shadow-md">
		<h1 class="mb-2 text-xl font-semibold text-error-500">Access Denied</h1>
		<p class="text-neutral-600">You need administrator privileges to view this page.</p>
	</div>
{/if}

<Modal2 id="question-details-modal">
	<div class="max-w-4xl rounded-lg bg-neutral-50 p-6">
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
		max-width: 100%;
		margin: 0 auto;
	}

	.action-buttons {
		margin-bottom: 1.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.section-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1.5rem;
		box-shadow: var(--shadow-sm);
	}

	.questions-list {
		max-height: calc(100vh - 300px);
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	.question-item {
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1rem;
		margin-bottom: 1rem;
		transition: all 0.2s ease;
		background-color: var(--background);
	}

	.question-item:hover {
		box-shadow: var(--shadow-md);
		transform: translateY(-1px);
	}

	.question-item.bg-error-50 {
		background-color: var(--error-light);
		border-color: var(--error);
	}

	.question-item.bg-warning-50 {
		background-color: var(--warning-light);
		border-color: var(--warning);
	}

	.question-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
		line-height: 1.4;
	}

	.question-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.meta-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.comment-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		background-color: var(--primary-light);
		color: var(--primary);
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.btn-action {
		padding: 0.375rem 0.75rem;
		background-color: var(--primary);
		color: white;
		border: none;
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-action:hover {
		background-color: var(--primary-dark);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--text-secondary);
		background-color: var(--hover-background);
		border: 1px dashed var(--border-color);
		border-radius: var(--border-radius);
	}

	@media (max-width: 768px) {
		.questions-list {
			padding-right: 0;
		}

		.question-item {
			padding: 0.75rem;
		}

		.question-title {
			font-size: 1rem;
		}

		.question-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.meta-info {
			font-size: 0.75rem;
		}
	}
</style>

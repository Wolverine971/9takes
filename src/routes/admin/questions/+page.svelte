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

	// Admin navigation items
	const navItems = [
		{ href: '/admin/users', label: 'Users' },
		{ href: '/admin/questions', label: 'Questions', active: true },
		{ href: '/admin/comments', label: 'Comments' },
		{ href: '/content-board', label: 'Content Board' },
		{ href: '/marketing', label: 'Marketing' },
		{ href: '/links', label: 'Links' },
		{ href: '/admin/messages', label: 'Messages' }
	];

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
	<div class="rounded-lg bg-neutral-50 bg-opacity-80 p-6 shadow-lg backdrop-blur-sm">
		<!-- Admin Navigation -->
		<div class="mb-6 flex space-x-4 overflow-x-auto pb-2">
			{#each navItems as item}
				<a
					href={item.href}
					class="{item.active
						? 'font-semibold text-primary-700'
						: 'text-neutral-600 hover:text-primary-600'} transition-colors"
				>
					{item.label}
				</a>
				{#if item !== navItems[navItems.length - 1]}
					<span class="text-neutral-400">|</span>
				{/if}
			{/each}
		</div>

		<div class="mb-6">
			<h1 class="text-2xl font-bold text-neutral-900">Questions</h1>
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
			<div class="rounded-lg bg-white p-4 shadow-md">
				<div class="-mr-4 max-h-[calc(100vh-240px)] space-y-4 overflow-y-auto pr-4">
					{#each displayedQuestions as question}
						<div
							class="{getQuestionBackground(
								question
							)} rounded border border-neutral-200 p-4 shadow-sm transition-all hover:shadow-md"
						>
							<h2 class="mb-2 text-xl font-bold text-neutral-800">
								{question.question_formatted || question.question}
							</h2>
							<div class="flex flex-wrap items-center justify-between gap-2">
								<div class="text-sm text-neutral-600">
									<span
										class="mr-2 inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700"
									>
										{question.comment_count} Comments
									</span>
									<span class="mr-2">Created: {convertDateToReadable(question.created_at)}</span>
									{#if question.last_comment_date}
										<span>Last Comment: {convertDateToReadable(question.last_comment_date)}</span>
									{/if}
								</div>
								<button
									type="button"
									class="rounded bg-primary-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
			<div class="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center">
				<p class="text-neutral-600">No questions found.</p>
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

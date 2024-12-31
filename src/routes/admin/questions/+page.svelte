<script lang="ts">
	import type { PageData } from './$types';
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';
	import { Button, Tabs, TabItem } from 'flowbite-svelte';

	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { convertDateToReadable } from '../../../utils/conversions';
	import { onMount } from 'svelte';
	export let data: PageData;

	const navItems = [
		{ href: '/admin/users', label: 'Users' },
		{ href: '/admin/questions', label: 'Questions' },
		{ href: '/admin/comments', label: 'Comments' },
		{ href: '/content-board', label: 'Content Board' },
		{ href: '/marketing', label: 'Marketing' },
		{ href: '/links', label: 'Links' },
		{ href: '/admin/messages', label: 'Messages' }
	];
	// console.log(data);

	const normalSort = (questions) => {
		return questions.sort((a, b) => {
			console.log(questions);
			// Convert last_comment_date to a timestamp, treating null as zero
			const dateA = a.last_comment_date ? new Date(a.last_comment_date).getTime() : 0;
			const dateB = b.last_comment_date ? new Date(b.last_comment_date).getTime() : 0;

			// First, compare by last_comment_date descending
			if (dateB !== dateA) {
				return dateB - dateA;
			}

			// If dates are the same or both are null, compare by comment_count descending
			return b.comment_count - a.comment_count;
		});
	};

	const newestSort = (questions) => {
		console.log(questions);
		return questions.sort((a, b) => {
			// Convert last_comment_date to a timestamp, treating null as zero
			const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
			const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

			return dateB - dateA;
		});
	};
	const oldestSort = (questions) => {
		console.log(questions);
		return questions.sort((a, b) => {
			// Convert last_comment_date to a timestamp, treating null as zero
			const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
			const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

			return dateA - dateB;
		});
	};

	let selectedQuestion = null;
	let displayedQuestions = [];
	const openModal = (questionData) => {
		console.log(questionData);
		selectedQuestion = questionData;
		getModal(`quetion-details-modal`).open();
	};

	onMount(() => {
		displayedQuestions = normalSort(data.questions);
	});
</script>

<svelte:head>
	<title>Admin - Questions</title>
</svelte:head>

{#if data.user?.admin}
	<div class="container mx-auto px-4 py-8">
		<div class="row">
			<a href="/admin/users">Users</a> |
			<a href="/admin/questions" class="active-link">Questions</a> |
			<a href="/admin/comments">Comments</a> |
			<a href="/content-board">Content Board</a> |
			<a href="/marketing">Marketing</a> |
			<a href="/links">Links</a> |
			<a href="/admin/messages">Messages</a>
		</div>

		<div class="my-6 flex w-full">
			<Button href="/admin/questions/hierarchy">View Hierarchy</Button>
		</div>

		<div class="my-6 flex w-full gap-2">
			<Button
				on:click={() => {
					displayedQuestions = normalSort(data.questions);
				}}>Last Comment</Button
			>
			<Button
				on:click={() => {
					displayedQuestions = newestSort(data.questions);
				}}>Newest</Button
			>
			<Button
				on:click={() => {
					displayedQuestions = oldestSort(data.questions);
				}}>Oldest</Button
			>
		</div>

		{#if displayedQuestions.length}
			<div class="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
				<div class="-mr-4 max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto pr-4">
					{#each displayedQuestions as questionData}
						<div
							style="border-radius: 5px;
    padding: 0 .5rem; background-color: {questionData.removed
								? '#f9cfcf'
								: questionData.flagged
									? '#ffffd4'
									: ''};"
						>
							<h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">
								{questionData.question_formatted || questionData.question}
							</h2>
							<div class="flex items-center justify-between">
								<p class="text-gray-600 dark:text-gray-400">
									Comments #: {questionData.comment_count}, Created at: {convertDateToReadable(
										questionData.created_at
									)}, Last Comment: {convertDateToReadable(questionData.last_comment_date)}
								</p>
								<button
									type="button"
									style="border-radius: 5px; border: 1px solid grey; padding: 0.25rem 0.5rem;"
									on:click={() => openModal(questionData)}>Details</button
								>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p class="text-gray-600 dark:text-gray-400">No questions found.</p>
		{/if}
	</div>
{:else}
	<div class="container mx-auto px-4 py-8 text-center">
		<h1 class="mb-4 text-3xl font-bold text-red-600">Error: Unauthorized Access</h1>
		<p class="text-xl text-gray-600 dark:text-gray-400">
			You do not have permission to view this page.
		</p>
	</div>
{/if}

<Modal2 id="quetion-details-modal">
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

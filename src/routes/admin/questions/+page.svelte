<script lang="ts">
	import type { PageData } from './$types';
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';
	import { Button, Tabs, TabItem } from 'flowbite-svelte';

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

		{#if data?.questions?.length}
			<div class="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
				<div class="-mr-4 max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto pr-4">
					{#each data.questions as questionData}
						<AdminQuestionItem
							{questionData}
							tags={data.tags || []}
							on:questionRemoved={() => invalidateAll()}
						/>
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

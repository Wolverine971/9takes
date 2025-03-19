<script lang="ts">
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { convertDateToReadable } from '../../../utils/conversions';

	export let data: PageData;

	// Admin navigation items
	const navItems = [
		{ href: '/admin/users', label: 'Users' },
		{ href: '/admin/questions', label: 'Questions' },
		{ href: '/admin/comments', label: 'Comments', active: true },
		{ href: '/content-board', label: 'Content Board' },
		{ href: '/marketing', label: 'Marketing' },
		{ href: '/links', label: 'Links' },
		{ href: '/admin/messages', label: 'Messages' }
	];

	// Handle comment removal
	const removeComment = async (commentId: number) => {
		try {
			const body = new FormData();
			body.append('commentId', commentId.toString());
			
			const response = await fetch(`?/removeComment`, {
				method: 'POST',
				body
			});
			
			if (!response.ok) {
				throw new Error('Failed to remove comment');
			}
			
			const result = await response.json();
			if (result.success) {
				invalidateAll();
			}
		} catch (error) {
			console.error('Error removing comment:', error);
		}
	};

	// Handle comment unflagging
	const unflagComment = async (commentId: number) => {
		try {
			const body = new FormData();
			body.append('commentId', commentId.toString());
			
			const response = await fetch(`?/unflagComment`, {
				method: 'POST',
				body
			});
			
			if (!response.ok) {
				throw new Error('Failed to unflag comment');
			}
			
			const result = await response.json();
			if (result.success) {
				invalidateAll();
			}
		} catch (error) {
			console.error('Error unflagging comment:', error);
		}
	};
</script>

{#if data.user?.admin}
	<div class="bg-neutral-50 bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg p-6">
		<!-- Admin Navigation -->
		<div class="flex space-x-4 mb-6 overflow-x-auto pb-2">
			{#each navItems as item}
				<a 
					href={item.href} 
					class="{item.active ? 'text-primary-700 font-semibold' : 'text-neutral-600 hover:text-primary-600'} transition-colors"
				>
					{item.label}
				</a>
				{#if item !== navItems[navItems.length - 1]}
					<span class="text-neutral-400">|</span>
				{/if}
			{/each}
		</div>

		<div class="mb-6">
			<h1 class="text-2xl font-bold text-neutral-900">Comments</h1>
		</div>

		<!-- Flagged Comments Section -->
		<div class="bg-white rounded-lg shadow-md p-4 mb-6">
			<h2 class="text-xl font-semibold text-neutral-800 mb-4">
				Flagged Comments
			</h2>
			
			{#if data?.flaggedComments?.length}
				<div class="overflow-y-auto max-h-96 space-y-4">
					{#each data.flaggedComments as comment}
						<div class="border border-warning-500 bg-warning-50 rounded-lg p-4 shadow-sm transition-all hover:shadow-md">
							<div class="mb-3">
								<p class="text-neutral-800 mb-2">{comment?.comments?.comment}</p>
								<p class="text-sm text-neutral-600 bg-neutral-100 rounded-md p-2">
									<span class="font-semibold">Reason:</span> {comment.description} 
									<span class="font-semibold ml-2">From:</span> {comment?.profiles?.email}
								</p>
							</div>
							<div class="flex flex-wrap justify-between items-center gap-2">
								<div class="flex space-x-2">
									<button
										class="px-3 py-1.5 text-sm font-medium rounded text-white bg-success-500 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 transition-colors shadow-sm"
										on:click={() => unflagComment(comment?.comments?.id)}
									>
										Approve
									</button>
									<button
										class="px-3 py-1.5 text-sm font-medium rounded text-white bg-error-500 hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 transition-colors shadow-sm"
										on:click={() => removeComment(comment?.comments?.id)}
									>
										Remove
									</button>
								</div>
								<p class="text-sm text-neutral-500">
									Flagged on {convertDateToReadable(comment.created_at)}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="bg-neutral-50 p-4 rounded-lg text-center border border-neutral-200">
					<p class="text-neutral-600">No flagged comments</p>
				</div>
			{/if}
		</div>

		<!-- Regular Comments Section -->
		{#if data?.comments?.length}
			<div class="bg-white rounded-lg shadow-md p-4 mb-6">
				<h2 class="text-xl font-semibold text-neutral-800 mb-4">
					Recent Comments
				</h2>
				<div class="overflow-y-auto max-h-96 space-y-4">
					{#each data.comments as comment}
						<div class="border border-neutral-200 rounded-lg p-4 shadow-sm transition-all hover:shadow-md {comment.removed ? 'bg-error-50' : 'bg-white'}">
							<p class="mb-3 text-neutral-800 {comment.removed ? 'text-error-700' : ''}">
								{comment?.comment}
							</p>
							<div class="flex flex-wrap justify-end items-center gap-x-4 gap-y-1 text-sm">
								{#if comment?.parentQuestion}
									<a 
										href="/questions/{comment?.parentQuestion?.url}" 
										class="text-primary-700 hover:text-primary-800 transition-colors"
									>
										{(comment?.parentQuestion?.question_formatted || '').slice(0, 30)}...
									</a>
								{/if}
								<a 
									href="/users/{comment?.profiles?.external_id}" 
									class="text-primary-700 hover:text-primary-800 transition-colors"
								>
									{comment?.profiles?.email}
								</a>
								<p class="text-neutral-500">
									{convertDateToReadable(comment.created_at)}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Blog Comments Section -->
		{#if data?.blogComments?.length}
			<div class="bg-white rounded-lg shadow-md p-4">
				<h2 class="text-xl font-semibold text-neutral-800 mb-4">
					Blog Comments
				</h2>
				<div class="overflow-y-auto max-h-96 space-y-4">
					{#each data.blogComments as blogComment}
						<div class="border border-neutral-200 bg-white rounded-lg p-4 shadow-sm transition-all hover:shadow-md">
							<p class="mb-3 text-neutral-800">
								{blogComment?.comment}
							</p>
							<div class="flex flex-wrap justify-end items-center gap-x-4 gap-y-1 text-sm">
								<a 
									href="/{blogComment.blog_type}/{blogComment?.blog_link}" 
									class="text-primary-700 hover:text-primary-800 transition-colors"
								>
									{blogComment?.blog_link.replace(/-/g, ' ')}
								</a>
								<p class="text-neutral-500">
									{convertDateToReadable(blogComment.created_at)}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="bg-white rounded-lg shadow-md p-6 text-center">
		<h1 class="text-xl font-semibold text-error-500 mb-2">Access Denied</h1>
		<p class="text-neutral-600">You need administrator privileges to view this page.</p>
	</div>
{/if}
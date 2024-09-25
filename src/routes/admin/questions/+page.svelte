<script lang="ts">
	import type { PageData } from './$types';
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	const navItems = [
		{ href: '/admin/users', label: 'Users' },
		{ href: '/admin/questions', label: 'Questions' },
		{ href: '/admin/comments', label: 'Comments' },
		{ href: '/admin/messages', label: 'Messages' }
	];
</script>

{#if data.user?.admin}
	<div class="glass-card">
		<!-- <div class="row">
			{#each navItems as item}
				<a href={item.href} class="nav-item" class:active-link={item.href === '/admin/questions'}>
					{item.label}
				</a>
			{/each}
		</div> -->
		<div class="row">
			<a href="/admin/users">Users</a> |
			<a href="/admin/questions" class="active-link">Questions</a> |
			<a href="/admin/comments">Comments</a> |
			<a href="/content-board">Content Board</a> |
			<a href="/marketing">Marketing</a> |
			<a href="/links">Links</a> |
			<a href="/admin/messages">Messages</a>
		</div>

		<h1>Questions Page</h1>

		<a class="btn btn-primary" href="/admin/questions/hierarchy">View Hierarchy</a>

		{#if data?.questions?.length}
			<div class="questions-container">
				<h2>Questions</h2>
				<div class="scrollable-content">
					{#each data.questions as questionData}
						<AdminQuestionItem
							{questionData}
							tags={data.tags || []}
							on:questionRemoved={() => invalidateAll()}
						/>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="error-message">
		<h1>Error: Unauthorized Access</h1>
		<p>You do not have permission to view this page.</p>
	</div>
{/if}

<style lang="scss">
	h1 {
		font-size: 1.75rem;
		margin-bottom: 1rem;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.scrollable-content {
		max-height: calc(100vh - 200px);
		overflow-y: auto;
		padding-right: 1rem;
		margin-right: -1rem;

		/* Customizing scrollbar */
		&::-webkit-scrollbar {
			width: 8px;
		}

		&::-webkit-scrollbar-track {
			background: rgba(0, 0, 0, 0.1);
			border-radius: 4px;
		}

		&::-webkit-scrollbar-thumb {
			background-color: rgba(0, 0, 0, 0.3);
			border-radius: 4px;
			transition: background-color 0.3s ease;

			&:hover {
				background-color: rgba(0, 0, 0, 0.5);
			}
		}

		/* For Firefox */
		scrollbar-width: thin;
		scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 768px) {
		.admin-panel {
			padding: 1rem;
			margin: 0.5rem;
		}

		.admin-nav {
			flex-wrap: wrap;
		}

		.scrollable-content {
			max-height: calc(100vh - 150px);
		}
	}
</style>

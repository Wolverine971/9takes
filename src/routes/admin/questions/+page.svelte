<script lang="ts">
	import type { PageData } from './$types';
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
</script>

{#if data.user?.admin}
	<div class="glass-card">
		<div class="row">
			<a href="/admin/users">Users</a> |
			<a href="/admin/questions" class="active-link">Questions</a> |
			<a href="/admin/comments">Comments</a> |
			<a href="/admin/messages">Messages</a>
		</div>
		<div class="row">
			<h1 style="">Questions Page</h1>
		</div>

		<a class="btn btn-primary" href="/admin/questions/hierarchy">View Hierarchy</a>

		{#if data?.questions?.length}
			<div class="pretty-div">
				<h3>Questions</h3>
				<div class="scrollable-div">
					{#each data?.questions as questionData}
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
	<div class="pretty-div">
		<h1>Error</h1>
	</div>
{/if}

<style lang="scss">
	h1 {
		font-size: 1.5rem;
	}

	td {
		text-align: start;
		margin: 0.2rem;
		padding: 0.5rem;
	}
</style>

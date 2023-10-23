<script lang="ts">
	import type { PageData } from './$types';
	import AdminQuestionItem from '$lib/components/questions/AdminQuestionItem.svelte';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;

	// export let data: PageData;
</script>

{#if data.user?.admin}
	<div class="glass-card">
		<div class="row">
			<h1 style="">Questions Page</h1>
		</div>

		{#if data?.questions?.length}
			<div class="pretty-div">
				<h3>Questions</h3>
				<div class="scrollable-div">
					<!-- <pre>
						{data?.questions}
					</pre> -->
					{#each data?.questions as questionData}
						<AdminQuestionItem
							{questionData}
							isAdmin={!!data?.session?.user?.id}
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
	.row {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		gap: 10px;
		margin: 1rem;
		justify-content: center;
		align-items: center;
	}
	.pretty-div {
		margin: 1rem;
		padding: 1rem;
	}
	.scrollable-div {
		max-height: 100vh;
		overflow-y: scroll;
		padding: 0.5rem;
	}

	td {
		text-align: start;
		margin: 0.2rem;
		padding: 0.5rem;
	}
</style>

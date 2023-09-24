<script lang="ts">
	import { browser } from '$app/environment';
	import BlogComment from '$lib/components/blog/BlogComment.svelte';
	// import type { Database } from 'src/schema';

	let loading = false;

	export let slug: string;
	export let comments: any[];
	export let session: any;
	export let parentType: string;
	export let userHasAnswered: boolean;

	let _data: any;
	let _comments: any[];
	let comment_count: number;

	$: comments, matchData();

	const matchData = () => {
		_comments = comments?.length ? [...comments] : [];
		comment_count = comments.length;
	};
	// export let comments: any[];
	// Database['public']['Tables']['comments']['Row'][]

	const refreshComments = async (data: any) => {
		console.log(data);
	};
</script>

<!-- {#if comment_count > 0 && comments?.length === 0 && userHasAnswered}
	<button class="btn btn-secondary" type="button" on:click={loadMore}>See Comments</button>
{/if} -->

{#if comment_count > 0 && !userHasAnswered}
	<p>Must answer question first</p>
{/if}
{#if loading}
	<div>Loading comments...</div>
{:else if !browser || (comments?.length && userHasAnswered)}
	<!-- <h3>Renders for SEO, removed if not answered</h3> -->
	{#if comments?.length}
		<div>
			{#each comments as comment}
				<BlogComment
					{comment}
					{parentType}
					{slug}
					{session}
					{userHasAnswered}
					on:commentAdded={({ detail }) => refreshComments(detail)}
				/>
			{/each}
		</div>
		<!-- {#if comments?.length < comment_count}
			<button class="btn btn-secondary" on:click={loadMore}>Load More</button>
		{/if} -->
	{:else}
		<p>nothing right now</p>
	{/if}
{:else if !browser || (comments?.length && parentType === 'comment')}
	<div>
		{#each comments as comment}
			<BlogComment
				{comment}
				{parentType}
				{slug}
				{session}
				{userHasAnswered}
				on:commentAdded={({ detail }) => refreshComments(detail)}
			/>
		{/each}
	</div>
	<!-- {#if comments?.length < comment_count}
		<button class="btn btn-secondary" on:click={loadMore}>Load More</button>
	{/if} -->
{/if}

<style lang="scss">
</style>

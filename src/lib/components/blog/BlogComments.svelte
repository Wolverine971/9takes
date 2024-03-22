<script lang="ts">
	import { browser } from '$app/environment';
	import BlogComment from '$lib/components/blog/BlogComment.svelte';

	export let slug: string;
	export let comments: any[];
	export let session: any;
	export let parentType: string;
	export let userHasAnswered: boolean;

	let comment_count: number;
	let loading = false;

	$: comments, matchData();

	const matchData = () => {
		comment_count = comments.length;
	};
	// export let comments: any[];
	// Database['public']['Tables']['comments']['Row'][]

	const refreshComments = async (data: any) => {};
</script>

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
					{slug}
					{session}
					{userHasAnswered}
					on:commentAdded={({ detail }) => refreshComments(detail)}
				/>
			{/each}
		</div>
	{:else}
		<p>nothing right now</p>
	{/if}
{:else if !browser || (comments?.length && parentType === 'comment')}
	<div>
		{#each comments as comment}
			<BlogComment
				{comment}
				{slug}
				{session}
				{userHasAnswered}
				on:commentAdded={({ detail }) => refreshComments(detail)}
			/>
		{/each}
	</div>
{/if}

<style lang="scss">
</style>

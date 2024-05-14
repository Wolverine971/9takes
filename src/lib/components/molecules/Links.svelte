<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';
	import Link from './Link.svelte';
	const dispatch = createEventDispatcher();

	export let parentType: string = 'comment';
	export let data: any;
	export let user: any;
	export let questionId: number;

	let loading = false;
	let _data: any;
	let links: any[] = _data?.links || [];
	let linksCount: number = _data?.links_count || 0;

	$: data, matchData();

	const matchData = () => {
		_data = Object.assign({}, data);
		links = _data?.links?.length ? [..._data?.links] : [];
		linksCount = _data?.links_count;
	};

	const lastDate = data.comments?.length
		? data.comments[data.comments?.length - 1]?.created_at || null
		: null;

	const loadMore = async () => {
		loading = true;
		await fetch(
			`/comments?type=${parentType}&parentId=${
				parentType === 'question' ? questionId : _data.id
			}&lastDate=${lastDate}&range=${data?.comments?.length || 0}`
		)
			.then((response) => response.json())
			.then((commentData) => {
				if (!commentData?.message) {
					links = [...links, ...commentData];
					loading = false;
				}
			});
	};

	const refreshLinks = async (data: any) => {
		if (parentType !== 'question') {
			return;
		}
		dispatch('commentAdded');
		loading = true;
		await fetch(
			`/comments?type=${parentType}&parentId=${
				parentType === 'question' ? questionId : _data.id
			}&lastDate=${lastDate}`
		)
			.then((response) => response.json())
			.then((commentData) => {
				if (!commentData?.message) {
					links = [...commentData];
					linksCount += 1;
					loading = false;
				}
			});
	};
</script>

{#if !browser || (links?.length && parentType === 'question' && _data?.flags?.userHasAnswered)}
	<!-- <h3>Renders for SEO, removed if not answered</h3> -->
	{#if links?.length}
		<div>
			{#each links as link}
				{#if link}
					<Link
						{questionId}
						{link}
						{user}
						{data}
						on:commentAdded={({ detail }) => refreshLinks(detail)}
					/>
				{/if}
			{/each}
		</div>
		{#if links?.length < linksCount}
			<button class="btn btn-secondary" on:click={loadMore}>
				{#if loading}
					<div class="loader" />
				{:else}
					Load More
				{/if}
			</button>
		{/if}
	{:else}
		<p>nothing right now</p>
	{/if}
{/if}

<style lang="scss">
</style>

<!-- src/lib/components/questions/QuestionContent.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/atoms/card.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import CameraIcon from '$lib/components/icons/cameraIcon.svelte';
	import PostIcon from '$lib/components/icons/postIcon.svelte';
	import CommentXMarkIcon from '$lib/components/icons/CommentXMarkIcon.svelte';
	import Comments from '$lib/components/molecules/Comments.svelte';
	import SortComments from '$lib/components/molecules/SortComments.svelte';
	import AIComments from '$lib/components/molecules/AIComments.svelte';
	import ArticleLinks from '$lib/components/molecules/Links.svelte';
	import type { User, Comment as CommentType, QuestionPageData } from '$lib/types/questions';
	import { viewportWidth } from '$lib/stores/viewport';

	const dispatch = createEventDispatcher<{
		commentAdded: void;
	}>();

	export let data: QuestionPageData;
	export let user: User | null;

	// Local state
	let selectedTab = 'Comments';
	let showAiComments = true;

	// Use shared viewport store
	$: innerWidth = $viewportWidth;

	// Create a deep copy of data to avoid mutation issues
	$: _data = JSON.parse(JSON.stringify(data)) as QuestionPageData;

	// Define tabs and their associated icons
	const tabs = ['Comments', 'Removed Comments', 'Visuals', 'Articles'];
	const iconComponents = {
		Comments: MasterCommentIcon,
		'Removed Comments': CommentXMarkIcon,
		Visuals: CameraIcon,
		Articles: PostIcon
	};

	// Sort comments handler that preserves data immutability
	function sortComments(sortedComments: CommentType[]) {
		// Deep copy the sorted comments to avoid mutation
		const deepCopiedComments = JSON.parse(JSON.stringify(sortedComments)) as CommentType[];
		_data.comments = deepCopiedComments;
		_data.comment_count = deepCopiedComments.length;
		showAiComments = false;

		// Force a refresh of all comment components by creating a new object
		_data = { ..._data };
	}

	// Smooth scroll to section when tab is clicked
	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'start'
			});
		}
	}

	// Handle new comment added
	function handleCommentAdded() {
		if (!data?.flags?.userHasAnswered) {
			dispatch('commentAdded');
		}
	}

	// Get tabulated content count
	function getContentCount(tab: string): { count: number; label: string } {
		switch (tab) {
			case 'Comments':
				return {
					count: _data.comment_count || 0,
					label: _data.comment_count === 1 ? 'Comment' : 'Comments'
				};
			case 'Removed Comments':
				return {
					count: _data.removed_comment_count || 0,
					label: _data.removed_comment_count === 1 ? 'Removed Comment' : 'Removed Comments'
				};
			case 'Articles':
				return {
					count: _data.links_count || 0,
					label: _data.links_count === 1 ? 'Article' : 'Articles'
				};
			case 'Visuals':
				return {
					count: _data.visual_count || 0,
					label: _data.visual_count === 1 ? 'Visual' : 'Visuals'
				};
			default:
				return { count: 0, label: '' };
		}
	}
</script>

<div class="w-full">
	<!-- Tabs Navigation -->
	<nav class="scrollbar-hide flex overflow-x-auto border-b border-slate-700/50 bg-[#12121a]">
		{#each tabs as tab}
			<button
				role="tab"
				aria-selected={selectedTab === tab}
				aria-controls={tab}
				class="relative min-w-fit flex-1 cursor-pointer whitespace-nowrap border-0 bg-transparent px-6 py-3.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:text-slate-200 sm:px-4 sm:py-3 {selectedTab ===
				tab
					? 'border-b-2 border-purple-500 text-slate-100'
					: ''}"
				on:click={() => {
					selectedTab = tab;
					scrollToSection(tab);
				}}
			>
				{#if innerWidth > 575}
					{#if tab === 'Comments' || tab === 'Removed Comments' || tab === 'Articles' || tab === 'Visuals'}
						<span class="flex items-center justify-center gap-2">
							<span class="font-semibold">{getContentCount(tab).count}</span>
							<span>{getContentCount(tab).label}</span>
						</span>
					{:else}
						<span>{tab}</span>
					{/if}
				{:else}
					<!-- Show icons on mobile -->
					<div class="flex flex-col items-center gap-1">
						<svelte:component
							this={iconComponents[tab]}
							iconStyle={''}
							height={'1.25rem'}
							fill={selectedTab === tab ? 'currentColor' : 'currentColor'}
							type={tab === 'Comments' ? 'multiple' : undefined}
						/>
						<span class="text-[10px]">{getContentCount(tab).count}</span>
					</div>
				{/if}
			</button>
		{/each}
	</nav>

	<!-- Tab Content -->
	<div class="min-h-[400px] bg-[#1a1a2e]">
		{#each tabs as section}
			{#if selectedTab === section}
				<section
					in:fade={{ duration: 200 }}
					id={section}
					class={selectedTab === section ? 'block' : 'hidden'}
					aria-labelledby={`${section}-tab`}
				>
					<div class="py-6">
						{#if section === 'Comments'}
							{#if !data?.flags?.userHasAnswered}
								<div class="flex flex-col items-center justify-center py-16">
									<div
										class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-900/30"
									>
										<svg
											class="h-8 w-8 text-purple-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
									</div>
									<p
										class="text-center text-xl font-medium text-slate-100 sm:text-lg"
										in:fade={{ duration: 200 }}
									>
										{_data.comment_count === 0
											? 'Be the first to share your perspective'
											: 'Share your perspective to unlock comments'}
									</p>
									<p class="mt-2 text-sm text-slate-400">
										{_data.comment_count > 0
											? `${_data.comment_count} perspectives waiting to be revealed`
											: 'Your unique viewpoint matters'}
									</p>
								</div>
							{:else}
								<!-- AI-Generated Comments -->
								<AIComments data={_data} parentType={'question'} {showAiComments} />
								<div class="mb-4 flex items-center justify-between px-4">
									<SortComments
										data={_data}
										on:commentsSorted={({ detail }) => sortComments(detail)}
										size={'medium'}
									/>
								</div>

								<!-- User Comments -->
								<Comments
									questionId={_data.id}
									comments={_data.comments}
									comment_count={_data.comment_count}
									parentType={'question'}
									parentData={_data}
									{user}
									key={_data.comment_count}
									on:commentAdded={handleCommentAdded}
								/>
							{/if}
						{:else if section === 'Removed Comments'}
							{#if _data?.removedComments?.length > 0}
								<Comments
									questionId={_data.id}
									parentData={_data}
									comment_count={_data.removed_comment_count}
									comments={_data.removedComments}
									parentType={'question'}
									{user}
								/>
							{:else}
								<div class="flex flex-col items-center justify-center py-16">
									<div
										class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/50"
									>
										<svg
											class="h-7 w-7 text-slate-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
											/>
										</svg>
									</div>
									<p class="text-center text-lg font-medium text-slate-400">No removed comments</p>
								</div>
							{/if}
						{:else if section === 'Visuals'}
							{#if data?.flags?.userHasAnswered}
								<div class="flex flex-col items-center justify-center py-16">
									<div
										class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/50"
									>
										<svg
											class="h-7 w-7 text-slate-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<p class="text-center text-lg font-medium text-slate-400">No visuals available</p>
								</div>
							{:else}
								<div class="flex flex-col items-center justify-center py-16">
									<div
										class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-900/30"
									>
										<svg
											class="h-8 w-8 text-purple-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
									</div>
									<p class="text-center text-xl font-medium text-slate-100 sm:text-lg">
										Share your perspective to unlock content
									</p>
								</div>
							{/if}
						{:else if section === 'Articles'}
							<ArticleLinks
								questionId={data.id}
								data={_data}
								parentType={'question'}
								{user}
								on:commentAdded={handleCommentAdded}
							/>
						{/if}
					</div>
				</section>
			{/if}
		{/each}
	</div>
</div>

<style>
	/* Hide scrollbar but allow scrolling */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}
</style>

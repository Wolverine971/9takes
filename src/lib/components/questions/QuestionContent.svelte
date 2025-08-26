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

	const dispatch = createEventDispatcher();

	export let data: any;
	export let user: any;

	// Local state
	let selectedTab = 'Comments';
	let innerWidth = 0;
	let showAiComments = true;

	// Create a deep copy of data to avoid mutation issues
	$: _data = JSON.parse(JSON.stringify(data));

	// Define tabs and their associated icons
	const tabs = ['Comments', 'Removed Comments', 'Visuals', 'Articles'];
	const iconComponents = {
		Comments: MasterCommentIcon,
		'Removed Comments': CommentXMarkIcon,
		Visuals: CameraIcon,
		Articles: PostIcon
	};

	// Sort comments handler that preserves data immutability
	function sortComments(sortedComments: any[]) {
		// Deep copy the sorted comments to avoid mutation
		const deepCopiedComments = JSON.parse(JSON.stringify(sortedComments));
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

<svelte:window bind:innerWidth />

<div class="mt-4 w-full">
	<!-- Tabs Navigation -->
	<nav
		class="scrollbar-hide sticky top-0 z-10 flex overflow-x-auto rounded-t-md bg-white shadow-sm sm:relative"
	>
		{#each tabs as tab}
			<button
				role="tab"
				aria-selected={selectedTab === tab}
				aria-controls={tab}
				class="min-w-fit flex-1 cursor-pointer whitespace-nowrap border-0 border-b-2 border-transparent bg-transparent px-6 py-4 text-sm font-medium text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-800 sm:px-4 sm:py-3 {selectedTab ===
				tab
					? 'border-primary-600 font-semibold text-primary-600'
					: ''}"
				on:click={() => {
					selectedTab = tab;
					scrollToSection(tab);
				}}
			>
				{#if innerWidth > 575}
					<!-- Show text on larger screens -->
					{#if tab === 'Comments' || tab === 'Removed Comments' || tab === 'Articles' || tab === 'Visuals'}
						<span class="flex items-center justify-center" transition:fade={{ duration: 200 }}>
							{getContentCount(tab).count}
							{getContentCount(tab).label}
						</span>
					{:else}
						<span>{tab}</span>
					{/if}
				{:else}
					<!-- Show icons on mobile -->
					<svelte:component
						this={iconComponents[tab]}
						iconStyle={''}
						height={'1.5rem'}
						fill={selectedTab === tab ? 'currentColor' : 'currentColor'}
						type={tab === 'Comments' ? 'multiple' : undefined}
					/>
				{/if}
			</button>
		{/each}
	</nav>

	<!-- Tab Content -->
	<div class="min-h-[300px] rounded-b-md bg-neutral-100">
		{#each tabs as section}
			{#if selectedTab === section}
				<section
					in:fade={{ duration: 300 }}
					id={section}
					class="!sm:p-0 {selectedTab === section ? 'block' : 'hidden'}"
					aria-labelledby={`${section}-tab`}
				>
					<Card
						className="md:bg-white md:border-0 md:shadow-md rounded-b-md rounded-none md:p-4 sm:p-2"
					>
						{#if section === 'Comments'}
							{#if !data?.flags?.userHasAnswered}
								<p
									class="my-8 text-center text-2xl font-semibold text-primary-500 sm:my-4 sm:text-lg md:my-6 md:text-xl"
									in:fade={{ duration: 200 }}
								>
									{_data.comment_count === 0
										? 'Be the first one to answer ✋'
										: 'Must answer before seeing the comments'}
								</p>
							{:else}
								<!-- AI-Generated Comments -->
								<AIComments data={_data} parentType={'question'} {showAiComments} />
								<div class="mb-3 flex items-center gap-4">
									<SortComments
										data={_data}
										on:commentsSorted={({ detail }) => sortComments(detail)}
										size={'large'}
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
								<h2
									class="relative mb-4 py-2 text-center text-xl font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-[60px] after:-translate-x-1/2 after:rounded-sm after:bg-primary-500 after:content-['']"
								>
									None
								</h2>
							{/if}
						{:else if section === 'Visuals'}
							{#if data?.flags?.userHasAnswered}
								<h2
									class="relative mb-4 py-2 text-center text-xl font-semibold text-neutral-900 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-[60px] after:-translate-x-1/2 after:rounded-sm after:bg-primary-500 after:content-['']"
								>
									None
								</h2>
							{:else}
								<p
									class="my-8 text-center text-2xl font-semibold text-primary-500 sm:my-4 sm:text-lg md:my-6 md:text-xl"
								>
									Answer the question to see content
								</p>
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
					</Card>
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

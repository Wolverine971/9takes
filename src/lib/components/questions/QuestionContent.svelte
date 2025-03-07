<script lang="ts">
	import { fade, slide } from 'svelte/transition';
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
		role="tablist"
	>
		{#each tabs as tab}
			<button
				role="tab"
				aria-selected={selectedTab === tab}
				aria-controls={tab}
				class="xs:px-4 xs:py-3 min-w-fit flex-1 cursor-pointer whitespace-nowrap border-0 border-b-2 border-transparent bg-transparent px-6 py-4 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 sm:px-6 sm:py-4"
				class:border-indigo-600={selectedTab === tab}
				class:text-indigo-600={selectedTab === tab}
				class:font-semibold={selectedTab === tab}
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
						fill={selectedTab === tab ? 'var(--primary)' : 'var(--dark-gray)'}
						type={tab === 'Comments' ? 'multiple' : undefined}
					/>
				{/if}
			</button>
		{/each}
	</nav>

	<!-- Tab Content -->
	<div class="min-h-[300px] rounded-b-md bg-gray-100">
		{#each tabs as section}
			<section
				id={section}
				class="xs:p-2 hidden p-4"
				class:showSection={selectedTab === section}
				aria-labelledby={`${section}-tab`}
				role="tabpanel"
				tabindex="0"
			>
				{#if selectedTab === section}
					<div in:fade={{ duration: 300 }}>
						{#if section === 'Comments' && _data.comment_count !== 0}
							<div class="mb-3 flex items-center gap-4">
								<SortComments
									data={_data}
									on:commentsSorted={({ detail }) => sortComments(detail)}
									size={'large'}
								/>
							</div>
						{/if}

						<Card className="bg-white border-0 shadow-md rounded-md p-4 xs:p-3">
							{#if section === 'Comments'}
								{#if !data?.flags?.userHasAnswered}
									<p
										class="xs:text-lg xs:my-4 my-8 text-center text-2xl font-semibold text-indigo-500 md:my-6 md:text-xl"
										in:fade={{ duration: 200 }}
									>
										{_data.comment_count === 0
											? 'Be the first one to answer ✋'
											: 'Must answer before seeing the comments'}
									</p>
								{:else}
									<!-- AI-Generated Comments -->
									<AIComments data={_data} parentType={'question'} {showAiComments} />

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
							{:else if section === 'Removed Comments' && _data?.removedComments?.length > 0}
								<Comments
									questionId={_data.id}
									parentData={_data}
									comment_count={_data.removed_comment_count}
									comments={_data.removedComments}
									parentType={'question'}
									{user}
								/>
							{:else if section === 'Visuals'}
								{#if data?.flags?.userHasAnswered}
									<div
										class="flex flex-col items-center justify-center gap-4 px-4 py-12 text-gray-500"
									>
										<CameraIcon height="2rem" fill="var(--medium-gray)" />
										<p class="m-0 text-center">No visuals available yet</p>
									</div>
								{:else}
									<p
										class="xs:text-lg xs:my-4 my-8 text-center text-2xl font-semibold text-indigo-500 md:my-6 md:text-xl"
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
					</div>
				{/if}
			</section>
		{/each}
	</div>
</div>

<style>
	.showSection {
		display: block;
		visibility: visible;
	}
	/* Hide scrollbar but allow scrolling */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	/* Extra small screen utilities */
	@media (max-width: 576px) {
		.xs\:p-2 {
			padding: 0.5rem;
		}

		.xs\:p-3 {
			padding: 0.75rem;
		}

		.xs\:px-4 {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.xs\:py-3 {
			padding-top: 0.75rem;
			padding-bottom: 0.75rem;
		}

		.xs\:text-lg {
			font-size: 1.125rem;
			line-height: 1.75rem;
		}

		.xs\:my-4 {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}
	}
</style>

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

<div class="content-container">
	<!-- Tabs Navigation -->
	<nav class="tabs-nav" role="tablist">
		{#each tabs as tab}
			<button
				role="tab"
				aria-selected={selectedTab === tab}
				aria-controls={tab}
				class="tab-button"
				class:active={selectedTab === tab}
				on:click={() => {
					selectedTab = tab;
					scrollToSection(tab);
				}}
			>
				{#if innerWidth > 575}
					<!-- Show text on larger screens -->
					{#if tab === 'Comments' || tab === 'Removed Comments' || tab === 'Articles' || tab === 'Visuals'}
						<span class="tab-count" transition:fade={{ duration: 200 }}>
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
	<div class="tab-content">
		{#each tabs as section}
			<section
				id={section}
				class="tab-section"
				class:active={selectedTab === section}
				aria-labelledby={`${section}-tab`}
				role="tabpanel"
				tabindex="0"
			>
				{#if selectedTab === section}
					<div in:fade={{ duration: 300 }}>
						{#if section === 'Comments' && _data.comment_count !== 0}
							<div class="section-header">
								<SortComments
									data={_data}
									on:commentsSorted={({ detail }) => sortComments(detail)}
									size={'large'}
								/>
							</div>
						{/if}

						<Card className="content-card">
							{#if section === 'Comments'}
								{#if !data?.flags?.userHasAnswered}
									<p class="helper-message" in:fade={{ duration: 200 }}>
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
									<div class="empty-state">
										<CameraIcon height="2rem" fill="var(--medium-gray)" />
										<p>No visuals available yet</p>
									</div>
								{:else}
									<p class="helper-message">Answer the question to see content</p>
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

<style lang="scss">
	.content-container {
		width: 100%;
		margin-top: 1rem;
	}

	.tabs-nav {
		display: flex;
		background: white;
		border-radius: var(--base-border-radius) var(--base-border-radius) 0 0;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none; /* Firefox */
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

		&::-webkit-scrollbar {
			display: none; /* Chrome, Safari, Edge */
		}

		@media (max-width: 576px) {
			position: sticky;
			top: 0;
			z-index: 10;
		}
	}

	.tab-button {
		flex: 1;
		min-width: fit-content;
		padding: 1rem 1.5rem;
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--dark-gray);
		font-weight: 500;
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;

		&:hover {
			background-color: var(--light-gray);
			color: var(--darkest-gray);
		}

		&.active {
			color: var(--primary);
			border-bottom: 2px solid var(--primary);
			font-weight: 600;
		}

		@media (max-width: 576px) {
			padding: 0.75rem 1rem;
		}
	}

	.tab-count {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab-content {
		background: var(--light-gray);
		border-radius: 0 0 var(--base-border-radius) var(--base-border-radius);
		min-height: 300px;
	}

	.tab-section {
		display: none;
		padding: 1rem;

		&.active {
			display: block;
		}

		@media (max-width: 576px) {
			padding: 0.5rem;
		}
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.content-card {
		border: none;
		background: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		border-radius: var(--base-border-radius);
		padding: 1rem;

		@media (max-width: 576px) {
			padding: 0.75rem;
		}
	}

	.helper-message {
		font-size: 1.75rem;
		text-align: center;
		margin: 2rem 0;
		color: var(--accent);
		font-weight: 600;

		@media (max-width: 768px) {
			font-size: 1.5rem;
			margin: 1.5rem 0;
		}

		@media (max-width: 576px) {
			font-size: 1.25rem;
			margin: 1rem 0;
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		gap: 1rem;
		color: var(--dark-gray);

		p {
			margin: 0;
			text-align: center;
		}
	}
</style>

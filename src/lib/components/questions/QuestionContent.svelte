<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/atoms/card.svelte';
	import CameraIcon from '$lib/components/icons/cameraIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import PostIcon from '$lib/components/icons/postIcon.svelte';
	import CommentXMarkIcon from '$lib/components/icons/CommentXMarkIcon.svelte';
	import { Comments } from '$lib/components/molecules';
	import SortComments from '$lib/components/molecules/SortComments.svelte';
	import AIComments from '$lib/components/molecules/AIComments.svelte';
	import ArticleLinks from '$lib/components/molecules/Links.svelte';

	const dispatch = createEventDispatcher();

	export let data: any;
	export let user: any;

	let selectedTab = 'Comments';
	let innerWidth = 0;
	let showAiComments = true;

	// Create a reactive statement for deep copying data
	$: _data = JSON.parse(JSON.stringify(data));

	const tabs = ['Comments', 'Removed Comments', 'Visuals', 'Articles'];

	const iconComponents = {
		Comments: MasterCommentIcon,
		'Removed Comments': CommentXMarkIcon,
		Visuals: CameraIcon,
		Articles: PostIcon
	};

	// Modified sortComments function to handle deep copying
	function sortComments(sortedComments: any[]) {
		// Deep copy the sorted comments
		const deepCopiedComments = JSON.parse(JSON.stringify(sortedComments));
		_data.comments = deepCopiedComments;
		_data.comment_count = deepCopiedComments.length;
		showAiComments = false;

		// Force a refresh of all comment components
		_data = { ..._data };
	}

	function scrollToSection(sectionId: string) {
		document
			.getElementById(sectionId)
			?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
	}

	function handleCommentAdded() {
		if (!data?.flags?.userHasAnswered) {
			dispatch('commentAdded');
		}
	}
</script>

<svelte:window bind:innerWidth />

<div class="tab-container">
	<nav class="tab-nav">
		{#each tabs as tab}
			<a
				href="#{tab}"
				class="tab-link"
				class:active={selectedTab === tab}
				on:click|preventDefault={() => {
					selectedTab = tab;
					scrollToSection(tab);
				}}
			>
				{#if innerWidth > 575}
					{#if tab === 'Comments'}
						<span class="comment-count" itemprop="answerCount">
							{_data.comment_count || 0}
							{_data.comment_count === 1 ? 'Comment' : 'Comments'}
						</span>
					{:else if tab === 'Removed Comments'}
						<span class="comment-count" itemprop="answerCount">
							{_data.removed_comment_count || 0}
							{_data.removed_comment_count === 1 ? 'Removed Comment' : 'Removed Comments'}
						</span>
					{:else if tab === 'Articles'}
						<span class="comment-count" itemprop="answerCount">
							{_data.links_count || 0}
							{_data.links_count === 1 ? 'Article' : 'Articles'}
						</span>
					{:else if tab === 'Visuals'}
						<span class="comment-count" itemprop="answerCount">
							{_data.visual_count || 0}
							{_data.visual_count === 1 ? 'Visual' : 'Visuals'}
						</span>
					{/if}
				{:else}
					<svelte:component
						this={iconComponents[tab]}
						iconStyle={''}
						height={'1.5rem'}
						fill={selectedTab === tab ? 'var(--primary)' : ''}
						type={tab === 'Comments' ? 'multiple' : undefined}
					/>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="tab-content">
		{#each tabs as section}
			<section class="tab-section" class:active={selectedTab === section} id={section}>
				<h2 style="display: flex; gap: 1rem; align-items: center; margin: 0 0 .5rem 0; padding: 0;">
					{#if _data.comment_count !== 0 && section === 'Comments'}
						<SortComments
							data={_data}
							on:commentsSorted={({ detail }) => sortComments(detail)}
							size={'large'}
						/>
					{/if}
				</h2>
				<Card className="comments-card">
					{#if section === 'Comments'}
						{#if !data?.flags?.userHasAnswered}
							<p class="helper-suggestion" transition:fade>
								{_data.comment_count === 0
									? 'Be the first one to answer ✋'
									: 'Must answer before seeing the comments'}
							</p>
						{/if}
						<AIComments data={_data} parentType={'question'} {showAiComments} />
						<!-- // Force re-render on sort -->
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
							<p>Nothing right now</p>
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
		{/each}
	</div>
</div>

<style lang="scss">
	.tab-container {
		display: flex;
		flex-direction: column;
		width: 100%;

		.tab-nav {
			display: flex;
			justify-content: space-between;
			background: white;
			border-radius: var(--base-border-radius);
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			margin: 0;
			border-bottom: 1px solid var(--base-grey-1);

			@media (max-width: 576px) {
				padding: 0;
				gap: 0;
			}
		}

		.tab-link {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0.75rem 1rem;
			color: var(--color-theme-purple-light);
			text-decoration: none;
			transition: all 0.3s ease;

			flex: 1;
			min-width: max-content;
			padding: 0.75rem 1rem;
			white-space: nowrap;

			&:hover {
				background-color: var(--base-white-outline);
			}

			&.active {
				color: var(--primary);
				border-bottom: 2px solid var(--primary);
			}
		}

		.comment-count {
			white-space: nowrap;
		}
	}

	.tab-content {
		flex-grow: 1;
	}

	.tab-section {
		display: none;
		padding: 1rem;

		&.active {
			display: block;
		}
	}

	.comments-card {
		border: none;
		margin: 0.5rem;
	}

	.helper-suggestion {
		font-size: 2rem;
		text-align: center;
		margin: 1rem 0;
	}

	@media (max-width: 768px) {
		.helper-suggestion {
			font-size: 1.75rem;
		}
		.tab-section {
			padding: 0.5rem;
		}
	}

	@media (max-width: 576px) {
		.tab-nav {
			padding: 0;
			gap: 0;
		}

		.tab-link {
			padding: 0.5rem 0.75rem;
			font-size: 0.875rem;
		}
		.tab-section {
			padding: 0;
		}

		.helper-suggestion {
			font-size: 1.5rem;
		}

		.comments-card {
			margin: 0.2rem;
		}
		.comment-count {
			font-size: 0.875rem;
		}
	}
</style>

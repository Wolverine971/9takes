<!-- src/lib/components/questions/QuestionContent.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
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

	interface Props {
		data: QuestionPageData;
		user: User | null;
		oncommentAdded?: () => void;
	}

	let { data, user, oncommentAdded }: Props = $props();

	// Local state
	let selectedTab = $state('Comments');
	let showAiComments = $state(true);

	// Use shared viewport store
	let innerWidth = $derived($viewportWidth);

	// Create a deep copy of data to avoid mutation issues
	let _data = $derived(JSON.parse(JSON.stringify(data)) as QuestionPageData);

	// Define tabs and their associated icons
	const tabs = ['Comments', 'Removed Comments', 'Visuals', 'Articles'];
	const iconComponents: Record<string, typeof MasterCommentIcon> = {
		Comments: MasterCommentIcon,
		'Removed Comments': CommentXMarkIcon,
		Visuals: CameraIcon,
		Articles: PostIcon
	};

	// Local sorted comments state (for when user sorts)
	let sortedComments = $state<CommentType[] | null>(null);

	// Sort comments handler
	function sortCommentsHandler(newSortedComments: CommentType[]) {
		sortedComments = JSON.parse(JSON.stringify(newSortedComments)) as CommentType[];
		showAiComments = false;
	}

	// Get the comments to display (sorted if user sorted, otherwise from data)
	let displayComments = $derived(sortedComments || _data.comments);
	let displayCommentCount = $derived(sortedComments?.length ?? _data.comment_count);

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
			oncommentAdded?.();
		}
	}

	// Get tabulated content count
	function getContentCount(tab: string): { count: number; label: string } {
		switch (tab) {
			case 'Comments':
				return {
					count: displayCommentCount || 0,
					label: displayCommentCount === 1 ? 'Comment' : 'Comments'
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
				// Visuals feature not yet implemented
				return {
					count: 0,
					label: 'Visuals'
				};
			default:
				return { count: 0, label: '' };
		}
	}
</script>

<div class="question-content-shell">
	<!-- Tabs Navigation -->
	<nav class="question-content-nav scrollbar-hide">
		{#each tabs as tab}
			{@const IconComponent = iconComponents[tab]}
			<button
				role="tab"
				aria-selected={selectedTab === tab}
				aria-controls={tab}
				class="question-tab"
				class:is-active={selectedTab === tab}
				onclick={() => {
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
						<IconComponent
							iconStyle={''}
							height={'1.25rem'}
							fill={'currentColor'}
							type={tab === 'Comments' ? 'multiple' : undefined}
						/>
						<span class="text-[10px]">{getContentCount(tab).count}</span>
					</div>
				{/if}
			</button>
		{/each}
	</nav>

	<!-- Tab Content -->
	<div class="question-content-body">
		{#each tabs as section}
			{#if selectedTab === section}
				<section
					in:fade={{ duration: 200 }}
					id={section}
					class:selected={selectedTab === section}
					class="question-content-section"
					aria-labelledby={`${section}-tab`}
				>
					<div class="question-content-section-inner">
						{#if section === 'Comments'}
							{#if !data?.flags?.userHasAnswered}
								<div class="question-state question-state-locked">
									<div class="state-icon state-icon-locked">
										<svg
											class="h-8 w-8 text-[var(--primary)]"
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
									<p class="state-title" in:fade={{ duration: 200 }}>
										{displayCommentCount === 0
											? 'Be the first to share your perspective'
											: 'Share your perspective to unlock comments'}
									</p>
									<p class="state-copy">
										{displayCommentCount > 0
											? `${displayCommentCount} perspectives waiting to be revealed`
											: 'Your unique viewpoint matters'}
									</p>
								</div>
							{:else}
								<!-- AI-Generated Comments -->
								<AIComments data={_data} parentType={'question'} {showAiComments} />
								<div class="content-toolbar">
									<SortComments
										data={_data}
										oncommentsSorted={sortCommentsHandler}
										size={'medium'}
									/>
								</div>

								<!-- User Comments -->
								<Comments
									questionId={_data.question.id}
									comments={displayComments}
									comment_count={displayCommentCount}
									parentType={'question'}
									parentData={_data}
									{user}
									key={displayCommentCount}
									on:commentAdded={handleCommentAdded}
								/>
							{/if}
						{:else if section === 'Removed Comments'}
							{#if data?.flags?.userHasAnswered}
								{#if _data?.removedComments?.length > 0}
									<Comments
										questionId={_data.question.id}
										parentData={_data}
										comment_count={_data.removed_comment_count}
										comments={_data.removedComments}
										parentType={'question'}
										{user}
									/>
								{:else}
									<div class="question-state question-state-empty">
										<div class="state-icon state-icon-muted">
											<svg
												class="h-7 w-7 text-[var(--text-secondary)]"
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
										<p class="state-title state-title-muted">No removed comments</p>
									</div>
								{/if}
							{:else}
								<div class="question-state question-state-locked">
									<div class="state-icon state-icon-locked">
										<svg
											class="h-8 w-8 text-[var(--primary)]"
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
									<p class="state-title">Share your perspective to unlock content</p>
								</div>
							{/if}
						{:else if section === 'Visuals'}
							{#if data?.flags?.userHasAnswered}
								<div class="question-state question-state-empty">
									<div class="state-icon state-icon-muted">
										<svg
											class="h-7 w-7 text-[var(--text-secondary)]"
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
									<p class="state-title state-title-muted">No visuals available</p>
								</div>
							{:else}
								<div class="question-state question-state-locked">
									<div class="state-icon state-icon-locked">
										<svg
											class="h-8 w-8 text-[var(--primary)]"
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
									<p class="state-title">Share your perspective to unlock content</p>
								</div>
							{/if}
						{:else if section === 'Articles'}
							<ArticleLinks
								questionId={data.question.id}
								data={_data}
								parentType={'question'}
								oncommentAdded={handleCommentAdded}
							/>
						{/if}
					</div>
				</section>
			{/if}
		{/each}
	</div>
</div>

<style>
	.question-content-shell {
		position: relative;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--primary) 18%, var(--border-color));
		border-radius: 1.35rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--primary-subtle) 36%, transparent) 0%,
				transparent 18%
			),
			color-mix(in srgb, var(--bg-surface) 96%, transparent);
		box-shadow: var(--shadow-md);
		backdrop-filter: blur(14px);
	}

	.question-content-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at top center,
			color-mix(in srgb, var(--primary) 10%, transparent) 0%,
			transparent 42%
		);
		pointer-events: none;
	}

	.question-content-nav {
		position: relative;
		z-index: 1;
		display: flex;
		overflow-x: auto;
		padding: 0.45rem;
		border-bottom: 1px solid color-mix(in srgb, var(--primary) 16%, var(--border-color));
		background: color-mix(in srgb, var(--bg-deep) 78%, transparent);
		backdrop-filter: blur(14px);
	}

	.question-tab {
		position: relative;
		flex: 1 1 0;
		min-width: fit-content;
		padding: 0.9rem 1.15rem;
		border: 0;
		border-radius: 0.95rem;
		background: transparent;
		color: var(--text-secondary);
		font-size: 0.9rem;
		font-weight: 600;
		white-space: nowrap;
		transition:
			color 0.2s ease,
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.question-tab:hover {
		color: var(--text-primary);
		background: color-mix(in srgb, var(--primary-subtle) 32%, transparent);
	}

	.question-tab.is-active {
		color: var(--text-primary);
		background: color-mix(in srgb, var(--primary-subtle) 52%, transparent);
		box-shadow:
			inset 0 -2px 0 var(--primary),
			var(--shadow-sm);
	}

	.question-content-body {
		position: relative;
		z-index: 1;
		min-height: 22rem;
		background: color-mix(in srgb, var(--bg-surface) 82%, transparent);
	}

	.question-content-section {
		display: block;
	}

	.question-content-section-inner {
		padding: 1.4rem 0 1.6rem;
	}

	.content-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		padding: 0 1rem;
	}

	.question-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		max-width: 34rem;
		margin: 0 auto;
		padding: 2.8rem 1.25rem;
		border-radius: 1.2rem;
		text-align: center;
	}

	.question-state-locked {
		border: 1px solid color-mix(in srgb, var(--primary) 22%, transparent);
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--primary-subtle) 54%, transparent) 0%,
				transparent 100%
			),
			color-mix(in srgb, var(--bg-surface) 90%, transparent);
		box-shadow: var(--shadow-sm);
	}

	.question-state-empty {
		border: 1px dashed color-mix(in srgb, var(--text-tertiary) 35%, transparent);
		background: color-mix(in srgb, var(--bg-surface) 76%, transparent);
	}

	.state-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 1.15rem;
	}

	.state-icon-locked {
		width: 4rem;
		height: 4rem;
		margin-bottom: 0.55rem;
		background: color-mix(in srgb, var(--primary-subtle) 62%, transparent);
	}

	.state-icon-muted {
		width: 3.4rem;
		height: 3.4rem;
		margin-bottom: 0.55rem;
		background: color-mix(in srgb, var(--bg-elevated) 68%, transparent);
	}

	.state-title {
		margin: 0;
		font-size: 1.12rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--text-primary);
	}

	.state-title-muted {
		color: var(--text-secondary);
	}

	.state-copy {
		margin: 0.15rem 0 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	/* Hide scrollbar but allow scrolling */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	@media (max-width: 640px) {
		.question-content-shell {
			border-radius: 1.1rem;
		}

		.question-content-nav {
			padding: 0.35rem;
		}

		.question-tab {
			padding: 0.8rem 0.95rem;
		}

		.question-content-section-inner {
			padding: 1.15rem 0 1.25rem;
		}

		.content-toolbar {
			padding: 0 0.8rem;
		}

		.question-state {
			margin: 0 0.9rem;
			padding: 2.2rem 1rem;
		}

		.state-title {
			font-size: 1rem;
		}
	}
</style>

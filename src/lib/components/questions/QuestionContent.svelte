<!-- src/lib/components/questions/QuestionContent.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import PostIcon from '$lib/components/icons/postIcon.svelte';
	import Comments from '$lib/components/molecules/Comments.svelte';
	import SortComments from '$lib/components/molecules/SortComments.svelte';
	import AIComments from '$lib/components/molecules/AIComments.svelte';
	import ArticleLinks from '$lib/components/molecules/Links.svelte';
	import type {
		User,
		AIComment,
		Comment as CommentType,
		QuestionPageData
	} from '$lib/types/questions';

	interface Props {
		data: QuestionPageData;
		user: User | null;
		oncommentAdded?: () => void;
	}

	let { data, user, oncommentAdded }: Props = $props();

	// Local state
	let selectedTab = $state('Comments');
	let reduceMotion = $state(false);

	// Create a deep copy of data to avoid mutation issues
	let _data = $derived(JSON.parse(JSON.stringify(data)) as QuestionPageData);

	// Define tabs and their associated icons.
	// 2026-06-10 (design audit): the permanently-empty "Visuals" tab is cut and
	// "Removed Comments" is demoted from equal-billing tab to a quiet disclosure
	// at the bottom of the thread — the main conversation is the product.
	const tabs = ['Comments', 'Articles'];
	const iconComponents: Record<string, typeof MasterCommentIcon> = {
		Comments: MasterCommentIcon,
		Articles: PostIcon
	};

	// Local sorted comments state (for when user sorts)
	let sortedComments = $state<CommentType[] | null>(null);

	// Sort comments handler
	function sortCommentsHandler(newSortedComments: CommentType[]) {
		sortedComments = JSON.parse(JSON.stringify(newSortedComments)) as CommentType[];
	}

	// Get the comments to display (sorted if user sorted, otherwise from data)
	let displayComments = $derived(sortedComments || _data.comments);
	let displayCommentCount = $derived(sortedComments?.length ?? _data.comment_count);
	let validAiComments = $derived((_data.aiComments ?? []).filter(hasValidAiType));
	let publicAiPreviewComments = $derived(validAiComments.slice(0, 3));

	function hasValidAiType(comment: AIComment): boolean {
		const typeNumber = Number(comment.enneagram_type ?? comment.enneagram);
		return Number.isInteger(typeNumber) && typeNumber >= 1 && typeNumber <= 9;
	}

	onMount(() => {
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	// Smooth scroll to section when tab is clicked
	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({
				behavior: reduceMotion ? 'auto' : 'smooth',
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
				// User-facing vocabulary is "takes"; the tab key stays 'Comments'
				// so DOM ids (comments-tab/comments-panel) and logic are unchanged.
				return {
					count: displayCommentCount || 0,
					label: displayCommentCount === 1 ? 'Take' : 'Takes'
				};
			case 'Articles':
				return {
					count: _data.links_count || 0,
					label: _data.links_count === 1 ? 'Article' : 'Articles'
				};
			default:
				return { count: 0, label: '' };
		}
	}

	function getTabId(tab: string): string {
		return `${tab.toLowerCase()}-tab`;
	}

	function getPanelId(tab: string): string {
		return `${tab.toLowerCase()}-panel`;
	}
</script>

<div class="question-content-shell">
	<!-- Tabs Navigation -->
	<div class="question-content-nav scrollbar-hide" role="tablist" aria-label="Question sections">
		{#each tabs as tab (tab)}
			{@const IconComponent = iconComponents[tab]}
			{@const contentCount = getContentCount(tab)}
			<button
				id={getTabId(tab)}
				role="tab"
				aria-selected={selectedTab === tab}
				aria-controls={getPanelId(tab)}
				class="question-tab"
				class:is-active={selectedTab === tab}
				onclick={() => {
					selectedTab = tab;
					scrollToSection(getPanelId(tab));
				}}
			>
				<span class="question-tab__icon" aria-hidden="true">
					<IconComponent
						iconStyle=""
						height="1.25rem"
						fill="currentColor"
						type={tab === 'Comments' ? 'multiple' : undefined}
					/>
				</span>
				<span class="question-tab__copy">
					<span class="question-tab__count">{contentCount.count}</span>
					<span class="question-tab__label">{contentCount.label}</span>
				</span>
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="question-content-body">
		{#each tabs as section (section)}
			{#if selectedTab === section}
				<div
					in:fade={{ duration: reduceMotion ? 0 : 200 }}
					id={getPanelId(section)}
					role="tabpanel"
					class:selected={selectedTab === section}
					class="question-content-section"
					aria-labelledby={getTabId(section)}
				>
					<div class="question-content-section-inner">
						{#if section === 'Comments'}
							{#if !data?.flags?.userHasAnswered}
								<div class="locked-comments-shell">
									{#if publicAiPreviewComments.length}
										<section class="public-perspective-preview" aria-label="Sample perspectives">
											<div class="public-perspective-preview__head">
												<h3 class="public-perspective-preview__title">Sample perspectives</h3>
												<p class="public-perspective-preview__copy">
													A preview of how the nine read it. The real thread stays locked until you
													answer.
												</p>
											</div>

											<div class="locked-preview-stage">
												<!-- Give-first integrity: only the already-public AI sample cards
												     are blurred here. Real community takes never reach the DOM
												     before the user answers. -->
												<div
													class="public-perspective-preview__grid blurred-perspectives"
													aria-hidden="true"
												>
													{#each publicAiPreviewComments as comment (comment.id)}
														<article
															class="public-perspective-card"
															style="--comment-type-color: var(--type-{comment.enneagram_type}-color, var(--lamp-glow))"
														>
															<div class="public-perspective-card__eyebrow">
																Type {comment.enneagram_type}
															</div>
															<p class="public-perspective-card__body">{comment.comment}</p>
														</article>
													{/each}
												</div>

												<div class="lock-message" role="status">
													<span class="lock-icon" aria-hidden="true">
														<svg
															class="h-4 w-4"
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
													</span>
													<span class="lock-message__copy">
														<strong>Other answers stay blurred.</strong>
														Post yours to reveal them.
														<span class="lock-message__meta">Anonymous · no account required</span>
													</span>
												</div>
											</div>
										</section>
									{:else}
										<div class="question-state question-state-locked">
											<div class="state-icon state-icon-locked">
												<svg
													class="h-8 w-8 text-[var(--lamp-glow)]"
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
												Other answers stay blurred. Post yours to reveal them.
											</p>
											<p class="state-copy">Anonymous · no account required</p>
										</div>
									{/if}
								</div>
							{:else}
								<header class="community-discussion-head">
									<div>
										<span>Community discussion</span>
										<h3>What people actually said</h3>
									</div>
									<p>Real answers from people who responded before reading the room.</p>
								</header>
								<div class="content-toolbar">
									<SortComments data={_data} oncommentsSorted={sortCommentsHandler} size="medium" />
								</div>

								<Comments
									questionId={_data.question.id}
									comments={displayComments}
									comment_count={displayCommentCount}
									parentType="question"
									parentData={_data}
									{user}
									key={displayCommentCount}
									on:commentAdded={handleCommentAdded}
								/>

								{#if validAiComments.length}
									<details class="ai-perspectives-disclosure">
										<summary>
											<span>Compare with nine AI perspectives</span>
											<small>Optional · generated examples</small>
										</summary>
										<div class="ai-perspectives-disclosure__body">
											<p>
												These are prompts for comparison, not community posts. The real discussion
												above always comes first.
											</p>
											<AIComments data={_data} parentType="question" />
										</div>
									</details>
								{/if}

								<!-- Removed comments: quiet disclosure, not a top-level tab -->
								{#if _data?.removed_comment_count > 0}
									<details class="removed-comments-disclosure">
										<summary>
											{_data.removed_comment_count} removed
											{_data.removed_comment_count === 1 ? 'comment' : 'comments'}
										</summary>
										{#if _data?.removedComments?.length > 0}
											<Comments
												questionId={_data.question.id}
												parentData={_data}
												comment_count={_data.removed_comment_count}
												comments={_data.removedComments}
												parentType="question"
												{user}
											/>
										{/if}
									</details>
								{/if}
							{/if}
						{:else if section === 'Articles'}
							<ArticleLinks
								questionId={data.question.id}
								data={_data}
								parentType="question"
								oncommentAdded={handleCommentAdded}
							/>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	/* V5 Streetlamp pass 2026-06-09: flattened the legacy glass-morphism shell
	   (1.35rem radius, backdrop blur, gradient washes, static shadow) to the
	   locked system — 1px stone-edge border does the elevation work. */
	.question-content-shell {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.question-content-nav {
		position: relative;
		z-index: 1;
		display: flex;
		overflow-x: auto;
		padding: 0.45rem;
		border-bottom: 1px solid var(--stone-edge);
		background: var(--night-mid);
	}

	.question-tab {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		flex: 1 1 0;
		min-width: 0;
		padding: 0.9rem 1.15rem;
		border: 0;
		border-radius: 0.625rem;
		background: transparent;
		color: var(--ink-mid);
		font-size: 0.9rem;
		font-weight: 600;
		white-space: nowrap;
		transition:
			color 0.2s ease,
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.question-tab:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.question-tab__icon {
		display: inline-flex;
		flex: 0 0 auto;
		color: currentColor;
	}

	.question-tab__copy {
		display: inline-flex;
		align-items: baseline;
		justify-content: center;
		gap: 0.35rem;
		min-width: 0;
	}

	.question-tab__count {
		font-weight: 700;
	}

	.question-tab__label {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.question-tab:hover {
		color: var(--ink-bright);
		background: var(--lamp-soft);
	}

	.question-tab.is-active {
		color: var(--ink-bright);
		background: var(--lamp-soft);
		box-shadow: inset 0 -2px 0 var(--lamp-glow);
	}

	.question-content-body {
		position: relative;
		z-index: 1;
		min-height: 22rem;
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

	.community-discussion-head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(13rem, 0.7fr);
		align-items: end;
		gap: 1rem;
		margin: 0 1rem 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--stone-edge);
	}

	.community-discussion-head span {
		color: var(--lamp-glow);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.64rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.community-discussion-head h3 {
		margin: 0.3rem 0 0;
		color: var(--ink-bright);
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: -0.015em;
	}

	.community-discussion-head p {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.ai-perspectives-disclosure {
		margin: 1.5rem 1rem 0;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--night-mid);
	}

	.ai-perspectives-disclosure summary {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 3.25rem;
		padding: 0.75rem 3rem 0.75rem 1rem;
		color: var(--ink-bright);
		font-size: 0.86rem;
		font-weight: 650;
		cursor: pointer;
		list-style: none;
	}

	.ai-perspectives-disclosure summary::-webkit-details-marker {
		display: none;
	}

	.ai-perspectives-disclosure summary::after {
		content: '';
		position: absolute;
		top: 50%;
		right: 1rem;
		width: 0.5rem;
		height: 0.5rem;
		border-right: 2px solid var(--lamp-glow);
		border-bottom: 2px solid var(--lamp-glow);
		transform: translateY(-65%) rotate(45deg);
		transition: transform 180ms ease;
	}

	.ai-perspectives-disclosure[open] summary::after {
		transform: translateY(-35%) rotate(225deg);
	}

	.ai-perspectives-disclosure summary:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.ai-perspectives-disclosure summary small {
		color: var(--ink-dim);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.6rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-align: right;
		text-transform: uppercase;
	}

	.ai-perspectives-disclosure__body {
		padding: 0 1rem 1rem;
		border-top: 1px solid var(--stone-edge);
	}

	.ai-perspectives-disclosure__body > p {
		margin: 0;
		padding: 0.9rem 0 0;
		color: var(--ink-mid);
		font-size: 0.78rem;
		line-height: 1.5;
	}

	.removed-comments-disclosure {
		margin: 1.25rem 1rem 0;
		border: none;
		border-top: 1px solid var(--stone-edge);
		border-radius: 0;
		background: transparent;
		padding: 0.75rem 0 0;

		summary {
			cursor: pointer;
			font-size: 0.85rem;
			color: var(--ink-dim);
			padding: 0.25rem 0;

			&:hover {
				color: var(--ink-mid);
			}
		}
	}

	.locked-comments-shell {
		display: grid;
		gap: 1rem;
		padding: 0 1rem;
	}

	.public-perspective-preview {
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--night-mid);
	}

	.public-perspective-preview__head {
		margin-bottom: 0.9rem;
	}

	.public-perspective-preview__title {
		margin: 0 0 0.25rem;
		font-size: 1rem;
		font-weight: 700;
		color: var(--ink-bright);
	}

	.public-perspective-preview__copy {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--ink-mid);
	}

	.public-perspective-preview__grid {
		display: grid;
		gap: 0.75rem;
	}

	/* Homepage give-first wall, ported from src/routes/+page.svelte:
	   blurred sample cards behind a centered lock-message card. */
	.locked-preview-stage {
		position: relative;
		min-height: 11rem;
	}

	.blurred-perspectives {
		filter: blur(5px);
		opacity: 0.38;
		transform: scale(0.985);
		pointer-events: none;
		user-select: none;
	}

	.lock-message {
		position: absolute;
		inset: 50% auto auto 50%;
		display: flex;
		align-items: center;
		gap: 0.7rem;
		width: min(calc(100% - 2rem), 22rem);
		padding: 0.9rem 1rem;
		transform: translate(-50%, -50%);
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 24%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--stone-warm) 96%, var(--night-deep));
		color: var(--ink-mid);
		font-size: 0.8rem;
		line-height: 1.45;
		box-shadow: var(--shadow-sm);
	}

	.lock-icon {
		display: grid;
		width: 2.25rem;
		height: 2.25rem;
		flex: 0 0 2.25rem;
		place-items: center;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--night-mid);
		color: var(--lamp-glow);
	}

	.lock-message__copy {
		min-width: 0;
	}

	.lock-message__copy strong {
		display: block;
		color: var(--ink-bright);
	}

	.lock-message__meta {
		display: block;
		margin-top: 0.3rem;
		color: var(--ink-dim);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 0.65rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.public-perspective-card {
		padding: 0.95rem 1rem;
		border: 1px solid var(--stone-edge);
		/* Type-colored stripe — same attribution language as Comment.svelte. */
		border-left: 3px solid var(--comment-type-color, var(--stone-edge));
		border-radius: 0.625rem;
		background: var(--stone-warm);
	}

	.public-perspective-card__eyebrow {
		margin-bottom: 0.45rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--comment-type-color, var(--lamp-glow)) 65%, white);
	}

	:global(:root.light) .public-perspective-card__eyebrow {
		color: color-mix(in srgb, var(--comment-type-color, var(--lamp-glow)) 72%, black);
	}

	.public-perspective-card__body {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--ink-bright);
		/* Pasted URLs/long strings must wrap, not force page scroll (mobile audit) */
		overflow-wrap: anywhere;
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
		border-radius: 1rem;
		text-align: center;
	}

	.question-state-locked {
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 22%, var(--stone-edge));
		background: var(--lamp-soft);
	}

	.state-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.625rem;
	}

	.state-icon-locked {
		width: 4rem;
		height: 4rem;
		margin-bottom: 0.55rem;
		background: var(--lamp-soft);
	}

	.state-title {
		margin: 0;
		font-size: 1.12rem;
		font-weight: 600;
		line-height: 1.35;
		color: var(--ink-bright);
	}

	.state-copy {
		margin: 0.15rem 0 0;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--ink-mid);
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
			border-radius: 1rem;
		}

		.question-content-nav {
			padding: 0.35rem;
		}

		.question-tab {
			flex-direction: column;
			gap: 0.3rem;
			padding: 0.75rem 0.5rem;
			font-size: 0.78rem;
		}

		.question-tab__copy {
			gap: 0.25rem;
		}

		.question-content-section-inner {
			padding: 1.15rem 0 1.25rem;
		}

		.content-toolbar {
			padding: 0 0.8rem;
		}

		.community-discussion-head {
			grid-template-columns: 1fr;
			gap: 0.45rem;
			margin-inline: 0.8rem;
		}

		.ai-perspectives-disclosure {
			margin-inline: 0.8rem;
		}

		.ai-perspectives-disclosure summary {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.2rem;
		}

		.ai-perspectives-disclosure summary small {
			text-align: left;
		}

		.locked-comments-shell {
			padding: 0 0.8rem;
		}

		.public-perspective-preview {
			padding: 0.9rem;
		}

		.question-state {
			margin: 0;
			padding: 2.2rem 1rem;
		}

		.state-title {
			font-size: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ai-perspectives-disclosure summary::after {
			transition: none;
		}
	}
</style>

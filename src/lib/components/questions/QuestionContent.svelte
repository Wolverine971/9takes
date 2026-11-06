<!-- src/lib/components/questions/QuestionContent.svelte -->
<script lang="ts">
	import { onDestroy, onMount, untrack, type Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import PostIcon from '$lib/components/icons/postIcon.svelte';
	import Comments from '$lib/components/molecules/Comments.svelte';
	import RankedComments from './RankedComments.svelte';
	import { createCommentViewTracker } from '$lib/browser/commentViews';
	import { setCommentViewObserver } from './commentViewContext';
	import { getExistingVisitorId } from '$lib/analytics/visitorIdentity';
	import AIComments from '$lib/components/molecules/AIComments.svelte';
	import AnswerGist from './AnswerGist.svelte';
	import SealedTakes from './SealedTakes.svelte';
	import type { SealedTakes as SealedTakesData } from './sealedTakes';
	import ArticleLinks from '$lib/components/molecules/Links.svelte';
	import ReplyNotificationReturn from './ReplyNotificationReturn.svelte';
	import ReplyFocusThread from './ReplyFocusThread.svelte';
	import type { ReplyFocusThread as ReplyFocusThreadData } from './newReplyTreatment';
	import type {
		User,
		AIComment,
		Comment as CommentType,
		QuestionPageData
	} from '$lib/types/questions';
	import type { NextStarterLink } from './curatedReveal';

	interface Props {
		data: QuestionPageData;
		user: User | null;
		oncommentAdded?: () => void;
		/** Next "Start here" question by rank; null when this is the last one or not a starter. */
		nextStarter?: NextStarterLink | null;
		/** Server-resolved ?reply=<id> target (signed-in reply email landing). */
		replyFocus?: ReplyFocusThreadData | null;
		/** Post-answer handoff rendered under "Your take". */
		afterOwnTakes?: Snippet;
		/** Rendered after the first few revealed takes. */
		interstitial?: Snippet;
		revealFailed?: boolean;
		onretryReveal?: () => void;
		/** Locked state: who answered and when (never take text). */
		sealed?: SealedTakesData | null;
		/** Locked state: moves the visitor to the composer. */
		oncompose?: () => void;
	}

	let {
		data,
		user,
		oncommentAdded,
		nextStarter = null,
		replyFocus = null,
		afterOwnTakes,
		interstitial,
		revealFailed = false,
		onretryReveal,
		sealed = null,
		oncompose
	}: Props = $props();

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

	let displayCommentCount = $derived(_data.comment_count);

	// One observer lifecycle covers every take, including a focused reply thread.
	// Comment attaches only its card body; replies and removed/own takes are
	// rejected by the tracker before any visibility timer starts.
	let viewTracker: ReturnType<typeof createCommentViewTracker> | undefined;
	let trackerIdentity: string | undefined;
	function observeTake(node: Element, take: CommentType) {
		if (
			!data.flags.userHasAnswered ||
			data.commentViewsEnabled === false ||
			data.ownComments?.some((own) => own.id === take.id)
		)
			return;
		const identity = `${data.question.id}:${user?.id ?? 'anonymous'}`;
		if (trackerIdentity !== identity) {
			viewTracker?.destroy();
			viewTracker = undefined;
			trackerIdentity = identity;
		}
		viewTracker ??= createCommentViewTracker({
			questionId: data.question.id,
			unlocked: true,
			viewerId: user?.id ?? null,
			viewerFingerprint: getExistingVisitorId()
		});
		return viewTracker.observe(node, take);
	}
	setCommentViewObserver(observeTake);
	onDestroy(() => viewTracker?.destroy());

	// A reply-focus thread renders its parent above the community list.
	let replyFocusParentId = $derived(replyFocus?.parent?.id ?? null);
	let hiddenFromCommunity = $derived(replyFocusParentId === null ? [] : [replyFocusParentId]);
	let validAiComments = $derived((_data.aiComments ?? []).filter(hasValidAiType));

	// The reveal moment: only when the gate opens on this page, not on a direct
	// load of a thread the visitor already unlocked. Resets per question.
	// (The takes' staggered un-blur lives in RankedComments.)
	let lockedOnArrival = $derived.by(() => {
		void data.question.id;
		return untrack(() => !data.flags.userHasAnswered);
	});
	let revealedHere = $derived(lockedOnArrival && data.flags.userHasAnswered);

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

{#snippet nextQuestionNudge()}
	<nav class="next-question" aria-label="Next question">
		<span class="next-question__kicker">Next</span>
		{#if nextStarter?.url}
			<a
				class="next-question__link"
				href={resolve(`/questions/${nextStarter.url}` as `/questions/${string}`)}
			>
				Try another: <span class="next-question__question">{nextStarter.question}</span>
			</a>
		{:else}
			<a class="next-question__link" href={resolve('/questions')}>
				Try another: <span class="next-question__question">pick from the open questions</span>
			</a>
		{/if}
	</nav>
{/snippet}

{#snippet answerGist()}
	{#if data.answerSummary}
		<AnswerGist gist={data.answerSummary} />
	{/if}
{/snippet}

{#key data.question.id}
	<div class="question-content-shell">
		<!-- Tabs Navigation: only once there's something to switch between. Before
		     answering, the sealed takes are the whole story. -->
		{#if data?.flags?.userHasAnswered}
			<div
				class="question-content-nav scrollbar-hide"
				role="tablist"
				aria-label="Question sections"
			>
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
		{/if}

		<!-- Tab Content -->
		<div class="question-content-body">
			{#each tabs as section (section)}
				<div
					in:fade={{ duration: reduceMotion ? 0 : 200 }}
					id={getPanelId(section)}
					role="tabpanel"
					class:selected={selectedTab === section}
					class="question-content-section"
					hidden={selectedTab !== section}
					aria-labelledby={getTabId(section)}
				>
					<div class="question-content-section-inner">
						{#if section === 'Comments'}
							{#if data.replyNotificationReturn}
								<ReplyNotificationReturn
									context={data.replyNotificationReturn}
									thread={data.replyNotificationThread ?? null}
								/>
							{/if}
							{#if !data?.flags?.userHasAnswered}
								<div class="locked-comments-shell">
									<SealedTakes {sealed} count={displayCommentCount || 0} {oncompose} />
									<!-- Present only for IP-verified Googlebot: the server never sends
									     the gist to a human. Readers get the takes themselves, never an
									     AI summary of them (T-43, DJ 2026-10-09). -->
									{@render answerGist()}
								</div>
							{:else}
								<!-- Local transition: plays when the gate opens on this page,
								     not on a direct load of an already-unlocked thread. -->
								<div class="unlocked-thread" in:fade={{ duration: reduceMotion ? 0 : 180 }}>
									{#if replyFocus && browser}
										<ReplyFocusThread
											thread={replyFocus}
											questionId={_data.question.id}
											{user}
											parentData={_data}
										/>
									{/if}

									<header class="community-discussion-head">
										<p class="community-discussion-head__kicker">
											{revealedHere ? 'Unsealed' : 'The room'}
										</p>
										<h3 id="takes-discussion" tabindex="-1">
											{revealedHere ? 'The room, revealed.' : 'What the room said.'}
										</h3>
										<p>Everyone here answered before reading anyone else.</p>
									</header>
									<RankedComments
										data={_data}
										{user}
										excludeIds={hiddenFromCommunity}
										active={selectedTab === 'Comments'}
										oncommentAdded={handleCommentAdded}
										{afterOwnTakes}
										{interstitial}
										{revealFailed}
										{onretryReveal}
									/>

									{@render nextQuestionNudge()}

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
								</div>
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
			{/each}
		</div>
	</div>
{/key}

<style>
	/* Flat reading-list grammar: no card chrome around the thread. Before the
	   visitor answers, this is just the sealed takes. */
	.question-content-shell {
		position: relative;
		min-width: 0;
	}

	.question-content-nav {
		position: relative;
		z-index: 1;
		display: flex;
		overflow-x: auto;
		padding: 0;
		border-bottom: 1px solid var(--rule);
		background: transparent;
	}

	.question-tab {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		flex: 1 1 0;
		min-width: 0;
		min-height: 44px;
		padding: 0.75rem 1rem;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		font-weight: 600;
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	.question-tab:focus-visible {
		outline: 2px solid var(--focus);
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

	.question-tab:hover,
	.question-tab.is-active {
		color: var(--text);
	}

	.question-tab.is-active {
		box-shadow: inset 0 -2px 0 var(--highlight);
	}

	.question-tab.is-active .question-tab__count {
		color: var(--highlight);
	}

	.question-content-body {
		position: relative;
		z-index: 1;
	}

	.question-content-section {
		display: block;
	}

	.question-content-section[hidden] {
		display: none;
	}

	.question-content-section-inner {
		padding: 1.5rem 0 1.6rem;
	}

	.community-discussion-head {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin: 0 0 1.25rem;
	}

	.community-discussion-head__kicker {
		color: var(--highlight);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.community-discussion-head h3 {
		--room-title: clamp(1.75rem, 1.35rem + 1.6vw, 2.5rem);
		margin: 0;
		color: var(--text);
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 500;
		font-size: var(--room-title);
		line-height: 1.1;
		scroll-margin-top: 1.25rem;
	}

	/* Focus lands here programmatically after an answer; it is not a control. */
	.community-discussion-head h3:focus {
		outline: none;
	}

	.community-discussion-head p {
		margin: 0;
	}

	.community-discussion-head > p:last-child {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		line-height: 1.5;
	}

	.next-question {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem 0.75rem;
		margin: 0 0 1.5rem;
		padding: 0.75rem 0;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
	}

	.next-question__kicker {
		color: var(--highlight);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.next-question__link {
		min-width: 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		line-height: 1.45;
		text-decoration: none;
	}

	.next-question__link:hover .next-question__question,
	.next-question__link:focus-visible .next-question__question {
		color: var(--highlight);
	}

	.next-question__link:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}

	.next-question__question {
		color: var(--text);
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: var(--rule);
		text-underline-offset: 3px;
		overflow-wrap: anywhere;
	}

	/* Flat disclosures: override the global <details> card. */
	.ai-perspectives-disclosure,
	.removed-comments-disclosure {
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
	}

	.ai-perspectives-disclosure {
		margin: 1.5rem 0 0;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
	}

	.ai-perspectives-disclosure summary {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 3.25rem;
		padding: 0.75rem 2rem 0.75rem 0;
		color: var(--text);
		font-size: var(--font-size-sm);
		font-weight: 600;
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
		right: 0.25rem;
		width: 0.5rem;
		height: 0.5rem;
		border-right: 2px solid var(--highlight);
		border-bottom: 2px solid var(--highlight);
		transform: translateY(-65%) rotate(45deg);
		transition: transform 180ms ease;
	}

	.ai-perspectives-disclosure[open] summary::after {
		transform: translateY(-35%) rotate(225deg);
	}

	.ai-perspectives-disclosure summary:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}

	.ai-perspectives-disclosure summary small {
		color: var(--text-faint);
		font-size: var(--font-size-xs);
		font-weight: 500;
		text-align: right;
	}

	.ai-perspectives-disclosure__body {
		padding: 0 0 1rem;
	}

	.ai-perspectives-disclosure__body > p {
		margin: 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		line-height: 1.5;
	}

	.removed-comments-disclosure {
		margin: 1.25rem 0 0;
		padding: 0.75rem 0 0;

		summary {
			min-height: 44px;
			display: flex;
			align-items: center;
			cursor: pointer;
			font-size: var(--font-size-sm);
			color: var(--text-faint);

			&:hover {
				color: var(--text-muted);
			}
		}
	}

	.locked-comments-shell {
		display: grid;
		gap: 1rem;
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
		.question-tab {
			flex-direction: column;
			gap: 0.3rem;
			padding: 0.6rem 0.5rem;
		}

		.question-tab__copy {
			gap: 0.25rem;
		}

		.question-content-section-inner {
			padding: 1.15rem 0 1.25rem;
		}

		.ai-perspectives-disclosure summary {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.2rem;
		}

		.ai-perspectives-disclosure summary small {
			text-align: left;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ai-perspectives-disclosure summary::after {
			transition: none;
		}
	}
</style>

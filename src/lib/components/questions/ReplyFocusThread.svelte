<!-- src/lib/components/questions/ReplyFocusThread.svelte -->
<!--
  Signed-in reply-notification landing (?reply=<id>). Renders the parent take
  with its replies already open so #comment-box{replyId} exists on first
  paint, then applies the QC-05 "New reply" treatment to that reply: scroll
  (no animation under reduced motion), highlight, soften once seen.
  The community list hides the parent (excludeIds) so it never shows twice.
-->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Comment from '$lib/components/molecules/Comment.svelte';
	import type { User, QuestionPageData } from '$lib/types/questions';
	import {
		prefersReducedMotion,
		scrollToNewReply,
		softenNewReply,
		whenNewReplyVisible,
		type ReplyFocusThread
	} from './newReplyTreatment';

	interface Props {
		thread: ReplyFocusThread;
		questionId: number;
		user: User | null;
		parentData: QuestionPageData;
	}

	let { thread, questionId, user, parentData }: Props = $props();

	let heading: HTMLHeadingElement | undefined = $state(undefined);
	let settled = $state(false);

	const TARGET_CLASS = 'reply-focus-target';
	const SETTLED_CLASS = 'reply-focus-target--settled';
	const MAX_FRAMES = 90; // ~1.5s of frames for the nested list to mount

	function findReplyElement(): HTMLElement | null {
		return document.getElementById(`comment-box${thread.replyId}`);
	}

	onMount(() => {
		let cancelled = false;
		let frame = 0;
		let stopObserving: (() => void) | null = null;
		let cancelSoften: (() => void) | null = null;
		let target: HTMLElement | null = null;

		const settle = () => {
			if (cancelled) return;
			settled = true;
			target?.classList.add(SETTLED_CLASS);
		};

		const apply = (element: HTMLElement) => {
			if (cancelled) return;
			target = element;
			const reduceMotion = prefersReducedMotion();
			target.classList.add(TARGET_CLASS);
			scrollToNewReply(target, reduceMotion);
			heading?.focus({ preventScroll: true });
			stopObserving = whenNewReplyVisible(target, () => {
				cancelSoften = softenNewReply(reduceMotion, settle);
			});
		};

		const poll = () => {
			if (cancelled) return;
			const element = findReplyElement();
			if (element) {
				apply(element);
				return;
			}
			if (frame++ < MAX_FRAMES) {
				requestAnimationFrame(poll);
				return;
			}
			// Replies did not mount (network, removed since load): land on the take.
			const parentElement = document.getElementById(`comment-box${thread.parent.id}`);
			if (parentElement) {
				scrollToNewReply(parentElement, prefersReducedMotion());
				heading?.focus({ preventScroll: true });
			}
			settled = true;
		};

		void tick().then(poll);

		return () => {
			cancelled = true;
			stopObserving?.();
			cancelSoften?.();
			target?.classList.remove(TARGET_CLASS, SETTLED_CLASS);
		};
	});
</script>

<section class="reply-focus" aria-labelledby="reply-focus-heading">
	<header class="reply-focus__head">
		<p class="reply-focus__eyebrow">{settled ? 'REPLY' : 'NEW REPLY'}</p>
		<h3 id="reply-focus-heading" class="reply-focus__title" tabindex="-1" bind:this={heading}>
			Someone replied to this take
		</h3>
		<p class="reply-focus__copy">The reply is highlighted below. The rest of the room follows.</p>
	</header>

	<div class="reply-focus__thread">
		<Comment {questionId} comment={thread.parent} {user} {parentData} autoExpandReplies />
	</div>
</section>

<style>
	.reply-focus {
		margin: 0 1rem 1.5rem;
		padding: 1rem 0 0;
		border-top: 2px solid var(--highlight);
	}

	.reply-focus__head {
		margin-bottom: 0.85rem;
	}

	.reply-focus__eyebrow {
		margin: 0;
		color: var(--highlight);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.reply-focus__title {
		margin: 0.3rem 0 0;
		color: var(--text);
		font-size: var(--font-size-lg);
		font-weight: 700;
		letter-spacing: -0.015em;
	}

	.reply-focus__title:focus-visible {
		outline: 2px solid var(--highlight);
		outline-offset: 4px;
	}

	.reply-focus__copy {
		margin: 0.3rem 0 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		line-height: 1.5;
	}

	.reply-focus__thread {
		min-width: 0;
	}

	/* Same treatment as ReplyNotificationReturn's .reply-return__reply: lavender
	   hairline + indigo wash that settles once the reply has been seen. */
	.reply-focus :global(.reply-focus-target) {
		border-left: 3px solid var(--highlight);
		background: color-mix(in srgb, var(--accent) 7%, transparent);
		transition: background-color 0.8s ease;
	}

	.reply-focus :global(.reply-focus-target--settled) {
		background: color-mix(in srgb, var(--accent) 4%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.reply-focus :global(.reply-focus-target) {
			transition: none;
		}
	}

	@media (max-width: 640px) {
		.reply-focus {
			margin-inline: 0.8rem;
		}
	}
</style>

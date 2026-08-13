<!-- src/lib/components/questions/ReplyNotificationReturn.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { captureReplyNotificationReturnEvent } from '$lib/analytics/replyNotificationReturnEvents';
	import type {
		ReplyNotificationReturnContext,
		ReplyNotificationThread
	} from '$lib/types/questions';

	interface Props {
		context: ReplyNotificationReturnContext;
		thread: ReplyNotificationThread | null;
	}

	let { context, thread }: Props = $props();
	let heading: HTMLHeadingElement;
	let target: HTMLElement;
	let revisit = $state(false);
	let labelSoftened = $state(false);
	let actionReady = $state(false);
	const viewedKey = $derived(`9t-reply-return-viewed:${context.outboxId}`);
	const targetExists = $derived(context.targetStatus === 'available' && Boolean(thread?.reply));

	function actorLabel(comment: ReplyNotificationThread['parent']): string {
		const enneagram = comment?.profiles?.enneagram;
		return enneagram ? `Type ${enneagram}` : 'Anonymous';
	}

	function captureReadDiscussion() {
		void captureReplyNotificationReturnEvent('reply_notification_return_action', context, {
			action_type: 'read_discussion',
			revisit
		});
	}

	onMount(() => {
		try {
			revisit = window.localStorage.getItem(viewedKey) === '1';
		} catch {
			revisit = false;
		}

		void captureReplyNotificationReturnEvent('reply_notification_landed', context, { revisit });
		let observer: IntersectionObserver | null = null;
		let softenTimer: ReturnType<typeof setTimeout> | null = null;
		let cancelled = false;

		void tick().then(() => {
			if (cancelled) return;
			const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
			target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
			heading?.focus({ preventScroll: true });

			const markVisible = () => {
				if (!targetExists || labelSoftened) return;
				actionReady = true;
				try {
					window.localStorage.setItem(viewedKey, '1');
				} catch {
					// Storage is optional; return behavior must still work without it.
				}
				void captureReplyNotificationReturnEvent('reply_target_visible', context, { revisit });
				if (reduceMotion) labelSoftened = true;
				else softenTimer = setTimeout(() => (labelSoftened = true), 4_000);
			};

			if (targetExists && typeof IntersectionObserver === 'function') {
				observer = new IntersectionObserver(
					(entries) => {
						if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
							markVisible();
							observer?.disconnect();
						}
					},
					{ threshold: [0.5] }
				);
				observer.observe(target);
			} else if (targetExists) {
				markVisible();
			} else {
				actionReady = true;
			}
		});

		return () => {
			cancelled = true;
			observer?.disconnect();
			if (softenTimer) clearTimeout(softenTimer);
		};
	});
</script>

<section
	id="reply-notification-target"
	class="reply-return"
	aria-labelledby="reply-return-heading"
	bind:this={target}
>
	<div class="reply-return__intro">
		<p class="reply-return__eyebrow">
			{revisit ? 'REPLY FROM YOUR EMAIL' : 'NEW REPLY'}
		</p>
		<h2 id="reply-return-heading" tabindex="-1" bind:this={heading}>
			Someone added to your conversation
		</h2>
		<p>Your earlier take and the direct reply are together here.</p>
	</div>

	{#if thread?.parent}
		<article class="reply-return__take" aria-label="Your earlier take">
			<div class="reply-return__label">Your earlier take</div>
			<p>{thread.parent.comment}</p>
			<small>{actorLabel(thread.parent)}</small>
		</article>
	{/if}

	{#if targetExists && thread?.reply}
		<article
			class="reply-return__reply"
			class:reply-return__reply--settled={labelSoftened || revisit}
			aria-label="New reply"
		>
			<div class="reply-return__label">{revisit || labelSoftened ? 'Reply' : 'New reply'}</div>
			<p>{thread.reply.comment}</p>
			<small>{actorLabel(thread.reply)}</small>
		</article>
	{:else}
		<div class="reply-return__missing" role="status">
			<strong>This reply is no longer available.</strong>
			<span>The surrounding discussion is still here.</span>
		</div>
	{/if}

	{#if context.subscriptionStatus === 'stopped'}
		<p class="reply-return__stopped" role="status">Email updates for this conversation are off.</p>
	{/if}

	{#if actionReady}
		<a class="reply-return__action" href="#comments-panel" onclick={captureReadDiscussion}>
			Read the rest of the discussion
		</a>
	{/if}
</section>

<style>
	.reply-return {
		display: grid;
		gap: 0.875rem;
		margin: 0 1rem 1.25rem;
		padding: 1.125rem;
		scroll-margin-top: 5.5rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 24%, var(--stone-edge));
		border-radius: 0.875rem;
		background: color-mix(in srgb, var(--lamp-soft) 22%, var(--stone-warm));
	}

	.reply-return__intro h2 {
		margin: 0.2rem 0 0.25rem;
		color: var(--ink-bright);
		font-size: clamp(1.05rem, 2vw, 1.25rem);
		line-height: 1.25;
	}

	:global(.reply-return__intro h2:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 4px;
	}

	.reply-return__intro p:last-child,
	.reply-return__take p,
	.reply-return__reply p,
	.reply-return__missing,
	.reply-return__stopped {
		margin: 0;
		color: var(--ink-mid);
		line-height: 1.55;
	}

	.reply-return__eyebrow,
	.reply-return__label {
		margin: 0;
		color: var(--lamp-glow);
		font-family: var(--font-mono, monospace);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.reply-return__take,
	.reply-return__reply {
		display: grid;
		gap: 0.45rem;
		padding: 0.9rem 1rem;
		border-left: 3px solid var(--stone-edge);
		background: color-mix(in srgb, var(--stone-mid) 38%, transparent);
	}

	.reply-return__reply {
		border-left-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-soft) 38%, transparent);
		transition: background-color 0.8s ease;
	}

	.reply-return__reply--settled {
		background: color-mix(in srgb, var(--lamp-soft) 20%, transparent);
	}

	.reply-return__take p,
	.reply-return__reply p {
		color: var(--ink-bright);
		white-space: pre-line;
		overflow-wrap: anywhere;
	}

	.reply-return small {
		color: var(--ink-dim);
		font-family: var(--font-mono, monospace);
		font-size: 0.72rem;
		text-transform: uppercase;
	}

	.reply-return__missing {
		display: grid;
		gap: 0.2rem;
		padding: 0.9rem 1rem;
		border-left: 3px solid var(--stone-edge);
		background: color-mix(in srgb, var(--stone-mid) 38%, transparent);
	}

	.reply-return__missing strong {
		color: var(--ink-bright);
	}

	.reply-return__stopped {
		font-size: 0.82rem;
	}

	.reply-return__action {
		justify-self: start;
		min-height: 2.75rem;
		display: inline-flex;
		align-items: center;
		border-radius: 0.5rem;
		color: var(--ink-bright);
		font-weight: 650;
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--lamp-glow) 65%, transparent);
		text-underline-offset: 0.25rem;
	}

	:global(.reply-return__action:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 3px;
	}

	@media (prefers-reduced-motion: reduce) {
		.reply-return__reply {
			transition: none;
		}
	}

	@media (max-width: 520px) {
		.reply-return {
			margin-inline: 0.75rem;
			padding: 1rem;
		}
	}
</style>

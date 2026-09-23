<!-- src/lib/components/questions/ReplyOptInTray.svelte -->
<!--
  Optional reply-email tray for an anonymous first answer. It renders inside
  the unlocked thread, directly under the visitor's own take, so the reveal
  stays the payoff and the ask sits next to the take it is about.
-->
<script lang="ts" module>
	import type { ReplyOptInContext } from '$lib/analytics/replyOptInEvents';

	export type ReplyOptInOffer = { context: ReplyOptInContext; fingerprint: string };
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { Button } from '$lib/components/atoms';
	import {
		captureReplyOptInDismissed,
		captureReplyOptInFailed,
		captureReplyOptInFocused,
		captureReplyOptInShown,
		captureReplyOptInSubmitted,
		captureReplyOptInSucceeded,
		type ReplyOptInFailureCategory
	} from '$lib/analytics/replyOptInEvents';

	interface Props {
		offer: ReplyOptInOffer;
		/** Optional first sentence (the host promise), so it rides in the tray
		 * instead of stacking as a separate line above it. */
		lead?: string;
		onstatechange?: (state: 'dismissed' | 'subscribed') => void;
	}

	let { offer, lead = '', onstatechange }: Props = $props();

	const REPLY_OPT_IN_DISMISSED_KEY = '9t-reply-opt-in-dismissed';
	const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	let email = $state('');
	let loading = $state(false);
	let succeeded = $state(false);
	let message = $state('');
	let focusedTracked = false;
	let inputId = $derived(`reply-opt-in-email-${offer.context.commentId}`);
	let headingId = $derived(`reply-opt-in-heading-${offer.context.commentId}`);
	let statusId = $derived(`reply-opt-in-status-${offer.context.commentId}`);

	onMount(() => {
		void captureReplyOptInShown(offer.context);
	});

	function focusInput() {
		if (focusedTracked) return;
		focusedTracked = true;
		void captureReplyOptInFocused(offer.context);
	}

	function dismiss() {
		void captureReplyOptInDismissed(offer.context);
		try {
			sessionStorage.setItem(REPLY_OPT_IN_DISMISSED_KEY, '1');
		} catch {
			// The parent's dismissed state still keeps the tray closed for this visit.
		}
		onstatechange?.('dismissed');
	}

	function statusFrom(result: any): string {
		return (
			result?.data?.replyOptIn?.status ??
			result?.data?.status ??
			result?.replyOptIn?.status ??
			'failed'
		);
	}

	function failureCopy(category: ReplyOptInFailureCategory): string {
		if (category === 'invalid_email') return 'Enter a valid email address.';
		if (category === 'suppressed') return 'That address is unsubscribed, so no email was added.';
		if (category === 'ineligible') return 'This reply reminder is no longer available.';
		return 'Your take is posted, but the email could not be saved. Try again if you’d like.';
	}

	async function submit() {
		if (loading || succeeded) return;
		const address = email.trim();
		void captureReplyOptInSubmitted(offer.context);

		if (!EMAIL_PATTERN.test(address) || address.length > 320) {
			message = failureCopy('invalid_email');
			void captureReplyOptInFailed(offer.context, 'invalid_email');
			return;
		}

		loading = true;
		message = '';
		try {
			const body = new FormData();
			body.append('comment_id', String(offer.context.commentId));
			body.append('question_id', String(offer.context.questionId));
			body.append('fingerprint', offer.fingerprint);
			body.append('email', address);

			const response = await fetch('?/subscribeToCommentReplies', { method: 'POST', body });
			const status = statusFrom(deserialize(await response.text()));
			if (status === 'subscribed' || status === 'already_subscribed') {
				succeeded = true;
				message = 'You’re set. We’ll only email if someone replies to this conversation.';
				void captureReplyOptInSucceeded(offer.context);
				onstatechange?.('subscribed');
				return;
			}

			const category: ReplyOptInFailureCategory =
				status === 'suppressed'
					? 'suppressed'
					: status === 'invalid'
						? 'invalid_email'
						: status === 'ineligible'
							? 'ineligible'
							: 'server_error';
			message = failureCopy(category);
			void captureReplyOptInFailed(offer.context, category);
		} catch {
			message = failureCopy('network_error');
			void captureReplyOptInFailed(offer.context, 'network_error');
		} finally {
			loading = false;
		}
	}
</script>

<section class="reply-opt-in" aria-labelledby={headingId} aria-live="polite">
	<div class="reply-opt-in__title">
		<p class="reply-opt-in__eyebrow">OPTIONAL · THIS CONVERSATION ONLY</p>
		<h3 id={headingId}>Want a note if someone replies?</h3>
	</div>
	<p class="reply-opt-in__copy">
		{#if lead}{lead}{' '}{/if}Your take stays anonymous, and we'll only email about this
		conversation.
	</p>

	{#if succeeded}
		<p class="reply-opt-in__status reply-opt-in__status--success" role="status">{message}</p>
	{:else}
		<!-- display: contents lets the field, submit and dismiss join the tray's
		     grid, so one "Not now" can sit top-right on desktop and beside the
		     submit on phones. -->
		<form
			class="reply-opt-in__form"
			novalidate
			onsubmit={(event) => {
				event.preventDefault();
				void submit();
			}}
		>
			<label class="sr-only" for={inputId}>Email</label>
			<input
				id={inputId}
				class="reply-opt-in__input"
				type="email"
				inputmode="email"
				autocomplete="email"
				placeholder="you@example.com"
				bind:value={email}
				onfocus={focusInput}
				oninput={() => (message = '')}
				aria-invalid={message ? 'true' : 'false'}
				aria-describedby={message ? statusId : undefined}
			/>
			<Button
				class="reply-opt-in__submit"
				variant="primary"
				size="md"
				type="submit"
				disabled={loading}
				{loading}
			>
				Keep me posted
			</Button>
			<Button
				class="reply-opt-in__dismiss"
				variant="ghost"
				size="sm"
				type="button"
				onclick={dismiss}
				disabled={loading}
			>
				Not now
			</Button>
		</form>
		{#if message}
			<p id={statusId} class="reply-opt-in__status" role="status">{message}</p>
		{/if}
	{/if}
</section>

<style>
	.reply-opt-in {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-areas:
			'title dismiss'
			'copy copy'
			'input submit'
			'status status';
		column-gap: 0.5rem;
		align-items: center;
		padding: 0.9rem 1rem 1rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 22%, var(--stone-edge));
		border-radius: 1rem;
		background:
			linear-gradient(135deg, color-mix(in srgb, var(--lamp-soft) 58%, transparent), transparent),
			color-mix(in srgb, var(--stone-warm) 97%, var(--night-deep));
	}

	.reply-opt-in__title {
		grid-area: title;
		align-self: start;
		min-width: 0;
	}

	.reply-opt-in__eyebrow {
		margin: 0 0 0.25rem;
		color: var(--lamp-glow);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.08em;
	}

	.reply-opt-in h3 {
		margin: 0;
		color: var(--ink-bright);
		font-size: 1rem;
		font-weight: 650;
		line-height: 1.35;
	}

	.reply-opt-in__copy {
		grid-area: copy;
		margin: 0.2rem 0 0;
		color: var(--ink-mid);
		font-size: 0.82rem;
		line-height: 1.5;
	}

	.reply-opt-in__form {
		display: contents;
	}

	.reply-opt-in__input {
		grid-area: input;
		display: block;
		width: 100%;
		min-width: 0;
		min-height: 2.75rem;
		margin-top: 0.7rem;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--night-deep) 88%, transparent);
		color: var(--ink-bright);
		font: inherit;
		font-size: 16px;
		transition: border-color 0.15s ease;
	}

	.reply-opt-in__input::placeholder {
		color: var(--ink-dim);
	}

	:global(.reply-opt-in__input:focus-visible) {
		border-color: var(--lamp-glow);
		outline: 2px solid color-mix(in srgb, var(--lamp-glow) 36%, transparent);
		outline-offset: 2px;
	}

	.reply-opt-in :global(.reply-opt-in__submit) {
		grid-area: submit;
		margin-top: 0.7rem;
	}

	.reply-opt-in :global(.reply-opt-in__dismiss) {
		grid-area: dismiss;
		align-self: start;
		margin: -0.35rem -0.5rem 0 0;
	}

	.reply-opt-in__status {
		grid-area: status;
		margin: 0.55rem 0 0;
		color: var(--error-text);
		font-size: 0.82rem;
		line-height: 1.5;
	}

	.reply-opt-in__status--success {
		grid-area: input / input / submit / submit;
		padding-top: 0.4rem;
		color: var(--lamp-light);
	}

	/* Phones: the title and the email field get the full width, and
	   "Not now" moves beside the submit button. */
	@media (max-width: 560px) {
		.reply-opt-in {
			grid-template-areas:
				'title title'
				'copy copy'
				'input input'
				'submit dismiss'
				'status status';
			padding: 0.8rem 0.875rem 0.875rem;
		}

		/* The copy already says "this conversation only". */
		.reply-opt-in__eyebrow {
			display: none;
		}

		.reply-opt-in :global(.reply-opt-in__submit) {
			margin-top: 0.5rem;
		}

		.reply-opt-in :global(.reply-opt-in__dismiss) {
			align-self: center;
			margin: 0.5rem 0 0;
			min-height: 2.75rem;
		}
	}
</style>

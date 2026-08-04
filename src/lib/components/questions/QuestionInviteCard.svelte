<!-- src/lib/components/questions/QuestionInviteCard.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, QrCode, Share2 } from '@lucide/svelte';
	import QRCodeGenerator from 'qrcode';
	import { Button } from '$lib/components/atoms';
	import { capture } from '$lib/analytics/posthog';
	import {
		buildQuestionInviteUrl,
		createQuestionInviteId,
		markQuestionInvitePromptSeen,
		recordQuestionInviteCreated,
		shareQuestionInvite,
		shouldUseNativeQuestionShare,
		type QuestionInviteSource,
		type QuestionInviteShareMethod
	} from '$lib/analytics/questionInvites';

	type Props = {
		questionId: number;
		questionUrl: string;
		questionText: string;
		source: QuestionInviteSource;
		onclose?: () => void;
	};

	let { questionId, questionUrl, questionText, source, onclose }: Props = $props();

	let sharing = $state(false);
	let shareComplete = $state(false);
	let shareMethod = $state<QuestionInviteShareMethod | null>(null);
	let feedback = $state('');
	let feedbackTone = $state<'success' | 'error'>('success');
	let qrVisible = $state(false);
	let qrLoading = $state(false);
	let qrCodeUrl = $state('');
	let titleId = $derived(`question-invite-title-${questionId}`);
	let feedbackId = $derived(`question-invite-feedback-${questionId}`);
	let canonicalQuestionUrl = $derived(`https://9takes.com/questions/${questionUrl}`);

	const QR_OPTIONS = {
		errorCorrectionLevel: 'H' as const,
		type: 'image/png' as const,
		margin: 1,
		color: { dark: '#F59E0B', light: '#0C0A09' }
	};

	onMount(() => {
		markQuestionInvitePromptSeen(questionUrl);
		void capture('question_invite_prompt_shown', {
			question_id: questionId,
			question_url: questionUrl,
			source,
			placement: 'inline'
		});
	});

	function prefersNativeShare(): boolean {
		return shouldUseNativeQuestionShare({
			canNativeShare: typeof navigator.share === 'function',
			coarsePointer: window.matchMedia('(pointer: coarse)').matches,
			viewportWidth: window.innerWidth
		});
	}

	async function askOnePerson() {
		if (sharing || shareComplete) return;
		sharing = true;
		feedback = '';

		try {
			const useNativeShare = prefersNativeShare();
			const result = await shareQuestionInvite({
				baseUrl: canonicalQuestionUrl,
				title: 'A question from 9takes',
				text: `${questionText}\n\nI think you might answer this differently.`,
				share: useNativeShare ? navigator.share.bind(navigator) : undefined,
				writeClipboard: navigator.clipboard?.writeText?.bind(navigator.clipboard)
			});

			if (result.status !== 'shared') {
				if (result.status === 'failed') {
					feedbackTone = 'error';
					feedback = 'Could not open sharing. Copy the page URL from your browser.';
				}
				return;
			}

			shareComplete = true;
			shareMethod = result.method;
			feedbackTone = 'success';
			feedback =
				result.method === 'native'
					? 'Invite shared. Come back after they answer.'
					: 'Invite link copied. Send it to one person.';
			void recordQuestionInviteCreated({
				inviteId: result.inviteId,
				questionId,
				questionUrl,
				source,
				method: result.method
			});
			void capture('question_shared_from_invite_card', {
				invite_id: result.inviteId,
				question_id: questionId,
				question_url: questionUrl,
				source,
				method: result.method
			});
		} finally {
			sharing = false;
		}
	}

	async function toggleQrCode() {
		if (qrCodeUrl) {
			qrVisible = !qrVisible;
			return;
		}

		if (qrLoading) return;
		qrLoading = true;
		feedback = '';

		try {
			const inviteId = createQuestionInviteId();
			const inviteUrl = buildQuestionInviteUrl(canonicalQuestionUrl, inviteId);
			qrCodeUrl = await QRCodeGenerator.toDataURL(inviteUrl, QR_OPTIONS);
			qrVisible = true;
			void recordQuestionInviteCreated({
				inviteId,
				questionId,
				questionUrl,
				source,
				method: 'qr'
			});
		} catch {
			feedbackTone = 'error';
			feedback = 'Could not prepare the QR code. Try the invite button instead.';
		} finally {
			qrLoading = false;
		}
	}

	function dismissInvite() {
		void capture('question_invite_prompt_closed', {
			question_id: questionId,
			question_url: questionUrl,
			source,
			action: shareComplete ? 'completed' : 'maybe_later'
		});
		onclose?.();
	}
</script>

{#snippet shareIcon()}
	{#if shareComplete}
		<Check size={18} aria-hidden="true" />
	{:else}
		<Share2 size={18} aria-hidden="true" />
	{/if}
{/snippet}

<section class="invite-card" aria-labelledby={titleId}>
	<div class="invite-card__icon" aria-hidden="true">
		<Share2 size={20} />
	</div>

	<div class="invite-card__body">
		<p class="invite-card__kicker">A one-person comparison</p>
		<h3 id={titleId}>Who would answer this differently?</h3>
		<p class="invite-card__copy">
			Send this to one person. They’ll answer before seeing the room, then you can compare what each
			of you noticed.
		</p>

		<div class="invite-card__actions">
			<Button
				size="md"
				onclick={askOnePerson}
				loading={sharing}
				disabled={shareComplete}
				icon={shareIcon}
				aria-describedby={feedback ? feedbackId : undefined}
			>
				{shareComplete
					? shareMethod === 'clipboard'
						? 'Link copied'
						: 'Invite shared'
					: 'Ask one person'}
			</Button>
			<button
				type="button"
				class="invite-card__quiet-action"
				onclick={toggleQrCode}
				aria-expanded={qrVisible}
				aria-controls={`question-invite-qr-${questionId}`}
				disabled={qrLoading}
			>
				<QrCode size={15} aria-hidden="true" />
				{qrLoading ? 'Preparing…' : qrVisible ? 'Hide QR' : 'Show QR'}
			</button>
			<button type="button" class="invite-card__quiet-action" onclick={dismissInvite}>
				{shareComplete ? 'Done' : 'Maybe later'}
			</button>
		</div>

		{#if feedback}
			<p
				id={feedbackId}
				class={['invite-card__feedback', feedbackTone === 'error' && 'is-error']}
				role="status"
			>
				{feedback}
			</p>
		{/if}

		{#if qrVisible && qrCodeUrl}
			<div class="invite-card__qr" id={`question-invite-qr-${questionId}`}>
				<img
					src={qrCodeUrl}
					alt="Invite someone to answer this question"
					width="152"
					height="152"
				/>
				<p>Let one person scan this. They’ll answer before seeing the room.</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.invite-card {
		--cta-text: var(--night-deep);

		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.9rem;
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 34%, var(--stone-edge));
		border-radius: 1rem;
		background:
			radial-gradient(
				circle at 0 0,
				color-mix(in srgb, var(--lamp-glow) 10%, transparent),
				transparent 42%
			),
			color-mix(in srgb, var(--stone-warm) 97%, var(--night-deep));
		box-shadow: var(--shadow-sm);
	}

	:global(:root.light) .invite-card {
		--cta-text: var(--ink-bright);
	}

	.invite-card__icon {
		display: grid;
		width: 2.5rem;
		height: 2.5rem;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 36%, var(--stone-edge));
		border-radius: 0.625rem;
		background: var(--lamp-soft);
		color: var(--lamp-glow);
	}

	.invite-card__body {
		min-width: 0;
	}

	.invite-card__kicker {
		margin: 0;
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.invite-card h3 {
		margin: 0.28rem 0 0;
		color: var(--ink-bright);
		font-size: 1.08rem;
		font-weight: 720;
		letter-spacing: -0.02em;
		line-height: 1.25;
	}

	.invite-card__copy {
		max-width: 44rem;
		margin: 0.45rem 0 0;
		color: var(--ink-mid);
		font-size: 0.84rem;
		line-height: 1.55;
	}

	.invite-card__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 0.7rem;
		margin-top: 0.85rem;
	}

	.invite-card__quiet-action {
		display: inline-flex;
		min-height: 2.5rem;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.5rem;
		border: 0;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--ink-dim);
		font: inherit;
		font-size: 0.78rem;
		cursor: pointer;
	}

	.invite-card__quiet-action:hover {
		background: var(--stone-mid);
		color: var(--ink-bright);
	}

	:global(.invite-card__quiet-action:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.invite-card__quiet-action:disabled {
		opacity: 0.55;
		cursor: wait;
	}

	.invite-card__feedback {
		margin: 0.65rem 0 0;
		color: var(--success-text);
		font-size: 0.76rem;
		line-height: 1.45;
	}

	.invite-card__feedback.is-error {
		color: var(--warning-text);
	}

	.invite-card__qr {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.85rem;
		padding: 0.8rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.75rem;
		background: var(--night-deep);
	}

	.invite-card__qr img {
		width: 8rem;
		height: 8rem;
		flex: 0 0 auto;
	}

	.invite-card__qr p {
		max-width: 16rem;
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.78rem;
		line-height: 1.5;
	}

	@media (max-width: 560px) {
		.invite-card {
			grid-template-columns: minmax(0, 1fr);
		}

		.invite-card__icon {
			width: 2.25rem;
			height: 2.25rem;
		}

		.invite-card__actions {
			align-items: stretch;
		}

		:global(.invite-card__actions .btn) {
			width: 100%;
		}

		.invite-card__quiet-action {
			justify-content: center;
			flex: 1 1 auto;
		}

		.invite-card__qr {
			flex-direction: column;
			text-align: center;
		}
	}
</style>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { slide, fade } from 'svelte/transition';
	import FingerprintJS from '@fingerprintjs/fingerprintjs';
	import { notifications } from '$lib/components/molecules/notifications';
	import BellIcon from '$lib/components/icons/bellIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

	// Component props
	export let parentType: string;
	export let data: any;
	export let user: any;
	export let questionId: number;
	export let qrCodeUrl: string;
	export let qrCodeSize: string;

	const dispatch = createEventDispatcher();

	// State variables
	let likes: any[] = [];
	let subscriptions: any[] = [];
	let comment: string = '';
	let commenting: boolean = false;
	let loading: boolean = false;
	let anonymousComment = false;
	let innerWidth: number = 0;
	let textareaHeight = 'auto';

	// Reactive statements
	$: {
		// Update likes and subscription state from data
		likes = data?.comment_like || [];
		subscriptions = data?.question?.subscriptions || [];

		// Auto-show comment box for first-time answerers
		if (!data?.flags?.userHasAnswered && parentType === 'question') {
			commenting = true;
		}
	}

	// Handle QR code modal opening
	const openQRModal = () => {
		getModal('qr-modal').open();
	};

	// Create a new comment
	const createComment = async () => {
		if (!canComment()) return;
		if (!comment.trim()) {
			notifications.info('Comment cannot be empty', 3000);
			return;
		}

		loading = true;

		try {
			const fp = await FingerprintJS.load();
			const fpval = await fp.get();

			const body = new FormData();
			appendCommonFormData(body, fpval);

			const result = await submitComment(body);
			handleCommentResult(result);
		} catch (error) {
			console.error('Error creating comment:', error);
			notifications.danger('Failed to create comment', 3000);
		} finally {
			loading = false;
		}
	};

	// Check if user can comment
	const canComment = () => {
		if (!data?.flags?.userSignedIn && !user?.id) {
			if (data?.flags?.userHasAnswered || anonymousComment) {
				notifications.info('Must register or login to comment multiple times', 3000);
				return false;
			} else if (parentType === 'comment') {
				notifications.info('Must register or login to comment on other comments', 3000);
				return false;
			}
			// Allow first anonymous comment on questions
			anonymousComment = true;
		}
		return true;
	};

	// Prepare form data for comment submission
	const appendCommonFormData = (body: FormData, fpval: any) => {
		body.append('comment', comment);
		body.append('parent_id', parentType === 'comment' ? data.id : data.question.id);
		body.append('author_id', user?.id);
		body.append('parent_type', parentType);
		body.append('es_id', parentType === 'comment' ? data.es_id : data.question.es_id);
		body.append('question_id', questionId.toString());
		body.append('fingerprint', fpval?.visitorId?.toString());
	};

	// Submit comment to the server
	const submitComment = async (body: FormData) => {
		const resp = await fetch('?/createCommentRando', {
			method: 'POST',
			body
		});
		return deserialize(await resp.text());
	};

	// Handle comment submission result
	const handleCommentResult = (result: any) => {
		if (result.error) {
			notifications.danger('Error adding comment', 3000);
			console.error(result.error);
		} else {
			notifications.info('Comment Added', 3000);
			dispatch('commentAdded', result?.data);
			comment = '';
			textareaHeight = 'auto';

			// Hide comment box after submitting for non-first-time users
			if (data?.flags?.userHasAnswered) {
				commenting = false;
			}
		}
	};

	// Toggle subscription status
	const toggleSubscription = async () => {
		if (!user) {
			notifications.info('Must register or login to subscribe to questions', 3000);
			return;
		}

		const isSubscribed = subscriptions.some((e) => e.user_id === user.id);
		const operation = isSubscribed ? 'remove' : 'add';

		try {
			const body = new FormData();
			body.append('parent_id', data.question.id);
			body.append('user_id', user.id);
			body.append('es_id', data.question.es_id);
			body.append('operation', operation);

			const resp = await fetch('?/subscribe', {
				method: 'POST',
				body
			});

			const result: any = deserialize(await resp.text());

			notifications.info(operation === 'add' ? 'Subscription Added' : 'Subscription Removed', 3000);

			updateSubscriptions(result?.data, operation);
		} catch (error) {
			console.error('Error toggling subscription:', error);
			notifications.danger('Failed to update subscription', 3000);
		}
	};

	// Update subscription state
	const updateSubscriptions = (newSubscription: any, operation: string) => {
		if (operation === 'add') {
			subscriptions = [newSubscription, ...subscriptions];
		} else {
			subscriptions = subscriptions.filter((c) => c.user_id !== user.id);
		}
	};

	// Handle textarea auto-growth
	const handleTextareaInput = (e: Event) => {
		const target = e.target as HTMLTextAreaElement;
		// Reset height temporarily to get the right scrollHeight
		target.style.height = 'auto';
		// Set new height based on scrollHeight (with a small buffer)
		target.style.height = `${target.scrollHeight + 2}px`;

		// Update the data attribute for the container
		const container = target.parentNode as HTMLElement;
		if (container) {
			container.dataset.replicatedValue = target.value;
		}
	};

	// Handle keyboard shortcuts
	const handleKeydown = (e: KeyboardEvent) => {
		// Submit comment with Ctrl+Enter or Cmd+Enter
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && comment.trim()) {
			e.preventDefault();
			createComment();
		}
	};

	// Initialize on mount
	onMount(() => {
		innerWidth = window.innerWidth;

		// Parse any escaped newlines in placeholders
		document.querySelectorAll('textarea').forEach((elem) => {
			elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
		});
	});
</script>

<svelte:window bind:innerWidth />

<div class="interaction-container">
	<div class="button-group">
		<button
			title="Comment"
			class="action-btn primary-action"
			on:click={() => (commenting = !commenting)}
			aria-label={commenting ? 'Hide comment box' : 'Write a comment'}
		>
			<MasterCommentIcon
				iconStyle={'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={'var(--accent)'}
				type={comment?.length ? 'full' : 'empty'}
			/>
			<span class="btn-text">Comment</span>
		</button>

		{#if parentType === 'question'}
			<button
				title={subscriptions.some((e) => e.user_id === user?.id) ? 'Unsubscribe' : 'Subscribe'}
				class="action-btn secondary-action"
				class:active={subscriptions.some((e) => e.user_id === user?.id)}
				on:click={toggleSubscription}
				aria-label={subscriptions.some((e) => e.user_id === user?.id) ? 'Unsubscribe' : 'Subscribe'}
			>
				<BellIcon
					iconStyle={'padding: 0.25rem;'}
					height={'1.5rem'}
					fill={subscriptions.some((e) => e.user_id === user?.id)
						? 'var(--primary)'
						: 'var(--accent)'}
				/>
				<span class="btn-text">
					{subscriptions.some((e) => e.user_id === user?.id) ? 'Subscribed' : 'Subscribe'}
				</span>
			</button>

			{#if qrCodeUrl && innerWidth > 576}
				<button
					title="Share via QR Code"
					class="action-btn secondary-action qr-btn"
					on:click={openQRModal}
					aria-label="Share via QR Code"
				>
					<img src={qrCodeUrl} alt="9takes QR Code" class="qr-icon" />
					<span class="btn-text">Share</span>
				</button>
			{/if}
		{/if}
	</div>

	{#if commenting}
		<div class="comment-form" in:slide={{ duration: 300 }}>
			<div
				class="textarea-container"
				data-replicated-value={comment}
				style="--text-height: {textareaHeight};"
			>
				<textarea
					placeholder={parentType === 'question'
						? "What's your perspective on this question? Share your thoughts..."
						: 'Write your reply...'}
					class="comment-textarea"
					bind:value={comment}
					id="comment-box"
					rows="3"
					on:input={handleTextareaInput}
					on:keydown={handleKeydown}
				></textarea>
			</div>
			<div class="form-actions">
				{#if data?.flags?.userHasAnswered}
					<button
						class="cancel-btn"
						type="button"
						on:click={() => {
							commenting = false;
							comment = '';
						}}
					>
						Cancel
					</button>
				{/if}
				<button
					class="submit-btn"
					type="button"
					on:click={createComment}
					disabled={!comment.trim() || loading}
					id="comment-button"
				>
					{#if loading}
						<div class="loader" />
					{:else}
						{parentType === 'question' ? 'Send it' : 'Reply'}
						<RightIcon iconStyle={'margin-left: .5rem;'} height={'1.5rem'} fill={'white'} />
					{/if}
				</button>
			</div>
		</div>
	{/if}
</div>

<!-- QR Code Modal -->
<Modal2 id="qr-modal">
	<div class="qr-modal-content">
		<h2>Share Question via QR Code</h2>
		<div class="qr-container">
			<img src={qrCodeUrl} alt="9takes QR Code" class="qr-large" />
		</div>
		<p class="qr-help-text">Scan this code with your camera to share this question</p>
	</div>
</Modal2>

<style lang="scss">
	@import './comment.scss';
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.interaction-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1rem 0;
	}

	.button-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;

		@media (max-width: 576px) {
			gap: 0.5rem;
		}
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border: none;
		border-radius: var(--base-border-radius);
		font-weight: 500;
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.2s ease;

		.btn-text {
			white-space: nowrap;
		}

		&.primary-action {
			background-color: var(--primary);
			color: var(--text-on-primary);
			font-weight: 600;
			border-radius: var(--border-radius);
			transition: all 0.2s ease;
			flex: 1;

			&:hover {
				background-color: var(--button-hover);
				transform: translateY(-1px);
				box-shadow: var(--shadow-sm);
			}
		}

		&.secondary-action {
			background-color: var(--lightest-gray);
			color: var(--dark-gray);
			border: 1px solid var(--light-gray);

			&:hover {
				background-color: var(--light-gray);
				color: var(--darkest-gray);
			}

			&.active {
				background-color: var(--accent-light);
				color: var(--primary-dark);
				border-color: var(--accent);
			}
		}

		&.qr-btn {
			.qr-icon {
				width: 1.5rem;
				height: 1.5rem;
				border-radius: var(--base-border-radius);
				transition: transform 0.2s ease;
			}

			&:hover .qr-icon {
				transform: scale(1.1);
			}
		}

		@media (max-width: 768px) {
			padding: 0.625rem 1rem;
			font-size: 0.9rem;
		}

		@media (max-width: 576px) {
			flex: 1;
			padding: 0.5rem;

			.btn-text {
				display: none;
			}
		}
	}

	.comment-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background-color: var(--off-white);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
	}

	.textarea-container {
		position: relative;

		&::after {
			content: attr(data-replicated-value) ' ';
			white-space: pre-wrap;
			visibility: hidden;
		}

		&::after,
		> textarea {
			min-height: 80px;
			padding: 1rem;
			font: inherit;
			font-size: 0.95rem;
			line-height: 1.5;
			grid-area: 1 / 1 / 2 / 2;
		}

		display: grid;
	}

	.comment-textarea {
		resize: none;
		overflow-y: auto;
		border: 1px solid var(--light-gray);
		border-radius: var(--border-radius-sm);
		width: 100%;
		background: white;
		color: var(--darkest-gray);

		&:focus {
			border-color: var(--primary);
			box-shadow: 0 0 0 2px var(--accent-light);
			outline: none;
		}

		&::placeholder {
			color: var(--dark-gray);
			opacity: 0.7;
		}
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;

		@media (max-width: 576px) {
			flex-direction: column;
		}
	}

	.cancel-btn,
	.submit-btn {
		padding: 0.75rem 1.5rem;
		border-radius: var(--base-border-radius);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		@media (max-width: 576px) {
			padding: 0.625rem 1rem;
		}
	}

	.cancel-btn {
		background: transparent;
		border: 1px solid var(--medium-gray);
		color: var(--dark-gray);

		&:hover {
			background: var(--light-gray);
			color: var(--darkest-gray);
		}
	}

	.submit-btn {
		background-color: var(--primary);
		color: var(--text-on-primary);
		border: none;

		&:hover:not(:disabled) {
			background-color: var(--button-hover);
			transform: translateY(-1px);
			box-shadow: var(--shadow-sm);
		}

		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	.loader {
		width: 1.25rem;
		height: 1.25rem;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top: 3px solid white;
		animation: spin 0.8s linear infinite;
	}

	/* QR Modal Styles */
	.qr-modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		text-align: center;
		max-width: 400px;
		margin: 0 auto;

		h2 {
			margin: 0 0 1.5rem 0;
			color: var(--darkest-gray);
			font-weight: 600;
		}

		.qr-container {
			background: white;
			padding: 1.5rem;
			border-radius: var(--base-border-radius);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
			margin-bottom: 1.5rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.qr-large {
			width: 200px;
			height: 200px;

			@media (max-width: 576px) {
				width: 150px;
				height: 150px;
			}
		}

		.qr-help-text {
			color: var(--dark-gray);
			font-size: 0.9rem;
			margin: 0;
			max-width: 250px;
			line-height: 1.5;
		}

		@media (max-width: 576px) {
			padding: 1.5rem;
		}
	}
</style>

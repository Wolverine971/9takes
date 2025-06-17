<!-- lib/components/molecules/Interact.svelte -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { slide } from 'svelte/transition';
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

<div class="my-4 flex flex-col gap-4">
	<div class="flex flex-wrap gap-3 sm:gap-2">
		<button
			title="Comment"
			class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded border-none bg-primary-700 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-primary-800 hover:shadow-sm sm:flex-1 sm:px-2 md:px-4 md:py-2.5"
			on:click={() => (commenting = !commenting)}
			aria-label={commenting ? 'Hide comment box' : 'Write a comment'}
		>
			<MasterCommentIcon
				iconStyle={'padding: 0.25rem;'}
				height={'1.5rem'}
				fill={'currentColor'}
				type={comment?.length ? 'full' : 'empty'}
			/>
			<span class="whitespace-nowrap sm:hidden">Comment</span>
		</button>

		{#if parentType === 'question'}
			<button
				title={subscriptions.some((e) => e.user_id === user?.id) ? 'Unsubscribe' : 'Subscribe'}
				class="flex items-center justify-center gap-2 border border-neutral-200 px-5 py-3 sm:flex-1 sm:px-2 md:px-4 md:py-2.5 {subscriptions.some(
					(e) => e.user_id === user?.id
				)
					? 'border-primary-500 bg-primary-100 text-primary-800'
					: 'bg-neutral-100 text-neutral-600'} cursor-pointer rounded text-sm font-medium transition-all duration-200 hover:bg-neutral-200 hover:text-neutral-900"
				on:click={toggleSubscription}
				aria-label={subscriptions.some((e) => e.user_id === user?.id) ? 'Unsubscribe' : 'Subscribe'}
			>
				<BellIcon iconStyle={'padding: 0.25rem;'} height={'1.5rem'} fill={'currentColor'} />
				<span class="whitespace-nowrap sm:hidden">
					{subscriptions.some((e) => e.user_id === user?.id) ? 'Subscribed' : 'Subscribe'}
				</span>
			</button>

			{#if qrCodeUrl && innerWidth > 576}
				<button
					title="Share via QR Code"
					class="flex cursor-pointer items-center justify-center gap-2 rounded border border-neutral-200 bg-neutral-100 px-5 py-3 text-sm font-medium text-neutral-600 transition-all duration-200 hover:bg-neutral-200 hover:text-neutral-900 md:px-4 md:py-2.5"
					on:click={openQRModal}
					aria-label="Share via QR Code"
				>
					<img
						src={qrCodeUrl}
						alt="9takes QR Code"
						class="h-6 w-6 rounded transition-transform duration-200 hover:scale-110"
					/>
					<span class="whitespace-nowrap">Share</span>
				</button>
			{/if}
		{/if}
	</div>

	{#if commenting}
		<div
			class="flex flex-col gap-4 rounded-lg border border-neutral-300 bg-neutral-50 p-4"
			in:slide={{ duration: 300 }}
		>
			<div
				class="textarea-container"
				data-replicated-value={comment}
				style="--text-height: {textareaHeight};"
			>
				<textarea
					placeholder={parentType === 'question'
						? "What's your perspective on this question? Share your thoughts..."
						: 'Write your reply...'}
					class="w-full resize-none overflow-y-auto rounded-sm border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-600 placeholder:opacity-70 focus:border-primary-700 focus:shadow-[0_0_0_2px_theme(colors.primary.100)] focus:outline-none"
					bind:value={comment}
					id="comment-box"
					rows="3"
					on:input={handleTextareaInput}
					on:keydown={handleKeydown}
				></textarea>
			</div>
			<div class="flex justify-end gap-3 sm:flex-col">
				{#if data?.flags?.userHasAnswered}
					<button
						class="cursor-pointer rounded border border-neutral-400 bg-transparent px-6 py-3 font-semibold text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 sm:px-4 sm:py-2.5"
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
					class="flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-primary-700 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-primary-800 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-2.5"
					type="button"
					on:click={createComment}
					disabled={!comment.trim() || loading}
					id="comment-button"
				>
					{#if loading}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
						/>
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
	<div class="mx-auto flex max-w-sm flex-col items-center p-8 text-center sm:p-6">
		<h2 class="m-0 mb-6 text-xl font-semibold text-neutral-900">Share Question via QR Code</h2>
		<div
			class="mb-6 flex items-center justify-center rounded bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
		>
			<img
				src={qrCodeUrl}
				alt="9takes QR Code"
				class="h-[200px] w-[200px] sm:h-[150px] sm:w-[150px]"
			/>
		</div>
		<p class="m-0 max-w-[250px] text-sm leading-6 text-neutral-600">
			Scan this code with your camera to share this question
		</p>
	</div>
</Modal2>

<style>
	/* Custom textarea auto-grow grid technique - complex layout that doesn't translate well to utilities */
	.textarea-container {
		position: relative;
		display: grid;
	}

	.textarea-container::after {
		content: attr(data-replicated-value) ' ';
		white-space: pre-wrap;
		visibility: hidden;
	}

	.textarea-container::after,
	.textarea-container > textarea {
		min-height: 80px;
		padding: 1rem;
		font: inherit;
		font-size: 0.95rem;
		line-height: 1.5;
		grid-area: 1 / 1 / 2 / 2;
	}
</style>

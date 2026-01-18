<!-- src/lib/components/molecules/Interact.svelte -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';
	import BellIcon from '$lib/components/icons/bellIcon.svelte';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import type {
		User,
		Comment as CommentType,
		CommentLike,
		Subscription,
		QuestionPageData
	} from '$lib/types/questions';
	import { viewportWidth } from '$lib/stores/viewport';

	// Component props
	export let parentType: 'question' | 'comment';
	export let data: QuestionPageData;
	export let user: User | null;
	export let questionId: number;
	export let qrCodeUrl: string;

	const dispatch = createEventDispatcher<{
		commentAdded: CommentType;
	}>();

	// State variables
	let likes: CommentLike[] = [];
	let subscriptions: Subscription[] = [];
	let comment: string = '';
	let commenting: boolean = false;
	let loading: boolean = false;
	let subscriptionLoading: boolean = false;
	let anonymousComment = false;
	let textareaHeight = 'auto';

	// Use shared viewport store
	$: innerWidth = $viewportWidth;

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
			// Dynamically import FingerprintJS to avoid bundling in main chunk
			const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
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
			notifications.success('Comment Added', 3000);
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

		subscriptionLoading = true;

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

			notifications.success(
				operation === 'add' ? 'Subscription Added' : 'Subscription Removed',
				3000
			);

			updateSubscriptions(result?.data, operation);
		} catch (error) {
			console.error('Error toggling subscription:', error);
			notifications.danger('Failed to update subscription', 3000);
		} finally {
			subscriptionLoading = false;
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
		// Parse any escaped newlines in placeholders
		document.querySelectorAll('textarea').forEach((elem) => {
			elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
		});
	});
</script>

<div class="my-4 flex flex-col gap-4">
	<div class="flex flex-wrap gap-3">
		<button
			title="Comment"
			class="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-200 hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98]"
			on:click={() => (commenting = !commenting)}
			aria-label={commenting ? 'Hide comment box' : 'Write a comment'}
		>
			<MasterCommentIcon
				iconStyle={'padding: 0;'}
				height={'1.25rem'}
				fill={'currentColor'}
				type={comment?.length ? 'full' : 'empty'}
			/>
			<span class="whitespace-nowrap">Comment</span>
		</button>

		{#if parentType === 'question'}
			<button
				title={subscriptions.some((e) => e.user_id === user?.id) ? 'Unsubscribe' : 'Subscribe'}
				class="flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 {subscriptions.some(
					(e) => e.user_id === user?.id
				)
					? 'border-purple-500 bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
					: 'border-slate-600 bg-[#1a1a2e] text-slate-300 hover:bg-[#252538]'}"
				on:click={toggleSubscription}
				disabled={subscriptionLoading}
				aria-label={subscriptions.some((e) => e.user_id === user?.id)
					? 'Unsubscribe from this question'
					: 'Subscribe to this question'}
				aria-busy={subscriptionLoading}
			>
				{#if subscriptionLoading}
					<div
						class="border-current/30 h-5 w-5 animate-spin rounded-full border-2 border-t-current"
					></div>
				{:else}
					<BellIcon iconStyle={'padding: 0;'} height={'1.25rem'} fill={'currentColor'} />
				{/if}
				<span class="whitespace-nowrap">
					{subscriptions.some((e) => e.user_id === user?.id) ? 'Subscribed' : 'Subscribe'}
				</span>
			</button>

			{#if qrCodeUrl && innerWidth > 576}
				<button
					title="Share via QR Code"
					class="flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-[#1a1a2e] px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-[#252538] active:scale-[0.98]"
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
		<div class="rounded-lg border border-slate-700/50 bg-[#1a1a2e]" in:slide={{ duration: 300 }}>
			<div class="p-4">
				<div
					class="textarea-container"
					data-replicated-value={comment}
					style="--text-height: {textareaHeight};"
				>
					<textarea
						placeholder={parentType === 'question'
							? "What's your perspective on this question? Share your thoughts..."
							: 'Write your reply...'}
						class="w-full resize-none overflow-y-auto rounded-md border border-slate-600 bg-[#12121a] px-3 py-2 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
						bind:value={comment}
						id="comment-box"
						rows="3"
						on:input={handleTextareaInput}
						on:keydown={handleKeydown}
					></textarea>
				</div>
			</div>
			<div
				class="flex items-center justify-between border-t border-slate-700/50 bg-[#12121a] px-4 py-3"
			>
				<span class="text-xs text-slate-500">
					{#if comment.length > 0}
						{comment.length} characters
					{:else}
						Press Ctrl+Enter to submit
					{/if}
				</span>
				<div class="flex gap-2">
					{#if data?.flags?.userHasAnswered}
						<button
							class="rounded-md border border-slate-600 bg-[#1a1a2e] px-4 py-1.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-[#252538] active:scale-[0.98]"
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
						class="flex items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-1.5 text-sm font-medium text-white shadow-[0_0_10px_rgba(124,58,237,0.3)] transition-all duration-200 hover:bg-purple-700 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
						type="button"
						on:click={createComment}
						disabled={!comment.trim() || loading}
						id="comment-button"
					>
						{#if loading}
							<div
								class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></div>
						{:else}
							{parentType === 'question' ? 'Post Comment' : 'Reply'}
						{/if}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- QR Code Modal -->
<Modal2 id="qr-modal">
	<div class="mx-auto flex max-w-md flex-col items-center p-8 text-center sm:p-6">
		<div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-900/30">
			<svg class="h-7 w-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.684C18.886 16.938 19 17.482 19 18c0 .482-.114.938-.316 1.342m0-2.684a3 3 0 110 2.684M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</div>

		<h2 class="mb-2 text-2xl font-semibold text-slate-100">Share This Question</h2>
		<p class="mb-8 text-sm text-slate-400">Scan the QR code to share with others</p>

		<div
			class="mb-8 rounded-3xl bg-gradient-to-b from-[#252538] to-[#1a1a2e] p-6 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
		>
			<div class="rounded-2xl bg-[#12121a] p-4 shadow-sm">
				<img
					src={qrCodeUrl}
					alt="Share question QR code"
					class="h-[200px] w-[200px] sm:h-[160px] sm:w-[160px]"
				/>
			</div>
		</div>

		<div class="flex items-center gap-2 text-xs text-slate-500">
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
			<span>Share and explore different perspectives</span>
		</div>
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

<!-- src/lib/components/molecules/Interact.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
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
	interface Props {
		parentType: 'question' | 'comment';
		data: QuestionPageData | CommentType;
		user: User | null;
		questionId: number;
		qrCodeUrl: string;
		oncommentAdded?: (comment: CommentType) => void;
	}

	let { parentType, data, user, questionId, qrCodeUrl, oncommentAdded }: Props = $props();

	// State variables
	let likes = $state<CommentLike[]>([]);
	let subscriptions = $state<Subscription[]>([]);
	let comment = $state('');
	let commenting = $state(false);
	let loading = $state(false);
	let subscriptionLoading = $state(false);
	let anonymousComment = $state(false);
	let textareaHeight = $state('auto');
	let shortAnswerNudge = $state(false);
	let confirmShortSubmit = $state(false);

	const SHORT_ANSWER_THRESHOLD = 100;

	const depthPrompts = [
		'What personal experience shaped your view on this?',
		'Can you share a specific example or story?',
		'What would someone who disagrees with you say?',
		'How has your perspective on this changed over time?',
		'What emotion comes up first when you think about this?'
	];

	let currentPromptIndex = $state(Math.floor(Math.random() * 5));

	// Cached fingerprint - loaded once on mount
	let cachedFingerprint = $state<string | null>(null);
	let fingerprintLoading = $state(false);

	// Type guard to check if data is QuestionPageData
	const isQuestionPageData = (d: QuestionPageData | CommentType): d is QuestionPageData => {
		return 'question' in d && d.question !== undefined;
	};

	// Use shared viewport store
	let innerWidth = $derived($viewportWidth);

	// Derived flag for whether user has answered (only relevant for QuestionPageData)
	let userHasAnswered = $derived(
		isQuestionPageData(data) ? data?.flags?.userHasAnswered || false : false
	);

	// Update likes and subscription state from data
	$effect(() => {
		likes = isQuestionPageData(data) ? [] : (data as CommentType)?.comment_like || [];
		subscriptions = isQuestionPageData(data) ? data?.question?.subscriptions || [] : [];

		// Auto-show comment box for first-time answerers
		if (isQuestionPageData(data) && !data?.flags?.userHasAnswered && parentType === 'question') {
			commenting = true;
		}
	});

	// Handle QR code modal opening
	const openQRModal = () => {
		getModal('qr-modal').open();
	};

	// Preload fingerprint in background (called on mount)
	const preloadFingerprint = async () => {
		if (cachedFingerprint || fingerprintLoading) return;
		fingerprintLoading = true;
		try {
			const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
			const fp = await FingerprintJS.load();
			const fpval = await fp.get();
			cachedFingerprint = fpval?.visitorId?.toString() || null;
		} catch (error) {
			console.error('Fingerprint preload failed:', error);
		} finally {
			fingerprintLoading = false;
		}
	};

	// Ensure fingerprint is available, waiting for preload if in progress
	const ensureFingerprint = async (): Promise<string | null> => {
		if (cachedFingerprint) return cachedFingerprint;

		// If preload is in progress, wait for it to complete
		if (fingerprintLoading) {
			await new Promise<void>((resolve) => {
				const checkInterval = setInterval(() => {
					if (!fingerprintLoading) {
						clearInterval(checkInterval);
						resolve();
					}
				}, 50);
				// Timeout after 3 seconds
				setTimeout(() => {
					clearInterval(checkInterval);
					resolve();
				}, 3000);
			});
			if (cachedFingerprint) return cachedFingerprint;
		}

		// Fallback: load fingerprint inline
		try {
			const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
			const fp = await FingerprintJS.load();
			const fpval = await fp.get();
			const fingerprint = fpval?.visitorId?.toString() || null;
			cachedFingerprint = fingerprint;
			return fingerprint;
		} catch (error) {
			console.error('Fingerprint load failed:', error);
			return null;
		}
	};

	// Create a new comment
	const createComment = async () => {
		if (!canComment()) return;
		if (!comment.trim()) {
			notifications.info('Comment cannot be empty', 3000);
			return;
		}

		// Nudge for short answers on questions (not replies)
		if (
			parentType === 'question' &&
			comment.trim().length < SHORT_ANSWER_THRESHOLD &&
			!confirmShortSubmit
		) {
			shortAnswerNudge = true;
			confirmShortSubmit = true;
			return;
		}

		shortAnswerNudge = false;
		confirmShortSubmit = false;
		loading = true;

		try {
			const fingerprint = await ensureFingerprint();

			const body = new FormData();
			appendCommonFormData(body, { visitorId: fingerprint });

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
		const flags = isQuestionPageData(data) ? data.flags : null;
		if (!flags?.userSignedIn && !user?.id) {
			if (flags?.userHasAnswered || anonymousComment) {
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

		// Get parent_id and es_id based on parent type
		let parentId: number;
		let esId: string;
		if (parentType === 'comment' && !isQuestionPageData(data)) {
			parentId = data.id;
			esId = data.es_id ?? '';
		} else if (isQuestionPageData(data)) {
			parentId = data.question.id;
			esId = data.question.es_id ?? '';
		} else {
			// Fallback - should not happen with proper typing
			parentId = questionId;
			esId = '';
		}

		body.append('parent_id', parentId.toString());
		body.append('author_id', user?.id ?? '');
		body.append('parent_type', parentType);
		body.append('es_id', esId);
		body.append('question_id', questionId.toString());
		body.append('fingerprint', fpval?.visitorId?.toString() ?? '');
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
		if (result.error || result.type === 'error' || result.type === 'failure') {
			notifications.danger('Error adding comment', 3000);
			console.error(result.error || result.data);
		} else {
			notifications.success('Comment Added', 3000);
			// Normalize result: RPC might return array, single object, or null
			let commentData = result?.data;
			if (Array.isArray(commentData)) {
				commentData = commentData[0] ?? null;
			}
			oncommentAdded?.(commentData);
			comment = '';
			textareaHeight = 'auto';
			shortAnswerNudge = false;
			confirmShortSubmit = false;

			// Hide comment box after submitting for non-first-time users
			if (userHasAnswered) {
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
			// Only allow subscriptions on questions (QuestionPageData)
			if (!isQuestionPageData(data)) {
				notifications.danger('Cannot subscribe to comments', 3000);
				return;
			}

			const body = new FormData();
			body.append('parent_id', data.question.id.toString());
			body.append('user_id', user.id);
			body.append('es_id', data.question.es_id ?? '');
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
			subscriptions = subscriptions.filter((c) => c.user_id !== user?.id);
		}
	};

	// Handle textarea auto-growth
	const handleTextareaInput = (e: Event) => {
		const target = e.target as HTMLTextAreaElement;

		// Reset nudge when user keeps typing
		if (shortAnswerNudge && target.value.trim().length >= SHORT_ANSWER_THRESHOLD) {
			shortAnswerNudge = false;
			confirmShortSubmit = false;
		}

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

		// Preload fingerprint in background so it's ready when user submits
		preloadFingerprint();
	});
</script>

<div class="my-4 flex flex-col gap-4">
	<div class="flex gap-2 sm:gap-3">
		<button
			title="Comment"
			class="flex items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-200 hover:bg-purple-700 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98] sm:gap-2 sm:px-5 sm:py-2.5"
			onclick={() => (commenting = !commenting)}
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
				class="flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-5 sm:py-2.5 {subscriptions.some(
					(e) => e.user_id === user?.id
				)
					? 'border-purple-500 bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
					: 'border-slate-600/40 bg-[#1a1a2e]/60 text-slate-300 backdrop-blur-sm hover:bg-[#252538]/80'}"
				onclick={toggleSubscription}
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

			{#if qrCodeUrl}
				<button
					title="Share via QR Code"
					class="flex items-center justify-center gap-1.5 rounded-lg border border-slate-600/40 bg-[#1a1a2e]/60 px-3 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-200 hover:bg-[#252538]/80 active:scale-[0.98] sm:gap-2 sm:px-5 sm:py-2.5"
					onclick={openQRModal}
					aria-label="Share via QR Code"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
						/>
					</svg>
					<span class="whitespace-nowrap">Share</span>
				</button>
			{/if}
		{/if}
	</div>

	{#if commenting}
		<div
			class="rounded-xl border border-purple-500/15 bg-[#1a1a2e]/60 backdrop-blur-sm"
			in:slide={{ duration: 300 }}
		>
			<div class="p-4">
				{#if parentType === 'question' && comment.length === 0}
					<p class="mb-2 text-xs text-purple-400/70">
						<span class="font-medium text-purple-400">Dig deeper:</span>
						{depthPrompts[currentPromptIndex]}
					</p>
				{/if}
				<div
					class="textarea-container"
					data-replicated-value={comment}
					style="--text-height: {textareaHeight};"
				>
					<textarea
						placeholder={parentType === 'question'
							? "Go beyond the surface — share a real experience, a specific example, or explain the 'why' behind your take...\n\nThe most interesting answers are the honest, detailed ones."
							: 'Write your reply...'}
						class="w-full resize-none overflow-y-auto rounded-md border border-slate-600/40 bg-[#12121a]/80 px-3 py-2 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
						bind:value={comment}
						id="comment-box"
						rows="4"
						oninput={handleTextareaInput}
						onkeydown={handleKeydown}
					></textarea>
				</div>
				{#if shortAnswerNudge}
					<div
						class="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2"
						in:slide={{ duration: 200 }}
					>
						<span class="mt-0.5 text-amber-400">&#9997;</span>
						<p class="text-xs leading-relaxed text-amber-300/90">
							<span class="font-medium">Your take could go deeper.</span> Try adding a personal
							story, a specific example, or what shaped your perspective. You can still
							<button
								class="inline font-medium text-amber-200 underline underline-offset-2 hover:text-amber-100"
								type="button"
								onclick={createComment}
							>
								post as-is
							</button>.
						</p>
					</div>
				{/if}
			</div>
			<div
				class="flex items-center justify-between rounded-b-xl border-t border-purple-500/10 bg-[#12121a]/80 px-4 py-3"
			>
				<span class="text-xs text-slate-500">
					{#if parentType === 'question' && comment.length > 0 && comment.length < SHORT_ANSWER_THRESHOLD}
						<span class="text-amber-500/80"
							>{comment.length} chars — keep going, add some detail</span
						>
					{:else if comment.length > 0}
						{comment.length} characters
					{:else}
						Press Ctrl+Enter to submit
					{/if}
				</span>
				<div class="flex gap-2">
					{#if userHasAnswered}
						<button
							class="rounded-md border border-slate-600/40 bg-[#1a1a2e]/60 px-4 py-1.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-[#252538]/80 active:scale-[0.98]"
							type="button"
							onclick={() => {
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
						onclick={createComment}
						disabled={!comment.trim() || loading}
						id="comment-button"
					>
						{#if loading}
							<div
								class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></div>
						{:else if confirmShortSubmit}
							Post Anyway
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
	<div class="mx-auto flex max-w-sm flex-col items-center py-2 text-center">
		<h2 class="mb-1 text-xl font-semibold text-slate-100">Share This Question</h2>
		<p class="mb-5 text-sm text-slate-400">Scan the QR code to share with others</p>

		<div class="mb-5 rounded-2xl border border-purple-500/20 bg-[#12121a] p-4">
			<img src={qrCodeUrl} alt="Share question QR code" class="h-[180px] w-[180px]" />
		</div>

		<p class="text-xs text-slate-500">Share and explore different perspectives</p>
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

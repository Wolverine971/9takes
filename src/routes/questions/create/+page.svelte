<!-- src/routes/questions/create/+page.svelte -->
<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import { Button } from '$lib/components/atoms';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import QuestionSocialCardTemplate from '$lib/components/questions/QuestionSocialCardTemplate.svelte';
	import {
		QUESTION_SOCIAL_CARD_HEIGHT,
		QUESTION_SOCIAL_CARD_VARIANT,
		QUESTION_SOCIAL_CARD_WIDTH
	} from '$lib/socialCards/questionSocialCard';

	let { data }: { data: PageData } = $props();

	let question = $state('');
	let context = $state('');
	let url = $state('');
	let questionError = $state('');
	let preparing = $state(false);
	let loading = $state(false);
	let createdQuestionPath = $state<string | null>(null);
	let loadingStatus = $state<HTMLDivElement | null>(null);
	// Social-card preview scales from its measured width (card art is 1200×630).
	// Fixed 320px tiers clipped inside the modal at ≤390px (2026-06-11 audit).
	let previewWidth = $state(0);
	type CreateProgressStage = 'saving' | 'generatingImage' | 'redirecting';
	const CREATE_PROGRESS_STEPS: Array<{ stage: CreateProgressStage; label: string }> = [
		{ stage: 'saving', label: 'Save question' },
		{ stage: 'generatingImage', label: 'Prepare card' },
		{ stage: 'redirecting', label: 'Open discussion' }
	];
	let createProgressStage = $state<CreateProgressStage>('saving');
	let createProgressIndex = $derived(
		CREATE_PROGRESS_STEPS.findIndex((step) => step.stage === createProgressStage)
	);
	let createProgressTitle = $derived.by(() => {
		if (createProgressStage === 'saving') return 'Saving your question';
		if (createProgressStage === 'generatingImage') return 'Question saved';
		return 'Question created';
	});
	let createProgressMessage = $derived.by(() => {
		if (createProgressStage === 'saving') {
			return 'Securing your question and preparing its discussion page.';
		}
		if (createProgressStage === 'generatingImage') {
			return 'Finishing the share card before we open the discussion.';
		}
		return 'Opening your new discussion now.';
	});
	let html2canvasModule = $state<
		((element: HTMLElement, options?: object) => Promise<HTMLCanvasElement>) | null
	>(null);
	let fontLoaded = $state(false);
	let resizeDebounceTimer: ReturnType<typeof setTimeout>;
	let questionPublicUrl = $derived(
		url ? `https://9takes.com/questions/${url}` : 'https://9takes.com/questions'
	);

	const MIN_CHAR_COUNT = 10;
	const MAX_CHAR_COUNT = 280;
	const MAX_CONTEXT_CHAR_COUNT = 2000;
	const IMAGE_GENERATION_TIMEOUT_MS = 10000;
	const IMAGE_UPLOAD_TIMEOUT_MS = 7000;
	const SOCIAL_CARD_CAPTURE_ID = 'question-social-card-capture';
	let normalizedQuestion = $derived(question.trim().replace(/\s+/g, ' '));
	let isQuestionValid = $derived(
		normalizedQuestion.length >= MIN_CHAR_COUNT && normalizedQuestion.length <= MAX_CHAR_COUNT
	);
	let questionCharCount = $derived(question.length);
	let questionLengthInvalid = $derived(questionCharCount > 0 && !isQuestionValid);
	let contextCharCount = $derived(context.length);

	onMount(() => {
		question = $page.url.searchParams.get('question') || '';

		// Wait for fonts to load
		document.fonts.ready.then(() => {
			fontLoaded = true;
		});

		return () => {
			// Cleanup
			if (resizeDebounceTimer) clearTimeout(resizeDebounceTimer);
		};
	});

	async function getUrl() {
		if (createdQuestionPath) {
			preparing = true;
			questionError = '';
			try {
				await goto(createdQuestionPath);
			} catch (error) {
				console.error('Error opening created question:', error);
				questionError = 'Your question is ready, but it could not be opened yet.';
				notifications.warning('Your question was created, but it could not be opened yet.', 5000);
			} finally {
				preparing = false;
			}
			return;
		}

		if (preparing || loading) return;

		if (!isQuestionValid) {
			questionError = normalizedQuestion
				? `Question must be between ${MIN_CHAR_COUNT} and ${MAX_CHAR_COUNT} characters.`
				: 'Enter a question before continuing.';
			notifications.warning(
				`Please enter a valid question (${MIN_CHAR_COUNT}-${MAX_CHAR_COUNT} characters)`,
				3000
			);
			return;
		}

		const body = new FormData();
		body.append('question', normalizedQuestion);
		preparing = true;

		try {
			const response = await fetch('?/getUrl', { method: 'POST', body });
			const result = deserialize(await response.text());

			if (result.type !== 'success') {
				throw new Error(getActionErrorMessage(result, 'Failed to prepare question'));
			}

			const generatedUrl =
				result.data && typeof result.data === 'object'
					? (result.data as Record<string, unknown>).url
					: null;
			if (typeof generatedUrl !== 'string' || !generatedUrl) {
				throw new Error('No URL generated');
			}

			url = generatedUrl;
			questionError = '';
			createProgressStage = 'saving';
			getModal('question-create')?.open();
		} catch (error) {
			console.error('Error generating URL:', error);
			const message = error instanceof Error ? error.message : 'Failed to prepare question';
			questionError = message;
			notifications.danger(message, 5000);
		} finally {
			preparing = false;
		}
	}

	function getActionErrorMessage(result: unknown, fallback: string): string {
		const resultRecord =
			result && typeof result === 'object' ? (result as Record<string, unknown>) : {};

		for (const value of [resultRecord.data, resultRecord.error]) {
			if (typeof value === 'string' && value) return value;
			if (value && typeof value === 'object') {
				const record = value as Record<string, unknown>;
				if (typeof record.error === 'string' && record.error) return record.error;
				if (typeof record.message === 'string' && record.message) return record.message;
			}
		}

		return fallback;
	}

	async function waitForImagesToLoad(element: HTMLElement): Promise<void> {
		const images = Array.from(element.querySelectorAll('img')).filter((img) => !img.complete);
		if (!images.length) return;

		await Promise.all(
			images.map(
				(image) =>
					new Promise<void>((resolve) => {
						image.addEventListener('load', () => resolve(), { once: true });
						image.addEventListener('error', () => resolve(), { once: true });
					})
			)
		);
	}

	async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
		let timeoutRef: ReturnType<typeof setTimeout> | undefined;
		const timeoutPromise = new Promise<never>((_, reject) => {
			timeoutRef = setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
		});

		try {
			return await Promise.race([promise, timeoutPromise]);
		} finally {
			if (timeoutRef) clearTimeout(timeoutRef);
		}
	}

	async function generateQuestionImage(elementId: string): Promise<string> {
		// Dynamically import html2canvas when needed
		if (!html2canvasModule) {
			const module = await import('html2canvas');
			html2canvasModule = module.default;
		}

		const questionNode = document.getElementById(elementId);
		if (!questionNode) {
			throw new Error('Question element not found');
		}

		// Wait for fonts to load
		if (!fontLoaded) {
			await document.fonts.ready;
		}
		await waitForImagesToLoad(questionNode);

		const canvas = await html2canvasModule!(questionNode, {
			useCORS: true,
			allowTaint: true,
			backgroundColor: '#0a0807',
			scale: 1,
			logging: false,
			width: QUESTION_SOCIAL_CARD_WIDTH,
			height: QUESTION_SOCIAL_CARD_HEIGHT,
			windowWidth: QUESTION_SOCIAL_CARD_WIDTH,
			windowHeight: QUESTION_SOCIAL_CARD_HEIGHT
		});

		return canvas.toDataURL('image/png');
	}

	async function createQuestion() {
		let navigationCompleted = false;

		try {
			if (loading) return;
			if (createdQuestionPath) {
				await goto(createdQuestionPath);
				return;
			}
			loading = true;
			createProgressStage = 'saving';
			await tick();
			loadingStatus?.focus({ preventScroll: true });

			if (!data?.session?.user?.id) {
				notifications.info('Please login to create a question', 3000);
				getModal('question-create')?.close();
				return;
			}

			const body = new FormData();
			body.append('question', normalizedQuestion);
			body.append('context', context.trim());
			body.append('url', url);

			const resp = await fetch('?/createQuestion', { method: 'POST', body });
			const result = deserialize(await resp.text());

			if (result.type !== 'success') {
				throw new Error(getActionErrorMessage(result, 'Failed to create question'));
			}

			const responseData = result.data;
			const createdQuestion = Array.isArray(responseData) ? responseData[0] : responseData;
			const questionId =
				createdQuestion && typeof createdQuestion === 'object'
					? (createdQuestion as Record<string, unknown>).id
					: null;
			const createdUrl =
				createdQuestion && typeof createdQuestion === 'object'
					? (createdQuestion as Record<string, unknown>).url
					: null;

			if ((typeof questionId !== 'number' && typeof questionId !== 'string') || !createdUrl) {
				throw new Error('Question creation returned an incomplete response');
			}
			if (typeof createdUrl !== 'string') {
				throw new Error('Question creation returned an invalid URL');
			}

			url = createdUrl;
			createdQuestionPath = `/questions/${encodeURIComponent(createdUrl)}`;

			try {
				createProgressStage = 'generatingImage';
				// Let the social card render the final collision-safe URL before capture.
				await tick();
				const png = await withTimeout(
					generateQuestionImage(SOCIAL_CARD_CAPTURE_ID),
					IMAGE_GENERATION_TIMEOUT_MS
				);
				// Check image size (rough estimate: base64 is ~1.37x larger than binary)
				const estimatedSize = png.length * 0.75;
				if (estimatedSize > 10 * 1024 * 1024) {
					throw new Error('Generated image is too large. Please try a shorter question.');
				}

				const uploadBody = new FormData();
				uploadBody.append('questionId', questionId.toString());
				uploadBody.append('url', createdUrl);
				uploadBody.append('img_url', png);
				uploadBody.append('variant', QUESTION_SOCIAL_CARD_VARIANT);

				await withTimeout(
					fetch('/api/questions/upload-image', { method: 'POST', body: uploadBody }).then(
						async (uploadResp) => {
							if (!uploadResp.ok) {
								const uploadError = await uploadResp.text();
								throw new Error(uploadError || 'Image upload failed');
							}
						}
					),
					IMAGE_UPLOAD_TIMEOUT_MS
				);
			} catch (error) {
				console.error('Error generating or uploading image:', error);
			}

			createProgressStage = 'redirecting';
			await tick();
			await goto(createdQuestionPath);
			navigationCompleted = true;
			notifications.success('Question created successfully!', 3000);
		} catch (error) {
			console.error('Error creating question:', error);
			if (createdQuestionPath) {
				getModal('question-create')?.close();
				questionError = 'Your question was created, but it could not be opened automatically.';
				notifications.warning(
					'Your question was created, but it could not be opened automatically. Use “View Your Question” to try again.',
					7000
				);
				return;
			}
			const message = error instanceof Error ? error.message : 'Failed to create question';
			notifications.danger(message, 5000);
			createProgressStage = 'saving';
		} finally {
			if (!navigationCompleted) loading = false;
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		if (target.name === 'question') questionError = '';

		// Debounce resize for performance
		if (resizeDebounceTimer) clearTimeout(resizeDebounceTimer);
		resizeDebounceTimer = setTimeout(() => {
			target.style.height = 'auto';
			target.style.height = target.scrollHeight + 'px';
		}, 10);
	}
</script>

<div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-0" in:fade={{ duration: 300 }}>
	<h1
		class="text-center text-3xl font-semibold text-[var(--lamp-glow)] sm:text-4xl"
		in:fly={{ y: -20, duration: 300, delay: 150 }}
	>
		Spark a Conversation
	</h1>
	<p
		class="mt-2 text-center text-base text-[var(--ink-mid)] sm:text-lg"
		in:fly={{ y: -20, duration: 300, delay: 200 }}
	>
		Your question could lead to fascinating insights. What would you like to explore today?
	</p>
	<div
		class="mt-6 rounded-xl border border-[var(--stone-warm)] bg-[var(--stone-warm)] p-lg shadow-[var(--shadow-md)] transition hover:border-[var(--lamp-soft)] hover:shadow-[var(--glow-sm)] sm:p-8"
		in:fly={{ y: 20, duration: 300, delay: 300 }}
	>
		<label
			for="question-input"
			class="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink-mid)]"
		>
			Your question
		</label>
		<p id="question-help" class="mb-3 text-sm text-[var(--ink-mid)]">
			Ask one clear, open-ended question that invites people to share their perspective.
		</p>
		<textarea
			id="question-input"
			rows="4"
			name="question"
			placeholder="What's on your mind? Ask a thought-provoking question that invites diverse perspectives..."
			class="font-body w-full rounded-md border-2 border-[var(--stone-warm)] bg-[var(--stone-warm)] p-4 text-lg text-[var(--ink-bright)] placeholder-[var(--ink-dim)] shadow-sm transition focus:border-[var(--lamp-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--lamp-soft)]"
			bind:value={question}
			oninput={handleInput}
			disabled={preparing}
			maxlength={MAX_CHAR_COUNT}
			aria-invalid={questionError || questionLengthInvalid ? 'true' : 'false'}
			aria-describedby={`question-help question-count${questionError ? ' question-error' : ''}`}
		></textarea>
		<div
			id="question-count"
			class={`text-right text-sm ${questionCharCount > MAX_CHAR_COUNT || (questionCharCount > 0 && questionCharCount < MIN_CHAR_COUNT) ? 'text-[var(--error-text)]' : 'text-[var(--ink-dim)]'}`}
		>
			{questionCharCount}/{MAX_CHAR_COUNT} characters
			{#if questionCharCount > 0 && questionCharCount < MIN_CHAR_COUNT}
				<span class="ml-2">(min {MIN_CHAR_COUNT})</span>
			{/if}
		</div>
		{#if questionError}
			<p id="question-error" class="mt-2 text-sm font-medium text-[var(--error-text)]" role="alert">
				{questionError}
			</p>
		{/if}
		<div class="mt-5">
			<label
				for="question-context"
				class="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink-mid)]"
			>
				Optional context
			</label>
			<p class="mb-3 text-sm text-[var(--ink-mid)]">
				Add a little backstory if it will help people understand the situation behind your question.
			</p>
			<textarea
				id="question-context"
				rows="3"
				name="context"
				placeholder="Optional: share the situation, what prompted the question, or any relevant background..."
				class="w-full rounded-md border border-[var(--stone-warm)] bg-[var(--stone-warm)] p-4 text-base text-[var(--ink-bright)] placeholder-[var(--ink-dim)] shadow-sm transition focus:border-[var(--lamp-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--lamp-soft)]"
				bind:value={context}
				oninput={handleInput}
				disabled={preparing}
				maxlength={MAX_CONTEXT_CHAR_COUNT}></textarea>
			<div class="mt-2 text-right text-sm text-[var(--ink-dim)]">
				{contextCharCount}/{MAX_CONTEXT_CHAR_COUNT} characters
			</div>
		</div>
		<Button
			class="mt-5"
			fullWidth
			size="lg"
			disabled={!isQuestionValid}
			loading={preparing}
			onclick={getUrl}
			type="button"
		>
			{createdQuestionPath ? 'View Your Question' : 'Launch Your Question'}
		</Button>
	</div>
	<p
		class="mt-6 text-center text-base italic text-[var(--ink-mid)]"
		in:fly={{ y: 20, duration: 300, delay: 400 }}
	>
		Great questions lead to great conversations. Your unique perspective matters!
	</p>
</div>

<Modal id="question-create" name="Create question" navTop={loading} disableClose={loading}>
	<div
		class="relative w-full max-w-2xl rounded-xl border border-[var(--stone-warm)] bg-[var(--night-deep)] p-6 text-[var(--ink-bright)] shadow-[var(--shadow-lg)] sm:p-8"
		in:fade={{ duration: 300 }}
		aria-busy={loading}
	>
		{#if loading}
			<div
				class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-[var(--night-deep)] px-6 text-center"
				in:fade={{ duration: 150 }}
				bind:this={loadingStatus}
				role="status"
				aria-live="polite"
				aria-atomic="true"
				tabindex="-1"
			>
				{#if createProgressStage === 'redirecting'}
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--lamp-soft)] bg-[var(--lamp-soft)] text-[var(--lamp-glow)]"
						aria-hidden="true"
					>
						<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor">
							<path
								d="m5 12 4 4L19 6"
								stroke-width="2.25"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
						</svg>
					</div>
				{:else}
					<div class="creation-spinner" aria-hidden="true"></div>
				{/if}
				<h3 class="mt-5 text-xl font-semibold text-[var(--lamp-glow)]">
					{createProgressTitle}
				</h3>
				<p class="mt-2 max-w-sm text-sm text-[var(--ink-mid)]">{createProgressMessage}</p>

				<ol class="mt-6 grid w-full max-w-md grid-cols-3 gap-2" aria-label="Creation progress">
					{#each CREATE_PROGRESS_STEPS as step, index}
						<li
							class={`flex flex-col items-center gap-2 text-xs font-medium ${index <= createProgressIndex ? 'text-[var(--ink-bright)]' : 'text-[var(--ink-dim)]'}`}
							aria-current={index === createProgressIndex ? 'step' : undefined}
						>
							<span
								class={`flex h-6 w-6 items-center justify-center rounded-full border ${index <= createProgressIndex ? 'border-[var(--lamp-glow)]' : 'border-[var(--stone-edge)]'} ${index < createProgressIndex ? 'bg-[var(--lamp-glow)] text-[var(--text-on-primary)]' : ''}`}
								aria-hidden="true"
							>
								{#if index < createProgressIndex}
									<svg viewBox="0 0 16 16" class="h-3.5 w-3.5" fill="none" stroke="currentColor">
										<path
											d="m3 8 3 3 7-7"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										></path>
									</svg>
								{:else if index === createProgressIndex}
									<span class="h-2 w-2 rounded-full bg-[var(--lamp-glow)]"></span>
								{/if}
							</span>
							<span>{step.label}</span>
						</li>
					{/each}
				</ol>
			</div>
		{/if}

		<div
			class={loading ? 'pointer-events-none select-none opacity-0' : ''}
			inert={loading}
			aria-hidden={loading ? 'true' : undefined}
		>
			<h2 class="mt-0 text-2xl font-semibold text-[var(--lamp-glow)]">Create Question</h2>

			<div class="mt-4 rounded-xl border border-[var(--lamp-soft)] bg-[var(--stone-warm)] p-4">
				<div
					class="mx-auto w-full max-w-[480px] overflow-hidden rounded-xl"
					bind:clientWidth={previewWidth}
					style="height: {previewWidth ? Math.round((previewWidth * 630) / 1200) : 168}px"
				>
					<div
						class="origin-top-left"
						style="transform: scale({previewWidth ? previewWidth / 1200 : 0.2667})"
					>
						<QuestionSocialCardTemplate questionText={question} questionUrl={questionPublicUrl} />
					</div>
				</div>
			</div>
			<button
				class="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[var(--lamp-glow)] px-5 py-3 text-base font-semibold text-[var(--text-on-primary)] transition-colors hover:bg-[var(--lamp-glow)] disabled:cursor-not-allowed disabled:opacity-70"
				onclick={createQuestion}
				disabled={loading}
			>
				Yes, create question
				<RightIcon iconStyle="margin-left: .5rem;" height="1.5rem" fill="#ffffff" />
			</button>
		</div>
	</div>
</Modal>

<div class="pointer-events-none fixed -left-[200vw] top-0" aria-hidden="true">
	<QuestionSocialCardTemplate
		id={SOCIAL_CARD_CAPTURE_ID}
		questionText={question}
		questionUrl={questionPublicUrl}
	/>
</div>

<style>
	.creation-spinner {
		width: 3rem;
		height: 3rem;
		border: 3px solid var(--lamp-soft);
		border-top-color: var(--lamp-glow);
		border-radius: 9999px;
		animation: creation-spin 0.8s linear infinite;
		box-shadow: var(--glow-sm);
	}

	@keyframes creation-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.creation-spinner {
			animation: none;
		}
	}
</style>

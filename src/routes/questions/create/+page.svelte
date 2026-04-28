<!-- src/routes/questions/create/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
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
	let loading = $state(false);
	type CreateProgressStage = 'saving' | 'generatingImage' | 'redirecting';
	let createProgressStage = $state<CreateProgressStage>('saving');
	let createProgressMessage = $derived.by(() => {
		if (createProgressStage === 'saving') return 'Saving your question...';
		if (createProgressStage === 'generatingImage') return 'Preparing your question card...';
		return 'Question created. Taking you there now...';
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
	const IMAGE_UPLOAD_TIMEOUT_MS = 7000;
	const SOCIAL_CARD_CAPTURE_ID = 'question-social-card-capture';
	let isQuestionValid = $derived(
		question.trim().length >= MIN_CHAR_COUNT && question.length <= MAX_CHAR_COUNT
	);
	let questionCharCount = $derived(question.length);
	let contextCharCount = $derived(context.length);

	onMount(() => {
		question = $page.url.searchParams.get('question') || '';

		// Check if font is already loaded
		if (!document.querySelector('link[href*="Noticia+Text"]')) {
			const link = document.createElement('link');
			link.href =
				'https://fonts.googleapis.com/css2?family=Noticia+Text:ital,wght@0,400;0,700;1,400;1,700&display=swap';
			link.rel = 'stylesheet';
			document.head.appendChild(link);
		}

		// Wait for font to load
		document.fonts.ready.then(() => {
			fontLoaded = true;
		});

		return () => {
			// Cleanup
			if (resizeDebounceTimer) clearTimeout(resizeDebounceTimer);
		};
	});

	async function getUrl() {
		if (!isQuestionValid) {
			notifications.warning(
				`Please enter a valid question (${MIN_CHAR_COUNT}-${MAX_CHAR_COUNT} characters)`,
				3000
			);
			return;
		}

		const sanitizedQuestion = question
			.trim()
			.replace(/[^\w\s]|_/g, '')
			.replace(/\s+/g, ' ');

		// Check if sanitized question still meets minimum length
		if (sanitizedQuestion.length < MIN_CHAR_COUNT) {
			notifications.warning(
				`Question must have at least ${MIN_CHAR_COUNT} letters/numbers after removing special characters`,
				3000
			);
			return;
		}

		const body = new FormData();
		body.append('question', sanitizedQuestion);

		try {
			const response = await fetch('?/getUrl', { method: 'POST', body });

			if (!response.ok) {
				const error = await response.text();
				throw new Error(error || 'Failed to generate URL');
			}

			const data = await response.json();
			url = JSON.parse(data?.data)?.[0];
			createProgressStage = 'saving';
			loading = false;

			if (!url) {
				throw new Error('No URL generated');
			}

			getModal('question-create').open();
		} catch (error) {
			console.error('Error generating URL:', error);
			const message = error instanceof Error ? error.message : 'Failed to prepare question';
			notifications.danger(message, 5000);
		}
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
			backgroundColor: '#10111f',
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
		try {
			if (loading) return;
			loading = true;
			createProgressStage = 'saving';

			if (!data?.session?.user?.id) {
				notifications.info('Please login to create a question', 3000);
				getModal('question-create').close();
				return;
			}

			const body = new FormData();
			body.append(
				'question',
				question
					.trim()
					.replace(/[^\w\s]|_/g, '')
					.replace(/\s+/g, ' ')
			);
			body.append('author_id', data.session.user.id.toString());
			body.append('context', context.trim());
			body.append('url', url);

			const resp = await fetch('?/createQuestion', { method: 'POST', body });
			const result = deserialize(await resp.text());

			if (result && typeof result === 'object') {
				if ('error' in result) {
					const error = (result as any).error;
					throw new Error(error?.message || 'Failed to create question');
				}
				if ('type' in result && (result as any).type === 'failure') {
					throw new Error((result as any).data?.error || 'Failed to create question');
				}
			}

			const responseData = (result as any)?.data;
			const questionId = Array.isArray(responseData) ? responseData?.[0]?.id : responseData?.id;

			if (questionId) {
				try {
					createProgressStage = 'generatingImage';
					const png = await generateQuestionImage(SOCIAL_CARD_CAPTURE_ID);
					// Check image size (rough estimate: base64 is ~1.37x larger than binary)
					const estimatedSize = png.length * 0.75;
					if (estimatedSize > 10 * 1024 * 1024) {
						throw new Error('Generated image is too large. Please try a shorter question.');
					}

					const uploadBody = new FormData();
					uploadBody.append('questionId', questionId.toString());
					uploadBody.append('url', url);
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
			}

			createProgressStage = 'redirecting';
			notifications.success('Question created successfully!', 3000);
			const questionCreateModal = getModal('question-create');
			await goto(`/questions/${url}`);
			questionCreateModal?.close();
		} catch (error) {
			console.error('Error creating question:', error);
			const message = error instanceof Error ? error.message : 'Failed to create question';
			notifications.danger(message, 5000);
			createProgressStage = 'saving';
		} finally {
			loading = false;
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;

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
		class="text-center text-3xl font-semibold text-[var(--primary)] sm:text-4xl"
		in:fly={{ y: -20, duration: 300, delay: 150 }}
	>
		Spark a Conversation
	</h1>
	<p
		class="mt-2 text-center text-base text-[var(--text-secondary)] sm:text-lg"
		in:fly={{ y: -20, duration: 300, delay: 200 }}
	>
		Your question could lead to fascinating insights. What would you like to explore today?
	</p>
	<div
		class="mt-6 rounded-xl border border-[var(--bg-elevated)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-md)] transition hover:border-[var(--primary-subtle)] hover:shadow-[var(--glow-sm)] sm:p-8"
		in:fly={{ y: 20, duration: 300, delay: 300 }}
	>
		<textarea
			rows="4"
			name="question"
			placeholder="What's on your mind? Ask a thought-provoking question that invites diverse perspectives..."
			class="noticia-text-regular w-full rounded-md border-2 border-[var(--bg-elevated)] bg-[var(--bg-elevated)] p-4 text-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-subtle)]"
			bind:value={question}
			oninput={handleInput}
			maxlength={MAX_CHAR_COUNT}
		></textarea>
		<div
			class={`text-right text-sm ${questionCharCount > MAX_CHAR_COUNT || (questionCharCount > 0 && questionCharCount < MIN_CHAR_COUNT) ? 'text-red-400' : 'text-[var(--text-muted)]'}`}
		>
			{questionCharCount}/{MAX_CHAR_COUNT} characters
			{#if questionCharCount > 0 && questionCharCount < MIN_CHAR_COUNT}
				<span class="ml-2">(min {MIN_CHAR_COUNT})</span>
			{/if}
		</div>
		<div class="mt-5">
			<label
				for="question-context"
				class="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]"
			>
				Optional context
			</label>
			<p class="mb-3 text-sm text-[var(--text-secondary)]">
				Add a little backstory if it will help people understand the situation behind your question.
			</p>
			<textarea
				id="question-context"
				rows="3"
				name="context"
				placeholder="Optional: share the situation, what prompted the question, or any relevant background..."
				class="w-full rounded-md border border-[var(--bg-elevated)] bg-[var(--bg-elevated)] p-4 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-sm transition focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-subtle)]"
				bind:value={context}
				oninput={handleInput}
				maxlength={MAX_CONTEXT_CHAR_COUNT}
			></textarea>
			<div class="mt-2 text-right text-sm text-[var(--text-muted)]">
				{contextCharCount}/{MAX_CONTEXT_CHAR_COUNT} characters
			</div>
		</div>
		<button
			class="mt-5 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-darker)] px-5 py-3 text-base font-semibold text-[var(--text-on-primary)] shadow-[var(--glow-sm)] transition hover:from-[var(--primary)] hover:to-[var(--primary-dark)] hover:shadow-[var(--glow-md)] disabled:cursor-not-allowed disabled:opacity-60"
			disabled={!isQuestionValid}
			onclick={getUrl}
			type="button"
		>
			Launch Your Question
		</button>
	</div>
	<p
		class="mt-6 text-center text-base italic text-[var(--text-secondary)]"
		in:fly={{ y: 20, duration: 300, delay: 400 }}
	>
		Great questions lead to great conversations. Your unique perspective matters!
	</p>
</div>

<Modal2 id="question-create" name="create question" navTop={loading} disableClose={loading}>
	<div
		class="relative w-full max-w-2xl rounded-xl border border-[var(--bg-elevated)] bg-[var(--bg-deep)] p-6 text-[var(--text-primary)] shadow-[var(--shadow-lg)] sm:p-8"
		in:fade={{ duration: 300 }}
		aria-busy={loading}
	>
		{#if loading}
			<div
				class="bg-[var(--bg-deep)]/95 absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl px-6 text-center"
				in:fade={{ duration: 150 }}
			>
				<div class="loader"></div>
				<h3 class="mt-5 text-xl font-semibold text-[var(--primary)]">
					{createProgressStage === 'redirecting' ? 'Question Created' : 'Creating Question'}
				</h3>
				<p class="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">{createProgressMessage}</p>
			</div>
		{/if}

		<div class={loading ? 'pointer-events-none select-none opacity-40' : ''}>
			<h2 class="mt-0 text-2xl font-semibold text-[var(--primary)]">Create Question</h2>

			<div
				class="mt-4 rounded-xl border border-[var(--primary-subtle)] bg-[var(--bg-surface)] p-4"
			>
				<div
					class="mx-auto h-[168px] w-[320px] overflow-hidden rounded-xl sm:h-[209px] sm:w-[400px] md:h-[251px] md:w-[480px]"
				>
					<div class="origin-top-left scale-[0.2667] sm:scale-[0.3334] md:scale-[0.4]">
						<QuestionSocialCardTemplate questionText={question} questionUrl={questionPublicUrl} />
					</div>
				</div>
			</div>
			<button
				class="mt-5 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-darker)] px-5 py-3 text-base font-semibold text-[var(--text-on-primary)] shadow-[var(--glow-sm)] transition hover:from-[var(--primary)] hover:to-[var(--primary-dark)] hover:shadow-[var(--glow-md)] disabled:cursor-not-allowed disabled:opacity-70"
				onclick={createQuestion}
				disabled={loading}
			>
				Yes, create question
				<RightIcon iconStyle="margin-left: .5rem;" height="1.5rem" fill="#ffffff" />
			</button>
		</div>
	</div>
</Modal2>

<div class="pointer-events-none fixed -left-[200vw] top-0" aria-hidden="true">
	<QuestionSocialCardTemplate
		id={SOCIAL_CARD_CAPTURE_ID}
		questionText={question}
		questionUrl={questionPublicUrl}
	/>
</div>

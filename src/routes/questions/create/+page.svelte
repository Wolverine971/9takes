<!-- src/routes/questions/create/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import QRCode from 'qrcode';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import QuestionDisplay from '$lib/components/questions/QuestionDisplay.svelte';

	let { data }: { data: PageData } = $props();

	let question = $state('');
	let url = $state('');
	let loading = $state(false);
	type CreateProgressStage = 'saving' | 'generatingImage' | 'redirecting';
	let createProgressStage = $state<CreateProgressStage>('saving');
	let createProgressMessage = $derived.by(() => {
		if (createProgressStage === 'saving') return 'Saving your question...';
		if (createProgressStage === 'generatingImage') return 'Preparing your question card...';
		return 'Question created. Taking you there now...';
	});
	let qrImageSrc = $state('');
	let imgPreview = $state('');
	let html2canvasModule = $state<
		((element: HTMLElement, options?: object) => Promise<HTMLCanvasElement>) | null
	>(null);
	let fontLoaded = $state(false);
	let resizeDebounceTimer: ReturnType<typeof setTimeout>;

	const MIN_CHAR_COUNT = 10;
	const MAX_CHAR_COUNT = 280;
	let isQuestionValid = $derived(
		question.trim().length >= MIN_CHAR_COUNT && question.length <= MAX_CHAR_COUNT
	);
	let questionCharCount = $derived(question.length);

	const QR_OPTS: QRCode.QRCodeToDataURLOptions = {
		errorCorrectionLevel: 'H' as QRCode.QRCodeErrorCorrectionLevel,
		type: 'image/png' as 'image/png',
		margin: 1,
		color: { dark: '#5407d9', light: '#ffffff' }
	};

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

			qrImageSrc = await QRCode.toDataURL(`https://9takes.com/questions/${url}`, QR_OPTS);
			getModal('question-create').open();
		} catch (error) {
			console.error('Error generating URL or QR code:', error);
			const message = error instanceof Error ? error.message : 'Failed to prepare question';
			notifications.danger(message, 5000);
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

		// Get the computed styles of the original element
		const computedStyle = window.getComputedStyle(questionNode);
		const width = parseInt(computedStyle.width);

		// Calculate a reasonable scale factor based on the element's width
		const scale = Math.min(2, 1200 / width);

		// Wait for fonts to load
		if (!fontLoaded) {
			await document.fonts.ready;
		}

		const canvas = await html2canvasModule!(questionNode, {
			useCORS: true,
			allowTaint: true,
			backgroundColor: computedStyle.backgroundColor || '#d4d4d4',
			scale: scale,
			logging: false,
			width: width,
			height: parseInt(computedStyle.height),
			onclone: (clonedDoc: Document) => {
				const element = clonedDoc.getElementById(elementId);
				if (element) {
					element.style.cssText = computedStyle.cssText;
					element.style.transform = 'none';
					element.style.margin = '0';
					element.style.padding = computedStyle.padding;
					element.style.fontFamily = '"Noticia Text", serif';
					element.style.width = `${width}px`;
					element.style.height = `${parseInt(computedStyle.height)}px`;
					element.style.fontSize = computedStyle.fontSize;
					element.style.lineHeight = computedStyle.lineHeight;
					element.style.fontWeight = computedStyle.fontWeight;
					element.style.textAlign = computedStyle.textAlign;
					element.style.color = computedStyle.color;
					element.style.transition = 'none';
					element.style.backgroundColor = computedStyle.backgroundColor || '#d4d4d4';
					element.style.overflow = 'hidden';
				}
			}
		});

		// Resize if needed
		const maxWidth = 800;
		let finalCanvas = canvas;

		if (canvas.width > maxWidth) {
			const resizeScale = maxWidth / canvas.width;
			finalCanvas = document.createElement('canvas');
			finalCanvas.width = canvas.width * resizeScale;
			finalCanvas.height = canvas.height * resizeScale;
			const ctx = finalCanvas.getContext('2d');
			if (ctx) {
				ctx.scale(resizeScale, resizeScale);
				ctx.drawImage(canvas, 0, 0);
			}
		}

		return finalCanvas.toDataURL('image/png', 0.5);
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
			body.append('context', '');
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
					const png = await generateQuestionImage('question-pic');
					// Check image size (rough estimate: base64 is ~1.37x larger than binary)
					const estimatedSize = png.length * 0.75;
					if (estimatedSize > 10 * 1024 * 1024) {
						throw new Error('Generated image is too large. Please try a shorter question.');
					}

					const uploadBody = new FormData();
					uploadBody.append('questionId', questionId.toString());
					uploadBody.append('url', url);
					uploadBody.append('img_url', png);

					void fetch('/api/questions/upload-image', { method: 'POST', body: uploadBody }).catch(
						(error) => {
							console.error('Image upload failed:', error);
						}
					);
				} catch (error) {
					console.error('Error generating image:', error);
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

	// Preview function (currently unused but available for testing)
	// const showImage = async () => {
	// 	try {
	// 		imgPreview = await generateQuestionImage('question-pic');
	// 	} catch (error) {
	// 		console.error('Error generating preview:', error);
	// 		notifications.danger('Failed to generate preview', 3000);
	// 	}
	// };

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
		class="text-center text-3xl font-semibold text-purple-400 sm:text-4xl"
		in:fly={{ y: -20, duration: 300, delay: 150 }}
	>
		Spark a Conversation
	</h1>
	<p
		class="mt-2 text-center text-base text-slate-400 sm:text-lg"
		in:fly={{ y: -20, duration: 300, delay: 200 }}
	>
		Your question could lead to fascinating insights. What would you like to explore today?
	</p>
	<div
		class="mt-6 rounded-2xl border border-slate-700/30 bg-[#1a1a2e] p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(124,58,237,0.15)] sm:p-8"
		in:fly={{ y: 20, duration: 300, delay: 300 }}
	>
		<textarea
			rows="4"
			name="question"
			placeholder="What's on your mind? Ask a thought-provoking question that invites diverse perspectives..."
			class="noticia-text-regular w-full rounded-2xl border-2 border-slate-700/30 bg-[#252538] p-4 text-lg text-slate-200 placeholder-slate-500 shadow-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
			bind:value={question}
			oninput={handleInput}
			maxlength={MAX_CHAR_COUNT}
		></textarea>
		<div
			class={`text-right text-sm ${questionCharCount > MAX_CHAR_COUNT || (questionCharCount > 0 && questionCharCount < MIN_CHAR_COUNT) ? 'text-red-400' : 'text-slate-500'}`}
		>
			{questionCharCount}/{MAX_CHAR_COUNT} characters
			{#if questionCharCount > 0 && questionCharCount < MIN_CHAR_COUNT}
				<span class="ml-2">(min {MIN_CHAR_COUNT})</span>
			{/if}
		</div>
		<button
			class="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3 text-base font-semibold text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition hover:from-purple-500 hover:to-purple-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
			disabled={!isQuestionValid}
			onclick={getUrl}
			type="button"
		>
			Launch Your Question
		</button>
	</div>
	<p
		class="mt-6 text-center text-base italic text-slate-400"
		in:fly={{ y: 20, duration: 300, delay: 400 }}
	>
		Great questions lead to great conversations. Your unique perspective matters!
	</p>
</div>

<Modal2 id="question-create" name="create question" navTop={loading} disableClose={loading}>
	<div
		class="relative w-full max-w-2xl rounded-3xl border border-slate-700/30 bg-[#12121a] p-6 text-slate-200 shadow-[0_0_30px_rgba(0,0,0,0.5)] sm:p-8"
		in:fade={{ duration: 300 }}
		aria-busy={loading}
	>
		{#if loading}
			<div
				class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-[#12121a]/95 px-6 text-center"
				in:fade={{ duration: 150 }}
			>
				<div class="loader"></div>
				<h3 class="mt-5 text-xl font-semibold text-purple-300">
					{createProgressStage === 'redirecting' ? 'Question Created' : 'Creating Question'}
				</h3>
				<p class="mt-2 max-w-sm text-sm text-slate-300">{createProgressMessage}</p>
			</div>
		{/if}

		<div class={loading ? 'pointer-events-none select-none opacity-40' : ''}>
			<h2 class="mt-0 text-2xl font-semibold text-purple-400">Create Question</h2>

			<div class="mt-4 rounded-2xl border border-purple-500/30 bg-[#1a1a2e] p-4" id="question-pic">
				<QuestionDisplay question={{ id: '', url: '', question, question_formatted: '' }} />
				<p class="mt-4 text-center text-sm text-slate-400">
					<strong class="text-base font-semibold text-slate-200">
						https://9takes.com/questions/{url}
					</strong>
				</p>
			</div>
			<button
				class="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-3 text-base font-semibold text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] transition hover:from-purple-500 hover:to-purple-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
				onclick={createQuestion}
				disabled={loading}
			>
				Yes, create question
				<RightIcon iconStyle="margin-left: .5rem;" height="1.5rem" fill="#ffffff" />
			</button>
		</div>
	</div>
</Modal2>

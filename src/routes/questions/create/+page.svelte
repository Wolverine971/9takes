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
	export let data: PageData;

	let question = '';
	let url = '';
	let loading = false;
	let qrImageSrc = '';
	let imgPreview = '';
	let html2canvas: any;
	let fontLoaded = false;
	let resizeDebounceTimer: number;

	$: isQuestionValid = question.trim().length > 0 && question.length <= MAX_CHAR_COUNT;

	const QR_OPTS: QRCode.QRCodeToDataURLOptions = {
		errorCorrectionLevel: 'H' as QRCode.QRCodeErrorCorrectionLevel,
		type: 'image/png' as 'image/png',
		quality: 0.3,
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
			notifications.warning('Please enter a valid question (1-280 characters)', 3000);
			return;
		}

		const sanitizedQuestion = question
			.trim()
			.replace(/[^\w\s]|_/g, '')
			.replace(/\s+/g, ' ');
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
		if (!html2canvas) {
			const html2canvasModule = await import('html2canvas');
			html2canvas = html2canvasModule.default;
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

		const canvas = await html2canvas(questionNode, {
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
			loading = true;

			if (!data?.session?.user?.id) {
				notifications.info('Please login to create a question', 3000);
				getModal('question-create').close();
				return;
			}

			const png = await generateQuestionImage('question-pic');

			// Check image size (rough estimate: base64 is ~1.37x larger than binary)
			const estimatedSize = png.length * 0.75;
			if (estimatedSize > 10 * 1024 * 1024) {
				throw new Error('Generated image is too large. Please try a shorter question.');
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
			body.append('img_url', png);

			const resp = await fetch('?/createQuestion', { method: 'POST', body });
			const result = deserialize(await resp.text());

			if (result && typeof result === 'object' && 'error' in result) {
				const error = (result as any).error;
				throw new Error(error?.message || 'Failed to create question');
			}

			getModal('question-create').close();
			notifications.success('Question created successfully!', 3000);
			goto(`/questions/${url}`);
		} catch (error) {
			console.error('Error creating question:', error);
			const message = error instanceof Error ? error.message : 'Failed to create question';
			notifications.danger(message, 5000);
			getModal('question-create').close();
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

	const MAX_CHAR_COUNT = 280;
	$: questionCharCount = question.length;

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;

		// Debounce resize for performance
		if (resizeDebounceTimer) clearTimeout(resizeDebounceTimer);
		resizeDebounceTimer = setTimeout(() => {
			target.style.height = 'auto';
			target.style.height = target.scrollHeight + 'px';
		}, 10) as unknown as number;
	}
</script>

<div class="question-container" in:fade={{ duration: 300 }}>
	<h1 in:fly={{ y: -20, duration: 300, delay: 150 }}>Spark a Conversation</h1>
	<p class="subtitle" in:fly={{ y: -20, duration: 300, delay: 200 }}>
		Your question could lead to fascinating insights. What would you like to explore today?
	</p>
	<div class="question-box" in:fly={{ y: 20, duration: 300, delay: 300 }}>
		<textarea
			rows="4"
			name="question"
			placeholder="What's on your mind? Ask a thought-provoking question that invites diverse perspectives..."
			class="question-textarea noticia-text-regular"
			bind:value={question}
			on:input={handleInput}
			maxlength={MAX_CHAR_COUNT}
		/>
		<div class="char-count {questionCharCount > MAX_CHAR_COUNT ? 'error' : ''}">
			{questionCharCount}/{MAX_CHAR_COUNT} characters
		</div>
		<button
			class="btn btn-primary submit-btn"
			class:disabled={!isQuestionValid}
			disabled={!isQuestionValid}
			on:click={getUrl}
			type="button"
		>
			Launch Your Question
		</button>
	</div>
	<p class="encouragement" in:fly={{ y: 20, duration: 300, delay: 400 }}>
		Great questions lead to great conversations. Your unique perspective matters!
	</p>

	<!-- ... (Modal content remains the same) ... -->
</div>

<Modal2 id="question-create" name="create question">
	<div class="modal-content" in:fade={{ duration: 300 }}>
		<h2>Create Question</h2>
		<br />

		<div class="question-preview" id="question-pic">
			<!-- <h3 id="question-pic" class="question-text noticia-text-regular">{question}</h3> -->
			<QuestionDisplay question={{ id: '', url: '', question, question_formatted: '' }} />
			<p class="url-display">
				<strong class="question-text" style="font-weight: bolder; font-size: larger;"
					>https://9takes.com/questions/{url}</strong
				>
			</p>
		</div>
		<!-- 
		Testing image preview
		
		<div>
			<img src={imgPreview} alt="image" />
			<button on:click={showImage}>Show Image</button>
		</div> -->
		<br />
		<button class="btn btn-primary create-btn" on:click={createQuestion}>
			{#if loading}
				<div class="loader" />
			{:else}
				Create <RightIcon iconStyle="margin-left: .5rem;" height="1.5rem" fill="#ffffff" />
			{/if}
		</button>
	</div>
</Modal2>

<style lang="scss">
	.modal-content {
		padding: 2rem;
		min-width: 350px;

		@media (max-width: 640px) {
			padding: 1.5rem;
			min-width: unset;
		}

		h2 {
			margin-top: 0;
			margin-bottom: 1rem;
			color: var(--primary);
			font-size: 1.8rem;
		}
	}

	.question-preview {
		padding: 1rem;
		border: 1px solid var(--color-theme-purple-dark);
		border-radius: var(--base-border-radius);
		margin-bottom: 1rem;
	}
	.submit-btn {
		border: 1px solid !important;
	}

	.create-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin-top: 1rem;
	}
	.question-container {
		padding: 2rem 1rem;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		margin-bottom: 0.5rem;
		color: var(--primary);
		font-size: 2.5rem;
	}

	.subtitle {
		text-align: center;
		color: var(--color-text-secondary);
		font-size: 1.2rem;
		margin-bottom: 2rem;
	}

	.question-box {
		background-color: var(--color-background-secondary);
		border-radius: var(--base-border-radius);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 2rem;
		transition: all 0.3s ease;

		&:hover {
			box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
		}
	}

	.question-textarea {
		width: 100%;
		min-height: 150px;
		padding: 1rem;
		border: 2px solid var(--color-border);
		border-radius: var(--base-border-radius);
		font-family: 'Noticia Text', serif;
		font-size: 1.2rem;
		resize: none;
		transition: all 0.3s ease;
		margin-bottom: 1rem;

		&:focus {
			outline: none;
			border-color: var(--primary);
			box-shadow: 0 0 0 3px rgba(84, 7, 217, 0.1);
		}
	}

	.char-count {
		text-align: right;
		font-size: 0.9rem;
		color: var(--color-text-secondary);
		margin-bottom: 1rem;

		&.error {
			color: var(--color-error);
		}
	}

	.btn {
		width: 100%;

		&.btn-primary {
			&.disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
		}
	}

	.encouragement {
		text-align: center;
		color: var(--color-text-secondary);
		font-size: 1rem;
		margin-top: 1.5rem;
		font-style: italic;
	}

	@media (max-width: 576px) {
		.question-container {
			padding: 1rem;
		}

		.comment-box {
			margin: 0.5rem 0;
		}

		.profile-avatar {
			min-width: 60px;
			font-size: 0.9rem;
		}

		.action-buttons {
			padding: 0.25rem;
		}
	}

	@media (min-width: 768px) {
		.question-box {
			min-width: 500px;
		}
	}

	@media (max-width: 767px) {
		.question-container {
			padding: 1rem 0.5rem;
		}

		h1 {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1rem;
		}

		.question-box {
			padding: 1.5rem;
		}

		.question-textarea {
			font-size: 1rem;
			min-height: 120px;
		}

		.btn {
			font-size: 1.1rem;
			padding: 0.75rem 1.5rem;
		}
	}
</style>

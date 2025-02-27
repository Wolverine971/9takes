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
	import html2canvas from 'html2canvas';
	export let data: PageData;

	let question = '';
	let url = '';
	let loading = false;
	let qrImageSrc = '';
	let imgPreview = '';

	$: isQuestionValid = question.trim().length > 0;

	const QR_OPTS = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.3,
		margin: 1,
		color: { dark: '#5407d9', light: '#ffffff' }
	};

	onMount(() => {
		question = $page.url.searchParams.get('question') || '';

		// Preload the Noticia Text font to ensure it's available for canvas
		const link = document.createElement('link');
		link.href =
			'https://fonts.googleapis.com/css2?family=Noticia+Text:ital,wght@0,400;0,700;1,400;1,700&display=swap';
		link.rel = 'stylesheet';
		document.head.appendChild(link);

		// Wait for font to load
		document.fonts.ready.then(() => {
			console.log('Fonts loaded');
		});
	});

	async function getUrl() {
		const sanitizedQuestion = question.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
		const body = new FormData();
		body.append('question', sanitizedQuestion);

		try {
			const response = await fetch('?/getUrl', { method: 'POST', body });
			const data = await response.json();
			url = JSON.parse(data?.data)?.[0];

			qrImageSrc = await QRCode.toDataURL(`https://9takes.com/questions/${url}`, QR_OPTS);
			getModal('question-create').open();
		} catch (error) {
			console.error('Error generating URL or QR code:', error);
			notifications.danger('An error occurred while preparing the question', 3000);
		}
	}

	async function createQuestion() {
		try {
			loading = true;
			const questionNode = document.getElementById('question-pic');

			// Get the computed styles of the original element
			const computedStyle = window.getComputedStyle(questionNode);
			const width = parseInt(computedStyle.width);

			// Calculate a reasonable scale factor based on the element's width
			// This ensures the image isn't too large while maintaining quality
			const scale = Math.min(2, 1200 / width); // Cap max width at 1200px

			// Wait for fonts to load
			await document.fonts.ready;

			const canvas = await html2canvas(questionNode, {
				useCORS: true,
				allowTaint: true,
				backgroundColor: computedStyle.backgroundColor || '#d4d4d4',
				scale: scale,
				logging: false,
				width: width,
				height: parseInt(computedStyle.height),
				onclone: (clonedDoc) => {
					const element = clonedDoc.getElementById('question-pic');
					if (element) {
						// Copy all relevant styles from the original element
						element.style.cssText = computedStyle.cssText;
						element.style.transform = 'none'; // Remove any transforms
						element.style.margin = '0';
						element.style.padding = computedStyle.padding;
						element.style.fontFamily = '"Noticia Text", serif';
						element.style.width = `${width}px`;
						element.style.height = `${parseInt(computedStyle.height)}px`;

						// Ensure text styles are preserved
						element.style.fontSize = computedStyle.fontSize;
						element.style.lineHeight = computedStyle.lineHeight;
						element.style.fontWeight = computedStyle.fontWeight;
						element.style.textAlign = computedStyle.textAlign;
						element.style.color = computedStyle.color;

						// Remove any transition effects
						element.style.transition = 'none';

						// Ensure the background is solid
						element.style.backgroundColor = computedStyle.backgroundColor || '#d4d4d4';

						// Remove any overflow
						element.style.overflow = 'hidden';
					}
				}
			});

			// Optionally resize the canvas if it's still too large
			const maxWidth = 800; // Set your desired max width
			let finalCanvas = canvas;

			if (canvas.width > maxWidth) {
				const scale = maxWidth / canvas.width;
				finalCanvas = document.createElement('canvas');
				finalCanvas.width = canvas.width * scale;
				finalCanvas.height = canvas.height * scale;
				const ctx = finalCanvas.getContext('2d');
				ctx.scale(scale, scale);
				ctx.drawImage(canvas, 0, 0);
			}

			const png = finalCanvas.toDataURL('image/png', 0.5); // Added quality parameter

			const body = new FormData();
			body.append('question', question.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));
			body.append('author_id', data?.session?.user?.id?.toString() || '');
			body.append('context', '');
			body.append('url', url);
			body.append('img_url', png);

			const resp = await fetch('?/createQuestion', { method: 'POST', body });
			const result = deserialize(await resp.text());

			if (result?.error) {
				notifications.danger(result.error.message, 3000);
				getModal('question-create').close();
				return;
			}

			getModal('question-create').close();
			goto(`/questions/${url}`);
		} catch (error) {
			console.error('Error creating question:', error);
			notifications.danger('An error occurred while creating the question', 3000);
		} finally {
			loading = false;
		}
	}

	const showImage = async () => {
		const questionNode = document.getElementById('question-pic');

		// Get the computed styles of the original element
		const computedStyle = window.getComputedStyle(questionNode);
		const width = parseInt(computedStyle.width);

		// Calculate a reasonable scale factor based on the element's width
		// This ensures the image isn't too large while maintaining quality
		const scale = Math.min(2, 1200 / width); // Cap max width at 1200px

		// Wait for fonts to load
		await document.fonts.ready;

		const canvas = await html2canvas(questionNode, {
			useCORS: true,
			allowTaint: true,
			backgroundColor: computedStyle.backgroundColor || '#d4d4d4',
			scale: scale,
			logging: false,
			width: width,
			height: parseInt(computedStyle.height),
			onclone: (clonedDoc) => {
				const element = clonedDoc.getElementById('question-pic');
				if (element) {
					// Copy all relevant styles from the original element
					element.style.cssText = computedStyle.cssText;
					element.style.transform = 'none'; // Remove any transforms
					element.style.margin = '0';
					element.style.padding = computedStyle.padding;
					element.style.fontFamily = '"Noticia Text", serif';
					element.style.width = `${width}px`;
					element.style.height = `${parseInt(computedStyle.height)}px`;

					// Ensure text styles are preserved
					element.style.fontSize = computedStyle.fontSize;
					element.style.lineHeight = computedStyle.lineHeight;
					element.style.fontWeight = computedStyle.fontWeight;
					element.style.textAlign = computedStyle.textAlign;
					element.style.color = computedStyle.color;

					// Remove any transition effects
					element.style.transition = 'none';

					// Ensure the background is solid
					element.style.backgroundColor = computedStyle.backgroundColor || '#d4d4d4';

					// Remove any overflow
					element.style.overflow = 'hidden';
				}
			}
		});

		// Optionally resize the canvas if it's still too large
		const maxWidth = 800; // Set your desired max width
		let finalCanvas = canvas;

		if (canvas.width > maxWidth) {
			const scale = maxWidth / canvas.width;
			finalCanvas = document.createElement('canvas');
			finalCanvas.width = canvas.width * scale;
			finalCanvas.height = canvas.height * scale;
			const ctx = finalCanvas.getContext('2d');
			ctx.scale(scale, scale);
			ctx.drawImage(canvas, 0, 0);
		}

		const png = finalCanvas.toDataURL('image/png', 0.8);
		imgPreview = png;
	};

	let questionCharCount = 0;
	const MAX_CHAR_COUNT = 280;

	$: {
		questionCharCount = question.length;
		isQuestionValid = question.trim().length > 0 && questionCharCount <= MAX_CHAR_COUNT;
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		target.style.height = 'auto';
		target.style.height = target.scrollHeight + 'px';
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

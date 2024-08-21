<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import QRCode from 'qrcode';
	import { toPng } from 'html-to-image';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PageData } from './$types';

	export let data: PageData;

	let question = '';
	let url = '';
	let loading = false;
	let qrImageSrc = '';

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
			const body = new FormData();
			body.append('question', question.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));
			body.append('author_id', data?.session?.user?.id?.toString() || '');
			body.append('context', '');
			body.append('url', url);

			const png = await toPng(questionNode);
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
</script>

<div class="question-container">
	<h1>Ask a question</h1>
	<form class=" auth-form question-form">
		<textarea
			rows="3"
			name="question"
			placeholder="Enter your question here..."
			class="question-textarea noticia-text-regular"
			bind:value={question}
		/>
		<button
			class="btn btn-primary submit-btn"
			class:disabled={!isQuestionValid}
			disabled={!isQuestionValid}
			on:click={getUrl}
			type="button"
		>
			Submit
		</button>
	</form>

	<Modal2 id="question-create" name="create question">
		<div class="modal-content">
			<h2>Create Question</h2>
			<hr />
			<div class="question-preview">
				<h3 id="question-pic noticia-text-regular" class="question-text">{question}</h3>
				<img src={qrImageSrc} alt="9takes QR Code" class="qr-code" />
				<p class="url-display">
					URL: <strong>https://9takes.com/questions/{url}</strong>
				</p>
			</div>
			<button class="btn btn-primary create-btn" on:click={createQuestion}>
				{#if loading}
					<div class="loader" />
				{:else}
					Create <RightIcon iconStyle="margin-left: .5rem;" height="1.5rem" fill="#ffffff" />
				{/if}
			</button>
		</div>
	</Modal2>
</div>

<style lang="scss">
	.question-container {
		// max-width: 600px;
		// margin: 2rem auto;
		padding: 1rem;
	}

	h1,
	h2 {
		text-align: center;
		margin-bottom: 1rem;
		color: var(--color-theme-purple);
	}

	.question-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.question-textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid var(--color-theme-purple-light);
		border-radius: var(--base-border-radius);
		font-family: 'Noticia Text', serif;
		font-size: 1rem;
		resize: vertical;
		transition: border-color 0.3s ease;

		&:focus {
			outline: none;
			border-color: var(--color-theme-purple);
		}
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: var(--base-border-radius);
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s ease, opacity 0.3s ease;

		&.btn-primary {
			background-color: var(--color-theme-purple);
			color: white;

			&:hover:not(.disabled) {
				background-color: var(--color-theme-purple-light);
			}

			&.disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
		}
	}

	.submit-btn {
		align-self: flex-end;
	}

	.modal-content {
		padding: 1.5rem;
	}

	.question-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.question-text {
		font-family: 'Noticia Text', serif;
		text-align: center;
		margin: 0;
	}

	.qr-code {
		max-width: 200px;
		height: auto;
	}

	.url-display {
		word-break: break-all;
		text-align: center;
	}

	.create-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: auto;
	}

	.loader {
		width: 20px;
		height: 20px;
		border: 2px solid #ffffff;
		border-top: 2px solid transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 480px) {
		.question-container {
			padding: 0.5rem;
		}

		.submit-btn,
		.create-btn {
			width: 100%;
		}
	}
</style>

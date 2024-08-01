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

	$: isQuestionValid = question.trim().length > 0;

	const QR_OPTS = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.3,
		margin: 1,
		color: { dark: '#5407d9', light: '' }
	};

	onMount(() => {
		question = $page.url.searchParams.get('question') || '';
	});

	async function getUrl() {
		const body = new FormData();
		body.append('question', question.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));

		const response = await fetch('?/getUrl', { method: 'POST', body });
		const data = await response.json();
		url = JSON.parse(data?.data)?.[0];

		QRCode.toDataURL(`https://9takes.com/questions/${url}`, QR_OPTS, (err, qrUrl) => {
			if (err) throw err;
			document.getElementById('qr-image').src = qrUrl;
		});

		getModal('question-create').open();
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
			console.error(error);
			notifications.danger('An error occurred while creating the question', 3000);
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex-center">
	<h1>Ask a question</h1>
	<form class="auth-form">
		<textarea
			rows="3"
			name="question"
			placeholder="Question"
			class="create-question-textarea noticia-text-regular"
			bind:value={question}
		/>
		<button
			class="btn btn-primary"
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
			<h1>Create Question</h1>
			<hr />
			<div class="flex-center wrap">
				<h3 id="question-pic" class="noticia-text-regular">{question}</h3>
				<img id="qr-image" alt="9takes QR Code" />
				<p class="url-display">
					Url: <b>https://9takes.com/questions/{url}</b>
				</p>
			</div>
			<button class="btn btn-primary create-btn" on:click={createQuestion}>
				{#if loading}
					<div class="loader" />
				{:else}
					Create <RightIcon iconStyle="margin-left: .5rem;" height="1.5rem" fill="#5407d9" />
				{/if}
			</button>
		</div>
	</Modal2>
</div>

<style lang="scss">
	h1 {
		text-align: center;
		margin: 0;
		padding-bottom: 1rem;
	}

	.auth-form {
		margin: 0;
	}

	.create-question-textarea,
	#question-pic {
		margin: 1rem 0;
		padding: 0.5rem;
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
	}

	.modal-content {
		height: 100%;
	}

	.wrap {
		flex-wrap: wrap;
		overflow: hidden;
	}

	.url-display {
		overflow-wrap: anywhere;
	}

	.create-btn {
		float: right;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

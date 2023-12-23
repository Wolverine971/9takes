<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import type { PageData } from './$types';
	// import { toPng } from 'html-to-image';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { deserialize } from '$app/forms';
	import QRCode from 'qrcode';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	let question: string = '';

	export let data: PageData;

	let visible = false;

	let url: string;
	function makeVisible() {
		visible = true;
	}

	const opts = {
		errorCorrectionLevel: 'H',
		type: 'image/jpeg',
		quality: 0.3,
		margin: 1,
		color: {
			dark: '#5407d9',
			light: ''
		}
	};
	let loading = false;

	function closeModal(event: Event) {
		visible = false;
	}

	onMount(() => {
		question = $page.url.searchParams.get('question') || '';
	});

	const createQuestion = async () => {
		try {
			loading = true;
			var body = new FormData();
			body.append('question', question.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));
			body.append('author_id', data?.session?.user.id || '');
			body.append('context', '');
			body.append('url', url);
			body.append('img_url', '');
			const resp = await fetch('?/createQuestion', {
				method: 'POST',
				body
			});

			const result: any = deserialize(await resp.text());
			if (result) {
				getModal('question-create').close();
				goto(`/questions/${url}`, {});

				// question image creation
				// setTimeout(async () => {
				// 	const newQ = document.getElementById('question-box');
				// 	console.log(newQ);
				// 	if (newQ) {
				// 		const pngSrc = await toPng(newQ);

				// 		let body = new FormData();
				// 		body.append('img_url', pngSrc);
				// 		body.append('url', url);

				// 		fetch('?/updateQuestionImg', {
				// 			method: 'POST',
				// 			body
				// 		});
				// 	}
				// 	console.log('end image creation');
				// }, 3000);
			}
			loading = false;
		} catch (error) {
			console.error(error);
			loading = false;
		}
	};

	const getUrl = async () => {
		var body = new FormData();
		body.append('question', question.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));

		await fetch('?/getUrl', {
			method: 'POST',
			body
		})
			.then((response) => response.json())
			.then((data) => {
				url = JSON.parse(data?.data)?.[0];
				QRCode.toDataURL(`https://9takes.com/questions/${url}`, opts, function (err, url) {
					if (err) throw err;
					var img = document.getElementById('qr-image');
					img.src = url;
				});

				getModal('question-create').open();
			});

		visible = true;
	};
</script>

<div class="">
	<h1 style="text-align: center">Ask a question</h1>
	<form action="?/getUrl" method="POST" class="auth-form">
		<textarea
			rows="3"
			name="question"
			placeholder="Question"
			class="create-question-textarea"
			bind:value={question}
		/>
		<button class="btn btn-primary" style="align-self: end;" type="button" on:click={getUrl}>
			Create
		</button>
	</form>

	<Modal2 id="question-create" name={'create question'}>
		<div class="modal-size">
			<h1 style="margin: 0; padding-bottom: 1rem">Create Question</h1>
			<hr />
			<!-- <p>Tag your question:</p> -->
			<div class="flex-center">
				<div class="warning">
					<h3 style="margin: 0;">If your question gets 3 comments we will tag and keep it!</h3>
				</div>

				<img id="qr-image" src="" alt="QR Code" />

				<p>Url: <b> {`https://9takes.com/questions/${url}`} </b></p>
			</div>
			<button class="btn btn-primary create-btn" type="button" on:click={createQuestion}>
				{#if loading}
					<div class="loader" />
				{:else}
					Create <RightIcon iconStyle={'margin-left: .5rem;'} height={'1.5rem'} fill={'#5407d9'} />
				{/if}
			</button>
		</div>
	</Modal2>
</div>

<style lang="scss">
	.create-question-textarea {
		margin: 1rem 0;
		padding: 0.5rem;
		border: var(--classic-border);
		border-radius: 5px;
		field-sizing: content;
	}
	.modal-size {
		height: 100%;
		// width: clamp(300px, 50vw, 50vw);
	}

	.create-btn {
		float: right;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.warning {
		border: 1px solid red;
		border-radius: 5px;
		margin: 1rem;
		padding: 0.5rem;
	}
</style>

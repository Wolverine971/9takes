<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import type { PageData } from './$types';
	import { toPng } from 'html-to-image';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { deserialize } from '$app/forms';

	let question: string = '';

	export let data: PageData;

	let visible = false;

	let url: string;
	function makeVisible() {
		visible = true;
	}
	function closeModal(event: Event) {
		visible = false;
	}

	onMount(() => {
		question = $page.url.searchParams.get('question') || '';
	});

	const createQuestion = async () => {
		try {
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
				getModal().close();
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
		} catch (error) {
			console.error(error);
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

				getModal().open();
			});

		visible = true;
	};
</script>

<div class="card">
	<h1 style="text-align: center">Create Question</h1>
	<form action="?/getUrl" method="POST" class="auth-form">
		<input type="text" name="question" placeholder="Question" bind:value={question} />
		<button class="btn btn-primary" type="button" on:click={getUrl}> Create </button>
	</form>

	<Modal2>
		<div class="modal-size">
			<h1>Create Question</h1>
			<!-- <p>Tag your question:</p> -->

			<h3>If your question gets 3 comments we will tag and keep it!</h3>

			<p>Url: {`https://9takes.com/questions/${url}`}</p>
			<button class="btn btn-primary" type="button" on:click={createQuestion}>Create</button>
		</div>
	</Modal2>
</div>

<style lang="scss">
	.modal-size {
		height: max(250px, 55vh, 55vh);
		width: clamp(300px, 50vw, 50vw);
	}
</style>

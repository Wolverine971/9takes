<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import type { PageData } from '../$types';

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

	export async function createQuestion() {
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
			}
		} catch (error) {
			console.error(error);
		}
	}

	export async function getUrl() {
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
	}
</script>

<main class="card">
	<h1 style="color: white">Create Question</h1>
	<form action="?/getUrl" method="POST" class="auth-form">
		<input type="text" name="question" placeholder="Question" bind:value={question} />
		<button class="btn btn-primary" type="button" on:click={getUrl}> Create Question </button>
	</form>

	<Modal2>
		<div>
			<p>modal</p>
			<p>Url: {url}</p>
			<button class="btn btn-primary" type="button" on:click={createQuestion}>
				Create Question
			</button>
		</div>
	</Modal2>
</main>

<style lang="scss">
</style>

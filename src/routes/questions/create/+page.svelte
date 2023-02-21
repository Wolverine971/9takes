<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { supabase } from '$lib/supabase';
	import type { PageData } from '../$types';
	let question: string;

	export let data: PageData;

	let visible = false;

	let url: string;
	function makeVisible() {
		visible = true;
	}
	function closeModal(event: Event) {
		visible = false;
	}

	export async function createQuestion() {
		try {
			var body = new FormData();
			body.append('question', question);
			body.append('author_id', data?.session?.user.id || '');
			body.append('context', '');
			body.append('url', url);
			body.append('img_url', '');
			const resp = await fetch('?/createQuestion', {
				method: 'POST',
				body
			}).then((response) => response.json());

			getModal().close();
		} catch (error) {
			console.error(error);
		}
	}

	export async function getUrl() {
		var body = new FormData();
		body.append('question', question);
		const resp = await fetch('?/getUrl', {
			method: 'POST',
			body
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);
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

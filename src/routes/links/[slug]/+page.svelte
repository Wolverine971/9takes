<script lang="ts">
	import { deserialize } from '$app/forms';
	import ComboBox from '$lib/components/molecules/ComboBox.svelte';
	import Context from '$lib/components/molecules/Context.svelte';
	import { onMount } from 'svelte';

	// ADMIN only page
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { QuestionItem } from '$lib/components/molecules';
	import { notifications } from '$lib/components/molecules/notifications';
	import LinkMap from '$lib/components/molecules/LinkMap.svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

	export let data: PageData;

	let selectedQuestion: any = null;
	let location: any = null;

	let timer: any;
	let options: { text: string; value: any }[] = [];

	onMount(() => {
		if (browser) {
			navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
		}
	});

	const successCallback = (position: any) => {
		location = position?.coords;
	};

	const errorCallback = (error: any) => {
		console.log(error);
	};

	const searchES = async (searchString: string) => {
		let body = new FormData();
		body.append('searchString', searchString);
		await fetch('/questions?/typeahead', {
			method: 'POST',
			body
		}).then(async (response) => {
			const resp: any = deserialize(await response.text());
			let elasticOptions = resp?.data;
			if (elasticOptions?.length) {
				options = elasticOptions.map((o: any) => {
					return { text: o?._source?.question, value: o?._source };
				});
			} else {
				options = [];
			}
			return options;
		});
	};

	const debounce = (v: any) => {
		// question = v;
		clearTimeout(timer);
		timer = setTimeout(() => {
			searchES(v);
		}, 750);
	};

	const questionSelected = async (question: any) => {
		selectedQuestion = question;
	};

	const save = async () => {
		if (!selectedQuestion) {
			alert('Must select a question');
			return;
		}

		var body = new FormData();
		body.append('lat', location?.latitude);
		body.append('lng', location?.longitude);

		body.append('selectedQuestionURL', selectedQuestion ? selectedQuestion?.url : '');
		const resp = await fetch('?/submitLinkDrop', {
			method: 'POST',
			body
		});
		const deserRes: any = deserialize(await resp.text());

		if (deserRes.error) {
			notifications.danger('Error dropping link', 3000);
			console.log(deserRes.error);
		} else {
			notifications.info('Link Dropped', 3000);
		}
		getModal(`edit-link`).close();
	};

	const updateLink = async () => {
		if (!selectedQuestion) {
			alert('Must select a question');
			return;
		}

		var body = new FormData();

		body.append('selectedQuestionURL', selectedQuestion ? selectedQuestion?.url : '');
		body.append('linkDropExternalId', data.linkDrop?.external_id);
		const resp = await fetch('?/updateLinkDrop', {
			method: 'POST',
			body
		});
		const deserRes: any = deserialize(await resp.text());

		if (deserRes.error) {
			notifications.danger('Error updating link', 3000);
			console.log('fe', deserRes.error);
		} else {
			notifications.info('Link Drop updated', 3000);
		}
		getModal(`edit-link`).close();
	};
</script>

<div>
	<h1>Link Drop</h1>
	<h2>Link: {data.linkDrop?.external_id}</h2>

	{#if !data.linkDrop}
		<form>
			<div style="flex: 1">
				<Context>
					<ComboBox
						label=""
						name="question"
						placeholder="Ask a question..."
						on:inputChange={({ detail: { text } }) => debounce(text)}
						{options}
						on:selection={({ detail }) => questionSelected(detail)}
					/>
				</Context>
			</div>

			<button type="button" class="btn btn-primary" on:click={() => save()}> Save </button>
		</form>
	{/if}

	{#if data.linkDrop}
		<div>
			<QuestionItem questionData={data.question} />
			<p># of Drops: {data.linkDrop?.number_of_drops || 0}</p>
			<p>Hits: {data.linkDrop?.number_of_hits || 0}</p>
		</div>
		<button type="button" class="btn btn-primary" on:click={() => getModal(`edit-link`).open()}>
			Change Question
		</button>

		<LinkMap linkDrops={[data.linkDrop]} />
	{/if}
</div>

<Modal2 id={`edit-link`}>
	<div style="max-height: 500px; min-width: 350px; min-height:300px;">
		<form>
			<div style="flex: 1">
				<Context>
					<ComboBox
						label=""
						name="question"
						placeholder="Ask a question..."
						on:inputChange={({ detail: { text } }) => debounce(text)}
						{options}
						on:selection={({ detail }) => questionSelected(detail)}
					/>
				</Context>
			</div>

			<button type="button" class="btn btn-primary" on:click={() => updateLink()}> Save </button>
		</form>
	</div>
</Modal2>

<style lang="scss">
</style>

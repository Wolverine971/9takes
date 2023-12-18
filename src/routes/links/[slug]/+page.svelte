<script lang="ts">
	import { deserialize } from '$app/forms';
	import ComboBox from '$lib/components/molecules/ComboBox.svelte';
	import Context from '$lib/components/molecules/Context.svelte';
	import { onMount } from 'svelte';

	// ADMIN only page
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { QuestionItem } from '$lib/components/molecules';

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

	const successCallback = (position) => {
		console.log(position);
		location = position?.coords;
	};

	const errorCallback = (error) => {
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
		const { id } = question;
		selectedQuestion = question;
	};

	const save = async () => {
		if (!selectedQuestion) {
			alert('Must select a question');
			return;
		}
		// submitLinkDrop
		console.log(location);
		console.log(selectedQuestion);

		var body = new FormData();
		body.append('location', location);
		body.append('lat', location?.latitude);
		body.append('lng', location?.longitude);

		body.append('selectedQuestionURL', selectedQuestion ? selectedQuestion?.url : '');
		const resp = await fetch('?/submitLinkDrop', {
			method: 'POST',
			body
		});
		const deserRes = deserialize(await resp.text());
		console.log(deserRes);
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
	{/if}
</div>

<style lang="scss">
</style>

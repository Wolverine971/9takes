<script lang="ts">
	import { deserialize, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ComboBox from '../molecules/ComboBox.svelte';
	import Context from '../molecules/Context.svelte';
	import { notifications } from '../molecules/notifications';

	export let data: any;

	let question: string = '';

	const goToCreateQuestionPage = (val: any) => {
		if (data?.session?.user?.id) {
			let url: string;
			if (typeof val === 'string') {
				url = `/questions/create/?question=${val}`;
			} else {
				url = `/questions/create/`;
			}
			setTimeout(() => {
				goto(url, { invalidateAll: true });
			}, 0);
		} else {
			notifications.warning('Must be logged in', 3000);
		}
	};

	let timer: any;
	let options: { text: string; value: any }[] = [];

	const search = async (searchString: string) => {
		let body = new FormData();
		body.append('searchString', searchString);
		await fetch('questions?/typeahead', {
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
		clearTimeout(timer);
		timer = setTimeout(() => {
			search(v);
		}, 750);
	};

	const goToPage = async (page: any) => {
		console.log(page.url);
		goto(`/questions/${page.url}`, {});
	};
</script>

<!-- <section class="card"> -->
<form class="question-form">
	<div style="flex: 1">
		<Context>
			<ComboBox
				label=""
				name="question"
				placeholder="Ask a question..."
				on:inputChange={({ detail: { text } }) => debounce(text)}
				on:createQuestion={({ detail: { text } }) => goToCreateQuestionPage(text)}
				{options}
				on:selection={({ detail }) => goToPage(detail)}
			/>
		</Context>
	</div>

	<button
		class="btn btn-primary"
		type="button"
		on:click={() => {
			goToCreateQuestionPage('');
		}}
	>
		Create Question
	</button>
</form>

<style lang="scss">
	.question-form {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.card {
		margin: var(--card-margin);
		padding: var(--card-padding);
		box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
			0 1px 5px 0 rgb(0 0 0 / 12%);
	}

	@media (max-width: 768px) {
		.question-form {
			flex-direction: column;
		}
	}
</style>
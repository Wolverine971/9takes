<script lang="ts">
	import { deserialize, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ComboBox from '$lib/components/molecules/ComboBox.svelte';
	import Context from '$lib/components/molecules/Context.svelte';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: any;

	let question: string = '';

	const goToCreateQuestionPage = () => {
		// cannot create question if you are not logged in
		if (!data?.session?.user?.id) {
			goto(`/register`, { invalidateAll: true });
			return;
		}
		const val = question;
		let url: string;
		if (typeof val === 'string') {
			url = `/questions/create/?question=${val}`;
		} else {
			url = `/questions/create/`;
		}
		setTimeout(() => {
			goto(url, { invalidateAll: true });
		}, 0);
	};

	let timer: any;
	let options: { text: string; value: any }[] = [];

	const searchES = async (searchString: string) => {
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
		question = v;
		clearTimeout(timer);
		timer = setTimeout(() => {
			searchES(v);
		}, 750);
	};

	const goToPage = async (page: any) => {
		goto(`/questions/${page.url}`, {});
	};

	const questionDisplay = () => {
		if (data?.session?.user?.id) {
			if (data?.canAskQuestion) {
				return 'Ask question';
			} else {
				return 'Only 10 questions per day';
			}
		} else {
			return 'Sign up to ask a question';
		}
	};
</script>

<form class="question-form">
	<div style="flex: 1">
		<Context>
			<ComboBox
				label=""
				name="question"
				placeholder="Ask a question..."
				on:inputChange={({ detail: { text } }) => debounce(text)}
				on:selectQuestion={({ detail: { text } }) => goToCreateQuestionPage()}
				{options}
				on:selection={({ detail }) => goToPage(detail)}
			/>
		</Context>
	</div>

	<button
		class="btn btn-primary"
		type="button"
		on:click={() => {
			goToCreateQuestionPage();
		}}
		title={questionDisplay()}
	>
		{questionDisplay()}
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

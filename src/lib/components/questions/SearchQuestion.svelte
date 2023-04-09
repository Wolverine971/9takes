<script lang="ts">
	import { deserialize, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ComboBox from '../molecules/ComboBox.svelte';
	import Context from '../molecules/Context.svelte';
	// import { notifications } from '../molecules/notifications';

	export let data: any;

	let question: string = '';

	const goToCreateQuestionPage = (val) => {
		if (data?.session?.user?.id) {
			let url;
			if (typeof val === 'string') {
				url = `/questions/create/?question=${val}`;
			} else {
				url = `/questions/create/`;
			}
			goto(url, {});
		} else {
			alert('must be logged in');
		}
	};

	let timer: any;
	let options: any[] = [];

	const search = async (searchString: string) => {
		console.log(searchString);
		let body = new FormData();
		body.append('searchString', searchString);
		const newOptions = await fetch('questions?/search', {
			method: 'POST',
			body
		}).then(async (response) => {
			const resp = deserialize(await response.text());
			let newOptions = resp?.data;
			if (newOptions?.length) {
				options = newOptions.map((o) => {
					return { text: o.question, value: o };
				});
			} else {
				options = [];
			}
			return options;
		});
		console.log(newOptions);
	};

	const debounce = (v) => {
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

<!-- </section> -->
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
</style>

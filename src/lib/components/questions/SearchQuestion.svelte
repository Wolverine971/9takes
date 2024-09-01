<script lang="ts">
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import ComboBox from '$lib/components/molecules/ComboBox.svelte';
	import Context from '$lib/components/molecules/Context.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let data: any;

	let question: string = '';
	let options: { text: string; value: any }[] = [];
	let timer: any;

	const goToCreateQuestionPage = () => {
		if (!data?.session?.user?.id) {
			goto(`/register`, { invalidateAll: true });
			return;
		}
		const url = question ? `/questions/create/?question=${question}` : '/questions/create/';
		goto(url, { invalidateAll: true });
	};

	const searchES = async (searchString: string) => {
		let body = new FormData();
		body.append('searchString', searchString);
		const response = await fetch('/questions?/typeahead', { method: 'POST', body });
		const resp: any = deserialize(await response.text());
		options =
			resp?.data?.map((o: any) => ({ text: o?._source?.question, value: o?._source })) || [];
	};

	const debounce = (v: string) => {
		question = v;
		clearTimeout(timer);
		timer = setTimeout(() => searchES(v), 750);
	};

	const questionDisplay = () => {
		if (!data?.session?.user?.id) return 'Sign up to ask a question';
		return data?.canAskQuestion ? 'Ask question' : 'Only 10 questions per day';
	};
</script>

<form class="question-form">
	<div class="search-container">
		<Context>
			<ComboBox
				label=""
				name="question"
				placeholder={data?.session?.user?.id ? 'Put question here' : 'Search questions...'}
				on:inputChange={({ detail: { text } }) => debounce(text)}
				on:selectQuestion={() => dispatch('createQuestion', question)}
				{options}
				on:selection={({ detail }) => dispatch('questionSelected', detail)}
			/>
		</Context>
	</div>

	<button
		class="btn btn-primary"
		type="button"
		on:click={goToCreateQuestionPage}
		title={questionDisplay()}
		disabled={!data?.canAskQuestion && data?.session?.user?.id}
	>
		{questionDisplay()}
	</button>
</form>

<style lang="scss">
	.question-form {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		align-items: center;
	}

	.search-container {
		flex: 1;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: var(--base-border-radius);
		border: 1px solid var(--primary);
		font-size: 1rem;
		font-weight: bold;
		cursor: pointer;
		transition: all 0.3s ease;

		&.btn-primary {
			background-color: var(--color-primary);
			color: var(--color-text-inverse);

			&:hover:not(:disabled) {
				background-color: var(--color-primary-hover);
				transform: translateY(-2px);
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			}

			&:disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
		}
	}

	@media (max-width: 768px) {
		.question-form {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}
</style>

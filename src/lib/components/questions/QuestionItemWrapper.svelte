<!-- lib/components/questions/QuestionItemWrapper.svelte -->
<script lang="ts">
	import QuestionItem from './QuestionItem.svelte';
	import { createEventDispatcher } from 'svelte';
	
	export let questionData: any;
	
	const dispatch = createEventDispatcher();
	
	let hasError = false;
	let errorMessage = '';
	
	const handleError = (error: Error) => {
		hasError = true;
		errorMessage = error.message || 'Failed to load question';
		console.error('QuestionItem error:', error);
	};
	
	// Wrap async operations in try-catch
	const handleQuestionRemoved = async () => {
		try {
			dispatch('questionRemoved');
		} catch (error) {
			handleError(error as Error);
		}
	};
</script>

{#if hasError}
	<div class="question-error">
		<p>{errorMessage}</p>
		<button on:click={() => hasError = false}>Try Again</button>
	</div>
{:else}
	<div on:error={handleError}>
		<QuestionItem 
			{questionData} 
			on:questionRemoved={handleQuestionRemoved}
		/>
	</div>
{/if}

<style>
	.question-error {
		padding: 1rem;
		margin: 0.25rem 0;
		background-color: var(--error-light);
		border: 1px solid var(--error);
		border-radius: 0.25rem;
		color: var(--error);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.question-error p {
		margin: 0;
		font-size: 0.875rem;
	}
	
	.question-error button {
		padding: 0.25rem 0.75rem;
		background-color: var(--error);
		color: white;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		cursor: pointer;
		font-weight: 600;
	}
	
	.question-error button:hover {
		opacity: 0.9;
	}
</style>
<!-- src/lib/components/molecules/SuggestFamousPerson.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import { notifications } from './notifications';

	let email = '';
	let otherPerson = '';
	let error = '';
	let loading = false;

	$: isEmailValid = /\S+@\S+\.\S+/.test(email);

	async function submit() {
		if (!isEmailValid) {
			error = 'Must be a valid email';
			return;
		}

		error = '';
		loading = true;

		const body = new FormData();
		body.append('email', email);
		body.append('suggestedPerson', otherPerson);

		try {
			const resp = await fetch(`/email?/submitFamousPerson`, { method: 'POST', body });
			const data = deserialize(await resp.text());

			if (!data?.error) {
				notifications.info('Thanks for the suggestion', 3000);
				email = '';
				otherPerson = '';
			} else {
				notifications.warning('Suggestion Failed ☹️', 3000);
			}
		} catch (err) {
			console.error('Error submitting suggestion:', err);
			notifications.danger('An error occurred. Please try again.', 3000);
		} finally {
			loading = false;
		}
	}
</script>

<div class="waitlist-section">
	<h2>Who else should 9takes write about?</h2>

	<form class="waitlist-form" on:submit|preventDefault={submit}>
		<input
			type="text"
			name="person"
			placeholder="Celebrity, musician, politician, YouTuber, etc."
			bind:value={otherPerson}
		/>

		<input type="email" name="email" placeholder="you@example.com" bind:value={email} />

		<button type="submit" disabled={!email.length} class:disabled={!email.length}>
			{loading ? 'Submitting...' : 'Submit'}
		</button>
	</form>

	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style lang="scss">
	.waitlist-section {
		text-align: center;
		border: var(--classic-border);
		padding: 2rem;
		border-radius: var(--base-border-radius);

		h2 {
			margin-top: 0;
		}
	}

	.waitlist-form {
		display: flex;
		flex-direction: column;
		align-items: center;

		input,
		button {
			width: 100%;
			max-width: 300px;
			margin-bottom: 10px;
			padding: 10px;
			border-radius: var(--base-border-radius);
			border: var(--classic-border);
		}

		button {
			padding: 10px 20px;
			cursor: pointer;
			color: var(--primary);
			border: 1px solid;
			width: 155px;

			&.disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}
	}

	@media only screen and (min-width: 768px) {
		.waitlist-form {
			max-width: 500px;
			margin: 0 auto;

			input {
				max-width: 400px;
			}
		}
	}

	@media only screen and (min-width: 992px) {
		.waitlist-section {
			display: flex;
			justify-content: center;
			flex-direction: column;
		}

		.waitlist-form {
			max-width: 600px;
			margin: 0 auto;
			flex-direction: row;
			align-items: center;

			input {
				margin-right: 10px;
				margin-bottom: 0;
			}
		}
	}

	::placeholder {
		color: var(--primary);
		opacity: 1;
	}
</style>

<script lang="ts">
	import { deserialize } from '$app/forms';
	import { notifications } from './notifications';

	let email: string = '';
	let otherPerson: string = '';

	let error: string = '';

	let loading: boolean = false;

	const submit = async () => {
		if (!/\S+@\S+\.\S+/.test(email)) {
			//!/.+@.+/.test(email) ||
			error = 'must be a valid email';
			return;
		} else {
			error = '';
		}
		loading = true;

		let body = new FormData();
		body.append('email', email);
		body.append('suggestedPerson', otherPerson);

		const resp = await fetch(`/email?/submitFamousPerson`, {
			method: 'POST',
			body
		});

		const data = deserialize(await resp.text());

		if (!data?.error) {
			notifications.info('Thanks for the suggestion', 3000);

			email = '';
			otherPerson = '';
		} else {
			notifications.warning('Suggestion Failed ☹️', 3000);
		}
		loading = false;
	};
</script>

<div class="waitlist-section">
	<h2 style="margin-top: 0;">Who else should 9takes write about?</h2>

	<form class="waitlist-form">
		<input
			type="text"
			id="email"
			name="person"
			placeholder="celebrity, musician, politician, youtuber,"
			bind:value={otherPerson}
		/>

		<input type="email" id="email" name="email" bind:value={email} placeholder="you@example.com" />
		<button
			type="button"
			value="Send"
			on:click={submit}
			disabled={email.length ? false : true}
			class:form-send={true}
			class={email.length ? 'regular' : 'disabled'}
		>
			{#if loading}
				<div class="loader" />
			{:else}
				Submit
			{/if}
		</button>
	</form>
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.waitlist-section {
		text-align: center;
		border: var(--classic-border);
		padding: 2rem;
		border-radius: 5px;
	}
	.waitlist-form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.waitlist-form input {
		width: 100%;
		max-width: 300px;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 5px;
		border: var(--classic-border);
	}
	.waitlist-form button {
		/* background-color: #007bff; */
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		color: var(--color-theme-purple);
		border: 1px solid;
		width: 155px;
	}
	/* For tablets */
	@media only screen and (min-width: 768px) {
		.waitlist-form {
			max-width: 500px;
			margin: 0 auto;
		}
		.waitlist-form input {
			max-width: 400px;
		}
	}
	/* For desktops and wider screens */
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
		}

		.waitlist-form input {
			margin-right: 10px;
			margin-bottom: 0;
		}
	}
	::placeholder {
		/* Chrome, Firefox, Opera, Safari 10.1+ */
		color: var(--color-theme-purple);
		opacity: 1; /* Firefox */
	}

	:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: var(--color-theme-purple);
	}

	::-ms-input-placeholder {
		/* Microsoft Edge */
		color: var(--color-theme-purple);
	}
</style>

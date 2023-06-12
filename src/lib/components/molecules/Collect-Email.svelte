<script lang="ts">
	import { deserialize } from '$app/forms';
	import { notifications } from './notifications';

	export let cta: string = '';
	let email: string = '';
	let error: string = '';

	const submit = async () => {
		if (!/\S+@\S+\.\S+/.test(email)) {
			//!/.+@.+/.test(email) ||
			error = 'must be a valid email';
			return;
		} else {
			error = '';
		}

		let body = new FormData();
		body.append('email', email);

		const { data, error: emailError } = await (
			await fetch(`/email?/submit`, {
				method: 'POST',
				body
			})
		).json();

		if (data) {
			notifications.info('Email Submitted', 3000);
			email = '';
		} else {
			if (emailError?.message && emailError?.message === 'Email already exists') {
				// console.log(emailError);
				notifications.warning('Email already exists', 3000);
			} else {
				notifications.warning('Email Failed', 3000);
			}
		}
	};
</script>

<div class="waitlist-section">
	<h2 style="margin-top: 0;">Join our waitlist!</h2>
	<p>
		9takes is a place for exploration and shared learning, where we delve into the nuances of
		personality types and discuss different perspectives. If you're fascinated by the world of the
		Enneagram you are warmly invited join our waitlist.
	</p>
	<form class="waitlist-form">
		<input type="email" id="email" name="email" bind:value={email} placeholder="you@example.com" />
		<button
			type="button"
			value="Send"
			on:click={submit}
			disabled={email.length ? false : true}
			class:form-send={true}
			class={email.length ? 'regular' : 'disabled'}>Join now</button
		>
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
		width: 145px;
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

<script lang="ts">
	import { deserialize } from '$app/forms';
	import { notifications } from './notifications';

	export let cta: string = '';
	let email: string = '';
	let error: string = '';

	const submit = async () => {
		console.log('submit email');

		if (!/\S+@\S+\.\S+/.test(email)) {
			//!/.+@.+/.test(email) ||
			error = 'must be a valid email';
			return;
		} else {
			error = '';
		}

		let body = new FormData();
		body.append('email', email);

		const { data } = await (
			await fetch(`/email?/submit`, {
				method: 'POST',
				body
			})
		).json();

		if (data) {
			notifications.info('Email Submitted', 3000);
			email = '';
		} else {
			notifications.warning('Email Failed', 3000);
		}
	};
</script>

<div class="waitlist-section">
	<h2>Join our waitlist!</h2>
	<p>Be the first to know when 9takes is ready.</p>
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

<!-- <style lang="scss">
	@media (max-width: 535px) {
		.form-row {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.error {
			margin: 1rem;
		}
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 20px;
		justify-content: center;
	}
	.form-row {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hidden {
		visibility: hidden;
	}
	.disabled {
		border: pink 2px solid;
	}
	.error {
		color: #ff2c50;
	}
</style> -->
<style>
	.waitlist-section {
		text-align: center;
	}
	.waitlist-form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.waitlist-form label {
		margin-bottom: 10px;
	}
	.waitlist-form input {
		width: 100%;
		max-width: 300px;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid #ccc;
	}
	.waitlist-form button {
		/* background-color: #007bff; */
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		color: #5407d9;
		border: 1px solid;
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
		.waitlist-form label {
			margin-right: 10px;
			margin-bottom: 0;
		}
		.waitlist-form input {
			margin-right: 10px;
			margin-bottom: 0;
		}
	}
</style>

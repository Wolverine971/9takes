<!-- src/lib/components/molecules/Email-Invite.svelte -->
<script lang="ts">
	import { notifications } from './notifications';
	import Envelope from '$lib/components/icons/envelope.svelte';

	export let cta: string = 'Who else needs to know about 9takes?';
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

			// goto('/signup');

			email = '';
		} else {
			if (emailError?.message && emailError?.message === 'Email already exists') {
				// console.log(emailError);
				notifications.warning('Already invited', 3000);
			} else {
				notifications.warning('Send Invite Failed', 3000);
			}
		}
	};
</script>

<div class="invite-section">
	<h3 style="margin-top: 0; text-align:center">{cta}</h3>
	<form class="invite-form">
		<input type="email" id="email" name="email" bind:value={email} placeholder="you@example.com" />
		<button
			type="button"
			value="Send"
			on:click={submit}
			disabled={email.length ? false : true}
			class:form-send={true}
			class={email.length ? 'regular' : 'disabled'}
			>Invite
			<Envelope height={'1rem'} fill={'var(--accent)'} />
		</button>
	</form>
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.invite-section {
		text-align: center;
		border: var(--classic-border);
		padding: 2rem;
		border-radius: var(--base-border-radius);
	}
	.invite-form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.invite-form input {
		width: 100%;
		max-width: 300px;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: var(--base-border-radius);
		border: var(--classic-border);
	}
	.invite-form button {
		/* background-color: #007bff; */
		padding: 10px 20px;
		border-radius: var(--base-border-radius);
		border: none;
		cursor: pointer;
		color: var(--primary);
		border: 1px solid;
		width: 200px;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	/* For tablets */
	@media only screen and (min-width: 768px) {
		.invite-form {
			max-width: 500px;
			margin: 0 auto;
		}
		.invite-form input {
			max-width: 400px;
		}
	}
	/* For desktops and wider screens */
	@media only screen and (min-width: 992px) {
		.invite-section {
			display: flex;
			justify-content: center;
			flex-direction: column;
		}
		.invite-form {
			max-width: 600px;
			margin: 0 auto;
			flex-direction: row;
			align-items: center;
		}

		.invite-form input {
			margin-right: 10px;
			margin-bottom: 0;
		}
	}
	::placeholder {
		/* Chrome, Firefox, Opera, Safari 10.1+ */
		color: var(--primary);
		opacity: 1; /* Firefox */
	}

	:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: var(--primary);
	}

	::-ms-input-placeholder {
		/* Microsoft Edge */
		color: var(--primary);
	}
</style>

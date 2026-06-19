<!-- src/lib/components/molecules/Email-Invite.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { notifications } from './notifications';
	import Envelope from '$lib/components/icons/envelope.svelte';

	export let cta: string = 'Who else needs to know about 9takes?';
	let email: string = '';
	let error: string = '';
	let formExtra = '';
	let formLoadTime = Date.now();

	onMount(() => {
		formLoadTime = Date.now();
	});

	const submit = async () => {
		if (!/\S+@\S+\.\S+/.test(email)) {
			//!/.+@.+/.test(email) ||
			error = 'must be a valid email';
			return;
		} else {
			error = '';
		}

		const body = new FormData();
		body.append('email', email);
		body.append('form_extra', formExtra);
		body.append('_timeToken', String(Date.now() - formLoadTime));

		try {
			const resp = await fetch('/api/signups', { method: 'POST', body });
			const result = (await resp.json()) as { ok: boolean; code?: string; message?: string };

			if (result.ok) {
				notifications.success('Email Submitted', 3000);
				email = '';
			} else if (result.code === 'already_exists') {
				notifications.warning('Already invited', 3000);
			} else {
				notifications.warning('Send Invite Failed', 3000);
			}
		} catch {
			notifications.warning('Send Invite Failed', 3000);
		}
	};
</script>

<div class="invite-section">
	<h3 style="margin-top: 0; text-align:center">{cta}</h3>
	<form class="invite-form">
		<div class="signup-honeypot" aria-hidden="true">
			<label for="email-invite-extra">Leave blank</label>
			<input
				id="email-invite-extra"
				name="form_extra"
				type="text"
				bind:value={formExtra}
				tabindex="-1"
				autocomplete="new-password"
			/>
		</div>
		<input type="email" id="email" name="email" bind:value={email} placeholder="you@example.com" />
		<button
			type="button"
			value="Send"
			on:click={submit}
			disabled={email.length ? false : true}
			class:form-send={true}
			class={email.length ? 'regular' : 'disabled'}
			>Invite
			<Envelope height={'1rem'} fill={'var(--lamp-glow)'} />
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

	.signup-honeypot {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
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
		color: var(--lamp-glow);
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
		color: var(--lamp-glow);
		opacity: 1; /* Firefox */
	}

	:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: var(--lamp-glow);
	}

	::-ms-input-placeholder {
		/* Microsoft Edge */
		color: var(--lamp-glow);
	}
</style>

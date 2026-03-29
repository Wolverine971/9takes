<!-- src/lib/components/molecules/Email-Signup.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import { notifications } from './notifications';

	export let cta: string = '';
	let email: string = '';
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

		const resp = await fetch(`/email?/submit`, {
			method: 'POST',
			body
		});

		const data = deserialize(await resp.text());

		if (!data?.error) {
			notifications.success('Email Submitted', 3000);
			notifications.info('Check and confirm your email', 6000);

			// goto('/signup');

			email = '';
		} else {
			if (data?.error?.message && data?.error?.message === 'Email already exists') {
				notifications.warning('Email already exists', 3000);
			} else {
				notifications.warning('Email Failed', 3000);
			}
		}
		loading = false;
	};
</script>

<div class="waitlist-section">
	<h2 style="margin-top: 0;">{cta || 'Join 9takes and go deeper with personality'}</h2>
	<p style="margin-top: 0;">
		Find out the similarities and differences<br /> between you and anyone
	</p>

	<!-- // Signup to get a sneak peak into what we are building -->
	<form class="waitlist-form">
		<button
			type="button"
			on:click={() => {
				goto('/register');
			}}
			class="corner-icon"
		>
			{#if loading}
				<div class="loader"></div>
			{:else}
				Sign up
			{/if}
		</button>
	</form>

	<!-- <h2 style="margin-top: 0;">Sign up for the 9takes Beta</h2>
	<p>9takes will be free for the first 1000 users</p>
	<form class="waitlist-form">
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
				Sign up
			{/if}
		</button>
	</form> -->
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.waitlist-section {
		text-align: center;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 30%, transparent);
		padding: 2rem;
		border-radius: 12px;
		background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-base) 100%);
		box-shadow: 0 0 20px rgba(45, 212, 191, 0.1);
	}
	.waitlist-section h2 {
		color: var(--text-primary);
	}
	.waitlist-section p {
		color: var(--text-secondary);
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
		border-radius: 8px;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 30%, transparent);
		background-color: var(--bg-elevated);
		color: var(--text-primary);
	}
	.waitlist-form input:focus {
		outline: none;
		border-color: var(--primary-dark);
		box-shadow: 0 0 10px rgba(45, 212, 191, 0.3);
	}
	.waitlist-form button {
		padding: 10px 20px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		color: white;
		background-color: var(--primary-dark);
		border: 1px solid var(--primary-dark);
		width: 155px;
		font-weight: 600;
		transition: all 0.2s ease;
		box-shadow: 0 0 15px rgba(45, 212, 191, 0.3);
	}
	.waitlist-form button:hover {
		background-color: var(--accent-dark);
		box-shadow: 0 0 25px rgba(45, 212, 191, 0.4);
		transform: translateY(-2px);
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
		color: var(--text-secondary);
		opacity: 1; /* Firefox */
	}

	:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: var(--text-secondary);
	}

	::-ms-input-placeholder {
		/* Microsoft Edge */
		color: var(--text-secondary);
	}
</style>

<!-- src/lib/components/molecules/Email-Signup.svelte -->
<script lang="ts">
	import { notifications } from './notifications';

	type SignupResponse = { ok: boolean; code?: string; message?: string };

	export let cta: string = 'Get 9takes updates in your inbox';
	export let description: string =
		'New personality guides, community questions, and ideas worth stealing.';

	let email: string = '';
	let error: string = '';
	let loading: boolean = false;

	const submit = async () => {
		if (loading) return;

		const normalizedEmail = email.trim().toLowerCase();
		if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
			error = 'Enter a valid email address';
			return;
		}

		error = '';
		loading = true;

		const body = new FormData();
		body.append('email', normalizedEmail);

		try {
			const resp = await fetch('/api/signups', { method: 'POST', body });
			const result = (await resp.json()) as SignupResponse;

			if (result.ok) {
				notifications.success("You're subscribed", 3000);
				notifications.info('Check your inbox for the welcome note.', 6000);
				email = '';
			} else if (result.code === 'already_exists') {
				notifications.warning('Already subscribed', 3000);
			} else {
				notifications.warning('Signup failed', 3000);
			}
		} catch {
			notifications.warning('Signup failed', 3000);
		} finally {
			loading = false;
		}
	};
</script>

<div class="waitlist-section">
	<h2>{cta}</h2>
	<p>{description}</p>

	<form class="waitlist-form" on:submit|preventDefault={submit}>
		<input
			type="email"
			id="email"
			name="email"
			bind:value={email}
			placeholder="you@example.com"
			autocomplete="email"
		/>
		<button type="submit" disabled={loading || !email.trim().length}>
			{#if loading}
				<div class="loader"></div>
			{:else}
				Subscribe
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
		border: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);
		padding: 2rem;
		border-radius: 12px;
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
		box-shadow: 0 0 20px rgba(45, 212, 191, 0.1);
	}
	.waitlist-section h2 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: var(--ink-bright);
	}
	.waitlist-section p {
		margin-top: 0;
		margin-bottom: 1.25rem;
		color: var(--ink-mid);
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
		border: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);
		background-color: var(--stone-warm);
		color: var(--ink-bright);
	}
	.waitlist-form input:focus {
		outline: none;
		border-color: var(--lamp-glow);
		box-shadow: 0 0 10px rgba(45, 212, 191, 0.3);
	}
	.waitlist-form button {
		padding: 10px 20px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		color: white;
		background-color: var(--lamp-glow);
		border: 1px solid var(--lamp-glow);
		width: 155px;
		font-weight: 600;
		transition: all 0.2s ease;
		box-shadow: 0 0 15px rgba(45, 212, 191, 0.3);
	}
	.waitlist-form button:disabled {
		cursor: not-allowed;
		opacity: 0.65;
		box-shadow: none;
	}
	.waitlist-form button:hover {
		background-color: var(--lamp-glow);
		box-shadow: 0 0 25px rgba(45, 212, 191, 0.4);
		transform: translateY(-2px);
	}
	.waitlist-form button:disabled:hover {
		background-color: var(--lamp-glow);
		box-shadow: none;
		transform: none;
	}
	.error {
		margin: 0.75rem 0 0;
		color: var(--warning);
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
		color: var(--ink-mid);
		opacity: 1;
	}

	:-ms-input-placeholder {
		color: var(--ink-mid);
	}

	::-ms-input-placeholder {
		color: var(--ink-mid);
	}
</style>

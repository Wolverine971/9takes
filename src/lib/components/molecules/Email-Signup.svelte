<!-- src/lib/components/molecules/Email-Signup.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/atoms';
	import { notifications } from './notifications';

	type SignupResponse = { ok: boolean; code?: string; message?: string };

	export let cta: string = 'Get 9takes updates in your inbox';
	export let description: string =
		'New personality guides, community questions, and ideas worth stealing.';
	export let embedded: boolean = false;

	let email: string = '';
	let error: string = '';
	let loading: boolean = false;
	let formExtra = '';
	let formLoadTime = Date.now();

	onMount(() => {
		formLoadTime = Date.now();
	});

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
		body.append('form_extra', formExtra);
		body.append('_timeToken', String(Date.now() - formLoadTime));

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

<div class={`waitlist-section${embedded ? ' waitlist-section--embedded' : ''}`}>
	{#if !embedded}
		<h2>{cta}</h2>
		<p>{description}</p>
	{/if}

	<form class="waitlist-form" on:submit|preventDefault={submit}>
		<div class="signup-honeypot" aria-hidden="true">
			<label for="email-signup-extra">Leave blank</label>
			<input
				id="email-signup-extra"
				name="form_extra"
				type="text"
				bind:value={formExtra}
				tabindex="-1"
				autocomplete="new-password"
			/>
		</div>
		<input
			type="email"
			id="email"
			name="email"
			bind:value={email}
			placeholder="you@example.com"
			autocomplete="email"
		/>
		<Button
			type="submit"
			{loading}
			disabled={loading || !email.trim().length}
			class="waitlist-submit"
		>
			Subscribe
		</Button>
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
		border-radius: 1rem;
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
		/* No static glow: borders are the elevation (V5) */
	}
	.waitlist-section--embedded {
		border: 0;
		padding: 0;
		background: transparent;
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

	.signup-honeypot {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.waitlist-form input {
		width: 100%;
		max-width: 300px;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);
		background-color: var(--stone-warm);
		color: var(--ink-bright);
	}
	.waitlist-form input:focus {
		outline: none;
		border-color: var(--lamp-glow);
		box-shadow: var(--glow-sm);
	}
	.waitlist-form :global(.waitlist-submit) {
		width: 155px;
	}
	.error {
		margin: 0.75rem 0 0;
		color: var(--error);
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

	@media only screen and (max-width: 767px) {
		.waitlist-form :global(.waitlist-submit) {
			width: 100%;
			max-width: 300px;
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

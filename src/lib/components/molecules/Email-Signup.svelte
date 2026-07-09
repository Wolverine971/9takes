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
	export let inputId: string = 'email-signup-address';

	let email: string = '';
	let error: string = '';
	let status: string = '';
	let loading: boolean = false;
	let formExtra = '';
	let formLoadTime = Date.now();
	const helpId = `${inputId}-help`;
	const errorId = `${inputId}-error`;
	const statusId = `${inputId}-status`;
	const honeypotId = `${inputId}-extra`;

	onMount(() => {
		formLoadTime = Date.now();
	});

	const submit = async () => {
		if (loading) return;

		const normalizedEmail = email.trim().toLowerCase();
		if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
			error = 'Enter a valid email address';
			status = '';
			return;
		}

		error = '';
		status = '';
		loading = true;

		const body = new FormData();
		body.append('email', normalizedEmail);
		body.append('form_extra', formExtra);
		body.append('_timeToken', String(Date.now() - formLoadTime));

		try {
			const resp = await fetch('/api/signups', { method: 'POST', body });
			const result = (await resp.json()) as SignupResponse;

			if (result.ok) {
				status = "You're subscribed. Check your inbox for the welcome note.";
				notifications.success("You're subscribed", 3000);
				notifications.info('Check your inbox for the welcome note.', 6000);
				email = '';
			} else if (result.code === 'already_exists') {
				status = 'That email address is already subscribed.';
				notifications.warning('Already subscribed', 3000);
			} else {
				error = result.message || 'We could not subscribe you. Please try again.';
				notifications.warning('Signup failed', 3000);
			}
		} catch {
			error = 'We could not subscribe you. Check your connection and try again.';
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

	<form
		class="waitlist-form"
		on:submit|preventDefault={submit}
		aria-label="Subscribe by email"
		aria-busy={loading}
		novalidate
	>
		<div class="signup-honeypot" aria-hidden="true">
			<label for={honeypotId}>Leave blank</label>
			<input
				id={honeypotId}
				name="form_extra"
				type="text"
				bind:value={formExtra}
				tabindex="-1"
				autocomplete="new-password"
			/>
		</div>
		<div class="email-field">
			<label class="field-label" for={inputId}>Email address</label>
			<input
				type="email"
				id={inputId}
				name="email"
				bind:value={email}
				on:input={() => {
					error = '';
					status = '';
				}}
				placeholder="you@example.com"
				autocomplete="email"
				required
				aria-invalid={error ? 'true' : 'false'}
				aria-describedby={error ? errorId : status ? statusId : helpId}
			/>
			<p class="field-help" id={helpId}>No spam. Unsubscribe whenever you want.</p>
		</div>
		<Button
			type="submit"
			size="lg"
			{loading}
			disabled={loading || !email.trim().length}
			class="waitlist-submit"
		>
			Subscribe
		</Button>
	</form>

	{#if error}
		<p class="error" id={errorId} role="alert">{error}</p>
	{:else if status}
		<p class="status" id={statusId} role="status">{status}</p>
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
		gap: 0.75rem;
		width: 100%;
	}

	.signup-honeypot {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.email-field {
		width: 100%;
		max-width: 300px;
		text-align: left;
	}
	.field-label {
		display: block;
		margin-bottom: 0.35rem;
		color: var(--ink-bright);
		font-size: 0.875rem;
		font-weight: 600;
	}
	.waitlist-form input {
		width: 100%;
		margin: 0;
		padding: 10px;
		border-radius: 0.625rem;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 30%, transparent);
		background-color: var(--stone-warm);
		color: var(--ink-bright);
	}
	.waitlist-form input[aria-invalid='true'] {
		border-color: var(--error);
	}
	.waitlist-form input:focus {
		outline: none;
		border-color: var(--lamp-glow);
		box-shadow: var(--glow-sm);
	}
	.waitlist-form :global(.waitlist-submit) {
		width: 155px;
	}
	.email-field .field-help {
		margin: 0.35rem 0 0;
		color: var(--ink-dim);
		font-size: 0.75rem;
		line-height: 1.4;
	}
	.waitlist-section .error,
	.waitlist-section .status {
		margin: 0.75rem 0 0;
		font-size: 0.875rem;
	}
	.waitlist-section .error {
		color: var(--error-text);
	}
	.waitlist-section .status {
		color: var(--success-text);
	}
	/* For tablets */
	@media only screen and (min-width: 768px) {
		.waitlist-form {
			max-width: 500px;
			margin: 0 auto;
		}
		.email-field {
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

		.email-field {
			flex: 1 1 auto;
			max-width: none;
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

<!-- src/routes/resetPassword/+page.svelte -->
<!--
  src/routes/resetPassword/+page.svelte
  Phase 5 #8 of docs/design/2026-05-04-rollout-plan.md — auth pages.
  Streetlamp Symposium V5: warm-stone surface, sodium-amber primary, Inter.
-->
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';
	import { Button } from '$lib/components/atoms';

	let { form }: { form: ActionData } = $props();

	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let showSuccessMessage = $state(false);

	const ogImage = 'https://9takes.com/greek_pantheon.png';

	// Handle password validation
	let passwordsMatch = $derived(!confirmPassword || password === confirmPassword);
	let isValidPassword = $derived(password.length >= 6);
	let canSubmit = $derived(
		!!password && !!confirmPassword && passwordsMatch && isValidPassword && !loading
	);

	// Handle redirecting to login after successful password reset
	$effect(() => {
		if (form?.success && !showSuccessMessage) {
			showSuccessMessage = true;
			// Redirect to login after 3 seconds
			setTimeout(() => {
				goto('/login');
			}, 3000);
		}
	});

	// Check if we have the hash fragment in the URL
	onMount(() => {
		// The Supabase client will handle the hash fragment automatically
		// We don't need to extract it manually
	});
</script>

<svelte:head>
	<title>9takes - Reset Password</title>
	<meta name="description" content="Reset your password for 9takes" />
	<meta name="robots" content="noindex, follow" />
	<link rel="canonical" href="https://9takes.com/resetPassword" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes - Reset Password" />
	<meta property="og:description" content="Reset your password for 9takes" />
	<meta property="og:url" content="https://9takes.com/resetPassword" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
</svelte:head>

<div class="auth-container">
	<h1 class="auth-title">Reset Password</h1>

	{#if form?.success || showSuccessMessage}
		<div class="success-message">
			<p>{form?.message || 'Password has been reset successfully!'}</p>
			<p>Redirecting to login page...</p>
		</div>
	{:else}
		<form
			action="?/resetPass"
			method="POST"
			class="auth-form"
			use:enhance={() => {
				loading = true;

				return async ({ result }) => {
					await applyAction(result);

					if (result.type === 'failure' || result.type === 'error') {
						loading = false;
					}
					// On success, keep loading while redirecting to login
				};
			}}
		>
			<div class="form-group">
				<label for="password" class="form-label">New Password</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					required
					minlength="6"
					class="form-input"
				/>
				{#if password && !isValidPassword}
					<div class="error-hint">Password must be at least 6 characters</div>
				{/if}
			</div>

			<div class="form-group">
				<label for="confirmPassword" class="form-label">Confirm Password</label>
				<input
					type="password"
					id="confirmPassword"
					bind:value={confirmPassword}
					required
					class="form-input"
				/>
				{#if confirmPassword && !passwordsMatch}
					<div class="error-hint">Passwords do not match</div>
				{/if}
			</div>

			{#if form?.error}
				<div class="error-message">
					{form.error}
				</div>
			{/if}

			<Button
				type="submit"
				variant="primary"
				size="lg"
				fullWidth
				{loading}
				disabled={!canSubmit}
				class="mt-2"
			>
				Reset Password
			</Button>
		</form>
	{/if}

	<div class="back-link">
		<a href="/login">Back to Login</a>
	</div>
</div>

<style lang="scss">
	/* Streetlamp Symposium — Reset Password form. */
	.auth-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		box-shadow: var(--shadow-lg);
	}

	.auth-title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--ink-bright);
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--ink-mid);
	}

	.form-input {
		padding: 0.75rem;
		background-color: var(--night-deep);
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		font-size: 1rem;
		color: var(--ink-bright);
		transition: all 0.3s ease;

		&::placeholder {
			color: var(--ink-dim);
		}

		&:focus {
			outline: none;
			border-color: var(--lamp-glow);
			box-shadow: var(--glow-sm);
			background: var(--stone-warm);
		}
	}

	.success-message {
		padding: 1rem;
		margin-bottom: 1rem;
		background-color: color-mix(in srgb, var(--data-teal) 10%, var(--stone-warm));
		border: 1px solid color-mix(in srgb, var(--data-teal) 35%, transparent);
		border-radius: 0.625rem;
		color: var(--ink-bright);
		text-align: center;

		p {
			margin: 0.25rem 0;
		}
	}

	.error-message {
		padding: 0.75rem 0.9rem;
		font-size: 0.9rem;
		color: var(--error);
		background: color-mix(in srgb, var(--error) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--error) 28%, transparent);
		border-radius: 0.625rem;
	}

	.error-hint {
		margin-top: 0.25rem;
		font-size: 0.85rem;
		color: var(--error);
	}

	.back-link {
		text-align: center;
		margin-top: 1rem;

		a {
			color: var(--lamp-glow);
			text-decoration: none;
			font-size: 0.9rem;
			transition: all 0.3s ease;

			&:hover {
				color: var(--ink-bright);
				text-decoration: underline;
			}
		}
	}

	@media (max-width: 480px) {
		.auth-container {
			margin: 1rem auto;
			padding: 1.5rem;
		}

		.auth-title {
			font-size: 1.2rem;
		}
	}
</style>

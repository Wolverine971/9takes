<!-- src/routes/resetPassword/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';
	import LoadingButton from '$lib/components/atoms/LoadingButton.svelte';

	export let form: ActionData;

	let password = '';
	let confirmPassword = '';
	let loading = false;
	let passwordsMatch = true;
	let showSuccessMessage = false;

	const ogImage = 'https://9takes.com/greek_pantheon.png';

	// Handle password validation
	$: passwordsMatch = !confirmPassword || password === confirmPassword;
	$: isValidPassword = password.length >= 6;
	$: canSubmit = password && confirmPassword && passwordsMatch && isValidPassword && !loading;

	// Handle redirecting to login after successful password reset
	$: if (form?.success && !showSuccessMessage) {
		showSuccessMessage = true;
		// Redirect to login after 3 seconds
		setTimeout(() => {
			goto('/login');
		}, 3000);
	}

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
					if (result.type === 'failure') {
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

			<LoadingButton
				type="submit"
				variant="primary"
				size="lg"
				fullWidth
				{loading}
				disabled={!canSubmit}
				loadingText="Resetting Password..."
				className="mt-2"
			>
				Reset Password
			</LoadingButton>
		</form>
	{/if}

	<div class="back-link">
		<a href="/login">Back to Login</a>
	</div>
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme */
	.auth-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-soft) 28%, transparent) 0%,
				transparent 42%
			),
			color-mix(in srgb, var(--bg-surface) 94%, var(--bg-base));
		border: 1px solid color-mix(in srgb, var(--accent) 16%, var(--border-color));
		border-radius: 1rem;
		box-shadow: var(--shadow-lg);
	}

	.auth-title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--text-primary);
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
		color: var(--text-secondary);
	}

	.form-input {
		padding: 0.75rem;
		background-color: color-mix(in srgb, var(--bg-surface) 90%, var(--bg-base));
		border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--border-color));
		border-radius: 0.9rem;
		font-size: 1rem;
		color: var(--text-primary);
		transition: all 0.3s ease;

		&::placeholder {
			color: var(--text-tertiary);
		}

		&:focus {
			outline: none;
			border-color: var(--primary);
			box-shadow: var(--glow-sm);
			background: var(--bg-surface);
		}
	}

	.success-message {
		padding: 1rem;
		margin-bottom: 1rem;
		background-color: color-mix(in srgb, var(--success-light) 88%, var(--bg-surface));
		border: 1px solid color-mix(in srgb, var(--success-border) 72%, transparent);
		border-radius: 0.9rem;
		color: var(--success-text);
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
		border-radius: 0.85rem;
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
			color: var(--primary);
			text-decoration: none;
			font-size: 0.9rem;
			transition: all 0.3s ease;

			&:hover {
				color: var(--text-primary);
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

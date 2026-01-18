<!-- src/routes/resetPassword/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let password = '';
	let confirmPassword = '';
	let submitting = false;
	let passwordsMatch = true;
	let showSuccessMessage = false;

	const ogImage = 'https://9takes.com/greek_pantheon.png';

	// Handle password validation
	$: passwordsMatch = !confirmPassword || password === confirmPassword;
	$: isValidPassword = password.length >= 6;
	$: canSubmit = password && confirmPassword && passwordsMatch && isValidPassword && !submitting;

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
				submitting = true;

				return async ({ result }) => {
					submitting = false;
					// Form state is automatically updated
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

			<button type="submit" class="submit-btn" disabled={!canSubmit}>
				{submitting ? 'Resetting Password...' : 'Reset Password'}
			</button>
		</form>
	{/if}

	<div class="back-link">
		<a href="/login">Back to Login</a>
	</div>
</div>

<style lang="scss">
	/* Solo Leveling Dark Theme */
	.auth-container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		background-color: #1a1a2e;
		border: 1px solid rgba(100, 116, 139, 0.2);
		border-radius: 12px;
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
	}

	.auth-title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: #a78bfa;
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
		color: #cbd5e1;
	}

	.form-input {
		padding: 0.75rem;
		background-color: #252538;
		border: 1px solid rgba(100, 116, 139, 0.3);
		border-radius: 8px;
		font-size: 1rem;
		color: #f1f5f9;
		transition: all 0.3s ease;

		&::placeholder {
			color: #64748b;
		}

		&:focus {
			outline: none;
			border-color: #7c3aed;
			box-shadow: 0 0 10px rgba(124, 58, 237, 0.3);
		}
	}

	.success-message {
		padding: 1rem;
		margin-bottom: 1rem;
		background-color: rgba(16, 185, 129, 0.15);
		border: 1px solid rgba(16, 185, 129, 0.3);
		border-radius: 8px;
		color: #10b981;
		text-align: center;

		p {
			margin: 0.25rem 0;
		}
	}

	.error-message {
		padding: 0.5rem;
		font-size: 0.9rem;
		color: #ef4444;
	}

	.error-hint {
		margin-top: 0.25rem;
		font-size: 0.85rem;
		color: #ef4444;
	}

	.submit-btn {
		width: 100%;
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, #7c3aed, #6d28d9);
		border: none;
		border-radius: 8px;
		color: white;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;

		&:hover:not(:disabled) {
			box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
			transform: translateY(-2px);
		}

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}
	}

	.back-link {
		text-align: center;
		margin-top: 1rem;

		a {
			color: #a78bfa;
			text-decoration: none;
			font-size: 0.9rem;
			transition: all 0.3s ease;

			&:hover {
				color: #c4b5fd;
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

		.submit-btn {
			width: 100%;
		}
	}
</style>

<!-- src/routes/resetPassword/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
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

<div class="container">
	<h1 class="title">Reset Password</h1>

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
				<label for="password">New Password</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					required
					minlength="6"
				/>
				{#if password && !isValidPassword}
					<div class="error-message">Password must be at least 6 characters</div>
				{/if}
			</div>

			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<input type="password" id="confirmPassword" bind:value={confirmPassword} required />
				{#if confirmPassword && !passwordsMatch}
					<div class="error-message">Passwords do not match</div>
				{/if}
			</div>

			{#if form?.error}
				<div class="error-message">
					{form.error}
				</div>
			{/if}

			<button type="submit" class="btn btn-primary" disabled={!canSubmit}>
				{submitting ? 'Resetting Password...' : 'Reset Password'}
			</button>
		</form>
	{/if}

	<div class="back-to-login">
		<a href="/login">Back to Login</a>
	</div>
</div>

<style lang="scss">
	:root {
		--primary-dark: color-mix(in srgb, var(--primary) 90%, black);
	}

	.container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 1rem;
	}

	.title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.5rem;
		color: var(--primary);
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

	label {
		font-weight: bold;
	}

	input {
		padding: 0.5rem;
		border: 1px solid var(--accent);
		border-radius: 4px;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s;

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}

		&.btn-primary {
			background-color: var(--primary);
			color: white;

			&:hover:not(:disabled) {
				background-color: var(--primary-dark);
			}
		}
	}

	.back-to-login {
		text-align: center;
		margin-top: 1rem;

		a {
			color: var(--primary);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.error-message {
		color: #e74c3c;
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}

	.success-message {
		background-color: #d4edda;
		color: #155724;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
		text-align: center;
	}

	@media (max-width: 480px) {
		.container {
			padding: 1rem 0.5rem;
		}

		.title {
			font-size: 1.2rem;
		}

		.btn {
			width: 100%;
		}
	}
</style>

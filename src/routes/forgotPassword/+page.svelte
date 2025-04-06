<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let email = '';
	let submitting = false;

	const ogImage = 'https://9takes.com/greek_pantheon.png';
</script>

<svelte:head>
	<title>9takes Forgot Password Page</title>
	<meta name="description" content="Reset your password for 9takes" />
	<link rel="canonical" href="https://9takes.com/forgotPassword" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes - Forgot Password Page" />
	<meta property="og:description" content="Reset your password for 9takes" />
	<meta property="og:url" content="https://9takes.com/forgotPassword" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
</svelte:head>

<div class="container">
	<h1 class="title">Forgot Password</h1>

	{#if form?.success}
		<div class="success-message">
			{form.message}
		</div>
	{:else}
		<form
			action="?/forgotPass"
			method="POST"
			class="auth-form"
			use:enhance={() => {
				submitting = true;

				return async ({ result }) => {
					submitting = false;
					// The form is automatically updated with the result
				};
			}}
		>
			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" bind:value={email} required />
			</div>

			{#if form?.error}
				<div class="error-message">
					{form.error}
				</div>
			{/if}

			<button type="submit" class="btn btn-primary" disabled={submitting}>
				{submitting ? 'Sending...' : 'Reset Password'}
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
		margin-bottom: 0.5rem;
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

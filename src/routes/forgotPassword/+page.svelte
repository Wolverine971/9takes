<!-- src/routes/forgotPassword/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { ActionData } from './$types';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';

	export let form: ActionData;

	let email = '';
	let submitting = false;

	onMount(() => {
		if (browser && !document.getElementById('recaptcha-script')) {
			const script = document.createElement('script');
			script.id = 'recaptcha-script';
			script.src = 'https://www.google.com/recaptcha/api.js';
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		}
	});

	function resetRecaptcha() {
		if (browser && window.grecaptcha) {
			window.grecaptcha.reset();
		}
	}

	function handleSubmit() {
		submitting = true;
		return async ({ result }: { result: { type: string } }) => {
			submitting = false;
			// Reset reCAPTCHA on failure so user can try again
			if (result.type === 'failure') {
				resetRecaptcha();
			}
		};
	}

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

<div class="auth-container">
	<h1 class="auth-title">Forgot Password</h1>

	{#if form?.success}
		<div class="success-message">
			{form.message}
		</div>
	{:else}
		<form action="?/forgotPass" method="POST" class="auth-form" use:enhance={handleSubmit}>
			<div class="form-group">
				<label for="email" class="form-label">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					required
					class="form-input"
				/>
			</div>

			{#if form?.error}
				<div class="error-message">
					{form.error}
				</div>
			{/if}

			<!-- Honeypot field - hidden from real users, bots will fill it -->
			<div class="absolute -left-[9999px] opacity-0" aria-hidden="true">
				<label for="company">Company</label>
				<input type="text" id="company" name="company" tabindex="-1" autocomplete="off" />
			</div>

			<!-- Google reCAPTCHA -->
			<div class="g-recaptcha" data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY} data-theme="dark"></div>

			<button type="submit" class="submit-btn" disabled={submitting}>
				{submitting ? 'Sending...' : 'Reset Password'}
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
	}

	.error-message {
		padding: 0.5rem;
		font-size: 0.9rem;
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

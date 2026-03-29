<!-- src/routes/forgotPassword/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { ActionData } from './$types';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import LoadingButton from '$lib/components/atoms/LoadingButton.svelte';

	export let form: ActionData;

	let email = '';
	let loading = false;
	let recaptchaTheme: 'light' | 'dark' = 'dark';

	function syncRecaptchaTheme() {
		if (!browser) return;
		recaptchaTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
	}

	onMount(() => {
		syncRecaptchaTheme();
		const observer = new MutationObserver(() => {
			syncRecaptchaTheme();
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'data-theme']
		});

		if (browser && !document.getElementById('recaptcha-script')) {
			const script = document.createElement('script');
			script.id = 'recaptcha-script';
			script.src = 'https://www.google.com/recaptcha/api.js';
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);
		}

		return () => observer.disconnect();
	});

	function resetRecaptcha() {
		if (browser && window.grecaptcha) {
			window.grecaptcha.reset();
		}
	}

	function handleSubmit() {
		loading = true;
		return async ({ result }: { result: { type: string } }) => {
			// On success, keep loading briefly then show success message
			if (result.type === 'success') {
				loading = false;
			} else if (result.type === 'failure') {
				loading = false;
				// Reset reCAPTCHA on failure so user can try again
				resetRecaptcha();
			}
		};
	}

	const ogImage = 'https://9takes.com/greek_pantheon.png';
</script>

<svelte:head>
	<title>9takes Forgot Password Page</title>
	<meta name="description" content="Reset your password for 9takes" />
	<meta name="robots" content="noindex, follow" />
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
			<div
				class="g-recaptcha"
				data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
				data-theme={recaptchaTheme}
			></div>

			<LoadingButton
				type="submit"
				variant="primary"
				size="lg"
				fullWidth
				{loading}
				loadingText="Sending..."
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
		background-color: var(--bg-surface);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		border-radius: 12px;
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
	}

	.auth-title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--accent-light);
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
		color: var(--neutral-700);
	}

	.form-input {
		padding: 0.75rem;
		background-color: var(--bg-elevated);
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 30%, transparent);
		border-radius: 8px;
		font-size: 1rem;
		color: var(--text-primary);
		transition: all 0.3s ease;

		&::placeholder {
			color: var(--text-tertiary);
		}

		&:focus {
			outline: none;
			border-color: var(--primary-dark);
			box-shadow: 0 0 10px rgba(45, 212, 191, 0.3);
		}
	}

	.success-message {
		padding: 1rem;
		margin-bottom: 1rem;
		background-color: var(--success-light);
		border: 1px solid var(--success-border);
		border-radius: 8px;
		color: var(--success-text);
		text-align: center;
	}

	.error-message {
		padding: 0.5rem;
		font-size: 0.9rem;
		color: var(--error);
	}

	.back-link {
		text-align: center;
		margin-top: 1rem;

		a {
			color: var(--accent-light);
			text-decoration: none;
			font-size: 0.9rem;
			transition: all 0.3s ease;

			&:hover {
				color: var(--primary-lightest);
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

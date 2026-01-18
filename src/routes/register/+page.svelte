<!-- src/routes/register/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { notifications } from '$lib/components/molecules/notifications';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';

	let email = '';
	let password = '';
	let loading = false;
	let recaptchaLoaded = false;

	onMount(() => {
		if (browser && !document.getElementById('recaptcha-script')) {
			const script = document.createElement('script');
			script.id = 'recaptcha-script';
			script.src = 'https://www.google.com/recaptcha/api.js';
			script.async = true;
			script.defer = true;
			script.onload = () => {
				recaptchaLoaded = true;
			};
			document.head.appendChild(script);
		} else if (browser) {
			recaptchaLoaded = true;
		}
	});

	function resetRecaptcha() {
		if (browser && window.grecaptcha) {
			window.grecaptcha.reset();
		}
	}

	function handleSubmit() {
		loading = true;
		return async ({ result }: { result: { type: string; data?: { error?: string } } }) => {
			loading = false;
			if (result.type === 'success') {
				notifications.success('Registration successful! Please check your email.', 6000);
				goto('/login');
				invalidateAll();
			} else if (result.type === 'failure') {
				notifications.danger(result.data?.error || 'An error occurred', 3000);
				// Reset reCAPTCHA so user can try again
				resetRecaptcha();
			}
		};
	}
	const ogImage = 'https://9takes.com/greek_pantheon.png';
</script>

<svelte:head>
	<title>9takes Registration</title>
	<meta name="description" content="Register for a good time" />
	<link rel="canonical" href="https://9takes.com/register" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes - Registration" />
	<meta property="og:description" content="Register for a good time" />
	<meta property="og:url" content="https://9takes.com/register" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
</svelte:head>

<div class="auth-container" in:fade={{ duration: 300 }}>
	<h1 class="auth-title" in:fly={{ y: -20, duration: 300, delay: 150 }}>
		<a href="/login" class="inactive-link">Login</a>
		/
		<span class="active-link">Register</span>
	</h1>
	<form
		action="?/register"
		method="POST"
		class="auth-form"
		use:enhance={handleSubmit}
		in:fly={{ y: 20, duration: 300, delay: 300 }}
	>
		<div class="form-group">
			<label for="email" class="form-label">Email</label>
			<input type="email" id="email" name="email" bind:value={email} required class="form-input" />
		</div>
		<div class="form-group">
			<label for="password" class="form-label">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				bind:value={password}
				required
				class="form-input"
			/>
		</div>

		<!-- Honeypot field - hidden from real users, bots will fill it -->
		<div class="absolute -left-[9999px] opacity-0" aria-hidden="true">
			<label for="website">Website</label>
			<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
		</div>

		<!-- Google reCAPTCHA -->
		<div class="g-recaptcha" data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY} data-theme="dark"></div>

		<button type="submit" class="submit-btn" disabled={loading}>
			{#if loading}
				<span class="loader"></span>
			{:else}
				Register
			{/if}
		</button>
	</form>
	<div class="forgot-link" in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<a href="/forgotPassword">Forgot Password?</a>
	</div>
</div>

<style lang="scss">
	/* Solo Leveling Dark Theme */
	.auth-container {
		max-width: 400px;
		margin: 3rem auto;
		padding: 2rem;
		background-color: #1a1a2e;
		border: 1px solid rgba(100, 116, 139, 0.2);
		border-radius: 12px;
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
	}

	.auth-title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.8rem;
		font-weight: bold;
		color: #f1f5f9;
	}

	.active-link {
		color: #a78bfa;
		border-bottom: 2px solid #7c3aed;
		padding-bottom: 4px;
	}

	.inactive-link {
		color: #94a3b8;
		text-decoration: none;
		opacity: 0.7;
		transition: all 0.3s ease;

		&:hover {
			opacity: 1;
			color: #f1f5f9;
		}
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
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
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover:not(:disabled) {
			box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
			transform: translateY(-2px);
		}

		&:active:not(:disabled) {
			transform: translateY(0);
		}

		&:disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}
	}

	.loader {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.forgot-link {
		text-align: center;
		margin-top: 1.5rem;

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
			font-size: 1.5rem;
		}

		.form-input,
		.submit-btn {
			font-size: 0.9rem;
		}
	}
</style>

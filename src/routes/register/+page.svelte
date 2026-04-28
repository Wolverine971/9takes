<!-- src/routes/register/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import { notifications } from '$lib/components/molecules/notifications';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import LoadingButton from '$lib/components/atoms/LoadingButton.svelte';
	import {
		ensureRecaptchaLoaded,
		reloadRecaptchaWidget,
		renderRecaptchaWidget
	} from '$lib/utils/recaptchaClient';
	import type { PageData } from './$types';

	export let data: PageData;

	let email = '';
	let password = '';
	let loading = false;
	let captchaRequired = data.captchaRequired ?? false;
	let recaptchaTheme: 'light' | 'dark' = 'dark';
	let captchaContainer: HTMLDivElement | null = null;
	let captchaWidgetId: number | null = null;

	function syncRecaptchaTheme() {
		if (!browser) return;
		recaptchaTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
	}

	async function mountRecaptcha() {
		if (!browser || !captchaRequired || !captchaContainer) {
			return;
		}

		await tick();
		await ensureRecaptchaLoaded();
		const widgetId = renderRecaptchaWidget({
			container: captchaContainer,
			siteKey: PUBLIC_RECAPTCHA_SITE_KEY,
			theme: recaptchaTheme
		});

		if (widgetId !== null) {
			captchaWidgetId = widgetId;
		}
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

		void mountRecaptcha();

		return () => observer.disconnect();
	});

	async function refreshRecaptcha() {
		const widgetId = await reloadRecaptchaWidget({
			container: captchaContainer,
			siteKey: PUBLIC_RECAPTCHA_SITE_KEY,
			theme: recaptchaTheme
		});

		captchaWidgetId = widgetId;
	}

	function handleSubmit() {
		loading = true;
		return async ({
			result
		}: {
			result: { type: string; data?: { error?: string; captchaRequired?: boolean } };
		}) => {
			if (result.type === 'success') {
				notifications.success('Registration successful! Please check your email.', 6000);
				// Keep loading=true during navigation
				await goto('/login');
				await invalidateAll();
				// loading stays true since we're navigating away
				return;
			}

			if (result.type === 'failure') {
				captchaRequired = !!result.data?.captchaRequired || captchaRequired;
				notifications.danger(result.data?.error || 'An error occurred', 3000);
			} else if (result.type === 'error') {
				notifications.danger('An unexpected error occurred. Please try again.', 3000);
			}

			if (captchaRequired) {
				await refreshRecaptcha();
			}

			loading = false;
		};
	}

	$: if (captchaRequired && captchaContainer) {
		void mountRecaptcha();
	}

	const ogImage = 'https://9takes.com/greek_pantheon.png';
</script>

<svelte:head>
	<title>9takes Registration</title>
	<meta name="description" content="Register for a good time" />
	<meta name="robots" content="noindex, follow" />
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

		{#if captchaRequired}
			<div bind:this={captchaContainer}></div>
		{/if}

		<LoadingButton
			type="submit"
			variant="primary"
			size="lg"
			fullWidth
			{loading}
			loadingText="Creating account..."
			className="mt-2"
		>
			Register
		</LoadingButton>
	</form>
	<div class="forgot-link" in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<a href="/forgotPassword">Forgot Password?</a>
	</div>
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme */
	.auth-container {
		max-width: 400px;
		margin: 3rem auto;
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
		font-size: 1.8rem;
		font-weight: bold;
		color: var(--text-primary);
	}

	.active-link {
		color: var(--primary);
		border-bottom: 2px solid var(--primary);
		padding-bottom: 4px;
	}

	.inactive-link {
		color: var(--text-secondary);
		text-decoration: none;
		opacity: 0.7;
		transition: all 0.3s ease;

		&:hover {
			opacity: 1;
			color: var(--primary);
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

	.forgot-link {
		text-align: center;
		margin-top: 1.5rem;

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
			font-size: 1.5rem;
		}
	}
</style>

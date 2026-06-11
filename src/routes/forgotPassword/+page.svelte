<!-- src/routes/forgotPassword/+page.svelte -->
<!--
  src/routes/forgotPassword/+page.svelte
  Phase 5 #8 of docs/design/2026-05-04-rollout-plan.md — auth pages.
  Streetlamp Symposium V5: warm-stone surface, sodium-amber primary, Inter.
-->
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import type { ActionData } from './$types';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { Button } from '$lib/components/atoms';
	import {
		ensureRecaptchaLoaded,
		reloadRecaptchaWidget,
		renderRecaptchaWidget
	} from '$lib/utils/recaptchaClient';

	let { form }: { form: ActionData } = $props();

	let email = $state('');
	let loading = $state(false);
	let recaptchaTheme = $state<'light' | 'dark'>('dark');
	let captchaContainer = $state<HTMLDivElement | null>(null);
	let captchaWidgetId: number | null = null;

	function syncRecaptchaTheme() {
		if (!browser) return;
		recaptchaTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
	}

	async function mountRecaptcha() {
		if (!browser || !captchaContainer) {
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
		return async ({ result }: { result: ActionResult }) => {
			await applyAction(result);

			if (result.type === 'failure') {
				await refreshRecaptcha();
			}

			loading = false;
		};
	}

	$effect(() => {
		if (captchaContainer) {
			void mountRecaptcha();
		}
	});

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
					autocomplete="email"
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

			<div bind:this={captchaContainer}></div>

			<Button type="submit" variant="primary" size="lg" fullWidth {loading} class="mt-2">
				Reset Password
			</Button>
		</form>
	{/if}

	<div class="back-link">
		<a href="/login">Back to Login</a>
	</div>
</div>

<style lang="scss">
	/* Streetlamp Symposium — Forgot Password form. */
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
	}

	.error-message {
		padding: 0.75rem 0.9rem;
		font-size: 0.9rem;
		color: var(--error);
		background: color-mix(in srgb, var(--error) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--error) 28%, transparent);
		border-radius: 0.625rem;
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

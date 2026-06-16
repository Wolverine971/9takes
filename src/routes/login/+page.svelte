<!-- src/routes/login/+page.svelte -->
<!--
  src/routes/login/+page.svelte
  Phase 5 #8 of docs/design/2026-05-04-rollout-plan.md — auth pages.
  Streetlamp Symposium V5: warm-stone surface, sodium-amber primary, Inter.
  Spec: docs/design-system.md §4–§6.
-->
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { Button } from '$lib/components/atoms';
	import {
		ensureRecaptchaLoaded,
		reloadRecaptchaWidget,
		renderRecaptchaWidget
	} from '$lib/utils/recaptchaClient';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let email = $state('');
	let password = $state('');
	let captchaRequired = $state(data.captchaRequired ?? false);
	let recaptchaTheme = $state<'light' | 'dark'>('dark');
	let captchaContainer = $state<HTMLDivElement | null>(null);
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

	async function refreshRecaptcha() {
		const widgetId = await reloadRecaptchaWidget({
			container: captchaContainer,
			siteKey: PUBLIC_RECAPTCHA_SITE_KEY,
			theme: recaptchaTheme
		});

		captchaWidgetId = widgetId;
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

	$effect(() => {
		if (captchaRequired && captchaContainer) {
			void mountRecaptcha();
		}
	});

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			if (result.type === 'failure') {
				captchaRequired = !!result.data?.captchaRequired || captchaRequired;
				notifications.danger(result.data?.error || 'An error occurred', 3000);
			} else if (result.type === 'success') {
				// Keep loading=true during navigation - rerun all `load` functions
				await invalidateAll();
			}

			await applyAction(result);

			if (result.type === 'failure' && captchaRequired) {
				await refreshRecaptcha();
			}

			// Only reset loading if we're still on this page (e.g., no redirect happened)
			loading = false;
		};
	};
	const ogImage = 'https://9takes.com/greek_pantheon.png';
</script>

<svelte:head>
	<title>9takes Login</title>
	<meta name="description" content="Login for a good time" />
	<meta name="robots" content="noindex, follow" />
	<link rel="canonical" href="https://9takes.com/login" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes - Login" />
	<meta property="og:description" content="Login for a good time" />
	<meta property="og:url" content="https://9takes.com/login" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
</svelte:head>

<div class="container" in:fade={{ duration: 300 }}>
	<h1 class="title" in:fly={{ y: -20, duration: 300, delay: 150 }}>
		<span class="active">Login</span> /
		<a href="/register" class="inactive">Register</a>
	</h1>
	{#if data.confirmationError}
		<div class="confirm-error" role="alert">
			That confirmation link is invalid or has expired. Try logging in, or register again to get a
			new link.
		</div>
	{/if}
	<form
		action="?/login"
		method="POST"
		class="auth-form"
		use:enhance={handleSubmit}
		in:fly={{ y: 20, duration: 300, delay: 300 }}
	>
		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				bind:value={email}
				required
				autocomplete="email"
			/>
		</div>
		<div class="form-group">
			<label for="password">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				bind:value={password}
				required
				autocomplete="current-password"
			/>
		</div>
		{#if captchaRequired}
			<div bind:this={captchaContainer}></div>
		{/if}
		<Button type="submit" variant="primary" size="lg" fullWidth {loading} class="mt-4">
			Login
		</Button>
	</form>
	<div class="forgot-password" in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<a href="/forgotPassword">Forgot Password?</a>
	</div>
</div>

<style lang="scss">
	/* Streetlamp Symposium — Login form. */
	.container {
		max-width: 400px;
		margin: 3rem auto;
		padding: 2rem;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		box-shadow: var(--shadow-lg);
		min-height: auto;
	}

	.title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.8rem;
		font-weight: bold;
		color: var(--ink-bright);

		.active {
			color: var(--lamp-glow);
			border-bottom: 2px solid var(--lamp-glow);
			padding-bottom: 4px;
		}

		.inactive {
			color: var(--ink-mid);
			text-decoration: none;
			opacity: 0.7;
			transition: all 0.3s ease;

			&:hover {
				opacity: 1;
				color: var(--lamp-glow);
			}
		}
	}

	.confirm-error {
		margin-bottom: 1.5rem;
		padding: 0.75rem 0.9rem;
		font-size: 0.9rem;
		color: var(--error);
		background: color-mix(in srgb, var(--error) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--error) 28%, transparent);
		border-radius: 0.625rem;
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

	label {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--ink-mid);
	}

	input {
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

	.forgot-password {
		text-align: center;
		margin-top: 1.5rem;

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
		.container {
			margin: 1rem auto;
			padding: 1.5rem;
		}

		.title {
			font-size: 1.5rem;
		}
	}
</style>

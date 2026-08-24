<!-- src/routes/register/+page.svelte -->
<!--
  src/routes/register/+page.svelte
  Phase 5 #8 of docs/design/2026-05-04-rollout-plan.md — auth pages.
  Streetlamp Symposium V5: warm-stone surface, sodium-amber primary, Inter.
-->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { onMount, tick, untrack } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { notifications } from '$lib/components/molecules/notifications';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { Button, Field, Input, Select } from '$lib/components/atoms';
	import CaptchaFrame from '$lib/components/molecules/CaptchaFrame.svelte';
	import {
		ensureRecaptchaLoaded,
		reloadRecaptchaWidget,
		renderRecaptchaWidget
	} from '$lib/utils/recaptchaClient';
	import type { PageData } from './$types';
	import {
		clearStoredEnneagramType,
		readStoredEnneagramType
	} from '$lib/enneagram/selfReportedType';

	let { data }: { data: PageData } = $props();

	let email = $state('');
	let password = $state('');
	let enneagram = $state('');
	let loading = $state(false);
	let formError = $state('');

	// Mirror the server's zod schema so requirements are visible up front
	// instead of being discovered one toast at a time (2026-06-11 mobile audit).
	let passwordChecks = $derived({
		length: password.length >= 8,
		upper: /[A-Z]/.test(password),
		lower: /[a-z]/.test(password),
		number: /[0-9]/.test(password)
	});
	let captchaRequired = $state(untrack(() => data.captchaRequired ?? false));
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

	onMount(() => {
		const storedType = readStoredEnneagramType();
		if (!enneagram && storedType) enneagram = String(storedType);

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
		formError = '';
		return async ({
			result
		}: {
			result: { type: string; data?: { error?: string; captchaRequired?: boolean } };
		}) => {
			if (result.type === 'success') {
				clearStoredEnneagramType();
				notifications.success('Account created! Please check your email.', 6000);
				// Keep loading=true during navigation
				await goto(resolve('/login'));
				await invalidateAll();
				// loading stays true since we're navigating away
				return;
			}

			if (result.type === 'failure') {
				captchaRequired = !!result.data?.captchaRequired || captchaRequired;
				// Inline (persistent) + toast: a 3s toast alone is too easy to
				// miss on mobile for the highest-value form on the site.
				formError = result.data?.error || 'An error occurred';
				notifications.danger(formError, 3000);
			} else if (result.type === 'error') {
				formError = 'An unexpected error occurred. Please try again.';
				notifications.danger(formError, 3000);
			}

			if (captchaRequired) {
				await refreshRecaptcha();
			}

			loading = false;
		};
	}

	$effect(() => {
		if (captchaRequired && captchaContainer) {
			void mountRecaptcha();
		}
	});

	const ogImage = 'https://9takes.com/images/home-reimagined/streetlamp-nine.webp';
</script>

<svelte:head>
	<title>Create your account | 9takes</title>
	<meta
		name="description"
		content="Answering is anonymous and needs no account. An account keeps your takes, your type, and the questions you follow in one place."
	/>
	<meta name="robots" content="noindex, follow" />
	<link rel="canonical" href="https://9takes.com/register" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="Create your account | 9takes" />
	<meta
		property="og:description"
		content="Answering is anonymous and needs no account. An account keeps your takes, your type, and the questions you follow in one place."
	/>
	<meta property="og:url" content="https://9takes.com/register" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/webp" />
</svelte:head>

<div class="auth-container" in:fade={{ duration: 300 }}>
	<h1 class="auth-title" in:fly={{ y: -20, duration: 300, delay: 150 }}>Sign up</h1>
	<p class="auth-lede" in:fly={{ y: -12, duration: 300, delay: 180 }}>
		Answering stays anonymous, no account needed. An account keeps your takes, your type, and the
		questions you follow in one place.
	</p>
	<p class="auth-switch" in:fly={{ y: -12, duration: 300, delay: 200 }}>
		Already have an account? <a href={resolve('/login')}>Log in</a>
	</p>
	<form
		action="?/register"
		method="POST"
		class="auth-form"
		use:enhance={handleSubmit}
		in:fly={{ y: 20, duration: 300, delay: 300 }}
	>
		<Field for="email" label="Email" required>
			<Input
				type="email"
				id="email"
				name="email"
				bind:value={email}
				required
				autocomplete="email"
				inputmode="email"
			/>
		</Field>
		<Field for="password" label="Password" required>
			<Input
				type="password"
				id="password"
				name="password"
				bind:value={password}
				required
				minlength={8}
				autocomplete="new-password"
				aria-describedby="password-requirements"
			/>
			<ul id="password-requirements" class="password-hints" aria-label="Password requirements">
				<li class:met={passwordChecks.length}>8+ characters</li>
				<li class:met={passwordChecks.upper}>uppercase</li>
				<li class:met={passwordChecks.lower}>lowercase</li>
				<li class:met={passwordChecks.number}>number</li>
			</ul>
		</Field>
		<Field for="enneagram" label="Enneagram type" optional>
			<Select id="enneagram" name="enneagram" bind:value={enneagram}>
				<option value="">Not sure yet</option>
				{#each Array.from({ length: 9 }, (_, index) => index + 1) as type (type)}
					<option value={String(type)}>Type {type}</option>
				{/each}
			</Select>
			<p class="type-help">Optional. Add it now so your future takes can carry the right lens.</p>
		</Field>

		{#if formError}
			<div class="error-message" role="alert">{formError}</div>
		{/if}

		<!-- Honeypot field - hidden from real users, bots will fill it -->
		<div class="absolute -left-[9999px] opacity-0" aria-hidden="true">
			<label for="register-form-extra">Leave blank</label>
			<input
				type="text"
				id="register-form-extra"
				name="form_extra"
				tabindex="-1"
				autocomplete="new-password"
			/>
		</div>

		{#if captchaRequired}
			<CaptchaFrame>
				<div bind:this={captchaContainer}></div>
			</CaptchaFrame>
		{/if}

		<Button type="submit" variant="primary" size="lg" fullWidth {loading} class="mt-2">
			Sign up
		</Button>
	</form>
	<div class="forgot-link" in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<a href={resolve('/forgotPassword')}>Forgot Password?</a>
	</div>
</div>

<style lang="scss">
	/* Streetlamp Symposium — Register form. */
	.auth-container {
		max-width: 400px;
		margin: 3rem auto;
		padding: 2rem;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		box-shadow: var(--shadow-lg);
	}

	.auth-title {
		text-align: center;
		margin-bottom: 0.5rem;
		font-size: 1.8rem;
		font-weight: bold;
		color: var(--ink-bright);
	}

	.auth-lede {
		margin: 0 auto 0.5rem;
		max-width: 26rem;
		text-align: center;
		color: var(--ink-mid);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.auth-switch {
		margin: 0 0 2rem;
		text-align: center;
		color: var(--ink-mid);
		font-size: 0.95rem;

		a {
			color: var(--lamp-glow);
			font-weight: 700;
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: var(--lamp-deep);
			}
		}
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.password-hints {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 0.75rem;
		color: var(--ink-dim);

		li::before {
			content: '○ ';
		}

		li.met {
			color: var(--success-text);

			&::before {
				content: '● ';
			}
		}
	}

	.type-help {
		margin: 0.45rem 0 0;
		color: var(--ink-dim);
		font-size: 0.82rem;
		line-height: 1.4;
	}

	.error-message {
		padding: 0.75rem 0.9rem;
		font-size: 0.9rem;
		color: var(--error-text);
		background: color-mix(in srgb, var(--error) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--error) 28%, transparent);
		border-radius: 0.625rem;
	}

	.forgot-link {
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
		.auth-container {
			margin: 1rem auto;
			padding: 1.5rem;
		}

		.auth-title {
			font-size: 1.5rem;
		}
	}
</style>

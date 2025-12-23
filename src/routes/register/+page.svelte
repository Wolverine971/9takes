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

<div class="mx-auto mt-12 max-w-md rounded-lg bg-white p-8 shadow-md" in:fade={{ duration: 300 }}>
	<h1 class="mb-8 text-center text-3xl font-bold" in:fly={{ y: -20, duration: 300, delay: 150 }}>
		<a
			href="/login"
			class="text-neutral-600 no-underline opacity-70 transition-opacity duration-300 hover:opacity-100"
			>Login</a
		>
		/
		<span class="border-b-2 border-primary-700 pb-1 text-primary-700">Register</span>
	</h1>
	<form
		action="?/register"
		method="POST"
		class="flex flex-col gap-6"
		use:enhance={handleSubmit}
		in:fly={{ y: 20, duration: 300, delay: 300 }}
	>
		<div class="flex flex-col gap-2">
			<label for="email" class="text-sm font-bold text-neutral-800">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				bind:value={email}
				required
				class="rounded border border-neutral-300 px-3 py-3 text-base transition-all duration-300 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400/20"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<label for="password" class="text-sm font-bold text-neutral-800">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				bind:value={password}
				required
				class="rounded border border-neutral-300 px-3 py-3 text-base transition-all duration-300 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400/20"
			/>
		</div>

		<!-- Honeypot field - hidden from real users, bots will fill it -->
		<div class="absolute -left-[9999px] opacity-0" aria-hidden="true">
			<label for="website">Website</label>
			<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
		</div>

		<!-- Google reCAPTCHA -->
		<div class="g-recaptcha" data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY} data-theme="light"></div>

		<button
			type="submit"
			class="cursor-pointer rounded-lg border-none bg-primary-700 px-5 py-3 text-base text-white transition-all duration-300 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
			disabled={loading}
		>
			{#if loading}
				<span
					class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent"
				/>
			{:else}
				Register
			{/if}
		</button>
	</form>
	<div class="mt-6 text-center" in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<a
			href="/forgotPassword"
			class="text-sm text-primary-700 no-underline transition-colors duration-300 hover:text-primary-800 hover:underline"
			>Forgot Password?</a
		>
	</div>
</div>

<style>
	/* Custom styles can be added here if needed */
	@media (max-width: 480px) {
		.max-w-md {
			margin: 1rem auto;
			padding: 1.5rem;
		}

		.text-3xl {
			font-size: 1.5rem;
		}

		input,
		button {
			font-size: 0.9rem;
		}
	}
</style>

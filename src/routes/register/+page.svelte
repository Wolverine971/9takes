<!-- src/routes/register/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';

	let email = '';
	let password = '';
	let loading = false;

	function handleSubmit() {
		loading = true;
		return async ({ result }) => {
			loading = false;
			if (result.type === 'success') {
				notifications.success('Registration successful! Please check your email.', 6000);
				goto('/login');
				invalidateAll();
			} else if (result.type === 'failure') {
				notifications.danger(result.data?.error || 'An error occurred', 3000);
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

<div class="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-md" in:fade={{ duration: 300 }}>
	<h1 class="text-center mb-8 text-3xl font-bold" in:fly={{ y: -20, duration: 300, delay: 150 }}>
		<a href="/login" class="text-neutral-600 no-underline opacity-70 hover:opacity-100 transition-opacity duration-300">Login</a> /
		<span class="text-primary-700 border-b-2 border-primary-700 pb-1">Register</span>
	</h1>
	<form
		action="?/register"
		method="POST"
		class="flex flex-col gap-6"
		use:enhance={handleSubmit}
		in:fly={{ y: 20, duration: 300, delay: 300 }}
	>
		<div class="flex flex-col gap-2">
			<label for="email" class="font-bold text-sm text-neutral-800">Email</label>
			<input 
				type="email" 
				id="email" 
				name="email" 
				bind:value={email} 
				required 
				class="px-3 py-3 border border-neutral-300 rounded text-base transition-all duration-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-400/20"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<label for="password" class="font-bold text-sm text-neutral-800">Password</label>
			<input 
				type="password" 
				id="password" 
				name="password" 
				bind:value={password} 
				required 
				class="px-3 py-3 border border-neutral-300 rounded text-base transition-all duration-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-400/20"
			/>
		</div>
		<button 
			type="submit" 
			class="bg-primary-700 text-white px-5 py-3 border-none rounded-lg text-base cursor-pointer transition-all duration-300 hover:bg-primary-800 active:translate-y-px disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2" 
			disabled={loading}
		>
			{#if loading}
				<span class="inline-block w-5 h-5 border-2 border-white border-b-transparent rounded-full animate-spin" />
			{:else}
				Register
			{/if}
		</button>
	</form>
	<div class="text-center mt-6" in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<a href="/forgotPassword" class="text-primary-700 no-underline text-sm transition-colors duration-300 hover:text-primary-800 hover:underline">Forgot Password?</a>
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

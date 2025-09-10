<!-- src/routes/resetPassword/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let password = '';
	let confirmPassword = '';
	let submitting = false;
	let passwordsMatch = true;
	let showSuccessMessage = false;

	const ogImage = 'https://9takes.com/greek_pantheon.png';

	// Handle password validation
	$: passwordsMatch = !confirmPassword || password === confirmPassword;
	$: isValidPassword = password.length >= 6;
	$: canSubmit = password && confirmPassword && passwordsMatch && isValidPassword && !submitting;

	// Handle redirecting to login after successful password reset
	$: if (form?.success && !showSuccessMessage) {
		showSuccessMessage = true;
		// Redirect to login after 3 seconds
		setTimeout(() => {
			goto('/login');
		}, 3000);
	}

	// Check if we have the hash fragment in the URL
	onMount(() => {
		// The Supabase client will handle the hash fragment automatically
		// We don't need to extract it manually
	});
</script>

<svelte:head>
	<title>9takes - Reset Password</title>
	<meta name="description" content="Reset your password for 9takes" />
	<link rel="canonical" href="https://9takes.com/resetPassword" />
	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes - Reset Password" />
	<meta property="og:description" content="Reset your password for 9takes" />
	<meta property="og:url" content="https://9takes.com/resetPassword" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
</svelte:head>

<div class="max-w-md mx-auto mt-8 p-4">
	<h1 class="text-center mb-8 text-2xl text-primary-700">Reset Password</h1>

	{#if form?.success || showSuccessMessage}
		<div class="bg-success-100 text-success-700 p-4 rounded mb-4 text-center">
			<p>{form?.message || 'Password has been reset successfully!'}</p>
			<p>Redirecting to login page...</p>
		</div>
	{:else}
		<form
			action="?/resetPass"
			method="POST"
			class="flex flex-col gap-4"
			use:enhance={() => {
				submitting = true;

				return async ({ result }) => {
					submitting = false;
					// Form state is automatically updated
				};
			}}
		>
			<div class="flex flex-col gap-2">
				<label for="password" class="font-bold text-neutral-800">New Password</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					required
					minlength="6"
					class="p-2 border border-neutral-300 rounded focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
				/>
				{#if password && !isValidPassword}
					<div class="text-error-500 text-sm mt-1">Password must be at least 6 characters</div>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<label for="confirmPassword" class="font-bold text-neutral-800">Confirm Password</label>
				<input 
					type="password" 
					id="confirmPassword" 
					bind:value={confirmPassword} 
					required 
					class="p-2 border border-neutral-300 rounded focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
				/>
				{#if confirmPassword && !passwordsMatch}
					<div class="text-error-500 text-sm mt-1">Passwords do not match</div>
				{/if}
			</div>

			{#if form?.error}
				<div class="text-error-500 text-sm">
					{form.error}
				</div>
			{/if}

			<button 
				type="submit" 
				class="bg-primary-700 text-white px-4 py-2 border-none rounded cursor-pointer text-base transition-colors duration-200 hover:bg-primary-800 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2" 
				disabled={!canSubmit}
			>
				{submitting ? 'Resetting Password...' : 'Reset Password'}
			</button>
		</form>
	{/if}

	<div class="text-center mt-4">
		<a href="/login" class="text-primary-700 no-underline hover:underline">Back to Login</a>
	</div>
</div>

<style>
	@media (max-width: 480px) {
		.max-w-md {
			padding: 1rem 0.5rem;
		}

		.text-2xl {
			font-size: 1.2rem;
		}

		button {
			width: 100%;
		}
	}
</style>

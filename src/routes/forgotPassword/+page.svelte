<!-- src/routes/forgotPassword/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let email = '';
	let submitting = false;

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

<div class="max-w-md mx-auto mt-8 p-4">
	<h1 class="text-center mb-8 text-2xl text-primary-700">Forgot Password</h1>

	{#if form?.success}
		<div class="bg-success-100 text-success-700 p-4 rounded mb-4 text-center">
			{form.message}
		</div>
	{:else}
		<form
			action="?/forgotPass"
			method="POST"
			class="flex flex-col gap-4"
			use:enhance={() => {
				submitting = true;

				return async ({ result }) => {
					submitting = false;
					// The form is automatically updated with the result
				};
			}}
		>
			<div class="flex flex-col gap-2">
				<label for="email" class="font-bold text-neutral-800">Email</label>
				<input 
					type="email" 
					id="email" 
					name="email" 
					bind:value={email} 
					required 
					class="p-2 border border-neutral-300 rounded focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300"
				/>
			</div>

			{#if form?.error}
				<div class="text-error-500 text-sm mb-2">
					{form.error}
				</div>
			{/if}

			<button 
				type="submit" 
				class="bg-primary-700 text-white px-4 py-2 border-none rounded cursor-pointer text-base transition-colors duration-200 hover:bg-primary-800 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2" 
				disabled={submitting}
			>
				{submitting ? 'Sending...' : 'Reset Password'}
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

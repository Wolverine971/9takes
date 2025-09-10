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

<div class="mx-auto mt-8 max-w-md p-4">
	<h1 class="mb-8 text-center text-2xl text-primary-700">Forgot Password</h1>

	{#if form?.success}
		<div class="mb-4 rounded bg-success-100 p-4 text-center text-success-700">
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
					class="rounded border border-neutral-300 p-2 transition-all duration-300 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400/20"
				/>
			</div>

			{#if form?.error}
				<div class="mb-2 text-sm text-error-500">
					{form.error}
				</div>
			{/if}

			<button
				type="submit"
				class="cursor-pointer rounded border-none bg-primary-700 px-4 py-2 text-base text-white transition-colors duration-200 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
				disabled={submitting}
			>
				{submitting ? 'Sending...' : 'Reset Password'}
			</button>
		</form>
	{/if}

	<div class="mt-4 text-center">
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

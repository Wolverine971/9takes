<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import LoadingButton from '$lib/components/atoms/LoadingButton.svelte';

	let loading = false;
	let email = '';
	let password = '';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			if (result.type === 'failure') {
				loading = false;
				notifications.danger(result.data?.error || 'An error occurred', 3000);
			} else if (result.type === 'success') {
				// Keep loading=true during navigation - rerun all `load` functions
				await invalidateAll();
			}

			await applyAction(result);
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
	<form
		action="?/login"
		method="POST"
		class="auth-form"
		use:enhance={handleSubmit}
		in:fly={{ y: 20, duration: 300, delay: 300 }}
	>
		<div class="form-group">
			<label for="email">Email</label>
			<input type="email" id="email" name="email" bind:value={email} required />
		</div>
		<div class="form-group">
			<label for="password">Password</label>
			<input type="password" id="password" name="password" bind:value={password} required />
		</div>
		<LoadingButton
			type="submit"
			variant="primary"
			size="lg"
			fullWidth
			{loading}
			loadingText="Logging in..."
			className="mt-4"
		>
			Login
		</LoadingButton>
	</form>
	<div class="forgot-password" in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<a href="/forgotPassword">Forgot Password?</a>
	</div>
</div>

<style lang="scss">
	/* 9takes Warm Tech Theme */
	.container {
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
		min-height: auto;
	}

	.title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.8rem;
		font-weight: bold;
		color: var(--text-primary);

		.active {
			color: var(--primary);
			border-bottom: 2px solid var(--primary);
			padding-bottom: 4px;
		}

		.inactive {
			color: var(--text-secondary);
			text-decoration: none;
			opacity: 0.7;
			transition: all 0.3s ease;

			&:hover {
				opacity: 1;
				color: var(--primary);
			}
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

	label {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	input {
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

	.forgot-password {
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
		.container {
			margin: 1rem auto;
			padding: 1.5rem;
		}

		.title {
			font-size: 1.5rem;
		}

		input {
			font-size: 0.9rem;
		}
	}
</style>

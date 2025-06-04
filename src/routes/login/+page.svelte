<!-- routes/login/+page.svelte -->
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';
	import { invalidateAll } from '$app/navigation';

	let loading = false;
	let email = '';
	let password = '';

	function handleSubmit() {
		loading = true;
		return async ({ result }) => {
			loading = false;
			if (result.type === 'failure') {
				notifications.danger(result.data?.error || 'An error occurred', 3000);
			} else if (result.type === 'success') {
				// rerun all `load` functions, following the successful update
				await invalidateAll();
			}

			applyAction(result);
		};
	}
	const ogImage = 'https://9takes.com/greek_pantheon.png';
</script>

<svelte:head>
	<title>9takes Login</title>
	<meta name="description" content="Login for a good time" />
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
		<button type="submit" class="btn btn-primary" disabled={loading}>
			{#if loading}
				<span class="loader" />
			{:else}
				Login
			{/if}
		</button>
	</form>
	<div class="forgot-password" in:fly={{ y: 20, duration: 300, delay: 450 }}>
		<a href="/forgotPassword">Forgot Password?</a>
	</div>
</div>

<style lang="scss">
	:root {
		--primary-dark: var(--color-theme-purple-dark);
		--text-color: #333;
		--background-color: #f5f5f5;
		--input-background: #fff;
		--input-border: #ddd;
		--box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.container {
		max-width: 400px;
		margin: 3rem auto;
		padding: 2rem;
		background-color: var(--input-background);
		border-radius: 8px;
		box-shadow: var(--box-shadow);
		min-height: auto;
	}

	.title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.8rem;
		font-weight: bold;

		.active {
			color: var(--primary);
			border-bottom: 2px solid var(--primary);
			padding-bottom: 4px;
		}

		.inactive {
			color: var(--text-color);
			text-decoration: none;
			opacity: 0.7;
			transition: opacity 0.3s ease;

			&:hover {
				opacity: 1;
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
		font-weight: bold;
		font-size: 0.9rem;
		color: var(--text-color);
	}

	input {
		padding: 0.75rem;
		border: 1px solid var(--input-border);
		border-radius: 4px;
		font-size: 1rem;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;

		&:focus {
			outline: none;
			border-color: var(--primary);
			box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
		}
	}

	.btn {
		&.btn-primary {
			&:active {
				transform: translateY(1px);
			}

			&:disabled {
				opacity: 0.7;
				cursor: not-allowed;
			}
		}
	}

	.loader {
		width: 20px;
		height: 20px;
		border: 2px solid #ffffff;
		border-bottom-color: transparent;
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.forgot-password {
		text-align: center;
		margin-top: 1.5rem;

		a {
			color: var(--primary);
			text-decoration: none;
			font-size: 0.9rem;
			transition: color 0.3s ease;

			&:hover {
				color: var(--primary-dark);
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

		input,
		.btn {
			font-size: 0.9rem;
		}
	}
</style>

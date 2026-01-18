<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { fade, fly } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';
	import { invalidateAll } from '$app/navigation';
	import LoadingButton from '$lib/components/atoms/LoadingButton.svelte';

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
	/* Solo Leveling Dark Theme */
	.container {
		max-width: 400px;
		margin: 3rem auto;
		padding: 2rem;
		background-color: #1a1a2e;
		border: 1px solid rgba(100, 116, 139, 0.2);
		border-radius: 12px;
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
		min-height: auto;
	}

	.title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.8rem;
		font-weight: bold;
		color: #f1f5f9;

		.active {
			color: #a78bfa;
			border-bottom: 2px solid #7c3aed;
			padding-bottom: 4px;
		}

		.inactive {
			color: #94a3b8;
			text-decoration: none;
			opacity: 0.7;
			transition: all 0.3s ease;

			&:hover {
				opacity: 1;
				color: #f1f5f9;
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
		color: #cbd5e1;
	}

	input {
		padding: 0.75rem;
		background-color: #252538;
		border: 1px solid rgba(100, 116, 139, 0.3);
		border-radius: 8px;
		font-size: 1rem;
		color: #f1f5f9;
		transition: all 0.3s ease;

		&::placeholder {
			color: #64748b;
		}

		&:focus {
			outline: none;
			border-color: #7c3aed;
			box-shadow: 0 0 10px rgba(124, 58, 237, 0.3);
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
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
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
			color: #a78bfa;
			text-decoration: none;
			font-size: 0.9rem;
			transition: all 0.3s ease;

			&:hover {
				color: #c4b5fd;
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

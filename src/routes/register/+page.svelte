<script lang="ts">
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';

	let email: string = '';
	let password: string = '';

	const handleSubmit = async () => {
		let body = new FormData();
		body.append('email', email);
		body.append('password', password);

		const resp = await fetch('?/register', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result.error) {
			console.log(result.error);
		} else if (result.data) {
			goto('/login');
			notifications.info('Check your email', 3000);
		}
	};
</script>

<div class="container">
	<h1 class="title">
		<a href="/login" class="inactive">Login</a> /
		<span class="active">Register</span>
	</h1>
	<form class="auth-form" on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="email">Email</label>
			<input type="email" id="email" name="email" bind:value={email} required />
		</div>
		<div class="form-group">
			<label for="password">Password</label>
			<input type="password" id="password" name="password" bind:value={password} required />
		</div>
		<button type="submit" class="btn btn-primary">Register</button>
	</form>
	<div class="forgot-password">
		<a href="/forgotPassword">Forgot Password?</a>
	</div>
</div>

<style lang="scss">
	.container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 1rem;
	}

	.title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.5rem;

		.active {
			text-decoration: underline;
			color: var(--primary);
		}

		.inactive {
			color: var(--color-paladin-3);
			text-decoration: none;
		}
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: bold;
	}

	input {
		padding: 0.5rem;
		border: 1px solid var(--accent);
		border-radius: 4px;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		transition: background-color 0.2s;

		&.btn-primary {
			background-color: var(--primary);
			color: white;

			&:hover {
				background-color: darken(#000000, 10%);
			}
		}
	}

	.forgot-password {
		text-align: center;
		margin-top: 1rem;

		a {
			color: var(--primary);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 1rem 0.5rem;
		}

		.title {
			font-size: 1.2rem;
		}

		.btn {
			width: 100%;
		}
	}
</style>

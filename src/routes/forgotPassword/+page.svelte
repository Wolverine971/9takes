<script lang="ts">
	let email = '';

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		// Add your form submission logic here
		console.log('Submitting email:', email);
		// You might want to add error handling and success messaging here
	};
</script>

<div class="container">
	<h1 class="title">Forgot Password</h1>
	<form on:submit={handleSubmit} class="auth-form">
		<div class="form-group">
			<label for="email">Email</label>
			<input type="email" id="email" name="email" bind:value={email} required />
		</div>
		<button type="submit" class="btn btn-primary">Reset Password</button>
	</form>
	<div class="back-to-login">
		<a href="/login">Back to Login</a>
	</div>
</div>

<style lang="scss">
	:root {
		--primary-dark: color-mix(in srgb, var(--primary) 90%, black);
	}

	.container {
		max-width: 400px;
		margin: 2rem auto;
		padding: 1rem;
	}

	.title {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.5rem;
		color: var(--primary);
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
				background-color: var(--primary-dark);
			}
		}
	}

	.back-to-login {
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

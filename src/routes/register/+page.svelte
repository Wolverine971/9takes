<script lang="ts">
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';

	let email: string = 'newest';
	let password: string = 'newest';
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

<div>
	<h1 style="text-align: center; margin: 1rem;">
		<a href="/login" class="unselected">Login</a> /
		<span style="text-decoration: underline; color: var(--primary);">Register</span>
	</h1>
	<form class="auth-form" on:submit|preventDefault={handleSubmit}>
		<label for="email"> Email </label>
		<input id="email" type="text" name="email" bind:value={email} />
		<label for="password"> Password </label>
		<input id="password" type="password" name="password" bind:value={password} />
		<button type="button" class="btn btn-primary" on:click={handleSubmit}>Register</button>
	</form>
	<br />
	<div style="text-align: center; margin: 1rem;">
		<a href="/forgotPassword">Forgot Password</a>
	</div>
</div>

<style lang="scss">
	.unselected {
		color: var(--color-paladin-3) !important;
	}
</style>

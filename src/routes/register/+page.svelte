<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	const goToForgotPassword = async () => {
		redirect(300, '/forgotPassword');
	};
</script>

<main>
	<h1>Register</h1>
	<form action="?/register" method="POST" class="auth-form">
		<label for=""> Email </label>
		<input type="text" name="email" />
		<label for=""> Password </label>
		<input type="password" name="password" />
		<button class="btn btn-primary">Register</button>
	</form>
	<br />
	<div>
		<a href="/forgotPassword">Forgot Password</a>
	</div>
</main>

<style lang="scss">
</style>

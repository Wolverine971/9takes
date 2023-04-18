<script lang="ts">
	import { redirect } from '@sveltejs/kit';
</script>

<div>
	<h1>Login</h1>
	<form action="?/login" method="POST" class="auth-form">
		<label for=""> Email </label>
		<input type="text" name="email" />
		<label for=""> Password </label>
		<input type="password" name="password" />
		<button class="btn btn-primary">Login</button>
	</form>
	<br />
	<div>
		<a href="/forgotPassword">Forgot Password</a>
	</div>
</div>

<style lang="scss">
</style>

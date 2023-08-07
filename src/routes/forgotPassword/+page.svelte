<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let email = '';
</script>

<div>
	<h1>Forgot password</h1>
	<form action="?/forgotPass" method="POST" class="auth-form">
		<label for=""> Email </label>
		<input type="text" name="email" bind:value={email} />

		<button class="btn btn-primary">Reset Password</button>
	</form>
</div>

<style lang="scss">
</style>

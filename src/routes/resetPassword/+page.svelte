<script lang="ts">
	import type { PageData } from './$types';
	// import { enhance, type SubmitFunction } from '$app/forms';

	export let data: PageData;

	let password = '';
</script>

<div>
	<h1>Reset password</h1>
	<form action="?/resetPass" method="POST" class="auth-form">
		<!-- <label for=""> Email </label>
		<input type="text" name="email" readonly value={data?.session?.user?.email} /> -->
		<label for=""> Password </label>
		<input type="password" name="password" bind:value={password} />
		<button class="btn btn-primary">Reset</button>
	</form>
</div>

<style lang="scss">
</style>

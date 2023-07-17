<script lang="ts">
	import type { PageData } from './$types';
	import { supabase } from '$lib/supabase';
	import { redirect } from '@sveltejs/kit';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: PageData;

	let email = '';
	const reset = async ({}) => {
		const { data, error: forgotPassResetError } = await supabase.auth.resetPasswordForEmail(email);
		if (data) {
			redirect(300, 'login');
			// const showToast = () => {
			notifications.info('Check your email', 6000);
		}

		if (forgotPassResetError) {
			if (forgotPassResetError?.msg) {
				console.log(forgotPassResetError.msg);
			}
			notifications.danger('Error resetting password', 6000);

			console.log(forgotPassResetError);
		}
	};
</script>

<div>
	<h1>Forgot password</h1>
	<form action="?/register" method="POST" class="auth-form">
		<label for=""> Email </label>
		<input type="text" name="email" readonly bind:value={email} />

		<button class="btn btn-primary" type="button" on:click={reset}>Reset Password</button>
	</form>
</div>

<style lang="scss">
</style>

<script lang="ts">
	// import Counter from './Counter.svelte';
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';

	import type { PageData } from './$types';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { supabase } from '$lib/supabase';
	import { redirect } from '@sveltejs/kit';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: PageData;

	let email = '';
	const reset = async ({}) => {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email);
		if (data) {
			redirect(300, 'login');
			// const showToast = () => {
			notifications.info('Check your email', 6000);
		}

		if (error) {
			if (error?.msg) {
				notifications.danger(data?.msg, 6000);
			} else {
				notifications.danger('Error resetting password', 6000);
			}

			console.log(error);
		}
	};
</script>

<main>
	<h1>Forgot password</h1>
	<form action="?/register" method="POST" class="auth-form">
		<label for=""> Email </label>
		<input type="text" name="email" readonly bind:value={email} />

		<button class="btn btn-primary" type="button" on:click={reset}>Reset Password</button>
	</form>
</main>

<style lang="scss">
</style>

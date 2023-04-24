<script lang="ts">
	import type { PageData } from './$types';
	// import { enhance, type SubmitFunction } from '$app/forms';
	import { supabase } from '$lib/supabase';
	import { redirect } from '@sveltejs/kit';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: PageData;

	let password = '';
	const reset = async ({}) => {
		const { data, error } = await supabase.auth.updateUser({ password });

		if (data) {
			redirect(300, 'questions');
			notifications.success('Password Changed', 3000);
		}

		if (error) {
			if (error?.msg) {
				notifications.danger('Error Changeing Password', 3000);
			}
			console.log(error);
		}
	};
</script>

<main>
	<h1>Reset password</h1>
	<form action="?/register" method="POST" class="auth-form">
		<label for=""> Email </label>
		<input type="text" name="email" readonly value={data?.session?.user?.email} />
		<label for=""> Password </label>
		<input type="password" name="password" bind:value={password} />
		<button class="btn btn-primary" type="button" on:click={reset}>Reset</button>
	</form>
</main>

<style lang="scss">
</style>

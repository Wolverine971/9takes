<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { supabase } from '$lib/supabase';
	import type { PageData } from '../$types';
    
	import { enhance, type SubmitFunction } from '$app/forms';
	let question: string;

	export let data: PageData;

	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log(error);
		}
		cancel();
	};
</script>

<main class="card">
	<h1 style="color: white">Hello {data.session.user.email}</h1>
    <form action="/logout" method="POST" use:enhance={submitLogout}>
			<button type="submit" class="btn btn-primary">Logout</button>
		</form>

	
</main>



<style lang="scss">


</style>
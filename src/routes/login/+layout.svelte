<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	// import './styles.css';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event) => {
			// invalidateAll();
			if (event === 'PASSWORD_RECOVERY') {
				// redirect user to the page where it creates a new password
				return {
					status: 302,
					redirect: '/resetPassword'
				};
			}
		});
		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<slot />

<!-- src/routes/login/+layout.svelte -->
<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'PASSWORD_RECOVERY') {
				goto('/resetPassword');
				return;
			}

			if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
				invalidateAll();
			}
		});
		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<slot />

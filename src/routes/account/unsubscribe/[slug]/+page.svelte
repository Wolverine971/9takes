<!-- src/routes/account/unsubscribe/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import { Button } from '$lib/components/atoms';

	let { data }: { data: PageData } = $props();

	const confirmUnsubscribe = async () => {
		if (!data.userSignup?.email) {
			notifications.danger('Unable to identify signup email', 3000);
			return;
		}

		const resp = await fetch('?/confirmUnsubscribe', {
			method: 'POST'
		});
		const respFormatted = await deserialize(await resp.text());
		if (
			respFormatted.type === 'success' &&
			(respFormatted.data as { success?: boolean } | undefined)?.success
		) {
			notifications.success('You are unsubscribed', 3000);
			goto(`/questions`, {});
		}
	};
</script>

<div class="glass-card">
	{#if data.userSignup}
		<div class="pretty-div" style="text-align: center;">
			<h2>{data.userSignup?.email}</h2>
			<p>Are you sure you want to unsubscribe?</p>

			<div class="row" style="gap: 2rem;">
				<Button variant="secondary" type="button" onclick={() => goto(`/questions`, {})}>No</Button>
				<Button type="button" onclick={confirmUnsubscribe}>Yes</Button>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
</style>

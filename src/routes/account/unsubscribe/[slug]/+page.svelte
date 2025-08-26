<!-- src/routes/account/unsubscribe/[slug]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: PageData;

	const confirmUnsubscribe = async () => {
		let body = new FormData();
		body.append('email', data.userSignup?.email);
		const resp = await fetch('?/confirmUnsubscribe', {
			method: 'POST',
			body
		});
		const respFormatted = await deserialize(await resp.text());
		if (respFormatted?.data?.success) {
			notifications.info('You are unsubscribed', 3000);
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
				<button class="btn btn-secondary" type="button" on:click={() => goto(`/questions`, {})}>
					No
				</button>
				<button class="btn btn-primary" type="button" on:click={confirmUnsubscribe}> Yes </button>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
</style>

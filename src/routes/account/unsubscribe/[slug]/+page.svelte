<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: PageData;

	console.log(data);

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
	h1 {
		font-size: 1.5rem;
	}

	.scrollable-div {
		max-height: 100vh;
		overflow-y: scroll;
		padding: 0.5rem;
	}

	td {
		text-align: start;
		margin: 0.2rem;
		padding: 0.5rem;
	}
	select {
		border-radius: 5px;
		border: var(--classic-border);
	}
</style>

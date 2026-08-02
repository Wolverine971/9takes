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

<section class="unsubscribe-card" aria-labelledby="unsubscribe-heading">
	{#if data.userSignup}
		<div class="unsubscribe-content">
			<p class="eyebrow">EMAIL PREFERENCES</p>
			<h1 id="unsubscribe-heading">Unsubscribe?</h1>
			<p class="signup-email">{data.userSignup?.email}</p>
			<p>Are you sure you want to unsubscribe?</p>

			<div class="unsubscribe-actions">
				<Button variant="secondary" type="button" onclick={() => goto(`/questions`, {})}>No</Button>
				<Button type="button" onclick={confirmUnsubscribe}>Yes</Button>
			</div>
		</div>
	{/if}
</section>

<style lang="scss">
	.unsubscribe-card {
		width: min(100%, 34rem);
		margin: 2rem auto;
		padding: clamp(1.25rem, 5vw, 2rem);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.unsubscribe-content {
		text-align: center;
	}

	.eyebrow {
		margin: 0 0 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--lamp-glow);
	}

	h1 {
		margin: 0;
		font-size: clamp(1.75rem, 6vw, 2.5rem);
		color: var(--ink-bright);
	}

	.signup-email {
		margin: 1rem 0 0.5rem;
		font-weight: 600;
		color: var(--ink-bright);
		overflow-wrap: anywhere;
	}

	.unsubscribe-content > p:last-of-type {
		margin: 0;
		color: var(--ink-mid);
	}

	.unsubscribe-actions {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	@media (max-width: 420px) {
		.unsubscribe-actions {
			flex-direction: column-reverse;
		}

		.unsubscribe-actions :global(.btn) {
			width: 100%;
		}
	}
</style>

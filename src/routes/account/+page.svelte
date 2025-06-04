<!-- routes/account/+page.svelte -->
<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import EnneagramSelect from '$lib/components/molecules/Enneagram-Select.svelte';

	interface AccountData extends PageData {
		user: {
			first_name: string;
			last_name: string;
			enneagram: string;
			email: string;
			admin: boolean;
		};
		subscriptions: Array<{
			questions: {
				url: string;
				question_formatted: string;
				question: string;
			};
		}>;
		
	}

	export let data: AccountData;

	let firstName = data.user.first_name;
	let lastName = data.user.last_name;
	let enneagram = data.user.enneagram;
	let formChanged = false;

	$: formChanged =
		firstName !== data.user.first_name ||
		lastName !== data.user.last_name ||
		enneagram !== data.user.enneagram;

	async function submitLogout({ cancel }: { cancel: Function }) {
		const { error: signOutError } = await supabase.auth.signOut();
		if (signOutError) {
			console.error(signOutError);
			cancel();
		}
	}

	async function save() {
		const body = new FormData();
		body.append('firstName', firstName);
		body.append('lastName', lastName);
		body.append('enneagram', enneagram);
		body.append('email', data.user.email);

		try {
			await fetch('?/updateAccount', { method: 'POST', body });
			notifications.info('Account updated', 3000);
		} catch (error) {
			console.error('Error updating account:', error);
			notifications.danger('Failed to update account', 3000);
		}
	}
</script>

<div class="account-card">
	<header class="header">
		<h1>Hello {data.user.email}</h1>
		<div class="header-actions">
			<form action="/logout" method="POST" use:enhance={submitLogout}>
				<button type="submit" class="btn btn-secondary">Logout</button>
			</form>
			{#if data.user.admin}
				<a href="/admin" class="btn btn-primary">Admin</a>
			{/if}
		</div>
	</header>

	<section class="profile-section">
		<h2>Profile</h2>
		<div class="input-group">
			<input type="text" id="firstName" bind:value={firstName} placeholder="First Name" />
			<input type="text" id="lastName" bind:value={lastName} placeholder="Last Name" />
		</div>
		<div class="enneagram-select">
			<span>Enneagram Type</span>
			<EnneagramSelect
				selectedEnneagram={enneagram}
				on:enneagramSelected={({ detail }) => (enneagram = detail)}
			/>
		</div>
		<button
			type="button"
			disabled={!formChanged}
			class="btn btn-primary save-btn"
			class:disabled={!formChanged}
			on:click={save}
		>
			Save
		</button>
	</section>

	<section class="subscriptions-section">
		<h2>Question subscriptions</h2>
		{#if !data.subscriptions?.length}
			<p>You are not subscribed to any questions</p>
			<a href="/questions">Checkout some questions</a>
		{:else}
			<div class="subscription-list">
				{#each data.subscriptions as subscription}
					<a href="/questions/{subscription.questions.url}" class="subscription-link">
						{subscription.questions.question_formatted || subscription.questions.question}
					</a>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style lang="scss">
	.account-card {
		background-color: var(--light-gray);
		border-radius: var(--base-border-radius);
		padding: 1.5rem;
		margin: 1rem auto;
		max-width: 800px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;

		h1 {
			font-size: 1.2rem;
			margin: 0;
			word-break: break-all;
		}

		&-actions {
			display: flex;
			gap: 0.5rem;
			flex-wrap: wrap;
		}
	}

	.profile-section,
	.subscriptions-section {
		background-color: var(--accent-light);
		border-radius: var(--base-border-radius);
		border: 1px solid var(--accent);
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;

		input {
			width: 100%;
			padding: 0.5rem;
			border: 1px solid var(--dark-gray);
			border-radius: var(--base-border-radius);
		}
	}

	.enneagram-select {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.save-btn {
		width: 100%;
		margin-top: 1rem;
		transition: opacity 0.3s ease;

		&.disabled {
			opacity: 0.7;
			cursor: not-allowed;
		}
	}

	.subscription-list {
		max-height: 200px;
		overflow-y: auto;
	}

	.subscription-link {
		display: block;
		padding: 0.5rem 0;
		color: var(--primary);
		text-decoration: none;
		transition: color 0.3s ease;
		word-break: break-word;

		&:hover {
			color: var(--primary-light);
		}
	}

	@media (min-width: 600px) {
		.account-card {
			padding: 2rem;
		}

		.header {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.input-group {
			flex-direction: row;
		}

		.enneagram-select {
			flex-direction: row;
			align-items: center;
		}

		.save-btn {
			width: auto;
			align-self: flex-end;
		}
	}
</style>

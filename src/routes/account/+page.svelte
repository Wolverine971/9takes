<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	import { deserialize, enhance } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import EnneagramSelect from '$lib/components/molecules/Enneagram-Select.svelte';
	let firstName: string;
	let lastName: string;
	let enneagram: string;
	let formChanged: boolean = false;

	$: (firstName, lastName, enneagram), doSomething();

	const doSomething = () => {
		if (
			firstName !== data?.user?.first_name ||
			lastName !== data?.user?.last_name ||
			enneagram !== data?.user?.enneagram
		) {
			formChanged = true;
		} else {
			formChanged = false;
		}
	};
	interface AccountData extends PageData {
		user: any;
		subscriptions: any;
	}

	export let data: AccountData;
	firstName = data?.user?.first_name;
	lastName = data?.user?.last_name;
	enneagram = data?.user?.enneagram;

	const submitLogout = async ({ cancel }: { cancel: Function }) => {
		const { error: signOutError } = await supabase.auth.signOut();
		if (signOutError) {
			console.log(signOutError);
			cancel();
		}
		// else {
		// 	cancel();
		// }
	};

	export const save = async () => {
		var body = new FormData();

		body.append('firstName', firstName);
		body.append('lastName', lastName);
		body.append('enneagram', enneagram);
		// website
		body.append('email', data?.user.email);

		const resp = await fetch('?/updateAccount', {
			method: 'POST',
			body
		}).then(async () => {
			notifications.info('Account updated', 3000);
		});
	};
</script>

<div class="account-card">
	<div class="neat-row" style="justify-content: space-between;">
		<h1 style="margin: auto 1rem; padding:0">Hello {data?.session?.user?.email}</h1>

		<!-- <button type="button" class="btn btn-primary" on:click={submitLogout}>Logout</button> -->
		<!-- use:enhance={() => {
					return async ({ result }) => {
						invalidateAll();
						await applyAction(result);
					};
				}} -->
		<div>
			<form action="/logout" method="POST" use:enhance={submitLogout} class="logout-btn">
				<button type="submit" class="btn btn-secondary">Logout</button>
			</form>
			{#if data?.user?.admin}
				<a href="/admin">
					<button type="button" class="btn btn-primary" style="margin-top: 0.5rem">Admin</button>
				</a>
			{/if}
		</div>
	</div>

	<div class="glass-card" style="z-index: 1;">
		<h2>Profile</h2>
		<div class="">
			<!-- <label for="firstName">First Name</label> -->
			<input
				type="text"
				name="firstName"
				id="firstName"
				bind:value={firstName}
				placeholder="First Name"
			/>

			<!-- <label for="lastName">Last Name</label> -->
			<input
				type="text"
				name="lastName"
				id="lastName"
				bind:value={lastName}
				placeholder="Last Name"
			/>
		</div>
		<div class="neat-row" style="justify-content: start">
			<span style="text-align: center;"> Enneagram <br />Type </span>
			<EnneagramSelect
				selectedEnneagram={enneagram}
				on:enneagramSelected={({ detail }) => {
					enneagram = detail;
				}}
			/>
		</div>
		<div class="neat-row" style="justify-content: flex-end;">
			<button
				type="button"
				disabled={!formChanged}
				class="btn btn-primary save-btn {formChanged === false && 'disabled'}"
				on:click={save}>Save</button
			>
		</div>
	</div>

	<div class="glass-card" style="z-index: 0">
		<h2>Question subscriptions</h2>
		{#each data.subscriptions as subscription}
			<div class="neat-row" style="justify-content: flex-start;">
				<a href="/questions/{subscription.questions.url}"
					>{subscription.questions.question_formatted || subscription.questions.question}</a
				>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.disabled {
		background-color: lightgray;
		color: grey;
	}
	.account-card {
		background-color: var(--base-grey-1);
		border-radius: 5px;
		padding: 1rem;
		margin: 1rem;
	}
	.glass-card {
		background-color: var(--base-grey-2);
		border-radius: 5px;
		// padding: 1rem;
		// margin: 1rem;
		// padding: 0.5rem;
		margin: 1rem 0; 
		padding: 1rem;
		overflow: visible;
	}

	.neat-row {
		display: flex;
		width: 100%;
		gap: 10px;
		align-items: center;
		justify-content: center;
	}

	h1 {
		font-size: 1.5rem;
	}

	h2 {
		padding: 0.5rem 0;
		margin: 0.5rem 0;
	}

	.logout-btn {
		align-self: end;
		margin: auto 0;
	}
	.save-btn {
		align-self: end;
	}
</style>

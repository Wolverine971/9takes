<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from '../$types';

	import { applyAction, deserialize, enhance, type SubmitFunction } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import { invalidateAll } from '$app/navigation';
	import EnneagramSelect from '$lib/components/molecules/Enneagram-Select.svelte';
	let firstName: string;
	let lastName: string;
	let enneagram: string;
	interface AccountData extends PageData {
		user: any;
		subscriptions: any;
	}

	export let data: AccountData;
	firstName = data?.user?.first_name;
	lastName = data?.user?.last_name;
	enneagram = data?.user?.enneagram;

	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log(error);
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
		body.append('email', data.user.email);

		const resp = await fetch('?/updateAccount', {
			method: 'POST',
			body
		}).then(async (response) => {
			const data = deserialize(await response.text());
			console.log('👍');

			notifications.info('Account updated', 3000);
		});
	};
</script>

<div class="glass-card">
	<div class="row">
		<h1 style="">Hello {data?.session?.user.email}</h1>

		<!-- <button type="button" class="btn btn-primary" on:click={submitLogout}>Logout</button> -->
		<!-- use:enhance={() => {
				return async ({ result }) => {
					invalidateAll();
					await applyAction(result);
				};
			}} -->
		<form action="/logout" method="POST" use:enhance={submitLogout}>
			<button type="submit" class="btn btn-primary">Logout</button>
		</form>
	</div>
	<div class="row">
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
	<div class="row">
		<EnneagramSelect
			selectedEnneagram={enneagram}
			on:enneagramSelected={({ detail }) => {
				enneagram = detail;
			}}
		/>
	</div>

	<div class="row">
		<button type="button" class="btn btn-primary" on:click={save}>Save</button>
	</div>

	<div>
		<h2>Question subscriptions</h2>
		{#each data.subscriptions as subscription}
			<div class="row" style="justify-content: flex-start;">
				<a href="/questions/{subscription.questions.url}">{subscription.questions.question}</a>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	h1 {
		font-size: 1.5rem;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		gap: 10px;
		margin: 1rem;
		justify-content: center;
		align-items: center;
	}
</style>

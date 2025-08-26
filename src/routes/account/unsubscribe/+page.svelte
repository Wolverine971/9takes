<!-- src/routes/account/unsubscribe/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { convertDateToReadable } from '../../../utils/conversions';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: PageData;

	const formattedSignups: any[] = data?.signups?.length
		? data?.signups?.map((s) => {
				return {
					...s,
					createdAt: convertDateToReadable(s.created_at),
					unsubscribed_date: s.unsubscribed_date ? convertDateToReadable(s.unsubscribed_date) : null
				};
			})
		: [];

	let email: string = '';
	const createCypher = async () => {
		let body = new FormData();
		body.append('email', email.trim());

		const resp = await fetch('?/createCypher', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result?.data?.success) {
			notifications.info('Updated cypher', 3000);
		} else {
			notifications.danger('Error updating cypher', 3000);
			console.log(result.error);
		}
	};

	const refreshAllCyphersForAll = async () => {
		for await (const signup of formattedSignups) {
			if (signup.email) {
				let body = new FormData();
				body.append('email', signup.email.trim());

				await fetch('?/createCypher', {
					method: 'POST',
					body
				});
			}
		}
		notifications.info('Updated successful', 3000);
	};
</script>

<div class="glass-card">
	<div class="row">
		<h1 style="">Users</h1>
	</div>
	{#if formattedSignups?.length}
		<div class="pretty-div">
			<h2>Signups # {data.signups?.length}</h2>
			<div class="scroll-table scrollable-div">
				<table>
					<tr>
						<th>Email</th>
						<th>Name</th>
						<th>Created At</th>
						<th>Unsubscribe id</th>
						<th>Unsubscribe Date</th>
					</tr>

					{#each formattedSignups as signup}
						<tr>
							<td>{signup.email}</td>
							<td>{signup.name}</td>
							<td>{signup.createdAt}</td>
							<td>{signup.unsubscribe_id}</td>
							<td>{signup.unsubscribed_date}</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	{/if}

	<div class="row">
		<input type="text" bind:value={email} style="margin-bottom: auto" />
		<button type="button" class="btn btn-primary" on:click={createCypher}
			>Create unsubscribe link</button
		>
	</div>
	<div class="row">
		<button type="button" class="btn btn-primary" on:click={refreshAllCyphersForAll}
			>Refresh all cyphers</button
		>
	</div>
</div>

<style lang="scss">
	h1 {
		font-size: 1.5rem;
	}

	td {
		text-align: start;
		margin: 0.2rem;
		padding: 0.5rem;
	}
</style>

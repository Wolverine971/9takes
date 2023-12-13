<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { convertDateToReadable } from '../../utils/conversions';
	import type { PageData } from './$types';

	export let data: PageData;

	let isDemoTime: boolean = data.demoTime;

	const changeDemoTime = async () => {
		let body = new FormData();

		await fetch('?/toggleDemo', {
			method: 'POST',
			body
		});

		isDemoTime = !isDemoTime;
	};

	const reindexEverything = async () => {
		let body = new FormData();

		const resp = await fetch('?/reindexEverything', {
			method: 'POST',
			body
		});
		notifications.info('Reindexed Questions', 3000);
		getModal('confirmReindex').close();
	};
</script>

{#if data.user?.admin}
	<div class="glass-card">
		<div class="row">
			<a href="/admin/users">Users</a> |
			<a href="/admin/questions">Questions</a> |
			<a href="/admin/messages">Messages</a>
		</div>
		<details>
			<summary class="accordion">Visitors last 30 days</summary>

			<div class="column panel">
				<div class="row">
					<table>
						<tr>
							<th>Days</th>
							<th>Visitor Count</th>
						</tr>

						{#each data.dailyVisitors as visitor}
							<tr>
								<td>{visitor.days}</td>
								<td>{visitor.number_of_visitors} </td>
							</tr>
						{/each}
					</table>
				</div>
			</div>
		</details>

		<details>
			<summary class="accordion">Comments last 30 days</summary>

			<div class="column panel">
				<div class="row">
					<table>
						<tr>
							<th>Days</th>
							<th>Comment Count</th>
							<th>Comments Modified Count</th>
						</tr>

						{#each data.dailyComments as comment}
							<tr>
								<td>{comment.days}</td>
								<td>{comment.number_of_comments} </td>
								<td>{comment.number_modified} </td>
							</tr>
						{/each}
					</table>
				</div>
			</div>
		</details>

		<details>
			<summary class="accordion">Daily Question Stats:</summary>

			<div class="column panel">
				<div class="row">
					<table>
						<tr>
							<th>Question</th>
							<th>Created At</th>
							<th>Comments Today</th>
							<th>Comments Total</th>
							<th>Comments Modified</th>
							<th>User</th>
							<th>Link</th>
						</tr>

						{#each data.dailyQuestions as question}
							<tr>
								<td>{question.question}</td>
								<td>{convertDateToReadable(question.created_at)} </td>
								<td>{question.number_of_comments_today}</td>
								<td>{question.number_of_comments}</td>
								<td>{question.number_modified}</td>

								<td>
									<a href="/users/{question.user_external_id}">{question.user_email}</a>
								</td>
								<td>
									<a href="/questions/{question.url}">{question.url}</a>
								</td>
							</tr>
						{/each}
					</table>
				</div>
			</div>
		</details>

		<div class="row">
			<div class="column">
				<h2>Is Demo Time: {isDemoTime}</h2>
				<div class="row">
					<button
						type="button"
						class="btn btn-primary"
						on:click={() => {
							changeDemoTime();
						}}
					>
						Change Demo Time
					</button>
				</div>
			</div>
			<div class="row">
				<button
					type="button"
					class="btn btn-primary"
					on:click={() => {
						getModal('confirmReindex').open();
					}}>Reindex Elastic Search</button
				>
			</div>
		</div>
	</div>
{:else}
	<div class="pretty-div">
		<h1>Error</h1>
	</div>
{/if}

<Modal2 id="confirmReindex">
	<h1>Reindex elastic</h1>
	Are you sure?
	<button type="button" class="btn btn-primary" on:click={reindexEverything}>yes</button>
</Modal2>

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
</style>

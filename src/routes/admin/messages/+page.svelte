<!-- routes/admin/messages/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { browser, dev } from '$app/environment';

	import { io } from 'socket.io-client';

	export let data: PageData;
	let socket: any;
	let serverMessage: string;
	let messages: string[] = [];

	let userMessage: string;
	let userMessages: { to: string; from: string; message: string }[] = [];
	let userid: string;
	let socketid: string;
	let socketID: string;
	let channelListeningOn: string;

	onMount(async () => {
		if (browser) {
			if (!dev) {
				socket = io('https://9takes.com:3000', {
					transports: ['websocket', 'polling', 'flashsocket']
				});
			} else {
				socket = io();
			}

			socket.on(
				'eventFromServer',
				(msg: string, meta: { to: string; from: string; message: string }) => {
					messages = [...messages, msg];
				}
			);
			channelListeningOn = `user:${data?.user?.external_id || Math.random()}`;

			socket.on(
				channelListeningOn,
				(msg: string, meta: { to: string; from: string; message: string }) => {
					userMessages = [...userMessages, meta];
				}
			);
		}
	});
</script>

<div class="rounded-lg bg-neutral-50 bg-opacity-80 p-6 shadow-lg backdrop-blur-sm">
	<!-- Page Header -->
	<div class="page-header mb-6">
		<h1 class="text-2xl font-bold text-neutral-900">Messages</h1>
		<p class="text-neutral-600">Monitor real-time user messages and interactions</p>
	</div>

	<div class="rounded-lg bg-white p-6 shadow-md">
		<div class="flex flex-col gap-8 lg:flex-row lg:justify-between">
			<div class="flex-1">
				<h2 class="mb-4 text-xl font-semibold text-neutral-800">Server Messages</h2>
				<div class="mb-4">
					<label for="socketID" class="mb-2 block text-sm font-medium text-neutral-700">Socket ID</label>
					<input
						type="text"
						name="socketID"
						id="socketID"
						bind:value={socketID}
						placeholder="Enter socket ID"
						class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
					/>
				</div>

				<div class="mb-4">
					<label for="message" class="mb-2 block text-sm font-medium text-neutral-700">Message</label>
					<input
						type="text"
						name="message"
						id="message"
						bind:value={serverMessage}
						placeholder="Enter message"
						class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
					/>
				</div>
				<button
					type="button"
					class="rounded bg-primary-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					id="signup"
					on:click={() => {
						const sendChannel = `${userid}`;
						socket.emit('clientBroadCastEvent', serverMessage, sendChannel);
					}}
				>
					Broadcast Events
				</button>
			</div>

			<div class="flex-1">
				<h3 class="mb-4 text-lg font-semibold text-neutral-800">Server Messages</h3>
				<div class="max-h-96 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4">
					<ul class="space-y-2">
						{#each messages as m}
							<li class="rounded bg-white p-2 text-sm text-neutral-700">
								{m}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>


	<div class="rounded-lg bg-white p-6 shadow-md">
		<div class="flex flex-col gap-8 lg:flex-row lg:justify-between">
			<div class="flex-1">
				<h2 class="mb-4 text-xl font-semibold text-neutral-800">User Messages</h2>
				<div class="mb-4">
					<label for="user" class="mb-2 block text-sm font-medium text-neutral-700">User ID</label>
					<input 
						type="text" 
						name="user" 
						id="user" 
						bind:value={userid} 
						placeholder="Enter user ID" 
						class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
					/>
				</div>

				<div class="mb-4">
					<label for="message2" class="mb-2 block text-sm font-medium text-neutral-700">Message</label>
					<input
						type="text"
						name="message"
						id="message2"
						bind:value={userMessage}
						placeholder="Enter message"
						class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
					/>
				</div>
				<button
					type="button"
					class="rounded bg-primary-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					id="signup2"
					on:click={() => {
						const sendChannel = `user:${userid}`;

						socket.emit('eventFromClient', userMessage, {
							to: sendChannel,
							from: channelListeningOn,
							message: userMessage
						});
					}}
				>
					Emit Event
				</button>
				<div class="mt-6">
					<h3 class="mb-3 text-lg font-semibold text-neutral-800">Available Users</h3>
					{#if data?.users?.length}
						<div class="max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4">
							<ul class="space-y-2">
								{#each data?.users as u}
									{#if u}
										<li class="rounded bg-white p-2 text-sm">
											<span class="font-medium text-neutral-800">{u?.email}</span>
											<span class="text-neutral-500">ID: {u?.external_id}</span>
										</li>
									{/if}
								{/each}
							</ul>
						</div>
					{:else}
						<p class="text-sm text-neutral-600">No users available</p>
					{/if}
				</div>
			</div>
			<div class="flex-1">
				<h3 class="mb-4 text-lg font-semibold text-neutral-800">User Messages</h3>
				<div class="max-h-96 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4">
					<ul class="space-y-2">
						{#each userMessages as um}
							<li class="rounded bg-white p-3">
								<div class="mb-1 text-xs font-medium text-primary-600">{um.from}</div>
								<div class="text-sm text-neutral-700">{um.message}</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	h1 {
		font-size: 1.5rem;
	}
</style>

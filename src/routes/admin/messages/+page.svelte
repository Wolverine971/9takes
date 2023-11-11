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
		console.log('mounting messages');

		if (browser) {
			if (dev) {
				socket = io('http://localhost:3000', {
					transports: ['websocket', 'polling', 'flashsocket']
				});
			} else {
				socket = io();
			}

			socket.on(
				'eventFromServer',
				(msg: string, meta: { to: string; from: string; message: string }) => {
					console.log(msg, meta);
					messages = [...messages, msg];
				}
			);
			channelListeningOn = `user:${data.user.external_id}`;

			console.log(`listening for ${channelListeningOn}`);
			socket.on(
				channelListeningOn,
				(msg: string, meta: { to: string; from: string; message: string }) => {
					console.log(meta);
					userMessages = [...userMessages, meta];
				}
			);
		}
	});
</script>

<div style="display: flex; justify-content: space-between; align-items: baseline">
	<div>
		<h1>Server Messages</h1>
		<input type="text" name="socketID" id="socketID" bind:value={socketID} placeholder="socketID" />

		<input
			type="text"
			name="message"
			id="message"
			bind:value={serverMessage}
			placeholder="message"
		/>
		<button
			type="button"
			class="btn btn-primary"
			id="signup"
			on:click={() => {
				const sendChannel = `${userid}`;
				socket.emit('clientBroadCastEvent', serverMessage, sendChannel);
			}}
		>
			broadcast events
		</button>
	</div>

	<div>
		<h2>Server Messages</h2>
		<ul>
			{#each messages as m}
				<li>
					<span class="marquee-text">{m}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
<br />
<hr />
<br />

<div style="display: flex; justify-content: space-between; align-items: baseline">
	<div>
		<h1>User Messages</h1>
		<div>
			<input type="text" name="user" id="user" bind:value={userid} placeholder="User id" />

			<input
				type="text"
				name="message"
				id="message"
				bind:value={userMessage}
				placeholder="message"
			/>
			<button
				type="button"
				class="btn btn-primary"
				id="signup"
				on:click={() => {
					const sendChannel = `user:${userid}`;

					console.log(sendChannel, userMessage);
					socket.emit('eventFromClient', userMessage, {
						to: sendChannel,
						from: channelListeningOn,
						message: userMessage
					});
				}}
			>
				emit event
			</button>
		</div>
		<div>
			<h2>Users</h2>
			{#if data?.users?.length}
				<ul>
					{#each data?.users as u}
						{#if u}
							<li>
								<span>{u?.email}</span> : <span>{u?.external_id}</span>
							</li>
						{/if}
					{/each}
				</ul>
			{/if}
		</div>
	</div>
	<div>
		<h2>User Messages</h2>
		<ul>
			{#each userMessages as um}
				<li style="display: flex; justify-content: space-between">
					<span style="font-weight: bold; max-width: 2rem">{um.from}</span><span class=""
						>{um.message}</span
					>
				</li>
			{/each}
		</ul>
	</div>
</div>

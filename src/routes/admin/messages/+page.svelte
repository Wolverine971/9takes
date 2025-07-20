<!-- routes/admin/messages/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { RealtimeMessaging, createPresenceChannel, type Message } from '$lib/realtime';
	import { page } from '$app/stores';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { supabase } from '$lib/supabase';

	export let data: PageData;
	
	let serverMessage: string;
	let messages: Message[] = [];
	let userMessage: string;
	let userMessages: Message[] = [];
	let userid: string;
	let channelListeningOn: string;
	let onlineUsers: { id: string; email: string; presence_ref: string }[] = [];
	
	let messaging: RealtimeMessaging;
	let presenceChannel: RealtimeChannel;
	let globalChannel: RealtimeChannel;
	let userChannel: RealtimeChannel;

	onMount(async () => {
		if (browser) {
			// Initialize realtime messaging with browser client
			messaging = new RealtimeMessaging(supabase);
			
			// Set up user's personal channel
			channelListeningOn = `user-${data?.user?.external_id || 'anonymous'}`;
			
			// Subscribe to global admin channel for server messages
			globalChannel = messaging.subscribeToChannel('admin-global', (message) => {
				if (message.type === 'server') {
					messages = [...messages, message];
				}
			});
			
			// Subscribe to user's personal channel
			userChannel = messaging.subscribeToChannel(channelListeningOn, (message) => {
				if (message.type === 'user') {
					userMessages = [...userMessages, message];
				}
			});
			
			// Set up presence channel to track online users
			if (data?.user) {
				presenceChannel = createPresenceChannel(
					supabase,
					'admin-presence',
					{ id: data.user.external_id, email: data.user.email }
				);
				
				presenceChannel
					.on('presence', { event: 'sync' }, () => {
						const state = presenceChannel.presenceState();
						onlineUsers = Object.values(state).flat() as any[];
					})
					.on('presence', { event: 'join' }, ({ key, newPresences }) => {
						onlineUsers = [...onlineUsers, ...newPresences];
					})
					.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
						onlineUsers = onlineUsers.filter(
							user => !leftPresences.some(left => left.presence_ref === user.presence_ref)
						);
					})
					.subscribe(async (status) => {
						if (status === 'SUBSCRIBED') {
							await presenceChannel.track({
								id: data.user.external_id,
								email: data.user.email,
								online_at: new Date().toISOString()
							});
						}
					});
			}
		}
		
		return () => {
			cleanup();
		};
	});
	
	onDestroy(() => {
		cleanup();
	});
	
	async function cleanup() {
		if (messaging) {
			await messaging.unsubscribeFromAllChannels();
		}
		if (presenceChannel) {
			await supabase.removeChannel(presenceChannel);
		}
	}
	
	async function broadcastServerMessage() {
		if (!serverMessage || !messaging) return;
		
		const targetChannel = userid ? `user-${userid}` : 'admin-global';
		await messaging.sendMessage(targetChannel, {
			type: 'server',
			from: `admin-${data?.user?.external_id || 'system'}`,
			content: serverMessage
		});
		
		// Add to local messages if broadcasting to global
		if (!userid) {
			messages = [...messages, {
				id: crypto.randomUUID(),
				type: 'server',
				from: `admin-${data?.user?.external_id || 'system'}`,
				content: serverMessage,
				timestamp: new Date().toISOString()
			}];
		}
		
		serverMessage = '';
	}
	
	async function sendUserMessage() {
		if (!userMessage || !userid || !messaging) return;
		
		const targetChannel = `user-${userid}`;
		await messaging.sendMessage(targetChannel, {
			type: 'user',
			from: channelListeningOn,
			to: targetChannel,
			content: userMessage
		});
		
		userMessage = '';
	}
</script>

<div class="admin-messages">
	<!-- Page Header -->
	<div class="page-header">
		<h1>Real-time Messaging Center</h1>
		<p class="subtitle">Send instant messages to users and monitor conversations in real-time</p>
		<div class="info-banner">
			<div class="info-icon">ℹ️</div>
			<div class="info-content">
				<p><strong>How it works:</strong> This page uses Supabase Realtime for instant messaging.</p>
				<ul>
					<li>📢 <strong>Global Broadcast</strong>: Leave user ID empty to message all online users</li>
					<li>👤 <strong>Direct Message</strong>: Enter a user ID to send a private message</li>
					<li>🟢 <strong>Online Status</strong>: See who's currently active in real-time</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="section-card">
		<div class="message-grid">
			<div class="flex-1">
				<h2 class="mb-4 text-xl font-semibold text-neutral-800">📤 Send Messages</h2>
				<div class="mb-4">
					<label for="userid" class="mb-2 block text-sm font-medium text-neutral-700">
						Target User ID
						<span class="text-xs text-neutral-500 font-normal">(Leave empty to broadcast to all)</span>
					</label>
					<input
						type="text"
						name="userid"
						id="userid"
						bind:value={userid}
						placeholder="e.g., user-123 or leave empty"
						class="w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
					/>
					<p class="mt-1 text-xs text-neutral-600">
						💡 Tip: Copy a user ID from the "Online Users" or "All Users" sections below
					</p>
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
					class="rounded bg-primary-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center gap-2"
					on:click={broadcastServerMessage}
					disabled={!serverMessage}
				>
					{#if userid}
						<span>📨</span> Send Direct Message
					{:else}
						<span>📢</span> Broadcast to All
					{/if}
				</button>
			</div>

			<div class="flex-1">
				<h3 class="mb-4 text-lg font-semibold text-neutral-800">📥 Broadcast History</h3>
				<div class="max-h-96 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4">
					{#if messages.length === 0}
						<p class="text-center text-neutral-500 text-sm py-8">
							No broadcast messages yet. Send your first message!
						</p>
					{:else}
						<ul class="space-y-2">
							{#each messages as m}
								<li class="rounded bg-white p-3 hover:shadow-sm transition-shadow">
									<div class="flex justify-between items-start mb-1">
										<span class="text-xs font-medium text-primary-600">
											{m.from === `admin-${data?.user?.external_id}` ? '👤 You' : m.from}
										</span>
										<span class="text-xs text-neutral-500">{new Date(m.timestamp).toLocaleTimeString()}</span>
									</div>
									<div class="text-sm text-neutral-700">{m.content}</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>
	</div>


	<div class="section-card">
		<h2 class="section-title">👥 User Management & Direct Messaging</h2>
		<p class="section-description">View online users, browse all users, and send direct messages</p>
		
		<div class="message-grid">
			<div class="flex-1">
				<h3 class="mb-4 text-lg font-semibold text-neutral-800">📨 Send Direct Message</h3>
				<div class="mb-4">
					<label for="user" class="mb-2 block text-sm font-medium text-neutral-700">
						Recipient User ID
						<span class="text-xs text-neutral-500 font-normal">(Required for direct messages)</span>
					</label>
					<input 
						type="text" 
						name="user" 
						id="user" 
						bind:value={userid} 
						placeholder="Enter user ID (e.g., user-123)" 
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
					class="rounded bg-primary-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
					on:click={sendUserMessage}
					disabled={!userMessage || !userid}
				>
					<span>📤</span> Send Direct Message
				</button>
				{#if !userid && userMessage}
					<p class="mt-2 text-sm text-amber-600">⚠️ Please enter a user ID to send a direct message</p>
				{/if}
				<div class="mt-6">
					<h3 class="mb-3 text-lg font-semibold text-neutral-800">
						🟢 Online Users 
						<span class="text-sm font-normal text-neutral-500">({onlineUsers.length})</span>
					</h3>
					{#if onlineUsers.length > 0}
						<div class="max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4">
							<ul class="space-y-2">
								{#each onlineUsers as user}
									<li class="rounded bg-white p-2 text-sm flex items-center justify-between hover:bg-neutral-50 cursor-pointer transition-colors"
										on:click={() => userid = user.id}
										on:keypress={(e) => e.key === 'Enter' && (userid = user.id)}
										role="button"
										tabindex="0">
										<div>
											<span class="font-medium text-neutral-800">{user.email}</span>
											<span class="text-neutral-500 block text-xs">ID: {user.id}</span>
										</div>
										<div class="flex items-center gap-2">
											<span class="text-xs text-neutral-500">Click to select</span>
											<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
										</div>
									</li>
								{/each}
							</ul>
						</div>
					{:else}
						<p class="text-sm text-neutral-600 text-center py-4">No users currently online</p>
					{/if}
				</div>
				
				<div class="mt-6">
					<h3 class="mb-3 text-lg font-semibold text-neutral-800">
						📋 All Users 
						<span class="text-sm font-normal text-neutral-500">({data?.users?.length || 0} total)</span>
					</h3>
					{#if data?.users?.length}
						<div class="max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4">
							<ul class="space-y-2">
								{#each data?.users as u}
									{#if u}
										<li class="rounded bg-white p-2 text-sm hover:bg-neutral-50 cursor-pointer transition-colors"
											on:click={() => userid = u.external_id}
											on:keypress={(e) => e.key === 'Enter' && (userid = u.external_id)}
											role="button"
											tabindex="0">
											<div class="flex justify-between items-center">
												<div>
													<span class="font-medium text-neutral-800">{u?.email}</span>
													<span class="text-neutral-500 block text-xs">ID: {u?.external_id}</span>
												</div>
												<span class="text-xs text-neutral-500">Click to select</span>
											</div>
										</li>
									{/if}
								{/each}
							</ul>
						</div>
					{:else}
						<p class="text-sm text-neutral-600 text-center py-4">No users in database</p>
					{/if}
				</div>
			</div>
			<div class="flex-1">
				<h3 class="mb-4 text-lg font-semibold text-neutral-800">
					💬 Direct Message History
					<span class="text-sm font-normal text-neutral-500 block">Messages sent to specific users</span>
				</h3>
				<div class="max-h-96 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4">
					{#if userMessages.length === 0}
						<div class="text-center py-8">
							<p class="text-neutral-500 text-sm mb-2">No direct messages yet</p>
							<p class="text-xs text-neutral-400">Select a user from the left panel and send them a message</p>
						</div>
					{:else}
						<ul class="space-y-2">
							{#each userMessages as um}
								<li class="rounded bg-white p-3 hover:shadow-sm transition-shadow">
									<div class="flex justify-between items-start mb-1">
										<span class="text-xs font-medium text-primary-600">
											{um.from === channelListeningOn ? '👤 You' : um.from}
											{#if um.to}
												<span class="text-neutral-500">→ {um.to}</span>
											{/if}
										</span>
										<span class="text-xs text-neutral-500">{new Date(um.timestamp).toLocaleTimeString()}</span>
									</div>
									<div class="text-sm text-neutral-700">{um.content}</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.admin-messages {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem;
		background-color: var(--background);
		min-height: calc(100vh - 4rem);
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0 0 0.5rem 0;
	}

	.subtitle {
		color: var(--text-secondary);
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
	}

	.info-banner {
		background-color: var(--primary-light, #e3f2fd);
		border: 1px solid var(--primary, #2196f3);
		border-radius: var(--border-radius);
		padding: 1rem;
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
	}

	.info-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.info-content p {
		margin: 0 0 0.5rem 0;
		font-weight: 500;
		color: var(--text-primary);
	}

	.info-content ul {
		margin: 0;
		padding-left: 1.25rem;
		list-style: none;
	}

	.info-content li {
		margin: 0.25rem 0;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.section-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		transition: box-shadow 0.2s ease;
	}
	
	.section-card:hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.5rem 0;
	}

	.section-description {
		color: var(--text-secondary);
		margin: 0 0 1.5rem 0;
		font-size: 0.875rem;
	}

	.message-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2.5rem;
		align-items: start;
	}
	
	@media (max-width: 1024px) {
		.message-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	h2 {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.75rem;
		font-weight: 600;
		color: var(--text-primary);
		font-size: 0.875rem;
		letter-spacing: 0.025em;
	}
	
	label .text-xs {
		font-weight: 400;
		color: var(--text-secondary);
		letter-spacing: 0;
	}

	input[type="text"] {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		background-color: var(--background);
		color: var(--text-primary);
		font-size: 0.875rem;
		transition: all 0.2s ease;
	}

	input[type="text"]:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
		transform: translateY(-1px);
	}
	
	input[type="text"]::placeholder {
		color: var(--text-secondary);
		opacity: 0.7;
	}

	button[type="button"] {
		padding: 0.75rem 1.5rem;
		background: linear-gradient(135deg, var(--primary) 0%, #2563eb 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
	}

	button[type="button"]:hover:not(:disabled) {
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	button[type="button"]:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.max-h-96 {
		max-height: 28rem;
	}

	.overflow-y-auto {
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--border-color) transparent;
	}

	.overflow-y-auto::-webkit-scrollbar {
		width: 6px;
	}

	.overflow-y-auto::-webkit-scrollbar-track {
		background: transparent;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb {
		background-color: var(--border-color);
		border-radius: 3px;
	}

	.overflow-y-auto::-webkit-scrollbar-thumb:hover {
		background-color: var(--text-secondary);
	}

	.rounded-lg {
		border-radius: 12px;
	}

	.border {
		border: 1px solid var(--border-color);
	}

	.bg-neutral-50 {
		background: linear-gradient(145deg, var(--hover-background) 0%, #f8fafc 100%);
	}

	.p-4 {
		padding: 1.5rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	ul li {
		padding: 1rem;
		background-color: var(--background);
		border-radius: 8px;
		margin-bottom: 0.75rem;
		font-size: 0.875rem;
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		transition: all 0.2s ease;
	}
	
	ul li:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border-color: var(--primary);
	}
	
	ul li:last-child {
		margin-bottom: 0;
	}

	.font-medium {
		font-weight: 500;
	}

	.text-neutral-500 {
		color: var(--text-secondary);
	}

	.text-primary-600 {
		color: var(--primary);
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	li[role="button"] {
		cursor: pointer;
	}

	li[role="button"]:focus {
		outline: 2px solid var(--primary);
		outline-offset: -2px;
	}

	@media (max-width: 768px) {
		.admin-messages {
			padding: 1rem;
		}
		
		.message-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.section-card {
			padding: 1.5rem;
			border-radius: 8px;
		}
		
		.max-h-96 {
			max-height: 20rem;
		}
		
		h2 {
			font-size: 1.25rem;
		}
		
		.section-title {
			font-size: 1.25rem;
		}
	}
</style>

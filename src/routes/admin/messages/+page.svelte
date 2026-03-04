<!-- src/routes/admin/messages/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { RealtimeMessaging, createPresenceChannel, type Message } from '$lib/realtime';
	import { page } from '$app/stores';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { supabase } from '$lib/supabase';

	let { data }: { data: PageData } = $props();

	let serverMessage = $state('');
	let messages = $state<Message[]>([]);
	let userMessage = $state('');
	let userMessages = $state<Message[]>([]);
	let userid = $state('');
	let channelListeningOn = $state('');
	let onlineUsers = $state<{ id: string; email: string; presence_ref: string }[]>([]);

	let messaging: RealtimeMessaging;
	let presenceChannel: RealtimeChannel;
	let globalChannel: RealtimeChannel;
	let userChannel: RealtimeChannel;

	onMount(async () => {
		if (browser) {
			messaging = new RealtimeMessaging(supabase);
			channelListeningOn = `user-${data?.user?.external_id || 'anonymous'}`;

			globalChannel = messaging.subscribeToChannel('admin-global', (message) => {
				if (message.type === 'server') {
					messages = [...messages, message];
				}
			});

			userChannel = messaging.subscribeToChannel(channelListeningOn, (message) => {
				if (message.type === 'user') {
					userMessages = [...userMessages, message];
				}
			});

			if (data?.user) {
				presenceChannel = createPresenceChannel(supabase, 'admin-presence', {
					id: data.user.external_id,
					email: data.user.email
				});

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
							(user) => !leftPresences.some((left) => left.presence_ref === user.presence_ref)
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

		if (!userid) {
			messages = [
				...messages,
				{
					id: crypto.randomUUID(),
					type: 'server',
					from: `admin-${data?.user?.external_id || 'system'}`,
					content: serverMessage,
					timestamp: new Date().toISOString()
				}
			];
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

<div class="page-header">
	<h1>Messaging Center</h1>
	<p class="subtitle">Send instant messages to users and monitor conversations in real-time</p>
</div>

<div class="info-banner">
	<span class="info-icon">i</span>
	<div class="info-content">
		<p><strong>How it works:</strong> Uses Supabase Realtime for instant messaging.</p>
		<ul>
			<li>Leave user ID empty to broadcast to all online users</li>
			<li>Enter a user ID to send a direct message</li>
			<li>See who's currently active in real-time</li>
		</ul>
	</div>
</div>

<div class="section-card">
	<div class="message-grid">
		<div class="panel">
			<h2 class="panel-title">Send Messages</h2>

			<div class="field-group">
				<label for="userid" class="field-label">
					Target User ID
					<span class="field-hint">(Leave empty to broadcast to all)</span>
				</label>
				<input
					type="text"
					id="userid"
					bind:value={userid}
					placeholder="e.g., user-123 or leave empty"
					class="field-input"
				/>
			</div>

			<div class="field-group">
				<label for="message" class="field-label">Message</label>
				<input
					type="text"
					id="message"
					bind:value={serverMessage}
					placeholder="Enter message"
					class="field-input"
				/>
			</div>

			<button
				type="button"
				class="btn btn-primary"
				onclick={broadcastServerMessage}
				disabled={!serverMessage}
			>
				{#if userid}
					Send Direct Message
				{:else}
					Broadcast to All
				{/if}
			</button>
		</div>

		<div class="panel">
			<h2 class="panel-title">Broadcast History</h2>
			<div class="message-list">
				{#if messages.length === 0}
					<p class="empty-text">No broadcast messages yet.</p>
				{:else}
					{#each messages as m}
						<div class="message-item">
							<div class="message-header">
								<span class="message-from">
									{m.from === `admin-${data?.user?.external_id}` ? 'You' : m.from}
								</span>
								<span class="message-time">
									{new Date(m.timestamp).toLocaleTimeString()}
								</span>
							</div>
							<p class="message-content">{m.content}</p>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>

<div class="section-card">
	<h2 class="section-title">User Management & Direct Messaging</h2>
	<p class="section-description">View online users, browse all users, and send direct messages</p>

	<div class="message-grid">
		<div class="panel">
			<h3 class="panel-title">Send Direct Message</h3>

			<div class="field-group">
				<label for="user" class="field-label">
					Recipient User ID
					<span class="field-hint">(Required for direct messages)</span>
				</label>
				<input
					type="text"
					id="user"
					bind:value={userid}
					placeholder="Enter user ID (e.g., user-123)"
					class="field-input"
				/>
			</div>

			<div class="field-group">
				<label for="message2" class="field-label">Message</label>
				<input
					type="text"
					id="message2"
					bind:value={userMessage}
					placeholder="Enter message"
					class="field-input"
				/>
			</div>

			<button
				type="button"
				class="btn btn-primary"
				onclick={sendUserMessage}
				disabled={!userMessage || !userid}
			>
				Send Direct Message
			</button>

			{#if !userid && userMessage}
				<p class="warning-text">Please enter a user ID to send a direct message</p>
			{/if}

			<!-- Online Users -->
			<div class="user-section">
				<h3 class="panel-subtitle">
					Online Users
					<span class="count-badge online">{onlineUsers.length}</span>
				</h3>
				{#if onlineUsers.length > 0}
					<div class="user-list">
						{#each onlineUsers as user}
							<button type="button" class="user-item" onclick={() => (userid = user.id)}>
								<div class="user-info">
									<span class="user-email">{user.email}</span>
									<span class="user-id">ID: {user.id}</span>
								</div>
								<div class="user-status">
									<span class="select-hint">Select</span>
									<span class="online-dot"></span>
								</div>
							</button>
						{/each}
					</div>
				{:else}
					<p class="empty-text">No users currently online</p>
				{/if}
			</div>

			<!-- All Users -->
			<div class="user-section">
				<h3 class="panel-subtitle">
					All Users
					<span class="count-badge">{data?.users?.length || 0}</span>
				</h3>
				{#if data?.users?.length}
					<div class="user-list">
						{#each data?.users as u}
							{#if u}
								<button type="button" class="user-item" onclick={() => (userid = u.external_id)}>
									<div class="user-info">
										<span class="user-email">{u?.email}</span>
										<span class="user-id">ID: {u?.external_id}</span>
									</div>
									<span class="select-hint">Select</span>
								</button>
							{/if}
						{/each}
					</div>
				{:else}
					<p class="empty-text">No users in database</p>
				{/if}
			</div>
		</div>

		<div class="panel">
			<h3 class="panel-title">Direct Message History</h3>
			<p class="panel-description">Messages sent to specific users</p>
			<div class="message-list">
				{#if userMessages.length === 0}
					<div class="empty-state">
						<p class="empty-text">No direct messages yet</p>
						<p class="empty-hint">Select a user from the left panel and send them a message</p>
					</div>
				{:else}
					{#each userMessages as um}
						<div class="message-item">
							<div class="message-header">
								<span class="message-from">
									{um.from === channelListeningOn ? 'You' : um.from}
									{#if um.to}
										<span class="message-to"> &rarr; {um.to}</span>
									{/if}
								</span>
								<span class="message-time">
									{new Date(um.timestamp).toLocaleTimeString()}
								</span>
							</div>
							<p class="message-content">{um.content}</p>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* Info Banner */
	.info-banner {
		display: flex;
		gap: 12px;
		padding: 14px 16px;
		margin-bottom: 20px;
		background: var(--void-elevated);
		border: 1px solid var(--void-highlight);
		border-radius: 12px;
	}

	.info-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--shadow-monarch);
		color: white;
		font-size: 0.75rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.info-content p {
		margin: 0 0 6px;
		font-size: 0.85rem;
		color: var(--text-primary);
	}

	.info-content ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.info-content li {
		font-size: 0.8rem;
		color: var(--text-secondary);
		padding: 2px 0;
	}

	/* Section Card */
	.section-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.section-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 4px;
	}

	.section-description {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin: 0 0 20px;
	}

	/* Grid Layout */
	.message-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		align-items: start;
	}

	/* Panels */
	.panel {
		min-width: 0;
	}

	.panel-title {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 16px;
	}

	.panel-subtitle {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 10px;
	}

	.panel-description {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin: 0 0 12px;
	}

	/* Form Fields */
	.field-group {
		margin-bottom: 14px;
	}

	.field-label {
		display: block;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 6px;
	}

	.field-hint {
		font-weight: 400;
		color: var(--text-secondary);
		font-size: 0.75rem;
	}

	.field-input {
		width: 100%;
		padding: 9px 12px;
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		background: var(--void-deep);
		color: var(--text-primary);
		font-size: 0.85rem;
		font-family: inherit;
		transition: border-color 0.15s ease;
		box-sizing: border-box;
	}

	.field-input:focus {
		outline: none;
		border-color: var(--shadow-monarch);
		box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
	}

	.field-input::placeholder {
		color: var(--text-secondary);
		opacity: 0.6;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding: 9px 18px;
		border-radius: 8px;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
		border: none;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-monarch-dark) 100%);
		color: white;
		box-shadow: var(--glow-sm);
	}

	.btn-primary:hover:not(:disabled) {
		box-shadow: var(--glow-md);
	}

	/* Warning */
	.warning-text {
		margin: 8px 0 0;
		font-size: 0.8rem;
		color: #f59e0b;
	}

	/* Message List */
	.message-list {
		max-height: 400px;
		overflow-y: auto;
		background: var(--void-deep);
		border: 1px solid var(--void-elevated);
		border-radius: 10px;
		padding: 12px;
	}

	.message-item {
		padding: 10px 12px;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		margin-bottom: 8px;
		transition: border-color 0.15s ease;
	}

	.message-item:last-child {
		margin-bottom: 0;
	}

	.message-item:hover {
		border-color: var(--void-highlight);
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 4px;
	}

	.message-from {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--shadow-monarch);
	}

	.message-to {
		color: var(--text-secondary);
		font-weight: 400;
	}

	.message-time {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.message-content {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-primary);
		line-height: 1.4;
	}

	/* User Sections */
	.user-section {
		margin-top: 20px;
	}

	.count-badge {
		padding: 1px 8px;
		background: var(--void-elevated);
		color: var(--text-secondary);
		border-radius: 12px;
		font-size: 0.7rem;
		font-weight: 600;
	}

	.count-badge.online {
		background: rgba(16, 185, 129, 0.15);
		color: #10b981;
	}

	.user-list {
		max-height: 200px;
		overflow-y: auto;
		background: var(--void-deep);
		border: 1px solid var(--void-elevated);
		border-radius: 10px;
		padding: 6px;
	}

	.user-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 8px 10px;
		background: transparent;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		transition: background 0.15s ease;
	}

	.user-item:hover {
		background: var(--void-surface);
	}

	.user-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.user-email {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-id {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.user-status {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.select-hint {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.online-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #10b981;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Empty States */
	.empty-text {
		font-size: 0.85rem;
		color: var(--text-secondary);
		text-align: center;
		padding: 16px 0;
		margin: 0;
	}

	.empty-state {
		padding: 32px 16px;
		text-align: center;
	}

	.empty-hint {
		font-size: 0.75rem;
		color: var(--text-secondary);
		opacity: 0.7;
		margin: 4px 0 0;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.message-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}
	}

	@media (max-width: 768px) {
		.section-card {
			padding: 16px;
		}
	}
</style>

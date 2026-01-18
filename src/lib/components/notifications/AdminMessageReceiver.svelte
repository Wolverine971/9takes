<!-- src/lib/components/notifications/AdminMessageReceiver.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { RealtimeMessaging, type Message } from '$lib/realtime';
	import { supabase } from '$lib/supabase';
	import { notifications } from '$lib/components/molecules/notifications';

	export let user: any = null;

	let messaging: RealtimeMessaging;
	let userChannel: any;
	let globalChannel: any;

	// Store received messages
	let recentMessages: Message[] = [];
	let showNotifications = false;

	onMount(() => {
		if (browser && user) {
			setupRealtimeListening();
		}

		return () => cleanup();
	});

	onDestroy(() => {
		cleanup();
	});

	async function setupRealtimeListening() {
		messaging = new RealtimeMessaging(supabase);

		// Listen for global admin broadcasts
		globalChannel = messaging.subscribeToChannel('admin-global', (message) => {
			if (message.type === 'server') {
				handleAdminMessage(message, 'Global Announcement');
			}
		});

		// Listen for direct messages to this user
		const userChannelName = `user-${user.external_id}`;
		userChannel = messaging.subscribeToChannel(userChannelName, (message) => {
			if (message.type === 'server' || message.type === 'user') {
				handleAdminMessage(message, 'Direct Message');
			}
		});
	}

	function handleAdminMessage(message: Message, type: string) {
		// Add to recent messages
		recentMessages = [message, ...recentMessages].slice(0, 10); // Keep last 10

		// Show browser notification if permission granted
		if ('Notification' in window && Notification.permission === 'granted') {
			new Notification(`${type} from Admin`, {
				body: message.content,
				icon: '/favicon.png',
				tag: 'admin-message'
			});
		}

		// Show in-app notification using your existing notification system
		notifications.info(`📢 ${type}: ${message.content}`, 8000);

		// Auto-show notification panel briefly
		showNotifications = true;
		setTimeout(() => {
			showNotifications = false;
		}, 5000);
	}

	async function cleanup() {
		if (messaging) {
			await messaging.unsubscribeFromAllChannels();
		}
	}

	// Request notification permission
	async function requestNotificationPermission() {
		if ('Notification' in window && Notification.permission === 'default') {
			await Notification.requestPermission();
		}
	}

	function toggleNotifications() {
		showNotifications = !showNotifications;
	}

	function formatTime(timestamp: string) {
		return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

{#if browser && user}
	<!-- Notification Bell Icon -->
	<div class="notification-container">
		<button
			class="notification-bell"
			class:has-messages={recentMessages.length > 0}
			on:click={toggleNotifications}
			title="Admin Messages"
			aria-label="View admin messages"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
				<path d="M13.73 21a2 2 0 0 1-3.46 0" />
			</svg>
			{#if recentMessages.length > 0}
				<span class="notification-badge">{recentMessages.length}</span>
			{/if}
		</button>

		<!-- Notification Panel -->
		{#if showNotifications}
			<div class="notification-panel">
				<div class="notification-header">
					<h3 style="padding: 0;">Admin Messages</h3>
					<button class="close-btn" on:click={() => (showNotifications = false)}>×</button>
				</div>

				<div class="notification-content">
					{#if recentMessages.length === 0}
						<p class="no-messages">No messages from admin</p>
						<button class="permission-btn" on:click={requestNotificationPermission}>
							Enable Browser Notifications
						</button>
					{:else}
						<div class="messages-list">
							{#each recentMessages as message}
								<div class="message-item">
									<div class="message-header">
										<span class="message-type">
											{message.to ? '📨 Direct' : '📢 Broadcast'}
										</span>
										<span class="message-time">{formatTime(message.timestamp)}</span>
									</div>
									<div class="message-content">{message.content}</div>
								</div>
							{/each}
						</div>

						<div class="notification-actions">
							<button class="clear-btn" on:click={() => (recentMessages = [])}> Clear All </button>
							<button class="permission-btn" on:click={requestNotificationPermission}>
								Enable Browser Notifications
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Solo Leveling Dark Theme - Admin Notifications */
	.notification-container {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin: 0 0.25rem;
	}

	.notification-bell {
		background: transparent;
		border: none;
		font-size: 1.125rem;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		color: #94a3b8;
	}

	.notification-bell:hover {
		background-color: rgba(124, 58, 237, 0.15);
		color: #a78bfa;
	}

	.notification-bell:focus {
		outline: 2px solid #a78bfa;
		outline-offset: 2px;
	}

	.notification-bell:focus:not(:focus-visible) {
		outline: none;
	}

	.notification-bell:active {
		transform: scale(0.95);
	}

	.notification-bell.has-messages {
		color: #a78bfa;
		animation: shake 0.5s ease-in-out;
	}

	.notification-badge {
		position: absolute;
		top: 0.125rem;
		right: 0.125rem;
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
		border-radius: 9999px;
		min-width: 1.125rem;
		height: 1.125rem;
		padding: 0 0.25rem;
		font-size: 0.625rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		border: 2px solid #1a1a2e;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
		z-index: 10;
	}

	.notification-panel {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: -0.5rem;
		width: 340px;
		max-height: 450px;
		background: #16161e;
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 0.75rem;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.5),
			0 0 30px rgba(124, 58, 237, 0.1);
		z-index: 1000;
		overflow: hidden;
		transform: translateY(-8px);
		opacity: 0;
		animation: slideDown 0.2s ease-out forwards;
	}

	@keyframes slideDown {
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.notification-header {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid rgba(124, 58, 237, 0.15);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, transparent 100%);
	}

	.notification-header h3 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #f1f5f9;
		letter-spacing: -0.01em;
	}

	.close-btn {
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		font-size: 1.25rem;
		cursor: pointer;
		color: #64748b;
		width: 1.75rem;
		height: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		transition: all 0.15s ease;
	}

	.close-btn:hover {
		background: rgba(124, 58, 237, 0.15);
		color: #e2e8f0;
	}

	.close-btn:active {
		transform: scale(0.95);
	}

	.notification-content {
		max-height: 300px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(124, 58, 237, 0.3) transparent;
	}

	.notification-content::-webkit-scrollbar {
		width: 5px;
	}

	.notification-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.notification-content::-webkit-scrollbar-thumb {
		background-color: rgba(124, 58, 237, 0.3);
		border-radius: 3px;
	}

	.notification-content::-webkit-scrollbar-thumb:hover {
		background-color: rgba(124, 58, 237, 0.5);
	}

	.no-messages {
		padding: 2.5rem 1.25rem;
		text-align: center;
		color: #64748b;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.messages-list {
		padding: 0.5rem;
	}

	.message-item {
		padding: 0.875rem 1rem;
		margin: 0.25rem 0;
		border-radius: 0.5rem;
		background: rgba(124, 58, 237, 0.05);
		border: 1px solid transparent;
		transition: all 0.15s ease;
		position: relative;
	}

	.message-item:first-child {
		margin-top: 0;
	}

	.message-item:last-child {
		margin-bottom: 0;
	}

	.message-item:hover {
		background: rgba(124, 58, 237, 0.1);
		border-color: rgba(124, 58, 237, 0.2);
	}

	.message-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 50%;
		width: 2px;
		background: #7c3aed;
		border-radius: 0 2px 2px 0;
		opacity: 0;
		transition: opacity 0.15s ease;
	}

	.message-item:hover::before {
		opacity: 1;
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.375rem;
		gap: 0.75rem;
	}

	.message-type {
		font-size: 0.75rem;
		font-weight: 600;
		color: #a78bfa;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.message-time {
		font-size: 0.6875rem;
		color: #64748b;
		white-space: nowrap;
	}

	.message-content {
		font-size: 0.8125rem;
		color: #cbd5e1;
		line-height: 1.5;
		word-wrap: break-word;
	}

	.notification-actions {
		padding: 0.75rem 1rem;
		border-top: 1px solid rgba(124, 58, 237, 0.15);
		display: flex;
		gap: 0.5rem;
		background: rgba(0, 0, 0, 0.2);
	}

	.clear-btn,
	.permission-btn {
		flex: 1;
		padding: 0.5rem 0.75rem;
		min-height: 2.25rem;
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 0.375rem;
		background: rgba(124, 58, 237, 0.1);
		color: #cbd5e1;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.permission-btn {
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		color: white;
		border-color: transparent;
	}

	.clear-btn:hover {
		background: rgba(124, 58, 237, 0.2);
		border-color: rgba(124, 58, 237, 0.3);
	}

	.permission-btn:hover {
		background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
		box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-2px);
		}
		75% {
			transform: translateX(2px);
		}
	}

	/* Tablet responsiveness */
	@media (max-width: 768px) {
		.notification-bell {
			width: 2.75rem;
			height: 2.75rem;
			padding: 0.625rem;
		}

		.notification-panel {
			width: 300px;
			right: -0.75rem;
			max-height: 60vh;
		}

		.notification-header {
			padding: 0.875rem 1rem;
		}

		.message-item {
			padding: 0.75rem 0.875rem;
		}

		.notification-actions {
			padding: 0.625rem 0.875rem;
		}

		.clear-btn,
		.permission-btn {
			min-height: 2.5rem;
			padding: 0.625rem 0.75rem;
			font-size: 0.8125rem;
		}
	}

	/* Mobile responsiveness */
	@media (max-width: 480px) {
		.notification-container {
			margin: 0;
		}

		.notification-panel {
			position: fixed;
			top: auto;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			max-height: 75vh;
			border-radius: 1rem 1rem 0 0;
			border-bottom: none;
			animation: slideUp 0.25s ease-out forwards;
		}

		.notification-header {
			padding: 1rem 1.25rem;
		}

		.notification-header h3 {
			font-size: 1rem;
		}

		.messages-list {
			padding: 0.75rem;
		}

		.message-item {
			padding: 1rem;
		}

		.message-content {
			font-size: 0.875rem;
		}

		.notification-actions {
			padding: 1rem;
			gap: 0.75rem;
		}

		.clear-btn,
		.permission-btn {
			min-height: 2.75rem;
			font-size: 0.875rem;
		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>

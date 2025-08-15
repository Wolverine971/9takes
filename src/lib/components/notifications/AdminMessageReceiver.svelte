<!-- lib/components/notifications/AdminMessageReceiver.svelte -->
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
					<h3>Admin Messages</h3>
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
	.notification-container {
		position: relative;
		display: inline-block;
	}

	.notification-bell {
		background: none;
		border: none;
		font-size: 1.125rem;
		cursor: pointer;
		padding: 0.375rem;
		border-radius: 50%;
		transition: all 0.2s ease;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		color: var(--text-primary, #1f2937);
	}

	.notification-bell:hover {
		background-color: var(--hover-background, #e5e7eb);
		border-color: var(--primary, #3b82f6);
		transform: translateY(-1px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.notification-bell:focus {
		outline: 2px solid var(--primary, #3b82f6);
		outline-offset: 2px;
	}

	.notification-bell:active {
		transform: scale(0.95);
	}

	.notification-bell.has-messages {
		animation: shake 0.5s ease-in-out;
	}

	.notification-badge {
		position: absolute;
		top: -4px;
		right: -4px;
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
		border-radius: 9999px;
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 0.25rem;
		font-size: 0.6875rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
		z-index: 10;
	}

	.notification-panel {
		position: absolute;
		top: calc(100% + 0.75rem);
		right: 0;
		width: 360px;
		max-height: 480px;
		background: white;
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 1rem;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid var(--border-color, #e5e5e5);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(135deg, var(--primary-light, #f8fafc) 0%, #f1f5f9 100%);
	}

	.notification-header h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary, #1f2937);
		letter-spacing: -0.025em;
	}

	.close-btn {
		background: var(--button-background, rgba(0, 0, 0, 0.05));
		border: none;
		border-radius: 0.375rem;
		font-size: 1.25rem;
		cursor: pointer;
		color: var(--text-secondary, #6b7280);
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		transition: all 0.15s ease;
	}

	.close-btn:hover {
		background: var(--hover-background, rgba(0, 0, 0, 0.1));
		color: var(--text-primary, #1f2937);
		transform: scale(1.05);
	}

	.close-btn:active {
		transform: scale(0.95);
	}

	.notification-content {
		max-height: 320px;
		overflow-y: auto;
		scrollbar-width: thin;
		padding: 0.5rem;
		scrollbar-color: var(--medium-gray, #d1d5db) transparent;
	}

	.notification-content::-webkit-scrollbar {
		width: 6px;
	}

	.notification-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.notification-content::-webkit-scrollbar-thumb {
		background-color: var(--medium-gray, #d1d5db);
		border-radius: 3px;
	}

	.notification-content::-webkit-scrollbar-thumb:hover {
		background-color: var(--dark-gray, #9ca3af);
	}

	.no-messages {
		padding: 3rem 1.5rem;
		text-align: center;
		color: var(--text-secondary, #6b7280);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.messages-list {
		padding: 0.5rem;
	}

	.message-item {
		padding: 1.25rem 1.5rem;
		margin: 0.25rem 0;
		border-radius: 0.5rem;
		background: var(--message-background, #f9fafb);
		border: 1px solid transparent;
		transition: all 0.2s ease;
		position: relative;
		cursor: pointer;
	}

	.message-item:first-child {
		margin-top: 0;
	}

	.message-item:last-child {
		margin-bottom: 0;
	}

	.message-item:hover {
		background-color: var(--hover-background, #f3f4f6);
		border-color: var(--border-color, #e5e7eb);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		transform: translateX(2px);
	}

	.message-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		height: 60%;
		width: 3px;
		background: var(--primary, #3b82f6);
		border-radius: 0 2px 2px 0;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.message-item:hover::before {
		opacity: 1;
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		gap: 1rem;
	}

	.message-type {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--primary, #3b82f6);
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.message-time {
		font-size: 0.75rem;
		color: var(--text-secondary, #6b7280);
		white-space: nowrap;
	}

	.message-content {
		font-size: 0.9375rem;
		color: var(--text-primary, #1f2937);
		line-height: 1.5;
		word-wrap: break-word;
	}

	.notification-actions {
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--border-color, #e5e5e5);
		display: flex;
		gap: 0.75rem;
		background-color: var(--background, #fafafa);
	}

	.clear-btn,
	.permission-btn {
		flex: 1;
		padding: 0.75rem 1rem;
		min-height: 2.75rem;
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 0.5rem;
		background: white;
		color: var(--text-primary, #1f2937);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.permission-btn {
		background: linear-gradient(135deg, var(--primary, #3b82f6) 0%, #2563eb 100%);
		color: white;
		border-color: var(--primary, #3b82f6);
	}

	.clear-btn:hover {
		background-color: var(--hover-background, #f9fafb);
		border-color: var(--primary, #3b82f6);
		transform: translateY(-1px);
	}

	.permission-btn:hover {
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
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

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.notification-bell {
			width: 3rem;
			height: 3rem;
			padding: 0.75rem;
		}

		.notification-panel {
			width: 320px;
			right: -1rem;
			max-height: 70vh;
		}

		.notification-header {
			padding: 1rem 1.25rem;
		}

		.message-item {
			padding: 1rem 1.25rem;
		}

		.notification-actions {
			padding: 1rem 1.25rem;
		}

		.clear-btn,
		.permission-btn {
			min-height: 3rem;
			padding: 0.875rem 1rem;
		}
	}

	@media (max-width: 480px) {
		.notification-panel {
			position: fixed;
			top: auto;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			max-height: 80vh;
			border-radius: 1rem 1rem 0 0;
			animation: slideUp 0.3s ease-out forwards;
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

	/* Dark mode support */
	@media (prefers-color-scheme: dark) {
		.notification-bell {
			color: #f9fafb;
		}

		.notification-bell:hover {
			background-color: rgba(255, 255, 255, 0.1);
		}

		.notification-panel {
			background: #1f2937;
			border-color: #374151;
		}

		.notification-header {
			background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
		}

		.notification-header h3 {
			color: #f9fafb;
		}

		.message-item {
			background: #374151;
			border-color: #4b5563;
		}

		.message-item:hover {
			background-color: #374151;
		}

		.message-content {
			color: #f3f4f6;
		}

		.clear-btn {
			background: #374151;
			border-color: #4b5563;
			color: #f9fafb;
		}

		.notification-bell {
			background: #374151;
			border-color: #4b5563;
		}

		.clear-btn:hover {
			background: #4b5563;
		}
	}
</style>

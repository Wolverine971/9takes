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
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
				<path d="M13.73 21a2 2 0 0 1-3.46 0"/>
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
					<button class="close-btn" on:click={() => showNotifications = false}>×</button>
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
							<button class="clear-btn" on:click={() => recentMessages = []}>
								Clear All
							</button>
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
		background-color: var(--hover-background, rgba(0, 0, 0, 0.05));
		transform: scale(1.05);
	}
	
	.notification-bell:focus {
		outline: 2px solid var(--primary, #3b82f6);
		outline-offset: 2px;
	}
	
	.notification-bell.has-messages {
		animation: shake 0.5s ease-in-out;
	}
	
	.notification-badge {
		position: absolute;
		top: -2px;
		right: -2px;
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
		border-radius: 50%;
		width: 1.125rem;
		height: 1.125rem;
		font-size: 0.625rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 10;
	}
	
	.notification-panel {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		width: 320px;
		max-height: 420px;
		background: white;
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 0.75rem;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
		border-bottom: 1px solid var(--border-color, #e5e5e5);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(135deg, var(--primary-light, #f8fafc) 0%, #f1f5f9 100%);
	}
	
	.notification-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary, #1f2937);
	}
	
	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary, #6b7280);
		padding: 0;
		line-height: 1;
	}
	
	.notification-content {
		max-height: 300px;
		overflow-y: auto;
	}
	
	.no-messages {
		padding: 2rem 1rem;
		text-align: center;
		color: var(--text-secondary, #6b7280);
		font-size: 0.875rem;
	}
	
	.messages-list {
		padding: 0.5rem 0;
	}
	
	.message-item {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border-color, #f3f4f6);
		transition: all 0.2s ease;
		position: relative;
	}
	
	.message-item:last-child {
		border-bottom: none;
	}
	
	.message-item:hover {
		background-color: var(--hover-background, #fafafa);
	}
	
	.message-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3px;
		background: var(--primary, #3b82f6);
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
		margin-bottom: 0.25rem;
	}
	
	.message-type {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--primary, #3b82f6);
	}
	
	.message-time {
		font-size: 0.75rem;
		color: var(--text-secondary, #6b7280);
	}
	
	.message-content {
		font-size: 0.875rem;
		color: var(--text-primary, #1f2937);
		line-height: 1.4;
	}
	
	.notification-actions {
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--border-color, #e5e5e5);
		display: flex;
		gap: 0.5rem;
		background-color: var(--background, #fafafa);
	}
	
	.clear-btn, .permission-btn {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 0.375rem;
		background: white;
		color: var(--text-primary, #1f2937);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
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
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-2px); }
		75% { transform: translateX(2px); }
	}
	
	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.notification-panel {
			width: 280px;
			right: -1rem;
			max-height: 60vh;
		}
		
		.notification-header {
			padding: 0.75rem 1rem;
		}
		
		.message-item {
			padding: 0.75rem 1rem;
		}
	}
	
	@media (max-width: 480px) {
		.notification-panel {
			width: calc(100vw - 2rem);
			right: -2rem;
			left: auto;
			transform: translateX(-50%);
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
			border-color: #374151;
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
		
		.clear-btn:hover {
			background: #4b5563;
		}
	}
</style>
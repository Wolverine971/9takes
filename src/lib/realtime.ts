// src/lib/realtime.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
	id: string;
	type: 'server' | 'user';
	from: string;
	to?: string;
	content: string;
	timestamp: string;
}

export class RealtimeMessaging {
	private channels: Map<string, RealtimeChannel> = new Map();

	constructor(private supabase: SupabaseClient) {}

	/**
	 * Subscribe to a channel for receiving messages
	 */
	subscribeToChannel(channelName: string, onMessage: (message: Message) => void): RealtimeChannel {
		// Unsubscribe from existing channel if already subscribed
		if (this.channels.has(channelName)) {
			this.unsubscribeFromChannel(channelName);
		}

		const channel = this.supabase
			.channel(channelName)
			.on('broadcast', { event: 'message' }, ({ payload }) => {
				onMessage(payload as Message);
			})
			.subscribe();

		this.channels.set(channelName, channel);
		return channel;
	}

	/**
	 * Send a message to a channel
	 */
	async sendMessage(channelName: string, message: Omit<Message, 'id' | 'timestamp'>) {
		let channel = this.channels.get(channelName);

		// If channel doesn't exist, create and subscribe to it first
		if (!channel) {
			channel = this.supabase.channel(channelName);

			// Wait for subscription to complete before sending
			await new Promise<void>((resolve, reject) => {
				const timeout = setTimeout(() => {
					reject(new Error('Channel subscription timeout'));
				}, 5000);

				channel.subscribe((status) => {
					if (status === 'SUBSCRIBED') {
						clearTimeout(timeout);
						this.channels.set(channelName, channel);
						resolve();
					} else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
						clearTimeout(timeout);
						reject(new Error(`Channel subscription failed with status: ${status}`));
					}
				});
			});
		}

		const payload: Message = {
			...message,
			id: crypto.randomUUID(),
			timestamp: new Date().toISOString()
		};

		await channel.send({
			type: 'broadcast',
			event: 'message',
			payload
		});

		return payload;
	}

	/**
	 * Unsubscribe from a channel
	 */
	async unsubscribeFromChannel(channelName: string) {
		const channel = this.channels.get(channelName);
		if (channel) {
			await this.supabase.removeChannel(channel);
			this.channels.delete(channelName);
		}
	}

	/**
	 * Unsubscribe from all channels
	 */
	async unsubscribeFromAllChannels() {
		for (const [channelName] of this.channels) {
			await this.unsubscribeFromChannel(channelName);
		}
	}
}

/**
 * Create a presence channel for tracking online users
 */
export function createPresenceChannel(
	supabase: SupabaseClient,
	channelName: string,
	userInfo: { id: string; email: string }
) {
	return supabase.channel(channelName, {
		config: {
			presence: {
				key: userInfo.id
			}
		}
	});
}

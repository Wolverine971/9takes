// src/lib/components/molecules/notifications.ts
import { writable, derived } from 'svelte/store';

const TIMEOUT = 3000;

type NotificationType = 'default' | 'danger' | 'warning' | 'info' | 'success';

interface Notification {
	id: string;
	type: NotificationType;
	message: string;
	timeout: number;
}

interface NotificationStore {
	subscribe: (callback: (notifications: Notification[]) => void) => () => void;
	send: (message: string, type?: NotificationType, timeout?: number) => void;
	default: (msg: string, timeout?: number) => void;
	danger: (msg: string, timeout?: number) => void;
	warning: (msg: string, timeout?: number) => void;
	info: (msg: string, timeout?: number) => void;
	success: (msg: string, timeout?: number) => void;
	clearAll: () => void;
}

function createNotificationStore(defaultTimeout: number): NotificationStore {
	const _notifications = writable<Notification[]>([]);
	const timers = new Map<string, ReturnType<typeof setTimeout>>();

	function send(message: string, type: NotificationType = 'default', timeout: number = defaultTimeout) {
		const notification: Notification = {
			id: id(),
			type,
			message,
			timeout
		};

		_notifications.update((state) => [...state, notification]);

		// Set timer to auto-remove notification
		const timer = setTimeout(() => {
			_notifications.update((state) => state.filter(n => n.id !== notification.id));
			timers.delete(notification.id);
		}, timeout);

		timers.set(notification.id, timer);
	}

	function clearAll() {
		// Clear all timers
		timers.forEach(timer => clearTimeout(timer));
		timers.clear();
		_notifications.set([]);
	}

	const { subscribe } = _notifications;

	return {
		subscribe,
		send,
		default: (msg: string, timeout: number = defaultTimeout) => send(msg, 'default', timeout),
		danger: (msg: string, timeout: number = defaultTimeout) => send(msg, 'danger', timeout),
		warning: (msg: string, timeout: number = defaultTimeout) => send(msg, 'warning', timeout),
		info: (msg: string, timeout: number = defaultTimeout) => send(msg, 'info', timeout),
		success: (msg: string, timeout: number = defaultTimeout) => send(msg, 'success', timeout),
		clearAll
	};
}

function id(): string {
	return '_' + Math.random().toString(36).substring(2, 11);
}

export const notifications: NotificationStore = createNotificationStore(TIMEOUT);
// src/lib/components/molecules/notifications.svelte.ts
// Toast queue. Callers import it through ./notifications.ts, which re-exports this module.

const TIMEOUT = 3000;

export type NotificationType = 'default' | 'danger' | 'warning' | 'info' | 'success';

export interface Notification {
	id: string;
	type: NotificationType;
	message: string;
	timeout: number;
	icon?: string;
}

function id(): string {
	return '_' + Math.random().toString(36).substring(2, 11);
}

class NotificationQueue {
	/** Toasts currently on screen, oldest first. */
	items = $state<Notification[]>([]);
	#timers = new Map<string, ReturnType<typeof setTimeout>>();
	#defaultTimeout: number;

	constructor(defaultTimeout: number) {
		this.#defaultTimeout = defaultTimeout;
	}

	// Arrow-function fields so callers can pass `notifications.success` around unbound.
	send = (message: string, type: NotificationType = 'default', timeout = this.#defaultTimeout) => {
		const notification: Notification = { id: id(), type, message, timeout };
		this.items.push(notification);

		// Auto-remove after the timeout.
		const timer = setTimeout(() => {
			this.items = this.items.filter((n) => n.id !== notification.id);
			this.#timers.delete(notification.id);
		}, timeout);
		this.#timers.set(notification.id, timer);
	};

	default = (msg: string, timeout = this.#defaultTimeout) => this.send(msg, 'default', timeout);
	danger = (msg: string, timeout = this.#defaultTimeout) => this.send(msg, 'danger', timeout);
	warning = (msg: string, timeout = this.#defaultTimeout) => this.send(msg, 'warning', timeout);
	info = (msg: string, timeout = this.#defaultTimeout) => this.send(msg, 'info', timeout);
	success = (msg: string, timeout = this.#defaultTimeout) => this.send(msg, 'success', timeout);

	clearAll = () => {
		this.#timers.forEach((timer) => clearTimeout(timer));
		this.#timers.clear();
		this.items = [];
	};
}

export const notifications = new NotificationQueue(TIMEOUT);

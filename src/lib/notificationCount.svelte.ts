// src/lib/notificationCount.svelte.ts
import { createContext } from 'svelte';

export class NotificationCountState {
	unread = $state(0);

	setUnread(value: number) {
		this.unread = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
	}
}

const [getNotificationCountContext, setNotificationCountContext] =
	createContext<NotificationCountState>();

export function provideNotificationCount(): NotificationCountState {
	return setNotificationCountContext(new NotificationCountState());
}

export function useNotificationCount(): NotificationCountState {
	return getNotificationCountContext();
}

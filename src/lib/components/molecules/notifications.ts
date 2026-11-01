// src/lib/components/molecules/notifications.ts
// The toast queue lives in notifications.svelte.ts (runes need a .svelte.ts module). This path stays
// the import point so its ~50 callers and their spec mocks don't change.
export { notifications, type Notification, type NotificationType } from './notifications.svelte';

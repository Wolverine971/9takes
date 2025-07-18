<!-- lib/components/molecules/Toast.svelte -->
<script>
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';

	// Theme mapping for CSS classes
	const getThemeClass = (type) => {
		return `toast--${type || 'default'}`;
	};
</script>

<div class="notifications">
	{#each $notifications as notification (notification?.id)}
		<div
			animate:flip
			class="toast {getThemeClass(notification.type)}"
			transition:fly={{ y: 30 }}
		>
			<div class="toast__content">{notification.message}</div>
			{#if notification.icon}<i class="toast__icon {notification.icon}" />{/if}
		</div>
	{/each}
</div>


<!-- src/lib/components/molecules/Toast.svelte -->
<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';
</script>

<div class="notifications" role="region" aria-live="polite" aria-label="Notifications">
	{#each $notifications as notification (notification?.id)}
		<div
			animate:flip
			class="toast"
			data-type={notification.type || 'default'}
			transition:fly={{ y: 30 }}
			role="alert"
			aria-atomic="true"
		>
			<div class="toast__content">{notification.message}</div>
			{#if notification.icon}<i class="toast__icon {notification.icon}"></i>{/if}
		</div>
	{/each}
</div>

<style>
	.notifications {
		position: fixed;
		top: 10px;
		left: 0;
		right: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-start;
		margin: 10px;
		padding: 0;
		pointer-events: none;
	}

	.toast {
		flex: 0 0 auto;
		max-width: 400px;
		margin-bottom: 10px;
		border-radius: var(--border-radius);
		box-shadow: var(--shadow-md);
		pointer-events: auto;
	}

	.toast__content {
		display: block;
		padding: 1rem 1.25rem;
		color: var(--text-on-dark);
		font-size: 0.95rem;
		font-weight: 500;
		line-height: 1.4;
	}

	.toast__icon {
		flex-shrink: 0;
		margin-left: 0.5rem;
	}

	.toast[data-type='danger'] {
		background: var(--error);
	}

	.toast[data-type='success'] {
		background: var(--success);
	}

	.toast[data-type='warning'] {
		background: var(--warning);
	}

	.toast[data-type='info'] {
		background: var(--info);
	}

	.toast[data-type='default'] {
		background: var(--ink-mid);
		color: var(--night-deep);
	}
</style>

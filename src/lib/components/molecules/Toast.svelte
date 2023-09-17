<script>
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { notifications } from '$lib/components/molecules/notifications';

	export let themes = {
		danger: '#E26D69',
		success: 'var(--color-theme-purple)',
		warning: '#f0ad4e',
		info: 'var(--color-theme-purple)',
		default: '#aaaaaa'
	};
</script>

<div class="notifications">
	{#each $notifications as notification (notification?.id)}
		<div
			animate:flip
			class="toast"
			style="background: {themes[notification.type]};"
			transition:fly={{ y: 30 }}
		>
			<div class="content">{notification.message}</div>
			{#if notification.icon}<i class={notification.icon} />{/if}
		</div>
	{/each}
</div>

<style>
	.notifications {
		position: fixed;
		top: 10px;
		left: 0;
		right: 0;
		margin: 10px;
		padding: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-end;
		pointer-events: none;
	}

	.toast {
		flex: 0 0 auto;
		margin-bottom: 10px;
	}

	.content {
		padding: 10px;
		display: block;
		color: white;
		font-weight: 500;
	}
</style>

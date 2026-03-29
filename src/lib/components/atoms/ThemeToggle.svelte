<!-- src/lib/components/atoms/ThemeToggle.svelte -->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { themePreference, applyTheme, cycleTheme, type ThemePreference } from '$lib/stores/theme';

	let current: ThemePreference = 'system';

	const unsubscribe = themePreference.subscribe((v) => {
		current = v;
	});

	onDestroy(unsubscribe);

	function toggle() {
		const next = cycleTheme(current);
		themePreference.set(next);
		applyTheme(next);
	}

	onMount(() => {
		applyTheme(current);

		// Listen for OS theme changes when preference is "system"
		const mq = window.matchMedia('(prefers-color-scheme: light)');
		const handler = () => {
			if (current === 'system') applyTheme('system');
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});
</script>

<button
	class="theme-toggle"
	onclick={toggle}
	aria-label="Toggle theme ({current})"
	title="Theme: {current}"
>
	{#if current === 'light'}
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
			<circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line
				x1="12"
				y1="21"
				x2="12"
				y2="23"
			/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line
				x1="18.36"
				y1="18.36"
				x2="19.78"
				y2="19.78"
			/><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line
				x1="4.22"
				y1="19.78"
				x2="5.64"
				y2="18.36"
			/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
		</svg>
	{:else if current === 'dark'}
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
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	{:else}
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
			<circle cx="12" cy="12" r="10" /><path d="M12 2a7 7 0 0 0 0 20z" />
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: transparent;
		border: 1px solid var(--bg-elevated);
		border-radius: 6px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.theme-toggle:hover {
		color: var(--primary);
		border-color: var(--primary);
		background: var(--primary-subtle);
	}
</style>

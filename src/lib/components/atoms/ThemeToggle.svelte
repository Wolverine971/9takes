<!-- src/lib/components/atoms/ThemeToggle.svelte -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { themePreference, applyTheme, cycleTheme, type ThemePreference } from '$lib/stores/theme';

	let current: ThemePreference = $state('dark');

	const unsubscribe = themePreference.subscribe((v) => {
		current = v;
	});

	onDestroy(unsubscribe);

	function toggle() {
		const next = cycleTheme(current);
		themePreference.set(next);
		applyTheme(next);
	}
</script>

<button
	class="theme-toggle"
	onclick={toggle}
	aria-label={current === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
	title={current === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
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
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		padding: 0;
		background: transparent;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		color: var(--ink-mid);
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.theme-toggle:hover {
		color: var(--lamp-glow);
		border-color: var(--lamp-glow);
		background: var(--lamp-soft);
	}

	button:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}
</style>

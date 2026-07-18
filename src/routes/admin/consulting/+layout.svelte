<!-- src/routes/admin/consulting/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { CalendarDays, ChartNoAxesCombined, Library, Users } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	const subNavItems = [
		{ href: '/admin/consulting', label: 'Overview', icon: ChartNoAxesCombined, exact: true },
		{ href: '/admin/consulting/clients', label: 'Clients', icon: Users },
		{ href: '/admin/consulting/sessions', label: 'Sessions', icon: CalendarDays },
		{ href: '/admin/consulting/resources', label: 'Resources', icon: Library }
	];

	let { children }: { children: Snippet } = $props();

	function isActive(item: { href: string; exact?: boolean }, pathname: string): boolean {
		if (item.exact) {
			return pathname === item.href;
		}
		return pathname === item.href || pathname.startsWith(item.href + '/');
	}
</script>

<div class="consulting-layout">
	<!-- Sub Navigation -->
	<nav class="sub-nav">
		{#each subNavItems as item (item.href)}
			{@const Icon = item.icon}
			<a
				href={item.href}
				class={['sub-nav-link', { active: isActive(item, $page.url.pathname) }]}
				aria-current={isActive(item, $page.url.pathname) ? 'page' : undefined}
			>
				<span class="sub-nav-icon">
					<Icon size={16} strokeWidth={1.8} aria-hidden="true" />
				</span>
				<span class="sub-nav-label">{item.label}</span>
			</a>
		{/each}
	</nav>

	<!-- Content -->
	<div class="consulting-content">
		{@render children()}
	</div>
</div>

<style>
	.consulting-layout {
		width: 100%;
	}

	.sub-nav {
		display: flex;
		gap: 6px;
		margin-bottom: 20px;
		padding: 6px;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-mid);
		overflow-x: auto;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.sub-nav::-webkit-scrollbar {
		display: none;
	}

	.sub-nav-link {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 40px;
		padding: 7px 12px 7px 7px;
		border: 1px solid transparent;
		border-radius: 10px;
		background: transparent;
		cursor: pointer;
		font-size: 0.8125rem;
		font-weight: 650;
		color: var(--ink-mid);
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;
		text-decoration: none;
		white-space: nowrap;
	}

	.sub-nav-icon {
		display: grid;
		width: 28px;
		height: 28px;
		flex: 0 0 28px;
		place-items: center;
		border-radius: 10px;
		background: var(--stone-warm);
		color: var(--lamp-glow);
	}

	.sub-nav-link:hover {
		background: var(--stone-warm);
		color: var(--ink-bright);
	}

	.sub-nav-link.active {
		border-color: color-mix(in srgb, var(--lamp-glow) 48%, var(--stone-edge));
		background: color-mix(in srgb, var(--lamp-glow) 10%, var(--stone-warm));
		color: var(--ink-bright);
	}

	:global(.consulting-layout .sub-nav-link:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.consulting-content {
		width: 100%;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.sub-nav {
			margin-bottom: 12px;
			gap: 5px;
			padding: 5px;
		}

		.sub-nav-link {
			min-height: 38px;
			padding: 5px 10px 5px 5px;
			font-size: 0.7rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sub-nav-link {
			transition: none;
		}
	}
</style>

<!-- src/lib/components/admin/AdminDesktopNav.svelte -->
<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ChevronDown, LayoutDashboard } from '@lucide/svelte';
	import {
		adminNavGroups,
		getAdminRouteContext,
		hostDeskNavItem
	} from '$lib/admin/adminNavigation';

	let { pathname, newTalkNotes = 0 }: { pathname: string; newTalkNotes?: number } = $props();
	let openGroup = $state<string | null>(null);
	let navElement: HTMLElement | undefined = $state();
	let routeContext = $derived(getAdminRouteContext(pathname));
	const HostDeskIcon = hostDeskNavItem.icon;

	afterNavigate(() => {
		openGroup = null;
	});

	function closeOutsideGroup(event: Event) {
		if (!openGroup || !(event.target instanceof Node)) return;
		const group = navElement?.querySelector(`[data-admin-group="${openGroup}"]`);
		if (!group?.contains(event.target)) openGroup = null;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || !openGroup) return;
		event.preventDefault();
		navElement?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')?.focus();
		openGroup = null;
	}
</script>

<svelte:document
	onpointerdown={closeOutsideGroup}
	onfocusin={closeOutsideGroup}
	onkeydown={handleKeydown}
/>

<nav class="admin-nav" aria-label="Admin navigation" bind:this={navElement}>
	<div class="nav-container">
		<a class="admin-home" href={resolve('/admin')} aria-label="Admin dashboard">
			<LayoutDashboard size={18} strokeWidth={1.8} aria-hidden="true" />
			Admin
		</a>

		<div class="nav-groups">
			{#each adminNavGroups as group (group.label)}
				{@const active = routeContext.group.label === group.label}
				{@const expanded = openGroup === group.label}
				{@const badge = group.items.some((item) => item.href === '/admin/consulting/notes')
					? newTalkNotes
					: 0}
				<div class="nav-group" data-admin-group={group.label}>
					<button
						type="button"
						class={['group-trigger', { active, expanded }]}
						aria-expanded={expanded}
						aria-controls={`admin-nav-${group.label.toLowerCase()}`}
						onclick={() => (openGroup = expanded ? null : group.label)}
					>
						{group.label}
						{#if badge > 0}
							<span class="nav-badge" aria-label={`${badge} new ${badge === 1 ? 'note' : 'notes'}`}
								>{badge}</span
							>
						{/if}
						<ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
					</button>

					<div id={`admin-nav-${group.label.toLowerCase()}`} class="group-panel" hidden={!expanded}>
						<p class="group-description">{group.description}</p>
						<ul>
							{#each group.items as item (item.href)}
								{@const Icon = item.icon}
								{@const current = routeContext.parentItem?.href === item.href}
								<li>
									<a
										href={resolve(item.href)}
										class={['nav-link', { active: current }]}
										aria-current={current ? 'page' : undefined}
										onclick={() => (openGroup = null)}
									>
										<Icon size={17} strokeWidth={1.8} aria-hidden="true" />
										<span>{item.label}</span>
										{#if item.href === '/admin/consulting/notes' && newTalkNotes > 0}
											<span
												class="nav-badge"
												aria-label={`${newTalkNotes} new ${newTalkNotes === 1 ? 'note' : 'notes'}`}
											>
												{newTalkNotes}
											</span>
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>

		<a
			href={resolve(hostDeskNavItem.href)}
			class={['host-desk-link', { active: routeContext.parentItem?.href === hostDeskNavItem.href }]}
			aria-current={routeContext.parentItem?.href === hostDeskNavItem.href ? 'page' : undefined}
		>
			<HostDeskIcon size={17} strokeWidth={1.8} aria-hidden="true" />
			{hostDeskNavItem.label}
		</a>
	</div>
</nav>

<style>
	.admin-nav {
		position: sticky;
		top: var(--site-header-height, 65px);
		z-index: 30;
		border-bottom: 1px solid var(--stone-edge);
		background: var(--night-deep);
	}

	.nav-container {
		display: flex;
		max-width: 1600px;
		align-items: center;
		gap: 16px;
		margin: 0 auto;
		padding: 10px 24px;
	}

	.admin-home,
	.host-desk-link,
	.group-trigger,
	.nav-link {
		display: flex;
		min-height: 40px;
		align-items: center;
		gap: 8px;
		border: 1px solid transparent;
		border-radius: 10px;
		color: var(--ink-mid);
		font-size: 0.8125rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}

	.admin-home {
		flex: 0 0 auto;
		color: var(--ink-bright);
	}

	.nav-groups {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.nav-group {
		position: relative;
	}

	.group-trigger {
		padding: 0 10px;
		background: transparent;
		cursor: pointer;
	}

	.group-trigger.active {
		background: color-mix(in srgb, var(--lamp-glow) 10%, transparent);
		color: var(--lamp-glow);
	}

	.group-trigger:hover,
	.group-trigger.expanded,
	.nav-link:hover {
		background: var(--stone-warm);
		color: var(--ink-bright);
	}

	.group-trigger.expanded :global(svg) {
		transform: rotate(180deg);
	}

	.group-panel {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		z-index: 1;
		width: 288px;
		max-height: calc(100dvh - 180px);
		overflow-y: auto;
		padding: 8px;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-mid);
		box-shadow: var(--shadow-xl);
	}

	.nav-group:nth-last-child(-n + 2) .group-panel {
		right: 0;
		left: auto;
	}

	.group-description {
		margin: 0;
		padding: 8px 10px 12px;
		color: var(--ink-mid);
		font-size: 0.75rem;
		line-height: 1.5;
	}

	.group-panel ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.nav-link {
		padding: 4px 10px;
	}

	.nav-link.active {
		background: color-mix(in srgb, var(--lamp-glow) 12%, transparent);
		color: var(--lamp-glow);
	}

	.nav-badge {
		display: inline-grid;
		min-width: 20px;
		height: 20px;
		place-items: center;
		padding: 0 5px;
		border-radius: 999px;
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 700;
	}

	.nav-link .nav-badge {
		margin-left: auto;
	}

	.host-desk-link {
		flex: 0 0 auto;
		margin-left: auto;
		padding: 0 12px;
		border-color: color-mix(in srgb, var(--lamp-glow) 35%, var(--stone-edge));
		color: var(--lamp-glow);
	}

	.host-desk-link:hover,
	.host-desk-link.active {
		background: var(--lamp-glow);
		color: var(--text-on-primary);
	}

	.admin-home:hover {
		color: var(--lamp-glow);
	}

	.admin-nav :global(a:focus-visible),
	.admin-nav :global(button:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	@media (max-width: 1100px) {
		.nav-container {
			flex-wrap: wrap;
			gap: 8px 16px;
			padding: 8px 16px;
		}

		.nav-groups {
			order: 1;
			width: 100%;
		}
	}

	@media (max-width: 768px) {
		.admin-nav {
			display: none;
		}
	}
</style>

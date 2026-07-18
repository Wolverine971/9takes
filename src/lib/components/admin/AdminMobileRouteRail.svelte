<script lang="ts">
	import { Command } from '@lucide/svelte';
	import { getAdminRouteContext, isAdminNavActive } from '$lib/admin/adminNavigation';

	type Props = {
		pathname: string;
		onOpenMenu: () => void;
	};

	let { pathname, onOpenMenu }: Props = $props();
	let routeContext = $derived(getAdminRouteContext(pathname));
</script>

<nav class="mobile-route-rail" aria-label={`${routeContext.group.label} admin tools`}>
	<div class="route-rail-header">
		<div>
			<span>{routeContext.group.label} workspace</span>
			<strong>{routeContext.group.description}</strong>
		</div>
		<button type="button" onclick={onOpenMenu}>
			<Command size={15} strokeWidth={1.8} aria-hidden="true" />
			All tools
		</button>
	</div>

	<div class="route-rail-links">
		{#each routeContext.group.items as item (item.href)}
			{@const Icon = item.icon}
			<a
				href={item.href}
				class:active={isAdminNavActive(item, pathname)}
				aria-current={isAdminNavActive(item, pathname) ? 'page' : undefined}
			>
				<span class="route-rail-icon">
					<Icon size={15} strokeWidth={1.8} aria-hidden="true" />
				</span>
				<span>{item.label}</span>
			</a>
		{/each}
	</div>
</nav>

<style>
	.mobile-route-rail {
		display: none;
	}

	@media (max-width: 768px) {
		.mobile-route-rail {
			display: grid;
			gap: 9px;
			min-width: 0;
			margin-bottom: 12px;
			padding: 10px;
			border: 1px solid var(--stone-edge);
			border-radius: 16px;
			background:
				linear-gradient(
					135deg,
					color-mix(in srgb, var(--lamp-glow) 7%, transparent),
					transparent 55%
				),
				var(--night-mid);
			color: var(--ink-bright);
		}

		.route-rail-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
			min-width: 0;
		}

		.route-rail-header > div {
			display: grid;
			min-width: 0;
			gap: 1px;
		}

		.route-rail-header span {
			color: var(--lamp-glow);
			font-family: var(--font-mono);
			font-size: 0.61rem;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		.route-rail-header strong {
			overflow: hidden;
			color: var(--ink-mid);
			font-size: 0.7rem;
			font-weight: 550;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.route-rail-header button {
			display: inline-flex;
			min-height: 36px;
			flex: 0 0 auto;
			align-items: center;
			gap: 6px;
			padding: 0 10px;
			border: 1px solid var(--stone-edge);
			border-radius: 10px;
			background: var(--stone-warm);
			color: var(--ink-bright);
			font-size: 0.68rem;
			font-weight: 700;
			cursor: pointer;
		}

		.route-rail-links {
			display: flex;
			min-width: 0;
			gap: 6px;
			overflow-x: auto;
			overscroll-behavior-x: contain;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.route-rail-links::-webkit-scrollbar {
			display: none;
		}

		.route-rail-links a {
			display: inline-flex;
			min-height: 38px;
			flex: 0 0 auto;
			align-items: center;
			gap: 7px;
			padding: 4px 9px 4px 5px;
			border: 1px solid transparent;
			border-radius: 10px;
			background: color-mix(in srgb, var(--stone-warm) 82%, transparent);
			color: var(--ink-mid);
			font-size: 0.68rem;
			font-weight: 650;
			text-decoration: none;
		}

		.route-rail-links a.active {
			border-color: color-mix(in srgb, var(--lamp-glow) 48%, var(--stone-edge));
			background: color-mix(in srgb, var(--lamp-glow) 10%, var(--stone-warm));
			color: var(--ink-bright);
		}

		.route-rail-icon {
			display: grid;
			width: 28px;
			height: 28px;
			flex: 0 0 28px;
			place-items: center;
			border-radius: 10px;
			background: var(--night-deep);
			color: var(--lamp-glow);
		}

		:global(.mobile-route-rail .route-rail-header button:focus-visible),
		:global(.mobile-route-rail .route-rail-links a:focus-visible) {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}
	}
</style>

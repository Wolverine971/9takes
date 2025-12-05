<!-- src/routes/admin/consulting/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';

	const subNavItems = [
		{ href: '/admin/consulting', label: 'Overview', exact: true },
		{ href: '/admin/consulting/clients', label: 'Clients' },
		{ href: '/admin/consulting/sessions', label: 'Sessions' },
		{ href: '/admin/consulting/resources', label: 'Resources' }
	];

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
		{#each subNavItems as item}
			<a href={item.href} class="sub-nav-link" class:active={isActive(item, $page.url.pathname)}>
				{item.label}
			</a>
		{/each}
	</nav>

	<!-- Content -->
	<div class="consulting-content">
		<slot />
	</div>
</div>

<style>
	.consulting-layout {
		width: 100%;
	}

	.sub-nav {
		display: flex;
		gap: 0.25rem;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 0;
	}

	.sub-nav-link {
		padding: 0.5rem 0.75rem;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-secondary);
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		transition: all 0.2s;
		text-decoration: none;
	}

	.sub-nav-link:hover {
		color: var(--text-primary);
	}

	.sub-nav-link.active {
		color: var(--primary);
		border-bottom-color: var(--primary);
	}

	.consulting-content {
		width: 100%;
	}
</style>

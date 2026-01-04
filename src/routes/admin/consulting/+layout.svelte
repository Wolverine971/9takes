<!-- src/routes/admin/consulting/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';

	const subNavItems = [
		{ href: '/admin/consulting', label: 'Overview', icon: '📊', exact: true },
		{ href: '/admin/consulting/clients', label: 'Clients', icon: '👥' },
		{ href: '/admin/consulting/sessions', label: 'Sessions', icon: '📅' },
		{ href: '/admin/consulting/resources', label: 'Resources', icon: '📚' }
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
				<span class="sub-nav-icon">{item.icon}</span>
				<span class="sub-nav-label">{item.label}</span>
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
		gap: 2px;
		margin-bottom: 20px;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		padding-bottom: 0;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.sub-nav-link {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 14px;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary, #64748b);
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		transition: all 0.15s ease;
		text-decoration: none;
		white-space: nowrap;
	}

	.sub-nav-icon {
		font-size: 0.875rem;
		line-height: 1;
	}

	.sub-nav-link:hover {
		color: var(--text-primary, #1e293b);
	}

	.sub-nav-link.active {
		color: var(--primary, #6366f1);
		border-bottom-color: var(--primary, #6366f1);
	}

	.consulting-content {
		width: 100%;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.sub-nav {
			margin-bottom: 16px;
			gap: 0;
		}

		.sub-nav-link {
			padding: 8px 12px;
			font-size: 0.75rem;
		}

		.sub-nav-icon {
			font-size: 0.8125rem;
		}
	}

	/* Extra small screens */
	@media (max-width: 480px) {
		.sub-nav-link {
			padding: 8px 10px;
			font-size: 0.6875rem;
			gap: 4px;
		}

		.sub-nav-icon {
			font-size: 0.75rem;
		}

		.sub-nav-label {
			display: none;
		}
	}
</style>

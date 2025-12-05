<!-- src/routes/admin/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const navItems = [
		{ href: '/admin', label: 'Dashboard', exact: true },
		{ href: '/admin/search', label: 'Search' },
		{ href: '/admin/consulting', label: 'Consulting' },
		{ href: '/admin/users', label: 'Users' },
		{ href: '/admin/email-dashboard', label: 'Email' },
		{ href: '/admin/questions', label: 'Questions' },
		{ href: '/admin/comments', label: 'Comments' },
		{ href: '/admin/messages', label: 'Messages' },
		{ href: '/admin/content-board', label: 'Content' },
		{ href: '/admin/drafts', label: 'Drafts' },
		{ href: '/admin/marketing', label: 'Marketing' },
		{ href: '/admin/links', label: 'Links' },
		{ href: '/admin/poster-generator', label: 'Posters' }
	];

	// Check if nav item is active (supports sub-routes)
	function isActive(item: { href: string; exact?: boolean }, pathname: string): boolean {
		if (item.exact) {
			return pathname === item.href;
		}
		return pathname === item.href || pathname.startsWith(item.href + '/');
	}
</script>

{#if data.user?.admin}
	<div class="admin-layout">
		<!-- Admin Navigation Bar -->
		<nav class="admin-nav">
			<div class="nav-container">
				{#each navItems as item}
					<a
						href={item.href}
						class="nav-link"
						class:active={isActive(item, $page.url.pathname)}
						aria-current={isActive(item, $page.url.pathname) ? 'page' : undefined}
					>
						{item.label}
					</a>
				{/each}
			</div>
		</nav>

		<!-- Main Content Area -->
		<main class="admin-content">
			<slot />
		</main>
	</div>
{:else}
	<div class="access-denied">
		<div class="error-container">
			<h1>Access Denied</h1>
			<p>You don't have permission to access this area.</p>
			<a href="/" class="btn btn-primary">Go to Home</a>
		</div>
	</div>
{/if}

<style>
	.admin-layout {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	/* Admin Navigation Bar */
	.admin-nav {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		margin-bottom: 1.5rem;
		box-shadow: var(--shadow-sm);
	}

	.nav-container {
		padding: 0.75rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.nav-link {
		padding: 0.5rem 0.75rem;
		color: var(--text-primary);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.875rem;
		border-radius: var(--border-radius);
		transition: all 0.2s ease;
		white-space: nowrap;
		border: 1px solid transparent;
	}

	.nav-link:hover {
		background-color: var(--hover-background);
		color: var(--primary);
		border-color: var(--border-color);
	}

	.nav-link.active {
		background-color: var(--primary);
		color: white;
		border-color: var(--primary);
	}

	/* Main Content */
	.admin-content {
		padding: 0 1rem 2rem;
	}

	/* Access Denied */
	.access-denied {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background-color: var(--background);
	}

	.error-container {
		text-align: center;
		padding: 2rem;
		background-color: var(--card-background);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow-md);
		max-width: 400px;
	}

	.error-container h1 {
		color: var(--error);
		margin-bottom: 1rem;
	}

	.error-container p {
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	/* Global page header styles for admin pages */
	:global(.page-header) {
		margin-bottom: 2rem;
	}

	:global(.page-header h1) {
		font-size: 2rem;
		margin: 0 0 0.5rem 0;
		color: var(--text-primary);
		font-weight: 700;
	}

	:global(.page-header .subtitle) {
		color: var(--text-secondary);
		margin: 0;
		font-size: 1rem;
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.nav-container {
			padding: 0.5rem;
			gap: 0.375rem;
		}

		.nav-link {
			padding: 0.375rem 0.5rem;
			font-size: 0.75rem;
		}

		.admin-content {
			padding: 0 0.5rem 1rem;
		}
	}
</style>

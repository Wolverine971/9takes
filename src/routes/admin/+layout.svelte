<!-- src/routes/admin/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let mobileMenuOpen = false;

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
		{ href: '/admin/search', label: 'Search', icon: '🔍' },
		{ href: '/admin/consulting', label: 'Consulting', icon: '🎯' },
		{ href: '/admin/users', label: 'Users', icon: '👥' },
		{ href: '/admin/email-dashboard', label: 'Email', icon: '📧' },
		{ href: '/admin/questions', label: 'Questions', icon: '❓' },
		{ href: '/admin/comments', label: 'Comments', icon: '💬' },
		{ href: '/admin/messages', label: 'Messages', icon: '📨' },
		{ href: '/admin/content-board', label: 'Content', icon: '📝' },
		{ href: '/admin/drafts', label: 'Drafts', icon: '✏️' },
		{ href: '/admin/marketing', label: 'Marketing', icon: '📈' },
		{ href: '/admin/links', label: 'Links', icon: '🔗' },
		{ href: '/admin/poster-generator', label: 'Posters', icon: '🖼️' }
	];

	// Check if nav item is active (supports sub-routes)
	function isActive(item: { href: string; exact?: boolean }, pathname: string): boolean {
		if (item.exact) {
			return pathname === item.href;
		}
		return pathname === item.href || pathname.startsWith(item.href + '/');
	}

	// Close menu on navigation
	$: if (browser && $page.url.pathname) {
		mobileMenuOpen = false;
	}

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Get current page label for mobile header
	$: currentPageLabel =
		navItems.find((item) => isActive(item, $page.url.pathname))?.label || 'Admin';
</script>

{#if data.user?.admin}
	<div class="admin-layout">
		<!-- Mobile Header -->
		<header class="mobile-header">
			<span class="current-page">{currentPageLabel}</span>
			<button
				class="menu-toggle"
				on:click={toggleMenu}
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileMenuOpen}
			>
				<span class="hamburger" class:open={mobileMenuOpen}>
					<span></span>
					<span></span>
					<span></span>
				</span>
			</button>
		</header>

		<!-- Admin Navigation Bar -->
		<nav class="admin-nav" class:open={mobileMenuOpen}>
			<div class="nav-container">
				{#each navItems as item}
					<a
						href={item.href}
						class="nav-link"
						class:active={isActive(item, $page.url.pathname)}
						aria-current={isActive(item, $page.url.pathname) ? 'page' : undefined}
					>
						<span class="nav-icon">{item.icon}</span>
						<span class="nav-label">{item.label}</span>
					</a>
				{/each}
			</div>
		</nav>

		<!-- Overlay for mobile menu -->
		{#if mobileMenuOpen}
			<button class="menu-overlay" on:click={() => (mobileMenuOpen = false)} aria-label="Close menu"
			></button>
		{/if}

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
		max-width: 100%;
		min-height: 100vh;
	}

	/* Mobile Header - Only visible on mobile */
	.mobile-header {
		display: none;
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--card-background, #fff);
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		padding: 12px 16px;
		align-items: center;
		justify-content: space-between;
	}

	.current-page {
		font-weight: 600;
		font-size: 1rem;
		color: var(--text-primary, #1e293b);
	}

	.menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		border-radius: 8px;
		transition: background 0.2s;
	}

	.menu-toggle:hover {
		background: var(--hover-background, #f1f5f9);
	}

	.hamburger {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 16px;
		position: relative;
	}

	.hamburger span {
		display: block;
		width: 100%;
		height: 2px;
		background: var(--text-primary, #1e293b);
		border-radius: 1px;
		transition: all 0.3s ease;
		position: absolute;
	}

	.hamburger span:nth-child(1) {
		top: 0;
	}
	.hamburger span:nth-child(2) {
		top: 50%;
		transform: translateY(-50%);
	}
	.hamburger span:nth-child(3) {
		bottom: 0;
	}

	.hamburger.open span:nth-child(1) {
		top: 50%;
		transform: translateY(-50%) rotate(45deg);
	}

	.hamburger.open span:nth-child(2) {
		opacity: 0;
	}

	.hamburger.open span:nth-child(3) {
		bottom: 50%;
		transform: translateY(50%) rotate(-45deg);
	}

	/* Admin Navigation Bar */
	.admin-nav {
		background-color: var(--card-background, #fff);
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		position: sticky;
		top: 0;
		z-index: 90;
	}

	.nav-container {
		max-width: 1600px;
		margin: 0 auto;
		padding: 8px 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		justify-content: center;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		color: var(--text-secondary, #64748b);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.8125rem;
		border-radius: 6px;
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.nav-icon {
		font-size: 0.875rem;
		line-height: 1;
	}

	.nav-link:hover {
		background-color: var(--hover-background, #f1f5f9);
		color: var(--text-primary, #1e293b);
	}

	.nav-link.active {
		background-color: var(--primary, #6366f1);
		color: white;
	}

	/* Main Content */
	.admin-content {
		max-width: 1600px;
		margin: 0 auto;
		padding: 24px 24px 48px;
	}

	/* Menu Overlay */
	.menu-overlay {
		display: none;
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 80;
		border: none;
		cursor: pointer;
	}

	/* Access Denied */
	.access-denied {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 16px;
		background-color: var(--background, #f8fafc);
	}

	.error-container {
		text-align: center;
		padding: 32px 24px;
		background-color: var(--card-background, #fff);
		border-radius: 12px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		max-width: 400px;
		width: 100%;
	}

	.error-container h1 {
		color: var(--error, #ef4444);
		margin-bottom: 12px;
		font-size: 1.5rem;
	}

	.error-container p {
		color: var(--text-secondary, #64748b);
		margin-bottom: 24px;
	}

	/* Global page header styles for admin pages */
	:global(.page-header) {
		margin-bottom: 20px;
	}

	:global(.page-header h1) {
		font-size: 1.5rem;
		margin: 0 0 4px 0;
		color: var(--text-primary, #1e293b);
		font-weight: 700;
	}

	:global(.page-header .subtitle) {
		color: var(--text-secondary, #64748b);
		margin: 0;
		font-size: 0.875rem;
	}

	/* Tablet */
	@media (max-width: 1024px) {
		.admin-content {
			padding: 20px 16px 40px;
		}

		.nav-container {
			padding: 8px 12px;
		}
	}

	/* Mobile */
	@media (max-width: 768px) {
		.mobile-header {
			display: flex;
		}

		.admin-nav {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			width: 280px;
			max-width: 85vw;
			z-index: 100;
			transform: translateX(-100%);
			transition: transform 0.3s ease;
			border-bottom: none;
			border-right: 1px solid var(--border-color, #e2e8f0);
			box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
			overflow-y: auto;
		}

		.admin-nav.open {
			transform: translateX(0);
		}

		.nav-container {
			flex-direction: column;
			padding: 16px 12px;
			gap: 2px;
			align-items: stretch;
		}

		.nav-link {
			padding: 12px 16px;
			font-size: 0.9375rem;
			border-radius: 8px;
		}

		.nav-icon {
			font-size: 1.125rem;
			width: 28px;
		}

		.menu-overlay {
			display: block;
		}

		.admin-content {
			padding: 16px 8px 32px;
		}

		:global(.page-header h1) {
			font-size: 1.25rem;
		}
	}

	/* Extra small screens */
	@media (max-width: 480px) {
		.admin-content {
			padding: 12px 4px 24px;
		}

		.mobile-header {
			padding: 10px 12px;
		}
	}
</style>

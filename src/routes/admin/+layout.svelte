<!-- src/routes/admin/+layout.svelte -->
<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Database, Search } from '@lucide/svelte';
	import {
		adminNavGroups,
		getAdminRouteContext,
		isAdminNavActive
	} from '$lib/admin/adminNavigation';
	import { setMobileAdminCommand } from '$lib/admin/mobileAdminCommand';
	import { Button } from '$lib/components/atoms';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';
	import AdminMobileRouteRail from '$lib/components/admin/AdminMobileRouteRail.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import './admin-mobile.css';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let mobileMenuOpen = $state(false);
	let mobileNavQuery = $state('');

	const navItems = adminNavGroups.flatMap((group) => group.items);

	afterNavigate(() => {
		if (mobileMenuOpen) getModal('adminNavigation')?.close();
	});

	function openMobileMenu() {
		mobileNavQuery = '';
		mobileMenuOpen = true;
		getModal('adminNavigation')?.open(() => {
			mobileMenuOpen = false;
		});
	}

	function closeMobileMenu() {
		getModal('adminNavigation')?.close();
	}

	function toggleMenu() {
		if (mobileMenuOpen) {
			closeMobileMenu();
			return;
		}

		openMobileMenu();
	}

	setMobileAdminCommand({ openMenu: openMobileMenu });

	// Get current page label for mobile header
	let currentPageLabel = $derived(getAdminRouteContext($page.url.pathname).label);
	let filteredNavGroups = $derived.by(() => {
		const query = mobileNavQuery.trim().toLocaleLowerCase();
		if (!query) return adminNavGroups;

		return adminNavGroups
			.map((group) => ({
				...group,
				items: group.items.filter((item) => item.label.toLocaleLowerCase().includes(query))
			}))
			.filter((group) => group.items.length > 0);
	});
</script>

{#if data.user?.admin}
	<div class="admin-layout">
		<!-- Mobile Header -->
		<header class="mobile-header">
			<div class="mobile-title">
				<span>9takes / admin</span>
				<strong class="current-page">{currentPageLabel}</strong>
			</div>
			<button
				class="menu-toggle"
				onclick={toggleMenu}
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileMenuOpen}
				aria-controls="admin-mobile-navigation"
			>
				<span class={['hamburger', { open: mobileMenuOpen }]}>
					<span></span>
					<span></span>
					<span></span>
				</span>
			</button>
		</header>

		<!-- Admin Navigation Bar -->
		<nav class="admin-nav">
			<div class="nav-container">
				{#each navItems as item}
					{@const Icon = item.icon}
					<a
						href={item.href}
						class={['nav-link', { active: isAdminNavActive(item, $page.url.pathname) }]}
						aria-current={isAdminNavActive(item, $page.url.pathname) ? 'page' : undefined}
					>
						<span class="nav-icon">
							<Icon size={16} strokeWidth={1.8} aria-hidden="true" />
						</span>
						<span class="nav-label">{item.label}</span>
					</a>
				{/each}
			</div>
		</nav>

		<!-- Main Content Area -->
		<main class="admin-content">
			{#if $page.url.pathname !== '/admin'}
				<AdminMobileRouteRail pathname={$page.url.pathname} onOpenMenu={openMobileMenu} />
			{/if}
			{@render children()}
		</main>

		<Modal
			id="adminNavigation"
			name="Admin navigation"
			fullMobile={true}
			navTop={true}
			initialFocus="#admin-nav-close"
		>
			<div class="mobile-navigation" id="admin-mobile-navigation">
				<header class="mobile-nav-header">
					<div>
						<span>9takes operations</span>
						<h2>Command menu</h2>
					</div>
					<button
						id="admin-nav-close"
						type="button"
						class="mobile-nav-close"
						onclick={closeMobileMenu}
						aria-label="Close admin navigation"
					>
						<span aria-hidden="true">×</span>
					</button>
				</header>

				<label class="mobile-nav-search">
					<Search size={18} strokeWidth={1.8} aria-hidden="true" />
					<span class="sr-only">Find an admin page</span>
					<input bind:value={mobileNavQuery} type="search" placeholder="Find a tool or page…" />
				</label>

				<div class="mobile-nav-groups">
					{#each filteredNavGroups as group (group.label)}
						<section class="mobile-nav-group">
							<h3>{group.label}</h3>
							<div class="mobile-nav-grid">
								{#each group.items as item (item.href)}
									{@const Icon = item.icon}
									<a
										href={item.href}
										class={{ active: isAdminNavActive(item, $page.url.pathname) }}
										aria-current={isAdminNavActive(item, $page.url.pathname) ? 'page' : undefined}
										onclick={closeMobileMenu}
									>
										<span class="mobile-nav-icon">
											<Icon size={18} strokeWidth={1.8} aria-hidden="true" />
										</span>
										<span>{item.label}</span>
									</a>
								{/each}
							</div>
						</section>
					{:else}
						<div class="mobile-nav-empty">
							<Database size={24} strokeWidth={1.6} aria-hidden="true" />
							<strong>No admin page found</strong>
							<p>Try a shorter name like “email”, “users”, or “content”.</p>
						</div>
					{/each}
				</div>
			</div>
		</Modal>
	</div>
{:else}
	<div class="access-denied">
		<div class="error-container">
			<h1>Access Denied</h1>
			<p>You don't have permission to access this area.</p>
			<Button href="/">Go to Home</Button>
		</div>
	</div>
{/if}

<style>
	.admin-layout {
		--site-header-height: 65px;
		width: 100%;
		max-width: 100%;
		min-height: 100vh;
		box-sizing: border-box;
		overflow-x: clip;
	}

	/* Mobile Header - Only visible on mobile */
	.mobile-header {
		display: none;
		position: sticky;
		top: var(--site-header-height);
		z-index: 40;
		background: var(--night-deep);
		border-bottom: 1px solid var(--stone-warm);
		padding: 12px 16px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		box-sizing: border-box;
	}

	.current-page {
		font-weight: 600;
		font-size: 1rem;
		color: var(--ink-bright);
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mobile-title {
		display: grid;
		min-width: 0;
		flex: 1;
		gap: 1px;
	}

	.mobile-title > span {
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		color: var(--ink-bright);
		transition:
			background 0.2s ease,
			border-color 0.2s ease;
	}

	.menu-toggle:hover {
		background: var(--stone-warm);
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
		background: var(--ink-bright);
		border-radius: 0.25rem;
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
		background-color: var(--night-deep);
		border-bottom: 1px solid var(--stone-warm);
		position: sticky;
		top: var(--site-header-height);
		z-index: 30;
	}

	.nav-container {
		max-width: 1600px;
		width: 100%;
		margin: 0 auto;
		padding: 10px 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		justify-content: center;
		box-sizing: border-box;
		min-width: 0;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		color: var(--ink-mid);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.8125rem;
		border-radius: 0.625rem;
		transition: all 0.2s ease;
		white-space: nowrap;
		border: 1px solid transparent;
	}

	.nav-icon {
		font-size: 0.9375rem;
		line-height: 1;
	}

	.nav-label {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.nav-link:hover {
		background-color: var(--stone-warm);
		color: var(--ink-bright);
		border-color: var(--stone-warm);
	}

	.nav-link.active {
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		border-color: var(--lamp-glow);
	}

	/* Main Content */
	.admin-content {
		max-width: 1600px;
		width: 100%;
		min-width: 0;
		margin: 0 auto;
		padding: 24px 24px 48px;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	/* Access Denied */
	.access-denied {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 16px;
		background-color: var(--night-deep);
	}

	.error-container {
		text-align: center;
		padding: 40px 32px;
		background-color: var(--stone-warm);
		border: 1px solid var(--stone-warm);
		border-radius: 16px;
		box-shadow: var(--shadow-xl);
		max-width: 400px;
		width: 100%;
	}

	.error-container h1 {
		color: var(--error);
		margin-bottom: 12px;
		font-size: 1.5rem;
	}

	.error-container p {
		color: var(--ink-mid);
		margin-bottom: 24px;
	}

	/* Global page header styles for admin pages */
	:global(.page-header) {
		margin-bottom: 24px;
	}

	:global(.page-header h1) {
		font-size: 1.5rem;
		margin: 0 0 6px 0;
		color: var(--ink-bright);
		font-weight: 700;
	}

	:global(.page-header .subtitle) {
		color: var(--ink-mid);
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
			z-index: 40;
			padding-left: max(16px, env(safe-area-inset-left));
			padding-right: max(16px, env(safe-area-inset-right));
		}

		.admin-nav {
			display: none;
		}

		.admin-content {
			padding: 16px 12px 32px;
		}

		:global(.page-header h1) {
			font-size: 1.25rem;
		}
	}

	.mobile-navigation {
		display: grid;
		gap: 16px;
		min-height: calc(100dvh - 3rem);
		align-content: start;
		color: var(--ink-bright);
	}

	.mobile-nav-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding-bottom: 4px;
	}

	.mobile-nav-header span {
		display: block;
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.mobile-nav-header h2 {
		margin: 3px 0 0;
		color: var(--ink-bright);
		font-size: 1.35rem;
		letter-spacing: -0.02em;
	}

	.mobile-nav-close {
		display: grid;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		place-items: center;
		padding: 0;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		color: var(--ink-bright);
		cursor: pointer;
	}

	.mobile-nav-close span {
		color: currentColor;
		font-family: inherit;
		font-size: 1.5rem;
		font-weight: 400;
		line-height: 1;
		text-transform: none;
	}

	.mobile-nav-search {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 10px;
		min-height: 48px;
		padding: 0 13px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		color: var(--ink-mid);
	}

	.mobile-nav-search:focus-within {
		border-color: var(--lamp-glow);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--lamp-glow) 20%, transparent);
	}

	.mobile-nav-search input {
		min-width: 0;
		width: 100%;
		height: 46px;
		padding: 0;
		border: none;
		outline: none;
		background: transparent;
		color: var(--ink-bright);
		font-size: 1rem;
	}

	.mobile-nav-search input::placeholder {
		color: var(--ink-mid);
	}

	.mobile-nav-groups {
		display: grid;
		gap: 18px;
	}

	.mobile-nav-group {
		display: grid;
		gap: 8px;
	}

	.mobile-nav-group h3 {
		margin: 0;
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.mobile-nav-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.mobile-nav-grid a {
		display: flex;
		min-width: 0;
		min-height: 52px;
		align-items: center;
		gap: 10px;
		padding: 8px 10px;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		color: var(--ink-mid);
		font-size: 0.75rem;
		font-weight: 650;
		text-decoration: none;
	}

	.mobile-nav-grid a.active {
		border-color: color-mix(in srgb, var(--lamp-glow) 55%, var(--stone-edge));
		background: color-mix(in srgb, var(--lamp-glow) 10%, var(--night-mid));
		color: var(--ink-bright);
	}

	.mobile-nav-icon {
		display: grid;
		width: 32px;
		height: 32px;
		flex: 0 0 32px;
		place-items: center;
		border-radius: 10px;
		background: var(--stone-warm);
		color: var(--lamp-glow);
	}

	.mobile-nav-grid a > span:last-child {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mobile-nav-empty {
		display: grid;
		justify-items: center;
		gap: 6px;
		padding: 30px 16px;
		border: 1px dashed var(--stone-edge);
		border-radius: 16px;
		color: var(--ink-mid);
		text-align: center;
	}

	.mobile-nav-empty strong {
		color: var(--ink-bright);
		font-size: 0.85rem;
	}

	.mobile-nav-empty p {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.45;
	}

	.mobile-nav-grid a:focus-visible,
	.mobile-nav-close:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	/* Extra small screens */
	@media (max-width: 480px) {
		.admin-content {
			padding: 12px 10px 24px;
		}

		.mobile-header {
			padding: 10px 12px;
		}
	}

	@media (min-width: 769px) {
		.mobile-navigation {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-toggle,
		.hamburger span,
		.nav-link {
			transition: none;
		}
	}
</style>

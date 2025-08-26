<!-- src/lib/components/molecules/MobileNav.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	// Props to receive navigation items
	export let navItems: Array<{ href: string; label: string }> = [];
	export let blogItems: Array<{ href: string; label: string }> = [];

	// State management
	let isMenuOpen = false;
	let isDropdownOpen = false;

	// Close menu when page changes
	afterNavigate(() => {
		closeMenu();
	});

	// Cleanup on component destroy
	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	});

	/**
	 * Toggle the mobile menu
	 */
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;

		if (!isMenuOpen) {
			isDropdownOpen = false;
		}

		// Prevent body scrolling when menu is open
		if (typeof document !== 'undefined') {
			document.body.style.overflow = isMenuOpen ? 'hidden' : '';
		}
	}

	/**
	 * Close the mobile menu
	 */
	function closeMenu() {
		isMenuOpen = false;
		isDropdownOpen = false;

		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	}

	/**
	 * Toggle blog dropdown
	 */
	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	/**
	 * Handle keyboard navigation
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isMenuOpen) {
			closeMenu();
		}
	}

	/**
	 * Handle backdrop click
	 */
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeMenu();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="mobile-nav-container">
	<!-- Menu toggle button -->
	<button
		class="mobile-nav-toggle"
		aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
		aria-expanded={isMenuOpen}
		aria-controls="mobile-navigation"
		on:click={toggleMenu}
	>
		<div class="hamburger" class:open={isMenuOpen}>
			<span class="line line-1"></span>
			<span class="line line-2"></span>
			<span class="line line-3"></span>
		</div>
	</button>

	<!-- Mobile navigation overlay -->
	{#if isMenuOpen}
		<div
			class="mobile-nav-overlay"
			role="dialog"
			aria-modal="true"
			aria-labelledby="mobile-nav-title"
			on:click={handleBackdropClick}
			in:fade={{ duration: 300, easing: cubicOut }}
			out:fade={{ duration: 200, easing: cubicOut }}
		>
			<nav
				id="mobile-navigation"
				class="mobile-nav-panel"
				aria-label="Mobile Navigation"
				in:fly={{ x: -300, duration: 300, easing: cubicOut }}
				out:fly={{ x: -300, duration: 200, easing: cubicOut }}
			>
				<!-- Header -->
				<div class="mobile-nav-header">
					<h2 id="mobile-nav-title" class="nav-title">Menu</h2>
					<button class="close-button" aria-label="Close navigation" on:click={closeMenu}>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>

				<!-- Navigation Content -->
				<div class="mobile-nav-content">
					<ul class="nav-list">
						<!-- Main navigation items -->
						{#each navItems as { href, label }}
							<li class="nav-item">
								<a
									{href}
									class="nav-link"
									class:active={$page.url.pathname === href}
									on:click={closeMenu}
									aria-current={$page.url.pathname === href ? 'page' : undefined}
								>
									{label}
								</a>
							</li>
						{/each}

						<!-- Blog dropdown section -->
						<li class="nav-item dropdown-item">
							<button
								type="button"
								class="dropdown-toggle"
								aria-haspopup="true"
								aria-expanded={isDropdownOpen}
								aria-controls="mobile-blog-menu"
								on:click={toggleDropdown}
							>
								<span>Blog</span>
								<svg
									class="dropdown-arrow"
									class:rotated={isDropdownOpen}
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<polyline points="6,9 12,15 18,9"></polyline>
								</svg>
							</button>

							{#if isDropdownOpen}
								<ul
									id="mobile-blog-menu"
									class="submenu"
									in:fly={{ y: -10, duration: 200 }}
									out:fly={{ y: -10, duration: 150 }}
								>
									{#each blogItems as { href, label }}
										<li class="submenu-item">
											<a
												{href}
												class="submenu-link"
												class:active={$page.url.pathname === href}
												on:click={closeMenu}
												aria-current={$page.url.pathname === href ? 'page' : undefined}
											>
												{label}
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</li>

						<!-- About link -->
						<li class="nav-item">
							<a
								href="/about"
								class="nav-link"
								class:active={$page.url.pathname === '/about'}
								on:click={closeMenu}
								aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
							>
								About
							</a>
						</li>
					</ul>

					<!-- Login/Register section -->
					{#if !$page.data?.user}
						<div class="nav-actions">
							<a href="/login" class="login-button" on:click={closeMenu}> Login / Register </a>
						</div>
					{/if}
				</div>
			</nav>
		</div>
	{/if}
</div>

<style lang="scss">
	.mobile-nav-container {
		position: relative;
		z-index: 1000;
	}

	/* Toggle Button */
	.mobile-nav-toggle {
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}

		&:focus-visible {
			outline: 2px solid var(--primary, #3b82f6);
			outline-offset: 2px;
		}
	}

	/* Hamburger Icon */
	.hamburger {
		width: 24px;
		height: 24px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 4px;
	}

	.line {
		width: 100%;
		height: 2px;
		background-color: var(--text-primary, #1f2937);
		border-radius: 2px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: center;
	}

	.hamburger.open .line-1 {
		transform: translateY(6px) rotate(45deg);
	}

	.hamburger.open .line-2 {
		opacity: 0;
		transform: scaleX(0);
	}

	.hamburger.open .line-3 {
		transform: translateY(-6px) rotate(-45deg);
	}

	/* Overlay */
	.mobile-nav-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		z-index: 999;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
	}

	/* Navigation Panel */
	.mobile-nav-panel {
		background-color: var(--card-background, #ffffff);
		width: 320px;
		max-width: 85vw;
		height: 100vh;
		overflow-y: auto;
		box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
		display: flex;
		flex-direction: column;
	}

	/* Header */
	.mobile-nav-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 1.25rem 1rem;
		border-bottom: 1px solid var(--border-color, #e5e7eb);
	}

	.nav-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary, #1f2937);
		margin: 0;
	}

	.close-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		color: var(--text-secondary, #6b7280);
		border-radius: 6px;
		transition: all 0.2s ease;

		&:hover {
			background-color: var(--light-gray, #f3f4f6);
			color: var(--text-primary, #1f2937);
		}

		&:focus-visible {
			outline: 2px solid var(--primary, #3b82f6);
			outline-offset: 2px;
		}
	}

	/* Navigation Content */
	.mobile-nav-content {
		flex: 1;
		padding: 1rem 0;
		display: flex;
		flex-direction: column;
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
		flex: 1;
	}

	.nav-item {
		margin: 0;
		padding: 0;
	}

	.nav-link {
		display: block;
		padding: 0.875rem 1.25rem;
		color: var(--text-primary, #1f2937);
		text-decoration: none;
		font-size: 1.125rem;
		font-weight: 500;
		transition: all 0.2s ease;
		border-left: 3px solid transparent;

		&:hover {
			background-color: var(--light-gray, #f9fafb);
			color: var(--primary, #3b82f6);
		}

		&.active {
			background-color: var(--primary-light, #eff6ff);
			color: var(--primary, #3b82f6);
			border-left-color: var(--primary, #3b82f6);
			font-weight: 600;
		}

		&:focus-visible {
			outline: 2px solid var(--primary, #3b82f6);
			outline-offset: -2px;
		}
	}

	/* Dropdown */
	.dropdown-item {
		position: relative;
	}

	.dropdown-toggle {
		width: 100%;
		background: none;
		border: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.875rem 1.25rem;
		color: var(--text-primary, #1f2937);
		font-size: 1.125rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;

		&:hover {
			background-color: var(--light-gray, #f9fafb);
			color: var(--primary, #3b82f6);
		}

		&:focus-visible {
			outline: 2px solid var(--primary, #3b82f6);
			outline-offset: -2px;
		}
	}

	.dropdown-arrow {
		transition: transform 0.3s ease;
		color: var(--text-secondary, #6b7280);

		&.rotated {
			transform: rotate(180deg);
		}
	}

	.submenu {
		list-style: none;
		margin: 0;
		padding: 0;
		background-color: var(--lightest-gray, #f8fafc);
		border-top: 1px solid var(--border-color, #e5e7eb);
	}

	.submenu-item {
		margin: 0;
		padding: 0;
	}

	.submenu-link {
		display: block;
		padding: 0.75rem 1.25rem 0.75rem 2.5rem;
		color: var(--text-secondary, #6b7280);
		text-decoration: none;
		font-size: 1rem;
		font-weight: 400;
		transition: all 0.2s ease;
		border-left: 3px solid transparent;

		&:hover {
			background-color: var(--light-gray, #f1f5f9);
			color: var(--primary, #3b82f6);
		}

		&.active {
			background-color: var(--primary-light, #eff6ff);
			color: var(--primary, #3b82f6);
			border-left-color: var(--primary, #3b82f6);
			font-weight: 500;
		}

		&:focus-visible {
			outline: 2px solid var(--primary, #3b82f6);
			outline-offset: -2px;
		}
	}

	/* Action Buttons */
	.nav-actions {
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--border-color, #e5e7eb);
	}

	.login-button {
		display: block;
		width: 100%;
		padding: 0.875rem 1.25rem;
		background-color: var(--primary, #3b82f6);
		color: white;
		text-align: center;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		font-size: 1rem;
		transition: all 0.2s ease;

		&:hover {
			background-color: var(--primary-dark, #2563eb);
			transform: translateY(-1px);
		}

		&:focus-visible {
			outline: 2px solid var(--primary, #3b82f6);
			outline-offset: 2px;
		}
	}

	/* Responsive adjustments */
	@media (max-width: 480px) {
		.mobile-nav-panel {
			width: 280px;
			max-width: 90vw;
		}

		.mobile-nav-header {
			padding: 1rem 1rem 0.75rem;
		}

		.nav-title {
			font-size: 1.125rem;
		}

		.nav-link,
		.dropdown-toggle {
			padding: 0.75rem 1rem;
			font-size: 1rem;
		}

		.submenu-link {
			padding: 0.625rem 1rem 0.625rem 2rem;
			font-size: 0.9rem;
		}

		.nav-actions {
			padding: 0.75rem 1rem;
		}

		.login-button {
			padding: 0.75rem 1rem;
			font-size: 0.9rem;
		}
	}
</style>

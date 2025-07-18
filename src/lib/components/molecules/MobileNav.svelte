<!-- lib/components/molecules/MobileNav.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import Context, { onClickOutside } from '$lib/components/molecules/Context.svelte';

	// Props to receive navigation items
	export let navItems = [];
	export let blogItems = [];

	// State management
	let isMenuOpen = false;
	let isDropdownOpen = false;

	// Close menu when page changes
	$: if ($page.url) {
		closeMenu();
	}

	// Cleanup on component destroy
	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.classList.remove('overflow-hidden');
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
			if (isMenuOpen) {
				document.body.classList.add('overflow-hidden');
			} else {
				document.body.classList.remove('overflow-hidden');
			}
		}
	}

	/**
	 * Close the mobile menu
	 */
	function closeMenu() {
		isMenuOpen = false;
		isDropdownOpen = false;

		if (typeof document !== 'undefined') {
			document.body.classList.remove('overflow-hidden');
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
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="relative z-40 flex items-center">
	<!-- Menu toggle button -->
	<button
		class="mobile-nav__toggle"
		aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
		tabindex="0"
		on:click={toggleMenu}
		aria-expanded={isMenuOpen}
		aria-controls="mobile-menu"
	>
		<span class="mobile-nav__icon">
			{#if isMenuOpen}
				<span class="mobile-nav__close"></span>
			{:else}
				<span class="mobile-nav__line"></span>
				<span class="mobile-nav__line"></span>
				<span class="mobile-nav__line"></span>
			{/if}
		</span>
	</button>

	<!-- Mobile navigation overlay -->
	{#if isMenuOpen}
		<div
			class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-16 backdrop-blur-sm transition-opacity duration-300"
			on:click|self={closeMenu}
			role="dialog"
			aria-modal="true"
			aria-labelledby="mobile-menu-title"
		>
			<Context>
				<nav
					id="mobile-menu"
					class="mobile-nav__menu"
					aria-label="Mobile Navigation"
					use:onClickOutside={closeMenu}
				>
					<div class="p-6">
						<!-- Menu title for screen readers -->
						<h2 id="mobile-menu-title" class="sr-only">Navigation Menu</h2>

						<ul class="m-0 list-none space-y-1 p-0">
							<!-- Main navigation items -->
							{#each navItems as { href, label }}
								<li class="m-0 list-none p-0">
									<a
										{href}
										class:is-active={$page.url.pathname === href}
										on:click={closeMenu}
										aria-current={$page.url.pathname === href ? 'page' : undefined}
									>
										{label}
									</a>
								</li>
							{/each}

							<!-- Blog dropdown section -->
							<li class="relative m-0 list-none p-0">
								<button
									type="button"
									class="mobile-nav__dropdown-toggle"
									aria-haspopup="true"
									aria-expanded={isDropdownOpen}
									aria-controls="mobile-blog-menu"
									on:click={toggleDropdown}
								>
									Blog
									<span class="mobile-nav__arrow" class:is-open={isDropdownOpen}></span>
								</button>

								{#if isDropdownOpen}
									<ul
										id="mobile-blog-menu"
										class="mobile-nav__submenu"
									>
										{#each blogItems as { href, label }}
											<li class="m-0 list-none p-0">
												<a
													{href}
													class:is-active={$page.url.pathname === href}
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
							<li class="m-0 list-none p-0">
								<a
									href="/about"
									class:is-active={$page.url.pathname === '/about'}
									on:click={closeMenu}
									aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
								>
									About
								</a>
							</li>

							<!-- Login/Register link -->
							{#if !($page.data?.user)}
								<li class="m-0 list-none p-0 mt-4">
									<a
										href="/login"
										class="mobile-nav__login-btn"
										on:click={closeMenu}
									>
										Login / Register
									</a>
								</li>
							{/if}
						</ul>
					</div>
				</nav>
			</Context>
		</div>
	{/if}
</div>

<style>
	/* Screen reader only content */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.mobile-nav__login-btn {
		display: block;
		width: 100%;
		padding: 0.75rem 1.25rem;
		background-color: var(--primary);
		color: white;
		text-align: center;
		text-decoration: none;
		border-radius: var(--border-radius);
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.mobile-nav__login-btn:hover {
		background-color: var(--primary-dark);
	}
</style>

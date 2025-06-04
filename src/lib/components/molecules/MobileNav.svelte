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
		class="hamburger-btn flex h-10 w-10 cursor-pointer items-center justify-center border-none bg-transparent rounded-lg transition-colors duration-200 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
		aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
		tabindex="0"
		on:click={toggleMenu}
		aria-expanded={isMenuOpen}
		aria-controls="mobile-menu"
	>
		<span class="hamburger-icon relative flex h-6 w-6 items-center justify-center">
			<span
				class="hamburger-line absolute left-0 h-0.5 w-full bg-neutral-800 transition-all duration-300 ease-in-out"
				class:active={isMenuOpen}
			></span>
		</span>
	</button>

	<!-- Mobile navigation overlay -->
	{#if isMenuOpen}
		<div
			class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-16 transition-opacity duration-300 backdrop-blur-sm"
			on:click|self={closeMenu}
			role="dialog"
			aria-modal="true"
			aria-labelledby="mobile-menu-title"
		>
			<Context>
				<nav
					id="mobile-menu"
					class="mobile-nav max-h-[80vh] w-[320px] max-w-[90vw] overflow-y-auto rounded-xl bg-white shadow-2xl border border-neutral-200"
					aria-label="Mobile Navigation"
					use:onClickOutside={closeMenu}
				>
					<div class="p-6">
						<!-- Menu title for screen readers -->
						<h2 id="mobile-menu-title" class="sr-only">Navigation Menu</h2>
						
						<ul class="list-none space-y-1 m-0 p-0">
							<!-- Main navigation items -->
							{#each navItems as { href, label }}
								<li class="list-none m-0 p-0">
									<a
										{href}
										class="mobile-nav-link flex items-center w-full py-3 px-4 text-lg font-semibold text-neutral-800 rounded-lg transition-all duration-200 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:bg-primary-50 focus:text-primary-700"
										class:active={$page.url.pathname === href}
										on:click={closeMenu}
										aria-current={$page.url.pathname === href ? 'page' : undefined}
									>
										{label}
									</a>
								</li>
							{/each}

							<!-- Blog dropdown section -->
							<li class="relative list-none m-0 p-0">
								<button
									type="button"
									class="mobile-nav-link flex w-full items-center justify-between py-3 px-4 text-left text-lg font-semibold text-neutral-800 rounded-lg transition-all duration-200 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:bg-primary-50 focus:text-primary-700"
									aria-haspopup="true"
									aria-expanded={isDropdownOpen}
									aria-controls="mobile-blog-menu"
									on:click={toggleDropdown}
								>
									Blog
									<svg 
										class="chevron-icon h-5 w-5 transition-transform duration-200 ease-in-out"
										class:rotate-180={isDropdownOpen}
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
									</svg>
								</button>

								{#if isDropdownOpen}
									<ul 
										id="mobile-blog-menu"
										class="mt-2 list-none space-y-1 border-l-2 border-primary-200 pl-4 m-0"
									>
										{#each blogItems as { href, label }}
											<li class="list-none m-0 p-0">
												<a
													{href}
													class="mobile-nav-link flex items-center w-full py-2.5 px-3 text-base font-medium text-neutral-700 rounded-lg transition-all duration-200 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:bg-primary-50 focus:text-primary-700"
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
							<li class="list-none m-0 p-0">
								<a
									href="/about"
									class="mobile-nav-link flex items-center w-full py-3 px-4 text-lg font-semibold text-neutral-800 rounded-lg transition-all duration-200 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus:bg-primary-50 focus:text-primary-700"
									class:active={$page.url.pathname === '/about'}
									on:click={closeMenu}
									aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
								>
									About
								</a>
							</li>
						</ul>
					</div>
				</nav>
			</Context>
		</div>
	{/if}
</div>

<style lang="scss">
	// Reset list styles
	ul, li {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	li::marker {
		display: none;
		content: none;
	}

	// Hamburger animation
	.hamburger-icon {
		.hamburger-line {
			&::before,
			&::after {
				content: '';
				position: absolute;
				left: 0;
				height: 0.125rem;
				width: 100%;
				background-color: currentColor;
				transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
			}

			&::before {
				top: -8px;
			}

			&::after {
				bottom: -8px;
			}

			&.active {
				background-color: transparent;

				&::before {
					top: 0;
					transform: rotate(45deg);
				}

				&::after {
					bottom: 0;
					transform: rotate(-45deg);
				}
			}
		}
	}

	// Mobile navigation animation
	.mobile-nav {
		animation: slideInFade 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	@keyframes slideInFade {
		from {
			opacity: 0;
			transform: translateY(-20px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	// Active link styles
	.mobile-nav-link {
		position: relative;
		text-decoration: none;
		border: none;
		background: transparent;

		&.active {
			background-color: theme('colors.primary.50');
			color: theme('colors.primary.700');
			font-weight: 600;
		}
	}

	// Screen reader only content
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
</style>
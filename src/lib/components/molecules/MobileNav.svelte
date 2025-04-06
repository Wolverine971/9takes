<script lang="ts">
	import { page } from '$app/stores';
	import Context, { onClickOutside } from '$lib/components/molecules/Context.svelte';

	// Props to receive navigation items
	export let navItems = [];
	export let blogItems = [];

	// State management
	let isMenuOpen = false;
	let isDropdownOpen = false;

	// Close the menu when navigating to a new page
	$: $page.url && (isMenuOpen = false);

	/**
	 * Toggle the mobile menu
	 */
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;

		if (!isMenuOpen) {
			isDropdownOpen = false;
		}

		// Prevent body scrolling when menu is open
		if (isMenuOpen) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
	}

	/**
	 * Close the mobile menu
	 */
	function closeMenu() {
		isMenuOpen = false;
		isDropdownOpen = false;
		document.body.classList.remove('overflow-hidden');
	}
</script>

<div class="relative z-40 flex items-center">
	<!-- Menu toggle button -->
	<button
		class="hamburger-btn flex h-10 w-10 cursor-pointer items-center justify-center border-none bg-transparent"
		aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
		tabindex="0"
		on:click={toggleMenu}
		on:keydown={(e) => e.key === 'Enter' && toggleMenu()}
		aria-expanded={isMenuOpen}
	>
		<span class="hamburger-icon relative flex h-6 w-6 items-center justify-center">
			<span
				class="hamburger-line absolute left-0 h-0.5 w-full bg-gray-800 transition-all duration-300"
				class:active={isMenuOpen}
			></span>
		</span>
	</button>

	<!-- Mobile navigation menu -->
	{#if isMenuOpen}
		<div
			class="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-16 transition-opacity duration-300"
			on:click|self={closeMenu}
		>
			<Context>
				<nav
					class="mobile-nav max-h-[80vh] w-[320px] max-w-[90vw] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
					aria-label="Main Navigation"
					use:onClickOutside={closeMenu}
				>
					<ul class="list-none space-y-5 pt-2">
						<!-- Main navigation items -->
						{#each navItems as { href, label }}
							<li class="list-none">
								<a
									{href}
									class="mobile-nav-link block py-2 text-xl font-medium text-gray-800"
									class:active={$page.url.pathname === href}
									on:click={closeMenu}
								>
									{label}
								</a>
							</li>
						{/each}

						<!-- Blog dropdown -->
						<li class="relative list-none">
							<button
								type="button"
								class="mobile-nav-link flex w-full items-center justify-between py-2 text-left text-xl font-medium text-gray-800"
								aria-haspopup="true"
								aria-expanded={isDropdownOpen}
								on:click={() => (isDropdownOpen = !isDropdownOpen)}
							>
								Blog
								<span class="chevron-icon relative h-4 w-4" class:rotate={isDropdownOpen}></span>
							</button>

							{#if isDropdownOpen}
								<ul class="mt-2 list-none space-y-2 border-l-2 border-primary-100 pl-4">
									{#each blogItems as { href, label }}
										<li class="list-none">
											<a
												{href}
												class="mobile-nav-link block py-2 text-lg font-medium text-gray-800"
												class:active={$page.url.pathname === href}
												on:click={closeMenu}
											>
												{label}
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</li>

						<!-- About link -->
						<li class="list-none">
							<a
								href="/about"
								class="mobile-nav-link block py-2 text-xl font-medium text-gray-800"
								class:active={$page.url.pathname === '/about'}
								on:click={closeMenu}
							>
								About
							</a>
						</li>
					</ul>
				</nav>
			</Context>
		</div>
	{/if}
</div>

<style lang="scss">
	// Reset list styles explicitly
	ul,
	li {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}

	li::marker {
		display: none;
		content: none;
	}
	// Hamburger button styling
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
				transition: all 0.3s ease;
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

	// Dropdown chevron
	.chevron-icon {
		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 50%;
			width: 0.625rem;
			height: 0.125rem;
			background-color: currentColor;
			transition: transform 0.3s ease;
		}

		&::before {
			left: 0;
			transform: translateY(-50%) rotate(45deg);
		}

		&::after {
			right: 0;
			transform: translateY(-50%) rotate(-45deg);
		}

		&.rotate {
			&::before {
				transform: translateY(-50%) rotate(-45deg);
			}

			&::after {
				transform: translateY(-50%) rotate(45deg);
			}
		}
	}

	// Mobile navigation styling
	.mobile-nav {
		animation: fadeIn 0.3s ease forwards;
		max-height: 80vh;
		overflow-y: auto;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.mobile-nav-link {
		position: relative;
		text-decoration: none;
		transition: color 0.2s ease;
		border: none;
		background: transparent;

		&:hover {
			color: theme('colors.primary.700');
		}

		&.active {
			color: theme('colors.primary.700');
		}
	}
</style>

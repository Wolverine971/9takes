<!-- lib/components/molecules/mobile-ham.svelte -->
<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

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

		const modal2 = getModal('mobile-nav');
		if (isMenuOpen) {
			modal2.open();
		} else {
			modal2.close();
		}
		// Control the modal
		const modal = document.getElementById('mobile-nav');
		if (modal) {
			if (isMenuOpen) {
				modal.classList.add('is-active');
			} else {
				modal.classList.remove('is-active');
				isDropdownOpen = false;
			}
		}
	}

	/**
	 * Close the mobile menu
	 */
	function closeMenu() {
		isMenuOpen = false;
		isDropdownOpen = false;
		getModal('mobile-nav').close();

		const modal = document.getElementById('mobile-nav');
		if (modal) {
			modal.classList.remove('is-active');
		}
	}
</script>

<div class="mobile-nav">
	<!-- Menu toggle button -->
	<button
		class="mobile-nav__toggle"
		aria-label="Toggle navigation"
		role="button"
		tabindex="0"
		on:click={toggleMenu}
		on:keydown={(e) => e.key === 'Enter' && toggleMenu()}
		aria-expanded={isMenuOpen}
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

	<!-- Mobile navigation menu modal -->
	<Modal2 id="mobile-nav" on:close={handleModalClose}>
		<Context>
			<nav class="mobile-nav__menu" aria-label="Main Navigation" use:onClickOutside={closeMenu}>
				<ul>
					<!-- Main navigation items -->
					{#each navItems as { href, label }}
						<li>
							<a {href} class:is-active={$page.url.pathname === href} on:click={closeMenu}>
								{label}
							</a>
						</li>
					{/each}

					<!-- Blog dropdown -->
					<li class="mobile-nav__dropdown">
						<button
							type="button"
							class="mobile-nav__dropdown-toggle"
							aria-haspopup="true"
							aria-expanded={isDropdownOpen}
							on:click={() => (isDropdownOpen = !isDropdownOpen)}
						>
							Blog
							<span class="mobile-nav__arrow" class:is-open={isDropdownOpen}></span>
						</button>

						{#if isDropdownOpen}
							<ul class="mobile-nav__submenu">
								{#each blogItems as { href, label }}
									<li>
										<a {href} class:is-active={$page.url.pathname === href} on:click={closeMenu}>
											{label}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>

					<!-- About link -->
					<li>
						<a href="/about" class:is-active={$page.url.pathname === '/about'} on:click={closeMenu}>
							About
						</a>
					</li>
				</ul>
			</nav>
		</Context>
	</Modal2>
</div>

<style lang="scss">
	// Variables
	$primary-color: #833bff;
	$text-color: #333;
	$transition: 0.3s ease;
	$line-color: #333;

	// Mobile navigation styles
	.mobile-nav {
		position: relative;
		z-index: 1000;
		display: flex;
		justify-content: center;

		// Toggle button
		&__toggle {
			background: none;
			border: none;
			cursor: pointer;
			padding: 0;
			width: 32px;
			height: 32px;
			display: flex;
			align-items: center;
			justify-content: center;

			&:focus {
				outline: none;
			}
		}

		&__icon {
			position: relative;
			width: 24px;
			height: 24px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		// Hamburger menu
		&__line {
			position: absolute;
			left: 0;
			width: 100%;
			height: 2px;
			background-color: $line-color;
			transition:
				transform $transition,
				opacity $transition;

			&:nth-child(1) {
				transform: translateY(-8px);
			}

			&:nth-child(3) {
				transform: translateY(8px);
			}
		}

		// Close icon
		&__close {
			position: relative;
			width: 24px;
			height: 24px;

			&::before,
			&::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 0;
				width: 100%;
				height: 2px;
				background-color: $line-color;
			}

			&::before {
				transform: rotate(45deg);
			}

			&::after {
				transform: rotate(-45deg);
			}
		}

		// Modal container
		&__modal {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 0;
			background-color: rgba(0, 0, 0, 0.5);
			opacity: 0;
			visibility: hidden;
			transition:
				opacity $transition,
				visibility $transition;
			z-index: 999;
			display: flex;
			justify-content: center;

			&.is-active {
				height: 100%;
				opacity: 1;
				visibility: visible;
			}
		}

		// Navigation menu
		&__menu {
			padding: 2rem 1rem;
			width: 280px;
			max-width: 90vw;
			background-color: #fff;
			border-radius: 8px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
			padding: 1.5rem;
			overflow-y: auto;
			max-height: calc(100vh - 80px);

			ul {
				list-style: none;
				padding: 0;
				margin: 0;
			}

			li {
				margin-bottom: 1.25rem;

				a {
					display: block;
					font-size: 1.25rem;
					color: $text-color;
					text-decoration: none;
					padding: 0.5rem 0;
					transition: color $transition;

					&:hover,
					&.is-active {
						color: $primary-color;
					}
				}

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		// Dropdown styles
		&__dropdown {
			position: relative;

			&-toggle {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				background: none;
				border: none;
				text-align: left;
				font-size: 1.25rem;
				color: $text-color;
				padding: 0.5rem 0;
				cursor: pointer;
				transition: color $transition;

				&:hover {
					color: $primary-color;
				}
			}
		}

		// Dropdown arrow icon
		&__arrow {
			position: relative;
			width: 12px;
			height: 12px;

			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: 0;
				width: 8px;
				height: 8px;
				border-right: 2px solid currentColor;
				border-bottom: 2px solid currentColor;
				transform: translateY(-75%) rotate(45deg);
				transition: transform $transition;
			}

			&.is-open::before {
				transform: translateY(-25%) rotate(-135deg);
			}
		}

		// Submenu styles
		&__submenu {
			padding-left: 1.25rem;
			margin-top: 0.75rem;
			border-left: 1px solid #eee;

			li {
				margin-bottom: 0.75rem;

				a {
					font-size: 1.125rem;
				}
			}
		}
	}
</style>

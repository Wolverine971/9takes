<!-- src/lib/components/molecules/mobile-ham.svelte -->
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

	function handleModalClose() {
		closeMenu();
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

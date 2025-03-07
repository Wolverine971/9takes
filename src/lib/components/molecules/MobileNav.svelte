<script lang="ts">
	import Modal from '$lib/components/atoms/Modal2.svelte';
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

		const modal = document.getElementById('mobile-nav');
		if (modal) {
			modal.classList.remove('is-active');
		}
	}
</script>

<div class="relative z-50 flex justify-center">
	<!-- Menu toggle button -->
	<button
		class="flex h-8 w-8 cursor-pointer items-center justify-center border-none bg-transparent p-0 focus:outline-none"
		aria-label="Toggle navigation"
		on:click={toggleMenu}
		aria-expanded={isMenuOpen}
	>
		<span class="relative flex h-6 w-6 items-center justify-center">
			{#if isMenuOpen}
				<span class="relative h-6 w-6">
					<span class="absolute left-0 top-1/2 h-0.5 w-full rotate-45 transform bg-gray-800"></span>
					<span class="absolute left-0 top-1/2 h-0.5 w-full -rotate-45 transform bg-gray-800"
					></span>
				</span>
			{:else}
				<span
					class="absolute left-0 h-0.5 w-full -translate-y-2 transform bg-gray-800 transition-transform duration-300 ease-in-out"
				></span>
				<span
					class="absolute left-0 h-0.5 w-full bg-gray-800 transition-opacity duration-300 ease-in-out"
				></span>
				<span
					class="absolute left-0 h-0.5 w-full translate-y-2 transform bg-gray-800 transition-transform duration-300 ease-in-out"
				></span>
			{/if}
		</span>
	</button>

	<!-- Mobile navigation menu modal -->
	<div
		id="mobile-nav"
		class="invisible fixed left-0 top-0 z-40 flex h-0 w-full justify-center bg-black bg-opacity-50 opacity-0 transition-all duration-300 ease-in-out"
		class:h-full={isMenuOpen}
		class:showNav={isMenuOpen}
		on:click|self={closeMenu}
	>
		<Context>
			<nav
				class="mt-[50%] max-h-[calc(100vh-80px)] w-[280px] max-w-[90vw] overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
				aria-label="Main Navigation"
				use:onClickOutside={closeMenu}
			>
				<ul class="m-0 list-none p-0">
					<!-- Main navigation items -->
					{#each navItems as { href, label }}
						<li class="mb-5">
							<a
								{href}
								class="block py-2 text-xl text-gray-800 no-underline transition-colors duration-300 hover:text-indigo-600"
								class:text-indigo-600={$page.url.pathname === href}
								on:click={closeMenu}
							>
								{label}
							</a>
						</li>
					{/each}

					<!-- Blog dropdown -->
					<li class="relative mb-5">
						<button
							type="button"
							class="flex w-full cursor-pointer items-center justify-between border-none bg-transparent py-2 text-left text-xl text-gray-800 transition-colors duration-300 hover:text-indigo-600"
							aria-haspopup="true"
							aria-expanded={isDropdownOpen}
							on:click={() => (isDropdownOpen = !isDropdownOpen)}
						>
							Blog
							<span class="relative h-3 w-3 transition-transform duration-300">
								<span
									class="absolute left-0 top-1/2 h-2 w-2 -translate-y-3/4 rotate-45 transform border-b-2 border-r-2 border-current {isDropdownOpen
										? '-translate-y-1/4'
										: ''}"
									class:rotate-[-135deg]={isDropdownOpen}
								></span>
							</span>
						</button>

						{#if isDropdownOpen}
							<ul class="mt-3 border-l border-gray-200 pl-5">
								{#each blogItems as { href, label }}
									<li class="mb-3">
										<a
											{href}
											class="block py-2 text-lg text-gray-800 no-underline transition-colors duration-300 hover:text-indigo-600"
											class:text-indigo-600={$page.url.pathname === href}
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
					<li class="mb-0">
						<a
							href="/about"
							class="block py-2 text-xl text-gray-800 no-underline transition-colors duration-300 hover:text-indigo-600"
							class:text-indigo-600={$page.url.pathname === '/about'}
							on:click={closeMenu}
						>
							About
						</a>
					</li>
				</ul>
			</nav>
		</Context>
	</div>
</div>

<style>
	.showNav {
		visibility: visible !important;
		opacity: 1 !important;
	}
	/* Only adding a helper class for the modal visibility state to work with the JS */
	.is-active {
		@apply visible h-full opacity-100;
	}
</style>

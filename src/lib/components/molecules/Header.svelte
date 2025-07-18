<!-- lib/components/molecules/Header.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MobileNav from './MobileNav.svelte';
	import Context, { onClickOutside } from '$lib/components/molecules/Context.svelte';

	export let data: any;

	// Responsive state
	let innerWidth: number;
	let isDropdownOpen = false;

	// Reactive statements
	$: isMobile = innerWidth < 768;
	$: isHomePage = $page.url.pathname === '/';

	// Reset dropdown state on navigation
	afterNavigate(() => (isDropdownOpen = false));

	// Initialize window resize handler
	onMount(() => {
		innerWidth = window.innerWidth;
	});

	// Navigation structure - centralized for consistency
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/questions', label: 'Question List' }
	];

	const blogItems = [
		{ href: '/community', label: 'The Takes of 9takes' },
		{ href: '/enneagram-corner', label: 'Enneagram Corner' },
		{ href: '/personality-analysis', label: 'Personality Analysis' },
		{ href: '/how-to-guides', label: 'How-to Guides' }
	];

	// Handlers
	const goToAccount = () => goto('/account');
	const toggleDropdown = () => (isDropdownOpen = !isDropdownOpen);
	const closeDropdown = () => (isDropdownOpen = false);
</script>

<svelte:window bind:innerWidth />

<header class="nav-main" role="banner" aria-label="Site header">
	{#if isMobile}
		<!-- Mobile Header -->
		<div class="flex h-16 items-center justify-between px-4">
			<MobileNav {navItems} {blogItems} />

			<!-- Logo - centered -->
			<a href="/" class="logo-link absolute left-1/2 -translate-x-1/2 transform" aria-label="Go to homepage">
				<img src="/brand/aero.png" alt="9takes Logo" height="60" width="60" />
			</a>

			<!-- Account button -->
			{#if data?.user}
				<button type="button" on:click={goToAccount} class="account-button" aria-label="Go to account">
					<img src="/brand/account-icon2.png" alt="Account" width="30" height="30" />
				</button>
			{/if}
		</div>
	{:else}
		<!-- Desktop Navigation -->
		<nav class="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8" role="navigation" aria-label="Main navigation">
			<!-- Logo & Brand -->
			<a href="/" class="logo-link" aria-label="Go to homepage">
				<img src="/brand/aero.png" alt="9takes Logo" height="60" width="60" />
				<span>
					{!isHomePage ? '9takes' : ' '}
				</span>
			</a>

			<!-- Main Navigation - centered -->
			<div class="absolute left-1/2 flex -translate-x-1/2 transform items-center justify-center">
				<div class="flex items-center gap-8">
					<!-- Main nav items -->
					{#each navItems as { href, label }}
						<a
							{href}
							class="nav-link"
							class:active-link={$page.url.pathname === href}
							aria-current={$page.url.pathname === href ? 'page' : undefined}
						>
							{label}
						</a>
					{/each}

					<!-- Blog Dropdown -->
					<div class="relative z-40">
						<button
							on:click={toggleDropdown}
							class="nav-link flex items-center gap-1"
							aria-haspopup="true"
							aria-controls="blogMenu"
							aria-expanded={isDropdownOpen}
						>
							Blog
							<svg
								class="dropdown-arrow h-4 w-4"
								class:rotated={isDropdownOpen}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{#if isDropdownOpen}
							<Context>
								<ul id="blogMenu" class="dropdown-menu" use:onClickOutside={closeDropdown}>
									{#each blogItems as { href, label }}
										<li>
											<a
												{href}
												class:active={$page.url.pathname === href}
												on:click={closeDropdown}
											>
												{label}
											</a>
										</li>
									{/each}
								</ul>
							</Context>
						{/if}
					</div>

					<!-- About link -->
					<a
						href="/about"
						class="nav-link"
						class:active-link={$page.url.pathname === '/about'}
						aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
					>
						About
					</a>
				</div>
			</div>

			<!-- Account / Login Area -->
			<div class="flex items-center">
				{#if data?.user}
					<a href="/account" class="account-button" aria-label="Go to account">
						<img src="/brand/account-icon2.png" alt="Account" title="Account" width="30" height="30" />
					</a>
				{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
					<a href="/login" class="btn btn-primary">
						Login / Register
					</a>
				{/if}
			</div>
		</nav>
	{/if}
</header>


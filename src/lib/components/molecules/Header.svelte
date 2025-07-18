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

<header class="nav-main">
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
				<button
					type="button"
					on:click={goToAccount}
					class="flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					aria-label="Go to account"
				>
					<img
						src="/brand/account-icon2.png"
						alt="Account"
						width="30"
						height="30"
						class="rounded-full border border-neutral-300 p-0.5 transition-transform duration-200 hover:scale-110"
					/>
				</button>
			{/if}
		</div>
	{:else}
		<!-- Desktop Navigation -->
		<nav class="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
			<!-- Logo & Brand -->
			<a
				href="/"
				class="group flex items-center rounded-lg no-underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
				aria-label="Go to homepage"
			>
				<img
					src="/brand/aero.png"
					alt="9takes Logo"
					height="60"
					width="60"
					class="transition-transform duration-200 group-hover:scale-110"
				/>
				<span
					class="ml-2 w-[75px] text-2xl font-bold text-neutral-800 transition-colors duration-200 group-hover:text-primary-700"
				>
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
							class="nav-link relative rounded px-2 py-2 text-base font-semibold text-neutral-800 no-underline transition-colors duration-200 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
							class="nav-link relative flex items-center gap-1 rounded px-2 py-2 text-base font-semibold text-neutral-800 no-underline transition-colors duration-200 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
							aria-haspopup="true"
							aria-controls="blogMenu"
							aria-expanded={isDropdownOpen}
						>
							Blog
							<svg
								class="h-4 w-4 transition-transform duration-200"
								class:rotate-180={isDropdownOpen}
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
								<ul
									id="blogMenu"
									class="dropdown-menu absolute left-1/2 top-[calc(100%+0.5rem)] z-50 w-[240px] -translate-x-1/2 transform rounded-lg border border-neutral-200 bg-white py-2 shadow-lg"
									use:onClickOutside={closeDropdown}
								>
									{#each blogItems as { href, label }}
										<li>
											<a
												{href}
												class="block px-4 py-3 text-sm font-medium text-neutral-700 no-underline transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700 focus:bg-primary-50 focus:text-primary-700 focus:outline-none"
												class:text-primary-700={$page.url.pathname === href}
												class:bg-primary-50={$page.url.pathname === href}
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
						class="nav-link relative rounded px-2 py-2 text-base font-semibold text-neutral-800 no-underline transition-colors duration-200 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
					<a
						href="/account"
						class="flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-1 transition-all duration-200 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
						aria-label="Go to account"
					>
						<img
							src="/brand/account-icon2.png"
							alt="Account"
							title="Account"
							width="30"
							height="30"
							class="rounded-full border border-neutral-300 p-0.5 transition-transform duration-200 hover:scale-110"
						/>
					</a>
				{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
					<a
						href="/login"
						class="inline-flex items-center rounded-lg bg-primary-700 px-6 py-2.5 text-sm font-semibold !text-white no-underline shadow-sm transition-all duration-200 hover:bg-primary-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
					>
						Login / Register
					</a>
				{/if}
			</div>
		</nav>
	{/if}
</header>


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

	$: isMobile = innerWidth < 768;
	$: isHomePage = $page.url.pathname === '/';

	// Reset dropdown state on navigation
	afterNavigate(() => (isDropdownOpen = false));

	// Initialize and handle window resize
	onMount(() => {
		innerWidth = window.innerWidth;
	});

	// Navigation structure
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

	// Account navigation handler
	const goToAccount = () => goto('/account');
</script>

<svelte:window bind:innerWidth />

<header class="relative z-50 bg-white shadow">
	{#if isMobile}
		<!-- Mobile Header -->
		<div class="flex h-16 items-center justify-between px-4">
			<MobileNav {navItems} {blogItems} />

			<a
				href="/"
				class="absolute left-1/2 flex -translate-x-1/2 transform items-center"
				aria-label="Home"
			>
				<img
					src="/brand/aero.png"
					alt="9takes Logo"
					height="60"
					width="60"
					class="transition-transform duration-200 hover:scale-110"
				/>
			</a>

			{#if data?.session?.user}
				<button
					type="button"
					on:click={goToAccount}
					class="flex cursor-pointer items-center justify-center border-none bg-transparent p-0"
					aria-label="Go to account"
				>
					<img
						src="/brand/account-icon2.png"
						alt="Account"
						width="30"
						height="30"
						class="rounded-full border border-gray-300 p-0.5 transition-transform duration-200 hover:scale-110"
					/>
				</button>
			{/if}
		</div>
	{:else}
		<!-- Desktop Navigation -->
		<nav class="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
			<!-- Logo & Brand -->
			<a href="/" class="flex items-center no-underline" aria-label="Home">
				<img
					src="/brand/aero.png"
					alt="9takes Logo"
					height="60"
					width="60"
					class="transition-transform duration-200 hover:scale-110"
				/>
				<span class="ml-2 w-[75px] text-2xl font-bold text-gray-800">
					{!isHomePage ? '9takes' : ' '}
				</span>
			</a>

			<!-- Main Navigation -->
			<div class="absolute left-1/2 flex -translate-x-1/2 transform items-center justify-center">
				<div class="flex items-center gap-8">
					{#each navItems as { href, label }}
						<a
							{href}
							class="nav-link relative px-0 py-2 text-base font-semibold text-gray-800 no-underline"
							class:active-link={$page.url.pathname === href}
						>
							{label}
						</a>
					{/each}

					<!-- Blog Dropdown -->
					<div class="relative z-40">
						<button
							on:click={() => (isDropdownOpen = !isDropdownOpen)}
							class="nav-link relative px-0 py-2 text-base font-semibold text-gray-800 no-underline"
							aria-haspopup="true"
							aria-controls="blogMenu"
							aria-expanded={isDropdownOpen}
						>
							Blog
						</button>

						<Context>
							<ul
								id="blogMenu"
								class="dropdown-menu absolute left-1/2 top-[calc(100%+0.5rem)] w-[220px] -translate-x-1/2 transform rounded bg-white py-2 shadow-md"
								class:is-open={isDropdownOpen}
								use:onClickOutside={() => (isDropdownOpen = false)}
							>
								{#each blogItems as { href, label }}
									<li>
										<a
											{href}
											tabindex={isDropdownOpen ? 0 : -1}
											class="block px-4 py-3 font-normal text-gray-800 no-underline transition-colors duration-200 hover:bg-gray-100"
											class:text-primary-700={$page.url.pathname === href}
										>
											{label}
										</a>
									</li>
								{/each}
							</ul>
						</Context>
					</div>

					<a
						href="/about"
						class="nav-link relative px-0 py-2 text-base font-semibold text-gray-800 no-underline"
						class:active-link={$page.url.pathname === '/about'}
					>
						About
					</a>
				</div>
			</div>

			<!-- Account / Login Area -->
			<div>
				{#if data?.session?.user}
					<a
						href="/account"
						class="flex cursor-pointer items-center justify-center border-none bg-transparent p-0"
					>
						<img
							src="/brand/account-icon2.png"
							alt="Account"
							title="Account"
							width="30"
							height="30"
							class="rounded-full border border-gray-300 p-0.5 transition-transform duration-200 hover:scale-110"
						/>
					</a>
				{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
					<a
						href="/login"
						class="inline-block rounded bg-primary-700 px-6 py-2 font-semibold text-white no-underline transition-colors duration-200 hover:bg-primary-800"
					>
						Login / Register
					</a>
				{/if}
			</div>
		</nav>
	{/if}
</header>

<style lang="scss">
	.dropdown-menu {
		display: none;
		list-style: none;
		margin: 0;
		padding: 0.5rem 0;

		&.is-open {
			display: block;
		}

		li {
			&::marker {
				content: none;
			}

			a {
				&::after {
					display: none;
				}
			}
		}
	}

	.nav-link {
		position: relative;
		cursor: pointer;
		background: transparent;
		border: none;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			height: 2px;
			width: 0;
			background-color: theme('colors.primary.700');
			transition: width 0.2s ease;
		}

		&:hover::after {
			width: 100%;
		}
	}

	.active-link {
		color: theme('colors.primary.700');

		&::after {
			width: 100%;
		}
	}
</style>

<!-- src/lib/components/molecules/Header.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MobileNav from './MobileNavNew.svelte';
	import Context, { onClickOutside } from '$lib/components/molecules/Context.svelte';
	import ThemeToggle from '$lib/components/atoms/ThemeToggle.svelte';

	export let data: any;

	let innerWidth: number;
	let isMoreOpen = false;

	$: isMobile = innerWidth < 768;

	afterNavigate(() => (isMoreOpen = false));

	onMount(() => {
		innerWidth = window.innerWidth;
	});

	// Primary nav links shown in the header bar
	const primaryLinks = [
		{ href: '/questions', label: 'Questions' },
		{ href: '/enneagram-corner', label: 'Enneagram Corner' },
		{ href: '/personality-analysis', label: 'Personality Analysis' }
	];

	// "More" dropdown links
	const moreLinks = [
		{ href: '/how-to-guides', label: 'How-to Guides' },
		{ href: '/blog', label: 'All Blog Topics' },
		{ href: '/community', label: 'The Takes of 9takes' },
		{ href: '/pop-culture', label: 'Pop Culture' }
	];

	// Combined for mobile nav
	const navItems = [
		{ href: '/', label: 'Home' },
		...primaryLinks,
		{ href: '/how-to-guides', label: 'How-to Guides' },
		{ href: '/book-session', label: 'Book Session' }
	];

	const blogItems = [
		{ href: '/blog', label: 'All Blog Topics' },
		{ href: '/community', label: 'The Takes of 9takes' },
		{ href: '/pop-culture', label: 'Pop Culture' }
	];

	const goToAccount = () => goto('/account');
	const toggleMore = () => (isMoreOpen = !isMoreOpen);
	const closeMore = () => (isMoreOpen = false);
</script>

<svelte:window bind:innerWidth />

<header class="nav-main" aria-label="Site header">
	{#if isMobile}
		<!-- Mobile Header -->
		<div class="flex h-14 items-center justify-between px-4">
			<MobileNav {navItems} {blogItems} />

			<a href="/" class="logo-link" aria-label="Go to homepage">
				<span class="logo-text">9takes</span>
			</a>

			<div class="flex items-center gap-2">
				<ThemeToggle />
				{#if data?.user}
					<button
						type="button"
						on:click={goToAccount}
						class="account-button"
						aria-label="Go to account"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="account-icon"
						>
							<circle cx="12" cy="12" r="10" />
							<circle cx="12" cy="10" r="3" />
							<path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	{:else}
		<!-- Desktop Navigation -->
		<nav class="header-inner" aria-label="Main navigation">
			<!-- Logo -->
			<a href="/" class="logo-link" aria-label="Go to homepage">
				<span class="logo-text">9takes</span>
			</a>

			<!-- Center nav links -->
			<div class="nav-center">
				{#each primaryLinks as { href, label }}
					<a
						{href}
						class="nav-link"
						class:active-link={$page.url.pathname.startsWith(href)}
						aria-current={$page.url.pathname.startsWith(href) ? 'page' : undefined}
					>
						{label}
					</a>
				{/each}

				<!-- More dropdown -->
				<div class="relative z-20">
					<button
						on:click={toggleMore}
						class="nav-link flex items-center gap-1"
						aria-haspopup="true"
						aria-controls="moreMenu"
						aria-expanded={isMoreOpen}
					>
						More
						<svg
							class="dropdown-arrow h-4 w-4"
							class:rotated={isMoreOpen}
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

					{#if isMoreOpen}
						<Context>
							<ul id="moreMenu" class="dropdown-menu" use:onClickOutside={closeMore}>
								{#each moreLinks as { href, label }}
									<li>
										<a
											{href}
											class:active={$page.url.pathname.startsWith(href)}
											on:click={closeMore}
										>
											{label}
										</a>
									</li>
								{/each}
							</ul>
						</Context>
					{/if}
				</div>

				<!-- Book Session — standalone after More -->
				<a
					href="/book-session"
					class="nav-link"
					class:active-link={$page.url.pathname.startsWith('/book-session')}
					aria-current={$page.url.pathname.startsWith('/book-session') ? 'page' : undefined}
				>
					Book Session
				</a>
			</div>

			<!-- Right side: theme + account -->
			<div class="flex items-center gap-3">
				<ThemeToggle />
				{#if data?.user}
					<a href="/account" class="account-button" aria-label="Go to account" title="Account">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="account-icon"
						>
							<circle cx="12" cy="12" r="10" />
							<circle cx="12" cy="10" r="3" />
							<path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
						</svg>
					</a>
				{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
					<a href="/login" class="btn btn-primary"> Login </a>
				{/if}
			</div>
		</nav>
	{/if}
</header>

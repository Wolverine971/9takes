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

<header class="header">
	{#if isMobile}
		<!-- Mobile Header -->
		<div class="header__mobile">
			<MobileNav {navItems} {blogItems} />

			<a href="/" class="header__brand" aria-label="Home">
				<img src="/brand/aero.png" alt="9takes Logo" height="60" width="60" />
			</a>

			{#if data?.session?.user}
				<button
					type="button"
					on:click={goToAccount}
					class="header__account-button"
					aria-label="Go to account"
				>
					<img src="/brand/account-icon2.png" alt="Account" width="30" height="30" />
				</button>
			{/if}
		</div>
	{:else}
		<!-- Desktop Navigation -->
		<nav class="header__nav">
			<!-- Logo & Brand -->
			<a href="/" class="header__brand" aria-label="Home">
				<div class="header__logo">
					<img src="/brand/aero.png" alt="9takes Logo" height="60" width="60" />
				</div>
				<span class="header__brand-name">
					{!isHomePage ? '9takes' : ' '}
				</span>
			</a>

			<!-- Main Navigation -->
			<div class="header__menu">
				<div class="header__nav-items">
					{#each navItems as { href, label }}
						<a {href} class:is-active={$page.url.pathname === href}>
							{label}
						</a>
					{/each}

					<!-- Blog Dropdown -->
					<div class="header__dropdown">
						<button
							on:click={() => (isDropdownOpen = !isDropdownOpen)}
							class="header__dropdown-button"
							aria-haspopup="true"
							aria-controls="blogMenu"
							aria-expanded={isDropdownOpen}
						>
							Blog
						</button>

						<Context>
							<ul
								id="blogMenu"
								class="header__dropdown-menu"
								class:is-open={isDropdownOpen}
								use:onClickOutside={() => (isDropdownOpen = false)}
							>
								{#each blogItems as { href, label }}
									<li>
										<a
											{href}
											tabindex={isDropdownOpen ? 0 : -1}
											class:is-active={$page.url.pathname === href}
										>
											{label}
										</a>
									</li>
								{/each}
							</ul>
						</Context>
					</div>

					<a href="/about" class:is-active={$page.url.pathname === '/about'}> About </a>
				</div>
			</div>

			<!-- Account / Login Area -->
			<div class="header__actions">
				{#if data?.session?.user}
					<a href="/account" class="header__account-link">
						<img
							src="/brand/account-icon2.png"
							alt="Account"
							title="Account"
							width="30"
							height="30"
						/>
					</a>
				{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
					<a href="/login" class="header__login-button"> Login / Register </a>
				{/if}
			</div>
		</nav>
	{/if}
</header>

<style lang="scss">
	// Variables
	$primary-color: #833bff;
	$text-color: #333;
	$hover-bg: #f5f5f5;
	$transition: 0.2s ease;
	$border-radius: 4px;
	$box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

	// Base header styles
	.header {
		padding: 0 2rem;
		z-index: 1000; /* Increased z-index */
		box-shadow: $box-shadow;
		background: #fff;
		position: relative;

		// Shared brand/logo styles
		&__brand {
			display: flex;
			align-items: center;
			text-decoration: none;

			img {
				transition: transform $transition;
				will-change: transform;

				&:hover {
					transform: scale(1.1);
				}
			}
		}

		&__brand-name {
			font-size: 1.5rem;
			font-weight: bold;
			color: $text-color;
			width: 75px;
			margin-left: 0.5rem;
		}

		// Account button styles (shared between mobile/desktop)
		&__account-button,
		&__account-link {
			background: none;
			border: none;
			cursor: pointer;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;

			img {
				border-radius: 50%;
				border: 1px solid #ccc;
				padding: 2px;
				transition: transform $transition;

				&:hover {
					transform: scale(1.1);
				}
			}
		}

		// Desktop Navigation
		&__nav {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 62px;
			position: relative;
		}

		&__menu {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);

			.header__nav-items {
				display: flex;
				gap: 2rem;
				align-items: center;
			}

			a,
			.header__dropdown-button {
				position: relative;
				text-decoration: none;
				color: $text-color;
				font-weight: 600;
				background: none;
				border: none;
				cursor: pointer;
				padding: 0.5rem 0;
				font-size: 1rem;

				&::after {
					content: '';
					position: absolute;
					width: 0;
					height: 2px;
					background: $primary-color;
					left: 0;
					bottom: 0;
					transition: width $transition;
				}

				&:hover::after,
				&.is-active::after {
					width: 100%;
				}

				&.is-active {
					color: $primary-color;
				}
			}
		}

		// Dropdown menu
		&__dropdown {
			position: relative;
			z-index: 1005; /* Add z-index to the dropdown container */

			&-menu {
				position: absolute;
				top: calc(100% + 0.5rem);
				left: 50%;
				transform: translateX(-50%);
				background: #fff;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
				border-radius: $border-radius;
				list-style: none;
				padding: 0.5rem 0;
				margin: 0;
				width: 220px;
				z-index: 1010; /* Increased z-index */
				display: none;

				&.is-open {
					display: block;
					/* Ensure it appears on top */
					position: absolute;
					z-index: 1010;
				}

				li {
					a {
						display: block;
						padding: 0.75rem 1rem;
						text-decoration: none;
						color: $text-color;
						font-weight: normal;
						transition: background-color $transition;

						&::after {
							display: none;
						}

						&:hover {
							background-color: $hover-bg;
						}

						&.is-active {
							color: $primary-color;
						}
					}
				}
			}
		}

		// Login button
		&__login-button {
			display: inline-block;
			padding: 0.5rem 1.5rem;
			background-color: $primary-color;
			color: white;
			border-radius: $border-radius;
			text-decoration: none;
			font-weight: 600;
			transition: background-color $transition;

			&:hover {
				background-color: darken($primary-color, 10%);
			}
		}

		// Mobile header
		&__mobile {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 62px;

			.header__brand {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
</style>

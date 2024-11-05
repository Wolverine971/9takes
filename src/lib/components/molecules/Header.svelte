<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MobileHam from '$lib/components/molecules/mobile-ham.svelte';
	import Context, { onClickOutside } from '$lib/components/molecules/Context.svelte';

	export let data: any;
	let innerWidth: number;
	let isOpen = false;

	$: isMobile = innerWidth < 1000;
	$: isHomePage = $page.url.pathname === '/';

	afterNavigate(() => (isOpen = false));

	onMount(() => {
		innerWidth = window.innerWidth;
		window.addEventListener('resize', () => {
			innerWidth = window.innerWidth;
		});
	});

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
</script>

<svelte:window bind:innerWidth />

<header class="the-header">
	{#if isMobile}
		<div class="mobile-ham">
			<MobileHam />
			<a href="/" class="brand" aria-label="Home">
				<img src="/brand/aero.png" alt="9takes Logo" height={60} width={60} />
			</a>
			{#if data?.session?.user}
				<div class="corner">
					<button
						title="Go to account"
						type="button"
						on:click={() => goto('/account')}
						class="corner-icon-profile"
						aria-label="Go to account"
					>
						<img src="/brand/account-icon2.png" alt="Account" width="30" height="30" />
					</button>
				</div>
			{/if}
		</div>
	{:else}
		<nav class="nav-bar">
			<a href="/" class="brand left" aria-label="Home">
				<div class="app-icon">
					<img src="/brand/aero.png" alt="9takes Logo" height={60} width={60} />
				</div>
				{#if !isHomePage}
					<span class="brand-name">9takes</span>
				{:else}
					<span class="brand-name"> </span>
				{/if}
			</a>

			<div class="menu center">
				{#each navItems as { href, label }}
					<a {href} class:active-link={$page.url.pathname === href}>
						{label}
					</a>
				{/each}
				<div class="dropdown">
					<button
						on:click={() => (isOpen = !isOpen)}
						class="dropdown-button"
						aria-haspopup="true"
						aria-controls="blogMenu"
						aria-expanded={isOpen}
					>
						Blog
					</button>
					<Context>
						<ul
							id="blogMenu"
							class="dropdown-menu"
							class:open={isOpen}
							use:onClickOutside={() => (isOpen = false)}
						>
							{#each blogItems as { href, label }}
								<li>
									<a
										{href}
										tabindex={isOpen ? 0 : -1}
										class:active-link={$page.url.pathname === href}
									>
										{label}
									</a>
								</li>
							{/each}
						</ul>
					</Context>
				</div>
				<a href="/about" class:active-link={$page.url.pathname === '/about'}> About </a>
			</div>

			{#if data?.session?.user}
				<div class="right">
					<a href="/account">
						<button type="button" class="corner-icon-profile">
							<img
								src="/brand/account-icon2.png"
								alt="Account"
								title="Account"
								width="30"
								height="30"
							/>
						</button>
					</a>
				</div>
			{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
				<div class="right login">
					<a href="/login" class="shimmer-button-black"> Login / Register </a>
				</div>
			{/if}
		</nav>
	{/if}
</header>

<style lang="scss">
	.the-header {
		padding: 0 2rem;
		z-index: 9999;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

		.nav-bar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 62px;

			.brand {
				display: flex;
				align-items: center;
				text-decoration: none;

				.app-icon {
					margin-right: 0.5rem;

					img {
						transition: transform 0.3s ease-in-out;
					}

					&:hover img {
						transform: scale(1.1);
					}
				}

				.brand-name {
					font-size: 1.5rem;
					font-weight: bold;
					color: #333;
					width: 75px;
				}
			}

			.menu {
				display: flex;
				align-items: center;
				margin-right: 75px;

				a {
					margin: 0 1rem;
					text-decoration: none;
					color: #333;
					font-weight: 600;
					position: relative;

					&::after {
						content: '';
						position: absolute;
						width: 0;
						height: 2px;
						background: #833bff;
						left: 50%;
						bottom: -5px;
						transition: all 0.3s ease-in-out;
					}

					&:hover::after {
						width: 100%;
						left: 0;
					}

					&.active-link {
						color: #833bff;
					}
				}

				.dropdown {
					position: relative;

					.dropdown-button {
						background: none;
						border: none;
						cursor: pointer;
						font-weight: 600;
						margin: 0 1rem;
						position: relative;
						color: #333;

						&::after {
							content: '';
							position: absolute;
							width: 0;
							height: 2px;
							background: #833bff;
							left: 50%;
							bottom: -5px;
							transition: all 0.3s ease-in-out;
						}

						&:hover::after {
							width: 100%;
							left: 0;
						}

						&:focus {
							outline: none;
						}
					}

					.dropdown-menu {
						display: none;
						position: absolute;
						top: 100%;
						left: 0;
						background: #fff;
						box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
						list-style: none;
						padding: 1rem 0;
						margin: 0;
						width: 220px;
						border-radius: 4px;
						z-index: 1000;

						&.open {
							display: block;
						}

						li {
							margin: 0;

							a {
								display: block;
								padding: 0.5rem 1rem;
								text-decoration: none;
								color: #333;

								&:hover {
									background: #f5f5f5;
								}

								&.active-link {
									color: #833bff;
								}
							}
						}
					}
				}
			}

			.right {
				display: flex;
				align-items: center;

				.corner-icon-profile {
					background: none;
					border: none;
					cursor: pointer;
					padding: 0;
					margin-left: 1rem;
					border: 1px solid;
					border-radius: 50%;

					img {
						transition: transform 0.3s ease-in-out;
					}

					&:hover img {
						transform: scale(1.1);
					}
				}

				.login {
					a {
						text-decoration: none;
						color: #fff;
						background: #833bff;
						padding: 0.5rem 1rem;
						border-radius: 4px;
						font-weight: 600;

						&:hover {
							background: #6a2fcc;
						}
					}
				}
			}
		}

		.mobile-ham {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 62px;

			.brand {
				display: flex;
				align-items: center;
				text-decoration: none;

				img {
					transition: transform 0.3s ease-in-out;
				}

				&:hover img {
					transform: scale(1.1);
				}
			}

			.corner {
				.corner-icon-profile {
					background: none;
					border: none;
					cursor: pointer;
					padding: 0;
					margin-left: 1rem;

					img {
						transition: transform 0.3s ease-in-out;
					}

					&:hover img {
						transform: scale(1.1);
					}
				}
			}
		}
	}

	@media (max-width: 1000px) {
		.nav-bar {
			display: none;
		}

		.mobile-ham {
			display: flex;
		}
	}
</style>

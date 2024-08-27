<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import account from '$lib/images/account-circle.svg';
	import MobileHam from '$lib/components/molecules/mobile-ham.svelte';
	import Rubix from '$lib/components/icons/rubix.svelte';
	import Scribble from '$lib/components/atoms/scribble.svelte';
	import Context, { onClickOutside } from '$lib/components/molecules/Context.svelte';

	export let data: any;
	let innerWidth: number;
	let isOpen = false;
	let isLoading = true;

	$: isMobile = innerWidth < 1000;
	$: isHomePage = $page.url.pathname === '/';

	afterNavigate(() => (isOpen = false));

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		updateWindowSize();
	});

	afterUpdate(updateWindowSize);

	function updateWindowSize() {
		innerWidth = window.innerWidth;
		isLoading = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const navbar = document.querySelector('.mobile-ham');
		if (navbar && !navbar.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	const navItems = [
		{ href: '/', label: 'HOME' },
		{ href: '/questions', label: 'QUESTIONS' }
	];

	const blogItems = [
		{ href: '/community', label: 'The Takes of 9takes' },
		{ href: '/enneagram-corner', label: 'Enneagram Corner' },
		{ href: '/personality-analysis', label: 'Personality Analysis' },
		{ href: '/how-to-guides', label: 'How to Guides' }
	];
</script>

<svelte:window bind:innerWidth />

{#if isLoading}
	<div style="display: flex; justify-content: center; margin: 10px; padding: 0 2rem">
		<svg
			version="1.1"
			id="loader"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			width="40px"
			height="40px"
			viewBox="0 0 50 50"
			style="enable-background:new 0 0 50 50;"
			xml:space="preserve"
			aria-label="Loading"
			role="img"
		>
			<path
				fill="var(--primary)"
				d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
			>
				<animateTransform
					attributeType="xml"
					attributeName="transform"
					type="rotate"
					from="0 25 25"
					to="360 25 25"
					dur="0.6s"
					repeatCount="indefinite"
					aria-hidden="true"
				/>
			</path>
		</svg>
	</div>
{:else}
	<header class="the-header">
		{#if isMobile}
			<div class="mobile-ham" class:absolute-pos={isHomePage}>
				<MobileHam />
				<a href="/" class="brand" aria-label="Home">
					<Rubix height={50} width={50} svgStyle="margin: 1rem" />
				</a>
				{#if data?.session?.user}
					<div class="corner">
						<button
							title="go to account"
							type="button"
							on:click={() => goto('/account')}
							class="corner-icon"
							aria-label="Go to account"
						>
							<img src={account} alt="Account" width="30" height="30" />
						</button>
					</div>
				{/if}
			</div>
		{:else}
			<nav class="nav-bar" class:absolute-pos={isHomePage}>
				<a href="/" class="brand left" aria-label="Home">
					<Rubix height={50} width={50} svgStyle="margin: 1rem" />
					{#if !isHomePage}
						<Scribble text="9takes" />
					{/if}
				</a>

				<div class="center menu" class:home-page={isHomePage}>
					{#each navItems as { href, label }}
						<a {href} class="a-wrap" class:active-link={$page.url.pathname === href}>
							<div class="nav-element nav-element1">{label}</div>
							<div class="nav-element nav-element2">{label}</div>
						</a>
					{/each}
					<div class="dropdown">
						<button
							on:click={() => (isOpen = !isOpen)}
							class="dropdown-button blog-btn"
							aria-haspopup="true"
							aria-controls="blogMenu"
							aria-expanded={isOpen}
						>
							<div class="nav-element" class:active-link={$page.url.pathname.includes('/blog')}>
								BLOG
							</div>
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
										<a {href} class="a-wrap blog-nav-awrap" tabindex={isOpen ? 0 : -1}>
											<div
												class="nav-element nav-element1-h"
												class:active-link={$page.url.pathname === href}
											>
												{label}
											</div>
											<div
												class="nav-element nav-element2-h"
												class:active-link={$page.url.pathname === href}
											>
												{label}
											</div>
										</a>
									</li>
								{/each}
							</ul>
						</Context>
					</div>
					<a href="/about" class="a-wrap" class:active-link={$page.url.pathname === '/about'}>
						<div class="nav-element nav-element1">{'ABOUT'}</div>
						<div class="nav-element nav-element2">{'ABOUT'}</div>
					</a>
				</div>

				{#if data?.session?.user}
					<div class="corner-right-big right">
						<a href="/account">
							<button type="button" class="corner-icon">
								<img src={account} alt="Account" title="Account" width="30" height="30" />
							</button>
						</a>
					</div>
				{:else if !($page.url.pathname === 'login' || $page.url.pathname === 'register')}
					<div class="right login">
						<a href="/login">
							<button class="corner-icon">Login/ Register</button>
						</a>
					</div>
				{/if}
			</nav>
		{/if}
	</header>
{/if}

<style lang="scss">
	.question-blink {
		$shadow-color: var(--primary);
		box-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 20px $shadow-color, 0 0 30px $shadow-color,
			0 0 40px $shadow-color, 0 0 50px $shadow-color;
		animation: blink 0.7s infinite alternate;
	}

	@keyframes blink {
		to {
			box-shadow: 0 0 3px #fff, 0 0 10px #fff, 0 0 20px #fff, 0 0 40px var(--primary),
				0 0 70px var(--primary), 0 0 80px var(--primary);
		}
	}

	.the-header {
		padding: 0 2rem;
		z-index: 9999;

		.a-wrap {
			position: relative;
			width: 10rem;
			max-width: 100%;
			height: 100%;
			overflow: hidden;
			text-decoration: none;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.nav-element {
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			text-align: center;
			justify-content: center;
			transition: transform 0.2s ease-in-out;

			&1 {
				transform: translateY(0);
			}
			&2 {
				transform: translateY(100%);
			}
			&1-h {
				font-size: 1rem;
				width: auto;
				transform: translateX(0);
			}
			&2-h {
				font-size: 1rem;
				width: auto;
				transform: translateX(500%);
			}
		}

		.a-wrap:hover {
			.nav-element1 {
				transform: translateY(-100%);
			}
			.nav-element2 {
				transform: translateY(0);
			}
			.nav-element1-h {
				transform: translateX(-200%);
			}
			.nav-element2-h {
				transform: translateX(0);
			}
		}

		.blog-nav-awrap {
			justify-content: flex-start;
		}

		.dope-nav-menu {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 0 auto;
			box-sizing: border-box;

			.nav-text {
				letter-spacing: 0.28px;
				text-transform: uppercase;
				font-weight: 700;
				text-decoration: none;
			}
		}

		.home-page {
			min-height: 2rem;
			background-color: rgba(240, 248, 255, 0.6);
			border-radius: var(--base-border-radius);
			border: var(--classic-border);
		}

		.nav-bar {
			display: flex;
			align-items: center;
			height: 62px;
			width: 100%;
			white-space: nowrap;
			flex-shrink: 0;
			font-weight: 600;
			font-size: 15px;
			border-bottom: 1px solid rgba(44, 45, 42, 0.25);
			position: sticky;
			top: 0;
			left: 0;
			z-index: 1236;

			@media (max-width: 575px) {
				width: calc(100% + 20px);
				margin-left: -10px;
			}

			.menu {
				display: flex;
				align-items: center;
				margin-left: auto;
				font-size: 1rem;
				padding: 0 2rem;
				color: var(--color-paladin-3);

				a {
					color: var(--color-paladin-3);
					margin: 0;
					padding: 0.75rem;

					&:hover {
						color: var(--primary);
					}
				}

				.dropdown {
					position: relative;

					&-menu {
						display: none;
						list-style-type: none;
						position: absolute;
						width: 18rem;
						right: 0;
						left: 0;
						top: 1rem;
						transform: translateY(10px);
						transition: all 0.4s ease;
						padding: 0.5rem;
						border-radius: var(--base-border-radius);
						border: 1px solid;
						background-color: var(--base-grey-1);
						// here
						font-size: 14px;

						&.open {
							display: block;
						}

						a {
							text-decoration: none;
							width: 18rem;
						}
					}

					&-button {
						color: var(--color-paladin-3);
						margin: 0;
						padding: 0.75rem;
						border: none;
						cursor: pointer;
						position: relative;
						overflow: visible;
						width: 10rem;
						max-width: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						height: 100%;

						&:hover {
							color: var(--primary);
						}
						&:after {
							transition: none;
							box-shadow: none;
						}
					}
				}

				@media screen and (max-width: 740px) {
					position: absolute;
					left: 3rem;
					top: 3rem;
					display: flex;
					flex-direction: column;
				}
			}
		}

		.login button {
			display: flex;
			align-items: center;
			outline: none;
			box-sizing: border-box;
			color: var(--primary);
			margin: 1rem;
			font-size: 16px;
			text-align: center;
			padding: 14px 16px;
			z-index: 1234;
		}

		.left {
			left: 0;
		}
		.center {
			left: 50%;
			transform: translateX(-50%);
			z-index: 12343;
		}
		.right {
			right: 0;
		}

		.left,
		.center,
		.right {
			position: absolute;
		}

		.brand {
			display: flex;
			justify-content: center;
			align-items: center;
			color: var(--base-white-outline);
			z-index: 12433;
			text-decoration: none;
		}

		.absolute-pos {
			position: absolute;
			left: 0;
			right: 0;
			margin: 0 auto;
			width: calc(100% - (var(--font-size) * 4));
			text-align: center;
		}

		.corner-icon {
			cursor: pointer;
			background: no-repeat;
			border-radius: var(--base-border-radius);
			border: var(--classic-border);
			background-color: var(--base-white-outline);
		}

		.mobile-ham {
			display: flex;
			align-items: center;
			width: 100%;
			justify-content: space-between;
			z-index: 12334;
		}

		.corner,
		.corner-right-big {
			margin: 1rem;
			z-index: 13;
		}

		.corner-right-big {
			position: absolute;
			right: 0;
			top: 0;

			a {
				width: 100%;
				height: 100%;
			}
			img {
				width: 2em;
				height: 2em;
				object-fit: contain;
			}
		}

		nav {
			display: flex;
			justify-content: center;
			z-index: 12312;
		}

		svg {
			width: 2em;
			height: 3em;
			display: block;
			fill: var(--color-paladin-3);
			transition: fill 0.2s ease-in-out;

			path {
				transition: fill 0.2s ease-in-out;
			}
			&:hover path {
				fill: red;
			}
		}

		a:hover,
		img:hover {
			color: var(--color-theme-pink);
		}
	}

	@media (max-width: 768px) {
		.the-header {
			padding: 0;
		}
	}

	.questions-flicker > span {
		text-transform: uppercase;
		animation: glow 2.5s ease-in-out infinite;

		@for $i from 2 through 10 {
			&:nth-child(#{$i}) {
				animation-delay: #{($i - 1) * 0.25}s;
			}
		}
	}

	@keyframes glow {
		0%,
		100% {
			color: #fff;
			text-shadow: 0 0 10px var(--primary), 0 0 50px var(--primary), 0 0 100px var(--primary);
		}
		10%,
		90% {
			color: #111;
			text-shadow: none;
		}
	}
</style>

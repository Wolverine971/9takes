<script lang="ts">
	import account from '$lib/images/account-circle.svg';
	import { onMount } from 'svelte';

	import MobileHam from './mobile-ham.svelte';

	// import NavbarLinks from './NavbarLinks.svelte';
	import { afterUpdate } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Rubix from '$lib/components/icons/rubix.svelte';
	import Scribble from '$lib/components/atoms/scribble.svelte';

	export let data: any;
	let innerWidth: number;
	let isOpen = false;
	let isLoading = true;

	afterNavigate(() => {
		isOpen = false;
	});

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		innerWidth = window.innerWidth;
		isLoading = false;
		isOpen = false;
	});

	afterUpdate(() => {
		innerWidth = window.innerWidth;
		isLoading = false;
	});

	const handleClickOutside = (event: any) => {
		const navbar = document.querySelector('.mobile-ham');
		if (navbar && !navbar.contains(event.target)) {
			isOpen = false;
		}
	};
</script>

<!-- <svelte:head>
	{@html `<script type="application/ld+json">${jsonld}</script>`}
</svelte:head> -->

<svelte:window bind:innerWidth />
{#if isLoading}
	<div style="display: flex; justify-content: center; margin: 10px; padding: 0 2rem">
		<svg
			version="1.1"
			id="loader-1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			width="40px"
			height="40px"
			viewBox="0 0 50 50"
			style="enable-background:new 0 0 50 50;"
			xml:space="preserve"
		>
			<path
				fill="#5407d9"
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
				/>
			</path>
		</svg>
	</div>
{:else}
	<header class="the-header">
		{#if innerWidth < 1000}
			<div class="mobile-ham {$page.url.pathname === '/' && 'absolute-pos'}">
				<MobileHam {data} />

				<a href="/" class="brand">
					<Rubix height={50} width={50} svgStyle={'margin: 1rem'} />
				</a>

				{#if data?.session?.user}
					<div class="corner">
						<button
							title="go to account"
							type="button"
							on:click={() => {
								goto('/account');
							}}
							class="corner-icon"
						>
							<img src={account} alt="Account" />
						</button>
					</div>
					<!-- not yet ready to allow registration and login
			{:else}
				<div class="corner ">
					<button
						type="button"
						on:click={() => {
							goto('/login');
						}}
						class="corner-icon"
					>
						<img src={login} alt="login" />
					</button>
				</div> -->
				{/if}
			</div>
		{:else}
			<nav
				class="nav-bar {innerWidth < 1000 && 'big-navbar'} {$page.url.pathname === '/' &&
					'absolute-pos'}"
			>
				<a href="/" class="brand left" aria-label="9takes logo">
					<Rubix height={50} width={50} svgStyle={'margin: 1rem'} />
					{#if innerWidth > 1000 && $page.url.pathname !== '/'}
						<Scribble text={'9takes'} />
					{/if}
				</a>

				<div
					class="center menu big-nav-links {$page.url.pathname === '/'
						? 'home-page'
						: ''} dope-nav-menu"
				>
					<a href="/" class="{$page.url.pathname === '/' ? 'active-link' : ''} a-wrap">
						<div
							class="nav-text nav-element nav-element1 {$page.url.pathname === '/'
								? 'active-link'
								: ''}"
							style=""
						>
							HOME
						</div>
						<div
							class="nav-element nav-element2 {$page.url.pathname === '/' ? 'active-link' : ''}"
							style=""
						>
							HOME
						</div>
					</a>
					<a
						title={'Questions with at least 9 takes'}
						href={'/questions'}
						class=" {$page.url.pathname === '/questions' ? 'active-link' : ''} a-wrap"
					>
						<div
							class="nav-text nav-element nav-element1 {$page.url.pathname.startsWith('/questions')
								? 'active-link'
								: ''}"
							style=""
						>
							QUESTIONS
						</div>
						<!-- {#if data?.session?.user?.id} -->
						<div
							class="nav-element nav-element2  {$page.url.pathname.startsWith('/questions')
								? 'active-link'
								: ''}"
							style=""
						>
							QUESTIONS
						</div>
						<!-- {/if} -->
						<!-- <div
						class="nav-element-disabled nav-element2  {$page.url.pathname.startsWith('/questions')
							? 'active-link'
							: ''}"
						style=""
					>
						QUESTIONS
					</div> -->
					</a>
					<a href="/blog" class="a-wrap">
						<div
							class="nav-text nav-element nav-element1 {$page.url.pathname === '/blog'
								? 'active-link'
								: ''}"
							style=""
						>
							BLOG
						</div>
						<div
							class="nav-element nav-element2 {$page.url.pathname === '/blog' ? 'active-link' : ''}"
							style=""
						>
							BLOG
						</div>
					</a>
					<a href="/about" class="a-wrap">
						<div
							class="nav-text nav-element nav-element1 {$page.url.pathname === '/about'
								? 'active-link'
								: ''}"
							style=""
						>
							ABOUT
						</div>
						<div
							class="nav-element nav-element2 {$page.url.pathname === '/about'
								? 'active-link'
								: ''}"
							style=""
						>
							ABOUT
						</div>
					</a>
				</div>
				{#if data?.session?.user}
					<div class="corner-right-big right">
						<button
							type="button"
							on:click={() => {
								goto('/account');
							}}
							style=""
							class="corner-icon"
						>
							<img src={account} alt="Account" />
						</button>
					</div>
					<!-- not yet ready to allow registration and login -->
				{:else if $page.url.pathname !== '/'}
					<div class=" right login">
						<button
							type="button"
							on:click={() => {
								goto('/login');
							}}
							class="corner-icon"
						>
							Sign Up/ In
						</button>
					</div>
				{/if}
				<!-- </div> -->
			</nav>
		{/if}
		<!-- </Context> -->
	</header>
{/if}

<style lang="scss">
	.the-header {
		padding: 0 2rem;
		z-index: 9999;

		.a-wrap {
			position: relative;
			width: 10rem;
			overflow: hidden;
			text-decoration: none;
			max-width: 100%;
			display: flex;
			align-items: center;
			height: 100%;
		}

		.nav-element {
			position: absolute;
			width: 100%;
			height: 100%;
			transition: transform 0.2s ease-in-out;
			display: flex;
			flex-direction: column;
			text-align: center;
			justify-content: center;
		}

		.nav-element1 {
			// background: red;
			transform: translateY(0);
		}

		.nav-element2 {
			// background: blue;
			transform: translateY(100%);
		}

		.a-wrap:hover .nav-element1 {
			transform: translateY(-100%);
		}

		.a-wrap:hover .nav-element2 {
			transform: translateY(0);
		}

		.dope-nav-menu {
			justify-content: space-between;
			align-items: center;
			margin-left: auto;
			margin-right: auto;
			display: flex;
			box-sizing: border-box;

			.nav-text {
				letter-spacing: 0.28px;
				text-transform: uppercase;
				font-weight: 700;
				text-decoration: none;
			}
		}

		.big-nav-links {
			display: flex;
			align-items: center;
			margin-left: auto;
			font-size: 1rem;
			padding: 0 2rem;
			color: var(--color-paladin-3);
			// background-color: rgb(240, 248, 255, 0.6);

			a {
				color: var(--color-paladin-3) !important;
				margin: 0;
				padding: 0.75rem;
			}
		}
		.home-page {
			min-height: 2rem;
			// background-color: aliceblue;
			background-color: rgb(240, 248, 255, 0.6);
			border-radius: 5px;
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
			// background-color: var(--beach-bg);
			z-index: 1236;

			@media (max-width: 575px) {
				width: calc(100% + 20px);
				margin-left: -10px;
			}

			.menu {
				display: flex;
				align-items: center;
				margin-left: auto;

				@media screen and (max-width: 740px) {
					// display: none;
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
			color: var(--color-theme-purple);
			margin: 1rem;
			z-index: 1234;
			font-size: 16px;
			color: var(--color-theme-purple);
			text-align: center;
			padding: 14px 16px;
			z-index: 1234;
		}
		.left {
			position: absolute;
			left: 0;
		}
		.center {
			position: absolute;
			left: 50%; /* Position the center item at the center of the navbar */
			transform: translateX(-50%);
			z-index: 12343;
		}
		.right {
			position: absolute;
			right: 0;
		}
		.brand {
			display: flex;
			justify-content: center;
			align-items: center;
			color: var(--color-paladin-1);
			z-index: 12433;
			text-decoration: none !important;
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
			border-radius: 5px;
			border: var(--classic-border);
			background-color: var(--color-paladin-1);
		}
		.mobile-ham {
			display: flex;
			align-items: center;
			// position: absolute;
			width: 100%;
			justify-content: space-between;
			z-index: 12334;
		}
		.navbar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-radius: 5px;
		}
		.big-navbar {
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 5px;
		}
		.mobile-navbar {
			background: var(--color-paladin-1);
			position: absolute;
			z-index: 2314;
		}

		.corner {
			margin: 1rem;
			// position: absolute;
			right: 0;
			// top: 0;
			z-index: 13;
		}
		.corner-right-big {
			margin: 1rem;
			position: absolute;
			right: 0;
			top: 0;
			z-index: 13;

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

		// .corner {
		// 	width: 3em;
		// 	height: 3em;
		// }

		.corner a {
			width: 100%;
			height: 100%;
		}

		.corner img {
			width: 2em;
			height: 2em;
			object-fit: contain;
		}

		nav {
			display: flex;
			justify-content: center;
			z-index: 12312;
			// --background: rgba(255, 255, 255, 0.7);
		}

		svg {
			width: 2em;
			height: 3em;
			display: block;
		}

		path {
			fill: var(--background);
		}

		a:hover {
			color: var(--color-theme-dark-blue);
		}
		svg {
			fill: var(--color-paladin-3); /* set the initial color of the SVG */
			transition: fill 0.2s ease-in-out; /* add a transition effect */
		}

		img:hover svg {
			fill: var(
				--color-theme-pink
			); //var(--color-theme-dark-blue); /* change the color of the SVG on hover */
		}
		img:hover {
			color: var(
				--color-theme-pink
			); //var(--color-theme-dark-blue); /* change the color of the SVG on hover */
		}
		svg path {
			transition: fill 0.2s ease-in-out; /* add a transition effect */
		}

		svg:hover path {
			fill: red; /* change the color of the SVG on hover */
		}
	}

	@media (max-width: 768px) {
		.the-header {
			padding: 0;
		}
	}
</style>

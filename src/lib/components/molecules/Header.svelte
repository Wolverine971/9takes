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
	import Context, { onClickOutside } from './Context.svelte';

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
					aria-hidden="true"
				/>
			</path>
		</svg>
	</div>
{:else}
	<header class="the-header" role="banner">
		{#if innerWidth < 1000}
			<div
				class="mobile-ham {$page.url.pathname === '/' && 'absolute-pos'}"
				aria-label="Main Navigation"
			>
				<MobileHam />

				<a href="/" class="brand" aria-labelledby="nineTakesBrandLogo">
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
							aria-label="Go to account"
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
				aria-label="Main Navigation"
				role="navigation"
			>
				<a href="/" class="brand left" aria-label="Home">
					<Rubix height={50} width={50} svgStyle={'margin: 1rem'} />
					{#if innerWidth > 1000 && $page.url.pathname !== '/'}
						<Scribble text={'9takes'} />
					{/if}
				</a>

				<div class="center menu {$page.url.pathname === '/' ? 'home-page' : ''} dope-nav-menu">
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
						class="{$page.url.pathname.includes('/questions') ? 'active-link' : ''} a-wrap"
					>
						<div
							class="nav-text nav-element nav-element1  {$page.url.pathname.includes('/questions')
								? 'active-link'
								: ''}"
							style=""
						>
							<div
								class="{$page.url.pathname.includes('/questions')
									? ''
									: 'questions-flicker'} questions-text"
							>
								<!-- QUESTIONS -->
								<span>Q</span>
								<span>U</span>
								<span>E</span>
								<span>S</span>
								<span>T</span>
								<span>I</span>
								<span>O</span>
								<span>N</span>
								<span>S</span>
							</div>
						</div>
						<!-- {#if data?.session?.user?.id} -->
						<div
							class="nav-element nav-element2  {$page.url.pathname.includes('/questions')
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
					<div class="dropdown" role="menu" aria-label="Blog Navigation">
						<button
							id="blogButton"
							title="See Blogs"
							type="button"
							on:click={() => {
								isOpen = !isOpen;
							}}
							class="dropdown-button blog-btn"
							aria-haspopup="true"
							aria-controls="blogMenu"
							aria-expanded={isOpen ? 'true' : 'false'}
						>
							<div
								class="nav-element  {$page.url.pathname === '/blog' ? 'active-link' : ''}"
								style=""
							>
								BLOG
							</div>
						</button>

						<Context>
							<ul
								id="blogMenu"
								aria-labelledby="blogButton"
								aria-hidden={!isOpen ? 'true' : 'false'}
								class="dropdown-menu {isOpen ? 'open' : ''}"
								use:onClickOutside={() => {
									if (isOpen) {
										isOpen = false;
									}
								}}
								role="menu"
							>
								<li role="none">
									<a
										href="/blog/community"
										class="a-wrap blog-nav-awrap"
										tabindex={isOpen ? 0 : -1}
										role="menuitem"
									>
										<div
											class="nav-text nav-element nav-element1-h {$page.url.pathname ===
											'/blog/community'
												? 'active-link'
												: ''}"
											style=""
										>
											9takes Inspiration
										</div>
										<div
											class="nav-text nav-element nav-element2-h {$page.url.pathname ===
											'/blog/community'
												? 'active-link'
												: ''}"
											style=""
										>
											9takes Inspiration
										</div>
									</a>
								</li>
								<li role="none">
									<a
										href="/blog/enneagram"
										class="a-wrap blog-nav-awrap"
										tabindex={isOpen ? 0 : -1}
										role="menuitem"
									>
										<div
											class="nav-text nav-element nav-element1-h {$page.url.pathname ===
											'/blog/enneagram'
												? 'active-link'
												: ''}"
											style=""
										>
											Enneagram Blogs
										</div>
										<div
											class="nav-text nav-element nav-element2-h {$page.url.pathname ===
											'/blog/enneagram'
												? 'active-link'
												: ''}"
											style=""
										>
											Enneagram Blogs
										</div>
									</a>
								</li>
								<li role="none">
									<a
										href="/blog/famous-enneagram-types"
										class="a-wrap blog-nav-awrap"
										tabindex={isOpen ? 0 : -1}
										role="menuitem"
									>
										<div
											class="nav-text nav-element nav-element1-h {$page.url.pathname ===
											'/blog/famous-enneagram-types'
												? 'active-link'
												: ''}"
											style=""
										>
											Famous Enneagram Types
										</div>
										<div
											class="nav-text nav-element nav-element2-h {$page.url.pathname ===
											'/blog/famous-enneagram-types'
												? 'active-link'
												: ''}"
											style=""
										>
											Famous Enneagram Types
										</div>
									</a>
								</li>

								<li role="none">
									<a
										href="/blog/guides"
										class="a-wrap blog-nav-awrap"
										tabindex={isOpen ? 0 : -1}
										role="menuitem"
									>
										<div
											class="nav-text nav-element nav-element1-h {$page.url.pathname ===
											'/blog/guides'
												? 'active-link'
												: ''}"
											style=""
										>
											Guides
										</div>
										<div
											class="nav-text nav-element nav-element2-h {$page.url.pathname ===
											'/blog/guides'
												? 'active-link'
												: ''}"
											style=""
										>
											Guides
										</div>
									</a>
								</li>
							</ul>
						</Context>
					</div>
					<!-- </div> -->
					<!-- </a> -->
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
							<img src={account} alt="Account" title="Account" width="30" height="30" />
						</button>
					</div>
					<!-- not yet ready to allow registration and login -->
				{:else if $page.url.pathname !== '/'}
					<div class="right login">
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
	.question-blink {
		box-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 20px var(--color-theme-purple),
			0 0 30px var(--color-theme-purple), 0 0 40px var(--color-theme-purple),
			0 0 50px var(--color-theme-purple);
		-webkit-animation: blink 0.7s infinite alternate;
		animation: blink 0.7s infinite alternate;
		// box-shadow: -0.25rem -0.25rem 0.5rem rgba(#fff, 0.07), 0.25rem 0.25rem 0.5rem rgba(#000, 0.12),
		// 	-0.75rem -0.75rem 1.75rem rgba(#fff, 0.07), 0.75rem 0.75rem 1.75rem rgba(#000, 0.12),
		// 	inset 8rem 8rem 8rem rgba(white, 0.05), inset -8rem -8rem 8rem rgba(#fff, 0.05);
	}

	@-webkit-keyframes blink {
		100% {
			box-shadow: 0 0 3px #fff, 0 0 10px #fff, 0 0 20px #fff, 0 0 40px var(--color-theme-purple),
				0 0 70px var(--color-theme-purple), 0 0 80px var(--color-theme-purple);
		}
	}

	@keyframes blink {
		100% {
			box-shadow: 0 0 3px #fff, 0 0 10px #fff, 0 0 20px #fff, 0 0 40px var(--color-theme-purple),
				0 0 70px var(--color-theme-purple), 0 0 80px var(--color-theme-purple);
		}
	}
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
			justify-content: center;
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

		.nav-element1-h {
			// background: red;
			font-size: 1rem;
			width: auto;
			transform: translateX(0);
		}

		.nav-element2-h {
			// background: blue;
			font-size: 1rem;
			width: auto;
			transform: translateX(500%);
		}

		.blog-nav-awrap {
			justify-content: flex-start;
		}

		.a-wrap:hover .nav-element1-h {
			transform: translateX(-200%);
		}

		.a-wrap:hover .nav-element2-h {
			transform: translateX(0);
		}

		.a-wrap:hover .nav-element2-h {
			transform: translateX(0);
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

			// .blog-btn:hover {
			// 	color: var(--color-theme-purple) !important;
			// }

			.menu {
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
				a:hover {
					color: var(--color-theme-purple) !important;
				}

				.dropdown {
					position: relative;
				}

				.dropdown-menu {
					display: none;
					list-style-type: none;
					position: absolute;
					width: 18rem;
					right: 0;
					left: 0;
					top: 1rem;
					pointer-events: none;
					transform: translateY(10px);
					transition: all 0.4s ease;
					padding: 0.5rem;
					border-radius: 5px;
					pointer-events: all;
					border: 1px solid;
					background-color: var(--color-paladin-2);
					font-size: 14px;

					a {
						text-decoration: none;
						width: 18rem;
					}
				}

				.dropdown-menu.open {
					display: block;
				}

				.dropdown-button {
					color: var(--color-paladin-3);
					margin: 0;
					padding: 0.75rem;
					border: none;
					cursor: pointer;
					position: relative;
					overflow: visible;
					width: 10rem;
					text-decoration: none;
					max-width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100%;
				}

				.dropdown-button:hover {
					color: var(--color-theme-purple) !important;
				}

				.dropdown-button:after {
					transition: none;
					box-shadow: none;
				}

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
	.questions-text {
		display: flex;
		justify-content: center;
	}

	.questions-flicker > span {
		text-transform: uppercase;
		animation: glow 2.5s ease-in-out infinite;
	}

	@keyframes glow {
		0%,
		100% {
			color: #fff;
			text-shadow: 0 0 10px var(--color-theme-purple), 0 0 50px var(--color-theme-purple),
				0 0 100px var(--color-theme-purple);
		}

		10%,
		90% {
			color: #111;
			text-shadow: none;
		}
	}

	.questions-flicker > span:nth-child(2) {
		animation-delay: 0.25s;
	}

	.questions-flicker > span:nth-child(3) {
		animation-delay: 0.5s;
	}

	.questions-flicker > span:nth-child(4) {
		animation-delay: 0.75s;
	}

	.questions-flicker > span:nth-child(5) {
		animation-delay: 1s;
	}

	.questions-flicker > span:nth-child(6) {
		animation-delay: 1.25s;
	}

	.questions-flicker > span:nth-child(7) {
		animation-delay: 1.5s;
	}

	.questions-flicker > span:nth-child(8) {
		animation-delay: 1.75s;
	}

	.questions-flicker > span:nth-child(9) {
		animation-delay: 2s;
	}

	.questions-flicker > span:nth-child(10) {
		animation-delay: 2.25s;
	}
</style>

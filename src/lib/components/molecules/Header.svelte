<script lang="ts">
	import account from '$lib/images/account-circle.svg';
	import { onMount } from 'svelte';

	import MobileHam from './mobile-ham.svelte';

	import type { PageData } from '../../../routes/$types';
	// import NavbarLinks from './NavbarLinks.svelte';
	import { afterUpdate } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Rubix from '../icons/rubix.svelte';
	import Scribble from '../atoms/scribble.svelte';

	// import rubixThick from './darkRubixThick.svg';
	export let data: PageData;
	let innerWidth: number;
	let isOpen = false;

	afterNavigate(() => {
		isOpen = false;
	});

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		innerWidth = window.innerWidth;
	});

	afterUpdate(() => {
		innerWidth = window.innerWidth;
	});

	const handleClickOutside = (event: any) => {
		const navbar = document.querySelector('.mobile-ham');
		if (navbar && !navbar.contains(event.target)) {
			isOpen = false;
		}
	};

	const jsonldString = {
		'@type': 'http://schema.org/SiteNavigationElement',
		'http://schema.org/mainEntity': [
			{
				'@type': 'http://schema.org/WebPage',
				'http://schema.org/name': 'Home',
				'http://schema.org/url': {
					'@id': 'https://9takes.com/'
				}
			},
			{
				'@type': 'http://schema.org/WebPage',
				'http://schema.org/hasPart': [
					{
						'@type': 'http://schema.org/WebPage',
						'http://schema.org/hasPart': [
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Enneagram Lineage',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-lineage'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Enneagram TLDR',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-tldr'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Concepts and Principles',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-concepts'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Enneagram Influences',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-influences'
								}
							}
						],
						'http://schema.org/name': 'Overview'
					},
					{
						'@type': 'http://schema.org/WebPage',
						'http://schema.org/hasPart': [
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Type 1: The Perfectionist',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-type-1'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Type 2: The Helper',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-type-2'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Type 3: The Achiever',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-type-3'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Type 4: The Individualist',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-type-4'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Type 5: The Investigator',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-type-5'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Type 6: The Loyalist',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-type-6'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Type 7: The Enthusiast',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-type-7'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Type 8: The Challenger',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-type-8'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Type 9: The Peacemaker',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-type-9'
								}
							}
						],
						'http://schema.org/name': '9 Types'
					},
					{
						'@type': 'http://schema.org/WebPage',
						'http://schema.org/hasPart': [
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Determining your type',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-personality-test'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Self development',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-self-development'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Strengths and weaknesses',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-strengths-and-weaknesses'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Growth strategies',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-personal-growth'
								}
							}
						],
						'http://schema.org/name': 'Personal Development'
					},
					{
						'@type': 'http://schema.org/WebPage',
						'http://schema.org/hasPart': [
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Types in relationships',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-types-in-relationships'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Communication tips',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-communication-tips'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Communication styles',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-communication-styles'
								}
							}
						],
						'http://schema.org/name': 'Relationships'
					},
					{
						'@type': 'http://schema.org/WebPage',
						'http://schema.org/hasPart': [
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Team building',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-workplace-team-building'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Working in teams',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-types-working-in-teams'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Team dynamics',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-team-dynamics'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Team diversity',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-team-diversity'
								}
							}
						],
						'http://schema.org/name': 'Workplace'
					},
					{
						'@type': 'http://schema.org/WebPage',
						'http://schema.org/hasPart': [
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'FAQs',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-faqs'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Books, websites, and podcasts',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-books-websites-podcasts'
								}
							}
						],
						'http://schema.org/name': 'Resources'
					},
					{
						'@type': 'http://schema.org/WebPage',
						'http://schema.org/hasPart': [
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Types at a party',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-types-at-party'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Impact of ghosting',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-types-being-ghosted'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Navigating stress',
								'http://schema.org/url': {
									'@id': 'https://9takes.com/blog/enneagram/enneagram-types-in-stress'
								}
							},
							{
								'@type': 'http://schema.org/WebPage',
								'http://schema.org/name': 'Analysis of famous people',
								'http://schema.org/url': {
									'@id': '/blog/famous-enneagram-types'
								}
							}
						],
						'http://schema.org/name': 'Situational Topics'
					}
				],
				'http://schema.org/name': 'Enneagram Blog',
				'http://schema.org/url': {
					'@id': 'https://9takes.com/blog/'
				}
			},
			{
				'@type': 'http://schema.org/WebPage',
				'http://schema.org/name': 'About',
				'http://schema.org/url': {
					'@id': 'https://9takes.com/about'
				}
			}
		]
	};
	let jsonld = JSON.stringify(jsonldString);
</script>

<!-- <svelte:head>
	{@html `<script type="application/ld+json">${jsonld}</script>`}
</svelte:head> -->

<svelte:window bind:innerWidth />

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
			<a href="/" class="brand left">
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
					title={!data?.session?.user?.id ? 'Not available yet' : ''}
					href={!data?.session?.user?.id ? '#' : '/questions'}
					class="a-wrap {!data?.session?.user?.id && 'disabled'}"
				>
					<div
						class="nav-text nav-element {data?.session?.user?.id
							? 'nav-element1'
							: ''} {$page.url.pathname.startsWith('/questions') && data?.session?.user?.id
							? 'active-link'
							: ''}"
						style=""
					>
						QUESTIONS
					</div>
					{#if data?.session?.user?.id}
						<div
							class="nav-element nav-element2  {$page.url.pathname.startsWith('/questions') &&
							data?.session?.user?.id
								? 'active-link'
								: ''}"
							style=""
						>
							QUESTIONS
						</div>
					{/if}
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
						class="nav-element nav-element2 {$page.url.pathname === '/about' ? 'active-link' : ''}"
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
				<!-- not yet ready to allow registration and login
				{:else}
				<div class=" right login">
					<button
						type="button"
						on:click={() => {
							goto('/login');
						}}
						class="corner-icon"
					>
						Login/ Register
					</button>
				</div> -->
			{/if}
			<!-- </div> -->
		</nav>
	{/if}
	<!-- </Context> -->
</header>

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
				// color: black; // #eee;
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
			color: black;
			// background-color: rgb(240, 248, 255, 0.6);

			a {
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
			color: white;
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
			background-color: white;
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
			background: white;
			position: absolute;
			z-index: 2314;
		}

		.navbar-brand {
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
			// background-color: #e8edf1;

			z-index: 1200;
		}
		.navbar-brand-mobile {
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
			// background-color: #e8edf1;
			border-radius: 5px;
			border: var(--classic-border);

			z-index: 1200;
		}

		.brand-title {
			margin: 0;
			text-align: center;
			flex: 1;
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
		.corner-left {
			margin: 1rem;
			// position: absolute;
			// left: 0;
			// top: 0;
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

		ul {
			position: relative;
			padding: 0;
			margin: 0;
			height: 3em;
			display: flex;
			justify-content: center;
			align-items: center;
			list-style: none;
			background: var(--background);
			background-size: contain;
		}

		li {
			position: relative;
			height: 100%;
		}

		li[aria-current='page']::before {
			--size: 6px;
			content: '';
			width: 0;
			height: 0;
			position: absolute;
			top: 0;
			left: calc(50% - var(--size));
			border: var(--size) solid transparent;
			border-top: var(--size) solid var(--color-theme-dark-blue);
		}

		a:hover {
			color: var(--color-theme-dark-blue);
		}
		svg {
			fill: black; /* set the initial color of the SVG */
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
</style>

<script lang="ts">
	import account from '$lib/images/account-circle.svg';
	import hamburger from '$lib/images/hamburger.svg';
	import { onMount } from 'svelte';

	import type { PageData } from '../../../routes/$types';
	import NavbarLinks from './NavbarLinks.svelte';
	import { afterUpdate } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
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

	const handleClickOutside = (event) => {
		const navbar = document.querySelector('.mobile-ham');
		if (navbar && !navbar.contains(event.target)) {
			isOpen = false;
		}
	};
	const toggleNavbar = () => {
		isOpen = !isOpen;
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

<svelte:head>
	{@html `<script type="application/ld+json">${jsonld}</script>`}
</svelte:head>

<svelte:window bind:innerWidth />

<header>
	{#if innerWidth < 760}
		<div class="mobile-ham {$page.url.pathname === '/' && 'absolute-pos'}">
			<div class="corner-left">
				<button type="button" on:click={toggleNavbar} class="corner-icon">
					<img src={hamburger} alt="hamburger menu" />
				</button>
				{#if isOpen}
					<nav class="navbar mobile-navbar">
						<div class="navbar-brand-mobile">
							<NavbarLinks mobile={innerWidth < 760} />
						</div>
					</nav>
				{/if}
			</div>
			{#if $page.url.pathname !== '/'}
				<div style="position: absolute; left: 0; right: 0; margin: 0 auto; text-align: center;">
					<h3>9takes</h3>
				</div>
			{/if}

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
			{/if}
		</div>
	{:else}
		<nav class="{innerWidth < 760 && 'big-navbar'} {$page.url.pathname === '/' && 'absolute-pos'}">
			<div class="navbar-brand">
				<div>
					<NavbarLinks mobile={innerWidth < 760} />
				</div>
				{#if data?.session?.user}
					<div class="corner-right-big">
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
				{/if}
			</div>
		</nav>
	{/if}
	<!-- </Context> -->
</header>

<style lang="scss">
	.absolute-pos {
		position: absolute;
		left: 0;
		right: 0;
		margin: 0 auto;
		text-align: center;
	}
	.corner-icon {
		background: no-repeat;
		border-radius: 5px;
		border: 1px solid var(--color-theme-purple);
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
		border: 1px solid var(--color-theme-purple);

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
	header {
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
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		// display: flex;
		// height: 100%;
		// align-items: center;
		// padding: 0 0.5rem;
		// color: var(--color-text);
		// font-weight: 700;
		// font-size: 0.8rem;
		// text-transform: uppercase;
		// letter-spacing: 0.1em;
		// text-decoration: none;
		// transition: color 0.2s linear;
	}

	a:hover {
		color: pink; //var(--color-theme-1);
	}
	svg {
		fill: black; /* set the initial color of the SVG */
		transition: fill 0.2s ease-in-out; /* add a transition effect */
	}

	img:hover svg {
		fill: pink; //var(--color-theme-1); /* change the color of the SVG on hover */
	}
	img:hover {
		color: pink; //var(--color-theme-1); /* change the color of the SVG on hover */
	}
	svg path {
		transition: fill 0.2s ease-in-out; /* add a transition effect */
	}

	svg:hover path {
		fill: red; /* change the color of the SVG on hover */
	}
</style>
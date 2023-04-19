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
</script>

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

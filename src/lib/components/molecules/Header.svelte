<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';

	import account from '$lib/images/account-circle.svg';
	import { supabase } from '$lib/supabase';

	import { invalidateAll } from '$app/navigation';
	import type { PageData } from '../../../routes/$types';
	import { onMount } from 'svelte';
	export let data: PageData;
</script>

{#if data?.session?.user}
	<header>
		<nav class="navbar">
			<div class="navbar-brand">
				<!-- {#if data && data?.session && $page.url.pathname !== '/'}
					<h1 class="brand-title">9takes</h1>
				{/if} -->
				<div class="corner">
					<a href="/account">
						<img src={account} alt="Account" />
					</a>
				</div>
			</div>
		</nav>
	</header>
{/if}

<style lang="scss">
	.navbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.navbar-brand {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.brand-title {
		margin: 0;
		text-align: center;
		flex: 1;
	}

	.corner {
		margin: 1rem;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 13;
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
		--background: rgba(255, 255, 255, 0.7);
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

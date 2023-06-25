<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from '../../../routes/$types';

	import { page } from '$app/stores';

	export let data: PageData;

	let active = false;

	onMount(() => {});
</script>

<div style="position: relative; z-index: 11;">
	{#if !active}
		<button
			class="hamburger menu-trigger"
			aria-label="Toggle navigation"
			on:click={() => {
				active = !active;
			}}
		>
			<i class="menu-trigger-bar top" />
			<i class="menu-trigger-bar middle" />
			<i class="menu-trigger-bar bottom" />
			<!-- </span> -->
		</button>
	{:else}
		<button
			class="hamburger close-trigger "
			aria-label="Toggle navigation"
			on:click={() => {
				console.log(active);
				active = !active;
			}}
		>
			<i class="close-trigger-bar left" />
			<i class="close-trigger-bar right" />

			<!-- </span> -->
		</button>
	{/if}
	<nav class="mobile-nav {active ? 'active' : ''}">
		<ul class="menu">
			<li><a href="/" class={$page.url.pathname === '/' ? 'active-link' : ''}>Home</a></li>
			<li>
				<a
					href={data?.session?.user.id ? '/questions' : ''}
					class="{$page.url.pathname.startsWith('/questions') ? 'active-link' : ''} {!data?.session
						?.user && 'disabled'}">Questions</a
				>
			</li>
			<li><a href="/blog" class={$page.url.pathname === '/blog' ? 'active-link' : ''}>Blog</a></li>
			<li>
				<a href="/about" class={$page.url.pathname === '/about' ? 'active-link' : ''}>About</a>
			</li>
		</ul>
	</nav>
</div>

<style lang="scss">
	$hover: all 0.2s ease-in;
	$slide: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
	$slide-delay: all 0.4s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
	$slide-slow: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);

	@mixin css3-prefix($property, $value) {
		-webkit-#{$property}: #{$value};
		-khtml-#{$property}: #{$value};
		-moz-#{$property}: #{$value};
		-ms-#{$property}: #{$value};
		-o-#{$property}: #{$value};
		#{$property}: #{$value};
	}
	// TRANSFORM
	@mixin transform($params) {
		@include css3-prefix('transform', $params);
	}
	/* Add your CSS styles here */
	.hamburger {
		margin: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 50px;
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: transform 0.3s ease;
	}

	.hamburger-line {
		width: 24px;
		height: 2px;
		background-color: #000;
		margin-bottom: 4px;
		transition: background-color 0.3s ease;
	}

	.mobile-nav {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		width: fit-content;
		background-color: #fff;
		padding: 20px;
		border: 1px solid black;
		border-radius: 5px;
	}

	.menu {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.menu li {
		margin-bottom: 10px;
	}

	.menu a {
		// text-decoration: none;
		// color: #000;
		font-size: 16px;
		line-height: 1.5;
	}

	/* .hamburger.active .hamburger-line {
  background-color: #fff;
} */

	.mobile-nav.active {
		display: -webkit-box;
	}

	.menu-trigger-bar {
		display: block;
		width: 100%;
		height: 4px;
		background-color: black;
		margin-bottom: 6px;
		transform: rotate(-45deg);
		position: relative;
		transition: $slide;

		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			width: 0%;
			height: 100%;
			background-color: black;
			transition: $slide;
		}

		&.top {
			width: 50%;
			align-self: flex-start;
		}
		&.middle {
			// &:before {
			// left: auto;
			// right: 0;
			align-self: center;
			// }
		}
		&.bottom {
			width: 50%;
			// margin-left: 50%;
			align-self: flex-end;
		}
	}

	.menu-trigger,
	.close-trigger {
		// position: absolute;
		// top: 32px;
		// right: 20px;
		// display: block;
		width: 42px;
		height: 42px;
		cursor: pointer;
		z-index: 333;

		&:hover {
			.menu-trigger-bar {
				&:before {
					width: 100%;
				}
			}

			.close-trigger-bar {
				&:before {
					width: 100%;
				}
			}
		}
	}

	.close-trigger-bar {
		display: block;
		width: 100%;
		height: 4px;
		background-color: grey;
		position: relative;
		transition: $slide;

		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			width: 0%;
			height: 100%;
			background-color: black;
			transition: $slide;
		}

		&.left {
			transform: rotate(-45deg);
		}
		&.right {
			transform: rotate(45deg);
			top: -3px;
		}
	}
</style>

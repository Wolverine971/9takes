<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { fade } from 'svelte/transition';

	// Reactive variables
	let innerWidth = 0;
	let isScrolling = false;
	let scrollY = 0;
	let scrollTimeout: ReturnType<typeof setTimeout>;

	// Handle scroll events for styling
	function handleScroll() {
		scrollY = window.scrollY;

		// Set scrolling state with debounce
		isScrolling = true;
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			isScrolling = false;
		}, 150);
	}

	// Handle resize events
	function handleResize() {
		innerWidth = window.innerWidth;
	}

	// Set up event listeners
	onMount(() => {
		if (browser) {
			innerWidth = window.innerWidth;
			window.addEventListener('scroll', handleScroll, { passive: true });
			window.addEventListener('resize', handleResize, { passive: true });
		}

		// Clean up event listeners
		return () => {
			if (browser) {
				window.removeEventListener('scroll', handleScroll);
				window.removeEventListener('resize', handleResize);
				clearTimeout(scrollTimeout);
			}
		};
	});

	// Calculate dynamic margin for home page
	$: homePageTopMargin = innerWidth > 760 && $page.url.pathname === '/' ? '85px' : '0';
</script>

<main
	class="main-container"
	class:scrolling={isScrolling}
	style={$page.url.pathname === '/' ? `margin-top: ${homePageTopMargin};` : ''}
	transition:fade={{ duration: 150 }}
>
	<div class="content-wrapper">
		<slot />
	</div>
</main>

<style lang="scss">
	.main-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
		max-width: 100%;
		transition: margin-top 0.3s ease;
		position: relative;

		&.scrolling {
			scroll-behavior: smooth;
		}
	}

	:global(a) {
		color: var(--primary-dark, #4f46e5);
		text-decoration: none;
		transition: color 0.2s ease;

		&:hover {
			text-decoration: underline;
		}
	}

	:global(main > a) {
		display: inline-flex;
		align-items: center;
		color: var(--primary-dark, #4f46e5);
		font-weight: 500;

		&::after {
			content: '';
			background-image: url(/icons/arrow.svg);
			display: inline-block;
			vertical-align: middle;
			align-items: center;
			width: 1em;
			height: 1em;
			background-size: 1em 1em;
			margin-left: 0.25rem;
			transition: transform 0.2s ease;
		}

		&:hover::after {
			transform: translateX(2px);
		}
	}
</style>

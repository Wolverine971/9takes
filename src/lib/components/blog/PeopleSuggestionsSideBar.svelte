<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let links: string[];

	let visible = false;
	let windowWidth: number;

	onMount(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const pageHeight = document.documentElement.scrollHeight;
			const windowHeight = window.innerHeight;
			const distanceFromBottom = pageHeight - (scrollPosition + windowHeight);

			visible = scrollPosition > 1200 && distanceFromBottom > 1500;
		};

		const handleResize = () => {
			windowWidth = window.innerWidth;
			handleScroll(); // Recalculate visibility on resize
		};

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleResize);
		handleResize(); // Initial call to set windowWidth and check visibility

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
		};
	});

	$: sidebarLeft = Math.max((windowWidth - 64 * 16) / 2 - 200, 20); // 64rem = 64 * 16px, 200px is sidebar width
</script>

{#if visible}
	<div
		class="fixed top-1/2 w-48 -translate-y-1/2 transform rounded-lg bg-white p-4 shadow-lg"
		style="left: {sidebarLeft}px;"
		transition:fly={{ x: -100, duration: 300 }}
	>
		<nav>
			<h3 style="margin: 0; padding: 0; font-size: 1.2rem;">More Personalities</h3>
			<ul class="space-y-2">
				{#each links as link}
					<li>
						<a
							href={`/personality-analysis/${link.split(' ').join('-')}`}
							class="text-primary-600 transition-colors duration-200 hover:text-primary-800"
						>
							{`${link}`}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
{/if}

<style lang="scss">
	/* You can add any additional styles here */

	li::marker {
		// display: none;
		// content: '';
	}
	a::after {
		content: none;
	}
	ul {
		// list-style-type: none;
		margin: 0;
		// padding: 0;
	}
</style>

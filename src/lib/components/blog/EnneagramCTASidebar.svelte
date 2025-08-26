<!-- src/lib/components/blog/EnneagramCTASidebar.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { notifications } from '../molecules/notifications';

	let visible = false;
	let email = '';
	let windowWidth: number;

	function handleSubmit() {
		// Here you would typically send the email to your server or API
		console.log('Submitted email:', email);
		// Reset the email field after submission
		email = '';
		// You might want to show a success message or hide the sidebar here
		notifications.info('Nice! Check your inbox', 3000);
	}

	onMount(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const pageHeight = document.documentElement.scrollHeight;
			const windowHeight = window.innerHeight;
			const distanceFromBottom = pageHeight - (scrollPosition + windowHeight);

			visible = scrollPosition > 1500 && distanceFromBottom > 1500;
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

	$: sidebarRight = Math.max((windowWidth - 64 * 16) / 2 - 220, 20); // 64rem = 64 * 16px, 220px is sidebar width
</script>

{#if visible}
	<div
		class="fixed top-1/2 w-56 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg"
		style="right: {sidebarRight}px;"
		transition:fly={{ x: 100, duration: 300 }}
	>
		<h3 class="mb-4 text-center text-lg font-semibold">Sign up for a free guide</h3>
		<p class="mb-4 text-center text-sm">Learn your enneagram type in 5 steps</p>
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<input
					type="email"
					bind:value={email}
					placeholder="Enter your email"
					required
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
				/>
			</div>
			<button
				type="submit"
				class="w-full rounded-md bg-primary-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-primary-700"
			>
				Get Free Guide
			</button>
		</form>
	</div>
{/if}

<style>
	/* You can add any additional styles here */
</style>

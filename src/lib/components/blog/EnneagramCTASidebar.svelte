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
		class="cta-sidebar"
		style="right: {sidebarRight}px;"
		transition:fly={{ x: 100, duration: 300 }}
	>
		<h3 class="sidebar-title">Sign up for a free guide</h3>
		<p class="sidebar-copy">Learn your enneagram type in 5 steps</p>
		<form on:submit|preventDefault={handleSubmit} class="sidebar-form">
			<div>
				<input
					type="email"
					bind:value={email}
					placeholder="Enter your email"
					required
					class="sidebar-input"
				/>
			</div>
			<button type="submit" class="sidebar-button">Get Free Guide</button>
		</form>
	</div>
{/if}

<style>
	.cta-sidebar {
		position: fixed;
		top: 50%;
		width: 14rem;
		transform: translateY(-50%);
		padding: 1.35rem;
		border-radius: 1.15rem;
		border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border-color));
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-soft) 30%, transparent) 0%,
				transparent 45%
			),
			color-mix(in srgb, var(--bg-surface) 94%, var(--bg-base));
		box-shadow: var(--shadow-lg);
		backdrop-filter: blur(14px);
	}

	.cta-sidebar::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--primary-subtle) 52%, transparent),
			transparent 55%
		);
		pointer-events: none;
	}

	.sidebar-title,
	.sidebar-copy {
		position: relative;
		z-index: 1;
		text-align: center;
	}

	.sidebar-title {
		margin: 0 0 0.6rem;
		font-size: 1.05rem;
		font-weight: 700;
		line-height: 1.35;
		color: var(--text-primary);
	}

	.sidebar-copy {
		margin: 0 0 1rem;
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.sidebar-form {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.75rem;
	}

	.sidebar-input {
		width: 100%;
		padding: 0.8rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border-color));
		border-radius: 0.9rem;
		background: color-mix(in srgb, var(--bg-surface) 90%, var(--bg-base));
		color: var(--text-primary);
		font-size: 0.92rem;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background-color 0.2s ease;
	}

	.sidebar-input::placeholder {
		color: var(--text-tertiary);
	}

	.sidebar-input:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: var(--glow-sm);
		background: var(--bg-surface);
	}

	.sidebar-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 0.85rem 1rem;
		border: none;
		border-radius: 0.9rem;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
		color: var(--text-on-primary);
		font-size: 0.92rem;
		font-weight: 700;
		cursor: pointer;
		box-shadow: var(--glow-sm);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			filter 0.2s ease;
	}

	.sidebar-button:hover {
		transform: translateY(-1px);
		box-shadow: var(--glow-md);
		filter: saturate(1.05);
	}
</style>

<script>
	import { page } from '$app/stores';
	import EnneagramDiagram from './EnneagramDiagram.svelte';

	// Get current type number from URL if available
	$: currentType = $page.params.slug ? parseInt($page.params.slug.split('-').pop()) || null : null;

	// Enneagram type data for the type selector
	const enneagramTypes = [
		{ number: 1, name: 'The Reformer', url: '/enneagram-corner/enneagram-type-1' },
		{ number: 2, name: 'The Helper', url: '/enneagram-corner/enneagram-type-2' },
		{ number: 3, name: 'The Achiever', url: '/enneagram-corner/enneagram-type-3' },
		{ number: 4, name: 'The Individualist', url: '/enneagram-corner/enneagram-type-4' },
		{ number: 5, name: 'The Investigator', url: '/enneagram-corner/enneagram-type-5' },
		{ number: 6, name: 'The Loyalist', url: '/enneagram-corner/enneagram-type-6' },
		{ number: 7, name: 'The Enthusiast', url: '/enneagram-corner/enneagram-type-7' },
		{ number: 8, name: 'The Challenger', url: '/enneagram-corner/enneagram-type-8' },
		{ number: 9, name: 'The Peacemaker', url: '/enneagram-corner/enneagram-type-9' }
	];
</script>

<div
	class="animate-fade-in mx-auto my-12 max-w-7xl overflow-hidden rounded-xl bg-neutral-50 shadow-lg"
>
	<!-- Top section: Psychology CTA -->
	<div
		class="bg-gradient-to-br from-primary-700 to-primary-900 px-4 py-6 text-white md:px-8 md:py-8"
	>
		<div class="mx-auto flex max-w-5xl flex-col items-center md:flex-row md:gap-6">
			<!-- Icon -->
			<div
				class="mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white/15 md:mb-0 md:h-20 md:w-20"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-8 w-8 md:h-10 md:w-10"
				>
					<path
						d="M12 2a8 8 0 0 0-8 8c0 2.2.9 4.2 2.3 5.6L12 21l5.7-5.4A7.9 7.9 0 0 0 20 10a8 8 0 0 0-8-8z"
					></path>
					<circle cx="12" cy="10" r="2"></circle>
				</svg>
			</div>

			<!-- Text -->
			<div class="mb-6 flex-1 text-center md:mb-0 md:text-left">
				<h3 class="mb-2 text-xl font-bold md:text-2xl">Want to explore your own psychology?</h3>
				<p class="text-base opacity-90 md:text-lg">
					Understanding your Enneagram type can help you break bad patterns and give you an edge in
					the world.
				</p>
			</div>

			<!-- Button -->
			<a href="/book-session" class="primary-button">
				Talk to an Enneagram Coach
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="ml-2 h-5 w-5"
				>
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
			</a>
		</div>
	</div>

	<!-- Bottom section: Type explorer -->
	<div class="bg-white px-4 py-8 md:px-8 md:py-10">
		<h3 class="mb-3 text-center text-xl font-bold text-neutral-900 md:text-2xl">
			Explore Other Enneagram Types
		</h3>
		<p class="mx-auto mb-8 max-w-3xl text-center text-neutral-600">
			Curious about how different types think and behave? Discover the unique perspectives of all
			nine Enneagram types:
		</p>

		<div class="mx-auto max-w-5xl">
			<EnneagramDiagram />
		</div>

		<!-- Mobile alternate type list (shows on small screens) -->
		<!-- <div class="mt-8 grid grid-cols-3 gap-3 md:hidden">
			{#each enneagramTypes as type}
				<a
					href={type.url}
					class="flex flex-col items-center rounded-lg p-3 transition duration-200 {currentType ===
					type.number
						? 'border border-primary-300 bg-primary-100'
						: 'bg-neutral-50 hover:-translate-y-1 hover:bg-primary-50'}"
				>
					<div
						class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-700 text-lg font-bold text-white"
					>
						{type.number}
					</div>
					<div class="text-center text-xs font-medium text-neutral-800">
						{type.name}
					</div>
				</a>
			{/each}
		</div> -->
	</div>
</div>

<style lang="scss">
	/* Animation for fade in */
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.5s ease-out;
	}

	/* Reset any link styles */
	a {
		text-decoration: none;
	}

	a::after {
		content: none !important;
	}

	.primary-button {
		display: inline-flex;
		align-items: center;
		background-color: white;
		color: var(--primary-dark);
		padding: 0.75rem 1.5rem;
		border-radius: var(--border-radius);
		font-weight: 600;
		text-decoration: none;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
		}

		svg.icon-right {
			width: 18px;
			height: 18px;
			margin-left: 0.5rem;
		}

		@media (min-width: 768px) {
			align-self: center;
		}
	}
</style>

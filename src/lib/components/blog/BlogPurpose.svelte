<!-- src/lib/components/blog/BlogPurpose.svelte -->
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

<div class="animate-fade-in mx-auto my-16 max-w-7xl overflow-hidden rounded-2xl shadow-2xl">
	<!-- Top section: Psychology CTA -->
	<div class="cta-section px-6 py-10 md:px-12 md:py-14">
		<div class="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row">
			<!-- Icon -->
			<div class="icon-container flex-shrink-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-10 w-10 md:h-11 md:w-11"
				>
					<path
						d="M12 2a8 8 0 0 0-8 8c0 2.2.9 4.2 2.3 5.6L12 21l5.7-5.4A7.9 7.9 0 0 0 20 10a8 8 0 0 0-8-8z"
					></path>
					<circle cx="12" cy="10" r="2"></circle>
				</svg>
			</div>

			<!-- Text -->
			<div class="flex-1 text-center md:text-left">
				<h3 class="mb-3 text-2xl font-semibold tracking-tight md:text-3xl">
					Want to explore your own psychology?
				</h3>
				<p class="text-lg leading-relaxed opacity-95 md:text-xl">
					Understanding your Enneagram type can help you break bad patterns and give you an edge in
					the world.
				</p>
			</div>

			<!-- Button -->
			<a href="/book-session" class="cta-button">
				<span>Talk to an Enneagram Coach</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="arrow-icon"
				>
					<line x1="5" y1="12" x2="19" y2="12"></line>
					<polyline points="12 5 19 12 12 19"></polyline>
				</svg>
			</a>
		</div>
	</div>

	<!-- Divider -->
	<div class="divider"></div>

	<!-- Bottom section: Type explorer -->
	<div class="explorer-section px-6 py-12 md:px-12 md:py-16">
		<h3 class="mb-4 text-center text-2xl font-semibold tracking-tight md:text-3xl">
			Explore Other Enneagram Types
		</h3>
		<p class="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed">
			Curious about how different types think and behave? Discover the unique perspectives of all
			nine Enneagram types:
		</p>

		<div class="mx-auto max-w-5xl">
			<EnneagramDiagram />
		</div>
	</div>
</div>

<style lang="scss">
	/* Animation for fade in */
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Reset any link styles */
	a {
		text-decoration: none;
	}

	a::after {
		content: none !important;
	}

	/* CTA Section - Using subtle gradient with better contrast */
	.cta-section {
		background: linear-gradient(135deg, #6c5ce7 0%, #5a4dd6 50%, #4834d4 100%);
		color: #ffffff;
		position: relative;
		overflow: hidden;

		/* Subtle pattern overlay */
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: radial-gradient(circle at 20% 50%, rgba(162, 155, 254, 0.15) 0%, transparent 50%);
			pointer-events: none;
		}
	}

	/* Icon Container */
	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(12px);
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.25);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

		svg {
			color: #ffffff;
			filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
		}

		@media (min-width: 768px) {
			width: 80px;
			height: 80px;
		}
	}

	/* CTA Button - Apple-inspired design */
	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background-color: #ffffff;
		color: #4834d4;
		padding: 14px 28px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 16px;
		text-decoration: none;
		white-space: nowrap;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.1),
			0 4px 12px rgba(0, 0, 0, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(108, 92, 231, 0.1);

		/* Shine effect on hover */
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: -100%;
			width: 100%;
			height: 100%;
			background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
			transition: left 0.5s ease;
		}

		&:hover {
			transform: translateY(-2px) scale(1.02);
			box-shadow:
				0 2px 8px rgba(0, 0, 0, 0.12),
				0 8px 24px rgba(0, 0, 0, 0.15),
				inset 0 1px 0 rgba(255, 255, 255, 0.9);
			color: #382bb3;

			&::before {
				left: 100%;
			}

			.arrow-icon {
				transform: translateX(4px);
			}
		}

		&:active {
			transform: translateY(0) scale(0.98);
			box-shadow:
				0 1px 3px rgba(0, 0, 0, 0.12),
				inset 0 1px 2px rgba(0, 0, 0, 0.1);
		}

		.arrow-icon {
			width: 20px;
			height: 20px;
			transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		}

		@media (min-width: 768px) {
			align-self: center;
		}
	}

	/* Divider with subtle gradient */
	.divider {
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(108, 92, 231, 0.15) 20%,
			rgba(108, 92, 231, 0.15) 80%,
			transparent 100%
		);
		box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
	}

	/* Explorer Section */
	.explorer-section {
		background: linear-gradient(to bottom, #ffffff 0%, #f9f9ff 100%);
		color: #2d3436;

		h3 {
			color: #2a2d34;
			font-weight: 600;
		}

		p {
			color: #65676b;
		}
	}

	/* Mobile refinements */
	@media (max-width: 768px) {
		.icon-container {
			margin-bottom: 0;
		}

		.cta-button {
			width: 100%;
			justify-content: center;
			padding: 16px 24px;
		}
	}
</style>

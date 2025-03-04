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

<div class="cta-container">
	<!-- Top section: Psychology CTA -->
	<div class="psychology-cta">
		<div class="content-wrapper">
			<div class="icon-wrapper">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M12 2a8 8 0 0 0-8 8c0 2.2.9 4.2 2.3 5.6L12 21l5.7-5.4A7.9 7.9 0 0 0 20 10a8 8 0 0 0-8-8z"
					></path>
					<circle cx="12" cy="10" r="2"></circle>
				</svg>
			</div>
			<div class="text-wrapper">
				<h3>Want to explore your own psychology?</h3>
				<p>
					Understanding your Enneagram type can help you break bad patterns and give you an edge in
					the world.
				</p>
			</div>
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
					class="icon-right"
					><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"
					></polyline></svg
				>
			</a>
		</div>
	</div>

	<!-- Bottom section: Type explorer -->
	<div class="types-explorer">
		<h3>Explore Other Enneagram Types</h3>
		<p>
			Curious about how different types think and behave? Discover the unique perspectives of all
			nine Enneagram types:
		</p>

		<div class="types-grid">
			<EnneagramDiagram />
			<!-- {#each enneagramTypes as type}
				<a href={type.url} class="type-card" class:active={currentType === type.number}>
					<div class="type-number">{type.number}</div>
					<div class="type-name">{type.name}</div>
				</a>
			{/each} -->
		</div>
	</div>
</div>

<style lang="scss">
	.cta-container {
		margin: 3rem 0;
		border-radius: var(--border-radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		background-color: var(--off-white);
	}

	.psychology-cta {
		background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
		padding: 1rem;
		color: white;

		// a::after {
		// 	content: none;
		// }

		.content-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			max-width: 800px;
			margin: 0 auto;

			@media (min-width: 768px) {
				flex-direction: row;
				text-align: left;
				gap: 1.5rem;
			}
		}

		.icon-wrapper {
			flex-shrink: 0;
			background-color: rgba(255, 255, 255, 0.15);
			border-radius: 50%;
			width: 80px;
			height: 80px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 1rem;

			@media (min-width: 768px) {
				margin-bottom: 0;
			}

			svg {
				width: 40px;
				height: 40px;
				color: white;
			}
		}

		.text-wrapper {
			flex: 1;
			margin-bottom: 1.5rem;

			@media (min-width: 768px) {
				margin-bottom: 0;
			}

			h3 {
				font-size: 1.5rem;
				margin: 0 0 0.75rem 0;
				color: white;
			}

			p {
				margin: 0;
				opacity: 0.9;
				font-size: 1.1rem;
				line-height: 1.5;
			}
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
	}

	.types-explorer {
		padding: 2rem;
		background-color: white;

		h3 {
			font-size: 1.5rem;
			margin: 0 0 0.75rem 0;
			color: var(--darkest-gray);
			text-align: center;
		}

		p {
			text-align: center;
			color: var(--text-secondary);
			max-width: 800px;
			margin: 0 auto 1.5rem auto;
		}

		.types-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 1rem;
			margin-top: 1.5rem;

			// a::after {
			// 	content: none;
			// }
		}

		.type-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 1.25rem 1rem;
			border-radius: var(--border-radius);
			background-color: var(--lightest-gray);
			text-decoration: none;
			transition: all 0.2s ease;
			border: 2px solid transparent;

			&:hover {
				transform: translateY(-3px);
				background-color: var(--accent-light);
				border-color: var(--accent);
			}

			&.active {
				background-color: var(--accent-light);
				border-color: var(--primary);
			}

			.type-number {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				background-color: var(--primary);
				color: white;
				font-weight: bold;
				font-size: 1.25rem;
				margin-bottom: 0.75rem;
			}

			.type-name {
				color: var(--darkest-gray);
				font-weight: 500;
				text-align: center;
			}
		}
	}

	/* Animation for pattern break */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.cta-container {
		animation: fadeIn 0.5s ease-out;
	}
	a::after {
		content: none !important;
	}
</style>

<!-- src/lib/components/blog/BlogPurpose.svelte -->
<script>
	import EnneagramDiagram from './EnneagramDiagram.svelte';
</script>

<div class="blog-purpose">
	<!-- Top section: Psychology CTA -->
	<div class="cta-section">
		<div class="cta-content">
			<!-- Icon -->
			<div class="icon-container">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="cta-icon"
				>
					<path
						d="M12 2a8 8 0 0 0-8 8c0 2.2.9 4.2 2.3 5.6L12 21l5.7-5.4A7.9 7.9 0 0 0 20 10a8 8 0 0 0-8-8z"
					></path>
					<circle cx="12" cy="10" r="2"></circle>
				</svg>
			</div>

			<!-- Text -->
			<div class="cta-text">
				<h3>Want to explore your own psychology?</h3>
				<p>
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

	<!-- Bottom section: Type explorer -->
	<div class="explorer-section">
		<h3>Explore Other Enneagram Types</h3>
		<p>
			Curious about how different types think and behave? Discover the unique perspectives of all
			nine Enneagram types:
		</p>

		<div class="diagram-container">
			<EnneagramDiagram />
		</div>
	</div>
</div>

<style lang="scss">
	/* Main container */
	.blog-purpose {
		max-width: 1200px;
		margin: 2.5rem auto;
		border-radius: 16px;
		overflow: hidden;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1);

		a::after {
			content: none !important;
			display: none !important;
		}
	}

	/* CTA Section - High contrast purple with white text */
	.cta-section {
		background: linear-gradient(135deg, #5b4cdb 0%, #4a3cc9 100%);
		padding: 2rem 1.5rem;

		@media (min-width: 768px) {
			padding: 2.5rem 3rem;
		}
	}

	.cta-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		max-width: 1000px;
		margin: 0 auto;

		@media (min-width: 768px) {
			flex-direction: row;
			gap: 2rem;
		}
	}

	/* Icon Container */
	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 16px;
		flex-shrink: 0;

		@media (min-width: 768px) {
			width: 72px;
			height: 72px;
		}
	}

	.cta-icon {
		width: 32px;
		height: 32px;
		color: #fff;

		@media (min-width: 768px) {
			width: 36px;
			height: 36px;
		}
	}

	/* CTA Text - High contrast white on purple */
	.cta-text {
		flex: 1;
		text-align: center;

		@media (min-width: 768px) {
			text-align: left;
		}

		h3 {
			color: #fff;
			font-size: 1.375rem;
			font-weight: 700;
			line-height: 1.3;
			margin: 0 0 0.5rem;

			@media (min-width: 768px) {
				font-size: 1.5rem;
			}
		}

		p {
			color: rgba(255, 255, 255, 0.95);
			font-size: 1rem;
			line-height: 1.6;
			margin: 0;

			@media (min-width: 768px) {
				font-size: 1.0625rem;
			}
		}
	}

	/* CTA Button - High contrast */
	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: #fff;
		color: #4a3cc9;
		padding: 0.875rem 1.5rem;
		border-radius: 10px;
		font-weight: 600;
		font-size: 0.9375rem;
		text-decoration: none;
		white-space: nowrap;
		transition: all 0.2s ease;
		flex-shrink: 0;

		&:hover {
			background: #f5f3ff;
			color: #3d32a8;
			transform: translateY(-1px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}

		&:active {
			transform: translateY(0);
		}

		.arrow-icon {
			width: 18px;
			height: 18px;
			transition: transform 0.2s ease;
		}

		&:hover .arrow-icon {
			transform: translateX(3px);
		}

		@media (max-width: 767px) {
			width: 100%;
			justify-content: center;
		}
	}

	/* Explorer Section - High contrast dark text on light bg */
	.explorer-section {
		background: var(--card-background, #fff);
		padding: 2rem 1.5rem;

		@media (min-width: 768px) {
			padding: 2.5rem 3rem;
		}

		h3 {
			color: var(--text-primary, #1a1a1a);
			font-size: 1.375rem;
			font-weight: 700;
			text-align: center;
			margin: 0 0 0.75rem;

			@media (min-width: 768px) {
				font-size: 1.5rem;
			}
		}

		p {
			color: var(--text-secondary, #4a4a4a);
			font-size: 1rem;
			line-height: 1.6;
			text-align: center;
			max-width: 700px;
			margin: 0 auto 2rem;

			@media (min-width: 768px) {
				font-size: 1.0625rem;
			}
		}
	}

	.diagram-container {
		max-width: 900px;
		margin: 0 auto;
	}
</style>

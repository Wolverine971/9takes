<!-- src/lib/components/blog/BlogPurpose.svelte -->
<script>
	import EnneagramDiagram from './EnneagramDiagram.svelte';
</script>

<div class="blog-purpose">
	<!-- CTA Section -->
	<div class="cta-section">
		<div class="cta-bg-pattern"></div>
		<div class="cta-content">
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

			<div class="cta-text">
				<h3>Want to explore your own psychology?</h3>
				<p>Understanding your Enneagram type can help you break bad patterns.</p>
			</div>

			<a href="/book-session" class="cta-button">
				<span>Talk to a Coach</span>
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

	<!-- Explorer Section -->
	<div class="explorer-section">
		<h3>Explore the 9 Enneagram Types</h3>
		<div class="diagram-container">
			<EnneagramDiagram />
		</div>
	</div>
</div>

<style lang="scss">
	.blog-purpose {
		max-width: 1200px;
		margin: 2rem auto;
		border-radius: 16px;
		overflow: hidden;
		box-shadow:
			0 8px 30px -10px rgba(91, 76, 219, 0.18),
			0 2px 4px -2px rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(91, 76, 219, 0.1);

		a::after {
			content: none !important;
			display: none !important;
		}

		:global(.dark) & {
			box-shadow:
				0 8px 30px -10px rgba(0, 0, 0, 0.35),
				0 2px 4px -2px rgba(0, 0, 0, 0.15);
			border-color: rgba(255, 255, 255, 0.08);
		}
	}

	.cta-section {
		position: relative;
		background: linear-gradient(135deg, #6b5ce7 0%, #5046c7 50%, #4338b8 100%);
		padding: 1.25rem 1.25rem;
		overflow: hidden;

		@media (min-width: 768px) {
			padding: 1.5rem 2rem;
		}
	}

	.cta-bg-pattern {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 40%);
		pointer-events: none;
	}

	.cta-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		max-width: 1000px;
		margin: 0 auto;

		@media (min-width: 768px) {
			flex-direction: row;
			gap: 1.5rem;
		}
	}

	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(8px);
		border-radius: 12px;
		flex-shrink: 0;
		border: 1px solid rgba(255, 255, 255, 0.2);

		@media (min-width: 768px) {
			width: 56px;
			height: 56px;
		}
	}

	.cta-icon {
		width: 24px;
		height: 24px;
		color: #fff;

		@media (min-width: 768px) {
			width: 28px;
			height: 28px;
		}
	}

	.cta-text {
		flex: 1;
		text-align: center;

		@media (min-width: 768px) {
			text-align: left;
		}

		h3 {
			color: #fff;
			font-size: 1.125rem;
			font-weight: 700;
			line-height: 1.3;
			margin: 0 0 0.25rem;

			@media (min-width: 768px) {
				font-size: 1.25rem;
			}
		}

		p {
			color: rgba(255, 255, 255, 0.9);
			font-size: 0.875rem;
			line-height: 1.5;
			margin: 0;

			@media (min-width: 768px) {
				font-size: 0.9375rem;
			}
		}
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: #fff;
		color: #5046c7;
		padding: 0.625rem 1.25rem;
		border-radius: 8px;
		font-weight: 600;
		font-size: 0.875rem;
		text-decoration: none;
		white-space: nowrap;
		transition: all 0.2s ease;
		flex-shrink: 0;

		&:hover {
			background: #f8f7ff;
			transform: translateY(-1px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
		}

		.arrow-icon {
			width: 16px;
			height: 16px;
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

	.explorer-section {
		background: var(--card-background, #fafafa);
		padding: 1.25rem 1rem 1rem;

		@media (min-width: 768px) {
			padding: 1.5rem 2rem 1.5rem;
		}

		:global(.dark) & {
			background: var(--card-background, #1a1a2e);
		}

		h3 {
			color: var(--text-primary, #1a1a1a);
			font-size: 1rem;
			font-weight: 600;
			text-align: center;
			margin: 0 0 0.75rem;

			@media (min-width: 768px) {
				font-size: 1.125rem;
			}

			:global(.dark) & {
				color: var(--text-primary, #f0f0f0);
			}
		}
	}

	.diagram-container {
		max-width: 800px;
		margin: 0 auto;
	}
</style>

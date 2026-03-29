<!-- src/lib/components/blog/AuthorBio.svelte -->
<script lang="ts">
	export let author: string = 'DJ Wayne';
	export let compact: boolean = false;
</script>

<section class="author-bio" class:compact aria-label="About the author">
	<a href="/about" class="author-photo-link">
		<img
			src="/brand/s-djface.webp"
			alt={`${author}, founder of 9takes`}
			class="author-photo"
			width="72"
			height="72"
			loading="lazy"
		/>
	</a>

	<div class="author-info">
		<div class="author-name-row">
			<h3 class="author-name">
				<a href="/about">{author}</a>
			</h3>
			<span class="author-role">Creator of 9takes</span>
		</div>

		{#if !compact}
			<p class="author-bio-text">
				Former USMC infantry turned personality psychology nerd. I built 9takes to help people see
				the underlying emotions and logic behind every take. One question, 9 ways to see it.
			</p>
		{/if}

		<div class="author-links">
			<a
				href="https://twitter.com/djwayne3"
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`${author} on Twitter`}
				class="social-link"
			>
				<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
					<path
						d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
					/>
				</svg>
			</a>
			<a
				href="https://www.linkedin.com/in/djwayne/"
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`${author} on LinkedIn`}
				class="social-link"
			>
				<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
					<path
						d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
					/>
				</svg>
			</a>
			<a
				href="https://www.instagram.com/djwayne3/"
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`${author} on Instagram`}
				class="social-link"
			>
				<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
					<path
						d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z"
					/>
				</svg>
			</a>
		</div>
	</div>
</section>

<style lang="scss">
	.author-bio {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.25rem;
		margin: 2rem 0;
		background-color: var(--bg-surface, var(--bg-surface));
		border: 1px solid var(--primary-subtle);
		border-radius: 12px;
		max-width: 48rem;

		&.compact {
			padding: 1rem;
			margin: 1.5rem 0;

			.author-photo {
				width: 48px;
				height: 48px;
			}

			.author-name {
				font-size: 0.9375rem;
			}

			.author-role {
				font-size: 0.75rem;
			}
		}
	}

	.author-photo-link {
		flex-shrink: 0;
		text-decoration: none;
		border-radius: 50%;
		transition: opacity 0.2s ease;

		&:hover {
			opacity: 0.85;
		}

		/* Override blog link arrow */
		&::after {
			content: none !important;
			display: none !important;
		}
	}

	.author-photo {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--primary-glow);
	}

	.author-info {
		flex: 1;
		min-width: 0;
	}

	.author-name-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 0.25rem;
	}

	.author-name {
		margin: 0;
		font-size: 1.0625rem;
		font-weight: 700;
		line-height: 1.3;

		a {
			color: var(--text-primary);
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: var(--primary-lightest, var(--accent-light));
			}

			/* Override blog link arrow */
			&::after {
				content: none !important;
				display: none !important;
			}
		}
	}

	.author-role {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.author-bio-text {
		margin: 0.375rem 0 0.5rem;
		font-size: 0.875rem;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.author-links {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		color: var(--text-secondary);
		background: color-mix(in srgb, var(--text-tertiary) 10%, transparent);
		transition: all 0.2s ease;
		text-decoration: none;

		&:hover {
			color: var(--text-primary);
			background: var(--primary-subtle);
		}

		/* Override blog link arrow */
		&::after {
			content: none !important;
			display: none !important;
		}
	}

	@media (max-width: 500px) {
		.author-bio {
			gap: 0.75rem;
			padding: 1rem;

			&.compact .author-photo {
				width: 40px;
				height: 40px;
			}
		}

		.author-photo {
			width: 56px;
			height: 56px;
		}

		.author-name {
			font-size: 0.9375rem;
		}

		.author-bio-text {
			font-size: 0.8125rem;
		}

		.social-link {
			width: 28px;
			height: 28px;

			svg {
				width: 15px;
				height: 15px;
			}
		}
	}
</style>

<!-- src/lib/components/molecules/Footer.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import instagram from '$lib/images/instagram.svg';
	import twitter from '$lib/images/twitter.svg';

	// Main navigation links (matching navbar)
	const mainLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/questions', label: 'Question List' },
		{ href: '/about', label: 'About' }
	];

	// Blog section links (from navbar dropdown)
	const blogLinks = [
		{ href: '/community', label: 'The Takes of 9takes' },
		{ href: '/enneagram-corner', label: 'Enneagram Corner' },
		{ href: '/personality-analysis', label: 'Personality Analysis' },
		{ href: '/how-to-guides', label: 'How-to Guides' }
	];

	// Social media links
	const socialLinks = [
		{
			href: 'https://www.instagram.com/9takesdotcom/',
			img: instagram,
			alt: '9takesdotcom Instagram',
			label: 'Instagram'
		},
		{
			href: 'https://twitter.com/9takesdotcom',
			img: twitter,
			alt: '9takesdotcom Twitter',
			label: 'Twitter'
		}
	];

	// Helper functions
	$: isActive = (path) =>
		$page.url.pathname === path || ($page.url.pathname.startsWith(path) && path !== '/');
	$: homeUrl = $page.url.pathname.includes('9takes') ? 'https://9takes.com' : '/';
	$: currentYear = new Date().getFullYear();
</script>

<footer class="footer-wrapper" aria-label="Site footer">
	<div class="footer-container">
		<div class="footer-grid">
			<!-- Brand Section -->
			<div class="brand-section">
				<div class="brand-logo">
					<img
						src="/brand/aero.webp"
						alt="9takes Logo"
						height="48"
						width="48"
						loading="lazy"
					/>
					<span class="brand-name">9takes</span>
				</div>
				<p class="brand-description">
					Explore personality insights through engaging questions and discover what makes each
					person unique.
				</p>

				<!-- Social Links -->
				<div class="social-links">
					{#each socialLinks as { href, img, alt, label }}
						<a
							{href}
							target="_blank"
							rel="noreferrer noopener"
							class="social-link"
							aria-label={`Follow us on ${label}`}
						>
							<img
								src={img}
								{alt}
								width="20"
								height="20"
								loading="lazy"
							/>
						</a>
					{/each}
				</div>
			</div>

			<!-- Links Container (Navigation + Blog + Connect) -->
			<div class="links-container">
				<!-- Main Navigation -->
				<nav class="link-section" aria-label="Footer navigation">
					<h3>Navigation</h3>
					<ul>
						{#each mainLinks as { href, label }}
							<li>
								<a
									href={href === '/' ? homeUrl : href}
									class:active={isActive(href)}
									aria-current={isActive(href) ? 'page' : undefined}
								>
									{label}
								</a>
							</li>
						{/each}
					</ul>
				</nav>

				<!-- Blog Section -->
				<div class="link-section">
					<h3>Blog</h3>
					<ul>
						{#each blogLinks as { href, label }}
							<li>
								<a
									{href}
									class:active={isActive(href)}
									aria-current={isActive(href) ? 'page' : undefined}
								>
									{label}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<!-- Connect Section -->
				<div class="link-section connect-section">
					<h3>Connect</h3>
					<p>
						Stay updated with our latest personality insights and community discussions.
					</p>
					<a href="mailto:usersup@9takes.com" class="contact-link">
						Get in touch
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div class="footer-bottom">
			<p>&copy; {currentYear} 9takes. All rights reserved.</p>
		</div>
	</div>
</footer>

<style lang="scss">
	.footer-wrapper {
		position: relative;
		z-index: 10;
		margin-top: 4rem;
		width: 100%;
		border-top: 1px solid rgba(100, 116, 139, 0.2);
		background: #0a0a0f;
	}

	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 3rem 1.5rem 2rem;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 3rem;
	}

	/* Brand Section */
	.brand-section {
		display: flex;
		flex-direction: column;
	}

	.brand-logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;

		img {
			width: 48px;
			height: 48px;
		}
	}

	.brand-name {
		font-size: 1.25rem;
		font-weight: 700;
		color: #f1f5f9;
	}

	.brand-description {
		font-size: 0.875rem;
		line-height: 1.6;
		color: #64748b;
		margin-bottom: 1.5rem;
	}

	.social-links {
		display: flex;
		gap: 0.75rem;
	}

	.social-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background: #1a1a2e;
		border: 1px solid rgba(100, 116, 139, 0.3);
		border-radius: 0.5rem;
		transition: all 0.2s ease;

		img {
			width: 1.25rem;
			height: 1.25rem;
			filter: brightness(0) invert(1);
			opacity: 0.8;
		}

		&:hover {
			background: rgba(124, 58, 237, 0.2);
			border-color: rgba(124, 58, 237, 0.5);
			transform: translateY(-2px);
			box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);

			img {
				opacity: 1;
			}
		}
	}

	/* Links Container */
	.links-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
	}

	.link-section {
		h3 {
			font-size: 0.75rem;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			color: #94a3b8;
			margin-bottom: 1rem;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-direction: column;
			gap: 0.625rem;
		}

		li {
			list-style: none;

			&::marker {
				display: none;
				content: none;
			}
		}

		a {
			font-size: 0.875rem;
			color: #64748b;
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover,
			&.active {
				color: #a78bfa;
			}

			&::after {
				display: none !important;
			}
		}
	}

	.connect-section {
		p {
			font-size: 0.8125rem;
			color: #64748b;
			line-height: 1.5;
			margin-bottom: 1rem;
		}
	}

	.contact-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #7c3aed;
		text-decoration: none;
		transition: color 0.2s ease;

		svg {
			width: 1rem;
			height: 1rem;
		}

		&:hover {
			color: #a78bfa;
		}

		&::after {
			display: none !important;
		}
	}

	/* Footer Bottom */
	.footer-bottom {
		margin-top: 2.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(100, 116, 139, 0.15);
		text-align: center;

		p {
			font-size: 0.8125rem;
			color: #475569;
			margin: 0;
		}
	}

	/* Tablet */
	@media (max-width: 900px) {
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}

		.links-container {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Mobile */
	@media (max-width: 640px) {
		.footer-wrapper {
			margin-top: 3rem;
		}

		.footer-container {
			padding: 2rem 1rem 1.5rem;
		}

		.footer-grid {
			gap: 2rem;
		}

		.brand-section {
			align-items: center;
			text-align: center;
		}

		.brand-logo {
			justify-content: center;

			img {
				width: 40px;
				height: 40px;
			}
		}

		.brand-name {
			font-size: 1.125rem;
		}

		.brand-description {
			font-size: 0.8125rem;
			max-width: 280px;
			margin-left: auto;
			margin-right: auto;
		}

		.social-links {
			justify-content: center;
		}

		.links-container {
			grid-template-columns: 1fr 1fr;
			gap: 1.5rem;
		}

		.link-section {
			text-align: center;

			h3 {
				font-size: 0.6875rem;
				margin-bottom: 0.75rem;
			}

			ul {
				gap: 0.5rem;
			}

			a {
				font-size: 0.8125rem;
			}
		}

		.connect-section {
			grid-column: 1 / -1;

			p {
				font-size: 0.75rem;
				max-width: 280px;
				margin-left: auto;
				margin-right: auto;
				margin-bottom: 0.75rem;
			}
		}

		.contact-link {
			justify-content: center;
			font-size: 0.8125rem;
		}

		.footer-bottom {
			margin-top: 1.5rem;
			padding-top: 1rem;

			p {
				font-size: 0.75rem;
			}
		}
	}

	/* Small Mobile */
	@media (max-width: 380px) {
		.footer-container {
			padding: 1.5rem 0.75rem 1rem;
		}

		.brand-logo img {
			width: 36px;
			height: 36px;
		}

		.brand-name {
			font-size: 1rem;
		}

		.brand-description {
			font-size: 0.75rem;
		}

		.link-section {
			h3 {
				font-size: 0.625rem;
			}

			a {
				font-size: 0.75rem;
			}
		}

		.social-link {
			width: 2.25rem;
			height: 2.25rem;

			img {
				width: 1rem;
				height: 1rem;
			}
		}
	}

	/* Focus states */
	a:focus-visible {
		outline: 2px solid #a78bfa;
		outline-offset: 2px;
	}
</style>

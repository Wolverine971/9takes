<script lang="ts">
	import { page } from '$app/stores';
	import instagram from '$lib/images/instagram.svg';
	import twitter from '$lib/images/twitter.svg';

	// Navigation links
	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/questions', label: 'Question List' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'About' }
	];

	// Social media links
	const socialLinks = [
		{
			href: 'https://www.instagram.com/9takesdotcom/',
			img: instagram,
			alt: '9takesdotcom Instagram'
		},
		{
			href: 'https://twitter.com/9takesdotcom',
			img: twitter,
			alt: '9takesdotcom Twitter'
		}
	];

	// Helper functions
	$: isActive = (path) => $page.url.pathname.startsWith(path);
	$: homeUrl = $page.url.pathname.includes('9takes') ? 'https://9takes.com' : '/';
</script>

<footer class="footer">
	<div class="footer__container">
		<!-- Navigation links -->
		<nav class="footer__nav" aria-label="Footer Navigation">
			<ul>
				{#each links as { href, label }}
					<li>
						<a
							href={href === '/' ? homeUrl : href}
							class:is-active={$page.url.pathname === href}
							aria-current={isActive(href) ? 'page' : undefined}
						>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Social media links -->
		<div class="footer__social">
			{#each socialLinks as { href, img, alt }}
				<a
					{href}
					target="_blank"
					rel="noreferrer noopener"
					class="footer__social-link"
					aria-label={alt}
				>
					<img src={img} {alt} title={alt} width="24" height="24" loading="lazy" />
				</a>
			{/each}
		</div>

		<!-- Copyright info -->
		<div class="footer__copyright">
			<p>&copy; {new Date().getFullYear()} 9takes. All rights reserved.</p>
		</div>
	</div>
</footer>

<style lang="scss">
	// Variables
	$primary-color: var(--primary, #833bff);
	$text-color: var(--dark-gray, #333);
	$spacing-sm: 0.5rem;
	$spacing-md: 1rem;
	$spacing-lg: 2rem;
	$transition: 0.2s ease;

	// Footer base styles
	.footer {
		width: 100%;
		padding: $spacing-md 0;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		margin-top: $spacing-lg;

		&__container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 0 $spacing-md;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		// Navigation styling
		&__nav {
			margin-bottom: $spacing-md;

			ul {
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				gap: $spacing-lg;
				padding: 0;
				margin: 0;
				list-style: none;

				@media (max-width: 480px) {
					gap: $spacing-md;
					justify-content: space-between;
					width: 100%;
				}
			}

			li {
				margin: 0;
			}

			a {
				color: $text-color;
				text-decoration: none;
				font-weight: 600;
				padding: $spacing-sm 0;
				position: relative;
				transition: color $transition;

				&::after {
					content: '';
					position: absolute;
					width: 0;
					height: 2px;
					background: $primary-color;
					left: 0;
					bottom: 0;
					transition: width $transition;
				}

				&:hover,
				&.is-active {
					color: $primary-color;

					&::after {
						width: 100%;
					}
				}
			}
		}

		// Social links styling
		&__social {
			display: flex;
			gap: $spacing-md;
			margin-bottom: $spacing-md;

			&-link {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 36px;
				height: 36px;
				border-radius: 50%;
				background-color: rgba($primary-color, 0.1);
				transition:
					transform $transition,
					background-color $transition;

				&:hover {
					background-color: rgba($primary-color, 0.2);
					transform: translateY(-2px);
				}

				img {
					width: 24px;
					height: 24px;
					object-fit: contain;
				}
			}
		}

		// Copyright info
		&__copyright {
			text-align: center;
			font-size: 0.875rem;
			color: rgba($text-color, 0.6);
			margin-top: $spacing-sm;
		}
	}

	// Responsive adjustments
	@media (min-width: 768px) {
		.footer {
			&__container {
				padding: 0 $spacing-lg;
			}
		}
	}
</style>

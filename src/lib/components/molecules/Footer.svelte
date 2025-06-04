<!-- lib/components/molecules/Footer.svelte -->
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
	$: isActive = (path) => $page.url.pathname === path || ($page.url.pathname.startsWith(path) && path !== '/');
	$: homeUrl = $page.url.pathname.includes('9takes') ? 'https://9takes.com' : '/';
	$: currentYear = new Date().getFullYear();
</script>

<footer class="mt-16 w-full border-t border-neutral-200 bg-neutral-50">
	<div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			<!-- Brand Section -->
			<div class="col-span-1 md:col-span-2 lg:col-span-1">
				<div class="flex items-center mb-4">
					<img
						src="/brand/aero.png"
						alt="9takes Logo"
						height="48"
						width="48"
						class="mr-3"
					/>
					<span class="text-xl font-bold text-neutral-900">9takes</span>
				</div>
				<p class="text-sm text-neutral-600 leading-relaxed mb-6">
					Explore personality insights through engaging questions and discover what makes each person unique.
				</p>
				
				<!-- Social Links -->
				<div class="flex gap-4">
					{#each socialLinks as { href, img, alt, label }}
						<a
							{href}
							target="_blank"
							rel="noreferrer noopener"
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-neutral-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
							aria-label={`Follow us on ${label}`}
						>
							<img
								src={img}
								{alt}
								width="20"
								height="20"
								loading="lazy"
								class="h-5 w-5 object-contain"
							/>
						</a>
					{/each}
				</div>
			</div>

			<!-- Main Navigation -->
			<div class="col-span-1">
				<h3 class="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
					Navigation
				</h3>
				<ul class="space-y-3">
					{#each mainLinks as { href, label }}
						<li>
							<a
								href={href === '/' ? homeUrl : href}
								class="text-sm text-neutral-600 transition-colors duration-200 hover:text-primary-700 focus:outline-none focus:text-primary-700"
								class:text-primary-700={isActive(href)}
								class:font-medium={isActive(href)}
								aria-current={isActive(href) ? 'page' : undefined}
							>
								{label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Blog Section -->
			<div class="col-span-1">
				<h3 class="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
					Blog
				</h3>
				<ul class="space-y-3">
					{#each blogLinks as { href, label }}
						<li>
							<a
								{href}
								class="text-sm text-neutral-600 transition-colors duration-200 hover:text-primary-700 focus:outline-none focus:text-primary-700"
								class:text-primary-700={isActive(href)}
								class:font-medium={isActive(href)}
								aria-current={isActive(href) ? 'page' : undefined}
							>
								{label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Newsletter/Contact Section -->
			<div class="col-span-1">
				<h3 class="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
					Connect
				</h3>
				<p class="text-sm text-neutral-600 mb-4">
					Stay updated with our latest personality insights and community discussions.
				</p>
				<a 
					href="mailto:usersup@9takes.com" 
					class="inline-flex items-center text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
				>
					Get in touch
					<svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
					</svg>
				</a>
			</div>
		</div>

		<!-- Bottom Section -->
		
	</div>
</footer>

<style lang="scss">
	// Ensure consistent link styling
	a {
		text-decoration: none !important;
		
		&:focus {
			outline: none;
		}
	}
	ul, li {
		list-style-type: none;
		
	}

	li::marker {
		display: none;
		content: none;
	}

	// Smooth animations for interactive elements
	.transition-all {
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	// Mobile optimizations
	@media (max-width: 768px) {
		.grid {
			gap: 2rem;
		}
		
		.col-span-1 {
			text-align: center;
			
			&:first-child {
				text-align: center;
			}
		}
		
		h3 {
			text-align: center;
		}
		
		ul {
			text-align: center;
		}
	}

	// Enhanced focus states for accessibility
	a:focus-visible {
		outline: 2px solid theme('colors.primary.500');
		outline-offset: 2px;
	}
</style>
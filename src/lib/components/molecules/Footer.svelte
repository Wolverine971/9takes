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

<footer class="mt-8 w-full border-t border-gray-100 py-4">
	<div class="mx-auto flex max-w-7xl flex-col items-center px-4 md:px-8">
		<!-- Navigation links -->
		<nav class="mb-4" aria-label="Footer Navigation">
			<ul
				class="xs:gap-4 xs:justify-between xs:w-full m-0 flex list-none flex-wrap justify-center gap-8 p-0 sm:gap-8"
			>
				{#each links as { href, label }}
					<li class="m-0">
						<a
							href={href === '/' ? homeUrl : href}
							class="relative py-2 font-semibold text-gray-800 no-underline transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-indigo-600 after:transition-all after:duration-200 after:content-[''] hover:text-indigo-600 hover:after:w-full"
							class:active-link={$page.url.pathname === href}
							aria-current={isActive(href) ? 'page' : undefined}
						>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Social media links -->
		<div class="mb-4 flex gap-4">
			{#each socialLinks as { href, img, alt }}
				<a
					{href}
					target="_blank"
					rel="noreferrer noopener"
					class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-200"
					aria-label={alt}
				>
					<img
						src={img}
						{alt}
						title={alt}
						width="24"
						height="24"
						loading="lazy"
						class="h-6 w-6 object-contain"
					/>
				</a>
			{/each}
		</div>

		<!-- Copyright info -->
		<div class="text-center">
			<p class="mt-2 text-sm text-gray-500">
				&copy; {new Date().getFullYear()} 9takes. All rights reserved.
			</p>
		</div>
	</div>
</footer>

<style>
	a:hover {
		/* color: var(--accent-dark); */
		text-decoration: none;
	}

	/* Add active link style - this is easier to handle in a style block than with Tailwind conditionals */
	.active-link {
		@apply text-indigo-600;
	}

	.active-link::after {
		@apply w-full;
	}

	/* Add responsive classes that might not be in default Tailwind */
	@media (max-width: 480px) {
		.xs\:gap-4 {
			gap: 1rem;
		}

		.xs\:justify-between {
			justify-content: space-between;
		}

		.xs\:w-full {
			width: 100%;
		}
	}
</style>

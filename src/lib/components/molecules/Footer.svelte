<script lang="ts">
	import { page } from '$app/stores';
	import instagram from '$lib/images/instagram.svg';
	import twitter from '$lib/images/twitter.svg';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/questions', label: 'Question List' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/about', label: 'About' }
	];

	const socialLinks = [
		{
			href: 'https://www.instagram.com/9takesdotcom/',
			img: instagram,
			alt: '9takesdotcom Instagram'
		},
		{ href: 'https://twitter.com/9takesdotcom', img: twitter, alt: '9takesdotcom Twitter' }
	];

	$: isActive = (path) => $page.url.pathname.startsWith(path);
	$: homeUrl = $page.url.pathname.includes('9takes') ? 'https://9takes.com' : '/';
</script>

<footer class="footer">
	<ul class="footer-links">
		{#each links as { href, label }}
			<li aria-current={isActive(href) ? 'page' : undefined}>
				<a href={href === '/' ? homeUrl : href} class:active-link={$page.url.pathname === href}
					>{label}</a
				>
			</li>
		{/each}
	</ul>
	<div class="footer__social">
		{#each socialLinks as { href, img, alt }}
			<a class="external-link" target="_blank" rel="noreferrer" {href}>
				<img loading="lazy" src={img} {alt} title={alt} width="150" height="150" class="icon" />
			</a>
		{/each}
	</div>
</footer>

<style lang="scss">
	a {
		color: var(--color-paladin-3);
		font-weight: bold;
		&:hover,
		&.active-link {
			color: var(--primary);
		}
	}

	.footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 12px;
		// margin: 0 1rem;

		&-links {
			display: flex;
			justify-content: center;
			list-style-type: none;
			padding: 0;
			gap: 10px;
			margin: 2rem 2rem 1rem;
		}

		&__social {
			display: flex;
			gap: 1rem;
		}

		.icon {
			width: 2em;
			height: 2em;
			object-fit: contain;
		}
	}

	@media (min-width: 480px) {
		.footer {
			padding: 12px 0;
			li {
				margin: 1rem;
			}
		}
	}

	@media (max-width: 480px) {
		.footer {
			width: 100%;
			align-items: center;

			&-links {
				justify-content: space-around;
				margin: 2rem 0 1rem;
			}

			li {
				margin: 0.2rem 0;
			}
		}
	}
</style>

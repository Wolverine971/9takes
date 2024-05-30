<script lang="ts">
	import { page } from '$app/stores';
	import instagram from '$lib/images/instagram.svg';
	import twitter from '$lib/images/twitter.svg';
</script>

<footer class="footer">
	<ul class="footer-links">
		<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
			<a
				href={$page.url.pathname.includes('9takes') ? 'https://9takes.com' : '/'}
				class={$page.url.pathname === '/' ? 'active-link' : ''}>Home</a
			>
		</li>
		<li aria-current={$page.url.pathname.startsWith('/questions') ? 'page' : undefined}>
			<a href="/questions" class={$page.url.pathname.startsWith('/questions') ? 'active-link' : ''}
				>Questions</a
			>
		</li>
		<li aria-current={$page.url.pathname.startsWith('/blog') ? 'page' : undefined}>
			<a href="/blog" class={$page.url.pathname.startsWith('/blog') ? 'active-link' : ''}>Blog</a>
		</li>
		<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
			<a href="/about" class={$page.url.pathname === '/about' ? 'active-link' : ''}>About</a>
		</li>
	</ul>
	<div class="footer__social">
		<a
			class="external-link"
			target="_blank"
			rel="noreferrer"
			href="https://www.instagram.com/9takesdotcom/"
		>
			<img
				loading="lazy"
				src={instagram}
				alt="9takesdotcom Instagram"
				title="9takesdotcom Instagram"
				width="150"
				height="150"
				class="icon"
			/>
		</a>
		<a
			class="external-link"
			target="_blank"
			rel="noreferrer"
			href="https://twitter.com/9takesdotcom"
		>
			<img
				loading="lazy"
				src={twitter}
				alt="9takesdotcom Twitter"
				title="9takesdotcom Twitter"
				width="150"
				height="150"
				class="icon"
			/>
		</a>
	</div>
</footer>

<style lang="scss">
	a {
		color: var(--color-paladin-3) !important;
	}
	a:hover {
		color: var(--color-theme-purple) !important;
	}
	.active-link {
		color: var(--color-theme-purple) !important;
	}
	.footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 0;
	}
	.footer-links {
		display: flex;
		justify-content: center;
		list-style-type: none;
		// margin: 0;
		padding: 0;
		overflow: hidden;
		gap: 10px;
		margin: 2rem 2rem 1rem 2rem;
	}

	.footer__social {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
	}
	.footer-div {
		margin: 2rem 2rem 1rem 2rem;
	}
	footer {
		padding: 12px;
		margin: 0 1rem;

		& .icon {
			width: 2em;
			height: 2em;
			object-fit: contain;
		}
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
		li {
			margin: 1rem;
		}
	}
	@media (max-width: 480px) {
		li {
			margin: 0.2rem 0;
		}
		footer {
			width: 100%;
			align-items: normal !important;
		}
		.footer-links {
			justify-content: space-around;
			margin: 2rem 0 1rem 0;
		}
		// .footer-div {
		// 	margin: 2rem 0 1rem 0;
		// }
	}
</style>

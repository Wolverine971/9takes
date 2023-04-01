<script lang="ts">
	import { page } from '$app/stores';
	import instagram from '$lib/images/instagram.svg';
	import twitter from '$lib/images/twitter.svg';
</script>

<footer class="footer">
	<div style="margin: 2rem 2rem 1rem 2rem;">
		<ul class="footer-links">
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/" class={$page.url.pathname === '/' ? 'current' : ''}>Home</a>
			</li>
			<!-- <li aria-current={$page.url.pathname.startsWith('/questions') ? 'page' : undefined}>
				<a href="/questions">Questions</a>
			</li> -->
			<li aria-current={$page.url.pathname === '/blog' ? 'page' : undefined}>
				<a href="/blog" class={$page.url.pathname === '/blog' ? 'current' : ''}>Blog</a>
			</li>
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about" class={$page.url.pathname === '/about' ? 'current' : ''}>About</a>
			</li>
		</ul>
	</div>
	<div style="display: flex; flex-direction: row; justify-content:center;">
		<a href="https://www.instagram.com/9takesdotcom/">
			<img src={instagram} alt="Instagram" class="icon" />
		</a>
		<a href="https://twitter.com/9takesdotcom">
			<img src={twitter} alt="Twitter" class="icon" />
		</a>
	</div>
</footer>

<style lang="scss">
	.current {
		color: var(--color-theme-purple);
		text-decoration: underline;
	}
	.footer-links {
		display: flex;
		justify-content: center;
		list-style-type: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		gap: 10px;

		li {
			margin: 1rem;
		}
	}
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;

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
	}
</style>

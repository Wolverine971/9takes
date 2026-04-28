<!-- src/lib/components/molecules/Header.svelte -->
<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import MobileNav from './MobileNavNew.svelte';
	import HeaderSearch from './HeaderSearch.svelte';
	import ThemeToggle from '$lib/components/atoms/ThemeToggle.svelte';
	import { onClickOutside } from '$lib/components/molecules/Context.svelte';

	export let data: any;

	interface NavigationItem {
		href: string;
		label: string;
		description?: string;
		featured?: boolean;
	}

	const mobileNavItems: NavigationItem[] = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' }
	];

	const libraryItems: NavigationItem[] = [
		{
			href: '/questions',
			label: 'Questions',
			description: 'Community prompts and perspective threads',
			featured: true
		},
		{
			href: '/personality-analysis',
			label: 'Personality Analysis',
			description: 'People, characters, and type breakdowns'
		},
		{
			href: '/pop-culture',
			label: 'Pop Culture Analysis',
			description: 'Media, celebrity, and culture reads'
		},
		{
			href: '/enneagram-corner',
			label: 'Enneagram Deep Dives',
			description: 'Theory, instincts, and growth patterns'
		},
		{
			href: '/community',
			label: '9takes Opinions',
			description: 'Essay-style takes from the 9takes perspective'
		}
	];

	let innerWidth = 1200;
	let isLibraryOpen = false;

	$: isMobile = innerWidth < 900;
	$: isLibraryActive = libraryItems.some((item) =>
		item.href === '/' ? $page.url.pathname === item.href : $page.url.pathname.startsWith(item.href)
	);

	afterNavigate(() => {
		isLibraryOpen = false;
	});

	function toggleLibrary() {
		isLibraryOpen = !isLibraryOpen;
	}

	function closeLibrary() {
		isLibraryOpen = false;
	}

	function isActive(href: string): boolean {
		return href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(href);
	}
</script>

<svelte:window bind:innerWidth />

<header class="nav-main header-shell" aria-label="Site header">
	{#if isMobile}
		<div class="mobile-shell">
			<div class="mobile-top-row">
				<MobileNav navItems={mobileNavItems} {libraryItems} />

				<a href="/" class="logo-link" aria-label="Go to homepage">
					<span class="logo-text">9takes</span>
				</a>

				<div class="header-actions mobile-actions">
					<ThemeToggle />
					{#if data?.user}
						<a href="/account" class="account-button" aria-label="Go to account" title="Account">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="account-icon"
							>
								<circle cx="12" cy="12" r="10" />
								<circle cx="12" cy="10" r="3" />
								<path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
							</svg>
						</a>
					{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
						<a href="/login" class="mobile-login">Log in</a>
					{/if}
				</div>
			</div>

			<div class="mobile-search-row">
				<div class="search-slot">
					<HeaderSearch mobile={true} placeholder="Search 9takes" />
				</div>
			</div>
		</div>
	{:else}
		<nav class="header-frame" aria-label="Main navigation">
			<a href="/" class="logo-link" aria-label="Go to homepage">
				<span class="logo-text">9takes</span>
			</a>

			<div class="header-middle">
				<div class="search-slot">
					<HeaderSearch />
				</div>

				<div class="library-control" use:onClickOutside={closeLibrary}>
					<button
						type="button"
						class="library-button"
						class:is-active={isLibraryActive || isLibraryOpen}
						aria-haspopup="true"
						aria-expanded={isLibraryOpen}
						aria-controls="desktop-library-menu"
						on:click={toggleLibrary}
					>
						<span class="library-button-spacer" aria-hidden="true"></span>
						<span class="library-button-label">Library</span>
						<svg
							class="dropdown-arrow"
							class:rotated={isLibraryOpen}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
						>
							<path d="m6 9 6 6 6-6"></path>
						</svg>
					</button>

					{#if isLibraryOpen}
						<div id="desktop-library-menu" class="library-menu">
							{#each libraryItems as item}
								<a
									href={item.href}
									class="library-item"
									class:is-current={isActive(item.href)}
									class:is-featured={item.featured}
									on:click={closeLibrary}
								>
									<span class="library-label">{item.label}</span>
									{#if item.description}
										<span class="library-description">{item.description}</span>
									{/if}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<div class="header-actions">
				<ThemeToggle />
				{#if data?.user}
					<a href="/account" class="account-button" aria-label="Go to account" title="Account">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="account-icon"
						>
							<circle cx="12" cy="12" r="10" />
							<circle cx="12" cy="10" r="3" />
							<path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
						</svg>
					</a>
				{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
					<a href="/login" class="btn btn-primary desktop-login">Log in</a>
				{/if}
			</div>
		</nav>
	{/if}
</header>

<style lang="scss">
	.header-frame,
	.mobile-shell {
		max-width: 1240px;
		margin: 0 auto;
		padding: 0.8rem 1.25rem;
	}

	.header-frame {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 1rem;
	}

	.header-middle {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		min-width: 0;
	}

	.search-slot {
		flex: 1 1 auto;
		min-width: 0;
	}

	.header-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.65rem;
	}

	.account-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 6px;
		color: var(--text-secondary);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.account-button:hover {
		color: var(--primary);
	}

	.desktop-login {
		padding-inline: 1rem;
		white-space: nowrap;
	}

	.library-control {
		position: relative;
		flex-shrink: 0;
	}

	.library-button {
		display: inline-grid;
		grid-template-columns: 0.95rem auto 0.95rem;
		align-items: center;
		justify-content: center;
		column-gap: 0.45rem;
		height: 3rem;
		min-width: 8.1rem;
		padding: 0 1rem;
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--glass-border));
		border-radius: 999px;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg-surface) 94%, transparent),
				var(--bg-surface)
			),
			var(--bg-surface);
		color: var(--text-secondary);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		line-height: 1;
		text-transform: uppercase;
		text-align: center;
		white-space: nowrap;
		cursor: pointer;
		box-shadow:
			0 10px 24px color-mix(in srgb, var(--bg-deep) 18%, transparent),
			inset 0 1px 0 color-mix(in srgb, white 5%, transparent);
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease,
			transform 0.18s ease,
			box-shadow 0.18s ease;
	}

	.library-button-label {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transform: translateY(-0.02em);
	}

	.library-button-spacer {
		display: block;
		width: 0.95rem;
		height: 0.95rem;
		opacity: 0;
		pointer-events: none;
	}

	.library-button:hover,
	.library-button.is-active {
		color: var(--primary-light);
		border-color: color-mix(in srgb, var(--primary) 42%, var(--glass-border));
		box-shadow: 0 14px 30px color-mix(in srgb, var(--primary) 10%, transparent);
		transform: translateY(-1px);
	}

	.library-button:focus {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	.library-menu {
		position: absolute;
		top: calc(100% + 0.7rem);
		right: 0;
		width: min(26rem, 82vw);
		padding: 0.55rem;
		border: 1px solid color-mix(in srgb, var(--primary) 16%, var(--glass-border));
		border-radius: 1.2rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg-surface) 98%, transparent),
				color-mix(in srgb, var(--bg-surface) 96%, var(--bg-base))
			),
			var(--bg-surface);
		box-shadow:
			0 26px 54px color-mix(in srgb, var(--bg-deep) 26%, transparent),
			0 0 0 1px color-mix(in srgb, var(--primary) 6%, transparent);
		backdrop-filter: blur(18px);
	}

	.library-item {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		padding: 0.9rem 0.95rem;
		border-radius: 0.95rem;
		box-shadow: inset 0 0 0 1px transparent;
		color: var(--text-secondary);
		text-decoration: none;
		transition:
			background-color 0.16s ease,
			color 0.16s ease,
			box-shadow 0.16s ease,
			transform 0.16s ease;
	}

	.library-item:hover,
	.library-item.is-current {
		background: color-mix(in srgb, var(--primary-subtle) 84%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary) 12%, transparent);
		color: var(--text-primary);
	}

	.library-item.is-featured {
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--accent) 12%, transparent),
			color-mix(in srgb, var(--primary) 10%, transparent)
		);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 14%, transparent);
	}

	.library-item.is-featured:hover,
	.library-item.is-featured.is-current {
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--accent) 18%, transparent),
			color-mix(in srgb, var(--primary) 14%, transparent)
		);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 22%, transparent);
	}

	.library-label {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.library-description {
		font-size: 0.82rem;
		line-height: 1.45;
		color: color-mix(in srgb, var(--text-secondary) 90%, var(--primary) 10%);
	}

	.library-item:hover .library-description,
	.library-item.is-current .library-description {
		color: color-mix(in srgb, var(--text-secondary) 72%, var(--text-primary));
	}

	.library-item.is-featured .library-label {
		color: color-mix(in srgb, var(--text-primary) 94%, var(--accent-light));
	}

	.library-item.is-featured .library-description {
		color: color-mix(in srgb, var(--text-secondary) 82%, var(--accent-light));
	}

	.dropdown-arrow {
		width: 0.95rem;
		height: 0.95rem;
		color: color-mix(in srgb, var(--text-secondary) 72%, var(--primary-light));
		justify-self: end;
	}

	.mobile-top-row,
	.mobile-search-row {
		display: flex;
		align-items: center;
	}

	.mobile-top-row {
		justify-content: space-between;
		gap: 0.75rem;
	}

	.mobile-actions {
		gap: 0.45rem;
	}

	.mobile-login {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0 1rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--primary) 12%, transparent);
		color: var(--primary-light);
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}

	.mobile-search-row {
		margin-top: 0.75rem;
	}

	@media (max-width: 1180px) {
		.header-frame {
			grid-template-columns: auto minmax(0, 1fr) auto;
		}

		.library-menu {
			width: min(23rem, 78vw);
		}
	}

	@media (max-width: 899px) {
		.mobile-shell {
			padding-top: 0.7rem;
			padding-bottom: 0.8rem;
		}

		.mobile-search-row .search-slot {
			flex: 1 1 auto;
			width: 100%;
		}
	}

	@media (max-width: 639px) {
		.mobile-shell {
			padding-inline: 1rem;
		}

		.mobile-search-row {
			align-items: stretch;
		}
	}
</style>

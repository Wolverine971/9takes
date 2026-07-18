<!-- src/lib/components/molecules/Header.svelte -->
<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import MobileNav from './MobileNavNew.svelte';
	import HeaderSearch from './HeaderSearch.svelte';
	import ThemeToggle from '$lib/components/atoms/ThemeToggle.svelte';
	import { Button } from '$lib/components/atoms';
	import { getAuthShellUser } from '$lib/authShell';
	import { onClickOutside } from '$lib/components/molecules/Context.svelte';
	// Phase 3 (2026-05-04): inline SVGs migrated to @lucide/svelte per design-system.md
	// rollout-plan Phase 3. Stroke widths normalized to Lucide defaults (1.5).
	import { CircleUserRound, ChevronDown } from '@lucide/svelte';

	const authUser = getAuthShellUser();

	type NavigationHref =
		| '/'
		| '/about'
		| '/book-session'
		| '/community'
		| '/corpus-stats'
		| '/enneagram-corner'
		| '/how-to-guides'
		| '/personality-analysis'
		| '/pop-culture'
		| '/questions';

	interface NavigationItem {
		href: NavigationHref;
		label: string;
		description?: string;
		featured?: boolean;
	}

	const mobileNavItems: NavigationItem[] = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/book-session', label: 'Join Coaching Waitlist' },
		{ href: '/corpus-stats', label: 'Corpus Stats' }
	];

	// One label per destination, shared with Footer (design audit 2026-06-09:
	// header and footer named the same routes differently).
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
			label: 'Pop Culture',
			description: 'Media, celebrity, and culture reads'
		},
		{
			href: '/enneagram-corner',
			label: 'Enneagram Corner',
			description: 'Theory, instincts, and growth patterns'
		},
		{
			href: '/how-to-guides',
			label: 'How-to Guides',
			description: 'Practical playbooks for real situations'
		},
		{
			href: '/community',
			label: 'The Takes of 9takes',
			description: 'Essay-style takes from the 9takes perspective'
		}
	];

	let isLibraryOpen = $state(false);

	// /questions is excluded: it has its own top-level header link (2026-07-18),
	// so the Library trigger only lights for routes reached via the dropdown.
	let isLibraryActive = $derived(
		libraryItems.some(
			(item) =>
				item.href !== '/questions' &&
				(item.href === '/'
					? $page.url.pathname === item.href
					: $page.url.pathname.startsWith(item.href))
		)
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

<!-- Both layouts render; CSS media queries pick one (design audit 2026-06-09).
     The old JS branch (innerWidth < 900, SSR default 1200) served desktop markup
     to mobile users, which swapped after hydration — layout shift on every load. -->
<header class="nav-main header-shell" aria-label="Site header">
	<div class="mobile-shell">
		<div class="mobile-top-row">
			<MobileNav navItems={mobileNavItems} {libraryItems} />

			<a href={resolve('/')} class="logo-link" aria-label="Go to homepage">
				<span class="logo-text">9takes</span>
			</a>

			<div class="header-actions mobile-actions">
				<ThemeToggle />
				{#if $authUser}
					<a
						href={resolve('/account')}
						class="account-button"
						aria-label="Go to account"
						title="Account"
					>
						<CircleUserRound size={24} strokeWidth={1.5} class="account-icon" />
					</a>
				{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
					<a href={resolve('/login')} class="mobile-login">Log in</a>
				{/if}
			</div>
		</div>

		<div class="mobile-search-row">
			<div class="search-slot">
				<HeaderSearch mobile={true} placeholder="Search 9takes" />
			</div>
		</div>
	</div>

	<nav class="header-frame" aria-label="Main navigation">
		<a href={resolve('/')} class="logo-link" aria-label="Go to homepage">
			<span class="logo-text">9takes</span>
		</a>

		<div class="header-middle">
			<div class="search-slot">
				<HeaderSearch />
			</div>

			<a
				href={resolve('/questions')}
				class="questions-link"
				class:is-active={isActive('/questions')}
				aria-current={isActive('/questions') ? 'page' : undefined}
			>
				Questions
			</a>

			<div class="library-control" use:onClickOutside={closeLibrary}>
				<button
					type="button"
					class="library-button"
					class:is-active={isLibraryActive || isLibraryOpen}
					aria-haspopup="true"
					aria-expanded={isLibraryOpen}
					aria-controls="desktop-library-menu"
					onclick={toggleLibrary}
				>
					<span class="library-button-spacer" aria-hidden="true"></span>
					<span class="library-button-label">Library</span>
					<ChevronDown
						class={`dropdown-arrow ${isLibraryOpen ? 'rotated' : ''}`}
						size={24}
						strokeWidth={1.8}
					/>
				</button>

				{#if isLibraryOpen}
					<div id="desktop-library-menu" class="library-menu">
						{#each libraryItems as item (item.href)}
							<a
								href={resolve(item.href)}
								class="library-item"
								class:is-current={isActive(item.href)}
								class:is-featured={item.featured}
								onclick={closeLibrary}
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
			{#if $authUser}
				<a
					href={resolve('/account')}
					class="account-button"
					aria-label="Go to account"
					title="Account"
				>
					<CircleUserRound class="account-icon" size={24} strokeWidth={1.5} />
				</a>
			{:else if !($page.url.pathname === '/login' || $page.url.pathname === '/register')}
				<Button href={resolve('/login')} variant="secondary" class="desktop-login">Log in</Button>
				<Button href={resolve('/register')} class="desktop-signup">Sign up</Button>
			{/if}
		</div>
	</nav>
</header>

<style lang="scss">
	.header-frame,
	.mobile-shell {
		max-width: 1240px;
		margin: 0 auto;
		padding: 0.8rem 1.25rem;
	}

	/* Responsive switch lives in CSS so SSR HTML is correct at every width
	   (no hydration swap). Desktop default; mobile under 900px. */
	.mobile-shell {
		display: none;
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
		border-radius: 0.625rem;
		color: var(--ink-mid);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.account-button:hover {
		color: var(--lamp-glow);
	}

	.header-shell :global(.desktop-login),
	.header-shell :global(.desktop-signup) {
		padding-inline: 1rem;
		white-space: nowrap;
	}

	/* Top-level funnel link (2026-07-18): Questions is the give-first product,
	   so it gets a persistent slot beside Library instead of living only in
	   the dropdown. Mirrors .library-button chrome so the two read as siblings. */
	.questions-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		height: 3rem;
		padding: 0 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--stone-warm);
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		line-height: 1;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease;
	}

	.questions-link:hover,
	.questions-link.is-active {
		color: var(--lamp-glow);
		border-color: color-mix(in srgb, var(--lamp-glow) 42%, var(--stone-edge));
		background: var(--stone-mid);
	}

	.questions-link:focus {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.library-control {
		position: relative;
		flex-shrink: 0;
	}

	/* V5 pass 2026-06-10: static nav chrome carries no shadow or hover lift —
	   borders do the work (design-system.md §9). Pill radius dropped to the
	   locked 10px (buttons are rounded-md; pills are for avatars/spinners),
	   and the button now sits visually below the Log in CTA in weight. */
	.library-button {
		display: inline-grid;
		grid-template-columns: 0.95rem auto 0.95rem;
		align-items: center;
		justify-content: center;
		column-gap: 0.45rem;
		height: 3rem;
		min-width: 8.1rem;
		padding: 0 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--stone-warm);
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		line-height: 1;
		text-transform: uppercase;
		text-align: center;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease;
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
		color: var(--lamp-glow);
		border-color: color-mix(in srgb, var(--lamp-glow) 42%, var(--stone-edge));
		background: var(--stone-mid);
	}

	.library-button:focus {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	/* Floating UI — system shadow allowed, solid V5 surface, locked 16px radius. */
	.library-menu {
		position: absolute;
		top: calc(100% + 0.7rem);
		right: 0;
		width: min(26rem, 82vw);
		padding: 0.55rem;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
		box-shadow: var(--shadow-lg);
	}

	.library-item {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		padding: 0.9rem 0.95rem;
		border-radius: 0.625rem;
		box-shadow: inset 0 0 0 1px transparent;
		color: var(--ink-mid);
		text-decoration: none;
		transition:
			background-color 0.16s ease,
			color 0.16s ease,
			box-shadow 0.16s ease,
			transform 0.16s ease;
	}

	.library-item:hover,
	.library-item.is-current {
		background: color-mix(in srgb, var(--lamp-soft) 84%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--lamp-glow) 12%, transparent);
		color: var(--ink-bright);
	}

	.library-item.is-featured {
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--lamp-glow) 12%, transparent),
			color-mix(in srgb, var(--lamp-glow) 10%, transparent)
		);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--lamp-glow) 14%, transparent);
	}

	.library-item.is-featured:hover,
	.library-item.is-featured.is-current {
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--lamp-glow) 18%, transparent),
			color-mix(in srgb, var(--lamp-glow) 14%, transparent)
		);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--lamp-glow) 22%, transparent);
	}

	.library-label {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--ink-bright);
	}

	.library-description {
		font-size: 0.82rem;
		line-height: 1.45;
		color: color-mix(in srgb, var(--ink-mid) 90%, var(--lamp-glow) 10%);
	}

	.library-item:hover .library-description,
	.library-item.is-current .library-description {
		color: color-mix(in srgb, var(--ink-mid) 72%, var(--ink-bright));
	}

	.library-item.is-featured .library-label {
		color: color-mix(in srgb, var(--ink-bright) 94%, var(--lamp-glow));
	}

	.library-item.is-featured .library-description {
		color: color-mix(in srgb, var(--ink-mid) 82%, var(--lamp-glow));
	}

	.library-button :global(.dropdown-arrow) {
		width: 0.95rem;
		height: 0.95rem;
		color: color-mix(in srgb, var(--ink-mid) 72%, var(--lamp-glow));
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
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--lamp-glow) 12%, transparent);
		color: var(--lamp-glow);
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
		.header-frame {
			display: none;
		}

		.mobile-shell {
			display: block;
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

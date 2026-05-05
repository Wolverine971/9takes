<!-- src/routes/styleguide/+page.svelte -->
<!--
  /styleguide — 9takes design system test bench
  Source of truth: docs/design-system.md (locked 2026-05-04)
  Rollout plan:    docs/design/2026-05-04-rollout-plan.md (Phase 3)
  Visual ground truth (aesthetic only): /design-preview/v5

  Hard guardrails (do not relax):
  - Scoped styles only. Reads global tokens from src/scss/index.scss; never
    mutates them. The bridge (V5 + legacy) is rendered as documentation, not
    re-defined here.
  - Theme toggle uses its own localStorage key + own <html> class
    (`styleguide-light`) so it cannot collide with production theme state.
  - No new npm packages. Reuses Spinner / ThemeToggle if useful, but keeps
    canonical specs inline so this file does not silently track other files.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, EmptyState, ErrorState } from '$lib/components/atoms';

	// ---------------------------------------------------------------------------
	// Theme state — separate from production. Honors prefers-color-scheme on
	// first load if the user has never toggled here. Mirrors the V5 prototype
	// pattern (own localStorage key, own html class).
	// ---------------------------------------------------------------------------
	let theme = $state<'dark' | 'light'>('dark');
	let bannerDismissed = $state(false);

	const STORAGE_KEY = '9takes-styleguide-theme';
	const HTML_LIGHT_CLASS = 'styleguide-light';

	onMount(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'light' || stored === 'dark') {
			theme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			theme = 'light';
		}
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		// Mirror production's `:root.light` token block on this page only.
		document.documentElement.classList.toggle('light', theme === 'light');
		// Page-host warm-up so the chrome around the .styleguide wrapper matches.
		document.documentElement.classList.toggle(HTML_LIGHT_CLASS, theme === 'light');
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// Non-fatal: private mode, etc.
		}
		return () => {
			document.documentElement.classList.remove(HTML_LIGHT_CLASS);
			// Leave .light alone on unmount — production ThemeToggle owns it
			// in normal navigation flows. We only added it; we don't strip it.
		};
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
	}

	// ---------------------------------------------------------------------------
	// Section ToC. Drives the sticky sidebar nav + reads cleanly aloud.
	// ---------------------------------------------------------------------------
	type Section = { id: string; num: string; label: string };
	const sections: Section[] = [
		{ id: 's00', num: '00', label: 'HEADER' },
		{ id: 's01', num: '01', label: 'BRAND' },
		{ id: 's02', num: '02', label: 'COLOR · V5' },
		{ id: 's03', num: '03', label: 'COLOR · LEGACY' },
		{ id: 's04', num: '04', label: 'SEMANTIC' },
		{ id: 's05', num: '05', label: 'ENNEAGRAM' },
		{ id: 's06', num: '06', label: 'TYPOGRAPHY' },
		{ id: 's07', num: '07', label: 'SPACING' },
		{ id: 's08', num: '08', label: 'RADIUS' },
		{ id: 's09', num: '09', label: 'SHADOW' },
		{ id: 's10', num: '10', label: 'MOTION' },
		{ id: 's11', num: '11', label: 'COMPONENTS' },
		{ id: 's12', num: '12', label: 'VOCAB' }
	];

	// ---------------------------------------------------------------------------
	// Token tables. Each row = { token, dark, light, use }. We render swatches
	// via `var(--token)` so the displayed color follows the active theme; the
	// hex columns explain what's in each token under each theme.
	// ---------------------------------------------------------------------------
	type SwatchRow = {
		token: string;
		dark: string;
		light: string;
		use: string;
		isRgb?: boolean;
	};

	// §02 — V5 brand palette (canonical, locked 2026-05-04)
	const v5Lamp: SwatchRow[] = [
		{
			token: '--lamp-glow',
			dark: '#F59E0B',
			light: '#B45309',
			use: 'sodium-amber primary — CTAs, brand moments'
		},
		{ token: '--lamp-deep', dark: '#B45309', light: '#92400E', use: 'hover, pressed' },
		{ token: '--lamp-light', dark: '#FBBF24', light: '#D97706', use: 'highlights' },
		{
			token: '--lamp-soft',
			dark: 'rgba(245,158,11,0.14)',
			light: 'rgba(180,83,9,0.10)',
			use: 'soft fill / subtle backgrounds'
		},
		{
			token: '--lamp-glow-rgba',
			dark: 'rgba(245,158,11,0.40)',
			light: 'rgba(217,119,6,0.18)',
			use: 'glow halos, focus ring fade'
		}
	];

	const v5Stone: SwatchRow[] = [
		{ token: '--night-deep', dark: '#0a0807', light: '#FAF8F4', use: 'page background' },
		{ token: '--night-mid', dark: '#16110d', light: '#F2EBDD', use: 'secondary surfaces' },
		{ token: '--stone-warm', dark: '#241D17', light: '#FFFFFF', use: 'cards, content containers' },
		{ token: '--stone-mid', dark: '#3a302a', light: '#F5F0E8', use: 'elevated, hover' },
		{
			token: '--stone-edge',
			dark: '#5C4F47',
			light: '#D6CCB8',
			use: '1px hairline borders (the workhorse)'
		}
	];

	const v5Marble: SwatchRow[] = [
		{
			token: '--marble-pure',
			dark: '#FAF8F4',
			light: '#FFFFFF',
			use: 'statue lit faces, pure-light moments'
		},
		{ token: '--marble-warm', dark: '#EDE6DA', light: '#FAF8F4', use: 'parchment, warm highlight' },
		{ token: '--marble-shadow', dark: '#A8A095', light: '#8B7E6E', use: 'statue mid-tone shadow' }
	];

	const v5Data: SwatchRow[] = [
		{
			token: '--data-teal',
			dark: '#0D9488',
			light: '#0F766E',
			use: 'tech-spec annotations, dossier mode'
		},
		{ token: '--data-cyan', dark: '#5EEAD4', light: '#14B8A6', use: 'active data points' },
		{
			token: '--data-teal-rgba',
			dark: 'rgba(13,148,136,0.18)',
			light: 'rgba(15,118,110,0.14)',
			use: 'data accent fill'
		}
	];

	const v5Ink: SwatchRow[] = [
		{ token: '--ink-bright', dark: '#FAF8F4', light: '#1C1917', use: 'primary text' },
		{ token: '--ink-mid', dark: '#A8A095', light: '#44403C', use: 'body / secondary text' },
		{ token: '--ink-dim', dark: '#5C4F47', light: '#78716C', use: 'captions, mono labels' },
		{ token: '--ink-muted', dark: '#3A302A', light: '#A8A29E', use: 'disabled, placeholders' }
	];

	const v5PoolRgb: SwatchRow[] = [
		{
			token: '--pool-rgb',
			dark: '245, 158, 11',
			light: '217, 119, 6',
			use: 'sodium-pool radial gradient origin',
			isRgb: true
		},
		{
			token: '--pool-deep-rgb',
			dark: '180, 83, 9',
			light: '180, 83, 9',
			use: 'sodium-pool radial gradient falloff',
			isRgb: true
		}
	];

	// §03 — Legacy tokens (deprecated, bridge only — Phase 7 cleanup)
	const legacyPrimary: SwatchRow[] = [
		{ token: '--primary', dark: '#2DD4BF', light: '#0D9488', use: 'legacy teal primary' },
		{ token: '--primary-dark', dark: '#14B8A6', light: '#0F766E', use: 'legacy hover' },
		{ token: '--primary-darker', dark: '#0D9488', light: '#115E59', use: 'legacy pressed' },
		{ token: '--primary-light', dark: '#5EEAD4', light: '#14B8A6', use: 'legacy soft' },
		{ token: '--primary-lighter', dark: '#99F6E4', light: '#2DD4BF', use: 'legacy lighter tint' },
		{ token: '--primary-lightest', dark: '#CCFBF1', light: '#5EEAD4', use: 'legacy lightest tint' },
		{
			token: '--primary-glow',
			dark: 'rgba(45,212,191,0.40)',
			light: 'rgba(13,148,136,0.25)',
			use: 'legacy glow alpha'
		},
		{
			token: '--primary-subtle',
			dark: 'rgba(45,212,191,0.12)',
			light: 'rgba(13,148,136,0.08)',
			use: 'legacy subtle bg'
		}
	];

	const legacySecondary: SwatchRow[] = [
		{ token: '--secondary', dark: '#FB7185', light: '#E11D48', use: 'legacy rose accent' },
		{ token: '--secondary-dark', dark: '#F43F5E', light: '#BE123C', use: 'legacy rose hover' },
		{ token: '--secondary-light', dark: '#FDA4AF', light: '#F43F5E', use: 'legacy rose soft' },
		{
			token: '--secondary-glow',
			dark: 'rgba(251,113,133,0.40)',
			light: 'rgba(225,29,72,0.25)',
			use: 'legacy rose glow'
		},
		{
			token: '--secondary-subtle',
			dark: 'rgba(251,113,133,0.12)',
			light: 'rgba(225,29,72,0.08)',
			use: 'legacy rose subtle'
		}
	];

	const legacyAccent: SwatchRow[] = [
		{ token: '--accent', dark: '#A78BFA', light: '#7C3AED', use: 'legacy purple accent' },
		{ token: '--accent-dark', dark: '#7C3AED', light: '#6D28D9', use: 'legacy purple hover' },
		{ token: '--accent-light', dark: '#C4B5FD', light: '#8B5CF6', use: 'legacy purple soft' },
		{
			token: '--accent-glow',
			dark: 'rgba(167,139,250,0.40)',
			light: 'rgba(124,58,237,0.20)',
			use: 'legacy purple glow'
		},
		{
			token: '--accent-subtle',
			dark: 'rgba(167,139,250,0.12)',
			light: 'rgba(124,58,237,0.06)',
			use: 'legacy purple subtle'
		}
	];

	const legacySurface: SwatchRow[] = [
		{ token: '--bg-base', dark: '#0C0A09', light: '#FAFAF9', use: 'legacy page background' },
		{ token: '--bg-deep', dark: '#1C1917', light: '#F5F5F4', use: 'legacy secondary surface' },
		{ token: '--bg-surface', dark: '#292524', light: '#FFFFFF', use: 'legacy card surface' },
		{ token: '--bg-elevated', dark: '#44403C', light: '#E7E5E4', use: 'legacy elevated, hover' },
		{ token: '--bg-highlight', dark: '#57534E', light: '#D6D3D1', use: 'legacy active, selected' }
	];

	const legacyText: SwatchRow[] = [
		{ token: '--text-primary', dark: '#FAFAF9', light: '#1C1917', use: 'legacy primary text' },
		{ token: '--text-secondary', dark: '#A8A29E', light: '#57534E', use: 'legacy body text' },
		{ token: '--text-tertiary', dark: '#78716C', light: '#78716C', use: 'legacy caption' },
		{ token: '--text-muted', dark: '#57534E', light: '#A8A29E', use: 'legacy muted' }
	];

	// §04 — Semantic
	const semantic: SwatchRow[] = [
		{ token: '--success', dark: '#10B981', light: '#10B981', use: 'success states' },
		{ token: '--warning', dark: '#F59E0B', light: '#F59E0B', use: 'warning states' },
		{ token: '--error', dark: '#EF4444', light: '#EF4444', use: 'error states' },
		{ token: '--error-700', dark: '#DC2626', light: '#DC2626', use: 'error pressed / strong' }
	];

	// §05 — Enneagram type colors
	type EnneType = { num: number; name: string; hex: string; token: string };
	const enneagramTypes: EnneType[] = [
		{ num: 1, name: 'The Perfectionist', hex: '#6366F1', token: '--type-1-color' },
		{ num: 2, name: 'The Helper', hex: '#F472B6', token: '--type-2-color' },
		{ num: 3, name: 'The Achiever', hex: '#F59E0B', token: '--type-3-color' },
		{ num: 4, name: 'The Individualist', hex: '#A855F7', token: '--type-4-color' },
		{ num: 5, name: 'The Investigator', hex: '#0EA5E9', token: '--type-5-color' },
		{ num: 6, name: 'The Loyalist', hex: '#22C55E', token: '--type-6-color' },
		{ num: 7, name: 'The Enthusiast', hex: '#FBBF24', token: '--type-7-color' },
		{ num: 8, name: 'The Challenger', hex: '#DC2626', token: '--type-8-color' },
		{ num: 9, name: 'The Peacemaker', hex: '#34D399', token: '--type-9-color' }
	];

	// §06 — Type scale samples (V5 lock)
	type TypeScaleRow = {
		token: string;
		px: string;
		family: 'inter' | 'mono';
		weight: number;
		tracking: string;
		lineHeight: string;
		sample: string;
		uppercase?: boolean;
	};
	const displaySample = 'See the emotions behind every take.';
	const bodySample = 'The give-first mechanic keeps every comment honest.';
	const monoSample = '§04 · DOSSIER · LAB-LOG · 2026-05-04';
	const typeScale: TypeScaleRow[] = [
		{
			token: 'display-xl',
			px: '72px',
			family: 'inter',
			weight: 800,
			tracking: '-0.04em',
			lineHeight: '1.02',
			sample: displaySample
		},
		{
			token: 'display-lg',
			px: '56px',
			family: 'inter',
			weight: 800,
			tracking: '-0.03em',
			lineHeight: '1.05',
			sample: displaySample
		},
		{
			token: 'display-md',
			px: '40px',
			family: 'inter',
			weight: 700,
			tracking: '-0.02em',
			lineHeight: '1.10',
			sample: displaySample
		},
		{
			token: 'display-sm',
			px: '28px',
			family: 'inter',
			weight: 700,
			tracking: '-0.015em',
			lineHeight: '1.15',
			sample: displaySample
		},
		{
			token: 'body-lg',
			px: '18px',
			family: 'inter',
			weight: 400,
			tracking: '0',
			lineHeight: '1.55',
			sample: bodySample
		},
		{
			token: 'body',
			px: '16px',
			family: 'inter',
			weight: 400,
			tracking: '0',
			lineHeight: '1.55',
			sample: bodySample
		},
		{
			token: 'body-sm',
			px: '14px',
			family: 'inter',
			weight: 400,
			tracking: '0',
			lineHeight: '1.50',
			sample: bodySample
		},
		{
			token: 'mono',
			px: '12px',
			family: 'mono',
			weight: 500,
			tracking: '0.08em',
			lineHeight: '1.20',
			sample: monoSample,
			uppercase: true
		},
		{
			token: 'mono-lg',
			px: '14px',
			family: 'mono',
			weight: 500,
			tracking: '0.06em',
			lineHeight: '1.20',
			sample: monoSample,
			uppercase: true
		}
	];

	// §07 — Spacing
	type SpaceRow = { token: string; px: number; use: string };
	const spacing: SpaceRow[] = [
		{ token: 'xs', px: 4, use: 'hairlines, icon padding' },
		{ token: 'sm', px: 8, use: 'tight gaps between paired elements' },
		{ token: 'md', px: 12, use: 'default small gap' },
		{ token: 'lg', px: 16, use: 'default card padding, default body gap' },
		{ token: 'xl', px: 24, use: 'section gaps inside a card' },
		{ token: '2xl', px: 32, use: 'section gaps on a page' },
		{ token: '3xl', px: 48, use: 'major section breaks, hero padding' }
	];

	// §11 — Button rendering
	const buttonVariants = ['primary', 'secondary', 'ghost', 'danger'] as const;
	const buttonSizes = ['sm', 'md', 'lg'] as const;

	// Section kicker example data
	const sectionKickerExamples = [
		{ num: '02', label: 'OBSERVATION' },
		{ num: '06', label: 'THE FLOOR IS OPEN' },
		{ num: '08', label: 'CASE FILES' },
		{ num: '11', label: 'COMPONENTS' }
	];

	// Greek pantheon enneagram positions for §12 inline SVG
	const enneagramPositions: { cx: number; cy: number; type: number }[] = Array.from(
		{ length: 9 },
		(_, i) => {
			const angle = (Math.PI * 2 * i) / 9 - Math.PI / 2;
			return {
				cx: 60 + Math.cos(angle) * 44,
				cy: 60 + Math.sin(angle) * 44,
				type: i + 1
			};
		}
	);
</script>

<svelte:head>
	<title>Styleguide · 9takes Design System</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta
		name="description"
		content="9takes design system test bench — every locked V5 token + every base component, theme-aware."
	/>
</svelte:head>

<div class="styleguide" class:sg-light={theme === 'light'}>
	<!-- ============================================================
	  STICKY HEADER BAR — kicker + theme toggle
	============================================================ -->
	{#if !bannerDismissed}
		<header class="sg-bar">
			<div class="sg-bar-inner">
				<span class="mono sg-bar-kicker">
					STYLEGUIDE · v1 · 2026-05-04 · <span class="sg-bar-lock">LOCKED</span>
				</span>
				<div class="sg-bar-actions">
					<button
						class="sg-theme-toggle"
						type="button"
						onclick={toggleTheme}
						aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
						title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
					>
						{theme === 'dark' ? '☀' : '🌙'}
					</button>
					<button
						class="sg-bar-dismiss"
						type="button"
						onclick={() => (bannerDismissed = true)}
						aria-label="Dismiss styleguide bar"
					>
						✕
					</button>
				</div>
			</div>
		</header>
	{/if}

	<!-- ============================================================
	  PAGE LAYOUT — sidebar ToC + main column
	============================================================ -->
	<div class="sg-layout" class:sg-bar-shown={!bannerDismissed}>
		<aside class="sg-toc" aria-label="Styleguide table of contents">
			<div class="sg-toc-inner">
				<span class="mono sg-toc-title">CONTENTS</span>
				<ol class="sg-toc-list">
					{#each sections as s}
						<li>
							<a class="mono" href={`#${s.id}`}>
								<span class="sg-toc-num">§{s.num}</span>
								<span class="sg-toc-label">{s.label}</span>
							</a>
						</li>
					{/each}
				</ol>
				<p class="mono sg-toc-foot">
					DOCS · <a href="/design-preview/v5">/design-preview/v5</a>
				</p>
			</div>
		</aside>

		<main class="sg-main">
			<!-- =====================================================
			  §00 — HEADER / TITLE
			===================================================== -->
			<section id="s00" class="sg-section sg-section--hero">
				<span class="mono sg-kicker">§00 · STYLEGUIDE</span>
				<h1 class="sg-wordmark">9takes</h1>
				<p class="mono sg-hero-mono">DESIGN SYSTEM · STREETLAMP SYMPOSIUM · V5 LOCK · 2026-05-04</p>
				<p class="sg-hero-lede">
					Every locked V5 token, every base component, both modes — one screen. This is the
					reference. If it isn&rsquo;t here, it doesn&rsquo;t exist.
				</p>
			</section>

			<!-- =====================================================
			  §01 — BRAND FOUNDATIONS
			===================================================== -->
			<section id="s01" class="sg-section">
				<span class="mono sg-kicker">§01 · BRAND</span>
				<h2 class="sg-h2">Brand foundations</h2>

				<div class="sg-brand-grid">
					<div class="sg-brand-card">
						<span class="mono sg-brand-label">TAGLINE</span>
						<p class="sg-brand-tagline">See the emotions behind every take.</p>
					</div>
					<div class="sg-brand-card">
						<span class="mono sg-brand-label">MOOD</span>
						<p class="sg-brand-mood">Streetlamp Symposium</p>
						<p class="sg-brand-sub">
							Warm-tech baseline — sodium-amber illumination on deep stone, Greek statues lit from
							one side, dossier annotations.
						</p>
						<p class="sg-brand-sub">
							Tech-spec dossier variant — same tokens, denser layout (mono labels, stat panels,
							case-file framing). Used on <code>/personality-analysis/*</code>.
						</p>
					</div>
					<div class="sg-brand-card">
						<span class="mono sg-brand-label">VOICE · 4 TRAITS</span>
						<div class="sg-chip-row">
							<span class="sg-chip mono">TACTICALLY DIRECT</span>
							<span class="sg-chip mono">SOCIALLY SAVVY</span>
							<span class="sg-chip mono">RESPECTFULLY PROVOCATIVE</span>
							<span class="sg-chip mono">PATTERN-RECOGNITION FOCUSED</span>
						</div>
					</div>
				</div>
			</section>

			<!-- =====================================================
			  §02 — V5 BRAND PALETTE (canonical)
			===================================================== -->
			<section id="s02" class="sg-section">
				<span class="mono sg-kicker">§02 · COLOR · V5 (CANONICAL)</span>
				<h2 class="sg-h2">V5 brand palette</h2>
				<p class="sg-section-lede">
					The canonical Streetlamp Symposium palette. New code uses these. Swatches preview the
					active theme; dark/light columns explain what the token resolves to in each.
				</p>

				{@render swatchGroup('Lamp · primary illumination', v5Lamp)}
				{@render swatchGroup('Stone · surfaces', v5Stone)}
				{@render swatchGroup('Marble · highlights', v5Marble)}
				{@render swatchGroup('Data accent · tech-spec', v5Data)}
				{@render swatchGroup('Ink · text', v5Ink)}
				{@render swatchGroup('Pool RGB triples · radial gradient origins', v5PoolRgb)}
			</section>

			<!-- =====================================================
			  §03 — LEGACY TOKENS (DEPRECATED)
			===================================================== -->
			<section id="s03" class="sg-section">
				<span class="mono sg-kicker">§03 · COLOR · LEGACY</span>
				<h2 class="sg-h2">Legacy tokens</h2>
				<div class="sg-deprecated">
					<p class="mono sg-deprecated-tag">⚠️ DEPRECATED · PHASE 7 CLEANUP</p>
					<p class="sg-deprecated-body">
						These tokens still live in <code>src/scss/index.scss</code> for the bridge migration.
						New code should use V5 tokens from §02. They get removed in Phase 7 of
						<code>docs/design/2026-05-04-rollout-plan.md</code>.
					</p>

					<div class="sg-deprecated-body-wrap">
						{@render swatchGroup('Legacy primary · teal', legacyPrimary)}
						{@render swatchGroup('Legacy secondary · rose', legacySecondary)}
						{@render swatchGroup('Legacy accent · purple', legacyAccent)}
						{@render swatchGroup('Legacy surfaces', legacySurface)}
						{@render swatchGroup('Legacy text', legacyText)}
					</div>
				</div>
			</section>

			<!-- =====================================================
			  §04 — SEMANTIC PALETTE
			===================================================== -->
			<section id="s04" class="sg-section">
				<span class="mono sg-kicker">§04 · SEMANTIC</span>
				<h2 class="sg-h2">Semantic palette</h2>
				<p class="sg-section-lede">
					Functional/status colors. Same in both modes — these are state signals, not brand.
				</p>
				{@render swatchGroup(null, semantic)}
			</section>

			<!-- =====================================================
			  §05 — ENNEAGRAM TYPE COLORS
			===================================================== -->
			<section id="s05" class="sg-section">
				<span class="mono sg-kicker">§05 · ENNEAGRAM</span>
				<h2 class="sg-h2">Enneagram type colors</h2>
				<p class="sg-section-lede">
					Data-only colors. Used to differentiate types in charts, stripes, badges. Never used as UI
					chrome.
				</p>

				<div class="sg-type-grid">
					{#each enneagramTypes as t}
						<article class="sg-type-card" style={`--type-stripe: var(${t.token});`}>
							<span class="mono sg-type-num">№ {String(t.num).padStart(2, '0')}</span>
							<p class="sg-type-name">{t.name}</p>
							<span class="mono sg-type-hex">{t.token} · {t.hex}</span>
						</article>
					{/each}
				</div>
			</section>

			<!-- =====================================================
			  §06 — TYPOGRAPHY
			===================================================== -->
			<section id="s06" class="sg-section">
				<span class="mono sg-kicker">§06 · TYPOGRAPHY</span>
				<h2 class="sg-h2">Type scale</h2>
				<p class="sg-section-lede">
					Inter Variable (weights 400–800) + JetBrains Mono. No serif. No third sans. Locked
					2026-05-04.
				</p>

				<div class="sg-type-scale">
					{#each typeScale as t}
						<div class="sg-type-row">
							<div class="sg-type-meta">
								<span class="mono sg-type-token">{t.token}</span>
								<span class="mono sg-type-spec">
									{t.px} · {t.family === 'inter' ? 'Inter' : 'JetBrains Mono'} · w{t.weight} · ls{t.tracking}
								</span>
							</div>
							<div
								class="sg-type-sample"
								class:sg-type-sample--mono={t.family === 'mono'}
								class:sg-type-sample--upper={t.uppercase}
								style={`font-size:${t.px};font-weight:${t.weight};letter-spacing:${t.tracking};line-height:${t.lineHeight};`}
							>
								{t.sample}
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- =====================================================
			  §07 — SPACING SCALE
			===================================================== -->
			<section id="s07" class="sg-section">
				<span class="mono sg-kicker">§07 · SPACING</span>
				<h2 class="sg-h2">Spacing scale</h2>
				<p class="sg-section-lede">
					Seven tokens. Bias smaller when in doubt — 9takes is information-dense. Arbitrary values (<code
						>p-5</code
					>, <code>gap-7</code>, <code>[20px]</code>) are banned.
				</p>

				<div class="sg-space-rail">
					{#each spacing as s}
						<div class="sg-space-row">
							<span class="mono sg-space-token">{s.token}</span>
							<div class="sg-space-bar-wrap">
								<div class="sg-space-bar" style={`width:${s.px}px;`}></div>
							</div>
							<span class="mono sg-space-px">{s.px}px</span>
							<span class="sg-space-use">{s.use}</span>
						</div>
					{/each}
				</div>
			</section>

			<!-- =====================================================
			  §08 — RADIUS SCALE
			===================================================== -->
			<section id="s08" class="sg-section">
				<span class="mono sg-kicker">§08 · RADIUS</span>
				<h2 class="sg-h2">Radius scale</h2>
				<p class="sg-section-lede">
					Stamped-and-soft. Locked 2026-04-27 and lint-enforced (<code>pnpm lint:radius</code>).
				</p>

				<div class="sg-radius-grid">
					<figure class="sg-radius-fig">
						<div class="sg-radius-box" style="border-radius:0.25rem;"></div>
						<figcaption class="mono">rounded-sm · 4px · tiny inline (badges, dots)</figcaption>
					</figure>
					<figure class="sg-radius-fig">
						<div class="sg-radius-box" style="border-radius:0.625rem;"></div>
						<figcaption class="mono">rounded-md · 10px · buttons, inputs, chips</figcaption>
					</figure>
					<figure class="sg-radius-fig">
						<div class="sg-radius-box" style="border-radius:1rem;"></div>
						<figcaption class="mono">rounded-xl · 16px · cards, modals, banners</figcaption>
					</figure>
					<figure class="sg-radius-fig">
						<div class="sg-radius-box" style="border-radius:9999px;"></div>
						<figcaption class="mono">rounded-full · pills, avatars, spinners</figcaption>
					</figure>
				</div>

				<div class="sg-callout sg-callout--banned">
					<span class="mono sg-callout-tag">❌ BANNED · LINT-ENFORCED</span>
					<p>
						<code>rounded-lg</code> · <code>rounded-2xl</code> · <code>rounded-3xl</code> ·
						<code>rounded-[Npx]</code>. See <code>scripts/lint-radius.js</code>.
					</p>
				</div>
			</section>

			<!-- =====================================================
			  §09 — SHADOW SYSTEM
			===================================================== -->
			<section id="s09" class="sg-section">
				<span class="mono sg-kicker">§09 · SHADOW</span>
				<h2 class="sg-h2">Shadow system</h2>
				<p class="sg-section-lede">
					Default position: shadows are mostly OFF. Borders do the work. Shadows are reserved for
					floating UI (modals, popovers, dropdowns) and hover state on interactive cards.
				</p>

				<div class="sg-shadow-grid">
					<figure class="sg-shadow-fig">
						<div class="sg-shadow-box" style="box-shadow:var(--shadow-sm);"></div>
						<figcaption class="mono">--shadow-sm · subtle hover</figcaption>
					</figure>
					<figure class="sg-shadow-fig">
						<div class="sg-shadow-box" style="box-shadow:var(--shadow-md);"></div>
						<figcaption class="mono">--shadow-md · default elevated</figcaption>
					</figure>
					<figure class="sg-shadow-fig">
						<div class="sg-shadow-box" style="box-shadow:var(--shadow-lg);"></div>
						<figcaption class="mono">--shadow-lg · modals, sheets</figcaption>
					</figure>
					<figure class="sg-shadow-fig">
						<div class="sg-shadow-box" style="box-shadow:var(--shadow-xl);"></div>
						<figcaption class="mono">--shadow-xl · highest float</figcaption>
					</figure>
				</div>
			</section>

			<!-- =====================================================
			  §10 — MOTION (placeholder)
			===================================================== -->
			<section id="s10" class="sg-section">
				<span class="mono sg-kicker">§10 · MOTION</span>
				<h2 class="sg-h2">Motion</h2>
				<div class="sg-callout sg-callout--note">
					<span class="mono sg-callout-tag">⏸ NOT YET LOCKED</span>
					<p>
						Motion tokens (durations, easings, reduced-motion rules) are still open. The proposal
						lives in <code>docs/design-system.md</code> §10. This section reserves the slot — don&rsquo;t
						demo motion until the tokens are ratified.
					</p>
				</div>
			</section>

			<!-- =====================================================
			  §11 — BASE COMPONENTS
			===================================================== -->
			<section id="s11" class="sg-section">
				<span class="mono sg-kicker">§11 · COMPONENTS</span>
				<h2 class="sg-h2">Base components</h2>
				<p class="sg-section-lede">
					Canonical visual specs for the atoms 9takes ships (or wants to ship in Phase 3). Buttons
					and cards have no resting glow; hover is a solid color shift, not a gradient. Borders do
					the elevation work.
				</p>

				<!-- ----- Buttons ----- -->
				<h3 class="sg-h3">Buttons</h3>
				<div class="sg-btn-grid">
					{#each buttonVariants as variant}
						<div class="sg-btn-row">
							<span class="mono sg-btn-label">{variant}</span>
							<div class="sg-btn-line">
								{#each buttonSizes as size}
									<button type="button" class={`sg-btn sg-btn--${variant} sg-btn--${size}`}>
										{variant === 'primary'
											? 'Drop your take'
											: variant === 'secondary'
												? 'Secondary'
												: variant === 'ghost'
													? 'Skip'
													: 'Delete'}
									</button>
								{/each}
								<button type="button" class={`sg-btn sg-btn--${variant} sg-btn--md`} disabled>
									Disabled
								</button>
							</div>
						</div>
					{/each}
				</div>

				<!-- ----- Form controls ----- -->
				<h3 class="sg-h3">Form controls</h3>
				<div class="sg-form-grid">
					<label class="sg-field">
						<span class="mono sg-field-label">TEXT INPUT</span>
						<input class="sg-input" type="text" placeholder="What did you read in the room?" />
					</label>
					<label class="sg-field">
						<span class="mono sg-field-label">SELECT</span>
						<select class="sg-input">
							<option>Choose your type…</option>
							{#each enneagramTypes as t}
								<option>Type {t.num} · {t.name}</option>
							{/each}
						</select>
					</label>
					<label class="sg-field sg-field--full">
						<span class="mono sg-field-label">TEXTAREA</span>
						<textarea
							class="sg-textarea"
							rows="3"
							placeholder="Drop your take, anonymously, before you see anyone else's…"
						></textarea>
					</label>
				</div>

				<!-- ----- Cards ----- -->
				<h3 class="sg-h3">Cards</h3>
				<div class="sg-card-grid">
					<article class="sg-card">
						<span class="mono sg-card-eyebrow">STATIC CARD</span>
						<h4 class="sg-card-title">The Type 5 read</h4>
						<p class="sg-card-body">
							A laboratory was the only room where the rules made sense. The investigator leads with
							the system underneath.
						</p>
					</article>
					<article class="sg-card sg-card--interactive">
						<span class="mono sg-card-eyebrow">INTERACTIVE CARD · HOVER ME</span>
						<h4 class="sg-card-title">The Type 8 read</h4>
						<p class="sg-card-body">
							Refusing to fold to keep things polite when something is actually wrong. Border lifts
							to <code>--ink-dim</code>; no shadow change.
						</p>
					</article>
				</div>

				<!-- ----- Tags / Chips ----- -->
				<h3 class="sg-h3">Tags &amp; chips</h3>
				<div class="sg-tag-row">
					<span class="sg-tag sg-tag--primary mono">PRIMARY</span>
					<span class="sg-tag sg-tag--neutral mono">NEUTRAL</span>
					<span class="sg-tag sg-tag--data mono">DATA · TEAL</span>
					<span class="sg-tag sg-tag--type mono" style="--type-stripe:var(--type-4-color);">
						TYPE 4 · INDIVIDUALIST
					</span>
				</div>

				<!-- ----- Spinner ----- -->
				<h3 class="sg-h3">Spinner</h3>
				<div class="sg-spinner-row">
					<div class="sg-spinner-block">
						<span class="sg-spinner sg-spinner--sm" role="status" aria-label="Loading"></span>
						<span class="mono">SM · 16px</span>
					</div>
					<div class="sg-spinner-block">
						<span class="sg-spinner sg-spinner--md" role="status" aria-label="Loading"></span>
						<span class="mono">MD · 24px</span>
					</div>
					<div class="sg-spinner-block">
						<span class="sg-spinner sg-spinner--lg" role="status" aria-label="Loading"></span>
						<span class="mono">LG · 36px</span>
					</div>
				</div>

				<!-- ----- Modal preview ----- -->
				<h3 class="sg-h3">Modal preview</h3>
				<div class="sg-modal-preview-stage">
					<div class="sg-modal" role="dialog" aria-label="Modal preview (static)">
						<header class="sg-modal-header">
							<span class="mono sg-modal-eyebrow">MODAL · CANONICAL SPEC</span>
							<h4 class="sg-modal-title">Drop your take first.</h4>
						</header>
						<p class="sg-modal-body">
							This is a static preview — no overlay. Modals are <code>rounded-xl</code>, 1px
							<code>--stone-edge</code> border, <code>--shadow-lg</code>, max-w-md.
						</p>
						<footer class="sg-modal-footer">
							<button type="button" class="sg-btn sg-btn--ghost sg-btn--md">Cancel</button>
							<button type="button" class="sg-btn sg-btn--primary sg-btn--md">Continue</button>
						</footer>
					</div>
				</div>

				<!-- ----- Empty state ----- -->
				<h3 class="sg-h3">Empty state</h3>
				<p class="sg-section-lede">
					Visual spec on the left, live <code>&lt;EmptyState&gt;</code> atom on the right. Pages should
					use the atom; spec stays for reference.
				</p>
				<div class="sg-state-pair">
					<div class="sg-state sg-state--empty">
						<svg
							class="sg-state-icon"
							viewBox="0 0 48 48"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<circle cx="20" cy="20" r="11" />
							<line x1="29" y1="29" x2="40" y2="40" />
						</svg>
						<h4 class="sg-state-title">No results found</h4>
						<p class="sg-state-body">Try a different search term.</p>
						<button type="button" class="sg-btn sg-btn--primary sg-btn--sm">Clear filters</button>
					</div>
					<div class="sg-state-live">
						<EmptyState title="No results found" body="Try a different search term.">
							{#snippet cta()}
								<Button variant="primary" size="sm">Clear filters</Button>
							{/snippet}
						</EmptyState>
					</div>
				</div>

				<!-- ----- Error state ----- -->
				<h3 class="sg-h3">Error state</h3>
				<p class="sg-section-lede">
					Visual spec on the left, live <code>&lt;ErrorState&gt;</code> atom on the right.
				</p>
				<div class="sg-state-pair">
					<div class="sg-state sg-state--error">
						<svg
							class="sg-state-icon sg-state-icon--error"
							viewBox="0 0 48 48"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<circle cx="24" cy="24" r="18" />
							<line x1="24" y1="14" x2="24" y2="26" />
							<line x1="24" y1="32" x2="24" y2="34" />
						</svg>
						<h4 class="sg-state-title sg-state-title--error">Something went wrong</h4>
						<p class="sg-state-body">We couldn&rsquo;t load this section.</p>
						<button type="button" class="sg-btn sg-btn--danger sg-btn--sm">Retry</button>
					</div>
					<div class="sg-state-live">
						<ErrorState title="Something went wrong" body="We couldn’t load this section.">
							{#snippet cta()}
								<Button variant="danger" size="sm">Retry</Button>
							{/snippet}
						</ErrorState>
					</div>
				</div>

				<!-- ----- Section kicker ----- -->
				<h3 class="sg-h3">Section kicker</h3>
				<p class="sg-section-lede">
					The <code>§NN · LABEL</code> mono pattern V5 uses everywhere. Spec for the future
					<code>&lt;SectionKicker&gt;</code> atom (Phase 3).
				</p>
				<div class="sg-kicker-stack">
					{#each sectionKickerExamples as k}
						<span class="mono sg-kicker">§{k.num} · {k.label}</span>
					{/each}
				</div>
			</section>

			<!-- =====================================================
			  §12 — BRAND VOCAB / IMAGERY
			===================================================== -->
			<section id="s12" class="sg-section">
				<span class="mono sg-kicker">§12 · VOCAB</span>
				<h2 class="sg-h2">Brand vocab &amp; imagery</h2>
				<p class="sg-section-lede">
					The visual anchors. Greek statues and the Enneagram diagram are the recurring symbols; the
					chiaroscuro filter only fires in dark mode (lit-from-one-side feel).
				</p>

				<div class="sg-vocab-grid">
					<figure class="sg-vocab-fig">
						<div class="sg-vocab-frame sg-vocab-frame--statue">
							<img
								src="/greek_distorted_statue_face.png"
								alt="Greek distorted statue face — visual anchor for personality reads"
								class="sg-vocab-img sg-vocab-img--statue"
								loading="lazy"
								decoding="async"
							/>
							<div class="sg-vocab-vignette" aria-hidden="true"></div>
						</div>
						<figcaption class="mono">9TAKES · ONE SUBJECT · NINE READS</figcaption>
					</figure>

					<figure class="sg-vocab-fig">
						<div class="sg-vocab-frame">
							<img
								src="/greek_pantheon.webp"
								alt="Greek pantheon — Library cover"
								class="sg-vocab-img"
								loading="lazy"
								decoding="async"
							/>
						</div>
						<figcaption class="mono">THE PANTHEON · CASE FILES</figcaption>
					</figure>

					<figure class="sg-vocab-fig">
						<div class="sg-vocab-frame">
							<img
								src="/philosopher-gathering.webp"
								alt="Philosopher gathering — the give-first table"
								class="sg-vocab-img"
								loading="lazy"
								decoding="async"
							/>
						</div>
						<figcaption class="mono">PHILOSOPHERS · GIVE-FIRST</figcaption>
					</figure>

					<figure class="sg-vocab-fig sg-vocab-fig--diagram">
						<div class="sg-vocab-frame sg-vocab-frame--diagram">
							<svg
								viewBox="0 0 120 120"
								xmlns="http://www.w3.org/2000/svg"
								class="sg-enneagram"
								role="img"
								aria-label="Enneagram diagram — 9 dots connected by triangle 9-3-6 and hexad 1-4-2-8-5-7"
							>
								{#each enneagramPositions as p}
									<circle cx={p.cx} cy={p.cy} r="4.5" class="sg-enn-dot" />
								{/each}
								<polygon
									points="60,16 98.1,82 21.9,82"
									fill="none"
									class="sg-enn-line sg-enn-tri"
								/>
								<polyline
									points="86.2,29.5 78.4,103.0 35.5,93.5 33.8,29.5 81.2,103.0 41.6,103.0 86.2,29.5"
									fill="none"
									class="sg-enn-line sg-enn-hex"
								/>
							</svg>
						</div>
						<figcaption class="mono">THE 9 · CONNECTED</figcaption>
					</figure>
				</div>
			</section>

			<!-- =====================================================
			  FOOTER
			===================================================== -->
			<footer class="sg-footer">
				<p class="mono">
					Source of truth: <code>docs/design-system.md</code> · Live spec:
					<code>docs/design/2026-05-04-rollout-plan.md</code> · Lock candidate:
					<a href="/design-preview/v5">/design-preview/v5</a>
				</p>
			</footer>
		</main>
	</div>
</div>

<!-- ============================================================
  Snippet — swatch group renderer. Kept inline so the file has no
  external component dependencies (the styleguide is self-contained
  by design — it is the reference, not a consumer of one).
============================================================ -->
{#snippet swatchGroup(title: string | null, rows: SwatchRow[])}
	<div class="sg-swatch-group">
		{#if title}
			<h3 class="sg-h3">{title}</h3>
		{/if}
		<div class="sg-swatch-table" role="table">
			<div class="sg-swatch-row sg-swatch-row--head" role="row">
				<span class="mono" role="columnheader">TOKEN</span>
				<span class="mono" role="columnheader">SWATCH</span>
				<span class="mono" role="columnheader">DARK</span>
				<span class="mono" role="columnheader">LIGHT</span>
				<span class="mono" role="columnheader">USE</span>
			</div>
			{#each rows as r}
				<div class="sg-swatch-row" role="row">
					<span class="mono sg-swatch-token" role="cell">{r.token}</span>
					<span class="sg-swatch-cell" role="cell">
						{#if r.isRgb}
							<span
								class="sg-swatch-chip sg-swatch-chip--rgb mono"
								style={`background:rgb(var(${r.token}));`}
								aria-hidden="true"
							>
								rgb
							</span>
						{:else}
							<span class="sg-swatch-chip" style={`background:var(${r.token});`} aria-hidden="true"
							></span>
						{/if}
					</span>
					<span class="mono sg-swatch-hex" role="cell">{r.dark}</span>
					<span class="mono sg-swatch-hex" role="cell">{r.light}</span>
					<span class="sg-swatch-use" role="cell">{r.use}</span>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

<style lang="scss">
	/* =============================================================
	  STYLEGUIDE — scoped only. Reads global tokens (--lamp-glow,
	  --stone-warm, --ink-bright, --shadow-md, etc.) defined in
	  src/scss/index.scss. Does NOT redefine them.
	============================================================= */

	/* Localised mono utility — the global `.mono` is also fine here, but
	   scoping it means future global edits can't drift the styleguide. */
	.styleguide :global(.mono) {
		font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.styleguide {
		min-height: 100vh;
		background: var(--night-deep);
		color: var(--ink-bright);
		font-family: var(--font-family, 'Inter Variable', 'Inter', system-ui, sans-serif);
		line-height: 1.55;
		position: relative;
		isolation: isolate;
	}

	/* Reset margins on scoped headings/paragraphs that the global SCSS
	   would otherwise pad. We're a clean slate inside .styleguide. */
	.styleguide :global(h1),
	.styleguide :global(h2),
	.styleguide :global(h3),
	.styleguide :global(h4),
	.styleguide :global(p) {
		margin: 0;
		padding: 0;
		font-weight: inherit;
	}

	.styleguide :global(code) {
		font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
		font-size: 0.9em;
		padding: 0.1rem 0.3rem;
		background: var(--stone-mid);
		color: var(--ink-bright);
		border-radius: 0.25rem;
	}

	/* ----- sticky bar ----- */
	.sg-bar {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--night-mid);
		border-bottom: 1px solid var(--stone-edge);
		padding: 10px 24px;
	}

	.sg-bar-inner {
		max-width: 1280px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.sg-bar-kicker {
		color: var(--lamp-glow);
		letter-spacing: 0.1em;
	}
	.sg-bar-lock {
		color: var(--data-cyan);
	}

	.sg-bar-actions {
		display: inline-flex;
		gap: 8px;
		align-items: center;
	}

	.sg-theme-toggle,
	.sg-bar-dismiss {
		background: var(--stone-warm);
		color: var(--ink-bright);
		border: 1px solid var(--stone-edge);
		font-size: 14px;
		line-height: 1;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition:
			background 0.18s ease,
			border-color 0.18s ease;
	}

	.sg-theme-toggle {
		width: 36px;
		height: 36px;
		border-radius: 9999px;
		font-size: 16px;

		&:hover {
			border-color: var(--lamp-glow);
		}
		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}
	}

	.sg-bar-dismiss {
		width: 26px;
		height: 26px;
		border-radius: 0.25rem;

		&:hover {
			border-color: var(--lamp-glow);
		}
		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}
	}

	/* ----- layout ----- */
	.sg-layout {
		max-width: 1280px;
		margin: 0 auto;
		padding: 32px 24px 96px;
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 32px;

		@media (max-width: 968px) {
			grid-template-columns: 1fr;
			gap: 16px;
			padding: 24px 16px 64px;
		}
	}

	.sg-toc {
		@media (max-width: 968px) {
			/* Mobile: collapse to a horizontal scroll strip below the bar. */
			position: sticky;
			top: 56px;
			z-index: 5;
			margin: 0 -16px;
			padding: 12px 16px;
			background: var(--night-mid);
			border-bottom: 1px solid var(--stone-edge);
		}
	}

	.sg-toc-inner {
		position: sticky;
		top: 80px;

		@media (max-width: 968px) {
			position: static;
			top: auto;
		}
	}

	.sg-toc-title {
		display: block;
		color: var(--ink-dim);
		margin-bottom: 12px;
		letter-spacing: 0.1em;
	}

	.sg-toc-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;

		@media (max-width: 968px) {
			flex-direction: row;
			overflow-x: auto;
			gap: 8px;
			scrollbar-width: thin;
			-webkit-overflow-scrolling: touch;
		}

		li {
			display: block;
			@media (max-width: 968px) {
				flex: 0 0 auto;
			}
		}

		a {
			display: inline-flex;
			gap: 8px;
			padding: 6px 8px;
			color: var(--ink-mid);
			text-decoration: none;
			border-left: 1px solid transparent;
			transition:
				color 0.18s ease,
				border-color 0.18s ease;
			letter-spacing: 0.06em;
			font-size: 11px;

			&:hover {
				color: var(--lamp-glow);
				border-left-color: var(--lamp-glow);
			}

			&:focus-visible {
				outline: 2px solid var(--lamp-glow);
				outline-offset: 2px;
			}
		}
	}

	.sg-toc-num {
		color: var(--lamp-glow);
		font-weight: 600;
	}

	.sg-toc-foot {
		margin-top: 16px;
		color: var(--ink-dim);

		a {
			color: var(--lamp-glow);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}

		@media (max-width: 968px) {
			display: none;
		}
	}

	/* ----- main column ----- */
	.sg-main {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 64px;
	}

	.sg-section {
		scroll-margin-top: 88px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.sg-section--hero {
		padding-bottom: 16px;
		border-bottom: 1px solid var(--stone-edge);
	}

	.sg-kicker {
		color: var(--lamp-glow);
		display: inline-block;
	}

	.sg-h2 {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-size: clamp(28px, 3.2vw, 40px);
		line-height: 1.1;
		letter-spacing: -0.02em;
		font-weight: 700;
		color: var(--ink-bright);
	}

	.sg-h3 {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-size: 20px;
		line-height: 1.25;
		letter-spacing: -0.01em;
		font-weight: 600;
		color: var(--ink-bright);
		margin-top: 16px;
	}

	.sg-section-lede {
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 68ch;
	}

	/* ----- §00 hero ----- */
	.sg-wordmark {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-weight: 800;
		font-size: clamp(56px, 9vw, 96px);
		line-height: 1;
		letter-spacing: -0.04em;
		color: var(--lamp-glow);
	}

	.sg-hero-mono {
		color: var(--ink-dim);
	}

	.sg-hero-lede {
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-mid);
		max-width: 60ch;
	}

	/* ----- §01 brand ----- */
	.sg-brand-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 16px;
	}

	.sg-brand-card {
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.sg-brand-label {
		color: var(--lamp-glow);
	}

	.sg-brand-tagline {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-weight: 700;
		font-size: 22px;
		line-height: 1.2;
		letter-spacing: -0.01em;
		color: var(--ink-bright);
	}

	.sg-brand-mood {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-weight: 700;
		font-size: 24px;
		line-height: 1.2;
		letter-spacing: -0.015em;
		color: var(--lamp-glow);
	}

	.sg-brand-sub {
		font-size: 14px;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	.sg-chip-row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 4px;
	}

	.sg-chip {
		display: inline-flex;
		align-items: center;
		padding: 4px 8px;
		border-radius: 0.625rem;
		background: var(--lamp-soft);
		border: 1px solid var(--lamp-glow);
		color: var(--lamp-glow);
		font-size: 10px;
		letter-spacing: 0.08em;
	}

	/* ----- swatch table ----- */
	.sg-swatch-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.sg-swatch-table {
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		overflow: hidden;
		background: var(--stone-warm);
	}

	.sg-swatch-row {
		display: grid;
		grid-template-columns: minmax(160px, 1.4fr) 80px minmax(140px, 1fr) minmax(140px, 1fr) minmax(
				160px,
				2fr
			);
		align-items: center;
		gap: 12px;
		padding: 10px 14px;
		border-top: 1px solid var(--stone-edge);

		&:first-child {
			border-top: none;
		}

		@media (max-width: 720px) {
			grid-template-columns: 1fr 60px;
			grid-template-areas:
				'token swatch'
				'dark  swatch'
				'light swatch'
				'use   use';
			gap: 4px 12px;
			padding: 12px 14px;

			& > *:nth-child(1) {
				grid-area: token;
			}
			& > *:nth-child(2) {
				grid-area: swatch;
				justify-self: end;
			}
			& > *:nth-child(3) {
				grid-area: dark;
			}
			& > *:nth-child(4) {
				grid-area: light;
			}
			& > *:nth-child(5) {
				grid-area: use;
				margin-top: 4px;
			}
		}
	}

	.sg-swatch-row--head {
		background: var(--night-mid);
		color: var(--ink-dim);

		@media (max-width: 720px) {
			display: none;
		}
	}

	.sg-swatch-token {
		color: var(--ink-bright);
		letter-spacing: 0.06em;
		word-break: break-all;
	}

	.sg-swatch-cell {
		display: inline-flex;
		align-items: center;
	}

	.sg-swatch-chip {
		display: inline-block;
		width: 56px;
		height: 56px;
		border-radius: 0.625rem;
		border: 1px solid var(--stone-edge);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
	}

	.sg-swatch-chip--rgb {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--cta-text, var(--night-deep));
		font-size: 11px;
	}

	.sg-swatch-hex {
		color: var(--ink-mid);
		font-size: 11px;
		letter-spacing: 0.04em;
	}

	.sg-swatch-use {
		font-size: 13px;
		line-height: 1.4;
		color: var(--ink-mid);
	}

	/* ----- deprecated wrapper ----- */
	.sg-deprecated {
		border: 2px solid #f59e0b; /* warning yellow — same in both modes by design */
		border-style: dashed;
		border-radius: 1rem;
		padding: 20px;
		background: rgba(245, 158, 11, 0.05);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.sg-deprecated-tag {
		color: #f59e0b;
		font-size: 12px;
		letter-spacing: 0.1em;
	}

	.sg-deprecated-body {
		font-size: 14px;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	.sg-deprecated-body-wrap {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 8px;
	}

	/* ----- §05 enneagram type cards ----- */
	.sg-type-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;

		@media (max-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (max-width: 480px) {
			grid-template-columns: 1fr;
		}
	}

	.sg-type-card {
		position: relative;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		padding: 16px 16px 16px 22px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			inset: 0 auto 0 0;
			width: 3px;
			background: var(--type-stripe, var(--lamp-glow));
		}
	}

	.sg-type-num {
		color: var(--ink-dim);
		font-size: 11px;
	}

	.sg-type-name {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-weight: 600;
		font-size: 17px;
		color: var(--ink-bright);
		letter-spacing: -0.01em;
	}

	.sg-type-hex {
		color: var(--ink-mid);
		font-size: 10px;
	}

	/* ----- §06 type scale ----- */
	.sg-type-scale {
		display: flex;
		flex-direction: column;
		gap: 24px;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
		padding: 24px;
	}

	.sg-type-row {
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 24px;
		align-items: center;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--stone-edge);

		&:last-child {
			border-bottom: none;
			padding-bottom: 0;
		}

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 8px;
		}
	}

	.sg-type-meta {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.sg-type-token {
		color: var(--lamp-glow);
		font-size: 12px;
	}

	.sg-type-spec {
		color: var(--ink-dim);
		font-size: 10px;
	}

	.sg-type-sample {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		color: var(--ink-bright);
		text-wrap: balance;
		min-width: 0;
		overflow-wrap: break-word;
	}

	.sg-type-sample--mono {
		font-family: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
		color: var(--lamp-glow);
	}

	.sg-type-sample--upper {
		text-transform: uppercase;
	}

	/* ----- §07 spacing rail ----- */
	.sg-space-rail {
		display: flex;
		flex-direction: column;
		gap: 8px;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
		padding: 16px 20px;
	}

	.sg-space-row {
		display: grid;
		grid-template-columns: 50px 1fr 60px 2fr;
		align-items: center;
		gap: 12px;
		padding: 6px 0;
		border-bottom: 1px solid var(--stone-edge);

		&:last-child {
			border-bottom: none;
		}

		@media (max-width: 600px) {
			grid-template-columns: 50px 80px 1fr;
			grid-template-areas:
				'token bar px'
				'use   use use';

			& > *:nth-child(1) {
				grid-area: token;
			}
			& > *:nth-child(2) {
				grid-area: bar;
			}
			& > *:nth-child(3) {
				grid-area: px;
			}
			& > *:nth-child(4) {
				grid-area: use;
				margin-top: 2px;
			}
		}
	}

	.sg-space-token {
		color: var(--lamp-glow);
		font-size: 11px;
	}

	.sg-space-bar-wrap {
		min-height: 12px;
		display: flex;
		align-items: center;
	}

	.sg-space-bar {
		height: 12px;
		background: var(--lamp-glow);
		border-radius: 2px;
	}

	.sg-space-px {
		color: var(--ink-mid);
		font-size: 11px;
	}

	.sg-space-use {
		font-size: 13px;
		color: var(--ink-mid);
	}

	/* ----- §08 radius ----- */
	.sg-radius-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;

		@media (max-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.sg-radius-fig {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;

		figcaption {
			text-align: center;
			color: var(--ink-mid);
			font-size: 10px;
			line-height: 1.4;
		}
	}

	.sg-radius-box {
		width: 96px;
		height: 96px;
		background: var(--lamp-glow);
		border: 1px solid var(--stone-edge);
	}

	.sg-callout {
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		padding: 12px 16px;
		background: var(--night-mid);
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 13px;
		color: var(--ink-mid);
		line-height: 1.5;

		p {
			font-size: 13px;
		}
	}

	.sg-callout--banned {
		border-color: var(--error, #ef4444);
		background: rgba(239, 68, 68, 0.05);

		.sg-callout-tag {
			color: var(--error, #ef4444);
		}
	}

	.sg-callout--note {
		border-color: var(--lamp-glow);
		background: var(--lamp-soft);

		.sg-callout-tag {
			color: var(--lamp-glow);
		}
	}

	.sg-callout-tag {
		font-size: 11px;
	}

	/* ----- §09 shadow ----- */
	.sg-shadow-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
		padding: 32px 16px;
		background: var(--night-mid);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;

		@media (max-width: 768px) {
			grid-template-columns: repeat(2, 1fr);
			gap: 28px;
			padding: 28px 12px;
		}
	}

	.sg-shadow-fig {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;

		figcaption {
			text-align: center;
			color: var(--ink-mid);
			font-size: 10px;
			line-height: 1.4;
		}
	}

	.sg-shadow-box {
		width: 96px;
		height: 96px;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
	}

	/* ----- §11 buttons ----- */
	.sg-btn-grid {
		display: flex;
		flex-direction: column;
		gap: 16px;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
		padding: 20px;
	}

	.sg-btn-row {
		display: grid;
		grid-template-columns: 110px 1fr;
		gap: 16px;
		align-items: center;

		@media (max-width: 600px) {
			grid-template-columns: 1fr;
			gap: 8px;
		}
	}

	.sg-btn-label {
		color: var(--lamp-glow);
		font-size: 11px;
	}

	.sg-btn-line {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}

	.sg-btn {
		font-family: var(--font-family, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-weight: 600;
		border-radius: 0.625rem;
		border: 1px solid transparent;
		cursor: pointer;
		line-height: 1.2;
		transition:
			background 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease;

		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}

		&:disabled {
			opacity: 0.45;
			cursor: not-allowed;
		}
	}

	/* sizes */
	.sg-btn--sm {
		padding: 6px 12px;
		font-size: 13px;
	}
	.sg-btn--md {
		padding: 8px 16px;
		font-size: 15px;
	}
	.sg-btn--lg {
		padding: 12px 24px;
		font-size: 17px;
	}

	/* variants */
	.sg-btn--primary {
		background: var(--lamp-glow);
		color: var(--cta-text, var(--night-deep));
		border-color: var(--lamp-glow);

		&:hover:not(:disabled) {
			background: var(--lamp-deep);
			border-color: var(--lamp-deep);
		}
	}

	.sg-btn--secondary {
		background: transparent;
		color: var(--ink-bright);
		border-color: var(--stone-edge);

		&:hover:not(:disabled) {
			border-color: var(--ink-dim);
			background: var(--stone-mid);
		}
	}

	.sg-btn--ghost {
		background: transparent;
		color: var(--lamp-glow);
		border-color: transparent;

		&:hover:not(:disabled) {
			background: var(--lamp-soft);
		}
	}

	.sg-btn--danger {
		background: var(--error, #ef4444);
		color: #ffffff;
		border-color: var(--error, #ef4444);

		&:hover:not(:disabled) {
			background: var(--error-700, #dc2626);
			border-color: var(--error-700, #dc2626);
		}
	}

	/* ----- §11 form controls ----- */
	.sg-form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
		padding: 20px;

		@media (max-width: 600px) {
			grid-template-columns: 1fr;
		}
	}

	.sg-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.sg-field--full {
		grid-column: 1 / -1;
	}

	.sg-field-label {
		color: var(--lamp-glow);
		font-size: 10px;
	}

	.sg-input,
	.sg-textarea {
		font-family: var(--font-family, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-size: 16px;
		color: var(--ink-bright);
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		padding: 10px 12px;
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease;

		&::placeholder {
			color: var(--ink-dim);
		}

		&:focus {
			outline: none;
			border-color: var(--lamp-glow);
			box-shadow: 0 0 0 2px var(--lamp-soft);
		}
	}

	.sg-textarea {
		resize: vertical;
		min-height: 80px;
	}

	/* ----- §11 cards ----- */
	.sg-card-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
		}
	}

	.sg-card {
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.sg-card-eyebrow {
		color: var(--lamp-glow);
		font-size: 11px;
	}

	.sg-card-title {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-weight: 700;
		font-size: 20px;
		color: var(--ink-bright);
		letter-spacing: -0.01em;
	}

	.sg-card-body {
		font-size: 14px;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	.sg-card--interactive {
		cursor: pointer;
		transition: border-color 0.18s ease;

		&:hover,
		&:focus-visible {
			border-color: var(--ink-dim);
			outline: none;
		}
	}

	/* ----- §11 tags ----- */
	.sg-tag-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.sg-tag {
		display: inline-flex;
		align-items: center;
		padding: 4px 10px;
		border-radius: 0.625rem;
		border: 1px solid var(--stone-edge);
		font-size: 10px;
		letter-spacing: 0.08em;
	}

	.sg-tag--primary {
		background: var(--lamp-soft);
		border-color: var(--lamp-glow);
		color: var(--lamp-glow);
	}

	.sg-tag--neutral {
		background: transparent;
		border-color: var(--stone-edge);
		color: var(--ink-mid);
	}

	.sg-tag--data {
		background: var(--data-teal-rgba);
		border-color: var(--data-teal);
		color: var(--data-teal);
	}

	.sg-tag--type {
		background: transparent;
		border-color: var(--type-stripe, var(--stone-edge));
		color: var(--type-stripe, var(--ink-bright));
	}

	/* ----- §11 spinner ----- */
	.sg-spinner-row {
		display: flex;
		gap: 32px;
		align-items: center;
		flex-wrap: wrap;
		padding: 20px;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.sg-spinner-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.sg-spinner {
		display: inline-block;
		border-style: solid;
		border-color: var(--stone-edge);
		border-top-color: var(--lamp-glow);
		border-radius: 9999px;
		animation: sg-spin 0.8s linear infinite;
	}

	.sg-spinner--sm {
		width: 16px;
		height: 16px;
		border-width: 2px;
	}
	.sg-spinner--md {
		width: 24px;
		height: 24px;
		border-width: 3px;
	}
	.sg-spinner--lg {
		width: 36px;
		height: 36px;
		border-width: 3px;
	}

	@keyframes sg-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.sg-spinner {
			animation-duration: 4s;
		}
	}

	/* ----- §11 modal preview ----- */
	.sg-modal-preview-stage {
		padding: 32px 16px;
		background: var(--night-mid);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		display: flex;
		justify-content: center;
	}

	.sg-modal {
		width: 100%;
		max-width: 28rem;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		box-shadow: var(--shadow-lg);
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.sg-modal-header {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.sg-modal-eyebrow {
		color: var(--lamp-glow);
		font-size: 10px;
	}

	.sg-modal-title {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-weight: 700;
		font-size: 22px;
		color: var(--ink-bright);
		letter-spacing: -0.015em;
	}

	.sg-modal-body {
		font-size: 14px;
		line-height: 1.55;
		color: var(--ink-mid);
	}

	.sg-modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		margin-top: 8px;
	}

	/* ----- §11 empty / error state ----- */
	.sg-state-pair {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
		margin-top: 8px;

		@media (max-width: 720px) {
			grid-template-columns: 1fr;
		}
	}

	.sg-state-live {
		border: 1px dashed var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sg-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 8px;
		padding: 40px 24px;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	.sg-state-icon {
		width: 48px;
		height: 48px;
		color: var(--ink-dim);
	}

	.sg-state-icon--error {
		color: var(--error, #ef4444);
	}

	.sg-state-title {
		font-family: var(--font-display, 'Inter Variable', 'Inter', system-ui, sans-serif);
		font-weight: 700;
		font-size: 18px;
		color: var(--ink-bright);
		letter-spacing: -0.01em;
		margin-top: 4px;
	}

	.sg-state-title--error {
		color: var(--error, #ef4444);
	}

	.sg-state-body {
		font-size: 14px;
		color: var(--ink-mid);
		margin-bottom: 8px;
		max-width: 36ch;
	}

	/* ----- §11 section kickers ----- */
	.sg-kicker-stack {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 20px;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--stone-warm);
	}

	/* ----- §12 vocab grid ----- */
	.sg-vocab-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;

		@media (max-width: 968px) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (max-width: 480px) {
			grid-template-columns: 1fr;
		}
	}

	.sg-vocab-fig {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 8px;

		figcaption {
			color: var(--ink-dim);
			font-size: 10px;
			letter-spacing: 0.08em;
			text-align: left;
		}
	}

	.sg-vocab-frame {
		position: relative;
		aspect-ratio: 1 / 1;
		background: var(--night-mid);
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		overflow: hidden;
	}

	.sg-vocab-frame--statue {
		background: var(--night-deep);
	}

	.sg-vocab-frame--diagram {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
	}

	.sg-vocab-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.sg-vocab-img--statue {
		filter: contrast(1.18) brightness(1.04) saturate(0.88);
		mix-blend-mode: screen;
	}

	.styleguide.sg-light .sg-vocab-img--statue {
		filter: contrast(1.05) brightness(1) saturate(1);
		mix-blend-mode: normal;
	}

	.sg-vocab-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(ellipse at 25% 25%, rgba(245, 158, 11, 0.22) 0%, transparent 55%),
			linear-gradient(135deg, transparent 35%, rgba(10, 8, 7, 0.65) 100%),
			linear-gradient(180deg, transparent 60%, rgba(10, 8, 7, 0.85) 100%);
	}

	.styleguide.sg-light .sg-vocab-vignette {
		background:
			radial-gradient(ellipse at 25% 25%, rgba(217, 119, 6, 0.08) 0%, transparent 55%),
			linear-gradient(135deg, transparent 60%, rgba(180, 83, 9, 0.06) 100%);
	}

	.sg-enneagram {
		width: 140px;
		height: 140px;
	}

	.sg-enn-dot {
		fill: var(--lamp-glow);
	}

	.sg-enn-line {
		stroke: var(--ink-dim);
		stroke-width: 1.2;
		opacity: 0.55;
	}

	.sg-enn-tri {
		stroke: var(--data-teal);
		opacity: 0.7;
	}

	/* ----- footer ----- */
	.sg-footer {
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid var(--stone-edge);

		p {
			color: var(--ink-dim);
			font-size: 11px;
			line-height: 1.6;
		}

		a {
			color: var(--lamp-glow);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	/* =============================================================
	  Global side-effects scoped to <html.styleguide-light>. We only
	  warm up the host page so the surround matches when the styleguide
	  toggles to light mode. The .styleguide wrapper above already swaps
	  via the `.sg-light` class — this is just for the page chrome.
	============================================================= */
	:global(html.styleguide-light) {
		background: #faf8f4;
	}
	:global(html.styleguide-light body) {
		background: #faf8f4;
	}
</style>

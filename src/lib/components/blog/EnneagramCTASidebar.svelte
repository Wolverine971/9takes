<!-- src/lib/components/blog/EnneagramCTASidebar.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { notifications } from '../molecules/notifications';
	import { getEnneagramSidebarCopy } from './enneagramSidebarCopy';

	type SignupResponse = { ok: boolean; code?: string; message?: string };

	export let variant: 'floating' | 'embedded' = 'floating';
	export let sidePosition: 'left' | 'right' = 'right';
	export let showAtScrollY: number = 1500;
	export let hideBeforeBottom: number = 1500;
	export let sidebarWidth: number = 240;
	export let mobileBreakpoint: number = 1024;
	export let ctaTitle: string | null = null;
	export let ctaCopy: string | null = null;
	export let ctaButtonLabel: string | null = null;

	let visible = false;
	let email = '';
	let error = '';
	let loading = false;
	let submitted = false;
	let formExtra = '';
	let formLoadTime = Date.now();
	let windowWidth: number;
	let contentWidth: number = 64 * 16;
	let mainElement: HTMLElement | null = null;
	let resolvedTitle = '';
	let resolvedCopy = '';
	let resolvedButtonLabel = '';
	const inputId = 'enneagram-cta-sidebar-email';
	const errorId = 'enneagram-cta-sidebar-error';

	async function handleSubmit() {
		if (loading) return;

		const normalizedEmail = email.trim().toLowerCase();
		if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
			error = 'Enter a valid email address';
			return;
		}

		error = '';
		loading = true;

		const body = new FormData();
		body.append('email', normalizedEmail);
		body.append('form_extra', formExtra);
		body.append('_timeToken', String(Date.now() - formLoadTime));

		try {
			const response = await fetch('/api/signups', { method: 'POST', body });
			const result = (await response.json()) as SignupResponse;

			if (result.ok) {
				submitted = true;
				email = '';
				notifications.success("You're subscribed", 3000);
				notifications.info('Check your inbox for the welcome note.', 5000);
			} else if (result.code === 'already_exists') {
				submitted = true;
				notifications.warning('Already subscribed', 3000);
			} else {
				error = result.message || 'We could not subscribe you. Please try again.';
				notifications.warning('Signup failed', 3000);
			}
		} catch {
			error = 'We could not subscribe you. Check your connection and try again.';
			notifications.warning('Signup failed', 3000);
		} finally {
			loading = false;
		}
	}

	function calculateSidebarPosition(
		winWidth: number,
		contentW: number,
		sidebarW: number,
		side: 'left' | 'right'
	) {
		const mainContentLeft = Math.max((winWidth - contentW) / 2, 16);

		if (side === 'left') {
			const sidebarLeft = mainContentLeft - sidebarW - 24;
			if (sidebarLeft < 16) {
				return null;
			}

			return {
				left: `${sidebarLeft}px`,
				right: undefined
			};
		}

		const mainContentRight = mainContentLeft + contentW;
		const sidebarLeft = mainContentRight + 24;
		const minEdgeMargin = 16;

		if (sidebarLeft + sidebarW > winWidth - minEdgeMargin) {
			return null;
		}

		return {
			left: undefined,
			right: `${Math.max(winWidth - sidebarLeft - sidebarW, minEdgeMargin)}px`
		};
	}

	function handleScroll() {
		if (!browser || variant === 'embedded') return;

		const scrollPosition = window.scrollY;
		const pageHeight = document.documentElement.scrollHeight;
		const windowHeight = window.innerHeight;
		const distanceFromBottom = pageHeight - (scrollPosition + windowHeight);

		visible = scrollPosition > showAtScrollY && distanceFromBottom > hideBeforeBottom;
	}

	function handleResize() {
		if (!browser || variant === 'embedded') return;

		windowWidth = window.innerWidth;

		if (!mainElement) {
			mainElement = document.querySelector('main.column-width');
		}

		if (mainElement) {
			contentWidth = mainElement.getBoundingClientRect().width;
		}

		handleScroll();
	}

	$: sidebarCoords = calculateSidebarPosition(
		windowWidth,
		contentWidth,
		sidebarWidth,
		sidePosition
	);
	$: inferredCopy = getEnneagramSidebarCopy($page.url.pathname);
	$: resolvedTitle = ctaTitle?.trim() || inferredCopy.title;
	$: resolvedCopy = ctaCopy?.trim() || inferredCopy.copy;
	$: resolvedButtonLabel = ctaButtonLabel?.trim() || inferredCopy.buttonLabel;
	$: shouldRenderFloating =
		variant === 'floating' && visible && windowWidth >= mobileBreakpoint && sidebarCoords !== null;
	$: transitionParams =
		variant === 'embedded'
			? { x: 0, duration: 0 }
			: { x: sidePosition === 'left' ? -100 : 100, duration: 300 };

	onMount(() => {
		formLoadTime = Date.now();

		if (variant === 'embedded') {
			return;
		}

		const onWindowScroll = () => {
			handleScroll();
		};

		const onWindowResize = () => {
			handleResize();
		};

		window.addEventListener('scroll', onWindowScroll);
		window.addEventListener('resize', onWindowResize);
		handleResize();

		return () => {
			window.removeEventListener('scroll', onWindowScroll);
			window.removeEventListener('resize', onWindowResize);
		};
	});
</script>

{#if variant === 'embedded' || shouldRenderFloating}
	<div
		class="cta-sidebar"
		class:cta-sidebar--embedded={variant === 'embedded'}
		style:left={variant === 'floating' ? sidebarCoords?.left : undefined}
		style:right={variant === 'floating' ? sidebarCoords?.right : undefined}
		transition:fly={transitionParams}
	>
		<h3 class="sidebar-title">{resolvedTitle}</h3>
		<p class="sidebar-copy">{resolvedCopy}</p>

		{#if submitted}
			<p class="sidebar-success" role="status">
				You&rsquo;re in. Check your inbox for the welcome note.
			</p>
		{:else}
			<form
				on:submit|preventDefault={handleSubmit}
				class="sidebar-form"
				aria-label="Subscribe by email"
				aria-busy={loading}
				novalidate
			>
				<div class="signup-honeypot" aria-hidden="true">
					<label for="enneagram-sidebar-signup-extra">Leave blank</label>
					<input
						id="enneagram-sidebar-signup-extra"
						name="form_extra"
						type="text"
						bind:value={formExtra}
						tabindex="-1"
						autocomplete="new-password"
					/>
				</div>
				<div class="sidebar-field">
					<label class="sidebar-label" for={inputId}>Email address</label>
					<input
						id={inputId}
						type="email"
						bind:value={email}
						on:input={() => (error = '')}
						placeholder="you@example.com"
						required
						autocomplete="email"
						aria-invalid={error ? 'true' : 'false'}
						aria-describedby={error ? errorId : undefined}
						class="sidebar-input"
					/>
				</div>
				<button type="submit" class="sidebar-button" disabled={loading}>
					{loading ? 'Submitting...' : resolvedButtonLabel}
				</button>
			</form>
			{#if error}
				<p class="sidebar-error" id={errorId} role="alert">{error}</p>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.cta-sidebar {
		position: fixed;
		top: 50%;
		box-sizing: border-box;
		width: 15rem;
		transform: translateY(-50%);
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 16%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--stone-warm) 94%, var(--night-deep));
		box-shadow: var(--shadow-md);
		backdrop-filter: blur(12px);
	}

	.cta-sidebar--embedded {
		position: relative;
		top: auto;
		left: auto;
		right: auto;
		width: 100%;
		transform: none;
		padding: 0.15rem 0.15rem 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
		backdrop-filter: none;
	}

	.sidebar-title,
	.sidebar-copy {
		text-align: left;
	}

	.sidebar-title {
		margin: 0 0 0.45rem;
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: 0;
		color: var(--ink-bright);
	}

	.sidebar-copy {
		margin: 0 0 0.9rem;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	.sidebar-success,
	.sidebar-error {
		margin: 0;
		font-size: 0.84rem;
		line-height: 1.45;
		text-align: left;
	}

	.sidebar-success {
		padding: 0.7rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 18%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--lamp-glow) 8%, transparent);
		color: var(--ink-bright);
	}

	.sidebar-error {
		margin-top: 0.55rem;
		color: var(--error-text);
	}

	.sidebar-form {
		display: grid;
		gap: 0.6rem;
	}

	.signup-honeypot {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.sidebar-field {
		display: grid;
		gap: 0.35rem;
	}

	.sidebar-label {
		color: var(--ink-bright);
		font-size: 0.78rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.sidebar-input {
		box-sizing: border-box;
		width: 100%;
		min-height: 2.55rem;
		padding: 0.7rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 16%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--stone-warm) 90%, var(--night-deep));
		color: var(--ink-bright);
		font-size: 0.9rem;
		line-height: 1.2;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background-color 0.2s ease;
	}

	.sidebar-input::placeholder {
		color: var(--ink-dim);
	}

	.sidebar-input:hover {
		border-color: color-mix(in srgb, var(--lamp-glow) 28%, var(--stone-edge));
	}

	.sidebar-input:focus {
		outline: none;
		border-color: var(--lamp-glow);
		box-shadow: var(--glow-sm);
		background: var(--stone-warm);
	}

	.sidebar-input[aria-invalid='true'] {
		border-color: var(--error);
		box-shadow: none;
	}

	.sidebar-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 2.65rem;
		padding: 0.75rem 0.85rem;
		border: 1px solid transparent;
		border-radius: 0.625rem;
		background: linear-gradient(135deg, var(--lamp-glow) 0%, var(--lamp-glow) 100%);
		color: var(--text-on-primary);
		font-size: 0.9rem;
		font-weight: 700;
		line-height: 1.2;
		white-space: nowrap;
		cursor: pointer;
		box-shadow: var(--glow-sm);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			filter 0.2s ease;
	}

	.sidebar-button:disabled {
		cursor: wait;
		opacity: 0.72;
		box-shadow: var(--glow-sm);
	}

	.sidebar-button:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--lamp-glow) 70%, white);
		outline-offset: 2px;
	}

	.sidebar-button:not(:disabled):hover {
		transform: translateY(-1px);
		box-shadow: var(--glow-md);
		filter: saturate(1.05);
	}

	.sidebar-button:not(:disabled):active {
		transform: translateY(0);
		box-shadow: var(--glow-sm);
		filter: none;
	}
</style>

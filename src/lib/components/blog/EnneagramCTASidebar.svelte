<!-- src/lib/components/blog/EnneagramCTASidebar.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { notifications } from '../molecules/notifications';

	type EmailSignupPayload = {
		data?: { success?: boolean } | null;
		error?: { message?: string } | null;
	};

	export let variant: 'floating' | 'embedded' = 'floating';
	export let sidePosition: 'left' | 'right' = 'right';
	export let showAtScrollY: number = 1500;
	export let hideBeforeBottom: number = 1500;
	export let sidebarWidth: number = 220;
	export let mobileBreakpoint: number = 1024;

	let visible = false;
	let email = '';
	let error = '';
	let loading = false;
	let submitted = false;
	let windowWidth: number;
	let contentWidth: number = 64 * 16;
	let mainElement: HTMLElement | null = null;

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

		try {
			const response = await fetch('/email?/submit', {
				method: 'POST',
				body
			});
			const result = deserialize(await response.text());
			const payload =
				result.type === 'success' || result.type === 'failure'
					? (result.data as EmailSignupPayload | undefined)
					: undefined;
			const errorMessage = payload?.error?.message;

			if (result.type === 'success' && !errorMessage) {
				submitted = true;
				email = '';
				notifications.success("You're subscribed", 3000);
				notifications.info('Check your inbox for the welcome note.', 5000);
			} else if (errorMessage === 'Email already exists') {
				submitted = true;
				notifications.warning('Already subscribed', 3000);
			} else {
				notifications.warning('Signup failed', 3000);
			}
		} catch {
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
	$: shouldRenderFloating =
		variant === 'floating' && visible && windowWidth >= mobileBreakpoint && sidebarCoords !== null;
	$: transitionParams =
		variant === 'embedded'
			? { x: 0, duration: 0 }
			: { x: sidePosition === 'left' ? -100 : 100, duration: 300 };

	onMount(() => {
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
		<h3 class="sidebar-title">Get enneagram insights by email</h3>
		<p class="sidebar-copy">New guides and 9takes updates. No account required.</p>

		{#if submitted}
			<p class="sidebar-success">You&rsquo;re in. Check your inbox for the welcome note.</p>
		{:else}
			<form on:submit|preventDefault={handleSubmit} class="sidebar-form">
				<div>
					<input
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
						autocomplete="email"
						class="sidebar-input"
					/>
				</div>
				<button type="submit" class="sidebar-button" disabled={loading || !email.trim().length}>
					{loading ? 'Submitting...' : 'Subscribe'}
				</button>
			</form>
			{#if error}
				<p class="sidebar-error">{error}</p>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.cta-sidebar {
		position: fixed;
		top: 50%;
		width: 14rem;
		transform: translateY(-50%);
		padding: 1.35rem;
		border-radius: 1.15rem;
		border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border-color));
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-soft) 30%, transparent) 0%,
				transparent 45%
			),
			color-mix(in srgb, var(--bg-surface) 94%, var(--bg-base));
		box-shadow: var(--shadow-lg);
		backdrop-filter: blur(14px);
	}

	.cta-sidebar--embedded {
		position: relative;
		top: auto;
		left: auto;
		right: auto;
		width: 100%;
		transform: none;
		padding: 1rem;
		border-radius: 1rem;
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-soft) 18%, transparent) 0%,
				transparent 45%
			),
			color-mix(in srgb, var(--bg-surface) 88%, var(--bg-base));
		box-shadow: inset 0 1px 0 color-mix(in srgb, white 6%, transparent);
	}

	.cta-sidebar::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--primary-subtle) 52%, transparent),
			transparent 55%
		);
		pointer-events: none;
	}

	.sidebar-title,
	.sidebar-copy {
		position: relative;
		z-index: 1;
		text-align: center;
	}

	.sidebar-title {
		margin: 0 0 0.6rem;
		font-size: 1.05rem;
		font-weight: 700;
		line-height: 1.35;
		color: var(--text-primary);
	}

	.sidebar-copy {
		margin: 0 0 1rem;
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--text-secondary);
	}

	.sidebar-success,
	.sidebar-error {
		position: relative;
		z-index: 1;
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.55;
		text-align: center;
	}

	.sidebar-success {
		color: var(--text-primary);
	}

	.sidebar-error {
		color: var(--warning);
	}

	.sidebar-form {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.75rem;
	}

	.sidebar-input {
		width: 100%;
		padding: 0.8rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border-color));
		border-radius: 0.9rem;
		background: color-mix(in srgb, var(--bg-surface) 90%, var(--bg-base));
		color: var(--text-primary);
		font-size: 0.92rem;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background-color 0.2s ease;
	}

	.sidebar-input::placeholder {
		color: var(--text-tertiary);
	}

	.sidebar-input:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: var(--glow-sm);
		background: var(--bg-surface);
	}

	.sidebar-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 0.85rem 1rem;
		border: none;
		border-radius: 0.9rem;
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
		color: var(--text-on-primary);
		font-size: 0.92rem;
		font-weight: 700;
		cursor: pointer;
		box-shadow: var(--glow-sm);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			filter 0.2s ease;
	}

	.sidebar-button:disabled {
		cursor: not-allowed;
		opacity: 0.65;
		box-shadow: none;
	}

	.sidebar-button:hover {
		transform: translateY(-1px);
		box-shadow: var(--glow-md);
		filter: saturate(1.05);
	}

	.sidebar-button:disabled:hover {
		transform: none;
		box-shadow: none;
		filter: none;
	}
</style>

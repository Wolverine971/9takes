<!-- src/lib/components/blog/ExperimentalTherapyCard.svelte -->
<!--
  The beta card. Short on purpose (DJ, 2026-10-04): a trust line, a headline
  held to the three rules (picture it, could be proven wrong, only 9takes could
  say it), one line on what it is, and the email field right there, so the
  whole cost is visible. Copy comes from the running experiment
  ($lib/utils/betaCardCopy); /book-session gets fixed details copy.

  The email goes to /api/beta-signup and DJ writes back personally, so the card
  promises a reply, not an automatic email. Views, opens (first focus on the
  field or first tap on the button), and submits are counted per variant
  (cta_experiment_events and PostHog).

  The card can be dropped into article prose, whose global typography would
  bleed in, so every rule is nested under .etc and sets its own type and spacing.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { captureBetaInvite, type BetaInviteStep } from '$lib/analytics/marketingEvents';
	import {
		BETA_CARD_EXPERIMENT,
		DETAILS_COPY,
		renderBetaHeadline,
		type BetaCardCopy
	} from '$lib/utils/betaCardCopy';
	import {
		BETA_DETAILS_HREF,
		rememberBetaSignedUp,
		type BetaPlacement,
		type BetaSurface
	} from '$lib/utils/betaInvite';
	import { betaCard, betaCardVariant, reportedBetaEvents } from './betaInviteState.svelte';

	let {
		placement,
		surface,
		personName = null
	}: { placement: BetaPlacement; surface: BetaSurface; personName?: string | null } = $props();

	const uid = $props.id();
	const inputId = `etc-email-${uid}`;
	const errorId = `etc-error-${uid}`;
	const titleId = `etc-title-${uid}`;
	const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const onDetailsPage = $derived(surface === 'book_session');

	// /book-session renders on the server, so it gets fixed copy (no random pick
	// to mismatch on hydration). Blog cards only ever mount in the browser.
	let copy = $state<BetaCardCopy>(DETAILS_COPY);
	let honeypot = $state('');
	let error = $state('');
	let sending = $state(false);
	let root = $state<HTMLElement>();
	let mountedAt = 0;

	const headline = $derived(renderBetaHeadline(copy, personName));

	onMount(() => {
		mountedAt = Date.now();
		if (!onDetailsPage) copy = betaCardVariant();
	});

	/** Once per page per placement: PostHog for the funnel, our table for the readout. */
	function report(step: Exclude<BetaInviteStep, 'submitted'>) {
		const path = window.location.pathname;
		const key = `${step}:${placement}:${path}`;
		if (reportedBetaEvents.has(key)) return;
		reportedBetaEvents.add(key);

		void captureBetaInvite({
			step,
			surface: `beta_${surface}`,
			placement,
			variant: copy.id,
			sourcePath: path
		});
		void fetch('/api/cta-event', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			keepalive: true,
			body: JSON.stringify({
				experiment: BETA_CARD_EXPERIMENT,
				variant: copy.id,
				event: step,
				surface,
				placement,
				sourcePath: path
			})
		}).catch(() => {});
	}

	$effect(() => {
		if (!root || typeof IntersectionObserver === 'undefined') return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				observer.disconnect();
				report('viewed');
			},
			{ threshold: 0.5 }
		);
		observer.observe(root);
		return () => observer.disconnect();
	});

	function onFocus() {
		if (!betaCard.openedAt) betaCard.openedAt = Date.now();
		report('opened');
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		// A tap on the button before touching the field is interest too; without
		// this it only showed the validation error and was never counted.
		report('opened');
		if (sending) return;

		const email = betaCard.email.trim();
		if (!EMAIL_PATTERN.test(email)) {
			error = 'Enter a valid email address.';
			return;
		}

		error = '';
		sending = true;
		try {
			const startedAt = betaCard.openedAt || mountedAt;
			const response = await fetch('/api/beta-signup', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					email,
					surface,
					placement,
					variant: copy.id,
					sourcePath: window.location.pathname,
					form_extra: honeypot,
					_timeToken: startedAt ? Date.now() - startedAt : undefined
				})
			});
			const result = (await response.json().catch(() => null)) as {
				ok?: boolean;
				message?: string;
			} | null;

			if (response.ok && result?.ok) {
				betaCard.stage = 'done';
				betaCard.email = '';
				rememberBetaSignedUp();
				void captureBetaInvite({
					step: 'submitted',
					surface: `beta_${surface}`,
					placement,
					variant: copy.id,
					sourcePath: window.location.pathname
				});
			} else {
				error = result?.message || 'Something went wrong. Please try again.';
			}
		} catch {
			error = 'That didn’t go through. Check your connection and try again.';
		} finally {
			sending = false;
		}
	}
</script>

<section
	bind:this={root}
	class={['etc', `etc--${placement}`]}
	aria-labelledby={titleId}
	data-beta-card
	data-variant={copy.id}
>
	{#if betaCard.stage === 'done'}
		<p class="etc__title" id={titleId}>You’re in.</p>
		<p class="etc__sub" role="status">Check your inbox within 24 hours.</p>
		{#if !onDetailsPage}
			<a class="etc__link" href={BETA_DETAILS_HREF}>See what happens next</a>
		{/if}
	{:else}
		<p class="etc__kicker">{copy.kicker}</p>
		<p class="etc__title" id={titleId}>{headline}</p>
		<p class="etc__sub">{copy.sub}</p>

		<form class="etc__form" onsubmit={submit} novalidate>
			<label class="etc__sr" for={inputId}>Email address</label>
			<input
				bind:value={betaCard.email}
				id={inputId}
				class="etc__input"
				type="email"
				name="email"
				autocomplete="email"
				inputmode="email"
				placeholder="you@email.com"
				required
				maxlength="254"
				disabled={sending}
				onfocus={onFocus}
				aria-invalid={error ? 'true' : undefined}
				aria-describedby={error ? errorId : undefined}
			/>
			<div class="etc__honeypot" aria-hidden="true">
				<label>
					Leave this empty
					<input
						type="text"
						name="form_extra"
						tabindex="-1"
						autocomplete="off"
						bind:value={honeypot}
					/>
				</label>
			</div>
			<button type="submit" class="etc__button" disabled={sending}>
				{sending ? 'Sending…' : copy.button}
			</button>
		</form>
		{#if error}
			<p class="etc__error" id={errorId} role="alert">{error}</p>
		{/if}
	{/if}

	<p class="etc__fine">
		<span>Free beta · Coaching, not clinical therapy</span>
		<!-- The thank-you state already links to the details. -->
		{#if !onDetailsPage && betaCard.stage !== 'done'}
			<span aria-hidden="true">·</span>
			<a class="etc__fine-link" href={BETA_DETAILS_HREF}>Details</a>
		{/if}
	</p>
</section>

<style>
	.etc {
		box-sizing: border-box;
		display: grid;
		gap: 0.5rem;
		width: 100%;
		margin: 0;
		padding: 0.9rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 28%, var(--stone-edge));
		/* lint-radius-role: card */
		border-radius: var(--border-radius-lg);
		background:
			radial-gradient(
				circle at 0% 0%,
				color-mix(in srgb, var(--lamp-glow) 12%, transparent) 0%,
				transparent 60%
			),
			color-mix(in srgb, var(--stone-warm) 94%, var(--night-deep));
		box-shadow: var(--glow-sm);
		color: var(--ink-mid);
		font-family: var(--font-family);
		font-size: 0.875rem;
		line-height: 1.45;
		letter-spacing: normal;
		text-align: left;
		text-transform: none;
	}

	.etc--inline {
		margin: 2rem 0;
		padding: 1.1rem 1.2rem;
	}

	.etc .etc__kicker {
		margin: 0;
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.etc .etc__title {
		margin: 0;
		color: var(--ink-bright);
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.25;
		letter-spacing: normal;
	}

	.etc--inline .etc__title {
		font-size: 1.15rem;
	}

	.etc .etc__sub {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.82rem;
		font-weight: 400;
		line-height: 1.45;
	}

	.etc--inline .etc__sub {
		font-size: 0.92rem;
	}

	.etc .etc__form {
		display: grid;
		gap: 0.45rem;
		margin: 0.15rem 0 0;
	}

	.etc--inline .etc__form {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.etc .etc__input {
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		min-height: 2.6rem;
		margin: 0;
		padding: 0.6rem 0.7rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 18%, var(--stone-edge));
		/* lint-radius-role: control */
		border-radius: var(--border-radius);
		background: color-mix(in srgb, var(--stone-warm) 88%, var(--night-deep));
		color: var(--ink-bright);
		font-family: var(--font-family);
		font-size: 1rem;
		line-height: 1.2;
	}

	.etc .etc__input::placeholder {
		color: var(--ink-dim);
	}

	.etc .etc__input:focus {
		outline: none;
		border-color: var(--lamp-glow);
		box-shadow: var(--glow-sm);
	}

	.etc .etc__input[aria-invalid='true'] {
		border-color: var(--error);
	}

	.etc .etc__button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.6rem;
		margin: 0;
		padding: 0.6rem 1rem;
		border: 1px solid transparent;
		/* lint-radius-role: control */
		border-radius: var(--border-radius);
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		font-family: var(--font-family);
		font-size: 0.9rem;
		font-weight: 700;
		line-height: 1.2;
		white-space: nowrap;
		cursor: pointer;
		box-shadow: var(--glow-sm);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.etc .etc__button:not(:disabled):hover {
		transform: translateY(-1px);
		box-shadow: var(--glow-md);
	}

	.etc .etc__button:focus-visible,
	.etc .etc__link:focus-visible,
	.etc .etc__fine-link:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--lamp-glow) 70%, white);
		outline-offset: 2px;
	}

	.etc .etc__button:disabled {
		cursor: wait;
		opacity: 0.72;
	}

	.etc .etc__link {
		justify-self: start;
		color: var(--lamp-glow);
		font-size: 0.82rem;
		font-weight: 600;
		line-height: 1.4;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.etc .etc__error {
		margin: 0;
		color: var(--error-text);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.etc .etc__fine {
		margin: 0;
		color: var(--ink-dim);
		font-size: 0.7rem;
		line-height: 1.4;
	}

	.etc .etc__fine-link {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.18em;
	}

	.etc .etc__fine-link:hover {
		color: var(--ink-bright);
	}

	.etc .etc__sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.etc .etc__honeypot {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	@media (min-width: 768px) {
		.etc .etc__input {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 400px) {
		.etc--inline .etc__form {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.etc .etc__button {
			transition: none;
		}

		.etc .etc__button:not(:disabled):hover {
			transform: none;
		}
	}
</style>

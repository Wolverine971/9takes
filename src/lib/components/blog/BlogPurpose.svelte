<!-- src/lib/components/blog/BlogPurpose.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import EnneagramDiagram from './EnneagramDiagram.svelte';
	import { notifications } from '../molecules/notifications';

	type SignupResponse = { ok: boolean; code?: string; message?: string };

	let email = $state('');
	let error = $state('');
	let loading = $state(false);
	let submitted = $state(false);
	let formExtra = $state('');
	let formLoadTime = $state(Date.now());
	const errorId = 'blog-purpose-signup-error';

	onMount(() => {
		formLoadTime = Date.now();
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
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
				notifications.warning('Signup failed', 3000);
			}
		} catch {
			notifications.warning('Signup failed', 3000);
		} finally {
			loading = false;
		}
	}
</script>

<div class="blog-purpose">
	<!-- Capture Section -->
	<div class="cta-section">
		<div class="cta-bg-pattern"></div>
		<div class="cta-content">
			<div class="icon-container">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="cta-icon"
				>
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
					></path>
					<polyline points="22,6 12,13 2,6"></polyline>
				</svg>
			</div>

			<div class="cta-text">
				<h3>The fight that started 9takes</h3>
				<p>
					My wife and I were newlyweds having the same fight on repeat, until she said, &ldquo;DJ,
					you need to take a personality test.&rdquo; Turns out I didn&rsquo;t understand her fear
					and she didn&rsquo;t understand my anger. 9takes is the site I wish we&rsquo;d had: one
					situation, nine takes.
				</p>
				<p class="cta-subtext">Get the next personality breakdown in your inbox.</p>
			</div>

			{#if submitted}
				<p class="signup-success">You&rsquo;re in. Check your inbox for the welcome note.</p>
			{:else}
				<form
					onsubmit={handleSubmit}
					class="signup-form"
					aria-label="Subscribe by email"
					aria-busy={loading}
					novalidate
				>
					<div class="signup-honeypot" aria-hidden="true">
						<label for="blog-purpose-signup-extra">Leave blank</label>
						<input
							id="blog-purpose-signup-extra"
							name="form_extra"
							type="text"
							bind:value={formExtra}
							tabindex="-1"
							autocomplete="new-password"
						/>
					</div>
					<input
						type="email"
						bind:value={email}
						oninput={() => (error = '')}
						placeholder="you@example.com"
						required
						autocomplete="email"
						aria-invalid={error ? 'true' : 'false'}
						aria-describedby={error ? errorId : undefined}
						class="signup-input"
					/>
					<button type="submit" class="signup-button" disabled={loading}>
						{loading ? 'Submitting...' : 'Send it to me'}
					</button>
				</form>
				{#if error}
					<p class="signup-error" id={errorId}>{error}</p>
				{/if}
			{/if}

			<a href="/enneagram-corner" class="secondary-link">Or explore the 9 types &rarr;</a>
		</div>
	</div>

	<!-- Explorer Section -->
	<div class="explorer-section">
		<h3>Explore the 9 Enneagram Types</h3>
		<div class="diagram-container">
			<EnneagramDiagram />
		</div>
	</div>
</div>

<style lang="scss">
	/* V5 Streetlamp: a single dark stone card. Both halves sit on the same
	   deep-night surface as the rest of the page; amber is the ACCENT (icon,
	   focus rings, the one CTA button) — never a full-bleed fill. */
	.blog-purpose {
		width: 100%;
		max-width: 48rem;
		margin: 2.5rem auto;
		border-radius: 16px;
		overflow: hidden;
		background: var(--stone-warm);
		/* No static shadow: borders are the elevation (V5) */
		border: 1px solid var(--stone-edge);

		@media (min-width: 768px) {
			display: flex;
			align-items: stretch;
		}
	}

	.cta-section {
		position: relative;
		/* Warm amber whisper over the stone surface — differentiates the CTA
		   half without the stark yellow block. */
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--lamp-glow) 10%, var(--stone-warm)) 0%,
			var(--stone-warm) 70%
		);
		padding: 1.5rem 1.25rem;
		overflow: hidden;
		border-bottom: 1px solid var(--stone-mid);

		@media (min-width: 768px) {
			flex: 0 0 46%;
			padding: 2rem 1.75rem;
			display: flex;
			align-items: center;
			border-bottom: none;
			border-right: 1px solid var(--stone-mid);
		}
	}

	.cta-bg-pattern {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(
				circle at 20% 80%,
				color-mix(in srgb, var(--lamp-glow) 14%, transparent) 0%,
				transparent 55%
			),
			radial-gradient(
				circle at 85% 15%,
				color-mix(in srgb, var(--lamp-glow) 9%, transparent) 0%,
				transparent 45%
			);
		pointer-events: none;
	}

	.cta-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;

		@media (min-width: 768px) {
			align-items: flex-start;
		}
	}

	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: var(--lamp-soft);
		border-radius: 0.625rem;
		flex-shrink: 0;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 30%, transparent);
	}

	.cta-icon {
		width: 22px;
		height: 22px;
		color: var(--lamp-glow);
	}

	.cta-text {
		text-align: center;

		@media (min-width: 768px) {
			text-align: left;
		}

		h3 {
			color: var(--ink-bright);
			font-size: 1.125rem;
			font-weight: 700;
			line-height: 1.3;
			margin: 0 0 0.4rem;

			@media (min-width: 768px) {
				font-size: 1.25rem;
			}
		}

		p {
			color: var(--ink-mid) !important;
			font-size: 0.875rem;
			line-height: 1.55;
			margin: 0;
		}

		.cta-subtext {
			margin-top: 0.75rem;
			font-weight: 600;
			color: var(--ink-bright) !important;
		}
	}

	.signup-form {
		display: grid;
		gap: 0.6rem;
		width: 100%;
	}

	.signup-honeypot {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.signup-input {
		box-sizing: border-box;
		width: 100%;
		min-height: 2.55rem;
		padding: 0.7rem 0.75rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--night-deep);
		color: var(--ink-bright);
		font-size: 0.9rem;
		line-height: 1.2;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background-color 0.2s ease;

		&::placeholder {
			color: var(--ink-dim);
		}

		&:hover {
			border-color: color-mix(in srgb, var(--lamp-glow) 40%, var(--stone-edge));
		}

		&:focus {
			outline: none;
			border-color: var(--lamp-glow);
			box-shadow: 0 0 0 3px var(--lamp-soft);
		}

		&[aria-invalid='true'] {
			border-color: var(--error);
		}
	}

	.signup-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 2.65rem;
		padding: 0.7rem 1rem;
		/* The single amber pop — dark text on amber, the locked CTA contrast rule */
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		border: 1px solid transparent;
		border-radius: 0.625rem;
		font-size: 0.9rem;
		font-weight: 700;
		line-height: 1.2;
		white-space: nowrap;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			background-color 0.2s ease;

		&:disabled {
			cursor: wait;
			opacity: 0.72;
		}

		&:not(:disabled):hover {
			background: var(--lamp-light);
			transform: translateY(-1px);
			box-shadow: 0 4px 14px var(--lamp-glow-rgba);
		}

		&:not(:disabled):active {
			transform: translateY(0);
			box-shadow: none;
		}

		&:focus-visible {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}
	}

	.signup-success,
	.signup-error {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.45;
		width: 100%;
		color: var(--ink-bright);
	}

	.signup-success {
		padding: 0.7rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 30%, transparent);
		border-radius: 0.625rem;
		background: var(--lamp-soft);
	}

	.signup-error {
		font-weight: 600;
		color: var(--error);
	}

	.secondary-link {
		color: var(--ink-mid);
		font-size: 0.8rem;
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s ease;

		&:hover {
			color: var(--lamp-glow);
		}
	}

	/* This component mounts INSIDE article bodies whose :global(h3)/:global(a)
	   rules tie the scoped selectors above and win on source order. Anchoring
	   on .cta-section adds a class of specificity to outrank them. */
	.cta-section .cta-text h3 {
		color: var(--ink-bright);
	}

	.cta-section .secondary-link {
		color: var(--ink-mid);

		&:hover {
			color: var(--lamp-glow);
		}
	}

	.explorer-section {
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 100%);
		padding: 1.25rem 1rem 1rem;
		min-width: 0;
		overflow-x: hidden;

		@media (min-width: 768px) {
			flex: 1;
			min-width: 0;
			padding: 1.5rem 2rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		h3 {
			color: var(--ink-bright);
			font-size: 1rem;
			font-weight: 600;
			text-align: center;
			margin: 0 0 0.5rem;

			@media (min-width: 768px) {
				font-size: 1.125rem;
				margin: 0 0 0.25rem;
			}
		}
	}

	.diagram-container {
		width: 100%;
		max-width: 20rem;
		margin: 0 auto;
		min-width: 0;
		overflow-x: hidden;
	}

	@supports (overflow-x: clip) {
		.explorer-section,
		.diagram-container {
			overflow-x: clip;
		}
	}
</style>

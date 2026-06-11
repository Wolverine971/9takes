<!-- src/lib/components/blog/BlogPurpose.svelte -->
<script lang="ts">
	import EnneagramDiagram from './EnneagramDiagram.svelte';
	import { notifications } from '../molecules/notifications';
	import { getEnneagramSidebarCopy } from './enneagramSidebarCopy';

	type SignupResponse = { ok: boolean; code?: string; message?: string };

	const ctaCopy = getEnneagramSidebarCopy('/personality-analysis');

	let email = $state('');
	let error = $state('');
	let loading = $state(false);
	let submitted = $state(false);
	const errorId = 'blog-purpose-signup-error';

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
				<h3>{ctaCopy.title}</h3>
				<p>{ctaCopy.copy}</p>
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
						{loading ? 'Submitting...' : ctaCopy.buttonLabel}
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
	.blog-purpose {
		width: 100%;
		max-width: 48rem;
		margin: 2rem auto;
		border-radius: 16px;
		overflow: hidden;
		/* No static shadow: borders are the elevation (V5) */
		border: 1px solid var(--lamp-soft);

		@media (min-width: 768px) {
			display: flex;
			align-items: stretch;
		}
	}

	.cta-section {
		position: relative;
		background: linear-gradient(
			135deg,
			var(--lamp-glow) 0%,
			var(--lamp-glow) 50%,
			var(--lamp-glow) 100%
		);
		padding: 1.25rem;
		overflow: hidden;

		@media (min-width: 768px) {
			flex: 0 0 44%;
			padding: 2rem 1.5rem;
			display: flex;
			align-items: center;
		}
	}

	.cta-bg-pattern {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(12, 10, 9, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(12, 10, 9, 0.07) 0%, transparent 40%);
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
		width: 48px;
		height: 48px;
		background: rgba(12, 10, 9, 0.12);
		border-radius: 0.625rem;
		flex-shrink: 0;
		border: 1px solid rgba(12, 10, 9, 0.18);
	}

	.cta-icon {
		width: 24px;
		height: 24px;
		color: var(--text-on-primary);
	}

	.cta-text {
		text-align: center;

		@media (min-width: 768px) {
			text-align: left;
		}

		h3 {
			/* Dark-on-amber per the locked CTA contrast rule (was white ≈1.8:1) */
			color: var(--text-on-primary);
			font-size: 1.125rem;
			font-weight: 700;
			line-height: 1.3;
			margin: 0 0 0.25rem;

			@media (min-width: 768px) {
				font-size: 1.25rem;
			}
		}

		p {
			color: var(--text-on-primary) !important;
			opacity: 0.88;
			font-size: 0.875rem;
			line-height: 1.5;
			margin: 0;
		}
	}

	.signup-form {
		display: grid;
		gap: 0.6rem;
		width: 100%;
	}

	.signup-input {
		box-sizing: border-box;
		width: 100%;
		min-height: 2.55rem;
		padding: 0.7rem 0.75rem;
		border: 1px solid rgba(12, 10, 9, 0.3);
		border-radius: 0.625rem;
		background: rgba(12, 10, 9, 0.12);
		color: var(--text-on-primary);
		font-size: 0.9rem;
		line-height: 1.2;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;

		&::placeholder {
			color: var(--text-on-primary);
			opacity: 0.55;
		}

		&:hover {
			border-color: rgba(12, 10, 9, 0.5);
		}

		&:focus {
			outline: none;
			border-color: var(--night-deep);
			background: rgba(12, 10, 9, 0.18);
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
		/* Dark chip on the amber panel — high contrast both themes */
		background: var(--night-deep);
		color: var(--ink-bright);
		border: 1px solid rgba(12, 10, 9, 0.3);
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
			background: var(--stone-warm);
			transform: translateY(-1px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}

		&:not(:disabled):active {
			transform: translateY(0);
			box-shadow: none;
		}

		&:focus-visible {
			outline: 2px solid var(--night-deep);
			outline-offset: 2px;
		}
	}

	.signup-success,
	.signup-error {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.45;
		width: 100%;
		color: var(--text-on-primary);
	}

	.signup-success {
		padding: 0.7rem 0.75rem;
		border: 1px solid rgba(12, 10, 9, 0.3);
		border-radius: 0.625rem;
		background: rgba(12, 10, 9, 0.12);
	}

	.signup-error {
		font-weight: 600;
	}

	.secondary-link {
		color: var(--text-on-primary);
		opacity: 0.8;
		font-size: 0.8rem;
		text-decoration: underline;
		text-underline-offset: 2px;

		&:hover {
			opacity: 1;
		}
	}

	/* This component mounts INSIDE article bodies whose :global(h3)/:global(a)
	   rules tie the scoped selectors above and win on source order (rendered
	   the heading ink-bright and the link amber — on the amber panel).
	   Anchoring on .cta-section adds a class of specificity to outrank them. */
	.cta-section .cta-text h3 {
		color: var(--text-on-primary);
	}

	.cta-section .secondary-link {
		color: var(--text-on-primary);
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

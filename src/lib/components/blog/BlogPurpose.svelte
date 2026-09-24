<!-- src/lib/components/blog/BlogPurpose.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import EnneagramDiagram from './EnneagramDiagram.svelte';
	import { notifications } from '../molecules/notifications';
	import { captureEmailSignupCompleted } from '$lib/analytics/marketingEvents';

	interface Props {
		/** Who the article is about; the diagram opens on their type. */
		personName?: string;
		personType?: number;
	}

	let { personName, personType }: Props = $props();

	type SignupResponse = { ok: boolean; code?: string; message?: string };

	let email = $state('');
	let error = $state('');
	let loading = $state(false);
	let submitted = $state(false);
	let formExtra = $state('');
	let formLoadTime = $state(Date.now());
	const inputId = 'blog-purpose-signup-email';
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
				void captureEmailSignupCompleted({
					surface: 'blog_purpose',
					sourcePath: typeof window !== 'undefined' ? window.location.pathname : undefined
				});
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
</script>

<div class="blog-purpose">
	<section class="cta-section" aria-labelledby="blog-purpose-title">
		<div class="cta-bg-pattern" aria-hidden="true"></div>
		<div class="cta-content">
			<div class="cta-text">
				<p class="cta-kicker">Why nine takes</p>
				<h3 id="blog-purpose-title">One situation. Nine ways to see it.</h3>
				<p>
					My wife and I kept having the same fight: I missed the fear underneath her reaction, and
					she missed the anger underneath mine. The Enneagram gave us language for both.
				</p>
			</div>

			<div class="signup-copy">
				<h4>Get the next personality breakdown</h4>
				<p>
					New celebrity typings, relationship patterns, and practical Enneagram notes&mdash;sent by
					email.
				</p>
			</div>

			{#if submitted}
				<p class="signup-success" role="status">
					You&rsquo;re in. Check your inbox for the welcome note.
				</p>
			{:else}
				<form
					onsubmit={handleSubmit}
					class="signup-form"
					aria-label="Get new 9takes personality breakdowns by email"
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
					<div class="signup-row">
						<div class="signup-field">
							<label class="signup-label" for={inputId}>Email address</label>
							<input
								id={inputId}
								type="email"
								bind:value={email}
								oninput={() => (error = '')}
								placeholder="Your email"
								required
								autocomplete="email"
								aria-invalid={error ? 'true' : 'false'}
								aria-describedby={error ? errorId : undefined}
								class="signup-input"
							/>
						</div>
						<button type="submit" class="signup-button" disabled={loading}>
							{loading ? 'Sending...' : 'Get the next one'}
						</button>
					</div>
				</form>
				{#if error}
					<p class="signup-error" id={errorId} role="alert">{error}</p>
				{/if}
			{/if}
			<p class="signup-note">No account required. Unsubscribe anytime.</p>
		</div>
	</section>

	<section class="explorer-section" aria-label="Explore the nine Enneagram types">
		<EnneagramDiagram {personName} {personType} />
	</section>
</div>

<style lang="scss">
	.blog-purpose {
		width: 100%;
		max-width: 58rem;
		margin: 2rem auto;
		border-radius: 1rem;
		overflow: hidden;
		background: var(--stone-warm);
		border: 1px solid var(--stone-edge);

		@media (min-width: 768px) {
			display: grid;
			grid-template-columns: minmax(0, 1.04fr) minmax(20rem, 0.96fr);
		}
	}

	.cta-section {
		position: relative;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--lamp-glow) 8%, var(--stone-warm)) 0%,
			var(--stone-warm) 72%
		);
		padding: 1.5rem;
		overflow: hidden;
		border-bottom: 1px solid var(--stone-mid);

		@media (min-width: 768px) {
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
		align-items: flex-start;
		gap: 0.875rem;
		width: 100%;
	}

	/* This component mounts INSIDE article bodies whose global h3/p/a rules
	   can tie single-class scoped selectors and win on source order. Anchoring
	   on .cta-section adds a class of specificity to outrank them. */
	/* Three classes deep so it also outranks `.cta-text p` below. */
	.cta-section .cta-text .cta-kicker {
		margin: 0 0 0.5rem;
		color: var(--lamp-glow) !important;
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		line-height: 1.2;
		text-transform: uppercase;
	}

	.cta-section .cta-text h3 {
		margin: 0 0 0.5rem;
		padding: 0;
		color: var(--ink-bright);
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.015em;
		line-height: 1.2;
	}

	.cta-section .cta-text p {
		margin: 0;
		color: var(--ink-bright) !important;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.signup-copy {
		width: 100%;
		padding-top: 0.875rem;
		border-top: 1px solid var(--stone-mid);
	}

	.cta-section .signup-copy h4 {
		margin: 0 0 0.25rem;
		padding: 0;
		color: var(--ink-bright);
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.cta-section .signup-copy p {
		margin: 0;
		color: var(--ink-mid) !important;
		font-size: 0.875rem;
		line-height: 1.45;
	}

	.signup-form {
		width: 100%;
	}

	.signup-honeypot {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.signup-field {
		min-width: 0;
	}

	.signup-label {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.signup-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.5rem;
	}

	.signup-input {
		box-sizing: border-box;
		width: 100%;
		min-height: 2.75rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--night-deep);
		color: var(--ink-bright);
		font-size: 1rem;
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
		min-height: 2.75rem;
		padding: 0.65rem 0.875rem;
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		border: 1px solid transparent;
		border-radius: 0.625rem;
		font-size: 0.875rem;
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
			box-shadow: var(--shadow-sm);
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
		font-size: 0.875rem;
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
		color: var(--error-text);
	}

	.cta-section .signup-note {
		margin: -0.35rem 0 0;
		color: var(--ink-mid);
		font-size: 0.75rem;
		line-height: 1.35;
	}

	.explorer-section {
		display: grid;
		place-items: center;
		min-width: 0;
		padding: 1.25rem 1.25rem 1rem;
		background: linear-gradient(145deg, var(--stone-warm) 0%, var(--night-deep) 100%);

		@media (min-width: 768px) {
			padding: 1.5rem;
		}
	}
</style>

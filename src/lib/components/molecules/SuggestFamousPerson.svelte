<!-- src/lib/components/molecules/SuggestFamousPerson.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { Button } from '$lib/components/atoms';
	import { loadTurnstile, type TurnstileApi } from '$lib/utils/turnstile';
	import { notifications } from './notifications';

	type SuggestionResponse = { ok: boolean; code?: string; message?: string };

	const STORAGE_KEY = '9takes_person_suggestions';
	const MAX_SUGGESTIONS = 3;
	const TIME_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

	let email = $state('');
	let otherPerson = $state('');
	let error = $state('');
	let errorField = $state<'person' | 'email' | 'form' | null>(null);
	let status = $state('');
	let loading = $state(false);
	let remainingSuggestions = $state(MAX_SUGGESTIONS);
	let form: HTMLFormElement;
	let verificationContainer: HTMLDivElement;
	let verificationToken = $state('');
	let verificationError = $state('');
	let verificationLoading = $state(false);
	let verificationStarted = $state(false);
	let formExtra = $state('');
	let turnstile: TurnstileApi | undefined;
	let widgetId: string | undefined;
	let destroyed = false;
	const personInputId = 'famous-person-suggestion';
	const emailInputId = 'famous-person-suggestion-email';
	const errorId = 'famous-person-suggestion-error';
	const statusId = 'famous-person-suggestion-status';

	// Stricter email validation - matches common email patterns
	const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const isEmailValid = $derived(EMAIL_REGEX.test(email.trim()));
	// Person name validation - letters, spaces, hyphens, apostrophes only
	const isPersonValid = $derived(
		otherPerson.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(otherPerson.trim())
	);
	const canSubmit = $derived(
		email.trim().length > 0 &&
			otherPerson.trim().length > 0 &&
			verificationToken.length > 0 &&
			remainingSuggestions > 0 &&
			!loading
	);

	function getStoredSuggestions(): number[] {
		if (!browser) return [];
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			const timestamps: unknown = stored ? JSON.parse(stored) : [];
			return Array.isArray(timestamps)
				? timestamps.filter(
						(timestamp) => typeof timestamp === 'number' && Number.isFinite(timestamp)
					)
				: [];
		} catch {
			return [];
		}
	}

	function cleanExpiredSuggestions(timestamps: number[]): number[] {
		const now = Date.now();
		return timestamps.filter((ts) => now - ts < TIME_WINDOW_MS);
	}

	function updateRemainingSuggestions() {
		if (!browser) return;
		const timestamps = cleanExpiredSuggestions(getStoredSuggestions());
		remainingSuggestions = Math.max(0, MAX_SUGGESTIONS - timestamps.length);
	}

	function recordSuggestion() {
		if (!browser) return;
		const timestamps = cleanExpiredSuggestions(getStoredSuggestions());
		timestamps.push(Date.now());
		remainingSuggestions = Math.max(0, MAX_SUGGESTIONS - timestamps.length);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
		} catch {
			// The server enforces limits even when browser storage is unavailable.
		}
	}

	async function startVerification() {
		if (destroyed || verificationStarted) return;
		verificationStarted = true;
		verificationLoading = true;
		verificationError = '';

		try {
			if (!env.PUBLIC_TURNSTILE_SITE_KEY) throw new Error('Verification is not configured.');
			turnstile = await loadTurnstile();
			if (destroyed) return;
			widgetId = turnstile.render(verificationContainer, {
				sitekey: env.PUBLIC_TURNSTILE_SITE_KEY,
				action: 'person_suggestion',
				theme: 'auto',
				// Flexible widgets need 300px; narrow mobile cards use the compact layout.
				size: verificationContainer.clientWidth < 300 ? 'compact' : 'flexible',
				'response-field': false,
				callback: (token) => {
					if (destroyed) return;
					verificationToken = token;
					verificationError = '';
				},
				'expired-callback': () => {
					if (destroyed) return;
					verificationToken = '';
					verificationError = 'Verification expired. Please verify again.';
				},
				'error-callback': () => {
					if (destroyed) return;
					verificationToken = '';
					verificationError = 'Verification could not be completed. Please retry.';
				},
				'timeout-callback': () => {
					if (destroyed) return;
					verificationToken = '';
					verificationError = 'Verification timed out. Please retry.';
				}
			});
			if (widgetId === undefined) throw new Error('Verification could not start.');
		} catch {
			if (!destroyed) {
				verificationError = 'Verification could not load. Check your connection and retry.';
			}
		} finally {
			if (!destroyed) verificationLoading = false;
		}
	}

	function resetVerification() {
		verificationToken = '';
		if (destroyed) return;
		verificationError = '';
		if (turnstile && widgetId !== undefined) {
			try {
				turnstile.reset(widgetId);
			} catch {
				verificationError = 'Verification could not restart. Please reload this page.';
			}
		} else {
			verificationStarted = false;
			void startVerification();
		}
	}

	onMount(() => {
		updateRemainingSuggestions();
		const observer =
			typeof IntersectionObserver === 'undefined'
				? undefined
				: new IntersectionObserver((entries) => {
						if (entries.some((entry) => entry.isIntersecting)) {
							observer?.disconnect();
							void startVerification();
						}
					});
		observer?.observe(form);

		return () => {
			destroyed = true;
			observer?.disconnect();
			if (widgetId !== undefined) turnstile?.remove(widgetId);
		};
	});

	async function submit() {
		if (loading) return;
		// Client-side validation
		if (!isEmailValid) {
			error = 'Please enter a valid email address';
			errorField = 'email';
			status = '';
			notifications.warning('Please enter a valid email address', 3000);
			return;
		}

		if (!isPersonValid) {
			error = 'Please enter a valid name (letters, spaces, hyphens only)';
			errorField = 'person';
			status = '';
			notifications.warning('Please enter a valid name', 3000);
			return;
		}

		// Rate limit check
		updateRemainingSuggestions();
		if (remainingSuggestions <= 0) {
			error = 'You have reached the limit of 3 suggestions per 24 hours';
			errorField = 'form';
			status = '';
			notifications.warning('Suggestion limit reached. Try again in 24 hours.', 4000);
			return;
		}

		if (!verificationToken) {
			verificationError = 'Please complete the verification before submitting.';
			void startVerification();
			return;
		}

		error = '';
		errorField = null;
		status = '';
		loading = true;

		const body = new FormData();
		body.append('email', email.trim().toLowerCase());
		body.append('suggestedPerson', otherPerson.trim());
		body.append('cf-turnstile-response', verificationToken);
		body.append('form_extra', formExtra);
		verificationToken = '';

		try {
			const resp = await fetch('/api/person-suggestions', { method: 'POST', body });
			const data = (await resp.json()) as SuggestionResponse;

			if (data.ok) {
				const suggestedName = otherPerson.trim();
				recordSuggestion();
				status = `Your suggestion for ${suggestedName} has been saved.`;
				notifications.success(status, 4000);
				email = '';
				otherPerson = '';
			} else if (data.code === 'rate_limited') {
				error = 'Too many suggestions. Please try again later.';
				errorField = 'form';
				notifications.warning('Too many suggestions. Please try again later.', 4000);
			} else {
				const message = data.message || 'Submission failed';
				error = `Suggestion failed: ${message}`;
				errorField = 'form';
				notifications.warning(`Suggestion failed: ${message}`, 4000);
			}
		} catch (err) {
			console.error('Error submitting suggestion:', err);
			error = 'An error occurred. Please try again.';
			errorField = 'form';
			notifications.danger('An error occurred. Please try again.', 3000);
		} finally {
			loading = false;
			resetVerification();
		}
	}
</script>

<div class="waitlist-section">
	<h2>Who else should 9takes write about?</h2>

	<form
		bind:this={form}
		class="waitlist-form"
		onsubmit={(event) => {
			event.preventDefault();
			void submit();
		}}
		onfocusin={() => void startVerification()}
		aria-label="Suggest a person for 9takes"
		aria-busy={loading}
		novalidate
	>
		<div class="field">
			<label for={personInputId}>Person to cover</label>
			<input
				id={personInputId}
				type="text"
				name="person"
				placeholder="Celebrity, musician, politician, YouTuber, etc."
				bind:value={otherPerson}
				maxlength="100"
				oninput={() => {
					if (errorField === 'person') {
						error = '';
						errorField = null;
					}
					status = '';
				}}
				disabled={remainingSuggestions <= 0}
				required
				aria-invalid={errorField === 'person' ? 'true' : 'false'}
				aria-describedby={errorField === 'person' ? errorId : undefined}
			/>
		</div>

		<div class="field">
			<label for={emailInputId}>Your email address</label>
			<input
				id={emailInputId}
				type="email"
				name="email"
				placeholder="you@example.com"
				bind:value={email}
				maxlength="254"
				oninput={() => {
					if (errorField === 'email') {
						error = '';
						errorField = null;
					}
					status = '';
				}}
				disabled={remainingSuggestions <= 0}
				required
				autocomplete="email"
				aria-invalid={errorField === 'email' ? 'true' : 'false'}
				aria-describedby={errorField === 'email' ? errorId : undefined}
			/>
		</div>

		<div class="form-extra" aria-hidden="true">
			<label for="famous-person-suggestion-extra">Leave this field empty</label>
			<input
				id="famous-person-suggestion-extra"
				name="form_extra"
				type="text"
				bind:value={formExtra}
				tabindex="-1"
				autocomplete="off"
			/>
		</div>

		<div class="verification" hidden={!verificationStarted}>
			<div bind:this={verificationContainer}></div>
			{#if verificationError}
				<p class="error" role="alert">{verificationError}</p>
				<Button type="button" size="sm" onclick={resetVerification} disabled={loading}>
					Retry verification
				</Button>
			{:else if verificationStarted && !verificationToken}
				<p class="verification-status" role="status">
					{verificationLoading ? 'Loading verification…' : 'Complete the verification to submit.'}
				</p>
			{/if}
		</div>

		<Button type="submit" size="lg" class="suggest-submit" disabled={!canSubmit} {loading}>
			Submit
		</Button>
	</form>

	{#if error}
		<p class="error" id={errorId} role="alert">{error}</p>
	{:else if status}
		<p class="status" id={statusId} role="status">{status}</p>
	{/if}

	{#if remainingSuggestions < MAX_SUGGESTIONS}
		<p
			class="suggestions-remaining"
			class:limit-reached={remainingSuggestions <= 0}
			aria-live="polite"
		>
			{#if remainingSuggestions > 0}
				{remainingSuggestions} suggestion{remainingSuggestions === 1 ? '' : 's'} remaining today
			{:else}
				Limit reached. Try again in 24 hours.
			{/if}
		</p>
	{/if}
</div>

<style lang="scss">
	.waitlist-section {
		text-align: center;
		border: 1px solid var(--stone-edge);
		padding: 2rem;
		border-radius: var(--base-border-radius);

		h2 {
			margin-top: 0;
			margin-bottom: 1.5rem;
		}
	}

	.waitlist-form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		max-width: 300px;
		margin: 0 auto;

		.field {
			width: 100%;
			text-align: left;
		}

		label {
			display: block;
			margin-bottom: 0.35rem;
			color: var(--ink-bright);
			font-size: 0.875rem;
			font-weight: 600;
		}

		input {
			width: 100%;
			padding: 0.75rem 1rem;
			border-radius: var(--base-border-radius);
			border: 1px solid var(--stone-edge);
			background: var(--night-deep);
			color: var(--ink-bright);
			font-size: 1rem;
		}

		input[aria-invalid='true'] {
			border-color: var(--error);
		}

		input:focus {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 2px;
		}
	}

	:global(.suggest-submit) {
		width: 100%;
	}

	.form-extra {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	.verification {
		width: 100%;
		max-width: 400px;
	}

	.verification-status {
		font-size: 0.875rem;
		color: var(--ink-dim);
	}

	.error,
	.status {
		margin-top: 0.5rem;
		font-size: 0.875rem;
	}

	.error {
		color: var(--error-text);
	}

	.status {
		color: var(--success-text);
	}

	.suggestions-remaining {
		margin-top: 0.75rem;
		font-size: 0.8rem;
		color: var(--ink-dim);

		&.limit-reached {
			color: var(--error-text);
			font-weight: 500;
		}
	}

	input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--stone-mid);
	}

	@media only screen and (min-width: 768px) {
		.waitlist-form {
			max-width: 400px;
		}
	}

	@media only screen and (min-width: 992px) {
		.waitlist-form {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
			max-width: 700px;
			gap: 0.75rem;

			.field {
				flex: 1 1 200px;
				max-width: 250px;
			}

			:global(.suggest-submit) {
				width: auto;
				margin-top: 1.45rem;
			}
		}
	}

	::placeholder {
		color: var(--lamp-glow);
		opacity: 0.7;
	}
</style>

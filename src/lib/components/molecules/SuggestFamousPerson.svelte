<!-- src/lib/components/molecules/SuggestFamousPerson.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/atoms';
	import { notifications } from './notifications';

	type SuggestionResponse = { ok: boolean; code?: string; message?: string };

	const STORAGE_KEY = '9takes_person_suggestions';
	const MAX_SUGGESTIONS = 3;
	const TIME_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

	let email = '';
	let otherPerson = '';
	let error = '';
	let errorField: 'person' | 'email' | 'form' | null = null;
	let status = '';
	let loading = false;
	let remainingSuggestions = MAX_SUGGESTIONS;
	const personInputId = 'famous-person-suggestion';
	const emailInputId = 'famous-person-suggestion-email';
	const errorId = 'famous-person-suggestion-error';
	const statusId = 'famous-person-suggestion-status';

	// Stricter email validation - matches common email patterns
	const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	$: isEmailValid = EMAIL_REGEX.test(email.trim());
	// Person name validation - letters, spaces, hyphens, apostrophes only
	$: isPersonValid = otherPerson.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(otherPerson.trim());
	$: canSubmit =
		email.trim().length > 0 &&
		otherPerson.trim().length > 0 &&
		remainingSuggestions > 0 &&
		!loading;

	function getStoredSuggestions(): number[] {
		if (!browser) return [];
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
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
		localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
		remainingSuggestions = Math.max(0, MAX_SUGGESTIONS - timestamps.length);
	}

	function recordSuggestion() {
		if (!browser) return;
		const timestamps = cleanExpiredSuggestions(getStoredSuggestions());
		timestamps.push(Date.now());
		localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
		updateRemainingSuggestions();
	}

	onMount(() => {
		updateRemainingSuggestions();
	});

	async function submit() {
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

		error = '';
		errorField = null;
		status = '';
		loading = true;

		const body = new FormData();
		body.append('email', email.trim().toLowerCase());
		body.append('suggestedPerson', otherPerson.trim());

		try {
			const resp = await fetch('/api/person-suggestions', { method: 'POST', body });
			const data = (await resp.json()) as SuggestionResponse;

			if (data.ok) {
				const suggestedName = otherPerson.trim();
				recordSuggestion();
				status = `Thanks for suggesting ${suggestedName}.`;
				notifications.success(`Thanks for suggesting ${suggestedName}! 🎉`, 4000);
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
		}
	}
</script>

<div class="waitlist-section">
	<h2>Who else should 9takes write about?</h2>

	<form
		class="waitlist-form"
		on:submit|preventDefault={submit}
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
				on:input={() => {
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
				on:input={() => {
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
		border: var(--classic-border);
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
			border: var(--classic-border);
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
		color: var(--color-text-muted, #6b7280);

		&.limit-reached {
			color: var(--error-text);
			font-weight: 500;
		}
	}

	input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: var(--color-bg-muted, #f3f4f6);
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

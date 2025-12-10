<!-- src/lib/components/molecules/SuggestFamousPerson.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { deserialize } from '$app/forms';
	import { notifications } from './notifications';

	const STORAGE_KEY = '9takes_person_suggestions';
	const MAX_SUGGESTIONS = 3;
	const TIME_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

	let email = '';
	let otherPerson = '';
	let error = '';
	let loading = false;
	let remainingSuggestions = MAX_SUGGESTIONS;

	// Stricter email validation - matches common email patterns
	const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	$: isEmailValid = EMAIL_REGEX.test(email.trim());
	// Person name validation - letters, spaces, hyphens, apostrophes only
	$: isPersonValid = otherPerson.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(otherPerson.trim());
	$: canSubmit = isEmailValid && isPersonValid && remainingSuggestions > 0 && !loading;

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
			notifications.warning('Please enter a valid email address', 3000);
			return;
		}

		if (!isPersonValid) {
			error = 'Please enter a valid name (letters, spaces, hyphens only)';
			notifications.warning('Please enter a valid name', 3000);
			return;
		}

		// Rate limit check
		updateRemainingSuggestions();
		if (remainingSuggestions <= 0) {
			error = 'You have reached the limit of 3 suggestions per 24 hours';
			notifications.warning('Suggestion limit reached. Try again in 24 hours.', 4000);
			return;
		}

		error = '';
		loading = true;

		const body = new FormData();
		body.append('email', email.trim().toLowerCase());
		body.append('suggestedPerson', otherPerson.trim());

		try {
			const resp = await fetch(`/email?/submitFamousPerson`, { method: 'POST', body });
			const data = deserialize(await resp.text());

			if (data?.type === 'success' || !data?.error) {
				recordSuggestion();
				notifications.success(`Thanks for suggesting ${otherPerson.trim()}! 🎉`, 4000);
				email = '';
				otherPerson = '';
			} else if (data?.type === 'error') {
				const errorMsg =
					(data as { error?: { message?: string } })?.error?.message || 'Submission failed';
				if (errorMsg.includes('rate limit') || errorMsg.includes('too many')) {
					notifications.warning('Too many suggestions. Please try again later.', 4000);
				} else {
					notifications.warning(`Suggestion failed: ${errorMsg}`, 4000);
				}
			} else {
				notifications.warning('Suggestion could not be processed. Please try again.', 3000);
			}
		} catch (err) {
			console.error('Error submitting suggestion:', err);
			notifications.danger('An error occurred. Please try again.', 3000);
		} finally {
			loading = false;
		}
	}
</script>

<div class="waitlist-section">
	<h2>Who else should 9takes write about?</h2>

	<form class="waitlist-form" on:submit|preventDefault={submit}>
		<input
			type="text"
			name="person"
			placeholder="Celebrity, musician, politician, YouTuber, etc."
			bind:value={otherPerson}
			disabled={remainingSuggestions <= 0}
		/>

		<input
			type="email"
			name="email"
			placeholder="you@example.com"
			bind:value={email}
			disabled={remainingSuggestions <= 0}
		/>

		<button type="submit" disabled={!canSubmit} class:disabled={!canSubmit}>
			{loading ? 'Submitting...' : 'Submit'}
		</button>
	</form>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if remainingSuggestions < MAX_SUGGESTIONS}
		<p class="suggestions-remaining" class:limit-reached={remainingSuggestions <= 0}>
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

		input,
		button {
			width: 100%;
			padding: 0.75rem 1rem;
			border-radius: var(--base-border-radius);
			border: var(--classic-border);
			font-size: 1rem;
		}

		button {
			cursor: pointer;
			color: var(--primary);
			background: transparent;
			transition: opacity 0.2s ease;

			&:hover:not(.disabled) {
				opacity: 0.8;
			}

			&.disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}
	}

	.error {
		color: #dc2626;
		margin-top: 0.5rem;
		font-size: 0.875rem;
	}

	.suggestions-remaining {
		margin-top: 0.75rem;
		font-size: 0.8rem;
		color: var(--color-text-muted, #6b7280);

		&.limit-reached {
			color: #dc2626;
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
			justify-content: center;
			max-width: 700px;
			gap: 0.75rem;

			input {
				flex: 1 1 200px;
				max-width: 250px;
			}

			button {
				flex: 0 0 auto;
				width: auto;
				padding: 0.75rem 1.5rem;
			}
		}
	}

	::placeholder {
		color: var(--primary);
		opacity: 0.7;
	}
</style>

<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import LoadingButton from '$lib/components/atoms/LoadingButton.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';

	interface EnneagramType {
		num: number;
		name: string;
		descriptor: string;
		color: string;
	}

	interface ProfileSnapshot {
		firstName: string;
		lastName: string;
		enneagram: string;
	}

	interface AccountUser {
		first_name: string | null;
		last_name: string | null;
		enneagram: string | null;
		email: string | null;
		admin: boolean | null;
	}

	interface AccountSubscription {
		questions: {
			url: string;
			question_formatted: string | null;
			question: string;
		};
	}

	const enneagramTypes: EnneagramType[] = [
		{
			num: 1,
			name: 'Reformer',
			descriptor: 'Structured, measured, and improvement-driven',
			color: 'var(--type-1-color)'
		},
		{
			num: 2,
			name: 'Helper',
			descriptor: 'Warm, relational, and quick to support',
			color: 'var(--type-2-color)'
		},
		{
			num: 3,
			name: 'Achiever',
			descriptor: 'Driven, adaptive, and outcome-focused',
			color: 'var(--type-3-color)'
		},
		{
			num: 4,
			name: 'Individualist',
			descriptor: 'Expressive, nuanced, and emotionally precise',
			color: 'var(--type-4-color)'
		},
		{
			num: 5,
			name: 'Investigator',
			descriptor: 'Analytical, reserved, and insight-oriented',
			color: 'var(--type-5-color)'
		},
		{
			num: 6,
			name: 'Loyalist',
			descriptor: 'Committed, vigilant, and team-minded',
			color: 'var(--type-6-color)'
		},
		{
			num: 7,
			name: 'Enthusiast',
			descriptor: 'Upbeat, expansive, and possibility-driven',
			color: 'var(--type-7-color)'
		},
		{
			num: 8,
			name: 'Challenger',
			descriptor: 'Direct, powerful, and action-first',
			color: 'var(--type-8-color)'
		},
		{
			num: 9,
			name: 'Peacemaker',
			descriptor: 'Grounded, receptive, and harmony-oriented',
			color: 'var(--type-9-color)'
		}
	];

	let { data }: { data: PageData } = $props();
	let user = $derived(data.user as AccountUser);
	let userEmail = $derived(user.email ?? '');
	let subscriptions = $derived((data.subscriptions ?? []) as AccountSubscription[]);

	let firstName = $state('');
	let lastName = $state('');
	let enneagram = $state('');
	let saving = $state(false);
	let loggingOut = $state(false);
	let profileSnapshot = $state<ProfileSnapshot>({
		firstName: '',
		lastName: '',
		enneagram: ''
	});
	let lastLoadedSignature = $state('');

	let subscriptionCount = $derived(subscriptions.length);
	let roleLabel = $derived(user.admin ? 'Administrator' : 'Member');
	let selectedType = $derived.by(
		() => enneagramTypes.find((type) => String(type.num) === enneagram) ?? null
	);
	let displayName = $derived.by(() => {
		const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
		if (fullName) return fullName;

		const emailHandle = userEmail
			.split('@')[0]
			?.replace(/[._-]+/g, ' ')
			.trim();
		return emailHandle ? toTitleCase(emailHandle) : 'Your Account';
	});
	let formChanged = $derived.by(() => {
		const normalizedFirstName = firstName.trim();
		const normalizedLastName = lastName.trim();
		const normalizedEnneagram = enneagram.trim();

		return (
			normalizedFirstName !== profileSnapshot.firstName ||
			normalizedLastName !== profileSnapshot.lastName ||
			normalizedEnneagram !== profileSnapshot.enneagram
		);
	});
	let syncLabel = $derived(formChanged ? 'Modified' : 'Synced');
	let subscriptionLabel = $derived.by(() =>
		subscriptionCount === 1 ? '1 followed question' : `${subscriptionCount} followed questions`
	);

	$effect(() => {
		const nextSnapshot = {
			firstName: normalizeText(user.first_name),
			lastName: normalizeText(user.last_name),
			enneagram: normalizeText(user.enneagram)
		};
		const signature = JSON.stringify([
			userEmail,
			nextSnapshot.firstName,
			nextSnapshot.lastName,
			nextSnapshot.enneagram
		]);

		if (signature === lastLoadedSignature) return;

		firstName = nextSnapshot.firstName;
		lastName = nextSnapshot.lastName;
		enneagram = nextSnapshot.enneagram;
		profileSnapshot = nextSnapshot;
		lastLoadedSignature = signature;
	});

	function normalizeText(value: string | null | undefined) {
		return value?.trim() ?? '';
	}

	function toTitleCase(value: string) {
		return value
			.split(/\s+/)
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	}

	async function submitLogout({ cancel }: { cancel: Function }) {
		loggingOut = true;
		const { error: signOutError } = await supabase.auth.signOut();

		if (signOutError) {
			console.error(signOutError);
			loggingOut = false;
			cancel();
		}
	}

	async function save() {
		saving = true;

		const nextSnapshot = {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			enneagram: enneagram.trim()
		};

		const body = new FormData();
		body.append('firstName', nextSnapshot.firstName);
		body.append('lastName', nextSnapshot.lastName);
		body.append('enneagram', nextSnapshot.enneagram);
		body.append('email', userEmail);

		try {
			const response = await fetch('?/updateAccount', {
				method: 'POST',
				body
			});

			if (!response.ok) {
				throw new Error(`Failed to update account (${response.status})`);
			}

			firstName = nextSnapshot.firstName;
			lastName = nextSnapshot.lastName;
			enneagram = nextSnapshot.enneagram;
			profileSnapshot = nextSnapshot;
			lastLoadedSignature = JSON.stringify([
				userEmail,
				nextSnapshot.firstName,
				nextSnapshot.lastName,
				nextSnapshot.enneagram
			]);

			notifications.success('Account updated', 3000);
		} catch (error) {
			console.error('Error updating account:', error);
			notifications.danger('Failed to update account', 3000);
		} finally {
			saving = false;
		}
	}

	function selectType(num: number) {
		enneagram = String(num);
	}
</script>

<div class="account-page">
	<div class="account-shell">
		<header class="header-panel">
			<div class="header-copy">
				<p class="kicker">Profile settings</p>
				<h1>Account</h1>
				<p class="header-summary">Update the few account details used across 9takes.</p>
			</div>

			<div class="header-rail">
				<div class="header-data">
					<span class="data-key">Signed in as</span>
					<span class="data-value">{displayName}</span>
					<span class="data-subvalue">{userEmail}</span>
				</div>

				<div class="meta-pills">
					<span class="meta-pill">{roleLabel}</span>
					<span class="meta-pill">{subscriptionLabel}</span>
					{#if selectedType}
						<span class="meta-pill meta-pill-accent">{`Type ${selectedType.num}`}</span>
					{/if}
				</div>

				<div class="header-actions">
					{#if user.admin}
						<a href="/admin" class="action-link action-link-primary">Admin dashboard</a>
					{/if}

					<form action="/logout" method="POST" use:enhance={submitLogout}>
						<LoadingButton
							type="submit"
							variant="secondary"
							size="md"
							loading={loggingOut}
							loadingText="Signing out..."
							className="account-action signout-button"
						>
							Sign out
						</LoadingButton>
					</form>
				</div>
			</div>
		</header>

		<div class="content-grid">
			<section class="panel">
				<div class="panel-head">
					<div>
						<p class="section-label">Profile</p>
						<h2>Core fields</h2>
						<p class="section-copy">Keep the basics tight: your name and default type.</p>
					</div>

					<span class="state-pill" class:pending={formChanged}>{syncLabel}</span>
				</div>

				<div class="field-grid">
					<label class="field">
						<span class="field-label">First name</span>
						<input
							type="text"
							id="firstName"
							bind:value={firstName}
							placeholder="First name"
							autocomplete="given-name"
						/>
					</label>

					<label class="field">
						<span class="field-label">Last name</span>
						<input
							type="text"
							id="lastName"
							bind:value={lastName}
							placeholder="Last name"
							autocomplete="family-name"
						/>
					</label>
				</div>

				<fieldset class="type-section">
					<div class="type-section-head">
						<legend>Enneagram</legend>
						<p class="section-copy">Pick the default lens for this account.</p>
					</div>

					<div class="type-grid" role="radiogroup" aria-label="Enneagram type">
						{#each enneagramTypes as type}
							<button
								type="button"
								role="radio"
								class="type-card"
								class:selected={enneagram === String(type.num)}
								aria-checked={enneagram === String(type.num)}
								onclick={() => selectType(type.num)}
								style={`--type-accent: ${type.color}`}
							>
								<span class="type-number">{type.num}</span>
								<span class="type-body">
									<strong>{type.name}</strong>
								</span>
							</button>
						{/each}
					</div>
				</fieldset>

				<p class="type-note" style={`--type-accent: ${selectedType?.color || 'var(--primary)'}`}>
					{#if selectedType}
						<strong>{`Type ${selectedType.num} / ${selectedType.name}`}</strong>
						<span>{selectedType.descriptor}</span>
					{:else}
						<span>No type selected yet.</span>
					{/if}
				</p>

				<div class="form-actions">
					<LoadingButton
						type="button"
						variant="primary"
						size="md"
						loading={saving}
						disabled={!formChanged}
						loadingText="Saving..."
						onclick={save}
						className="account-action save-button"
					>
						Save changes
					</LoadingButton>

					<p class="action-note" role="status">
						{formChanged ? 'Save to commit the current edits.' : 'All fields are in sync.'}
					</p>
				</div>
			</section>

			<section class="panel side-panel" id="subscriptions">
				<div class="panel-head">
					<div>
						<p class="section-label">Watchlist</p>
						<h2>Followed questions</h2>
						<p class="section-copy">The questions you're currently following.</p>
					</div>

					<a href="/questions" class="text-link">Browse</a>
				</div>

				{#if !subscriptions.length}
					<div class="empty-block">
						<strong>No active follows</strong>
						<p>Follow a question to keep it on this list.</p>
						<a href="/questions" class="text-link">Open questions</a>
					</div>
				{:else}
					<ul class="subscription-list">
						{#each subscriptions as subscription, index}
							<li>
								<a href={`/questions/${subscription.questions.url}`} class="subscription-row">
									<span class="row-index">{String(index + 1).padStart(2, '0')}</span>
									<span class="row-text">
										{subscription.questions.question_formatted || subscription.questions.question}
									</span>
									<span class="row-action">Open</span>
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		</div>
	</div>
</div>

<style lang="scss">
	.account-page {
		position: relative;
		min-height: 100vh;
		padding: 1.1rem 1rem 3rem;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg-deep) 88%, black) 0%,
			var(--bg-base) 100%
		);
	}

	.account-page::before {
		content: '';
		position: fixed;
		inset: 0;
		pointer-events: none;
		opacity: 0.14;
		background-image:
			linear-gradient(
				to right,
				color-mix(in srgb, var(--text-tertiary) 18%, transparent) 1px,
				transparent 1px
			),
			linear-gradient(
				to bottom,
				color-mix(in srgb, var(--text-tertiary) 18%, transparent) 1px,
				transparent 1px
			);
		background-size: 32px 32px;
	}

	.account-shell {
		position: relative;
		max-width: 1080px;
		margin: 0 auto;
		display: grid;
		gap: 0.9rem;
	}

	.header-panel,
	.panel {
		position: relative;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		border-radius: 0.95rem;
		background: color-mix(in srgb, var(--bg-surface) 96%, transparent);
		box-shadow: 0 16px 36px rgba(12, 10, 9, 0.16);
	}

	.header-panel {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
		gap: 1rem;
		padding: 1rem 1.1rem;
		align-items: start;
	}

	.header-copy {
		min-width: 0;
	}

	.kicker,
	.data-key,
	.section-label,
	.row-index,
	.row-action {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.kicker,
	.section-label {
		margin: 0 0 0.4rem;
		color: color-mix(in srgb, var(--primary) 70%, var(--text-tertiary));
	}

	.header-copy h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.9rem, 4vw, 2.75rem);
		line-height: 0.95;
		color: var(--text-primary);
	}

	.header-summary {
		margin: 0.45rem 0 0;
		max-width: 36rem;
		color: var(--text-secondary);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.header-rail {
		display: grid;
		gap: 0.7rem;
		align-content: start;
	}

	.header-data {
		display: grid;
		gap: 0.2rem;
		padding: 0.85rem 0.95rem;
		border-radius: 0.8rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 14%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
	}

	.data-key,
	.row-index,
	.row-action {
		color: var(--text-tertiary);
	}

	.data-value {
		color: var(--text-primary);
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.3;
		word-break: break-word;
	}

	.data-subvalue {
		color: var(--text-secondary);
		font-size: 0.84rem;
		word-break: break-all;
	}

	.meta-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.meta-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
		color: var(--text-primary);
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1;
	}

	.meta-pill-accent {
		border-color: color-mix(in srgb, var(--primary) 28%, transparent);
		background: color-mix(in srgb, var(--primary) 10%, var(--bg-deep));
	}

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		align-items: center;
	}

	.header-actions form {
		display: flex;
	}

	.action-link,
	.text-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.5rem;
		padding: 0.65rem 0.9rem;
		border-radius: 0.7rem;
		text-decoration: none;
		font-weight: 600;
		transition:
			background 0.18s ease,
			border-color 0.18s ease,
			transform 0.18s ease;
	}

	.action-link {
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		background: color-mix(in srgb, var(--primary) 10%, var(--bg-deep));
		color: var(--text-primary);
	}

	.action-link:hover,
	.text-link:hover {
		transform: translateY(-1px);
	}

	.action-link-primary {
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
		border-color: var(--primary);
		color: var(--text-on-primary);
	}

	.content-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.9fr);
		gap: 0.9rem;
		align-items: start;
	}

	.panel {
		padding: 1rem;
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.85rem;
		margin-bottom: 0.9rem;
		padding-bottom: 0.85rem;
		border-bottom: 1px solid color-mix(in srgb, var(--text-tertiary) 12%, transparent);
	}

	.panel-head h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.3rem;
		line-height: 1;
		color: var(--text-primary);
	}

	.section-copy {
		margin: 0.3rem 0 0;
		color: var(--text-secondary);
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.state-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--success) 24%, transparent);
		background: color-mix(in srgb, var(--success) 10%, var(--bg-deep));
		color: var(--text-primary);
		font-size: 0.78rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.state-pill.pending {
		border-color: color-mix(in srgb, var(--warning) 28%, transparent);
		background: color-mix(in srgb, var(--warning) 12%, var(--bg-deep));
	}

	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.field {
		display: grid;
		gap: 0.35rem;
	}

	.field-label {
		font-size: 0.76rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--text-primary);
	}

	.field input {
		width: 100%;
		padding: 0.75rem 0.85rem;
		border-radius: 0.7rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
		color: var(--text-primary);
		font-size: 0.95rem;
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.field input::placeholder {
		color: var(--text-muted);
	}

	.field input:focus {
		outline: none;
		border-color: color-mix(in srgb, var(--primary) 40%, transparent);
		box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.12);
	}

	.type-section {
		margin: 0.9rem 0 0;
		padding: 0;
		border: 0;
	}

	.type-section-head {
		display: grid;
		gap: 0.2rem;
	}

	.type-section legend {
		padding: 0;
		margin-bottom: 0;
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.65rem;
		margin-top: 0.75rem;
	}

	.type-card {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.6rem;
		align-items: center;
		padding: 0.7rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--type-accent) 18%, var(--text-tertiary));
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
		color: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.18s ease,
			background 0.18s ease,
			transform 0.18s ease;
	}

	.type-card:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--type-accent) 44%, transparent);
	}

	.type-card.selected {
		border-color: color-mix(in srgb, var(--type-accent) 56%, transparent);
		background: color-mix(in srgb, var(--type-accent) 12%, var(--bg-deep));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--type-accent) 22%, transparent);
	}

	.type-number {
		min-width: 2rem;
		height: 2rem;
		padding: 0 0.45rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--type-accent) 18%, var(--bg-base));
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 700;
	}

	.type-body {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.type-body strong {
		color: var(--text-primary);
		font-size: 0.9rem;
		line-height: 1.25;
	}

	.type-note {
		display: grid;
		gap: 0.15rem;
		margin: 0.8rem 0 0;
		padding: 0.8rem 0.9rem;
		border-radius: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--type-accent, var(--primary)) 18%, transparent);
		background: color-mix(in srgb, var(--type-accent, var(--primary)) 8%, var(--bg-deep));
		color: var(--text-secondary);
		font-size: 0.88rem;
		line-height: 1.4;
	}

	.type-note strong {
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 0.95rem;
	}

	.form-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 0.9rem;
		padding-top: 0.9rem;
		border-top: 1px solid color-mix(in srgb, var(--text-tertiary) 12%, transparent);
	}

	.action-note {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.88rem;
	}

	.subscription-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.6rem;
	}

	.subscription-row {
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 14%, transparent);
		border-radius: 0.8rem;
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
	}

	.text-link {
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 90%, transparent);
		color: var(--text-primary);
	}

	.empty-block {
		display: grid;
		gap: 0.5rem;
		padding: 0.9rem;
		border: 1px dashed color-mix(in srgb, var(--text-tertiary) 22%, transparent);
		border-radius: 0.8rem;
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
	}

	.empty-block strong {
		color: var(--text-primary);
		font-family: var(--font-mono);
	}

	.empty-block p {
		margin: 0;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.subscription-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: 0.75rem;
		align-items: start;
		padding: 0.8rem 0.9rem;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.18s ease,
			background 0.18s ease,
			transform 0.18s ease;
	}

	.subscription-row:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--primary) 32%, transparent);
		background: color-mix(in srgb, var(--primary) 9%, var(--bg-deep));
	}

	.row-text {
		color: var(--text-primary);
		font-size: 0.92rem;
		line-height: 1.45;
	}

	.header-actions :global(.account-action),
	.form-actions :global(.account-action) {
		justify-content: center;
	}

	.form-actions :global(.save-button) {
		min-width: 10rem;
	}

	@media (max-width: 960px) {
		.header-panel,
		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.account-page {
			padding: 0.85rem 0.75rem 2.5rem;
		}

		.header-panel,
		.panel {
			padding: 0.95rem;
		}

		.panel-head,
		.form-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.field-grid {
			grid-template-columns: 1fr;
		}

		.type-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.header-actions,
		.header-actions form {
			display: grid;
			width: 100%;
		}

		.action-link,
		.text-link,
		.header-actions :global(.account-action),
		.form-actions :global(.account-action) {
			width: 100%;
		}

		.subscription-row {
			grid-template-columns: auto 1fr;
		}

		.row-action {
			display: none;
		}
	}

	@media (max-width: 480px) {
		.type-card {
			padding-inline: 0.7rem;
		}

		.type-body strong {
			font-size: 0.84rem;
		}
	}
</style>

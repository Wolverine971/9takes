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
		summary: string;
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
			summary: 'Type 1 energy tends to sharpen standards and raise the quality bar around you.',
			color: 'var(--type-1-color)'
		},
		{
			num: 2,
			name: 'Helper',
			descriptor: 'Warm, relational, and quick to support',
			summary: 'Type 2 energy brings attentiveness, generosity, and a people-first instinct.',
			color: 'var(--type-2-color)'
		},
		{
			num: 3,
			name: 'Achiever',
			descriptor: 'Driven, adaptive, and outcome-focused',
			summary: 'Type 3 energy brings momentum, polish, and a bias toward making things happen.',
			color: 'var(--type-3-color)'
		},
		{
			num: 4,
			name: 'Individualist',
			descriptor: 'Expressive, nuanced, and emotionally precise',
			summary: 'Type 4 energy brings originality, depth, and strong emotional texture.',
			color: 'var(--type-4-color)'
		},
		{
			num: 5,
			name: 'Investigator',
			descriptor: 'Analytical, reserved, and insight-oriented',
			summary: 'Type 5 energy brings clarity, pattern recognition, and thoughtful distance.',
			color: 'var(--type-5-color)'
		},
		{
			num: 6,
			name: 'Loyalist',
			descriptor: 'Committed, vigilant, and team-minded',
			summary: 'Type 6 energy brings steadiness, preparation, and a sharp read on risk.',
			color: 'var(--type-6-color)'
		},
		{
			num: 7,
			name: 'Enthusiast',
			descriptor: 'Upbeat, expansive, and possibility-driven',
			summary: 'Type 7 energy brings optimism, momentum, and fast-moving curiosity.',
			color: 'var(--type-7-color)'
		},
		{
			num: 8,
			name: 'Challenger',
			descriptor: 'Direct, powerful, and action-first',
			summary: 'Type 8 energy brings decisiveness, protection, and a willingness to press forward.',
			color: 'var(--type-8-color)'
		},
		{
			num: 9,
			name: 'Peacemaker',
			descriptor: 'Grounded, receptive, and harmony-oriented',
			summary: 'Type 9 energy brings calm, integration, and a wide view of the room.',
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
	let initials = $derived.by(() => {
		const nameParts = [firstName.trim(), lastName.trim()].filter(Boolean);
		if (nameParts.length > 0) {
			return nameParts
				.slice(0, 2)
				.map((part) => part.charAt(0).toUpperCase())
				.join('');
		}

		return userEmail.charAt(0).toUpperCase() || 'U';
	});
	let readinessItems = $derived.by(() => [
		{ label: 'First name added', complete: firstName.trim().length > 0 },
		{ label: 'Last name added', complete: lastName.trim().length > 0 },
		{ label: 'Type selected', complete: enneagram.trim().length > 0 }
	]);
	let completedReadinessCount = $derived.by(
		() => readinessItems.filter((item) => item.complete).length
	);
	let profileCompletion = $derived.by(() =>
		Math.round((completedReadinessCount / readinessItems.length) * 100)
	);
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
	let accountStatus = $derived.by(() => {
		if (formChanged) return 'Pending sync';
		if (profileCompletion === 100) return 'Ready';
		return 'Partial';
	});
	let accountStatusDetail = $derived.by(() => {
		if (formChanged) return 'Unsaved edits are still local to this form.';
		return `${completedReadinessCount}/${readinessItems.length} core fields configured.`;
	});
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
			<div class="header-main">
				<div class="identity-mark">{initials}</div>

				<div class="header-copy">
					<p class="kicker">Account / Profile</p>
					<h1>{displayName}</h1>
					<p class="header-summary">
						Core account fields, type assignment, and followed question threads.
					</p>
				</div>
			</div>

			<div class="header-rail">
				<div class="header-data">
					<span class="data-key">Email</span>
					<span class="data-value">{userEmail}</span>
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

		<section class="summary-grid" aria-label="Account summary">
			<article class="summary-card">
				<span class="summary-label">Status</span>
				<strong>{accountStatus}</strong>
				<span class="summary-detail">{accountStatusDetail}</span>
			</article>

			<article class="summary-card">
				<span class="summary-label">Completion</span>
				<strong>{profileCompletion}%</strong>
				<span class="summary-detail"
					>{completedReadinessCount}/{readinessItems.length} core fields set</span
				>
			</article>

			<article class="summary-card">
				<span class="summary-label">Type</span>
				<strong>{selectedType ? `Type ${selectedType.num}` : 'Unset'}</strong>
				<span class="summary-detail">
					{selectedType ? selectedType.name : 'No default type assigned'}
				</span>
			</article>

			<article class="summary-card">
				<span class="summary-label">Watchlist</span>
				<strong>{subscriptionCount}</strong>
				<span class="summary-detail">{subscriptionLabel}</span>
			</article>
		</section>

		<div class="content-grid">
			<section class="panel">
				<div class="panel-head">
					<div>
						<p class="section-label">Profile editor</p>
						<h2>Account fields</h2>
						<p class="section-copy">Minimal identity data used by the account system.</p>
					</div>

					<span class="state-pill" class:pending={formChanged}>{syncLabel}</span>
				</div>

				<div class="spec-list" aria-label="Account specification">
					<div class="spec-row">
						<span class="spec-key">Sign-in email</span>
						<span class="spec-value break">{userEmail}</span>
					</div>
					<div class="spec-row">
						<span class="spec-key">Access</span>
						<span class="spec-value">{roleLabel}</span>
					</div>
					<div class="spec-row">
						<span class="spec-key">Current type</span>
						<span class="spec-value">
							{selectedType ? `Type ${selectedType.num} / ${selectedType.name}` : 'Unset'}
						</span>
					</div>
					<div class="spec-row">
						<span class="spec-key">Followed threads</span>
						<span class="spec-value">{subscriptionLabel}</span>
					</div>
				</div>

				<div class="field-grid">
					<label class="field-card">
						<span class="field-label">First name</span>
						<span class="field-help">Display and personalization field.</span>
						<input
							type="text"
							id="firstName"
							bind:value={firstName}
							placeholder="Enter first name"
							autocomplete="given-name"
						/>
					</label>

					<label class="field-card">
						<span class="field-label">Last name</span>
						<span class="field-help">Optional completion field.</span>
						<input
							type="text"
							id="lastName"
							bind:value={lastName}
							placeholder="Enter last name"
							autocomplete="family-name"
						/>
					</label>
				</div>

				<fieldset class="type-section">
					<legend>Enneagram</legend>
					<p class="section-copy">Pick the default lens for this account.</p>

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
									<span>{type.descriptor}</span>
								</span>
							</button>
						{/each}
					</div>
				</fieldset>

				<div
					class="type-readout"
					style={`--type-accent: ${selectedType?.color || 'var(--primary)'}`}
				>
					<span class="summary-label">Selected</span>
					<strong
						>{selectedType
							? `Type ${selectedType.num} / ${selectedType.name}`
							: 'No type selected'}</strong
					>
					<p>
						{selectedType
							? selectedType.summary
							: 'This value is used for personality context across the site.'}
					</p>
				</div>

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

			<div class="side-column">
				<section class="panel side-panel">
					<div class="panel-head">
						<div>
							<p class="section-label">Readiness</p>
							<h2>Checklist</h2>
							<p class="section-copy">Short operational view of profile state.</p>
						</div>
					</div>

					<ul class="checklist">
						{#each readinessItems as item}
							<li class="check-row" class:complete={item.complete}>
								<span class="check-status">{item.complete ? 'OK' : '--'}</span>
								<span class="check-text">{item.label}</span>
							</li>
						{/each}
					</ul>

					<div class="status-note">
						<span class="summary-label">Current type</span>
						<strong
							>{selectedType ? `Type ${selectedType.num} / ${selectedType.name}` : 'Unset'}</strong
						>
						<p>
							{selectedType
								? selectedType.descriptor
								: 'Select a type to complete the account profile.'}
						</p>
					</div>
				</section>

				<section class="panel side-panel" id="subscriptions">
					<div class="panel-head">
						<div>
							<p class="section-label">Watchlist</p>
							<h2>Followed questions</h2>
							<p class="section-copy">Compact list of active follows.</p>
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
</div>

<style lang="scss">
	.account-page {
		position: relative;
		min-height: 100vh;
		padding: 1.5rem 1rem 4rem;
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
		opacity: 0.18;
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
		background-size: 28px 28px;
	}

	.account-shell {
		position: relative;
		max-width: 1120px;
		margin: 0 auto;
		display: grid;
		gap: 1rem;
	}

	.header-panel,
	.panel,
	.summary-card {
		position: relative;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		border-radius: 1rem;
		background: color-mix(in srgb, var(--bg-surface) 96%, transparent);
		box-shadow: 0 18px 40px rgba(12, 10, 9, 0.18);
	}

	.header-panel {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
		gap: 1rem;
		padding: 1.25rem;
	}

	.header-main {
		display: flex;
		gap: 1rem;
		min-width: 0;
	}

	.identity-mark {
		flex: 0 0 4rem;
		width: 4rem;
		height: 4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.875rem;
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		background: color-mix(in srgb, var(--primary) 12%, var(--bg-deep));
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 1.35rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.header-copy {
		min-width: 0;
	}

	.kicker,
	.data-key,
	.summary-label,
	.section-label,
	.spec-key,
	.check-status,
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
		font-size: clamp(2.2rem, 5vw, 3.35rem);
		line-height: 0.95;
		color: var(--text-primary);
	}

	.header-summary {
		margin: 0.6rem 0 0;
		max-width: 36rem;
		color: var(--text-secondary);
		line-height: 1.55;
	}

	.header-rail {
		display: grid;
		gap: 0.85rem;
		align-content: start;
	}

	.header-data {
		display: grid;
		gap: 0.45rem;
		padding: 0.9rem 1rem;
		border-radius: 0.875rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 14%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
	}

	.data-key,
	.spec-key,
	.summary-label,
	.row-index,
	.row-action {
		color: var(--text-tertiary);
	}

	.data-value {
		color: var(--text-primary);
		font-size: 0.95rem;
		word-break: break-all;
	}

	.header-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
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
		min-height: 2.75rem;
		padding: 0.7rem 1rem;
		border-radius: 0.75rem;
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

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.85rem;
	}

	.summary-card {
		padding: 1rem;
	}

	.summary-card strong,
	.type-readout strong,
	.status-note strong {
		display: block;
		margin-top: 0.55rem;
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 1.1rem;
		line-height: 1.25;
	}

	.summary-detail {
		display: block;
		margin-top: 0.55rem;
		color: var(--text-secondary);
		font-size: 0.88rem;
		line-height: 1.45;
	}

	.content-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.9fr);
		gap: 1rem;
		align-items: start;
	}

	.side-column {
		display: grid;
		gap: 1rem;
	}

	.panel {
		padding: 1.15rem;
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--text-tertiary) 12%, transparent);
	}

	.panel-head h2 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1;
		color: var(--text-primary);
	}

	.section-copy {
		margin: 0.45rem 0 0;
		color: var(--text-secondary);
		line-height: 1.55;
	}

	.state-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.45rem 0.75rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--success) 24%, transparent);
		background: color-mix(in srgb, var(--success) 10%, var(--bg-deep));
		color: var(--text-primary);
		font-size: 0.82rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.state-pill.pending {
		border-color: color-mix(in srgb, var(--warning) 28%, transparent);
		background: color-mix(in srgb, var(--warning) 12%, var(--bg-deep));
	}

	.spec-list {
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 12%, transparent);
		border-radius: 0.875rem;
		overflow: hidden;
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
	}

	.spec-row {
		display: grid;
		grid-template-columns: 150px minmax(0, 1fr);
		gap: 1rem;
		padding: 0.85rem 1rem;
	}

	.spec-row + .spec-row {
		border-top: 1px solid color-mix(in srgb, var(--text-tertiary) 12%, transparent);
	}

	.spec-value {
		color: var(--text-primary);
		line-height: 1.45;
	}

	.spec-value.break {
		word-break: break-all;
	}

	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.85rem;
		margin-top: 1rem;
	}

	.field-card {
		display: grid;
		gap: 0.45rem;
	}

	.field-label {
		font-size: 0.84rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.field-help {
		font-size: 0.82rem;
		color: var(--text-tertiary);
	}

	.field-card input {
		width: 100%;
		padding: 0.85rem 0.95rem;
		border-radius: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
		color: var(--text-primary);
		font-size: 1rem;
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease;
	}

	.field-card input::placeholder {
		color: var(--text-muted);
	}

	.field-card input:focus {
		outline: none;
		border-color: color-mix(in srgb, var(--primary) 40%, transparent);
		box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.12);
	}

	.type-section {
		margin: 1rem 0 0;
		padding: 0;
		border: 0;
	}

	.type-section legend {
		padding: 0;
		margin-bottom: 0.35rem;
		font-family: var(--font-display);
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
		margin-top: 0.9rem;
	}

	.type-card {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.7rem;
		align-items: flex-start;
		padding: 0.85rem;
		border: 1px solid color-mix(in srgb, var(--type-accent) 18%, var(--text-tertiary));
		border-radius: 0.85rem;
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
		width: 2rem;
		height: 2rem;
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
		gap: 0.28rem;
		min-width: 0;
	}

	.type-body strong {
		color: var(--text-primary);
		font-size: 0.95rem;
		line-height: 1.25;
	}

	.type-body span {
		color: var(--text-secondary);
		font-size: 0.78rem;
		line-height: 1.4;
	}

	.type-readout,
	.status-note {
		margin-top: 1rem;
		padding: 0.95rem 1rem;
		border-radius: 0.875rem;
		border: 1px solid color-mix(in srgb, var(--type-accent, var(--primary)) 18%, transparent);
		background: color-mix(in srgb, var(--type-accent, var(--primary)) 8%, var(--bg-deep));
	}

	.type-readout p,
	.status-note p {
		margin: 0.55rem 0 0;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.form-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid color-mix(in srgb, var(--text-tertiary) 12%, transparent);
	}

	.action-note {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.checklist,
	.subscription-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}

	.check-row,
	.subscription-row {
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 14%, transparent);
		border-radius: 0.875rem;
		background: color-mix(in srgb, var(--bg-deep) 92%, transparent);
	}

	.check-row {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.75rem;
		align-items: center;
		padding: 0.85rem 0.95rem;
	}

	.check-status {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2.5rem;
		padding: 0.3rem 0.45rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		background: color-mix(in srgb, var(--bg-base) 32%, transparent);
	}

	.check-row.complete .check-status {
		border-color: color-mix(in srgb, var(--primary) 28%, transparent);
		background: color-mix(in srgb, var(--primary) 12%, var(--bg-base));
		color: var(--primary-light);
	}

	.check-text {
		color: var(--text-primary);
	}

	.text-link {
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 90%, transparent);
		color: var(--text-primary);
	}

	.empty-block {
		display: grid;
		gap: 0.65rem;
		padding: 1rem;
		border: 1px dashed color-mix(in srgb, var(--text-tertiary) 22%, transparent);
		border-radius: 0.875rem;
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
		gap: 0.85rem;
		align-items: start;
		padding: 0.9rem 1rem;
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
		line-height: 1.5;
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

		.summary-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.header-rail {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.account-page {
			padding: 1rem 0.85rem 3rem;
		}

		.header-panel,
		.panel,
		.summary-card {
			padding: 1rem;
		}

		.header-main,
		.panel-head,
		.form-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.summary-grid,
		.field-grid,
		.type-grid {
			grid-template-columns: 1fr;
		}

		.spec-row {
			grid-template-columns: 1fr;
			gap: 0.35rem;
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
</style>

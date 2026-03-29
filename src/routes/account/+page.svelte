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
	let roleLabel = $derived(user.admin ? 'Admin access' : 'Member access');
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
	let profilePulse = $derived.by(() => {
		if (formChanged) return 'Unsaved changes';
		if (profileCompletion === 100) return 'Profile complete';
		return 'Room to fill in';
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
	<div class="ambient ambient-left" aria-hidden="true"></div>
	<div class="ambient ambient-right" aria-hidden="true"></div>

	<div class="account-shell">
		<section class="hero-panel" style={`--type-accent: ${selectedType?.color || 'var(--primary)'}`}>
			<div class="hero-content">
				<div class="identity-block">
					<div class="avatar-ring">
						<div class="avatar">{initials}</div>
					</div>

					<div class="identity-copy">
						<p class="eyebrow">Account Center</p>
						<h1>{displayName}</h1>
						<p class="hero-text">
							Keep your account current so your answers, follows, and personality context stay
							sharp.
						</p>

						<div class="identity-meta">
							<span>{userEmail}</span>
							<span>
								{selectedType
									? `Type ${selectedType.num} - ${selectedType.name}`
									: 'Type not selected'}
							</span>
							<span>{roleLabel}</span>
						</div>
					</div>
				</div>

				<div class="hero-rail">
					<div class="pulse-card">
						<span class="mono-label">PROFILE PULSE</span>
						<strong>{profilePulse}</strong>
						<p>
							{#if formChanged}
								Save your edits to sync this account.
							{:else if selectedType}
								{selectedType.descriptor}
							{:else}
								Add your type to give your profile a clearer center of gravity.
							{/if}
						</p>
					</div>

					<div class="hero-actions">
						{#if user.admin}
							<a href="/admin" class="admin-link">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
									<path
										d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
									/>
								</svg>
								Admin dashboard
							</a>
						{/if}

						<form action="/logout" method="POST" use:enhance={submitLogout}>
							<LoadingButton
								type="submit"
								variant="secondary"
								size="md"
								loading={loggingOut}
								loadingText="Signing out..."
								className="signout-button"
							>
								Sign out
							</LoadingButton>
						</form>
					</div>
				</div>
			</div>

			<div class="stats-strip">
				<article class="stat-card">
					<span class="stat-label">Completion</span>
					<strong>{profileCompletion}%</strong>
					<span class="stat-detail"
						>{completedReadinessCount} of {readinessItems.length} basics set</span
					>
				</article>

				<article class="stat-card">
					<span class="stat-label">Following</span>
					<strong>{subscriptionCount}</strong>
					<span class="stat-detail">
						{subscriptionCount === 1 ? 'Question in your watchlist' : 'Questions in your watchlist'}
					</span>
				</article>

				<article class="stat-card">
					<span class="stat-label">Type status</span>
					<strong>{selectedType ? `Type ${selectedType.num}` : 'Open'}</strong>
					<span class="stat-detail">
						{selectedType ? selectedType.name : 'Choose the type that fits you best'}
					</span>
				</article>
			</div>
		</section>

		<div class="dashboard-grid">
			<section class="panel editor-panel">
				<div class="panel-heading">
					<div>
						<p class="panel-kicker">Profile Details</p>
						<h2>Tune how you show up on 9takes</h2>
						<p class="panel-copy">
							These basics make your account feel finished and keep future personality features
							anchored to the right context.
						</p>
					</div>

					<span class="sync-pill" class:pending={formChanged}>
						{formChanged ? 'Unsaved changes' : 'In sync'}
					</span>
				</div>

				<div class="field-grid">
					<label class="field-card">
						<span class="field-label">First name</span>
						<span class="field-help">Used anywhere we personalize your account view.</span>
						<input
							type="text"
							id="firstName"
							bind:value={firstName}
							placeholder="Enter your first name"
							autocomplete="given-name"
						/>
					</label>

					<label class="field-card">
						<span class="field-label">Last name</span>
						<span class="field-help">Helpful when you want your profile to feel complete.</span>
						<input
							type="text"
							id="lastName"
							bind:value={lastName}
							placeholder="Enter your last name"
							autocomplete="family-name"
						/>
					</label>
				</div>

				<div class="email-lockup">
					<div>
						<span class="mono-label">SIGN-IN EMAIL</span>
						<strong>{userEmail}</strong>
					</div>

					<p>
						Email changes are managed through authentication, so this address stays read-only on
						this page.
					</p>
				</div>

				<fieldset class="type-section">
					<legend class="type-legend">Enneagram type</legend>

					<div class="type-heading">
						<p>Select the lens that best matches how you naturally operate.</p>

						{#if selectedType}
							<div class="type-chip" style={`--chip-accent: ${selectedType.color}`}>
								<span>Current type</span>
								<strong>{selectedType.num}. {selectedType.name}</strong>
							</div>
						{/if}
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
									<span>{type.descriptor}</span>
								</span>
							</button>
						{/each}
					</div>
				</fieldset>

				<div
					class="type-summary"
					style={`--type-accent: ${selectedType?.color || 'var(--primary)'}`}
				>
					<span class="type-summary-label">CURRENT READ</span>
					<h3>{selectedType ? selectedType.name : 'Choose your type'}</h3>
					<p>
						{selectedType
							? selectedType.summary
							: 'Picking a type gives your responses clearer personality context across the site.'}
					</p>
				</div>

				<div class="form-actions">
					<LoadingButton
						type="button"
						variant="primary"
						size="lg"
						loading={saving}
						disabled={!formChanged}
						loadingText="Saving..."
						onclick={save}
						className="save-button"
					>
						Save changes
					</LoadingButton>

					<p class="action-note" role="status">
						{formChanged ? 'You have edits waiting to be saved.' : 'No pending changes.'}
					</p>
				</div>
			</section>

			<section class="panel subscriptions-panel" id="subscriptions">
				<div class="panel-heading">
					<div>
						<p class="panel-kicker">Followed Questions</p>
						<h2>Keep tabs on the conversations that matter</h2>
						<p class="panel-copy">This is your clean watchlist of threads worth returning to.</p>
					</div>

					<a href="/questions" class="browse-link">Browse questions</a>
				</div>

				{#if !subscriptions.length}
					<div class="empty-state">
						<div class="empty-symbol">?</div>
						<h3>No followed questions yet</h3>
						<p>
							Start following questions to build a quick return path into the conversations you care
							about.
						</p>
						<a href="/questions" class="cta-link">Find questions to follow</a>
					</div>
				{:else}
					<p class="subscriptions-copy">
						{subscriptionLabel}. Keep this list tight so it stays genuinely useful.
					</p>

					<ul class="subscription-list">
						{#each subscriptions as subscription, index}
							<li>
								<a href={`/questions/${subscription.questions.url}`} class="subscription-item">
									<span class="subscription-rank">{String(index + 1).padStart(2, '0')}</span>

									<div class="subscription-body">
										<span class="subscription-kicker">FOLLOWED QUESTION</span>
										<span class="subscription-text">
											{subscription.questions.question_formatted || subscription.questions.question}
										</span>
									</div>

									<span class="subscription-arrow" aria-hidden="true">
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
										</svg>
									</span>
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
		padding: 2rem 1rem 4rem;
		overflow: hidden;
		background:
			radial-gradient(circle at top left, rgba(45, 212, 191, 0.16), transparent 35%),
			radial-gradient(circle at top right, rgba(167, 139, 250, 0.12), transparent 32%),
			linear-gradient(180deg, var(--bg-base) 0%, color-mix(in srgb, var(--bg-deep) 92%, black) 100%);
	}

	.ambient {
		position: absolute;
		width: 22rem;
		height: 22rem;
		border-radius: 999px;
		filter: blur(90px);
		opacity: 0.45;
		pointer-events: none;
	}

	.ambient-left {
		top: -6rem;
		left: -7rem;
		background: color-mix(in srgb, var(--primary) 45%, transparent);
	}

	.ambient-right {
		top: 10rem;
		right: -8rem;
		background: color-mix(in srgb, var(--accent) 35%, transparent);
	}

	.account-shell {
		position: relative;
		max-width: 1160px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.hero-panel,
	.panel {
		position: relative;
		border-radius: 1.5rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		backdrop-filter: blur(18px);
		box-shadow: 0 24px 60px rgba(12, 10, 9, 0.28);
		overflow: hidden;
	}

	.hero-panel {
		padding: 1.5rem;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--type-accent, var(--primary)) 12%, var(--bg-surface)) 0%,
			color-mix(in srgb, var(--bg-deep) 88%, black) 100%
		);
		border-color: color-mix(in srgb, var(--type-accent, var(--primary)) 24%, transparent);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background:
				linear-gradient(120deg, rgba(255, 255, 255, 0.04), transparent 30%),
				radial-gradient(
					circle at 85% 15%,
					color-mix(in srgb, var(--type-accent, var(--primary)) 20%, transparent),
					transparent 24%
				);
			pointer-events: none;
		}
	}

	.hero-content {
		position: relative;
		display: grid;
		gap: 1.5rem;
		z-index: 1;
	}

	.identity-block {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.avatar-ring {
		padding: 0.35rem;
		border-radius: 1.3rem;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--type-accent, var(--primary)) 60%, transparent),
			color-mix(in srgb, var(--accent) 40%, transparent)
		);
		box-shadow: 0 18px 40px color-mix(in srgb, var(--type-accent, var(--primary)) 18%, transparent);
	}

	.avatar {
		width: 4.5rem;
		height: 4.5rem;
		border-radius: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--bg-base) 76%, var(--type-accent, var(--primary)));
		color: var(--text-primary);
		font-family: var(--font-display);
		font-size: 1.8rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.identity-copy {
		min-width: 0;
	}

	.eyebrow,
	.mono-label,
	.panel-kicker,
	.subscription-kicker,
	.type-summary-label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.eyebrow {
		margin: 0 0 0.4rem;
		color: color-mix(in srgb, var(--type-accent, var(--primary)) 72%, var(--text-secondary));
	}

	.identity-copy h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 6vw, 4.4rem);
		line-height: 0.92;
		color: var(--text-primary);
	}

	.hero-text {
		max-width: 44rem;
		margin: 0.75rem 0 0;
		font-size: 1.05rem;
		line-height: 1.65;
		color: var(--text-secondary);
	}

	.identity-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin-top: 1rem;

		span {
			padding: 0.4rem 0.7rem;
			border-radius: 999px;
			border: 1px solid color-mix(in srgb, var(--text-tertiary) 18%, transparent);
			background: color-mix(in srgb, var(--bg-base) 32%, transparent);
			color: var(--text-secondary);
			font-size: 0.82rem;
		}
	}

	.hero-rail {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.pulse-card {
		padding: 1.1rem;
		border-radius: 1.2rem;
		border: 1px solid color-mix(in srgb, var(--type-accent, var(--primary)) 24%, transparent);
		background: color-mix(in srgb, var(--bg-base) 32%, transparent);

		strong {
			display: block;
			margin-top: 0.5rem;
			font-family: var(--font-display);
			font-size: 1.45rem;
			line-height: 1;
			color: var(--text-primary);
		}

		p {
			margin: 0.55rem 0 0;
			color: var(--text-secondary);
			line-height: 1.6;
		}
	}

	.mono-label,
	.panel-kicker,
	.subscription-kicker,
	.type-summary-label {
		color: color-mix(in srgb, var(--type-accent, var(--primary)) 72%, var(--text-tertiary));
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.admin-link,
	.browse-link,
	.cta-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 2.9rem;
		padding: 0.7rem 1rem;
		border-radius: 0.95rem;
		text-decoration: none;
		font-weight: 600;
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			background 0.18s ease,
			box-shadow 0.18s ease;
	}

	.admin-link {
		background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
		color: var(--text-on-primary);
		box-shadow: 0 12px 30px rgba(20, 184, 166, 0.22);

		svg {
			width: 1rem;
			height: 1rem;
		}

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 16px 36px rgba(20, 184, 166, 0.3);
		}
	}

	.stats-strip {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
		margin-top: 1.25rem;
	}

	.stat-card {
		padding: 1rem 1.05rem;
		border-radius: 1.15rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 14%, transparent);
		background: color-mix(in srgb, var(--bg-base) 28%, transparent);

		strong {
			display: block;
			margin-top: 0.45rem;
			font-family: var(--font-display);
			font-size: 2rem;
			line-height: 1;
			color: var(--text-primary);
		}
	}

	.stat-label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-tertiary);
	}

	.stat-detail {
		display: block;
		margin-top: 0.45rem;
		color: var(--text-secondary);
		font-size: 0.88rem;
		line-height: 1.5;
	}

	.dashboard-grid {
		display: grid;
		gap: 1.25rem;
	}

	.panel {
		padding: 1.35rem;
		background: color-mix(in srgb, var(--bg-surface) 92%, transparent);
	}

	.panel-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.panel-heading h2,
	.empty-state h3,
	.type-summary h3 {
		margin: 0;
		font-family: var(--font-display);
		color: var(--text-primary);
	}

	.panel-heading h2 {
		font-size: clamp(1.75rem, 3vw, 2.4rem);
		line-height: 1;
	}

	.panel-kicker {
		margin: 0 0 0.45rem;
		color: color-mix(in srgb, var(--primary) 72%, var(--text-tertiary));
	}

	.panel-copy,
	.subscriptions-copy {
		margin: 0.45rem 0 0;
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 48rem;
	}

	.sync-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.55rem 0.8rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--success) 28%, transparent);
		background: color-mix(in srgb, var(--success) 10%, var(--bg-deep));
		color: var(--text-primary);
		font-size: 0.82rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.sync-pill.pending {
		border-color: color-mix(in srgb, var(--warning) 30%, transparent);
		background: color-mix(in srgb, var(--warning) 12%, var(--bg-deep));
	}

	.field-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 0.85rem;
	}

	.field-card {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding: 1rem;
		border-radius: 1.1rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 18%, transparent);
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg-elevated) 82%, transparent) 0%,
			color-mix(in srgb, var(--bg-surface) 96%, transparent) 100%
		);
	}

	.field-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--neutral-700);
	}

	.field-help {
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--text-tertiary);
	}

	.field-card input {
		width: 100%;
		margin-top: 0.15rem;
		padding: 0.9rem 0.95rem;
		border-radius: 0.9rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 22%, transparent);
		background: color-mix(in srgb, var(--bg-base) 52%, var(--bg-surface));
		color: var(--text-primary);
		font-size: 1rem;
		transition:
			border-color 0.18s ease,
			box-shadow 0.18s ease,
			background 0.18s ease;

		&::placeholder {
			color: var(--text-muted);
		}

		&:focus {
			outline: none;
			border-color: color-mix(in srgb, var(--primary) 48%, transparent);
			box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.12);
			background: color-mix(in srgb, var(--bg-base) 44%, var(--bg-surface));
		}
	}

	.email-lockup {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin: 1rem 0 1.25rem;
		padding: 1rem 1.1rem;
		border-radius: 1.1rem;
		border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--accent) 7%, var(--bg-deep)) 0%,
			color-mix(in srgb, var(--bg-surface) 96%, transparent) 100%
		);

		strong {
			display: block;
			margin-top: 0.4rem;
			font-size: 1rem;
			font-weight: 600;
			color: var(--text-primary);
			word-break: break-all;
		}

		p {
			max-width: 22rem;
			margin: 0;
			color: var(--text-secondary);
			line-height: 1.6;
		}
	}

	.type-section {
		margin: 0;
		padding: 0;
		border: none;
	}

	.type-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.95rem;

		p {
			margin: 0;
			color: var(--text-secondary);
			line-height: 1.55;
		}
	}

	.type-legend {
		padding: 0;
		margin-bottom: 0.45rem;
		font-family: var(--font-display);
		font-size: 1.45rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.type-chip {
		padding: 0.75rem 0.95rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--chip-accent) 28%, transparent);
		background: color-mix(in srgb, var(--chip-accent) 12%, var(--bg-deep));
		text-align: right;

		span {
			display: block;
			font-family: var(--font-mono);
			font-size: 0.7rem;
			font-weight: 600;
			letter-spacing: 0.12em;
			text-transform: uppercase;
			color: color-mix(in srgb, var(--chip-accent) 72%, var(--text-tertiary));
		}

		strong {
			display: block;
			margin-top: 0.35rem;
			color: var(--text-primary);
			font-size: 0.98rem;
		}
	}

	.type-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
		gap: 0.75rem;
	}

	.type-card {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.95rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--type-accent) 18%, var(--text-tertiary));
		background: color-mix(in srgb, var(--bg-deep) 76%, transparent);
		color: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			background 0.18s ease,
			box-shadow 0.18s ease;

		&:hover {
			transform: translateY(-2px);
			border-color: color-mix(in srgb, var(--type-accent) 44%, transparent);
			box-shadow: 0 12px 28px rgba(12, 10, 9, 0.24);
		}

		&.selected {
			border-color: color-mix(in srgb, var(--type-accent) 58%, transparent);
			background: linear-gradient(
				135deg,
				color-mix(in srgb, var(--type-accent) 15%, var(--bg-deep)) 0%,
				color-mix(in srgb, var(--bg-surface) 96%, transparent) 100%
			);
			box-shadow:
				0 0 0 1px color-mix(in srgb, var(--type-accent) 34%, transparent),
				0 14px 32px rgba(12, 10, 9, 0.28);
		}
	}

	.type-number {
		width: 2.35rem;
		height: 2.35rem;
		border-radius: 0.85rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--type-accent) 18%, var(--bg-base));
		color: var(--text-primary);
		font-family: var(--font-mono);
		font-size: 0.86rem;
		font-weight: 700;
	}

	.type-body {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;

		strong {
			color: var(--text-primary);
			font-size: 1rem;
			line-height: 1.2;
		}

		span {
			color: var(--text-secondary);
			font-size: 0.82rem;
			line-height: 1.45;
		}
	}

	.type-summary {
		margin-top: 1rem;
		padding: 1rem 1.1rem;
		border-radius: 1.1rem;
		border: 1px solid color-mix(in srgb, var(--type-accent) 24%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--type-accent) 12%, var(--bg-deep)) 0%,
			color-mix(in srgb, var(--bg-surface) 96%, transparent) 100%
		);

		.type-summary-label {
			color: color-mix(in srgb, var(--type-accent) 72%, var(--text-tertiary));
		}

		h3 {
			margin-top: 0.45rem;
			font-size: 1.7rem;
		}

		p {
			margin: 0.45rem 0 0;
			color: var(--text-secondary);
			line-height: 1.6;
		}
	}

	.form-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1.25rem;
	}

	.action-note {
		margin: 0;
		font-size: 0.92rem;
		color: var(--text-secondary);
	}

	.cta-link {
		width: 100%;
		margin-top: 0.95rem;
		border: 1px solid color-mix(in srgb, var(--primary) 22%, transparent);
		background: color-mix(in srgb, var(--primary) 10%, var(--bg-deep));
		color: var(--primary-lightest);

		&:hover {
			transform: translateY(-2px);
			border-color: color-mix(in srgb, var(--primary) 36%, transparent);
			box-shadow: 0 16px 36px rgba(20, 184, 166, 0.16);
		}
	}

	.browse-link {
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 20%, transparent);
		background: color-mix(in srgb, var(--bg-deep) 78%, transparent);
		color: var(--text-primary);

		&:hover {
			transform: translateY(-2px);
			border-color: color-mix(in srgb, var(--primary) 28%, transparent);
			background: color-mix(in srgb, var(--primary) 10%, var(--bg-deep));
		}
	}

	.empty-state {
		display: grid;
		justify-items: start;
		gap: 0.9rem;
		padding: 1.2rem;
		border-radius: 1.2rem;
		border: 1px dashed color-mix(in srgb, var(--primary) 28%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--bg-deep) 78%, transparent) 0%,
			color-mix(in srgb, var(--bg-surface) 96%, transparent) 100%
		);

		h3 {
			font-size: 1.85rem;
			line-height: 0.98;
		}

		p {
			max-width: 36rem;
			margin: 0;
			color: var(--text-secondary);
			line-height: 1.65;
		}
	}

	.empty-symbol {
		width: 3.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--primary) 24%, transparent);
		background: color-mix(in srgb, var(--primary) 12%, var(--bg-base));
		font-family: var(--font-display);
		font-size: 1.7rem;
		color: var(--primary-lightest);
	}

	.subscription-list {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
		gap: 0.8rem;
	}

	.subscription-item {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.05rem;
		border-radius: 1.1rem;
		border: 1px solid color-mix(in srgb, var(--text-tertiary) 16%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--bg-deep) 80%, transparent) 0%,
			color-mix(in srgb, var(--bg-surface) 96%, transparent) 100%
		);
		color: inherit;
		text-decoration: none;
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease;

		&:hover {
			transform: translateY(-2px);
			border-color: color-mix(in srgb, var(--primary) 32%, transparent);
			box-shadow: 0 18px 40px rgba(12, 10, 9, 0.28);
		}
	}

	.subscription-rank {
		width: 2.4rem;
		height: 2.4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.85rem;
		background: color-mix(in srgb, var(--primary) 12%, var(--bg-base));
		color: var(--primary-lightest);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
	}

	.subscription-body {
		display: grid;
		gap: 0.3rem;
		min-width: 0;
	}

	.subscription-kicker {
		color: color-mix(in srgb, var(--primary) 72%, var(--text-tertiary));
	}

	.subscription-text {
		color: var(--text-primary);
		font-size: 1rem;
		line-height: 1.55;
	}

	.subscription-arrow {
		width: 2.4rem;
		height: 2.4rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
		background: color-mix(in srgb, var(--primary) 10%, var(--bg-deep));
		color: var(--primary-lightest);

		svg {
			width: 1rem;
			height: 1rem;
		}
	}

	.hero-actions :global(.signout-button),
	.form-actions :global(.save-button) {
		justify-content: center;
	}

	.hero-actions :global(.signout-button) {
		min-width: 10rem;
	}

	.form-actions :global(.save-button) {
		min-width: 12.5rem;
		box-shadow: 0 16px 32px rgba(20, 184, 166, 0.18);
	}

	@media (min-width: 980px) {
		.account-shell {
			max-width: 960px;
		}
	}

	@media (max-width: 767px) {
		.account-page {
			padding: 1.25rem 0.85rem 3rem;
		}

		.hero-panel,
		.panel {
			padding: 1.1rem;
			border-radius: 1.25rem;
		}

		.identity-block,
		.panel-heading,
		.type-heading,
		.email-lockup,
		.form-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.stats-strip {
			grid-template-columns: 1fr;
		}

		.type-grid {
			grid-template-columns: 1fr;
		}

		.type-chip {
			text-align: left;
		}

		.hero-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.hero-actions form,
		.browse-link,
		.admin-link,
		.hero-actions :global(.signout-button),
		.form-actions :global(.save-button) {
			width: 100%;
		}

		.subscription-item {
			grid-template-columns: auto 1fr;
		}

		.subscription-arrow {
			display: none;
		}
	}
</style>

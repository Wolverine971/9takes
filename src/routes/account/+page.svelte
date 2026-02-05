<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import LoadingButton from '$lib/components/atoms/LoadingButton.svelte';

	interface AccountData extends PageData {
		user: {
			first_name: string;
			last_name: string;
			enneagram: string;
			email: string;
			admin: boolean;
		};
		subscriptions: Array<{
			questions: {
				url: string;
				question_formatted: string;
				question: string;
			};
		}>;
	}

	let { data }: { data: AccountData } = $props();

	// Form state initialized empty, populated by $effect
	let firstName = $state('');
	let lastName = $state('');
	let enneagram = $state('');
	let saving = $state(false);
	let loggingOut = $state(false);
	let initialized = $state(false);

	// Initialize and sync form when data changes
	$effect(() => {
		if (data?.user && !initialized) {
			firstName = data.user.first_name ?? '';
			lastName = data.user.last_name ?? '';
			enneagram = data.user.enneagram ?? '';
			initialized = true;
		}
	});

	const formChanged = $derived(
		firstName !== data.user.first_name ||
			lastName !== data.user.last_name ||
			enneagram !== data.user.enneagram
	);

	const enneagramTypes = [
		{ num: 1, name: 'Reformer' },
		{ num: 2, name: 'Helper' },
		{ num: 3, name: 'Achiever' },
		{ num: 4, name: 'Individualist' },
		{ num: 5, name: 'Investigator' },
		{ num: 6, name: 'Loyalist' },
		{ num: 7, name: 'Enthusiast' },
		{ num: 8, name: 'Challenger' },
		{ num: 9, name: 'Peacemaker' }
	];

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
		const body = new FormData();
		body.append('firstName', firstName);
		body.append('lastName', lastName);
		body.append('enneagram', enneagram);
		body.append('email', data.user.email);

		try {
			await fetch('?/updateAccount', { method: 'POST', body });
			notifications.success('Account updated', 3000);
			data.user.first_name = firstName;
			data.user.last_name = lastName;
			data.user.enneagram = enneagram;
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

<div class="page">
	<div class="container">
		<!-- Header Card -->
		<div class="card header-card">
			<div class="header-content">
				<div class="user-info">
					<div class="avatar">
						{data.user.email.charAt(0).toUpperCase()}
					</div>
					<div class="user-details">
						<h1>{data.user.first_name || 'Your Account'}</h1>
						<p class="email">{data.user.email}</p>
					</div>
				</div>
				<div class="header-actions">
					{#if data.user.admin}
						<a href="/admin" class="btn btn-admin">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
								<path
									d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
								/>
							</svg>
							Admin
						</a>
					{/if}
					<form action="/logout" method="POST" use:enhance={submitLogout}>
						<LoadingButton
							type="submit"
							variant="secondary"
							size="md"
							loading={loggingOut}
							loadingText="Signing out..."
						>
							Sign Out
						</LoadingButton>
					</form>
				</div>
			</div>
		</div>

		<!-- Profile Settings Card -->
		<div class="card">
			<div class="card-header">
				<h2>Profile</h2>
				<p class="card-subtitle">Manage your personal information</p>
			</div>

			<div class="form-grid">
				<div class="form-field">
					<label for="firstName">First Name</label>
					<input
						type="text"
						id="firstName"
						bind:value={firstName}
						placeholder="Enter your first name"
					/>
				</div>
				<div class="form-field">
					<label for="lastName">Last Name</label>
					<input
						type="text"
						id="lastName"
						bind:value={lastName}
						placeholder="Enter your last name"
					/>
				</div>
			</div>

			<fieldset class="form-field enneagram-field">
				<legend>Enneagram Type</legend>
				<p class="field-hint">Select your personality type</p>
				<div class="type-grid" role="radiogroup" aria-label="Enneagram Type">
					{#each enneagramTypes as type}
						<button
							class="type-btn"
							class:selected={enneagram === String(type.num)}
							onclick={() => selectType(type.num)}
							type="button"
							role="radio"
							aria-checked={enneagram === String(type.num)}
						>
							<span class="type-num">{type.num}</span>
							<span class="type-name">{type.name}</span>
						</button>
					{/each}
				</div>
			</fieldset>

			<div class="form-actions">
				<LoadingButton
					type="button"
					variant="primary"
					size="lg"
					loading={saving}
					disabled={!formChanged}
					loadingText="Saving..."
					onclick={save}
				>
					Save Changes
				</LoadingButton>
				{#if formChanged}
					<span class="unsaved-hint">You have unsaved changes</span>
				{/if}
			</div>
		</div>

		<!-- Subscriptions Card -->
		<div class="card">
			<div class="card-header">
				<div class="card-header-row">
					<h2>Subscribed Questions</h2>
					{#if data.subscriptions?.length}
						<span class="badge">{data.subscriptions.length}</span>
					{/if}
				</div>
				<p class="card-subtitle">Questions you're following for updates</p>
			</div>

			{#if !data.subscriptions?.length}
				<div class="empty-state">
					<div class="empty-icon">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<path
								d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
					<p>No subscribed questions yet</p>
					<span class="empty-hint">Subscribe to questions to get notified about new answers</span>
					<a href="/questions" class="btn btn-outline">Browse Questions</a>
				</div>
			{:else}
				<ul class="subscription-list">
					{#each data.subscriptions as subscription}
						<li>
							<a href="/questions/{subscription.questions.url}" class="subscription-item">
								<span class="question-text">
									{subscription.questions.question_formatted || subscription.questions.question}
								</span>
								<svg
									class="chevron"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.page {
		min-height: 100vh;
		padding: 1.5rem 1rem 3rem;
		background: linear-gradient(180deg, rgba(15, 15, 25, 0.5) 0%, transparent 100%);
	}

	.container {
		width: 100%;
		max-width: 720px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card {
		width: 100%;
		box-sizing: border-box;
		background: rgba(20, 20, 30, 0.8);
		border: 1px solid rgba(100, 116, 139, 0.15);
		border-radius: 1rem;
		padding: 1.25rem;
		backdrop-filter: blur(10px);
	}

	.header-card {
		background: linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(20, 20, 30, 0.9) 100%);
		border-color: rgba(124, 58, 237, 0.2);
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 0.875rem;
	}

	.avatar {
		width: 3rem;
		height: 3rem;
		background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
		border-radius: 0.625rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 700;
		color: white;
		text-transform: uppercase;
		flex-shrink: 0;
	}

	.user-details {
		min-width: 0;
		flex: 1;

		h1 {
			font-size: 1.125rem;
			font-weight: 600;
			color: #f1f5f9;
			margin: 0 0 0.125rem;
			line-height: 1.2;
		}

		.email {
			font-size: 0.8125rem;
			color: #94a3b8;
			margin: 0;
			word-break: break-all;
		}
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.875rem;
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.15s ease;
		cursor: pointer;
		border: none;

		svg {
			width: 0.875rem;
			height: 0.875rem;
		}
	}

	.btn-admin {
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		color: white;

		&:hover {
			filter: brightness(1.1);
		}
	}

	.btn-outline {
		background: transparent;
		border: 1px solid rgba(124, 58, 237, 0.4);
		color: #a78bfa;

		&:hover {
			background: rgba(124, 58, 237, 0.1);
			border-color: #7c3aed;
		}
	}

	.card-header {
		margin-bottom: 1.25rem;

		h2 {
			font-size: 1rem;
			font-weight: 600;
			color: #f1f5f9;
			margin: 0 0 0.125rem;
		}
	}

	.card-header-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.card-subtitle {
		font-size: 0.75rem;
		color: #64748b;
		margin: 0;
	}

	.badge {
		background: rgba(124, 58, 237, 0.2);
		color: #a78bfa;
		padding: 0.125rem 0.5rem;
		border-radius: 1rem;
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.875rem;
		margin-bottom: 1.25rem;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		label {
			font-size: 0.75rem;
			font-weight: 500;
			color: #cbd5e1;
		}

		input {
			width: 100%;
			padding: 0.625rem 0.875rem;
			background: rgba(15, 23, 42, 0.6);
			border: 1px solid rgba(100, 116, 139, 0.25);
			border-radius: 0.5rem;
			color: #f1f5f9;
			font-size: 0.875rem;
			transition: all 0.15s ease;

			&::placeholder {
				color: #475569;
			}

			&:hover {
				border-color: rgba(100, 116, 139, 0.4);
			}

			&:focus {
				outline: none;
				border-color: #7c3aed;
				box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
			}
		}
	}

	.field-hint {
		font-size: 0.6875rem;
		color: #64748b;
		margin: 0;
	}

	.enneagram-field {
		margin-bottom: 1.25rem;
		border: none;
		padding: 0;

		legend {
			font-size: 0.8125rem;
			font-weight: 500;
			color: #cbd5e1;
			margin-bottom: 0.375rem;
		}
	}

	.type-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		margin-top: 0.375rem;
	}

	.type-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.625rem 0.375rem;
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid rgba(100, 116, 139, 0.2);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.15s ease;

		&:hover {
			background: rgba(124, 58, 237, 0.1);
			border-color: rgba(124, 58, 237, 0.3);
		}

		&.selected {
			background: rgba(124, 58, 237, 0.2);
			border-color: #7c3aed;

			.type-num {
				color: #a78bfa;
			}

			.type-name {
				color: #c4b5fd;
			}
		}

		.type-num {
			font-size: 1.125rem;
			font-weight: 700;
			color: #e2e8f0;
			line-height: 1;
		}

		.type-name {
			font-size: 0.625rem;
			color: #64748b;
			margin-top: 0.125rem;
			text-transform: uppercase;
			letter-spacing: 0.01em;
		}
	}

	.form-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.unsaved-hint {
		font-size: 0.6875rem;
		color: #f59e0b;
	}

	.empty-state {
		text-align: center;
		padding: 1.5rem 1rem;

		p {
			color: #94a3b8;
			margin: 0.5rem 0 0.25rem;
			font-size: 0.875rem;
			font-weight: 500;
		}

		.empty-hint {
			display: block;
			font-size: 0.75rem;
			color: #64748b;
			margin-bottom: 1rem;
		}
	}

	.empty-icon {
		width: 2.5rem;
		height: 2.5rem;
		margin: 0 auto;
		color: #475569;

		svg {
			width: 100%;
			height: 100%;
		}
	}

	.subscription-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		max-height: 280px;
		overflow-y: auto;

		&::-webkit-scrollbar {
			width: 4px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(124, 58, 237, 0.3);
			border-radius: 2px;
		}
	}

	.subscription-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.625rem;
		padding: 0.75rem 0.875rem;
		background: rgba(15, 23, 42, 0.4);
		border: 1px solid rgba(100, 116, 139, 0.1);
		border-radius: 0.5rem;
		text-decoration: none;
		transition: all 0.15s ease;

		&:hover {
			background: rgba(124, 58, 237, 0.08);
			border-color: rgba(124, 58, 237, 0.2);

			.chevron {
				opacity: 1;
				transform: translateX(2px);
			}
		}

		.question-text {
			color: #e2e8f0;
			font-size: 0.875rem;
			line-height: 1.4;
		}

		.chevron {
			width: 1rem;
			height: 1rem;
			color: #7c3aed;
			opacity: 0.4;
			flex-shrink: 0;
			transition: all 0.15s ease;
		}
	}

	@media (min-width: 480px) {
		.page {
			padding: 2rem 1.5rem 4rem;
		}

		.container {
			gap: 1.25rem;
		}

		.card {
			padding: 1.5rem;
		}

		.header-content {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.avatar {
			width: 3.25rem;
			height: 3.25rem;
			font-size: 1.375rem;
		}

		.user-details h1 {
			font-size: 1.25rem;
		}

		.form-grid {
			grid-template-columns: 1fr 1fr;
		}

		.form-actions {
			flex-direction: row;
			align-items: center;
		}

		.type-grid {
			grid-template-columns: repeat(9, 1fr);
			gap: 0.375rem;
		}

		.type-btn {
			padding: 0.5rem 0.25rem;

			.type-num {
				font-size: 1rem;
			}

			.type-name {
				font-size: 0.5625rem;
			}
		}
	}

	@media (min-width: 768px) {
		.page {
			padding: 3rem 2rem 5rem;
		}

		.container {
			max-width: 800px;
			gap: 1.5rem;
		}

		.card {
			padding: 1.75rem;
		}

		.avatar {
			width: 3.5rem;
			height: 3.5rem;
			font-size: 1.5rem;
		}

		.user-details h1 {
			font-size: 1.375rem;
		}

		.card-header h2 {
			font-size: 1.125rem;
		}

		.type-grid {
			gap: 0.5rem;
		}

		.type-btn {
			padding: 0.75rem 0.375rem;

			.type-num {
				font-size: 1.125rem;
			}

			.type-name {
				font-size: 0.625rem;
			}
		}
	}
</style>

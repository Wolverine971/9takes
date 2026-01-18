<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import EnneagramSelect from '$lib/components/molecules/Enneagram-Select.svelte';

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

	export let data: AccountData;

	let firstName = data.user.first_name;
	let lastName = data.user.last_name;
	let enneagram = data.user.enneagram;
	let formChanged = false;

	$: formChanged =
		firstName !== data.user.first_name ||
		lastName !== data.user.last_name ||
		enneagram !== data.user.enneagram;

	async function submitLogout({ cancel }: { cancel: Function }) {
		const { error: signOutError } = await supabase.auth.signOut();
		if (signOutError) {
			console.error(signOutError);
			cancel();
		}
	}

	async function save() {
		const body = new FormData();
		body.append('firstName', firstName);
		body.append('lastName', lastName);
		body.append('enneagram', enneagram);
		body.append('email', data.user.email);

		try {
			await fetch('?/updateAccount', { method: 'POST', body });
			notifications.success('Account updated', 3000);
		} catch (error) {
			console.error('Error updating account:', error);
			notifications.danger('Failed to update account', 3000);
		}
	}
</script>

<div class="page-wrapper">
	<div class="account-card">
		<header class="header">
			<div class="user-badge">
				<div class="avatar">
					<span>{data.user.email.charAt(0).toUpperCase()}</span>
				</div>
				<div class="user-info">
					<h1>{data.user.first_name || 'Welcome'}</h1>
					<p class="email">{data.user.email}</p>
				</div>
			</div>
			<div class="header-actions">
				<form action="/logout" method="POST" use:enhance={submitLogout}>
					<button type="submit" class="btn-logout">Logout</button>
				</form>
				{#if data.user.admin}
					<a href="/admin" class="btn-admin">Admin</a>
				{/if}
			</div>
		</header>

		<section class="profile-section">
			<div class="section-header">
				<h2>Profile Settings</h2>
			</div>
			<div class="input-group">
				<div class="input-field">
					<label for="firstName">First Name</label>
					<input type="text" id="firstName" bind:value={firstName} placeholder="Enter first name" />
				</div>
				<div class="input-field">
					<label for="lastName">Last Name</label>
					<input type="text" id="lastName" bind:value={lastName} placeholder="Enter last name" />
				</div>
			</div>
			<div class="enneagram-select">
				<label>Enneagram Type</label>
				<EnneagramSelect
					selectedEnneagram={enneagram}
					on:enneagramSelected={({ detail }) => (enneagram = detail)}
				/>
			</div>
			<button
				type="button"
				disabled={!formChanged}
				class="btn-save"
				class:disabled={!formChanged}
				on:click={save}
			>
				Save Changes
			</button>
		</section>

		<section class="subscriptions-section">
			<div class="section-header">
				<h2>Question Subscriptions</h2>
				<span class="count">{data.subscriptions?.length || 0}</span>
			</div>
			{#if !data.subscriptions?.length}
				<div class="empty-state">
					<p>You haven't subscribed to any questions yet</p>
					<a href="/questions" class="btn-explore">Explore Questions</a>
				</div>
			{:else}
				<div class="subscription-list">
					{#each data.subscriptions as subscription}
						<a href="/questions/{subscription.questions.url}" class="subscription-link">
							<span class="question-text">
								{subscription.questions.question_formatted || subscription.questions.question}
							</span>
							<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					{/each}
				</div>
			{/if}
		</section>
	</div>
</div>

<style lang="scss">
	.page-wrapper {
		min-height: 100vh;
		padding: 2rem 1rem;
	}

	.account-card {
		background: linear-gradient(135deg, #16161e 0%, #1a1a2e 100%);
		border: 1px solid rgba(124, 58, 237, 0.2);
		border-radius: 1rem;
		padding: 2rem;
		margin: 0 auto;
		max-width: 800px;
		box-shadow:
			0 4px 24px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(124, 58, 237, 0.1);
	}

	.header {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(100, 116, 139, 0.2);
	}

	.user-badge {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.avatar {
		width: 3.5rem;
		height: 3.5rem;
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);

		span {
			font-size: 1.5rem;
			font-weight: 700;
			color: white;
			text-transform: uppercase;
		}
	}

	.user-info {
		h1 {
			font-size: 1.5rem;
			font-weight: 700;
			color: #f1f5f9;
			margin: 0 0 0.25rem;
		}

		.email {
			font-size: 0.875rem;
			color: #64748b;
			margin: 0;
			word-break: break-all;
		}
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.btn-logout {
		padding: 0.625rem 1.25rem;
		background: transparent;
		border: 1px solid rgba(100, 116, 139, 0.3);
		border-radius: 0.5rem;
		color: #94a3b8;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			background: rgba(239, 68, 68, 0.1);
			border-color: rgba(239, 68, 68, 0.5);
			color: #ef4444;
		}
	}

	.btn-admin {
		padding: 0.625rem 1.25rem;
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		border: none;
		border-radius: 0.5rem;
		color: white;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
		}
	}

	.profile-section,
	.subscriptions-section {
		background: rgba(10, 10, 15, 0.5);
		border: 1px solid rgba(100, 116, 139, 0.15);
		border-radius: 0.75rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.25rem;

		h2 {
			font-size: 1.125rem;
			font-weight: 600;
			color: #f1f5f9;
			margin: 0;
		}

		.count {
			background: rgba(124, 58, 237, 0.2);
			color: #a78bfa;
			padding: 0.25rem 0.75rem;
			border-radius: 2rem;
			font-size: 0.75rem;
			font-weight: 600;
		}
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.input-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		label {
			font-size: 0.8125rem;
			font-weight: 500;
			color: #94a3b8;
		}

		input {
			width: 100%;
			padding: 0.75rem 1rem;
			background: #0a0a0f;
			border: 1px solid rgba(100, 116, 139, 0.3);
			border-radius: 0.5rem;
			color: #f1f5f9;
			font-size: 0.9375rem;
			transition: all 0.2s ease;

			&::placeholder {
				color: #475569;
			}

			&:focus {
				outline: none;
				border-color: #7c3aed;
				box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
			}
		}
	}

	.enneagram-select {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1.25rem;

		label {
			font-size: 0.8125rem;
			font-weight: 500;
			color: #94a3b8;
		}
	}

	.btn-save {
		width: 100%;
		padding: 0.875rem 1.5rem;
		background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
		border: none;
		border-radius: 0.5rem;
		color: white;
		font-size: 0.9375rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover:not(.disabled) {
			transform: translateY(-2px);
			box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
			background: #475569;
		}
	}

	.empty-state {
		text-align: center;
		padding: 2rem 1rem;

		p {
			color: #64748b;
			margin: 0 0 1rem;
		}
	}

	.btn-explore {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background: transparent;
		border: 1px solid rgba(124, 58, 237, 0.5);
		border-radius: 0.5rem;
		color: #a78bfa;
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background: rgba(124, 58, 237, 0.1);
			border-color: #7c3aed;
		}
	}

	.subscription-list {
		max-height: 300px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-track {
			background: rgba(100, 116, 139, 0.1);
			border-radius: 3px;
		}

		&::-webkit-scrollbar-thumb {
			background: rgba(124, 58, 237, 0.3);
			border-radius: 3px;

			&:hover {
				background: rgba(124, 58, 237, 0.5);
			}
		}
	}

	.subscription-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.875rem 1rem;
		background: rgba(124, 58, 237, 0.05);
		border: 1px solid rgba(100, 116, 139, 0.1);
		border-radius: 0.5rem;
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background: rgba(124, 58, 237, 0.1);
			border-color: rgba(124, 58, 237, 0.3);
			transform: translateX(4px);

			.arrow {
				opacity: 1;
				transform: translateX(2px);
			}
		}

		.question-text {
			color: #e2e8f0;
			font-size: 0.9375rem;
			line-height: 1.4;
		}

		.arrow {
			width: 1.25rem;
			height: 1.25rem;
			color: #7c3aed;
			opacity: 0.5;
			flex-shrink: 0;
			transition: all 0.2s ease;
		}
	}

	@media (min-width: 600px) {
		.page-wrapper {
			padding: 3rem 1.5rem;
		}

		.account-card {
			padding: 2.5rem;
		}

		.header {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.input-group {
			flex-direction: row;

			.input-field {
				flex: 1;
			}
		}

		.enneagram-select {
			flex-direction: row;
			align-items: center;
			gap: 1rem;

			label {
				white-space: nowrap;
			}
		}

		.btn-save {
			width: auto;
			align-self: flex-end;
		}
	}

	@media (max-width: 480px) {
		.page-wrapper {
			padding: 1rem 0.75rem;
		}

		.account-card {
			padding: 1.25rem;
			border-radius: 0.75rem;
		}

		.avatar {
			width: 3rem;
			height: 3rem;

			span {
				font-size: 1.25rem;
			}
		}

		.user-info h1 {
			font-size: 1.25rem;
		}

		.profile-section,
		.subscriptions-section {
			padding: 1rem;
		}

		.subscription-link {
			padding: 0.75rem;

			.question-text {
				font-size: 0.875rem;
			}
		}
	}
</style>

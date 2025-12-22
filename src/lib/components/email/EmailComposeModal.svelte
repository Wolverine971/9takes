<!-- src/lib/components/email/EmailComposeModal.svelte -->
<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { EmailRecipient } from '$lib/types/email';
	import { notifications } from '$lib/components/molecules/notifications';

	// Props
	export let open = false;
	export let recipients: EmailRecipient[] = [];
	export let initialSubject = '';
	export let initialContent = '';
	export let initialScheduledFor = '';

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		close: void;
		send: { sent: number; failed: number };
		schedule: { recipient_count: number; scheduled_for: string };
		saveDraft: void;
	}>();

	// Compose state
	let subject = initialSubject;
	let htmlContent = initialContent;
	let scheduledFor = initialScheduledFor;
	let isSending = false;
	let showPreview = false;

	// Generate modal state
	let showGenerate = false;
	let generateInstructions = '';
	let generateTone: 'professional' | 'friendly' | 'casual' = 'professional';
	let isGenerating = false;

	// Body scroll management
	let previousBodyOverflow = '';

	// Reset form when opened with new data
	$: if (open) {
		subject = initialSubject;
		htmlContent = initialContent;
		scheduledFor = initialScheduledFor;
		showPreview = false;
		showGenerate = false;

		if (typeof document !== 'undefined') {
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
		}
	} else {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = previousBodyOverflow;
		}
	}

	// Cleanup on destroy
	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = previousBodyOverflow;
		}
	});

	/**
	 * Close modal and reset state
	 */
	function closeModal() {
		open = false;
		subject = '';
		htmlContent = '';
		scheduledFor = '';
		showPreview = false;
		showGenerate = false;
		dispatch('close');
	}

	/**
	 * Handle backdrop click
	 */
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	/**
	 * Handle keyboard events
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (showGenerate) {
				showGenerate = false;
			} else {
				closeModal();
			}
		}
	}

	/**
	 * Get audience type description
	 */
	function getAudienceType(): string {
		const sources = [...new Set(recipients.map((r) => r.source))];
		if (sources.length === 1) {
			switch (sources[0]) {
				case 'profiles':
					return 'Registered users';
				case 'signups':
					return 'Waitlist signups';
				case 'coaching_waitlist':
					return 'Coaching waitlist';
			}
		}
		return 'Mixed audience';
	}

	/**
	 * Send emails
	 */
	async function sendEmails() {
		if (!subject.trim() || !htmlContent.trim()) {
			notifications.warning('Subject and content are required', 3000);
			return;
		}

		isSending = true;
		try {
			const endpoint = scheduledFor
				? '/api/admin/email-dashboard/schedule'
				: '/api/admin/email-dashboard/send';

			const body: Record<string, unknown> = {
				recipients: recipients.map((r) => ({
					email: r.email,
					name: r.name,
					source: r.source,
					source_id: r.source_id
				})),
				subject,
				html_content: htmlContent
			};

			if (scheduledFor) {
				body.scheduled_for = scheduledFor;
			}

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			const result = await response.json();

			if (response.ok) {
				if (scheduledFor) {
					notifications.success(
						`Scheduled ${result.recipient_count} emails for ${new Date(scheduledFor).toLocaleString()}`,
						5000
					);
					dispatch('schedule', {
						recipient_count: result.recipient_count,
						scheduled_for: scheduledFor
					});
				} else {
					notifications.success(`Sent ${result.sent} emails, ${result.failed} failed`, 5000);
					dispatch('send', { sent: result.sent, failed: result.failed });
				}
				closeModal();
			} else {
				notifications.danger(result.message || 'Failed to send emails', 5000);
			}
		} catch (error) {
			console.error('Error sending emails:', error);
			notifications.danger('Failed to send emails', 3000);
		} finally {
			isSending = false;
		}
	}

	/**
	 * Generate email with AI
	 */
	async function generateEmail() {
		if (!generateInstructions.trim()) {
			notifications.warning('Please provide instructions', 3000);
			return;
		}

		isGenerating = true;
		try {
			const response = await fetch('/api/admin/email-dashboard/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					instructions: generateInstructions,
					context: {
						recipient_count: recipients.length,
						audience_type: getAudienceType(),
						tone: generateTone
					}
				})
			});

			const result = await response.json();

			if (response.ok) {
				subject = result.subject;
				htmlContent = result.html_content;
				showGenerate = false;
				generateInstructions = '';
				notifications.success('Email generated successfully', 3000);
			} else {
				notifications.danger(result.message || 'Failed to generate email', 3000);
			}
		} catch (error) {
			console.error('Error generating email:', error);
			notifications.danger('Failed to generate email', 3000);
		} finally {
			isGenerating = false;
		}
	}

	/**
	 * Save draft
	 */
	async function saveDraft() {
		try {
			const response = await fetch('/api/admin/email-dashboard/drafts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					subject,
					html_content: htmlContent,
					recipients,
					scheduled_for: scheduledFor || null
				})
			});

			if (response.ok) {
				notifications.success('Draft saved', 3000);
				dispatch('saveDraft');
			} else {
				notifications.danger('Failed to save draft', 3000);
			}
		} catch (error) {
			console.error('Error saving draft:', error);
			notifications.danger('Failed to save draft', 3000);
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- Main Compose Modal -->
	<div
		class="modal-overlay"
		role="dialog"
		aria-modal="true"
		aria-labelledby="compose-title"
		on:click={handleBackdropClick}
		in:fade={{ duration: 200, easing: cubicOut }}
		out:fade={{ duration: 150, easing: cubicOut }}
	>
		<div
			class="compose-modal"
			in:scale={{ duration: 200, easing: cubicOut, start: 0.95 }}
			out:scale={{ duration: 150, easing: cubicOut, start: 0.95 }}
			on:click|stopPropagation
		>
			<div class="compose-header">
				<h2 id="compose-title">Compose Email</h2>
				<button class="close-btn" aria-label="Close" on:click={closeModal}>&times;</button>
			</div>

			<div class="compose-body">
				<!-- Recipients -->
				<div class="form-group">
					<label>To: ({recipients.length} recipients)</label>
					<div class="recipients-preview">
						{#each recipients.slice(0, 5) as recipient}
							<span class="recipient-chip">{recipient.email}</span>
						{/each}
						{#if recipients.length > 5}
							<span class="recipient-chip more">+{recipients.length - 5} more</span>
						{/if}
					</div>
				</div>

				<!-- Subject -->
				<div class="form-group">
					<label for="compose-subject">Subject</label>
					<input
						id="compose-subject"
						type="text"
						bind:value={subject}
						placeholder="Email subject..."
						class="form-input"
					/>
				</div>

				<!-- Content -->
				<div class="form-group">
					<div class="content-header">
						<label for="compose-content">Content (HTML)</label>
						<div class="content-actions">
							<button class="btn btn-secondary btn-sm" on:click={() => (showGenerate = true)}>
								Generate with AI
							</button>
							<button
								class="btn btn-secondary btn-sm"
								on:click={() => (showPreview = !showPreview)}
							>
								{showPreview ? 'Edit' : 'Preview'}
							</button>
						</div>
					</div>

					{#if showPreview}
						<div class="email-preview">
							{@html htmlContent}
						</div>
					{:else}
						<textarea
							id="compose-content"
							bind:value={htmlContent}
							placeholder="<h1>Hello {{ name }}!</h1><p>Your email content here...</p>"
							class="form-textarea"
							rows="12"
						></textarea>
					{/if}
				</div>

				<!-- Schedule -->
				<div class="form-group">
					<label for="compose-schedule">Schedule (optional)</label>
					<input
						id="compose-schedule"
						type="datetime-local"
						bind:value={scheduledFor}
						class="form-input"
						min={new Date().toISOString().slice(0, 16)}
					/>
				</div>
			</div>

			<div class="compose-footer">
				<button class="btn btn-secondary" on:click={saveDraft}>Save Draft</button>
				<button class="btn btn-primary" on:click={sendEmails} disabled={isSending}>
					{#if isSending}
						Sending...
					{:else if scheduledFor}
						Schedule
					{:else}
						Send Now
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Generate Modal (nested) -->
	{#if showGenerate}
		<div
			class="modal-overlay generate-overlay"
			role="dialog"
			aria-modal="true"
			aria-labelledby="generate-title"
			on:click|self={() => (showGenerate = false)}
			in:fade={{ duration: 150, easing: cubicOut }}
			out:fade={{ duration: 100, easing: cubicOut }}
		>
			<div
				class="generate-modal"
				in:scale={{ duration: 150, easing: cubicOut, start: 0.95 }}
				out:scale={{ duration: 100, easing: cubicOut, start: 0.95 }}
				on:click|stopPropagation
			>
				<div class="compose-header">
					<h2 id="generate-title">Generate Email with AI</h2>
					<button class="close-btn" aria-label="Close" on:click={() => (showGenerate = false)}
						>&times;</button
					>
				</div>

				<div class="compose-body">
					<div class="form-group">
						<label for="generate-instructions">What would you like the email to say?</label>
						<textarea
							id="generate-instructions"
							bind:value={generateInstructions}
							placeholder="Write a welcome email for new coaching waitlist signups. Mention the Enneagram personality system and encourage them to explore the platform..."
							class="form-textarea"
							rows="6"
						></textarea>
					</div>

					<div class="form-group">
						<label for="generate-tone">Tone</label>
						<select id="generate-tone" bind:value={generateTone} class="form-input">
							<option value="professional">Professional</option>
							<option value="friendly">Friendly</option>
							<option value="casual">Casual</option>
						</select>
					</div>

					<div class="context-info">
						<p><strong>Audience:</strong> {getAudienceType()}</p>
						<p><strong>Recipients:</strong> {recipients.length}</p>
					</div>
				</div>

				<div class="compose-footer">
					<button class="btn btn-secondary" on:click={() => (showGenerate = false)}>Cancel</button>
					<button class="btn btn-primary" on:click={generateEmail} disabled={isGenerating}>
						{isGenerating ? 'Generating...' : 'Generate'}
					</button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	/* Modal Overlay */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.generate-overlay {
		z-index: 1001;
		background: rgba(0, 0, 0, 0.3);
	}

	/* Compose Modal */
	.compose-modal,
	.generate-modal {
		background: var(--card-background, #ffffff);
		border-radius: var(--border-radius, 8px);
		width: 100%;
		max-width: 700px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
	}

	.generate-modal {
		max-width: 500px;
	}

	.compose-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border-color, #e5e7eb);
	}

	.compose-header h2 {
		margin: 0;
		font-size: 1.125rem;
		color: var(--text-primary, #1f2937);
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary, #6b7280);
		line-height: 1;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.close-btn:hover {
		color: var(--text-primary, #1f2937);
		background: var(--hover-background, #f3f4f6);
	}

	.compose-body {
		padding: 1.5rem;
		overflow-y: auto;
		flex: 1;
	}

	.compose-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--border-color, #e5e7eb);
	}

	/* Form Elements */
	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		font-size: 0.875rem;
		color: var(--text-primary, #1f2937);
	}

	.form-input,
	.form-textarea {
		width: 100%;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--border-color, #e5e7eb);
		border-radius: var(--border-radius, 8px);
		font-size: 0.875rem;
		background: var(--background, #ffffff);
		font-family: inherit;
		color: var(--text-primary, #1f2937);
	}

	.form-textarea {
		resize: vertical;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
	}

	.form-input:focus,
	.form-textarea:focus {
		outline: none;
		border-color: var(--primary, #6c5ce7);
		box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
	}

	/* Recipients Preview */
	.recipients-preview {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.recipient-chip {
		background: var(--background, #f9fafb);
		border: 1px solid var(--border-color, #e5e7eb);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		color: var(--text-primary, #1f2937);
	}

	.recipient-chip.more {
		background: var(--primary, #6c5ce7);
		color: white;
		border-color: var(--primary, #6c5ce7);
	}

	/* Content Header */
	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.content-header label {
		margin-bottom: 0;
	}

	.content-actions {
		display: flex;
		gap: 0.5rem;
	}

	/* Email Preview */
	.email-preview {
		border: 1px solid var(--border-color, #e5e7eb);
		border-radius: var(--border-radius, 8px);
		padding: 1.5rem;
		background: white;
		min-height: 200px;
		font-family: var(--font-family);
	}

	/* Context Info */
	.context-info {
		background: var(--background, #f9fafb);
		padding: 0.75rem 1rem;
		border-radius: var(--border-radius, 8px);
		font-size: 0.875rem;
	}

	.context-info p {
		margin: 0.25rem 0;
		color: var(--text-primary, #1f2937);
	}

	/* Buttons */
	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: var(--border-radius, 8px);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--primary, #6c5ce7);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--primary-dark, #5b4cdb);
	}

	.btn-secondary {
		background: var(--background, #ffffff);
		border: 1px solid var(--border-color, #e5e7eb);
		color: var(--text-primary, #1f2937);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--hover-background, #f3f4f6);
	}

	.btn-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.compose-modal {
			max-height: 100vh;
			border-radius: 0;
		}

		.modal-overlay {
			padding: 0;
		}

		.content-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.compose-footer {
			flex-direction: column-reverse;
		}

		.compose-footer .btn {
			width: 100%;
		}
	}
</style>

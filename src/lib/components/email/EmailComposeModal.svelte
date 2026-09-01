<!-- src/lib/components/email/EmailComposeModal.svelte -->
<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { X } from '@lucide/svelte';
	import type { EmailRecipient } from '$lib/types/email';
	import HtmlPreviewFrame from '$lib/components/admin/HtmlPreviewFrame.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { Button, Field, Input, Select, Textarea } from '$lib/components/atoms';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';

	const COMPOSE_MODAL_ID = 'email-compose-modal';
	const GENERATE_MODAL_ID = 'email-generate-modal';

	// Props
	export let open = false;
	export let recipients: EmailRecipient[] = [];
	export let initialSubject = '';
	export let initialContent = '';
	export let initialScheduledFor = '';
	export let initialDraftId: string | undefined = undefined;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		close: void;
		send: { sent: number; failed: number };
		schedule: { recipient_count: number; scheduled_for: string };
		saveDraft: { id?: string };
	}>();

	// Compose state
	let subject = initialSubject;
	let htmlContent = initialContent;
	let scheduledFor = initialScheduledFor;
	let draftId = initialDraftId;
	let minScheduleDateTime = '';
	let isSending = false;
	let showPreview = false;
	let composeError = '';

	// Generate modal state
	let showGenerate = false;
	let generateInstructions = '';
	let generateTone: 'professional' | 'friendly' | 'casual' = 'professional';
	let isGenerating = false;
	let generateError = '';
	let composeControllerOpen = false;
	let generateControllerOpen = false;
	let previousOpenState = false;
	let previousGenerateState = false;

	function toLocalDateTimeValue(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function toISOFromLocalDateTime(value: string): string | null {
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) {
			return null;
		}
		return parsed.toISOString();
	}

	function resetForOpen() {
		subject = initialSubject;
		htmlContent = initialContent;
		scheduledFor = initialScheduledFor;
		draftId = initialDraftId;
		minScheduleDateTime = toLocalDateTimeValue(new Date());
		showPreview = false;
		showGenerate = false;
		composeError = '';
		generateError = '';
	}

	function handleComposeControllerClose() {
		composeControllerOpen = false;
		open = false;
		subject = '';
		htmlContent = '';
		scheduledFor = '';
		draftId = undefined;
		showPreview = false;
		showGenerate = false;
		composeError = '';
		dispatch('close');
	}

	function handleGenerateControllerClose() {
		generateControllerOpen = false;
		showGenerate = false;
		generateError = '';
	}

	function openComposeController() {
		if (!open || composeControllerOpen) return;
		const controller = getModal(COMPOSE_MODAL_ID);
		if (!controller) return;
		composeControllerOpen = true;
		controller.open(handleComposeControllerClose);
	}

	function openGenerateController() {
		if (!showGenerate || generateControllerOpen) return;
		const controller = getModal(GENERATE_MODAL_ID);
		if (!controller) return;
		generateControllerOpen = true;
		controller.open(handleGenerateControllerClose);
	}

	$: if (open !== previousOpenState) {
		previousOpenState = open;
		if (open) {
			resetForOpen();
			void tick().then(openComposeController);
		} else if (composeControllerOpen) {
			if (generateControllerOpen) getModal(GENERATE_MODAL_ID)?.close(null);
			getModal(COMPOSE_MODAL_ID)?.close(null);
		}
	}

	$: if (showGenerate !== previousGenerateState) {
		previousGenerateState = showGenerate;
		if (showGenerate) void tick().then(openGenerateController);
		else if (generateControllerOpen) getModal(GENERATE_MODAL_ID)?.close(null);
	}

	/**
	 * Close modal and reset state
	 */
	function closeModal() {
		if (generateControllerOpen) getModal(GENERATE_MODAL_ID)?.close(null);
		if (composeControllerOpen) getModal(COMPOSE_MODAL_ID)?.close(null);
		else handleComposeControllerClose();
	}

	function closeGenerateModal() {
		if (generateControllerOpen) getModal(GENERATE_MODAL_ID)?.close(null);
		else handleGenerateControllerClose();
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
		composeError = '';
		if (!subject.trim() || !htmlContent.trim()) {
			composeError = 'Add both a subject and email content before sending.';
			notifications.warning(composeError, 3000);
			return;
		}

		isSending = true;
		try {
			const scheduledForIso = scheduledFor ? toISOFromLocalDateTime(scheduledFor) : null;
			if (scheduledFor && !scheduledForIso) {
				composeError = 'Choose a valid scheduled date and time.';
				notifications.warning(composeError, 3000);
				return;
			}

			const endpoint = scheduledForIso
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

			if (scheduledForIso) {
				body.scheduled_for = scheduledForIso;
			}

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});

			const result = await response.json();

			if (response.ok) {
				if (scheduledForIso) {
					notifications.success(
						`Scheduled ${result.recipient_count} emails for ${new Date(scheduledForIso).toLocaleString()}`,
						5000
					);
					if (result.excluded_count) {
						notifications.warning(
							`Excluded ${result.excluded_count} unsubscribed recipient(s)`,
							5000
						);
					}
					dispatch('schedule', {
						recipient_count: result.recipient_count,
						scheduled_for: scheduledForIso
					});
				} else {
					notifications.success(`Sent ${result.sent} emails, ${result.failed} failed`, 5000);
					if (result.excluded_count) {
						notifications.warning(
							`Excluded ${result.excluded_count} unsubscribed recipient(s)`,
							5000
						);
					}
					dispatch('send', { sent: result.sent, failed: result.failed });
				}
				closeModal();
			} else {
				composeError = result.message || 'Failed to send emails.';
				notifications.danger(composeError, 5000);
			}
		} catch (error) {
			console.error('Error sending emails:', error);
			composeError = 'Failed to send emails. Try again.';
			notifications.danger(composeError, 3000);
		} finally {
			isSending = false;
		}
	}

	/**
	 * Generate email with AI
	 */
	async function generateEmail() {
		generateError = '';
		if (!generateInstructions.trim()) {
			generateError = 'Add instructions for the email you want to generate.';
			notifications.warning(generateError, 3000);
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
				generateError = result.message || 'Failed to generate email.';
				notifications.danger(generateError, 3000);
			}
		} catch (error) {
			console.error('Error generating email:', error);
			generateError = 'Failed to generate email. Try again.';
			notifications.danger(generateError, 3000);
		} finally {
			isGenerating = false;
		}
	}

	/**
	 * Save draft
	 */
	async function saveDraft() {
		composeError = '';
		try {
			const scheduledForIso = scheduledFor ? toISOFromLocalDateTime(scheduledFor) : null;
			if (scheduledFor && !scheduledForIso) {
				composeError = 'Choose a valid scheduled date and time.';
				notifications.warning(composeError, 3000);
				return;
			}

			const response = await fetch('/api/admin/email-dashboard/drafts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: draftId,
					subject,
					html_content: htmlContent,
					recipients,
					scheduled_for: scheduledForIso
				})
			});

			const result = await response.json();

			if (response.ok) {
				if (result?.draft?.id) {
					draftId = result.draft.id;
				}
				notifications.success('Draft saved', 3000);
				dispatch('saveDraft', { id: draftId });
			} else {
				composeError = result.message || 'Failed to save draft.';
				notifications.danger(composeError, 3000);
			}
		} catch (error) {
			console.error('Error saving draft:', error);
			composeError = 'Failed to save draft. Try again.';
			notifications.danger(composeError, 3000);
		}
	}
</script>

<Modal
	id={COMPOSE_MODAL_ID}
	labelledBy="compose-title"
	describedBy="compose-audience"
	initialFocus="#compose-subject"
	maxWidth="700px"
	fullMobile={true}
	navTop={true}
	contentPadding="0"
>
	<div class="compose-shell">
		<header class="compose-header">
			<div class="compose-heading">
				<p class="compose-kicker">EMAIL · COMPOSER</p>
				<h2 id="compose-title">Compose Email</h2>
			</div>
			<button
				type="button"
				class="close-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lamp-glow)]"
				aria-label="Close email composer"
				onclick={closeModal}
			>
				<X size={18} strokeWidth={2} aria-hidden="true" />
			</button>
		</header>

		<div class="compose-body">
			<section class="recipient-field" aria-labelledby="compose-audience">
				<span id="compose-audience" class="form-label">
					To · {recipients.length}
					{recipients.length === 1 ? 'recipient' : 'recipients'}
				</span>
				<div class="recipients-preview">
					{#each recipients.slice(0, 5) as recipient (recipient.email)}
						<span class="recipient-chip">{recipient.email}</span>
					{/each}
					{#if recipients.length > 5}
						<span class="recipient-chip more">+{recipients.length - 5} more</span>
					{/if}
				</div>
			</section>

			<Field for="compose-subject" label="Subject" required>
				<Input
					id="compose-subject"
					type="text"
					bind:value={subject}
					placeholder="Email subject"
					density="compact"
					invalid={Boolean(composeError && !subject.trim())}
					aria-describedby={composeError ? 'compose-error' : undefined}
				/>
			</Field>

			<div class="content-field">
				<div class="content-header">
					<label class="form-label" for="compose-content">Content · HTML</label>
					<div class="content-actions">
						<Button variant="secondary" size="sm" onclick={() => (showGenerate = true)}>
							Generate with AI
						</Button>
						<Button variant="secondary" size="sm" onclick={() => (showPreview = !showPreview)}>
							{showPreview ? 'Edit HTML' : 'Preview'}
						</Button>
					</div>
				</div>

				{#if showPreview}
					<HtmlPreviewFrame html={htmlContent} title="Email composition preview" />
				{:else}
					<Textarea
						id="compose-content"
						bind:value={htmlContent}
						placeholder={'<h1>Hello {{ name }}!</h1><p>Your content here...</p>'}
						class="html-editor"
						rows={12}
						invalid={Boolean(composeError && !htmlContent.trim())}
						aria-describedby={composeError ? 'compose-error' : undefined}
					/>
				{/if}
				<p class="field-hint">
					Use <code>{'{{ name }}'}</code> for personalization; it falls back to “there.”
				</p>
			</div>

			<Field
				for="compose-schedule"
				label="Schedule"
				optional
				help="Every sent email includes a footer unsubscribe link."
			>
				<Input
					id="compose-schedule"
					type="datetime-local"
					bind:value={scheduledFor}
					density="compact"
					min={minScheduleDateTime}
					aria-describedby="compose-schedule-help"
				/>
			</Field>

			{#if composeError}
				<p id="compose-error" class="form-error" role="alert">{composeError}</p>
			{/if}
		</div>

		<footer class="compose-footer">
			<Button variant="secondary" onclick={saveDraft}>Save Draft</Button>
			<Button onclick={sendEmails} loading={isSending}>
				{scheduledFor ? 'Schedule' : 'Send Now'}
			</Button>
		</footer>
	</div>
</Modal>

<Modal
	id={GENERATE_MODAL_ID}
	labelledBy="generate-title"
	describedBy="generate-context"
	initialFocus="#generate-instructions"
	maxWidth="500px"
	navTop={true}
	contentPadding="0"
>
	<div class="generate-shell">
		<header class="compose-header">
			<div class="compose-heading">
				<p class="compose-kicker">EMAIL · AI DRAFT</p>
				<h2 id="generate-title">Generate with AI</h2>
			</div>
			<button
				type="button"
				class="close-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lamp-glow)]"
				aria-label="Close email generator"
				onclick={closeGenerateModal}
			>
				<X size={18} strokeWidth={2} aria-hidden="true" />
			</button>
		</header>

		<div class="compose-body">
			<Field for="generate-instructions" label="What should the email say?" required>
				<Textarea
					id="generate-instructions"
					bind:value={generateInstructions}
					placeholder="Write a welcome email for new coaching waitlist signups..."
					rows={6}
					invalid={Boolean(generateError && !generateInstructions.trim())}
					aria-describedby={generateError ? 'generate-error' : undefined}
				/>
			</Field>

			<Field for="generate-tone" label="Tone">
				<Select id="generate-tone" bind:value={generateTone} density="compact">
					<option value="professional">Professional</option>
					<option value="friendly">Friendly</option>
					<option value="casual">Casual</option>
				</Select>
			</Field>

			<div id="generate-context" class="context-info">
				<p><strong>Audience</strong><span>{getAudienceType()}</span></p>
				<p><strong>Recipients</strong><span>{recipients.length}</span></p>
			</div>

			{#if generateError}
				<p id="generate-error" class="form-error" role="alert">{generateError}</p>
			{/if}
		</div>

		<footer class="compose-footer">
			<Button variant="secondary" onclick={closeGenerateModal}>Cancel</Button>
			<Button onclick={generateEmail} loading={isGenerating}>Generate</Button>
		</footer>
	</div>
</Modal>

<style>
	.compose-shell,
	.generate-shell {
		width: 100%;
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 2rem);
		max-height: calc(100dvh - 2rem);
	}

	.compose-heading {
		min-width: 0;
	}

	.compose-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--stone-edge);
		background: var(--stone-warm);
	}

	.compose-header h2 {
		margin: 0;
		color: var(--ink-bright);
		font-size: 1.25rem;
		line-height: 1.2;
		letter-spacing: -0.015em;
	}

	.compose-kicker,
	.form-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.35;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.compose-kicker {
		margin: 0 0 0.25rem;
		color: var(--lamp-glow);
	}

	.form-label {
		color: var(--ink-bright);
	}

	.close-btn {
		display: flex;
		width: 2.75rem;
		height: 2.75rem;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--night-mid);
		color: var(--ink-mid);
		cursor: pointer;
		transition:
			background-color 180ms ease,
			color 180ms ease,
			border-color 180ms ease;
	}

	.close-btn:hover {
		background: var(--stone-mid);
		color: var(--ink-bright);
	}

	.compose-body {
		display: grid;
		min-height: 0;
		flex: 1;
		gap: 1.25rem;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 1.5rem;
	}

	.compose-footer {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		justify-content: flex-end;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--stone-edge);
		background: var(--stone-warm);
	}

	.recipient-field,
	.content-field {
		display: grid;
		gap: 0.5rem;
	}

	.field-hint {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.8125rem;
		line-height: 1.45;
	}

	.recipients-preview {
		display: flex;
		min-width: 0;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.recipient-chip {
		max-width: 100%;
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--stone-edge);
		border-radius: 4px;
		background: var(--night-mid);
		color: var(--ink-bright);
		font-size: 0.75rem;
		overflow-wrap: anywhere;
	}

	.recipient-chip.more {
		background: var(--lamp-glow);
		color: var(--text-on-primary);
		border-color: var(--lamp-glow);
	}

	.content-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.content-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	:global(.html-editor) {
		min-height: 18rem;
		font-family: var(--font-mono);
	}

	.context-info {
		display: grid;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--night-mid);
		font-size: 0.875rem;
	}

	.context-info p {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin: 0;
		color: var(--ink-bright);
	}

	.context-info span {
		color: var(--ink-mid);
		text-align: right;
	}

	.form-error {
		margin: 0;
		padding: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--error) 45%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--error) 8%, var(--stone-warm));
		color: var(--error-text);
		font-size: 0.875rem;
		line-height: 1.45;
	}

	@media (max-width: 640px) {
		.compose-shell {
			max-height: 100vh;
			max-height: 100dvh;
		}

		.content-header {
			align-items: flex-start;
			flex-direction: column;
		}

		.compose-footer {
			flex-direction: column-reverse;
			padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
		}

		.compose-footer :global(.btn) {
			width: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.close-btn {
			transition: none;
		}
	}
</style>

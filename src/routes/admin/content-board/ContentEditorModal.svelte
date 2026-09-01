<!-- src/routes/admin/content-board/ContentEditorModal.svelte -->
<script lang="ts">
	import { tick } from 'svelte';
	import { Check, Save, X } from '@lucide/svelte';
	import MarkdownEditor from './MarkdownEditor.svelte';
	import MetadataSidebar from './MetadataSidebar.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { Button, Spinner } from '$lib/components/atoms';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';

	const EDITOR_MODAL_ID = 'content-board-editor';
	const UNSAVED_MODAL_ID = 'content-board-unsaved-warning';

	interface HistoryItem {
		id: number;
		changed_at: string | null;
		new_content: string | null;
	}

	interface Props {
		open?: boolean;
		blogId?: number | null;
		contentType?: string;
		initialData?: App.BlogPost | null;
		onclose?: () => void;
		onsaved?: (data: Record<string, any>) => void;
	}

	let {
		open = $bindable(false),
		blogId = null,
		contentType = 'people',
		initialData = null,
		onclose,
		onsaved
	}: Props = $props();

	// State
	let loading = $state(true);
	let saving = $state(false);
	let data = $state<Record<string, any>>({ content: '' });
	let originalData = $state<Record<string, any>>({ content: '' });
	let history = $state<HistoryItem[]>([]);
	let stageName = $state<string | null>(null);
	let showUnsavedWarning = $state(false);
	let mobileTab = $state<'content' | 'metadata'>('content');
	let editorModalActive = $state(false);
	let warningModalActive = $state(false);

	// Check if this is database content (people) or file-based (enneagram, community, guides)
	let isEditable = $derived(contentType === 'people' && blogId !== null);
	let displayTitle = $derived(data.person?.replace(/-/g, ' ') || data.title || 'Content Editor');

	// Track dirty state
	let isDirty = $derived.by(() => {
		if (Object.keys(originalData).length === 0) return false;
		return JSON.stringify(data) !== JSON.stringify(originalData);
	});

	// Track previous state to detect changes
	let prevBlogId = $state<number | null>(null);
	let prevInitialDataTitle = $state<string | null>(null);
	let wasOpen = $state(false);

	// Load content when modal opens or content changes
	$effect(() => {
		if (open) {
			// Determine if we need to reload
			const currentTitle = initialData?.title || null;
			const needsReload =
				!wasOpen || // Modal just opened
				(blogId !== null && blogId !== prevBlogId) || // blogId changed (people content)
				(blogId === null && currentTitle !== prevInitialDataTitle); // initialData changed (file-based)

			if (needsReload) {
				prevBlogId = blogId;
				prevInitialDataTitle = currentTitle;
				wasOpen = true;
				// Reset state before loading new content
				data = { content: '' };
				originalData = { content: '' };
				history = [];
				stageName = null;
				loading = true;
				loadContent();
			}
		} else if (!open && wasOpen) {
			// Reset when modal closes
			wasOpen = false;
			prevBlogId = null;
			prevInitialDataTitle = null;
			data = { content: '' };
			originalData = { content: '' };
			history = [];
			stageName = null;
			loading = true;
		}
	});

	// Keep the bindable parent state and the shared modal controller in sync.
	$effect(() => {
		if (open && !editorModalActive) {
			editorModalActive = true;
			void tick().then(() => {
				const controller = getModal(EDITOR_MODAL_ID);
				if (!controller) {
					editorModalActive = false;
					return;
				}

				controller.open(() => {
					editorModalActive = false;
					showUnsavedWarning = false;
					open = false;
					onclose?.();
				});
			});
		} else if (!open && editorModalActive) {
			getModal(EDITOR_MODAL_ID)?.close(null);
		}
	});

	$effect(() => {
		if (showUnsavedWarning && !warningModalActive) {
			warningModalActive = true;
			void tick().then(() => {
				const controller = getModal(UNSAVED_MODAL_ID);
				if (!controller) {
					warningModalActive = false;
					return;
				}

				controller.open(() => {
					warningModalActive = false;
					showUnsavedWarning = false;
				});
			});
		} else if (!showUnsavedWarning && warningModalActive) {
			getModal(UNSAVED_MODAL_ID)?.close(null);
		}
	});

	async function loadContent() {
		if (!blogId || contentType !== 'people') {
			// For file-based content, use initial data
			if (initialData) {
				data = { ...initialData };
				originalData = { ...initialData };
			}
			loading = false;
			return;
		}

		loading = true;
		try {
			const response = await fetch(`/api/admin/content/${blogId}`);
			if (!response.ok) {
				throw new Error('Failed to load content');
			}
			const result = await response.json();
			data = result;
			originalData = { ...result };
			history = result.history || [];
			stageName = result.stageName || null;
		} catch (error) {
			console.error('Error loading content:', error);
			notifications.danger('Failed to load content');
		} finally {
			loading = false;
		}
	}

	// Handle content change from editor
	function handleContentChange(newContent: string) {
		data = { ...data, content: newContent };
	}

	// Handle metadata field change
	function handleFieldChange(change: { field: string; value: any }) {
		data = { ...data, [change.field]: change.value };
	}

	// Handle stage change
	function handleStageChange(stage: string) {
		stageName = stage;
	}

	// Save content
	async function save(): Promise<boolean> {
		if (!isEditable || !isDirty) return true;

		saving = true;
		try {
			const response = await fetch(`/api/admin/content/${blogId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to save');
			}

			const result = await response.json();
			data = result.data;
			originalData = { ...result.data };
			notifications.success('Content saved successfully');
			onsaved?.(data);
			return true;
		} catch (error) {
			console.error('Error saving content:', error);
			notifications.danger('Failed to save content');
			return false;
		} finally {
			saving = false;
		}
	}

	// Save and close
	async function saveAndClose() {
		if (isDirty && isEditable && !(await save())) return;
		closeModal();
	}

	// Close modal with unsaved warning
	function attemptClose() {
		if (isDirty) {
			showUnsavedWarning = true;
		} else {
			closeModal();
		}
	}

	function closeModal() {
		if (warningModalActive) getModal(UNSAVED_MODAL_ID)?.close(null);
		else showUnsavedWarning = false;

		if (editorModalActive) getModal(EDITOR_MODAL_ID)?.close(null);
		else {
			open = false;
			onclose?.();
		}
	}

	function discardAndClose() {
		closeModal();
	}

	function dismissUnsavedWarning() {
		if (warningModalActive) getModal(UNSAVED_MODAL_ID)?.close(null);
		else showUnsavedWarning = false;
	}

	// Keyboard shortcuts
	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;

		if (e.key === 'Escape' && isDirty && !showUnsavedWarning) {
			e.preventDefault();
			attemptClose();
		}

		if (!showUnsavedWarning && (e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			if (isEditable && isDirty) {
				void save();
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<Modal
	id={EDITOR_MODAL_ID}
	labelledBy="content-editor-title"
	initialFocus="#content-editor-close"
	maxWidth="1440px"
	contentPadding="0"
	navTop
	fullMobile
	disableClose={isDirty}
	oncloseattempt={attemptClose}
>
	<div class="editor-shell">
		<!-- Header -->
		<header class="modal-header">
			<div class="header-left">
				<Button
					id="content-editor-close"
					class="editor-close"
					variant="ghost"
					size="sm"
					onclick={attemptClose}
					aria-label="Close content editor"
				>
					{#snippet icon()}<X size={19} strokeWidth={2} aria-hidden="true" />{/snippet}
				</Button>
				<h2 id="content-editor-title" class="modal-title">
					{displayTitle}
					{#if isDirty}
						<span class="dirty-indicator" title="Unsaved changes">●</span>
					{/if}
				</h2>
				{#if !isEditable}
					<span class="readonly-badge">Read Only</span>
				{/if}
			</div>

			<div class="header-right">
				{#if isEditable}
					<Button
						class="save-button"
						variant="secondary"
						size="sm"
						onclick={() => void save()}
						disabled={!isDirty}
						loading={saving}
					>
						{#snippet icon()}
							<Save size={16} strokeWidth={2} aria-hidden="true" />
						{/snippet}
						Save
					</Button>
				{/if}
				<Button size="sm" onclick={saveAndClose} loading={saving}>
					{#snippet icon()}
						<Check size={16} strokeWidth={2} aria-hidden="true" />
					{/snippet}
					Done
				</Button>
			</div>
		</header>

		<!-- Mobile Tab Switcher -->
		<div class="mobile-tabs">
			<button
				class="mobile-tab"
				class:active={mobileTab === 'content'}
				aria-pressed={mobileTab === 'content'}
				onclick={() => (mobileTab = 'content')}
			>
				Content
			</button>
			<button
				class="mobile-tab"
				class:active={mobileTab === 'metadata'}
				aria-pressed={mobileTab === 'metadata'}
				onclick={() => (mobileTab = 'metadata')}
			>
				Metadata
			</button>
		</div>

		<!-- Content -->
		<div class="modal-content">
			{#if loading}
				<div class="loading-state">
					<Spinner size="md" label="Loading content">Loading content…</Spinner>
				</div>
			{:else}
				<!-- Editor Panel -->
				<div class="editor-panel" class:mobile-hidden={mobileTab !== 'content'}>
					<MarkdownEditor
						bind:content={data.content}
						readonly={!isEditable}
						placeholder={isEditable ? 'Enter markdown content...' : 'No content available'}
						onchange={handleContentChange}
					/>
				</div>

				<!-- Metadata Panel -->
				<div class="metadata-panel" class:mobile-hidden={mobileTab !== 'metadata'}>
					<MetadataSidebar
						{data}
						{history}
						{stageName}
						readonly={!isEditable}
						onchange={handleFieldChange}
						onstagechange={handleStageChange}
					/>
				</div>
			{/if}
		</div>
	</div>
</Modal>

<Modal
	id={UNSAVED_MODAL_ID}
	labelledBy="unsaved-warning-title"
	describedBy="unsaved-warning-message"
	initialFocus="#keep-editing-button"
	maxWidth="420px"
	contentPadding="0"
	navTop
>
	<div class="warning-dialog">
		<p class="warning-kicker">UNSAVED DRAFT</p>
		<h3 id="unsaved-warning-title" class="warning-title">Keep your changes?</h3>
		<p id="unsaved-warning-message" class="warning-message">
			This draft has changes that have not been saved yet.
		</p>
		<div class="warning-actions">
			<Button id="keep-editing-button" variant="secondary" onclick={dismissUnsavedWarning}
				>Keep editing</Button
			>
			<Button variant="danger" onclick={discardAndClose}>Discard</Button>
			{#if isEditable}
				<Button onclick={saveAndClose} loading={saving}>Save &amp; close</Button>
			{/if}
		</div>
	</div>
</Modal>

<style lang="scss">
	.editor-shell {
		width: calc(100vw - 3rem);
		max-width: 1440px;
		height: min(85vh, calc(100vh - 2rem));
		height: min(85dvh, calc(100dvh - 2rem));
		background: var(--stone-warm);
		display: flex;
		flex-direction: column;
		align-items: stretch;
		overflow: hidden;

		@media (max-width: 768px) {
			width: 100%;
			height: min(85vh, calc(100vh - 2rem));
			height: min(85dvh, calc(100dvh - 2rem));
		}
	}

	@media (max-width: 640px) {
		.editor-shell {
			width: 100vw;
			height: 100vh;
			height: 100dvh;
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		border-bottom: 1px solid var(--stone-edge);
		background: var(--night-deep);
		flex-shrink: 0;

		@media (max-width: 768px) {
			padding: 8px 12px;
			min-height: 56px;
		}
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
		flex: 1;

		@media (max-width: 768px) {
			gap: 8px;
		}
	}

	:global(.editor-close) {
		width: 44px;
		height: 44px;
		padding: 0;
		flex: 0 0 auto;
	}

	.modal-title {
		font-size: 16px;
		font-weight: 600;
		color: var(--ink-bright);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		@media (max-width: 768px) {
			font-size: 15px;
		}
	}

	.dirty-indicator {
		color: var(--warning);
		margin-left: 4px;
	}

	.readonly-badge {
		padding: 2px 8px;
		background: var(--warning-light);
		color: var(--warning);
		border-radius: 4px;
		font-size: 11px;
		font-weight: 500;
		flex-shrink: 0;

		@media (max-width: 768px) {
			display: none;
		}
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;

		@media (max-width: 768px) {
			gap: 6px;

			:global(.save-button) {
				display: none;
			}
		}
	}

	.mobile-tabs {
		display: none;
		border-bottom: 1px solid var(--stone-edge);
		background: var(--stone-warm);

		@media (max-width: 768px) {
			display: flex;
		}
	}

	.mobile-tab {
		flex: 1;
		padding: 14px 12px;
		border: none;
		background: none;
		font-size: 15px;
		font-weight: 500;
		color: var(--ink-mid);
		cursor: pointer;
		border-bottom: 3px solid transparent;
		transition: all 0.15s ease;
		min-height: 48px;

		&.active {
			color: var(--lamp-glow);
			border-bottom-color: var(--lamp-glow);
			background: var(--stone-warm);
		}
	}

	.modal-content {
		flex: 1;
		display: flex;
		width: 100%;
		overflow: hidden;
		min-height: 0;
		background: var(--night-deep);

		@media (max-width: 768px) {
			flex-direction: column;
		}
	}

	.loading-state {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		color: var(--ink-mid);
		font-size: 14px;
	}

	.editor-panel {
		flex: 1 1 0%;
		min-width: 0;
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;

		@media (max-width: 768px) {
			flex: 1 1 100%;

			&.mobile-hidden {
				display: none;
			}
		}
	}

	.metadata-panel {
		flex: 0 0 360px;
		width: 360px;
		min-height: 0;
		overflow: hidden;
		border-left: 1px solid var(--stone-warm);

		@media (max-width: 1200px) {
			flex: 0 0 320px;
			width: 320px;
		}

		@media (max-width: 768px) {
			flex: 1 1 100%;
			width: 100%;
			border-left: none;
			overflow-y: auto;

			&.mobile-hidden {
				display: none;
			}
		}
	}

	.warning-dialog {
		background: var(--stone-warm);
		padding: 24px;
		width: 100%;
	}

	.warning-kicker {
		margin: 0 0 6px;
		color: var(--warning);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.warning-title {
		font-size: 18px;
		font-weight: 600;
		color: var(--ink-bright);
		margin: 0 0 8px;
	}

	.warning-message {
		font-size: 14px;
		color: var(--ink-mid);
		margin: 0 0 20px;
	}

	.warning-actions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;

		@media (max-width: 480px) {
			flex-direction: column;

			:global(.btn) {
				width: 100%;
			}
		}
	}
</style>

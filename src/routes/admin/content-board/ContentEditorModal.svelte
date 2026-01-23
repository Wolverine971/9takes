<!-- src/routes/admin/content-board/ContentEditorModal.svelte -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import MarkdownEditor from './MarkdownEditor.svelte';
	import MetadataSidebar from './MetadataSidebar.svelte';
	import { notifications } from '$lib/components/molecules/notifications';

	interface HistoryItem {
		id: number;
		changed_at: string;
		old_content: string;
		new_content: string;
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
	let previousOverflow = $state('');

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

	// Body scroll lock
	$effect(() => {
		if (typeof document !== 'undefined') {
			if (open) {
				previousOverflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = previousOverflow;
			}
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = previousOverflow;
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
			notifications.error('Failed to load content');
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
	async function save() {
		if (!isEditable || !isDirty) return;

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
		} catch (error) {
			console.error('Error saving content:', error);
			notifications.error('Failed to save content');
		} finally {
			saving = false;
		}
	}

	// Save and close
	async function saveAndClose() {
		if (isDirty && isEditable) {
			await save();
		}
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
		showUnsavedWarning = false;
		open = false;
		onclose?.();
	}

	function discardAndClose() {
		showUnsavedWarning = false;
		closeModal();
	}

	// Keyboard shortcuts
	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			if (showUnsavedWarning) {
				showUnsavedWarning = false;
			} else {
				attemptClose();
			}
		}

		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			if (isEditable && isDirty) {
				save();
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="modal-backdrop"
		onclick={attemptClose}
		onkeydown={() => {}}
		transition:fade={{ duration: 200 }}
		role="presentation"
	></div>

	<!-- Modal Container -->
	<div
		class="modal-container"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		transition:fly={{ y: 20, duration: 300, easing: cubicOut }}
	>
		<!-- Header -->
		<header class="modal-header">
			<div class="header-left">
				<button class="close-btn" onclick={attemptClose} aria-label="Close">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
				<h2 id="modal-title" class="modal-title">
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
					<button class="btn btn-secondary" onclick={save} disabled={!isDirty || saving}>
						{#if saving}
							<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
									fill="none"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
								/>
							</svg>
						{:else}
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
								/>
							</svg>
						{/if}
						Save
					</button>
				{/if}
				<button class="btn btn-primary" onclick={saveAndClose}>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					Done
				</button>
			</div>
		</header>

		<!-- Mobile Tab Switcher -->
		<div class="mobile-tabs">
			<button
				class="mobile-tab"
				class:active={mobileTab === 'content'}
				onclick={() => (mobileTab = 'content')}
			>
				Content
			</button>
			<button
				class="mobile-tab"
				class:active={mobileTab === 'metadata'}
				onclick={() => (mobileTab = 'metadata')}
			>
				Metadata
			</button>
		</div>

		<!-- Content -->
		<div class="modal-content">
			{#if loading}
				<div class="loading-state">
					<svg class="h-8 w-8 animate-spin text-blue-600" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						/>
					</svg>
					<span>Loading content...</span>
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

	<!-- Unsaved Changes Warning -->
	{#if showUnsavedWarning}
		<div class="warning-overlay" transition:fade={{ duration: 150 }}>
			<div class="warning-dialog" transition:fly={{ y: -10, duration: 200 }}>
				<h3 class="warning-title">Unsaved Changes</h3>
				<p class="warning-message">You have unsaved changes. What would you like to do?</p>
				<div class="warning-actions">
					<button class="btn btn-secondary" onclick={() => (showUnsavedWarning = false)}>
						Cancel
					</button>
					<button class="btn btn-danger" onclick={discardAndClose}> Discard Changes </button>
					<button class="btn btn-primary" onclick={saveAndClose}> Save & Close </button>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style lang="scss">
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		z-index: 9990;
	}

	.modal-container {
		position: fixed;
		top: 24px;
		left: 24px;
		right: 24px;
		bottom: 24px;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.5),
			var(--glow-sm);
		z-index: 9991;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		overflow: hidden;

		@media (max-width: 768px) {
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 0;
			border: none;
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		border-bottom: 1px solid var(--void-elevated);
		background: var(--void-deep);
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

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: none;
		background: none;
		border-radius: 8px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
		flex-shrink: 0;

		&:hover {
			background: var(--void-elevated);
			color: var(--text-primary);
		}

		@media (max-width: 768px) {
			width: 44px;
			height: 44px;
		}
	}

	.modal-title {
		font-size: 16px;
		font-weight: 600;
		color: var(--text-primary);
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
		}
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		border: none;
		border-radius: 6px;
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		@media (max-width: 768px) {
			padding: 10px 14px;
			font-size: 14px;
			min-height: 44px;

			svg {
				display: none;
			}
		}
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-monarch-dark) 100%);
		color: white;
		border: 1px solid var(--shadow-monarch);
		box-shadow: var(--glow-sm);

		&:hover:not(:disabled) {
			background: linear-gradient(
				135deg,
				var(--shadow-monarch-light) 0%,
				var(--shadow-monarch) 100%
			);
			box-shadow: var(--glow-md);
		}
	}

	.btn-secondary {
		background: var(--void-elevated);
		color: var(--text-primary);
		border: 1px solid var(--void-highlight);

		&:hover:not(:disabled) {
			background: var(--void-highlight);
			border-color: var(--shadow-monarch-glow);
		}

		@media (max-width: 768px) {
			// Hide save button text on mobile, show only icon
			span {
				display: none;
			}
			svg {
				display: block !important;
			}
			padding: 10px;
		}
	}

	.btn-danger {
		background: var(--error-light);
		color: var(--error);
		border: 1px solid transparent;

		&:hover:not(:disabled) {
			border-color: var(--error);
		}
	}

	.mobile-tabs {
		display: none;
		border-bottom: 1px solid var(--void-elevated);
		background: var(--void-surface);

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
		color: var(--text-secondary);
		cursor: pointer;
		border-bottom: 3px solid transparent;
		transition: all 0.15s ease;
		min-height: 48px;

		&.active {
			color: var(--shadow-monarch-light);
			border-bottom-color: var(--shadow-monarch);
			background: var(--void-elevated);
		}
	}

	.modal-content {
		flex: 1;
		display: flex;
		width: 100%;
		overflow: hidden;
		min-height: 0;
		background: var(--void-deep);

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
		color: var(--text-secondary);
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
		border-left: 1px solid var(--void-elevated);

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

	.warning-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9992;
		padding: 16px;
	}

	.warning-dialog {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		padding: 24px;
		max-width: 400px;
		width: 100%;
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.5),
			var(--glow-sm);
	}

	.warning-title {
		font-size: 18px;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 8px;
	}

	.warning-message {
		font-size: 14px;
		color: var(--text-secondary);
		margin: 0 0 20px;
	}

	.warning-actions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;

		@media (max-width: 480px) {
			flex-direction: column;

			.btn {
				width: 100%;
				justify-content: center;
			}
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>

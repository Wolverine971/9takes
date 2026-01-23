<!-- src/routes/admin/content-board/personality-analysis/[slug]/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import MarkdownEditor from '../../MarkdownEditor.svelte';
	import MetadataSidebar from '../../MetadataSidebar.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PageData } from './$types';

	interface HistoryItem {
		id: number;
		changed_at: string;
		old_content: string;
		new_content: string;
	}

	let { data: pageData }: { data: PageData } = $props();

	// State
	let saving = $state(false);
	let blogData = $state<Record<string, any>>({ content: '' });
	let originalData = $state<Record<string, any>>({ content: '' });
	let history = $state<HistoryItem[]>([]);
	let stageName = $state<string | null>(null);
	let showUnsavedWarning = $state(false);
	let mobileTab = $state<'content' | 'metadata'>('content');

	// Initialize data from server
	$effect(() => {
		if (pageData.blog) {
			blogData = { ...pageData.blog };
			originalData = { ...pageData.blog };
			history = pageData.blog.history || [];
			stageName = pageData.blog.stageName || null;
		}
	});

	// Derived values
	let displayTitle = $derived(
		blogData.person?.replace(/-/g, ' ') || blogData.title || 'Content Editor'
	);
	let blogId = $derived(blogData.id);

	// Track dirty state
	let isDirty = $derived.by(() => {
		if (Object.keys(originalData).length === 0) return false;
		return JSON.stringify(blogData) !== JSON.stringify(originalData);
	});

	// Handle content change from editor
	function handleContentChange(newContent: string) {
		blogData = { ...blogData, content: newContent };
	}

	// Handle metadata field change
	function handleFieldChange(change: { field: string; value: any }) {
		blogData = { ...blogData, [change.field]: change.value };
	}

	// Handle stage change
	function handleStageChange(stage: string) {
		stageName = stage;
	}

	// Save content
	async function save() {
		if (!isDirty || !blogId) return;

		saving = true;
		try {
			const response = await fetch(`/api/admin/content/${blogId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(blogData)
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to save');
			}

			const result = await response.json();
			blogData = result.data;
			originalData = { ...result.data };
			notifications.success('Content saved successfully');
		} catch (error) {
			console.error('Error saving content:', error);
			notifications.error('Failed to save content');
		} finally {
			saving = false;
		}
	}

	// Save and go back
	async function saveAndClose() {
		if (isDirty) {
			await save();
		}
		goBack();
	}

	// Navigate back to content board
	function goBack() {
		showUnsavedWarning = false;
		goto('/admin/content-board');
	}

	// Attempt to go back with unsaved warning
	function attemptClose() {
		if (isDirty) {
			showUnsavedWarning = true;
		} else {
			goBack();
		}
	}

	function discardAndClose() {
		showUnsavedWarning = false;
		goBack();
	}

	// Keyboard shortcuts
	function handleKeydown(e: KeyboardEvent) {
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
			if (isDirty) {
				save();
			}
		}
	}
</script>

<svelte:head>
	<title>{displayTitle} | Content Editor</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="editor-page">
	<!-- Header -->
	<header class="page-header">
		<div class="header-left">
			<button class="back-btn" onclick={attemptClose} aria-label="Back to content board">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
			</button>
			<div class="title-group">
				<h1 class="page-title">
					{displayTitle}
					{#if isDirty}
						<span class="dirty-indicator" title="Unsaved changes">●</span>
					{/if}
				</h1>
				<span class="breadcrumb">Content Board / Personality Analysis</span>
			</div>
		</div>

		<div class="header-right">
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
				<span class="btn-text">Save</span>
			</button>
			<button class="btn btn-primary" onclick={saveAndClose}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
				<span class="btn-text">Done</span>
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
	<div class="page-content">
		<!-- Editor Panel -->
		<div class="editor-panel" class:mobile-hidden={mobileTab !== 'content'}>
			<MarkdownEditor
				bind:content={blogData.content}
				readonly={false}
				placeholder="Enter markdown content..."
				onchange={handleContentChange}
			/>
		</div>

		<!-- Metadata Panel -->
		<div class="metadata-panel" class:mobile-hidden={mobileTab !== 'metadata'}>
			<MetadataSidebar
				data={blogData}
				{history}
				{stageName}
				readonly={false}
				onchange={handleFieldChange}
				onstagechange={handleStageChange}
			/>
		</div>
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

<style lang="scss">
	.editor-page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: var(--void-deep);
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 20px;
		border-bottom: 1px solid var(--void-elevated);
		background: var(--void-surface);
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

	.back-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: none;
		background: var(--void-elevated);
		border-radius: 8px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
		flex-shrink: 0;

		&:hover {
			background: var(--shadow-monarch-subtle);
			color: var(--shadow-monarch-light);
		}

		@media (max-width: 768px) {
			width: 44px;
			height: 44px;
		}
	}

	.title-group {
		min-width: 0;
		flex: 1;
	}

	.page-title {
		font-size: 18px;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		@media (max-width: 768px) {
			font-size: 16px;
		}
	}

	.breadcrumb {
		display: block;
		font-size: 12px;
		color: var(--text-muted);
		margin-top: 2px;

		@media (max-width: 768px) {
			display: none;
		}
	}

	.dirty-indicator {
		color: var(--warning);
		margin-left: 4px;
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

			.btn-text {
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

	.page-content {
		flex: 1;
		display: flex;
		width: 100%;
		overflow: hidden;
		min-height: 0;

		@media (max-width: 768px) {
			flex-direction: column;
		}
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
		z-index: 9999;
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

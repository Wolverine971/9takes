<!-- src/routes/admin/content-board/CrossLinkAnalysis.svelte -->
<script lang="ts">
	import { slide } from 'svelte/transition';

	interface CrossLinkItem {
		id: number;
		person: string;
		title: string | null;
		enneagram: string | null;
		category: string | null;
	}

	interface CrossLinkMention extends CrossLinkItem {
		mentionCount: number;
		isInSuggestions: boolean;
	}

	interface CrossLinkResponse {
		person: string;
		displayName: string;
		incomingSuggestions: CrossLinkItem[];
		contentMentions: CrossLinkMention[];
		potentialLinks: CrossLinkMention[];
		duplicates: {
			inSuggestions: boolean;
			excessiveMentions: CrossLinkMention[];
		};
		stats: {
			totalIncoming: number;
			totalMentions: number;
			totalPotential: number;
			hasDuplicateWarnings: boolean;
		};
	}

	interface Props {
		blogId: number | null;
		personSlug?: string | null;
	}

	let { blogId, personSlug }: Props = $props();

	let crosslinks = $state<CrossLinkResponse | null>(null);
	let loading = $state(false);
	let errorMsg = $state<string | null>(null);

	// Section collapse state
	let sections = $state({
		incoming: true,
		potential: true,
		mentions: false,
		duplicates: true
	});

	function toggleSection(section: keyof typeof sections) {
		sections[section] = !sections[section];
	}

	async function fetchCrosslinks() {
		if (!blogId) return;

		loading = true;
		errorMsg = null;

		try {
			const res = await fetch(`/api/admin/content/${blogId}/crosslinks`);
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || `Failed to fetch (${res.status})`);
			}
			crosslinks = await res.json();
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Unknown error';
			crosslinks = null;
		} finally {
			loading = false;
		}
	}

	// Fetch when blogId changes
	$effect(() => {
		if (blogId) {
			fetchCrosslinks();
		} else {
			crosslinks = null;
		}
	});

	// Format person slug as display name
	function formatName(slug: string): string {
		return slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

<div class="crosslink-analysis">
	<div class="analysis-header">
		<span class="analysis-title">Cross-Link Analysis</span>
		<button
			class="refresh-btn"
			onclick={fetchCrosslinks}
			disabled={loading || !blogId}
			title="Refresh cross-link data"
		>
			{#if loading}
				<svg class="spinner" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path
						d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
					/>
				</svg>
			{/if}
		</button>
	</div>

	{#if !blogId}
		<p class="empty-state">Select a blog to view cross-links</p>
	{:else if loading && !crosslinks}
		<div class="loading-state">
			<svg class="spinner" viewBox="0 0 24 24">
				<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
			</svg>
			<span>Loading cross-links...</span>
		</div>
	{:else if errorMsg}
		<div class="error-state">
			<span class="error-icon">!</span>
			<span>{errorMsg}</span>
			<button class="retry-btn" onclick={fetchCrosslinks}>Retry</button>
		</div>
	{:else if crosslinks}
		<!-- Summary Stats -->
		<div class="stats-row">
			<div class="stat" class:warning={crosslinks.stats.totalIncoming === 0}>
				<span class="stat-value">{crosslinks.stats.totalIncoming}</span>
				<span class="stat-label">Incoming</span>
			</div>
			<div class="stat" class:success={crosslinks.stats.totalPotential > 0}>
				<span class="stat-value">{crosslinks.stats.totalPotential}</span>
				<span class="stat-label">Potential</span>
			</div>
			<div class="stat" class:error={crosslinks.stats.hasDuplicateWarnings}>
				<span class="stat-value">{crosslinks.duplicates.excessiveMentions.length}</span>
				<span class="stat-label">Warnings</span>
			</div>
		</div>

		<!-- Incoming Links Section -->
		<div class="subsection">
			<button class="subsection-header" onclick={() => toggleSection('incoming')}>
				<span class="subsection-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 12H5m7 7l-7-7 7-7" />
					</svg>
				</span>
				<span class="subsection-title">Incoming Links</span>
				<span class="badge" class:empty={crosslinks.incomingSuggestions.length === 0}>
					{crosslinks.incomingSuggestions.length}
				</span>
				<svg class="chevron" class:expanded={sections.incoming} viewBox="0 0 24 24">
					<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
				</svg>
			</button>
			{#if sections.incoming}
				<div class="subsection-content" transition:slide={{ duration: 150 }}>
					{#if crosslinks.incomingSuggestions.length === 0}
						<p class="empty-list">No blogs link to this person yet</p>
					{:else}
						<ul class="link-list">
							{#each crosslinks.incomingSuggestions as link}
								<li class="link-item">
									<a href="/personality-analysis/{link.person}" target="_blank" class="link-name">
										{link.title || formatName(link.person)}
									</a>
									{#if link.enneagram}
										<span class="type-badge">T{link.enneagram}</span>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Potential Links Section -->
		<div class="subsection">
			<button class="subsection-header" onclick={() => toggleSection('potential')}>
				<span class="subsection-icon highlight">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
						/>
					</svg>
				</span>
				<span class="subsection-title">Potential Links</span>
				<span class="badge" class:highlight={crosslinks.potentialLinks.length > 0}>
					{crosslinks.potentialLinks.length}
				</span>
				<svg class="chevron" class:expanded={sections.potential} viewBox="0 0 24 24">
					<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
				</svg>
			</button>
			{#if sections.potential}
				<div class="subsection-content" transition:slide={{ duration: 150 }}>
					{#if crosslinks.potentialLinks.length === 0}
						<p class="empty-list success">All mentions are already linked!</p>
					{:else}
						<p class="hint">These blogs mention {crosslinks.displayName} but don't link to them:</p>
						<ul class="link-list">
							{#each crosslinks.potentialLinks.slice(0, 10) as link}
								<li class="link-item">
									<a href="/personality-analysis/{link.person}" target="_blank" class="link-name">
										{link.title || formatName(link.person)}
									</a>
									<span class="mention-count">{link.mentionCount}x</span>
									{#if link.enneagram}
										<span class="type-badge">T{link.enneagram}</span>
									{/if}
								</li>
							{/each}
							{#if crosslinks.potentialLinks.length > 10}
								<li class="more-items">+{crosslinks.potentialLinks.length - 10} more...</li>
							{/if}
						</ul>
					{/if}
				</div>
			{/if}
		</div>

		<!-- All Content Mentions (collapsed by default) -->
		<div class="subsection">
			<button class="subsection-header" onclick={() => toggleSection('mentions')}>
				<span class="subsection-icon">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path
							d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
						/>
					</svg>
				</span>
				<span class="subsection-title">All Mentions</span>
				<span class="badge">{crosslinks.stats.totalMentions}</span>
				<svg class="chevron" class:expanded={sections.mentions} viewBox="0 0 24 24">
					<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
				</svg>
			</button>
			{#if sections.mentions}
				<div class="subsection-content" transition:slide={{ duration: 150 }}>
					{#if crosslinks.contentMentions.length === 0}
						<p class="empty-list">No content mentions found</p>
					{:else}
						<ul class="link-list">
							{#each crosslinks.contentMentions.slice(0, 15) as mention}
								<li class="link-item" class:linked={mention.isInSuggestions}>
									<a
										href="/personality-analysis/{mention.person}"
										target="_blank"
										class="link-name"
									>
										{mention.title || formatName(mention.person)}
									</a>
									<span class="mention-count" class:excessive={mention.mentionCount > 5}>
										{mention.mentionCount}x
									</span>
									{#if mention.isInSuggestions}
										<span class="linked-badge" title="Already in suggestions">
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M5 13l4 4L19 7" />
											</svg>
										</span>
									{/if}
								</li>
							{/each}
							{#if crosslinks.contentMentions.length > 15}
								<li class="more-items">+{crosslinks.contentMentions.length - 15} more...</li>
							{/if}
						</ul>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Duplicate Warnings (only if issues exist) -->
		{#if crosslinks.stats.hasDuplicateWarnings}
			<div class="subsection warning">
				<button class="subsection-header" onclick={() => toggleSection('duplicates')}>
					<span class="subsection-icon warning">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</span>
					<span class="subsection-title">Warnings</span>
					<span class="badge warning"
						>{crosslinks.duplicates.excessiveMentions.length +
							(crosslinks.duplicates.inSuggestions ? 1 : 0)}</span
					>
					<svg class="chevron" class:expanded={sections.duplicates} viewBox="0 0 24 24">
						<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" />
					</svg>
				</button>
				{#if sections.duplicates}
					<div class="subsection-content" transition:slide={{ duration: 150 }}>
						{#if crosslinks.duplicates.inSuggestions}
							<div class="warning-item">
								<span class="warning-icon">!</span>
								<span>This blog has duplicate entries in its suggestions array</span>
							</div>
						{/if}
						{#if crosslinks.duplicates.excessiveMentions.length > 0}
							<p class="hint warning">Blogs with excessive mentions (>5x):</p>
							<ul class="link-list">
								{#each crosslinks.duplicates.excessiveMentions as mention}
									<li class="link-item warning">
										<span class="link-name">{mention.title || formatName(mention.person)}</span>
										<span class="mention-count excessive">{mention.mentionCount}x</span>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	.crosslink-analysis {
		padding: 0;
	}

	.analysis-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
		margin-bottom: 8px;
	}

	.analysis-title {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.refresh-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: transparent;
		border: 1px solid var(--void-highlight);
		border-radius: 4px;
		cursor: pointer;
		color: var(--text-muted);
		transition: all 0.15s ease;

		&:hover:not(:disabled) {
			color: var(--shadow-monarch-light);
			border-color: var(--shadow-monarch-glow);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		svg {
			width: 14px;
			height: 14px;
		}
	}

	.spinner {
		animation: spin 1s linear infinite;

		circle {
			stroke-dasharray: 30 70;
			stroke-linecap: round;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.empty-state,
	.loading-state,
	.error-state {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 16px;
		font-size: 12px;
		color: var(--text-muted);
		text-align: center;
	}

	.loading-state {
		flex-direction: column;
		gap: 12px;

		.spinner {
			width: 24px;
			height: 24px;
			color: var(--shadow-monarch-light);
		}
	}

	.error-state {
		flex-direction: column;
		gap: 8px;
		color: var(--error);
	}

	.error-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: var(--error);
		color: white;
		border-radius: 50%;
		font-size: 14px;
		font-weight: bold;
	}

	.retry-btn {
		padding: 4px 12px;
		background: var(--void-elevated);
		border: 1px solid var(--void-highlight);
		border-radius: 4px;
		font-size: 11px;
		color: var(--text-primary);
		cursor: pointer;

		&:hover {
			border-color: var(--shadow-monarch-glow);
		}
	}

	.stats-row {
		display: flex;
		gap: 8px;
		margin-bottom: 12px;
	}

	.stat {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 8px 4px;
		background: var(--void-elevated);
		border-radius: 6px;
		border: 1px solid var(--void-highlight);

		&.warning .stat-value {
			color: var(--warning);
		}

		&.success .stat-value {
			color: var(--success-text);
		}

		&.error {
			border-color: var(--error);
			.stat-value {
				color: var(--error);
			}
		}
	}

	.stat-value {
		font-size: 18px;
		font-weight: 600;
		color: var(--text-primary);
		line-height: 1;
	}

	.stat-label {
		font-size: 9px;
		color: var(--text-muted);
		text-transform: uppercase;
		margin-top: 2px;
	}

	.subsection {
		border: 1px solid var(--void-highlight);
		border-radius: 6px;
		margin-bottom: 8px;
		overflow: hidden;

		&.warning {
			border-color: var(--warning);
			background: rgba(245, 158, 11, 0.05);
		}
	}

	.subsection-header {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 10px;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s ease;

		&:hover {
			background: var(--void-elevated);
		}
	}

	.subsection-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		color: var(--text-muted);

		&.highlight {
			color: var(--warning);
		}

		&.warning {
			color: var(--warning);
		}

		svg {
			width: 14px;
			height: 14px;
		}
	}

	.subsection-title {
		flex: 1;
		font-size: 12px;
		font-weight: 500;
		color: var(--text-primary);
	}

	.badge {
		padding: 2px 6px;
		background: var(--void-elevated);
		border-radius: 10px;
		font-size: 10px;
		font-weight: 600;
		color: var(--text-muted);

		&.empty {
			background: transparent;
			color: var(--text-muted);
		}

		&.highlight {
			background: var(--warning);
			color: var(--void-surface);
		}

		&.warning {
			background: var(--error);
			color: white;
		}
	}

	.chevron {
		width: 14px;
		height: 14px;
		color: var(--text-muted);
		transition: transform 0.15s ease;

		&.expanded {
			transform: rotate(180deg);
		}
	}

	.subsection-content {
		padding: 0 10px 10px;
	}

	.hint {
		font-size: 11px;
		color: var(--text-muted);
		margin-bottom: 8px;

		&.warning {
			color: var(--warning);
		}
	}

	.empty-list {
		font-size: 11px;
		color: var(--text-muted);
		font-style: italic;
		padding: 4px 0;

		&.success {
			color: var(--success-text);
			font-style: normal;
		}
	}

	.link-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.link-item {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 0;
		font-size: 11px;
		border-bottom: 1px solid var(--void-elevated);

		&:last-child {
			border-bottom: none;
		}

		&.linked {
			opacity: 0.7;
		}

		&.warning {
			color: var(--warning);
		}
	}

	.link-name {
		flex: 1;
		color: var(--shadow-monarch-light);
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		&:hover {
			color: var(--awakening-cyan);
			text-shadow: var(--glow-sm);
		}
	}

	.mention-count {
		padding: 1px 4px;
		background: var(--void-elevated);
		border-radius: 4px;
		font-size: 9px;
		color: var(--text-muted);

		&.excessive {
			background: var(--error);
			color: white;
		}
	}

	.type-badge {
		padding: 1px 4px;
		background: var(--shadow-monarch);
		border-radius: 4px;
		font-size: 9px;
		color: white;
		font-weight: 500;
	}

	.linked-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		color: var(--success-text);

		svg {
			width: 12px;
			height: 12px;
		}
	}

	.more-items {
		padding: 4px 0;
		font-size: 10px;
		color: var(--text-muted);
		font-style: italic;
	}

	.warning-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px;
		background: rgba(245, 158, 11, 0.1);
		border-radius: 4px;
		font-size: 11px;
		color: var(--warning);
		margin-bottom: 8px;
	}

	.warning-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		background: var(--warning);
		color: var(--void-surface);
		border-radius: 50%;
		font-size: 10px;
		font-weight: bold;
		flex-shrink: 0;
	}
</style>

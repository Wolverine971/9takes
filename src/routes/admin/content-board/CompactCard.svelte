<!-- src/routes/admin/content-board/CompactCard.svelte -->
<script lang="ts">
	interface Props {
		blog: App.BlogPost;
		isDragging?: boolean;
		isBeingDragged?: boolean;
		onclick?: (blog: App.BlogPost) => void;
		ondragstart?: (data: { event: DragEvent; blog: App.BlogPost }) => void;
		ondragend?: (event: DragEvent) => void;
	}

	let {
		blog,
		isDragging = false,
		isBeingDragged = false,
		onclick,
		ondragstart,
		ondragend
	}: Props = $props();

	// Enneagram type colors
	const enneagramColors: Record<number | string, string> = {
		1: 'bg-slate-100 text-slate-700',
		2: 'bg-rose-100 text-rose-700',
		3: 'bg-amber-100 text-amber-700',
		4: 'bg-purple-100 text-purple-700',
		5: 'bg-cyan-100 text-cyan-700',
		6: 'bg-blue-100 text-blue-700',
		7: 'bg-orange-100 text-orange-700',
		8: 'bg-red-100 text-red-700',
		9: 'bg-green-100 text-green-700'
	};

	// Get display name (person name or title)
	let displayName = $derived(blog.person?.replace(/-/g, ' ') || blog.title || 'Untitled');

	// Get category - prefer category field, fallback to first type
	function getCategory(blogItem: App.BlogPost): string | null {
		if ((blogItem as any).category) return (blogItem as any).category;
		if (Array.isArray(blogItem.type) && blogItem.type.length > 0) return blogItem.type[0];
		if (typeof blogItem.type === 'string') {
			try {
				const parsed = JSON.parse(blogItem.type);
				return Array.isArray(parsed) ? parsed[0] : parsed;
			} catch {
				return blogItem.type;
			}
		}
		return null;
	}

	let category = $derived(getCategory(blog));

	// Get external link URL
	let externalUrl = $derived(
		blog.loc
			? blog.loc.replace('https://9takes.com', '')
			: blog.person
				? `/personality-analysis/${blog.person}`
				: null
	);

	// Format date
	function formatDate(dateStr: string | undefined): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return dateStr;
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	let displayDate = $derived(formatDate(blog.lastmod) || formatDate(blog.date));

	// Handle card click (not on drag handle or external link)
	function handleClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.closest('.drag-handle') || target.closest('.external-link')) return;
		onclick?.(blog);
	}

	// Handle drag from handle only
	let dragHandleActive = $state(false);

	function handleDragStart(e: DragEvent) {
		if (!dragHandleActive) {
			e.preventDefault();
			return;
		}
		ondragstart?.({ event: e, blog });
	}

	function handleDragEnd(e: DragEvent) {
		dragHandleActive = false;
		ondragend?.(e);
	}

	function handleHandleMouseDown() {
		dragHandleActive = true;
	}

	function handleHandleMouseUp() {
		dragHandleActive = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onclick?.(blog);
		}
	}
</script>

<div
	class="compact-card group"
	class:is-dragging={isBeingDragged}
	class:cursor-grabbing={isDragging}
	draggable="true"
	onclick={handleClick}
	ondragstart={handleDragStart}
	ondragend={handleDragEnd}
	onkeydown={handleKeydown}
	role="button"
	tabindex="0"
>
	<!-- Drag Handle (left edge) -->
	<div
		class="drag-handle"
		onmousedown={handleHandleMouseDown}
		onmouseup={handleHandleMouseUp}
		role="button"
		tabindex="-1"
		aria-label="Drag to reorder"
	>
		<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
			<circle cx="9" cy="6" r="1.5" />
			<circle cx="15" cy="6" r="1.5" />
			<circle cx="9" cy="12" r="1.5" />
			<circle cx="15" cy="12" r="1.5" />
			<circle cx="9" cy="18" r="1.5" />
			<circle cx="15" cy="18" r="1.5" />
		</svg>
	</div>

	<!-- Card Content -->
	<div class="card-content">
		<!-- Row 1: Status + Name + External Link -->
		<div class="row-1">
			<span class="status-dot" class:published={blog.published}></span>
			<span class="display-name" title={displayName}>{displayName}</span>
			{#if blog.published && externalUrl}
				<a
					href={externalUrl}
					class="external-link"
					target="_blank"
					rel="noopener noreferrer"
					onclick={(e) => e.stopPropagation()}
					title="View published page"
				>
					<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/>
					</svg>
				</a>
			{/if}
		</div>

		<!-- Row 2: Enneagram Badge + Category -->
		<div class="row-2">
			{#if blog.enneagram}
				<span
					class="enneagram-badge {enneagramColors[blog.enneagram] || 'bg-gray-100 text-gray-700'}"
				>
					Type {blog.enneagram}
				</span>
			{/if}
			{#if category}
				<span class="category-tag">{category}</span>
			{/if}
		</div>

		<!-- Row 3: Date + Status Text -->
		<div class="row-3">
			{#if displayDate}
				<span class="date">{displayDate}</span>
			{/if}
			<span class="status-text" class:published={blog.published}>
				{blog.published ? 'Published' : 'Draft'}
			</span>
		</div>
	</div>
</div>

<style lang="scss">
	.compact-card {
		display: flex;
		align-items: stretch;
		background: white;
		border-radius: 6px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
		cursor: pointer;
		transition: all 0.15s ease;
		overflow: hidden;

		&:hover {
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			border-color: #d1d5db;
		}

		&:focus-visible {
			outline: 2px solid #3b82f6;
			outline-offset: 2px;
		}

		&.is-dragging {
			opacity: 0.5;
			transform: rotate(2deg);
		}

		&.cursor-grabbing {
			cursor: grabbing;
		}
	}

	.drag-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		flex-shrink: 0;
		background: #f9fafb;
		color: #d1d5db;
		cursor: grab;
		opacity: 0;
		transition: opacity 0.15s ease;

		.compact-card:hover & {
			opacity: 1;
		}

		&:active {
			cursor: grabbing;
			color: #9ca3af;
		}
	}

	.card-content {
		flex: 1;
		min-width: 0;
		padding: 8px 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.row-1 {
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
		background: #fbbf24;

		&.published {
			background: #22c55e;
		}
	}

	.display-name {
		flex: 1;
		font-size: 11px;
		font-weight: 600;
		color: #1f2937;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.3;
	}

	.external-link {
		flex-shrink: 0;
		color: #9ca3af;
		padding: 2px;
		border-radius: 3px;
		transition: all 0.15s ease;

		&:hover {
			color: #3b82f6;
			background: #eff6ff;
		}
	}

	.row-2 {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-wrap: wrap;
	}

	.enneagram-badge {
		display: inline-flex;
		align-items: center;
		padding: 1px 5px;
		border-radius: 3px;
		font-size: 9px;
		font-weight: 600;
		line-height: 1.4;
	}

	.category-tag {
		display: inline-flex;
		align-items: center;
		padding: 1px 5px;
		border-radius: 3px;
		font-size: 9px;
		font-weight: 500;
		background: #f3f4f6;
		color: #6b7280;
		line-height: 1.4;
	}

	.row-3 {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 9px;
		color: #9ca3af;
		border-top: 1px solid #f3f4f6;
		padding-top: 4px;
		margin-top: 2px;
	}

	.date {
		flex-shrink: 0;
	}

	.status-text {
		margin-left: auto;
		font-weight: 500;
		color: #d97706;

		&.published {
			color: #16a34a;
		}
	}
</style>

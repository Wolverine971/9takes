<!-- src/routes/admin/content-board/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import CompactCard from './CompactCard.svelte';
	import ContentEditorModal from './ContentEditorModal.svelte';
	import ContentAnalytics from './ContentAnalytics.svelte';
	import { notifications } from '$lib/components/molecules/notifications';

	let { data }: { data: PageData } = $props();

	// Modal state
	let modalOpen = $state(false);
	let selectedBlog = $state<App.BlogPost | null>(null);
	let selectedBlogId = $state<number | null>(null);
	let closingModal = $state(false); // Flag to prevent reopening

	// Mobile detection
	let isMobile = $state(false);
	let showFilters = $state(false);

	onMount(() => {
		isMobile = window.innerWidth < 768;
		const handleResize = () => {
			isMobile = window.innerWidth < 768;
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	let activeSelection = $state('people');
	let isDragging = $state(false);
	let draggedBlog = $state<App.BlogPost | null>(null);
	let searchQuery = $state('');
	let filterUnpublished = $state(false);
	// Default to list view on mobile for better usability
	let viewMode = $state<'board' | 'list' | 'analytics'>(
		browser && window.innerWidth < 768 ? 'list' : 'board'
	);

	// Enhanced filtering for people
	let selectedEnneagramType = $state('');
	let selectedAuthor = $state('');
	let selectedType = $state('');
	let sortBy = $state('lastmod');
	let sortOrder = $state<'asc' | 'desc'>('desc');
	let showSocialMediaOnly = $state(false);

	const contentTypes = ['enneagram', 'community', 'guides', 'people'];
	const stages = [
		'Not written',
		'Prioritized',
		'Written',
		'Proof read',
		'Sent out for review',
		'Reviewed',
		'Socialized',
		'Growing',
		'Needs Work'
	];

	// Stage colors for visual distinction (dark theme)
	const stageColors: Record<number, string> = {
		0: 'stage-not-written',
		1: 'stage-prioritized',
		2: 'stage-written',
		3: 'stage-proofread',
		4: 'stage-sent-review',
		5: 'stage-reviewed',
		6: 'stage-socialized',
		7: 'stage-growing',
		8: 'stage-needs-work'
	};

	// Helper to get data by content type
	function getContentData(type: string): App.BlogPost[] {
		return (data as Record<string, App.BlogPost[]>)[type] || [];
	}

	// Helper to calculate stage for a blog post
	function calculateStage(blog: App.BlogPost): number {
		if (!blog.published) {
			return blog.stageName === 'Prioritized' ? 1 : 0;
		}
		const stageIndex = stages.indexOf(blog.stageName || '');
		return stageIndex >= 2 ? stageIndex : 2;
	}

	// Handle URL query param for deep linking - redirect to new route format
	$effect(() => {
		const editId = $page.url.searchParams.get('edit');
		if (editId && browser) {
			const id = parseInt(editId);
			if (!isNaN(id)) {
				const blog = getContentData('people').find((b: any) => b.id === id);
				if (blog?.person) {
					// Redirect to the new clean URL format
					goto(`/admin/content-board/personality-analysis/${blog.person}`, { replaceState: true });
					return;
				}
			}
		}
		// Reset closing flag once URL is clean
		if (!editId && closingModal) {
			closingModal = false;
		}
	});

	// Get current content data with stage calculated inline
	let currentContentData = $derived.by(() => {
		const contentData = getContentData(activeSelection);
		return contentData.map((blog) => ({
			...blog,
			stage: calculateStage(blog)
		}));
	});

	// Get unique values for filters
	let uniqueEnneagramTypes = $derived.by(() => {
		if (activeSelection !== 'people' || !currentContentData.length) return [];
		return [
			...new Set(currentContentData.map((item: App.BlogPost) => item.enneagram).filter(Boolean))
		].sort();
	});

	let uniqueAuthors = $derived.by(() => {
		if (activeSelection !== 'people' || !currentContentData.length) return [];
		return [
			...new Set(currentContentData.map((item: App.BlogPost) => item.author).filter(Boolean))
		].sort();
	});

	let uniqueTypes = $derived.by(() => {
		if (activeSelection !== 'people' || !currentContentData.length) return [];
		return [
			...new Set(
				currentContentData
					.map((item: App.BlogPost) => {
						if (Array.isArray(item.type)) {
							return item.type;
						} else if (typeof item.type === 'string') {
							try {
								const parsed = JSON.parse(item.type);
								return Array.isArray(parsed) ? parsed : [parsed];
							} catch {
								return [item.type];
							}
						}
						return [];
					})
					.flat()
					.filter(Boolean)
			)
		].sort();
	});

	// Filtered data based on search query and filters
	let filteredData = $derived.by(() => {
		if (!activeSelection || !currentContentData.length) return [];

		return currentContentData
			.filter((blog) => {
				const matchesSearch =
					!searchQuery ||
					blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					blog.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					blog.person?.toLowerCase().includes(searchQuery.toLowerCase());

				const matchesPublished = !filterUnpublished || blog.published;

				let matchesEnneagramType = true;
				let matchesAuthor = true;
				let matchesType = true;
				let matchesSocialMedia = true;

				if (activeSelection === 'people') {
					matchesEnneagramType = !selectedEnneagramType || blog.enneagram === selectedEnneagramType;
					matchesAuthor = !selectedAuthor || blog.author === selectedAuthor;
					matchesSocialMedia =
						!showSocialMediaOnly || blog.instagram || blog.twitter || blog.tiktok;

					if (selectedType) {
						if (Array.isArray(blog.type)) {
							matchesType = blog.type.includes(selectedType);
						} else if (typeof blog.type === 'string') {
							try {
								const parsed = JSON.parse(blog.type);
								matchesType = Array.isArray(parsed)
									? parsed.includes(selectedType)
									: parsed === selectedType;
							} catch {
								matchesType = blog.type === selectedType;
							}
						} else {
							matchesType = false;
						}
					}
				}

				return (
					matchesSearch &&
					matchesPublished &&
					matchesEnneagramType &&
					matchesAuthor &&
					matchesType &&
					matchesSocialMedia
				);
			})
			.sort((a, b) => {
				let aValue: string | Date, bValue: string | Date;

				switch (sortBy) {
					case 'title':
						aValue = a.title || '';
						bValue = b.title || '';
						break;
					case 'person':
						aValue = a.person || '';
						bValue = b.person || '';
						break;
					case 'enneagram':
						aValue = a.enneagram || '';
						bValue = b.enneagram || '';
						break;
					case 'author':
						aValue = a.author || '';
						bValue = b.author || '';
						break;
					case 'type':
						const getFirstType = (item: App.BlogPost) => {
							if (Array.isArray(item.type)) {
								return item.type[0] || '';
							} else if (typeof item.type === 'string') {
								try {
									const parsed = JSON.parse(item.type);
									return Array.isArray(parsed) ? parsed[0] || '' : parsed || '';
								} catch {
									return item.type || '';
								}
							}
							return '';
						};
						aValue = getFirstType(a);
						bValue = getFirstType(b);
						break;
					case 'lastmod':
					default:
						aValue = new Date(a.lastmod || 0);
						bValue = new Date(b.lastmod || 0);
						break;
				}

				if (sortOrder === 'asc') {
					return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
				} else {
					return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
				}
			});
	});

	// Count blogs in each stage for the current content type
	let stageCounts = $derived(
		stages.map((_, stageIndex) => {
			return filteredData.filter((blog: App.BlogPost) => blog.stage === stageIndex).length;
		})
	);

	// Reset filters when switching content types
	$effect(() => {
		if (activeSelection !== 'people') {
			selectedEnneagramType = '';
			selectedAuthor = '';
			selectedType = '';
			showSocialMediaOnly = false;
		}
	});

	// Check if any filters are active
	let hasActiveFilters = $derived(
		searchQuery ||
			selectedEnneagramType ||
			selectedAuthor ||
			selectedType ||
			showSocialMediaOnly ||
			filterUnpublished ||
			sortBy !== 'lastmod' ||
			sortOrder !== 'desc'
	);

	// Open modal for a blog (or navigate to page for people)
	function openModal(blog: App.BlogPost) {
		// For people content, navigate to the dedicated page
		if (activeSelection === 'people' && blog.person) {
			goto(`/admin/content-board/personality-analysis/${blog.person}`);
			return;
		}

		// For other content types, use the modal
		selectedBlog = blog;
		selectedBlogId = (blog as any).id || null;
		modalOpen = true;
	}

	// Close modal
	function closeModal() {
		closingModal = true;
		modalOpen = false;
		selectedBlog = null;
		selectedBlogId = null;
	}

	// Handle saved content - update local data
	function handleSaved(updatedData: Record<string, any>) {
		if (activeSelection === 'people' && updatedData.id) {
			const peopleData = getContentData('people');
			const index = peopleData.findIndex((b: any) => b.id === updatedData.id);
			if (index !== -1) {
				peopleData[index] = { ...peopleData[index], ...updatedData };
				(data as Record<string, App.BlogPost[]>)['people'] = [...peopleData];
			}
		}
	}

	// Handle card click from CompactCard
	function handleCardClick(blog: App.BlogPost) {
		openModal(blog);
	}

	// Handle drag start from CompactCard
	function handleCardDragStart(dragData: { event: DragEvent; blog: App.BlogPost }) {
		const { event: dragEvent, blog } = dragData;
		isDragging = true;
		draggedBlog = blog;
		dragEvent.dataTransfer?.setData('text/plain', blog.title);
		dragEvent.dataTransfer!.effectAllowed = 'move';
	}

	// Handle drag end from CompactCard
	function handleCardDragEnd() {
		isDragging = false;
		draggedBlog = null;
	}

	// Validate if a stage transition is valid
	function isValidTransition(
		blog: App.BlogPost,
		targetStage: number
	): { valid: boolean; reason: string } {
		if (!blog.published && targetStage > 1) {
			return {
				valid: false,
				reason: `Cannot move unpublished content to "${stages[targetStage]}". Publish the content first.`
			};
		}

		if (blog.published && targetStage < 2) {
			return {
				valid: false,
				reason: `Published content cannot be moved to "${stages[targetStage]}". It should stay in "Written" or later stages.`
			};
		}

		return { valid: true, reason: '' };
	}

	function dragOver(event: DragEvent, stageIndex: number) {
		event.preventDefault();

		if (draggedBlog) {
			const validation = isValidTransition(draggedBlog, stageIndex);
			event.dataTransfer!.dropEffect = validation.valid ? 'move' : 'none';
		}

		const element = event.currentTarget as HTMLElement;
		element.classList.add('drag-over');
	}

	function dragLeave(event: DragEvent) {
		const element = event.currentTarget as HTMLElement;
		element.classList.remove('drag-over');
	}

	async function drop(event: DragEvent, stageIndex: number, blogType: string) {
		event.preventDefault();
		const element = event.currentTarget as HTMLElement;
		element.classList.remove('drag-over');

		const blogTitle = event.dataTransfer?.getData('text/plain');
		const blogData = getContentData(blogType);
		if (!blogTitle || !blogData.length) return;

		const blogIndex = blogData.findIndex((b: App.BlogPost) => b.title === blogTitle);
		if (blogIndex === -1 || blogData[blogIndex].stage === stageIndex) return;

		const blog = blogData[blogIndex];
		const oldStage = blog.stage;

		const validation = isValidTransition(blog, stageIndex);
		if (!validation.valid) {
			notifications.warning(validation.reason, 4000);
			return;
		}

		blog.stage = stageIndex;
		blog.stageName = stages[stageIndex];

		(data as Record<string, App.BlogPost[]>)[blogType] = [...blogData];

		try {
			await updateStage(blog, blogType);
			notifications.success(`Moved "${blog.title}" to ${stages[stageIndex]}`, 3000);
		} catch (error) {
			blog.stage = oldStage;
			blog.stageName = stages[oldStage];
			(data as Record<string, App.BlogPost[]>)[blogType] = [...blogData];
			notifications.error('Failed to update content stage', 3000);
		}
	}

	async function updateStage(blog: App.BlogPost, blogType: string) {
		let body = new FormData();

		body.append('content_type', blogType);
		body.append('title', blog.title);
		body.append('description', blog.description || '');
		body.append('author', blog.author || '');
		body.append('date', blog.date || '');
		body.append('loc', blog.loc || '');
		body.append('lastmod', blog.lastmod || '');
		body.append('published', blog.published?.toString() || 'false');
		body.append('type', blog?.type?.toString() || '');
		body.append('stageName', blog.stageName || '');

		const response = await fetch(`/content-board?/updateStage`, { method: 'POST', body });
		const result = await response.json();

		if (!result.data && result.error) {
			throw new Error(result.error);
		}
	}

	function clearFilters() {
		searchQuery = '';
		selectedEnneagramType = '';
		selectedAuthor = '';
		selectedType = '';
		showSocialMediaOnly = false;
		filterUnpublished = false;
		sortBy = 'lastmod';
		sortOrder = 'desc';
	}
</script>

<div class="content-board">
	<!-- Header -->
	<header class="dashboard-header">
		<div class="header-left">
			<h1 class="page-title">Content Board</h1>
			<p class="page-subtitle">Manage blog posts and content workflow</p>
		</div>
	</header>

	<!-- Content Type Selector -->
	<div class="content-type-selector">
		{#each contentTypes as type}
			<button
				class="type-btn"
				class:active={activeSelection === type}
				onclick={() => (activeSelection = type)}
			>
				{type.charAt(0).toUpperCase() + type.slice(1)}
				<span class="count-badge" class:active={activeSelection === type}>
					{getContentData(type).length || 0}
				</span>
			</button>
		{/each}
	</div>

	<!-- Controls -->
	<div class="controls-panel">
		<!-- Mobile Search Bar - Always visible on mobile -->
		<div class="mobile-search-bar">
			<div class="search-wrapper-mobile">
				<svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search..."
					class="search-input-mobile"
				/>
				{#if searchQuery}
					<button class="clear-search" onclick={() => (searchQuery = '')}>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				{/if}
			</div>
			<button
				class="filter-toggle-btn"
				class:active={showFilters || hasActiveFilters}
				onclick={() => (showFilters = !showFilters)}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
					/>
				</svg>
				{#if hasActiveFilters}
					<span class="filter-badge"></span>
				{/if}
			</button>
		</div>

		<!-- Desktop Controls Row -->
		<div class="controls-row">
			<!-- Search -->
			<div class="search-wrapper">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search content..."
					class="search-input"
				/>
			</div>

			<!-- Sort & View Controls -->
			<div class="controls-group">
				<select bind:value={sortBy} class="select-input">
					<option value="lastmod">Date Modified</option>
					<option value="title">Title</option>
					{#if activeSelection === 'people'}
						<option value="person">Person</option>
						<option value="enneagram">Enneagram Type</option>
						<option value="author">Author</option>
						<option value="type">Type</option>
					{/if}
				</select>
				<button
					class="sort-btn"
					onclick={() => (sortOrder = sortOrder === 'asc' ? 'desc' : 'asc')}
					title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
				>
					{sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
				</button>

				<!-- View Mode Toggle -->
				<div class="view-toggle">
					<button
						class="view-btn"
						class:active={viewMode === 'board'}
						onclick={() => (viewMode = 'board')}
						title="Board view"
					>
						<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
							/>
						</svg>
					</button>
					<button
						class="view-btn"
						class:active={viewMode === 'list'}
						onclick={() => (viewMode = 'list')}
						title="List view"
					>
						<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					{#if activeSelection === 'people'}
						<button
							class="view-btn"
							class:active={viewMode === 'analytics'}
							onclick={() => (viewMode = 'analytics')}
							title="Analytics view"
						>
							<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
						</button>
					{/if}
				</div>

				{#if hasActiveFilters}
					<button class="clear-filters-btn" onclick={clearFilters}> Clear filters </button>
				{/if}
			</div>
		</div>

		<!-- Filters Section (collapsible on mobile) -->
		<div class="filters-section" class:show={showFilters || !isMobile}>
			<!-- Mobile View Toggle -->
			<div class="mobile-view-toggle">
				<span class="mobile-view-label">View:</span>
				<div class="view-toggle">
					<button
						class="view-btn"
						class:active={viewMode === 'list'}
						onclick={() => (viewMode = 'list')}
					>
						List
					</button>
					<button
						class="view-btn"
						class:active={viewMode === 'board'}
						onclick={() => (viewMode = 'board')}
					>
						Board
					</button>
					{#if activeSelection === 'people'}
						<button
							class="view-btn"
							class:active={viewMode === 'analytics'}
							onclick={() => (viewMode = 'analytics')}
						>
							Analytics
						</button>
					{/if}
				</div>
			</div>

			<!-- Mobile Sort -->
			<div class="mobile-sort">
				<span class="mobile-view-label">Sort:</span>
				<select bind:value={sortBy} class="select-input-mobile">
					<option value="lastmod">Date</option>
					<option value="title">Title</option>
					{#if activeSelection === 'people'}
						<option value="person">Name</option>
						<option value="enneagram">Type</option>
					{/if}
				</select>
				<button
					class="sort-btn-mobile"
					onclick={() => (sortOrder = sortOrder === 'asc' ? 'desc' : 'asc')}
				>
					{sortOrder === 'asc' ? '↑' : '↓'}
				</button>
			</div>

			<!-- People-specific Filters -->
			{#if activeSelection === 'people'}
				<div class="filters-row">
					<div class="filter-group">
						<label for="filter-enneagram" class="filter-label">Enneagram:</label>
						<select id="filter-enneagram" bind:value={selectedEnneagramType} class="filter-select">
							<option value="">All</option>
							{#each uniqueEnneagramTypes as type}
								<option value={type}>Type {type}</option>
							{/each}
						</select>
					</div>

					<div class="filter-group">
						<label for="filter-author" class="filter-label">Author:</label>
						<select id="filter-author" bind:value={selectedAuthor} class="filter-select">
							<option value="">All</option>
							{#each uniqueAuthors as author}
								<option value={author}>{author}</option>
							{/each}
						</select>
					</div>

					<div class="filter-group">
						<label for="filter-category" class="filter-label">Category:</label>
						<select id="filter-category" bind:value={selectedType} class="filter-select">
							<option value="">All</option>
							{#each uniqueTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>

					<label class="checkbox-label">
						<input type="checkbox" bind:checked={showSocialMediaOnly} class="checkbox-input" />
						<span>Has social</span>
					</label>

					<label class="checkbox-label">
						<input type="checkbox" bind:checked={filterUnpublished} class="checkbox-input" />
						<span>Published only</span>
					</label>
				</div>
			{:else}
				<div class="filters-row">
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={filterUnpublished} class="checkbox-input" />
						<span>Published only</span>
					</label>
				</div>
			{/if}

			{#if hasActiveFilters}
				<button class="clear-filters-btn-mobile" onclick={clearFilters}> Clear all filters </button>
			{/if}
		</div>

		<!-- Results Summary -->
		<div class="results-summary">
			Showing {filteredData.length} of {currentContentData.length || 0} items
		</div>
	</div>

	<!-- Analytics View (People only) -->
	{#if viewMode === 'analytics' && activeSelection === 'people'}
		<ContentAnalytics data={filteredData} onSelectBlog={handleCardClick} />
		<!-- Kanban Board View -->
	{:else if viewMode === 'board'}
		<div class="kanban-container">
			<div class="kanban-board" class:cursor-grabbing={isDragging}>
				{#each stages as stage, stageIndex}
					<div
						class="kanban-column {stageColors[stageIndex]}"
						class:dragging-active={isDragging}
						ondragover={(event) => dragOver(event, stageIndex)}
						ondragleave={dragLeave}
						ondrop={async (event) => await drop(event, stageIndex, activeSelection)}
						role="region"
						aria-labelledby={`stage-${stageIndex}-heading`}
					>
						<div class="column-header">
							<h2 id={`stage-${stageIndex}-heading`} class="column-title" title={stage}>
								{stage}
							</h2>
							<span class="column-count">{stageCounts[stageIndex]}</span>
						</div>

						<div class="kanban-cards">
							{#each filteredData.filter((blog) => blog.stage === stageIndex) as blog, index (`${stageIndex}-${index}-${blog.loc || blog.title}`)}
								{#if blog.title}
									<div transition:fade={{ duration: 100 }}>
										<CompactCard
											{blog}
											{isDragging}
											isBeingDragged={isDragging && draggedBlog?.title === blog.title}
											onclick={handleCardClick}
											ondragstart={handleCardDragStart}
											ondragend={handleCardDragEnd}
										/>
									</div>
								{/if}
							{:else}
								<div class="empty-column">
									<p>Empty</p>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<!-- List View -->
		<div class="table-card">
			<div class="table-content">
				<table class="data-table">
					<thead>
						<tr>
							<th>Title</th>
							<th class="hide-mobile">Stage</th>
							<th class="hide-mobile-sm">Status</th>
							<th class="hide-tablet">Modified</th>
							<th class="actions-col">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredData as blog, index (`list-${index}-${blog.loc || blog.title}`)}
							<tr
								class="table-row"
								onclick={() => openModal(blog)}
								onkeydown={(e) => e.key === 'Enter' && openModal(blog)}
								tabindex="0"
								role="button"
							>
								<td class="title-cell">
									<div class="title-text">{blog.title}</div>
									{#if activeSelection === 'people' && blog.person}
										<div class="subtitle-text">{blog.person?.replace(/-/g, ' ')}</div>
									{/if}
								</td>
								<td class="hide-mobile">
									<span class="stage-badge">{stages[blog.stage]}</span>
								</td>
								<td class="hide-mobile-sm">
									<span class="status-badge" class:published={blog.published}>
										{blog.published ? 'Published' : 'Draft'}
									</span>
								</td>
								<td class="hide-tablet date-cell">
									{new Date(blog.lastmod).toLocaleDateString()}
								</td>
								<td class="actions-col">
									{#if blog.published && blog.loc}
										<a
											href={blog.loc.replace('https://9takes.com', '')}
											class="view-link"
											onclick={(e) => e.stopPropagation()}
										>
											View
											<svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
												/>
											</svg>
										</a>
									{:else}
										<button
											class="edit-btn"
											onclick={(e) => {
												e.stopPropagation();
												openModal(blog);
											}}
										>
											Edit
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<!-- Content Editor Modal -->
<ContentEditorModal
	bind:open={modalOpen}
	blogId={selectedBlogId}
	contentType={activeSelection}
	initialData={selectedBlog}
	onclose={closeModal}
	onsaved={handleSaved}
/>

<style>
	/* Main Container */
	.content-board {
		width: 100%;
	}

	/* Header */
	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--void-elevated);

		@media (max-width: 768px) {
			margin-bottom: 16px;
			padding-bottom: 12px;
		}
	}

	.header-left {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
		background: linear-gradient(135deg, var(--shadow-monarch-light), var(--awakening-cyan));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;

		@media (max-width: 768px) {
			font-size: 1.25rem;
		}
	}

	.page-subtitle {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		margin: 0;

		@media (max-width: 768px) {
			display: none;
		}
	}

	/* Content Type Selector */
	.content-type-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 16px;

		@media (max-width: 768px) {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 6px;
			margin-bottom: 12px;
		}
	}

	.type-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		font-size: 0.875rem;
		font-weight: 500;
		background: var(--void-surface);
		color: var(--text-secondary);
		border: 1px solid var(--void-elevated);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;

		@media (max-width: 768px) {
			flex-direction: column;
			gap: 4px;
			padding: 12px 8px;
			font-size: 12px;
			text-align: center;
			justify-content: center;
		}
	}

	.type-btn:hover {
		border-color: var(--shadow-monarch);
		background: var(--shadow-monarch-subtle);
		color: var(--text-primary);
	}

	.type-btn.active {
		background: linear-gradient(135deg, var(--shadow-monarch) 0%, var(--shadow-monarch-dark) 100%);
		color: white;
		border-color: var(--shadow-monarch);
		box-shadow: var(--glow-sm);
	}

	.count-badge {
		padding: 2px 8px;
		font-size: 0.75rem;
		font-weight: 600;
		background: var(--void-elevated);
		color: var(--text-secondary);
		border-radius: 12px;

		@media (max-width: 768px) {
			padding: 2px 6px;
			font-size: 11px;
		}
	}

	.count-badge.active {
		background: rgba(255, 255, 255, 0.2);
		color: white;
	}

	/* Controls Panel */
	.controls-panel {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 16px;

		@media (max-width: 768px) {
			padding: 12px;
			border-radius: 8px;
		}
	}

	/* Mobile Search Bar */
	.mobile-search-bar {
		display: none;
		gap: 8px;
		margin-bottom: 12px;

		@media (max-width: 768px) {
			display: flex;
		}
	}

	.search-wrapper-mobile {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: 12px;
		width: 18px;
		height: 18px;
		color: var(--text-muted);
		pointer-events: none;
	}

	.search-input-mobile {
		width: 100%;
		padding: 12px 40px 12px 40px;
		font-size: 16px;
		background: var(--void-elevated);
		color: var(--text-primary);
		border: 1px solid var(--void-highlight);
		border-radius: 10px;
		transition: all 0.2s ease;

		&::placeholder {
			color: var(--text-muted);
		}

		&:focus {
			outline: none;
			border-color: var(--shadow-monarch);
			box-shadow: var(--glow-sm);
		}
	}

	.clear-search {
		position: absolute;
		right: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		background: var(--void-highlight);
		border: none;
		border-radius: 50%;
		color: var(--text-secondary);
		cursor: pointer;
	}

	.filter-toggle-btn {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		padding: 0;
		background: var(--void-elevated);
		border: 1px solid var(--void-highlight);
		border-radius: 10px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;

		&.active {
			background: var(--shadow-monarch-subtle);
			border-color: var(--shadow-monarch);
			color: var(--shadow-monarch-light);
		}
	}

	.filter-badge {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 8px;
		height: 8px;
		background: var(--shadow-monarch);
		border-radius: 50%;
	}

	/* Filters Section */
	.filters-section {
		@media (max-width: 768px) {
			display: none;
			padding-top: 12px;
			border-top: 1px solid var(--void-elevated);
			margin-top: 12px;

			&.show {
				display: block;
			}
		}
	}

	/* Mobile View Toggle */
	.mobile-view-toggle {
		display: none;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;

		@media (max-width: 768px) {
			display: flex;
		}
	}

	.mobile-view-label {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	/* Mobile Sort */
	.mobile-sort {
		display: none;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;

		@media (max-width: 768px) {
			display: flex;
		}
	}

	.select-input-mobile {
		flex: 1;
		padding: 10px 12px;
		font-size: 14px;
		background: var(--void-elevated);
		color: var(--text-primary);
		border: 1px solid var(--void-highlight);
		border-radius: 8px;
	}

	.sort-btn-mobile {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		font-size: 18px;
		background: var(--void-elevated);
		color: var(--text-primary);
		border: 1px solid var(--void-highlight);
		border-radius: 8px;
		cursor: pointer;
	}

	.clear-filters-btn-mobile {
		display: none;
		width: 100%;
		padding: 12px;
		margin-top: 12px;
		font-size: 14px;
		font-weight: 500;
		color: var(--shadow-monarch-light);
		background: var(--shadow-monarch-subtle);
		border: 1px solid var(--shadow-monarch);
		border-radius: 8px;
		cursor: pointer;

		@media (max-width: 768px) {
			display: block;
		}
	}

	.controls-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;

		@media (max-width: 768px) {
			display: none;
		}
	}

	.search-wrapper {
		flex: 1;
		min-width: 200px;
		max-width: 400px;
	}

	.search-input {
		width: 100%;
		padding: 10px 14px;
		font-size: 0.875rem;
		background: var(--void-elevated);
		color: var(--text-primary);
		border: 1px solid var(--void-highlight);
		border-radius: 8px;
		transition: all 0.2s ease;
	}

	.search-input::placeholder {
		color: var(--text-muted);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--shadow-monarch);
		box-shadow: var(--glow-sm);
	}

	.controls-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}

	.select-input {
		padding: 10px 14px;
		font-size: 0.875rem;
		background: var(--void-elevated);
		color: var(--text-primary);
		border: 1px solid var(--void-highlight);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.select-input:focus {
		outline: none;
		border-color: var(--shadow-monarch);
		box-shadow: var(--glow-sm);
	}

	.sort-btn {
		padding: 10px 14px;
		font-size: 0.875rem;
		background: var(--void-elevated);
		color: var(--text-primary);
		border: 1px solid var(--void-highlight);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.sort-btn:hover {
		border-color: var(--shadow-monarch);
		background: var(--shadow-monarch-subtle);
	}

	.view-toggle {
		display: flex;
		overflow: hidden;
		border-radius: 8px;
		border: 1px solid var(--void-highlight);

		@media (max-width: 768px) {
			flex: 1;
		}
	}

	.view-btn {
		padding: 10px 12px;
		background: var(--void-elevated);
		color: var(--text-secondary);
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;

		@media (max-width: 768px) {
			flex: 1;
			padding: 12px 16px;
			font-size: 14px;
		}
	}

	.view-btn:hover {
		background: var(--void-highlight);
		color: var(--text-primary);
	}

	.view-btn.active {
		background: var(--shadow-monarch);
		color: white;
	}

	.icon {
		width: 16px;
		height: 16px;
	}

	.clear-filters-btn {
		padding: 10px 14px;
		font-size: 0.875rem;
		color: var(--shadow-monarch-light);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clear-filters-btn:hover {
		color: var(--awakening-cyan);
		text-shadow: var(--glow-sm);
	}

	/* Filters Row */
	.filters-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid var(--void-elevated);

		@media (max-width: 768px) {
			margin-top: 12px;
			padding-top: 12px;
			gap: 10px;
		}
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 6px;

		@media (max-width: 768px) {
			flex: 1 1 calc(50% - 5px);
			min-width: 140px;
			flex-direction: column;
			align-items: stretch;
			gap: 4px;
		}
	}

	.filter-label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-secondary);

		@media (max-width: 768px) {
			font-size: 12px;
		}
	}

	.filter-select {
		padding: 6px 10px;
		font-size: 0.8125rem;
		background: var(--void-elevated);
		color: var(--text-primary);
		border: 1px solid var(--void-highlight);
		border-radius: 6px;
		cursor: pointer;

		@media (max-width: 768px) {
			padding: 12px;
			font-size: 14px;
			border-radius: 8px;
		}
	}

	.filter-select:focus {
		outline: none;
		border-color: var(--shadow-monarch);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.8125rem;
		color: var(--text-secondary);
		cursor: pointer;

		@media (max-width: 768px) {
			padding: 12px;
			background: var(--void-elevated);
			border: 1px solid var(--void-highlight);
			border-radius: 8px;
			font-size: 14px;
			gap: 10px;
		}
	}

	.checkbox-input {
		width: 16px;
		height: 16px;
		accent-color: var(--shadow-monarch);

		@media (max-width: 768px) {
			width: 20px;
			height: 20px;
		}
	}

	.results-summary {
		margin-top: 12px;
		font-size: 0.75rem;
		color: var(--text-muted);

		@media (max-width: 768px) {
			text-align: center;
			padding: 8px 0;
			font-size: 13px;
		}
	}

	/* Kanban Board */
	.kanban-container {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 8px;

		@media (max-width: 768px) {
			margin: 0 -12px;
			padding: 0 12px 12px;
		}
	}

	.kanban-board {
		display: grid;
		grid-template-columns: repeat(9, 160px);
		gap: 8px;
		min-width: max-content;

		@media (max-width: 768px) {
			grid-template-columns: repeat(9, 200px);
			gap: 10px;
		}
	}

	@media (min-width: 1600px) {
		.kanban-board {
			grid-template-columns: repeat(9, minmax(160px, 180px));
		}
	}

	.kanban-column {
		min-height: 250px;
		max-height: calc(100vh - 280px);
		display: flex;
		flex-direction: column;
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 10px;
		border-top-width: 3px;
		transition: all 0.2s ease;

		@media (max-width: 768px) {
			min-height: 300px;
			max-height: calc(100vh - 240px);
			border-radius: 12px;
		}
	}

	.kanban-column.dragging-active {
		border-color: var(--shadow-monarch-glow);
	}

	/* Stage Colors */
	.stage-not-written {
		border-top-color: var(--text-muted);
	}
	.stage-prioritized {
		border-top-color: #f59e0b;
	}
	.stage-written {
		border-top-color: var(--system-interface);
	}
	.stage-proofread {
		border-top-color: #6366f1;
	}
	.stage-sent-review {
		border-top-color: var(--shadow-monarch);
	}
	.stage-reviewed {
		border-top-color: #ec4899;
	}
	.stage-socialized {
		border-top-color: var(--awakening-cyan);
	}
	.stage-growing {
		border-top-color: var(--success);
	}
	.stage-needs-work {
		border-top-color: var(--error);
	}

	.column-header {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		padding: 8px 10px;
		background: inherit;
		border-bottom: 1px solid var(--void-elevated);

		@media (max-width: 768px) {
			padding: 12px;
		}
	}

	.column-title {
		font-size: 0.6875rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		@media (max-width: 768px) {
			font-size: 12px;
		}
	}

	.column-count {
		flex-shrink: 0;
		padding: 2px 6px;
		font-size: 0.625rem;
		font-weight: 600;
		background: var(--void-elevated);
		color: var(--text-muted);
		border-radius: 10px;

		@media (max-width: 768px) {
			padding: 4px 8px;
			font-size: 11px;
		}
	}

	.kanban-cards {
		flex: 1;
		overflow-y: auto;
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		scrollbar-width: thin;
		scrollbar-color: var(--shadow-monarch) transparent;

		@media (max-width: 768px) {
			padding: 10px;
			gap: 8px;
		}
	}

	.kanban-cards::-webkit-scrollbar {
		width: 3px;
	}

	.kanban-cards::-webkit-scrollbar-track {
		background: transparent;
	}

	.kanban-cards::-webkit-scrollbar-thumb {
		background-color: var(--shadow-monarch);
		border-radius: 3px;
	}

	.empty-column {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
		border: 1px dashed var(--void-highlight);
		border-radius: 8px;
		background: var(--void-elevated);
	}

	.empty-column p {
		font-size: 0.625rem;
		color: var(--text-muted);
		margin: 0;
	}

	/* List View Table */
	.table-card {
		background: var(--void-surface);
		border: 1px solid var(--void-elevated);
		border-radius: 12px;
		overflow: hidden;

		@media (max-width: 768px) {
			border-radius: 8px;
		}
	}

	.table-content {
		overflow-x: auto;
		max-height: calc(100vh - 320px);
		overflow-y: auto;

		@media (max-width: 768px) {
			max-height: calc(100vh - 280px);
		}
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8125rem;

		@media (max-width: 768px) {
			font-size: 14px;
		}
	}

	.data-table thead {
		position: sticky;
		top: 0;
		background: var(--void-deep);
		z-index: 1;

		@media (max-width: 768px) {
			display: none;
		}
	}

	.data-table th {
		padding: 12px 16px;
		text-align: left;
		font-weight: 600;
		color: var(--text-secondary);
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid var(--void-elevated);
		white-space: nowrap;
	}

	.data-table td {
		padding: 12px 16px;
		border-bottom: 1px solid var(--void-elevated);
		color: var(--text-primary);

		@media (max-width: 768px) {
			padding: 14px 12px;
		}
	}

	.table-row {
		cursor: pointer;
		transition: background 0.15s ease;

		@media (max-width: 768px) {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			padding: 12px;
			border-bottom: 1px solid var(--void-elevated);

			td {
				border: none;
				padding: 0;
			}

			.title-cell {
				flex: 1;
				min-width: 0;
			}

			.actions-col {
				flex-shrink: 0;
			}
		}
	}

	.table-row:hover {
		background: var(--void-elevated);
	}

	.table-row:active {
		@media (max-width: 768px) {
			background: var(--shadow-monarch-subtle);
		}
	}

	.title-cell {
		max-width: 300px;

		@media (max-width: 768px) {
			max-width: none;
		}
	}

	.title-text {
		font-weight: 500;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		@media (max-width: 768px) {
			font-size: 15px;
			white-space: normal;
			line-height: 1.3;
		}
	}

	.subtitle-text {
		font-size: 0.75rem;
		color: var(--text-muted);
		margin-top: 2px;

		@media (max-width: 768px) {
			font-size: 13px;
			margin-top: 4px;
		}
	}

	.stage-badge {
		display: inline-flex;
		padding: 4px 10px;
		font-size: 0.75rem;
		font-weight: 500;
		background: var(--void-elevated);
		color: var(--text-secondary);
		border-radius: 12px;
	}

	.status-badge {
		display: inline-flex;
		padding: 4px 10px;
		font-size: 0.75rem;
		font-weight: 500;
		background: var(--warning-light);
		color: var(--warning);
		border-radius: 6px;
	}

	.status-badge.published {
		background: var(--success-light);
		color: var(--success-text);
	}

	.date-cell {
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.actions-col {
		text-align: right;
		white-space: nowrap;
	}

	.view-link {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--shadow-monarch-light);
		text-decoration: none;
		transition: all 0.15s ease;

		@media (max-width: 768px) {
			padding: 10px 14px;
			font-size: 13px;
			background: var(--shadow-monarch-subtle);
			border: 1px solid var(--shadow-monarch);
			border-radius: 6px;
		}
	}

	.view-link:hover {
		color: var(--awakening-cyan);
		text-shadow: var(--glow-sm);
	}

	.link-icon {
		width: 12px;
		height: 12px;

		@media (max-width: 768px) {
			display: none;
		}
	}

	.edit-btn {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--shadow-monarch-light);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.15s ease;

		@media (max-width: 768px) {
			padding: 10px 14px;
			font-size: 13px;
			background: var(--void-elevated);
			border: 1px solid var(--void-highlight);
			border-radius: 6px;
		}
	}

	.edit-btn:hover {
		color: var(--awakening-cyan);
		text-shadow: var(--glow-sm);
	}

	/* Hide columns responsively */
	.hide-mobile {
		display: table-cell;
	}
	.hide-mobile-sm {
		display: table-cell;
	}
	.hide-tablet {
		display: table-cell;
	}

	@media (max-width: 1024px) {
		.hide-tablet {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.hide-mobile {
			display: none;
		}

		.dashboard-header {
			margin-bottom: 16px;
			padding-bottom: 16px;
		}

		.page-title {
			font-size: 1.25rem;
		}

		.controls-panel {
			padding: 12px;
		}

		.controls-row {
			flex-direction: column;
			align-items: stretch;
		}

		.search-wrapper {
			max-width: none;
		}

		.controls-group {
			justify-content: space-between;
		}
	}

	@media (max-width: 640px) {
		.hide-mobile-sm {
			display: none;
		}

		.content-type-selector {
			gap: 6px;
		}

		.type-btn {
			padding: 8px 12px;
			font-size: 0.8125rem;
		}

		.filters-row {
			gap: 8px;
		}
	}

	/* Drag over styles */
	:global(.drag-over) {
		background-color: var(--shadow-monarch-subtle) !important;
		box-shadow: inset 0 0 0 2px var(--shadow-monarch);
	}

	:global(.dragging) {
		opacity: 0.6;
		transform: rotate(3deg);
	}
</style>

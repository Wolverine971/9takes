<!-- src/routes/admin/content-board/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import CompactCard from './CompactCard.svelte';
	import ContentEditorModal from './ContentEditorModal.svelte';
	import { notifications } from '$lib/components/molecules/notifications';

	let { data }: { data: PageData } = $props();

	// Modal state
	let modalOpen = $state(false);
	let selectedBlog = $state<App.BlogPost | null>(null);
	let selectedBlogId = $state<number | null>(null);
	let closingModal = $state(false); // Flag to prevent reopening

	let activeSelection = $state('people');
	let isDragging = $state(false);
	let draggedBlog = $state<App.BlogPost | null>(null);
	let searchQuery = $state('');
	let filterUnpublished = $state(false);
	let viewMode = $state<'board' | 'list'>('board');

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

	// Stage colors for visual distinction
	const stageColors: Record<number, string> = {
		0: 'bg-gray-100 border-gray-300',
		1: 'bg-amber-50 border-amber-300',
		2: 'bg-blue-50 border-blue-300',
		3: 'bg-indigo-50 border-indigo-300',
		4: 'bg-purple-50 border-purple-300',
		5: 'bg-pink-50 border-pink-300',
		6: 'bg-teal-50 border-teal-300',
		7: 'bg-green-50 border-green-300',
		8: 'bg-red-50 border-red-300'
	};

	// Helper to get data by content type
	function getContentData(type: string): App.BlogPost[] {
		return (data as Record<string, App.BlogPost[]>)[type] || [];
	}

	// Handle URL query param for deep linking
	$effect(() => {
		const editId = $page.url.searchParams.get('edit');
		if (editId && !modalOpen && !closingModal) {
			const id = parseInt(editId);
			if (!isNaN(id)) {
				const blog = getContentData('people').find((b: any) => b.id === id);
				if (blog) {
					openModal(blog);
				}
			}
		}
		// Reset closing flag once URL is clean
		if (!editId && closingModal) {
			closingModal = false;
		}
	});

	// Process each blog post and assign correct stage
	$effect(() => {
		contentTypes.forEach((type) => {
			const contentData = getContentData(type);
			contentData.forEach((blog: App.BlogPost) => {
				if (!blog.published) {
					if (blog.stageName === 'Prioritized') {
						blog.stage = 1;
					} else {
						blog.stage = 0;
					}
				} else {
					const stageIndex = stages.indexOf(blog.stageName || '');
					blog.stage = stageIndex >= 2 ? stageIndex : 2;
				}
			});
		});
	});

	// Get current content data
	let currentContentData = $derived(getContentData(activeSelection));

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

	// Open modal for a blog
	function openModal(blog: App.BlogPost) {
		selectedBlog = blog;
		selectedBlogId = (blog as any).id || null;
		modalOpen = true;
		// Update URL without navigation
		const url = new URL(window.location.href);
		if (selectedBlogId) {
			url.searchParams.set('edit', selectedBlogId.toString());
		}
		history.replaceState({}, '', url.toString());
	}

	// Close modal
	function closeModal() {
		closingModal = true; // Prevent effect from reopening
		modalOpen = false;
		selectedBlog = null;
		selectedBlogId = null;
		// Remove edit param from URL using goto so $page updates
		const url = new URL(window.location.href);
		url.searchParams.delete('edit');
		goto(url.pathname + url.search, { replaceState: true, noScroll: true });
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

<div class="min-h-screen bg-gray-50 p-4 md:p-6">
	<!-- Header -->
	<div class="mb-6">
		<h1 class="mb-1 text-2xl font-bold text-gray-900 md:text-3xl">Content Board</h1>
		<p class="text-sm text-gray-600 md:text-base">Manage blog posts and content workflow</p>
	</div>

	<!-- Content Type Selector -->
	<div class="mb-4">
		<div class="flex flex-wrap gap-2">
			{#each contentTypes as type}
				<button
					class="rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 md:px-4 md:text-base {activeSelection ===
					type
						? 'bg-blue-600 text-white shadow-md'
						: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}"
					onclick={() => (activeSelection = type)}
				>
					{type.charAt(0).toUpperCase() + type.slice(1)}
					<span
						class="ml-1.5 rounded-full px-1.5 py-0.5 text-xs md:ml-2 md:px-2 {activeSelection ===
						type
							? 'bg-blue-500 text-blue-100'
							: 'bg-gray-200 text-gray-600'}"
					>
						{getContentData(type).length || 0}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Controls -->
	<div class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
		<div class="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
			<!-- Search -->
			<div class="w-full md:min-w-64 md:max-w-md md:flex-1">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search content..."
					class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				/>
			</div>

			<!-- Sort & View Controls -->
			<div class="flex flex-wrap items-center gap-2">
				<select
					bind:value={sortBy}
					class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				>
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
					class="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					onclick={() => (sortOrder = sortOrder === 'asc' ? 'desc' : 'asc')}
					title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
				>
					{sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
				</button>

				<!-- View Mode Toggle -->
				<div class="ml-2 flex overflow-hidden rounded-lg border border-gray-300">
					<button
						class="px-3 py-2 text-sm transition-colors {viewMode === 'board'
							? 'bg-blue-600 text-white'
							: 'bg-white text-gray-700 hover:bg-gray-50'}"
						onclick={() => (viewMode = 'board')}
						title="Board view"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
							/>
						</svg>
					</button>
					<button
						class="px-3 py-2 text-sm transition-colors {viewMode === 'list'
							? 'bg-blue-600 text-white'
							: 'bg-white text-gray-700 hover:bg-gray-50'}"
						onclick={() => (viewMode = 'list')}
						title="List view"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>

				{#if hasActiveFilters}
					<button
						class="ml-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
						onclick={clearFilters}
					>
						Clear filters
					</button>
				{/if}
			</div>
		</div>

		<!-- People-specific Filters -->
		{#if activeSelection === 'people'}
			<div class="mt-4 border-t border-gray-100 pt-4">
				<div class="flex flex-wrap items-center gap-3">
					<div class="flex items-center gap-2">
						<label class="text-xs font-medium text-gray-600">Enneagram:</label>
						<select
							bind:value={selectedEnneagramType}
							class="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
						>
							<option value="">All</option>
							{#each uniqueEnneagramTypes as type}
								<option value={type}>Type {type}</option>
							{/each}
						</select>
					</div>

					<div class="flex items-center gap-2">
						<label class="text-xs font-medium text-gray-600">Author:</label>
						<select
							bind:value={selectedAuthor}
							class="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
						>
							<option value="">All</option>
							{#each uniqueAuthors as author}
								<option value={author}>{author}</option>
							{/each}
						</select>
					</div>

					<div class="flex items-center gap-2">
						<label class="text-xs font-medium text-gray-600">Category:</label>
						<select
							bind:value={selectedType}
							class="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
						>
							<option value="">All</option>
							{#each uniqueTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>

					<label class="flex cursor-pointer items-center gap-1.5 text-sm">
						<input
							type="checkbox"
							bind:checked={showSocialMediaOnly}
							class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-600">Has social</span>
					</label>

					<label class="flex cursor-pointer items-center gap-1.5 text-sm">
						<input
							type="checkbox"
							bind:checked={filterUnpublished}
							class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-600">Published only</span>
					</label>
				</div>
			</div>
		{:else}
			<div class="mt-4 border-t border-gray-100 pt-4">
				<label class="flex cursor-pointer items-center gap-1.5 text-sm">
					<input
						type="checkbox"
						bind:checked={filterUnpublished}
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<span class="text-gray-600">Published only</span>
				</label>
			</div>
		{/if}

		<!-- Results Summary -->
		<div class="mt-3 text-xs text-gray-500">
			Showing {filteredData.length} of {currentContentData.length || 0} items
		</div>
	</div>

	<!-- Kanban Board View -->
	{#if viewMode === 'board'}
		<div class="kanban-container">
			<div class="kanban-board" class:cursor-grabbing={isDragging}>
				{#each stages as stage, stageIndex}
					<div
						class="kanban-column {stageColors[
							stageIndex
						]} rounded-lg border-t-4 transition-all duration-200 {isDragging
							? 'ring-1 ring-blue-200'
							: ''}"
						ondragover={(event) => dragOver(event, stageIndex)}
						ondragleave={dragLeave}
						ondrop={async (event) => await drop(event, stageIndex, activeSelection)}
						role="region"
						aria-labelledby={`stage-${stageIndex}-heading`}
					>
						<div class="sticky top-0 z-10 bg-inherit px-2 py-1.5">
							<div class="flex items-center justify-between gap-1">
								<h2
									id={`stage-${stageIndex}-heading`}
									class="truncate text-[11px] font-semibold leading-tight text-gray-600"
									title={stage}
								>
									{stage}
								</h2>
								<span
									class="flex-shrink-0 rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-500"
								>
									{stageCounts[stageIndex]}
								</span>
							</div>
						</div>

						<div class="kanban-cards space-y-1.5 p-2 pt-0">
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
								<div
									class="flex items-center justify-center rounded border border-dashed border-gray-200 bg-white/50 p-3 text-center"
								>
									<p class="text-[10px] text-gray-400">Empty</p>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<!-- List View -->
		<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
			<table class="w-full text-sm">
				<thead class="border-b border-gray-200 bg-gray-50">
					<tr>
						<th class="px-4 py-3 text-left font-medium text-gray-600">Title</th>
						<th class="hidden px-4 py-3 text-left font-medium text-gray-600 md:table-cell">Stage</th
						>
						<th class="hidden px-4 py-3 text-left font-medium text-gray-600 sm:table-cell"
							>Status</th
						>
						<th class="hidden px-4 py-3 text-left font-medium text-gray-600 lg:table-cell"
							>Modified</th
						>
						<th class="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each filteredData as blog, index (`list-${index}-${blog.loc || blog.title}`)}
						<tr
							class="cursor-pointer hover:bg-gray-50"
							onclick={() => openModal(blog)}
							onkeydown={(e) => e.key === 'Enter' && openModal(blog)}
							tabindex="0"
							role="button"
						>
							<td class="px-4 py-3">
								<div class="line-clamp-1 font-medium text-gray-900">{blog.title}</div>
								{#if activeSelection === 'people' && blog.person}
									<div class="mt-0.5 text-xs text-gray-500">{blog.person?.replace(/-/g, ' ')}</div>
								{/if}
							</td>
							<td class="hidden px-4 py-3 md:table-cell">
								<span
									class="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
								>
									{stages[blog.stage]}
								</span>
							</td>
							<td class="hidden px-4 py-3 sm:table-cell">
								<span
									class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium {blog.published
										? 'bg-green-100 text-green-700'
										: 'bg-amber-100 text-amber-700'}"
								>
									{blog.published ? 'Published' : 'Draft'}
								</span>
							</td>
							<td class="hidden px-4 py-3 text-gray-500 lg:table-cell">
								{new Date(blog.lastmod).toLocaleDateString()}
							</td>
							<td class="px-4 py-3 text-right">
								{#if blog.published && blog.loc}
									<a
										href={blog.loc.replace('https://9takes.com', '')}
										class="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
										onclick={(e) => e.stopPropagation()}
									>
										View
										<svg class="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
										class="text-xs font-medium text-blue-600 hover:text-blue-800"
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
	.kanban-container {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 0.5rem;
	}

	.kanban-board {
		display: grid;
		grid-template-columns: repeat(9, 160px);
		gap: 0.5rem;
		min-width: max-content;
	}

	@media (min-width: 1600px) {
		.kanban-board {
			grid-template-columns: repeat(9, minmax(160px, 180px));
		}
	}

	.kanban-column {
		min-height: 250px;
		max-height: calc(100vh - 260px);
		display: flex;
		flex-direction: column;
	}

	.kanban-cards {
		flex: 1;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: #cbd5e1 transparent;
	}

	.kanban-cards::-webkit-scrollbar {
		width: 3px;
	}

	.kanban-cards::-webkit-scrollbar-track {
		background: transparent;
	}

	.kanban-cards::-webkit-scrollbar-thumb {
		background-color: #cbd5e1;
		border-radius: 3px;
	}

	/* Line clamp utility */
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Drag over styles */
	:global(.drag-over) {
		background-color: #dbeafe !important;
		box-shadow: inset 0 0 0 2px #3b82f6;
	}

	:global(.dragging) {
		opacity: 0.6;
		transform: rotate(3deg);
	}
</style>

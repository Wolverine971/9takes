<!-- src/routes/admin/content-board/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { fade, slide } from 'svelte/transition';
	import ContentCard from '$lib/components/content/contentCard.svelte';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: PageData;

	let expandedBlogTitle: string | null = null;
	let activeSelection = 'enneagram';
	let isDragging = false;
	let draggedBlog: App.BlogPost | null = null;
	let searchQuery = '';
	let filterUnpublished = false;
	let viewMode: 'board' | 'list' = 'board';

	// Enhanced filtering for people
	let selectedEnneagramType = '';
	let selectedAuthor = '';
	let selectedType = '';
	let sortBy = 'lastmod';
	let sortOrder: 'asc' | 'desc' = 'desc';
	let showSocialMediaOnly = false;

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

	// Process each blog post and assign correct stage
	$: {
		contentTypes.forEach((type) => {
			if (data[type]) {
				data[type].forEach((blog) => {
					if (!blog.published) {
						// Unpublished content can only be "Not written" or "Prioritized"
						if (blog.stageName === 'Prioritized') {
							blog.stage = 1;
						} else {
							blog.stage = 0;
						}
					} else {
						// Map stage names to indices for published content
						const stageIndex = stages.indexOf(blog.stageName);
						// Published content should be at least "Written" (stage 2)
						blog.stage = stageIndex >= 2 ? stageIndex : 2;
					}
				});
			}
		});
	}

	// Get unique values for filters
	$: uniqueEnneagramTypes =
		activeSelection === 'people' && data[activeSelection]
			? [...new Set(data[activeSelection].map((item) => item.enneagram).filter(Boolean))].sort()
			: [];

	$: uniqueAuthors =
		activeSelection === 'people' && data[activeSelection]
			? [...new Set(data[activeSelection].map((item) => item.author).filter(Boolean))].sort()
			: [];

	$: uniqueTypes =
		activeSelection === 'people' && data[activeSelection]
			? [
					...new Set(
						data[activeSelection]
							.map((item) => {
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
				].sort()
			: [];

	// Filtered data based on search query and filters
	$: filteredData =
		activeSelection && data[activeSelection]
			? data[activeSelection]
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
							matchesEnneagramType =
								!selectedEnneagramType || blog.enneagram === selectedEnneagramType;
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
					})
			: [];

	function expand(blog: App.BlogPost) {
		expandedBlogTitle = expandedBlogTitle === blog.title ? null : blog.title;
	}

	// Validate if a stage transition is valid
	function isValidTransition(blog: App.BlogPost, targetStage: number): { valid: boolean; reason: string } {
		// Unpublished content can only be in "Not written" (0) or "Prioritized" (1)
		if (!blog.published && targetStage > 1) {
			return {
				valid: false,
				reason: `Cannot move unpublished content to "${stages[targetStage]}". Publish the content first.`
			};
		}

		// Published content shouldn't go back to "Not written" or "Prioritized"
		if (blog.published && targetStage < 2) {
			return {
				valid: false,
				reason: `Published content cannot be moved to "${stages[targetStage]}". It should stay in "Written" or later stages.`
			};
		}

		return { valid: true, reason: '' };
	}

	function dragStart(event: DragEvent, blog: App.BlogPost) {
		isDragging = true;
		draggedBlog = blog;
		event.dataTransfer?.setData('text/plain', blog.title);
		event.dataTransfer!.effectAllowed = 'move';
		const element = event.currentTarget as HTMLElement;
		element.classList.add('dragging');
	}

	function dragEnd(event: DragEvent) {
		isDragging = false;
		draggedBlog = null;
		const element = event.currentTarget as HTMLElement;
		element.classList.remove('dragging');
	}

	function dragOver(event: DragEvent, stageIndex: number) {
		event.preventDefault();

		// Check if the drop would be valid
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
		if (!blogTitle || !data[blogType]) return;

		const blogIndex = data[blogType].findIndex((b: App.BlogPost) => b.title === blogTitle);
		if (blogIndex === -1 || data[blogType][blogIndex].stage === stageIndex) return;

		const blog = data[blogType][blogIndex];
		const oldStage = blog.stage;

		// Validate the transition
		const validation = isValidTransition(blog, stageIndex);
		if (!validation.valid) {
			notifications.warning(validation.reason, 4000);
			return;
		}

		blog.stage = stageIndex;
		blog.stageName = stages[stageIndex];

		// Trigger reactivity
		data[blogType] = [...data[blogType]];

		try {
			await updateStage(blog, blogType);
			notifications.success(`Moved "${blog.title}" to ${stages[stageIndex]}`, 3000);
		} catch (error) {
			// Reset on error
			blog.stage = oldStage;
			blog.stageName = stages[oldStage];
			data[blogType] = [...data[blogType]];
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

	// Count blogs in each stage for the current content type
	$: stageCounts = stages.map((_, stageIndex) => {
		return filteredData.filter((blog: App.BlogPost) => blog.stage === stageIndex).length;
	});

	// Reset filters when switching content types
	$: if (activeSelection !== 'people') {
		selectedEnneagramType = '';
		selectedAuthor = '';
		selectedType = '';
		showSocialMediaOnly = false;
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

	// Check if any filters are active
	$: hasActiveFilters =
		searchQuery ||
		selectedEnneagramType ||
		selectedAuthor ||
		selectedType ||
		showSocialMediaOnly ||
		filterUnpublished ||
		sortBy !== 'lastmod' ||
		sortOrder !== 'desc';
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
					on:click={() => (activeSelection = type)}
				>
					{type.charAt(0).toUpperCase() + type.slice(1)}
					<span
						class="ml-1.5 rounded-full px-1.5 py-0.5 text-xs md:ml-2 md:px-2 {activeSelection ===
						type
							? 'bg-blue-500 text-blue-100'
							: 'bg-gray-200 text-gray-600'}"
					>
						{data[type]?.length || 0}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Controls -->
	<div class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
		<div class="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
			<!-- Search -->
			<div class="w-full md:min-w-64 md:flex-1 md:max-w-md">
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
					on:click={() => (sortOrder = sortOrder === 'asc' ? 'desc' : 'asc')}
					title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
				>
					{sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
				</button>

				<!-- View Mode Toggle -->
				<div class="ml-2 flex rounded-lg border border-gray-300 overflow-hidden">
					<button
						class="px-3 py-2 text-sm transition-colors {viewMode === 'board'
							? 'bg-blue-600 text-white'
							: 'bg-white text-gray-700 hover:bg-gray-50'}"
						on:click={() => (viewMode = 'board')}
						title="Board view"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
						</svg>
					</button>
					<button
						class="px-3 py-2 text-sm transition-colors {viewMode === 'list'
							? 'bg-blue-600 text-white'
							: 'bg-white text-gray-700 hover:bg-gray-50'}"
						on:click={() => (viewMode = 'list')}
						title="List view"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>

				{#if hasActiveFilters}
					<button
						class="ml-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
						on:click={clearFilters}
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

					<label class="flex items-center gap-1.5 text-sm cursor-pointer">
						<input
							type="checkbox"
							bind:checked={showSocialMediaOnly}
							class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-600">Has social</span>
					</label>

					<label class="flex items-center gap-1.5 text-sm cursor-pointer">
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
				<label class="flex items-center gap-1.5 text-sm cursor-pointer">
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
			Showing {filteredData.length} of {data[activeSelection]?.length || 0} items
		</div>
	</div>

	<!-- Kanban Board View -->
	{#if viewMode === 'board'}
		<div class="kanban-container">
			<div class="kanban-board" class:cursor-grabbing={isDragging}>
				{#each stages as stage, stageIndex}
					<div
						class="kanban-column {stageColors[stageIndex]} border-t-4 rounded-lg transition-all duration-200 {isDragging
							? 'ring-1 ring-blue-200'
							: ''}"
						on:dragover={(event) => dragOver(event, stageIndex)}
						on:dragleave={dragLeave}
						on:drop={async (event) => await drop(event, stageIndex, activeSelection)}
						role="region"
						aria-labelledby={`stage-${stageIndex}-heading`}
					>
						<div class="sticky top-0 z-10 bg-inherit p-3 pb-2">
							<div class="flex items-center justify-between">
								<h2
									id={`stage-${stageIndex}-heading`}
									class="text-sm font-semibold text-gray-700 truncate"
									title={stage}
								>
									{stage}
								</h2>
								<span
									class="ml-2 flex-shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-600 shadow-sm"
								>
									{stageCounts[stageIndex]}
								</span>
							</div>
						</div>

						<div class="kanban-cards space-y-2 p-3 pt-0">
							{#each filteredData.filter((blog) => blog.stage === stageIndex) as blog, index (blog.title)}
								{#if blog.title}
									<div
										class="content-card group rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md {expandedBlogTitle ===
										blog.title
											? 'ring-2 ring-blue-400'
											: ''}"
										class:is-dragging={isDragging && draggedBlog?.title === blog.title}
										draggable={expandedBlogTitle !== blog.title}
										on:dragstart={(event) => dragStart(event, blog)}
										on:dragend={dragEnd}
										role="article"
										aria-labelledby={`blog-title-${stageIndex}-${index}`}
										transition:fade={{ duration: 150 }}
									>
										<!-- Card Header with Drag Handle -->
										<div class="flex items-start gap-2 p-3 pb-2">
											<!-- Drag Handle -->
											<div
												class="drag-handle flex-shrink-0 mt-0.5 cursor-grab text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
												title="Drag to move"
											>
												<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
													<circle cx="9" cy="5" r="1.5" />
													<circle cx="15" cy="5" r="1.5" />
													<circle cx="9" cy="12" r="1.5" />
													<circle cx="15" cy="12" r="1.5" />
													<circle cx="9" cy="19" r="1.5" />
													<circle cx="15" cy="19" r="1.5" />
												</svg>
											</div>

											<!-- Content -->
											<div class="flex-1 min-w-0">
												<h3
													id={`blog-title-${stageIndex}-${index}`}
													class="text-sm font-medium text-gray-900 leading-snug line-clamp-2"
													title={blog.title}
												>
													{blog.title}
												</h3>

												<!-- Status Badge -->
												<div class="mt-1.5 flex flex-wrap items-center gap-1.5">
													<span
														class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium {blog.published
															? 'bg-green-100 text-green-700'
															: 'bg-amber-100 text-amber-700'}"
													>
														{blog.published ? 'Published' : 'Draft'}
													</span>

													{#if activeSelection === 'people' && blog.enneagram}
														<span
															class="inline-flex items-center rounded bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700"
														>
															Type {blog.enneagram}
														</span>
													{/if}
												</div>

												<!-- Date -->
												<div class="mt-1.5 text-xs text-gray-400">
													{new Date(blog.lastmod).toLocaleDateString()}
												</div>
											</div>

											<!-- Expand Button -->
											<button
												type="button"
												class="flex-shrink-0 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
												on:click={() => expand(blog)}
												aria-expanded={expandedBlogTitle === blog.title}
												aria-label={expandedBlogTitle === blog.title
													? 'Collapse details'
													: 'Expand details'}
											>
												<svg
													class="w-4 h-4 transition-transform duration-200 {expandedBlogTitle ===
													blog.title
														? 'rotate-180'
														: ''}"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</button>
										</div>

										<!-- People-specific tags -->
										{#if activeSelection === 'people' && (blog.person || blog.type)}
											<div class="px-3 pb-2">
												<div class="flex flex-wrap gap-1">
													{#if blog.person}
														<span
															class="inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600"
														>
															{blog.person}
														</span>
													{/if}
													{#if blog.type}
														{#each Array.isArray(blog.type) ? blog.type.slice(0, 2) : typeof blog.type === 'string' ? (() => {
																			try {
																				return JSON.parse(blog.type).slice(0, 2);
																			} catch {
																				return [blog.type];
																			}
																		})() : [] as typeItem}
															<span
																class="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
															>
																{typeItem}
															</span>
														{/each}
													{/if}
												</div>
											</div>
										{/if}

										<!-- Expanded Content -->
										{#if expandedBlogTitle === blog.title}
											<div
												class="border-t border-gray-100"
												transition:slide={{ duration: 200 }}
											>
												<ContentCard
													blogContent={blog}
													stage={stages[stageIndex]}
													contentType={activeSelection}
												/>
											</div>
										{/if}
									</div>
								{/if}
							{:else}
								<div
									class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white/50 p-6 text-center"
								>
									<svg
										class="w-8 h-8 text-gray-300 mb-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.5"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<p class="text-xs text-gray-400">No content</p>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<!-- List View -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<table class="w-full text-sm">
				<thead class="bg-gray-50 border-b border-gray-200">
					<tr>
						<th class="text-left px-4 py-3 font-medium text-gray-600">Title</th>
						<th class="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Stage</th>
						<th class="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Status</th>
						<th class="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Modified</th>
						<th class="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each filteredData as blog}
						<tr class="hover:bg-gray-50">
							<td class="px-4 py-3">
								<div class="font-medium text-gray-900 line-clamp-1">{blog.title}</div>
								{#if activeSelection === 'people' && blog.person}
									<div class="text-xs text-gray-500 mt-0.5">{blog.person}</div>
								{/if}
							</td>
							<td class="px-4 py-3 hidden md:table-cell">
								<span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
									{stages[blog.stage]}
								</span>
							</td>
							<td class="px-4 py-3 hidden sm:table-cell">
								<span
									class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium {blog.published
										? 'bg-green-100 text-green-700'
										: 'bg-amber-100 text-amber-700'}"
								>
									{blog.published ? 'Published' : 'Draft'}
								</span>
							</td>
							<td class="px-4 py-3 text-gray-500 hidden lg:table-cell">
								{new Date(blog.lastmod).toLocaleDateString()}
							</td>
							<td class="px-4 py-3 text-right">
								{#if blog.published && blog.loc}
									<a
										href={blog.loc.replace('https://9takes.com', '')}
										class="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium"
									>
										View
										<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
									</a>
								{:else}
									<span class="text-xs text-gray-400">—</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.kanban-container {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 1rem;
	}

	.kanban-board {
		display: grid;
		grid-template-columns: repeat(9, minmax(220px, 1fr));
		gap: 0.75rem;
		min-width: max-content;
	}

	@media (max-width: 1280px) {
		.kanban-board {
			grid-template-columns: repeat(9, 240px);
		}
	}

	.kanban-column {
		min-height: 300px;
		max-height: calc(100vh - 280px);
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
		width: 4px;
	}

	.kanban-cards::-webkit-scrollbar-track {
		background: transparent;
	}

	.kanban-cards::-webkit-scrollbar-thumb {
		background-color: #cbd5e1;
		border-radius: 4px;
	}

	.content-card {
		cursor: default;
	}

	.content-card[draggable='true'] {
		cursor: grab;
	}

	.content-card[draggable='true']:active {
		cursor: grabbing;
	}

	.content-card.is-dragging {
		opacity: 0.5;
		transform: rotate(2deg);
	}

	.drag-handle {
		cursor: grab;
	}

	.drag-handle:active {
		cursor: grabbing;
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

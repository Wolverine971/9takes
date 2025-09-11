<!-- src/routes/admin/content-board/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { fade, slide } from 'svelte/transition';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import ContentCard from '$lib/components/content/contentCard.svelte';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: PageData;

	let expandedBlogTitle: string | null = null;
	let activeSelection = 'enneagram';
	let isDragging = false;
	let searchQuery = '';
	let filterUnpublished = false;

	// Enhanced filtering for people
	let selectedEnneagramType = '';
	let selectedAuthor = '';
	let selectedType = '';
	let sortBy = 'lastmod';
	let sortOrder = 'desc';
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

	// Process each blog post and assign correct stage
	$: {
		contentTypes.forEach((type) => {
			if (data[type]) {
				data[type].forEach((blog) => {
					if (!blog.published) {
						blog.stage = blog.stageName === 'Prioritized' ? 1 : 0;
					} else {
						// Map stage names to indices
						const stageIndex = stages.indexOf(blog.stageName);
						blog.stage = stageIndex > 0 ? stageIndex : 2; // Default to "Written" if not found
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
								// Handle JSONB array - extract all values from the array
								if (Array.isArray(item.type)) {
									return item.type;
								} else if (typeof item.type === 'string') {
									// Handle case where it might be a string
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

						// People-specific filters
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

							// Handle type filtering (JSONB array)
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
						let aValue, bValue;

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
								// Handle JSONB array sorting - use first type value for sorting
								const getFirstType = (item) => {
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

	function expand(blog) {
		expandedBlogTitle = expandedBlogTitle === blog.title ? null : blog.title;
	}

	function dragStart(event: DragEvent, blog) {
		isDragging = true;
		event.dataTransfer?.setData('text/plain', blog.title);
		// Add a class to the element being dragged for visual feedback
		const element = event.currentTarget as HTMLElement;
		element.classList.add('dragging');
	}

	function dragEnd(event: DragEvent) {
		isDragging = false;
		// Remove the dragging class
		const element = event.currentTarget as HTMLElement;
		element.classList.remove('dragging');
	}

	function dragOver(event: DragEvent, stageIndex: number) {
		event.preventDefault();
		// Add visual feedback for the drop target
		const element = event.currentTarget as HTMLElement;
		element.classList.add('drag-over');
	}

	function dragLeave(event: DragEvent) {
		// Remove visual feedback when leaving drop target
		const element = event.currentTarget as HTMLElement;
		element.classList.remove('drag-over');
	}

	async function drop(event: DragEvent, stageIndex: number, blogType: string) {
		event.preventDefault();
		// Remove visual feedback
		const element = event.currentTarget as HTMLElement;
		element.classList.remove('drag-over');

		const blogTitle = event.dataTransfer?.getData('text/plain');
		if (!blogTitle || !data[blogType]) return;

		const blogIndex = data[blogType].findIndex((b) => b.title === blogTitle);
		if (blogIndex === -1 || data[blogType][blogIndex].stage === stageIndex) return;

		const blog = data[blogType][blogIndex];
		const oldStage = blog.stage;
		blog.stage = stageIndex;
		blog.stageName = stages[stageIndex];

		// Validation rules
		if (!blog.published && stageIndex > 1) {
			// Reset to previous stage
			blog.stage = oldStage;
			blog.stageName = stages[oldStage];
			notifications.warning('Cannot move unpublished content beyond Prioritized stage', 3000);
			return;
		}

		// Create a new array to trigger reactivity
		data[blogType] = [...data[blogType]];

		try {
			await updateStage(blog, blogType);
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
		body.append('description', blog.description);
		body.append('author', blog.author);
		body.append('date', blog.date);
		body.append('loc', blog.loc);
		body.append('lastmod', blog.lastmod);
		body.append('published', blog.published.toString());
		body.append('type', blog?.type?.toString() || '');
		body.append('stageName', blog.stageName);

		try {
			const response = await fetch(`/content-board?/updateStage`, { method: 'POST', body });
			const { data: responseData, error } = await response.json();

			if (responseData) {
				notifications.success('Content stage updated successfully', 3000);
			} else {
				throw new Error(error || 'Unknown error');
			}
		} catch (error) {
			console.error('Error updating content stage:', error);
			notifications.error('Failed to update content stage', 3000);
			throw error;
		}
	}

	// Count blogs in each stage for the current content type
	$: stageCounts = stages.map((_, stageIndex) => {
		return filteredData.filter((blog) => blog.stage === stageIndex).length;
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
</script>

<div class="min-h-screen bg-gray-50 p-4">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold text-gray-900">Content Board</h1>
		<p class="text-gray-600">Manage blog posts and content creation</p>
	</div>

	<!-- Content Type Selector -->
	<div class="mb-6">
		<div class="flex flex-wrap gap-2">
			{#each contentTypes as type}
				<button
					class="rounded-lg px-4 py-2 font-medium transition-all duration-200 {activeSelection ===
					type
						? 'bg-blue-600 text-white shadow-md'
						: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}"
					on:click={() => (activeSelection = type)}
				>
					{type.charAt(0).toUpperCase() + type.slice(1)}
					<span
						class="ml-2 rounded-full px-2 py-1 text-xs {activeSelection === type
							? 'bg-blue-500 text-blue-100'
							: 'bg-gray-200 text-gray-600'}"
					>
						{data[type]?.length || 0}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Enhanced Controls -->
	<div class="mb-6 rounded-lg border border-gray-200 bg-white p-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<!-- Search -->
			<div class="min-w-64 flex-1">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search content..."
					class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<!-- Sort Controls -->
			<div class="flex items-center gap-2">
				<select
					bind:value={sortBy}
					class="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
					class="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
					on:click={() => (sortOrder = sortOrder === 'asc' ? 'desc' : 'asc')}
				>
					{sortOrder === 'asc' ? '↑' : '↓'}
				</button>
			</div>

			<!-- Clear Filters -->
			<button class="px-4 py-2 text-gray-600 underline hover:text-gray-800" on:click={clearFilters}>
				Clear All
			</button>
		</div>

		<!-- Enhanced People Filters -->
		{#if activeSelection === 'people'}
			<div class="mt-4 border-t border-gray-200 pt-4">
				<div class="flex flex-wrap items-center gap-4">
					<!-- Enneagram Type Filter -->
					<div class="flex items-center gap-2">
						<label class="text-sm font-medium text-gray-700">Type:</label>
						<select
							bind:value={selectedEnneagramType}
							class="rounded border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Types</option>
							{#each uniqueEnneagramTypes as type}
								<option value={type}>Type {type}</option>
							{/each}
						</select>
					</div>

					<!-- Author Filter -->
					<div class="flex items-center gap-2">
						<label class="text-sm font-medium text-gray-700">Author:</label>
						<select
							bind:value={selectedAuthor}
							class="rounded border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Authors</option>
							{#each uniqueAuthors as author}
								<option value={author}>{author}</option>
							{/each}
						</select>
					</div>

					<!-- Type Filter -->
					<div class="flex items-center gap-2">
						<label class="text-sm font-medium text-gray-700">Type:</label>
						<select
							bind:value={selectedType}
							class="rounded border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Types</option>
							{#each uniqueTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</div>

					<!-- Checkboxes -->
					<label class="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							bind:checked={showSocialMediaOnly}
							class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-700">Has Social Media</span>
					</label>

					<label class="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							bind:checked={filterUnpublished}
							class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-700">Published Only</span>
					</label>
				</div>
			</div>
		{:else}
			<div class="mt-4 border-t border-gray-200 pt-4">
				<label class="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						bind:checked={filterUnpublished}
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<span class="text-gray-700">Published Only</span>
				</label>
			</div>
		{/if}

		<!-- Results Summary -->
		<div class="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600">
			Showing {filteredData.length} of {data[activeSelection]?.length || 0} items
		</div>
	</div>

	<!-- Kanban Board -->
	<div class="overflow-x-auto">
		<div class="flex min-w-max gap-4 pb-4" class:cursor-grabbing={isDragging}>
			{#each stages as stage, stageIndex}
				<div
					class="w-80 rounded-lg bg-gray-100 p-4 transition-all duration-200 hover:bg-gray-200 {isDragging
						? 'ring-2 ring-blue-300'
						: ''}"
					on:dragover={(event) => dragOver(event, stageIndex)}
					on:dragleave={dragLeave}
					on:drop={async (event) => await drop(event, stageIndex, activeSelection)}
					role="region"
					aria-labelledby={`stage-${stageIndex}-heading`}
				>
					<div class="mb-4 flex items-center justify-between">
						<h2 id={`stage-${stageIndex}-heading`} class="font-semibold text-gray-800">{stage}</h2>
						<span class="rounded-full bg-gray-300 px-2 py-1 text-sm text-gray-700"
							>{stageCounts[stageIndex]}</span
						>
					</div>

					<div class="max-h-96 space-y-3 overflow-y-auto">
						{#each filteredData.filter((blog) => blog.stage === stageIndex) as blog, index}
							{#if blog.title}
								<div
									class="rounded-lg border-l-4 bg-white {blog.published
										? 'border-green-500'
										: 'border-yellow-500'} cursor-grab p-4 shadow-sm transition-all duration-200 hover:shadow-md {expandedBlogTitle ===
									blog.title
										? 'ring-2 ring-blue-300'
										: ''}"
									class:cursor-grabbing={isDragging}
									draggable={expandedBlogTitle !== blog.title}
									on:dragstart={(event) => dragStart(event, blog)}
									on:dragend={dragEnd}
									role="article"
									aria-labelledby={`blog-title-${stageIndex}-${index}`}
									transition:fade={{ duration: 100 }}
								>
									<div class="flex items-start justify-between">
										<div class="flex-1">
											<h3
												id={`blog-title-${stageIndex}-${index}`}
												class="mb-1 text-sm font-medium text-gray-900"
											>
												{blog.title}
											</h3>

											<!-- People-specific info -->
											{#if activeSelection === 'people'}
												<div class="mb-2 flex flex-wrap gap-1">
													{#if blog.person}
														<span class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
															>{blog.person}</span
														>
													{/if}
													{#if blog.enneagram}
														<span class="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800"
															>Type {blog.enneagram}</span
														>
													{/if}
													{#if blog.type}
														{#each Array.isArray(blog.type) ? blog.type : typeof blog.type === 'string' ? (() => {
																		try {
																			return JSON.parse(blog.type);
																		} catch {
																			return [blog.type];
																		}
																	})() : [] as typeItem}
															<span class="rounded bg-green-100 px-2 py-1 text-xs text-green-800"
																>{typeItem}</span
															>
														{/each}
													{/if}
												</div>
											{/if}

											<div class="mt-1 text-xs text-gray-500">
												{new Date(blog.lastmod).toLocaleDateString()}
											</div>
										</div>

										<button
											type="button"
											class="ml-2 text-gray-400 hover:text-gray-600"
											on:click={() => expand(blog)}
											aria-expanded={expandedBlogTitle === blog.title}
											aria-controls={`blog-content-${stageIndex}-${index}`}
											aria-label={expandedBlogTitle === blog.title
												? 'Collapse details'
												: 'Expand details'}
										>
											<svelte:component
												this={expandedBlogTitle === blog.title ? DownIcon : RightIcon}
											/>
										</button>
									</div>

									{#if expandedBlogTitle === blog.title}
										<div
											id={`blog-content-${stageIndex}-${index}`}
											class="mt-3 border-t border-gray-200 pt-3"
											transition:slide={{ duration: 200 }}
										>
											<ContentCard blogContent={blog} {stage} contentType={activeSelection} />
										</div>
									{/if}
								</div>
							{/if}
						{:else}
							<div
								class="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
							>
								<p>No content in this stage</p>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Custom drag-over styles */
	:global(.drag-over) {
		@apply bg-blue-100 ring-2 ring-blue-500;
	}
</style>

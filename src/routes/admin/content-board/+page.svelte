<!-- routes/content-board/+page.svelte -->
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

	// Filtered data based on search query
	$: filteredData =
		activeSelection && data[activeSelection]
			? data[activeSelection].filter((blog) => {
					const matchesSearch =
						!searchQuery ||
						blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
						blog.description?.toLowerCase().includes(searchQuery.toLowerCase());

					const matchesPublished = !filterUnpublished || blog.published;

					return matchesSearch && matchesPublished;
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
		return activeSelection && data[activeSelection]
			? data[activeSelection].filter((blog) => blog.stage === stageIndex).length
			: 0;
	});
</script>

<div class="content-board-container">
	<div class="page-header">
		<h1>Content Board</h1>
		<p class="subtitle">Manage blog posts and content creation</p>
	</div>

	<div class="content-controls">
		<div class="content-type-selector">
			<select
				bind:value={activeSelection}
				id="content-type-select"
				aria-label="Select content type"
			>
				{#each contentTypes as type}
					<option value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
				{/each}
			</select>
		</div>

		<div class="search-filter">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search content..."
				aria-label="Search content"
			/>
			<label class="filter-checkbox">
				<input type="checkbox" bind:checked={filterUnpublished} />
				<span>Published only</span>
			</label>
		</div>
	</div>

	<h1 class="board-title">
		{activeSelection.charAt(0).toUpperCase() + activeSelection.slice(1)} Content
	</h1>

	<div class="trello-board" class:is-dragging={isDragging}>
		{#each stages as stage, stageIndex}
			<div
				class="stage"
				on:dragover={(event) => dragOver(event, stageIndex)}
				on:dragleave={dragLeave}
				on:drop={async (event) => await drop(event, stageIndex, activeSelection)}
				role="region"
				aria-labelledby={`stage-${stageIndex}-heading`}
			>
				<div class="stage-header">
					<h2 id={`stage-${stageIndex}-heading`}>{stage}</h2>
					<span class="count-badge">{stageCounts[stageIndex]}</span>
				</div>

				{#if activeSelection && data[activeSelection]}
					<div class="stage-content">
						{#each filteredData
							.filter((blog) => blog.stage === stageIndex)
							.sort((a, b) => new Date(b.lastmod) - new Date(a.lastmod)) as blog, index}
							{#if blog.title}
								<div
									class="card"
									class:expanded={expandedBlogTitle === blog.title}
									class:published={blog.published}
									draggable={expandedBlogTitle !== blog.title}
									on:dragstart={(event) => dragStart(event, blog)}
									on:dragend={dragEnd}
									role="article"
									aria-labelledby={`blog-title-${stageIndex}-${index}`}
									transition:fade={{ duration: 100 }}
								>
									<div class="card-header">
										<h3 id={`blog-title-${stageIndex}-${index}`} class="card-title">
											{blog.title}
										</h3>
										<button
											type="button"
											class="toggle-button"
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
											class="card-content"
											transition:slide={{ duration: 200 }}
										>
											<ContentCard blogContent={blog} {stage} />
										</div>
									{/if}
								</div>
							{/if}
						{:else}
							<div class="empty-state">
								<p>No content in this stage</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.content-board-container {
		max-width: max-content;
		display: flex;
		flex-direction: column;
		height: 100%;
		max-width: 100%;
		width: 100%;
		background-color: #f9fafb;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
	}

	.nav-header {
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e5e7eb;

		.nav-links {
			display: flex;
			flex-wrap: wrap;
			gap: 1rem;

			a {
				color: #4b5563;
				text-decoration: none;
				padding: 0.5rem 0.75rem;
				border-radius: 4px;
				transition: all 0.2s ease;

				&:hover {
					background-color: #f3f4f6;
					color: #111827;
				}

				&.active-link {
					color: #4f46e5;
					font-weight: 600;
					background-color: rgba(79, 70, 229, 0.1);
				}
			}
		}
	}

	.content-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;

		.content-type-selector select {
			padding: 0.5rem 1rem;
			border-radius: 4px;
			border: 1px solid #d1d5db;
			background-color: white;
			min-width: 150px;
			cursor: pointer;

			&:focus {
				outline: 2px solid #4f46e5;
				border-color: transparent;
			}
		}

		.search-filter {
			display: flex;
			gap: 1rem;
			align-items: center;
			flex-wrap: wrap;

			input[type='text'] {
				padding: 0.5rem 1rem;
				border-radius: 4px;
				border: 1px solid #d1d5db;
				min-width: 200px;

				&:focus {
					outline: 2px solid #4f46e5;
					border-color: transparent;
				}
			}

			.filter-checkbox {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				cursor: pointer;
				user-select: none;

				input {
					cursor: pointer;
				}
			}
		}
	}

	.board-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #111827;
	}

	.trello-board {
		display: flex;

		gap: 1rem;
		overflow-x: auto;
		padding-bottom: 1rem;
		flex: 1;

		&.is-dragging {
			cursor: grabbing;
		}

		@media (min-width: 768px) {
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		}
	}

	.stage {
		display: flex;
		flex-direction: column;
		min-width: 200px;
		box-sizing: content-box;
		background-color: #f3f4f6;
		border-radius: 6px;
		padding: 1rem;
		min-height: 200px;

		&.drag-over {
			background-color: #e0e7ff;
			box-shadow: 0 0 0 2px #4f46e5;
		}

		.stage-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 1rem;
			padding-bottom: 0.5rem;
			border-bottom: 1px solid #e5e7eb;

			h2 {
				font-size: 1rem;
				font-weight: 600;
				margin: 0;
				color: #4b5563;
			}

			.count-badge {
				background-color: #e5e7eb;
				color: #4b5563;
				font-size: 0.75rem;
				font-weight: 600;
				padding: 0.25rem 0.5rem;
				border-radius: 9999px;
			}
		}

		.stage-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			overflow-y: auto;
			max-height: 70vh;
		}
	}

	.card {
		background-color: white;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
		margin: 0.5rem;
		padding: 0;

		&:hover {
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		}

		&.expanded {
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		}

		&.dragging {
			opacity: 0.7;
			transform: scale(1.05);
			box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
		}

		&.published {
			border-left: 3px solid #10b981;
		}

		&:not(.published) {
			border-left: 3px solid #f59e0b;
		}

		.card-header {
			padding: 0.75rem;
			cursor: grab;

			&:active {
				cursor: grabbing;
			}
		}

		.card-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 0.875rem;
			font-weight: 600;
			margin: 0;
			color: #1f2937;

			.toggle-button {
				background: none;
				border: none;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #6b7280;

				&:hover {
					color: #4f46e5;
				}

				&:focus {
					outline: 2px solid #4f46e5;
					outline-offset: 2px;
				}
			}
		}

		.card-content {
			border-top: 1px solid #f3f4f6;
			padding: 0.75rem;
		}
	}

	.empty-state {
		padding: 1.5rem;
		text-align: center;
		color: #6b7280;
		background-color: #f9fafb;
		border-radius: 4px;
		border: 1px dashed #d1d5db;
	}

	@media (max-width: 768px) {
		.content-controls {
			flex-direction: column;
			align-items: stretch;

			.search-filter {
				flex-direction: column;
				align-items: stretch;
			}
		}

		.nav-header .nav-links {
			justify-content: center;
		}
	}
</style>

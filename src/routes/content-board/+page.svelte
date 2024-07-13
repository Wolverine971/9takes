<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	import ContentCard from '$lib/components/content/contentCard.svelte';
	import { notifications } from '$lib/components/molecules/notifications';

	/** @type {import('./$types').PageData} */
	export let data: PageData;
	let expandedBlogTitle: string | null = null;

	let activeSelection = 'enneagram';

	Object.keys(data).forEach((key) => {
		if (['enneagram', 'community', 'guides', 'people'].includes(key)) {
			// if (blog.stage === 0) {
			data[key].forEach((blog) => {
				if (!blog.published) {
					if (blog.stageName === 'Prioritized') {
						blog.stage = 1;
					} else {
						blog.stage = 0;
					}
				}
				if (blog.published) {
					blog.stage = 2;

					if (blog.stageName === 'Sent out for review') {
						blog.stage = 3;
					}
					if (blog.stageName === 'Reviewed') {
						blog.stage = 4;
					}
					if (blog.stageName === 'Socialized') {
						blog.stage = 5;
					}
					if (blog.stageName === 'Growing') {
						blog.stage = 6;
					}
					if (blog.stageName === 'Needs Work') {
						blog.stage = 7;
					}
				}
			});
		}
	});

	// Define the stages
	const stages = [
		'Not written',
		'Prioritized',
		'Written',
		'Sent out for review',
		'Reviewed',
		'Socialized',
		'Growing',
		'Needs Work'
	];

	const expand = (blog) => {
		expandedBlogTitle = expandedBlogTitle === blog.title ? null : blog.title;
	};

	// Function to handle drag start
	function dragStart(event, blogTitle) {
		event.dataTransfer.setData('text/plain', blogTitle);
	}

	// Function to handle drag over
	function dragOver(event) {
		event.preventDefault();
	}

	// Function to handle drop
	const drop = async (event, stageIndex: number, blogType: string) => {
		event.preventDefault();
		const blogTitle = event.dataTransfer.getData('text/plain');

		// Find the blog in the correct category
		if (data[blogType]) {
			const blogIndex = data[blogType].findIndex((b) => b.title === blogTitle);
			if (blogIndex !== -1) {
				// Update the blog's stage
				if (data[blogType][blogIndex].stage !== stageIndex) {
					data[blogType][blogIndex].stage = stageIndex;

					// Update the blog's properties based on the new stage
					const blog = data[blogType][blogIndex];
					blog.stageName = stages[stageIndex];

					// Trigger reactivity
					data[blogType] = [...data[blogType]];

					await updateStage(blog, blogType);
				}
			}
		}
	};

	const updateStage = async (blog: App.BlogPost, blogType: string) => {
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

		// Send the blog to the server
		const { data, error: updateContentError } = await (
			await fetch(`/content-board?/updateStage`, {
				method: 'POST',
				body
			})
		).json();

		if (data) {
			notifications.info('Content Updated', 3000);
		} else {
			if (updateContentError?.message) {
				notifications.warning('Content Update error', 3000);
			} else {
				notifications.warning('Content Update error', 3000);
			}
		}
	};
</script>

<select bind:value={activeSelection}>
	{#each ['enneagram', 'community', 'guides', 'people'] as type}
		<option value={type}>{type.toLocaleUpperCase()}</option>
	{/each}
</select>

<h2>{activeSelection.toUpperCase()}</h2>
<div class="trello-board ">
	{#each stages as stage, stageIndex}
		<div
			class="stage"
			on:dragover={dragOver}
			on:drop={async (event) => await drop(event, stageIndex, activeSelection)}
			role="list"
			aria-label={`${stage} stage`}
		>
			<h3 style="min-width: 200px; padding:0" id={`stage-${stageIndex}-heading`}>{stage}</h3>
			{#if activeSelection && data[activeSelection]}
				{#each data[activeSelection].filter((blog) => blog.stage === stageIndex) as blog, index}
					{#if blog.title}
						<div
							class="card {expandedBlogTitle === blog.title ? 'expanded' : ''}"
							draggable={expandedBlogTitle !== blog.title}
							on:dragstart={(event) => dragStart(event, blog.title)}
							role="listitem"
							aria-labelledby={`blog-title-${stageIndex}-${index}`}
						>
							<div role="region" aria-labelledby={`blog-title-${stageIndex}-${index}`}>
								<h4 id={`blog-title-${stageIndex}-${index}`} class="card-title">
									{blog.title}
									<button
										type="button"
										class="btn btn-primary"
										style="padding: 0.5rem; display: flex;"
										on:click={() => expand(blog)}
										aria-label={expandedBlogTitle === blog.title ? 'Collapse' : 'Expand'}
									>
										{#if expandedBlogTitle === blog.title}
											<DownIcon />
										{:else}
											<RightIcon />
										{/if}
									</button>
								</h4>
								{#if expandedBlogTitle === blog.title}
									<div
										id={`blog-content-${stageIndex}-${index}`}
										role="region"
										aria-labelledby={`blog-title-${stageIndex}-${index}`}
									>
										<ContentCard blogContent={blog} />
									</div>
								{/if}
							</div>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	{/each}
</div>

<h2>People</h2>
<!-- <div class="trello-board">
	{#each stages as stage, stageIndex}
		<div class="stage" on:dragover={dragOver} on:drop={(event) => drop(event, stageIndex)}>
			<h3>{stage}</h3>
			{#each data.people.filter((blog) => blog.stage === stageIndex) as blog (blog.id)}
				<div
					class="card"
					draggable="true"
					on:dragstart={(event) => dragStart(event, blog.id)}
					on:click={() => openModal(blog)}
				>
					{blog.title}
				</div>
			{/each}
		</div>
	{/each}
</div> -->

<h2>Community</h2>
<!-- <div class="trello-board">
	{#each stages as stage, stageIndex}
		<div class="stage" on:dragover={dragOver} on:drop={(event) => drop(event, stageIndex)}>
			<h3>{stage}</h3>
			{#each data.community.filter((blog) => blog.stage === stageIndex) as blog (blog.id)}
				<div
					class="card"
					draggable="true"
					on:dragstart={(event) => dragStart(event, blog.id)}
					on:click={() => openModal(blog)}
				>
					{blog.title}
				</div>
			{/each}
		</div>
	{/each}
</div> -->

<h2>Guides</h2>

<!-- <div class="trello-board">
	{#each stages as stage, stageIndex}
		<div class="stage" on:dragover={dragOver} on:drop={(event) => drop(event, stageIndex)}>
			<h3>{stage}</h3>
			{#each data.guides.filter((blog) => blog.stage === stageIndex) as blog (blog.id)}
				<div
					class="card"
					draggable="true"
					on:dragstart={(event) => dragStart(event, blog.id)}
					on:click={() => openModal(blog)}
				>
					{blog.title}
				</div>
			{/each}
		</div>
	{/each}
</div> -->
<style lang="scss">
	.card-title {
		display: flex;
		align-items: center;
		gap: 0.2rem;
		padding: 0.2rem;
		margin: 0.2rem;
	}
	.trello-board {
		display: flex;
		gap: 1rem;
		padding: 1rem;
		overflow: auto !important;
		width: 100%;
	}

	.stage {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #f4f5f7;
		border-radius: 5px;
		padding: 1rem;
	}

	.card {
		background-color: white;
		border-radius: 3px;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		width: 100%;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		transition: all 0.3s ease;
	}
	.card details {
		padding: 0.5rem;
	}

	.card summary {
		cursor: pointer;
		font-weight: bold;
	}

	.card summary::-webkit-details-marker {
		display: none;
	}

	.card .panel {
		padding-top: 0.5rem;
	}

	.card details[open] {
		background-color: #f9f9f9;
	}

	.card details[open] summary {
		margin-bottom: 0.5rem;
		border-bottom: 1px solid #ddd;
	}
	.panel {
		background-color: #f4f5f7;
	}
</style>

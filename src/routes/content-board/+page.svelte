<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';
	import ContentCard from '$lib/components/content/contentCard.svelte';
	import { notifications } from '$lib/components/molecules/notifications';

	export let data: PageData;

	let expandedBlogTitle: string | null = null;
	let activeSelection = 'enneagram';

	const contentTypes = ['enneagram', 'community', 'guides', 'people'];
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

	$: {
		contentTypes.forEach((type) => {
			data[type].forEach((blog) => {
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
		});
	}

	function expand(blog) {
		expandedBlogTitle = expandedBlogTitle === blog.title ? null : blog.title;
	}

	function dragStart(event: DragEvent, blogTitle: string) {
		event.dataTransfer?.setData('text/plain', blogTitle);
	}

	function dragOver(event: DragEvent) {
		event.preventDefault();
	}

	async function drop(event: DragEvent, stageIndex: number, blogType: string) {
		event.preventDefault();
		const blogTitle = event.dataTransfer?.getData('text/plain');
		if (!blogTitle || !data[blogType]) return;

		const blogIndex = data[blogType].findIndex((b) => b.title === blogTitle);
		if (blogIndex === -1 || data[blogType][blogIndex].stage === stageIndex) return;

		const blog = data[blogType][blogIndex];
		blog.stage = stageIndex;
		blog.stageName = stages[stageIndex];

		if (!blog.published && blog.stageName !== 'Prioritized' && blog.stageName !== 'Not written') {
			notifications.warning('Blog not published', 3000);
			return;
		}

		data[blogType] = [...data[blogType]];
		await updateStage(blog, blogType);
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
		const response = await fetch(`/content-board?/updateStage`, { method: 'POST', body });
		const { data: responseData, error } = await response.json();

		if (responseData) {
			notifications.info('Content Updated', 3000);
		} else {
			notifications.warning('Content Update error', 3000);
		}
	}
</script>

<select bind:value={activeSelection}>
	{#each contentTypes as type}
		<option value={type}>{type.toUpperCase()}</option>
	{/each}
</select>

<h2>{activeSelection.toUpperCase()}</h2>
<div class="trello-board">
	{#each stages as stage, stageIndex}
		<div
			class="stage"
			on:dragover={dragOver}
			on:drop={async (event) => await drop(event, stageIndex, activeSelection)}
			role="list"
			aria-label={`${stage} stage`}
		>
			<h3 id={`stage-${stageIndex}-heading`}>{stage}</h3>
			{#if activeSelection && data[activeSelection]}
				{#each data[activeSelection].filter((blog) => blog.stage === stageIndex) as blog, index}
					{#if blog.title}
						<div
							class="card"
							class:expanded={expandedBlogTitle === blog.title}
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
										on:click={() => expand(blog)}
										aria-label={expandedBlogTitle === blog.title ? 'Collapse' : 'Expand'}
									>
										<svelte:component
											this={expandedBlogTitle === blog.title ? DownIcon : RightIcon}
										/>
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
		overflow: auto;
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
		h3 {
			min-width: 200px;
			padding: 0;
		}
	}
	.card {
		background-color: white;
		border-radius: 3px;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		width: 100%;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		transition: all 0.3s ease;
		details {
			padding: 0.5rem;
			&[open] {
				background-color: #f9f9f9;
				summary {
					margin-bottom: 0.5rem;
					border-bottom: 1px solid #ddd;
				}
			}
		}
		summary {
			cursor: pointer;
			font-weight: bold;
			&::-webkit-details-marker {
				display: none;
			}
		}
		.panel {
			padding-top: 0.5rem;
			background-color: #f4f5f7;
		}
	}
</style>

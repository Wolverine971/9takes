<!-- lib/components/content/contentCard.svelte -->
<script lang="ts">
	export let blogContent: App.BlogPost = null;
	export let stage = null;

	// Define stages that allow content retrieval
	const stagesContentRetrieval = ['Sent out for review', 'Reviewed', 'Socialized', 'Growing'];

	// Format date function (optional - for cleaner display)
	function formatDate(dateStr) {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString();
	}

	// Handle get info action
	function getInfo() {
		console.log('Get Update for', blogContent.title);
		// Add your update logic here
	}
</script>

<div class="panel">
	{#if blogContent.description}
		<p class="description"><strong>Description</strong>: {blogContent.description}</p>
	{/if}

	<div class="info-row">
		<p><strong>Date</strong>: {formatDate(blogContent.date)}</p>
		<p><strong>Modified</strong>: {formatDate(blogContent.lastmod)}</p>
		{#if blogContent.published !== undefined}
			<p class="status">
				<strong>Status</strong>:
				<span class:published={blogContent.published}>
					{blogContent.published ? 'Published' : 'Draft'}
				</span>
			</p>
		{/if}
	</div>

	<div class="actions">
		{#if blogContent.loc}
			<a href={blogContent.loc.replace('https://9takes.com', '')} class="link-btn">View</a>
		{/if}

		<details>
			<summary class="accordion">More</summary>
			<div class="panel details-panel">
				{#each Object.entries(blogContent) as [key, value]}
					{#if !['title', 'description', 'date', 'lastmod'].includes(key)}
						<p>
							<strong>{key.toLocaleUpperCase()}</strong>: {value}
						</p>
					{/if}
				{/each}
			</div>
		</details>

		{#if stage && stagesContentRetrieval.includes(stage)}
			<button class="btn btn-primary" type="button" on:click={getInfo}>Get Update</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.panel {
		padding: 0.5rem;
		font-size: 0.8125rem;
	}

	p {
		margin: 0;
		margin-bottom: 0.35rem;
		line-height: 1.3;
	}

	.description {
		margin-bottom: 0.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #eee;
	}

	.info-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 0.5rem;

		p {
			margin-bottom: 0;
			white-space: nowrap;
		}
	}

	.status span {
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.75rem;

		&.published {
			background: rgba(0, 128, 0, 0.1);
			color: green;
		}

		&:not(.published) {
			background: rgba(255, 166, 0, 0.1);
			color: orange;
		}
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
		flex-wrap: wrap;
	}

	.link-btn {
		padding: 0.25rem 0.5rem;
		background: #f0f0f0;
		border-radius: 3px;
		text-decoration: none;
		font-size: 0.75rem;
		color: #333;

		&:hover {
			background: #e0e0e0;
		}
	}

	.btn {
		padding: 0.25rem 0.5rem;
		border: none;
		border-radius: 3px;
		font-size: 0.75rem;
		cursor: pointer;
	}

	.btn-primary {
		background: #e6f0ff;
		color: #0066cc;

		&:hover {
			background: #cce0ff;
		}
	}

	.accordion {
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		background: #f5f5f5;
		border-radius: 3px;
		font-size: 0.75rem;

		&:hover {
			background: #e9e9e9;
		}
	}

	.details-panel {
		margin-top: 0.5rem;
		padding: 0.5rem;
		background: #f9f9f9;
		border-radius: 3px;
		max-height: 200px;
		overflow-y: auto;
	}

	@media (max-width: 500px) {
		.info-row {
			flex-direction: column;
			gap: 0.25rem;
		}
	}
</style>

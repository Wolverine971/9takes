<script lang="ts">
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import RightIcon from '$lib/components/icons/rightIcon.svelte';

	export let category: any;
	export let questionTags: any;
	let showChildren = true;
</script>

<div class="category-item">
	<h3 class="category-title">
		{category?.subcategory_name}
		{#if category?.question_subcategories && category?.question_subcategories?.length !== 0}
			<button
				on:click={() => (showChildren = !showChildren)}
				class="toggle-btn"
				aria-label={showChildren ? 'Hide subcategories' : 'Show subcategories'}
			>
				{#if showChildren}
					<DownIcon />
				{:else}
					<RightIcon />
				{/if}
			</button>
		{/if}
	</h3>

	{#if showChildren}
		<div class="category-content">
			{#if category?.question_subcategories && category?.question_subcategories?.length !== 0}
				<div class="subcategory-list">
					{#each category?.question_subcategories as scategory}
						<svelte:self category={scategory} {questionTags} />
					{/each}
				</div>
			{:else if questionTags[category?.id]}
				<div class="question-list">
					{#each questionTags[category?.id] as qCat}
						<a
							href={`/questions/${qCat?.url}`}
							class="question-link"
							style:--tag={`h-question-${qCat?.id}`}
						>
							{qCat?.question_formatted || qCat?.question}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.category-item {
		margin-bottom: 2rem;
		background-color: var(--item-background, #ffffff);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		overflow: hidden;
		transition: all 0.3s ease;

		&:hover {
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		}
	}

	.category-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		margin: 0;
		background-color: var(--title-background, #e0e0e0);
		color: var(--title-color, #333);
		font-size: 1.2rem;
	}

	.toggle-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.3s ease;

		&:hover {
			transform: scale(1.1);
		}
	}

	.category-content {
		padding: 1rem;
	}

	.subcategory-list {
		margin-left: 1rem;
		border-left: 2px solid var(--accent-color, black);
		padding-left: 1rem;
	}

	.question-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
		}
	}

	.question-link {
		display: block;
		padding: 0.8rem;
		background-color: var(--link-background, #f0f0f0);
		color: var(--link-color, #333);
		text-decoration: none;
		border-radius: 4px;
		transition: all 0.3s ease;

		&:hover {
			background-color: var(--link-hover-background, #e0e0e0);
			transform: translateY(-2px);
		}
	}
</style>

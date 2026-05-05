<!-- src/lib/components/molecules/CategoryItem.svelte -->
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
		{#if category?.question_subcategories && category?.question_subcategories?.length}
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
		background-color: var(--item-background, var(--stone-warm));
		border-radius: 8px;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 8%, var(--stone-edge));
		box-shadow: var(--shadow-sm);
		overflow: hidden;
		transition: all 0.3s ease;

		&:hover {
			box-shadow: var(--shadow-md);
		}
	}

	.category-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		margin: 0;
		background-color: var(--title-background, var(--stone-warm));
		color: var(--title-color, var(--ink-bright));
		font-size: 1.2rem;
	}

	.toggle-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: var(--ink-mid);
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
		border-left: 2px solid var(--accent-color, var(--lamp-glow));
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
		background-color: var(--link-background, var(--night-deep));
		color: var(--link-color, var(--ink-bright));
		text-decoration: none;
		border-radius: 4px;
		transition: all 0.3s ease;
		border: 1px solid color-mix(in srgb, var(--ink-dim) 18%, transparent);

		&:hover {
			background-color: var(--link-hover-background, var(--stone-warm));
			transform: translateY(-2px);
			border-color: color-mix(in srgb, var(--lamp-glow) 30%, var(--stone-edge));
		}
	}
</style>

<!-- src/lib/components/questions/CategoryBrowseBranch.svelte -->
<script lang="ts">
	import { buildQuestionCategoryPath } from '$lib/utils/questionCategorySlug';

	type BrowseCategoryNode = {
		id: number;
		category_name: string;
		slug?: string | null;
		parent_id: number | null;
		level: number;
		directQuestionCount: number;
		subtreeQuestionCount: number;
		hasDirectQuestions: boolean;
		children: BrowseCategoryNode[];
	};

	export let category: BrowseCategoryNode;
	export let depth = 0;

	$: hasChildren = category.children.length > 0;

	function getCategoryHref(category: Pick<BrowseCategoryNode, 'slug' | 'category_name'>): string {
		return buildQuestionCategoryPath(category.slug || category.category_name);
	}

	function formatQuestionCount(count: number): string {
		return `${count} question${count === 1 ? '' : 's'}`;
	}
</script>

{#if depth === 0}
	<section class="root-card">
		<div class="root-head">
			<div class="root-copy">
				<p class="root-kicker">Topic Group</p>
				<h2>
					<a href={getCategoryHref(category)} class="root-link">
						{category.category_name}
					</a>
				</h2>
			</div>
			<span class="count-pill">{formatQuestionCount(category.subtreeQuestionCount)}</span>
		</div>

		{#if hasChildren}
			<div class="branch-grid">
				{#each category.children as child (child.id)}
					<svelte:self category={child} depth={depth + 1} />
				{/each}
			</div>
		{/if}
	</section>
{:else if hasChildren}
	<article class="branch-card" class:nested-card={depth > 1}>
		<div class="branch-head">
			<a href={getCategoryHref(category)} class="branch-link">
				{category.category_name}
			</a>
			<span class="count-pill small">{formatQuestionCount(category.subtreeQuestionCount)}</span>
		</div>

		<div class="leaf-list">
			{#each category.children as child (child.id)}
				<svelte:self category={child} depth={depth + 1} />
			{/each}
		</div>
	</article>
{:else}
	<a href={getCategoryHref(category)} class="leaf-link">
		<span>{category.category_name}</span>
		<span class="count-pill small">{formatQuestionCount(category.subtreeQuestionCount)}</span>
	</a>
{/if}

<style lang="scss">
	.root-card {
		padding: 1.15rem;
		border-radius: 1.25rem;
		border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border-color));
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-soft) 34%, transparent) 0%,
				transparent 44%
			),
			color-mix(in srgb, var(--bg-surface) 92%, var(--bg-deep));
		box-shadow: var(--shadow-sm);
	}

	.root-head,
	.branch-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.8rem;
	}

	.root-head {
		margin-bottom: 1rem;
		padding-bottom: 0.85rem;
		border-bottom: 1px solid color-mix(in srgb, var(--accent) 16%, var(--border-color));
	}

	.root-copy,
	.branch-head {
		min-width: 0;
	}

	.root-kicker {
		margin: 0 0 0.35rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-secondary);
	}

	h2 {
		margin: 0;
		font-size: clamp(1.25rem, 2vw, 1.65rem);
		line-height: 1.15;
	}

	.root-link,
	.branch-link,
	.leaf-link {
		text-decoration: none;
	}

	.root-link,
	.branch-link {
		color: var(--text-primary);
	}

	.root-link:hover,
	.branch-link:hover,
	.leaf-link:hover {
		color: var(--primary);
	}

	.branch-grid {
		display: grid;
		gap: 0.9rem;
	}

	.branch-card {
		padding: 0.95rem;
		border-radius: 1rem;
		border: 1px solid color-mix(in srgb, var(--accent) 14%, var(--border-color));
		background: color-mix(in srgb, var(--bg-surface) 90%, var(--bg-base));
	}

	.branch-link {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.nested-card {
		background: color-mix(in srgb, var(--bg-elevated) 86%, var(--bg-base));
	}

	.leaf-list {
		display: grid;
		gap: 0.6rem;
		margin-top: 0.85rem;
	}

	.leaf-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.8rem 0.9rem;
		border-radius: 0.9rem;
		border: 1px solid color-mix(in srgb, var(--accent) 12%, var(--border-color));
		background: color-mix(in srgb, var(--bg-elevated) 84%, var(--bg-base));
		color: var(--text-primary);
		font-weight: 600;
		transition:
			transform 0.18s ease,
			border-color 0.18s ease,
			box-shadow 0.18s ease,
			color 0.18s ease;
	}

	.leaf-link:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--primary) 48%, var(--border-color));
		box-shadow: var(--shadow-sm);
	}

	.count-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.4rem 0.7rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--primary) 14%, var(--bg-base));
		color: var(--text-secondary);
		font-size: 0.75rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.count-pill.small {
		padding: 0.28rem 0.55rem;
		font-size: 0.7rem;
	}

	@media (min-width: 720px) {
		.branch-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>

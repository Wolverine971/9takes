<!-- src/lib/components/questions/CategoryBrowseBranch.svelte -->
<!--
  Streetlamp Symposium V5 — library shelf.
  Visual ground truth: /questions, /questions/categories.
  Tokens (--lamp-*, --night-*, --stone-*, --ink-*, --data-*) live globally
  in src/scss/index.scss.
-->
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
</script>

{#if depth === 0}
	<section class="shelf">
		<header class="shelf-head">
			<span class="shelf-kicker mono">
				SHELF · {category.subtreeQuestionCount}
				{category.subtreeQuestionCount === 1 ? 'QUESTION' : 'QUESTIONS'}
			</span>
			<h2 class="shelf-title">
				<a href={getCategoryHref(category)} class="shelf-link">
					{category.category_name}
				</a>
			</h2>
		</header>

		{#if hasChildren}
			<div class="branch-grid">
				{#each category.children as child (child.id)}
					<svelte:self category={child} depth={depth + 1} />
				{/each}
			</div>
		{/if}
	</section>
{:else if hasChildren}
	<div class="branch" class:branch--deep={depth > 1}>
		<a href={getCategoryHref(category)} class="branch-head">
			<span class="branch-name">{category.category_name}</span>
			<span class="branch-count mono">{category.subtreeQuestionCount}</span>
		</a>
		<div class="leaf-list">
			{#each category.children as child (child.id)}
				<svelte:self category={child} depth={depth + 1} />
			{/each}
		</div>
	</div>
{:else}
	<a href={getCategoryHref(category)} class="leaf-link">
		<span class="leaf-name">{category.category_name}</span>
		<span class="leaf-count mono">{category.subtreeQuestionCount}</span>
	</a>
{/if}

<style lang="scss">
	.mono {
		font-family: var(--font-mono);
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	/* =========================================================
	  Shelf — depth 0 root
	  ========================================================= */
	.shelf {
		padding: 24px 0 28px;
		border-top: 1px solid var(--stone-edge);

		&:first-child {
			border-top: none;
			padding-top: 0;
		}
	}

	.shelf-head {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 18px;
	}

	.shelf-kicker {
		font-size: 11px;
		color: var(--ink-dim);
	}

	.shelf-title {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(22px, 2.6vw, 28px);
		line-height: 1.15;
		letter-spacing: -0.02em;
		margin: 0;
	}

	.shelf-link {
		color: var(--ink-bright);
		text-decoration: none;
		transition: color 0.15s ease;

		&:hover {
			color: var(--lamp-glow);
		}
	}

	.branch-grid {
		display: grid;
		gap: 0 32px;
		grid-template-columns: 1fr;

		@media (min-width: 720px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	/* =========================================================
	  Branch — depth 1+ with children
	  ========================================================= */
	.branch {
		min-width: 0;
		padding-top: 4px;
	}

	.branch-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		padding: 8px 0;
		text-decoration: none;
		color: inherit;
		border-bottom: 1px solid var(--stone-edge);
		transition: border-color 0.15s ease;

		&:hover {
			border-bottom-color: var(--lamp-glow);

			.branch-name {
				color: var(--lamp-glow);
			}
		}
	}

	.branch-name {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 15px;
		line-height: 1.3;
		color: var(--ink-bright);
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		transition: color 0.15s ease;
	}

	.branch-count {
		font-size: 11px;
		color: var(--data-teal);
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
	}

	.branch--deep .branch-head {
		border-bottom: none;
		padding: 4px 0 2px;
	}

	.branch--deep .branch-name {
		font-size: 12px;
		font-weight: 500;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ink-dim);
	}

	.branch--deep .branch-count {
		color: var(--ink-dim);
	}

	.leaf-list {
		display: flex;
		flex-direction: column;
	}

	.branch--deep .leaf-list {
		border-left: 1px solid var(--stone-edge);
		margin-left: 4px;
		padding-left: 10px;
	}

	/* =========================================================
	  Leaf — terminal link
	  ========================================================= */
	.leaf-link {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		padding: 7px 0;
		text-decoration: none;
		color: inherit;
		border-top: 1px dotted transparent;
		border-bottom: 1px dotted color-mix(in srgb, var(--stone-edge) 60%, transparent);
		transition:
			color 0.15s ease,
			border-color 0.15s ease;

		&:last-child {
			border-bottom-color: transparent;
		}

		&:hover {
			.leaf-name {
				color: var(--lamp-glow);
			}

			.leaf-count {
				color: var(--lamp-glow);
			}
		}
	}

	.leaf-name {
		font-family: var(--font-display);
		font-size: 14px;
		line-height: 1.4;
		color: var(--ink-mid);
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		transition: color 0.15s ease;
	}

	.leaf-count {
		font-size: 11px;
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
		transition: color 0.15s ease;
	}
</style>

<!-- src/lib/components/questions/QuestionItemSkeleton.svelte -->
<script lang="ts">
	import Skeleton from '$lib/components/atoms/Skeleton.svelte';
</script>

<div class="skeleton-container" role="status" aria-label="Loading question">
	<div class="skeleton-content">
		<Skeleton decorative width="80%" height="1.2em" />
		<Skeleton decorative width="60%" height="1.2em" />
	</div>
	<div class="skeleton-meta">
		<div class="skeleton-comments">
			<Skeleton decorative width="30px" height="20px" />
			<Skeleton decorative variant="circular" width="20px" height="20px" />
		</div>
		<Skeleton decorative width="70px" height="24px" />
	</div>
</div>

<style>
	.skeleton-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		margin: 0.25rem 0;
		background-color: var(--stone-warm);
		border-left: 3px solid var(--lamp-glow);
		border-radius: 0.25rem;
		min-height: 3rem;
	}

	.skeleton-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.skeleton-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.skeleton-comments {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	@media (max-width: 576px) {
		.skeleton-meta {
			flex-direction: column;
			align-items: flex-end;
			gap: 0.25rem;
		}
	}
</style>

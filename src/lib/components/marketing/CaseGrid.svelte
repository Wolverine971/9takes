<!-- src/lib/components/marketing/CaseGrid.svelte -->
<!--
  Grid wrapper for CaseCard rows. Extracted 2026-06-10 (design audit).
  columns=2 → featured pairs (28px gap, stacks at 768px)
  columns=3 → fixed 3-up (2 at 968px, 1 at 540px by default)
  compactMobile keeps columns=3 grids 2-up below 540px for dense portrait libraries.
  columns=4 → auto-fit minmax(260px, 1fr) (the "case-grid--four" recipe)
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		columns = 4,
		compactMobile = false,
		children
	}: {
		columns?: 2 | 3 | 4;
		compactMobile?: boolean;
		children: Snippet;
	} = $props();
</script>

<div class="case-grid case-grid--{columns}" class:case-grid--compact-mobile={compactMobile}>
	{@render children()}
</div>

<style lang="scss">
	.case-grid {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		gap: 22px;
	}

	.case-grid--2 {
		grid-template-columns: repeat(2, 1fr);
		gap: 28px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 22px;
		}
	}

	.case-grid--3 {
		grid-template-columns: repeat(3, 1fr);

		@media (max-width: 968px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (max-width: 540px) {
			grid-template-columns: 1fr;
		}
	}

	.case-grid--3.case-grid--compact-mobile {
		@media (max-width: 540px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 14px;
		}
	}

	.case-grid--4 {
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	}
</style>

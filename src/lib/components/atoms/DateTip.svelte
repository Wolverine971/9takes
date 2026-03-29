<!-- src/lib/components/atoms/DateTip.svelte -->
<!-- This component displays dating tips in a highlighted box with a distinctive styling -->

<script>
	// You can add props here if needed
	// For example: export let tipType = "general";
</script>

<div class="date-tip">
	<slot></slot>
</div>

<style>
	.date-tip {
		background: var(--secondary-subtle);
		border-left: 4px solid var(--primary);
		padding: 1rem;
		margin: 1.5rem 0;
		border-radius: 0 8px 8px 0;
		position: relative;
		font-size: 0.95rem;
		line-height: 1.5;
		box-shadow: 0 0 15px rgba(251, 113, 133, 0.15);
		color: var(--text-primary);
	}

	.date-tip::before {
		content: '💡 Tip';
		font-weight: bold;
		display: block;
		margin-bottom: 0.5rem;
		color: var(--primary);
	}
</style>

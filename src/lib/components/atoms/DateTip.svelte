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
		background: rgba(59, 130, 246, 0.1);
		border-left: 4px solid #3b82f6;
		padding: 1rem;
		margin: 1.5rem 0;
		border-radius: 0 8px 8px 0;
		position: relative;
		font-size: 0.95rem;
		line-height: 1.5;
		box-shadow: 0 0 15px rgba(59, 130, 246, 0.15);
		color: #f1f5f9;
	}

	.date-tip::before {
		content: '💡 Tip';
		font-weight: bold;
		display: block;
		margin-bottom: 0.5rem;
		color: #60a5fa;
	}
</style>

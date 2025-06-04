<!-- lib/components/atoms/DateTip.svelte -->
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
		background: #f0f7ff;
		border-left: 4px solid #4a6fa0;
		padding: 1rem;
		margin: 1.5rem 0;
		border-radius: 0 8px 8px 0;
		position: relative;
		font-size: 0.95rem;
		line-height: 1.5;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
	}

	.date-tip::before {
		content: '💡 Tip';
		font-weight: bold;
		display: block;
		margin-bottom: 0.5rem;
		color: #4a6fa0;
	}
</style>

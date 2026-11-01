<!-- src/lib/test/LineChartStub.svelte -->
<script lang="ts">
	interface Props {
		title?: string;
	}

	let { title = '' }: Props = $props();
</script>

<div data-testid="line-chart-stub">{title}</div>

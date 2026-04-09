<!-- src/lib/test/StatCardStub.svelte -->
<script lang="ts">
	export let label = '';
	export let value: number | string = '';
</script>

<div data-testid="stat-card-stub">{label}: {value}</div>

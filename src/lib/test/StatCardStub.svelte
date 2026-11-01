<!-- src/lib/test/StatCardStub.svelte -->
<script lang="ts">
	interface Props {
		label?: string;
		value?: number | string;
	}

	let { label = '', value = '' }: Props = $props();
</script>

<div data-testid="stat-card-stub">{label}: {value}</div>

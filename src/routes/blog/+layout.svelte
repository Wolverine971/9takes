<!-- src/routes/blog/+layout.svelte -->
<script lang="ts">
	import '../../app.scss';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}

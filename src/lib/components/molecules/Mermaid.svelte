<script lang="ts">
	import mermaid from 'mermaid';
	import { onMount } from 'svelte';

	let graph = null;
	// export let newGraph: string = null
	// let gantt = null;

	mermaid.initialize({
		startOnLoad: true,

		theme: 'forest'
		// gantt: { axisFormatter: [
		//     ['%Y-%m-%d', (d) => {
		//         return d.getDay() === 1
		//     }]
		// ] }
	});

	onMount(() => {
		mermaid.initialize({
			startOnLoad: true,

			theme: 'neutral'
			// gantt: { axisFormatter: [
			//     ['%Y-%m-%d', (d) => {
			//         return d.getDay() === 1
			//     }]
			// ] }
		});
	});
</script>

<div class="mermaid">
	<slot />
</div>
<!-- <pre bind:this={gantt}>
gantt
title A Gantt Diagram
dateFormat  YYYY-MM-DD
section Section
A task           :a1, 2014-01-01, 30d
Another task     :after a1  , 20d
section Another
Task in sec      :2014-01-12  , 12d
another task      : 24d
    </pre> -->

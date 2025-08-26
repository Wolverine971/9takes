<!-- src/lib/components/questionPrintOut/ImageDropZone.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleDrop(e) {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = function (event) {
				dispatch('addImage', event?.target?.result);
			};
			reader.readAsDataURL(file);
		}
	}

	function handleDragOver(e) {
		e.preventDefault();
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="drop-zone" on:drop={handleDrop} on:dragover={handleDragOver}>
	Drag and drop images here
</div>

<style lang="scss">
	.drop-zone {
		border: 2px dashed #ccc;
		padding: 20px;
		text-align: center;
		margin-top: 20px;
	}
</style>

<!-- src/lib/components/questionPrintOut/ImageDropZone.svelte -->
<script lang="ts">
	interface Props {
		onaddimage?: (dataUrl: string | ArrayBuffer | null | undefined) => void;
	}

	let { onaddimage }: Props = $props();

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const file = e.dataTransfer?.files[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = function (event) {
				onaddimage?.(event?.target?.result);
			};
			reader.readAsDataURL(file);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="drop-zone" ondrop={handleDrop} ondragover={handleDragOver}>
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

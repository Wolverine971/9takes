<!-- src/lib/components/questionPrintOut/StyleControls.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type PrintableStyle = {
		color: string;
		fontFamily: string;
		fontSize: string;
	};

	export let style: PrintableStyle;

	const dispatch = createEventDispatcher();

	function updateStyle(property: keyof PrintableStyle, value: string) {
		dispatch('update', { [property]: value });
	}

	function getInputValue(event: Event) {
		return (event.target as HTMLInputElement | HTMLSelectElement | null)?.value ?? '';
	}
</script>

<div class="style-controls">
	<label>
		Color:
		<input
			type="color"
			value={style.color}
			on:input={(e) => updateStyle('color', getInputValue(e))}
		/>
	</label>

	<label>
		Font Family:
		<select value={style.fontFamily} on:change={(e) => updateStyle('fontFamily', getInputValue(e))}>
			<option value="Noticia Text, serif">Noticia Text</option>
		</select>
	</label>

	<label>
		Font Size:
		<input
			type="number"
			value={parseInt(style.fontSize)}
			min="8"
			max="32"
			on:input={(e) => updateStyle('fontSize', `${getInputValue(e)}px`)}
		/>
	</label>
</div>

<style lang="scss">
	.style-controls {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>

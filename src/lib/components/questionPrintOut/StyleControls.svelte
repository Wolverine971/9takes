<!-- lib/components/questionPrintOut/StyleControls.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';

	export let style;

	const dispatch = createEventDispatcher();

	function updateStyle(property, value) {
		dispatch('update', { [property]: value });
	}
</script>

<div class="style-controls">
	<label>
		Color:
		<input
			type="color"
			value={style.color}
			on:input={(e) => updateStyle('color', e.target.value)}
		/>
	</label>

	<label>
		Font Family:
		<select value={style.fontFamily} on:change={(e) => updateStyle('fontFamily', e.target.value)}>
			<option value="Arial, sans-serif">Arial</option>
			<option value="Times New Roman, serif">Times New Roman</option>
			<option value="Courier New, monospace">Courier New</option>
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
			on:input={(e) => updateStyle('fontSize', `${e.target.value}px`)}
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

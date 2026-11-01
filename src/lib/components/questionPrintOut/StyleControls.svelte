<!-- src/lib/components/questionPrintOut/StyleControls.svelte -->
<script lang="ts">
	type PrintableStyle = {
		color: string;
		fontFamily: string;
		fontSize: string;
	};

	interface Props {
		style: PrintableStyle;
		onupdate?: (change: Partial<PrintableStyle>) => void;
	}

	let { style, onupdate }: Props = $props();

	function updateStyle(property: keyof PrintableStyle, value: string) {
		onupdate?.({ [property]: value });
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
			oninput={(e) => updateStyle('color', getInputValue(e))}
		/>
	</label>

	<label>
		Font Family:
		<select value={style.fontFamily} onchange={(e) => updateStyle('fontFamily', getInputValue(e))}>
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
			oninput={(e) => updateStyle('fontSize', `${getInputValue(e)}px`)}
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

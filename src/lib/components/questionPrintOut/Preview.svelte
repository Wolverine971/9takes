<!-- src/lib/components/questionPrintOut/Preview.svelte -->
<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Rubix from '../icons/rubix.svelte';
	import Frame from './frame.svelte';
	import Scribble from '../atoms/scribble.svelte';
	import QuestionDisplay from '../questions/QuestionDisplay.svelte';

	const cornerSize = 10;
	interface Props {
		style: { color: string; fontFamily: string; fontSize: string };
		images: string[];
		question: ComponentProps<typeof QuestionDisplay>['question'] | null | undefined;
		imagePositions: Writable<{ x: number; y: number; isBackground: boolean }[]>;
		onupdateposition?: (detail: { index: number; x: number; y: number }) => void;
		ontogglebackground?: (detail: { index: number }) => void;
	}

	let { style, images, question, imagePositions, onupdateposition, ontogglebackground }: Props =
		$props();

	function handleDragStart(event: DragEvent, index: number) {
		event.dataTransfer?.setData('text/plain', String(index));
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		const index = parseInt(event.dataTransfer?.getData('text') ?? '');
		const target = event.currentTarget as HTMLElement;
		const x = event.clientX - target.getBoundingClientRect().left;
		const y = event.clientY - target.getBoundingClientRect().top;
		onupdateposition?.({ index, x, y });
	}

	function handleToggleBackground(index: number) {
		ontogglebackground?.({ index });
	}
</script>

<div
	class="preview"
	style:color={style.color}
	style:font-family={style.fontFamily}
	style:font-size={style.fontSize}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	role="region"
>
	<div
		class="content"
		style="
  "
	>
		<Frame color={style.color} {cornerSize} />
		<span class="brand">
			<Rubix height={50} width={50} svgStyle="margin: 1rem" />
			<Scribble text="9takes" />
		</span>
		{#if question}
			<QuestionDisplay {question} addQuestionMark={true} />
		{/if}
	</div>

	{#each images as image, i (`${i}-${image}`)}
		{@const position = $imagePositions[i]}
		{#if !position.isBackground}
			<img
				src={image}
				alt="User upload"
				class="draggable-image"
				style="position: absolute; left: {position.x}px; top: {position.y}px;"
				draggable="true"
				ondragstart={(e) => handleDragStart(e, i)}
				ondblclick={() => handleToggleBackground(i)}
			/>
		{:else}
			<div
				class="background-image"
				style="background-image: url({image}); position: absolute; left: {position.x}px; top: {position.y}px; width: 100%; height: 100%; opacity: 0.3; pointer-events: none;"
			></div>
		{/if}
	{/each}
</div>

<style>
	.preview {
		border: 1px solid #ccc;
		padding: 20px;
		position: relative;
		min-height: 400px;
	}

	.draggable-image {
		cursor: move;
		max-width: 200px;
		max-height: 200px;
	}

	.background-image {
		z-index: -1;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.content {
		position: relative;
		z-index: 2;
		padding: 1rem;
	}
	.brand {
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--marble-pure);
		z-index: 12433;
		text-decoration: none !important;
	}
</style>

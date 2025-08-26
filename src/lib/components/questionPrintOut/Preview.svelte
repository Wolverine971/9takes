<!-- src/lib/components/questionPrintOut/Preview.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Rubix from '../icons/rubix.svelte';
	import Frame from './frame.svelte';
	import Scribble from '../atoms/scribble.svelte';
	import QuestionDisplay from '../questions/QuestionDisplay.svelte';

	export let style: { color: string; fontFamily: string; fontSize: string };
	export let images: string[];
	export let question;
	const cornerSize = 10;
	export let imagePositions: Writable<{ x: number; y: number; isBackground: boolean }[]>;

	const dispatch = createEventDispatcher();

	function handleDragStart(event, index) {
		event.dataTransfer.setData('text/plain', index);
	}

	function handleDragOver(event) {
		event.preventDefault();
	}

	function handleDrop(event) {
		event.preventDefault();
		const index = parseInt(event.dataTransfer.getData('text'));
		const x = event.clientX - event.target.getBoundingClientRect().left;
		const y = event.clientY - event.target.getBoundingClientRect().top;
		dispatch('updatePosition', { index, x, y });
	}

	function handleToggleBackground(index) {
		dispatch('toggleBackground', { index });
	}
</script>

<div
	class="preview"
	style:color={style.color}
	style:font-family={style.fontFamily}
	style:font-size={style.fontSize}
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	role="region"
>
	<div
		class="content"
		style="
  "
	>
		<Frame color={style.color} {cornerSize} />
		<span class="brand">
			<Rubix height={50} width={50} svgStyle={'margin: 1rem'} />
			<Scribble text={'9takes'} />
		</span>
		{#if question}
			<QuestionDisplay {question} addQuestionMark={true} />
		{/if}
	</div>

	{#each images as image, i}
		{@const position = $imagePositions[i]}
		{#if !position.isBackground}
			<img
				src={image}
				alt="User uploaded image"
				class="draggable-image"
				style="position: absolute; left: {position.x}px; top: {position.y}px;"
				draggable="true"
				on:dragstart={(e) => handleDragStart(e, i)}
				on:dblclick={() => handleToggleBackground(i)}
			/>
		{:else}
			<div
				class="background-image"
				style="background-image: url({image}); position: absolute; left: {position.x}px; top: {position.y}px; width: 100%; height: 100%; opacity: 0.3; pointer-events: none;"
			/>
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
		color: var(--base-white-outline);
		z-index: 12433;
		text-decoration: none !important;
	}
</style>

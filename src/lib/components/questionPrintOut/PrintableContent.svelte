<script lang="ts">
	import { get } from 'svelte/store';

	export let style;
	export let images;
	export let imagePositions;
	export let question;
	export let question2;
	export let question3;

	import Frame from './frame.svelte';
	import Rubix from '../icons/rubix.svelte';
	import Scribble from '../atoms/scribble.svelte';
	import QuestionDisplay from '../questions/QuestionDisplay.svelte';

	$: positions = Array.isArray(imagePositions)
		? imagePositions
		: imagePositions?.subscribe
			? get(imagePositions)
			: [];

	const cornerSize = 10;
	const backgroundIndex = positions?.length ? positions.findIndex((pos) => pos?.isBackground) : 0;
	$: backgroundImage = backgroundIndex >= 0 ? images[backgroundIndex] : null;
</script>

<div
	class="printable-forum"
	style:color={style.color}
	style:font-family={style.fontFamily}
	style:font-size={style.fontSize}
>
	<div style="position: relative;">
		<Frame color={style.color} {cornerSize} />

		<div class="content" style="">
			<div
				class=" {backgroundImage && 'background-image'}"
				style={backgroundImage && `background-image: url(${backgroundImage})`}
			/>
			{#if images && images.length > 0}
				{#each images as image, i}
					{@const position = positions[i]}
					{#if position && !position.isBackground}
						<img
							src={image}
							alt="User uploaded pic"
							class={position.isBackground ? 'background-image' : 'foreground-image'}
							style="left: {position.x}px; top: {position.y}px;"
						/>
					{/if}
				{/each}
			{/if}

			<span class="brand">
				<Rubix height={50} width={50} svgStyle={'margin: 1rem'} />
				<Scribble text={'9takes'} />
			</span>
			{#if question}
				<QuestionDisplay {question} addQuestionMark={true} />
			{/if}
		</div>
	</div>
	{#if question2}
		<div style="position: relative;">
			<Frame color={style.color} {cornerSize} />

			<div class="content" style="">
				{#if images && images.length > 0}
					{#each images as image, i}
						{@const position = positions[i]}
						{#if position && !position.isBackground}
							<img
								src={image}
								alt="User uploaded image"
								class={position.isBackground ? 'background-image' : 'foreground-image'}
								style="left: {position.x}px; top: {position.y}px;"
							/>
						{/if}
					{/each}
				{/if}

				<span class="brand">
					<Rubix height={50} width={50} svgStyle={'margin: 1rem'} />
					<Scribble text={'9takes'} />
				</span>
				<QuestionDisplay question={question2} addQuestionMark={true} />
			</div>
		</div>
	{/if}
	{#if question3}
		<div style="position: relative;">
			<Frame color={style.color} {cornerSize} />

			<div class="content" style="">
				{#if images && images.length > 0}
					{#each images as image, i}
						{@const position = positions[i]}
						{#if position && !position.isBackground}
							<img
								src={image}
								alt="User uploaded image"
								class={position.isBackground ? 'background-image' : 'foreground-image'}
								style="left: {position.x}px; top: {position.y}px;"
							/>
						{/if}
					{/each}
				{/if}

				<span class="brand">
					<Rubix height={50} width={50} svgStyle={'margin: 1rem'} />
					<Scribble text={'9takes'} />
				</span>
				<QuestionDisplay question={question3} addQuestionMark={true} />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.printable-forum {
		padding: 10px 37px;
		width: 100%;
		position: relative;
	}
	.greek-frame {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: none;
	}
	.content {
		position: relative;
		z-index: 2;
		overflow: hidden;
		padding: 1rem;
		padding: 0 2rem;
	}
	.background-image {
		position: fixed; // absolute for one pic
		width: 100%;
		height: 100%;
		opacity: 0.3;
		z-index: -1;
		// object-fit: cover;
		background-repeat: repeat;
	}
	.foreground-image {
		position: absolute;
		max-width: 200px;
		max-height: 200px;
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

<script lang="ts">
	import Preview from '$lib/components/questionPrintOut/Preview.svelte';
	import StyleControls from '$lib/components/questionPrintOut/StyleControls.svelte';
	import ImageDropZone from '$lib/components/questionPrintOut/ImageDropZone.svelte';
	import PrintableContent from '$lib/components/questionPrintOut/PrintableContent.svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';

	import { browser } from '$app/environment';
	import SearchQuestion from '$lib/components/questions/SearchQuestion.svelte';
	let imagePositions = writable([]);
	let style = {
		color: '#000000',
		fontFamily: 'Noticia Text, serif',
		fontSize: '16px'
	};

	export let data: PageData;
	let question = null;
	let question2 = null;
	let question3 = null;
	let images = [];

	function addImage(image) {
		console.log('Adding image:', image);
		images = [...images, image];
		imagePositions.update((positions) => {
			const newPositions = [...positions, { x: 0, y: 0, isBackground: false }];
			console.log('Updated positions:', newPositions);
			return newPositions;
		});
	}

	function updateImagePosition(index, x, y) {
		imagePositions.update((positions) => {
			const newPositions = positions.map((pos, i) => (i === index ? { ...pos, x, y } : pos));
			console.log('Updated positions:', newPositions);
			return newPositions;
		});
	}

	function toggleBackgroundImage(index) {
		console.log('Toggling background for image at index:', index);
		imagePositions.update((positions) => {
			const newPositions = positions.map((pos, i) =>
				i === index ? { ...pos, isBackground: !pos.isBackground } : pos
			);
			console.log('Updated positions:', newPositions);
			return newPositions;
		});
	}

	function updateStyle(newStyle: any) {
		style = { ...style, ...newStyle };
	}

	function print() {
		if (browser && document) {
			const printContent = document.getElementById('printable-content').innerHTML;
			const printWindow = window.open('', '_blank');
			if (!printWindow) return;

			const styleContent = `
            :root{
            --dark-gray: #52616b;
            --classic-border: 1px solid var(--dark-gray);
            --base-border-radius: 5px;
            --color-theme-purple: var(--primary);
            --color-theme-purple-d: #2f0479;
            --color-theme-purple-light: var(--accent);
            --color-theme-purple-lighter: #bc96fd;
            --base-white-outline: #f0f5f9;
            --medium-gray: #d8d8d8;
            --light-gray: #d4d4d4;
            --medium-gray: #cacaca;
            }

      @media print {
        body { 
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
      body { 
        font-family: ${style.fontFamily}; 
        color: ${style.color}; 
        font-size: ${style.fontSize};
        position: relative;
      }
      .printable-forum {
        // padding: 1rem 75px;
        padding: 10px 37px;
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
        padding: 0 2rem;
      }
      .background-image {
        position: fixed;
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
        .scribble {
            position: relative;
            font-size: 2rem;
            font-weight: 400;
            margin: 1rem;
            display: flex;
            text-shadow: -1px -1px 0 var(--primary), 1px -1px 0 var(--primary), -1px 1px 0 #000, 1px 1px 0 #000;
            color: #fff !important;
        }
        .brand {
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--base-white-outline);
            z-index: 12433;
            text-decoration: none !important;
        }
        .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            padding: 0;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
        }
        .qr-image-border {
            border: var(--classic-border);
            margin: 0.5rem;
            border-radius: var(--base-border-radius);
            padding: 0.2rem;
            background-color: var(--accent);
            background-image: linear-gradient(to right top, #a0b6d4, #b0b8df, #c6b9e6, #e0b8e7, #f9b7e1);
        }
	.question-box {
		// remove update
		width: -webkit-fill-available;
		border-radius: var(--base-border-radius);
		// height: 24px;
		// padding: 0.5rem 1rem;
		color: var(--darkest-gray);
		font-size: 1.2rem;
		// box-sizing: content-box;

		margin: 0.25rem 0;
	}

	.headline {
		font-size: 3em;
		font-weight: bold;
		text-transform: uppercase;
		text-align: center;
		padding: 1rem 0;
		width: 90%;
		min-height: 90px;
		border: 1px solid var(--color-theme-purple-light);
	}
	@media (max-width: 700px) {
		.headline {
			border: none;
		}
	}

    @media (max-width: 1715px) {

.printable-forum {
    // padding: 1rem 65px;
}
        }
    @media (max-width: 700px) {

 }
    @media (max-width: 700px) {

 }
    @media (max-width: 700px) {
 }
    `;

			const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Noticia+Text:ital,wght@0,400;0,700;1,400;1,700&amp;display=swap" rel="stylesheet">
        <title>Print Forum Content</title>
      </head>
      <body>
          ${printContent}
      </body>
      </html>
    `;

			const parser = new DOMParser();
			const doc = parser.parseFromString(htmlContent, 'text/html');

			// Add the style element
			const styleElement = doc.createElement('style');
			styleElement.textContent = styleContent;
			doc.head.appendChild(styleElement);

			printWindow.document.replaceChild(
				printWindow.document.importNode(doc.documentElement, true),
				printWindow.document.documentElement
			);

			printWindow.document.close();

			// Wait for images to load before printing
			printWindow.onload = () => {
				printWindow.print();
			};
		}
	}
</script>

<h1>Question 1</h1>
<SearchQuestion
	{data}
	on:questionSelected={({ detail }) => {
		question = detail;
	}}
/>

<h1>Question 2</h1>
<SearchQuestion
	{data}
	on:questionSelected={({ detail }) => {
		question2 = detail;
	}}
/>
<h1>Question 3</h1>
<SearchQuestion
	{data}
	on:questionSelected={({ detail }) => {
		question3 = detail;
	}}
/>

<main>
	<div class="preview-container">
		<Preview
			{style}
			{images}
			{question}
			{imagePositions}
			on:updatePosition={(e) => updateImagePosition(e.detail.index, e.detail.x, e.detail.y)}
			on:toggleBackground={(e) => toggleBackgroundImage(e.detail.index)}
		/>
	</div>
	<div class="controls-container">
		<StyleControls {style} on:update={(e) => updateStyle(e.detail)} />
		<ImageDropZone on:addImage={(e) => addImage(e.detail)} />
		<button on:click={print}>Print</button>
	</div>
</main>

{#if browser}
	<div id="printable-content">
		<PrintableContent
			{style}
			{images}
			{question}
			{question2}
			{question3}
			imagePositions={$imagePositions}
		/>
	</div>
{/if}

<style lang="scss">
	main {
		display: flex;
		padding: 20px;
	}
	.preview-container {
		flex: 2;
		margin-right: 20px;
	}
	.controls-container {
		flex: 1;
	}
</style>

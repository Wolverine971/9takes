<!-- src/lib/components/questions/QuestionDisplay.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	export let question: {
		id: string;
		url: string;
		question: string;
		question_formatted?: string;
	};
	export let addQuestionMark = false;

	let innerWidth = 0;
	let qrCodeUrl = '';

	// QR Code options
	const QR_OPTS = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.7,
		margin: 1,
		color: {
			dark: '#333333',
			light: '#ffffff'
		}
	};

	// Dynamically calculate font size based on text length
	$: fontSize = question.question ? calculateFontSize(question.question) : '2rem';

	function calculateFontSize(text: string): string {
		// Define breakpoints for font sizing
		const breakpoints = {
			xs: { length: 45, size: innerWidth > 500 ? '2.3rem' : '1.9rem' },
			sm: { length: 60, size: innerWidth > 500 ? '2.2rem' : '1.8rem' },
			md: { length: 80, size: innerWidth > 500 ? '2.1rem' : '1.7rem' },
			lg: { length: 105, size: innerWidth > 500 ? '2rem' : '1.6rem' },
			xl: { length: 130, size: innerWidth > 500 ? '1.8rem' : '1.4rem' },
			xxl: { length: 150, size: innerWidth > 500 ? '1.7rem' : '1.3rem' },
			xxxl: { length: 200, size: innerWidth > 500 ? '1.6rem' : '1.2rem' },
			huge: { length: 250, size: innerWidth > 500 ? '1.4rem' : '1rem' },
			massive: { length: 300, size: innerWidth > 500 ? '1.2rem' : '0.9rem' }
		};

		// Find the appropriate size
		for (const [key, value] of Object.entries(breakpoints)) {
			if (text.length < value.length) {
				return value.size;
			}
		}

		// Default size for very long text
		return innerWidth > 500 ? '1rem' : '0.8rem';
	}

	// Generate QR code on mount
	onMount(() => {
		innerWidth = window.innerWidth;
		if (question.url) {
			QRCode.toDataURL(`https://9takes.com/questions/${question.url}`, QR_OPTS)
				.then((url) => (qrCodeUrl = url))
				.catch((err) => console.error('QR Code generation failed:', err));
		}
	});
</script>

<svelte:window bind:innerWidth />

<div
	class="mb-4 flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-white to-neutral-100 p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
>
	<h1
		class="relative m-0 w-full py-2 text-center font-bold uppercase leading-tight tracking-wide text-neutral-900 after:absolute after:bottom-[-10px] after:left-1/2 after:h-[3px] after:w-[60px] after:-translate-x-1/2 after:rounded-sm after:bg-primary-500 after:content-['']"
		style="font-size: {fontSize}"
		itemprop="name"
		style:--tag={`h-question-${question.question.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}
	>
		{question.question_formatted || question.question}
		{#if !question.question_formatted && addQuestionMark}?{/if}
	</h1>
	{#if innerWidth <= 576 && qrCodeUrl}
		<div class="mt-2 flex justify-center">
			<img
				src={qrCodeUrl}
				alt="9takes QR Code"
				class="h-[100px] w-[100px] rounded border border-neutral-200 bg-white p-2 transition-transform duration-300 hover:scale-105"
			/>
		</div>
	{/if}
</div>

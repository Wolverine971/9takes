<!-- src/lib/components/questions/QuestionDisplay.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { viewportWidth } from '$lib/stores/viewport';

	export let question: {
		id: string;
		url: string;
		question: string;
		question_formatted?: string;
	};
	export let addQuestionMark = false;

	let qrCodeUrl = '';

	// Use shared viewport store
	$: innerWidth = $viewportWidth;

	// QR Code options - Solo Leveling dark theme
	const QR_OPTS = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.7,
		margin: 1,
		color: {
			dark: '#a78bfa', // Purple-400 for dark theme
			light: '#12121a' // Void background
		}
	};

	// Dynamically calculate font size based on text length
	$: fontSize = question.question ? calculateFontSize(question.question) : '2rem';

	function calculateFontSize(text: string): string {
		// Optimized breakpoints for better desktop readability
		const breakpoints = {
			xs: {
				length: 45,
				size:
					innerWidth > 1024
						? '2.25rem'
						: innerWidth > 768
							? '2rem'
							: innerWidth > 500
								? '1.75rem'
								: '1.5rem'
			},
			sm: {
				length: 60,
				size:
					innerWidth > 1024
						? '2rem'
						: innerWidth > 768
							? '1.875rem'
							: innerWidth > 500
								? '1.625rem'
								: '1.375rem'
			},
			md: {
				length: 80,
				size:
					innerWidth > 1024
						? '1.875rem'
						: innerWidth > 768
							? '1.75rem'
							: innerWidth > 500
								? '1.5rem'
								: '1.25rem'
			},
			lg: {
				length: 105,
				size:
					innerWidth > 1024
						? '1.75rem'
						: innerWidth > 768
							? '1.625rem'
							: innerWidth > 500
								? '1.375rem'
								: '1.125rem'
			},
			xl: {
				length: 130,
				size:
					innerWidth > 1024
						? '1.625rem'
						: innerWidth > 768
							? '1.5rem'
							: innerWidth > 500
								? '1.25rem'
								: '1rem'
			},
			xxl: {
				length: 150,
				size:
					innerWidth > 1024
						? '1.5rem'
						: innerWidth > 768
							? '1.375rem'
							: innerWidth > 500
								? '1.125rem'
								: '0.9375rem'
			},
			xxxl: {
				length: 200,
				size:
					innerWidth > 1024
						? '1.375rem'
						: innerWidth > 768
							? '1.25rem'
							: innerWidth > 500
								? '1rem'
								: '0.875rem'
			},
			huge: {
				length: 250,
				size:
					innerWidth > 1024
						? '1.25rem'
						: innerWidth > 768
							? '1.125rem'
							: innerWidth > 500
								? '0.9375rem'
								: '0.875rem'
			},
			massive: {
				length: 300,
				size:
					innerWidth > 1024
						? '1.125rem'
						: innerWidth > 768
							? '1rem'
							: innerWidth > 500
								? '0.875rem'
								: '0.8125rem'
			}
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
		if (question.url) {
			QRCode.toDataURL(`https://9takes.com/questions/${question.url}`, QR_OPTS)
				.then((url) => (qrCodeUrl = url))
				.catch((err) => console.error('QR Code generation failed:', err));
		}
	});
</script>

<div
	class="relative overflow-hidden rounded-xl border border-slate-700/50 bg-[#1a1a2e] p-8 shadow-[0_0_20px_rgba(124,58,237,0.1)] sm:p-6"
>
	<h1
		class="relative m-0 w-full text-center font-bold leading-snug text-slate-100"
		style="font-size: {fontSize};"
		itemprop="name"
	>
		{question.question_formatted || question.question}
		{#if !question.question_formatted && addQuestionMark}?{/if}
	</h1>

	{#if innerWidth <= 576 && qrCodeUrl}
		<div class="mt-6 flex justify-center">
			<img
				src={qrCodeUrl}
				alt="Share this question"
				class="h-20 w-20 rounded-lg border border-slate-600 bg-[#12121a] p-2"
			/>
		</div>
	{/if}
</div>

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

<div class="question-container">
	<h1
		class="question-box"
		style="font-size: {fontSize}"
		itemprop="name"
		style:--tag={`h-question-${question.question.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}`}
	>
		{question.question_formatted || question.question}
		{#if !question.question_formatted && addQuestionMark}?{/if}
	</h1>
	{#if innerWidth <= 576 && qrCodeUrl}
		<div class="qr-container">
			<img src={qrCodeUrl} alt="9takes QR Code" class="qr-image-mobile" />
		</div>
	{/if}
</div>

<style lang="scss">
	.question-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		background: linear-gradient(145deg, #ffffff, var(--light-gray));
		border-radius: 15px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
		padding: 2rem 1.5rem;
		margin-bottom: 1rem;
		transition: all 0.3s ease;

		@media (max-width: 576px) {
			padding: 1.25rem 1rem;
			gap: 1rem;
		}

		&:hover {
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
			transform: translateY(-2px);
		}
	}

	.question-box {
		width: 100%;
		text-align: center;
		color: var(--darkest-gray);
		font-weight: 700;
		line-height: 1.4;
		letter-spacing: 0.5px;
		margin: 0;
		padding: 0.5rem 0;
		text-transform: uppercase;
		position: relative;

		&::after {
			content: '';
			position: absolute;
			bottom: -10px;
			left: 50%;
			transform: translateX(-50%);
			width: 60px;
			height: 3px;
			background: var(--accent);
			border-radius: 2px;
		}
	}

	.qr-container {
		display: flex;
		justify-content: center;
		margin-top: 0.5rem;
	}

	.qr-image-mobile {
		width: 100px;
		height: 100px;
		border-radius: var(--base-border-radius);
		background-color: white;
		padding: 0.5rem;
		border: 1px solid var(--base-white-outline);
		transition: transform 0.3s ease;

		&:hover {
			transform: scale(1.05);
		}
	}
</style>

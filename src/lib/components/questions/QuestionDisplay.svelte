<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	export let question: { id: string; url: string; question: string; question_formatted?: string };
	export let showDetails = true;
	export let addQuestionMark = false;

	let innerWidth = 0;
	let qrCodeUrl = '';

	const QR_OPTS = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.7,
		margin: 1,
		color: {
			dark: '',
			light: '#c1c0c036'
		}
	};

	$: fontSize = calcSize(question.question);
	$: qrCodeSize = innerWidth > 400 ? '20%' : '30%';

	function calcSize(text: string): string {
		const lengths = [45, 60, 80, 105, 115, 130, 150, 200, 220, 240, 290, 380];
		const sizes = [
			'2.3rem',
			'2.2rem',
			'2.1rem',
			'2rem',
			'1.9rem',
			'1.8rem',
			'1.7rem',
			'1.6rem',
			'1.5rem',
			'1.4rem',
			'1.3rem',
			'0.75rem',
			'0.5rem'
		];
		const mobileSizes = [
			'1.9rem',
			'1.8rem',
			'1.7rem',
			'1.6rem',
			'1.5rem',
			'1.4rem',
			'1.3rem',
			'1.2rem',
			'1.1rem',
			'1rem',
			'0.9rem',
			'0.8rem',
			'0.7rem'
		];

		const index = lengths.findIndex((length) => text.length < length);
		return innerWidth > 400 ? sizes[index] : mobileSizes[index];
	}

	onMount(() => {
		QRCode.toDataURL(`https://9takes.com/questions/${question.url}`, QR_OPTS)
			.then((url) => (qrCodeUrl = url))
			.catch((err) => console.error('QR Code generation failed:', err));
	});
</script>

<svelte:window bind:innerWidth />

<div class="question-container">
	<h1
		class="question-box headline"
		style="font-size: {fontSize}"
		style:--tag={`h-question-${question.id}`}
		itemprop="name"
	>
		{question.question_formatted || question.question}{!question.question_formatted &&
		addQuestionMark
			? '?'
			: ''}
	</h1>
	<img src={qrCodeUrl} alt="9takes QR Code" class="qr-image-border" style="width: {qrCodeSize};" />
</div>

<style lang="scss">
	.question-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.qr-image-border {
		border: var(--classic-border);
		margin: 0.5rem;
		border-radius: var(--base-border-radius);
		padding: 0.2rem;
		background-color: var(--base-grey-2);
		background-image: linear-gradient(to right top, #a0b6d4, #b0b8df, #c6b9e6, #e0b8e7, #f9b7e1);
	}

	.question-box {
		width: -webkit-fill-available;
		border-radius: var(--base-border-radius);
		color: var(--color-paladin-4);
		margin: 0.25rem;
	}

	.headline {
		font-weight: bold;
		text-transform: uppercase;
		text-align: center;
		padding: 1rem 0;
		width: 80%;
		border: 1px solid var(--color-theme-purple-light);
	}

	@media (max-width: 700px) {
		.headline {
			border: none;
		}
	}

	@media (max-width: 500px) {
		article {
			padding: 0;
		}

		.qr-image-border {
			margin: 0;
			padding: 0;
		}
	}
</style>

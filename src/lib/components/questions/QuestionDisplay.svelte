<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

	export let question: { id: string; url: string; question: string; question_formatted?: string };
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
		return innerWidth > 500 ? sizes[index] : mobileSizes[index];
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
	{#if innerWidth <= 576 && qrCodeUrl}
		<img src={qrCodeUrl} alt="9takes QR Code" class="qr-image-mobile" />
	{/if}
</div>

<style lang="scss">
	.question-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(145deg, var(--card-background), var(--base-grey-1));
		border-radius: 15px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
		margin-bottom: 1rem;

		@media (max-width: 576px) {
			padding: 1rem;
			gap: 1rem;
		}
	}

	.question-box {
		width: 100%;
		border-radius: var(--base-border-radius);
		color: var(--color-paladin-4);
		margin: 0.25rem 0;
	}

	.headline {
		font-weight: 700;
		text-transform: uppercase;
		text-align: center;
		letter-spacing: 0.5px;
		line-height: 1.3;
		position: relative;
		padding: 0.75rem 0;
		min-height: 60px;

		@media (max-width: 576px) {
			padding: 0.5rem 0;
			border: none;
		}

		&::after {
			content: '';
			position: absolute;
			bottom: -5px;
			left: 50%;
			transform: translateX(-50%);
			width: 40px;
			height: 3px;
			background: var(--accent);
			border-radius: 2px;
		}
	}

	.qr-image-mobile {
		width: 120px;
		height: 120px;
		border-radius: var(--base-border-radius);
		padding: 0.5rem;
		background: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
</style>

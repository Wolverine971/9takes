<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	export let question: any;
	export let showDetails = true;
	export let addQuestionMark = false;
	let innerWidth = 0;

	const opts = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.7,
		margin: 1,
		color: {
			dark: '',
			light: '#c1c0c036'
		}
	};
	const calcSize = (text: string) => {
		if (text.length < 45) {
			return innerWidth > 400 ? '2.3rem' : '1.9rem';
		} else if (text.length < 60) {
			return innerWidth > 400 ? '2.2rem' : '1.8rem';
		} else if (text.length < 80) {
			return innerWidth > 400 ? '2.1rem' : '1.7rem';
		} else if (text.length < 105) {
			return innerWidth > 400 ? '2rem' : '1.6rem';
		} else if (text.length < 115) {
			return innerWidth > 400 ? '1.9rem' : '1.5rem';
		} else if (text.length < 130) {
			return innerWidth > 400 ? '1.8rem' : '1.4rem';
		} else if (text.length < 150) {
			return innerWidth > 400 ? '1.7rem' : '1.3rem';
		} else if (text.length < 200) {
			return innerWidth > 400 ? '1.6rem' : '1.2rem';
		} else if (text.length < 220) {
			return innerWidth > 400 ? '1.5rem' : '1.1rem';
		} else if (text.length < 240) {
			return innerWidth > 400 ? '1.4rem' : '1rem';
		} else if (text.length < 290) {
			return innerWidth > 400 ? '1.3rem' : '0.9rem';
		} else if (text.length < 380) {
			return innerWidth > 400 ? '0.75rem' : '0.8rem';
		} else {
			return innerWidth > 400 ? '0.5rem' : '0.7rem';
		}
	};
	let num = Math.random();
	let qrcodeid = `qr-image${num}`;
	onMount(() => {
		// autoGrow(document.getElementById('question-box'));
		// window.addEventListener('resize', (event) => {
		// 	autoGrow(document.getElementById('question-box'));
		// });
		QRCode.toDataURL(`https://9takes.com/questions/${question?.url}`, opts, function (err, url) {
			if (err) throw err;

			var img = document.getElementById(qrcodeid);
			img.src = url;
		});
	});
</script>

<svelte:window bind:innerWidth />

<div style="display: flex; justify-content: center; align-items:center;">
	<h1
		class="question-box headline"
		id="question-box"
		style="overflow:hidden; font-size: {calcSize(question.question)}"
		style:--tag={`h-question-${question.id}`}
		itemprop="name"
	>
		{question.question_formatted || question.question}{!question.question_formatted &&
		addQuestionMark
			? '?'
			: ''}
	</h1>
	<img
		id={qrcodeid}
		src=""
		alt="9takes QR Code"
		class="qr-image-border"
		style="width: {innerWidth > 400 ? '15%' : '30%'};"
	/>
</div>

<style lang="scss">
	.qr-image-border {
		border: var(--classic-border);
		margin: 0.5rem;
		border-radius: var(--base-border-radius);
		padding: 0.2rem;
		background-color: var(--base-grey-2);
		background-image: linear-gradient(to right top, #a0b6d4, #b0b8df, #c6b9e6, #e0b8e7, #f9b7e1);
	}
	.question-box {
		// remove update
		width: -webkit-fill-available;
		border-radius: var(--base-border-radius);
		// height: 24px;
		// padding: 0.5rem 1rem;
		color: var(--color-paladin-4);
		font-size: 1.2rem;
		// box-sizing: content-box;

		margin: 0.25rem;
	}

	.headline {
		font-size: 3em;
		font-weight: bold;
		text-transform: uppercase;
		text-align: center;
		padding: 1rem 0;
		width: 80%;
		border: 1px solid var(--color-theme-purple-v);
	}
	@media (max-width: 700px) {
		.headline {
			border: none;
		}
	}
</style>

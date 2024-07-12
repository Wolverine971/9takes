<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import QRCode from 'qrcode';
	import LinkMap from '$lib/components/molecules/LinkMap.svelte';

	export let data: PageData;
	// https://www.google.com/maps/d/u/0/edit?mid=1Tzl1TDaqcjkWamKW0gWbrkXChDBy7fs&ll=39.241823849464524%2C-76.70339055584886&z=11

	const opts = {
		errorCorrectionLevel: 'H',
		type: 'image/jpeg',
		quality: 0.7,
		margin: 1,
		color: {
			dark: '#5407d9',
			light: ''
		}
	};
	const numberOfQRCodes = 20;

	onMount(() => {
		for (let i = 0; i < numberOfQRCodes; i++) {
			const uuid = crypto.randomUUID();
			QRCode.toDataURL(`https://9takes.com/links/${uuid}`, opts, function (err, url) {
				if (err) throw err;

				var imgs = document.querySelectorAll(`#qr-image-${i}`);
				imgs.forEach((img) => {
					img.src = url;
				});
			});
		}
	});
</script>

<div>
	<h1>Link Drops</h1>
	<div style="display: flex;">
		<div style="display: flex; flex-direction: column; gap: 2px">
			{#each Array(numberOfQRCodes) as _, i}
				<div style="display: flex; flex-wrap: wrap; gap: 2px">
					{#each Array(3) as _, j}
						<!-- {#if i === 1} -->
						<div style="position: relative; margin: 2px;">
							<img id="qr-image-{i}" src="" style="max-width: 90px;" alt="link qr code" />
							<!-- <fieldset style="top: -20px;	left: -11px;"><legend>9takes</legend></fieldset>
						<fieldset style="right: -40px; 	top: 10px"><legend>9takes</legend></fieldset>
						<fieldset style="bottom: -20px;	left: -11px;"><legend>9takes</legend></fieldset>
						<fieldset style="left: -40px; 	top: 10px"><legend>9takes</legend></fieldset> -->

							<!-- <fieldset style="top: -24px;	left: -16px;"><legend>9takes</legend></fieldset>
						<fieldset style="right: -45px; 	top: 6px"><legend>9takes</legend></fieldset>
						<fieldset style="bottom: -20px;	left: -16px;"><legend>9takes</legend></fieldset>
						<fieldset style="left: -45px; 	top: 6px"><legend>9takes</legend></fieldset> -->
						</div>
						<!-- {/if} -->
					{/each}
				</div>
			{/each}
		</div>
		<div style="display: flex; flex-direction: column; gap: 2px">
			{#each Array(numberOfQRCodes) as _, i}
				<div style="display: flex; flex-wrap: wrap; gap: 2px">
					{#each Array(3) as _, j}
						<!-- {#if i === 1} -->
						<div style="position: relative; margin: 2px;">
							<!-- <img id="qr-image-{i}" src="" style="max-width: 90px;" /> -->
							<h1 class="wording">9takes</h1>
							<!-- <fieldset style="top: -20px;	left: -11px;"><legend>9takes</legend></fieldset>
						<fieldset style="right: -40px; 	top: 10px"><legend>9takes</legend></fieldset>
						<fieldset style="bottom: -20px;	left: -11px;"><legend>9takes</legend></fieldset>
						<fieldset style="left: -40px; 	top: 10px"><legend>9takes</legend></fieldset> -->

							<!-- <fieldset style="top: -24px;	left: -16px;"><legend>9takes</legend></fieldset>
						<fieldset style="right: -45px; 	top: 6px"><legend>9takes</legend></fieldset>
						<fieldset style="bottom: -20px;	left: -16px;"><legend>9takes</legend></fieldset>
						<fieldset style="left: -45px; 	top: 6px"><legend>9takes</legend></fieldset> -->
						</div>
						<!-- {/if} -->
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<LinkMap linkDrops={data?.linkDrops} />
</div>

<style lang="scss">
	.wording {
		border: var(--classic-border);
		border-radius: var(--base-border-radius);
		padding: 0 0.5rem 0;
	}
	fieldset {
		// border: 10px solid transparent;
		border: 5px solid transparent;
		border-top-color: var(--black);
		box-sizing: border-box;
		grid-area: 1 / 1;
		padding: 20px;
		width: inherit;
		position: absolute;
	}
	// fieldset:nth-of-type(1) {
	// 	background: content-box center/contain no-repeat url('photo-1588852065463-5de1411ea697?w=400');
	// }
	fieldset:nth-of-type(2) {
		transform: rotate(90deg);
	}
	fieldset:nth-of-type(3) {
		transform: rotate(180deg);
	}
	fieldset:nth-of-type(4) {
		transform: rotate(-90deg);
	}
	legend {
		font-weight: bolder;
	}
	fieldset:nth-of-type(3) > legend {
		transform: rotate(180deg);
	}
</style>

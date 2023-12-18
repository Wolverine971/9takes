<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import QRCode from 'qrcode';

	export let data: PageData;

	let email = '';

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
	const numberOfQRCodes = 10;

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
	<div style="display: flex; flex-direction: column; gap: 0.5rem">
		{#each Array(numberOfQRCodes) as _, i}
			<div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
				{#each Array(3) as _, j}
					<img id="qr-image-{i}" src="" style="max-width: 90px;" />
				{/each}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
</style>

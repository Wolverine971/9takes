<script lang="ts">
	import { onMount } from 'svelte';

	export let text: string = '9takes';

	// export let svgStyle: string = '';

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	// You can import and use other Svelte components or JavaScript modules here.
	let interval: string | number | NodeJS.Timeout | null | undefined = null;
	onMount(() => {
		// doc = true;
		// if (!scrambleText) {
		// 	return;
		// }
		/* -- Text effect -- */
	});
	const scribbleScrabble = () => {
		let name = document.querySelector('.scribble');
		let iteration = 0;

		clearInterval(interval);
		if (name) {
			interval = setInterval(() => {
				name.innerText = text
					.split('')
					.map((letter, index) => {
						if (index < iteration) {
							return name.dataset.value[index];
						}

						return letters[Math.floor(Math.random() * 26)];
					})
					.join('');

				if (iteration >= name.dataset.value.length) {
					clearInterval(interval);
				}

				iteration += 1 / 3;
			}, 30);
		}
	};
</script>

<p
	class="scribble"
	data-value={text}
	on:mouseover={() => {
		scribbleScrabble();
	}}
	on:focus={() => {
		scribbleScrabble();
	}}
>
	{text}
</p>

<style lang="scss">
	/* You can style your SVG here */

	.scribble {
		position: relative;
		font-size: 2rem;
		font-weight: 400;
		margin: 1rem;
		/* color: black;
		text-shadow: 2px 2px rgb(190, 38, 215) !important; */
		color: #fff !important;
		display: flex;
		text-shadow: -1px -1px 0 var(--color-theme-purple), 1px -1px 0 var(--color-theme-purple),
			-1px 1px 0 #000, 1px 1px 0 #000;
	}
</style>

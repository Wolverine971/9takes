<!-- src/lib/components/atoms/scribble.svelte -->
<script lang="ts">
	export let text = '9takes';

	const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let interval: ReturnType<typeof setInterval> | null = null;

	function scribbleScrabble() {
		const name = document.querySelector(`.scrib${text.replace(/\s+/g, '-')}`) as HTMLElement;
		if (!name) return;

		let iteration = 0;
		clearInterval(interval);

		interval = setInterval(() => {
			name.innerText = text
				.split('')
				.map((letter, index) =>
					index < iteration ? name.dataset.value?.[index] : LETTERS[Math.floor(Math.random() * 26)]
				)
				.join('');

			if (iteration >= (name.dataset.value?.length ?? 0)) {
				clearInterval(interval);
			}

			iteration += 1 / 3;
		}, 30);
	}
</script>

<p
	aria-hidden="true"
	class="scribble scrib{text.replace(/\s+/g, '-')}"
	data-value={text}
	on:mouseover={scribbleScrabble}
	on:focus={scribbleScrabble}
	aria-describedby="scribbleDesc"
>
	{text}
</p>
<p id="scribbleDesc" class="visually-hidden">This is a scribble element with text {text}.</p>

<style lang="scss">
	.scribble {
		position: relative;
		font-size: 2rem;
		font-weight: 400;
		margin: 1rem;
		color: var(--accent) !important;
		display: flex;
		text-shadow:
			-1px -1px 0 var(--primary),
			1px -1px 0 var(--primary),
			-1px 1px 0 #000,
			1px 1px 0 #000;
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
</style>

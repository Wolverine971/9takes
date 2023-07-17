<script lang="ts">
	import { onMount } from 'svelte';

	export let peopleList: string[];

	export let type: number;

	// function getRandomElements(arr: string[]) {
	// 	// return [];
	// 	// if (arr.length < 9) {
	// 	// 	throw new Error('Array must contain at least 9 elements.');
	// 	// }

	// 	let randomElements: string[] = [];

	// 	while (randomElements.length < 9) {
	// 		const randomIndex = Math.floor(Math.random() * arr.length);
	// 		const randomElement = arr[randomIndex];

	// 		if (!randomElements.includes(randomElement)) {
	// 			randomElements.push(randomElement);
	// 		}
	// 	}
	// 	// debugger;
	// 	return randomElements;
	// }

	let randomElements: string[] = [];

	// Efficient shuffling algorithm (Fisher-Yates (aka Knuth) Shuffle)
	function shuffleArray(array: string[]) {
		let currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
	let firstGroup: string[] = [];
	let secondGroup: string[] = [];
	let thirdGroup: string[] = [];
	let fourthGroup: string[] = [];
	let fifthGroup: string[] = [];
	let sixthGroup: string[] = [];

	onMount(() => {
		firstGroup = shuffleArray([...peopleList]).slice(0, 9);

		secondGroup = shuffleArray([...peopleList]).slice(0, 9);

		thirdGroup = shuffleArray([...peopleList]).slice(0, 9);

		fourthGroup = shuffleArray([...peopleList]).slice(0, 9);
		fifthGroup = shuffleArray([...peopleList]).slice(0, 9);
		sixthGroup = shuffleArray([...peopleList]).slice(0, 9);
	});

	// Reactive statement to update randomElements when peopleList changes
	$: {
		let shuffledList = shuffleArray([...peopleList]);
		randomElements = shuffledList.slice(0, 9);
	}
</script>

<!-- `/types/${type}s/${visibleImage}.webp`
url({`/types/${type}s/${person}.webp`}) -->
<div>
	<input type="radio" checked id="radio-front" name="select-face" />
	<input type="radio" id="radio-back" name="select-face" />
	<input type="radio" id="radio-left" name="select-face" />
	<input type="radio" id="radio-right" name="select-face" />
	<input type="radio" id="radio-top" name="select-face" />
	<input type="radio" id="radio-bottom" name="select-face" />
	<div class="rubic">
		<div class="cube">
			<div class="cube-face cube-face-front">
				<div class="container">
					{#each firstGroup as person}
						{#if person}
							<div
								class="cell cell-1"
								style="background-image: url({`/types/${type}s/${person}.webp`}); background-repeat: no-repeat; background-size: cover;"
							/>
						{/if}
					{/each}
				</div>
			</div>

			<div class="cube-face cube-face-back">
				<div class="container">
					{#each secondGroup as person}
						{#if person}
							<div
								class="cell cell-1"
								style="background-image: url({`/types/${type}s/${person}.webp`}); background-repeat: no-repeat; background-size: cover;"
							/>
						{/if}
					{/each}
				</div>
			</div>

			<div class="cube-face cube-face-left">
				<div class="container">
					{#each thirdGroup as person}
						{#if person}
							<div
								class="cell cell-1"
								style="background-image: url({`/types/${type}s/${person}.webp`}); background-repeat: no-repeat; background-size: cover;"
							/>
						{/if}
					{/each}
				</div>
			</div>
			<div class="cube-face cube-face-right">
				<div class="container">
					{#each fourthGroup as person}
						{#if person}
							<div
								class="cell cell-1"
								style="background-image: url({`/types/${type}s/${person}.webp`}); background-repeat: no-repeat; background-size: cover;"
							/>
						{/if}
					{/each}
				</div>
			</div>

			<div class="cube-face cube-face-top">
				<div class="container">
					{#each fifthGroup as person}
						{#if person}
							<div
								class="cell cell-1"
								style="background-image: url({`/types/${type}s/${person}.webp`}); background-repeat: no-repeat; background-size: cover;"
							/>
						{/if}
					{/each}
				</div>
			</div>
			<div class="cube-face cube-face-bottom">
				<div class="container">
					{#each sixthGroup as person}
						{#if person}
							<div
								class="cell cell-1"
								style="background-image: url({`/types/${type}s/${person}.webp`}); background-repeat: no-repeat; background-size: cover;"
							/>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.rubic {
		margin: 100px;
		width: 150px;
		height: 156px;
		perspective: 600px;
	}
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 50px 50px 50px;
		grid-column-gap: 3px;
		grid-row-gap: 3px;
		justify-content: center;
		/*align-items:center;*/
	}
	.cube {
		width: 150px;
		height: 156px;
		position: relative;
		margin: 100px;
		transform-style: preserve-3d;
		transition: 0.7s;
	}
	.cube-face {
		width: inherit;
		height: inherit;
		position: absolute;
		background: black;
		backface-visibility: hidden;
	}
	.cube-face-front .cell {
		background-color: blue;
		color: white;
	}
	.cube-face-back .cell {
		background-color: yellow;
		color: white;
	}
	.cube-face-left .cell {
		background-color: green;
		color: white;
	}
	.cube-face-right .cell {
		background-color: red;
		color: white;
	}
	.cube-face-top .cell {
		background-color: orange;
		color: white;
	}
	.cube-face-bottom .cell {
		background-color: grey;
		color: white;
	}

	.cube-face-front {
		transform: translate3d(0, 0, 75px);
	}
	.cube-face-back {
		transform: rotateY(180deg) translate3d(0, 0, 75px);
	}
	.cube-face-left {
		transform: rotateY(-90deg) translate3d(0, 0, 75px);
	}
	.cube-face-right {
		transform: rotateY(90deg) translate3d(0, 0, 75px);
	}
	.cube-face-top {
		transform: rotateX(90deg) translate3d(0, 0, 75px);
	}
	.cube-face-bottom {
		transform: rotateX(-90deg) translate3d(0, 0, 75px);
	}
	#radio-back:checked ~ .rubic .cube {
		transform: rotateY(180deg);
	}
	#radio-left:checked ~ .rubic .cube {
		transform: rotateY(-90deg);
	}
	#radio-right:checked ~ .rubic .cube {
		transform: rotateY(90deg);
	}
	#radio-top:checked ~ .rubic .cube {
		transform: rotateX(90deg);
	}
	#radio-bottom:checked ~ .rubic .cube {
		transform: rotateX(-90deg);
	}
</style>

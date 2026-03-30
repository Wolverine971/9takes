<!-- src/lib/components/molecules/rubixDisplay2.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let peopleList: string[];

	export let type: number;

	// Efficient shuffling algorithm (Fisher-Yates (aka Knuth) Shuffle)
	function shuffleArray(array: string[]) {
		let currentIndex = array.length;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	}
	let firstGroup: string[] = [];
	let secondGroup: string[] = [];
	let thirdGroup: string[] = [];
	let fourthGroup: string[] = [];
	let fifthGroup: string[] = [];
	let sixthGroup: string[] = [];

	let mainGroup: string[] = [];

	onMount(() => {
		firstGroup = shuffleArray([...peopleList]).slice(0, 9);
		secondGroup = shuffleArray([...peopleList]).slice(0, 9);
		thirdGroup = shuffleArray([...peopleList]).slice(0, 9);
		fourthGroup = shuffleArray([...peopleList]).slice(0, 9);
		fifthGroup = shuffleArray([...peopleList]).slice(0, 9);
		sixthGroup = shuffleArray([...peopleList]).slice(0, 9);

		mainGroup = [...firstGroup, ...secondGroup, ...thirdGroup];
		setTimeout(() => {
			setup();
		}, 1000);
	});

	function drawCube(id: string, x: number, y: number, z: number) {
		const cube = document.getElementById(id);
		if (!cube) return;

		cube.style.transform = `rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate3d(${x * 15}vmin,${y * 15}vmin,${z * 15}vmin)`;
	}

	function setup() {
		let num = 1;
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				for (let k = -1; k < 2; k++) {
					drawCube(`c${num}`, i, j, k);
					num++;
				}
			}
		}
	}
</script>

<div id="rubix">
	<div
		id="contain"
		style="transition: 1s; transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg)"
		class="cube"
	>
		{#each mainGroup as person, i}
			<div id="c{i + 1}" class="cube">
				<div class="face front">
					<div class="pop-card" style="aspect-ratio: 1/1" title="">
						<!-- ${firstGroup[Math.floor(Math.random() * 8)] -->
						<img
							class="pop-card-image profileFace tint"
							src={`/types/${type}s/${person}.webp`}
							alt={''}
							in:fly={{ y: 200, duration: 2000 }}
						/>
					</div>
				</div>
				<div class="face back">
					<div class="pop-card" style="aspect-ratio: 1/1" title="">
						<img
							class="pop-card-image profileFace tint"
							src={`/types/${type}s/${person}.webp`}
							alt={''}
							in:fly={{ y: 200, duration: 2000 }}
						/>
					</div>
				</div>
				<div class="face right">
					<div class="pop-card" style="aspect-ratio: 1/1" title="">
						<img
							class="pop-card-image profileFace tint"
							src={`/types/${type}s/${person}.webp`}
							alt={''}
							in:fly={{ y: 200, duration: 2000 }}
						/>
					</div>
				</div>
				<div class="face left">
					<div class="pop-card" style="aspect-ratio: 1/1" title="">
						<img
							class="pop-card-image profileFace tint"
							src={`/types/${type}s/${person}.webp`}
							alt={''}
							in:fly={{ y: 200, duration: 2000 }}
						/>
					</div>
				</div>
				<div class="face top">
					<div class="pop-card" style="aspect-ratio: 1/1" title="">
						<img
							class="pop-card-image profileFace tint"
							src={`/types/${type}s/${person}.webp`}
							alt={''}
							in:fly={{ y: 200, duration: 2000 }}
						/>
					</div>
				</div>
				<div class="face bottom">
					<div class="pop-card" style="aspect-ratio: 1/1" title="">
						<img
							class="pop-card-image profileFace tint"
							src={`/types/${type}s/${person}.webp`}
							alt={''}
							in:fly={{ y: 200, duration: 2000 }}
						/>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	@use 'sass:math';

	.profileFace {
		background-position: center !important;
		background-size: cover !important;
	}
	.tint {
		filter: sepia(100%) hue-rotate(160deg);
		opacity: 0.8;
	}

	.pop-card {
		/* width: 500px; */
		/* width: clamp(400px, 100%, 600px); */
		display: flex;
		border: 1px solid rgb(var(--primary-rgb) / 80%);
		aspect-ratio: 1/1;
		border-radius: 1rem;
		background-color: rgb(var(--primary-rgb) / 15%);
		overflow: hidden;
		position: relative;
		z-index: 10;
		// margin: 1rem;
	}

	.pop-card:hover {
		/* .profileFace {
			filter: blur(1px) !important;
		} */
		img {
			filter: none !important;
		}
	}

	.pop-card > .pop-card-image {
		height: 100%;
		width: 100%;
		// position: absolute;
		z-index: 1;
		left: 0px;
		top: 0px;
		background-size: 300%;
		background-position: 0% 0%;
		-webkit-transition: opacity 1s ease-in-out;
		-moz-transition: opacity 1s ease-in-out;
		-o-transition: opacity 1s ease-in-out;
		transition: opacity 1s ease-in-out;
		object-fit: cover;
		/* animation: pan-image 15s linear infinite; */
	}

	$width: 15vmin;

	@keyframes spin {
		0% {
			transform: rotateZ(-1deg);
		}
		50% {
			transform: rotateZ(1deg);
		}
		100% {
			transform: rotateZ(-1deg);
		}
	}

	@keyframes fade {
		0% {
			opacity: 0;
			// filter: alpha(opacity=0);
			filter: opacity(0);
		}
		40% {
			opacity: 0.8;
			// filter: alpha(opacity=80);
			filter: opacity(80);
		}
		60% {
			opacity: 0.8;
			// filter: alpha(opacity=80);
			filter: opacity(80);
		}
		100% {
			opacity: 0;
			// filter: alpha(opacity=0);
			filter: opacity(0);
		}
	}

	@keyframes ifade {
		0% {
			opacity: 1;
			// filter: alpha(opacity=100);
			filter: opacity(100);
		}
		40% {
			opacity: 0;
			// filter: alpha(opacity=0);
			filter: opacity(0);
		}
		60% {
			opacity: 0;
			// filter: alpha(opacity=0);
			filter: opacity(0);
		}
		100% {
			opacity: 1;
			// filter: alpha(opacity=100);
			filter: opacity(100);
		}
	}

	@keyframes grow {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(2);
		}
		100% {
		}
	}

	#rubix {
		position: relative;
		display: block;
		margin: auto;
		padding: 10rem;
		height: 40vh;
		perspective: 150vmin;
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;

		// -webkit-animation: spin 1s infinite; /* Safari 4.0 - 8.0 */
		// animation: spin 1s infinite;
		-webkit-animation-timing-function: ease-in-out; /* Safari 4.0 - 8.0 */
		animation-timing-function: ease-in-out;
	}

	.cube {
		transition: transform 1s;
		-webkit-transform-style: preserve-3d;
		transform-style: preserve-3d;
		-webkit-animation-timing-function: linear; /* Safari 4.0 - 8.0 */
		animation-timing-function: linear;
	}

	.face {
		position: absolute;
		width: $width;
		height: $width;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		border: solid var(--black) 0.1rem;
		border-radius: 1vmin;

		-webkit-animation: grow 1s; /* Safari 4.0 - 8.0 */
		animation: grow 1s;
		-webkit-animation-timing-function: ease-in-out; /* Safari 4.0 - 8.0 */
		animation-timing-function: ease-in-out;
	}

	#rubix .front {
		background: inherit;
		-webkit-transform: translate3d(math.div(-$width, 2), math.div(-$width, 2), math.div($width, 2))
			rotateX(0deg) rotateY(0deg) rotateZ(0deg);
		transform: translate3d(math.div(-$width, 2), math.div(-$width, 2), math.div($width, 2))
			rotateX(0deg) rotateY(0deg) rotateZ(0deg);
	}

	#rubix .back {
		background: inherit;
		-webkit-transform: translate3d(math.div(-$width, 2), math.div(-$width, 2), 0px) rotateX(0deg)
			rotateY(0deg) rotateZ(0deg);
		transform: translate3d(math.div(-$width, 2), math.div(-$width, 2), math.div(-$width, 2))
			rotateX(0deg) rotateY(0deg) rotateZ(0deg);
	}

	#rubix .right {
		background: inherit;
		-webkit-transform: translate3d(0px, math.div(-$width, 2), math.div($width, 2)) rotateX(0deg)
			rotateY(90deg) rotateZ(0deg);
		transform: translate3d(0px, math.div(-$width, 2), 0px) rotateX(0deg) rotateY(90deg)
			rotateZ(0deg);
	}

	#rubix .left {
		background: inherit;
		-webkit-transform: translate3d(-$width, math.div(-$width, 2), 0px) rotateX(0deg) rotateY(90deg)
			rotateZ(0deg);
		transform: translate3d(-$width, math.div(-$width, 2), 0px) rotateX(0deg) rotateY(90deg)
			rotateZ(0deg);
	}

	#rubix .top {
		background: inherit;
		-webkit-transform: translate3d(math.div(-$width, 2), -$width, 0px) rotateX(90deg) rotateY(0deg)
			rotateZ(0deg);
		transform: translate3d(math.div(-$width, 2), -$width, 0px) rotateX(90deg) rotateY(0deg)
			rotateZ(0deg);
	}

	#rubix .bottom {
		background: inherit;
		-webkit-transform: translate3d(math.div(-$width, 2), 0px, 0px) rotateX(90deg) rotateY(0deg)
			rotateZ(0deg);
		transform: translate3d(math.div(-$width, 2), 0px, 0px) rotateX(90deg) rotateY(0deg)
			rotateZ(0deg);
	}
</style>

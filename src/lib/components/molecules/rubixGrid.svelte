<script lang="ts">
	import { onMount } from 'svelte';
	import PopCard from '../atoms/PopCard.svelte';
	import { fade, fly } from 'svelte/transition';

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

	const setup = async () => {
		// Reactive statement to update randomElements when peopleList changes
		var degX = -20;
		var degY = 45;
		var cubes = [];

		var Cube = function (id, x, y, z) {
			this.id = id;
			this.div = document.getElementById(id);

			this.xo = x;
			this.yo = y;
			this.zo = z;

			this.x = x;
			this.y = y;
			this.z = z;
			this.rotX = 0;
			this.rotY = 0;
			this.rotZ = 0;

			// this.front = this.div.getElementsByClassName('front')[0];
			// this.back = this.div.getElementsByClassName('back')[0];
			// this.right = this.div.getElementsByClassName('right')[0];
			// this.left = this.div.getElementsByClassName('left')[0];
			// this.top = this.div.getElementsByClassName('top')[0];
			// this.bottom = this.div.getElementsByClassName('bottom')[0];

			// if (z == 1) {
			// 	this.front.style.background = 'blue';
			// } else if (z == -1) {
			// 	this.back.style.background = 'green';
			// }
			// if (y == 1) {
			// 	this.bottom.style.background = 'white';
			// } else if (y == -1) {
			// 	this.top.style.background = 'yellow';
			// }
			// if (x == 1) {
			// 	this.right.style.background = 'orange';
			// } else if (x == -1) {
			// 	this.left.style.background = 'red';
			// }
			// this.div.style.background = 'white';

			Cube.prototype.draw = function () {
				if (this.div?.style) {
					this.div.style.transform =
						'rotateX(' +
						this.rotX +
						'deg) rotateY(' +
						this.rotY +
						'deg) rotateZ(' +
						this.rotZ +
						'deg) translate3d(' +
						this.xo * 15 +
						'vmin,' +
						this.yo * 15 +
						'vmin,' +
						this.zo * 15 +
						'vmin)';
				}
			};
		};

		var div = document.getElementById('contain');
		// window.onload = function () {
		var num = 1;
		for (var i = -1; i < 2; i++) {
			for (var j = -1; j < 2; j++) {
				for (var k = -1; k < 2; k++) {
					var cube = new Cube('c' + num, i, j, k);
					cube.draw();
					cubes.push(cube);
					num++;
				}
			}
		}
	};
</script>

<div class="grid">
	{#each firstGroup as person, i}
		<div class="face front grid-item">
			<div class="pop-card" style="aspect-ratio: 1/1" title="">
				<!-- ${firstGroup[Math.floor(Math.random() * 8)] -->
				<img
					class="pop-card-image profileFace tint"
					src={`/types/${type}s/${person}.webp`}
					alt={''}
					in:fly={{ y: 200, duration: 2000 }}
				/>
				<div class="pop-card-user">
					<p class="name-pop" data-value={person.split('-').join(' ')}>
						{person.split('-').join(' ')}
					</p>
				</div>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 10px;
	}

	.grid-item {
		text-align: center;
	}
	.profileFace {
		background-position: center !important;
		background-size: cover !important;
	}
	.tint {
		filter: sepia(100%) hue-rotate(160deg);
		opacity: 0.8;
	}

	.pop-card {
		display: flex;
		justify-content: center;
		border: 1px solid rgb(var(--primary-rgb) / 80%);
		aspect-ratio: 1/1;
		border-radius: 1rem;
		background-color: rgb(var(--primary-rgb) / 15%);
		overflow: hidden;
		position: relative;
		z-index: 10;
		color: var(--color-theme-purple-v);
		// margin: 1rem;
	}

	.pop-card:hover {
		/* .profileFace {
			filter: blur(1px) !important;
		} */
		img {
			filter: none !important;
		}
		color: white;
	}

	.pop-card-user {
		display: flex;
		flex-direction: column;
		justify-content: end;
		align-items: center;
		// gap: 1rem;
		position: relative;
	}
	.name-pop {
		position: relative;
		font-size: 1.5rem;
		font-weight: 200;
		margin: 1rem;
		font-family: 'Source Code Pro', monospace;
		// color: white;
		text-align: center;
		text-transform: uppercase;
		z-index: 1;
	}

	.pop-card > .pop-card-image {
		height: 100%;
		width: 100%;
		position: absolute;
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

	span {
		position: absolute;
		top: 0px;
		left: -10px;

		-webkit-animation: fade 3s infinite; /* Safari 4.0 - 8.0 */
		animation: fade 3s infinite;
		-webkit-animation-timing-function: ease-in-out; /* Safari 4.0 - 8.0 */
		animation-timing-function: ease-in-out;
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
		// position: absolute;
		width: 20rem;
		height: 20rem;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;

		-webkit-animation: grow 1s; /* Safari 4.0 - 8.0 */
		animation: grow 1s;
		-webkit-animation-timing-function: ease-in-out; /* Safari 4.0 - 8.0 */
		animation-timing-function: ease-in-out;
	}

	@media (max-width: 1000px) {
		.face {
			width: 30vw;
			height: 30vw;
		}
	}
	@media (max-width: 800px) {
		// .face {
		// 	// position: absolute;
		// 	width: 5rem;
		// 	height: 5rem;
		// }
		.name-pop {
			font-size: 1rem;
		}
	}
</style>
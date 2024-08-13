<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let peopleList: { name: string; link: string }[];

	export let type: number;

	let randomElements: string[] = [];

	// Efficient shuffling algorithm (Fisher-Yates (aka Knuth) Shuffle)
	function shuffleArray(array: { name: string; link: string }[]) {
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
	let firstGroup: { name: string; link: string }[] = [];
	let secondGroup: { name: string; link: string }[] = [];
	let thirdGroup: { name: string; link: string }[] = [];
	let fourthGroup: { name: string; link: string }[] = [];
	let fifthGroup: { name: string; link: string }[] = [];
	let sixthGroup: { name: string; link: string }[] = [];

	let mainGroup: { name: string; link: string }[] = [];

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
		<a
			class="face front grid-item"
			href={person.link ? `/personality-analysis/${person.name}` : '#'}
		>
			<div class="pop-card" title="">
				<!-- ${firstGroup[Math.floor(Math.random() * 8)] -->
				<img
					class="pop-card-image profileFace tint"
					src={`/types/${type}s/${person.name}.webp`}
					alt={person.name.split('-').join(' ')}
					in:fly={{ y: 200, duration: 2000 }}
				/>
				<div class="pop-card-user">
					<p class="name-pop" data-value={person.name.split('-').join(' ')}>
						{person.name.split('-').join(' ')}
					</p>
				</div>
			</div>
		</a>
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
		color: var(--color-theme-purple-light);
		// margin: 1rem;
	}
	a::after {
		display: none;
	}

	.pop-card:hover {
		/* .profileFace {
			filter: blur(1px) !important;
		} */
		img {
			filter: none !important;
		}
		color: var(--base-white-outline);
	}

	.pop-card-user {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		// gap: 1rem;
		position: relative;
	}
	.name-pop {
		position: relative;
		font-size: 1.5rem;
		font-weight: 200;
		margin: 1rem;
		font-family: var(--font-family);
		color: var(--base-white-outline);
		text-shadow: 1px 1px 1px var(--black);
		// color: var(--base-white-outline);
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

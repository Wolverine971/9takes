<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import Card from '$lib/components/atoms/card.svelte';
	import EmailInvite from '$lib/components/molecules/Email-Invite.svelte';

	let NUM_CONFETTI = 350;
	let COLORS = [
		[84, 7, 217],
		[210, 207, 215],
		[188, 150, 253],
		[41, 39, 43],
		[15, 14, 15]
	];

	// --color-theme-purple: #5407d9; /*84, 7, 217 */
	// --color-theme-purple-v: #d2cfd7; /* 210, 207, 215  */
	// --color-theme-purple-light: #bc96fd;  /* 188, 150, 253  */
	let PI_2 = 2 * Math.PI;
	let w = 0;
	let h = 0;
	let xpos = 0.5;

	let confetti = [];

	function range(a, b) {
		return (b - a) * Math.random() + a;
	}

	class Confetti {
		constructor() {
			this.style = COLORS[Math.floor(range(0, 5))];
			this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
			this.r = Math.floor(range(2, 6));
			this.r2 = 2 * this.r;
			this.speed = 0.7;
			this.replace();
		}

		replace() {
			this.opacity = 0;
			this.dop = 0.03 * range(1, 4);
			this.x = range(-this.r2, w - this.r2);
			this.y = range(-20, h - this.r2);
			this.xmax = w - this.r;
			this.ymax = h - this.r;
			this.vx = 0;
			this.vy = this.speed * this.r + range(-1, 1);
			// this.vy = 0;
		}

		changeVelosity(newRange) {
			if (this.r > 0) {
				// console.log(parseFloat(newRange) * this.r + range(-0.5, 0.5));
				const float = parseFloat(newRange);
				this.speed = float;
				// const radius = float * this.r + range(-0.5, 0.5);
				// if (radius > 0) {
				// 	this.dop = float * range(1, 4);
				// 	this.vy = radius;
				// }
				// this.vx = range(0, 2) + 8 * xpos - 5;
				// this.vy = 0.9 * this.r + range(-0.5, 0.5);
			}
		}
		changeVelosity2(newRange) {
			this.vy = 0.3 * this.r + range(-0.5, 0.5);
			// const radius = 0.3 * this.r + range(-parseFloat(newRange), parseFloat(newRange));
			// if (radius > 0) this.vy = radius;

			// console.log(newRange);
		}

		draw(context) {
			this.x += this.vx;
			this.y += this.vy;
			this.opacity += this.dop;
			if (this.opacity > 1) {
				this.opacity = 1;
				this.dop *= -1;
			}
			if (this.opacity < 0 || this.y > this.ymax) {
				this.replace();
			}
			if (!(0 < this.x && this.x < this.xmax)) {
				this.x = (this.x + this.xmax) % this.xmax;
			}
			drawCircle(
				context,
				Math.floor(this.x),
				Math.floor(this.y),
				this.r,
				`${this.rgb},${this.opacity})`
			);
		}
	}

	for (let i = 0; i < NUM_CONFETTI; i++) {
		confetti.push(new Confetti());
	}

	let animation;

	function step(context) {
		animation = requestAnimationFrame(() => step(context));
		context.clearRect(0, 0, w, h);
		confetti.forEach((c) => c.draw(context));
	}

	function resizeWindow(canvas) {
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight;
	}

	function drawCircle(context, x, y, r, style) {
		context.beginPath();
		context.arc(x, y, r, 0, PI_2, false);
		context.fillStyle = style;
		context.fill();
	}

	let start = 0.7;
	onMount(() => {
		if (browser) {
			const canvas = document.getElementById('world');
			const context = canvas.getContext('2d');
			window.addEventListener('resize', () => resizeWindow(canvas), { passive: true });
			resizeWindow(canvas);
			step(context);

			setInterval(() => {
				if (start > 0) {
					confetti.forEach((c) => {
						c.changeVelosity(`${start}`);
					});
				}
				start = start - 0.05;
			}, 1000);
			setInterval(() => {
				if (start < 0.05 && confetti.length > 0) {
					confetti.length = confetti.length - 10;
					// console.log(confetti);
					// debugger;
				}
			}, 200);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.cancelAnimationFrame(animation);
		}
	});

	let end = 1;
	const slowDown = () => {
		if (browser) {
			confetti.forEach((c) => {
				c.changeVelosity2(end);
			});
			end += 1;
		}
	};
</script>

<canvas id="world" />
<div class="success-div">
	<Card>
		<h1 style="text-align:center">
			Sweet! Cannot wait to show you what we are building
			<!-- Sweet! Cannot wait to show you what we are building -->
		</h1>
		<!-- <p>We just sent you a prototype of what we are building</p> -->

		<!-- <hr /> -->

		<EmailInvite cta={'We are making something 👷🔨 join the waitlist'} />
		<!-- <button type="button" on:click={slowDown}> slow down</button> -->
	</Card>
</div>

<style lang="scss">
	/* Add your styles here */
	.success-div {
		min-height: 60vh;
		display: flex;
		flex-direction: column;
		z-index: 1243434;
	}
	#world {
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		position: absolute;
		left: 0;
		top: 0;
		overflow: hidden;
		/* background: #111; */
	}
</style>

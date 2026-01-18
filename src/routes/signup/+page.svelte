<!-- src/routes/signup/+page.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import Card from '$lib/components/atoms/card.svelte';
	import EmailInvite from '$lib/components/molecules/Email-Invite.svelte';

	const NUM_CONFETTI = 350;
	const COLORS: [number, number, number][] = [
		[84, 7, 217],
		[210, 207, 215],
		[188, 150, 253],
		[41, 39, 43],
		[15, 14, 15]
	];

	const PI_2 = 2 * Math.PI;
	let w = 0;
	let h = 0;

	function range(a: number, b: number): number {
		return (b - a) * Math.random() + a;
	}

	class ConfettiParticle {
		style: [number, number, number];
		rgb: string;
		r: number;
		r2: number;
		speed: number;
		opacity: number = 0;
		dop: number = 0;
		x: number = 0;
		y: number = 0;
		xmax: number = 0;
		ymax: number = 0;
		vx: number = 0;
		vy: number = 0;

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
		}

		changeVelocity(newSpeed: number) {
			if (this.r > 0) {
				this.speed = newSpeed;
			}
		}

		draw(context: CanvasRenderingContext2D) {
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

	let confetti: ConfettiParticle[] = [];
	for (let i = 0; i < NUM_CONFETTI; i++) {
		confetti.push(new ConfettiParticle());
	}

	let animation: number;
	let velocityInterval: ReturnType<typeof setInterval>;
	let fadeInterval: ReturnType<typeof setInterval>;
	let resizeHandler: () => void;

	function step(context: CanvasRenderingContext2D) {
		animation = requestAnimationFrame(() => step(context));
		context.clearRect(0, 0, w, h);
		confetti.forEach((c) => c.draw(context));
	}

	function resizeWindow(canvas: HTMLCanvasElement) {
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight;
	}

	function drawCircle(
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		r: number,
		style: string
	) {
		context.beginPath();
		context.arc(x, y, r, 0, PI_2, false);
		context.fillStyle = style;
		context.fill();
	}

	let speed = 0.7;

	onMount(() => {
		if (browser) {
			const canvas = document.getElementById('world') as HTMLCanvasElement | null;
			if (!canvas) return;

			const context = canvas.getContext('2d');
			if (!context) return;

			resizeHandler = () => resizeWindow(canvas);
			window.addEventListener('resize', resizeHandler, { passive: true });
			resizeWindow(canvas);
			step(context);

			velocityInterval = setInterval(() => {
				if (speed > 0) {
					confetti.forEach((c) => c.changeVelocity(speed));
				}
				speed = speed - 0.05;
			}, 1000);

			fadeInterval = setInterval(() => {
				if (speed < 0.05 && confetti.length > 0) {
					confetti.length = Math.max(0, confetti.length - 10);
				}
			}, 200);
		}
	});

	onDestroy(() => {
		if (browser) {
			cancelAnimationFrame(animation);
			clearInterval(velocityInterval);
			clearInterval(fadeInterval);
			if (resizeHandler) {
				window.removeEventListener('resize', resizeHandler);
			}
		}
	});
</script>

<canvas id="world" class="absolute left-0 top-0 m-0 h-screen w-screen overflow-hidden p-0"></canvas>
<div class="z-[1243434] flex min-h-[60vh] flex-col">
	<Card>
		<h1 class="text-center">Sweet! Cannot wait to show you what we are building</h1>
		<EmailInvite cta="We are making something 👷🔨 join the waitlist" />
	</Card>
</div>

<script lang="ts">
	import type { PageData } from './$types';
	import type { SubmitFunction } from '$app/forms';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	import campfire from '$lib/images/cyber-campfire.png';
	import Footer from './Footer.svelte';
	import CollectEmail from '$lib/components/molecules/Collect-Email.svelte';

	export let data: PageData;

	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log(error);
		}
		cancel();
	};

	onMount(() => {
		height = window.innerHeight;
		window.onscroll = function () {
			scroll();
		};
		window.onresize = function () {
			resetMax();
		};
	});

	let height = 0;
	let transform = '';

	const resetMax = () => {
		height = window.innerHeight;
	};

	const scroll = () => {
		const position = height - window.scrollY;
		if (position > 0 && window.innerWidth > 992) {
			let scrollPercent = (window.scrollY / height) * 100;
			const transformPercentage = Math.floor(scrollPercent);
			// let scroll = window.scrollY / height;

			transform = `transform: translate(${scrollPercent}px);`;
		}
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<main>
	<section class="container" style="padding: 0;">
		<div class="header header-container">
			<span />
			<img src={campfire} alt="group gathered around a fire" class="img-height" style={transform} />
			<span />
			<div style="text-align: center;" class="small-absolute">
				<h1>9takes</h1>
				<h2>Ask questions, share your story, get curious</h2>
			</div>

			<span />
		</div>
		<div class="main">
			<p>Don't you love it when the group chat is popping?💥</p>
			<p>That deep conversation around the campfire 🔥</p>
			<p>
				That late night at a diner with friends where you aren't leaving till they kick you out 🌙
			</p>
			<p>When you just met someone and if feels like you have known them your whole life 🍻</p>
		</div>

		<div class="join">
			<CollectEmail cta={'Join Waitlist'} />
		</div>
		<div class="footer">
			<Footer />
		</div>
	</section>
</main>

<style lang="scss">
	// @import '../scss/index.scss';

	main {
		padding: 0px;
		width: 100%;
	}
	.small-absolute {
		border-radius: 5px;
	}
	.img-height {
		// height: 100vh;
		width: auto;
	}

	@media all and (max-width: 576px) {
		.main {
			text-align: center;
		}
		.small-absolute {
			position: absolute;
		}
		.header-container {
			display: block;
			// display: fle;
			// grid-template-columns: [first] 0% [second] 100% [line3] 0% [col4-start] 100% [five] 0% [end] !important;
			// grid-template-rows: [row1-start] 100vh;
			// justify-items: center;
			// align-items: center;
			// color: white;
			width: 100%;
		}
		.container {
			display: block;
			// display: grid;
			// grid-template-areas:
			// 	'header'
			// 	'main'
			// 	'join'
			// 	'footer';
			// gap: 10px;
			// padding: 10px;
		}
		main {
			padding: 1rem;
		}
	}

	@media all and (max-width: 992px) {
		// .main {
		// 	position: absolute;
		// 	top: 100vh;
		// }
		// .footer {
		// 	position: absolute;
		// 	top: 200vh;
		// }
		.main {
			// margin: 50vh auto;
		}

		.small-absolute {
			position: absolute;
			padding: 10px;
		}
		.header-container {
			display: grid;
			grid-template-columns: [first] 0% [second] 100% [line3] 0% [col4-start] 100% [five] 0% [end] !important;
			grid-template-rows: [row1-start] 100vh [row2-start] 100vh [row3-start] 100vh;
			justify-items: center;
			align-items: center;
			color: white;
			width: 100%;
			overflow: hidden;
		}
		.container {
			display: grid;
			grid-template-areas:
				'header'
				'main'
				'join'
				'footer';
			gap: 10px;
			padding: 10px;
		}
	}

	.header {
		grid-area: header;
		height: 100vh;
		text-align: center;
	}
	.main {
		grid-area: main;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: x-large;
	}

	.join {
		grid-area: join;
		height: 20vh;
		margin: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.footer {
		grid-area: footer;
	}
	.header-container {
		display: grid;
		grid-template-columns: [first] 10% [second] 35% [line3] 10% [col4-start] 35% [five] 10% [end];
		grid-template-rows: [row1-start] 100vh;
		justify-items: center;
		align-items: center;
	}
	.container {
		display: grid;

		grid-template-areas:
			'header header header header header'
			'main main main main main'
			'join join join join join'
			'footer footer footer footer footer';
		gap: 10px;
		padding: 10px;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	body::-webkit-scrollbar {
		width: 4px;
	}

	body::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}

	body::-webkit-scrollbar-thumb {
		background-color: darkgrey;
		outline: 0.5px solid slategrey;
	}
</style>

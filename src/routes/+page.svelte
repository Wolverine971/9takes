<script lang="ts">
	// import type { PageData } from './$types';
	import type { SubmitFunction } from '$app/forms';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	// import campfire from '$lib/images/cyber-campfire.png';
	import Footer from './Footer.svelte';
	import CollectEmail from '$lib/components/molecules/Collect-Email.svelte';
	import PopCard from '$lib/components/atoms/PopCard.svelte';

	// export let data: PageData;

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
	<meta name="description" content="9takes home for enneagram enthusiasts" />
</svelte:head>

<!-- <main> -->
<section class="container" style="padding: 0;">
	<div class="header header-container">
		<PopCard
			image={'cyber-campfire.png'}
			showIcon={true}
			text={'9takes'}
			subtext={'Ask questions, share your story, get curious'}
		/>
	</div>
	<div class="main">
		<h3>What are we building?</h3>
		<p>For the intial launch:</p>
		<ul>
			<li>A question and answering community.</li>
		</ul>

		<h3>Why questions and answers?</h3>
		<p>To find people that think feel and act like you and to explore everyone else.</p>

		<h3>How will this be different?</h3>
		<p>Its kinda a social experiment.</p>
		<ul>
			<li>
				Comments are not visible until you comment, this allows people to give original takes on
				questions without outside influence.
			</li>
			<li>Everyone is default anonymous, you can DM others and optionally reveal yourself</li>
			<li>
				The only thing that identifies you publicly is your enneagram personality type. Overtime you
				will find and learn what yours is.
			</li>
		</ul>

		<h3>When you are with your people it be like</h3>
		<ul>
			<li>A popping group chat ????</li>
			<li>A deep conversation around the campfire ????</li>
			<li>When you just met someone and if feels like you have known them your whole life ????</li>
		</ul>
		<h3>^ Thats what we are trying to build</h3>
		<p>After you find your people, the dialog can begin</p>
	</div>

	<div class="join">
		<CollectEmail cta={'Join Waitlist'} />
	</div>
	<div class="footer">
		<Footer />
	</div>
</section>

<!-- </main> -->
<style lang="scss">
	main {
		padding: 0px;
		width: 100%;
	}
	.small-absolute {
		border-radius: 5px;
	}
	.img-height {
		// height: 100vh;
		width: 100%;
		max-height: 100%;
	}

	@media all and (max-width: 1295px) {
		.main {
			max-width: 70% !important;
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
		.main {
			max-width: 70% !important;
		}

		.small-absolute {
			position: absolute;
			padding: 25px;
		}
		// .header-container {
		// 	display: grid;
		// 	grid-template-columns: [first] 0% [second] 100% [line3] 0% [col4-start] 100% [five] 0% [end] !important;
		// 	grid-template-rows: [row1-start] 100vh [row2-start] 100vh [row3-start] 100vh;
		// 	justify-items: center;
		// 	align-items: center;
		// 	color: white;
		// 	width: 100%;
		// 	overflow: hidden;
		// }
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

	@media all and (max-width: 576px) {
		.main {
			height: auto !important;
			max-width: 90% !important;
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
			gap: 3rem !important;
			// padding: 10px;
		}
		main {
			padding: 1rem;
		}
	}

	.header {
		grid-area: header;
		text-align: center;
		position: relative;
	}
	.main {
		grid-area: main;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: x-large;
		max-width: 50%;
		margin: auto;
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
		place-items: center;
		// height: 100vh;
		// margin: auto;
		// width: 100vw;
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

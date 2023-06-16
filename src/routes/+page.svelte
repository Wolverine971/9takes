<script lang="ts">
	import type { PageData } from './$types';
	import type { SubmitFunction } from '$app/forms';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	import CollectEmail from '$lib/components/molecules/Collect-Email.svelte';

	// export let data: PageData;
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
	<title>9takes Home</title>
	<meta name="description" content="9takes home for enneagram enthusiasts" />
	<link rel="canonical" href="https://9takes.com" />
</svelte:head>

<body>
	<!-- <Jumbotron
		image={'background.png'}
		showIcon={true}
		text={'9takes'}
		subtext={'Ask questions, share your story, get curious'}
		aspectRatio={'16/5'}
	/> -->
	<main>
		<section>
			<div class="column">
				<div class="big-points center-align">
					<h3>What are we building?</h3>
					<p>A better reddit tailored to the enneagram.</p>
				</div>
				<!-- <p>More to come...</p> -->
				<div class="big-points">
					<h3 class="center-align">
						Ask questions- get answers. <br /> Give takes- get takes. <br /> Anonymously.
					</h3>
				</div>
				<!-- <p>
						To find and connect with people that think feel and act like you do. The bet is that
						once you feel understood, you will be ready to understand.
					</p> -->
				<div class="big-points">
					<h3 class="center-align">What is different?</h3>
					<p class="center-align">9takes has some subtle psychology tricks built in.</p>
					<ul>
						<li>- You cannot see comments until you comment.</li>
						<li>- You can sort the comments by personality type.</li>
						<li>- The only thing that identifies you is your personality type.</li>
					</ul>
				</div>

				<!-- <ul>
						<li>
							Comments are not visible until you comment, this allows people to give original takes
							on questions without outside influence.
						</li>
						<li>
							Your identity is publicly hidden and privately shared. Everyone is default anonymous
							but you can message others and optionally reveal what you want. The only thing that
							identifies you publicly is your Enneagram personality type. If you aren't familiar
							with the Enneagram there are a slew of blogs to checkout.
						</li>
					</ul> -->
				<div class="big-points">
					<h3 class="center-align">Aiming to create magic moments that will feel like:</h3>
					<ul>
						<li>- A popping group chat 💥</li>
						<li>- A deep conversation around the campfire 🔥</li>
						<li>
							- The feeling of meeting someone and it is like you have known them your whole life 🍻
						</li>
					</ul>
				</div>
				<div class="big-points center-align">
					<h3>How?</h3>
					<p>By ask questions, sharing your story, and getting curious</p>
				</div>
			</div>
		</section>
	</main>
	<section style="max-width: 64rem;">
		{#if !data?.session?.user}
			<div class="join">
				<CollectEmail cta={'Join Waitlist'} />
			</div>
		{/if}
	</section>
</body>

<style>
	/* Basic styles */
	/* body {
		font-family: 'Motiva Sans', Sans-serif;

		max-width: 64rem;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	} */
	.column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
	.big-points {
		height: 80vh;
		max-width: 50%;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}
	.center-align {
		text-align: center;
	}
	h1 {
		margin: 0;
		text-align: center;
	}
	h2 {
		margin-top: 0;
	}
	ul {
		/* list-style: disc; */
		margin: 0;
		padding: 0;

		list-style: none;
	}
	li {
		margin-left: 1rem;
	}
	a {
		color: #333;
		text-decoration: none;
	}
	/* Header styles */
	header {
		background-color: #333;
		background-image: url('/background.webp');
		color: #fff;
		padding: 20px;
		aspect-ratio: 16 / 6;
		display: flex;
		flex-direction: column;
		justify-content: center;
		-webkit-filter: grayscale(100%);
		filter: grayscale(100%);
	}
	header h2 {
		text-align: center;
		margin: 0;
	}
	/* Navigation styles */
	nav {
		background-color: #f2f2f2;
		border-bottom: var(--classic-border);
		padding: 10px;
	}
	nav ul {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}
	nav li {
		margin: 10px;
	}
	/* Main content styles */
	main {
		margin: 20px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	section {
		flex-basis: calc(50% - 20px);
		margin-bottom: 20px;
		padding: 10px;
		/* background-color: #f2f2f2;
		border: var(--classic-border); */
		box-sizing: border-box;
		margin: auto;
	}
	/* Footer styles */
	footer {
		/* background-color: #333;
		color: #fff; */
		padding: 20px;
		text-align: center;
	}
	/* Media queries */
	@media (max-width: 768px) {
		header h1 {
			font-size: 24px;
		}
		nav li {
			margin: 5px;
		}
		main section {
			flex-basis: calc(100% - 20px);
		}
	}
	@media (max-width: 480px) {
		header h1 {
			font-size: 18px;
		}
		main section {
			flex-basis: 100%;
		}
	}
</style>

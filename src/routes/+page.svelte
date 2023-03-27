<script lang="ts">
	// import type { PageData } from './$types';
	import type { SubmitFunction } from '$app/forms';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	import Footer from './Footer.svelte';
	import CollectEmail from '$lib/components/molecules/Collect-Email.svelte';

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
				<div class="main">
					<h3>What are we building?</h3>
					<p>For the intial launch:</p>
					<ul>
						<li>A question and answering community.</li>
					</ul>

					<h3>Why questions and answers?</h3>
					<p>To find people that think feel and act like you and to explore everyone else.</p>

					<h3>How will this be different?</h3>
					<p>
						9takes is built on first principles and has some psychology behind it. Ultimately it
						will be a social experiment with the goal of moving the needle of societal discourse in
						a positive direction for everyone involved.
					</p>
					<p>
						We are going to be building in some mechanisms to make that happen. Here are a few of
						them:
					</p>
					<ul>
						<li>
							Comments are not visible until you comment, this allows people to give original takes
							on questions without outside influence.
						</li>
						<li>Everyone is default anonymous, you can DM others and optionally reveal yourself</li>
						<li>
							The only thing that identifies you publicly is your enneagram personality type.
							Overtime you will find and learn what yours is.
						</li>
					</ul>

					<h3>We are going to be creating some magic moments that will feel like the following:</h3>
					<ul>
						<li>A popping group chat 💥</li>
						<li>A deep conversation around the campfire 🔥</li>
						<li>
							A feeling you get when you just met someone and it is like you have known them your
							whole life 🍻
						</li>
					</ul>
					<h3>How?</h3>
					<p>By ask questions, sharing your story, and getting curious</p>
				</div>
			</div>
		</section>
	</main>
	<section>
		<div class="join">
			<CollectEmail cta={'Join Waitlist'} />
		</div>
	</section>

	<footer>
		<Footer />
	</footer>
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
	}
	header h2 {
		text-align: center;
		margin: 0;
	}
	/* Navigation styles */
	nav {
		background-color: #f2f2f2;
		border-bottom: 1px solid #5407d9;
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
		border: 1px solid #5407d9; */
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

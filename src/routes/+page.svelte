<script lang="ts">
	import type { PageData } from './$types';
	import type { SubmitFunction } from '$app/forms';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';

	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	// export let data: PageData;
	export let data: PageData;
	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error: logoutError } = await supabase.auth.signOut();
		if (logoutError) {
			console.log(logoutError);
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
	<title>9takes</title>
	<meta name="description" content="9takes, ask questions, give your hot takes, talk to people" />
	<meta property="og:image" content="https://9takes.com/city-of-thought-bubbles.webp" />
	<link rel="canonical" href="https://9takes.com" />
</svelte:head>

<!-- <Jumbotron
		image={'background.png'}
		showIcon={true}
		text={'9takes'}
		subtext={'Ask questions, share your story, get curious'}
		aspectRatio={'16/5'}
	/> -->
<!-- <main> -->
<section>
	<div class="column">
		<div class="big-points center-align">
			<h3>What are we building?</h3>
			<p>
				A better <span style="text-shadow: .5px .5px red;">reddit</span> tailored to the
				<span style="text-shadow: .5px .5px blue;" title="secret sauce">Enneagram</span>.
			</p>
		</div>
		<!-- <p>More to come...</p> -->
		<!-- <p>
						To find and connect with people that think, feel and act like you do. The bet is that
						once you feel understood, you will be ready to understand.
					</p> -->
		<div class="big-points">
			<h3 class="center-align">What is different?</h3>
			<p class="center-align">
				9takes uses <span style="color: #5407d9">psychology</span> to create an honest, engaged and insightful
				community
			</p>
			<ul>
				<li>
					<span style="font-size: 1.5rem;">- You cannot see comments until you comment.</span>
					<ul>
						<li>
							<span style="color: #5407d9">Honest</span> and unbiased feedback comes when people cannot
							see what everyone else is saying.
						</li>
					</ul>
				</li>
				<li>
					<span style="font-size: 1.5rem;">- You can sort the comments by personality type.</span>
					<ul>
						<li>
							<span style="color: #5407d9">Insightful</span> comments come out when people are compared
							to others who are their same personality type? You have to consider what patterns you are
							falling into.
						</li>
					</ul>
				</li>
				<li>
					<span style="font-size: 1.5rem;">
						- The only thing that identifies you is your personality type.
					</span>
					<ul>
						<li>
							<span style="color: #5407d9">Engage</span> with and reveal what you want to who you want
							via direct messages. People can see your answers but they do not know anything else.
						</li>
					</ul>
				</li>
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
			<h3 class="center-align">Creating the following magic moments:</h3>
			<ul>
				<li>
					- Connecting with other people who think, feel, and act like you <br /><span
						style="text-align: center; display: block">💥</span
					>
				</li>
				<li>
					- Going down the rabbit hole of another personality types answers to questions <br /><span
						style="text-align: center; display: block">🐇</span
					>
				</li>
				<li>
					- DMing someone who has many amazing, inspiring and insightful answers to questions <br
					/><span style="text-align: center; display: block">🍻</span>
				</li>
				<li>
					- Getting DM'd and having to decide if you want to reveal yourself or not <br /><span
						style="text-align: center; display: block">👀</span
					>
				</li>
			</ul>
		</div>
		<!-- <div class="big-points center-align">
					<h3>How?</h3>
					<p>By ask questions, sharing your story, and getting curious</p>
				</div> -->
	</div>
</section>
<!-- </main> -->
<section style="max-width: 64rem;">
	{#if !data?.session?.user}
		<div class="join">
			<EmailSignup cta={'Join Waitlist'} />
		</div>
	{/if}
</section>

<style>
	/* Basic styles */

	.column {
		/* display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center; */
		display: grid;
		grid-template-columns: 1fr;
		/* column-count: 3; */
		column-gap: 1.25rem;
		grid-gap: 10rem;
		/* gap: 10%; */
	}
	.big-points {
		/* min-height: 80vh; */
		max-width: 60%;
		min-width: 400px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin: auto;
	}
	.center-align {
		text-align: center;
	}
	h1 {
		word-break: break-all;
		margin: 0;
		text-align: center;
	}
	h2 {
		margin-top: 0;
	}
	h3 {
		font-size: 2rem;
	}
	ul {
		/* list-style: disc; */
		margin: 0;
		padding: 0;

		list-style: none;
	}
	li {
		margin-left: 1rem;
		word-break: normal;
	}
	a {
		color: #333;
		text-decoration: none;
	}
	p {
		word-break: normal;
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

		/* .big-points {
			min-width: 300px;
		} */
	}
	@media (max-width: 480px) {
		header h1 {
			font-size: 18px;
		}
		main section {
			flex-basis: 100%;
		}
		.big-points {
			min-width: 300px;
		}
	}
</style>

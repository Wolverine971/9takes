<script lang="ts">
	import { browser } from '$app/environment';
	import twitter from '$lib/images/twitter.svg';

	let showEmail = false;
	let showLaser = true;
	let innerWidth: number;

	function toggleLaser() {
		showLaser = !showLaser;
	}
</script>

<svelte:head>
	<title>9takes- About Page</title>
	<meta
		name="description"
		content="Answers for what is the purpose of 9takes as well as the inspiration and people behind it"
	/>
	<link rel="canonical" href="https://9takes.com/about" />
</svelte:head>

<svelte:window bind:innerWidth />

<div class="about-container">
	<h1
		style="background-color: black; color: white; border-radius: 8px; padding: .5rem; text-align: center;"
	>
		<span style="color: #833bff ">9takes</span>, ask questions <br /> get different takes
	</h1>

	<section class="profile-section">
		<h2>My name is DJ</h2>
		<div
			class="profile-card"
			on:click={toggleLaser}
			on:keydown={(e) => e.key === 'Enter' && toggleLaser()}
			tabindex="0"
			role="button"
			aria-pressed="false"
		>
			<div class="main">
				<div class="profile-image">
					<picture>
						<source srcset="/brand/djface.png, /brand/djface.png" media="(orientation: portrait)" />
						<img
							src={showLaser ? '/brand/djface.png' : '/brand/djface.png'}
							alt={showLaser ? 'DJ Wayne fun profile picture' : 'DJ Wayne serious profile picture'}
						/>
					</picture>
				</div>
				<div class="profile-info">
					<p>I am Enneagram obsessed and I think social media could be better.</p>
					<p>
						Gotta a tech background and am building 9takes to be the place for us to explore our
						similarities and differences.
					</p>
					<a
						class="twitter-link"
						href="https://twitter.com/djwayne3"
						target="_blank"
						rel="noreferrer"
					>
						<img src={twitter} alt="djwayne3 Twitter" class="icon" />
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class="views-goals">
		<h2>3 Problems, 3 Solutions</h2>
		<ul>
			<li>
				<strong>Social media isn't living up to what it was supposed to be.</strong>
				<p>
					There is no great place to get people's thoughts and opinions anymore. Online
					conversations can quickly turn toxic.
				</p>
			</li>
			<li>
				<strong>It is too risky to be completely honest.</strong>
				<p>
					We have lost the serendipity, playfulness, and the realness that social media was supposed
					to bring us.
				</p>
			</li>
			<li>
				<strong>Social media's customer is advertisers, not its users.</strong>
				<p>Creating a great user experience is secondary to what the advertisers want.</p>
			</li>
		</ul>
		<p class="highlight">Optimize social media, don't cower in fear of the advertisers' opinions</p>
		<p>
			The only opinions that should matter are the user's opinions. 9takes has a way to <strong
				>optimize engagement and honesty</strong
			> while not sacrificing safety and inclusivity.
		</p>
	</section>

	{#if browser}
		<div class="video-container">
			<iframe
				src="https://www.youtube.com/embed/-IYvvm8gzqw?si=8MaKuA5vfTpcXhGN"
				title="Meetup presentation about how social media messes up 'socializing'"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
				loading="lazy"
			/>
		</div>
	{/if}

	<section id="why-divided">
		<h3>
			When you spend +70% of your time autopilot- <br /> you cannot handle diversity of thought
		</h3>
		<p>Social media platforms are putting people putting you on autopilot.</p>
		<p>
			I got married during a stressful time when I was leaving the military. My wife and I were
			fighting, and it got to a point where we felt helpless in resolving our conflict. We loved
			each other, but we could not understand each other. Long story short, <a
				href="/community/inspiration-for-9takes">my wife convinced me to take a personality test</a
			>.
		</p>
		<p>
			I was blown away. The results told me things about myself that I felt deeply but had never put
			into words. It not only helped me understand myself but it also helped my spouse and I find
			common ground and resolve our conflict.
		</p>
		<p class="highlight">
			If understanding my own personality could help me, how much could it help everyone else?
		</p>
	</section>

	<section id="what-is-9takes">
		<h2>What is 9takes</h2>
		<p>
			9takes is a question-and-answer platform based on personality. It is Reddit reimagined based
			on a personality system called the Enneagram.
		</p>
		<p>There are two twists:</p>
		<ul>
			<li>
				You can only see answers to questions once you comment. That is so that people are honest
				and unbiased.
			</li>
			<li>
				You are anonymous except for your personality. "Personality" is the perfect context for
				learning about yourself and others.
			</li>
		</ul>
		<p>
			These two differences when combined create the structure for having productive conversations
			online.
		</p>
	</section>

	<section id="philosophy">
		<h3>The philosophy of 9takes</h3>
		<p>"Everyone is unique." ✨</p>
		<p>
			We know that everyone is different intellectually, but we don't operate that way. People (not
			you 😉) get surprised when someone doesn't agree with them. They think "surely if that other
			person had all the facts, was smart, kind they would agree with your point of view." People
			forget that other people can have facts, be smart and kind, have similar experiences, AND
			still disagree.
		</p>
		<p>
			9takes is about leaning into these disagreements and embracing these differences because, in
			the end, we all learn something, becoming better 👍 faster ⚡ and stronger 💪.
		</p>
		<p>
			<strong
				>"Technology" should open us up to new things, not create bubbles where we hear the same
				perspective repeatedly. 9takes is opening the conversation back up and dishing out fresh
				takes.</strong
			>
		</p>
	</section>

	<section id="why-enneagram">
		<h3>Why the Enneagram?</h3>
		<p>
			Enneagram is the secret sauce. It has some deep roots and sits at the crossroads of psychology
			and philosophy. <a href="/enneagram-corner/philosophy-psychology-and-the-enneagram"
				>Plato and Freud would have been fans of the Enneagram.</a
			>
		</p>
		<p>
			It is used by niche life coaches and as a tool for certain psychologists and therapists. But
			it is not mainstream and won't be for some time.
		</p>
		<p>
			We use it because it identifies a person's core motivations and fears. Typically, people
			figure out their type through being guided or through self-reflection. We are not going to
			tell you what your "Enneagram type" that is for you to discover.
		</p>
	</section>

	<section id="why-questions">
		<h3>Why focus on questions and answers?</h3>
		<p>
			Because the process of forming and asking a question is a mental unlock. When you are asking
			questions, you are growing. When you have run out of questions, you stop growing, and you not
			only run out of answers, you run out of hope.
		</p>
		<p>For example, in your daily life, you may be asking yourself, "Why can't people..."</p>
		<ul>
			<li>do things the right way?</li>
			<li>be more grateful for all the things I do for them?</li>
			<li>appreciate my hard work and success?</li>
			<li>understand my unique perspective and emotions?</li>
			<li>respect my need for privacy and independence?</li>
			<li>be more reliable and trustworthy?</li>
			<li>have more fun and excitement?</li>
			<li>be more honest and dish out the hard truth.</li>
			<li>get along and find common ground?</li>
		</ul>
		<p>
			There are endless questions to ask. Fortunately, there are endless people with answers and
			perspectives you can learn from. They also have questions like yours and will share if you ask
			them. Some people see the world like you, and others see a vastly different world.
		</p>
		<p>
			9takes is about embracing these differences or "takes" on the world. By asking questions,
			sharing stories, and getting curious, people will be connected to the community around them.
		</p>
	</section>

	<section class="email-section">
		<h3>Message me 👀</h3>
		<p>Got feedback or suggestions? Let me know!</p>
		{#if !showEmail}
			<button type="button" class="btn btn-primary" on:click={() => (showEmail = true)}
				>Show Email</button
			>
		{:else}
			<p><a href="mailto:dj@9takes.com">dj@9takes.com</a></p>
			<p><a href="mailto:userSup@9takes.com">userSup@9takes.com</a></p>
		{/if}
	</section>
</div>

<style lang="scss">
	.about-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		// font-family: Arial, sans-serif;
		line-height: 1.6;
		color: #333;
	}

	h1,
	h2,
	h3 {
		color: var(--primary-dark);
	}

	.profile-card {
		background: linear-gradient(to right, #000, var(--primary), #000);
		border-radius: 10px;
		padding: 2px;
		cursor: pointer;

		.main {
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 10px;
			padding: 2px;
			background-color: var(--lightest-gray);

			@media (min-width: 768px) {
				flex-direction: row;
			}
		}
	}

	.profile-image {
		width: 100%;
		max-width: 250px;
		margin-bottom: 20px;

		@media (min-width: 768px) {
			width: 50%;
			margin-bottom: 0;
			// margin: 1rem;
		}

		img {
			width: 100%;
			height: auto;
			border-bottom-left-radius: 10px;
			object-fit: cover;
		}
	}

	.profile-info {
		padding: 20px;
		border-radius: 8px;
		width: 100%;
	}

	.twitter-link {
		display: inline-flex;
		align-items: center;
		background: #f0f0f0;
		padding: 8px;
		border-radius: 5px;
		margin-top: 10px;
		transition: background-color 0.3s;

		&:hover {
			background-color: #e0e0e0;
		}

		img {
			width: 24px;
			height: 24px;
		}
	}

	.highlight {
		font-size: 1.5rem;
		color: var(--primary);
		font-weight: bold;
		margin: 20px 0;
		text-align: center;
	}

	.video-container {
		position: relative;
		padding-bottom: 56.25%;
		height: 0;
		overflow: hidden;
		margin: 20px 0;

		iframe {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}

	ul {
		padding-left: 20px;
	}

	.email-section {
		background-color: #f0f0f0;
		border-radius: 8px;
		padding: 20px;
		margin-top: 40px;
		text-align: center;
	}

	a {
		color: var(--primary-dark);
		text-decoration: none;
		position: relative;

		&::after {
			content: '';
			display: inline-block;
			width: 1em;
			height: 1em;
			background-image: url('/icons/arrow.svg');
			background-size: contain;
			margin-left: 5px;
			vertical-align: middle;
		}
	}
</style>

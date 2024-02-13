<script lang="ts">
	// import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import twitter from '$lib/images/twitter.svg';

	let showEmail = false;
	let showLaser = true;
	let innerWidth = 0;
	// https://www.youtube.com/shorts/2362fFtFQN4

	import { browser } from '$app/environment';
</script>

<svelte:head>
	<title>About 9takes</title>
	<meta
		name="description"
		content="Answering what is the purpose, inspiration, and who is behind 9takes"
	/>
	<link rel="canonical" href="https://9takes.com/about" />
</svelte:head>

<svelte:window bind:innerWidth />

<div class="main-div">
	<h1 style="text-align: center;">Allow me to introduce myself</h1>

	<div>
		<div
			style="display: flex; justify-content: center; align-items: center; gap: 2rem; {innerWidth <
			500
				? 'flex-direction: column;'
				: ''}"
		>
			<div
				class="profile-section"
				role="img"
				on:click={() => (showLaser = !showLaser)}
				on:mouseenter={() => (showLaser = true)}
				on:mouseleave={() => (showLaser = false)}
				on:keydown={(e) => {
					if (e?.key === 'Enter') showLaser = !showLaser;
				}}
			>
				<picture class="flex-center">
					{#if showLaser}
						<source
							style="display: {showLaser ? 'block' : 'none'};"
							srcset="/brand/dj-lazer-eyes.webp, /brand/s-dj-lazer-eyes.webp"
							media="(orientation: portrait)"
						/>
					{:else}
						<source
							style="display: {showLaser ? 'none' : 'block'};"
							srcset="/brand/dj-profile-pic.webp, /brand/s-dj-profile-pic.webp"
							media="(orientation: portrait)"
						/>
					{/if}
					<img
						style="display: {showLaser
							? 'none'
							: 'block'}; height: 250px; width: 250px; border-radius: 50%; object-fit: cover;"
						src="/brand/dj-lazer-eyes.webp"
						alt="DJ Wayne fun profile picture"
					/>
					<img
						style=" display: {showLaser
							? 'block'
							: 'none'}; height: 250px; width: 250px; border-radius: 50%; object-fit: cover;"
						src="/brand/s-dj-profile-pic.webp"
						alt="DJ Wayne serious profile picture"
					/>
				</picture>
				<div>
					<p style="margin-bottom: 0;">
						I am a software engineer at a YC-backed logistics startup. I have taken what I have
						learned working on logistics problems and have applied it to building a social
						community.
					</p>
					<span>
						<a
							style="background: aliceblue; padding: .5rem; border-radius: 5px; margin: .2rem; display: inline-flex;"
							target="_blank"
							rel="noreferrer"
							href="https://twitter.com/djwayne3"
						>
							<img loading="lazy" src={twitter} alt="djwayne3 Twitter" class="icon" />
						</a>
					</span>
				</div>
			</div>
		</div>

		<h2>Why am I building 9takes?</h2>
		<ul>
			<li>social media sucks</li>
			<li>people are divided</li>
		</ul>
		<h3 style="margin: 1.5rem 0">Why social media sucks:</h3>
		<!-- <h1 style="text-decoration: underline; text-align: center">We need a redo on social media</h1> -->
		<p>
			<b>Social media isn't living up to what it was supposed to be:</b> There is no great place to get
			people's thoughts and opinions anymore. Online conversations can quickly turn toxic. If you make
			a statement, 5 trolls are waiting for you in the comments, ready to kill the conversation.
		</p>
		<p>
			<b>It is too risky for your brand, to be completely honest:</b> All the people who like you for
			one reason might not like you for another reason or in another context. We have lost the serendipity,
			playfulness, and the realness that social media was supposed to bring us. That's why 9takes is
			here.
		</p>
		<p>
			<b>Social media is for advertisers, not for people being social:</b> Now, social media companies
			have to deal with and optimize many moving parts and tradeoffs. Creating a great user experience
			is often secondary to what the advertisers want. What may start out as a great social media platform
			can quickly turn into an add ridden mess filled with bots. Running a social media company is more
			like running a logistics company than a media company. The existing platforms provided a rough
			draft, but it is time for a redo.
		</p>

		<div style="color: #5407d9; font-weight: bold; font-size: 2rem; margin: 2rem 0;">
			<span
				>Optimize social media, don't police it and go after short-term cash like a dusty newspaper
				editor
			</span>
			<br />
			<span style="display: flex; justify-content: center;">🙅‍♂️ 💨</span>
		</div>

		<p>
			It is possible to <b>optimize for engagement and honesty</b> while not sacrificing safety and inclusively.
			Social media today has made too many short-term decisions and has paved the way for what is not
			to do. See the video below:
		</p>
		{#if browser}
			<div style="display:flex; align-items: center; justify-content: center;">
				<iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/-IYvvm8gzqw?si=8MaKuA5vfTpcXhGN"
					title="Meetup presentation about how social media messes up 'socializing'"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				/>
			</div>
		{/if}

		<h3 style="margin: 1.5rem 0">On people being divided</h3>

		<p>
			I got married during a stressful time in my life when I was leaving the military. My wife and
			I were fighting, and it got to a point where we were at each others throats and we felt
			helpless in resolving our conflict. We loved each other, but we could not understand each
			other. That is when
			<a href="/blog/community/inspiration-for-9takes" style="font-size: 1.2rem;">
				my wife convinced me to take a personality test</a
			>. I was blown away. It told me things about myself that I had never put into words. It not
			only helped me understand my spouse and find common ground, but, it was helping me understand
			myself.
		</p>
		<p>
			It felt like I had been living my life on auto pilot, and I finally got to peak into the
			cockpit. I wanted to talk more about it and connect with others. I felt like people who do
			psychedelics and want everyone to do psychedelics. The problem was finding other people to
			explore personality further.
		</p>
		<p style="color: #5407d9; font-weight: bold; font-size: 2rem; margin: 2rem 0;">
			If understanding my own personality could help me, how much could it help everyone else?
		</p>
	</div>
	<h2>What is 9takes</h2>
	<p>
		9takes is an Anonymous question-and-answer platform based on personality. It is Reddit
		reimagined based on a personality system called the Enneagram. Two things make it different:
	</p>

	<ul>
		<li>
			You can only see answers to questions once you comment. That is so that people are honest and
			unbiased.
		</li>
		<li>
			You are anonymous except for your personality. "Personality" is the perfect context for
			learning about yourself and others.
		</li>
	</ul>

	<h3>The philosophy of 9takes</h3>

	<p>
		<b>"Everyone is unique," ✨</b><br />we know that intellectually. But why do some people (not
		you 😉) get surprised when someone doesn't agree with them? Surely if that other person had all
		the facts, was smart, kind and had your experience they would agree with your point of view. We
		forget that others can have facts, be smart and kind, have similar experiences, AND still
		disagree. 9takes is about leaning into these disagreements and embracing these differences
		because, in the end, we all learn something, becoming better 👍 faster ⚡ and stronger 💪.

		<br /><br />
		<b>
			"Technology" should open us up to new things, not create bubbles where we hear the same
			perspective repeatedly. 9takes is opening the conversation back up and dishing out fresh
			takes.
		</b>
		<!-- <br /><br />
        Our perspectives, thoughts, emotions, and ways of doing things differ. We may know that
        in our head, but how often are we surprised when others are not thinking, feeling, and acting like
        we do? When we realize someone doesn't think like us, do we think, “Wow, I wonder what their perspective
        is and why they think that," or do we think that a person is not smart or maybe they don't have all
        the information? When we see others not feeling like we do on a certain subject, do we
        recognize the layers beneath the feelings, or Are we morally superior to them? And when someone doesn't
                                    act like us, does that make us curious or dismissive? -->
	</p>

	<h3>Why the Enneagram?</h3>
	<p>
		Enneagram is the secret sauce. It has some deep roots and sits at the crossroads of psychology
		and philosophy. <a href="/blog/enneagram/philosophy-psychology-and-the-enneagram">
			Plato and Freud would have been fans of the Enneagram.
		</a>
		It is used by niche life coaches and as a tool for certain psychologists and therapists. But it is
		not mainstream and won't be for some time.
		<br /><br />
		We use it because it identifies a person's core motivations and fears. Typically, people figure out
		their type through being guided or through self-reflection. We are not going to tell you what your
		"Enneagram type" that is for you to discover.
	</p>

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

	<div class="email-section">
		<h3>Email me</h3>
		<p>Got feedback or suggestions? Let me know!</p>
		<p>
			{#if !showEmail}
				<button type="button" class="btn btn-primary" on:click={() => (showEmail = true)}
					>Show Email</button
				>
			{/if}
			{#if showEmail}
				<p><a href="mailto:dj@9takes.com">dj@9takes.com </a></p>
				<p><a href="mailto:userSup@9takes.com">userSup@9takes.com </a></p>
			{/if}
		</p>
	</div>
</div>

<!-- <div style="margin:2rem;">
	{#if !data?.session?.user}
		<EmailSignup cta={'Join Waitlist'} />
	{/if}
</div> -->
<style lang="scss">
	.main-div {
		margin: 20px;
	}
	.email-section {
		text-align: center;
		border: var(--classic-border);
		padding: 2rem;
		border-radius: 5px;
	}
	.profile-section {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background-image: linear-gradient(
			to right,
			black,
			var(--color-theme-purple) 200px,
			black 800px
		);
		border-radius: 10px;
		color: white;
		font-size: 1.3rem;

		picture,
		div {
			width: 50%;
		}
	}
	a {
		color: #260958;
		align-items: center;
		overflow: hidden;

		&::after {
			content: '';
			background-image: url('/icons/arrow.svg');
			display: inline-block;
			vertical-align: middle;
			align-items: center;
			width: 1em;
			height: 1em;
			background-size: 1em 1em;
		}
	}

	@media all and (max-width: 576px) {
		.main-div {
			margin: 20px 5px;
		}

		.profile-section {
			flex-direction: column;

			picture,
			div {
				width: 100%;
			}
		}
	}
</style>

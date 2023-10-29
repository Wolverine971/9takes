<script lang="ts">
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	let showEmail = false;
</script>

<svelte:head>
	<title>About 9takes</title>
	<meta
		name="description"
		content="Answering what is the purpose, inspiration, and who is behind 9takes"
	/>
	<link rel="canonical" href="https://9takes.com/about" />
</svelte:head>

<div style=" margin:20px;">
	<h1 style="text-align: center;">Who is behind 9takes and what is it?</h1>

	<div style="margin:20px;">
		<div>
			<div style="margin:20px;">
				<h2>Right now, just me, DJ</h2>
				<p>
					I am an engineer at a YC backed startup working on logistics. I am taking my understanding
					of logistics and applying it to running a well oiled social community. There are many
					moving parts and tradeoffs that social media companies have to make. I think it is
					possible to optimize for engagement and honesty while also making the 9takes platform safe
					and inclusive. Social media today has made too many short term decisions and has paved the
					way for what not to do. See the video below:
				</p>
				<div style="display:flex; align-items: center; justify-content: center;">
					<iframe
						width="560"
						height="315"
						src="https://www.youtube.com/embed/-IYvvm8gzqw?si=3UEXg3eGSfzSW7N2"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					/>
				</div>

				<p>
					<a href="/blog/community/inspiration-for-9takes"
						>I got into personality because of my wife.</a
					>
					I was blown away by it similar to how people are blown away by taking psychedelics. The problem
					was when I tried to find a community to explore personality further. There is more to it but
					thats why I am building 9takes. I would love to connect with you and hear about how you view
					personality and hear any thoughts or suggestions you have for how to build a better social
					media platform. DM me on
					<a
						class="external-link"
						target="_blank"
						rel="noreferrer"
						href="https://twitter.com/djwayne3">Twitter/ X</a
					>.
				</p>

				<!-- <p>I am a Software Engineer who has gained a lot of value from the enneagram in his personal life. I am amazed that the enneagram isn't in the common </p> -->
				<!-- <ul>
                <li>
                    <a class="external-link" target="_blank" href="https://github.com/Wolverine971">Github</a>
                </li>
                <li>
                    <a class="external-link" target="_blank" href="https://twitter.com/djwayne3">Twitter</a>
                </li>
            </ul> -->
			</div>
		</div>
	</div>
	<h2>What is 9takes</h2>
	<p>
		9takes is reddit reimagined based on personality. Its based on questions and answers, and there
		are 2 catches:
	</p>

	<ul>
		<li>
			You cannot see answers to questions untill you comment. That is so that people are honest and
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
		perspectives you can learn from. They also have questions like you and will share if you ask
		them to. Some people see the world like you, and others see a vastly different world.
	</p>
	<p>
		9takes is about embracing these differences or "takes" on the world. By asking questions,
		sharing stories, and getting curious, people will be connected to the community around them.
	</p>

	<h3>Email me</h3>
	<p>Got feedback or suggestions? Let me know!</p>
	<p>
		{#if !showEmail}
			<button type="button" on:click={() => (showEmail = true)}>Show Email</button>
		{/if}
		{#if showEmail}
			<ul>
				<li><a href="mailto:dj@9takes.com">dj@9takes.com</a></li>
				<li><a href="mailto:userSup@9takes.com">userSup@9takes.com</a></li>
			</ul>
		{/if}
	</p>
</div>

<div style="margin:2rem;">
	{#if !data?.session?.user}
		<EmailSignup cta={'Join Waitlist'} />
	{/if}
</div>

<style lang="scss">
	.row {
		display: flex;
		justify-content: space-around;
	}
	p {
		margin: 1em;
	}
	a {
		color: #260958;
		display: inline-flex;
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
</style>

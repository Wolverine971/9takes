<script lang="ts">
	import CollectEmail from '$lib/components/molecules/Collect-Email.svelte';

	import type { PageData } from '../$types';

	export let data: PageData;
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
	<h1 style="text-align: center;">About 9takes</h1>

	<p>
		<b>Everyone is unique, ✨</b><br />we know that intellectually. But why do some people (not you
		😉) get surprised when someone doesn't agree with them. Surely if that other person had all the
		facts, was smart, kind and had your experience they would totally agree with your point of view.
		We forget that other people can have facts, be smart, kind and have similar experiences AND
		still disagree. 9takes is about leaning into these disagreements and embracing these differences
		because, in the end, we all learn something, becoming better 👍 faster ⚡ and stronger 💪.

		<br /><br />
		<b>
			"Technology" should open us up to new things, not create bubbles where we hear the same
			perspective over and over. 9takes is opening the conversation back up and dishing out fresh
			takes.
		</b>
		<!-- <br /><br />
        Our perspectives, thoughts, emotions, and ways of doing things are all different. We may know that
        in our head but how often are we surprised when others are not thinking, feeling, and acting like
        we do? When we realize someone doesn't think like us, do we think “Wow, I wonder what their perspective
        is and why they think that," or do we think that a person is not smart or maybe they don't have all
        the information? When we see others not feeling the way we feel we feel on a certain subject do we
        recognize the layers beneath the feelings or Do we morally superior to them? And when someone doesn't
        act like us does that make us curious or dismissive? -->
	</p>

	<h3>What was the inspiration for 9takes?</h3>
	<p>
		<a href="/blog/community/inspiration-for-9takes"
			>TLDR, I got married and my wife and I were fighting a lot
		</a>
	</p>

	<h3>Why the Enneagram?</h3>
	<p>
		Enneagram is the secret sauce. It has some deep roots and sits at the crossroads of psychology
		and philosophy. <a href="/blog/enneagram/enneagram-lineage">
			Plato and Freud would have been fans of the Enneagram.
		</a>
		Currently, it is used by niche life coaches and as a tool for certain psychologists and therapists.
		But it is not mainstream and probably won't be for some time.
		<br /><br />
		We use it because it identifies a person's core motivations and fears. Through guided or through
		Self-reflection people figure out their type. We are not going to tell you what your "Enneagram type"
		is, that is for you to discover.
	</p>

	<h3>Why focus on questions and answers?</h3>
	<p>
		Because the process of forming and asking a question is a mental unlock. When you are asking
		questions you are growing. When you have run out of questions you stop growing and you not only
		run out of answers, you run out of hope.
	</p>
	<p>For example, in your daily life you may be asking yourself:</p>
	<ul>
		<li>Why can't people just do things the right way?</li>
		<li>Why can't people be more grateful for all the things I do for them?</li>
		<li>Why can't people just appreciate my hard work and success?</li>
		<li>Why can't people understand my unique perspective and emotions?</li>
		<li>Why can't people respect my need for privacy and independence?</li>
		<li>Why can't people just be more reliable and trustworthy?</li>
		<li>Why can't people just have more fun and excitement?</li>
		<li>Why can't people be more honest and dish out the hard truth?</li>
		<li>Why can't people just get along and find common ground?</li>
	</ul>
	<p>
		There are endless questions to ask. Fortunately, there are endless people out there with answers
		and perspectives that you can learn from. They also have questions like you and will share if
		you ask them to. Some people see the world like you and there are others who see a vastly
		different world.
	</p>
	<p>
		9takes is about embracing these differences or "takes" on the world. And by asking questions,
		sharing stories, and getting curious we will find our community and find our way.
	</p>
</div>

<div style="margin:20px;">
	<h2 style="text-align: center;">People Behind 9takes</h2>
	<div>
		<div style="margin:20px;">
			<h3>Right now, just me, DJ</h3>
			<p>
				I am a techy, ex-military, most days happily married with 2 kids running around getting into
				the highest of hijinks. My wife got me into the enneagram and I have been obsessed since. I
				share my thoughts and opinions down below but would love to hear yours. Feel free to message
				me <a target="_blank" href="https://twitter.com/djwayne3">here</a>.
			</p>

			<!-- <p>I am a Software Engineer who has gained a lot of value from the enneagram in his personal life. I am amazed that the enneagram isn't in the common </p> -->
			<!-- <ul>
                <li>
                    <a target="_blank" href="https://github.com/Wolverine971">Github</a>
                </li>
                <li>
                    <a target="_blank" href="https://twitter.com/djwayne3">Twitter</a>
                </li>
            </ul> -->
		</div>
		<div style="margin:20px;">
			<h3>I am also looking for help ✋</h3>
			<p>DM me on Twitter <a target="_blank" href="https://twitter.com/djwayne3">here</a></p>
		</div>
	</div>
</div>

<div style="margin:2rem;">
	{#if !data?.session?.user}
		<CollectEmail cta={'Join Waitlist'} />
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

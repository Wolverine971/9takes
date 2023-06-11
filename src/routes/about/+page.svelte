<script lang="ts">
	import CollectEmail from '$lib/components/molecules/Collect-Email.svelte';

	import type { PageData } from '../$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>About 9takes</title>
	<meta name="description" content="About 9takes" />
	<link rel="canonical" href="https://9takes.com/about" />
</svelte:head>

<div style=" margin:20px;">
	<h1 style="text-align: center;">About 9takes</h1>

	<p>
		We believe everyone is unique. Our perspectives, thoughts, emotions, and ways of doing things
		are all different. We may know that in our head but how often are we surprised when others are
		not thinking, feeling, and acting like we do. When we realize someone doesn't think like us, do
		we think "wow, I wonder what their perspective is and why they think that," or do we think that
		a person is not smart or maybe they don't have all the information. When we see others not
		feeling the way we feel we feel on a certain subject do we recognize the layers beneath the
		feelings or Do we morally superior to them? And when someone doesn't act like us does that make
		us curious or dismissive?
	</p>
	<p>
		All this is exciting territory to explore and 9takes thinks that there is a technology element
		That is holding us back from exploring these potential conversations.
	</p>
	<p>
		Our goal is to remind people that those around us are complex, interesting worthy of being
		listened to. We also recognize that exploring and sharing with other people does present both
		opportunities and challenges. The challenges arise when we make assumptions when we should
		instead be curious. And the opportunities come when we get curious. What are you missing out on?
		What perspective is hidden from you?
	</p>
	<ul>
		<li>Why can't people just do things the right way?</li>
		<li>Why can't people be more grateful for all the things I do for them?</li>
		<li>Why can't people just appreciate my hard work and success?</li>
		<li>Why can't people understand my unique perspective and emotions?</li>
		<li>Why can't people respect my need for privacy and independence?</li>
		<li>Why can't people just be more reliable and trustworthy?</li>
		<li>Why can't people just have more fun and excitement?</li>
		<li>Why can't people be more honest and straightforward with me?</li>
		<li>Why can't people just get along and find common ground?</li>
	</ul>
	<p>
		There are endless questions to ask. But fortunately there endless people out there that have
		questions like you do and will share if you ask them to. Who see the world like you and who sees
		a vastly different world?
	</p>
	<p>
		9takes is about embracing these differences or "takes" on the world. And by asking questions,
		sharing stories and getting curious we will find our community and find our way.
	</p>
</div>

<div style="margin:20px;">
	<h2 style="text-align: center;">People Behind 9takes</h2>
	<div>
		<div style="margin:20px;">
			<h3>DJ Wayne</h3>
			<p>
				I am a tech guy. I was former military and my wife got me into the enneagram and I have been
				obsessed since. I don't exactly know why there isn't a centralized platform for the
				Enneagram and I don't know why there isn't a community like 9takes. I have thoughts and
				opinions but would love to hear yours. Feel free to message me <a
					target="_blank"
					href="https://twitter.com/djwayne3">here</a
				>.
			</p>

			<!-- <p>I am a Software Engineer who has gained a lot of value from the enneagram in his personal life. I am amazed that the enneagram isn't in the common </p> -->
			<ul>
				<li>
					<a target="_blank" href="https://github.com/Wolverine971">Github</a>
				</li>
				<li>
					<a target="_blank" href="https://twitter.com/djwayne3">Twitter</a>
				</li>
			</ul>
		</div>
		<div style="margin:20px;">
			<h3>Looking for help</h3>
			<p>DM me on twitter <a target="_blank" href="https://twitter.com/djwayne3">here</a></p>
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

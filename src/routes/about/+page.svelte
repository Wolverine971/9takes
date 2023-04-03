<script>
	import CollectEmail from '$lib/components/molecules/Collect-Email.svelte';
</script>

<svelte:head>
	<title>About 9takes</title>
	<meta name="description" content="About 9takes" />
</svelte:head>

<div class="text-column">
	<h1>About 9takes</h1>

	<p>
		Everyone is unique and has their own perspectives, thoughts, and emotions. We may know that
		intellectually but we often find ourselves expecting others to think, feel, and act like we do.
		When we see others not thinking like us we think the other side is not smart or doesn't have all
		the information. When we see others not feeling the way we feel we feel like they do not like us
		or get us or maybe they are a bad person. And when someone doesn't act like us we think all the
		above and assume the person is inexperienced. This is an over simplistic description of how we
		think, feel and act towards others however if we catch ourselves we will often find that our
		inner dialog is simplistic towards others as well.
	</p>
	<p>
		The goal of 9takes is to remind us that those around us are just as complex as we are. With that
		complexity comes both challenges and opportunities. The challenges arise when we assume other
		people should think, feel and act like we do. And the opportunities come when we realize that
		people don't think, feel and act like we do. What are you missing out on? What perspective is
		hidden from you?
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
		There are endless questions to ask and there are both people who see the world as we do and
		others who see a vastly different world. When we do not embrace these differences it can cause
		us to feel of anger, anxiety, or disconnected. Let us embrace these differences, by asking
		questions, sharing stories and getting curious. In doing so we will find our community and find
		our way.
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
				Enneagram and I don't know why there isn't a community like the 9takes. I have thoughts and
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
	<CollectEmail cta={'Join Waitlist'} />
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
			background-image: url('/svgs/arrow.svg');
			display: inline-block;
			vertical-align: middle;
			align-items: center;
			width: 1em;
			height: 1em;
			background-size: 1em 1em;
		}
	}
</style>

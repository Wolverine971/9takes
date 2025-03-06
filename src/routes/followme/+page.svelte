<script lang="ts">
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';

	const jsonld = '';
</script>

<svelte:head>
	<title>About 9takes</title>
	<meta
		name="description"
		content="Answering what is the purpose, inspiration, and who is behind 9takes"
	/>
	<link rel="canonical" href="https://9takes.com/followme" />
	<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</svelte:head>

<div style=" margin:20px;">
	<div style="margin:20px; padding: 20px;">
		<h1 style="">Closing Slide</h1>

		<div style="margin:20px; padding: 20px;">
			<div>
				<p>
					<a href="/community/inspiration-for-9takes">The inspiration for 9takes</a>
				</p>
				<p>
					<a href="/enneagram-corner/beginners-guide-to-determining-your-enneagram-type"
						>Learn More About the Enneagram</a
					>
				</p>
			</div>
		</div>

		<h2 style="">Follow me</h2>

		<p>Have a good question? Ask me on twitter/ X</p>
	</div>

	<div
		style="display: flex; max-height: 50vh; overflow-y: scroll; gap: 1rem; margin:20px; padding: 20px;"
	>
		<div style="flex: 1">
			<a class="twitter-timeline" href="https://twitter.com/djwayne3?ref_src=twsrc%5Etfw"
				>Tweets by djwayne3</a
			>
		</div>
		<div style="flex: 1">
			<a class="twitter-timeline" href="https://twitter.com/9takesdotcom?ref_src=twsrc%5Etfw"
				>Tweets by 9takesdotcom</a
			>
		</div>
	</div>

	<div style="margin:20px; padding: 20px;">
		<div style="margin:20px;">
			<h2>My talk on how social media sucks</h2>

			<div style="display:flex; align-items: center; justify-content: center;">
				<iframe
					width="560"
					height="315"
					loading="lazy"
					src="https://www.youtube.com/embed/-IYvvm8gzqw?si=3UEXg3eGSfzSW7N2"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				/>
			</div>
		</div>
	</div>
</div>

<div style="margin:2rem;">
	<EmailSignup cta={'Join Waitlist'} />
</div>

<style lang="scss">
	p {
		margin: 1em;
	}
	a {
		color: var(--primary-dark);
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

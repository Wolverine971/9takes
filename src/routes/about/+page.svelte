<script>
	import CollectEmail from '$lib/components/molecules/Collect-Email.svelte';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About 9takes" />
</svelte:head>

<div class="text-column">
	<h1>About 9takes</h1>

	<p>
		At 9takes, we understand that everyone is unique and has their own perspectives, thoughts, and
		emotions. Despite this, we often expect others to react in the same way that we do. This can
		lead to misunderstandings and conflicts, as we struggle to navigate differences in opinions and
		perspectives.
	</p>
	<p>
		It's natural to feel upset or frustrated when someone does something we disagree with, but it's
		important to remember that their actions may not have been intentional. The tendency to take
		offense stems from our expectation that others should think, feel, and act just like us.
	</p>
	<p>
		People are complex and diverse, and no two individuals are exactly alike. While we may share
		similarities with some people, others may be vastly different from us. It's these differences
		that can cause feelings of anger, anxiety, or inferiority, when we believe others should conform
		to our own way of thinking and feeling.
	</p>
	<p>
		At 9takes, we embrace the diversity of individuals and strive to understand and respect the
		unique perspectives that each person brings to the table. In a world where people are different,
		we aim to foster a deeper understanding of one another and create a space where everyone can
		feel seen, heard, and valued.
	</p>
</div>

<div style="margin:20px;">
	<h2 style="text-align: center;">People Behind 9takes</h2>
	<div class="row">
		<div>
			<h3>DJ Wayne</h3>
			<ul>
				<li>
					<a href="https://github.com/Wolverine971">Github</a>
				</li>
				<li>
					<a href="https://twitter.com/djwayne3">Twitter</a>
				</li>
			</ul>
		</div>
		<div>
			<h3>Anna Wayne</h3>
			<ul>
				<li>
					<a href="https://glittergraveyard.squarespace.com/">Blog</a>
				</li>
				<li>
					<a href="https://www.instagram.com/glittrgraveyard/">Instagram</a>
				</li>
			</ul>
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
</style>

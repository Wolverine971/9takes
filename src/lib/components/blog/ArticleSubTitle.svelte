<script lang="ts">
	export let metaData: App.BlogPost;

	import twitter from '$lib/images/twitter.svg';

	const formattedDate = new Date(metaData.date).toDateString();
</script>

<p>
	<span
		class="author"
		title="he is so cool"
		itemprop="author"
		itemscope
		itemtype="https://schema.org/Person"
	>
		<span itemprop="name">{metaData.author}</span>
		<a
			itemprop="url"
			class="external-link"
			target="_blank"
			rel="noreferrer"
			href="https://twitter.com/djwayne3"
			style="padding: 0.5rem"
		>
			<img src={twitter} alt="djwayne3 Twitter" class="icon" style="width:1.5rem" width="150" />
		</a>
	</span>
	<span class="date">{formattedDate}</span>
</p>

<style>
	p {
		margin: 0;
		margin-bottom: calc(var(--spacing-unit) * 4);
	}
	.author {
		font-weight: bold;
		margin-right: calc(var(--spacing-unit) * 1);
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}
	.date {
		color: var(--color-text-secondary);
	}

	@media (max-width: 500px) {
		p {
			margin: calc(var(--spacing-unit));
			margin-bottom: calc(var(--spacing-unit));
		}
	}
</style>

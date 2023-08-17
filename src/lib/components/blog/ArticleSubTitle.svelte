<script lang="ts">
	export let metaData: App.BlogPost;

	const formattedDate = new Date(metaData.date).toDateString();
</script>

<p>
	<span class="author" title="he is so cool">{metaData.author}</span>
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

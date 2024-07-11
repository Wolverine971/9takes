<script lang="ts">
	export let blogContent: App.BlogPost = null;
	export let stage = null;

	const stages = [
		'Not written',
		'Written',
		'Sent out for review',
		'Reviewed',
		'Socialized',
		'Growing'
	];
	const stagesContentRetrievaL = ['Sent out for review', 'Reviewed', 'Socialized', 'Growing'];
	const getInfo = () => {
		console.log('Get Update');
	};
</script>

<div class="panel">
	<p><strong>Description</strong>: {blogContent.description}</p>

	<p><strong>Date</strong>: {blogContent.date}</p>

	<p><strong>Last Modified</strong>: {blogContent.lastmod}</p>

	<a href={blogContent.loc.replace('https://9takes.com', '')}>Link</a>

	<details>
		<summary class="accordion">More</summary>
		<div class="panel">
			{#each Object.entries(blogContent) as [key, value]}
				{#if key !== 'title'}
					<p>
						<strong>{key.toLocaleUpperCase()}</strong>: {value}
					</p>
				{/if}
			{/each}
		</div>
	</details>

	{#if stage && stagesContentRetrievaL.includes(stage)}
		<button class="btn btn-primary" type="button" on:click={getInfo}>Get Update</button>
	{/if}
</div>

<style lang="scss">
	p {
		align-items: inherit;
		margin: 0;
		margin-bottom: calc(var(--spacing-unit) * 2);
	}
	@media (max-width: 500px) {
		p {
			margin: calc(var(--spacing-unit));
		}
	}
</style>

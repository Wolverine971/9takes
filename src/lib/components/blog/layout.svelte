<div class="blog">
	<h1>blog</h1>
	<slot />
</div>

<style lang="scss">
	.blog :global(a) {
		color: #260958;
		display: flex;
		flex-wrap: wrap;
		overflow: hidden;
	}
	.blog :global(a::after) {
		content: '';
		background-image: url('/svgs/arrow.svg');
		display: inline-flex;
		justify-content: flex-start;
		align-items: center;
		width: 1em;
		height: 1em;
		background-size: 1em 1em;
	}
</style>

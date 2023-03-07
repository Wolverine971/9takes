<article>
	<slot />
</article>

<style lang="scss">
	article {
		margin: var(--block-spacing-vertical) 0;
		padding: var(--block-spacing-vertical) var(--block-spacing-horizontal);
		border-radius: var(--border-radius);
		background: var(--card-background-color);
		box-shadow: var(--card-box-shadow);
	}
	article:hover {
		border: 2px solid grey;
		// cursor: pointer;
	}
</style>

<section>
	<slot />
</section>

<style lang="scss">
	section {
		box-sizing: border-box;
		margin: var(--block-spacing-vertical) 0;
		padding: var(--block-spacing-vertical) var(--block-spacing-horizontal);
		border-radius: var(--border-radius);
		background: var(--card-background-color);
		box-shadow: var(--card-box-shadow);
	}
	section:hover {
		border: 1px solid var(--color-bg-2);
		// cursor: pointer;
	}
</style>

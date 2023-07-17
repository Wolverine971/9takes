<section>
	<slot />
</section>

<style lang="scss">
	section {
		box-sizing: border-box;

		border-radius: var(--border-radius);
		background: var(--card-background-color);
		box-shadow: var(--card-box-shadow);
	}
	section:hover {
		border: 1px solid var(--color-bg-2);
		// cursor: pointer;
	}
</style>

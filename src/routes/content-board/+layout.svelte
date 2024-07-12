<script lang="ts">
</script>

<main class="main flexrate column">
	<!-- style={innerWidth > 760 && $page.url.pathname === '/' ? 'margin-top: 85px;' : ''} -->
	<slot />
</main>

<style lang="scss">
	@media (prefers-reduced-motion: no-preference) {
		[style*='--tag'] {
			view-transition-name: var(--tag);
		}
	}

	.column {
		overflow: auto;
	}
	.jumbo-name {
		position: relative;
		font-size: 3.25rem;
		margin: 1rem;
		text-align: center;
		text-transform: uppercase;
	}

	.column-width {
		max-width: 64rem;
		border-radius: var(--base-border-radius);
	}

	.pos-rel {
		position: relative;
		// overflow: hidden;
	}

	main > a {
		display: inline-block;
		align-items: center;
		color: #260958;
		&::after {
			content: '';
			background-image: url(/icons/arrow.svg);
			display: inline-block;
			vertical-align: middle;
			align-items: center;
			width: 1em;
			height: 1em;
			background-size: 1em 1em;
		}
	}

	.flexrate {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: visible;
	}
</style>

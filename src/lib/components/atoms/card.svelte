<script lang="ts">
	export let style: string = '';
	export let className: string = '';
</script>

<section {style} class={className}>
	<slot />
</section>

<style lang="scss">
	// :root {
	// 	--primary-light: #8abdff;
	// 	--primary: #6d5dfc;
	// 	--primary-dark: #5b0eeb;

	// 	--white: #ffffff;
	// 	--greyLight-1: #e4ebf5;
	// 	--greyLight-2: #c8d0e7;
	// 	--greyLight-3: #bec8e4;
	// 	--greyDark: #9baacf;
	// }

	// $shadow: 0.3rem 0.3rem 0.6rem var(--greyLight-2), -0.2rem -0.2rem 0.5rem var(--white);
	// $inner-shadow: inset 0.2rem 0.2rem 0.5rem var(--greyLight-2),
	// 	inset -0.2rem -0.2rem 0.5rem var(--white);

	.neumo-card {
		// border-radius: var(--base-border-radius);
		// box-shadow: $shadow;

		// justify-content: center;
		// cursor: pointer;
		// transition: 0.3s ease;

		&:hover {
			border: 1px solid var(--color-theme-purple-light);
		}
		// &:active {
		// 	box-shadow: $inner-shadow;
		// }
		border-radius: var(--base-border-radius);
		background: var(--color);
		// Opacify any color with pure CSS
		animation: 1s -0.3s 1 paused opacify;
		backdrop-filter: blur(1.5rem);
		border: 1px solid transparent;
		// box-shadow: -0.25rem -0.25rem 0.5rem rgba(#fff, 0.07), 0.25rem 0.25rem 0.5rem rgba(#000, 0.12),
		// 	-0.75rem -0.75rem 1.75rem rgba(#fff, 0.07), 0.75rem 0.75rem 1.75rem rgba(#000, 0.12),
		// 	inset 8rem 8rem 8rem rgba(#fff, 0.05), inset -8rem -8rem 8rem rgba(#fff, 0.05);
	}
</style>

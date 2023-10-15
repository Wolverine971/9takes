<script lang="ts">
	export let type: number; //: Database['public']['Tables']['comments']['Row'];
	import { famousTypes } from '$lib/components/molecules/famousTypes';
	
</script>

<ul>
	{#each famousTypes[type] as person}
		<li>
			{#if person.link}
				<a href={`/blog/famous-enneagram-types/${person.name}`}>
					{person.name.split('-').join(' ')}
				</a>
			{:else}
				<p style="margin: 0;">{person.name.split('-').join(' ')}</p>
			{/if}
		</li>
	{/each}
</ul>

<style lang="scss">
	.slide-name {
		text-align: center;
		position: absolute;
		color: var(--color-paladin-1);
		font-size: xx-large;
		font-size: xxx-large;
		z-index: 1345;
		left: 0;
		right: 0;
		top: 90%;
		bottom: 0;
		margin: auto auto;
	}

	body {
		align-items: center;
		display: flex;
		height: 100vh;
		justify-content: center;
	}

	@mixin white-gradient {
		background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
	}

	// Animation
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-1024px * (var(--num-images))));
		}
	}

	// Styling
	.slider {
		// box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.125);
		height: var(--height);
		margin: auto;
		overflow: hidden;
		position: relative;
		width: 1000px;
		// mix-blend-mode: color-burn;

		&::before,
		&::after {
			// @include white-gradient;
			content: '';
			height: 100%;
			position: absolute;
			width: 200px;
			z-index: 2;
		}

		&::after {
			right: 0;
			top: 0;
			transform: rotateZ(180deg);
		}

		&::before {
			left: 0;
			top: 0;
		}

		.slide-track {
			animation: scroll var(--animationSpeed) linear infinite;
			display: flex;
			animation-iteration-count: infinite;
			animation-direction: alternate;
			width: calc(var(--width) * (var(--num-images)));
		}

		.slide-track:hover {
			animation-play-state: paused;
		}

		.slide {
			height: var(--height);
			width: var(--width);
		}
	}
	@media all and (max-width: 576px) {
		.slide-track {
			// touch-action: none;
		}
	}
</style>

<script lang="ts">
	// import { onMount } from 'svelte';
	// import PopCard from '../atoms/PopCard.svelte';

	export let type: number; //: Database['public']['Tables']['comments']['Row'];

	const famousTypes: { [index: number]: any[] } = {
		1: [
			{ name: 'Hillary_Clinton', link: false },
			{ name: 'Meryl_Streep', link: false },
			{ name: 'Michelle_Obama', link: true },
			{ name: 'Nelson_Mandela', link: false },
			{ name: 'Ruth_Bader_Ginsburg', link: true },
			{ name: 'Steve_Jobs', link: false },
			{ name: 'Brene_Brown', link: false }
		],
		2: [
			{ name: 'Dolly_Parton', link: false },
			{ name: 'Jimmy_Carter', link: true },
			{ name: 'Mother_Teresa', link: false },
			{ name: 'Nancy_Reagan', link: true },
			{ name: 'Mr_Rogers', link: true },
			{ name: 'Jennifer_Garner', link: false }
		],
		3: [
			{ name: 'Arnold_Schwarzenegger', link: true },
			{ name: 'Beyonce_Knowles', link: true },
			{ name: 'Meghan_Markle', link: true },
			{ name: 'Oprah_Winfrey', link: true },
			{ name: 'Nancy_Pelosi', link: true },
			{ name: 'Lady_Gaga', link: true },
			{ name: 'Taylor_Swift', link: false },
			{ name: 'Reese_Witherspoon', link: false }
		],
		4: [
			{ name: 'Johnny_Depp', link: true },
			{ name: 'Billie_Eilish', link: false },
			{ name: 'Bob_Dylan', link: false },
			{ name: 'Frida_Kahlo', link: true },
			{ name: 'Jackie_Kennedy', link: true }
		],
		5: [
			{ name: 'Bill_Gates', link: true },

			{ name: 'Elon_Musk', link: true },
			{ name: 'Emily_Dickinson', link: false },
			{ name: 'Stephen_Hawking', link: false },
			{ name: 'Albert_Einstein', link: false },
			{ name: 'Agatha_Christie', link: false }
		],
		6: [
			{ name: 'Marilyn_Monroe', link: true },
			{ name: 'Ellen_Degeneres', link: true },
			{ name: 'George_H.W._Bush', link: true },
			{ name: 'Joe_Biden', link: true },
			{ name: 'Mindy_Kaling', link: false },
			{ name: 'Mark_Twain', link: false },
			{ name: 'Prince_Harry', link: true }
		],
		7: [
			{ name: 'Elton_John', link: true },
			{ name: 'Britney_Spears', link: false },
			{ name: 'John_F._Kennedy', link: true },
			{ name: 'Miley_Cyrus', link: false },
			{ name: 'Robin_Williams', link: false }
		],
		8: [
			{ name: 'Clint_Eastwood', link: false },
			{ name: 'Ernest_Hemingway', link: false },
			{ name: 'Martin_Luther_King_Jr', link: true },
			{ name: 'Winston_Churchill', link: true },
			{ name: 'Chelsea_Handler', link: false }
		],
		9: [
			{ name: 'Abraham_Lincoln', link: false },
			{ name: 'Ariana_Grande', link: false },
			{ name: 'Barack_Obama', link: true },
			{ name: 'Bernie_Sanders', link: true },
			{ name: 'Marie_Kondo', link: false },
			{ name: 'Zooey_Deschanel', link: false },
			{ name: 'Queen_Elizabeth_II', link: true },
			{ name: 'Ronald_Reagan', link: true }
		]
	};
	// onMount(() => {
	// 	visibleImage = famousTypes[type][1];
	// 	setInterval(changePerson, 3333);
	// });
	// let visibleImage: string = '';
	// const changePerson = () => {
	// 	let index = famousTypes[type].indexOf(visibleImage);
	// 	visibleImage =
	// 		index < 0 || !famousTypes[type][index + 1]
	// 			? famousTypes[type][0]
	// 			: famousTypes[type][index + 1];
	// };
</script>

<ul>
	{#each famousTypes[type] as person}
		<li>
			{#if person.link}
				<a href={`/blog/people/${person.name}`}>
					{person.name.split('_').join(' ')}
				</a>
			{:else}
				<p>{person.name.split('_').join(' ')}</p>
			{/if}
		</li>
	{/each}
</ul>

<style lang="scss">
	.slide-name {
		text-align: center;
		position: absolute;
		color: white;
		font-size: xx-large;
		font-size: xxx-large;
		z-index: 1345;
		left: 0;
		right: 0;
		top: 90%;
		bottom: 0;
		margin: auto auto;
	}

	// #d8e2eb
	body {
		align-items: center;
		// background: #e3e3e3;
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

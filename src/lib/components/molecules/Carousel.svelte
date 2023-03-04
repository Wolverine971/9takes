<script lang="ts">
	export let type: number; //: Database['public']['Tables']['comments']['Row'];

	const famousTypes: { [index: number]: any[] } = {
		1: [
			'Hillary_Clinton',
			'Meryl_Streep',
			'Michelle_Obama',
			'Nelson_Mandela',
			'Ruth_Bader_Ginsburg',
			'Steve_Jobs',
			'Brene_Brown'
		],
		2: [
			'Dolly_Parton',
			'Jimmy_Carter',
			'Mother_Teresa',
			'Nancy_Reagan',
			'Mr._Rogers',
			'Jennifer_Garner'
		],
		3: [
			'Arnold_Schwarzenegger',
			'Beyonce_Knowles',
			'Oprah_Winfrey',
			'Lady_Gaga',
			'Taylor_Swift',
			'Reese_Witherspoon'
		],
		4: ['Johnny_Depp', 'Billie_Eilish', 'Bob_Dylan', 'Frida_Kahlo', 'Jackie_Kennedy'],
		5: ['Bill_Gates', 'Emily_Dickinson', 'Stephen_Hawking', 'Albert_Einstein', 'Agatha_Christie'],
		6: [
			'Marilyn_Monroe',
			'Ellen_Degeneres',
			'George_H.W._Bush',
			'Joe_Biden',
			'Mindy_Kaling',
			'Mark_Twain',
			'Prince_Harry'
		],
		7: ['Elton_John', 'Britney_Spears', 'John_F._Kennedy', 'Miley_Cyrus', 'Robin_Williams'],
		8: [
			'Clint_Eastwood',
			'Ernest_Hemingway',
			'Martin_Luther_King_Jr',
			'Winston_Churchill',
			'Chelsea_Handler'
		],
		9: [
			'Abraham_Lincoln',
			'Ariana_Grande',
			'Barack_Obama',
			'Bernie_Sanders',
			'Marie_Kondo',
			'Zooey_Deschanel',
			'Queen_Elizabeth_II',
			'Ronald_Reagan'
		]
	};
	let w: any;
	let h: any;
</script>

<div class="slider">
	<div
		class="slide-track"
		style="--num-images: {famousTypes[type].length - 1}; --animationSpeed: {(famousTypes[type]
			.length -
			1) *
			4}s; --width: {w}; --height: {h};"
	>
		{#each famousTypes[type] as person}
			<div class="slide" bind:clientWidth={w} bind:clientHeight={h}>
				<img
					src={`/types/${type}s/${person}.png`}
					alt=""
					id="person"
					style="max-width: none;"
					height="1024"
					width="1024"
				/>

				<h2 style="text-align: center;">{person.split('_').join(' ')}</h2>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
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
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import PopCard from '../atoms/PopCard.svelte';

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
			'Meghan_Markle',
			'Mr_Rogers',
			'Jennifer_Garner'
		],
		3: [
			'Arnold_Schwarzenegger',
			'Beyonce_Knowles',
			'Oprah_Winfrey',
			'Nancy_Pelosi',
			'Lady_Gaga',
			'Taylor_Swift',
			'Reese_Witherspoon'
		],
		4: [
			'Johnny_Depp',
			// someone else
			'Billie_Eilish',
			'Bob_Dylan',
			'Frida_Kahlo',
			'Jackie_Kennedy'
		],
		5: [
			'Bill_Gates',
			'Elon_Musk',
			'Emily_Dickinson',
			'Stephen_Hawking',
			'Albert_Einstein',
			'Agatha_Christie'
		],
		6: [
			'Marilyn_Monroe',
			'Ellen_Degeneres',
			'George_H_W_Bush',
			'George_W_Bush',
			'Joe_Biden',
			'Mindy_Kaling',
			'Mark_Twain',
			'Prince_Harry'
		],
		7: [
			'Elton_John',
			// someone else
			'Britney_Spears',
			'John_F_Kennedy',
			'Miley_Cyrus',
			'Robin_Williams',
			'Emily_Ratajkowski'
		],
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
	onMount(() => {
		visibleImage = famousTypes[type][1];
		setInterval(changePerson, 3333);
	});
	let visibleImage: string = '';
	const changePerson = () => {
		let index = famousTypes[type].indexOf(visibleImage);
		visibleImage =
			index < 0 || !famousTypes[type][index + 1]
				? famousTypes[type][0]
				: famousTypes[type][index + 1];
	};
</script>

<div
	style="display: flex;
    justify-content: center;
	height: 100vh;
	max-height: 1000px;"
>
	{#if type && visibleImage}
		<PopCard
			image={`/types/${type}s/${visibleImage}.webp`}
			showIcon={false}
			text={visibleImage.split('_').join(' ')}
			subtext={''}
		/>
	{/if}
</div>

<!-- cwebp "Hillary_Clinton.png" -o "Hillary_Clinton.webp"
cwebp "Brene_Brown.png" -o "Brene_Brown.webp"
cwebp "Meryl_Streep.png" -o "Meryl_Streep.webp"
cwebp "Michelle_Obama.png" -o "Michelle_Obama.webp"
cwebp "Nelson_Mandela.png" -o "Nelson_Mandela.webp"
cwebp "Ruth_Bader_Ginsburg.png" -o "Ruth_Bader_Ginsburg.webp"
cwebp "Steve_Jobs.png" -o "Steve_Jobs.webp"




cwebp "Jimmy_Carter.png" -o "Jimmy_Carter.webp"
cwebp "Dolly_Parton.png" -o "Dolly_Parton.webp"
cwebp "Mother_Teresa.png" -o "Mother_Teresa.webp"
cwebp "Mr_Rogers.png" -o "Mr_Rogers.webp"
cwebp "Nancy_Reagan.png" -o "Nancy_Reagan.webp"
cwebp "Meghan_Markle.png" -o "Meghan_Markle.webp"

cwebp "Arnold_Schwarzenegger.png" -o "Arnold_Schwarzenegger.webp"
cwebp "Beyonce_Knowles.png" -o "Beyonce_Knowles.webp"
cwebp "Lady_Gaga.png" -o "Lady_Gaga.webp"
cwebp "Oprah_Winfrey.png" -o "Oprah_Winfrey.webp"
cwebp "Reese_Witherspoon.png" -o "Reese_Witherspoon.webp"
cwebp "Taylor_Swift.png" -o "Taylor_Swift.webp"

cwebp "Billie_Eilish.png" -o "Billie_Eilish.webp"
cwebp "Bob_Dylan.png" -o "Bob_Dylan.webp"
cwebp "Frida_Kahlo.png" -o "Frida_Kahlo.webp"
cwebp "Jackie_Kennedy.png" -o "Jackie_Kennedy.webp"
cwebp "Johnny_Depp.png" -o "Johnny_Depp.webp"

cwebp "Agatha_Christie.png" -o "Agatha_Christie.webp"
cwebp "Albert_Einstein.png" -o "Albert_Einstein.webp"
cwebp "Albert_Einstein2.png" -o "Albert_Einstein2.webp"
cwebp "Bill_Gates.png" -o "Bill_Gates.webp"
cwebp "Diane_Sawyer.png" -o "Diane_Sawyer.webp"
cwebp "Emily_Dickinson.png" -o "Emily_Dickinson.webp"
cwebp "Stephen_Hawking.png" -o "Stephen_Hawking.webp"
cwebp "Elon_Musk.png" -o "Elon_Musk.webp"

cwebp "Ellen_Degeneres.png" -o "Ellen_Degeneres.webp"
cwebp "George_W_Bush.png" -o "George_W_Bush.webp"
cwebp "George_H_W_Bush.png" -o "George_H_W_Bush.webp"
cwebp "Joe_Biden.png" -o "Joe_Biden.webp"
cwebp "Marilyn_Monroe.png" -o "Marilyn_Monroe.webp"
cwebp "Mark_Twain.png" -o "Mark_Twain.webp"
cwebp "Mindy_Kaling.png" -o "Mindy_Kaling.webp"
cwebp "Prince_Harry.png" -o "Prince_Harry.webp"

cwebp "Britney_Spears.png" -o "Britney_Spears.webp"
cwebp "Elton_John.png" -o "Elton_John.webp"
cwebp "John_F_Kennedy.png" -o "John_F_Kennedy.webp"
cwebp "Miley_Cyrus.png" -o "Miley_Cyrus.webp"
cwebp "Robin_Williams.png" -o "Robin_Williams.webp"
cwebp "Tiffany_Haddish.png" -o "Tiffany_Haddish.webp"
cwebp "Emily_Ratajkowski.png" -o "Emily_Ratajkowski.webp"


cwebp "Chelsea_Handler.png" -o "Chelsea_Handler.webp"
cwebp "Clint_Eastwood.png" -o "Clint_Eastwood.webp"
cwebp "Ernest_Hemingway.png" -o "Ernest_Hemingway.webp"
cwebp "Winston_Churchill.png" -o "Winston_Churchill.webp"
cwebp "Martin_Luther_King_Jr.png" -o "Martin_Luther_King_Jr.webp"

cwebp "Abraham_Lincoln.png" -o "Abraham_Lincoln.webp"
cwebp "Ariana_Grande.png" -o "Ariana_Grande.webp"
cwebp "Barack_Obama.png" -o "Barack_Obama.webp"
cwebp "Bernie_Sanders.png" -o "Bernie_Sanders.webp"
cwebp "Marie_Kondo.png" -o "Marie_Kondo.webp"
cwebp "Queen_Elizabeth_II.png" -o "Queen_Elizabeth_II.webp"
cwebp "Ronald_Reagan.png" -o "Ronald_Reagan.webp"
cwebp "Zooey_Deschanel.png" -o "Zooey_Deschanel.webp"
 -->
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

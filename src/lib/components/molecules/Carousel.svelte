<script lang="ts">
	import { onMount } from 'svelte';
	import PopCard from '../atoms/PopCard.svelte';

	export let type: number; //: Database['public']['Tables']['comments']['Row'];

	const famousTypes: { [index: number]: any[] } = {
		1: [
			'Hillary-Clinton',
			'Meryl-Streep',
			'Michelle-Obama',
			'Nelson-Mandela',
			'Ruth-Bader-Ginsburg',
			'Steve-Jobs',
			'Brene-Brown'
		],
		2: [
			'Dolly-Parton',
			'Jimmy-Carter',
			'Mother-Teresa',
			'Joe-Biden',
			'Nancy-Reagan',
			'Oprah-Winfrey',
			'Meghan-Markle',
			'Mr-Rogers',
			'Jennifer-Garner'
		],
		3: [
			'Dua-Lipa',
			'Arnold-Schwarzenegger',
			'Nancy-Pelosi',
			'Ariana-Grande',
			'Taylor-Swift',
			'Reese-Witherspoon',
			'Kim-Kardashian',
			'Jake-Paul'
		],
		4: [
			'Demi-Lovato',
			'Johnny-Depp',
			'Charlie-Puth',
			'Lady-Gaga',
			'Bob-Dylan',
			'Frida-Kahlo',
			'Jackie-Kennedy'
		],
		5: [
			'Bill-Gates',
			'Elon-Musk',
			'Emily-Dickinson',
			'Stephen-Hawking',
			'Albert-Einstein',
			'Agatha-Christie'
		],
		6: [
			'Marilyn-Monroe',
			'Ellen-Degeneres',
			'George-H-W-Bush',
			'George-W-Bush',
			'Mindy-Kaling',
			'Mark-Twain',
			'Prince-Harry'
		],
		7: [
			'Logan-Paul',
			'Kanye',
			'Elton-John',
			'Jon-Stewart',
			'Britney-Spears',
			'John-F-Kennedy',
			'Miley-Cyrus',
			'David-Dobrik',
			'Robin-Williams',
			'Emily-Ratajkowski'
		],
		8: [
			'Mr-Beast',
			'Halsey',
			'Clint-Eastwood',
			'Beyonce-Knowles',
			'Ernest-Hemingway',
			'Martin-Luther-King-Jr',
			'Winston-Churchill',
			'Chelsea-Handler'
		],
		9: [
			'Abraham-Lincoln',
			'Barack-Obama',
			'Billie-Eilish',
			'Bernie-Sanders',
			'Marie-Kondo',
			'Zooey-Deschanel',
			'Pete-Davidson',
			'Queen-Elizabeth-II',
			'Ronald-Reagan'
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
    margin: 1rem 0;
	"
>
	{#if type && visibleImage}
		<PopCard
			image={`/types/${type}s/${visibleImage}.webp`}
			showIcon={false}
			displayText={visibleImage.split('-').join(' ')}
			subtext={''}
		/>
	{/if}
</div>

<!-- cwebp "Hillary-Clinton.png" -o "Hillary-Clinton.webp"
cwebp "Brene-Brown.png" -o "Brene-Brown.webp"
cwebp "Meryl-Streep.png" -o "Meryl-Streep.webp"
cwebp "Michelle-Obama.png" -o "Michelle-Obama.webp"
cwebp "Nelson-Mandela.png" -o "Nelson-Mandela.webp"
cwebp "Ruth-Bader-Ginsburg.png" -o "Ruth-Bader-Ginsburg.webp"
cwebp "Steve-Jobs.png" -o "Steve-Jobs.webp"




cwebp "Jimmy-Carter.png" -o "Jimmy-Carter.webp"
cwebp "Dolly-Parton.png" -o "Dolly-Parton.webp"
cwebp "Mother-Teresa.png" -o "Mother-Teresa.webp"
cwebp "Mr-Rogers.png" -o "Mr-Rogers.webp"
cwebp "Nancy-Reagan.png" -o "Nancy-Reagan.webp"
cwebp "Meghan-Markle.png" -o "Meghan-Markle.webp"

cwebp "Arnold-Schwarzenegger.png" -o "Arnold-Schwarzenegger.webp"
cwebp "Beyonce-Knowles.png" -o "Beyonce-Knowles.webp"
cwebp "Lady-Gaga.png" -o "Lady-Gaga.webp"
cwebp "Oprah-Winfrey.png" -o "Oprah-Winfrey.webp"
cwebp "Reese-Witherspoon.png" -o "Reese-Witherspoon.webp"
cwebp "Taylor-Swift.png" -o "Taylor-Swift.webp"
cwebp "Kim-Kardashian.png" -o "Kim-Kardashian.webp"
cwebp "Logan-Paul.png" -o "Logan-Paul.webp"

cwebp "Pete-Davidson.png" -o "Pete-Davidson.webp"
cwebp "Jenna-Marbles.png" -o "Jenna-Marbles.webp"
cwebp "Jake-Paul.png" -o "Jake-Paul.webp"
cwebp "Kanye.png" -o "Kanye.webp"
cwebp "Chamath-Palihapitiya.png" -o "Chamath-Palihapitiya.webp"
cwebp "Halsey.png" -o "Halsey.webp"
cwebp "Demi-Lovato.png" -o "Demi-Lovato.webp"
cwebp "Dua-Lipa.png" -o "Dua-Lipa.webp"

cwebp "Billie-Eilish.png" -o "Billie-Eilish.webp"
cwebp "Bob-Dylan.png" -o "Bob-Dylan.webp"
cwebp "Frida-Kahlo.png" -o "Frida-Kahlo.webp"
cwebp "Jackie-Kennedy.png" -o "Jackie-Kennedy.webp"
cwebp "Johnny-Depp.png" -o "Johnny-Depp.webp"
cwebp "Charlie-Puth.png" -o "Charlie-Puth.webp"

cwebp "Agatha-Christie.png" -o "Agatha-Christie.webp"
cwebp "Albert-Einstein.png" -o "Albert-Einstein.webp"
cwebp "Albert-Einstein2.png" -o "Albert-Einstein2.webp"
cwebp "Bill-Gates.png" -o "Bill-Gates.webp"
cwebp "Diane-Sawyer.png" -o "Diane-Sawyer.webp"
cwebp "Emily-Dickinson.png" -o "Emily-Dickinson.webp"
cwebp "Stephen-Hawking.png" -o "Stephen-Hawking.webp"
cwebp "Elon-Musk.png" -o "Elon-Musk.webp"

cwebp "Ellen-Degeneres.png" -o "Ellen-Degeneres.webp"
cwebp "George-W-Bush.png" -o "George-W-Bush.webp"
cwebp "George-H-W-Bush.png" -o "George-H-W-Bush.webp"
cwebp "Joe-Biden.png" -o "Joe-Biden.webp"
cwebp "Marilyn-Monroe.png" -o "Marilyn-Monroe.webp"
cwebp "Mark-Twain.png" -o "Mark-Twain.webp"
cwebp "Mindy-Kaling.png" -o "Mindy-Kaling.webp"
cwebp "Prince-Harry.png" -o "Prince-Harry.webp"

cwebp "Britney-Spears.png" -o "Britney-Spears.webp"
cwebp "Elton-John.png" -o "Elton-John.webp"
cwebp "John-F-Kennedy.png" -o "John-F-Kennedy.webp"
cwebp "Miley-Cyrus.png" -o "Miley-Cyrus.webp"
cwebp "Robin-Williams.png" -o "Robin-Williams.webp"
cwebp "Tiffany-Haddish.png" -o "Tiffany-Haddish.webp"
cwebp "Emily-Ratajkowski.png" -o "Emily-Ratajkowski.webp"
cwebp "David-Dobrik.png" -o "David-Dobrik.webp"


cwebp "Chelsea-Handler.png" -o "Chelsea-Handler.webp"
cwebp "Clint-Eastwood.png" -o "Clint-Eastwood.webp"
cwebp "Ernest-Hemingway.png" -o "Ernest-Hemingway.webp"
cwebp "Winston-Churchill.png" -o "Winston-Churchill.webp"
cwebp "Martin-Luther-King-Jr.png" -o "Martin-Luther-King-Jr.webp"
cwebp "Mr-Beast.png" -o "Mr-Beast.webp"
cwebp "Halsey.png" -o "Halsey.webp"

cwebp "Abraham-Lincoln.png" -o "Abraham-Lincoln.webp"
cwebp "Ariana-Grande.png" -o "Ariana-Grande.webp"
cwebp "Barack-Obama.png" -o "Barack-Obama.webp"
cwebp "Bernie-Sanders.png" -o "Bernie-Sanders.webp"
cwebp "Marie-Kondo.png" -o "Marie-Kondo.webp"
cwebp "Queen-Elizabeth-II.png" -o "Queen-Elizabeth-II.webp"
cwebp "Ronald-Reagan.png" -o "Ronald-Reagan.webp"
cwebp "Zooey-Deschanel.png" -o "Zooey-Deschanel.webp"




cwebp "party-in-street.png" -o "party-in-street.webp"

cwebp "self-development.png" -o "self-development.webp"
cwebp "stressed.png" -o "stressed.webp"
cwebp "team-building.png" -o "team-building.webp"
cwebp "working-in-teams.png" -o "working-in-teams.webp"
cwebp "communication-tips.png" -o "communication-tips.webp"
cwebp "communication-styles.png" -o "communication-styles.webp"


cwebp "human-nature.PNG" -o "human-nature.webp"
cwebp "darkRubix.png" -o "darkRubix.webp"

cwebp "social.png" -o "social.webp"
cwebp "one-to-one.png" -o "one-to-one.webp"
cwebp "self-pres.png" -o "self-pres.webp"


cwebp "background3.png" -o "background3.webp"



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

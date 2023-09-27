<script lang="ts">
	export let type: number; //: Database['public']['Tables']['comments']['Row'];

	const famousTypes: { [index: number]: any[] } = {
		1: [
			{ name: 'Hillary-Clinton', link: false },
			{ name: 'Meryl-Streep', link: false },
			{ name: 'Michelle-Obama', link: true },
			{ name: 'Nelson-Mandela', link: false },
			{ name: 'Ruth-Bader-Ginsburg', link: true },
			{ name: 'Steve-Jobs', link: false },
			{ name: 'Brene-Brown', link: false },
			{ name: 'Gandhi', link: false },
			{ name: 'Morgan-Freeman', link: false },
			{ name: 'Kourtney-Kardashian', link: true }
		],
		2: [
			{ name: 'Oprah-Winfrey', link: true },
			{ name: 'Dolly-Parton', link: false },
			{ name: 'Jimmy-Carter', link: true },
			{ name: 'Joe-Biden', link: true },
			{ name: 'Mother-Teresa', link: false },
			{ name: 'Meghan-Markle', link: true },
			{ name: 'Nancy-Reagan', link: true },
			{ name: 'Mr-Rogers', link: true },
			{ name: 'Jennifer-Garner', link: false }
		],
		3: [
			{ name: 'Kim-Kardashian', link: true },
			{ name: 'Arnold-Schwarzenegger', link: true },
			{ name: 'Ariana-Grande', link: true },
			{ name: 'Meghan-Markle', link: true },
			{ name: 'Dua-Lipa', link: true },
			{ name: 'Nancy-Pelosi', link: true },
			{ name: 'Taylor-Swift', link: true },
			{ name: 'Jason-Calacanis', link: true },
			{ name: 'Reese-Witherspoon', link: false },
			{ name: 'Jake-Paul', link: true },
			{ name: 'Justin-Bieber', link: false },
			{ name: 'Tom-Cruise', link: false },
			{ name: 'Dwayne-Johnson', link: false },
			{ name: 'Addison-Rae', link: false }
		],
		4: [
			{ name: 'Demi-Lovato', link: true },
			{ name: 'Johnny-Depp', link: true },
			{ name: 'Charlie-Puth', link: true },
			{ name: 'Bob-Dylan', link: false },
			{ name: 'Frida-Kahlo', link: true },
			{ name: 'Lady-Gaga', link: true },
			{ name: 'Jackie-Kennedy', link: true },
			{ name: 'The-Weeknd', link: false },
			{ name: 'Dixie-Damelio', link: false },
			{ name: 'Nikola-Tesla', link: true },
			{ name: 'Robert-Oppenheimer', link: true }
		],
		5: [
			{ name: 'Bill-Gates', link: false },
			{ name: 'Elon-Musk', link: true },
			{ name: 'Jack-Dorsey', link: true },
			{ name: 'Mark-Zuckerberg', link: false },
			{ name: 'Emily-Dickinson', link: false },
			{ name: 'Stephen-Hawking', link: false },
			{ name: 'Albert-Einstein', link: false },
			{ name: 'Agatha-Christie', link: false },
			{ name: 'Rooney-Mara', link: false },
			{ name: 'Friedrich-Nietzsche', link: true },
			{ name: 'David-Sacks', link: false },
			{ name: 'Lex-Fridman', link: false }
		],
		6: [
			{ name: 'Marilyn-Monroe', link: true },
			{ name: 'Ellen-Degeneres', link: true },
			{ name: 'George-W-Bush', link: true },
			{ name: 'George-H-W-Bush', link: true },
			{ name: 'Mindy-Kaling', link: false },
			{ name: 'Mark-Twain', link: false },
			{ name: 'Prince-Harry', link: true },
			{ name: 'Peter-Thiel', link: false },
			{ name: 'Malcom-X', link: false },
			{ name: 'Khloe-Kardashian', link: true }
		],
		7: [
			{ name: 'Logan-Paul', link: true },
			{ name: 'Elton-John', link: true },
			{ name: 'Britney-Spears', link: false },
			{ name: 'Jon-Stewart', link: true },
			{ name: 'Alex-Cooper', link: true },
			{ name: 'John-F-Kennedy', link: true },
			{ name: 'Miley-Cyrus', link: true },
			{ name: 'Kanye', link: true },
			{ name: 'David-Dobrik', link: true },
			{ name: 'Robin-Williams', link: false },
			{ name: 'Palmer-Luckey', link: false },
			{ name: 'Grimes', link: false },
			{ name: 'Leonardo-DiCaprio', link: true }
		],
		8: [
			{ name: 'Beyonce-Knowles', link: true },
			{ name: 'Halsey', link: true },
			{ name: 'Mr-Beast', link: true },
			{ name: 'Clint-Eastwood', link: false },
			{ name: 'Ernest-Hemingway', link: false },
			{ name: 'Martin-Luther-King-Jr', link: true },
			{ name: 'Winston-Churchill', link: true },
			{ name: 'Margot-Robbie', link: true },
			{ name: 'Chelsea-Handler', link: false },
			{ name: 'Denzel-Washington', link: true },
			{ name: 'Joe-Rogan', link: true },
			{ name: 'Dave-Portnoy', link: true },

			{ name: 'Emily-Ratajkowski', link: true }
		],
		9: [
			{ name: 'Billie-Eilish', link: true },
			{ name: 'Abraham-Lincoln', link: false },
			{ name: 'Barack-Obama', link: true },
			{ name: 'Bernie-Sanders', link: true },
			{ name: 'Kylie-Jenner', link: true },
			{ name: 'Charli-DAmelio', link: false },
			{ name: 'Bella-Poarch', link: false },
			{ name: 'Marie-Kondo', link: false },
			{ name: 'Zooey-Deschanel', link: false },
			{ name: 'Pete-Davidson', link: true },
			{ name: 'Queen-Elizabeth-II', link: true },
			{ name: 'Ronald-Reagan', link: true },
			{ name: 'Keanu-Reeves', link: true }
		]
	};
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

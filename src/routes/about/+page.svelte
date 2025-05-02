<script lang="ts">
	import { browser } from '$app/environment';
	import twitter from '$lib/images/twitter.svg';

	let showEmail = false;
	let showLaser = true;
	let innerWidth: number;

	function toggleLaser() {
		showLaser = !showLaser;
	}
</script>

<svelte:head>
	<title>9takes- About Page</title>
	<meta
		name="description"
		content="Discover the philosophy behind 9takes, a platform for meaningful dialogue through the lens of personality"
	/>
	<link rel="canonical" href="https://9takes.com/about" />
</svelte:head>

<svelte:window bind:innerWidth />

<div class="mx-auto max-w-3xl px-5 py-6 leading-relaxed text-gray-800">
	<h1 class="rounded-lg bg-black p-2 text-center text-white">
		There are many takes on life and on any given situation, <br />
		explore them all on <span class="text-indigo-600">9takes</span>
		<!-- <span class="text-indigo-600">9takes</span>, a meeting place <br /> for curious minds -->
	</h1>

	<section class="mt-8">
		<h2 class="mb-4 text-2xl font-bold text-indigo-800">My name is DJ</h2>
		<div
			class="cursor-pointer rounded-lg bg-gradient-to-r from-black via-indigo-600 to-black p-0.5"
			on:click={toggleLaser}
			on:keydown={(e) => e.key === 'Enter' && toggleLaser()}
			tabindex="0"
			role="button"
			aria-pressed="false"
		>
			<div class="flex flex-col items-center rounded-lg bg-gray-50 p-0.5 md:flex-row">
				<div class="mb-5 w-full max-w-[250px] md:mb-0 md:w-1/2">
					<picture>
						<source srcset="/brand/djface.png, /brand/djface.png" media="(orientation: portrait)" />
						<img
							src={showLaser ? '/brand/djface.png' : '/brand/djface.png'}
							alt={showLaser ? 'DJ Wayne fun profile picture' : 'DJ Wayne serious profile picture'}
							class="h-auto w-full rounded-bl-lg object-cover"
						/>
					</picture>
				</div>
				<div class="w-full rounded-lg p-5">
					<p class="mb-3">
						Philosopher at heart, technologist by trade, Enneagram enthusiast by passion.
					</p>
					<p class="mb-3">
						I'm creating 9takes as a space where ancient wisdom of understanding different
						perspectives meets contemporary technology.
					</p>

					<a
						class="inline-flex items-center rounded bg-gray-100 p-2 transition-colors duration-300 hover:bg-gray-200"
						href="https://twitter.com/djwayne3"
						target="_blank"
						rel="noreferrer"
					>
						<img src={twitter} alt="djwayne3 Twitter" class="h-6 w-6" />
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class="mt-10">
		<h2 class="mb-4 text-2xl font-bold text-indigo-800">Three Modern Challenges</h2>
		<ul class="mb-6 list-disc space-y-4 pl-5">
			<li>
				<strong>Our digital spaces have lost their purpose.</strong>
				<p class="mt-1">
					The promise of social media — to connect minds and hearts across distances — has
					diminished into shallow engagement and surface-level interactions.
				</p>
			</li>
			<li>
				<strong>Authentic expression carries too much risk.</strong>
				<p class="mt-1">
					The serendipity, playfulness, and genuine dialogue that characterized early social
					platforms has been replaced by performative behaviors and fear of judgment.
				</p>
			</li>
			<li>
				<strong>User wisdom is secondary to advertiser demands.</strong>
				<p class="mt-1">
					When platforms prioritize engagement metrics over meaningful connection, the quality of
					discourse inevitably declines.
				</p>
			</li>
		</ul>
		<p class="my-5 text-center text-xl font-bold text-indigo-600">
			The path to fulfillment lies not in algorithm-driven conformity but in embracing our
			differences
		</p>
		<p>
			9takes creates a space where <strong>practical wisdom</strong> emerges through honest dialogue,
			balanced with the safety of thoughtful structure. We optimize for revealing truth through conversation
			rather than mere engagement.
		</p>
	</section>

	{#if browser}
		<div class="relative my-10 h-0 overflow-hidden pt-[56.25%]">
			<iframe
				src="https://www.youtube.com/embed/-IYvvm8gzqw?si=8MaKuA5vfTpcXhGN"
				title="Meetup presentation about how social media messes up 'socializing'"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
				loading="lazy"
				class="absolute left-0 top-0 h-full w-full"
			/>
		</div>
	{/if}

	<section class="mt-10">
		<h3 class="mb-4 text-xl font-bold text-indigo-800">
			The Modern Paradox: <br /> When Autopilot Thinking Prevents True Understanding
		</h3>
		<p class="mb-3">
			In a world designed to keep us moving without reflection, we've lost our capacity for
			meaningful dialogue.
		</p>
		<p class="mb-3">
			My moment of clarity came during a difficult transition leaving military life. My wife and I
			found ourselves in conflict that seemed irresolvable. We loved each other deeply but couldn't
			bridge the gap between our perspectives.
			<a
				href="/community/inspiration-for-9takes"
				class="relative text-indigo-800 no-underline after:ml-1 after:inline-block after:h-4 after:w-4 after:bg-[url('/icons/arrow.svg')] after:bg-contain after:align-middle after:content-['']"
				>The turning point came through discovering the Enneagram</a
			>.
		</p>
		<p class="mb-3">
			The revelation was profound. The Enneagram illuminated aspects of myself I had always felt but
			never articulated. Beyond self-understanding, it created a bridge of comprehension between my
			wife and me, allowing us to resolve our conflicts through mutual understanding.
		</p>
		<p class="my-5 text-center text-xl font-bold text-indigo-600">
			If understanding the emotional foundations of personality could transform my marriage, what
			might it do for our collective dialogue?
		</p>
	</section>

	<section class="mt-10">
		<h2 class="mb-4 text-2xl font-bold text-indigo-800">
			The Essence of 9takes: A Thoughtful Gathering
		</h2>
		<p class="mb-3">
			9takes is a question-and-answer platform that reimagines online dialogue through the lens of
			the Enneagram — an ancient system of understanding human motivation that bridges psychology
			and philosophy.
		</p>
		<p class="mb-3">Our approach rests on two key principles:</p>
		<ul class="mb-4 list-disc space-y-2 pl-5">
			<li>
				<strong>Reveal Through Response:</strong> Comments become visible only after you contribute,
				fostering original thought and preventing the bias that comes from seeing others' opinions first.
			</li>
			<li>
				<strong>Type-Illuminated Dialogue:</strong> Your identity remains anonymous, but your Enneagram
				type provides crucial context for understanding your perspective's emotional foundation.
			</li>
		</ul>
		<p>
			Together, these principles create a harmonious structure for the kind of productive dialogue
			that philosophers have valued throughout history — one where understanding precedes judgment.
		</p>
	</section>

	<section class="mt-10">
		<h3 class="mb-4 text-xl font-bold text-indigo-800">The Philosophy of the Nine Perspectives</h3>
		<p class="mb-3">"Curiosity Before Consensus" ✨</p>
		<p class="mb-3">
			We intellectually acknowledge human diversity, yet we operate as if consensus were the natural
			state. When confronted with disagreement, we instinctively assume that with the right
			information, others would surely adopt our viewpoint. This overlooks a profound truth: people
			can possess the same facts, equal intelligence, similar experiences, and still arrive at
			fundamentally different conclusions.
		</p>
		<p class="mb-3">
			9takes embraces these differences as opportunities for growth rather than obstacles to
			overcome. In the space between our perspectives lies the potential for expanding our
			understanding, becoming more empathetic, and developing greater wisdom.
		</p>
		<p>
			<strong
				>Technology should serve as a bridge between different worlds of understanding, not as a
				mirror that merely reflects our existing beliefs. 9takes opens the gates between these
				worlds, allowing fresh perspectives to flow freely.</strong
			>
		</p>
	</section>

	<section class="mt-10">
		<h3 class="mb-4 text-xl font-bold text-indigo-800">
			The Enneagram: Our Compass for Understanding
		</h3>
		<p class="mb-3">
			The Enneagram stands at the intersection of ancient wisdom and contemporary psychology. Unlike
			systems that categorize by behavior or traits, the Enneagram illuminates our emotional
			foundations — the core motivations and fears that shape our perception of the world.
			<a
				href="/enneagram-corner/philosophy-psychology-and-the-enneagram"
				class="relative text-indigo-800 no-underline after:ml-1 after:inline-block after:h-4 after:w-4 after:bg-[url('/icons/arrow.svg')] after:bg-contain after:align-middle after:content-['']"
				>It bridges philosophical insight with psychological understanding</a
			>.
		</p>
		<p class="mb-3">
			Each of the nine types represents a distinct emotional lens through which the world is
			perceived — a different "take" on reality itself. These aren't arbitrary categorizations but
			reflections of how early emotional experiences shape our core responses to life.
		</p>
		<p>
			We don't presume to tell you your Enneagram type; that discovery is part of your journey.
			Through dialogue and reflection, patterns emerge that illuminate not just who you are, but why
			you see the world as you do.
		</p>
	</section>

	<section class="mt-10">
		<h3 class="mb-4 text-xl font-bold text-indigo-800">Questions as the Path to Wisdom</h3>
		<p class="mb-3">
			The act of formulating questions is the foundation of growth. When we question, we acknowledge
			the limits of our knowledge — the first step toward expanding it. When questioning ceases, so
			does our capacity for hope and discovery.
		</p>
		<p class="mb-3">Consider what different types might naturally ask:</p>
		<ul class="mb-4 list-disc space-y-1 pl-5">
			<li>"Why can't people adhere to principles that ensure justice?" (Type 1)</li>
			<li>"Why don't others appreciate the care and support I provide?" (Type 2)</li>
			<li>"Why isn't my achievement and effort recognized?" (Type 3)</li>
			<li>"Why can't others understand the depth of my unique experience?" (Type 4)</li>
			<li>"Why don't people respect boundaries and independence?" (Type 5)</li>
			<li>"Why can't people be more dependable in uncertain times?" (Type 6)</li>
			<li>"Why isn't there more joy and spontaneity in our interactions?" (Type 7)</li>
			<li>"Why don't people speak their truth directly and honestly?" (Type 8)</li>
			<li>"Why is finding common ground and harmony so difficult?" (Type 9)</li>
		</ul>
		<p class="mb-3">
			The universe of questions is infinite, matched only by the diversity of perspectives that can
			address them. Some will resonate with your viewpoint; others will challenge it fundamentally.
			Both have value.
		</p>
		<p>
			9takes celebrates these nine distinct ways of seeing and questioning. Through meaningful
			conversations across perspectives, we connect not just with ideas but with the full spectrum
			of human understanding.
		</p>
	</section>

	<section class="mt-10 rounded-lg bg-gray-100 p-5 text-center">
		<h3 class="mb-3 text-xl font-bold text-indigo-800">Join the Conversation ⟶</h3>
		<p class="mb-4">
			Have thoughts to share or questions of your own? Let's continue the dialogue.
		</p>
		{#if !showEmail}
			<button
				type="button"
				class="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
				on:click={() => (showEmail = true)}
			>
				Reveal Contact
			</button>
		{:else}
			<p class="mb-2">
				<a
					href="mailto:dj@9takes.com"
					class="relative text-indigo-800 no-underline after:ml-1 after:inline-block after:h-4 after:w-4 after:bg-[url('/icons/arrow.svg')] after:bg-contain after:align-middle after:content-['']"
				>
					dj@9takes.com
				</a>
			</p>
			<p>
				<a
					href="mailto:userSup@9takes.com"
					class="relative text-indigo-800 no-underline after:ml-1 after:inline-block after:h-4 after:w-4 after:bg-[url('/icons/arrow.svg')] after:bg-contain after:align-middle after:content-['']"
				>
					userSup@9takes.com
				</a>
			</p>
		{/if}
	</section>
</div>

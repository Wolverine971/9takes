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
		content="Answers for what is the purpose of 9takes as well as the inspiration and people behind it"
	/>
	<link rel="canonical" href="https://9takes.com/about" />
</svelte:head>

<svelte:window bind:innerWidth />

<div class="mx-auto max-w-3xl px-5 py-6 leading-relaxed text-gray-800">
	<h1 class="rounded-lg bg-black p-2 text-center text-white">
		<span class="text-indigo-600">9takes</span>, ask questions <br /> get different takes
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
					<p class="mb-3">I am Enneagram obsessed and I think social media could be better.</p>
					<p class="mb-3">
						Gotta a tech background and am building 9takes to be the place for us to explore our
						similarities and differences.
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
		<h2 class="mb-4 text-2xl font-bold text-indigo-800">3 Problems, 3 Solutions</h2>
		<ul class="mb-6 list-disc space-y-4 pl-5">
			<li>
				<strong>Social media isn't living up to what it was supposed to be.</strong>
				<p class="mt-1">
					There is no great place to get people's thoughts and opinions anymore. Online
					conversations can quickly turn toxic.
				</p>
			</li>
			<li>
				<strong>It is too risky to be completely honest.</strong>
				<p class="mt-1">
					We have lost the serendipity, playfulness, and the realness that social media was supposed
					to bring us.
				</p>
			</li>
			<li>
				<strong>Social media's customer is advertisers, not its users.</strong>
				<p class="mt-1">
					Creating a great user experience is secondary to what the advertisers want.
				</p>
			</li>
		</ul>
		<p class="my-5 text-center text-xl font-bold text-indigo-600">
			Optimize social media, don't cower in fear of the advertisers' opinions
		</p>
		<p>
			The only opinions that should matter are the user's opinions. 9takes has a way to <strong
				>optimize engagement and honesty</strong
			> while not sacrificing safety and inclusivity.
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
			When you spend +70% of your time autopilot- <br /> you cannot handle diversity of thought
		</h3>
		<p class="mb-3">Social media platforms are putting people putting you on autopilot.</p>
		<p class="mb-3">
			I got married during a stressful time when I was leaving the military. My wife and I were
			fighting, and it got to a point where we felt helpless in resolving our conflict. We loved
			each other, but we could not understand each other. Long story short, <a
				href="/community/inspiration-for-9takes"
				class="relative text-indigo-800 no-underline after:ml-1 after:inline-block after:h-4 after:w-4 after:bg-[url('/icons/arrow.svg')] after:bg-contain after:align-middle after:content-['']"
				>my wife convinced me to take a personality test</a
			>.
		</p>
		<p class="mb-3">
			I was blown away. The results told me things about myself that I felt deeply but had never put
			into words. It not only helped me understand myself but it also helped my spouse and I find
			common ground and resolve our conflict.
		</p>
		<p class="my-5 text-center text-xl font-bold text-indigo-600">
			If understanding my own personality could help me, how much could it help everyone else?
		</p>
	</section>

	<section class="mt-10">
		<h2 class="mb-4 text-2xl font-bold text-indigo-800">What is 9takes</h2>
		<p class="mb-3">
			9takes is a question-and-answer platform based on personality. It is Reddit reimagined based
			on a personality system called the Enneagram.
		</p>
		<p class="mb-3">There are two twists:</p>
		<ul class="mb-4 list-disc space-y-2 pl-5">
			<li>
				You can only see answers to questions once you comment. That is so that people are honest
				and unbiased.
			</li>
			<li>
				You are anonymous except for your personality. "Personality" is the perfect context for
				learning about yourself and others.
			</li>
		</ul>
		<p>
			These two differences when combined create the structure for having productive conversations
			online.
		</p>
	</section>

	<section class="mt-10">
		<h3 class="mb-4 text-xl font-bold text-indigo-800">The philosophy of 9takes</h3>
		<p class="mb-3">"Everyone is unique." ✨</p>
		<p class="mb-3">
			We know that everyone is different intellectually, but we don't operate that way. People (not
			you 😉) get surprised when someone doesn't agree with them. They think "surely if that other
			person had all the facts, was smart, kind they would agree with your point of view." People
			forget that other people can have facts, be smart and kind, have similar experiences, AND
			still disagree.
		</p>
		<p class="mb-3">
			9takes is about leaning into these disagreements and embracing these differences because, in
			the end, we all learn something, becoming better 👍 faster ⚡ and stronger 💪.
		</p>
		<p>
			<strong
				>"Technology" should open us up to new things, not create bubbles where we hear the same
				perspective repeatedly. 9takes is opening the conversation back up and dishing out fresh
				takes.</strong
			>
		</p>
	</section>

	<section class="mt-10">
		<h3 class="mb-4 text-xl font-bold text-indigo-800">Why the Enneagram?</h3>
		<p class="mb-3">
			Enneagram is the secret sauce. It has some deep roots and sits at the crossroads of psychology
			and philosophy. <a
				href="/enneagram-corner/philosophy-psychology-and-the-enneagram"
				class="relative text-indigo-800 no-underline after:ml-1 after:inline-block after:h-4 after:w-4 after:bg-[url('/icons/arrow.svg')] after:bg-contain after:align-middle after:content-['']"
				>Plato and Freud would have been fans of the Enneagram.</a
			>
		</p>
		<p class="mb-3">
			It is used by niche life coaches and as a tool for certain psychologists and therapists. But
			it is not mainstream and won't be for some time.
		</p>
		<p>
			We use it because it identifies a person's core motivations and fears. Typically, people
			figure out their type through being guided or through self-reflection. We are not going to
			tell you what your "Enneagram type" that is for you to discover.
		</p>
	</section>

	<section class="mt-10">
		<h3 class="mb-4 text-xl font-bold text-indigo-800">Why focus on questions and answers?</h3>
		<p class="mb-3">
			Because the process of forming and asking a question is tje mental unlock. When you are asking
			questions, you are growing. When you have run out of questions, you stop growing, and you not
			only run out of answers, you run out of hope.
		</p>
		<p class="mb-3">For example you may be asking yourself, "Why can't people..."</p>
		<ul class="mb-4 list-disc space-y-1 pl-5">
			<li>do things the right way?</li>
			<li>be more grateful for all the things I do for them?</li>
			<li>appreciate my hard work and success?</li>
			<li>understand my unique perspective and emotions?</li>
			<li>respect my need for privacy and independence?</li>
			<li>be more reliable and trustworthy?</li>
			<li>have more fun and excitement?</li>
			<li>be more honest and dish out the hard truth.</li>
			<li>get along and find common ground?</li>
		</ul>
		<p class="mb-3">
			There are endless questions to ask. Fortunately, there are endless people with answers and
			perspectives you can learn from. They also have questions like yours and will share if you ask
			them. Some people see the world like you, and others see a vastly different world.
		</p>
		<p>
			9takes is about embracing these differences or "takes" on the world. By asking questions,
			sharing stories, and getting curious, people will be connected to the community around them.
		</p>
	</section>

	<section class="mt-10 rounded-lg bg-gray-100 p-5 text-center">
		<h3 class="mb-3 text-xl font-bold text-indigo-800">Message me 👀</h3>
		<p class="mb-4">Got feedback or suggestions? Let me know!</p>
		{#if !showEmail}
			<button
				type="button"
				class="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
				on:click={() => (showEmail = true)}
			>
				Show Email
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

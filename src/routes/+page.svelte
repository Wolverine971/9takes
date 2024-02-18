<script lang="ts">
	import type { PageData } from './$types';
	import EmailSignup from '$lib/components/molecules/Email-Signup.svelte';
	import Jumbotron from '$lib/components/atoms/jumbotron.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<svelte:head>
	<title>9takes</title>
	<meta
		name="description"
		content="9takes- Anonymous questions and answers based on personality. What are people thinking, feeling, and doing?"
	/>
	<link rel="canonical" href="https://9takes.com" />

	<meta property="og:site_name" content="9takes" />
	<meta property="og:title" content="9takes Home Page" />
	<meta
		property="og:description"
		content="9takes- Anonymous questions and answers based on personality. What are people thinking, feeling, and doing?"
	/>
	<meta property="og:url" content="https://9takes.com" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://9takes.com/greek_pantheon.png" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content="@djwayne3" />
	<meta property="twitter:title" content="9takes" />
	<meta property="twitter:url" content="https://9takes.com" />
</svelte:head>

<!-- <Jumbotron
		image={'background.png'}
		showIcon={true}
		text={'9takes'}
		subtext={'Ask questions, share your story, get curious'}
		aspectRatio={'16/5'}
	/> -->
<!-- <main> -->
<section>
	<div class="landing-column">
		<div class="big-points center-align flex-center" style="margin-top: 100px;">
			<div class="main-preview" style="margin: 5rem 0;">
				<enhanced:img
					src="/static/9takes-preview.webp?enhanced"
					alt="9takes preview"
					class="img-preview"
					fetchPriority="high"
				/>

				<div class="main-description">
					<h1 style="margin-bottom: 1rem;">Anonymous questions and answers based on personality</h1>
					<p style="font-size: 1.5rem; font-weight: 700;">
						Find out what people <br /> think, feel, and do
					</p>
					{#if !data?.session?.user?.id}
						<!-- <button
							type="button"
							class="btn btn-primary"
							style="border: 1px solid;"
							on:click={() => {
								goto('/login');
							}}
						>
							Sign Up/ In
						</button> -->
						<a href="/questions" class="btn btn-primary questionLink" style="border: 1px solid;">
							Ask a question
						</a>
					{/if}
				</div>
			</div>

			<!-- 9takes- Find people similar to you and understand everyone else. how socrates must have been explaining things
			How we see the World -->
		</div>

		<div class="big-points-section center-align flex-center">
			<h2>The 9takes worldview</h2>
			<div>
				<h3 style="margin: 0;">There are two social media waves</h3>
				<div class="wave-sections" style="border: 1px solid grey;">
					<h4 style="margin-top: 0;">🤖 Old wave 🔄</h4>

					<p>
						<b>"Social media"</b> was about being connected to your friends and finding cool stuff that
						was shareable. That morphed into lurking and mindlessly scrolling, looking for cheap laughs
						and dopamine bumps. We are now more divided than maybe ever, and depression is on the rise.
					</p>
					<p>
						<b>"Personality"</b> was supposed to be something fun an interesting. You could learn about
						yourself and your friends. But it morphed into pseudoscience and a way to put people in boxes.
						Yes, people are similar and different, but the conversation gets more complicated when you
						bring up personality.
					</p>
				</div>
				<div class="wave-sections" style="border: 1px solid #5407d9;">
					<h4 style="margin-top: 0;">🎭 New wave ❓</h4>

					<p>
						<b>Social media</b> shouldn't feel stifling. It should be about self-expression and finding
						and connecting with like-minded people. Different opinions make for better conversations,
						not shutting people down. Social media should be the place to ask the big questions.
					</p>
					<p>
						<b>Personality</b> should be open ended. Discover your personality at your own pace. You
						shouldn't be put in a box or told what you are. It should be fun and enlightening as you
						learn your personality and should be driven by asking questions.
					</p>
				</div>
				<p>And thats what 9takes. <b>Asking questions, build community, heal the globe</b> 🌎💗.</p>
			</div>
		</div>
		<Jumbotron
			image={'greek_pantheon.webp'}
			showIcon={innerWidth > 760 && true}
			text={'9takes'}
			subtext={''}
			panBackground={false}
		>
			<div class="content-display">
				<h2
					class=" txt-white jumbo-name bold-shadow"
					data-value={'9takes'}
					itemprop="name"
					style="text-align: center;"
				>
					{'9takes'}
				</h2>
				<p
					class="txt-white link bold-shadow main-p"
					style="text-align: center;"
					itemprop="description"
				>
					{'everything we built started with a question'}
				</p>
			</div>
		</Jumbotron>

		<div class="big-points flex-center" style="max-width: none;">
			<h2 style="">What is 9takes?</h2>
			<p style="">
				An anonymous question and answering platform based on the Enneagram personality system.
				<br />
				Think
				<b style="font-size: 1.2rem;">
					<span style="text-shadow: .5px .5px #E0373C;">Reddit</span> based on personality.
					<!-- <span style="text-shadow: .5px .5px #2f0479;" title="secret sauce">Enneagram</span>
					Lens. -->
					<!-- A better <span style="text-shadow: .5px .5px #E0373C;">reddit</span> tailored to the
					<span style="text-shadow: .5px .5px #2f0479;" title="secret sauce">Enneagram</span>. -->
				</b>
			</p>

			<ul class="bento-list">
				<li class="bento">
					<a class="bento-a" href="/blog/community/inspiration-for-9takes">
						<img
							srcset={`${`/blogs/husband-and-wife.webp`} 218w,`}
							loading="lazy"
							fetchPriority="low"
							class="grid-img"
							height="218"
							width="218"
							title={'husband and wife'}
							src={`/blogs/husband-and-wife.webp`}
							alt={'husband and wife'}
						/>
						<h4 class="small-h4 txt-white link bold-shadow">Why create 9takes?</h4>
					</a>
				</li>
				<li class="bento">
					<a class="bento-a" href="/blog/community/introducing-9takes">
						<img
							srcset={`${`/blogs/greek-statue-introducing-9takes.webp`} 218w,`}
							loading="lazy"
							fetchPriority="low"
							class="grid-img"
							height="218"
							width="218"
							title={'A scenic view of a person working on a computer in the jungle'}
							src={`/blogs/greek-statue-introducing-9takes.webp`}
							alt={'A scenic view of a person working on a computer in the jungle'}
						/>
						<h4 class="small-h4 txt-white link bold-shadow">What is different about 9takes?</h4>
					</a>
				</li>
				<li class="bento">
					<a class="bento-a" href="/blog/enneagram/enneagram-tldr">
						<img
							srcset={`${`/blogs/greek-dude-reading-book.webp`} 218w,`}
							loading="lazy"
							fetchPriority="low"
							class="grid-img"
							height="218"
							width="218"
							title={'husband and wife'}
							src={`/blogs/greek-dude-reading-book.webp`}
							alt={'husband and wife'}
						/>
						<h4 class="small-h4 txt-white link bold-shadow">
							What is the <span title="secret sauce">Enneagram</span>?
						</h4>
					</a>
				</li>
				<li class="bento">
					<a class="bento-a" href="/blog/enneagram/philosophy-psychology-and-the-enneagram">
						<img
							srcset={`${`/blogs/freud-plato.webp`} 218w,`}
							loading="lazy"
							fetchPriority="low"
							class="grid-img"
							height="218"
							width="218"
							title={'Sigmund Freud squaring off with Plato'}
							src={`/blogs/freud-plato.webp`}
							alt={'Sigmund Freud squaring off with Plato'}
						/>
						<h4 class="small-h4 txt-white link bold-shadow">
							Why is the <span title="secret sauce">Enneagram</span>
							the best personality system?
						</h4>
					</a>
				</li>
			</ul>
		</div>

		<!-- <p>
						To find and connect with people that think, feel and act like you do. The bet is that
						once you feel understood, you will be ready to understand.
					</p> -->
		<div class="big-points flex-center">
			<h2 style="">What is different?</h2>
			<p class="">
				9takes is leveraging <span style="color: #5407d9">personality theory</span> to create an a better
				community.
			</p>
			<ul>
				<li>
					<span class="point-list">
						<span style="width: 2rem;">
							<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"
								><path
									d="M255.6 385.2C231.4 416.6 201.5 432 172 432s-59.4-15.4-83.6-46.8c-9.1-11.9-17.1-25.7-23.5-41.2c9.2 5.1 19.8 8 31.1 8c35.3 0 64-28.7 64-64s-28.7-64-64-64c-19 0-36.1 8.3-47.8 21.4c2-47.8 17.7-89.3 40.2-118.6C112.6 95.4 142.5 80 172 80s59.4 15.4 83.6 46.8c24.1 31.4 40.4 77 40.4 129.2s-16.3 97.7-40.4 129.2zM320 141.8C290 76.1 235 32 172 32C77 32 0 132.3 0 256S77 480 172 480c63 0 118-44.1 148-109.8C350 435.9 405 480 468 480c95 0 172-100.3 172-224s-77-224-172-224c-63 0-118 44.1-148 109.8zm42.8 206.6c6.6 2.3 13.7 3.6 21.2 3.6c35.3 0 64-28.7 64-64s-28.7-64-64-64c-14.8 0-28.5 5-39.3 13.5c3.3-44.4 18.5-83 39.8-110.6C408.6 95.4 438.5 80 468 80s59.4 15.4 83.6 46.8c24.1 31.4 40.4 77 40.4 129.2s-16.3 97.7-40.4 129.2C527.4 416.6 497.5 432 468 432s-59.4-15.4-83.6-46.8c-8.2-10.7-15.5-23.1-21.6-36.7z"
								/>
							</svg>
						</span>You cannot see comments until you comment.</span
					>
					<ul>
						<li>
							<span style="color: #5407d9">Honest</span> and unbiased feedback comes when people cannot
							see what everyone else is saying.
						</li>
					</ul>
				</li>
				<li>
					<span class="point-list">
						<span style="width: 2rem;">
							<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
								><path
									d="M0 88C0 74.7 10.7 64 24 64H424c13.3 0 24 10.7 24 24s-10.7 24-24 24H24C10.7 112 0 101.3 0 88zM0 248c0-13.3 10.7-24 24-24H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zM192 408c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24s10.7-24 24-24H168c13.3 0 24 10.7 24 24z"
								/>
							</svg>
						</span>You can sort the comments by personality type.</span
					>
					<ul>
						<li>
							<span style="color: #5407d9">Insightful</span> comments come out when people are compared
							to others who are their same personality type? You have to consider what patterns you are
							falling into.
						</li>
					</ul>
				</li>
				<li>
					<span class="point-list">
						<span style="width: 2rem;">
							<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"
								><path
									d="M48 256C48 141.1 141.1 48 256 48c63.1 0 119.6 28.1 157.8 72.5l15.6 18.2 36.4-31.3L450.2 89.2C403.3 34.6 333.7 0 256 0C114.6 0 0 114.6 0 256v40 24H48V296 256zm458.5-52.9l-4.9-23.5-47 9.9 4.9 23.5c2.9 13.9 4.5 28.3 4.5 43.1v40 24h48V296 256c0-18.1-1.9-35.8-5.5-52.9zM256 80c-34.2 0-66 9.7-93 26.6l31.7 37c18.2-9.9 39.1-15.6 61.3-15.6c70.7 0 128 57.3 128 128v24.9c0 34.6-2.8 69.1-8.4 103.1h48.6c5.2-34 7.8-68.5 7.8-103.1V256c0-97.2-78.8-176-176-176zM126.1 137.3C97.5 168.6 80 210.3 80 256v24.9c0 35-5.5 69.8-16.2 103.1h50.1c9.3-33.5 14.1-68.2 14.1-103.1V256c0-31.1 11.1-59.7 29.6-81.9l-31.6-36.8zM256 160c-53 0-96 43-96 96v24.9c0 46-7.6 91.6-22.5 135.1h46.3c13.4-43.7 20.3-89.2 20.3-135.1V256c0-28.7 23.3-52 52-52s52 23.3 52 52v24.9c0 45.6-5.5 91-16.4 135.1h45.2c10.1-44.2 15.2-89.5 15.2-135.1V256c0-53-43-96-96-96zm24 96H232v24.9c0 59.9-11 119.3-32.5 175.2l-5.9 15.3-3.3 8.6h51.4l2.6-6.7C267.9 411.9 280 346.7 280 280.9V256z"
								/>
							</svg>
						</span> The only thing that identifies you is your personality type.
					</span>
					<ul>
						<li>
							<span style="color: #5407d9">Engage</span>
							<span
								>with and reveal what you want to who you want via direct messages. People can see
								your answers but they do not know anything else.</span
							>
						</li>
					</ul>
				</li>
			</ul>
		</div>

		<!-- <ul>
						<li>
							Comments are not visible until you comment, this allows people to give original takes
							on questions without outside influence.
						</li>
						<li>
							Your identity is publicly hidden and privately shared. Everyone is default anonymous
							but you can message others and optionally reveal what you want. The only thing that
							identifies you publicly is your Enneagram personality type. If you aren't familiar
							with the Enneagram there are a slew of blogs to check out.
						</li>
					</ul> -->
		<div class="big-points flex-center">
			<h2 style="">Creating the following magic moments:</h2>
			<ul>
				<li>
					- Connecting with other people who think, feel, and act like you
					<svg
						style="display: inline;"
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 640 512"
						><path
							d="M371.6 28c1.7 1.2 3.2 2.5 4.5 4c-23 .4-42.7 2.7-59.5 6.3c-26.4-6.7-68.1-10.5-131.4-.1C76.9 56.1 41.9 92.8 32.6 105.7l0 .1c-.1 .8-.2 2.4 .3 5L60.8 274.5c5.4 31.5 19.5 58.8 41.8 76.9c20.8 16.8 46.9 35.3 74 48.2c16.9 8.1 32.9 13.4 47.4 15.5c6.8 10.4 14.5 21.4 23 32.5c-58 4.9-123.3-37.8-165-71.7c-29.7-24-46.8-59-53.2-96.2L.8 116.1c-1.7-9.8-1-19.9 4.7-28C20.5 67 63.6 25.9 179.8 6.9S350.5 12.8 371.6 28zM159 286.9c9.4-7.6 22-15.8 37.8-21.8l-1.7 10.2c-1.5 9-2.5 18.2-2.9 27.5c-4.7 2.8-8.9 5.8-12.4 8.7c-5.7 4.7-11.3 9.9-15.7 15.9c-5 7.2-15.1 9.1-22.5 4.2c-7.4-4.9-9.4-14.8-4.4-22.1c5.9-8.6 13.8-16 21.8-22.6zm-3.9-122.6c3.1-8.2 12.5-12.4 20.9-9.3s12.7 12.3 9.5 20.5c-5.9 15.4-19.8 27.5-37.6 30.4s-35-4-45.7-16.7c-5.7-6.8-4.7-16.8 2.2-22.4s17.2-4.6 22.9 2.1c7.8 9.3 23.5 6.7 27.8-4.6zm230 346.3c-60-9.8-110.5-74.6-140.1-122c-20.1-32.2-24.7-70.7-18.3-107.9L254.6 117c1.7-9.8 5.6-19.1 13.8-24.9C289.5 76.8 344 51.8 460.2 70.9S619.5 131 634.5 152.1c5.8 8.1 6.4 18.2 4.7 28L611.3 343.8c-6.4 37.2-23.5 72.2-53.2 96.2c-43.7 35.4-113.1 80.5-173 70.7zm-58.5-69.5c21.7 21.3 43.5 34.7 63.8 38s45.4-2.4 73-15.6c27.1-13 53.2-31.4 74-48.2c22.3-18.1 36.4-45.4 41.8-76.9l27.9-163.7c.4-2.5 .4-4.2 .3-5l0-.1c-9.4-12.9-44.3-49.7-152.6-67.5s-153.6 5.9-166.7 15.1l0 .1c-.4 .7-1 2.2-1.4 4.8L258.7 285.9c-5.4 31.5-1.1 61.9 14 86.1c14.1 22.6 32.6 48.3 53.9 69.2zm24.7-202.5c-5.7 6.8-16 7.7-22.9 2.1s-7.9-15.6-2.2-22.4c10.7-12.7 27.8-19.6 45.7-16.7s31.7 15 37.6 30.4c3.1 8.2-1.1 17.4-9.5 20.5s-17.8-1.1-20.9-9.3c-2-5.2-6.6-9.2-12.5-10.1s-11.6 1.3-15.2 5.6zm147.8 85.7l.6-.2c3.1-1 6.1-2 9.1-3.1c3.7-1.4 7.3-2.9 10.9-4.5c6.2-2.8 13.5 1.6 12.4 8.3c-.7 4.2-1.7 8.3-2.8 12.3c-1 3.5-2.2 7-3.6 10.4c-.2 .5-.4 1-.6 1.5c-19.7 47-70.6 76.1-123.9 67.4s-91.7-52.5-94.8-103.3c0-.5-.1-1.1-.1-1.6c-.2-3.6-.1-7.3 .1-11c.2-4.1 .7-8.3 1.4-12.5c1.1-6.6 9.5-8.5 14.5-3.9c2.8 2.6 5.8 5.2 8.8 7.7c2.5 2 5 4 7.6 5.9l.5 .4c22 15.9 48 27.2 76.8 31.9s57.1 2.4 83.2-5.6zm-20.7 37.4c-21.9 3.4-44.8 3.4-67.8-.4s-44.6-11.1-64.2-21.3c10.9 22.9 32.8 40.4 60.2 44.9s53.9-5 71.8-23.2zm1.2-102c-5.7 6.8-16 7.7-22.9 2.1s-7.9-15.6-2.2-22.4c10.7-12.7 27.8-19.6 45.7-16.7s31.7 15 37.6 30.4c3.1 8.2-1.1 17.4-9.5 20.5s-17.8-1.1-20.9-9.3c-2-5.2-6.6-9.2-12.6-10.1s-11.6 1.3-15.2 5.6z"
						/>
					</svg>
				</li>
				<li>
					- Going down the rabbit hole of another personality types answers to questions
					<svg
						style="display: inline;"
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 512 512"
						><path
							d="M245.7 0c-24.4 0-45.1 17.9-48.5 42.1l-.7 4.9c-7.8 54.3 8.4 108.9 43.5 150.1v20.6c-66.8 20.7-119.8 73-141.4 139.4C90.3 353.8 81.4 352 72 352c-39.8 0-72 32.2-72 72s32.2 72 72 72c14.7 0 28.3-4.4 39.7-11.9C127.8 501.3 150.6 512 176 512h32l96 0c23.9 0 44.7-13.1 55.7-32.4l5.1 6.8c21.2 28.3 61.3 34 89.6 12.8s34-61.3 12.8-89.6L388 304c46.4-.1 84-37.8 84-84.3c0-25.3-11.4-49.3-31-65.3L404 124.3c-5.6-4.5-11.5-8.6-17.6-12c10.1-24.8 13.6-52.1 9.8-79.4l-.9-6C393.1 11.4 379.9 0 364.3 0c-8.2 0-16.2 3.3-22 9.1l-2 2c-5.8 5.7-11 11.9-15.7 18.3c14.7 21.5 25.1 45.4 30.7 70.4c-8.4-2.1-17-3.4-25.7-3.7c-8.2-29.3-23.8-56.6-46.2-78.8l-3.1-3.1L263.4 31.1l16.8-16.9C271 5.1 258.6 0 245.7 0zM88.7 406.7c-.4 5.7-.7 11.4-.7 17.3c0 5.6 .5 11.1 1.5 16.4C85.1 445.1 78.9 448 72 448c-13.3 0-24-10.7-24-24s10.7-24 24-24c6.5 0 12.4 2.6 16.7 6.7zm156-357.9c.1-.5 .5-.9 1-.9c.3 0 .5 .1 .7 .3l3.1 3.1 16.8-16.9L249.5 51.4c20.4 20.2 33.2 46.2 37.2 73.7c1 6.7 4.7 12.6 10.3 16.4s12.5 5 19 3.5c2.7-.6 5.5-1 8.5-1c17.9 0 35.3 6.2 49.3 17.5l36.9 30.1c8.4 6.9 13.4 17.2 13.4 28.1c0 20-16.2 36.3-36.3 36.3H352c-13.3 0-24 10.7-24 24v16c0 5.2 1.7 10.2 4.8 14.4l96 128c5.3 7.1 3.9 17.1-3.2 22.4s-17.1 3.9-22.4-3.2l-68.6-91.4c-4.2-5.6-10.6-9-17.5-9.5s-13.8 2.1-18.7 7L271 391c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8h16c8.8 0 16 7.2 16 16s-7.2 16-16 16l-96 0H176c-22.1 0-40-17.9-40-40c0-80.8 57-148.2 133-164.3c11.1-2.4 19-12.1 19-23.5V187.9c0-6.1-2.4-12.1-6.6-16.5C251.8 140.1 237.8 96.8 244 53.8l.7-4.9zM352 208a16 16 0 1 0 0-32 16 16 0 1 0 0 32z"
						/>
					</svg>
				</li>
				<li>
					- DMing someone who has many amazing, inspiring and insightful answers to questions
					<svg
						style="display: inline;"
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 512 512"
						><path
							d="M192 416c0-17.7-14.3-32-32-32H64c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H309.3c-6.9 0-13.7 2.2-19.2 6.4L192 464V416zM64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h64 32v32 48c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM192 184a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm128 0a24 24 0 1 0 0-48 24 24 0 1 0 0 48zM155.9 252.1c-6.6 5.9-7.1 16-1.3 22.6C179.5 302.5 215.7 320 256 320s76.5-17.5 101.4-45.3c5.9-6.6 5.3-16.7-1.3-22.6s-16.7-5.3-22.6 1.3C314.5 274.6 286.8 288 256 288s-58.5-13.4-77.5-34.7c-5.9-6.6-16-7.1-22.6-1.3z"
						/>
					</svg>
				</li>
				<li>
					- Getting DM'd and having to decide if you want to reveal yourself or not
					<svg
						style="display: inline;"
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 512 512"
						><path
							d="M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
						/>
					</svg>
				</li>
			</ul>
		</div>
		<!-- <div class="big-points center-align">
					<h3>How?</h3>
					<p>By ask questions, sharing your story, and getting curious</p>
				</div> -->
	</div>
</section>
<!-- </main> -->
{#if !data?.session?.user}
	<section style="max-width: 64rem; margin: 10rem auto">
		<div class="join" id="signup">
			<EmailSignup cta={'Join Waitlist'} />
		</div>
	</section>
{/if}

<style lang="scss">
	.small-h4 {
		// color: #262626;
		font-size: 17px;
		line-height: 1rem;
		font-weight: 700;
		text-wrap: balance;
		position: absolute;
		margin-left: auto;
		margin-right: auto;
		left: 0;
		right: 0;
		text-align: center;
		padding: 0;
	}

	.bento-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0;
	}
	.bento {
		background: #8884;
		display: inline-flex;
		flex-direction: column;
		flex-grow: 1;
		height: 7em;
		overflow: hidden;
		position: relative;
		width: 20%; // calc(25% - 1rem);
		height: auto;
		background-position: 50%;
		background-size: cover;
		box-shadow: 0px 8px 16px -8px #000a;
		color: #fff;
		border-radius: 10px;
	}

	.bento-a {
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		overflow: hidden;
	}

	.bento-a::after {
		content: '';
		display: none;
	}

	.grid-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 5px;
	}

	.grid-img:hover {
		filter: blur(2px) !important;
	}
	.point-list {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	/* Basic styles */

	.questionLink::after {
		// content: '';
		width: 0;
		background-image: none;
	}

	#signup-link {
		&::after {
			content: none;
		}
	}

	.main-description {
		min-width: 500px;
		max-width: 100vw;
	}

	.main-p {
		font-size: 2rem;
	}

	.wave-sections {
		border-radius: 5px;
		margin: 2rem;
		padding: 2rem;
	}
	.main-preview {
		display: flex;
		justify-content: center;
		align-items: center;
		// gap: 100px;
		grid-column-gap: 100px;
		grid-row-gap: 100px;
	}

	a {
		display: inline-block;
		align-items: center;
		color: #260958;

		&::after {
			content: '';

			background-image: url('/icons/arrow.svg');
			display: inline-block;
			vertical-align: middle;
			align-items: center;
			width: 1em;
			height: 1em;
			background-size: 1em 1em;
		}
	}

	.landing-column {
		display: grid;
		grid-template-columns: 1fr;
		column-gap: 1.25rem;
		grid-gap: 10rem;
		// overflow: auto;
	}
	.big-points,
	.big-points-section {
		max-width: 50%;
		min-width: 400px;
		width: 100%;
		margin: auto;
		display: flex;
		justify-content: center;
		flex-direction: column;
	}

	.center-align {
		text-align: center;
	}
	h1 {
		word-break: break-word;
		margin: 0;
		text-align: center;
		font-size: 2.5rem;
	}
	h2 {
		font-size: 2.2rem;
		margin-top: 0;
	}
	h3 {
		font-size: 2rem;
	}
	ul {
		/* list-style: disc; */
		margin: 0;
		padding: 0;

		list-style: none;
	}
	li {
		margin: 0.5rem;
		word-break: normal;
	}
	a {
		color: var(--color-paladin-3);
		/* text-decoration: none; */
		margin: 0.5rem;
		padding: 0.5rem;

		&:hover {
			background-color: var(--color-paladin-2);
			border-radius: 5px;
		}
	}
	p {
		word-break: normal;
	}
	/* Header styles */
	header {
		background-color: var(--color-paladin-3);
		background-image: url('/background.webp');
		color: #fff;
		padding: 20px;
		aspect-ratio: 16 / 6;
		display: flex;
		flex-direction: column;
		justify-content: center;
		-webkit-filter: grayscale(100%);
		filter: grayscale(100%);
	}
	header h2 {
		text-align: center;
		margin: 0;
	}

	.img-preview {
		width: auto;
		height: auto;
	}

	/* Media queries */

	@media (min-width: 800px) {
		.img-preview {
			max-width: 600px;
		}
		// .bento {
		// 	width: 40%;
		// }
		.small-h4 {
			font-size: 2.5rem;
			line-height: 2.5rem;
		}
	}

	@media (max-width: 1000px) {
		.main-preview {
			flex-direction: column-reverse;
		}
		.main-description {
			min-width: 200px;
		}
		.small-h4 {
			font-size: 1.7rem;
			line-height: 1.7rem;
		}
	}
	@media (max-width: 800px) {
		.small-h4 {
			font-size: 2rem;
			line-height: 2rem;
		}
		.bento {
			width: 33%;
			height: auto;
			margin: 0.25rem;
		}
	}

	@media (max-width: 480px) {
		.small-h4 {
			font-size: 1.5rem;
			line-height: 1.5rem;
		}
		.bento {
			width: 33%;
			height: auto;
			margin: 0.25rem;
		}
		.img-preview {
			overflow: hidden;
			max-width: none;
		}
		.main-description {
			min-width: auto;
		}

		.big-points {
			min-width: 300px;
		}
		.big-points-section {
			min-width: fit-content;
		}

		.wave-sections {
			margin: 0.5rem 0;
			padding: 1rem 0.5rem;
		}
		h1 {
			font-size: 2rem;
		}
		h2 {
			font-size: 1.5rem;
		}
		h3 {
			font-size: 1.25rem;
		}
		h4 {
			font-size: 1rem;
		}
		.main-p {
			font-size: 1.5rem;
		}
	}
</style>

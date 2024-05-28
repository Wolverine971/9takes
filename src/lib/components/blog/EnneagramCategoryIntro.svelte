<script lang="ts">
	import BlogPageHead from './BlogPageHead.svelte';

	export let subsection: string;
	export let blogs: any;

	const slug = `blog/enneagram/subtopic/${subsection}`;
</script>

{#if subsection === 'overview'}
	<BlogPageHead
		data={{
			title: `9takes- Overview of the Enneagram System`,
			description: 'Describing the basics of the Enneagram system and its applications.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/blog/enneagram/subtopic/overview',
			lastmod: '2024-05-09',
			blog: true,
			pic: ''
		}}
		{slug}
	/>
	<header>
		<h1>Understanding the Enneagram</h1>
	</header>

	<main>
		<section id="introduction">
			<p>The Enneagram is a personality system that describes nine distinct personality types.</p>
			<p>
				Each has its own unique set of motivations, fears, and behavioral patterns. This subsection
				is dedicated to providing a foundational understanding of the Enneagram system and its
				applications.
			</p>
		</section>

		<section id="article-list">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/blog/enneagram/{eBlog.slug}"
						class="grid-item inline-it"
						style={eBlog.pic &&
							`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
					>
						<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
							<h3>
								{eBlog.title}
							</h3>
							<p class="font-adjust-p">{eBlog.description}</p>
						</div>
					</a>
				{/each}
			</div>

			<!-- <ul>
                <li><a href="#">What is the Enneagram? A Comprehensive Introduction</a></li>
                <li><a href="#">The Nine Enneagram Types: An Overview</a></li>
                <li><a href="#">The Three Enneagram Centers: Head, Heart, and Body</a></li>
                <li><a href="#">Wings: Exploring the Influence of Adjacent Enneagram Types</a></li>
                <li><a href="#">Instinctual Subtypes: The Three Enneagram Instincts</a></li>
                <li><a href="#">Levels of Development: Healthy, Average, and Unhealthy Expressions of Each Type</a></li>
                <li><a href="#">The Enneagram Symbol: Understanding Its Meaning and Structure</a></li>
            </ul> -->
		</section>

		<section id="conclusion">
			<h2>Conclusion</h2>
			<p>
				Understanding the fundamentals of the Enneagram system is essential for anyone looking to
				use this tool for personal growth, improving relationships, or enhancing their professional
				life. We encourage you to explore the articles in this subsection to gain a solid foundation
				in Enneagram theory and its applications.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/blog/enneagram/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li>
					<a href="/blog/enneagram/subtopic/development">The Enneagram for Personal Development</a>
				</li>
				<li><a href="/blog/enneagram/subtopic/relationships">The Enneagram in Relationships</a></li>
				<li><a href="/blog/enneagram/subtopic/workplace">The Enneagram in the Workplace</a></li>
			</ul>
		</section>

		<!-- <section id="cta">
			<h2>Stay Connected</h2>
			<p>
				Subscribe to our blog for the latest articles and insights on the Enneagram and its
				applications.
			</p>
			<a href="#" class="cta-button">Subscribe Now</a>
		</section> -->
	</main>
{/if}

{#if subsection === 'nine-types'}
	<BlogPageHead
		data={{
			title: `9takes- Overview of the 9 Enneagram types`,
			description: 'Describing the 9 Enneagram types and their characteristics.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/blog/enneagram/subtopic/nine-types',
			lastmod: '2024-05-09',
			blog: true,
			pic: 's-greek-statues-working-in-teams'
		}}
		{slug}
	/>
	<header>
		<h1>The Nine Enneagram Types</h1>
	</header>

	<main>
		<section id="introduction">
			<p>
				The Enneagram system is composed of nine distinct personality types, each with its own set
				of core beliefs, desires, and fears. Understanding the characteristics of each type can help
				you gain insights into yourself and others, leading to improved self-awareness and better
				relationships.
			</p>
		</section>

		<section id="article-list">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/blog/enneagram/{eBlog.slug}"
						class="grid-item inline-it"
						style={eBlog.pic &&
							`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
					>
						<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
							<h3>
								{eBlog.title}
							</h3>
							<p class="font-adjust-p">{eBlog.description}</p>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section id="conclusion">
			<h2>Conclusion</h2>
			<p>
				Gaining a deep understanding of each Enneagram type is essential for personal growth,
				improved communication, and building stronger relationships. We encourage you to explore the
				articles in this subsection to learn more about the unique qualities, challenges, and growth
				opportunities for each type.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/blog/enneagram/subtopic/overview">Understanding the Enneagram</a></li>
				<li>
					<a href="/blog/enneagram/subtopic/development">The Enneagram for Personal Development</a>
				</li>
				<li><a href="/blog/enneagram/subtopic/relationships">The Enneagram in Relationships</a></li>
				<li><a href="/blog/enneagram/subtopic/workplace">The Enneagram in the Workplace</a></li>
			</ul>
		</section>

		<!-- <section id="cta">
			<h2>Stay Connected</h2>
			<p>
				Subscribe to our blog for the latest articles and insights on the Enneagram and its
				applications.
			</p>
			<a href="#" class="cta-button">Subscribe Now</a>
		</section> -->
	</main>
{/if}

{#if subsection === 'development'}
	<BlogPageHead
		data={{
			title: `9takes- The Enneagram for personal development`,
			description:
				'Blogs on using the Enneagram for personal development, growth, and self-improvement.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/blog/enneagram/subtopic/development',
			lastmod: '2024-05-09',
			blog: true,
			pic: 'Self-awareness-and-Self-understanding'
		}}
		{slug}
	/>
	<header>
		<h1>The Enneagram for Personal Development</h1>
	</header>

	<main>
		<section id="introduction">
			<p>
				The Enneagram is not only a tool for understanding yourself and others but also a powerful
				framework for personal growth and self-improvement. By exploring the unique challenges and
				opportunities for development within each Enneagram type, you can create a tailored path to
				reaching your full potential.
			</p>
		</section>

		<section id="article-list">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/blog/enneagram/{eBlog.slug}"
						class="grid-item inline-it"
						style={eBlog.pic &&
							`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
					>
						<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
							<h3>
								{eBlog.title}
							</h3>
							<p class="font-adjust-p">{eBlog.description}</p>
						</div>
					</a>
				{/each}
			</div>
			<!-- <ul>
                <li><a href="#">Enneagram Type 1: Embracing Imperfection and Self-Compassion</a></li>
                <li><a href="#">Enneagram Type 2: Nurturing Yourself and Setting Healthy Boundaries</a></li>
                <li><a href="#">Enneagram Type 3: Overcoming the Fear of Failure</a></li>
                <li><a href="#">Enneagram Type 4: Cultivating Self-Acceptance and Emotional Resilience</a></li>
                <li><a href="#">Enneagram Type 5: Engaging with the World and Expressing Emotions</a></li>
                <li><a href="#">Enneagram Type 6: Cultivating Self-Trust and Courage</a></li>
                <li><a href="#">Enneagram Type 7: Embracing Discomfort and Finding Inner Peace</a></li>
                <li><a href="#">Enneagram Type 8: Developing Vulnerability and Empathy</a></li>
                <li><a href="#">Enneagram Type 9: Asserting Yourself and Setting Boundaries</a></li>
            </ul> -->
		</section>

		<section id="conclusion">
			<h2>Conclusion</h2>
			<p>
				By using the Enneagram as a tool for personal development, you can gain valuable insights
				into your unique challenges and opportunities for growth. We encourage you to explore the
				articles in this subsection to find tailored strategies and guidance for your Enneagram
				type, empowering you to create lasting positive change in your life.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/blog/enneagram/subtopic/overview">Understanding the Enneagram</a></li>
				<li><a href="/blog/enneagram/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li><a href="/blog/enneagram/subtopic/relationships">The Enneagram in Relationships</a></li>
				<li><a href="/blog/enneagram/subtopic/workplace">The Enneagram in the Workplace</a></li>
			</ul>
		</section>

		<!-- <section id="cta">
			<h2>Stay Connected</h2>
			<p>
				Subscribe to our blog for the latest articles and insights on the Enneagram and its
				applications.
			</p>
			<a href="#" class="cta-button">Subscribe Now</a>
		</section> -->
	</main>
{/if}

{#if subsection === 'relationships'}
	<BlogPageHead
		data={{
			title: `9takes- Using the Enneagram in Relationships`,
			description: 'Blogs about using the Enneagram to improve your relationships.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/blog/enneagram/subtopic/relationships',
			lastmod: '2024-05-09',
			blog: true,
			pic: 'greek-statues-having-an-intimate-conversation'
		}}
		{slug}
	/>
	<header>
		<h1>The Enneagram in Relationships</h1>
	</header>

	<main>
		<section id="introduction">
			<p>
				The Enneagram offers a powerful framework for understanding relationship dynamics,
				communication styles, and compatibility between different personality types. By exploring
				how each Enneagram type approaches relationships, you can gain valuable insights into
				creating more harmonious and fulfilling connections with others.
			</p>
		</section>

		<section id="article-list">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/blog/enneagram/{eBlog.slug}"
						class="grid-item inline-it"
						style={eBlog.pic &&
							`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
					>
						<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
							<h3>
								{eBlog.title}
							</h3>
							<p class="font-adjust-p">{eBlog.description}</p>
						</div>
					</a>
				{/each}
			</div>
			<!-- <ul>
                <li><a href="#">Enneagram Type 1 and Type 7 Relationship Dynamics</a></li>
                <li><a href="#">Enneagram Type 2 and Type 8 Relationship Dynamics</a></li>
                <li><a href="#">Enneagram Type 3 and Type 6 Relationship Compatibility</a></li>
                <li><a href="#">Enneagram Type 4 and Type 9 Relationship Compatibility</a></li>
                <li><a href="#">Enneagram Type 5 and Type 1 Relationship Dynamics</a></li>
                <li><a href="#">Navigating Conflict: Enneagram Strategies for Couples</a></li>
                <li><a href="#">Enneagram Communication Styles in Relationships</a></li>
                <li><a href="#">Using the Enneagram to Improve Empathy in Relationships</a></li>
                <li><a href="#">Enneagram Insights for Building Healthy and Balanced Relationships</a></li>
            </ul> -->
		</section>

		<section id="conclusion">
			<h2>Conclusion</h2>
			<p>
				By applying the wisdom of the Enneagram to your relationships, you can cultivate deeper
				understanding, compassion, and connection with your partner and loved ones. We invite you to
				explore the articles in this subsection to discover valuable insights and strategies for
				creating more fulfilling and harmonious relationships.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/blog/enneagram/subtopic/overview">Understanding the Enneagram</a></li>
				<li><a href="/blog/enneagram/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li>
					<a href="/blog/enneagram/subtopic/development">The Enneagram for Personal Development</a>
				</li>
				<li><a href="/blog/enneagram/subtopic/workplace">The Enneagram in the Workplace</a></li>
			</ul>
		</section>

		<!-- <section id="cta">
			<h2>Stay Connected</h2>
			<p>
				Subscribe to our blog for the latest articles and insights on the Enneagram and its
				applications.
			</p>
			<a href="#" class="cta-button">Subscribe Now</a>
		</section> -->
	</main>
{/if}
{#if subsection === 'workplace'}
	<BlogPageHead
		data={{
			title: `9takes- Using the Enneagram in the workplace`,
			description:
				'Blogs about using the Enneagram in the workplace for personal growth and success.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/blog/enneagram/subtopic/workplace',
			lastmod: '2024-05-09',
			blog: true,
			pic: 'greek-statues-disagreeing'
		}}
		{slug}
	/>
	<header>
		<h1>The Enneagram in the Workplace</h1>
	</header>

	<main>
		<section id="introduction">
			<p>
				The Enneagram is a valuable tool for enhancing communication, teamwork, leadership, and
				personal growth in the workplace. By understanding the unique strengths, challenges, and
				motivations of each Enneagram type, you can create a more harmonious and productive work
				environment and achieve greater professional success.
			</p>
		</section>

		<section id="article-list">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/blog/enneagram/{eBlog.slug}"
						class="grid-item inline-it"
						style={eBlog.pic &&
							`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
					>
						<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
							<h3>
								{eBlog.title}
							</h3>
							<p class="font-adjust-p">{eBlog.description}</p>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<section id="conclusion">
			<h2>Conclusion</h2>
			<p>
				By applying the Enneagram framework to your professional life, you can gain valuable
				insights into your own work style, communication preferences, and leadership potential, as
				well as those of your colleagues. We encourage you to explore the articles in this
				subsection to discover how the Enneagram can help you achieve greater success and
				satisfaction in your career.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/blog/enneagram/subtopic/overview">Understanding the Enneagram</a></li>
				<li><a href="/blog/enneagram/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li>
					<a href="/blog/enneagram/subtopic/development">The Enneagram for Personal Development</a>
				</li>
				<li><a href="/blog/enneagram/subtopic/relationships">The Enneagram in Relationships</a></li>
			</ul>
		</section>

		<!-- <section id="cta">
			<h2>Stay Connected</h2>
			<p>
				Subscribe to our blog for the latest articles and insights on the Enneagram and its
				applications.
			</p>
			<a href="#" class="cta-button">Subscribe Now</a>
		</section> -->
	</main>
{/if}
{#if subsection === 'resources'}
	<BlogPageHead
		data={{
			title: `9takes- Enneagram Resources`,
			description:
				'Blogs that serve as various resources for those interested in the Enneagram and its applciations.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/blog/enneagram/subtopic/resources',
			lastmod: '2024-05-09',
			blog: true,
			pic: 'greek-dude-reading-book'
		}}
		{slug}
	/>
	<header>
		<h1>The Enneagram Resources</h1>
	</header>

	<main>
		<section id="introduction">
			<p>
				Exploring the wealth of available Enneagram resources can help you deepen your understanding
				of this powerful personality framework and its practical applications in various areas of
				life. This subsection is dedicated to providing a curated list of high-quality Enneagram
				books, courses, workshops, podcasts, and online communities to support your learning
				journey.
			</p>
		</section>

		<section id="resource-categories">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/blog/enneagram/{eBlog.slug}"
						class="grid-item inline-it"
						style={eBlog.pic &&
							`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
					>
						<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
							<h3>
								{eBlog.title}
							</h3>
							<p class="font-adjust-p">{eBlog.description}</p>
						</div>
					</a>
				{/each}
			</div>
			<!-- <ul>
                <li><a href="/blog/enneagram/subtopic">Enneagram Books</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Courses and Workshops</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Podcasts</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Online Communities and Forums</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Assessment Tools</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Coaching and Therapy Resources</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Apps and Software</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Research and Academic Resources</a></li>
            </ul> -->
		</section>

		<section id="conclusion">
			<h2>Conclusion</h2>
			<p>
				Whether you're new to the Enneagram or a seasoned practitioner, the resources featured in
				this subsection can help you expand your knowledge, deepen your self-awareness, and apply
				the Enneagram more effectively in your personal and professional life. We encourage you to
				explore these resources and find the ones that resonate with your learning style and goals.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/blog/enneagram/subtopic/overview">Understanding the Enneagram</a></li>
				<li><a href="/blog/enneagram/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li>
					<a href="/blog/enneagram/subtopic/development">The Enneagram for Personal Development</a>
				</li>
				<li><a href="/blog/enneagram/subtopic/relationships">The Enneagram in Relationships</a></li>
				<li><a href="/blog/enneagram/subtopic/workplace">The Enneagram in the Workplace</a></li>
			</ul>
		</section>

		<!-- <section id="cta">
			<h2>Stay Connected</h2>
			<p>
				Subscribe to our blog for the latest articles and insights on the Enneagram and its
				applications.
			</p>
			<a href="#" class="cta-button">Subscribe Now</a>
		</section> -->
	</main>
{/if}
{#if subsection === 'situational'}
	<BlogPageHead
		data={{
			title: `9takes- Blogs for using the Enneagram in specific situations`,
			description: 'Blogs that explore how each Enneagram type behaves in specific situations.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/blog/enneagram/subtopic/situational',
			lastmod: '2024-05-09',
			blog: true,
			pic: 'greek-statue-flex'
		}}
		{slug}
	/>
	<header>
		<h1>The Enneagram Types in Specific Situations</h1>
	</header>

	<main>
		<section id="introduction">
			<p>
				Understanding how each Enneagram type typically behaves and reacts in specific situations
				can provide valuable insights into navigating challenging scenarios and improving
				communication and collaboration. This subsection explores the unique ways in which each
				Enneagram type approaches stress, conflict, decision-making, and other common situations.
			</p>
		</section>

		<section id="situation-categories">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/blog/enneagram/{eBlog.slug}"
						class="grid-item inline-it"
						style={eBlog.pic &&
							`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
					>
						<div class={eBlog.pic ? 'txt-white' : 'txt-dark'}>
							<h3>
								{eBlog.title}
							</h3>
							<p class="font-adjust-p">{eBlog.description}</p>
						</div>
					</a>
				{/each}
			</div>
			<!-- <ul>
                <li><a href="/blog/enneagram/subtopic">Enneagram Types Under Stress</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Types in Conflict</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Types and Decision-Making</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Types and Problem-Solving</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Types in Leadership Roles</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Types in Romantic Relationships</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Types as Parents</a></li>
                <li><a href="/blog/enneagram/subtopic">Enneagram Types in Times of Change and Uncertainty</a></li>
            </ul> -->
		</section>

		<section id="conclusion">
			<h2>Conclusion</h2>
			<p>
				By gaining a deeper understanding of how each Enneagram type navigates specific situations,
				you can develop greater self-awareness, empathy, and adaptability in your personal and
				professional life. We invite you to explore the articles in this subsection to learn more
				about leveraging your Enneagram type's strengths and managing its challenges in a variety of
				contexts.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/blog/enneagram/subtopic/overview">Understanding the Enneagram</a></li>
				<li><a href="/blog/enneagram/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li>
					<a href="/blog/enneagram/subtopic/development">The Enneagram for Personal Development</a>
				</li>
				<li><a href="/blog/enneagram/subtopic/relationships">The Enneagram in Relationships</a></li>
				<li><a href="/blog/enneagram/subtopic/workplace">The Enneagram in the Workplace</a></li>
			</ul>
		</section>

		<!-- <section id="cta">
			<h2>Stay Connected</h2>
			<p>
				Subscribe to our blog for the latest articles and insights on the Enneagram and its
				applications.
			</p>
			<a href="#" class="cta-button">Subscribe Now</a>
		</section> -->
	</main>
{/if}

<style lang="scss">
	h3 {
		font-size: 1.5rem;
	}
	p {
		font-size: 1rem;
	}
	a::after {
		display: none !important;
	}

	.blog-grid-container {
		column-count: 3;
		column-gap: 0.5rem;
		orphans: 1;
		gap: 1.5rem;
	}

	.blog-grid-container .grid-item {
		margin-bottom: 0.5rem;
		background-color: rgba(255, 255, 255, 0.5);
		background-size: cover;
		background-position: center;
		text-align: center;
		border: var(--classic-border);
		border-radius: 5px;
		position: relative;
		padding: 0.5rem;
		height: 100%;
		width: 100%;
		gap: 1rem;
		overflow: hidden;
		text-overflow: clip;
		&:hover {
			text-decoration: none;
			filter: sepia(100%) hue-rotate(160deg);
			border: 1px solid var(--color-theme-purple) !important;
		}
	}

	.temp-three-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 0.5rem;
		grid-row: inherit;
	}

	.fit-card {
		position: absolute;
		/* top: 0;
		right: 0; */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 2;
		padding: 1rem;
		width: 100%;
	}
	.inline-it {
		display: inline-block;
	}

	@media (max-width: 550px) {
		h3 {
			font-size: 1rem;
		}
		p {
			font-size: 0.7rem;
		}

		.temp-three-row {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}

		.blog-grid-container {
			grid-template-columns: 45vw 45vw;
			// gap: 0;
			column-gap: 0.5rem;
		}
		.inline-it {
			width: 30vw; // !important;
		}
		.fit-card {
			padding: 0.5rem;
		}

		.three-small {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}

	@media (min-width: 850px) {
		.blog-grid-container {
			grid-auto-rows: 300px;
		}
	}
</style>

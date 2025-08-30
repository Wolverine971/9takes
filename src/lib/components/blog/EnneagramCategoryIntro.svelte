<!-- src/lib/components/blog/EnneagramCategoryIntro.svelte -->
<script lang="ts">
	import BlogPageHead from './BlogPageHead.svelte';

	export let subsection: string;
	export let blogs: any;

	const slug = `enneagram-corner/subtopic/${subsection}`;
</script>

{#if subsection === 'overview'}
	<BlogPageHead
		data={{
			title: `Master the Enneagram: The Complete Psychology Framework | 9takes`,
			description:
				'Discover why millions use the Enneagram to decode human behavior. From childhood wounds to adult patterns, master the system that transforms self-understanding.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/enneagram-corner/subtopic/overview',
			lastmod: '2025-08-15',
			blog: true,
			pic: ''
		}}
		{slug}
	/>
	<header>
		<h1>The Enneagram: Your Operating System Decoded</h1>
	</header>

	<main>
		<section id="introduction">
			<p>
				<strong>You've been running on autopilot your entire life.</strong> Every reaction, every decision,
				every relationship pattern — they're all driven by an invisible operating system you never chose
				to install.
			</p>
			<p>
				The Enneagram reveals this hidden code. It's not just another personality test — it's a map
				of your psychological DNA, showing exactly why you sabotage yourself in predictable ways and
				how to finally break free. Master this framework, and you'll understand people at levels
				they don't even understand themselves.
			</p>
		</section>

		<section id="article-list">
			<h2>All Articles</h2>
			<div class="enneagram-blog-grid">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
						class="blog-card {!eBlog.pic ? 'no-image' : ''}"
						style={eBlog.pic &&
							`background-image: url(${`/blogs/s-${eBlog.pic}.webp`}); background-size: cover;`}
					>
						<div class="card-content">
							<h3>
								{eBlog.title}
							</h3>
							<p>{eBlog.description}</p>
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
				life.
			</p>
			<p>
				We encourage you to explore the articles in this subsection to gain a solid foundation in
				Enneagram theory and its applications.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/enneagram-corner/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li>
					<a href="/enneagram-corner/subtopic/development">The Enneagram for Personal Development</a
					>
				</li>
				<li>
					<a href="/enneagram-corner/subtopic/relationships">The Enneagram in Relationships</a>
				</li>
				<li><a href="/enneagram-corner/subtopic/workplace">The Enneagram in the Workplace</a></li>
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
			loc: 'https://9takes.com/enneagram-corner/subtopic/nine-types',
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
						href="/enneagram-corner/{eBlog.slug}"
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
				improved communication, and building stronger relationships.
			</p>
			<p>
				We encourage you to explore the articles in this subsection to learn more about the unique
				qualities, challenges, and growth opportunities for each type.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li>
					<a href="/enneagram-corner/subtopic/overview">Understanding the Enneagram</a>
				</li>
				<li>
					<a href="/enneagram-corner/subtopic/development">The Enneagram for Personal Development</a
					>
				</li>
				<li>
					<a href="/enneagram-corner/subtopic/relationships">The Enneagram in Relationships</a>
				</li>
				<li><a href="/enneagram-corner/subtopic/workplace">The Enneagram in the Workplace</a></li>
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
			loc: 'https://9takes.com/enneagram-corner/subtopic/development',
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
				framework for personal growth and self-improvement.
			</p>
			<p>
				By exploring the unique challenges and opportunities for development within each Enneagram
				type, you can create a tailored path to reaching your full potential.
			</p>
		</section>

		<section id="article-list">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
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
				into your unique challenges and opportunities for growth.
			</p>
			<p>
				We encourage you to explore the articles in this subsection to find tailored strategies and
				guidance for your Enneagram type, empowering you to create lasting positive change in your
				life.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/enneagram-corner/subtopic/overview">Understanding the Enneagram</a></li>
				<li><a href="/enneagram-corner/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li>
					<a href="/enneagram-corner/subtopic/relationships">The Enneagram in Relationships</a>
				</li>
				<li><a href="/enneagram-corner/subtopic/workplace">The Enneagram in the Workplace</a></li>
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
			loc: 'https://9takes.com/enneagram-corner/subtopic/relationships',
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
				communication styles, and compatibility between different personality types.
			</p>
			<p>
				By exploring how each Enneagram type approaches relationships, you can gain valuable
				insights into creating more harmonious and fulfilling connections with others.
			</p>
		</section>

		<section id="article-list">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
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
				understanding, compassion, and connection with your partner and loved ones.
			</p>
			<p>
				We invite you to explore the articles in this subsection to discover valuable insights and
				strategies for creating more fulfilling and harmonious relationships.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/enneagram-corner/subtopic/overview">Understanding the Enneagram</a></li>
				<li><a href="/enneagram-corner/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li>
					<a href="/enneagram-corner/subtopic/development">The Enneagram for Personal Development</a
					>
				</li>
				<li><a href="/enneagram-corner/subtopic/workplace">The Enneagram in the Workplace</a></li>
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
			loc: 'https://9takes.com/enneagram-corner/subtopic/workplace',
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
				The Enneagram can be used to enhance communication, teamwork, leadership, and personal
				growth in the workplace.
			</p>
			<p>
				By understanding the unique strengths, challenges, and motivations of each Enneagram type,
				you can create a more harmonious and productive work environment and achieve greater
				professional success.
			</p>
		</section>

		<section id="article-list">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
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
				By applying the Enneagram framework to your professional life, you can gain insight into
				your own work style, communication preferences, and leadership potential, as well as those
				of your colleagues.
			</p>
			<p>
				We encourage you to explore the articles in this subsection to discover how the Enneagram
				can help you achieve greater success and satisfaction in your career.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Related Subsections</h2>
			<ul>
				<li><a href="/enneagram-corner/subtopic/overview">Understanding the Enneagram</a></li>
				<li><a href="/enneagram-corner/subtopic/nine-types">The Nine Enneagram Types</a></li>
				<li>
					<a href="/enneagram-corner/subtopic/development">The Enneagram for Personal Development</a
					>
				</li>
				<li>
					<a href="/enneagram-corner/subtopic/relationships">The Enneagram in Relationships</a>
				</li>
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
			title: `Essential Enneagram Resources: Tools, Tests & Training | 9takes`,
			description:
				'Cut through the noise. Access the best Enneagram tests, books, tools, and training. Curated resources for serious students of personality psychology.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/enneagram-corner/subtopic/resources',
			lastmod: '2025-08-15',
			blog: true,
			pic: 'greek-dude-reading-book'
		}}
		{slug}
	/>
	<header>
		<h1>Resources That Actually Work (We Tested Everything)</h1>
	</header>

	<main>
		<section id="introduction">
			<p>
				<strong>90% of Enneagram content is garbage.</strong> Surface-level buzzfeed quizzes, Instagram
				infographics that oversimplify, books that contradict each other. We've sorted through it all
				so you don't have to.
			</p>
			<p>
				These are the resources that pass our test: scientifically grounded, practically useful, and
				actually accurate. No fluff, no mysticism, just tools that deliver real psychological
				insight.
			</p>
		</section>

		<section id="resource-categories">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
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
                <li><a href="/enneagram-corner/subtopic">Enneagram Books</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Courses and Workshops</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Podcasts</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Online Communities and Forums</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Assessment Tools</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Coaching and Therapy Resources</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Apps and Software</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Research and Academic Resources</a></li>
            </ul> -->
		</section>

		<section id="conclusion">
			<h2>Skip the Beginner Mistakes</h2>
			<p>
				Most people waste months on bad tests, contradictory books, and surface-level content. <strong
					>Start with resources that actually deliver results.</strong
				> We've done the research, tested the tools, and validated the frameworks.
			</p>
			<p>
				Our curated collection includes professional-grade assessments, evidence-based books, and
				advanced training programs. Stop wasting time on personality astrology. Get the real tools.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Apply Your Knowledge</h2>
			<ul>
				<li><a href="/enneagram-corner/subtopic/overview">🎓 Start With Core Theory</a></li>
				<li><a href="/enneagram-corner/subtopic/nine-types">🔬 Study All 9 Types</a></li>
				<li>
					<a href="/enneagram-corner/subtopic/development">🚀 Apply to Personal Growth</a>
				</li>
				<li>
					<a href="/enneagram-corner/subtopic/relationships">💕 Transform Your Relationships</a>
				</li>
				<li><a href="/enneagram-corner/subtopic/workplace">💼 Optimize Your Career</a></li>
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
			title: `Real-World Type Behaviors: How Each Type Actually Shows Up | 9takes`,
			description:
				'See the types in action. From first dates to job interviews, from parties to panic attacks — understand exactly how each type behaves in real situations.',
			slug: slug,
			author: 'DJ Wayne',
			date: '2024-05-09',
			loc: 'https://9takes.com/enneagram-corner/subtopic/situational',
			lastmod: '2025-08-15',
			blog: true,
			pic: 'greek-statue-flex'
		}}
		{slug}
	/>
	<header>
		<h1>The Types in the Wild: Real Situations, Real Behaviors</h1>
	</header>

	<main>
		<section id="introduction">
			<p>
				<strong>Theory is useless without application.</strong> You can memorize all nine types, but
				can you spot them at a party? In a meeting? During a crisis? On a first date?
			</p>
			<p>
				These guides show you exactly how each type behaves in specific, real-world situations. No
				abstract theory — just concrete patterns you'll recognize immediately. Learn to read people
				like a book in any scenario.
			</p>
		</section>

		<section id="situation-categories">
			<h2>All Articles</h2>
			<div class="blog-grid-container temp-three-row">
				{#each blogs as eBlog}
					<a
						href="/enneagram-corner/{eBlog.slug}"
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
                <li><a href="/enneagram-corner/subtopic">Enneagram Types Under Stress</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Types in Conflict</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Types and Decision-Making</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Types and Problem-Solving</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Types in Leadership Roles</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Types in Romantic Relationships</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Types as Parents</a></li>
                <li><a href="/enneagram-corner/subtopic">Enneagram Types in Times of Change and Uncertainty</a></li>
            </ul> -->
		</section>

		<section id="conclusion">
			<h2>Become a Human Behavior Expert</h2>
			<p>
				Imagine walking into any room and instantly understanding everyone's motivations, fears, and
				likely behaviors. <strong>This isn't mind reading — it's pattern recognition.</strong>
			</p>
			<p>
				Our situational guides train you to spot types in action, predict their responses, and adapt
				your approach accordingly. Whether you're dating, managing, selling, or just trying to
				understand people better, these are your field guides to human behavior.
			</p>
		</section>

		<section id="related-subsections">
			<h2>Master Every Domain</h2>
			<ul>
				<li><a href="/enneagram-corner/subtopic/overview">🧠 Learn the Psychology</a></li>
				<li><a href="/enneagram-corner/subtopic/nine-types">👥 Understand All Types</a></li>
				<li>
					<a href="/enneagram-corner/subtopic/development">🎯 Apply to Yourself</a>
				</li>
				<li>
					<a href="/enneagram-corner/subtopic/relationships">❤️ Navigate Relationships</a>
				</li>
				<li><a href="/enneagram-corner/subtopic/workplace">💼 Excel Professionally</a></li>
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
	/* Style Guide Compliant Styles */
	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: #2d3436;
		margin-bottom: 1.5rem;
	}

	h2 {
		font-size: 1.875rem;
		font-weight: 600;
		color: #2d3436;
		margin-bottom: 1rem;
	}

	h3 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #2d3436;
	}

	p {
		font-size: 0.9rem;
		color: #636e72;
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	/* Disable default link arrows */
	a::after {
		display: none !important;
	}

	/* Blog Grid - Style Guide Compliant */
	.enneagram-blog-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-bottom: 4rem;
	}

	.blog-card {
		aspect-ratio: 3 / 4;
		border-radius: 12px;
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-decoration: none;
		display: flex;
		position: relative;
		overflow: hidden;
		background-size: cover;
		background-position: center;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgba(108, 92, 231, 0.15);
			border-color: rgba(108, 92, 231, 0.2);
		}

		/* Dark cards for no-image items */
		&.no-image {
			background: linear-gradient(135deg, #1a1a2e 0%, #2d3436 100%);
			border: 1px solid rgba(255, 255, 255, 0.08);

			&:hover {
				background: linear-gradient(135deg, #2d3436 0%, #3d4447 100%);
			}

			.card-content {
				background: none;

				h3 {
					color: white;
				}

				p {
					color: rgba(255, 255, 255, 0.8);
				}
			}
		}

		.card-content {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 1.5rem;
			background: linear-gradient(
				to top,
				rgba(0, 0, 0, 0.9) 0%,
				rgba(0, 0, 0, 0.7) 60%,
				rgba(0, 0, 0, 0.2) 100%
			);
			min-height: 60%;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			gap: 0.75rem;

			h3 {
				color: white;
				font-size: 1.15rem;
				font-weight: 600;
				line-height: 1.35;
				margin: 0;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			p {
				color: rgba(255, 255, 255, 0.95);
				font-size: 0.875rem;
				line-height: 1.5;
				margin: 0;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
		}
	}

	/* Legacy support */
	.blog-grid-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
		margin-bottom: 4rem;
	}

	.temp-three-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	/* Section spacing */
	section {
		margin-bottom: 2rem;
	}

	/* Related links styling */
	#related-subsections {
		ul {
			list-style: none;
			padding: 0;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 1rem;

			li a {
				display: block;
				padding: 1rem;
				background: white;
				border: 1px solid rgba(0, 0, 0, 0.08);
				border-radius: 8px;
				text-decoration: none;
				color: #6c5ce7;
				transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

				&:hover {
					background: rgba(108, 92, 231, 0.05);
					transform: translateX(4px);
				}
			}
		}
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.enneagram-blog-grid,
		.blog-grid-container,
		.temp-three-row {
			grid-template-columns: 1fr;
			gap: 1rem;
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

		.blog-card .card-content h3 {
			font-size: 1rem;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}

		.blog-card .card-content p {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 550px) {
		.enneagram-blog-grid,
		.blog-grid-container,
		.temp-three-row {
			grid-template-columns: 1fr;
		}

		p {
			font-size: 0.85rem;
		}
	}
</style>

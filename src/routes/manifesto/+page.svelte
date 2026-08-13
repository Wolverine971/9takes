<!-- src/routes/manifesto/+page.svelte -->
<script lang="ts">
	import { Button, SectionKicker } from '$lib/components/atoms';
	import SEOHead from '$lib/components/SEOHead.svelte';

	const title = 'The 9takes Manifesto | Answer Before the Crowd';
	const description =
		'The internet collapses nine perspectives into one winning take. 9takes opens the room again so you can answer before the crowd and see what others see.';
	const canonical = 'https://9takes.com/manifesto';
	const socialImage = 'https://9takes.com/images/home-reimagined/streetlamp-nine.webp';

	const articleJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		'@id': `${canonical}#article`,
		headline: 'The internet collapses nine perspectives into one winning take.',
		description,
		datePublished: '2026-08-13',
		dateModified: '2026-08-13',
		mainEntityOfPage: canonical,
		author: {
			'@type': 'Person',
			'@id': 'https://9takes.com/#dj-wayne',
			name: 'DJ Wayne',
			url: 'https://9takes.com/about'
		},
		publisher: {
			'@type': 'Organization',
			'@id': 'https://9takes.com/#organization',
			name: '9takes',
			url: 'https://9takes.com'
		},
		image: socialImage
	};
</script>

<SEOHead
	{title}
	{description}
	{canonical}
	ogImage={socialImage}
	twitterImage={socialImage}
	twitterImageAlt="Nine people gathered in conversation beneath a streetlamp"
	ogType="article"
	jsonLd={articleJsonLd}
	author="DJ Wayne"
/>

<article class="manifesto-page">
	<header class="manifesto-hero">
		<SectionKicker num="00" label="THE 9TAKES MANIFESTO" />
		<h1>The internet collapses nine perspectives into one winning take.</h1>
		<p class="hero-promise">See the emotions behind every take.</p>
		<p class="hero-intro">
			9takes exists to protect an honest first read, open the room to other perspectives, and help
			us stop mistaking someone else&rsquo;s alarm for a defect.
		</p>
		<div class="hero-actions">
			<Button href="/questions" size="lg">Answer a question</Button>
			<Button href="/about" size="lg" variant="secondary">About 9takes</Button>
		</div>
	</header>

	<div class="manifesto-body">
		<section aria-labelledby="two-emergencies">
			<SectionKicker num="01" label="THE SAME SITUATION" />
			<h2 id="two-emergencies">Two different emergencies</h2>
			<p>Early in my marriage, my wife and I could turn one concern into the same painful loop.</p>
			<p>
				I would see her worried and fearful and try to override it. I was angry. I wanted to push
				through, get the decision over with, and move forward. The more forcefully I moved, the less
				safe she felt. The more fearful she became, the angrier I became.
			</p>
			<blockquote>
				<p>She was afraid of my anger. I was angry at her fear.</p>
			</blockquote>
			<p>
				Underneath the argument, we were asking each other for two different things. I wanted her to
				trust me and trust my judgment. She wanted me to slow down enough to address her worries,
				concerns, and fears. I experienced slowing down as needless resistance. She experienced my
				speed as proof that her safety did not matter.
			</p>
			<p class="section-emphasis">
				We were responding to the same situation as though it contained two different emergencies.
			</p>
			<p>
				This kind of loop plays out all the time&mdash;in marriages, families, teams, friendships,
				and public arguments. Each person has an internal flow that makes complete sense from the
				inside. We notice different signals. We feel different things are at stake. We reach for
				different forms of protection.
			</p>
			<p>Your strongest alarm feels like reality. Someone else&rsquo;s can look like a defect.</p>
		</section>

		<section aria-labelledby="crowd-worse">
			<SectionKicker num="02" label="THE CROWD" tone="data" />
			<h2 id="crowd-worse">The crowd makes this worse</h2>
			<p>
				In person, two people can sometimes slow down long enough to discover what the other one is
				protecting. Online, the architecture pushes in the opposite direction.
			</p>
			<p>
				The internet rewards one winning interpretation of a situation and buries the rest. The
				earliest, sharpest, angriest, funniest, or most familiar answer becomes the room. Everyone
				arriving later sees what already won, adjusts to it, and decides whether it is safe or
				worthwhile to say something different.
			</p>
			<p>The result looks like consensus. Often it is only crowd gravity.</p>
			<p>
				You do not get a clear view of how people independently understood the situation. You get
				one perspective with an audience.
			</p>
			<div class="belief-card">
				<span>Movement belief</span>
				<strong>The internet collapses nine perspectives into one winning take.</strong>
				<p>9takes exists to open the room again.</p>
			</div>
		</section>

		<section aria-labelledby="beliefs">
			<SectionKicker num="03" label="WHAT WE BELIEVE" />
			<h2 id="beliefs">Different alarms. Coherent perspectives.</h2>
			<p>
				Human beings share three basic emotional alarms: anger, fear, and shame. We all experience
				all three, but we do not give them the same weight. We build different strategies for
				staying safe, valuable, capable, connected, in control, or at peace.
			</p>
			<p>
				The Enneagram maps nine recurring patterns within those strategies. It gives us a practical
				language for why the same moment can produce different&mdash;and internally
				coherent&mdash;responses.
			</p>
			<ol class="convictions">
				<li>Most disagreement is a perspective mismatch before it is a fact mismatch.</li>
				<li>The person you find irrational may be responding to an alarm you do not feel.</li>
				<li>
					You cannot recover someone&rsquo;s untouched first read after the crowd has shown them
					what to think.
				</li>
				<li>
					Understanding the emotional logic behind behavior creates empathy that labels alone
					cannot.
				</li>
				<li>
					The framework should stay simple until more depth is useful: anger, fear, shame; three
					centers; nine patterns.
				</li>
			</ol>
			<p class="research-link">
				The research and philosophical case lives in
				<a href="/community/consensus-on-human-nature"
					>&ldquo;A 2,400-Year Consensus on Human Nature.&rdquo;</a
				>
			</p>
		</section>

		<section aria-labelledby="answer-first">
			<SectionKicker num="04" label="THE RITUAL" tone="data" />
			<h2 id="answer-first">Answer before the crowd</h2>
			<p>
				Other perspectives stay hidden until you contribute your own. No scanning the comments to
				find the acceptable position. No borrowing the room&rsquo;s language. No waiting to see
				which answer earns approval.
			</p>
			<p>Then the room opens.</p>
			<p class="section-emphasis">One question, nine perspectives.</p>
			<p>
				Your answer sits beside responses shaped by different fears, instincts, desires, and
				priorities. The point is not to declare one type correct. The differences are the value.
			</p>
			<p>
				You may recognize yourself. You may encounter an answer you could never have generated. You
				may finally understand why another person&rsquo;s response felt so obvious to them and so
				wrong to you.
			</p>
			<p>
				That is the product, but it is also the practice: commit to your own perspective, then
				become curious about what it cannot see.
			</p>
		</section>

		<section aria-labelledby="refuse">
			<SectionKicker num="05" label="WHAT WE REFUSE" />
			<h2 id="refuse">Personality is a door that opens from the inside</h2>
			<p>9takes will not tell you who you are.</p>
			<p>
				I spent years in personality communities watching self-appointed experts diagnose strangers,
				and I did my own share of telling people their type before they were ready. It does not
				work. Arguing with someone who has already decided what you are is miserable.
			</p>
			<p>
				People do not want a label shoved down their throat. They want the chance to recognize
				themselves.
			</p>
			<ul class="values-list">
				<li>Self-discovery over diagnosis.</li>
				<li>Questions over verdicts.</li>
				<li>Understanding over judgment.</li>
				<li>Protected honesty, not consequence-free cruelty.</li>
				<li>No ads built from your psychology and no selling personal data.</li>
			</ul>
			<p>The Enneagram is a map. It should make people more human, not easier to dismiss.</p>
		</section>

		<section aria-labelledby="open-room">
			<SectionKicker num="06" label="THE PROMISED CHANGE" tone="data" />
			<h2 id="open-room">Open the room again</h2>
			<p>
				Winning does not mean everyone agrees. It means the room becomes large enough to hold honest
				disagreement without flattening the people inside it.
			</p>
			<p>
				It means that when someone says, &ldquo;I want to know what people really think about
				this,&rdquo; they put the question on 9takes. It means questions travel because the answers
				genuinely surprise people. It means someone reads nine takes on a situation they believed
				had one obvious interpretation and catches their own blind spot in the wild.
			</p>
			<p class="section-emphasis">
				Most of all, it means fewer people mistake someone else&rsquo;s alarm for a defect.
			</p>
			<div class="signature">
				<strong>DJ Wayne</strong>
				<span>Founder, 9takes</span>
				<span>Enneagram 8, still learning to slow down when someone else is afraid.</span>
			</div>
		</section>
	</div>

	<footer class="manifesto-cta">
		<SectionKicker num="07" label="YOUR TAKE IS MISSING" />
		<h2>Answer before the crowd.</h2>
		<p>Give one honest answer. Then see the emotions behind the other takes.</p>
		<Button href="/questions" size="lg">Enter the questions</Button>
	</footer>
</article>

<style lang="scss">
	.manifesto-page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 5rem 1.25rem 4rem;
		color: var(--ink-bright);
	}

	.manifesto-hero {
		max-width: 900px;
		margin: 0 auto 5rem;
		text-align: center;
	}

	.manifesto-hero h1 {
		max-width: 880px;
		margin: 1rem auto 1.25rem;
		font-family: var(--font-display);
		font-size: clamp(2.7rem, 6.5vw, 5.6rem);
		font-weight: 700;
		line-height: 0.98;
		text-wrap: balance;
	}

	.hero-promise {
		margin: 0;
		color: var(--lamp-glow);
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 2.5vw, 2rem);
		font-weight: 700;
	}

	.hero-intro {
		max-width: 680px;
		margin: 1rem auto 0;
		color: var(--ink-mid);
		font-size: 1.08rem;
		line-height: 1.75;
		text-wrap: pretty;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 1.75rem;
	}

	.manifesto-body {
		max-width: 760px;
		margin: 0 auto;
	}

	.manifesto-body section {
		padding: 3.25rem 0;
		border-top: 1px solid var(--stone-edge);
	}

	.manifesto-body h2,
	.manifesto-cta h2 {
		margin: 0.85rem 0 1.4rem;
		font-family: var(--font-display);
		font-size: clamp(2rem, 4.5vw, 3.25rem);
		font-weight: 700;
		line-height: 1.05;
		text-wrap: balance;
	}

	.manifesto-body p,
	.manifesto-body li {
		font-size: 1.06rem;
		line-height: 1.82;
	}

	.manifesto-body p {
		margin: 0 0 1.2rem;
		color: var(--ink-mid);
	}

	.manifesto-body blockquote {
		margin: 2rem 0;
		padding: 1.25rem 1.5rem;
		background: var(--stone-warm);
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 28%, var(--stone-edge));
		border-left: 4px solid var(--lamp-glow);
		border-radius: 0.625rem;

		p {
			margin: 0;
			color: var(--ink-bright);
			font-family: var(--font-display);
			font-size: clamp(1.35rem, 3vw, 2rem);
			font-weight: 700;
			line-height: 1.25;
		}
	}

	.section-emphasis {
		color: var(--ink-bright) !important;
		font-family: var(--font-display);
		font-size: 1.28rem !important;
		font-weight: 700;
		line-height: 1.45 !important;
	}

	.belief-card {
		margin-top: 2rem;
		padding: 1.5rem;
		background: var(--stone-warm);
		border: 1px solid color-mix(in srgb, var(--data-teal) 38%, var(--stone-edge));
		border-radius: 1rem;

		span {
			display: block;
			margin-bottom: 0.65rem;
			color: var(--data-teal);
			font-family: var(--font-mono);
			font-size: 0.75rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.08em;
		}

		strong {
			display: block;
			font-family: var(--font-display);
			font-size: clamp(1.45rem, 3vw, 2.15rem);
			line-height: 1.2;
		}

		p {
			margin: 0.75rem 0 0;
		}
	}

	.convictions,
	.values-list {
		display: grid;
		gap: 0.7rem;
		margin: 1.5rem 0;
		padding-left: 1.35rem;
		color: var(--ink-mid);
	}

	.convictions li::marker {
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-weight: 700;
	}

	.values-list li::marker {
		color: var(--data-teal);
	}

	.research-link a {
		color: var(--lamp-glow);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.signature {
		display: grid;
		gap: 0.25rem;
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--stone-edge);

		strong {
			font-family: var(--font-display);
			font-size: 1.35rem;
		}

		span {
			color: var(--ink-dim);
			font-size: 0.9rem;
		}
	}

	.manifesto-cta {
		max-width: 900px;
		margin: 3rem auto 0;
		padding: 3rem 1.5rem;
		background: var(--stone-warm);
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 28%, var(--stone-edge));
		border-radius: 1rem;
		text-align: center;

		p {
			max-width: 580px;
			margin: 0 auto 1.5rem;
			color: var(--ink-mid);
			font-size: 1.05rem;
			line-height: 1.65;
		}
	}

	@media (max-width: 640px) {
		.manifesto-page {
			padding: 3.5rem 1rem 3rem;
		}

		.manifesto-hero {
			margin-bottom: 3rem;
		}

		.manifesto-body section {
			padding: 2.5rem 0;
		}

		.manifesto-body p,
		.manifesto-body li {
			font-size: 1rem;
		}

		.manifesto-body blockquote,
		.belief-card {
			padding: 1.15rem;
		}

		.manifesto-cta {
			padding: 2.25rem 1rem;
		}
	}
</style>

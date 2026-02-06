<!-- src/lib/components/blog/EnneagramTypeIntro.svelte -->
<script lang="ts">
	let { type }: { type: string } = $props();
</script>

{#if type === '1'}
	<h2>What Drives a Type 1</h2>

	<p>
		You know that person who notices the one crooked picture frame in a room full of art? That's a
		Type 1. They carry an internal compass that's always pointing toward "how things should be" —
		and they can't turn it off. This makes them principled, reliable, and relentless about doing
		things the right way.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Highly critical, inflexible, detail-oriented perfectionists
		</li>
		<li><strong>Archetypes</strong>: The Reformer, The Judge, The Strict Teacher, The Crusader</li>
		<li>
			<strong>Struggles</strong>: Difficulty relaxing, being overly self-critical, holding
			themselves and others to unrealistic standards
		</li>
		<li>
			<strong>Gifts</strong>: Strong moral compass, dedication to self-improvement, ability to
			create order from chaos
		</li>
		<li>
			<strong>Recognized by</strong>: Meticulous attention to detail, correcting small errors others
			miss, a visible tension between wanting to speak up and wanting to keep the peace
		</li>
	</ul>

	<h2>The Perfectionist's Worldview</h2>

	<p>
		For a Type 1, the world is a rough draft that needs editing. Everything could be better — and
		they feel personally responsible for improving it. Here's what's running through their mind:
	</p>
	<ul>
		<li>A clear line between right and wrong that most people seem to ignore</li>
		<li>Constant potential for improvement in themselves and their surroundings</li>
		<li>A personal responsibility to uphold standards and principles</li>
		<li>Order, structure, and rules as the backbone of a functioning society</li>
		<li>Every broken system as something they could fix if given the chance</li>
	</ul>

	<p>
		Spot a Type 1 by their corrections. They're not trying to be difficult — they genuinely can't
		unsee the mistake. Match their precision and you'll earn deep respect.
	</p>
{/if}

{#if type === '2'}
	<h2>What Drives a Type 2</h2>

	<p>
		Ever meet someone who remembered your coffee order after hearing it once? Who checked in on you
		after a rough day you barely mentioned? That's a Type 2 operating at full power. They have an
		almost supernatural ability to read what you need — sometimes before you know it yourself.
	</p>
	<ul>
		<li><strong>Stereotypes</strong>: People-pleasers, overly accommodating, emotionally needy</li>
		<li><strong>Archetypes</strong>: The Caregiver, The Nurturer, The Servant, The Confidant</li>
		<li>
			<strong>Struggles</strong>: Difficulty setting boundaries, neglecting their own needs, seeking
			validation through helping others
		</li>
		<li>
			<strong>Gifts</strong>: Highly attuned to others' emotions, natural empathy, ability to make
			people feel genuinely seen and loved
		</li>
		<li>
			<strong>Recognized by</strong>: Warm and approachable demeanor, always the first to offer
			help, remembering personal details about everyone
		</li>
	</ul>

	<h2>The Helper's Worldview</h2>

	<p>
		A Type 2 walks into every room scanning for who needs something. It's not calculated — it's
		automatic. Their internal wiring maps the world like this:
	</p>
	<ul>
		<li>Every interaction is a chance to make someone's day better</li>
		<li>Relationships and emotional bonds are the most valuable currency</li>
		<li>Love and appreciation flow back to those who give generously</li>
		<li>Healing and connection are possible in even brief encounters</li>
		<li>Their own worth is tied to how needed and appreciated they feel</li>
	</ul>

	<p>
		Navigate a Type 2 by appreciating them without being asked. They spend so much energy on
		everyone else that unsolicited recognition genuinely catches them off guard — in the best way.
	</p>
{/if}
{#if type === '3'}
	<h2>What Drives a Type 3</h2>
	<p>
		In any meeting, the Type 3 already knows who the decision-maker is and has positioned themselves
		accordingly. They're wired for achievement — reading the room, adapting their approach, and
		executing with a polish that makes it look effortless. What you see is someone who just "gets
		it." What you don't see is how carefully they've calibrated every move.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Status-seeking, overly competitive, image-conscious workaholics
		</li>
		<li>
			<strong>Archetypes</strong>: The Performer, The Entrepreneur, The Politician, The Role Model
		</li>
		<li>
			<strong>Struggles</strong>: Difficulty being authentic, tying self-worth to achievements, deep
			fear of failure and rejection
		</li>
		<li>
			<strong>Gifts</strong>: Goal-oriented mindset, ability to inspire and motivate others, highly
			adaptable to changing circumstances
		</li>
		<li>
			<strong>Recognized by</strong>: Polished appearance, confident energy, steering conversations
			toward accomplishments and next steps
		</li>
	</ul>

	<h2>The Achiever's Worldview</h2>

	<p>
		Ask yourself: what would the world look like if your value depended entirely on what you
		produced? That's a Type 3's reality. Their internal scoreboard never stops running:
	</p>
	<ul>
		<li>Life is a series of challenges to be conquered and milestones to hit</li>
		<li>Success and achievement are the primary measures of personal worth</li>
		<li>Every situation contains an opportunity for advancement or recognition</li>
		<li>Image and reputation are strategic tools for reaching goals</li>
		<li>Competition is natural — someone's always winning, and it should be them</li>
	</ul>

	<p>
		Read a Type 3 by watching what they do when nobody's clapping. That's where you'll see the real
		person behind the performance.
	</p>
{/if}
{#if type === '4'}
	<h2>What Drives a Type 4</h2>
	<p>
		While everyone else is having a good time at the party, a Type 4 is wondering why the good time
		feels slightly hollow. They experience emotions at a depth most people don't access — and that
		intensity is both their superpower and their curse. They're not being dramatic. They genuinely
		feel things differently.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Moody artists, self-absorbed dreamers, overly sensitive
		</li>
		<li>
			<strong>Archetypes</strong>: The Romantic, The Individualist, The Bohemian, The Aesthete
		</li>
		<li>
			<strong>Struggles</strong>: Prone to melancholy and envy, difficulty accepting ordinary
			reality, a persistent feeling of being misunderstood
		</li>
		<li>
			<strong>Gifts</strong>: Deeply creative and expressive, ability to transform pain into art,
			empathetic and compassionate toward suffering
		</li>
		<li>
			<strong>Recognized by</strong>: Distinctive personal style, gravitating toward deep
			conversations over small talk, an aesthetic sensibility in everything they touch
		</li>
	</ul>

	<h2>The Individualist's Worldview</h2>

	<p>
		Imagine feeling like everyone else got an instruction manual for life that you never received.
		That's the emotional undercurrent of a Type 4. Their world is filtered through:
	</p>
	<ul>
		<li>Beauty and meaning hiding in the melancholy and bittersweet moments</li>
		<li>The world as a canvas — every choice is an act of self-expression</li>
		<li>A fundamental sense of being different from everyone around them</li>
		<li>Emotions as data that most people are too afraid to explore</li>
		<li>Life as a search for significance and authentic identity</li>
	</ul>

	<p>
		Decode a Type 4 by taking their emotions seriously. Don't try to "fix" their mood. Sit with them
		in it — that's how you earn their trust.
	</p>
{/if}
{#if type === '5'}
	<h2>What Drives a Type 5</h2>

	<p>
		A Type 5 spent their weekend learning how jet engines work. Not because they needed to — just
		because the question crossed their mind. They're the ones who disappear into a topic for hours,
		emerge with a working mental model, and then need a full day alone to recharge. Knowledge isn't
		a hobby for them. It's how they feel safe in the world.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Detached observers, socially awkward intellectuals, eccentric
			loners
		</li>
		<li><strong>Archetypes</strong>: The Researcher, The Philosopher, The Scientist, The Expert</li>
		<li>
			<strong>Struggles</strong>: Difficulty connecting emotionally, tendency to withdraw when
			overwhelmed, fear of being incompetent or unprepared
		</li>
		<li>
			<strong>Gifts</strong>: Highly analytical and objective, ability to think deeply and innovate,
			remarkably self-sufficient and resourceful
		</li>
		<li>
			<strong>Recognized by</strong>: Intellectual curiosity about niche topics, needing alone time
			after social events, giving precise and carefully worded answers
		</li>
	</ul>

	<h2>The Investigator's Worldview</h2>

	<p>
		For a Type 5, the world is an enormously complex system — and they need to understand it before
		they can engage with it. Here's what's running underneath:
	</p>
	<ul>
		<li>Everything can be analyzed, mapped, and understood with enough information</li>
		<li>Knowledge and competence are essential for navigating an unpredictable world</li>
		<li>Energy is a finite resource that must be conserved and spent wisely</li>
		<li>Personal space and firm boundaries are non-negotiable</li>
		<li>Detachment and objective observation reveal truths that emotion obscures</li>
	</ul>

	<p>
		Navigate a Type 5 by respecting their space and leading with substance. Skip the small talk. Ask
		them what they've been researching — then actually listen. That's their love language.
	</p>
{/if}
{#if type === '6'}
	<h2>What Drives a Type 6</h2>
	<p>
		The Type 6 is the friend who texted "did you get home safe?" before you even parked the car.
		They're constantly scanning for what could go wrong — not because they're pessimists, but
		because they care deeply about protecting the people and systems they've committed to. Loyalty
		is their defining trait, and they test it in everyone they meet.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Anxious worriers, overly suspicious, blindly loyal followers
		</li>
		<li>
			<strong>Archetypes</strong>: The Skeptic, The Guardian, The Trooper, The Devil's Advocate
		</li>
		<li>
			<strong>Struggles</strong>: Prone to anxiety and self-doubt, difficulty trusting people until
			they've been thoroughly tested, worst-case scenario thinking
		</li>
		<li>
			<strong>Gifts</strong>: Highly attuned to potential risks, ability to create stability and
			security for their community, fiercely loyal and supportive
		</li>
		<li>
			<strong>Recognized by</strong>: Asking lots of questions, having backup plans for their backup
			plans, fierce loyalty once you've earned their trust
		</li>
	</ul>

	<h2>The Loyalist's Worldview</h2>

	<p>
		What does the world look like when you're always scanning for threats? For a Type 6, it looks
		like this:
	</p>
	<ul>
		<li>The world is unpredictable — and preparation is the only rational response</li>
		<li>Everyone and everything needs to be tested before it can be trusted</li>
		<li>Questioning authority isn't rebellion — it's due diligence</li>
		<li>Trustworthy allies are the most valuable thing you can find</li>
		<li>Duty and responsibility aren't burdens — they're what hold everything together</li>
	</ul>

	<p>
		Spot a Type 6 by their questions. They're not interrogating you — they're building a mental
		model of whether you're safe. Answer directly and consistently, and you'll unlock their loyalty.
	</p>
{/if}

{#if type === '7'}
	<h2>What Drives a Type 7</h2>

	<p>
		A Type 7 has three tabs open, two plans for tonight, and just had an idea for a side project —
		all before lunch. Their mind moves fast because standing still means feeling whatever they've
		been outrunning. Behind the enthusiasm is a simple equation: if life stays exciting, the painful
		stuff can't catch up.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Impulsive thrill-seekers, commitment-phobic, scattered and
			unfocused
		</li>
		<li>
			<strong>Archetypes</strong>: The Adventurer, The Entertainer, The Visionary, The Renaissance
			Person
		</li>
		<li>
			<strong>Struggles</strong>: Difficulty sitting with painful emotions, prone to overcommitting,
			chronic fear of missing out
		</li>
		<li>
			<strong>Gifts</strong>: Ability to find joy in any situation, highly adaptable and resilient,
			natural storytellers who make everything more fun
		</li>
		<li>
			<strong>Recognized by</strong>: Rapid topic-switching in conversation, infectious energy,
			always having a "you know what we should do" moment
		</li>
	</ul>

	<h2>The Enthusiast's Worldview</h2>

	<p>
		Hand a Type 7 a limitation and they'll hand you back three creative workarounds. Their mental
		map of the world looks like this:
	</p>
	<ul>
		<li>Life is a grand adventure — every day should contain something new</li>
		<li>Joy and possibility exist in every situation if you look hard enough</li>
		<li>Constraints are just puzzles that haven't been solved yet</li>
		<li>The future is always brighter than the present</li>
		<li>Variety isn't a luxury — it's a survival need</li>
	</ul>

	<p>
		Read a Type 7 by watching when they change the subject. That's usually the moment a conversation
		got too real. Don't chase them — just note where the exit door is. That tells you what they're
		avoiding.
	</p>
{/if}
{#if type === '8'}
	<h2>What Drives a Type 8</h2>

	<p>
		A Type 8 will tell you exactly what they think within thirty seconds of meeting you. No filter,
		no warmup. They're not trying to be rude — they just think indirectness wastes everyone's time.
		Underneath that intensity is someone who decided early on that the world rewards strength and
		punishes vulnerability. So they chose strength.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Angry and confrontational, domineering bullies, ruthless and
			insensitive
		</li>
		<li><strong>Archetypes</strong>: The Boss, The Protector, The Maverick, The Warrior</li>
		<li>
			<strong>Struggles</strong>: Difficulty showing vulnerability, tendency to dominate
			conversations and decisions, resistance to accepting help or direction
		</li>
		<li>
			<strong>Gifts</strong>: Natural leadership abilities, courage to stand up for what's right,
			ability to take decisive action when everyone else hesitates
		</li>
		<li>
			<strong>Recognized by</strong>: Commanding presence, direct communication, being the first to
			take charge in a crisis
		</li>
	</ul>

	<h2>The Challenger's Worldview</h2>

	<p>
		Type 8s see a world divided into people who take control and people who get controlled. They
		decided which side they're on a long time ago:
	</p>
	<ul>
		<li>Strength and independence aren't optional — they're essential for survival</li>
		<li>Injustice and exploitation need to be confronted, not tolerated</li>
		<li>Vulnerability is a liability unless you're with someone who's earned that trust</li>
		<li>Challenges are how you prove what you're made of</li>
		<li>Protecting the people in your circle is a non-negotiable responsibility</li>
	</ul>

	<p>
		Decode a Type 8 by how they test you. They'll push to see if you fold. Stand your ground without
		matching their aggression and you'll earn something rare — their genuine respect.
	</p>
{/if}
{#if type === '9'}
	<h2>What Drives a Type 9</h2>

	<p>
		The Type 9 is the person everyone feels comfortable around but nobody fully knows. They have a
		gift for making you feel heard, validating your perspective, and smoothing over tension — often
		at the cost of their own opinions disappearing entirely. They're not passive. They're absorbing
		everything and choosing peace over the exhausting alternative.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Passive pushovers, conflict-avoidant, lazy and unmotivated
		</li>
		<li><strong>Archetypes</strong>: The Mediator, The Diplomat, The Dreamer, The Healer</li>
		<li>
			<strong>Struggles</strong>: Difficulty asserting their own needs and opinions, prone to
			numbing out and procrastinating, resistance to change even when it's needed
		</li>
		<li>
			<strong>Gifts</strong>: Deeply empathetic and accepting, ability to see and unify multiple
			perspectives, natural peacemakers who stabilize any group
		</li>
		<li>
			<strong>Recognized by</strong>: Calming presence that puts people at ease, going along with
			the group's choice, an ability to see every side of an argument
		</li>
	</ul>

	<h2>The Peacemaker's Worldview</h2>

	<p>
		What happens when someone's greatest fear is disconnection? You get a Type 9 — someone who maps
		the world by where the harmony is and where it's breaking down:
	</p>
	<ul>
		<li>Every person and perspective has inherent value worth acknowledging</li>
		<li>Conflict is rarely worth what it costs — most arguments aren't that important</li>
		<li>Balance and stability are what make life livable</li>
		<li>Everything and everyone is more connected than people realize</li>
		<li>Peaceful coexistence isn't naive — it's the only approach that actually scales</li>
	</ul>

	<p>
		Unlock a Type 9 by asking what <em>they</em> want — then waiting. The pause isn't indecision. They're
		checking whether it's actually safe to have a preference. Give them that space and you'll hear things
		they don't tell anyone.
	</p>
{/if}

<style lang="scss">
	/* Solo Leveling Dark Theme Typography */
	h2 {
		font-size: 1.8rem;
		color: #f1f5f9;
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	p {
		color: #cbd5e1;
		line-height: 1.75;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	ul {
		color: #cbd5e1;
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.75rem;
		line-height: 1.6;

		strong {
			color: #a78bfa;
			font-weight: 600;
		}
	}

	@media (max-width: 768px) {
		h2 {
			font-size: 1.5rem;
		}

		p {
			font-size: 1rem;
		}
	}
</style>

<!-- src/lib/components/blog/EnneagramTypeIntro.svelte -->
<script lang="ts">
	export let type: string;
</script>

{#if type === '1'}
	<h1>Enneagram Type 1 Description</h1>

	<p>
		Type 1 individuals are principled, responsible, and driven by a strong sense of right and wrong.
		They strive for integrity and excellence in all aspects of life, often setting high standards
		for themselves and others.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Highly critical, inflexible, detail-oriented perfectionists
		</li>
		<li><strong>Archetypes</strong>: The Reformer, The Judge, The Strict Teacher, The Crusader</li>
		<li>
			<strong>Struggles</strong>: Difficulty relaxing, being overly self-critical, struggling with
			unrealistic expectations
		</li>
		<li>
			<strong>Gifts</strong>: Strong moral compass, dedication to self-improvement, ability to
			create order from chaos
		</li>
		<li>
			<strong>Recognized by</strong>: Adherence to rules, meticulous attention to detail, striving
			for perfection in their work
		</li>
	</ul>

	<h2>The Perfectionist's Worldview</h2>

	<p>
		Type 1 individuals view the world through a lens of idealism and moral clarity. They often see:
	</p>
	<ul>
		<li>A clear distinction between right and wrong</li>
		<li>Potential for improvement in themselves and their surroundings</li>
		<li>Responsibility to uphold high standards and principles</li>
		<li>Importance of order, structure, and rules in society</li>
		<li>Opportunities to reform and perfect systems and processes</li>
	</ul>

	<p>
		This perspective drives their relentless pursuit of excellence and their desire to make the
		world a better place.
	</p>
{/if}

{#if type === '2'}
	<h1>Enneagram Type 2 Description</h1>

	<p>
		Type 2s are caring, empathetic, and driven by a desire to be loved and appreciated. They excel
		at sensing the needs of others and are often drawn to roles where they can offer support and
		nurturing.
	</p>
	<ul>
		<li><strong>Stereotypes</strong>: People-pleasers, overly accommodating, emotionally needy</li>
		<li><strong>Archetypes</strong>: The Caregiver, The Nurturer, The Servant, The Confidant</li>
		<li>
			<strong>Struggles</strong>: Difficulty setting boundaries, neglecting own needs, seeking
			validation through helping
		</li>
		<li>
			<strong>Gifts</strong>: Highly attuned to others' emotions, natural empathy, ability to make
			people feel loved
		</li>
		<li>
			<strong>Recognized by</strong>: Warm and approachable demeanor, always ready to lend a helping
			hand, puts others first
		</li>
	</ul>

	<h2>The Helper's Worldview</h2>

	<p>
		Type 2 individuals view the world through a lens of interpersonal connections and emotional
		needs. They often see:
	</p>
	<ul>
		<li>Opportunities to offer support and care to others</li>
		<li>The importance of relationships and emotional bonds</li>
		<li>A world where love and appreciation are earned through service</li>
		<li>The potential for healing and nurturing in every interaction</li>
		<li>Their own value reflected in their ability to help and be needed</li>
	</ul>
	<p>
		This perspective drives their desire to connect with others and their tendency to prioritize
		others' needs over their own.
	</p>
{/if}
{#if type === '3'}
	<h1>Enneagram Type 3 Description</h1>
	<p>
		Type 3 individuals are ambitious, driven, and highly focused on success. They adapt easily to
		different roles and situations, using their charisma and competence to excel in their chosen
		fields.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Status-seeking, overly competitive, image-conscious workaholics
		</li>
		<li>
			<strong>Archetypes</strong>: The Performer, The Entrepreneur, The politician, The Role Model
		</li>
		<li>
			<strong>Struggles</strong>: Difficulty being authentic, tying self-worth to achievements, fear
			of failure and rejection
		</li>
		<li>
			<strong>Gifts</strong>: Goal-oriented mindset, ability to inspire and motivate others,
			adaptable to changing circumstances
		</li>
		<li>
			<strong>Recognized by</strong>: Polished appearance, confident demeanor, driven to succeed in
			their endeavors
		</li>
	</ul>

	<h2>The Achiever's Worldview</h2>

	<p>
		Type 3 individuals view the world through a lens of accomplishment and recognition. They often
		see:
	</p>
	<ul>
		<li>Life as a series of challenges to be conquered</li>
		<li>Success and achievement as the primary measures of personal worth</li>
		<li>Opportunities for advancement and recognition in various situations</li>
		<li>The importance of image and reputation in achieving goals</li>
		<li>Competition as a natural and necessary part of life</li>
	</ul>
	<p>
		This perspective drives their relentless pursuit of success and their ability to adapt to
		different environments to achieve their goals.
	</p>
{/if}
{#if type === '4'}
	<h1>Enneagram Type 4 Description</h1>
	<p>
		Type 4s are introspective, creative, and deeply in touch with their emotions. They seek
		authenticity and meaning, often feeling like they are fundamentally different from others.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Moody artists, self-absorbed dreamers, overly sensitive
			individuals
		</li>
		<li>
			<strong>Archetypes</strong>: The Romantic, The Individualist, The Bohemian, The Aesthete
		</li>
		<li>
			<strong>Struggles</strong>: Prone to melancholy and envy, difficulty accepting reality,
			feeling misunderstood by others
		</li>
		<li>
			<strong>Gifts</strong>: Deeply creative and expressive, ability to transform pain into art,
			empathetic and compassionate
		</li>
		<li>
			<strong>Recognized by</strong>: Unique personal style, introspective nature, drawn to the arts
			and self-expression
		</li>
	</ul>

	<h2>The Individualist's Worldview</h2>

	<p>
		Type 4 individuals view the world through a lens of personal significance and emotional depth.
		They often see:
	</p>
	<ul>
		<li>Beauty and meaning in the melancholy and bittersweet aspects of life</li>
		<li>The world as a canvas for self-expression and authenticity</li>
		<li>A fundamental difference between themselves and others</li>
		<li>The importance of understanding and exploring one's emotions</li>
		<li>Life as a quest for personal significance and unique identity</li>
	</ul>
	<p>
		This perspective drives their pursuit of authenticity and their tendency to seek depth in their
		experiences and relationships.
	</p>
{/if}
{#if type === '5'}
	<h1>Enneagram Type 5 Description</h1>

	<p>
		Type 5 individuals are intellectual, analytical, and driven by a thirst for knowledge. They are
		independent thinkers who value privacy and solitude, often immersing themselves in complex ideas
		and systems.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Detached observers, socially awkward intellectuals, eccentric
			loners
		</li>
		<li><strong>Archetypes</strong>: The Researcher, The Philosopher, The Scientist, The Expert</li>
		<li>
			<strong>Struggles</strong>: Difficulty connecting emotionally, tendency to withdraw, fear of
			being overwhelmed or incompetent
		</li>
		<li>
			<strong>Gifts</strong>: Highly analytical and objective, ability to think deeply and innovate,
			self-sufficient and resourceful
		</li>
		<li>
			<strong>Recognized by</strong>: Intellectual curiosity, preference for solitude, ability to
			detach and observe objectively
		</li>
	</ul>

	<h2>The Investigator's Worldview</h2>

	<p>
		Type 5 individuals view the world through a lens of intellectual curiosity and the need for
		understanding. They often see:
	</p>
	<ul>
		<li>The world as a complex system to be analyzed and understood</li>
		<li>Knowledge and competence as essential for navigating life</li>
		<li>The importance of conserving energy and resources</li>
		<li>A need for personal space and boundaries</li>
		<li>Value in detachment and objective observation</li>
	</ul>
	<p>
		This perspective drives their pursuit of knowledge and their tendency to maintain emotional and
		physical distance from others.
	</p>
{/if}
{#if type === '6'}
	<h1>Enneagram Type 6 Description</h1>
	<p>
		Type 6s are reliable, responsible, and driven by a need for security and belonging. They are
		loyal to their beliefs and those they trust, often serving as the backbone of their communities.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Anxious worriers, overly suspicious, blindly loyal followers
		</li>
		<li>
			<strong>Archetypes</strong>: The Skeptic, The Guardian, The Trooper, The Devil's Advocate
		</li>
		<li>
			<strong>Struggles</strong>: Prone to anxiety and self-doubt, difficulty trusting others, prone
			to worst-case scenario thinking
		</li>
		<li>
			<strong>Gifts</strong>: Highly attuned to potential risks, ability to create stability and
			security, loyal and supportive
		</li>
		<li>
			<strong>Recognized by</strong>: Preparedness for challenges, questioning nature, strong sense
			of duty and responsibility
		</li>
	</ul>

	<h2>The Loyalist's Worldview</h2>

	<p>
		Type 6 individuals view the world through a lens of security and potential threats. They often
		see:
	</p>
	<ul>
		<li>The world as an unpredictable and potentially dangerous place</li>
		<li>The importance of being prepared for various scenarios</li>
		<li>Value in questioning and testing the reliability of people and systems</li>
		<li>The need for trustworthy allies and support systems</li>
		<li>Duty and responsibility as key elements of security and belonging</li>
	</ul>
	<p>
		This perspective drives their vigilant nature and their commitment to creating safety for
		themselves and their loved ones.
	</p>
{/if}

{#if type === '7'}
	<h1>Enneagram Type 7 Description</h1>

	<p>
		Type 7 individuals are adventurous, optimistic, and always seeking new experiences. They have a
		lust for life and a gift for finding joy in the present moment, often inspiring others with
		their infectious enthusiasm.
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
			<strong>Struggles</strong>: Difficulty dealing with painful emotions, prone to overextending
			themselves, fear of missing out
		</li>
		<li>
			<strong>Gifts</strong>: Ability to find joy in any situation, highly adaptable and resilient,
			natural storytellers and entertainers
		</li>
		<li>
			<strong>Recognized by</strong>: Energetic and engaging presence, always seeking new
			experiences, ability to reframe negatives
		</li>
	</ul>

	<h2>The Enthusiast's Worldview</h2>

	<p>
		Type 7 individuals view the world through a lens of possibility and excitement. They often see:
	</p>
	<ul>
		<li>Life as a grand adventure full of opportunities to explore</li>
		<li>The potential for joy and pleasure in every situation</li>
		<li>Limitations as challenges to be overcome creatively</li>
		<li>The future as bright and full of potential</li>
		<li>Variety and novelty as essential to a fulfilling life</li>
	</ul>
	<p>
		This perspective drives their enthusiastic approach to life and their constant pursuit of new
		experiences and ideas.
	</p>
{/if}
{#if type === '8'}
	<h1>Enneagram Type 8 Description</h1>

	<p>
		Type 8s are powerful, assertive, and driven by a need to be in control. They are natural leaders
		who stand up for what they believe in, often serving as protectors and advocates for the weak
		and vulnerable.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Angry and confrontational, domineering bullies, ruthless and
			insensitive
		</li>
		<li><strong>Archetypes</strong>: The Boss, The Protector, The Maverick, The Warrior</li>
		<li>
			<strong>Struggles</strong>: Difficulty being vulnerable, tendency to dominate others, struggle
			to accept help or direction
		</li>
		<li>
			<strong>Gifts</strong>: Natural leadership abilities, courage to stand up for beliefs, ability
			to overcome adversity
		</li>
		<li>
			<strong>Recognized by</strong>: Commanding presence, direct communication style, ability to
			take charge in a crisis
		</li>
	</ul>

	<h2>The Challenger's Worldview</h2>

	<p>
		Type 8 individuals view the world through a lens of power dynamics and justice. They often see:
	</p>
	<ul>
		<li>The world as a place where the strong survive and the weak are vulnerable</li>
		<li>Injustice and unfairness that needs to be confronted</li>
		<li>The importance of personal strength and independence</li>
		<li>Challenges as opportunities to prove their strength and resilience</li>
		<li>
			The need to protect themselves and those they care about from potential harm or exploitation
		</li>
	</ul>
	<p>
		This perspective drives their assertive approach to life and their desire to stand up for
		themselves and others.
	</p>
{/if}
{#if type === '9'}
	<h1>Enneagram Type 9 Description</h1>

	<p>
		Type 9 individuals are easygoing, agreeable, and driven by a desire for peace and harmony. They
		have a gift for seeing multiple perspectives and bringing people together, often serving as
		mediators and peacemakers.
	</p>
	<ul>
		<li>
			<strong>Stereotypes</strong>: Passive pushovers, conflict-avoidant, lazy and unmotivated
		</li>
		<li><strong>Archetypes</strong>: The Mediator, The Diplomat, The Dreamer, The Healer</li>
		<li>
			<strong>Struggles</strong>: Difficulty asserting own needs and opinions, prone to passivity
			and procrastination, struggle to embrace change
		</li>
		<li>
			<strong>Gifts</strong>: Highly empathetic and accepting, ability to see and unify multiple
			perspectives, natural peacemakers and healers
		</li>
		<li>
			<strong>Recognized by</strong>: Calming and reassuring presence, ability to go with the flow,
			skill at creating harmony and stability
		</li>
	</ul>

	<h2>The Peacemaker's Worldview</h2>

	<p>
		Type 9 individuals view the world through a lens of harmony and interconnectedness. They often
		see:
	</p>
	<ul>
		<li>The inherent value and goodness in all people and perspectives</li>
		<li>Conflict as unnecessary and potentially destructive</li>
		<li>The importance of maintaining balance and stability</li>
		<li>The interconnectedness of all things and people</li>
		<li>The world as a place where everyone can coexist peacefully if given the chance</li>
	</ul>
	<p>
		This perspective drives their desire for harmony and their ability to see and validate multiple
		viewpoints.
	</p>
{/if}

<style lang="scss">
	h1 {
		font-size: 2.5rem;
		color: var(--text-color);
		margin-bottom: 1rem;
	}

	h2 {
		font-size: 1.8rem;
		color: var(--text-color);
		margin-top: 1.5rem;
		margin-bottom: 1rem;
	}

	.type-description {
		font-size: 1.2rem;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.5rem;
		}

		.type-description {
			font-size: 1rem;
		}
	}
</style>

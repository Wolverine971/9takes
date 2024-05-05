<script lang="ts">
	export let type: string;
</script>

{#if type === '1'}
	<h1>Enneagram Type 1: The Perfectionist</h1>

	<p>
		Type 1 individuals are principled, responsible, and driven by a strong sense of right and wrong.
		They strive for integrity and excellence in all aspects of life, often setting high standards
		for themselves and others.
	</p>
	<ul>
		<li><b>Stereotypes</b>: Highly critical, inflexible, detail-oriented perfectionists</li>
		<li><b>Archetypes</b>: The Reformer, The Judge, The Strict Teacher, The Crusader</li>
		<li>
			<b>Struggles</b>: Difficulty relaxing, being overly self-critical, struggling with unrealistic
			expectations
		</li>
		<li>
			<b>Gifts</b>: Strong moral compass, dedication to self-improvement, ability to create order
			from chaos
		</li>
		<li>
			<b>Recognized by</b>: Adherence to rules, meticulous attention to detail, striving for
			perfection in their work
		</li>
	</ul>
{/if}

{#if type === '2'}
	<h1>Enneagram Type 2: The Helper</h1>

	<p>
		Type 2s are caring, empathetic, and driven by a desire to be loved and appreciated. They excel
		at sensing the needs of others and are often drawn to roles where they can offer support and
		nurturing.
	</p>
	<ul>
		<li><b>Stereotypes</b>: People-pleasers, overly accommodating, emotionally needy</li>
		<li><b>Archetypes</b>: The Caregiver, The Nurturer, The Servant, The Confidant</li>
		<li>
			<b>Struggles</b>: Difficulty setting boundaries, neglecting own needs, seeking validation
			through helping
		</li>
		<li>
			<b>Gifts</b>: Highly attuned to others' emotions, natural empathy, ability to make people feel
			loved
		</li>
		<li>
			<b>Recognized by</b>: Warm and approachable demeanor, always ready to lend a helping hand,
			puts others first
		</li>
	</ul>
{/if}
{#if type === '3'}
	<h1>Enneagram Type 3: The Achiever</h1>
	<p>
		Type 3 individuals are ambitious, driven, and highly focused on success. They adapt easily to
		different roles and situations, using their charisma and competence to excel in their chosen
		fields.
	</p>
	<ul>
		<li><b>Stereotypes</b>: Status-seeking, overly competitive, image-conscious workaholics</li>
		<li><b>Archetypes</b>: The Performer, The Entrepreneur, The politician, The Role Model</li>
		<li>
			<b>Struggles</b>: Difficulty being authentic, tying self-worth to achievements, fear of
			failure and rejection
		</li>
		<li>
			<b>Gifts</b>: Goal-oriented mindset, ability to inspire and motivate others, adaptable to
			changing circumstances
		</li>
		<li>
			<b>Recognized by</b>: Polished appearance, confident demeanor, driven to succeed in their
			endeavors
		</li>
	</ul>
{/if}
{#if type === '4'}
	<h1>Enneagram Type 4: The Individualist</h1>
	<p>
		Type 4s are introspective, creative, and deeply in touch with their emotions. They seek
		authenticity and meaning, often feeling like they are fundamentally different from others.
	</p>
	<ul>
		<li><b>Stereotypes</b>: Moody artists, self-absorbed dreamers, overly sensitive individuals</li>
		<li><b>Archetypes</b>: The Romantic, The Individualist, The Bohemian, The Aesthete</li>
		<li>
			<b>Struggles</b>: Prone to melancholy and envy, difficulty accepting reality, feeling
			misunderstood by others
		</li>
		<li>
			<b>Gifts</b>: Deeply creative and expressive, ability to transform pain into art, empathetic
			and compassionate
		</li>
		<li>
			<b>Recognized by</b>: Unique personal style, introspective nature, drawn to the arts and
			self-expression
		</li>
	</ul>
{/if}
{#if type === '5'}
	<h1>Enneagram Type 5: The Investigator</h1>

	<p>
		Type 5 individuals are intellectual, analytical, and driven by a thirst for knowledge. They are
		independent thinkers who value privacy and solitude, often immersing themselves in complex ideas
		and systems.
	</p>
	<ul>
		<li>
			<b>Stereotypes</b>: Detached observers, socially awkward intellectuals, eccentric loners
		</li>
		<li><b>Archetypes</b>: The Researcher, The Philosopher, The Scientist, The Expert</li>
		<li>
			<b>Struggles</b>: Difficulty connecting emotionally, tendency to withdraw, fear of being
			overwhelmed or incompetent
		</li>
		<li>
			<b>Gifts</b>: Highly analytical and objective, ability to think deeply and innovate,
			self-sufficient and resourceful
		</li>
		<li>
			<b>Recognized by</b>: Intellectual curiosity, preference for solitude, ability to detach and
			observe objectively
		</li>
	</ul>
{/if}
{#if type === '6'}
	<h1>Enneagram Type 6: The Loyalist</h1>
	<p>
		Type 6s are reliable, responsible, and driven by a need for security and belonging. They are
		loyal to their beliefs and those they trust, often serving as the backbone of their communities.
	</p>
	<ul>
		<li><b>Stereotypes</b>: Anxious worriers, overly suspicious, blindly loyal followers</li>
		<li><b>Archetypes</b>: The Skeptic, The Guardian, The Trooper, The Devil's Advocate</li>
		<li>
			<b>Struggles</b>: Prone to anxiety and self-doubt, difficulty trusting others, prone to
			worst-case scenario thinking
		</li>
		<li>
			<b>Gifts</b>: Highly attuned to potential risks, ability to create stability and security,
			loyal and supportive
		</li>
		<li>
			<b>Recognized by</b>: Preparedness for challenges, questioning nature, strong sense of duty
			and responsibility
		</li>
	</ul>
{/if}
{#if type === '7'}
	<h1>Enneagram Type 7: The Enthusiast</h1>

	<p>
		Type 7 individuals are adventurous, optimistic, and always seeking new experiences. They have a
		lust for life and a gift for finding joy in the present moment, often inspiring others with
		their infectious enthusiasm.
	</p>
	<ul>
		<li>
			<b>Stereotypes</b>: Impulsive thrill-seekers, commitment-phobic, scattered and unfocused
		</li>
		<li>
			<b>Archetypes</b>: The Adventurer, The Entertainer, The Visionary, The Renaissance Person
		</li>
		<li>
			<b>Struggles</b>: Difficulty dealing with painful emotions, prone to overextending themselves,
			fear of missing out
		</li>
		<li>
			<b>Gifts</b>: Ability to find joy in any situation, highly adaptable and resilient, natural
			storytellers and entertainers
		</li>
		<li>
			<b>Recognized by</b>: Energetic and engaging presence, always seeking new experiences, ability
			to reframe negatives
		</li>
	</ul>
{/if}
{#if type === '8'}
	<h1>Enneagram Type 8: The Challenger</h1>

	<p>
		Type 8s are powerful, assertive, and driven by a need to be in control. They are natural leaders
		who stand up for what they believe in, often serving as protectors and advocates for the weak
		and vulnerable.
	</p>
	<ul>
		<li>
			<b>Stereotypes</b>: Angry and confrontational, domineering bullies, ruthless and insensitive
		</li>
		<li><b>Archetypes</b>: The Boss, The Protector, The Maverick, The Warrior</li>
		<li>
			<b>Struggles</b>: Difficulty being vulnerable, tendency to dominate others, struggle to accept
			help or direction
		</li>
		<li>
			<b>Gifts</b>: Natural leadership abilities, courage to stand up for beliefs, ability to
			overcome adversity
		</li>
		<li>
			<b>Recognized by</b>: Commanding presence, direct communication style, ability to take charge
			in a crisis
		</li>
	</ul>
{/if}
{#if type === '9'}
	<h1>Enneagram Type 9: The Peacemaker</h1>

	<p>
		Type 9 individuals are easygoing, agreeable, and driven by a desire for peace and harmony. They
		have a gift for seeing multiple perspectives and bringing people together, often serving as
		mediators and peacemakers.
	</p>
	<ul>
		<li><b>Stereotypes</b>: Passive pushovers, conflict-avoidant, lazy and unmotivated</li>
		<li><b>Archetypes</b>: The Mediator, The Diplomat, The Dreamer, The Healer</li>
		<li>
			<b>Struggles</b>: Difficulty asserting own needs and opinions, prone to passivity and
			procrastination, struggle to embrace change
		</li>
		<li>
			<b>Gifts</b>: Highly empathetic and accepting, ability to see and unify multiple perspectives,
			natural peacemakers and healers
		</li>
		<li>
			<b>Recognized by</b>: Calming and reassuring presence, ability to go with the flow, skill at
			creating harmony and stability
		</li>
	</ul>
{/if}

<style>
	p {
		margin: 0.4rem;
	}
	ul {
		margin: 0.2rem 0;
	}
</style>

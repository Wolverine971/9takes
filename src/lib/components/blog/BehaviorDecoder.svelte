<!-- src/lib/components/blog/BehaviorDecoder.svelte -->
<!--
  "Same behavior, different feeling" decoder for the Enneagram personal growth
  blog. The reader picks an observable behavior (procrastinating, overworking,
  going quiet...) and sees the different feelings it can run on, what each
  sounds like, and which help lands versus backfires.

  Deliberately NOT a typing tool: the framing is "ask the question, read the
  feeling", never "spot the type". Every panel renders server-side (inactive
  ones use `hidden`) so the content is crawlable and works without JS.
-->
<script lang="ts">
	import { TYPE_COLOR_MAP } from '$lib/constants/enneagramColors';

	type Motive = {
		type: number;
		feeling: string;
		says: string;
		helps: string;
		backfires: string;
	};

	type Behavior = {
		id: string;
		label: string;
		ask: string;
		motives: Motive[];
	};

	const BEHAVIORS: Behavior[] = [
		{
			id: 'putting-off',
			label: 'Putting things off',
			ask: 'What happens the moment this is done?',
			motives: [
				{
					type: 1,
					feeling: 'Finished means judged, and it is not right yet.',
					says: '"It\'s not ready."',
					helps: 'Agree on what "done" means before starting, in writing.',
					backfires: '"Just relax, it doesn\'t matter." It sounds like permission to be sloppy.'
				},
				{
					type: 4,
					feeling: 'Fear that it will come out ordinary and prove something about them.',
					says: '"I\'m not feeling it today."',
					helps: 'A set time to make the rough version, mood or no mood.',
					backfires: '"Wait until you\'re inspired."'
				},
				{
					type: 6,
					feeling: 'Fear of being the one responsible if it goes wrong.',
					says: '"What if I pick the wrong one?"',
					helps: 'Shrink it: "What\'s the reversible version of this?"',
					backfires: '"There\'s nothing to worry about."'
				},
				{
					type: 9,
					feeling: 'Finishing means choosing, and choosing can upset someone.',
					says: '"I\'ll get to it. No rush."',
					helps: 'A deadline someone else holds, plus "What do you want this to be?"',
					backfires: '"Take all the time you need."'
				}
			]
		},
		{
			id: 'overworking',
			label: 'Working too much',
			ask: 'What would you have to feel if you stopped tonight?',
			motives: [
				{
					type: 3,
					feeling: "Shame that without the output, there isn't much there.",
					says: '"I\'m fine, just slammed."',
					helps: 'Being valued for something with zero output attached.',
					backfires: '"How do you do it all?" The praise feeds the loop.'
				},
				{
					type: 1,
					feeling: "Resentment. If they stop, it won't get done right.",
					says: '"Someone has to."',
					helps: 'Name what is already right, then build a stop time into the standard.',
					backfires: '"Just lower your standards."'
				},
				{
					type: 2,
					feeling: 'Fear that if they stop being useful, they stop being kept.',
					says: '"It\'s no trouble, really."',
					helps: '"Who\'s taking care of you this week?"',
					backfires: '"You need to learn to say no."'
				},
				{
					type: 8,
					feeling: 'Tiredness that feels like weakness, so they push harder.',
					says: '"I\'ll sleep when it\'s done."',
					helps:
						'Make rest their strategic call: "What do you hand off so you\'re at full strength?"',
					backfires: '"You need to slow down." It\'s a command, and they don\'t take commands.'
				}
			]
		},
		{
			id: 'going-quiet',
			label: 'Going quiet',
			ask: 'Do you want space right now, or company?',
			motives: [
				{
					type: 5,
					feeling: 'Depleted. Every demand is a withdrawal from a small account.',
					says: '"I just need some time."',
					helps: 'Specific, bounded contact: "Twenty minutes Thursday at four?"',
					backfires: 'Pushing "Talk to me, what\'s going on?" right now.'
				},
				{
					type: 9,
					feeling: "Anger they won't risk, so it goes numb.",
					says: '"I\'m fine. Whatever you want."',
					helps: 'Ask twice, then wait through the silence.',
					backfires: 'Filling the silence with your own opinion.'
				},
				{
					type: 4,
					feeling: 'Hurt at being misunderstood, and watching to see if you come find them.',
					says: '"It doesn\'t matter."',
					helps: 'Move toward them and name it: "That landed hard, didn\'t it?"',
					backfires: '"You\'re overreacting."'
				},
				{
					type: 8,
					feeling: 'Betrayal or powerlessness. The fighter has pulled back into the fortress.',
					says: '"Handled."',
					helps: 'Directness about what happened and which line got crossed.',
					backfires: 'Tiptoeing around them.'
				}
			]
		},
		{
			id: 'saying-yes',
			label: 'Saying yes to everything',
			ask: 'What would happen if you said no to this one?',
			motives: [
				{
					type: 2,
					feeling: 'Fear that a no will cost them the relationship.',
					says: '"Of course! Happy to."',
					helps: '"Saying no to this won\'t cost you us."',
					backfires: 'A lecture about boundaries.'
				},
				{
					type: 9,
					feeling: 'A no means conflict, and conflict feels worse than the extra work.',
					says: '"Sure, sounds good."',
					helps: 'Make the no small and safe: "Pick one thing to drop. I\'ll back you."',
					backfires: '"Why didn\'t you just say something?" after the fact.'
				},
				{
					type: 7,
					feeling: 'Fear of missing the good one. Every yes keeps a door open.',
					says: '"Let\'s do all of it!"',
					helps: '"Which one do you want to be great at?"',
					backfires: 'Strict rules with shame attached.'
				},
				{
					type: 3,
					feeling: 'Each yes is another chance to look capable.',
					says: '"I can take that."',
					helps: '"Which of these moves the thing you actually care about?"',
					backfires: 'Praise for taking on more.'
				}
			]
		},
		{
			id: 'snapping',
			label: 'Snapping at people',
			ask: "Once it's cooled: what were you feeling right before the anger?",
			motives: [
				{
					type: 8,
					feeling: 'Hurt or fear, converted into anger because anger moves.',
					says: '"I\'m not upset. I\'m being honest."',
					helps: 'Stay steady in the moment. Later: "What landed?"',
					backfires: '"Calm down."'
				},
				{
					type: 1,
					feeling: 'A resentment ledger that finally overflowed.',
					says: '"I\'m not angry. I\'m frustrated."',
					helps: 'Grant the fairness point first: "You\'ve been carrying this alone."',
					backfires: '"Why are you so uptight?"'
				},
				{
					type: 2,
					feeling: 'Years of unthanked giving, all coming due at once.',
					says: '"After everything I\'ve done."',
					helps: '"What have you been carrying that I never knew about?"',
					backfires: 'Defending yourself point by point.'
				},
				{
					type: 6,
					feeling: 'Fear turned outward as suspicion.',
					says: '"Why didn\'t you tell me?"',
					helps: 'Specific reassurance, then the same behavior for months.',
					backfires: '"You\'re being paranoid."'
				}
			]
		},
		{
			id: 'overthinking',
			label: 'Overthinking',
			ask: "What's the worst case you keep running?",
			motives: [
				{
					type: 6,
					feeling: 'Fear, hunting for a plan solid enough to trust.',
					says: '"But what if..."',
					helps: 'Walk the worst case to its end together: "And then what?"',
					backfires: '"Stop overthinking."'
				},
				{
					type: 5,
					feeling: 'Fear of acting before they understand enough.',
					says: '"I need to read more first."',
					helps: 'A small real-world test with a date on it.',
					backfires: 'Sending them another article.'
				},
				{
					type: 7,
					feeling: "A feeling they'd rather outrun, so the mind starts planning.",
					says: '"Okay, but what if we also..."',
					helps: '"What feeling is the next plan helping you skip?"',
					backfires: '"Look on the bright side."'
				},
				{
					type: 4,
					feeling: 'A hurt that keeps replaying because it feels like part of who they are.',
					says: '"I keep going back to it."',
					helps: 'Something physical: a walk, or making something with their hands.',
					backfires: '"Just stop thinking about it."'
				}
			]
		}
	];

	let activeId = $state(BEHAVIORS[0].id);
	let tabEls = $state<HTMLButtonElement[]>([]);

	function select(index: number) {
		const next = BEHAVIORS[(index + BEHAVIORS.length) % BEHAVIORS.length];
		activeId = next.id;
		tabEls[BEHAVIORS.indexOf(next)]?.focus();
	}

	function onTabKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
			event.preventDefault();
			select(index + 1);
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			event.preventDefault();
			select(index - 1);
		} else if (event.key === 'Home') {
			event.preventDefault();
			select(0);
		} else if (event.key === 'End') {
			event.preventDefault();
			select(BEHAVIORS.length - 1);
		}
	}
</script>

<section class="decoder" aria-label="Same behavior, different feeling">
	<p class="decoder__eyebrow">Pick a behavior</p>

	<div class="decoder__tabs" role="tablist" aria-label="Behaviors">
		{#each BEHAVIORS as behavior, i (behavior.id)}
			<button
				bind:this={tabEls[i]}
				type="button"
				role="tab"
				id="decoder-tab-{behavior.id}"
				aria-selected={activeId === behavior.id}
				aria-controls="decoder-panel-{behavior.id}"
				tabindex={activeId === behavior.id ? 0 : -1}
				class="decoder__tab"
				class:decoder__tab--active={activeId === behavior.id}
				onclick={() => (activeId = behavior.id)}
				onkeydown={(event) => onTabKeydown(event, i)}
			>
				{behavior.label}
			</button>
		{/each}
	</div>

	{#each BEHAVIORS as behavior (behavior.id)}
		<div
			class="decoder__panel"
			role="tabpanel"
			id="decoder-panel-{behavior.id}"
			aria-labelledby="decoder-tab-{behavior.id}"
			hidden={activeId !== behavior.id}
		>
			<p class="decoder__ask">
				<span class="decoder__ask-label">Ask first</span>
				<span class="decoder__ask-question">{behavior.ask}</span>
			</p>

			<ul class="decoder__motives">
				{#each behavior.motives as motive (motive.type)}
					<li class="decoder__motive" style="--type-color: {TYPE_COLOR_MAP[motive.type]}">
						<p class="decoder__says">{motive.says}</p>
						<p class="decoder__feeling">{motive.feeling}</p>
						<dl class="decoder__advice">
							<div class="decoder__advice-row">
								<dt class="decoder__label decoder__label--helps">Helps</dt>
								<dd>{motive.helps}</dd>
							</div>
							<div class="decoder__advice-row">
								<dt class="decoder__label decoder__label--backfires">Backfires</dt>
								<dd>{motive.backfires}</dd>
							</div>
						</dl>
						<p class="decoder__type">Often a Type {motive.type} pattern</p>
					</li>
				{/each}
			</ul>
		</div>
	{/each}

	<p class="decoder__note">
		These are common patterns. They won't tell you anyone's type, and one person can run several of
		them. The question will tell you more than any label.
	</p>
</section>

<style>
	.decoder {
		margin: 2rem 0;
		padding: 1.25rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 20%, var(--stone-edge));
		border-radius: 10px;
		background: linear-gradient(135deg, var(--stone-warm) 0%, var(--night-deep) 60%);
	}

	.decoder .decoder__eyebrow {
		margin: 0 0 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	.decoder__tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
	}

	.decoder__tab {
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		background: transparent;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.3;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.decoder__tab:hover {
		border-color: var(--lamp-glow);
		color: var(--ink-bright);
	}

	.decoder__tab:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.decoder__tab--active {
		background: var(--lamp-glow);
		border-color: var(--lamp-glow);
		color: var(--text-on-primary);
		font-weight: 600;
	}

	.decoder__tab--active:hover {
		color: var(--text-on-primary);
	}

	.decoder .decoder__ask {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin: 0 0 1rem;
	}

	.decoder__ask-label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.decoder__ask-question {
		font-size: 1.15rem;
		font-weight: 600;
		line-height: 1.4;
		color: var(--ink-bright);
	}

	.decoder .decoder__motives {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.decoder .decoder__motive {
		margin: 0;
		padding: 0.9rem 1rem;
		border: 1px solid var(--stone-edge);
		border-left: 3px solid var(--type-color);
		border-radius: 10px;
		background: color-mix(in srgb, var(--night-deep) 85%, transparent);
	}

	.decoder .decoder__type {
		margin: 0.75rem 0 0;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--type-color);
	}

	.decoder .decoder__says {
		margin: 0 0 0.35rem;
		font-size: 1rem;
		font-style: italic;
		color: var(--ink-bright);
	}

	.decoder .decoder__feeling {
		margin: 0 0 0.75rem;
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--ink-mid);
	}

	.decoder .decoder__advice {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin: 0;
	}

	.decoder__advice-row {
		display: grid;
		grid-template-columns: 5.25rem 1fr;
		gap: 0.5rem;
		align-items: baseline;
	}

	.decoder__advice-row dd {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-bright);
	}

	.decoder__label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.decoder__label--helps {
		color: var(--success);
	}

	.decoder__label--backfires {
		color: var(--error-text, var(--error));
	}

	.decoder .decoder__note {
		margin: 1.25rem 0 0;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--ink-dim);
	}

	@media (max-width: 640px) {
		.decoder {
			padding: 1rem;
		}

		.decoder__ask-question {
			font-size: 1.05rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.decoder__tab {
			transition: none;
		}
	}
</style>

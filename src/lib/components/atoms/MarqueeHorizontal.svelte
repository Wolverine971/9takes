<!-- src/lib/components/atoms/MarqueeHorizontal.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { serializeJsonLd } from '$lib/utils/jsonLd';

	type DisplayItem = {
		name: string;
		link: string;
	};

	type Theme = 'types' | 'relationships' | 'workplace' | 'growth' | 'custom';

	interface Props {
		displayList?: DisplayItem[];
		noMove?: boolean;
		speed?: number; // seconds for one full rotation
		theme?: Theme;
	}

	let { displayList = [], noMove = false, speed = 30, theme = 'custom' }: Props = $props();

	let marqueeWidth = $state<number>();

	// Predefined theme lists for smart cross-linking
	const themeDisplayLists: Record<Exclude<Theme, 'custom'>, DisplayItem[]> = {
		types: [
			{ name: 'Type 1 Perfectionist', link: '/enneagram-corner/enneagram-type-1' },
			{ name: 'Type 2 Helper', link: '/enneagram-corner/enneagram-type-2' },
			{ name: 'Type 3 Achiever', link: '/enneagram-corner/enneagram-type-3' },
			{ name: 'Type 4 Individualist', link: '/enneagram-corner/enneagram-type-4' },
			{ name: 'Type 5 Investigator', link: '/enneagram-corner/enneagram-type-5' },
			{ name: 'Type 6 Loyalist', link: '/enneagram-corner/enneagram-type-6' },
			{ name: 'Type 7 Enthusiast', link: '/enneagram-corner/enneagram-type-7' },
			{ name: 'Type 8 Challenger', link: '/enneagram-corner/enneagram-type-8' },
			{ name: 'Type 9 Peacemaker', link: '/enneagram-corner/enneagram-type-9' }
		],
		relationships: [
			{ name: 'Dating Guide for Men', link: '/enneagram-corner/enneagram-dating-guide-for-men' },
			{
				name: 'Dating Guide for Women',
				link: '/enneagram-corner/enneagram-dating-guide-for-women'
			},
			{
				name: 'Types in Relationships',
				link: '/enneagram-corner/enneagram-types-in-relationships'
			},
			{ name: 'Communication Guide', link: '/enneagram-corner/relationship-communication-guide' },
			{ name: 'First Date Dynamics', link: '/enneagram-corner/enneagram-types-on-a-first-date' },
			{
				name: 'Relationship Stages',
				link: '/enneagram-corner/how-to-navigate-early-relationship-stages'
			},
			{
				name: 'Toxic Relationship Signs',
				link: '/enneagram-corner/toxic-traits-relationships-warning-signs'
			}
		],
		workplace: [
			{ name: 'Leadership Styles', link: '/enneagram-corner/enneagram-leadership' },
			{ name: 'Team Dynamics', link: '/enneagram-corner/enneagram-team-dynamics' },
			{ name: 'Working in Teams', link: '/enneagram-corner/enneagram-types-working-in-teams' },
			{ name: 'Career Choices', link: '/enneagram-corner/enneagram-types-and-career-choices' },
			{ name: 'Workplace Building', link: '/enneagram-corner/enneagram-workplace-team-building' },
			{ name: 'Communication Styles', link: '/enneagram-corner/relationship-communication-guide' }
		],
		growth: [
			{ name: 'Personal Growth', link: '/enneagram-corner/enneagram-personal-growth' },
			{ name: 'Stress Responses', link: '/enneagram-corner/enneagram-types-in-stress' },
			{ name: 'Mental Health Flags', link: '/enneagram-corner/enneagram-mental-health-flags' },
			{ name: 'Toxic Traits', link: '/enneagram-corner/toxic-traits-of-each-enneagram-type' },
			{
				name: 'Strengths & Weaknesses',
				link: '/enneagram-corner/enneagram-strengths-and-weaknesses'
			},
			{ name: 'Self Development', link: '/enneagram-corner/enneagram-self-development' }
		]
	};

	// Use theme-based display list if no custom list provided
	let finalDisplayList = $derived(
		displayList.length > 0 ? displayList : theme === 'custom' ? [] : themeDisplayLists[theme]
	);

	onMount(() => {
		marqueeWidth = finalDisplayList.length * 250; // Adjust based on your content
	});

	let jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPageElement',
		isPartOf: {
			'@type': 'WebPage',
			'@id': 'https://9takes.com'
		},
		name: '9takes Enneagram Types Marquee',
		description: 'A scrolling marquee displaying Enneagram personality types and related content',
		cssSelector: '.marquee-container',
		hasPart: finalDisplayList.map((item: DisplayItem) => {
			return {
				'@type': 'WebPageElement',
				name: item.name,
				url: `https://9takes.com${item.link}`,
				description: `A blog on Enneagram types ${item.name}`
			};
		})
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${serializeJsonLd(jsonLd)}</script>`}
</svelte:head>

<div
	class="marquee-container"
	style="--marquee-width: {marqueeWidth}px; --marquee-speed: {speed}s;"
>
	<div class="marquee" class:paused={noMove} role="marquee">
		<div class="marquee-content">
			{#each finalDisplayList as item (`${item.name}|${item.link}`)}
				<a href={item.link} class="marquee-item">{item.name}</a>
			{/each}
		</div>
		<!-- Visual duplicate for the seamless loop: inert keeps its links out of the tab order -->
		<div class="marquee-content" aria-hidden="true" inert>
			{#each finalDisplayList as item (`${item.name}|${item.link}`)}
				<a href={item.link} class="marquee-item">{item.name}</a>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	/* Cold Light: a quiet --surface band; the items are links, so they read
	   lavender and underlined (the same in and out of a post body). */
	.marquee-container {
		width: 100%;
		overflow: hidden;
		background: var(--surface);
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		position: relative;
	}

	.marquee-container::before,
	.marquee-container::after {
		content: '';
		position: absolute;
		top: 0;
		width: 10rem;
		height: 100%;
		z-index: 1;
		pointer-events: none;
	}

	.marquee-container::before {
		left: 0;
		background: linear-gradient(to right, var(--surface), transparent);
	}

	.marquee-container::after {
		right: 0;
		background: linear-gradient(to left, var(--surface), transparent);
	}

	.marquee {
		display: flex;
		width: calc(var(--marquee-width) * 2);
		animation: scroll var(--marquee-speed) linear infinite;

		&.paused,
		&:hover,
		&:focus-within {
			animation-play-state: paused;
		}
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-1 * var(--marquee-width)));
		}
	}

	.marquee-content {
		display: flex;
		align-items: center;
		flex: 0 0 var(--marquee-width);
		white-space: nowrap;
	}

	.marquee-item {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 1rem 2rem;
		font-family: var(--font-talk);
		color: var(--highlight);
		text-transform: uppercase;
		font-size: var(--font-size-lg);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-decoration-color: color-mix(in srgb, currentColor 55%, transparent);
		text-underline-offset: 4px;
		transition:
			color 0.3s ease,
			transform 0.3s ease;
		position: relative;

		&:hover {
			color: var(--text);
			transform: scale(1.05);
		}

		/* Separator between items. inline-block keeps the link underline off it. */
		&::after {
			content: '•';
			display: inline-block;
			margin-left: 2rem;
			color: var(--text-faint);
			font-size: var(--font-size-xs);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee {
			animation: none;
		}
		.marquee-item {
			transition: none;
		}
	}
</style>

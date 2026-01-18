<!-- src/lib/components/atoms/MarqueeHorizontal.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	export let displayList: {
		name: string;
		link: string;
	}[] = [];
	export let noMove: boolean = false;
	export let speed: number = 30; // seconds for one full rotation
	export let theme: 'types' | 'relationships' | 'workplace' | 'growth' | 'custom' = 'custom';

	let marqueeWidth: number;

	// Predefined theme lists for smart cross-linking
	const themeDisplayLists = {
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
			{ name: 'Communication Guide', link: '/enneagram-corner/enneagram-communication-guide' },
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
			{ name: 'Communication Styles', link: '/enneagram-corner/enneagram-communication-styles' }
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
	$: finalDisplayList = displayList.length > 0 ? displayList : themeDisplayLists[theme] || [];

	onMount(() => {
		marqueeWidth = finalDisplayList.length * 250; // Adjust based on your content
	});

	$: jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'WebPageElement',
		isPartOf: {
			'@type': 'WebPage',
			'@id': 'https://9takes.com'
		},
		name: '9takes Enneagram Types Marquee',
		description: 'A scrolling marquee displaying Enneagram personality types and related content',
		cssSelector: '.marquee-container',
		hasPart: finalDisplayList.map((item, index) => {
			return {
				'@type': 'WebPageElement',
				name: item.name,
				url: `https://9takes.com${item.link}`,
				description: `A blog on Enneagram types ${item.name}`
			};
		})
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<div
	class="marquee-container"
	style="--marquee-width: {marqueeWidth}px; --marquee-speed: {speed}s;"
>
	<div class="marquee" class:paused={noMove} role="marquee">
		<div class="marquee-content">
			{#each finalDisplayList as item}
				<a href={item.link} class="marquee-item">{item.name}</a>
			{/each}
		</div>
		<div class="marquee-content" aria-hidden="true">
			{#each finalDisplayList as item}
				<a href={item.link} class="marquee-item">{item.name}</a>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	/* Solo Leveling Dark Theme */
	.marquee-container {
		width: 100%;
		overflow: hidden;
		background: linear-gradient(135deg, #1a1a2e 0%, #12121a 100%);
		border-top: 1px solid rgba(100, 116, 139, 0.2);
		border-bottom: 1px solid rgba(100, 116, 139, 0.2);
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
		background: linear-gradient(to right, #1a1a2e, transparent);
	}

	.marquee-container::after {
		right: 0;
		background: linear-gradient(to left, #12121a, transparent);
	}

	.marquee {
		display: flex;
		width: calc(var(--marquee-width) * 2);
		animation: scroll var(--marquee-speed) linear infinite;

		&.paused {
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
		padding: 1rem 2rem;
		color: #cbd5e1;
		text-transform: uppercase;
		font-size: 1.2rem;
		font-weight: bold;
		text-decoration: none;
		transition: all 0.3s ease;
		position: relative;

		&:hover {
			color: #a78bfa;
			transform: scale(1.1);
			text-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
		}

		/* Separator between items */
		&::after {
			content: '•';
			display: inline-block !important;
			margin-left: 2rem;
			color: #475569;
			font-size: 0.75rem;
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

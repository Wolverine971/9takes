<!-- src/lib/components/marketing/home/BeliefPoster.svelte -->
<!--
  The movement belief as a poster. The nine dots rest equal; when the row scrolls into view a
  random one "wins" while the rest fade, then all nine come back.
-->
<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { ArrowRight } from '@lucide/svelte';

	const NINE = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	let winner = $state<number | null>(null);
	let stage = $state<0 | 1 | 2>(0);

	const collapseOnView: Attachment<HTMLElement> = (row) => {
		if (typeof IntersectionObserver === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// Already on screen at load: skip it rather than animate under the reader's eyes.
		if (row.getBoundingClientRect().top < window.innerHeight) return;
		winner = NINE[Math.floor(Math.random() * NINE.length)];
		let timer: ReturnType<typeof setTimeout> | undefined;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				observer.disconnect();
				stage = 1;
				timer = setTimeout(() => (stage = 2), 1900);
			},
			{ threshold: 0.6 }
		);
		observer.observe(row);
		return () => {
			observer.disconnect();
			clearTimeout(timer);
		};
	};
</script>

<section class="belief" aria-labelledby="belief-title">
	<div class="wrap inner">
		<h2 id="belief-title">
			<span class="ital">The internet collapses</span>
			<span class="big">Nine perspectives</span>
			<span class="ital">into one winning take.</span>
		</h2>
		<div
			class={[
				'nine-dots',
				winner !== null && 'anim',
				stage === 1 && 'stage1',
				stage === 2 && 'stage2'
			]}
			aria-hidden="true"
			{@attach collapseOnView}
		>
			{#each NINE as n (n)}
				<span class={{ win: n === winner }} style:--i={n - 1}>{n}</span>
			{/each}
		</div>
		<p>
			Most feeds hand you the one loudest take. 9takes keeps all nine, so you can understand the
			other side.
		</p>
		<a class="cta" href="#answer" data-track="link" data-placement="belief_cta"
			>Give your take <ArrowRight size={18} aria-hidden="true" /></a
		>
	</div>
</section>

<style>
	.wrap {
		max-width: 1240px;
		margin: 0 auto;
		padding-inline: max(24px, env(safe-area-inset-left, 0px))
			max(24px, env(safe-area-inset-right, 0px));
	}
	.belief {
		/* Undo the global section/article element styles. */
		margin: 0;
		padding-inline: 0;
		border-radius: 0;
		--belief-ital: clamp(30px, 3.6vw, 48px);
		--belief-big: clamp(64px, 9vw, 128px);
		--belief-dot: clamp(14px, 1.8vw, 18px);
		padding-block: 96px 104px;
		border-top: 1px solid var(--rule);
		text-align: center;
		background: radial-gradient(
			50% 80% at 50% 100%,
			color-mix(in srgb, var(--accent) 28%, transparent),
			transparent 70%
		);
	}
	.inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 26px;
	}
	h2 {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		margin: 0;
		font-weight: 400;
	}
	.ital {
		display: block;
		font-family: var(--font-voice);
		font-style: italic;
		font-weight: 400;
		font-size: var(--belief-ital);
		line-height: 1;
		color: var(--highlight);
	}
	.big {
		display: block;
		font-family: var(--font-shout);
		font-weight: 400;
		font-size: var(--belief-big);
		line-height: 0.84;
		text-transform: uppercase;
		color: var(--text);
	}
	.nine-dots {
		display: flex;
		align-items: center;
		gap: clamp(8px, 1.6vw, 16px);
		margin-top: 10px;
	}
	.nine-dots span {
		display: grid;
		place-items: center;
		width: clamp(28px, 4vw, 40px);
		height: clamp(28px, 4vw, 40px);
		border: 1px solid var(--highlight);
		border-radius: 50%;
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--belief-dot);
		color: var(--text);
	}
	@media (prefers-reduced-motion: no-preference) {
		.nine-dots.anim span {
			transition:
				opacity 0.5s calc(var(--i) * 60ms),
				transform 0.5s,
				background 0.5s,
				color 0.5s,
				border-color 0.5s;
		}
		.nine-dots.anim.stage1 span:not(.win) {
			opacity: 0.25;
		}
		.nine-dots.anim.stage1 .win {
			transform: scale(1.3);
			background: var(--text);
			color: var(--bg);
		}
		.nine-dots.anim.stage2 span {
			opacity: 1;
			transform: none;
			background: transparent;
			color: var(--text);
			border-color: var(--highlight);
			box-shadow: 0 0 14px color-mix(in srgb, var(--highlight) 35%, transparent);
		}
	}
	p {
		max-width: 46ch;
		margin: 0;
		font-size: var(--font-size-lg);
		color: var(--text-muted);
	}
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		min-height: 48px;
		padding: 14px 24px;
		border-radius: 999px;
		background: var(--action);
		color: var(--text-on-action);
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}
	@media (max-width: 520px) {
		.big {
			line-height: 0.92;
		}
	}
	.cta:hover {
		transform: translateY(-1px);
		box-shadow: 0 10px 30px color-mix(in srgb, var(--action) 25%, transparent);
	}
</style>

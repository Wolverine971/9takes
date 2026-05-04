<!-- src/lib/components/blog/callouts/EnneagramTypingFlow.svelte -->
<!--
  EnneagramTypingFlow.svelte

  Editorial-style SVG infographic that maps the blog's 4-step framework:
    behavior → motivation pivot → 3 emotion centers → 9 typed lessons → your type.

  Self-contained: ships its own dark "diagram card" palette (warm/amber, mirroring
  the Streetlamp Symposium V4 preview) so it pops inside any blog theme.
-->
<script lang="ts">
	import { TYPE_COLOR_MAP } from '$lib/constants/enneagramColors';

	const c = TYPE_COLOR_MAP;
</script>

<figure class="typing-flow" aria-labelledby="typing-flow-title">
	<figcaption class="typing-flow__caption">
		<span class="typing-flow__tag">§ THE FRAMEWORK · MOTIVATION OVER BEHAVIOR</span>
		<h3 id="typing-flow-title" class="typing-flow__title">How a behavior becomes a type.</h3>
		<p class="typing-flow__sub">
			One pattern in. The "why" question. Three emotion centers. Nine typed lessons. One type out.
		</p>
	</figcaption>

	<div class="typing-flow__diagram">
		<svg
			viewBox="0 0 800 1110"
			xmlns="http://www.w3.org/2000/svg"
			class="typing-flow__svg"
			role="img"
			aria-label="Flow chart: behavior to motivation pivot to three emotion centers to nine typed lessons to your type"
			preserveAspectRatio="xMidYMid meet"
		>
			<defs>
				<marker
					id="tf-arrow"
					markerWidth="10"
					markerHeight="10"
					refX="9"
					refY="5"
					orient="auto"
					markerUnits="strokeWidth"
				>
					<path d="M0,0 L0,10 L10,5 z" fill="var(--tf-glow)" />
				</marker>
			</defs>

			<!-- ============ NODE 1 · WHAT YOU DO (the trap) ============ -->
			<g class="tf-node" aria-label="What you do">
				<rect
					x="270"
					y="20"
					width="260"
					height="92"
					rx="8"
					ry="8"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<text x="400" y="50" text-anchor="middle" class="tf-label" fill="var(--tf-glow)">
					WHAT YOU DO
				</text>
				<text x="400" y="76" text-anchor="middle" class="tf-body" fill="var(--tf-ink)">
					you organize · you help
				</text>
				<text x="400" y="96" text-anchor="middle" class="tf-body" fill="var(--tf-ink)">
					you withdraw · you achieve
				</text>
			</g>

			<!-- arrow 1 → 2 with "DON'T STOP HERE" annotation -->
			<line
				x1="400"
				y1="112"
				x2="400"
				y2="170"
				stroke="var(--tf-glow)"
				stroke-width="2"
				marker-end="url(#tf-arrow)"
			/>
			<text x="540" y="148" class="tf-annotation" fill="var(--tf-dim)">
				DON&rsquo;T STOP HERE &mdash;
			</text>

			<!-- ============ NODE 2 · ASK WHY? (the pivot) ============ -->
			<g class="tf-node" aria-label="Ask why">
				<rect
					x="240"
					y="180"
					width="320"
					height="120"
					rx="8"
					ry="8"
					fill="var(--tf-stone)"
					stroke="var(--tf-glow)"
					stroke-width="1.5"
				/>
				<text x="400" y="212" text-anchor="middle" class="tf-label" fill="var(--tf-glow)">
					ASK: WHY?
				</text>
				<text
					x="400"
					y="240"
					text-anchor="middle"
					class="tf-body tf-body--italic"
					fill="var(--tf-ink)"
				>
					what fear, what desire,
				</text>
				<text
					x="400"
					y="262"
					text-anchor="middle"
					class="tf-body tf-body--italic"
					fill="var(--tf-ink)"
				>
					what childhood lesson
				</text>
				<text
					x="400"
					y="284"
					text-anchor="middle"
					class="tf-body tf-body--strong"
					fill="var(--tf-ink)"
				>
					drives this behavior?
				</text>
			</g>

			<!-- arrow 2 → 3 -->
			<line
				x1="400"
				y1="300"
				x2="400"
				y2="350"
				stroke="var(--tf-glow)"
				stroke-width="2"
				marker-end="url(#tf-arrow)"
			/>
			<text x="400" y="335" text-anchor="middle" class="tf-annotation" fill="var(--tf-dim)">
				&mdash; FOLLOW THE EMOTION &mdash;
			</text>

			<!-- ============ NODE 3 · THREE EMOTION CENTERS ============ -->
			<!-- ANGER · BODY -->
			<g class="tf-node" aria-label="Anger center">
				<rect
					x="20"
					y="360"
					width="240"
					height="110"
					rx="8"
					ry="8"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="20" y="360" width="240" height="4" fill="#DC2626" />
				<text x="140" y="392" text-anchor="middle" class="tf-label" fill="var(--tf-glow)">
					ANGER &middot; BODY
				</text>
				<text
					x="140"
					y="418"
					text-anchor="middle"
					class="tf-body tf-body--italic"
					fill="var(--tf-ink)"
				>
					control &middot; autonomy
				</text>
				<text
					x="140"
					y="440"
					text-anchor="middle"
					class="tf-body tf-body--italic"
					fill="var(--tf-ink)"
				>
					justice
				</text>
				<text x="140" y="462" text-anchor="middle" class="tf-annotation" fill="var(--tf-dim)">
					TYPES 8 &middot; 9 &middot; 1
				</text>
			</g>

			<!-- SHAME · HEART -->
			<g class="tf-node" aria-label="Shame center">
				<rect
					x="280"
					y="360"
					width="240"
					height="110"
					rx="8"
					ry="8"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="280" y="360" width="240" height="4" fill="#F472B6" />
				<text x="400" y="392" text-anchor="middle" class="tf-label" fill="var(--tf-glow)">
					SHAME &middot; HEART
				</text>
				<text
					x="400"
					y="418"
					text-anchor="middle"
					class="tf-body tf-body--italic"
					fill="var(--tf-ink)"
				>
					image &middot; worth
				</text>
				<text
					x="400"
					y="440"
					text-anchor="middle"
					class="tf-body tf-body--italic"
					fill="var(--tf-ink)"
				>
					identity
				</text>
				<text x="400" y="462" text-anchor="middle" class="tf-annotation" fill="var(--tf-dim)">
					TYPES 2 &middot; 3 &middot; 4
				</text>
			</g>

			<!-- FEAR · HEAD -->
			<g class="tf-node" aria-label="Fear center">
				<rect
					x="540"
					y="360"
					width="240"
					height="110"
					rx="8"
					ry="8"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="540" y="360" width="240" height="4" fill="#0EA5E9" />
				<text x="660" y="392" text-anchor="middle" class="tf-label" fill="var(--tf-glow)">
					FEAR &middot; HEAD
				</text>
				<text
					x="660"
					y="418"
					text-anchor="middle"
					class="tf-body tf-body--italic"
					fill="var(--tf-ink)"
				>
					safety &middot; certainty
				</text>
				<text
					x="660"
					y="440"
					text-anchor="middle"
					class="tf-body tf-body--italic"
					fill="var(--tf-ink)"
				>
					escape
				</text>
				<text x="660" y="462" text-anchor="middle" class="tf-annotation" fill="var(--tf-dim)">
					TYPES 5 &middot; 6 &middot; 7
				</text>
			</g>

			<!-- arrows from pivot fan to 3 centers -->
			<!-- (these read as extra connectors above the centers — light dashed glyphs) -->
			<line
				x1="400"
				y1="350"
				x2="140"
				y2="358"
				stroke="var(--tf-glow)"
				stroke-width="1.4"
				stroke-dasharray="4 4"
			/>
			<line
				x1="400"
				y1="350"
				x2="660"
				y2="358"
				stroke="var(--tf-glow)"
				stroke-width="1.4"
				stroke-dasharray="4 4"
			/>

			<!-- arrows from each center down toward its 3 types -->
			<line
				x1="140"
				y1="470"
				x2="140"
				y2="510"
				stroke="var(--tf-glow)"
				stroke-width="2"
				marker-end="url(#tf-arrow)"
			/>
			<line
				x1="400"
				y1="470"
				x2="400"
				y2="510"
				stroke="var(--tf-glow)"
				stroke-width="2"
				marker-end="url(#tf-arrow)"
			/>
			<line
				x1="660"
				y1="470"
				x2="660"
				y2="510"
				stroke="var(--tf-glow)"
				stroke-width="2"
				marker-end="url(#tf-arrow)"
			/>

			<!-- ============ NINE TYPE CARDS · 3 columns × 3 rows ============ -->
			<!-- ROW 1 -->
			<g class="tf-node" aria-label="Type 8 lesson">
				<rect
					x="20"
					y="520"
					width="240"
					height="80"
					rx="6"
					ry="6"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="20" y="520" width="240" height="3" fill={c[8]} />
				<text x="140" y="546" text-anchor="middle" class="tf-tlabel" fill="var(--tf-glow)">
					T8 &middot; THE CHALLENGER
				</text>
				<text x="140" y="572" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					&ldquo;I must never
				</text>
				<text x="140" y="588" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					be vulnerable&rdquo;
				</text>
			</g>

			<g class="tf-node" aria-label="Type 2 lesson">
				<rect
					x="280"
					y="520"
					width="240"
					height="80"
					rx="6"
					ry="6"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="280" y="520" width="240" height="3" fill={c[2]} />
				<text x="400" y="546" text-anchor="middle" class="tf-tlabel" fill="var(--tf-glow)">
					T2 &middot; THE HELPER
				</text>
				<text x="400" y="572" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					&ldquo;I&rsquo;m only loved
				</text>
				<text x="400" y="588" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					when I&rsquo;m helpful&rdquo;
				</text>
			</g>

			<g class="tf-node" aria-label="Type 5 lesson">
				<rect
					x="540"
					y="520"
					width="240"
					height="80"
					rx="6"
					ry="6"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="540" y="520" width="240" height="3" fill={c[5]} />
				<text x="660" y="546" text-anchor="middle" class="tf-tlabel" fill="var(--tf-glow)">
					T5 &middot; THE INVESTIGATOR
				</text>
				<text x="660" y="572" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					&ldquo;the world takes more
				</text>
				<text x="660" y="588" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					than it gives&rdquo;
				</text>
			</g>

			<!-- ROW 2 -->
			<g class="tf-node" aria-label="Type 9 lesson">
				<rect
					x="20"
					y="612"
					width="240"
					height="80"
					rx="6"
					ry="6"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="20" y="612" width="240" height="3" fill={c[9]} />
				<text x="140" y="638" text-anchor="middle" class="tf-tlabel" fill="var(--tf-glow)">
					T9 &middot; THE PEACEMAKER
				</text>
				<text x="140" y="664" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					&ldquo;my needs
				</text>
				<text x="140" y="680" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					create conflict&rdquo;
				</text>
			</g>

			<g class="tf-node" aria-label="Type 3 lesson">
				<rect
					x="280"
					y="612"
					width="240"
					height="80"
					rx="6"
					ry="6"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="280" y="612" width="240" height="3" fill={c[3]} />
				<text x="400" y="638" text-anchor="middle" class="tf-tlabel" fill="var(--tf-glow)">
					T3 &middot; THE ACHIEVER
				</text>
				<text x="400" y="664" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					&ldquo;I&rsquo;m only valued
				</text>
				<text x="400" y="680" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					for what I achieve&rdquo;
				</text>
			</g>

			<g class="tf-node" aria-label="Type 6 lesson">
				<rect
					x="540"
					y="612"
					width="240"
					height="80"
					rx="6"
					ry="6"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="540" y="612" width="240" height="3" fill={c[6]} />
				<text x="660" y="638" text-anchor="middle" class="tf-tlabel" fill="var(--tf-glow)">
					T6 &middot; THE LOYALIST
				</text>
				<text x="660" y="664" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					&ldquo;I can&rsquo;t trust
				</text>
				<text x="660" y="680" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					authority to keep me safe&rdquo;
				</text>
			</g>

			<!-- ROW 3 -->
			<g class="tf-node" aria-label="Type 1 lesson">
				<rect
					x="20"
					y="704"
					width="240"
					height="80"
					rx="6"
					ry="6"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="20" y="704" width="240" height="3" fill={c[1]} />
				<text x="140" y="730" text-anchor="middle" class="tf-tlabel" fill="var(--tf-glow)">
					T1 &middot; THE PERFECTIONIST
				</text>
				<text x="140" y="756" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					&ldquo;I&rsquo;m only good
				</text>
				<text x="140" y="772" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					if I&rsquo;m perfect&rdquo;
				</text>
			</g>

			<g class="tf-node" aria-label="Type 4 lesson">
				<rect
					x="280"
					y="704"
					width="240"
					height="80"
					rx="6"
					ry="6"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="280" y="704" width="240" height="3" fill={c[4]} />
				<text x="400" y="730" text-anchor="middle" class="tf-tlabel" fill="var(--tf-glow)">
					T4 &middot; THE INDIVIDUALIST
				</text>
				<text x="400" y="756" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					&ldquo;I&rsquo;m fundamentally
				</text>
				<text x="400" y="772" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					different (and alone)&rdquo;
				</text>
			</g>

			<g class="tf-node" aria-label="Type 7 lesson">
				<rect
					x="540"
					y="704"
					width="240"
					height="80"
					rx="6"
					ry="6"
					fill="var(--tf-stone)"
					stroke="var(--tf-edge)"
					stroke-width="1"
				/>
				<rect x="540" y="704" width="240" height="3" fill={c[7]} />
				<text x="660" y="730" text-anchor="middle" class="tf-tlabel" fill="var(--tf-glow)">
					T7 &middot; THE ENTHUSIAST
				</text>
				<text x="660" y="756" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					&ldquo;pain must be avoided
				</text>
				<text x="660" y="772" text-anchor="middle" class="tf-tbody" fill="var(--tf-ink)">
					at all costs&rdquo;
				</text>
			</g>

			<!-- annotation between cards and final output -->
			<text x="400" y="816" text-anchor="middle" class="tf-annotation" fill="var(--tf-dim)">
				&mdash; THE LESSON THAT STILL RUNS YOUR LIFE &mdash;
			</text>

			<!-- convergence arrows: column-bottoms → final box -->
			<line
				x1="140"
				y1="828"
				x2="380"
				y2="900"
				stroke="var(--tf-glow)"
				stroke-width="2"
				marker-end="url(#tf-arrow)"
			/>
			<line
				x1="400"
				y1="828"
				x2="400"
				y2="900"
				stroke="var(--tf-glow)"
				stroke-width="2"
				marker-end="url(#tf-arrow)"
			/>
			<line
				x1="660"
				y1="828"
				x2="420"
				y2="900"
				stroke="var(--tf-glow)"
				stroke-width="2"
				marker-end="url(#tf-arrow)"
			/>

			<!-- ============ NODE FINAL · YOUR TYPE ============ -->
			<g class="tf-node" aria-label="Your type">
				<rect
					x="200"
					y="910"
					width="400"
					height="170"
					rx="8"
					ry="8"
					fill="var(--tf-stone)"
					stroke="var(--tf-glow)"
					stroke-width="2"
				/>
				<text x="400" y="944" text-anchor="middle" class="tf-label" fill="var(--tf-glow)">
					YOUR TYPE
				</text>
				<text x="400" y="978" text-anchor="middle" class="tf-body" fill="var(--tf-ink)">
					not the behavior you show &mdash;
				</text>
				<text x="400" y="1000" text-anchor="middle" class="tf-body" fill="var(--tf-ink)">
					the motivation underneath it.
				</text>
				<text
					x="400"
					y="1022"
					text-anchor="middle"
					class="tf-body tf-body--strong"
					fill="var(--tf-ink)"
				>
					whichever lesson made you
				</text>
				<text
					x="400"
					y="1044"
					text-anchor="middle"
					class="tf-body tf-body--strong"
					fill="var(--tf-ink)"
				>
					uncomfortable &mdash; that&rsquo;s yours.
				</text>
				<text x="400" y="1066" text-anchor="middle" class="tf-annotation" fill="var(--tf-dim)">
					&mdash; OUTPUT &mdash;
				</text>
			</g>
		</svg>
	</div>
</figure>

<style lang="scss">
	.typing-flow {
		/* dark mode (default) — warm streetlamp palette */
		--tf-night: #0a0807;
		--tf-night-mid: #16110d;
		--tf-stone: #241d17;
		--tf-edge: #5c4f47;
		--tf-glow: #f59e0b;
		--tf-ink: #faf8f4;
		--tf-mid: #a8a095;
		--tf-dim: #8a7d70;
		--tf-pool: rgba(245, 158, 11, 0.18);
		--tf-title: #ffffff;
		--tf-title-shadow: rgba(0, 0, 0, 0.45);
		--tf-card-shadow: rgba(0, 0, 0, 0.45);
		--tf-card-ring: rgba(245, 158, 11, 0.06);

		--tf-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
		--tf-body: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;

		position: relative;
		margin: 2.5rem auto;
		padding: 32px 24px 28px;
		max-width: 880px;

		background:
			radial-gradient(ellipse 70% 60% at 50% 35%, var(--tf-pool) 0%, transparent 60%),
			linear-gradient(180deg, var(--tf-night-mid) 0%, var(--tf-night) 100%);
		border: 1px solid var(--tf-edge);
		border-radius: 14px;
		box-shadow:
			0 12px 40px var(--tf-card-shadow),
			0 0 0 1px var(--tf-card-ring);

		font-family: var(--tf-body);
		color: var(--tf-ink);

		/* Defend against blog-prose typography clobbering our editorial card */
		& :global(h3),
		& :global(p) {
			margin: 0;
			color: inherit;
		}

		@media (max-width: 640px) {
			margin: 1.75rem -0.5rem;
			padding: 22px 14px 18px;
			border-radius: 10px;
		}
	}

	/* light mode — cream parchment, burnt-orange glow */
	:global(:root.light) .typing-flow {
		--tf-night: #fbf7ee;
		--tf-night-mid: #fff8e8;
		--tf-stone: #ffffff;
		--tf-edge: #d6ccb8;
		--tf-glow: #b45309;
		--tf-ink: #1c1917;
		--tf-mid: #57534e;
		--tf-dim: #78716c;
		--tf-pool: rgba(180, 83, 9, 0.09);
		--tf-title: #1c1917;
		--tf-title-shadow: transparent;
		--tf-card-shadow: rgba(28, 25, 23, 0.08);
		--tf-card-ring: rgba(180, 83, 9, 0.05);
	}

	.typing-flow__caption {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		text-align: center;
		margin: 0 0 24px;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.typing-flow__tag {
		font-family: var(--tf-mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--tf-glow);
	}

	.typing-flow .typing-flow__title,
	h3.typing-flow__title {
		font-family: var(--tf-body);
		font-weight: 700;
		font-size: clamp(20px, 3vw, 26px);
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: var(--tf-title);
		text-shadow: 0 1px 2px var(--tf-title-shadow);
		margin: 0;
	}

	.typing-flow__sub {
		font-family: var(--tf-body);
		font-size: 14px;
		line-height: 1.55;
		color: var(--tf-mid);
		margin: 0;
		max-width: 520px;
	}

	.typing-flow__diagram {
		position: relative;
		max-width: 820px;
		margin: 0 auto;
	}

	.typing-flow__svg {
		display: block;
		width: 100%;
		height: auto;
		max-width: 100%;
	}

	/* SVG text classes via :global */
	.typing-flow__svg :global(.tf-label) {
		font-family: var(--tf-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.typing-flow__svg :global(.tf-body) {
		font-family: var(--tf-body);
		font-size: 14px;
		font-weight: 400;
	}

	.typing-flow__svg :global(.tf-body--italic) {
		font-style: italic;
		font-size: 13.5px;
	}

	.typing-flow__svg :global(.tf-body--strong) {
		font-weight: 600;
	}

	.typing-flow__svg :global(.tf-tlabel) {
		font-family: var(--tf-mono);
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.typing-flow__svg :global(.tf-tbody) {
		font-family: var(--tf-body);
		font-size: 12.5px;
		font-weight: 500;
		font-style: italic;
	}

	.typing-flow__svg :global(.tf-annotation) {
		font-family: var(--tf-mono);
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
</style>

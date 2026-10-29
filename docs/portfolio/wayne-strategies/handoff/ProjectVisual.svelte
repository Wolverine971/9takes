<script lang="ts">
	let {
		layerId,
		compact = false,
		animated = false
	}: {
		layerId: string;
		compact?: boolean;
		animated?: boolean;
	} = $props();

	const base = '/assets/work/projects/9takes/';
	const emotions = [
		{ name: 'Anger', strength: 'Instinct', types: [8, 1, 9] },
		{ name: 'Shame', strength: 'Emotional intelligence', types: [4, 2, 3] },
		{ name: 'Fear', strength: 'Intellect', types: [6, 7, 5] }
	];
	const relations = ['Uses it', 'Pushes it down', 'Doesn’t notice it'];
	const portraits = [
		{ file: 'jack-black.webp', name: 'Jack Black', type: 7, note: 'Why he acts so crazy' },
		{
			file: 'dario-amodei.webp',
			name: 'Dario Amodei',
			type: 5,
			note: 'Building the thing he fears'
		},
		{
			file: 'sydney-sweeney.webp',
			name: 'Sydney Sweeney',
			type: 3,
			note: 'What her interviews reveal'
		}
	];
	const bars = [
		3, 5, 8, 5, 11, 17, 9, 21, 15, 25, 19, 12, 22, 16, 8, 13, 20, 12, 7, 14, 9, 5, 8, 3
	];
	const reviews = [
		{ name: 'Research', note: 'Sources + claim evidence' },
		{ name: 'Draft', note: 'An argument with context' },
		{ name: 'Review', note: 'Evidence + reader lenses' },
		{ name: 'Verify', note: 'Revision + publication gates' }
	];
</script>

<div class={['visual', compact && 'compact', animated && 'animated']}>
	<div class="canvas" data-layer={layerId}>
		{#if layerId === 'site'}
			<div class="site-view">
				<img
					class="site-shot"
					src={`${base}home-public.jpg`}
					alt="Actual 9takes homepage: one question, nine perspectives, with a friendship question awaiting an answer"
					width="1280"
					height="720"
				/>
				<div class="site-caption">
					<strong>9takes</strong><span>Public website · October 2026</span><i aria-hidden="true"
						>↗</i
					>
				</div>
			</div>
		{:else if layerId === 'answer-first'}
			<div class="answer-view">
				<div class="topline">
					<span>9takes / the conversation</span><span class="small-note"
						>Interface illustration</span
					>
				</div>
				<div class="answer-body">
					<div class="question-side">
						<p class="kicker">Your own perspective comes first</p>
						<h3>What makes<br />someone<br /><em>a friend?</em></h3>
						<p class="support">Answer before the crowd.</p>
						<img
							class="conversation-strip"
							src={`${base}community-circle.webp`}
							alt="Original 9takes illustration of a group talking beneath lamplight"
							width="888"
							height="444"
						/>
					</div>
					<div class="composer-side">
						<div class="composer">
							<span class="mono">01 · YOUR TAKE</span>
							<p>A few honest words<br />are enough.</p>
							<div class="voice">
								<span class="voice-dot" aria-hidden="true"></span>
								<div class="wave" aria-hidden="true">
									{#each bars as height, index (index)}<i
											style:--bar={`${height / 12}em`}
											style:--delay={`${index * 35}ms`}
										></i>{/each}
								</div>
							</div>
							<span class="voice-label">Speak → review transcript → post</span>
						</div>
						<div class="unlock">
							<span aria-hidden="true">↳</span>
							<div>
								<b>02 · THE ROOM OPENS</b>
								<p>Read the other perspectives.</p>
							</div>
						</div>
						<div class="type-row" aria-label="Nine Enneagram perspectives">
							{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as type (type)}<span>{type}</span>{/each}
						</div>
					</div>
				</div>
			</div>
		{:else if layerId === 'discover'}
			<div class="discover-view">
				<div class="topline">
					<span>9takes / free Enneagram test</span><span class="small-note">Product flow</span>
				</div>
				<h3>Start with the emotion.</h3>
				<p class="discover-sub">A conversation that can end with one type. Or two.</p>
				<div class="emotion-grid">
					{#each emotions as emotion (emotion.name)}
						<div class="emotion">
							<h4>{emotion.name}</h4>
							<span class="strength">{emotion.strength}</span>
							<div class="stem" aria-hidden="true"></div>
							<div class="type-branches">
								{#each emotion.types as type, index (type)}<div class="type-branch">
										<b>{type}</b><span>{relations[index]}</span>
									</div>{/each}
							</div>
						</div>
					{/each}
				</div>
				<div class="decision-path">
					<span>Two types fit?</span><strong>Compare the core fears.</strong><span
						class="path-arrow"
						aria-hidden="true">↗</span
					>
				</div>
				<div class="friend-path">
					<span class="friend-symbol" aria-hidden="true">◎ ◎</span>
					<div>
						<b>Ask someone who knows you.</b>
						<p>Their read comes before your reveal.</p>
					</div>
				</div>
			</div>
		{:else if layerId === 'profiles'}
			<div class="profiles-view">
				<div class="topline">
					<span>9takes / Personality Analysis</span><span class="small-note"
						>Actual editorial artwork</span
					>
				</div>
				<h3>Look beneath<br /><em>the public persona.</em></h3>
				<div class="portrait-grid">
					{#each portraits as person (person.name)}
						<div class="portrait">
							<span class="portrait-type">Enneagram <b>{person.type}</b></span>
							<img
								src={`${base}${person.file}`}
								alt={`9takes editorial portrait of ${person.name}, with its signature violet eye treatment`}
								width="640"
								height="640"
							/>
							<div class="portrait-label">
								<strong>{person.name}</strong><span>{person.note}</span>
							</div>
						</div>
					{/each}
				</div>
				<p class="profile-note">Editorial interpretations of public figures.</p>
			</div>
		{:else if layerId === 'editorial'}
			<div class="editorial-view">
				<div class="topline">
					<span>9takes / the publishing desk</span><span class="small-note">Editorial workflow</span
					>
				</div>
				<div class="editorial-body">
					<div class="editorial-art">
						<h3>Every story<br />has a process.</h3>
						<div class="cover main-cover">
							<img
								src={`${base}relationships.webp`}
								alt="Actual sculptural cover for the 9takes relationships guide"
								width="900"
								height="502"
							/><span>Love, conflict & repair</span>
						</div>
						<div class="cover secondary-cover">
							<img
								src={`${base}teamwork.webp`}
								alt="Actual 9takes teamwork cover showing Greek statues building a boat"
								width="900"
								height="900"
							/><span>Nine types at work</span>
						</div>
					</div>
					<div class="editorial-process">
						<p class="kicker">From evidence to an article</p>
						{#each reviews as review, index (review.name)}<div class="review-step">
								<span class="review-number">0{index + 1}</span>
								<div>
									<strong>{review.name}</strong>
									<p>{review.note}</p>
								</div>
							</div>{/each}
						<div class="evidence-label">
							<span>Observed</span><span>Interpreted</span><span>Unknown</span>
						</div>
					</div>
				</div>
			</div>
		{:else if layerId === 'operations'}
			<div class="operations-view">
				<div class="topline">
					<span>9takes / community operations</span><span class="small-note"
						>Workflow illustration</span
					>
				</div>
				<div class="operations-body">
					<div class="ops-intro">
						<img
							src={`${base}nine-masks.webp`}
							alt="9takes nine-mask brand mark"
							width="512"
							height="512"
						/>
						<h3>Care for<br />the room.</h3>
						<p>Questions.<br />Comments.<br />Categories.<br />Content.</p>
					</div>
					<div class="moderation">
						<p class="kicker">Comment moderation</p>
						<div class="flag-event">
							<span class="flag-symbol" aria-hidden="true">⚑</span>
							<div>
								<b>A reply is flagged.</b>
								<p>Pending administrator review</p>
							</div>
						</div>
						<div class="review-line">
							<i aria-hidden="true"></i><span>Review the context</span><i aria-hidden="true"></i>
						</div>
						<div class="moderation-branches">
							<div><b>Clear</b><span>Dismiss the flag</span></div>
							<div><b>Remove</b><span>Hide the comment</span></div>
						</div>
						<div class="ops-foot">
							<span>Protected access</span><span>Pending-state checks</span><span
								>Failure recovery</span
							>
						</div>
					</div>
				</div>
			</div>
		{:else if layerId === 'brand'}
			<div class="brand-view">
				<div class="brand-identity">
					<span class="kicker">Streetlamp Symposium</span><img
						class="mask-mark"
						src={`${base}nine-masks.webp`}
						alt="Nine marble masks, each with a distinct expression, within an amber-edged square"
						width="512"
						height="512"
					/><strong class="wordmark">9takes</strong>
					<p>See the emotions<br />behind every take.</p>
					<div class="swatches" aria-label="Warm stone, marble, amber, and teal brand colors">
						<i></i><i></i><i></i><i></i>
					</div>
				</div>
				<div class="brand-scenes">
					<img
						class="athens"
						src={`${base}symposium.webp`}
						alt="Nine Greek statues in conversation beneath an oil lamp in Athens"
						width="888"
						height="444"
					/><img
						class="mercy"
						src={`${base}mercy.webp`}
						alt="Original sculptural artwork with amber streetlamp illumination"
						width="900"
						height="514"
					/>
					<div class="scene-label">
						<span>Original art. A shared language.</span><strong>Marble & lamplight.</strong>
					</div>
				</div>
			</div>
		{:else}
			<div class="fallback">
				<img
					src={`${base}nine-masks.webp`}
					alt="The 9takes nine-mask identity"
					width="512"
					height="512"
				/><strong>9takes</strong><span>One question, nine perspectives.</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.visual {
		position: relative;
		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
		aspect-ratio: 16 / 10;
		container-type: inline-size;
		overflow: hidden;
		background: #0a0807;
		isolation: isolate;
	}
	.canvas {
		position: absolute;
		inset: 0;
		font:
			400 2.2cqw/1.35 Inter,
			ui-sans-serif,
			system-ui,
			sans-serif;
		color: #faf8f4;
	}
	.canvas * {
		box-sizing: border-box;
	}
	h3,
	h4,
	p {
		margin: 0;
	}
	h3 {
		font-size: 2.6em;
		line-height: 1.04;
		letter-spacing: -0.055em;
		font-weight: 750;
	}
	em {
		font-style: normal;
		color: #f59e0b;
	}
	img {
		display: block;
		max-width: 100%;
	}
	.topline {
		height: 2.7em;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1em;
		border-bottom: 1px solid #5c4f4760;
		font-size: 0.66em;
		letter-spacing: 0.055em;
		text-transform: uppercase;
		font-family: 'JetBrains Mono', ui-monospace, monospace;
	}
	.small-note {
		color: #a8a095;
		font-size: 0.88em;
		white-space: nowrap;
	}
	.kicker,
	.mono {
		font-family: 'JetBrains Mono', ui-monospace, monospace;
		font-size: 0.64em;
		font-weight: 600;
		letter-spacing: 0.055em;
		text-transform: uppercase;
		color: #f59e0b;
	}
	.site-view {
		height: 100%;
		background: #16110d;
		overflow: hidden;
	}
	.site-shot {
		width: 100%;
		height: 90%;
		object-fit: cover;
		object-position: top;
	}
	.site-caption {
		display: flex;
		align-items: center;
		gap: 1em;
		height: 10%;
		padding: 0 1.4em;
		border-top: 1px solid #5c4f47;
	}
	.site-caption strong {
		font-size: 1.3em;
		letter-spacing: -0.06em;
	}
	.site-caption span {
		margin-left: auto;
		font-size: 0.65em;
		color: #a8a095;
	}
	.site-caption i {
		color: #f59e0b;
		font-style: normal;
	}
	.answer-view,
	.discover-view,
	.profiles-view,
	.editorial-view,
	.operations-view {
		height: 100%;
		padding: 0 1.7em 1.5em;
	}
	.answer-body {
		display: grid;
		grid-template-columns: 1fr 1.04fr;
		gap: 2em;
		padding-top: 1.9em;
	}
	.question-side h3 {
		font-size: 3.25em;
		margin: 0.35em 0 0.3em;
	}
	.support {
		font-size: 0.65em;
		max-width: 19em;
		color: #a8a095;
	}
	.conversation-strip {
		width: 100%;
		height: 6em;
		margin-top: 1.1em;
		object-fit: cover;
		border-radius: 0.3em;
	}
	.composer-side {
		padding-top: 0.3em;
	}
	.composer {
		background: #faf8f4;
		color: #241d17;
		padding: 1.4em;
		border-radius: 0.6em;
		box-shadow: 0 1em 3em #0005;
	}
	.composer .mono {
		color: #92400e;
	}
	.composer p {
		font-size: 1.65em;
		line-height: 1.18;
		letter-spacing: -0.035em;
		font-weight: 650;
		margin: 0.75em 0;
	}
	.voice {
		display: flex;
		gap: 0.8em;
		align-items: center;
		height: 3em;
		border-top: 1px solid #d6ccb8;
		padding-top: 0.4em;
	}
	.voice-dot {
		width: 1.3em;
		height: 1.3em;
		border-radius: 50%;
		background: #b45309;
		box-shadow: 0 0 0 0.35em #b4530915;
		flex-shrink: 0;
	}
	.wave {
		display: flex;
		gap: 0.16em;
		align-items: center;
		flex: 1;
		height: 2.2em;
	}
	.wave i {
		display: block;
		flex: 1;
		height: var(--bar);
		background: #b45309;
		border-radius: 0.2em;
		transform-origin: center;
	}
	.voice-label {
		font-size: 0.64em;
		color: #5c4f47;
		display: block;
		margin-top: 0.65em;
	}
	.unlock {
		display: flex;
		align-items: center;
		gap: 0.6em;
		margin: 1.1em 0 0.9em;
	}
	.unlock > span {
		font-size: 2.6em;
		line-height: 1;
		color: #f59e0b;
	}
	.unlock b {
		font-size: 0.64em;
		color: #f59e0b;
		letter-spacing: 0.06em;
	}
	.unlock p {
		font-size: 0.9em;
		margin-top: 0.2em;
	}
	.type-row {
		display: flex;
		justify-content: space-between;
		gap: 0.2em;
	}
	.type-row span {
		width: 1.65em;
		height: 1.8em;
		display: grid;
		place-items: center;
		border: 1px solid #5c4f47;
		border-radius: 0.25em;
		color: #faf8f4;
	}
	.discover-view {
		background: #f2ebdd;
		color: #241d17;
	}
	.discover-view .small-note {
		color: #5c4f47;
	}
	.discover-view h3 {
		margin-top: 0.5em;
	}
	.discover-sub {
		margin-top: 0.6em;
		font-size: 0.85em;
		color: #5c4f47;
	}
	.emotion-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1em;
		margin-top: 1.2em;
	}
	.emotion {
		text-align: center;
	}
	.emotion h4 {
		font-size: 1.75em;
		font-weight: 720;
		letter-spacing: -0.04em;
	}
	.strength {
		display: block;
		font-size: 0.62em;
		color: #5c4f47;
		height: 1.5em;
		margin-top: 0.3em;
	}
	.stem {
		width: 1px;
		height: 1.2em;
		background: #b45309;
		margin: 0.55em auto 0;
	}
	.type-branches {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border-top: 1px solid #b45309;
		padding-top: 0.7em;
		gap: 0.2em;
	}
	.type-branch {
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.type-branch b {
		display: grid;
		place-items: center;
		width: 1.75em;
		height: 1.75em;
		border-radius: 50%;
		background: #241d17;
		color: #fbbf24;
		font-size: 1.7em;
	}
	.type-branch span {
		font-size: 0.53em;
		margin-top: 0.7em;
		white-space: nowrap;
	}
	.decision-path {
		display: flex;
		align-items: center;
		gap: 0.9em;
		padding: 0.85em 1.1em;
		margin-top: 1.15em;
		border: 1px solid #c3b49c;
		border-radius: 0.3em;
		font-size: 0.9em;
	}
	.decision-path > span:first-child {
		color: #5c4f47;
	}
	.path-arrow {
		margin-left: auto;
		color: #b45309;
		font-size: 1.7em;
		line-height: 1;
	}
	.friend-path {
		display: flex;
		gap: 0.9em;
		align-items: center;
		margin-top: 1.1em;
	}
	.friend-symbol {
		font-size: 2em;
		color: #b45309;
		letter-spacing: -0.15em;
	}
	.friend-path b {
		font-size: 1em;
	}
	.friend-path p {
		font-size: 0.75em;
		color: #5c4f47;
		margin-top: 0.2em;
	}
	.profiles-view {
		background: #16110d;
	}
	.profiles-view h3 {
		margin-top: 0.6em;
		font-size: 2.7em;
	}
	.portrait-grid {
		display: grid;
		grid-template-columns: 1.14fr 1fr 1fr;
		gap: 0.65em;
		margin-top: 1.1em;
	}
	.portrait {
		position: relative;
		height: 15.3em;
		overflow: hidden;
		border: 1px solid #5c4f4760;
		background: #241d17;
	}
	.portrait img {
		position: absolute;
		bottom: 2.4em;
		width: 100%;
		height: 12em;
		object-fit: contain;
		object-position: center bottom;
	}
	.portrait-type {
		position: absolute;
		top: 0.7em;
		left: 0.7em;
		z-index: 1;
		font-size: 0.62em;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.portrait-type b {
		color: #f59e0b;
		font-size: 1.25em;
	}
	.portrait-label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		min-height: 3.8em;
		padding: 0.8em 0.7em;
		background: #0a0807;
	}
	.portrait-label strong {
		display: block;
		font-size: 0.98em;
		letter-spacing: -0.03em;
	}
	.portrait-label span {
		display: block;
		margin-top: 0.35em;
		font-size: 0.58em;
		color: #a8a095;
	}
	.profile-note {
		font-size: 0.59em;
		color: #a8a095;
		margin-top: 0.9em;
	}
	.editorial-view {
		background: #faf8f4;
		color: #241d17;
	}
	.editorial-view .small-note {
		color: #5c4f47;
	}
	.editorial-body {
		display: grid;
		grid-template-columns: 1.08fr 1fr;
		gap: 2em;
		padding-top: 1.5em;
	}
	.editorial-art {
		position: relative;
		height: 22em;
	}
	.editorial-art h3 {
		font-size: 2.6em;
	}
	.cover {
		position: absolute;
		overflow: hidden;
		border: 0.35em solid #faf8f4;
		box-shadow: 0 0.5em 1.5em #241d1733;
	}
	.cover img {
		width: 100%;
		height: calc(100% - 2.3em);
		object-fit: cover;
	}
	.cover span {
		display: flex;
		align-items: center;
		height: 2.3em;
		padding: 0 0.6em;
		font-size: 0.72em;
		font-weight: 650;
		background: #f2ebdd;
	}
	.main-cover {
		top: 7.2em;
		left: -0.2em;
		width: 18em;
		height: 11.7em;
		transform: rotate(-6deg);
	}
	.secondary-cover {
		right: -0.2em;
		bottom: -0.2em;
		width: 10em;
		height: 10.7em;
		transform: rotate(7deg);
	}
	.editorial-process {
		padding-top: 0.4em;
	}
	.editorial-process .kicker {
		color: #92400e;
		font-size: 0.61em;
	}
	.review-step {
		display: flex;
		align-items: flex-start;
		gap: 0.9em;
		padding: 1.15em 0;
		border-bottom: 1px solid #d6ccb8;
	}
	.review-number {
		font-family: ui-monospace, monospace;
		color: #b45309;
		font-size: 0.75em;
		padding-top: 0.3em;
	}
	.review-step strong {
		font-size: 1.4em;
		letter-spacing: -0.03em;
	}
	.review-step p {
		font-size: 0.65em;
		color: #5c4f47;
		margin-top: 0.25em;
	}
	.evidence-label {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55em;
		margin-top: 1.1em;
	}
	.evidence-label span {
		font-size: 0.59em;
		color: #5c4f47;
		border-bottom: 2px solid #b4530950;
		padding-bottom: 0.25em;
	}
	.operations-view {
		background: #16110d;
	}
	.operations-body {
		display: grid;
		grid-template-columns: 0.7fr 1.4fr;
		gap: 2.4em;
		padding-top: 1.6em;
	}
	.ops-intro {
		border-right: 1px solid #5c4f4750;
	}
	.ops-intro img {
		width: 5.8em;
		height: 5.8em;
		margin-bottom: 1.3em;
	}
	.ops-intro h3 {
		font-size: 2.5em;
	}
	.ops-intro > p {
		font-size: 0.8em;
		line-height: 1.8;
		color: #a8a095;
		margin-top: 1.1em;
	}
	.moderation {
		padding-top: 0.5em;
	}
	.flag-event {
		display: flex;
		align-items: center;
		gap: 1em;
		padding: 1.5em 1em;
		margin-top: 1.2em;
		border: 1px solid #5c4f47;
		background: #241d17;
		border-radius: 0.3em;
	}
	.flag-symbol {
		color: #f59e0b;
		font-size: 2.4em;
	}
	.flag-event b {
		font-size: 1.25em;
		letter-spacing: -0.025em;
	}
	.flag-event p {
		font-size: 0.65em;
		color: #a8a095;
		margin-top: 0.4em;
	}
	.review-line {
		display: flex;
		align-items: center;
		gap: 0.7em;
		margin: 1.5em 0;
		color: #a8a095;
		font-size: 0.7em;
	}
	.review-line i {
		flex: 1;
		height: 1px;
		background: #5c4f47;
	}
	.moderation-branches {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.8em;
	}
	.moderation-branches > div {
		border-top: 2px solid #f59e0b;
		padding: 0.9em 0.3em;
	}
	.moderation-branches b {
		display: block;
		font-size: 1.6em;
		letter-spacing: -0.03em;
	}
	.moderation-branches span {
		color: #a8a095;
		font-size: 0.65em;
	}
	.ops-foot {
		display: flex;
		flex-direction: column;
		gap: 0.45em;
		margin-top: 1.2em;
		font-size: 0.65em;
		color: #d6ccb8;
	}
	.ops-foot span::before {
		content: '✓';
		color: #f59e0b;
		margin-right: 0.65em;
	}
	.brand-view {
		height: 100%;
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
	}
	.brand-identity {
		background: #f2ebdd;
		color: #241d17;
		padding: 1.7em 2.1em;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
	}
	.brand-identity .kicker {
		color: #92400e;
		font-size: 0.58em;
		white-space: nowrap;
	}
	.mask-mark {
		width: 13em;
		height: 13em;
		margin: 1.2em 0 0.6em;
		border-radius: 0.5em;
	}
	.wordmark {
		font-size: 3.8em;
		font-weight: 800;
		letter-spacing: -0.085em;
		line-height: 1;
	}
	.brand-identity p {
		font-size: 0.87em;
		margin-top: 0.9em;
	}
	.swatches {
		display: flex;
		gap: 0.5em;
		margin-top: 1.1em;
	}
	.swatches i {
		width: 1.8em;
		height: 0.5em;
		background: #241d17;
	}
	.swatches i:nth-child(2) {
		background: #faf8f4;
		outline: 1px solid #d6ccb8;
	}
	.swatches i:nth-child(3) {
		background: #f59e0b;
	}
	.swatches i:nth-child(4) {
		background: #0d9488;
	}
	.brand-scenes {
		position: relative;
		min-width: 0;
		background: #0a0807;
	}
	.brand-scenes img {
		width: 100%;
		object-fit: cover;
	}
	.athens {
		height: 50%;
		object-position: 50% 50%;
	}
	.mercy {
		height: 50%;
		object-position: center;
		opacity: 0.87;
	}
	.scene-label {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 3em 1.6em 1.4em;
		background: linear-gradient(transparent, #0a0807 85%);
	}
	.scene-label span {
		display: block;
		color: #a8a095;
		font-size: 0.65em;
		margin-bottom: 0.4em;
	}
	.scene-label strong {
		font-size: 1.55em;
		line-height: 1.1;
		letter-spacing: -0.04em;
	}
	.fallback {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 0.6em;
	}
	.fallback img {
		width: 12em;
	}
	.fallback strong {
		font-size: 3em;
	}
	.fallback span {
		color: #a8a095;
	}
	.compact .small-note,
	.compact .support,
	.compact .profile-note,
	.compact .portrait-label span,
	.compact .type-branch span,
	.compact .evidence-label {
		display: none;
	}
	.compact .topline {
		font-size: 0.8em;
	}
	.compact .site-shot {
		object-position: top;
	}
	.compact .site-caption span {
		font-size: 0.7em;
	}
	.compact .question-side h3 {
		font-size: 3.5em;
	}
	.compact .question-side .kicker {
		max-width: 14em;
	}
	.compact .conversation-strip {
		height: 6.9em;
	}
	.compact .voice-label {
		font-size: 0.76em;
	}
	.compact .discover-view h3 {
		font-size: 3em;
	}
	.compact .discover-sub {
		font-size: 0.95em;
	}
	.compact .emotion-grid {
		margin-top: 1.2em;
	}
	.compact .emotion h4 {
		font-size: 2em;
	}
	.compact .strength {
		font-size: 0.65em;
	}
	.compact .type-branch b {
		font-size: 2em;
	}
	.compact .decision-path {
		margin-top: 1.25em;
	}
	.compact .friend-path {
		margin-top: 0.9em;
	}
	.compact .portrait {
		height: 15.8em;
	}
	.compact .portrait-label strong {
		font-size: 1.1em;
	}
	.compact .portrait-label {
		min-height: 3em;
	}
	.compact .portrait img {
		bottom: 1.6em;
		height: 13em;
	}
	.compact .portrait-type {
		font-size: 0.72em;
	}
	.compact .review-step strong {
		font-size: 1.6em;
	}
	.compact .review-step p {
		font-size: 0.75em;
	}
	.compact .brand-identity .kicker {
		font-size: 0.68em;
	}
	.compact .brand-identity p {
		font-size: 1em;
	}
	.animated .wave i {
		animation: voice 1.6s ease-in-out var(--delay) infinite alternate;
	}
	@keyframes voice {
		from {
			transform: scaleY(0.7);
		}
		to {
			transform: scaleY(1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.animated .wave i {
			animation: none;
		}
	}
</style>

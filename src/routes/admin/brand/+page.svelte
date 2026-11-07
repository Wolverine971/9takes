<!-- src/routes/admin/brand/+page.svelte -->
<!--
  /admin/brand: the 9takes brand kit. One place for DJ to pull logos, lines and templates, and the
  page agents are pointed at (its content also ships as docs/brand/brand-assets.md via
  `pnpm gen:brand-kit`). All content comes from src/lib/brand/; edit there, not here.
-->
<script lang="ts">
	import { ArrowUpRight, Download } from '@lucide/svelte';
	import {
		ACCEPTANCE_TEST,
		ACCOUNTS,
		ALWAYS,
		BIOS,
		BRAND_KIT_UPDATED,
		CATCHPHRASES,
		HIERARCHY,
		INSTAGRAM,
		LOGO_RULES,
		LOGOS,
		NARRATIVE,
		NEVER,
		OPEN_DECISIONS,
		PALETTE,
		RETIRED_LINES,
		SOURCES,
		STATUE_LIBRARY,
		STATUE_PROMPT_TEMPLATE,
		STATUE_RULES,
		TINT_COMMAND,
		TINT_RAMP,
		TOOLS,
		TYPEFACES,
		VOCABULARY,
		VOICE,
		WRITING_RULES,
		X
	} from '$lib/brand/brandKit';
	import {
		BRAND_CARD_PRESETS,
		ogImagePath,
		type BrandCardPreset
	} from '$lib/brand/brandCardPresets';
	import CardStudio from './CardStudio.svelte';
	import CopyButton from './CopyButton.svelte';

	const SECTIONS = [
		{ id: 'agents', label: 'For agents' },
		{ id: 'message', label: 'Message' },
		{ id: 'lines', label: 'Catchphrases' },
		{ id: 'voice', label: 'Voice' },
		{ id: 'logo', label: 'Logo' },
		{ id: 'color', label: 'Color' },
		{ id: 'type', label: 'Type' },
		{ id: 'imagery', label: 'Statues' },
		{ id: 'studio', label: 'Card studio' },
		{ id: 'previews', label: 'Link previews' },
		{ id: 'instagram', label: 'Instagram' },
		{ id: 'x', label: 'X' },
		{ id: 'tools', label: 'Tools' },
		{ id: 'rules', label: 'Rules' },
		{ id: 'open', label: 'Open decisions' }
	];

	const ogPresets = BRAND_CARD_PRESETS.filter((p) => p.kind === 'og');
	const igPresets = BRAND_CARD_PRESETS.filter(
		(p) => p.kind === 'social' && p.format.startsWith('ig')
	);
	const xPresets = BRAND_CARD_PRESETS.filter(
		(p) => p.kind === 'social' && p.format.startsWith('x')
	);

	const AGENT_BRIEF = `Brand reference for 9takes (updated ${BRAND_KIT_UPDATED}).
Read docs/brand/brand-assets.md first: it is generated from src/lib/brand/ and mirrors /admin/brand (the six locked message lines, catchphrases, voice, Cold Light colors and type, logo files, statue library, Instagram and X specs, rules, open decisions).
Words: docs/brand/messaging-hierarchy.md wins on wording. Look: docs/brand/cold-light.md wins on visuals.
Make images with the brand renderer, never with AI image tools:
  pnpm brand:card -- --list
  pnpm brand:card -- --preset ig-formula --out out.png
  pnpm brand:card -- --template statement --format ig-post --kicker "..." --headline "2-5 words" --voice "quiet line" --statue fear --out card.png
Templates: statement, question, person, slide. Formats: og, ig-post, ig-story, x-post, x-header, square.
Hard rules: never generate images (write a statue prompt for DJ instead); never show what a take says before someone answers; no amber or warm light; Anton is uppercase, 2-5 words, never a sentence; about one mint element per view.`;

	let studio: ReturnType<typeof CardStudio> | undefined = $state();

	function openInStudio(preset: BrandCardPreset) {
		studio?.loadPreset(preset);
		document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	const ALL_HIERARCHY = HIERARCHY.map((h) => `${h.level}: ${h.line}`).join('\n');
</script>

<svelte:head>
	<title>Brand kit | 9takes admin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="kit">
	<header class="hero">
		<p class="kicker">9takes brand kit · updated {BRAND_KIT_UPDATED}</p>
		<h1>
			<span class="shout">Cold Light</span><span class="voice">hidden until you answer.</span>
		</h1>
		<p class="lede">
			Everything you need to make something on-brand: the locked lines, the look, the files, and
			templates that render Instagram and X assets with the same engine as the site's link previews.
			Agents read the same content from <code>docs/brand/brand-assets.md</code>.
		</p>
	</header>

	<nav class="toc" aria-label="Brand kit sections">
		{#each SECTIONS as section (section.id)}
			<a href="#{section.id}">{section.label}</a>
		{/each}
	</nav>

	<!-- For agents -->
	<section id="agents" class="panel accent">
		<div class="head">
			<h2>Point an agent here</h2>
			<CopyButton text={AGENT_BRIEF} label="Copy agent brief" />
		</div>
		<p class="muted">
			Paste the brief into any agent prompt (page builds, messaging audits, social batches). It
			points at the generated doc, the render command and the hard rules.
		</p>
		<pre class="brief">{AGENT_BRIEF}</pre>
		<ul class="sources">
			{#each SOURCES as source (source.path)}
				<li><code>{source.path}</code> <span>{source.what}</span></li>
			{/each}
		</ul>
	</section>

	<!-- Message -->
	<section id="message" class="panel">
		<div class="head">
			<h2>The message hierarchy</h2>
			<CopyButton text={ALL_HIERARCHY} label="Copy all six" />
		</div>
		<p class="muted">
			Locked. Six levels of one message, not six slogans. Use one level for one job.
		</p>
		<ol class="hierarchy">
			{#each HIERARCHY as item (item.level)}
				<li>
					<div class="h-top">
						<span class="label">{item.level}</span>
						<CopyButton text={item.line} compact />
					</div>
					<p class="line">{item.line}</p>
					<p class="small">{item.job} <strong>Use in:</strong> {item.useIn}</p>
				</li>
			{/each}
		</ol>
		<div class="two">
			<div>
				<div class="head">
					<h3>The main narrative</h3>
					<CopyButton text={NARRATIVE} compact />
				</div>
				<blockquote>{NARRATIVE}</blockquote>
			</div>
			<div>
				<h3>Is it on-message?</h3>
				<ol class="test">
					{#each ACCEPTANCE_TEST as item (item.q)}
						<li><strong>{item.q}</strong> {item.a}</li>
					{/each}
				</ol>
			</div>
		</div>
	</section>

	<!-- Catchphrases -->
	<section id="lines" class="panel">
		<h2>Catchphrases</h2>
		<p class="muted">Lines already working on the site and in social. Reuse freely.</p>
		<ul class="phrases">
			{#each CATCHPHRASES as phrase (phrase.line)}
				<li>
					<p>{phrase.line}</p>
					<span class="small">{phrase.where}</span>
					<CopyButton text={phrase.line} compact />
				</li>
			{/each}
		</ul>
		<div class="two">
			<div>
				<h3>Supporting vocabulary</h3>
				<dl class="vocab">
					{#each VOCABULARY as item (item.term)}
						<dt>{item.term}</dt>
						<dd>{item.note}</dd>
					{/each}
				</dl>
			</div>
			<div>
				<h3>Retired: don't use</h3>
				<ul class="retired">
					{#each RETIRED_LINES as item (item.line)}
						<li><s>{item.line}</s> <span class="small">{item.why}</span></li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- Voice -->
	<section id="voice" class="panel">
		<h2>Voice</h2>
		<div class="grid-3">
			{#each VOICE as item (item.trait)}
				<article class="card">
					<span class="label">{item.trait}</span>
					<p>{item.means}</p>
					<p class="example">“{item.example}”</p>
				</article>
			{/each}
		</div>
		<h3>Writing rules</h3>
		<ul class="bullets">
			{#each WRITING_RULES as rule (rule)}
				<li>{rule}</li>
			{/each}
		</ul>
	</section>

	<!-- Logo -->
	<section id="logo" class="panel">
		<h2>Logo</h2>
		<div class="logos">
			{#each LOGOS as logo (logo.file)}
				<article class="logo-tile">
					<div class="logo-art"><img src={logo.file} alt={logo.label} loading="lazy" /></div>
					<strong>{logo.label}</strong>
					<span class="small">{logo.size} · {logo.use}</span>
					<a class="link" href={logo.file} download
						><Download size={14} aria-hidden="true" /> Download</a
					>
				</article>
			{/each}
		</div>
		<ul class="bullets">
			{#each LOGO_RULES as rule (rule)}
				<li>{rule}</li>
			{/each}
		</ul>
	</section>

	<!-- Color -->
	<section id="color" class="panel">
		<h2>Color</h2>
		<p class="muted">Mostly dark, a little light. Click a hex to copy it.</p>
		<div class="swatches">
			{#each PALETTE as color (color.name)}
				<article class="swatch">
					<div class="chip-color" style:background={color.hex}></div>
					<div class="swatch-copy">
						<strong>{color.name}</strong>
						<span class="mono">{color.hex} · {color.token}</span>
						<span class="small">{color.use}</span>
					</div>
					<CopyButton text={color.hex} compact label="Copy hex" />
				</article>
			{/each}
		</div>
		<h3>Statue tint ramp</h3>
		<div class="ramp" aria-hidden="true">
			{#each TINT_RAMP as stop (stop.at)}
				<span style:background={stop.hex}></span>
			{/each}
		</div>
		<ul class="ramp-legend">
			{#each TINT_RAMP as stop (stop.at)}
				<li><span class="mono">{stop.at} {stop.hex}</span> {stop.lands}</li>
			{/each}
		</ul>
	</section>

	<!-- Type -->
	<section id="type" class="panel">
		<h2>Type</h2>
		<div class="faces">
			{#each TYPEFACES as face (face.name)}
				<article class="face">
					<p
						class={[
							'specimen',
							face.name === 'Anton' && 'shout-face',
							face.name.startsWith('Playfair') && 'voice-face'
						]}
						style:font-family={face.cssVar}
					>
						{face.sample}
					</p>
					<strong>{face.name}</strong> <span class="mono">{face.token}</span>
					<p class="small">{face.role} {face.rules}</p>
				</article>
			{/each}
		</div>
		<p class="pair">
			<span class="shout">Answer before the crowd</span>
			<span class="voice">What will they think of me?</span>
		</p>
		<p class="small">The pairing: loud line in Anton, quiet line in Playfair italic underneath.</p>
	</section>

	<!-- Statues -->
	<section id="imagery" class="panel">
		<h2>Statue library</h2>
		<p class="muted">
			Already tinted. These feed every card template. Download for Canva or carousels.
		</p>
		<div class="statues">
			{#each STATUE_LIBRARY as statue (statue.id)}
				<a class="statue" href={statue.file} download>
					<img src={statue.file} alt={statue.label} loading="lazy" />
					<span
						><strong>{statue.label}</strong><small
							>{statue.emotion} · <code>{statue.id}</code></small
						></span
					>
				</a>
			{/each}
		</div>
		<div class="two">
			<div>
				<h3>Rules</h3>
				<ul class="bullets">
					{#each STATUE_RULES as rule (rule)}
						<li>{rule}</li>
					{/each}
				</ul>
			</div>
			<div>
				<div class="head">
					<h3>New statue: ChatGPT prompt</h3>
					<CopyButton text={STATUE_PROMPT_TEMPLATE} />
				</div>
				<pre class="brief">{STATUE_PROMPT_TEMPLATE}</pre>
				<p class="small">Then tint it and add it to the library:</p>
				<div class="cmd"><code>{TINT_COMMAND}</code><CopyButton text={TINT_COMMAND} compact /></div>
			</div>
		</div>
	</section>

	<!-- Studio -->
	<section id="studio" class="panel">
		<h2>Card studio</h2>
		<p class="muted">
			Pick a template and size, type, download. Every card follows the rules automatically: Night
			background, one statue tint, Anton + Playfair pairing, at most one mint element.
		</p>
		<CardStudio bind:this={studio} />
	</section>

	<!-- Link previews -->
	<section id="previews" class="panel">
		<h2>Link previews</h2>
		<p class="muted">
			What people see when a 9takes link is shared. Question pages and personality pages get their
			own card made on the fly. Change the copy in <code>src/lib/brand/brandCardPresets.ts</code>,
			then run <code>pnpm gen:brand-og</code>.
		</p>
		<div class="previews">
			{#each ogPresets as preset (preset.id)}
				<article class="preview">
					<img src={ogImagePath(preset.id)} alt="{preset.label} link preview" loading="lazy" />
					<strong>{preset.label}</strong>
					<span class="small">{preset.usedOn}</span>
					<div class="row">
						<a class="link" href={ogImagePath(preset.id)} download>
							<Download size={14} aria-hidden="true" /> JPG
						</a>
						<button type="button" class="link" onclick={() => openInStudio(preset)}
							>Edit a copy</button
						>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- Instagram -->
	<section id="instagram" class="panel">
		<h2>Instagram</h2>
		{@render accounts('Instagram')}
		<div class="two">
			<div>
				<div class="head">
					<h3>Bio</h3>
					<CopyButton text={BIOS.instagram.bio} />
				</div>
				<p class="small">{BIOS.instagram.status}</p>
				<p class="bio"><strong>{BIOS.instagram.name}</strong><br />{BIOS.instagram.bio}</p>
				<p class="small">{BIOS.instagram.link}</p>
			</div>
			<div>
				<h3>Sizes</h3>
				{@render specs(INSTAGRAM.specs)}
			</div>
		</div>
		<h3>Templates</h3>
		{@render presetGrid(igPresets)}
		<div class="two">
			<div>
				<h3>Formats</h3>
				<dl class="vocab">
					{#each INSTAGRAM.formats as item (item.name)}
						<dt>{item.name}</dt>
						<dd>{item.detail}</dd>
					{/each}
				</dl>
			</div>
			<div>
				<h3>Rules</h3>
				<ul class="bullets">
					{#each INSTAGRAM.rules as rule (rule)}
						<li>{rule}</li>
					{/each}
				</ul>
				<p class="small">Commands: {INSTAGRAM.commands.join(' · ')}</p>
			</div>
		</div>
	</section>

	<!-- X -->
	<section id="x" class="panel">
		<h2>X</h2>
		{@render accounts('X')}
		<div class="two">
			<div>
				<div class="head">
					<h3>Bio (proposed)</h3>
					<CopyButton text={BIOS.x.bio} />
				</div>
				<p class="small">{BIOS.x.status}</p>
				<p class="bio">{BIOS.x.bio}</p>
				<p class="small"><strong>Live now:</strong> {BIOS.x.live}</p>
			</div>
			<div>
				<h3>Sizes</h3>
				{@render specs(X.specs)}
			</div>
		</div>
		<h3>Templates</h3>
		{@render presetGrid(xPresets)}
		<div class="two">
			<div>
				<h3>Post formats</h3>
				<ul class="bullets">
					{#each X.formats as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
			<div>
				<h3>Rules</h3>
				<ul class="bullets">
					{#each X.rules as rule (rule)}
						<li>{rule}</li>
					{/each}
				</ul>
				<p class="small">Commands: {X.commands.join(' · ')}</p>
			</div>
		</div>
	</section>

	<!-- Tools -->
	<section id="tools" class="panel">
		<h2>Tools</h2>
		<ul class="tools">
			{#each TOOLS as tool (tool.name)}
				<li>
					<span class={['status', tool.status === 'current' ? 'ok' : 'old']}>{tool.status}</span>
					<strong>{tool.name}</strong>
					<code>{tool.where}</code>
					<span class="small">{tool.note}</span>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Rules -->
	<section id="rules" class="panel">
		<h2>Rules</h2>
		<div class="two">
			<div>
				<h3>Always</h3>
				<ul class="bullets">
					{#each ALWAYS as rule (rule)}
						<li>{rule}</li>
					{/each}
				</ul>
			</div>
			<div>
				<h3>Never</h3>
				<ul class="bullets never">
					{#each NEVER as rule (rule)}
						<li>{rule}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- Open decisions -->
	<section id="open" class="panel">
		<h2>Open decisions</h2>
		<p class="muted">
			Places the docs disagree. Decide, then update <code>src/lib/brand/brandKit.ts</code>.
		</p>
		<dl class="vocab">
			{#each OPEN_DECISIONS as item (item.topic)}
				<dt>{item.topic}</dt>
				<dd>{item.detail}</dd>
			{/each}
		</dl>
	</section>
</div>

{#snippet accounts(platform: string)}
	<ul class="accounts">
		{#each ACCOUNTS.filter((a) => a.platform === platform) as account (account.handle)}
			<li>
				<a href={account.url} target="_blank" rel="noreferrer">
					{account.handle}
					<ArrowUpRight size={14} aria-hidden="true" />
				</a>
				<span class="small">{account.role}</span>
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet specs(rows: readonly { what: string; size: string; note: string }[])}
	<table class="specs">
		<tbody>
			{#each rows as row (row.what)}
				<tr>
					<th scope="row">{row.what}</th>
					<td class="mono">{row.size}</td>
					<td class="small">{row.note}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/snippet}

{#snippet presetGrid(presets: BrandCardPreset[])}
	<div class="preset-grid">
		{#each presets as preset (preset.id)}
			<button type="button" class="preset" onclick={() => openInStudio(preset)}>
				<strong>{preset.label}</strong>
				<span class="small">{preset.usedOn}</span>
				<span class="link">Open in studio →</span>
			</button>
		{/each}
	</div>
{/snippet}

<style>
	.kit {
		display: grid;
		gap: 1rem;
		max-width: 76rem;
		margin: 0 auto;
		color: var(--text);
		font-family: var(--font-talk);
	}

	.hero {
		padding: 1.75rem 1.5rem;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background:
			radial-gradient(
				circle at 0% 0%,
				color-mix(in srgb, var(--accent) 28%, transparent),
				transparent 55%
			),
			var(--surface);
	}

	.kicker,
	.label {
		color: var(--highlight);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.kicker {
		margin: 0 0 0.6rem;
	}

	h1 {
		display: grid;
		margin: 0;
		line-height: 1;
	}

	.shout {
		font-family: var(--font-shout);
		font-size: clamp(2.6rem, 7vw, 4.5rem);
		font-weight: 400;
		letter-spacing: 0.01em;
		text-transform: uppercase;
	}

	.voice {
		color: var(--highlight);
		font-family: var(--font-voice);
		font-size: clamp(1.4rem, 3.4vw, 2.2rem);
		font-style: italic;
		font-weight: 500;
	}

	.lede {
		max-width: 46rem;
		margin: 1rem 0 0;
		color: var(--text-muted);
		font-size: 1.02rem;
		line-height: 1.55;
	}

	.toc {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		gap: 0.4rem;
		overflow-x: auto;
		padding: 0.6rem 0;
		background: var(--bg);
		scrollbar-width: none;
	}

	.toc a {
		flex: none;
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		color: var(--text-muted);
		font-size: 0.82rem;
		font-weight: 600;
		text-decoration: none;
	}

	.toc a:hover,
	.toc a:focus-visible {
		border-color: var(--highlight);
		color: var(--text);
	}

	.panel {
		display: grid;
		gap: 0.9rem;
		padding: 1.4rem 1.5rem;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background: var(--surface);
		scroll-margin-top: 3.5rem;
	}

	.panel.accent {
		border-color: color-mix(in srgb, var(--highlight) 40%, var(--rule));
	}

	h2 {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 700;
	}

	h3 {
		margin: 0.3rem 0 0.5rem;
		color: var(--text);
		font-size: 1rem;
		font-weight: 700;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.muted {
		margin: 0;
		color: var(--text-muted);
	}

	.small {
		color: var(--text-faint);
		font-size: 0.82rem;
		line-height: 1.45;
	}

	.mono,
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.8rem;
	}

	code {
		color: var(--highlight);
	}

	.brief {
		margin: 0;
		overflow-x: auto;
		padding: 0.9rem 1rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--bg);
		color: var(--text-muted);
		font-size: 0.8rem;
		line-height: 1.55;
		white-space: pre-wrap;
	}

	.sources {
		display: grid;
		gap: 0.3rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.sources span {
		color: var(--text-faint);
		font-size: 0.82rem;
	}

	.hierarchy {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.hierarchy li,
	.card,
	.logo-tile,
	.swatch,
	.face,
	.preview,
	.preset {
		padding: 1rem;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background: var(--surface-raised);
	}

	.h-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.line {
		margin: 0.4rem 0;
		font-size: 1.15rem;
		font-weight: 700;
		line-height: 1.3;
	}

	.hierarchy .small {
		margin: 0;
	}

	.two {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem;
	}

	blockquote {
		margin: 0;
		padding-left: 1rem;
		border-left: 2px solid var(--highlight);
		color: var(--text-muted);
		font-family: var(--font-voice);
		font-size: 1.05rem;
		font-style: italic;
		line-height: 1.6;
	}

	.test,
	.bullets {
		display: grid;
		gap: 0.45rem;
		margin: 0;
		padding-left: 1.2rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	.test strong {
		display: block;
		color: var(--text);
	}

	.never li::marker {
		color: var(--highlight);
	}

	.phrases {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.phrases li {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.15rem 0.75rem;
		padding: 0.7rem 0.85rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
	}

	.phrases p {
		grid-column: 1;
		margin: 0;
		font-weight: 600;
	}

	.phrases .small {
		grid-column: 1;
	}

	.phrases li > :global(button) {
		grid-column: 2;
		grid-row: 1 / span 2;
	}

	.vocab {
		display: grid;
		grid-template-columns: max-content minmax(0, 1fr);
		gap: 0.45rem 1rem;
		margin: 0;
	}

	.vocab dt {
		font-weight: 700;
	}

	.vocab dd {
		margin: 0;
		color: var(--text-muted);
	}

	.retired {
		display: grid;
		gap: 0.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
		color: var(--text-muted);
	}

	.grid-3 {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
		gap: 0.75rem;
	}

	.card p {
		margin: 0.4rem 0 0;
		color: var(--text-muted);
	}

	.card .example {
		color: var(--text);
		font-style: italic;
	}

	.logos {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
		gap: 0.75rem;
	}

	.logo-tile {
		display: grid;
		gap: 0.35rem;
		align-content: start;
	}

	.logo-art {
		display: grid;
		place-items: center;
		aspect-ratio: 1;
		border-radius: 10px;
		background: var(--bg);
	}

	.logo-art img {
		width: 70%;
		height: auto;
	}

	.link {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0;
		border: 0;
		background: none;
		color: var(--highlight);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
		gap: 0.6rem;
	}

	.swatch {
		display: grid;
		grid-template-columns: 3rem minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
	}

	.chip-color {
		width: 3rem;
		height: 3rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
	}

	.swatch-copy {
		display: grid;
		gap: 0.1rem;
	}

	.swatch-copy .mono {
		color: var(--text-muted);
	}

	.ramp {
		display: flex;
		height: 2.5rem;
		overflow: hidden;
		border-radius: 10px;
	}

	.ramp span {
		flex: 1;
	}

	.ramp-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
		color: var(--text-faint);
		font-size: 0.82rem;
	}

	.faces {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 0.75rem;
	}

	.specimen {
		margin: 0 0 0.6rem;
		font-size: 1.6rem;
		line-height: 1.15;
	}

	.shout-face {
		font-size: 2.2rem;
		text-transform: uppercase;
	}

	.voice-face {
		color: var(--highlight);
		font-style: italic;
	}

	.face .small {
		margin: 0.4rem 0 0;
	}

	.pair {
		display: grid;
		margin: 0.5rem 0 0;
		line-height: 1.05;
	}

	.statues {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 10rem), 1fr));
		gap: 0.75rem;
	}

	.statue {
		display: grid;
		overflow: hidden;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background: var(--bg);
		color: inherit;
		text-decoration: none;
	}

	.statue img {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
	}

	.statue span {
		display: grid;
		gap: 0.15rem;
		padding: 0.6rem 0.7rem;
		font-size: 0.85rem;
	}

	.statue small {
		color: var(--text-faint);
	}

	.statue:hover,
	.statue:focus-visible {
		border-color: var(--highlight);
	}

	.cmd {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		overflow-x: auto;
	}

	.previews {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 0.75rem;
	}

	.preview {
		display: grid;
		gap: 0.35rem;
		align-content: start;
	}

	.preview img {
		width: 100%;
		aspect-ratio: 1200 / 630;
		border-radius: 10px;
	}

	.row {
		display: flex;
		gap: 1rem;
	}

	.accounts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.accounts li {
		display: grid;
	}

	.accounts a {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--highlight);
		font-weight: 700;
	}

	.bio {
		margin: 0.4rem 0;
		padding: 0.8rem 1rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--bg);
		white-space: pre-line;
	}

	.specs {
		width: 100%;
		border-collapse: collapse;
	}

	.specs th,
	.specs td {
		padding: 0.45rem 0.5rem 0.45rem 0;
		border-bottom: 1px solid var(--rule);
		text-align: left;
		vertical-align: top;
	}

	.specs th {
		font-weight: 600;
	}

	.preset-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
		gap: 0.6rem;
	}

	.preset {
		display: grid;
		gap: 0.3rem;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.preset:hover,
	.preset:focus-visible {
		border-color: var(--highlight);
	}

	.tools {
		display: grid;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tools li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--rule);
	}

	.status {
		padding: 0.1rem 0.5rem;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.status.ok {
		background: color-mix(in srgb, var(--accent) 30%, transparent);
		color: var(--highlight);
	}

	.status.old {
		background: var(--surface-raised);
		color: var(--text-faint);
	}

	@media (max-width: 760px) {
		.panel {
			padding: 1.1rem 1rem;
		}

		.two {
			grid-template-columns: minmax(0, 1fr);
		}

		.vocab {
			grid-template-columns: minmax(0, 1fr);
		}

		.vocab dd {
			margin-bottom: 0.4rem;
		}
	}
</style>

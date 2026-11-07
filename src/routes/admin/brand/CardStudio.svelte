<!-- src/routes/admin/brand/CardStudio.svelte -->
<!--
  Live Cold Light card editor. Renders through /admin/brand/card, which uses the same renderer as
  the site's link previews and `pnpm brand:card`, so a download here matches what agents make.
-->
<script lang="ts">
	import { Download, LoaderCircle } from '@lucide/svelte';
	import { CARD_FORMATS, STATUES, type CardFormat } from '$lib/brand/brandTokens';
	import type { BrandCardPreset } from '$lib/brand/brandCardPresets';
	import CopyButton from './CopyButton.svelte';

	type Template = 'statement' | 'question' | 'person' | 'slide';

	interface Fields {
		kicker: string;
		headline: string;
		voice: string;
		art: 'statue' | 'masks' | 'none';
		statue: string;
		question: string;
		action: string;
		name: string;
		type: string;
		portrait: string;
		index: string;
		body: string;
	}

	const EMPTY: Fields = {
		kicker: '',
		headline: '',
		voice: '',
		art: 'statue',
		statue: 'whisper',
		question: '',
		action: '',
		name: '',
		type: '',
		portrait: '',
		index: '',
		body: ''
	};

	const TEMPLATES: { id: Template; label: string; hint: string }[] = [
		{
			id: 'statement',
			label: 'Statement',
			hint: 'Loud Anton line + quiet italic line, statue or masks'
		},
		{
			id: 'question',
			label: 'Question',
			hint: 'A real question, nine closed takes, one mint action'
		},
		{ id: 'person', label: 'Person', hint: 'Portrait from /types, name, type' },
		{
			id: 'slide',
			label: 'Slide',
			hint: 'Carousel body slide: optional headline, body, italic line'
		}
	];

	const FIELD_KEYS: Record<Template, (keyof Fields)[]> = {
		statement: ['kicker', 'headline', 'voice', 'art', 'statue'],
		question: ['question', 'kicker', 'action'],
		person: ['name', 'type', 'portrait', 'kicker', 'voice'],
		slide: ['index', 'headline', 'body', 'voice']
	};

	let template = $state<Template>('statement');
	let format = $state<CardFormat>('ig-post');
	let fields = $state<Fields>({
		...EMPTY,
		kicker: 'The core formula',
		headline: 'Honesty + Curiosity = Clarity',
		voice: 'Answer first. Then see why everyone else saw it differently.',
		statue: 'fear'
	});
	let slug = $state('9takes-card');

	function params(): URLSearchParams {
		// Built fresh for each URL; never stored in state.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const search = new URLSearchParams({ template, format });
		for (const key of FIELD_KEYS[template]) {
			if (key === 'statue' && fields.art !== 'statue') continue;
			const value = String(fields[key] ?? '').trim();
			if (value) search.set(key, value);
		}
		return search;
	}

	let previewUrl = $state(`/admin/brand/card?${params().toString()}`);
	let loading = $state(true);
	let failed = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function scheduleRender() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const next = `/admin/brand/card?${params().toString()}`;
			if (next !== previewUrl) {
				loading = true;
				failed = false;
				previewUrl = next;
			}
		}, 350);
	}

	let downloadUrl = $derived(
		`${previewUrl}&download=1&name=${encodeURIComponent(`${slug}-${format}`)}`
	);
	let size = $derived(CARD_FORMATS[format]);
	let headlineWords = $derived(fields.headline.trim().split(/\s+/).filter(Boolean).length);

	const shellQuote = (value: string) => `"${value.replace(/(["\\$`])/g, '\\$1')}"`;
	let cliCommand = $derived.by(() => {
		const parts = ['pnpm brand:card --'];
		for (const [key, value] of new URLSearchParams(previewUrl.split('?')[1] ?? '')) {
			parts.push(`--${key} ${shellQuote(value)}`);
		}
		parts.push(`--out ${slug}-${format}.png`);
		return parts.join(' ');
	});

	/** Called by the page when a preset card is picked. */
	export function loadPreset(preset: BrandCardPreset) {
		const card = preset.card as Record<string, unknown>;
		template = preset.card.template;
		format = preset.format;
		const next: Fields = { ...EMPTY };
		for (const key of Object.keys(EMPTY) as (keyof Fields)[]) {
			if (card[key] !== undefined && card[key] !== null) {
				(next as unknown as Record<string, string>)[key] = String(card[key]);
			}
		}
		if (preset.card.template === 'statement') {
			next.art = preset.card.art ?? (preset.card.statue ? 'statue' : 'masks');
		}
		fields = next;
		slug = preset.id;
		scheduleRender();
	}
</script>

<div class="studio">
	<form
		class="controls"
		oninput={scheduleRender}
		onchange={scheduleRender}
		onsubmit={(e) => e.preventDefault()}
	>
		<fieldset class="chips">
			<legend>Template</legend>
			{#each TEMPLATES as option (option.id)}
				<label class={['chip', template === option.id && 'on']} title={option.hint}>
					<input type="radio" name="template" value={option.id} bind:group={template} />
					{option.label}
				</label>
			{/each}
		</fieldset>

		<label class="field">
			<span>Format</span>
			<select bind:value={format}>
				{#each Object.entries(CARD_FORMATS) as [id, f] (id)}
					<option value={id}>{f.label} · {f.width}×{f.height}</option>
				{/each}
			</select>
		</label>

		{#if template === 'statement'}
			<label class="field">
				<span>Kicker <small>small caps, optional</small></span>
				<input bind:value={fields.kicker} maxlength="60" />
			</label>
			<label class="field">
				<span>Loud line <small>Anton, 2 to 5 words, never a sentence</small></span>
				<input bind:value={fields.headline} maxlength="80" />
				{#if headlineWords > 5}
					<em class="warn">That's {headlineWords} words. Move the rest to the quiet line.</em>
				{/if}
			</label>
			<label class="field">
				<span>Quiet line <small>Playfair italic, lavender</small></span>
				<input bind:value={fields.voice} maxlength="160" />
			</label>
			<label class="field">
				<span>Art</span>
				<select bind:value={fields.art}>
					<option value="statue">Statue</option>
					<option value="masks">Nine masks</option>
					<option value="none">None</option>
				</select>
			</label>
			{#if fields.art === 'statue'}
				<label class="field">
					<span>Statue</span>
					<select bind:value={fields.statue}>
						{#each Object.entries(STATUES) as [id, statue] (id)}
							<option value={id}>{statue.label}</option>
						{/each}
					</select>
				</label>
			{/if}
		{:else if template === 'question'}
			<label class="field">
				<span>Question <small>question text only, never a take</small></span>
				<textarea bind:value={fields.question} rows="4" maxlength="400"></textarea>
			</label>
			<label class="field">
				<span>Kicker <small>default: One question, nine perspectives</small></span>
				<input bind:value={fields.kicker} maxlength="60" />
			</label>
			<label class="field">
				<span>Mint action <small>default: Answer before the crowd</small></span>
				<input bind:value={fields.action} maxlength="40" />
			</label>
		{:else if template === 'person'}
			<label class="field">
				<span>Name</span>
				<input bind:value={fields.name} maxlength="60" />
			</label>
			<label class="field">
				<span>Type</span>
				<select bind:value={fields.type}>
					<option value="">None</option>
					{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n (n)}
						<option value={String(n)}>Type {n}</option>
					{/each}
				</select>
			</label>
			<label class="field">
				<span>Portrait <small>/types/9s/Adam-Sandler.webp</small></span>
				<input
					bind:value={fields.portrait}
					maxlength="120"
					placeholder="/types/9s/Adam-Sandler.webp"
				/>
			</label>
			<label class="field">
				<span>Quiet line <small>default: See the emotions behind every take.</small></span>
				<input bind:value={fields.voice} maxlength="160" />
			</label>
		{:else}
			<label class="field">
				<span>Slide number <small>e.g. 02 / 07</small></span>
				<input bind:value={fields.index} maxlength="12" />
			</label>
			<label class="field">
				<span>Loud line <small>optional</small></span>
				<input bind:value={fields.headline} maxlength="80" />
			</label>
			<label class="field">
				<span>Body</span>
				<textarea bind:value={fields.body} rows="5" maxlength="600"></textarea>
			</label>
			<label class="field">
				<span>Quiet line <small>optional</small></span>
				<input bind:value={fields.voice} maxlength="160" />
			</label>
		{/if}

		<label class="field">
			<span>File name</span>
			<input bind:value={slug} maxlength="60" />
		</label>
	</form>

	<div class="output">
		<div class="frame" style:aspect-ratio="{size.width} / {size.height}">
			<img
				src={previewUrl}
				alt="Card preview"
				onload={() => (loading = false)}
				onerror={() => {
					loading = false;
					failed = true;
				}}
			/>
			{#if loading}
				<span class="busy"><LoaderCircle size={22} aria-hidden="true" /> Rendering</span>
			{/if}
			{#if failed}
				<span class="busy">Couldn't render this card. Check the portrait path.</span>
			{/if}
		</div>
		<div class="actions">
			<a class="download" href={downloadUrl} download>
				<Download size={16} aria-hidden="true" /> Download PNG ({size.width}×{size.height})
			</a>
			<CopyButton text={cliCommand} label="Copy agent command" />
		</div>
		<code class="cli">{cliCommand}</code>
	</div>
</div>

<style>
	.studio {
		display: grid;
		grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
		gap: 1.25rem;
		align-items: start;
	}

	.controls {
		display: grid;
		gap: 0.85rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.chips legend,
	.field > span {
		margin-bottom: 0.35rem;
		color: var(--text-faint);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.field > span small {
		margin-left: 0.35rem;
		color: var(--text-faint);
		font-size: 0.72rem;
		font-weight: 400;
		letter-spacing: 0;
		text-transform: none;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		min-height: 2.25rem;
		padding: 0.35rem 0.8rem;
		border: 1px solid var(--rule);
		border-radius: 999px;
		color: var(--text-muted);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}

	.chip input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.chip:focus-within {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}

	.chip.on {
		border-color: var(--highlight);
		background: color-mix(in srgb, var(--accent) 22%, transparent);
		color: var(--text);
	}

	.field {
		display: grid;
	}

	.field input,
	.field select,
	.field textarea {
		width: 100%;
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--surface-raised);
		color: var(--text);
		font-family: var(--font-talk);
		font-size: 0.95rem;
	}

	.field textarea {
		resize: vertical;
	}

	.field input:focus-visible,
	.field select:focus-visible,
	.field textarea:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 1px;
	}

	.warn {
		margin-top: 0.3rem;
		color: var(--highlight);
		font-size: 0.8rem;
	}

	.output {
		display: grid;
		gap: 0.75rem;
		min-width: 0;
		position: sticky;
		top: 1rem;
	}

	.frame {
		position: relative;
		width: 100%;
		max-height: 78vh;
		margin: 0 auto;
		overflow: hidden;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background: var(--bg);
	}

	.frame img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.busy {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.65rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg) 80%, transparent);
		color: var(--text-muted);
		font-size: 0.8rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-items: center;
	}

	.download {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		min-height: 2.75rem;
		padding: 0.55rem 1rem;
		border-radius: 10px;
		background: var(--action);
		color: var(--text-on-action);
		font-weight: 700;
		text-decoration: none;
	}

	.download:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}

	.cli {
		display: block;
		overflow-x: auto;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--rule);
		border-radius: 10px;
		background: var(--surface);
		color: var(--text-faint);
		font-size: 0.75rem;
		white-space: nowrap;
	}

	@media (max-width: 860px) {
		.studio {
			grid-template-columns: minmax(0, 1fr);
		}

		.output {
			position: static;
			order: -1;
		}
	}
</style>

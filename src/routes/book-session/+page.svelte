<!-- src/routes/book-session/+page.svelte -->
<!--
  "Talk it through" (DJ, 2026-10-05): the page is about the visitor's situation,
  not about DJ. It opens on situation doors (talkSituations.ts). Tapping one opens
  the note box with a question written for it and an example reply. DJ's bio
  moves down to "Who reads these". ?about=<id> opens a door directly, so other
  pages can link straight to one.
  The note flow is unchanged: the note saves immediately, then an optional step
  adds an email for a private reply and the free 1-on-1 session request.
  See docs/product/2026-09-23-therapy-on-steroids.md.
-->
<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button, Field, Input, Textarea } from '$lib/components/atoms';
	import ExperimentalTherapyCard from '$lib/components/blog/ExperimentalTherapyCard.svelte';
	import VoiceRecorder, {
		type RecordedAudio
	} from '$lib/components/molecules/VoiceRecorder.svelte';
	import {
		TALK_SITUATIONS,
		TALK_SITUATIONS_EXPERIMENT,
		talkSituationById
	} from '$lib/utils/talkSituations';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	type Stage = 'note' | 'details' | 'done';
	type TalkFormState = {
		noteSaved?: boolean;
		noteId?: string;
		detailsToken?: string;
		noteMessage?: string;
		detailsMessage?: string;
		detailsSaved?: boolean;
		replyExpected?: boolean;
		wantsSession?: boolean;
		email?: string | null;
		name?: string;
	};
	type VoiceNote = RecordedAudio & { url: string };

	const NOTE_MAX_CHARS = 5000;
	const MAX_RECORDING_SECONDS = 180;
	const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

	let body = $state('');
	let voiceNote = $state<VoiceNote | null>(null);
	let voiceBusy = $state(false);
	let sending = $state(false);
	let saving = $state(false);
	let localError = $state('');
	let localStage = $state<Stage | null>(null);
	let wantsSession = $state(false);
	let selectedId = $state<string | null>(
		talkSituationById(page.url.searchParams.get('about'))?.id ?? null
	);
	let doorsEl = $state<HTMLElement | null>(null);
	let cardEl = $state<HTMLElement | null>(null);
	let formLoadTime = 0;
	const reportedDoors = new Set<string>();

	const formState = $derived((form ?? {}) as TalkFormState);
	const stage = $derived<Stage>(
		localStage ??
			(formState.detailsSaved
				? 'done'
				: formState.noteSaved || formState.detailsMessage
					? 'details'
					: 'note')
	);
	const selected = $derived(talkSituationById(selectedId));
	const canSend = $derived(!voiceBusy && !sending && (body.trim().length > 0 || !!voiceNote));
	const noteError = $derived(localError || formState.noteMessage || '');
	const replyExpected = $derived(localStage === 'done' ? false : !!formState.replyExpected);

	const title = 'Talk It Through: Leave a Note or a Voice Note | 9takes';
	const metaDescription =
		'Stuck on someone you can’t read, a fight you keep having, or a pattern you can’t break? Type it or record a voice note. Free, private, and you can stay anonymous.';

	const faqs = [
		{
			question: 'Who reads my note?',
			answer:
				'Only me. Voice notes are stored privately and never posted anywhere. No ads, and I will never sell your data.'
		},
		{
			question: 'Do I have to leave my email?',
			answer:
				'No. Anonymous is fine. Without an email I can’t write back, but I still read every note.'
		},
		{
			question: 'Is “experimental therapy” real therapy?',
			answer:
				'No. It’s coaching, not clinical therapy, diagnosis, or crisis support. “Experimental” is the honest part: I’m still shaping how I run these. If you need mental health treatment, please reach out to a licensed professional.'
		}
	];

	function audioExtension(mimeType: string): string {
		const base = mimeType.split(';')[0]?.trim();
		const extensions: Record<string, string> = {
			'audio/webm': 'webm',
			'audio/ogg': 'ogg',
			'audio/mp4': 'm4a',
			'audio/mpeg': 'mp3',
			'audio/wav': 'wav'
		};
		return extensions[base] ?? 'webm';
	}

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
	}

	function scrollBehavior(): ScrollBehavior {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
	}

	/** Once per door per visit: which situations people pick (admin notes page). */
	function reportDoor(id: string) {
		if (reportedDoors.has(id)) return;
		reportedDoors.add(id);
		void fetch('/api/cta-event', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			keepalive: true,
			body: JSON.stringify({
				experiment: TALK_SITUATIONS_EXPERIMENT,
				variant: id,
				event: 'opened',
				surface: 'book_session',
				placement: 'door',
				sourcePath: window.location.pathname
			})
		}).catch(() => {});
	}

	async function openDoor(id: string) {
		const firstOpen = !selectedId;
		selectedId = id;
		localError = '';
		reportDoor(id);
		const url = new URL(page.url);
		url.searchParams.set('about', id);
		replaceState(url, {});
		// Switching doors keeps the reader where they are; the first one brings the box into view.
		if (!firstOpen) return;
		await tick();
		cardEl?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
	}

	function appendTranscript(transcript: string) {
		const current = body.trim();
		body = current ? `${current}\n\n${transcript}` : transcript;
	}

	function attachVoice(audio: RecordedAudio) {
		clearVoice();
		if (audio.blob.size > MAX_AUDIO_BYTES) {
			localError = 'That recording is too large to send. Try a shorter one.';
			return;
		}
		voiceNote = { ...audio, url: URL.createObjectURL(audio.blob) };
	}

	function clearVoice() {
		if (voiceNote) URL.revokeObjectURL(voiceNote.url);
		voiceNote = null;
	}

	async function leaveAnother() {
		body = '';
		clearVoice();
		wantsSession = false;
		localError = '';
		selectedId = null;
		formLoadTime = Date.now();
		localStage = 'note';
		await tick();
		doorsEl?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
	}

	onMount(() => {
		formLoadTime = Date.now();
	});

	onDestroy(() => {
		if (voiceNote) URL.revokeObjectURL(voiceNote.url);
	});
</script>

<SEOHead
	{title}
	description={metaDescription}
	canonical="https://9takes.com/book-session"
	twitterCardType="summary_large_image"
	ogImage="https://9takes.com/blogs/greek-statue-enneagram-coaching.webp"
	twitterCreator="@djwayne3"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'ContactPage',
		name: 'Talk it through',
		description: metaDescription,
		url: 'https://9takes.com/book-session',
		mainEntity: {
			'@type': 'Person',
			name: 'DJ Wayne',
			jobTitle: 'Founder, 9takes',
			url: 'https://9takes.com/about'
		}
	}}
/>

<div class="talk-page">
	<div class="talk-container">
		<header class="talk-intro">
			<p class="talk-eyebrow">Talk it through</p>
			<h1 class="talk-title">What are you trying to figure out?</h1>
			<p class="talk-lede">
				Pick the closest one, then type it or say it out loud. It’s free and private, and you can
				stay anonymous.
			</p>
			<p class="talk-credential">
				{#if data.publicFigureCount}
					I’ve mapped the patterns behind
					<a href={resolve('/personality-analysis')}>{data.publicFigureCount} public figures</a>
					on 9takes.
				{/if}
				I read every note myself.
			</p>
		</header>

		{#if stage === 'note'}
			<section class="talk-doors" bind:this={doorsEl} aria-label="What’s going on">
				<ul>
					{#each TALK_SITUATIONS as situation (situation.id)}
						<li>
							<button
								type="button"
								class="talk-door"
								aria-pressed={selectedId === situation.id}
								aria-controls="talk-card"
								onclick={() => openDoor(situation.id)}
							>
								<span class="talk-door__label">{situation.label}</span>
								<span class="talk-door__hint">{situation.hint}</span>
							</button>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if stage !== 'note' || selected}
			<section
				id="talk-card"
				class="talk-card"
				bind:this={cardEl}
				aria-live="polite"
				aria-labelledby="talk-card-title"
			>
				{#if stage === 'note' && selected}
					<div class="talk-prompt">
						<p class="talk-prompt__picked">{selected.label}</p>
						<h2 id="talk-card-title">{selected.prompt}</h2>
						<p>{selected.helper}</p>
					</div>

					<form
						method="POST"
						action="?/note"
						class="talk-form"
						use:enhance={({ formData, cancel }) => {
							if (!canSend) {
								cancel();
								return;
							}
							sending = true;
							localError = '';
							formData.set('_timeToken', String(Date.now() - formLoadTime));
							if (voiceNote) {
								formData.set(
									'audio',
									new File([voiceNote.blob], `note.${audioExtension(voiceNote.mimeType)}`, {
										type: voiceNote.mimeType
									})
								);
								formData.set('audioSeconds', String(voiceNote.durationSeconds));
							}
							return async ({ result }) => {
								sending = false;
								if (result.type === 'success') {
									body = '';
									clearVoice();
								}
								if (result.type === 'success' || result.type === 'failure') {
									localStage = null;
									await applyAction(result);
								} else {
									localError = 'Something went wrong. Please try again.';
								}
							};
						}}
					>
						<div class="honeypot" aria-hidden="true">
							<label for="talk-form-extra">Leave blank</label>
							<input
								type="text"
								id="talk-form-extra"
								name="form_extra"
								tabindex="-1"
								autocomplete="new-password"
							/>
						</div>
						<input type="hidden" name="situation" value={selected.id} />

						<Field for="talk-body" label="Your note">
							<Textarea
								id="talk-body"
								name="body"
								bind:value={body}
								rows={6}
								maxlength={NOTE_MAX_CHARS}
								placeholder={selected.placeholder}
								disabled={sending}
							/>
						</Field>

						<div class="talk-voice">
							{#if voiceNote && !voiceBusy}
								<div class="talk-voice__attached">
									<div class="talk-voice__meta">
										<span class="talk-voice__badge">Voice note</span>
										<span>{formatDuration(voiceNote.durationSeconds)}</span>
										<button type="button" class="talk-link-button" onclick={clearVoice}>
											Remove
										</button>
									</div>
									<audio controls preload="metadata" src={voiceNote.url}></audio>
									<p class="talk-fine">
										I get the recording and the transcript above. Edit the text if it misheard you.
									</p>
								</div>
							{:else}
								<VoiceRecorder
									id="talk-voice"
									label="Record a voice note"
									hint="Up to 3 minutes. You’ll see the transcript."
									maxSeconds={MAX_RECORDING_SECONDS}
									disabled={sending}
									ontranscript={appendTranscript}
									onaudio={attachVoice}
									onbusychange={(busy) => (voiceBusy = busy)}
								/>
							{/if}
						</div>

						{#if noteError}
							<p class="talk-error" role="alert">{noteError}</p>
						{/if}

						<Button type="submit" size="lg" fullWidth loading={sending} disabled={!canSend}>
							Send
						</Button>
						<p class="talk-fine talk-fine--center">
							Anonymous is fine. If you want a reply, you can add your email on the next step.
						</p>
						{#if selected.showCrisisLine}
							<p class="talk-fine talk-fine--center">
								In crisis right now? Call or text <a href="tel:988">988</a> (US) or your local emergency
								number.
							</p>
						{/if}
					</form>

					<figure class="talk-example">
						<figcaption>Example reply</figcaption>
						<blockquote>{selected.exampleReply}</blockquote>
					</figure>
				{:else if stage === 'details'}
					<form
						method="POST"
						action="?/details"
						class="talk-form"
						use:enhance={() => {
							saving = true;
							return async ({ result }) => {
								saving = false;
								if (result.type === 'success' || result.type === 'failure') {
									localStage = null;
									await applyAction(result);
								} else {
									localError = 'Something went wrong. Please try again.';
								}
							};
						}}
					>
						<div class="talk-step-head">
							<h2 id="talk-card-title">Got it. I read every one.</h2>
							<p>
								Want a reply? Leave your email and I’ll write back, sometimes with a voice note of
								my own. It stays between us.
							</p>
						</div>

						<input type="hidden" name="noteId" value={formState.noteId ?? ''} />
						<input type="hidden" name="detailsToken" value={formState.detailsToken ?? ''} />

						<Field for="talk-email" label="Email" optional>
							<Input
								id="talk-email"
								name="email"
								type="email"
								placeholder="you@example.com"
								autocomplete="email"
								inputmode="email"
								value={formState.email ?? ''}
								disabled={saving}
							/>
						</Field>

						<label class={['talk-session', wantsSession && 'talk-session--checked']}>
							<input
								type="checkbox"
								name="wantsSession"
								bind:checked={wantsSession}
								disabled={saving}
							/>
							<span>
								<strong>I’d like a free 1-on-1 session</strong>
								<small>
									I’m running a small free beta. Going deep should feel like leveling up, not like a
									secret you carry. Check this and I’ll email you to find a time.
								</small>
							</span>
						</label>

						{#if wantsSession}
							<Field for="talk-name" label="First name" required>
								<Input
									id="talk-name"
									name="name"
									type="text"
									autocomplete="given-name"
									value={formState.name ?? ''}
									required
									disabled={saving}
								/>
							</Field>
						{/if}

						{#if formState.detailsMessage || localError}
							<p class="talk-error" role="alert">{formState.detailsMessage || localError}</p>
						{/if}

						<Button type="submit" size="lg" fullWidth loading={saving}>Save</Button>
						<button
							type="button"
							class="talk-link-button talk-link-button--center"
							onclick={() => (localStage = 'done')}
							disabled={saving}
						>
							Skip. Stay anonymous.
						</button>
					</form>
				{:else}
					<div class="talk-done">
						{#if replyExpected}
							<h2 id="talk-card-title">Thanks. I’ll write back to {formState.email}.</h2>
							{#if formState.wantsSession}
								<p>I’ll also email you about setting up your free 1-on-1 session.</p>
							{:else}
								<p>Keep an eye on your inbox. It might be a voice note.</p>
							{/if}
						{:else}
							<h2 id="talk-card-title">Thanks for trusting me with that.</h2>
							<p>No email means I can’t write back, but I read every note.</p>
						{/if}
						<div class="talk-done__actions">
							<Button variant="secondary" onclick={leaveAnother}>Leave another note</Button>
							<a href={resolve('/questions')} class="talk-text-link">See how other people answer</a>
						</div>
					</div>
				{/if}
			</section>
		{/if}

		<!-- The beta card on blog pages links here (DJ, 2026-10-04). -->
		<section id="experimental-therapy" class="talk-sessions" aria-labelledby="talk-sessions-title">
			<h2 id="talk-sessions-title">Experimental therapy, 9takes style</h2>
			<p>
				Therapy often gets treated like something shameful. People work through their heaviest stuff
				behind a closed door, and too often they walk out without getting anywhere. I want to flip
				that. Going deep on your inner world should feel like leveling up, and you should come out
				stronger and proud of the work.
			</p>
			<ol class="talk-steps">
				<li><strong>Leave your email.</strong> I’ll send you the details myself.</li>
				<li>
					<strong>A free 30-minute call.</strong> I hear what’s going on, and you decide if it’s for you.
				</li>
				<li>
					<strong>1-on-1 sessions.</strong> I ask questions, tell you what I hear underneath your answers,
					and we follow the thread. The Enneagram is our map. Some sessions get into heavy stuff; the
					goal is that you leave every one clearer and more excited about your life.
				</li>
				<li>
					<strong>Something to keep.</strong> After each session you get a short write-up of what you
					figured out. It’s yours.
				</li>
			</ol>
			<p>
				It’s free while I shape how I run these. All I ask is honest feedback on what’s working and
				what isn’t. It’s coaching, not clinical therapy, diagnosis, or crisis support.
			</p>
			<ExperimentalTherapyCard placement="inline" surface="book_session" />
		</section>

		<section class="talk-about" aria-labelledby="talk-about-title">
			<img
				src="/brand/djface.webp"
				alt="DJ Wayne"
				class="talk-photo"
				width="64"
				height="64"
				loading="lazy"
				decoding="async"
			/>
			<div>
				<h2 id="talk-about-title">Who reads these</h2>
				<p>
					I’m DJ, and I built 9takes. The Enneagram found me when my wife and I were newlyweds and
					kept having the same fight. I didn’t understand her fear, and she didn’t understand my
					anger. It gave us both a map, and it made me a much better listener.
				</p>
				<p>
					Every note comes to me. If you leave an email, I write back myself, sometimes with a voice
					note.
				</p>
			</div>
		</section>

		<section class="talk-faq" aria-label="Questions">
			{#each faqs as faq (faq.question)}
				<div class="talk-faq__item">
					<h3>{faq.question}</h3>
					<p>{faq.answer}</p>
				</div>
			{/each}
		</section>

		<p class="talk-crisis">
			If you’re in crisis or thinking about hurting yourself, please call or text
			<a href="tel:988">988</a> (US) or your local emergency number right now. I read notes, but not in
			real time.
		</p>
	</div>
</div>

<style>
	.talk-page {
		min-height: 100vh;
		width: 100%;
		background:
			radial-gradient(
				circle at 50% -10%,
				color-mix(in srgb, var(--lamp-glow) 12%, transparent) 0%,
				transparent 45%
			),
			var(--night-deep);
	}

	.talk-container {
		display: flex;
		width: min(100%, 42rem);
		box-sizing: border-box;
		flex-direction: column;
		gap: 2rem;
		margin: 0 auto;
		padding: 2.5rem 1rem 4rem;
	}

	.talk-intro {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.talk-eyebrow {
		margin: 0;
		color: var(--lamp-glow);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.talk-title {
		margin: 0;
		color: var(--ink-bright);
		font-family: var(--font-display);
		font-size: clamp(2rem, 7vw, 2.75rem);
		line-height: 1.1;
	}

	.talk-lede {
		margin: 0;
		color: var(--ink-mid);
		font-size: 1.0625rem;
		line-height: 1.55;
	}

	.talk-credential {
		margin: 0;
		padding-left: 0.75rem;
		border-left: 2px solid color-mix(in srgb, var(--lamp-glow) 60%, transparent);
		color: var(--ink-dim);
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.talk-credential a {
		color: var(--lamp-light);
		text-underline-offset: 3px;
	}

	.talk-doors {
		scroll-margin-top: 5rem;
	}

	.talk-doors ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.talk-doors li {
		display: flex;
	}

	.talk-door {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.3rem;
		padding: 0.875rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease;
	}

	.talk-door:hover {
		border-color: color-mix(in srgb, var(--lamp-glow) 45%, var(--stone-edge));
	}

	.talk-door:focus-visible {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.talk-door[aria-pressed='true'] {
		border-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-soft) 45%, var(--night-mid));
	}

	.talk-door__label {
		color: var(--ink-bright);
		font-size: 0.9375rem;
		font-weight: 650;
		line-height: 1.3;
	}

	.talk-door__hint {
		color: var(--ink-dim);
		font-size: 0.8125rem;
		line-height: 1.35;
	}

	.talk-card {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-mid);
		box-shadow: 0 18px 50px color-mix(in srgb, var(--night-deep) 60%, transparent);
		scroll-margin-top: 5rem;
	}

	.talk-prompt {
		display: grid;
		gap: 0.4rem;
	}

	.talk-prompt__picked {
		margin: 0;
		color: var(--lamp-glow);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.talk-prompt h2 {
		margin: 0;
		color: var(--ink-bright);
		font-size: 1.375rem;
		line-height: 1.25;
	}

	.talk-prompt p:not(.talk-prompt__picked) {
		margin: 0;
		color: var(--ink-mid);
		line-height: 1.55;
	}

	.talk-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.talk-voice__attached {
		display: grid;
		gap: 0.6rem;
		padding: 0.875rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 40%, var(--stone-edge));
		border-radius: 10px;
		background: color-mix(in srgb, var(--lamp-soft) 45%, var(--night-deep));
	}

	.talk-voice__meta {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--ink-mid);
		font-size: 0.875rem;
		font-variant-numeric: tabular-nums;
	}

	.talk-voice__badge {
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--lamp-glow) 20%, transparent);
		color: var(--lamp-light);
		font-size: 0.7rem;
		font-weight: 750;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.talk-voice__attached audio {
		width: 100%;
	}

	.talk-link-button {
		margin-left: auto;
		padding: 0.25rem 0;
		border: 0;
		background: none;
		color: var(--lamp-light);
		font: inherit;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.talk-link-button--center {
		margin: 0 auto;
		color: var(--ink-dim);
	}

	.talk-link-button:disabled {
		cursor: default;
		opacity: 0.6;
	}

	.talk-fine {
		margin: 0;
		color: var(--ink-dim);
		font-size: 0.8125rem;
		line-height: 1.45;
	}

	.talk-fine--center {
		text-align: center;
	}

	.talk-fine a {
		color: var(--ink-bright);
		font-weight: 700;
	}

	.talk-example {
		display: grid;
		gap: 0.5rem;
		margin: 0;
		padding: 1rem;
		border: 1px dashed var(--stone-edge);
		border-radius: 10px;
	}

	.talk-example figcaption {
		color: var(--ink-dim);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.talk-example blockquote {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.9375rem;
		font-style: italic;
		line-height: 1.55;
	}

	.talk-error {
		margin: 0;
		padding: 0.625rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--error-text) 50%, var(--stone-edge));
		border-radius: 10px;
		background: color-mix(in srgb, var(--error-text) 10%, var(--night-deep));
		color: var(--error-text);
		font-size: 0.875rem;
	}

	.talk-step-head h2,
	.talk-done h2 {
		margin: 0 0 0.4rem;
		color: var(--ink-bright);
		font-size: 1.375rem;
		line-height: 1.25;
	}

	.talk-step-head p,
	.talk-done p {
		margin: 0;
		color: var(--ink-mid);
		line-height: 1.55;
	}

	.talk-session {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.875rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-deep);
		cursor: pointer;
	}

	.talk-session--checked {
		border-color: color-mix(in srgb, var(--lamp-glow) 60%, var(--stone-edge));
	}

	.talk-session input {
		width: 1.125rem;
		height: 1.125rem;
		flex: 0 0 auto;
		margin-top: 0.15rem;
		accent-color: var(--lamp-glow);
	}

	.talk-session span {
		display: grid;
		gap: 0.25rem;
	}

	.talk-session strong {
		color: var(--ink-bright);
		font-size: 0.9375rem;
	}

	.talk-session small {
		color: var(--ink-dim);
		font-size: 0.8125rem;
		line-height: 1.45;
	}

	.talk-done {
		display: grid;
		gap: 1rem;
		text-align: center;
	}

	.talk-done__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.talk-text-link {
		color: var(--lamp-light);
		font-size: 0.9375rem;
		font-weight: 600;
		text-underline-offset: 3px;
	}

	.talk-sessions {
		scroll-margin-top: 5rem;
	}

	.talk-steps {
		display: grid;
		gap: 0.6rem;
		margin: 0 0 1rem;
		padding-left: 1.25rem;
		list-style: decimal outside;
		color: var(--ink-mid);
		line-height: 1.6;
	}

	.talk-steps li::marker {
		color: var(--lamp-glow);
		font-weight: 700;
	}

	.talk-steps strong {
		color: var(--ink-bright);
	}

	.talk-sessions h2,
	.talk-about h2 {
		margin: 0 0 0.75rem;
		color: var(--ink-bright);
		font-size: 1.25rem;
	}

	.talk-sessions p,
	.talk-about p {
		margin: 0 0 0.75rem;
		color: var(--ink-mid);
		line-height: 1.6;
	}

	.talk-about {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--stone-edge);
	}

	.talk-about p:last-child {
		margin-bottom: 0;
	}

	.talk-photo {
		width: 4rem;
		height: 4rem;
		flex: 0 0 auto;
		border: 2px solid color-mix(in srgb, var(--lamp-glow) 55%, var(--stone-edge));
		border-radius: 999px;
		object-fit: cover;
	}

	.talk-faq {
		display: grid;
		gap: 1rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--stone-edge);
	}

	.talk-faq__item h3 {
		margin: 0 0 0.25rem;
		color: var(--ink-bright);
		font-size: 1rem;
	}

	.talk-faq__item p {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.9375rem;
		line-height: 1.55;
	}

	.talk-crisis {
		margin: 0;
		padding: 0.875rem 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		color: var(--ink-dim);
		font-size: 0.8125rem;
		line-height: 1.5;
	}

	.talk-crisis a {
		color: var(--ink-bright);
		font-weight: 700;
	}

	.honeypot {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	@media (max-width: 340px) {
		.talk-doors ul {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 640px) {
		.talk-container {
			padding: 3.5rem 1.5rem 5rem;
		}

		.talk-card {
			padding: 2rem;
		}
	}
</style>

<!-- src/routes/book-session/+page.svelte -->
<!--
  "Talk to DJ": note first, details after (DJ, 2026-09-23).
  Step 1 is only the note (typed, or a voice note that gets transcribed) and it
  saves immediately. Step 2 is optional: an email for a private reply, and the
  free 1-on-1 session request. See docs/product/2026-09-23-therapy-on-steroids.md.
-->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import SEOHead from '$lib/components/SEOHead.svelte';
	import { Button, Field, Input, Textarea } from '$lib/components/atoms';
	import VoiceRecorder, {
		type RecordedAudio
	} from '$lib/components/molecules/VoiceRecorder.svelte';
	import type { ActionData, PageData } from './$types';

	let { form }: { data: PageData; form: ActionData } = $props();

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
	let formLoadTime = 0;

	const formState = $derived((form ?? {}) as TalkFormState);
	const stage = $derived<Stage>(
		localStage ??
			(formState.detailsSaved
				? 'done'
				: formState.noteSaved || formState.detailsMessage
					? 'details'
					: 'note')
	);
	const canSend = $derived(!voiceBusy && !sending && (body.trim().length > 0 || !!voiceNote));
	const noteError = $derived(localError || formState.noteMessage || '');
	const replyExpected = $derived(localStage === 'done' ? false : !!formState.replyExpected);

	const title = 'Talk to DJ: Leave a Note or a Voice Note | 9takes';
	const metaDescription =
		'Tell DJ what’s going on. Type it or record a voice note, stay anonymous or leave an email for a private reply, and ask for a free 1-on-1 session.';

	const prompts = [
		'Someone you can’t figure out: a partner, a boss, a parent, a friend.',
		'The fight you keep having, with the same person or with different ones.',
		'A pattern you keep repeating even though you know better.',
		'Your type, if you’re stuck between two.',
		'Something you’ve been carrying and haven’t said out loud.',
		'What’s energizing you, or draining you, right now.'
	];

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
			question: 'Is this therapy?',
			answer:
				'No. It’s coaching, not therapy, diagnosis, or crisis support. If you need mental health treatment, please reach out to a licensed professional.'
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

	function leaveAnother() {
		body = '';
		clearVoice();
		wantsSession = false;
		localError = '';
		formLoadTime = Date.now();
		localStage = 'note';
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
		name: 'Talk to DJ',
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
			<img
				src="/brand/djface.webp"
				alt="DJ Wayne"
				class="talk-photo"
				width="96"
				height="96"
				decoding="async"
			/>
			<p class="talk-eyebrow">Talk to DJ</p>
			<h1 class="talk-title">Tell me what’s going on.</h1>
			<div class="talk-bio">
				<p>
					I’m DJ. I built 9takes. Marine, sniper school, wrestler, then self-taught coder. I do hard
					things, and I don’t quit.
				</p>
				<p>
					The Enneagram found me when my wife and I were newlyweds and fighting. I didn’t understand
					her fear, and she didn’t understand my anger. It gave us both a map, and it made me a much
					better listener.
				</p>
				<p>Now I want to hear what’s going on with you. Type it or say it out loud.</p>
			</div>
		</header>

		<section class="talk-card" aria-live="polite" aria-labelledby="talk-card-title">
			{#if stage === 'note'}
				<h2 id="talk-card-title" class="visually-hidden">Leave a note</h2>
				<div class="talk-prompts">
					<p class="talk-prompts__label">People bring me things like</p>
					<ul>
						{#each prompts as prompt (prompt)}
							<li>{prompt}</li>
						{/each}
					</ul>
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

					<Field for="talk-body" label="Your note">
						<Textarea
							id="talk-body"
							name="body"
							bind:value={body}
							rows={6}
							maxlength={NOTE_MAX_CHARS}
							placeholder="Say it the way you’d say it to a friend."
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
						Send to DJ
					</Button>
					<p class="talk-fine talk-fine--center">
						Anonymous is fine. If you want a reply, you can add your email on the next step.
					</p>
				</form>
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
							Want a reply? Leave your email and I’ll write back, sometimes with a voice note of my
							own. It stays between us.
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
						<a href="/questions" class="talk-text-link">See how other people answer</a>
					</div>
				</div>
			{/if}
		</section>

		<section class="talk-sessions" aria-labelledby="talk-sessions-title">
			<h2 id="talk-sessions-title">About the free 1-on-1 sessions</h2>
			<p>
				Therapy often gets treated like something shameful. People work through their heaviest stuff
				behind a closed door, and too often they walk out without getting anywhere. I want to flip
				that. Going deep on your inner world should feel like leveling up, and you should come out
				stronger and proud of the work.
			</p>
			<p>
				We use the Enneagram as a map. I ask questions, tell you what I hear underneath your
				answers, and we follow the thread. Some sessions get into heavy stuff. The goal is that you
				leave every one clearer and more excited about your life than when you came in. It’s free
				while I shape how I run these.
			</p>
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
		align-items: center;
		gap: 0.5rem;
		text-align: center;
	}

	.talk-photo {
		width: 5.5rem;
		height: 5.5rem;
		border: 2px solid color-mix(in srgb, var(--lamp-glow) 55%, var(--stone-edge));
		border-radius: 999px;
		object-fit: cover;
	}

	.talk-eyebrow {
		margin: 0.5rem 0 0;
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

	.talk-bio {
		display: grid;
		gap: 0.75rem;
		max-width: 36rem;
		margin-top: 0.5rem;
		text-align: left;
	}

	.talk-bio p {
		margin: 0;
		color: var(--ink-mid);
		font-size: 1rem;
		line-height: 1.6;
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
	}

	.talk-prompts__label {
		margin: 0 0 0.5rem;
		color: var(--ink-dim);
		font-size: 0.8125rem;
		font-weight: 650;
	}

	.talk-prompts ul {
		display: grid;
		gap: 0.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.talk-prompts li {
		position: relative;
		padding-left: 1rem;
		color: var(--ink-mid);
		font-size: 0.9375rem;
		line-height: 1.45;
	}

	.talk-prompts li::before {
		position: absolute;
		top: 0.55em;
		left: 0;
		width: 0.35rem;
		height: 0.35rem;
		border-radius: 999px;
		background: var(--lamp-glow);
		content: '';
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

	.talk-sessions h2 {
		margin: 0 0 0.75rem;
		color: var(--ink-bright);
		font-size: 1.25rem;
	}

	.talk-sessions p {
		margin: 0 0 0.75rem;
		color: var(--ink-mid);
		line-height: 1.6;
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

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
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

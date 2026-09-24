<!-- src/lib/components/admin/TalkNoteCard.svelte -->
<!--
  One "Talk to DJ" note in /admin/consulting/notes: the note (text or voice +
  transcript), who it's from, and DJ's reply box (text and/or a voice note).
-->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Textarea } from '$lib/components/atoms';
	import VoiceRecorder, {
		type RecordedAudio
	} from '$lib/components/molecules/VoiceRecorder.svelte';
	import type { AdminTalkNote } from '$lib/types/talkNotes';

	type ActionResultState = {
		noteId?: string;
		message?: string;
		replied?: boolean;
		emailSent?: boolean;
	} | null;

	let { note, result }: { note: AdminTalkNote; result: ActionResultState } = $props();

	const MAX_REPLY_SECONDS = 240;

	let replyText = $state('');
	let voice = $state<(RecordedAudio & { url: string }) | null>(null);
	let voiceBusy = $state(false);
	let sending = $state(false);
	let showReplyForm = $state(false);

	const mine = $derived(result?.noteId === note.id ? result : null);
	const canReply = $derived(!!note.email && note.status !== 'archived');
	const canSend = $derived(!sending && !voiceBusy && (replyText.trim().length > 0 || !!voice));

	function formatDate(value: string): string {
		return new Date(value).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function formatDuration(seconds: number | null): string {
		if (!seconds) return '';
		return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
	}

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

	function appendTranscript(transcript: string) {
		const current = replyText.trim();
		replyText = current ? `${current}\n\n${transcript}` : transcript;
	}

	function attachVoice(audio: RecordedAudio) {
		clearVoice();
		voice = { ...audio, url: URL.createObjectURL(audio.blob) };
	}

	function clearVoice() {
		if (voice) URL.revokeObjectURL(voice.url);
		voice = null;
	}
</script>

<article class={['note-card', `note-card--${note.status}`]}>
	<header class="note-head">
		<div class="note-badges">
			<span class="note-badge">
				{note.inputMode === 'voice' ? `Voice ${formatDuration(note.audioSeconds)}` : 'Text'}
			</span>
			{#if note.wantsSession}
				<span class="note-badge note-badge--session">Wants a session</span>
			{/if}
			{#if note.status === 'replied'}
				<span class="note-badge note-badge--replied">Replied</span>
			{:else if note.status === 'archived'}
				<span class="note-badge">Archived</span>
			{/if}
		</div>
		<time datetime={note.createdAt}>{formatDate(note.createdAt)}</time>
	</header>

	<p class="note-from">
		{#if note.email}
			<strong>{note.name ?? 'No name'}</strong> ·
			<a href={`mailto:${note.email}`}>{note.email}</a>
		{:else}
			<strong>Anonymous</strong> · no email, so no reply possible
		{/if}
	</p>

	{#if note.audioUrl}
		<audio controls preload="none" src={note.audioUrl}></audio>
	{/if}
	<p class="note-body">{note.body}</p>

	{#if note.repliedAt}
		<div class="note-reply">
			<p class="note-reply__label">
				Your reply · {formatDate(note.repliedAt)} ·
				{note.replyEmailSentAt ? 'emailed' : 'email not sent'}
				{#if note.replyUrl}
					· <a href={note.replyUrl} target="_blank" rel="noopener">open reply page</a>
				{/if}
			</p>
			{#if note.replyAudioUrl}
				<audio controls preload="none" src={note.replyAudioUrl}></audio>
			{/if}
			{#if note.replyText}
				<p class="note-body">{note.replyText}</p>
			{/if}
		</div>
	{/if}

	{#if mine?.message}
		<p class={['note-result', mine.replied && mine.emailSent === false && 'note-result--warn']}>
			{mine.message}
		</p>
	{/if}

	{#if canReply && showReplyForm}
		<form
			method="POST"
			action="?/reply"
			class="note-reply-form"
			use:enhance={({ formData, cancel }) => {
				if (!canSend) {
					cancel();
					return;
				}
				sending = true;
				if (voice) {
					formData.set(
						'audio',
						new File([voice.blob], `reply.${audioExtension(voice.mimeType)}`, {
							type: voice.mimeType
						})
					);
				}
				return async ({ result: actionResult, update }) => {
					sending = false;
					if (actionResult.type === 'success') {
						replyText = '';
						clearVoice();
						showReplyForm = false;
					}
					await update({ reset: false });
				};
			}}
		>
			<input type="hidden" name="noteId" value={note.id} />
			<Textarea
				name="replyText"
				bind:value={replyText}
				rows={5}
				placeholder="Write your reply, or record a voice note below."
				disabled={sending}
			/>
			{#if voice && !voiceBusy}
				<div class="note-voice">
					<span>Your voice note · {formatDuration(voice.durationSeconds)}</span>
					<button type="button" class="note-link" onclick={clearVoice}>Remove</button>
					<audio controls src={voice.url}></audio>
				</div>
			{:else}
				<VoiceRecorder
					id={`reply-voice-${note.id}`}
					label="Record a voice reply"
					hint="The transcript goes in the text box. Edit or delete it."
					maxSeconds={MAX_REPLY_SECONDS}
					disabled={sending}
					ontranscript={appendTranscript}
					onaudio={attachVoice}
					onbusychange={(busy) => (voiceBusy = busy)}
				/>
			{/if}
			<div class="note-actions">
				<Button type="submit" loading={sending} disabled={!canSend}>
					{note.repliedAt ? 'Replace reply and email again' : 'Send reply'}
				</Button>
				<Button variant="ghost" type="button" onclick={() => (showReplyForm = false)}>
					Cancel
				</Button>
			</div>
		</form>
	{:else}
		<div class="note-actions">
			{#if canReply}
				<Button variant="secondary" size="sm" onclick={() => (showReplyForm = true)}>
					{note.repliedAt ? 'Reply again' : 'Reply'}
				</Button>
			{/if}
			<form
				method="POST"
				action={note.status === 'archived' ? '?/restore' : '?/archive'}
				use:enhance
			>
				<input type="hidden" name="noteId" value={note.id} />
				<Button variant="ghost" size="sm" type="submit">
					{note.status === 'archived' ? 'Restore' : 'Archive'}
				</Button>
			</form>
		</div>
	{/if}
</article>

<style>
	.note-card {
		display: grid;
		gap: 0.75rem;
		padding: 1.25rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--night-mid);
	}

	.note-card--new {
		border-color: color-mix(in srgb, var(--lamp-glow) 45%, var(--stone-edge));
	}

	.note-card--archived {
		opacity: 0.7;
	}

	.note-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		color: var(--ink-dim);
		font-size: 0.8125rem;
	}

	.note-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.note-badge {
		padding: 0.15rem 0.55rem;
		border: 1px solid var(--stone-edge);
		border-radius: 999px;
		color: var(--ink-mid);
		font-size: 0.72rem;
		font-weight: 650;
	}

	.note-badge--session {
		border-color: color-mix(in srgb, var(--lamp-glow) 60%, var(--stone-edge));
		color: var(--lamp-light);
	}

	.note-badge--replied {
		color: var(--success-text);
	}

	.note-from {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.875rem;
	}

	.note-from a {
		color: var(--lamp-light);
	}

	.note-card audio,
	.note-voice audio {
		width: 100%;
	}

	.note-body {
		margin: 0;
		color: var(--ink-bright);
		line-height: 1.6;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.note-reply {
		display: grid;
		gap: 0.5rem;
		padding: 0.875rem;
		border-left: 3px solid var(--lamp-glow);
		border-radius: 4px;
		background: var(--night-deep);
	}

	.note-reply__label {
		margin: 0;
		color: var(--ink-dim);
		font-size: 0.78rem;
	}

	.note-reply__label a {
		color: var(--lamp-light);
	}

	.note-result {
		margin: 0;
		color: var(--success-text);
		font-size: 0.875rem;
	}

	.note-result--warn {
		color: var(--error-text);
	}

	.note-reply-form {
		display: grid;
		gap: 0.75rem;
	}

	.note-voice {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 0.5rem;
		color: var(--ink-mid);
		font-size: 0.875rem;
	}

	.note-voice audio {
		grid-column: 1 / -1;
	}

	.note-link {
		border: 0;
		background: none;
		color: var(--lamp-light);
		font: inherit;
		text-decoration: underline;
		cursor: pointer;
	}

	.note-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}
</style>

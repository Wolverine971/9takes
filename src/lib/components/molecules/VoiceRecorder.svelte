<!-- src/lib/components/molecules/VoiceRecorder.svelte -->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { LoaderCircle, Mic, Square } from '@lucide/svelte';

	type VoicePhase = 'idle' | 'preparing' | 'recording' | 'transcribing';

	type SpeechRecognitionResultLike = {
		isFinal: boolean;
		[index: number]: { transcript?: string } | undefined;
	};

	type SpeechRecognitionEventLike = {
		resultIndex: number;
		results: ArrayLike<SpeechRecognitionResultLike>;
	};

	type SpeechRecognitionLike = {
		continuous: boolean;
		interimResults: boolean;
		lang: string;
		onresult: ((event: SpeechRecognitionEventLike) => void) | null;
		onerror: ((event: { error: string }) => void) | null;
		onend: (() => void) | null;
		start: () => void;
		stop: () => void;
		abort: () => void;
	};

	type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
	type VoiceWindow = Window & {
		SpeechRecognition?: SpeechRecognitionConstructor;
		webkitSpeechRecognition?: SpeechRecognitionConstructor;
	};

	interface Props {
		disabled?: boolean;
		label?: string;
		onbeforestart?: () => void;
		ontranscript: (transcript: string) => void;
		onbusychange?: (busy: boolean) => void;
	}

	let {
		disabled = false,
		label = 'Record answer',
		onbeforestart,
		ontranscript,
		onbusychange
	}: Props = $props();

	const MAX_RECORDING_SECONDS = 120;
	const PREFERRED_MIME_TYPES = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg'];

	let phase = $state<VoicePhase>('idle');
	let isSupported = $state(false);
	let durationSeconds = $state(0);
	let liveTranscript = $state('');
	let voiceError = $state('');
	let busy = false;
	let destroyed = false;

	let mediaRecorder: MediaRecorder | null = null;
	let mediaStream: MediaStream | null = null;
	let speechRecognition: SpeechRecognitionLike | null = null;
	let audioChunks: Blob[] = [];
	let finalLiveTranscript = '';
	let recordingStartedAt = 0;
	let durationTimer: ReturnType<typeof setInterval> | null = null;
	let maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
	let recognitionRestartTimer: ReturnType<typeof setTimeout> | null = null;
	let transcriptionController: AbortController | null = null;

	const isRecording = $derived(phase === 'recording');
	const isTranscribing = $derived(phase === 'transcribing');
	const buttonDisabled = $derived(disabled || phase === 'preparing' || isTranscribing);
	const buttonLabel = $derived.by(() => {
		if (phase === 'preparing') return 'Starting microphone…';
		if (phase === 'recording') return `Stop recording, ${formatDuration(durationSeconds)}`;
		if (phase === 'transcribing') return 'Transcribing your answer…';
		return label;
	});

	function setPhase(nextPhase: VoicePhase) {
		phase = nextPhase;
		const nextBusy = nextPhase !== 'idle';
		if (nextBusy !== busy) {
			busy = nextBusy;
			onbusychange?.(busy);
		}
	}

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
	}

	function getPreferredMimeType(): string | undefined {
		return PREFERRED_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
	}

	function getFileExtension(mimeType: string): string {
		const baseMimeType = mimeType.split(';')[0]?.trim();
		const extensions: Record<string, string> = {
			'audio/webm': 'webm',
			'audio/ogg': 'ogg',
			'audio/mp4': 'm4a',
			'audio/mpeg': 'mp3',
			'audio/wav': 'wav'
		};
		return extensions[baseMimeType] ?? 'webm';
	}

	function clearTimers() {
		if (durationTimer) clearInterval(durationTimer);
		if (maxDurationTimer) clearTimeout(maxDurationTimer);
		if (recognitionRestartTimer) clearTimeout(recognitionRestartTimer);
		durationTimer = null;
		maxDurationTimer = null;
		recognitionRestartTimer = null;
	}

	function stopMediaTracks() {
		mediaStream?.getTracks().forEach((track) => track.stop());
		mediaStream = null;
	}

	function stopSpeechRecognition() {
		const recognition = speechRecognition;
		speechRecognition = null;
		if (!recognition) return;
		try {
			recognition.stop();
		} catch {
			// It may already have stopped after a pause.
		}
	}

	function startSpeechRecognition() {
		const voiceWindow = window as VoiceWindow;
		const Recognition = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
		if (!Recognition) return;

		try {
			const recognition = new Recognition();
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang = navigator.language || 'en-US';

			recognition.onresult = (event) => {
				let interimTranscript = '';
				for (let index = event.resultIndex; index < event.results.length; index += 1) {
					const result = event.results[index];
					const transcript = result?.[0]?.transcript ?? '';
					if (result?.isFinal) finalLiveTranscript += `${transcript} `;
					else interimTranscript += transcript;
				}
				liveTranscript = `${finalLiveTranscript}${interimTranscript}`.trim();
			};

			recognition.onerror = (event) => {
				if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
					speechRecognition = null;
				}
			};

			recognition.onend = () => {
				if (!isRecording || speechRecognition !== recognition || destroyed) return;
				recognitionRestartTimer = setTimeout(() => {
					try {
						recognition.start();
					} catch {
						// MediaRecorder remains the source of truth if live preview stops.
					}
				}, 150);
			};

			speechRecognition = recognition;
			recognition.start();
		} catch {
			speechRecognition = null;
		}
	}

	function permissionErrorMessage(error: unknown): string {
		if (error instanceof DOMException) {
			if (error.name === 'NotAllowedError') {
				return 'Microphone access was blocked. Allow it in your browser and try again.';
			}
			if (error.name === 'NotFoundError') return 'No microphone was found.';
			if (error.name === 'NotReadableError') {
				return 'Your microphone is busy in another app.';
			}
		}
		return 'Could not start the microphone. Please try again.';
	}

	function fail(message: string) {
		voiceError = message;
		liveTranscript = '';
		setPhase('idle');
	}

	async function startRecording() {
		if (!isSupported || disabled || phase !== 'idle') return;

		onbeforestart?.();
		voiceError = '';
		liveTranscript = '';
		finalLiveTranscript = '';
		audioChunks = [];
		setPhase('preparing');

		try {
			mediaStream = await navigator.mediaDevices.getUserMedia({
				audio: {
					channelCount: 1,
					sampleRate: 16000,
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true
				}
			});

			if (destroyed) {
				stopMediaTracks();
				return;
			}

			const mimeType = getPreferredMimeType();
			const recorder = new MediaRecorder(mediaStream, {
				audioBitsPerSecond: 64000,
				...(mimeType ? { mimeType } : {})
			});
			mediaRecorder = recorder;

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) audioChunks.push(event.data);
			};

			recorder.onerror = () => {
				// A recorder error can be followed by `stop`; detach the handler so a
				// broken or partial recording is never sent for transcription.
				recorder.onstop = null;
				recorder.ondataavailable = null;
				mediaRecorder = null;
				audioChunks = [];
				clearTimers();
				stopSpeechRecognition();
				stopMediaTracks();
				fail('Recording was interrupted. Please try again.');
			};

			recorder.onstop = () => {
				const recordedType = recorder.mimeType || audioChunks[0]?.type || 'audio/webm';
				const audioBlob = new Blob(audioChunks, { type: recordedType });
				mediaRecorder = null;
				audioChunks = [];
				stopMediaTracks();
				void transcribe(audioBlob);
			};

			recorder.start(1000);
			recordingStartedAt = Date.now();
			durationSeconds = 0;
			setPhase('recording');
			startSpeechRecognition();

			durationTimer = setInterval(() => {
				durationSeconds = Math.floor((Date.now() - recordingStartedAt) / 1000);
			}, 1000);
			maxDurationTimer = setTimeout(() => void stopRecording(), MAX_RECORDING_SECONDS * 1000);
		} catch (error) {
			stopMediaTracks();
			fail(permissionErrorMessage(error));
		}
	}

	function stopRecording() {
		if (!mediaRecorder || mediaRecorder.state === 'inactive' || phase !== 'recording') return;

		clearTimers();
		stopSpeechRecognition();
		durationSeconds = Math.max(
			durationSeconds,
			Math.floor((Date.now() - recordingStartedAt) / 1000)
		);
		setPhase('transcribing');
		mediaRecorder.stop();
	}

	async function transcribe(audioBlob: Blob) {
		if (destroyed) return;
		if (audioBlob.size < 500) {
			fail('That recording was too short to transcribe. Try speaking for another moment.');
			return;
		}

		transcriptionController?.abort();
		const controller = new AbortController();
		transcriptionController = controller;
		const timeout = setTimeout(() => controller.abort(), 50_000);

		try {
			const file = new File([audioBlob], `answer.${getFileExtension(audioBlob.type)}`, {
				type: audioBlob.type
			});
			const formData = new FormData();
			formData.append('audio', file);

			const response = await fetch('/api/transcribe', {
				method: 'POST',
				body: formData,
				signal: controller.signal
			});
			const payload = (await response.json().catch(() => null)) as {
				transcript?: string;
				error?: string;
			} | null;

			if (!response.ok || !payload?.transcript?.trim()) {
				throw new Error(payload?.error || 'We could not transcribe that recording.');
			}

			if (destroyed) return;
			ontranscript(payload.transcript.trim());
			voiceError = '';
			liveTranscript = '';
			setPhase('idle');
		} catch (error) {
			if (destroyed) return;
			const browserTranscript = liveTranscript.trim();
			if (browserTranscript) {
				ontranscript(browserTranscript);
				voiceError = 'Used the live transcript because audio refinement was unavailable.';
				liveTranscript = '';
				setPhase('idle');
				return;
			}

			const message =
				error instanceof DOMException && error.name === 'AbortError'
					? 'Transcription took too long. Please try a shorter recording.'
					: error instanceof Error
						? error.message
						: 'We could not transcribe that recording.';
			fail(message);
		} finally {
			clearTimeout(timeout);
			if (transcriptionController === controller) transcriptionController = null;
		}
	}

	function toggleRecording() {
		if (isRecording) stopRecording();
		else void startRecording();
	}

	onMount(() => {
		isSupported =
			typeof MediaRecorder !== 'undefined' &&
			typeof navigator.mediaDevices?.getUserMedia === 'function';
	});

	onDestroy(() => {
		destroyed = true;
		clearTimers();
		stopSpeechRecognition();
		transcriptionController?.abort();
		transcriptionController = null;

		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.onstop = null;
			mediaRecorder.stop();
		}
		mediaRecorder = null;
		stopMediaTracks();
		if (busy) onbusychange?.(false);
	});
</script>

{#if isSupported}
	<div class="voice-capture">
		<div class="voice-capture__main">
			<div class="voice-capture__status" aria-live="polite">
				{#if isRecording}
					<span class="voice-capture__pulse" aria-hidden="true"></span>
					<span><strong>Listening</strong> · {formatDuration(durationSeconds)}</span>
				{:else if phase === 'preparing'}
					<LoaderCircle class="voice-capture__spinner" size={15} aria-hidden="true" />
					<span>Opening your microphone…</span>
				{:else if isTranscribing}
					<LoaderCircle class="voice-capture__spinner" size={15} aria-hidden="true" />
					<span><strong>Polishing your words…</strong></span>
				{:else}
					<span>Speak naturally. Audio is transcribed, not posted.</span>
				{/if}
			</div>

			<button
				type="button"
				class="voice-capture__button"
				class:voice-capture__button--recording={isRecording}
				onclick={toggleRecording}
				disabled={buttonDisabled}
				aria-label={buttonLabel}
				aria-pressed={isRecording}
				title={buttonLabel}
			>
				{#if phase === 'preparing' || isTranscribing}
					<LoaderCircle class="voice-capture__spinner" size={16} aria-hidden="true" />
				{:else if isRecording}
					<Square size={14} fill="currentColor" aria-hidden="true" />
				{:else}
					<Mic size={17} aria-hidden="true" />
				{/if}
				<span>{isRecording ? 'Stop' : isTranscribing ? 'Transcribing' : label}</span>
			</button>
		</div>

		{#if (isRecording || isTranscribing) && liveTranscript}
			<div class="voice-capture__preview" aria-live="polite" aria-atomic="true">
				<span>{isRecording ? 'Live' : 'Draft'}</span>
				<p>{liveTranscript}</p>
			</div>
		{/if}

		{#if voiceError}
			<p class="voice-capture__error" role="alert">{voiceError}</p>
		{/if}
	</div>
{/if}

<style>
	.voice-capture {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		margin-top: 0.55rem;
	}

	.voice-capture__main {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.voice-capture__status {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 0.45rem;
		color: var(--ink-dim);
		font-size: 0.75rem;
		line-height: 1.35;
	}

	.voice-capture__status strong {
		color: var(--ink-mid);
		font-weight: 650;
	}

	.voice-capture__pulse {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 999px;
		background: var(--error-text);
		box-shadow: 0 0 0 0 color-mix(in srgb, var(--error-text) 44%, transparent);
		animation: voice-pulse 1.4s ease-out infinite;
	}

	.voice-capture__button {
		display: inline-flex;
		min-height: 2.5rem;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 28%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--lamp-soft) 46%, var(--night-deep));
		color: var(--lamp-light);
		font: inherit;
		font-size: 0.75rem;
		font-weight: 650;
		cursor: pointer;
		transition:
			transform 140ms ease,
			border-color 140ms ease,
			background 140ms ease;
	}

	.voice-capture__button:hover:not(:disabled) {
		transform: translateY(-1px);
		border-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-soft) 72%, var(--night-deep));
	}

	:global(.voice-capture__button:focus-visible) {
		outline: 2px solid var(--lamp-glow);
		outline-offset: 2px;
	}

	.voice-capture__button:disabled {
		cursor: wait;
		opacity: 0.72;
	}

	.voice-capture__button--recording {
		border-color: color-mix(in srgb, var(--error-text) 72%, var(--stone-edge));
		background: color-mix(in srgb, var(--error-text) 18%, var(--night-deep));
		color: var(--error-text);
	}

	.voice-capture__preview {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		padding: 0.55rem 0.7rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 24%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--lamp-soft) 38%, transparent);
	}

	.voice-capture__preview > span {
		flex: 0 0 auto;
		padding: 0.1rem 0.35rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--lamp-glow) 18%, transparent);
		color: var(--lamp-light);
		font-size: 0.62rem;
		font-weight: 750;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.voice-capture__preview p,
	.voice-capture__error {
		margin: 0;
		font-size: 0.75rem;
		line-height: 1.45;
	}

	.voice-capture__preview p {
		display: -webkit-box;
		overflow: hidden;
		color: var(--ink-mid);
		line-clamp: 3;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}

	.voice-capture__error {
		color: var(--error-text);
	}

	:global(.voice-capture__spinner) {
		animation: voice-spin 0.85s linear infinite;
	}

	@keyframes voice-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes voice-pulse {
		70% {
			box-shadow: 0 0 0 0.35rem transparent;
		}
		100% {
			box-shadow: 0 0 0 0 transparent;
		}
	}

	@media (max-width: 420px) {
		.voice-capture__main {
			align-items: stretch;
			flex-direction: column;
		}

		.voice-capture__button {
			width: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.voice-capture__button {
			transition: none;
		}

		.voice-capture__button:hover:not(:disabled) {
			transform: none;
		}

		.voice-capture__pulse,
		:global(.voice-capture__spinner) {
			animation: none;
		}
	}
</style>

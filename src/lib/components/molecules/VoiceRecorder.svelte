<!-- src/lib/components/molecules/VoiceRecorder.svelte -->
<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { LoaderCircle, Mic, Square } from '@lucide/svelte';
	import { Button } from '$lib/components/atoms';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';

	type VoicePhase = 'idle' | 'preparing' | 'recording' | 'transcribing';
	type MicrophonePermission = PermissionState | 'unknown';
	type PermissionDialogState = 'intro' | 'blocked' | 'missing' | 'busy' | 'unavailable';

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
		id?: string;
		disabled?: boolean;
		compact?: boolean;
		label?: string;
		onbeforestart?: () => void;
		ontranscript: (transcript: string) => void;
		onbusychange?: (busy: boolean) => void;
	}

	let {
		id = 'voice-recorder',
		disabled = false,
		compact = false,
		label = 'Record your answer',
		onbeforestart,
		ontranscript,
		onbusychange
	}: Props = $props();

	const MAX_RECORDING_SECONDS = 120;
	const PREFERRED_MIME_TYPES = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg'];
	let permissionModalId = $derived(`${id}-permission`);
	let permissionTitleId = $derived(`${permissionModalId}-title`);
	let permissionDescriptionId = $derived(`${permissionModalId}-description`);
	let permissionPrimaryId = $derived(`${permissionModalId}-primary`);

	let phase = $state<VoicePhase>('idle');
	let isSupported = $state(false);
	let microphonePermission = $state<MicrophonePermission>('unknown');
	let permissionDialogState = $state<PermissionDialogState>('intro');
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
	let permissionStatus: PermissionStatus | null = null;

	const isRecording = $derived(phase === 'recording');
	const isTranscribing = $derived(phase === 'transcribing');
	const buttonDisabled = $derived(disabled || phase === 'preparing' || isTranscribing);
	const buttonLabel = $derived.by(() => {
		if (phase === 'preparing') return 'Starting microphone…';
		if (phase === 'recording') return `Stop recording, ${formatDuration(durationSeconds)}`;
		if (phase === 'transcribing') return 'Transcribing your recording…';
		return label;
	});
	const permissionDialogTitle = $derived.by(() => {
		if (permissionDialogState === 'blocked') return 'Microphone is blocked';
		if (permissionDialogState === 'missing') return 'No microphone found';
		if (permissionDialogState === 'busy') return 'Microphone is in use';
		if (permissionDialogState === 'unavailable') return 'Couldn’t open the microphone';
		return 'Use your microphone?';
	});
	const permissionDialogDescription = $derived.by(() => {
		if (permissionDialogState === 'blocked') return getBlockedMicrophoneInstructions();
		if (permissionDialogState === 'missing') {
			return 'Connect or enable a microphone, then try again. You can keep typing in the meantime.';
		}
		if (permissionDialogState === 'busy') {
			return 'Another app or browser tab may be using your microphone. Close it, then try again.';
		}
		if (permissionDialogState === 'unavailable') {
			return 'Your browser couldn’t start the microphone. Check this site’s microphone permission, then try again.';
		}
		return '9takes turns your recording into editable text. You can review it before anything is posted.';
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

	function fail(message: string) {
		voiceError = message;
		liveTranscript = '';
		setPhase('idle');
	}

	function getBlockedMicrophoneInstructions(): string {
		if (typeof navigator === 'undefined') {
			return 'Open this site’s permissions in your browser, allow Microphone, then try again.';
		}

		const userAgent = navigator.userAgent ?? '';
		const platform = navigator.platform ?? '';
		const isIOS =
			/iPad|iPhone|iPod/i.test(userAgent) ||
			(platform === 'MacIntel' && (navigator.maxTouchPoints ?? 0) > 1);

		if (isIOS && /CriOS/i.test(userAgent)) {
			return 'Open iPhone Settings, choose Chrome, and turn on Microphone. Then return here and try again.';
		}
		if (isIOS && /FxiOS/i.test(userAgent)) {
			return 'Open iPhone Settings, choose Firefox, and turn on Microphone. Then return here and try again.';
		}
		if (isIOS) {
			return 'In Safari, open the Page Menu, choose More, then Website Settings and allow Microphone. You can also check Settings → Apps → Safari → Microphone.';
		}
		if (/Firefox/i.test(userAgent)) {
			return 'Click the permissions icon beside the address bar, clear the blocked Microphone setting, then try again.';
		}
		if (/Safari/i.test(userAgent) && !/Chrome|Chromium|CriOS|Edg/i.test(userAgent)) {
			return 'Open Safari → Settings → Websites → Microphone, then allow this site and try again.';
		}
		if (/Chrome|Chromium|Edg/i.test(userAgent)) {
			return 'Click the site controls icon beside the address bar, set Microphone to Allow, then try again.';
		}

		return 'Open this site’s permissions in your browser, allow Microphone, then try again.';
	}

	function handlePermissionChange() {
		if (!permissionStatus) return;
		microphonePermission = permissionStatus.state;
	}

	async function watchMicrophonePermission() {
		if (typeof navigator === 'undefined' || !navigator.permissions?.query) return;

		try {
			const nextStatus = await navigator.permissions.query({
				name: 'microphone' as PermissionName
			});
			if (destroyed) return;
			permissionStatus?.removeEventListener('change', handlePermissionChange);
			permissionStatus = nextStatus;
			microphonePermission = nextStatus.state;
			nextStatus.addEventListener('change', handlePermissionChange);
		} catch {
			// Safari and older browsers may not expose microphone permission status.
			if (microphonePermission !== 'denied') microphonePermission = 'unknown';
		}
	}

	function openPermissionDialog(state: PermissionDialogState) {
		permissionDialogState = state;
		getModal(permissionModalId)?.open();
	}

	function closePermissionDialog() {
		getModal(permissionModalId)?.close();
	}

	function handleMicrophoneError(error: unknown) {
		stopMediaTracks();
		liveTranscript = '';
		setPhase('idle');

		if (error instanceof DOMException) {
			if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
				microphonePermission = 'denied';
				openPermissionDialog('blocked');
				void watchMicrophonePermission();
				return;
			}
			if (error.name === 'NotFoundError') {
				openPermissionDialog('missing');
				return;
			}
			if (error.name === 'NotReadableError' || error.name === 'AbortError') {
				openPermissionDialog('busy');
				return;
			}
		}

		openPermissionDialog('unavailable');
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
			microphonePermission = 'granted';
			closePermissionDialog();

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
			handleMicrophoneError(error);
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
		else if (microphonePermission === 'granted') void startRecording();
		else openPermissionDialog(microphonePermission === 'denied' ? 'blocked' : 'intro');
	}

	onMount(() => {
		isSupported =
			typeof MediaRecorder !== 'undefined' &&
			typeof navigator.mediaDevices?.getUserMedia === 'function';
		if (isSupported) void watchMicrophonePermission();
	});

	onDestroy(() => {
		destroyed = true;
		clearTimers();
		stopSpeechRecognition();
		transcriptionController?.abort();
		transcriptionController = null;
		permissionStatus?.removeEventListener('change', handlePermissionChange);
		permissionStatus = null;

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
	<div
		class={[
			'voice-capture',
			compact && 'voice-capture--compact',
			phase !== 'idle' && 'voice-capture--busy'
		]}
		data-phase={phase}
	>
		<div class="voice-capture__main">
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

			<div
				class="voice-capture__status"
				class:voice-capture__status--idle={phase === 'idle'}
				aria-live="polite"
			>
				{#if isRecording}
					<span class="voice-capture__pulse" aria-hidden="true"></span>
					<span><strong>Listening</strong> · {formatDuration(durationSeconds)}</span>
				{:else if phase === 'preparing'}
					<LoaderCircle class="voice-capture__spinner" size={15} aria-hidden="true" />
					<span>Opening your microphone…</span>
				{:else if isTranscribing}
					<LoaderCircle class="voice-capture__spinner" size={15} aria-hidden="true" />
					<span><strong>Creating your transcript…</strong></span>
				{:else}
					<span>Review the transcript before you post.</span>
				{/if}
			</div>
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

	<Modal
		id={permissionModalId}
		name={permissionDialogTitle}
		labelledBy={permissionTitleId}
		describedBy={permissionDescriptionId}
		initialFocus={`#${permissionPrimaryId}`}
		maxWidth="30rem"
	>
		<div class="permission-dialog" aria-live="polite">
			<div class="permission-dialog__icon" aria-hidden="true">
				<Mic size={24} />
			</div>
			<div class="permission-dialog__copy">
				<p class="permission-dialog__eyebrow">Voice recording</p>
				<h2 id={permissionTitleId}>{permissionDialogTitle}</h2>
				<p id={permissionDescriptionId}>{permissionDialogDescription}</p>
				{#if permissionDialogState === 'intro'}
					<p class="permission-dialog__note">Your browser will ask for permission next.</p>
				{/if}
			</div>
			<div class="permission-dialog__actions">
				<Button
					id={permissionPrimaryId}
					variant="primary"
					size="lg"
					fullWidth
					type="button"
					loading={phase === 'preparing'}
					onclick={() => void startRecording()}
				>
					{permissionDialogState === 'intro' ? 'Allow microphone' : 'Try microphone again'}
				</Button>
				<Button
					variant="secondary"
					size="md"
					fullWidth
					type="button"
					disabled={phase === 'preparing'}
					onclick={closePermissionDialog}
				>
					{permissionDialogState === 'intro' ? 'Not now' : 'Keep typing'}
				</Button>
			</div>
		</div>
	</Modal>
{/if}

<style>
	.voice-capture {
		display: flex;
		width: 100%;
		min-width: 0;
		max-width: 100%;
		box-sizing: border-box;
		flex: 1 1 auto;
		flex-direction: column;
		gap: 0.45rem;
	}

	.voice-capture__main {
		display: grid;
		min-width: 0;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 0.75rem;
	}

	.voice-capture__status {
		display: flex;
		min-width: 0;
		align-items: center;
		justify-self: end;
		gap: 0.45rem;
		color: var(--ink-dim);
		font-size: 0.75rem;
		line-height: 1.35;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
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
		min-height: 2.75rem;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.625rem 1rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 48%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--lamp-soft) 72%, var(--night-deep));
		color: var(--lamp-light);
		font: inherit;
		font-size: 0.875rem;
		font-weight: 650;
		cursor: pointer;
		transition:
			border-color 140ms ease,
			background 140ms ease;
	}

	.voice-capture__button:hover:not(:disabled) {
		border-color: var(--lamp-glow);
		background: color-mix(in srgb, var(--lamp-soft) 92%, var(--night-deep));
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

	.voice-capture--compact .voice-capture__status--idle {
		display: none;
	}

	.voice-capture--compact .voice-capture__button:not(.voice-capture__button--recording) {
		border-color: var(--stone-edge);
		background: transparent;
		color: var(--ink-mid);
	}

	.voice-capture--compact
		.voice-capture__button:hover:not(:disabled):not(.voice-capture__button--recording) {
		border-color: var(--ink-dim);
		background: var(--stone-mid);
		color: var(--ink-bright);
	}

	.voice-capture__preview {
		display: grid;
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: flex-start;
		gap: 0.55rem;
		padding: 0.65rem 0.75rem;
		border: 1px solid color-mix(in srgb, var(--stone-edge) 78%, transparent);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--night-deep) 58%, transparent);
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
		min-width: 0;
		overflow: hidden;
		color: var(--ink-mid);
		overflow-wrap: anywhere;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}

	.voice-capture__error {
		color: var(--error-text);
	}

	.permission-dialog {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 0.25rem 0;
		text-align: center;
	}

	.permission-dialog__icon {
		display: grid;
		width: 3.5rem;
		height: 3.5rem;
		place-items: center;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 45%, var(--stone-edge));
		border-radius: 999px;
		background: var(--lamp-soft);
		color: var(--lamp-glow);
	}

	.permission-dialog__copy {
		display: grid;
		gap: 0.5rem;
	}

	.permission-dialog__copy h2,
	.permission-dialog__copy p {
		margin: 0;
	}

	.permission-dialog__eyebrow {
		color: var(--lamp-glow);
		font-size: 0.7rem;
		font-weight: 750;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.permission-dialog__copy h2 {
		color: var(--ink-bright);
		font-size: clamp(1.35rem, 5vw, 1.75rem);
		line-height: 1.15;
	}

	.permission-dialog__copy > p:not(.permission-dialog__eyebrow):not(.permission-dialog__note) {
		color: var(--ink-mid);
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.permission-dialog__note {
		color: var(--ink-dim);
		font-size: 0.78rem;
		line-height: 1.4;
	}

	.permission-dialog__actions {
		display: grid;
		width: 100%;
		gap: 0.65rem;
		padding-top: 0.25rem;
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

	@media (max-width: 640px) {
		.voice-capture__status--idle {
			display: none;
		}
	}

	@media (max-width: 420px) {
		.voice-capture__main {
			grid-template-columns: minmax(0, 1fr);
			align-items: stretch;
			gap: 0.55rem;
		}

		.voice-capture__button {
			width: 100%;
		}

		.voice-capture__status {
			width: 100%;
			justify-content: center;
			justify-self: stretch;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.voice-capture__button {
			transition: none;
		}

		.voice-capture__pulse,
		:global(.voice-capture__spinner) {
			animation: none;
		}
	}
</style>

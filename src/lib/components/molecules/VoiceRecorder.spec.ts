// @vitest-environment jsdom

import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import VoiceRecorder from './VoiceRecorder.svelte';

type RecorderOptions = {
	mimeType?: string;
};

class MockMediaRecorder {
	static instances: MockMediaRecorder[] = [];
	static isTypeSupported = vi.fn((mimeType: string) => mimeType === 'audio/webm');

	state: RecordingState = 'inactive';
	mimeType: string;
	ondataavailable: ((event: { data: Blob }) => void) | null = null;
	onerror: (() => void) | null = null;
	onstop: (() => void) | null = null;

	constructor(_stream: MediaStream, options: RecorderOptions = {}) {
		this.mimeType = options.mimeType ?? 'audio/webm';
		MockMediaRecorder.instances.push(this);
	}

	start() {
		this.state = 'recording';
	}

	stop() {
		this.state = 'inactive';
		this.onstop?.();
	}

	emitData(data: Blob) {
		this.ondataavailable?.({ data });
	}
}

describe('VoiceRecorder', () => {
	const getUserMediaMock = vi.fn();
	const stopTrackMock = vi.fn();
	const fetchMock = vi.fn();

	beforeEach(() => {
		MockMediaRecorder.instances = [];
		MockMediaRecorder.isTypeSupported.mockClear();
		getUserMediaMock.mockReset();
		stopTrackMock.mockReset();
		fetchMock.mockReset();

		getUserMediaMock.mockResolvedValue({
			getTracks: () => [{ stop: stopTrackMock }]
		});
		fetchMock.mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue({ transcript: 'A polished voice answer.' })
		});

		vi.stubGlobal('MediaRecorder', MockMediaRecorder);
		vi.stubGlobal('fetch', fetchMock);
		vi.stubGlobal('navigator', {
			language: 'en-US',
			mediaDevices: { getUserMedia: getUserMediaMock }
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllTimers();
	});

	it('turns a recording into editable transcript text', async () => {
		const ontranscript = vi.fn();
		const onbusychange = vi.fn();
		const { getByRole, getByText } = render(VoiceRecorder, {
			props: { ontranscript, onbusychange }
		});

		await waitFor(() => expect(getByRole('button', { name: 'Record answer' })).toBeTruthy());
		expect(getByText('Speak naturally. Audio is transcribed, not posted.')).toBeTruthy();

		await fireEvent.click(getByRole('button', { name: 'Record answer' }));
		await waitFor(() => expect(MockMediaRecorder.instances).toHaveLength(1));

		const recorder = MockMediaRecorder.instances[0];
		recorder.emitData(new Blob(['x'.repeat(600)], { type: 'audio/webm' }));
		await fireEvent.click(getByRole('button', { name: 'Stop recording, 0:00' }));

		await waitFor(() => {
			expect(ontranscript).toHaveBeenCalledWith('A polished voice answer.');
		});

		expect(fetchMock).toHaveBeenCalledWith(
			'/api/transcribe',
			expect.objectContaining({ method: 'POST', body: expect.any(FormData) })
		);
		expect(onbusychange.mock.calls.map(([busy]) => busy)).toEqual([true, false]);
		expect(stopTrackMock).toHaveBeenCalledOnce();
	});

	it('keeps typing available when microphone permission is denied', async () => {
		getUserMediaMock.mockRejectedValue(new DOMException('Denied', 'NotAllowedError'));
		const ontranscript = vi.fn();
		const { getByRole } = render(VoiceRecorder, { props: { ontranscript } });

		await waitFor(() => expect(getByRole('button', { name: 'Record answer' })).toBeTruthy());
		await fireEvent.click(getByRole('button', { name: 'Record answer' }));

		await waitFor(() => {
			expect(getByRole('alert').textContent).toContain('Microphone access was blocked');
		});

		expect(fetchMock).not.toHaveBeenCalled();
		expect(ontranscript).not.toHaveBeenCalled();
		expect(getByRole('button', { name: 'Record answer' })).toBeTruthy();
	});
});

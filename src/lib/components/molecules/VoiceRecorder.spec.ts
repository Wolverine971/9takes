// src/lib/components/molecules/VoiceRecorder.spec.ts
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
	const queryPermissionMock = vi.fn();
	const stopTrackMock = vi.fn();
	const fetchMock = vi.fn();
	let permissionState: PermissionState;
	let permissionStatus: PermissionStatus;

	beforeEach(() => {
		MockMediaRecorder.instances = [];
		MockMediaRecorder.isTypeSupported.mockClear();
		getUserMediaMock.mockReset();
		queryPermissionMock.mockReset();
		stopTrackMock.mockReset();
		fetchMock.mockReset();
		permissionState = 'prompt';
		permissionStatus = {
			get state() {
				return permissionState;
			},
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		} as unknown as PermissionStatus;

		getUserMediaMock.mockResolvedValue({
			getTracks: () => [{ stop: stopTrackMock }]
		});
		queryPermissionMock.mockResolvedValue(permissionStatus);
		fetchMock.mockResolvedValue({
			ok: true,
			json: vi.fn().mockResolvedValue({ transcript: 'A polished voice answer.' })
		});

		vi.stubGlobal('MediaRecorder', MockMediaRecorder);
		vi.stubGlobal('fetch', fetchMock);
		vi.stubGlobal('navigator', {
			language: 'en-US',
			userAgent:
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0 Safari/537.36',
			platform: 'MacIntel',
			maxTouchPoints: 0,
			mediaDevices: { getUserMedia: getUserMediaMock },
			permissions: { query: queryPermissionMock }
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

		await waitFor(() => expect(getByRole('button', { name: 'Record your answer' })).toBeTruthy());
		expect(getByText('Review the transcript before you post.')).toBeTruthy();

		await fireEvent.click(getByRole('button', { name: 'Record your answer' }));
		expect(getByRole('dialog', { name: 'Use your microphone?' })).toBeTruthy();
		expect(getUserMediaMock).not.toHaveBeenCalled();

		await fireEvent.click(getByRole('button', { name: 'Allow microphone' }));
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

	it('shows browser-specific recovery when microphone permission is denied', async () => {
		getUserMediaMock.mockImplementation(() => {
			permissionState = 'denied';
			return Promise.reject(new DOMException('Denied', 'NotAllowedError'));
		});
		const ontranscript = vi.fn();
		const { getByRole, getByText } = render(VoiceRecorder, { props: { ontranscript } });

		await waitFor(() => expect(getByRole('button', { name: 'Record your answer' })).toBeTruthy());
		await fireEvent.click(getByRole('button', { name: 'Record your answer' }));
		await fireEvent.click(getByRole('button', { name: 'Allow microphone' }));

		await waitFor(() => {
			expect(getByRole('dialog', { name: 'Microphone is blocked' })).toBeTruthy();
		});
		expect(getByText(/site controls icon beside the address bar/i)).toBeTruthy();
		expect(getByRole('button', { name: 'Try microphone again' })).toBeTruthy();

		expect(fetchMock).not.toHaveBeenCalled();
		expect(ontranscript).not.toHaveBeenCalled();

		await fireEvent.click(getByRole('button', { name: 'Keep typing' }));
		expect(getByRole('button', { name: 'Record your answer' })).toBeTruthy();

		await fireEvent.click(getByRole('button', { name: 'Record your answer' }));
		expect(getByRole('dialog', { name: 'Microphone is blocked' })).toBeTruthy();
		expect(getUserMediaMock).toHaveBeenCalledOnce();
	});

	it('starts immediately when microphone permission was already granted', async () => {
		permissionState = 'granted';
		const ontranscript = vi.fn();
		const { getByRole, queryByRole } = render(VoiceRecorder, { props: { ontranscript } });

		await waitFor(() => expect(queryPermissionMock).toHaveBeenCalledOnce());
		await fireEvent.click(getByRole('button', { name: 'Record your answer' }));

		await waitFor(() => expect(MockMediaRecorder.instances).toHaveLength(1));
		expect(queryByRole('dialog')).toBeNull();
	});
});

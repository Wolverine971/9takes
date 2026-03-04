// src/routes/api/questions/upload-image/upload-image.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { uploadQuestionImageMock, loggerMocks } = vi.hoisted(() => ({
	uploadQuestionImageMock: vi.fn(),
	loggerMocks: {
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	}
}));

vi.mock('$lib/server/questionImages', () => ({
	uploadQuestionImage: uploadQuestionImageMock
}));

vi.mock('$lib/server/elasticSearch', () => ({
	elasticClient: {
		update: vi.fn().mockResolvedValue({})
	}
}));

vi.mock('../../../../utils/api', () => ({
	checkDemoTime: vi.fn().mockResolvedValue(false)
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import { POST } from './+server';
import { QUESTION_SOCIAL_CARD_VARIANT } from '$lib/socialCards/questionSocialCard';

function buildSupabaseMock() {
	const singleMock = vi
		.fn()
		.mockResolvedValueOnce({
			data: { id: 101, author_id: 'user-123', es_id: 'es-101' },
			error: null
		})
		.mockResolvedValueOnce({ data: { es_id: 'es-101' }, error: null });

	const query = {
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		single: singleMock,
		update: vi.fn().mockReturnThis()
	};

	return {
		from: vi.fn().mockReturnValue(query)
	};
}

function buildRequest(body: Record<string, string>) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(body)) {
		formData.append(key, value);
	}
	return new Request('http://localhost/api/questions/upload-image', {
		method: 'POST',
		body: formData
	});
}

describe('POST /api/questions/upload-image', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		uploadQuestionImageMock.mockResolvedValue({
			path: 'images/some-question/social-card-v1.png',
			bytes: 120000,
			contentType: 'image/png'
		});
	});

	it('passes variant when social card variant is provided', async () => {
		const supabase = buildSupabaseMock();
		const response = await POST({
			request: buildRequest({
				questionId: '101',
				url: 'some-question',
				img_url: 'data:image/png;base64,abcd',
				variant: QUESTION_SOCIAL_CARD_VARIANT
			}),
			locals: {
				session: { user: { id: 'user-123' } },
				supabase
			}
		} as any);

		expect(response.status).toBe(200);
		expect(uploadQuestionImageMock).toHaveBeenCalledWith(
			expect.objectContaining({
				questionUrl: 'some-question',
				variant: QUESTION_SOCIAL_CARD_VARIANT
			})
		);
	});

	it('keeps backward-compatible upload behavior when variant is omitted', async () => {
		const supabase = buildSupabaseMock();
		const response = await POST({
			request: buildRequest({
				questionId: '101',
				url: 'some-question',
				img_url: 'data:image/png;base64,abcd'
			}),
			locals: {
				session: { user: { id: 'user-123' } },
				supabase
			}
		} as any);

		expect(response.status).toBe(200);
		expect(uploadQuestionImageMock).toHaveBeenCalledWith(
			expect.objectContaining({
				questionUrl: 'some-question',
				variant: undefined
			})
		);
	});
});

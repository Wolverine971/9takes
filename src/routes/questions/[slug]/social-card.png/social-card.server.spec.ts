// src/routes/questions/[slug]/social-card.png/social-card.server.spec.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { renderQuestionSocialCardMock, uploadQuestionImageBufferMock, loggerMocks } = vi.hoisted(
	() => ({
		renderQuestionSocialCardMock: vi.fn(),
		uploadQuestionImageBufferMock: vi.fn(),
		loggerMocks: {
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn()
		}
	})
);

vi.mock('$env/static/public', () => ({
	PUBLIC_SUPABASE_URL: 'https://demo.supabase.co'
}));

vi.mock('$lib/server/socialCards/renderQuestionSocialCard', () => ({
	renderQuestionSocialCard: renderQuestionSocialCardMock
}));

vi.mock('$lib/server/questionImages', () => ({
	uploadQuestionImageBuffer: uploadQuestionImageBufferMock
}));

vi.mock('$lib/utils/logger', () => ({
	logger: loggerMocks
}));

import { GET } from './+server';
import { QUESTION_SOCIAL_CARD_FILENAME } from '$lib/socialCards/questionSocialCard';

function makeSupabase(question: any) {
	const single = vi.fn().mockResolvedValue({ data: question, error: null });
	const eqSelect = vi.fn().mockReturnValue({ single });
	const select = vi.fn().mockReturnValue({ eq: eqSelect });

	const eqUpdate = vi.fn().mockResolvedValue({ error: null });
	const update = vi.fn().mockReturnValue({ eq: eqUpdate });

	return {
		from: vi.fn().mockReturnValue({ select, update }),
		_mocks: {
			eqSelect,
			eqUpdate,
			select,
			update
		}
	};
}

describe('GET /questions/[slug]/social-card.png', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('redirects directly when question already has v1 social card', async () => {
		const supabase = makeSupabase({
			id: 1,
			url: 'why-do-i-overthink',
			question: 'Why do I overthink everything?',
			question_formatted: null,
			img_url: `images/why-do-i-overthink/${QUESTION_SOCIAL_CARD_FILENAME}`,
			es_id: 'es-1'
		});

		const response = await GET({
			params: { slug: 'why-do-i-overthink' },
			locals: { supabase },
			request: new Request('https://9takes.com/questions/why-do-i-overthink/social-card.png')
		} as any);

		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe(
			`https://demo.supabase.co/storage/v1/object/public/questions/images/why-do-i-overthink/${QUESTION_SOCIAL_CARD_FILENAME}`
		);
		expect(renderQuestionSocialCardMock).not.toHaveBeenCalled();
		expect(uploadQuestionImageBufferMock).not.toHaveBeenCalled();
	});

	it('regenerates and redirects for legacy image paths', async () => {
		const supabase = makeSupabase({
			id: 2,
			url: 'legacy-question',
			question: 'Legacy question text',
			question_formatted: null,
			img_url: 'images/legacy-question/old-image.png',
			es_id: 'es-2'
		});
		renderQuestionSocialCardMock.mockResolvedValue(Buffer.from('png'));
		uploadQuestionImageBufferMock.mockResolvedValue({
			path: `images/legacy-question/${QUESTION_SOCIAL_CARD_FILENAME}`,
			bytes: 3,
			contentType: 'image/png'
		});

		const response = await GET({
			params: { slug: 'legacy-question' },
			locals: { supabase },
			request: new Request('https://9takes.com/questions/legacy-question/social-card.png')
		} as any);

		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe(
			`https://demo.supabase.co/storage/v1/object/public/questions/images/legacy-question/${QUESTION_SOCIAL_CARD_FILENAME}`
		);
		expect(renderQuestionSocialCardMock).toHaveBeenCalledTimes(1);
		expect(uploadQuestionImageBufferMock).toHaveBeenCalledTimes(1);
	});

	it('treats mixed slugs as URLs instead of numeric ids', async () => {
		const supabase = makeSupabase({
			id: 4,
			url: '123abc',
			question: 'Question with numeric prefix slug',
			question_formatted: null,
			img_url: `images/123abc/${QUESTION_SOCIAL_CARD_FILENAME}`,
			es_id: 'es-4'
		});

		const response = await GET({
			params: { slug: '123abc' },
			locals: { supabase },
			request: new Request('https://9takes.com/questions/123abc/social-card.png')
		} as any);

		expect(response.status).toBe(302);
		expect(supabase._mocks.eqSelect).toHaveBeenCalledWith('url', '123abc');
	});

	it('falls back to default image when regeneration fails', async () => {
		const supabase = makeSupabase({
			id: 3,
			url: 'broken-question',
			question: 'Broken question text',
			question_formatted: null,
			img_url: null,
			es_id: null
		});
		renderQuestionSocialCardMock.mockRejectedValue(new Error('render failed'));

		const response = await GET({
			params: { slug: 'broken-question' },
			locals: { supabase },
			request: new Request('https://9takes.com/questions/broken-question/social-card.png')
		} as any);

		expect(response.status).toBe(302);
		expect(response.headers.get('location')).toBe('https://9takes.com/questions-default.webp');
	});
});

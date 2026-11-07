// src/routes/admin/brand/card/+server.ts
// Renders a Cold Light brand card for the /admin/brand studio. Admin only.
// GET ?template=statement|question|person|slide&format=og|ig-post|...&<fields>[&download=1]
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { renderBrandCard, type BrandCardInput } from '$lib/server/brandCards/renderBrandCard';
import { CARD_FORMATS, STATUES, type CardFormat, type StatueId } from '$lib/brand/brandTokens';

const MAX_FIELD = 600;

function field(params: URLSearchParams, key: string): string | undefined {
	const value = params.get(key)?.trim();
	return value ? value.slice(0, MAX_FIELD) : undefined;
}

function parseCard(params: URLSearchParams): BrandCardInput {
	const template = params.get('template') ?? 'statement';
	const statue = field(params, 'statue');
	switch (template) {
		case 'statement': {
			const art = field(params, 'art');
			return {
				template,
				headline: field(params, 'headline') ?? '9takes',
				voice: field(params, 'voice'),
				kicker: field(params, 'kicker'),
				art: art === 'statue' || art === 'masks' || art === 'none' ? art : undefined,
				statue: statue && statue in STATUES ? (statue as StatueId) : undefined,
				footer: field(params, 'footer')
			};
		}
		case 'question':
			return {
				template,
				question: field(params, 'question') ?? 'What do you actually feel first?',
				kicker: field(params, 'kicker'),
				action: field(params, 'action')
			};
		case 'person': {
			const portrait = field(params, 'portrait');
			const type = Number(params.get('type'));
			return {
				template,
				name: field(params, 'name') ?? 'Name',
				type: type >= 1 && type <= 9 ? type : null,
				voice: field(params, 'voice'),
				kicker: field(params, 'kicker'),
				// Only the portrait library; never an arbitrary path.
				portrait:
					portrait && /^\/types\/[1-9]s\/[\w.-]+\.(?:webp|png|jpe?g)$/i.test(portrait)
						? portrait
						: null
			};
		}
		case 'slide':
			return {
				template,
				body: field(params, 'body') ?? '',
				index: field(params, 'index'),
				headline: field(params, 'headline'),
				voice: field(params, 'voice')
			};
		default:
			throw error(400, 'Unknown template');
	}
}

export const GET: RequestHandler = async ({ locals, url }) => {
	await requireAdmin(locals);
	const format = (url.searchParams.get('format') ?? 'og') as CardFormat;
	if (!(format in CARD_FORMATS)) throw error(400, 'Unknown format');

	const card = parseCard(url.searchParams);
	const png = await renderBrandCard(card, { format, output: 'png' });
	const headers: Record<string, string> = {
		'content-type': 'image/png',
		'cache-control': 'private, max-age=60'
	};
	if (url.searchParams.get('download')) {
		const name = (url.searchParams.get('name') ?? `9takes-${card.template}-${format}`)
			.toLowerCase()
			.replace(/[^a-z0-9-]+/g, '-')
			.slice(0, 80);
		headers['content-disposition'] = `attachment; filename="${name}.png"`;
	}
	return new Response(new Uint8Array(png), { headers });
};

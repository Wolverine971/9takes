import { error, type RequestHandler } from '@sveltejs/kit';

type ShortLink = {
	path: string;
	query: Record<string, string>;
};

const SHORT_LINKS: Record<string, ShortLink> = {
	'567': {
		path: '/questions/whats-something-every-day-seem-fine-nobody-knows-costing-effort',
		query: {
			utm_source: 'reddit',
			utm_medium: 'organic',
			utm_campaign: 'alpha_beta_answer_first_20260831'
		}
	}
};

export const GET: RequestHandler = ({ params, url }) => {
	const code = params.code;
	if (!code) {
		throw error(404, 'Short link not found');
	}

	const shortLink = SHORT_LINKS[code];

	if (!shortLink) {
		throw error(404, 'Short link not found');
	}

	const destination = new URL(shortLink.path, url.origin);
	for (const [name, value] of Object.entries(shortLink.query)) {
		destination.searchParams.set(name, value);
	}

	return new Response(null, {
		status: 302,
		headers: {
			location: destination.toString(),
			'cache-control': 'no-store',
			'x-robots-tag': 'noindex, noarchive'
		}
	});
};

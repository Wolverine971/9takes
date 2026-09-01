// api/one-click-unsubscribe.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ONE_CLICK_BODY = 'List-Unsubscribe=One-Click';
const MAX_BODY_BYTES = 1024;

type Dependencies = {
	supabase?: Pick<SupabaseClient, 'rpc'>;
};

function emptyResponse(status: number, extraHeaders?: HeadersInit) {
	return new Response(null, {
		status,
		headers: {
			'Cache-Control': 'no-store',
			'Content-Length': '0',
			...extraHeaders
		}
	});
}

function getSupabaseClient() {
	const supabaseUrl = process.env.PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim();
	const serviceKey = process.env.SUPABASE_SERVICE_KEY?.trim();

	if (!supabaseUrl || !serviceKey) {
		throw new Error('Supabase one-click unsubscribe configuration is missing');
	}

	return createClient(supabaseUrl, serviceKey, {
		auth: { autoRefreshToken: false, persistSession: false }
	});
}

/**
 * RFC 8058 endpoint intentionally isolated from SvelteKit's browser-form CSRF
 * boundary. It accepts no cookies and requires the exact provider form body.
 */
export async function handleOneClickUnsubscribe(
	request: Request,
	dependencies: Dependencies = {}
): Promise<Response> {
	if (request.method !== 'POST') {
		return emptyResponse(405, { Allow: 'POST' });
	}

	const contentType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
	if (contentType !== 'application/x-www-form-urlencoded') {
		return emptyResponse(415);
	}

	const requestUrl = new URL(request.url);
	const trackingId = requestUrl.searchParams.get('tracking_id')?.trim() || '';
	if (!UUID_PATTERN.test(trackingId)) {
		return emptyResponse(404);
	}

	const declaredLength = Number.parseInt(request.headers.get('content-length') || '0', 10);
	if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
		return emptyResponse(413);
	}
	const body = await request.text();

	if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
		return emptyResponse(413);
	}

	if (body !== ONE_CLICK_BODY) return emptyResponse(400);

	try {
		const supabase = dependencies.supabase ?? getSupabaseClient();
		const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
		const userAgent = request.headers.get('user-agent');
		const { data, error } = await supabase.rpc('track_email_unsubscribe', {
			p_tracking_id: trackingId,
			p_ip_address: ipAddress || 'unknown',
			p_user_agent: userAgent || 'unknown'
		});

		if (error) {
			console.error('One-click unsubscribe RPC failed', {
				code: error.code,
				message: error.message
			});
			return emptyResponse(500);
		}

		if (!data) return emptyResponse(404);

		return emptyResponse(200);
	} catch (error) {
		console.error('One-click unsubscribe failed', {
			message: error instanceof Error ? error.message : 'Unknown error'
		});
		return emptyResponse(500);
	}
}

export default {
	fetch: handleOneClickUnsubscribe
};

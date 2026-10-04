// src/routes/admin/enneagram-campaign/+page.server.ts
import type { PageServerLoad } from './$types';

import {
	ENNEAGRAM_TYPE_PROMPT_CONTENT,
	ENNEAGRAM_TYPE_PROMPT_KEY
} from '$lib/email/enneagram-type-prompt-content';
import { generateEmailHtml } from '$lib/email/base-template';
import { requireAdmin } from '$lib/server/adminAuth';
import { loadEnneagramCampaignAudience } from '$lib/server/enneagramCampaignAudience';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { loadEmailDeliveryHealth } from '$lib/server/emailDeliveryHealth';

// Must match the invalidate() call in +page.svelte.
const AUDIENCE_DEPENDENCY = 'admin:enneagram-campaign-audience';

export const load: PageServerLoad = async ({ locals, isDataRequest, depends }) => {
	depends(AUDIENCE_DEPENDENCY);
	const guard = requireAdmin(locals);
	const adminSupabase = getSupabaseAdminClient() as any;

	// The audience (every profile, every GoTrue user, suppression) is the slow part, so it
	// streams in behind the page shell. It starts only once the guard passes: it reads every
	// user's email with the service role. On a full page load SvelteKit would stream it as
	// inline <script> chunks, which csp.mode 'hash' can't cover (the header is already sent),
	// so the browser would drop them. Full loads send the shell without it and the page
	// re-requests it through invalidate(), which streams over __data.json.
	const audience = isDataRequest
		? guard.then(() => loadEnneagramCampaignAudience(adminSupabase))
		: null;
	// Rejections reach the page's {:catch} branch. If the guard throws below, this promise is
	// never returned, so mark it handled to keep Node from crashing on it.
	audience?.catch(() => {});

	const [, delivery, sequenceResult] = await Promise.all([
		guard,
		loadEmailDeliveryHealth(adminSupabase),
		adminSupabase
			.from('email_sequences')
			.select('id, key, display_name, description, status, updated_at')
			.eq('key', ENNEAGRAM_TYPE_PROMPT_KEY)
			.maybeSingle()
	]);

	return {
		audience,
		delivery,
		sequence: sequenceResult.error ? null : sequenceResult.data,
		sequenceLoadError: sequenceResult.error?.message ?? null,
		campaign: ENNEAGRAM_TYPE_PROMPT_CONTENT,
		previewHtml: generateEmailHtml({
			subject: ENNEAGRAM_TYPE_PROMPT_CONTENT.subject,
			preheader: ENNEAGRAM_TYPE_PROMPT_CONTENT.preheader,
			content: ENNEAGRAM_TYPE_PROMPT_CONTENT.htmlContent.replaceAll('{{first_name}}', '{{name}}'),
			recipientName: 'Alex',
			unsubscribeUrl: 'https://9takes.com/account/unsubscribe'
		})
	};
};

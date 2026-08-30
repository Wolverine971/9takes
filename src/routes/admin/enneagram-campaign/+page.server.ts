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

export const load: PageServerLoad = async ({ locals }) => {
	await requireAdmin(locals);
	const adminSupabase = getSupabaseAdminClient() as any;
	const [audience, sequenceResult] = await Promise.all([
		loadEnneagramCampaignAudience(adminSupabase),
		adminSupabase
			.from('email_sequences')
			.select('id, key, display_name, description, status, updated_at')
			.eq('key', ENNEAGRAM_TYPE_PROMPT_KEY)
			.maybeSingle()
	]);

	return {
		audience,
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

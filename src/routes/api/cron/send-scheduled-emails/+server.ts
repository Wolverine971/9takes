// src/routes/api/cron/send-scheduled-emails/+server.ts
// Cron job to process scheduled emails
// Supports both GET (Vercel cron) and POST (Supabase pg_cron via pg_net)

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CRON_SECRET } from '$env/static/private';
import { sendBatchEmails } from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { isAuthorizedCronRequest } from '$lib/server/cronAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

type ScheduledRecipient = {
	id?: string;
	email: string;
	name?: string | null;
	source: 'profiles' | 'signups' | 'coaching_waitlist';
	source_id?: string | null;
};

type ScheduledEmailRow = {
	id: string;
	recipients: ScheduledRecipient[] | null;
	subject: string;
	html_content: string | null;
	campaign_id: string | null;
	created_by: string | null;
	claim_token: string;
};

const scheduledEmailsTable = (supabaseClient: any) =>
	(
		supabaseClient as {
			from: (table: 'scheduled_emails') => any;
		}
	).from('scheduled_emails');

// Shared handler for both GET and POST
async function processScheduledEmails(request: Request) {
	const supabase = getSupabaseAdminClient() as any;

	// Verify cron secret (Vercel adds this header, pg_cron sends it via pg_net)
	const authHeader = request.headers.get('authorization');

	// In production, verify the secret
	if (!isAuthorizedCronRequest(authHeader, [CRON_SECRET])) {
		throw error(401, 'Unauthorized');
	}

	try {
		// Claim due work atomically. The RPC uses FOR UPDATE SKIP LOCKED and also
		// recovers abandoned claims after a timeout.
		const { data: scheduledEmailsData, error: fetchError } = await supabase.rpc(
			'claim_due_scheduled_emails',
			{ p_limit: 5 }
		);
		const scheduledEmails = (scheduledEmailsData ?? []) as ScheduledEmailRow[];

		if (fetchError) {
			console.error('Error fetching scheduled emails:', fetchError);
			throw error(500, 'Failed to fetch scheduled emails');
		}

		if (!scheduledEmails || scheduledEmails.length === 0) {
			await recordCronHeartbeat(supabase, 'success_no_work');
			return json({ message: 'No emails to send', processed: 0 });
		}

		const results: Array<{
			id: string;
			sent: number;
			failed: number;
			status: 'completed' | 'failed';
		}> = [];

		for (const scheduled of scheduledEmails) {
			try {
				const recipients = Array.isArray(scheduled.recipients) ? scheduled.recipients : [];
				const mappedRecipients = recipients.map((r) => ({
					id: r.id || r.source_id || r.email,
					email: r.email,
					name: r.name,
					source: r.source,
					source_id: r.source_id || r.id || r.email
				}));
				const suppressedEmails = await getSuppressedEmailSet(
					supabase,
					mappedRecipients.map((r) => r.email)
				);
				const validRecipients = mappedRecipients.filter(
					(r) => !suppressedEmails.has(normalizeEmail(r.email))
				);

				if (validRecipients.length === 0) {
					const suppressionLog = [...suppressedEmails].map((email) => ({
						email,
						error: 'Skipped: recipient unsubscribed before scheduled send'
					}));

					await scheduledEmailsTable(supabase)
						.update({
							status: 'completed',
							processed_at: new Date().toISOString(),
							processing_started_at: null,
							claim_token: null,
							emails_sent: 0,
							emails_failed: 0,
							error_log: suppressionLog
						})
						.eq('id', scheduled.id)
						.eq('claim_token', scheduled.claim_token);

					results.push({
						id: scheduled.id,
						sent: 0,
						failed: 0,
						status: 'completed'
					});
					continue;
				}

				// Send emails
				const result = await sendBatchEmails(supabase, {
					recipients: validRecipients,
					subject: scheduled.subject,
					htmlContent: scheduled.html_content ?? '',
					campaignId: scheduled.campaign_id ?? undefined,
					sentBy: scheduled.created_by ?? undefined,
					delayMs: 100,
					includeFooter: true,
					emailKind: 'marketing',
					idempotencyScope: `scheduled-email/${scheduled.id}`
				});

				// Collect errors
				const suppressionLog = [...suppressedEmails].map((email) => ({
					email,
					error: 'Skipped: recipient unsubscribed before scheduled send'
				}));
				const sendErrors = result.results
					.filter((r) => !r.success)
					.map((r) => ({ email: r.email, error: r.error || 'Unknown error' }));

				// Mark as completed
				await scheduledEmailsTable(supabase)
					.update({
						status: 'completed',
						processed_at: new Date().toISOString(),
						processing_started_at: null,
						claim_token: null,
						emails_sent: result.sent,
						emails_failed: result.failed,
						error_log: [...suppressionLog, ...sendErrors]
					})
					.eq('id', scheduled.id)
					.eq('claim_token', scheduled.claim_token);

				results.push({
					id: scheduled.id,
					sent: result.sent,
					failed: result.failed,
					status: 'completed'
				});
			} catch (err) {
				console.error('Error processing scheduled email:', scheduled.id, err);

				// Mark as failed
				await scheduledEmailsTable(supabase)
					.update({
						status: 'failed',
						processed_at: new Date().toISOString(),
						processing_started_at: null,
						claim_token: null,
						error_log: [{ error: err instanceof Error ? err.message : 'Unknown error' }]
					})
					.eq('id', scheduled.id)
					.eq('claim_token', scheduled.claim_token);

				results.push({
					id: scheduled.id,
					sent: 0,
					failed: 0,
					status: 'failed'
				});
			}
		}

		await recordCronHeartbeat(supabase, `success_processed_${results.length}`);
		return json({
			message: `Processed ${results.length} scheduled emails`,
			processed: results.length,
			results
		});
	} catch (e) {
		console.error('Error in cron job:', e);
		await recordCronHeartbeat(supabase, 'failed');
		throw error(500, 'Cron job failed');
	}
}

async function recordCronHeartbeat(supabase: any, status: string) {
	const { error: heartbeatError } = await supabase
		.from('email_cron_config')
		.update({
			last_run_at: new Date().toISOString(),
			last_run_status: status,
			updated_at: new Date().toISOString()
		})
		.eq('id', 1);

	if (heartbeatError) {
		console.error('Failed to record scheduled email cron heartbeat:', heartbeatError);
	}
}

// GET handler (Vercel cron)
export const GET: RequestHandler = async ({ request }) => {
	return processScheduledEmails(request);
};

// POST handler (Supabase pg_cron via pg_net)
export const POST: RequestHandler = async ({ request }) => {
	return processScheduledEmails(request);
};

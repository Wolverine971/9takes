// src/routes/api/cron/send-scheduled-emails/+server.ts
// Cron job to process scheduled emails
// Supports both GET (Vercel cron) and POST (Supabase pg_cron via pg_net)

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PRIVATE_CRON_SECRET } from '$env/static/private';
import { env } from '$env/dynamic/private';
import { sendBatchEmails } from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

type ScheduledRecipient = {
	email: string;
	name?: string | null;
	source: 'profiles' | 'signups' | 'coaching_waitlist';
	source_id: string;
};

type ScheduledEmailRow = {
	id: string;
	recipients: ScheduledRecipient[] | null;
	subject: string;
	html_content: string | null;
	campaign_id: string | null;
	created_by: string | null;
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
	const expectedCronSecret = PRIVATE_CRON_SECRET || env.CRON_SECRET;

	// Verify cron secret (Vercel adds this header, pg_cron sends it via pg_net)
	const authHeader = request.headers.get('authorization');

	// In production, verify the secret
	if (expectedCronSecret && authHeader !== `Bearer ${expectedCronSecret}`) {
		throw error(401, 'Unauthorized');
	}

	try {
		// Get pending scheduled emails that are due
		const { data: scheduledEmailsData, error: fetchError } = await scheduledEmailsTable(supabase)
			.select('*')
			.eq('status', 'pending')
			.lte('scheduled_for', new Date().toISOString())
			.order('scheduled_for', { ascending: true })
			.limit(5); // Process 5 at a time to avoid timeout
		const scheduledEmails = (scheduledEmailsData ?? []) as ScheduledEmailRow[];

		if (fetchError) {
			console.error('Error fetching scheduled emails:', fetchError);
			throw error(500, 'Failed to fetch scheduled emails');
		}

		if (!scheduledEmails || scheduledEmails.length === 0) {
			return json({ message: 'No emails to send', processed: 0 });
		}

		const results: Array<{
			id: string;
			sent: number;
			failed: number;
			status: 'completed' | 'failed';
		}> = [];

		for (const scheduled of scheduledEmails) {
			// Mark as processing
			await scheduledEmailsTable(supabase).update({ status: 'processing' }).eq('id', scheduled.id);

			try {
				const recipients = Array.isArray(scheduled.recipients) ? scheduled.recipients : [];
				const mappedRecipients = recipients.map((r) => ({
					id: r.source_id,
					email: r.email,
					name: r.name,
					source: r.source,
					source_id: r.source_id
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
							emails_sent: 0,
							emails_failed: 0,
							error_log: suppressionLog
						})
						.eq('id', scheduled.id);

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
					includeFooter: true
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
						emails_sent: result.sent,
						emails_failed: result.failed,
						error_log: [...suppressionLog, ...sendErrors]
					})
					.eq('id', scheduled.id);

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
						error_log: [{ error: err instanceof Error ? err.message : 'Unknown error' }]
					})
					.eq('id', scheduled.id);

				results.push({
					id: scheduled.id,
					sent: 0,
					failed: 0,
					status: 'failed'
				});
			}
		}

		return json({
			message: `Processed ${results.length} scheduled emails`,
			processed: results.length,
			results
		});
	} catch (e) {
		console.error('Error in cron job:', e);
		throw error(500, 'Cron job failed');
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

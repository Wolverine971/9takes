// GET /api/cron/send-scheduled-emails
// Vercel Cron job to process scheduled emails
// Runs every minute

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PRIVATE_CRON_SECRET } from '$env/static/private';
import { supabase } from '$lib/supabase';
import { sendBatchEmails } from '$lib/email/sender';

export const GET: RequestHandler = async ({ request }) => {
	// Verify cron secret (Vercel adds this header for cron jobs)
	const authHeader = request.headers.get('authorization');

	// In production, verify the secret
	if (PRIVATE_CRON_SECRET && authHeader !== `Bearer ${PRIVATE_CRON_SECRET}`) {
		throw error(401, 'Unauthorized');
	}

	try {
		// Get pending scheduled emails that are due
		const { data: scheduledEmails, error: fetchError } = await supabase
			.from('scheduled_emails')
			.select('*')
			.eq('status', 'pending')
			.lte('scheduled_for', new Date().toISOString())
			.order('scheduled_for', { ascending: true })
			.limit(5); // Process 5 at a time to avoid timeout

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
			await supabase
				.from('scheduled_emails')
				.update({ status: 'processing' })
				.eq('id', scheduled.id);

			try {
				const recipients = scheduled.recipients as Array<{
					email: string;
					name?: string;
					source: string;
					source_id: string;
				}>;

				// Send emails
				const result = await sendBatchEmails(supabase, {
					recipients: recipients.map((r) => ({
						id: r.source_id,
						email: r.email,
						name: r.name,
						source: r.source as 'profiles' | 'signups' | 'coaching_waitlist',
						source_id: r.source_id
					})),
					subject: scheduled.subject,
					htmlContent: scheduled.html_content,
					campaignId: scheduled.campaign_id,
					sentBy: scheduled.created_by,
					delayMs: 100
				});

				// Collect errors
				const errors = result.results
					.filter((r) => !r.success)
					.map((r) => ({ email: r.email, error: r.error || 'Unknown error' }));

				// Mark as completed
				await supabase
					.from('scheduled_emails')
					.update({
						status: 'completed',
						processed_at: new Date().toISOString(),
						emails_sent: result.sent,
						emails_failed: result.failed,
						error_log: errors
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
				await supabase
					.from('scheduled_emails')
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
};

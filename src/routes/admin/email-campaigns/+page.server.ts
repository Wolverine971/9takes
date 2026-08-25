// src/routes/admin/email-campaigns/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { generateEmailHtml } from '$lib/email/base-template';
import {
	ENNEAGRAM_TYPE_PROMPT_KEY,
	ENNEAGRAM_TYPE_PROMPT_VARIANTS
} from '$lib/email/enneagram-type-prompt-content';
import { prepareSequenceSend, type SequenceSendRow } from '$lib/email/sequences';
import { requireAdmin } from '$lib/server/adminAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import type {
	EmailCampaignDetailLink,
	EmailCampaignEnrollmentCounts,
	EmailCampaignMetrics,
	EmailCampaignOverview
} from '$lib/types/emailCampaign';

const CAMPAIGN_ORDER = [
	'welcome_sequence',
	'reactivation_cold',
	'reactivation_dormant',
	'reactivation_zombies',
	ENNEAGRAM_TYPE_PROMPT_KEY
];

const DETAIL_LINKS: Record<string, EmailCampaignDetailLink> = {
	welcome_sequence: '/admin/welcome-sequence',
	reactivation_cold: '/admin/reactivation-sequence',
	reactivation_dormant: '/admin/reactivation-sequence',
	reactivation_zombies: '/admin/reactivation-sequence',
	[ENNEAGRAM_TYPE_PROMPT_KEY]: '/admin/enneagram-campaign'
};

function emptyMetrics(): EmailCampaignMetrics {
	return { sent: 0, opened: 0, clicked: 0, unsubscribed: 0, bounced: 0 };
}

function emptyEnrollmentCounts(): EmailCampaignEnrollmentCounts {
	return {
		total: 0,
		active: 0,
		processing: 0,
		paused: 0,
		completed: 0,
		exited: 0,
		errored: 0
	};
}

function addSendToMetrics(metrics: EmailCampaignMetrics, send: any) {
	if (send.sent_at) metrics.sent += 1;
	if (send.opened_at) metrics.opened += 1;
	if (send.clicked_at) metrics.clicked += 1;
	if (send.unsubscribed_at) metrics.unsubscribed += 1;
	if (send.bounced_at || send.status === 'bounced') metrics.bounced += 1;
}

function renderPreview(content: {
	subject: string;
	preheader?: string;
	htmlContent: string;
	plainText: string;
}) {
	const htmlContent = content.htmlContent.replaceAll('{{first_name}}', 'Alex');
	const plainText = content.plainText.replaceAll('{{first_name}}', 'Alex');

	return {
		subject: content.subject.replaceAll('{{first_name}}', 'Alex'),
		preheader: content.preheader?.replaceAll('{{first_name}}', 'Alex') ?? null,
		plainText,
		previewHtml: generateEmailHtml({
			subject: content.subject.replaceAll('{{first_name}}', 'Alex'),
			preheader: content.preheader?.replaceAll('{{first_name}}', 'Alex'),
			content: htmlContent,
			recipientName: 'Alex',
			unsubscribeUrl: 'https://9takes.com/account/unsubscribe'
		})
	};
}

function prepareStepPreview(sequence: any, step: any) {
	const prepared = prepareSequenceSend({
		enrollment_id: 'campaign-preview',
		sequence_key: sequence.key,
		user_id: 'campaign-preview',
		recipient_email: 'alex@example.com',
		recipient_source: 'profiles',
		recipient_source_id: 'campaign-preview',
		recipient_name: 'Alex',
		enneagram: '8',
		enrolled_at: '2025-01-15T12:00:00.000Z',
		recipient_created_at: '2025-01-15T12:00:00.000Z',
		step_number: step.step_number,
		subject: step.subject,
		html_content: step.html_content,
		plain_text: step.plain_text
	} satisfies SequenceSendRow);

	return renderPreview({
		subject: prepared.subject,
		preheader: prepared.preheader,
		htmlContent: prepared.htmlContent,
		plainText: prepared.plainText ?? ''
	});
}

export const load: PageServerLoad = async ({ locals }) => {
	await requireAdmin(locals);
	const supabase = getSupabaseAdminClient() as any;
	const [sequencesResult, stepsResult, enrollmentsResult, sendsResult, suppressionsResult] =
		await Promise.all([
			supabase
				.from('email_sequences')
				.select('id, key, display_name, description, trigger_type, status, created_at, updated_at'),
			supabase
				.from('email_sequence_steps')
				.select(
					'id, sequence_id, step_number, delay_days_after_previous, subject, html_content, plain_text, updated_at'
				)
				.order('step_number', { ascending: true }),
			supabase.from('email_sequence_enrollments').select('sequence_id, status'),
			supabase
				.from('email_sends')
				.select(
					'sequence_id, sequence_step_number, status, sent_at, opened_at, clicked_at, unsubscribed_at, bounced_at'
				),
			supabase.from('email_unsubscribes').select('*', { count: 'exact', head: true })
		]);

	const firstError = [
		sequencesResult.error,
		stepsResult.error,
		enrollmentsResult.error,
		sendsResult.error,
		suppressionsResult.error
	].find(Boolean);

	if (firstError) {
		throw error(500, { message: `Unable to load email campaigns: ${firstError.message}` });
	}

	const stepsBySequence = new Map<string, any[]>();
	for (const step of stepsResult.data ?? []) {
		const steps = stepsBySequence.get(step.sequence_id) ?? [];
		steps.push(step);
		stepsBySequence.set(step.sequence_id, steps);
	}

	const enrollmentsBySequence = new Map<string, EmailCampaignEnrollmentCounts>();
	for (const enrollment of enrollmentsResult.data ?? []) {
		const counts = enrollmentsBySequence.get(enrollment.sequence_id) ?? emptyEnrollmentCounts();
		counts.total += 1;
		if (enrollment.status in counts && enrollment.status !== 'total') {
			counts[enrollment.status as keyof Omit<EmailCampaignEnrollmentCounts, 'total'>] += 1;
		}
		enrollmentsBySequence.set(enrollment.sequence_id, counts);
	}

	const metricsBySequence = new Map<string, EmailCampaignMetrics>();
	const metricsByStep = new Map<string, EmailCampaignMetrics>();
	for (const send of sendsResult.data ?? []) {
		if (!send.sequence_id) continue;
		const sequenceMetrics = metricsBySequence.get(send.sequence_id) ?? emptyMetrics();
		addSendToMetrics(sequenceMetrics, send);
		metricsBySequence.set(send.sequence_id, sequenceMetrics);

		if (send.sequence_step_number !== null) {
			const stepKey = `${send.sequence_id}:${send.sequence_step_number}`;
			const stepMetrics = metricsByStep.get(stepKey) ?? emptyMetrics();
			addSendToMetrics(stepMetrics, send);
			metricsByStep.set(stepKey, stepMetrics);
		}
	}

	const campaigns: EmailCampaignOverview[] = (sequencesResult.data ?? [])
		.sort((left: any, right: any) => {
			const leftIndex = CAMPAIGN_ORDER.indexOf(left.key);
			const rightIndex = CAMPAIGN_ORDER.indexOf(right.key);
			return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex);
		})
		.map((sequence: any) => {
			const dbSteps = stepsBySequence.get(sequence.id) ?? [];
			const emails =
				sequence.key === ENNEAGRAM_TYPE_PROMPT_KEY
					? ENNEAGRAM_TYPE_PROMPT_VARIANTS.map((variant) => ({
							id: `${sequence.key}:variant-${variant.id}`,
							label: variant.label,
							context: variant.angle,
							state: variant.state,
							stepNumber: 1,
							delayDays: 0,
							metrics:
								variant.state === 'pilot'
									? (metricsByStep.get(`${sequence.id}:1`) ?? emptyMetrics())
									: emptyMetrics(),
							...renderPreview(variant.content)
						}))
					: dbSteps.map((step: any) => ({
							id: `${sequence.key}:step-${step.step_number}`,
							label: `Email ${step.step_number}`,
							context:
								step.delay_days_after_previous === 0
									? 'Sends on enrollment'
									: `${step.delay_days_after_previous} day${step.delay_days_after_previous === 1 ? '' : 's'} after the previous email`,
							state: 'sequence',
							stepNumber: step.step_number,
							delayDays: step.delay_days_after_previous,
							metrics: metricsByStep.get(`${sequence.id}:${step.step_number}`) ?? emptyMetrics(),
							...prepareStepPreview(sequence, step)
						}));

			return {
				id: sequence.id,
				key: sequence.key,
				displayName: sequence.display_name,
				description: sequence.description,
				triggerType: sequence.trigger_type,
				status: sequence.status,
				updatedAt: sequence.updated_at,
				detailLink: DETAIL_LINKS[sequence.key] ?? '/admin/email-dashboard',
				metrics: metricsBySequence.get(sequence.id) ?? emptyMetrics(),
				enrollments: enrollmentsBySequence.get(sequence.id) ?? emptyEnrollmentCounts(),
				emails
			};
		});

	const totals = campaigns.reduce((summary: EmailCampaignMetrics, campaign) => {
		summary.sent += campaign.metrics.sent;
		summary.opened += campaign.metrics.opened;
		summary.clicked += campaign.metrics.clicked;
		summary.unsubscribed += campaign.metrics.unsubscribed;
		summary.bounced += campaign.metrics.bounced;
		return summary;
	}, emptyMetrics());

	return {
		campaigns,
		summary: {
			...totals,
			campaigns: campaigns.length,
			emails: campaigns.reduce((total: number, campaign: any) => total + campaign.emails.length, 0),
			suppressed: suppressionsResult.count ?? 0
		}
	};
};

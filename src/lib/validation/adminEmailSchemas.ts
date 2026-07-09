import { z } from 'zod';

const recipientSourceSchema = z.enum(['profiles', 'signups', 'coaching_waitlist']);

export const adminEmailRecipientSchema = z
	.object({
		id: z.string().min(1).max(200).optional(),
		email: z.string().trim().email().max(320),
		name: z.string().trim().max(200).nullable().optional(),
		source: recipientSourceSchema,
		source_id: z.string().max(200).nullable().optional(),
		enneagram: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9']).nullable().optional(),
		unsubscribed: z.boolean().optional(),
		created_at: z.string().datetime({ offset: true }).optional()
	})
	.transform((recipient) => ({
		...recipient,
		id: recipient.id || recipient.source_id || recipient.email
	}));

const recipientsSchema = z.array(adminEmailRecipientSchema).min(1).max(1000);
const subjectSchema = z.string().trim().min(1).max(200);
const htmlContentSchema = z.string().trim().min(1).max(250_000);
const campaignIdSchema = z.string().uuid().optional();

export const adminSendEmailSchema = z.object({
	recipients: recipientsSchema,
	subject: subjectSchema,
	html_content: htmlContentSchema,
	campaign_id: campaignIdSchema
});

export const adminScheduleEmailSchema = adminSendEmailSchema.extend({
	scheduled_for: z.string().datetime({ offset: true })
});

export const adminSaveEmailDraftSchema = z.object({
	id: z.string().uuid().optional(),
	subject: z.string().max(200).optional(),
	html_content: z.string().max(250_000).optional(),
	recipients: z.array(adminEmailRecipientSchema).max(1000).default([]),
	scheduled_for: z.string().datetime({ offset: true }).nullable().optional()
});

export const adminGenerateEmailSchema = z.object({
	instructions: z.string().trim().min(1).max(5000),
	context: z
		.object({
			recipient_count: z.number().int().min(0).max(1_000_000).optional(),
			audience_type: z.string().trim().min(1).max(100).optional(),
			tone: z.enum(['professional', 'friendly', 'casual']).optional()
		})
		.optional()
});

export const adminReactivationEnrollmentSchema = z.object({
	dryRun: z.boolean().default(true),
	limit: z.number().int().min(0).max(1000).optional(),
	buckets: z
		.array(z.enum(['cold', 'dormant', 'zombies']))
		.max(3)
		.transform((buckets) => [...new Set(buckets)])
		.optional()
});

export const adminScheduledEmailStatusSchema = z
	.enum(['pending', 'processing', 'completed', 'failed', 'cancelled'])
	.nullable();

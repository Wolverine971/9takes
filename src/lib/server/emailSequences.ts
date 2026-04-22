// src/lib/server/emailSequences.ts
import {
	getReactivationSequenceKeyForBucket,
	prepareSequenceSend,
	REACTIVATION_SEQUENCE_KEYS,
	WELCOME_SEQUENCE_KEY,
	type ReactivationBucket,
	type ReactivationSequenceKey,
	type SequenceSendRow
} from '$lib/email/sequences';
import { sendEmailWithTracking } from '$lib/email/sender';
import { getSuppressedEmailSet, normalizeEmail } from '$lib/email/suppression';
import { getSupabaseAdminClient } from './supabaseAdmin';

type SequenceProcessingSummary = {
	claimed: number;
	sent: number;
	skipped: number;
	errors: number;
};

type ReactivationEnrollmentOptions = {
	dryRun?: boolean;
	limit?: number;
	buckets?: ReactivationBucket[];
};

type ReactivationEnrollmentSummary = {
	dryRun: boolean;
	limit: number;
	enrolled: Record<ReactivationBucket, number>;
	candidates: Record<ReactivationBucket, number>;
	skipped: { reason: string; count: number }[];
	errors: { email: string; reason: string }[];
};

type ProfileCandidateRow = {
	id: string;
	email: string | null;
	first_name?: string | null;
	username?: string | null;
	enneagram?: string | null;
	created_at: string | null;
};

type ReactivationCandidate = {
	userId: string;
	email: string;
	bucket: ReactivationBucket;
	createdAt: string;
};

const REACTIVATION_BUCKET_ORDER: ReactivationBucket[] = ['dormant', 'cold', 'zombies'];
const REACTIVATION_SEQUENCE_KEY_SET = new Set<string>(REACTIVATION_SEQUENCE_KEYS);
const EMAIL_PATTERN = /\S+@\S+\.\S+/;

function getClaimedSequenceRows(data: SequenceSendRow[] | null | undefined) {
	return (data ?? []).filter((row) => row.sequence_key);
}

function incrementSkipped(
	skipped: Map<string, number>,
	reason: string,
	count = 1
): Map<string, number> {
	skipped.set(reason, (skipped.get(reason) ?? 0) + count);
	return skipped;
}

function normalizeLimit(limit: number | undefined): number {
	if (limit === undefined || !Number.isFinite(limit)) {
		return 50;
	}

	return Math.max(0, Math.floor(limit));
}

function getReactivationBucket(createdAt: string, now = new Date()): ReactivationBucket | 'fresh' {
	const createdDate = new Date(createdAt);
	if (Number.isNaN(createdDate.getTime())) {
		return 'fresh';
	}

	const ageMs = now.getTime() - createdDate.getTime();
	const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));

	if (ageDays < 30) {
		return 'fresh';
	}

	if (ageDays < 90) {
		return 'cold';
	}

	if (ageDays < 365) {
		return 'dormant';
	}

	return 'zombies';
}

function bucketAllowed(bucket: ReactivationBucket, allowedBuckets: Set<ReactivationBucket>) {
	return allowedBuckets.has(bucket);
}

function emptyBucketCounts(): Record<ReactivationBucket, number> {
	return {
		cold: 0,
		dormant: 0,
		zombies: 0
	};
}

function skippedArray(skipped: Map<string, number>) {
	return [...skipped.entries()].map(([reason, count]) => ({ reason, count }));
}

async function markEnrollmentErrored(enrollmentId: string, message: string) {
	const supabase = getSupabaseAdminClient() as any;

	await supabase
		.from('email_sequence_enrollments')
		.update({
			status: 'errored',
			next_send_at: null,
			processing_started_at: null,
			last_error: message.slice(0, 1000),
			updated_at: new Date().toISOString()
		})
		.eq('id', enrollmentId)
		.eq('status', 'processing');
}

async function exitUserFromSequence(userId: string, sequenceKey: string, reason: string) {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('exit_user_from_sequence', {
		p_user_id: userId,
		p_sequence_key: sequenceKey,
		p_reason: reason
	});

	if (error) {
		throw error;
	}

	return (data as number | null) ?? 0;
}

async function exitEmailFromSequence(email: string, sequenceKey: string, reason: string) {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('exit_email_from_sequence', {
		p_email: email,
		p_sequence_key: sequenceKey,
		p_reason: reason
	});

	if (error) {
		throw error;
	}

	return (data as number | null) ?? 0;
}

export async function enrollUserInWelcomeSequence(userId: string, email: string) {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('enroll_user_in_sequence', {
		p_user_id: userId,
		p_email: email,
		p_sequence_key: WELCOME_SEQUENCE_KEY,
		p_recipient_source: 'profiles',
		p_recipient_source_id: userId
	});

	if (error) {
		throw error;
	}

	return (data as string | null) ?? null;
}

export async function exitWelcomeSequenceForUser(userId: string, reason: string) {
	return exitUserFromSequence(userId, WELCOME_SEQUENCE_KEY, reason);
}

export async function exitWelcomeSequenceForEmail(email: string, reason: string) {
	return exitEmailFromSequence(email, WELCOME_SEQUENCE_KEY, reason);
}

export async function exitReactivationSequencesForEmail(email: string, reason: string) {
	let exited = 0;

	for (const sequenceKey of REACTIVATION_SEQUENCE_KEYS) {
		exited += await exitEmailFromSequence(email, sequenceKey, reason);
	}

	return exited;
}

export async function enrollDormantCandidatesInReactivationSequence(
	options: ReactivationEnrollmentOptions = {}
): Promise<ReactivationEnrollmentSummary> {
	const dryRun = options.dryRun ?? true;
	const limit = normalizeLimit(options.limit);
	const allowedBuckets = new Set(
		options.buckets?.length ? options.buckets : REACTIVATION_BUCKET_ORDER
	);
	const supabase = getSupabaseAdminClient() as any;
	const skipped = new Map<string, number>();
	const candidatesByEmail = new Map<string, ReactivationCandidate>();
	const candidates = emptyBucketCounts();
	const enrolled = emptyBucketCounts();
	const errors: ReactivationEnrollmentSummary['errors'] = [];

	const { data: profileRows, error: profileError } = await supabase
		.from('profiles')
		.select('id, email, first_name, username, enneagram, created_at')
		.not('email', 'is', null)
		.not('created_at', 'is', null);

	if (profileError) {
		throw profileError;
	}

	const profiles = (profileRows ?? []) as ProfileCandidateRow[];
	const normalizedEmails = profiles.map((profile) => normalizeEmail(profile.email));
	const suppressedEmails = await getSuppressedEmailSet(supabase, normalizedEmails);

	const { data: sequenceRows, error: sequenceError } = await supabase
		.from('email_sequences')
		.select('id, key')
		.in('key', [WELCOME_SEQUENCE_KEY, ...REACTIVATION_SEQUENCE_KEYS]);

	if (sequenceError) {
		throw sequenceError;
	}

	const sequenceIds = ((sequenceRows ?? []) as Array<{ id: string; key: string }>).map(
		(sequence) => sequence.id
	);
	const enrolledEmails = new Set<string>();

	if (sequenceIds.length > 0) {
		const { data: enrollmentRows, error: enrollmentError } = await supabase
			.from('email_sequence_enrollments')
			.select('recipient_email')
			.in('sequence_id', sequenceIds);

		if (enrollmentError) {
			throw enrollmentError;
		}

		for (const enrollment of (enrollmentRows ?? []) as Array<{ recipient_email?: string | null }>) {
			const normalized = normalizeEmail(enrollment.recipient_email);
			if (normalized) {
				enrolledEmails.add(normalized);
			}
		}
	}

	for (const profile of profiles) {
		const email = normalizeEmail(profile.email);

		if (!email || !EMAIL_PATTERN.test(email)) {
			incrementSkipped(skipped, 'invalid_email');
			continue;
		}

		if (!profile.created_at) {
			incrementSkipped(skipped, 'missing_created_at');
			continue;
		}

		if (suppressedEmails.has(email)) {
			incrementSkipped(skipped, 'suppressed');
			continue;
		}

		if (enrolledEmails.has(email)) {
			incrementSkipped(skipped, 'already_in_welcome_or_reactivation');
			continue;
		}

		const bucket = getReactivationBucket(profile.created_at);
		if (bucket === 'fresh') {
			incrementSkipped(skipped, 'fresh_under_30_days');
			continue;
		}

		if (!bucketAllowed(bucket, allowedBuckets)) {
			incrementSkipped(skipped, `bucket_not_requested_${bucket}`);
			continue;
		}

		const existing = candidatesByEmail.get(email);
		if (existing) {
			incrementSkipped(skipped, 'duplicate_profile_email');
			if (new Date(profile.created_at).getTime() >= new Date(existing.createdAt).getTime()) {
				continue;
			}
		}

		candidatesByEmail.set(email, {
			userId: profile.id,
			email,
			bucket,
			createdAt: profile.created_at
		});
	}

	for (const candidate of candidatesByEmail.values()) {
		candidates[candidate.bucket]++;
	}

	const orderedCandidates = REACTIVATION_BUCKET_ORDER.flatMap((bucket) =>
		[...candidatesByEmail.values()]
			.filter((candidate) => candidate.bucket === bucket)
			.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
	).slice(0, limit);

	if (dryRun) {
		return {
			dryRun,
			limit,
			enrolled,
			candidates,
			skipped: skippedArray(skipped),
			errors
		};
	}

	for (const candidate of orderedCandidates) {
		const sequenceKey: ReactivationSequenceKey = getReactivationSequenceKeyForBucket(
			candidate.bucket
		);

		if (!REACTIVATION_SEQUENCE_KEY_SET.has(sequenceKey)) {
			errors.push({ email: candidate.email, reason: `Unknown sequence for ${candidate.bucket}` });
			continue;
		}

		const { error } = await supabase.rpc('enroll_user_in_sequence', {
			p_user_id: candidate.userId,
			p_email: candidate.email,
			p_sequence_key: sequenceKey,
			p_recipient_source: 'profiles',
			p_recipient_source_id: candidate.userId
		});

		if (error) {
			errors.push({ email: candidate.email, reason: error.message || 'Enrollment failed' });
			continue;
		}

		enrolled[candidate.bucket]++;
	}

	return {
		dryRun,
		limit,
		enrolled,
		candidates,
		skipped: skippedArray(skipped),
		errors
	};
}

async function processClaimedSequenceSends(
	supabase: any,
	claimed: SequenceSendRow[]
): Promise<SequenceProcessingSummary> {
	if (claimed.length === 0) {
		return { claimed: 0, sent: 0, skipped: 0, errors: 0 };
	}

	const suppressedEmails = await getSuppressedEmailSet(
		supabase,
		claimed.map((row) => row.recipient_email)
	);
	const summary: SequenceProcessingSummary = {
		claimed: claimed.length,
		sent: 0,
		skipped: 0,
		errors: 0
	};

	for (const row of claimed) {
		const normalizedEmail = normalizeEmail(row.recipient_email);

		if (suppressedEmails.has(normalizedEmail)) {
			try {
				await exitEmailFromSequence(row.recipient_email, row.sequence_key, 'unsubscribed');
				summary.skipped++;
			} catch (suppressionError) {
				console.error(
					'Failed to exit suppressed sequence enrollment',
					row.enrollment_id,
					suppressionError
				);
				await supabase.rpc('retry_or_fail_sequence_send', {
					p_enrollment_id: row.enrollment_id,
					p_error: 'Suppressed recipient could not be exited before send'
				});
				summary.errors++;
			}
			continue;
		}

		const prepared = prepareSequenceSend(row);
		let emailSent = false;

		try {
			const sendResult = await sendEmailWithTracking(supabase, {
				recipient: prepared.recipient,
				subject: prepared.subject,
				preheader: prepared.preheader,
				htmlContent: prepared.htmlContent,
				plainTextContent: prepared.plainText,
				sentBy: null,
				includeFooter: true
			});

			if (!sendResult.success) {
				await supabase.rpc('retry_or_fail_sequence_send', {
					p_enrollment_id: row.enrollment_id,
					p_error: sendResult.error || 'Failed to send sequence email'
				});
				summary.errors++;
				continue;
			}

			emailSent = true;

			const { error: finalizeError } = await supabase.rpc('complete_sequence_send', {
				p_enrollment_id: row.enrollment_id,
				p_email_send_id: sendResult.emailSend?.id ?? null
			});

			if (finalizeError) {
				console.error(
					'Failed to finalize sequence send after delivery',
					row.enrollment_id,
					finalizeError
				);
				await markEnrollmentErrored(
					row.enrollment_id,
					'Email sent successfully, but sequence advancement failed'
				);
				summary.errors++;
				continue;
			}

			summary.sent++;
		} catch (sendError) {
			console.error('Unexpected sequence send error', row.enrollment_id, sendError);

			if (emailSent) {
				await markEnrollmentErrored(
					row.enrollment_id,
					'Email sent successfully, but sequence processing crashed before completion'
				);
			} else {
				await supabase.rpc('retry_or_fail_sequence_send', {
					p_enrollment_id: row.enrollment_id,
					p_error:
						sendError instanceof Error ? sendError.message : 'Unexpected sequence processing error'
				});
			}

			summary.errors++;
		}
	}

	return summary;
}

export async function processPendingSequenceSends(limit = 10): Promise<SequenceProcessingSummary> {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('claim_pending_sequence_sends', {
		p_limit: limit
	});

	if (error) {
		throw error;
	}

	return processClaimedSequenceSends(
		supabase,
		getClaimedSequenceRows(data as SequenceSendRow[] | null)
	);
}

export async function processSequenceEnrollmentNow(
	enrollmentId: string
): Promise<SequenceProcessingSummary> {
	const supabase = getSupabaseAdminClient() as any;
	const { data, error } = await supabase.rpc('claim_specific_sequence_send', {
		p_enrollment_id: enrollmentId
	});

	if (error) {
		throw error;
	}

	return processClaimedSequenceSends(
		supabase,
		getClaimedSequenceRows(data as SequenceSendRow[] | null)
	);
}

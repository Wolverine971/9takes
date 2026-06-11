// src/routes/admin/reactivation-sequence/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { generateEmailHtml } from '$lib/email/base-template';
import {
	getReactivationTemplateOverrideState,
	prepareSequenceSend,
	REACTIVATION_COLD_KEY,
	REACTIVATION_DORMANT_KEY,
	REACTIVATION_SEQUENCE_KEYS,
	REACTIVATION_ZOMBIES_KEY,
	type ReactivationBucket,
	type ReactivationSequenceKey,
	type SequenceSendRow
} from '$lib/email/sequences';
import {
	getReactivationStep,
	REACTIVATION_STEP_2_FINAL
} from '$lib/email/reactivation-sequence-content';
import { sendEmail } from '$lib/email/sender';
import { normalizeEmail } from '$lib/email/suppression';
import { enrollDormantCandidatesInReactivationSequence } from '$lib/server/emailSequences';
import { logger } from '$lib/utils/logger';

const TEST_UNSUBSCRIBE_URL = 'https://9takes.com/api/track/unsubscribe/test-preview';
const WELCOME_SEQUENCE_KEY = 'welcome_sequence';
const EMAIL_PATTERN = /\S+@\S+\.\S+/;

const BUCKET_LABELS: Record<ReactivationBucket, string> = {
	cold: 'Cold',
	dormant: 'Dormant',
	zombies: 'Zombies'
};

const SEQUENCE_TO_BUCKET: Record<ReactivationSequenceKey, ReactivationBucket> = {
	[REACTIVATION_COLD_KEY]: 'cold',
	[REACTIVATION_DORMANT_KEY]: 'dormant',
	[REACTIVATION_ZOMBIES_KEY]: 'zombies'
};

type SequenceRow = {
	id: string;
	key: ReactivationSequenceKey;
	display_name: string;
	description: string | null;
	status: string;
	trigger_type: string;
	updated_at: string | null;
};

type DbStepRow = {
	id: string;
	sequence_id: string;
	step_number: number;
	subject: string;
	html_content: string;
	plain_text: string | null;
	delay_days_after_previous: number;
	updated_at: string | null;
};

type EnrollmentRow = {
	id: string;
	sequence_id: string;
	user_id: string | null;
	recipient_email: string;
	recipient_source: string;
	recipient_source_id: string;
	status: string;
	current_step_number: number;
	next_step_number: number | null;
	enrolled_at: string;
	next_send_at: string | null;
	last_sent_at: string | null;
	exit_reason: string | null;
	failure_count: number;
	last_error: string | null;
	updated_at: string | null;
};

type ProfileCandidateRow = {
	id: string;
	email: string | null;
	first_name: string | null;
	username: string | null;
	enneagram: string | null;
	created_at: string | null;
};

type CandidatePreview = {
	userId: string;
	email: string;
	name: string;
	bucket: ReactivationBucket;
	created_at: string;
	age_days: number;
	recommended_batch: string;
	first_send_timing: string;
};

type CandidatePreviewSummary = {
	candidates: CandidatePreview[];
	counts: Record<ReactivationBucket, number>;
	skipped: { reason: string; count: number }[];
	totalEligible: number;
	totalProfilesChecked: number;
};

function isReactivationSequenceKey(value: string): value is ReactivationSequenceKey {
	return REACTIVATION_SEQUENCE_KEYS.includes(value as ReactivationSequenceKey);
}

function emptyBucketCounts(): Record<ReactivationBucket, number> {
	return {
		cold: 0,
		dormant: 0,
		zombies: 0
	};
}

function incrementSkipped(skipped: Map<string, number>, reason: string) {
	skipped.set(reason, (skipped.get(reason) ?? 0) + 1);
}

function getReactivationBucket(createdAt: string, now = new Date()): ReactivationBucket | 'fresh' {
	const createdDate = new Date(createdAt);
	if (Number.isNaN(createdDate.getTime())) {
		return 'fresh';
	}

	const ageDays = Math.floor((now.getTime() - createdDate.getTime()) / (24 * 60 * 60 * 1000));
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

function ageDays(createdAt: string, now = new Date()) {
	return Math.max(
		0,
		Math.floor((now.getTime() - new Date(createdAt).getTime()) / (24 * 60 * 60 * 1000))
	);
}

function recommendedBatch(bucket: ReactivationBucket, bucketIndex: number) {
	if (bucket === 'dormant') {
		return bucketIndex < 33 ? 'Batch 1 - Dormant first half' : 'Batch 2 - Dormant remainder';
	}

	if (bucket === 'cold') {
		return 'Batch 3 - Cold';
	}

	if (bucketIndex < 25) {
		return 'Batch 4 - Zombies first third';
	}

	return bucketIndex < 50 ? 'Batch 5 - Zombies second third' : 'Batch 6 - Zombies final third';
}

function buildPreviewSequenceRow({
	sequenceKey,
	step,
	email,
	name,
	userId,
	recipientCreatedAt
}: {
	sequenceKey: ReactivationSequenceKey;
	step: DbStepRow;
	email: string;
	name: string;
	userId: string;
	recipientCreatedAt: string;
}): SequenceSendRow {
	return {
		enrollment_id: 'preview',
		sequence_key: sequenceKey,
		user_id: userId,
		recipient_email: email,
		recipient_source: 'profiles',
		recipient_source_id: userId,
		recipient_name: name,
		enneagram: null,
		enrolled_at: new Date().toISOString(),
		recipient_created_at: recipientCreatedAt,
		step_number: step.step_number,
		subject: step.subject,
		html_content: step.html_content,
		plain_text: step.plain_text
	};
}

function monthsAgo(months: number) {
	const date = new Date();
	date.setUTCMonth(date.getUTCMonth() - months);
	return date.toISOString();
}

function sampleCreatedAt(sequenceKey: ReactivationSequenceKey) {
	const bucket = SEQUENCE_TO_BUCKET[sequenceKey];
	if (bucket === 'cold') {
		return monthsAgo(2);
	}

	if (bucket === 'dormant') {
		return monthsAgo(7);
	}

	return monthsAgo(18);
}

function editableStepContent(step: DbStepRow, sequenceKey: ReactivationSequenceKey) {
	const managed = getReactivationStep(sequenceKey, step.step_number);
	const overrides = getReactivationTemplateOverrideState({
		sequence_key: sequenceKey,
		subject: step.subject,
		html_content: step.html_content,
		plain_text: step.plain_text
	});

	return {
		subject: overrides.subject ? step.subject : (managed?.subject ?? step.subject),
		html_content: overrides.htmlContent
			? step.html_content
			: (managed?.htmlContent ?? step.html_content),
		plain_text: overrides.plainText ? step.plain_text : (managed?.plainText ?? step.plain_text),
		overrides
	};
}

function cumulativeOffsets(steps: DbStepRow[]) {
	let running = 0;
	const offsets = new Map<number, number>();

	for (const step of [...steps].sort((a, b) => a.step_number - b.step_number)) {
		running += step.delay_days_after_previous;
		offsets.set(step.step_number, running);
	}

	return offsets;
}

async function assertAdmin(locals: App.Locals) {
	const session = locals.session;
	const supabase = locals.supabase;

	if (!session?.user?.id) {
		throw redirect(302, '/questions');
	}

	const { data: profile, error } = await supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (error || !profile?.admin) {
		throw redirect(307, '/questions');
	}

	return session;
}

async function buildCandidatePreview(
	supabase: App.Locals['supabase']
): Promise<CandidatePreviewSummary> {
	const skipped = new Map<string, number>();
	const counts = emptyBucketCounts();
	const candidatesByEmail = new Map<string, CandidatePreview>();
	const now = new Date();

	const [profilesResult, unsubscribesResult, sequenceRowsResult] = await Promise.all([
		supabase
			.from('profiles')
			.select('id, email, first_name, username, enneagram, created_at')
			.not('email', 'is', null)
			.not('created_at', 'is', null),
		supabase.from('email_unsubscribes').select('email'),
		supabase
			.from('email_sequences')
			.select('id, key')
			.in('key', [WELCOME_SEQUENCE_KEY, ...REACTIVATION_SEQUENCE_KEYS])
	]);

	if (profilesResult.error) {
		throw profilesResult.error;
	}
	if (unsubscribesResult.error) {
		throw unsubscribesResult.error;
	}
	if (sequenceRowsResult.error) {
		throw sequenceRowsResult.error;
	}

	const suppressedEmails = new Set(
		(unsubscribesResult.data ?? [])
			.map((row) => normalizeEmail(row.email))
			.filter((email): email is string => Boolean(email))
	);
	const sequenceIds = (sequenceRowsResult.data ?? []).map((sequence) => sequence.id);
	const enrolledEmails = new Set<string>();

	if (sequenceIds.length > 0) {
		const { data: enrollments, error } = await supabase
			.from('email_sequence_enrollments')
			.select('recipient_email')
			.in('sequence_id', sequenceIds);

		if (error) {
			throw error;
		}

		for (const enrollment of enrollments ?? []) {
			const email = normalizeEmail(enrollment.recipient_email);
			if (email) {
				enrolledEmails.add(email);
			}
		}
	}

	for (const profile of (profilesResult.data ?? []) as ProfileCandidateRow[]) {
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

		const bucket = getReactivationBucket(profile.created_at, now);
		if (bucket === 'fresh') {
			incrementSkipped(skipped, 'fresh_under_30_days');
			continue;
		}

		const existing = candidatesByEmail.get(email);
		if (existing) {
			incrementSkipped(skipped, 'duplicate_profile_email');
			if (new Date(profile.created_at).getTime() >= new Date(existing.created_at).getTime()) {
				continue;
			}
		}

		candidatesByEmail.set(email, {
			userId: profile.id,
			email,
			name: profile.first_name?.trim() || profile.username?.trim() || 'there',
			bucket,
			created_at: profile.created_at,
			age_days: ageDays(profile.created_at, now),
			recommended_batch: '',
			first_send_timing: 'Email 1 queues immediately when enrolled'
		});
	}

	for (const candidate of candidatesByEmail.values()) {
		counts[candidate.bucket]++;
	}

	const orderedCandidates = (['dormant', 'cold', 'zombies'] as ReactivationBucket[]).flatMap(
		(bucket) =>
			[...candidatesByEmail.values()]
				.filter((candidate) => candidate.bucket === bucket)
				.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
				.map((candidate, index) => ({
					...candidate,
					recommended_batch: recommendedBatch(bucket, index)
				}))
	);

	return {
		candidates: orderedCandidates.slice(0, 200),
		counts,
		totalEligible: orderedCandidates.length,
		totalProfilesChecked: profilesResult.data?.length ?? 0,
		skipped: [...skipped.entries()].map(([reason, count]) => ({ reason, count }))
	};
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = await assertAdmin(locals);
	const supabase = locals.supabase;

	const { data: sequenceData, error: sequenceError } = await supabase
		.from('email_sequences')
		.select('id, key, display_name, description, status, trigger_type, updated_at')
		.in('key', REACTIVATION_SEQUENCE_KEYS)
		.order('key', { ascending: true });

	if (sequenceError) {
		throw sequenceError;
	}

	const sequences = ((sequenceData ?? []) as SequenceRow[]).filter((sequence) =>
		isReactivationSequenceKey(sequence.key)
	);
	const sequenceIds = sequences.map((sequence) => sequence.id);
	const sequenceById = new Map(sequences.map((sequence) => [sequence.id, sequence]));

	const [stepsResult, enrollmentsResult, candidatePreview] = await Promise.all([
		sequenceIds.length
			? supabase
					.from('email_sequence_steps')
					.select(
						'id, sequence_id, step_number, subject, html_content, plain_text, delay_days_after_previous, updated_at'
					)
					.in('sequence_id', sequenceIds)
					.order('step_number', { ascending: true })
			: Promise.resolve({ data: [], error: null }),
		sequenceIds.length
			? supabase
					.from('email_sequence_enrollments')
					.select(
						'id, sequence_id, user_id, recipient_email, recipient_source, recipient_source_id, status, current_step_number, next_step_number, enrolled_at, next_send_at, last_sent_at, exit_reason, failure_count, last_error, updated_at'
					)
					.in('sequence_id', sequenceIds)
					.order('next_send_at', { ascending: true })
			: Promise.resolve({ data: [], error: null }),
		buildCandidatePreview(supabase)
	]);

	if (stepsResult.error) {
		throw stepsResult.error;
	}
	if (enrollmentsResult.error) {
		throw enrollmentsResult.error;
	}

	const steps = (stepsResult.data ?? []) as DbStepRow[];
	const representativeSteps = steps.filter((step) => {
		const sequence = sequenceById.get(step.sequence_id);
		return sequence?.key === REACTIVATION_DORMANT_KEY;
	});
	const offsets = cumulativeOffsets(representativeSteps);
	const stepsBySequenceAndNumber = new Map(
		steps.map((step) => [`${sequenceById.get(step.sequence_id)?.key}:${step.step_number}`, step])
	);

	const editorItems = steps
		.filter((step) => {
			const sequence = sequenceById.get(step.sequence_id);
			return (
				Boolean(sequence) && (step.step_number === 1 || sequence?.key === REACTIVATION_DORMANT_KEY)
			);
		})
		.sort((a, b) => {
			if (a.step_number !== b.step_number) {
				return a.step_number - b.step_number;
			}

			const aKey = sequenceById.get(a.sequence_id)?.key ?? '';
			const bKey = sequenceById.get(b.sequence_id)?.key ?? '';
			return aKey.localeCompare(bKey);
		})
		.map((step) => {
			const sequence = sequenceById.get(step.sequence_id)!;
			const sequenceKey = sequence.key;
			const editable = editableStepContent(step, sequenceKey);
			const prepared = prepareSequenceSend(
				buildPreviewSequenceRow({
					sequenceKey,
					step,
					email: 'preview@9takes.com',
					name: 'DJ',
					userId: session.user.id,
					recipientCreatedAt: sampleCreatedAt(sequenceKey)
				})
			);

			return {
				id: step.id,
				editor_key:
					step.step_number === 1
						? `${sequenceKey}:1`
						: `${REACTIVATION_DORMANT_KEY}:${step.step_number}`,
				sequence_id: step.sequence_id,
				sequence_key: sequenceKey,
				bucket: SEQUENCE_TO_BUCKET[sequenceKey],
				bucket_label: BUCKET_LABELS[SEQUENCE_TO_BUCKET[sequenceKey]],
				step_number: step.step_number,
				is_shared: step.step_number > 1,
				title:
					step.step_number === 1
						? `Step 1 - ${BUCKET_LABELS[SEQUENCE_TO_BUCKET[sequenceKey]]}`
						: `Step ${step.step_number} - Shared`,
				delay_days_after_previous: step.delay_days_after_previous,
				cumulative_days_after_enrollment: offsets.get(step.step_number) ?? 0,
				subject: editable.subject,
				html_content: editable.html_content,
				plain_text: editable.plain_text,
				preheader: prepared.preheader,
				effective_subject: prepared.subject,
				effective_html_content: prepared.htmlContent,
				effective_plain_text: prepared.plainText,
				preview_html: generateEmailHtml({
					subject: prepared.subject,
					preheader: prepared.preheader,
					content: prepared.htmlContent,
					recipientName: 'DJ',
					unsubscribeUrl: TEST_UNSUBSCRIBE_URL,
					includeFooter: true
				}),
				overrides: editable.overrides,
				updated_at: step.updated_at
			};
		});

	const enrollmentRows = (enrollmentsResult.data ?? []) as EnrollmentRow[];
	const queueUserIds = [
		...new Set(enrollmentRows.map((enrollment) => enrollment.user_id).filter(Boolean))
	] as string[];
	const profileById = new Map<
		string,
		{ created_at: string | null; first_name: string | null; username: string | null }
	>();

	if (queueUserIds.length > 0) {
		const { data: queueProfiles, error: queueProfilesError } = await supabase
			.from('profiles')
			.select('id, created_at, first_name, username')
			.in('id', queueUserIds);

		if (queueProfilesError) {
			throw queueProfilesError;
		}

		for (const profile of queueProfiles ?? []) {
			profileById.set(profile.id, {
				created_at: profile.created_at,
				first_name: profile.first_name,
				username: profile.username
			});
		}
	}

	const queue = enrollmentRows
		.filter((enrollment) => {
			return (
				(enrollment.status === 'active' || enrollment.status === 'processing') &&
				enrollment.next_step_number !== null &&
				enrollment.next_send_at !== null
			);
		})
		.map((enrollment) => {
			const sequence = sequenceById.get(enrollment.sequence_id);
			const sequenceKey = sequence?.key;
			const profile = enrollment.user_id ? profileById.get(enrollment.user_id) : null;
			const nextStep =
				sequenceKey && enrollment.next_step_number
					? stepsBySequenceAndNumber.get(`${sequenceKey}:${enrollment.next_step_number}`)
					: null;
			const prepared =
				sequenceKey && nextStep
					? prepareSequenceSend(
							buildPreviewSequenceRow({
								sequenceKey,
								step: nextStep,
								email: enrollment.recipient_email,
								name: profile?.first_name?.trim() || profile?.username?.trim() || 'there',
								userId: enrollment.recipient_source_id,
								recipientCreatedAt: profile?.created_at ?? enrollment.enrolled_at
							})
						)
					: null;

			return {
				...enrollment,
				sequence_key: sequenceKey ?? '',
				bucket: sequenceKey ? SEQUENCE_TO_BUCKET[sequenceKey] : null,
				next_step_subject: prepared?.subject ?? `Step ${enrollment.next_step_number}`,
				next_step_preheader: prepared?.preheader,
				due_now: enrollment.next_send_at
					? new Date(enrollment.next_send_at).getTime() <= Date.now()
					: false
			};
		});

	const enrollmentCounts = {
		total: enrollmentRows.length,
		active: enrollmentRows.filter((row) => row.status === 'active').length,
		processing: enrollmentRows.filter((row) => row.status === 'processing').length,
		completed: enrollmentRows.filter((row) => row.status === 'completed').length,
		exited: enrollmentRows.filter((row) => row.status === 'exited').length,
		errored: enrollmentRows.filter((row) => row.status === 'errored').length,
		rePermissioned: enrollmentRows.filter((row) => row.exit_reason === 're_permissioned').length,
		reactivatedClick: enrollmentRows.filter((row) => row.exit_reason === 'reactivated_click').length
	};
	const step2Items = editorItems.filter((step) => step.step_number === 2);
	const copyReadiness = {
		// Ready when the code-managed step 2 copy is final, or every bucket has a
		// saved DB override (the original pre-finalization path).
		step2Saved:
			REACTIVATION_STEP_2_FINAL ||
			(step2Items.length > 0 && step2Items.every((step) => step.overrides.htmlContent))
	};

	return {
		adminEmail: session.user.email ?? '',
		sequences,
		steps: editorItems,
		candidatePreview,
		enrollments: enrollmentRows,
		queue,
		enrollmentCounts,
		copyReadiness
	};
};

function parseBuckets(formData: FormData): ReactivationBucket[] {
	const buckets = formData
		.getAll('buckets')
		.map(String)
		.filter((bucket): bucket is ReactivationBucket =>
			(['cold', 'dormant', 'zombies'] as string[]).includes(bucket)
		);

	return [...new Set(buckets)];
}

async function getSequenceIdsForUpdate(
	supabase: App.Locals['supabase'],
	sequenceKey: ReactivationSequenceKey,
	stepNumber: number
) {
	const keys = stepNumber > 1 ? REACTIVATION_SEQUENCE_KEYS : [sequenceKey];
	const { data, error } = await supabase.from('email_sequences').select('id, key').in('key', keys);

	if (error) {
		throw error;
	}

	return (data ?? []).map((sequence) => sequence.id);
}

export const actions: Actions = {
	saveStep: async ({ request, locals }) => {
		await assertAdmin(locals);
		const supabase = locals.supabase;
		const formData = await request.formData();
		const sequenceKey = String(formData.get('sequenceKey') || '');
		const stepNumber = Number.parseInt(String(formData.get('stepNumber') || ''), 10);
		const subject = String(formData.get('subject') || '').trim();
		const htmlContent = String(formData.get('htmlContent') || '').trim();
		const plainTextValue = String(formData.get('plainText') || '').trim();

		if (!isReactivationSequenceKey(sequenceKey)) {
			return fail(400, { error: 'Invalid reactivation sequence key' });
		}

		if (!Number.isInteger(stepNumber) || stepNumber < 1 || stepNumber > 5) {
			return fail(400, { error: 'Invalid step number' });
		}

		if (!subject || !htmlContent) {
			return fail(400, { error: 'Subject and HTML content are required' });
		}

		const sequenceIds = await getSequenceIdsForUpdate(supabase, sequenceKey, stepNumber);
		if (sequenceIds.length === 0) {
			return fail(404, { error: 'Sequence rows not found' });
		}

		const { error } = await supabase
			.from('email_sequence_steps')
			.update({
				subject,
				html_content: htmlContent,
				plain_text: plainTextValue || null,
				updated_at: new Date().toISOString()
			})
			.in('sequence_id', sequenceIds)
			.eq('step_number', stepNumber);

		if (error) {
			return fail(500, { error: error.message || 'Failed to save reactivation email copy' });
		}

		return {
			success: true,
			message:
				stepNumber > 1
					? `Saved shared Step ${stepNumber} across all reactivation buckets`
					: `Saved Step 1 for ${BUCKET_LABELS[SEQUENCE_TO_BUCKET[sequenceKey]]}`
		};
	},

	updateStatus: async ({ request, locals }) => {
		await assertAdmin(locals);
		const supabase = locals.supabase;
		const formData = await request.formData();
		const status = String(formData.get('status') || '');
		const confirmation = String(formData.get('confirmation') || '').trim();

		if (!['draft', 'active', 'paused'].includes(status)) {
			return fail(400, { error: 'Invalid sequence status' });
		}

		if (status === 'active' && confirmation !== 'ACTIVE') {
			return fail(400, { error: 'Type ACTIVE to activate the reactivation sequences' });
		}

		if (status === 'active' && !REACTIVATION_STEP_2_FINAL) {
			const sequenceIds = await getSequenceIdsForUpdate(supabase, REACTIVATION_DORMANT_KEY, 2);
			const { data: step2Rows, error: step2Error } = await supabase
				.from('email_sequence_steps')
				.select('subject, html_content, plain_text')
				.in('sequence_id', sequenceIds)
				.eq('step_number', 2);

			if (step2Error) {
				return fail(500, { error: step2Error.message || 'Failed to verify Step 2 copy' });
			}

			const step2Ready =
				(step2Rows ?? []).length === 3 &&
				(step2Rows ?? []).every((row) => {
					return getReactivationTemplateOverrideState({
						sequence_key: REACTIVATION_DORMANT_KEY,
						subject: row.subject,
						html_content: row.html_content,
						plain_text: row.plain_text
					}).htmlContent;
				});

			if (!step2Ready) {
				return fail(400, {
					error: 'Save final Step 2 copy in the editor before activating the reactivation sequence'
				});
			}
		}

		const { error } = await supabase
			.from('email_sequences')
			.update({ status, updated_at: new Date().toISOString() })
			.in('key', REACTIVATION_SEQUENCE_KEYS);

		if (error) {
			return fail(500, { error: error.message || 'Failed to update reactivation sequence status' });
		}

		return { success: true, message: `Reactivation sequences set to ${status}` };
	},

	enrollCandidates: async ({ request, locals }) => {
		await assertAdmin(locals);
		const formData = await request.formData();
		const limit = Math.max(0, Number.parseInt(String(formData.get('limit') || '10'), 10) || 10);
		const buckets = parseBuckets(formData);
		const confirmation = String(formData.get('confirmation') || '').trim();

		if (confirmation !== 'ENROLL') {
			return fail(400, { error: 'Type ENROLL to queue reactivation candidates' });
		}

		if (buckets.length === 0) {
			return fail(400, { error: 'Select at least one bucket' });
		}

		try {
			const summary = await enrollDormantCandidatesInReactivationSequence({
				dryRun: false,
				limit,
				buckets
			});

			return {
				success: true,
				message: `Queued ${summary.enrolled.cold + summary.enrolled.dormant + summary.enrolled.zombies} reactivation enrollment${summary.enrolled.cold + summary.enrolled.dormant + summary.enrolled.zombies === 1 ? '' : 's'}`,
				summary
			};
		} catch (enrollmentError) {
			const message =
				enrollmentError instanceof Error ? enrollmentError.message : 'Failed to enroll candidates';
			return fail(500, { error: message });
		}
	},

	sendTestReactivationEmail: async ({ request, locals }) => {
		const session = await assertAdmin(locals);
		const supabase = locals.supabase;
		const formData = await request.formData();
		const email = String(formData.get('testEmail') || '')
			.trim()
			.toLowerCase();
		const sequenceKey = String(formData.get('sequenceKey') || '');
		const stepNumber = Number.parseInt(String(formData.get('stepNumber') || '1'), 10);

		if (!email || !EMAIL_PATTERN.test(email)) {
			return fail(400, { error: 'Enter a valid test email address' });
		}

		if (!isReactivationSequenceKey(sequenceKey)) {
			return fail(400, { error: 'Invalid reactivation sequence key' });
		}

		const { data: sequence, error: sequenceError } = await supabase
			.from('email_sequences')
			.select('id, key')
			.eq('key', sequenceKey)
			.maybeSingle();

		if (sequenceError || !sequence) {
			return fail(404, { error: 'Reactivation sequence not found' });
		}

		const { data: step, error: stepError } = await supabase
			.from('email_sequence_steps')
			.select(
				'id, sequence_id, step_number, subject, html_content, plain_text, delay_days_after_previous, updated_at'
			)
			.eq('sequence_id', sequence.id)
			.eq('step_number', stepNumber)
			.maybeSingle();

		if (stepError || !step) {
			return fail(404, { error: 'Reactivation step not found' });
		}

		const prepared = prepareSequenceSend(
			buildPreviewSequenceRow({
				sequenceKey,
				step: step as DbStepRow,
				email,
				name: 'there',
				userId: session.user.id,
				recipientCreatedAt: sampleCreatedAt(sequenceKey)
			})
		);

		const result = await sendEmail({
			to: email,
			subject: `[TEST] ${prepared.subject}`,
			preheader: prepared.preheader,
			htmlContent: prepared.htmlContent,
			plainTextContent: prepared.plainText,
			recipientName: 'there',
			unsubscribeUrl: TEST_UNSUBSCRIBE_URL,
			includeFooter: true
		});

		if (!result.success) {
			logger.error('Failed to send reactivation sequence test email', new Error(result.error), {
				email,
				stepNumber,
				sequenceKey,
				adminId: session.user.id
			});
			return fail(500, { error: result.error || 'Failed to send test reactivation email' });
		}

		return {
			success: true,
			message: `Sent Step ${stepNumber} test to ${email}`,
			email,
			stepNumber,
			sequenceKey
		};
	}
};

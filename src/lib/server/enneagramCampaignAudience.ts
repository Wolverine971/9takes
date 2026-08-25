// src/lib/server/enneagramCampaignAudience.ts
import type { User } from '@supabase/supabase-js';

import { normalizeEmail } from '$lib/email/suppression';
import { ENNEAGRAM_TYPE_PROMPT_EMAIL_BUFFER_DAYS } from '$lib/email/enneagram-type-prompt-content';

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVE_SEQUENCE_STATUSES = new Set(['active', 'processing', 'paused']);

export const ENNEAGRAM_CAMPAIGN_HOLD_LABELS = {
	ready: 'Ready now',
	suppressed: 'Suppressed',
	unconfirmed: 'Email unconfirmed',
	admin: 'Admin account',
	recent: 'Joined in the last 7 days',
	active_sequence: 'Already in an email sequence',
	recent_email: 'Emailed in the last 7 days',
	invalid_email: 'Invalid email address',
	duplicate_email: 'Duplicate email address'
} as const;

export type EnneagramCampaignStatus = keyof typeof ENNEAGRAM_CAMPAIGN_HOLD_LABELS;

export type EnneagramCampaignProfile = {
	id: string;
	email: string | null;
	first_name: string | null;
	last_name: string | null;
	username: string | null;
	enneagram: string | null;
	created_at: string | null;
	admin: boolean | null;
};

export type EnneagramCampaignAudienceRow = {
	id: string;
	email: string;
	name: string;
	createdAt: string | null;
	storedEnneagram: string | null;
	lastEmailSentAt: string | null;
	status: EnneagramCampaignStatus;
	statusLabel: string;
};

export type EnneagramCampaignAudience = {
	rows: EnneagramCampaignAudienceRow[];
	counts: Record<EnneagramCampaignStatus, number>;
	totalProfiles: number;
	totalWithType: number;
	totalMissingType: number;
	totalHeld: number;
};

type SequenceEnrollment = {
	user_id: string;
	status: string;
};

type SuppressionRow = {
	email: string | null;
};

type EmailSendRow = {
	recipient_email: string | null;
	sent_at: string | null;
};

type AudienceInputs = {
	profiles: EnneagramCampaignProfile[];
	authUsers: User[];
	unsubscribes: SuppressionRow[];
	legacyOptOuts: SuppressionRow[];
	sequenceEnrollments: SequenceEnrollment[];
	emailSends: EmailSendRow[];
	now?: Date;
};

function emptyCounts(): Record<EnneagramCampaignStatus, number> {
	return {
		ready: 0,
		suppressed: 0,
		unconfirmed: 0,
		admin: 0,
		recent: 0,
		active_sequence: 0,
		recent_email: 0,
		invalid_email: 0,
		duplicate_email: 0
	};
}

export function hasValidEnneagramType(value: string | null | undefined): boolean {
	return /^[1-9]$/.test(value?.trim() ?? '');
}

function isPlausibleEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function displayName(profile: EnneagramCampaignProfile): string {
	return (
		[profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() ||
		profile.username?.trim() ||
		'there'
	);
}

export function buildEnneagramCampaignAudience({
	profiles,
	authUsers,
	unsubscribes,
	legacyOptOuts,
	sequenceEnrollments,
	emailSends,
	now = new Date()
}: AudienceInputs): EnneagramCampaignAudience {
	const authUserById = new Map(authUsers.map((user) => [user.id, user]));
	const suppressedEmails = new Set(
		[...unsubscribes, ...legacyOptOuts]
			.map((row) => normalizeEmail(row.email))
			.filter((email) => email.length > 0)
	);
	const activeSequenceUserIds = new Set(
		sequenceEnrollments
			.filter((enrollment) => ACTIVE_SEQUENCE_STATUSES.has(enrollment.status))
			.map((enrollment) => enrollment.user_id)
	);
	const lastEmailSentAtByEmail = new Map<string, string>();
	for (const send of emailSends) {
		const email = normalizeEmail(send.recipient_email);
		if (!email || !send.sent_at) continue;

		const sentAt = new Date(send.sent_at).getTime();
		const current = lastEmailSentAtByEmail.get(email);
		const currentTime = current ? new Date(current).getTime() : Number.NEGATIVE_INFINITY;
		if (Number.isFinite(sentAt) && sentAt > currentTime) {
			lastEmailSentAtByEmail.set(email, send.sent_at);
		}
	}
	const seenEmails = new Set<string>();
	const counts = emptyCounts();
	const totalWithType = profiles.filter((profile) =>
		hasValidEnneagramType(profile.enneagram)
	).length;
	const missingProfiles = profiles
		.filter((profile) => !hasValidEnneagramType(profile.enneagram))
		.sort((left, right) => {
			const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
			const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
			return rightTime - leftTime;
		});

	const rows = missingProfiles.map((profile): EnneagramCampaignAudienceRow => {
		const email = normalizeEmail(profile.email);
		const authUser = authUserById.get(profile.id);
		const createdAt = profile.created_at ? new Date(profile.created_at).getTime() : Number.NaN;
		const lastEmailSentAt = lastEmailSentAtByEmail.get(email) ?? null;
		const lastEmailSentTime = lastEmailSentAt
			? new Date(lastEmailSentAt).getTime()
			: Number.NEGATIVE_INFINITY;
		let status: EnneagramCampaignStatus;

		if (!isPlausibleEmail(email)) {
			status = 'invalid_email';
		} else if (suppressedEmails.has(email)) {
			status = 'suppressed';
		} else if (!authUser?.email_confirmed_at && !authUser?.confirmed_at) {
			status = 'unconfirmed';
		} else if (profile.admin === true) {
			status = 'admin';
		} else if (Number.isFinite(createdAt) && now.getTime() - createdAt < 7 * DAY_MS) {
			status = 'recent';
		} else if (activeSequenceUserIds.has(profile.id)) {
			status = 'active_sequence';
		} else if (
			lastEmailSentTime >
			now.getTime() - ENNEAGRAM_TYPE_PROMPT_EMAIL_BUFFER_DAYS * DAY_MS
		) {
			status = 'recent_email';
		} else if (seenEmails.has(email)) {
			status = 'duplicate_email';
		} else {
			status = 'ready';
		}

		if (email) {
			seenEmails.add(email);
		}
		counts[status] += 1;

		return {
			id: profile.id,
			email,
			name: displayName(profile),
			createdAt: profile.created_at,
			storedEnneagram: profile.enneagram,
			lastEmailSentAt,
			status,
			statusLabel: ENNEAGRAM_CAMPAIGN_HOLD_LABELS[status]
		};
	});

	return {
		rows,
		counts,
		totalProfiles: profiles.length,
		totalWithType,
		totalMissingType: rows.length,
		totalHeld: rows.length - counts.ready
	};
}

async function loadAllRows(
	supabase: any,
	table: string,
	columns: string,
	configure?: (query: any) => any
) {
	const rows: unknown[] = [];

	for (let offset = 0; ; offset += 1000) {
		let query = supabase
			.from(table)
			.select(columns)
			.range(offset, offset + 999);
		if (configure) query = configure(query);
		const { data, error } = await query;

		if (error) throw error;
		rows.push(...(data ?? []));
		if ((data?.length ?? 0) < 1000) break;
	}

	return rows;
}

async function loadAllAuthUsers(supabase: any): Promise<User[]> {
	const users: User[] = [];

	for (let page = 1; ; page += 1) {
		const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
		if (error) throw error;
		users.push(...data.users);
		if (data.users.length < 1000) break;
	}

	return users;
}

export async function loadEnneagramCampaignAudience(
	supabase: any
): Promise<EnneagramCampaignAudience> {
	const now = new Date();
	const recentEmailCutoff = new Date(
		now.getTime() - ENNEAGRAM_TYPE_PROMPT_EMAIL_BUFFER_DAYS * DAY_MS
	).toISOString();
	const [
		profiles,
		authUsers,
		unsubscribes,
		legacyOptOuts,
		recordedBounces,
		sequenceEnrollments,
		emailSends
	] = await Promise.all([
		loadAllRows(
			supabase,
			'profiles',
			'id, email, first_name, last_name, username, enneagram, created_at, admin'
		),
		loadAllAuthUsers(supabase),
		loadAllRows(supabase, 'email_unsubscribes', 'email'),
		loadAllRows(supabase, 'signups', 'email', (query) =>
			query.not('unsubscribed_date', 'is', null)
		),
		loadAllRows(supabase, 'email_sends', 'recipient_email', (query) =>
			query.or('bounced_at.not.is.null,status.eq.bounced')
		),
		loadAllRows(supabase, 'email_sequence_enrollments', 'user_id, status', (query) =>
			query.in('status', [...ACTIVE_SEQUENCE_STATUSES])
		),
		loadAllRows(supabase, 'email_sends', 'recipient_email, sent_at', (query) =>
			query.not('sent_at', 'is', null).gt('sent_at', recentEmailCutoff)
		)
	]);

	return buildEnneagramCampaignAudience({
		profiles: profiles as EnneagramCampaignProfile[],
		authUsers,
		unsubscribes: [...unsubscribes, ...recordedBounces] as SuppressionRow[],
		legacyOptOuts: legacyOptOuts as SuppressionRow[],
		sequenceEnrollments: sequenceEnrollments as SequenceEnrollment[],
		emailSends: emailSends as EmailSendRow[],
		now
	});
}

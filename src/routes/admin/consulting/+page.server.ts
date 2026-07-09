// src/routes/admin/consulting/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { guardAdminActions } from '$lib/server/adminAuth';
import type { Database } from '../../../../database.types';

type ClientIdentity = Pick<
	Database['public']['Tables']['consulting_clients']['Row'],
	'email' | 'id' | 'waitlist_id'
>;
type StatusRow = Pick<Database['public']['Tables']['consulting_clients']['Row'], 'status'>;
type TypeRow = Pick<Database['public']['Tables']['consulting_clients']['Row'], 'enneagram_type'>;
type WaitlistRow = Database['public']['Tables']['coaching_waitlist']['Row'];
type WaitlistMetadataRow = Database['public']['Tables']['coaching_waitlist_metadata']['Row'];
type WaitlistWithMetadata = WaitlistRow & { metadata: WaitlistMetadataRow[] | null };
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type SignupRow = Database['public']['Tables']['signups']['Row'];
type CommentRow = Pick<Database['public']['Tables']['comments']['Row'], 'author_id' | 'created_at'>;
type ConsultingClientRow = Database['public']['Tables']['consulting_clients']['Row'];
type ConsultingIntakeRow = Database['public']['Tables']['consulting_intake_forms']['Row'];
type ConsultingClientWithIntake = ConsultingClientRow & {
	intake: ConsultingIntakeRow[] | null;
};
type ConsultingDashboardSummary = {
	stats: {
		totalClients: number;
		activeClients: number;
		pendingIntakes: number;
		waitlistCount: number;
	};
	statusCounts: Record<string, number>;
	typeDistribution: Record<number, number>;
};

const EMPTY_COMMENT_SUMMARY = {
	hasCommented: false,
	totalComments: 0,
	firstCommentAt: null as string | null,
	lastCommentAt: null as string | null
};

function normalizeEmail(email: string | null | undefined): string {
	return email?.trim().toLowerCase() ?? '';
}

function isBefore(first: string | null, second: string | null): boolean {
	if (!first || !second) return false;
	return new Date(first).getTime() < new Date(second).getTime();
}

function pickEarlierDate(...dates: Array<string | null | undefined>): string | null {
	return dates.reduce<string | null>((earliest, current) => {
		if (!current) return earliest;
		if (!earliest) return current;
		return isBefore(current, earliest) ? current : earliest;
	}, null);
}

function normalizeCountMap(value: unknown): Record<string, number> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return {};
	}

	return Object.fromEntries(
		Object.entries(value as Record<string, unknown>).map(([key, count]) => [
			key,
			Number(count) || 0
		])
	);
}

function normalizeTypeDistribution(value: unknown): Record<number, number> {
	return Object.fromEntries(
		Object.entries(normalizeCountMap(value)).map(([key, count]) => [Number(key), count])
	) as Record<number, number>;
}

async function loadConsultingDashboardSummary(
	supabase: App.Locals['supabase']
): Promise<ConsultingDashboardSummary> {
	const db = supabase as any;
	const { data, error } = await db.rpc('get_admin_consulting_dashboard_summary');
	const summary = Array.isArray(data) ? data[0] : data;

	if (!error && summary) {
		return {
			stats: {
				totalClients: Number(summary.total_clients) || 0,
				activeClients: Number(summary.active_clients) || 0,
				pendingIntakes: Number(summary.pending_intakes) || 0,
				waitlistCount: Number(summary.waitlist_count) || 0
			},
			statusCounts: normalizeCountMap(summary.status_counts),
			typeDistribution: normalizeTypeDistribution(summary.type_distribution)
		};
	}

	console.error('Falling back to consulting dashboard summary queries', error);

	const [
		{ count: totalClients },
		{ count: activeClients },
		{ count: pendingIntakes },
		{ count: waitlistCount },
		{ data: clientsByStatus },
		{ data: clientsByType }
	] = await Promise.all([
		supabase.from('consulting_clients').select('id', { count: 'exact', head: true }),
		supabase
			.from('consulting_clients')
			.select('id', { count: 'exact', head: true })
			.eq('status', 'active'),
		supabase
			.from('consulting_intake_forms')
			.select('id', { count: 'exact', head: true })
			.in('status', ['pending', 'sent']),
		supabase.from('coaching_waitlist').select('id', { count: 'exact', head: true }),
		supabase.from('consulting_clients').select('status'),
		supabase.from('consulting_clients').select('enneagram_type')
	]);

	return {
		stats: {
			totalClients: totalClients || 0,
			activeClients: activeClients || 0,
			pendingIntakes: pendingIntakes || 0,
			waitlistCount: waitlistCount || 0
		},
		statusCounts: ((clientsByStatus || []) as StatusRow[]).reduce(
			(acc: Record<string, number>, client) => {
				const status = client.status ?? 'unknown';
				acc[status] = (acc[status] || 0) + 1;
				return acc;
			},
			{}
		),
		typeDistribution: ((clientsByType || []) as TypeRow[]).reduce(
			(acc: Record<number, number>, client) => {
				if (client.enneagram_type) {
					acc[client.enneagram_type] = (acc[client.enneagram_type] || 0) + 1;
				}
				return acc;
			},
			{}
		)
	};
}

async function loadClientIdentitiesForWaitlist(
	supabase: App.Locals['supabase'],
	waitlistIds: string[],
	emailVariants: string[]
): Promise<ClientIdentity[]> {
	const [clientsByWaitlistResult, clientsByEmailResult] = await Promise.all([
		waitlistIds.length
			? supabase
					.from('consulting_clients')
					.select('email, id, waitlist_id')
					.in('waitlist_id', waitlistIds)
			: Promise.resolve({ data: [] as ClientIdentity[] }),
		emailVariants.length
			? supabase
					.from('consulting_clients')
					.select('email, id, waitlist_id')
					.in('email', emailVariants)
			: Promise.resolve({ data: [] as ClientIdentity[] })
	]);

	const clientsById = new Map<string, ClientIdentity>();
	for (const client of [
		...((clientsByWaitlistResult.data || []) as ClientIdentity[]),
		...((clientsByEmailResult.data || []) as ClientIdentity[])
	]) {
		clientsById.set(client.id, client);
	}

	return [...clientsById.values()];
}

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	const now = new Date();
	const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

	const [summary, { data: upcomingSessions }, { data: recentWaitlist }] = await Promise.all([
		loadConsultingDashboardSummary(supabase),
		// Upcoming sessions (next 7 days)
		supabase
			.from('consulting_sessions')
			.select(
				`
				id,
				scheduled_at,
				session_type,
				status,
				client:consulting_clients(id, name, email, enneagram_type, trust_layer)
			`
			)
			.gte('scheduled_at', now.toISOString())
			.lte('scheduled_at', nextWeek.toISOString())
			.in('status', ['scheduled', 'confirmed'])
			.order('scheduled_at', { ascending: true })
			.limit(5),
		// Recent waitlist entries
		supabase
			.from('coaching_waitlist')
			.select(
				'id, name, email, session_goal, enneagram_type, created_at, metadata:coaching_waitlist_metadata(source, utm_medium, utm_campaign, utm_content, ip_address, user_agent)'
			)
			.order('created_at', { ascending: false })
			.limit(10)
	]);

	const waitlistEntries = (recentWaitlist || []) as WaitlistWithMetadata[];
	const waitlistRawEmails = [
		...new Set(waitlistEntries.map((entry) => entry.email?.trim()))
	].filter((email): email is string => Boolean(email));
	const waitlistEmails = [
		...new Set(waitlistRawEmails.map((email) => normalizeEmail(email)))
	].filter(Boolean);
	// Query both raw and normalized variants so we don't miss mixed-case historical rows.
	const waitlistEmailVariants = [...new Set([...waitlistRawEmails, ...waitlistEmails])];
	const waitlistIds = [...new Set(waitlistEntries.map((entry) => String(entry.id)))];
	const existingClients = await loadClientIdentitiesForWaitlist(
		supabase,
		waitlistIds,
		waitlistEmailVariants
	);

	// Create lookup maps for converted clients
	const clientsByEmail = new Map(
		((existingClients || []) as ClientIdentity[]).map((c) => [normalizeEmail(c.email), c.id])
	);
	const clientsByWaitlistId = new Map(
		((existingClients || []) as ClientIdentity[])
			.filter((c) => Boolean(c.waitlist_id))
			.map((c) => [c.waitlist_id as string, c.id])
	);

	// Enrich waitlist entries with conversion status
	const waitlistWithClientLinks = waitlistEntries.map((entry) => {
		const clientId =
			clientsByWaitlistId.get(entry.id) || clientsByEmail.get(normalizeEmail(entry.email)) || null;
		return {
			...entry,
			isConverted: !!clientId,
			clientId
		};
	});

	const waitlistClientIds = [
		...new Set(
			waitlistWithClientLinks
				.map((entry) => entry.clientId)
				.filter((clientId): clientId is string => Boolean(clientId))
		)
	];

	let matchedProfiles: ProfileRow[] = [];
	let matchedSignups: SignupRow[] = [];
	let matchedClients: ConsultingClientWithIntake[] = [];
	let matchedComments: CommentRow[] = [];

	if (waitlistEmailVariants.length > 0 || waitlistClientIds.length > 0) {
		const [profilesResult, signupsResult, clientsResult] = await Promise.all([
			waitlistEmailVariants.length > 0
				? supabase
						.from('profiles')
						.select(
							'id, email, created_at, username, first_name, last_name, enneagram, external_id'
						)
						.in('email', waitlistEmailVariants)
				: Promise.resolve({ data: [] as ProfileRow[] }),
			waitlistEmailVariants.length > 0
				? supabase
						.from('signups')
						.select('id, email, name, created_at')
						.in('email', waitlistEmailVariants)
				: Promise.resolve({ data: [] as SignupRow[] }),
			waitlistClientIds.length > 0
				? supabase
						.from('consulting_clients')
						.select(
							`
							*,
							intake:consulting_intake_forms(*)
						`
						)
						.in('id', waitlistClientIds)
				: Promise.resolve({ data: [] as ConsultingClientWithIntake[] })
		]);

		matchedProfiles = (profilesResult.data || []) as ProfileRow[];
		matchedSignups = (signupsResult.data || []) as SignupRow[];
		matchedClients = (clientsResult.data || []) as ConsultingClientWithIntake[];

		const profileIds = matchedProfiles.map((profile) => profile.id);
		if (profileIds.length > 0) {
			const { data: comments } = await supabase
				.from('comments')
				.select('author_id, created_at')
				.eq('removed', false)
				.in('author_id', profileIds);

			matchedComments = (comments || []) as CommentRow[];
		}
	}

	const profilesByEmail = new Map<string, ProfileRow>();
	for (const profile of matchedProfiles) {
		const emailKey = normalizeEmail(profile.email);
		if (!emailKey || profilesByEmail.has(emailKey)) continue;
		profilesByEmail.set(emailKey, profile);
	}

	const signupsByEmail = new Map<string, SignupRow>();
	for (const signup of matchedSignups) {
		const emailKey = normalizeEmail(signup.email);
		if (!emailKey) continue;

		const existingSignup = signupsByEmail.get(emailKey);
		if (
			!existingSignup ||
			(!existingSignup.created_at && Boolean(signup.created_at)) ||
			isBefore(signup.created_at, existingSignup.created_at)
		) {
			signupsByEmail.set(emailKey, signup);
		}
	}

	const clientsById = new Map(matchedClients.map((client) => [client.id, client] as const));

	const commentsByProfileId = new Map<
		string,
		{
			hasCommented: boolean;
			totalComments: number;
			firstCommentAt: string | null;
			lastCommentAt: string | null;
		}
	>();

	for (const comment of matchedComments) {
		if (!comment.author_id) continue;

		const currentSummary = commentsByProfileId.get(comment.author_id) || {
			...EMPTY_COMMENT_SUMMARY
		};
		currentSummary.hasCommented = true;
		currentSummary.totalComments += 1;

		if (comment.created_at) {
			if (
				!currentSummary.firstCommentAt ||
				isBefore(comment.created_at, currentSummary.firstCommentAt)
			) {
				currentSummary.firstCommentAt = comment.created_at;
			}

			if (
				!currentSummary.lastCommentAt ||
				isBefore(currentSummary.lastCommentAt, comment.created_at)
			) {
				currentSummary.lastCommentAt = comment.created_at;
			}
		}

		commentsByProfileId.set(comment.author_id, currentSummary);
	}

	const enrichedWaitlist = waitlistWithClientLinks.map((entry) => {
		const emailKey = normalizeEmail(entry.email);
		const profile = profilesByEmail.get(emailKey) || null;
		const signup = signupsByEmail.get(emailKey) || null;
		const client = entry.clientId ? clientsById.get(entry.clientId) || null : null;
		const commentSummary = profile
			? commentsByProfileId.get(profile.id) || { ...EMPTY_COMMENT_SUMMARY }
			: { ...EMPTY_COMMENT_SUMMARY };

		return {
			...entry,
			person: {
				joinedAt: pickEarlierDate(profile?.created_at, signup?.created_at),
				profile,
				signup,
				commentSummary,
				client
			}
		};
	});

	return {
		stats: summary.stats,
		upcomingSessions: upcomingSessions || [],
		recentWaitlist: enrichedWaitlist,
		statusCounts: summary.statusCounts,
		typeDistribution: summary.typeDistribution
	};
};

export const actions: Actions = guardAdminActions({
	// Promote waitlist entry to client
	promoteToClient: async ({ request, locals }) => {
		const formData = await request.formData();
		const waitlistId = formData.get('waitlistId')?.toString();

		if (!waitlistId) {
			return fail(400, { error: 'Waitlist ID required' });
		}

		const supabase = locals.supabase;

		// Get waitlist entry (use id as-is, could be integer or UUID)
		const { data: waitlistEntry, error: waitlistError } = await supabase
			.from('coaching_waitlist')
			.select('*, metadata:coaching_waitlist_metadata(*)')
			.eq('id', waitlistId)
			.single();

		if (waitlistError || !waitlistEntry) {
			return fail(404, { error: 'Waitlist entry not found' });
		}

		// Check if client already exists with this email
		const { data: existingClient } = await supabase
			.from('consulting_clients')
			.select('id')
			.eq('email', waitlistEntry.email)
			.single();

		if (existingClient) {
			return fail(400, { error: 'Client with this email already exists' });
		}

		// Parse enneagram type safely
		let enneagramType = null;
		if (waitlistEntry.enneagram_type) {
			const parsed = parseInt(waitlistEntry.enneagram_type);
			if (!isNaN(parsed) && parsed >= 1 && parsed <= 9) {
				enneagramType = parsed;
			}
		}

		// Create new client (store waitlist_id as TEXT for flexibility)
		const { data: newClient, error: clientError } = await supabase
			.from('consulting_clients')
			.insert({
				waitlist_id: String(waitlistEntry.id),
				name: waitlistEntry.name,
				email: waitlistEntry.email,
				enneagram_type: enneagramType,
				initial_goal: waitlistEntry.session_goal,
				source: waitlistEntry.metadata?.[0]?.source || 'waitlist',
				status: 'prospect'
			})
			.select()
			.single();

		if (clientError) {
			console.error('Error creating client:', clientError);
			return fail(500, { error: 'Failed to create client' });
		}

		return { success: true, clientId: newClient.id };
	}
});

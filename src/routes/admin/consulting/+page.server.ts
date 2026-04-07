// src/routes/admin/consulting/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
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

export const load: PageServerLoad = async ({ locals }) => {
	const supabase = locals.supabase;

	// Get overview stats in parallel
	const [
		{ count: totalClients },
		{ count: activeClients },
		{ count: pendingIntakes },
		{ data: upcomingSessions },
		{ data: recentWaitlist },
		{ data: existingClients },
		{ count: waitlistCount },
		{ data: clientsByStatus },
		{ data: clientsByType }
	] = await Promise.all([
		// Total clients
		supabase.from('consulting_clients').select('*', { count: 'exact', head: true }),
		// Active clients
		supabase
			.from('consulting_clients')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'active'),
		// Pending intakes
		supabase
			.from('consulting_intake_forms')
			.select('*', { count: 'exact', head: true })
			.in('status', ['pending', 'sent']),
		// Upcoming sessions (next 7 days)
		supabase
			.from('consulting_sessions')
			.select(
				`
				*,
				client:consulting_clients(id, name, email, enneagram_type, trust_layer)
			`
			)
			.gte('scheduled_at', new Date().toISOString())
			.lte('scheduled_at', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
			.in('status', ['scheduled', 'confirmed'])
			.order('scheduled_at', { ascending: true })
			.limit(5),
		// Recent waitlist entries
		supabase
			.from('coaching_waitlist')
			.select('*, metadata:coaching_waitlist_metadata(*)')
			.order('created_at', { ascending: false })
			.limit(10),
		// Get existing clients to check which waitlist entries have been converted
		supabase.from('consulting_clients').select('email, id, waitlist_id'),
		// Total waitlist count
		supabase.from('coaching_waitlist').select('*', { count: 'exact', head: true }),
		// Clients by status for pipeline view
		supabase.from('consulting_clients').select('status'),
		// Clients by type for distribution
		supabase.from('consulting_clients').select('enneagram_type')
	]);

	// Process status counts
	const statusCounts = (clientsByStatus || []).reduce(
		(acc: Record<string, number>, client: StatusRow) => {
			const status = client.status ?? 'unknown';
			acc[status] = (acc[status] || 0) + 1;
			return acc;
		},
		{}
	);

	// Process type distribution
	const typeDistribution = (clientsByType || []).reduce(
		(acc: Record<number, number>, client: TypeRow) => {
			if (client.enneagram_type) {
				acc[client.enneagram_type] = (acc[client.enneagram_type] || 0) + 1;
			}
			return acc;
		},
		{}
	);

	// Create lookup maps for converted clients
	const clientsByEmail = new Map(
		((existingClients || []) as ClientIdentity[]).map((c) => [c.email, c.id])
	);
	const clientsByWaitlistId = new Map(
		((existingClients || []) as ClientIdentity[])
			.filter((c) => Boolean(c.waitlist_id))
			.map((c) => [c.waitlist_id as string, c.id])
	);

	const waitlistEntries = (recentWaitlist || []) as WaitlistWithMetadata[];

	// Enrich waitlist entries with conversion status
	const waitlistWithClientLinks = waitlistEntries.map((entry) => {
		const clientId = clientsByWaitlistId.get(entry.id) || clientsByEmail.get(entry.email) || null;
		return {
			...entry,
			isConverted: !!clientId,
			clientId
		};
	});

	const waitlistRawEmails = [
		...new Set(waitlistWithClientLinks.map((entry) => entry.email?.trim()))
	].filter((email): email is string => Boolean(email));
	const waitlistEmails = [
		...new Set(waitlistRawEmails.map((email) => normalizeEmail(email)))
	].filter(Boolean);
	// Query both raw and normalized variants so we don't miss mixed-case historical rows.
	const waitlistEmailVariants = [...new Set([...waitlistRawEmails, ...waitlistEmails])];
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
		stats: {
			totalClients: totalClients || 0,
			activeClients: activeClients || 0,
			pendingIntakes: pendingIntakes || 0,
			waitlistCount: waitlistCount || 0
		},
		upcomingSessions: upcomingSessions || [],
		recentWaitlist: enrichedWaitlist,
		statusCounts,
		typeDistribution
	};
};

export const actions: Actions = {
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
};

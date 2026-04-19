// src/lib/server/adminAnalytics.ts
type ContributorRecord = {
	author_id?: string | null;
	fingerprint?: string | null;
	ip?: string | null;
};

type CountResult = {
	count?: number | null;
	error?: unknown;
};

type SupabaseLike = {
	rpc: (
		fn: string,
		args?: Record<string, unknown>
	) => Promise<{
		data: unknown;
		error: unknown;
	}>;
	from: (table: string) => {
		select: (
			columns: string,
			options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }
		) => {
			eq: (column: string, value: string) => Promise<CountResult>;
			gte: (
				column: string,
				value: string
			) => Promise<{
				data?: ContributorRecord[] | null;
				error?: unknown;
			}>;
		};
	};
};

type EnneagramDistributionRow = {
	enneagram?: string | number | null;
	user_count?: string | number | null;
	count?: string | number | null;
};

const ENNEAGRAM_TYPES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

function normalizeValue(value: string | null | undefined): string | null {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
}

function toCount(value: string | number | null | undefined): number {
	const parsed = Number(value ?? 0);
	return Number.isFinite(parsed) ? parsed : 0;
}

function isMissingEnneagramDistributionRpc(err: unknown): boolean {
	const message =
		typeof err === 'object' && err !== null && 'message' in err
			? String((err as { message?: unknown }).message ?? '')
			: '';

	return message.includes('get_admin_enneagram_distribution');
}

export function getContributorKey(record: ContributorRecord): string | null {
	const authorId = normalizeValue(record.author_id);
	if (authorId) {
		return `user:${authorId}`;
	}

	const fingerprint = normalizeValue(record.fingerprint);
	if (fingerprint) {
		return `fingerprint:${fingerprint}`;
	}

	const ip = normalizeValue(record.ip);
	if (ip) {
		return `ip:${ip}`;
	}

	return null;
}

export function countUniqueContributors(records: ContributorRecord[]): number {
	const uniqueKeys = new Set<string>();

	for (const record of records) {
		const key = getContributorKey(record);
		if (key) {
			uniqueKeys.add(key);
		}
	}

	return uniqueKeys.size;
}

export function buildEnneagramDistribution(
	rows: EnneagramDistributionRow[] | null | undefined
): Record<string, number> {
	const distribution: Record<string, number> = {};

	for (const row of rows ?? []) {
		const enneagram = String(row.enneagram ?? '').trim();
		if (!ENNEAGRAM_TYPES.includes(enneagram as (typeof ENNEAGRAM_TYPES)[number])) {
			continue;
		}

		distribution[enneagram] = toCount(row.user_count ?? row.count);
	}

	return distribution;
}

async function countEnneagramDistributionByType(
	supabase: SupabaseLike,
	profilesTable: string
): Promise<Record<string, number>> {
	const results = await Promise.all(
		ENNEAGRAM_TYPES.map((enneagram) =>
			supabase
				.from(profilesTable)
				.select('id', { count: 'exact', head: true })
				.eq('enneagram', enneagram)
		)
	);

	return ENNEAGRAM_TYPES.reduce<Record<string, number>>((distribution, enneagram, index) => {
		const result = results[index];
		if (result?.error) {
			console.error('Failed to count admin enneagram bucket', {
				enneagram,
				error: result.error
			});
		}

		distribution[enneagram] = result?.count ?? 0;
		return distribution;
	}, {});
}

export async function loadAdminEnneagramDistribution(
	supabase: SupabaseLike,
	options: { demoTime: boolean; profilesTable: string }
): Promise<Record<string, number>> {
	const result = await supabase.rpc('get_admin_enneagram_distribution', {
		p_demo_time: options.demoTime
	});

	if (!result.error) {
		return buildEnneagramDistribution(result.data as EnneagramDistributionRow[]);
	}

	if (!isMissingEnneagramDistributionRpc(result.error)) {
		console.error('Failed to load admin enneagram distribution', result.error);
	}

	return countEnneagramDistributionByType(supabase, options.profilesTable);
}

export async function countRecentActiveContributors(
	supabase: SupabaseLike,
	sinceIso: string
): Promise<number> {
	const [questionComments, blogComments] = await Promise.all([
		supabase.from('comments').select('author_id, fingerprint, ip').gte('created_at', sinceIso),
		supabase.from('blog_comments').select('author_id, fingerprint, ip').gte('created_at', sinceIso)
	]);

	if (questionComments.error) {
		console.error('Failed to load recent question commenters', questionComments.error);
	}

	if (blogComments.error) {
		console.error('Failed to load recent blog commenters', blogComments.error);
	}

	return countUniqueContributors([...(questionComments.data ?? []), ...(blogComments.data ?? [])]);
}

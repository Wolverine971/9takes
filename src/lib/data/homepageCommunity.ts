// src/lib/data/homepageCommunity.ts
// Public question metadata only. Never serialize RPC author IDs or answer text.
export type CommunityProof = {
	totalQuestions: number;
	totalResponses: number;
	questions: Array<{ slug: string; title: string; responses: number }>;
};

function count(value: unknown): number | null {
	return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

export function parseCommunityProof(raw: unknown): CommunityProof | null {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
	const source = raw as Record<string, unknown>;
	const totalQuestions = count(source.totalQuestions);
	const totalResponses = count(source.totalAnswers);
	if (totalQuestions === null || totalResponses === null) return null;
	const questions: CommunityProof['questions'] = [];
	const seen = new Set<string>();
	const rows = [
		...(Array.isArray(source.starters) ? source.starters : []),
		...(Array.isArray(source.questions) ? source.questions : [])
	];
	for (const value of rows) {
		if (!value || typeof value !== 'object') continue;
		const row = value as Record<string, unknown>;
		if (row.removed === true || row.flagged === true) continue;
		if (typeof row.url !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.url)) continue;
		if (seen.has(row.url)) continue;
		const title =
			typeof row.question_formatted === 'string' && row.question_formatted.trim()
				? row.question_formatted.trim()
				: typeof row.question === 'string'
					? row.question.trim()
					: '';
		const responses = count(row.comment_count);
		if (!title || title.length > 500 || responses === null) continue;
		seen.add(row.url);
		questions.push({ slug: row.url, title, responses });
		if (questions.length === 3) break;
	}
	return { totalQuestions, totalResponses, questions };
}

// src/routes/api/personality-analysis/[slug]/discussion/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Database } from '../../../../../../database.types';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';
import { CONTENT_GUARD_CACHE_CONTROL } from '$lib/server/contentAccessGuard';

type BlogCommentRow = Database['public']['Tables']['blog_comments']['Row'];
export type PublicBlogCommentRow = Pick<
	BlogCommentRow,
	'id' | 'blog_link' | 'blog_type' | 'comment' | 'created_at' | 'author_id'
>;

const COMMENT_LOOKUP_TIMEOUT_MS = 4_000;
const MAX_COMMENTS = 100;

/**
 * Per-visitor half of a personality page.
 *
 * The page HTML itself is identical for everyone and served from the ISR cache,
 * so the give-first gate lives here instead: the decision stays on the server
 * (comments are only returned once the visitor has answered) and this response
 * is never cached.
 */
export const GET: RequestHandler = async (event) => {
	event.setHeaders({ 'Cache-Control': CONTENT_GUARD_CACHE_CONTROL });

	const canonicalSlug = normalizePersonalitySlug(event.params.slug);
	if (!canonicalSlug) {
		return json({ userHasAnswered: false, comments: [] });
	}

	const supabase = event.locals.supabase;
	const user = event.locals.session?.user ?? null;
	const fingerprint = event.cookies.get('9tfingerprint');
	const commentSlugCandidates = [...new Set([event.params.slug, canonicalSlug].filter(Boolean))];

	const userHasAnswered = await hasAnswered({
		supabase,
		userId: user?.id ?? null,
		fingerprint: fingerprint ?? null,
		commentSlugCandidates
	});

	if (!userHasAnswered) {
		return json({ userHasAnswered: false, comments: [] });
	}

	const { data: blogComments, error: commentsError } = await supabase
		.from('blog_comments')
		.select('id, blog_link, blog_type, comment, created_at, author_id')
		.in('blog_link', commentSlugCandidates)
		.order('created_at', { ascending: false })
		.limit(MAX_COMMENTS);

	if (commentsError) {
		console.warn('Failed to load personality discussion comments', commentsError);
	}

	return json({
		userHasAnswered: true,
		comments: (blogComments ?? []) as PublicBlogCommentRow[]
	});
};

async function hasAnswered({
	supabase,
	userId,
	fingerprint,
	commentSlugCandidates
}: {
	supabase: App.Locals['supabase'];
	userId: string | null;
	fingerprint: string | null;
	commentSlugCandidates: string[];
}): Promise<boolean> {
	// An anonymous visitor with no fingerprint cookie has provably not answered;
	// the old server load still spent a query on `.eq('fingerprint', '')`.
	if (!userId && !fingerprint) {
		return false;
	}

	try {
		const query = userId
			? supabase
					.from('blog_comments')
					.select('id')
					.in('blog_link', commentSlugCandidates)
					.eq('author_id', userId)
			: getSupabaseAdminClient()
					.from('blog_comments')
					.select('id')
					.in('blog_link', commentSlugCandidates)
					.eq('fingerprint', fingerprint as string);

		const { data, error } = await query
			.abortSignal(AbortSignal.timeout(COMMENT_LOOKUP_TIMEOUT_MS))
			.maybeSingle();

		if (error) {
			console.warn('Failed to check personality comment access', error);
			return false;
		}

		return Boolean(data);
	} catch (lookupError) {
		console.warn('Failed to check personality comment access', lookupError);
		return false;
	}
}

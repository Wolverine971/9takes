// src/routes/api/personality-analysis/[slug]/discussion/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import type { Database } from '../../../../../../database.types';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';
import { normalizePersonalitySlug } from '$lib/utils/personalityAnalysis';
import { CONTENT_GUARD_CACHE_CONTROL } from '$lib/server/contentAccessGuard';
import { consumeApiRateLimit, resolveRateLimitSubject } from '$lib/server/apiRateLimit';
import { VISITOR_ID_COOKIE_NAME } from '$lib/analytics/visitorIdentity';

type BlogCommentRow = Database['public']['Tables']['blog_comments']['Row'];
export type PublicBlogCommentRow = Pick<
	BlogCommentRow,
	'id' | 'blog_link' | 'blog_type' | 'comment' | 'created_at' | 'author_id'
>;

const COMMENT_LOOKUP_TIMEOUT_MS = 4_000;
const MAX_COMMENTS = 100;
const PUBLIC_COMMENT_COLUMNS = 'id, blog_link, blog_type, comment, created_at, author_id';
const BLOG_TYPE = 'personality-analysis';

const postSchema = z.object({
	comment: z
		.string()
		.trim()
		.min(1, 'Comment cannot be empty')
		.max(5000, 'Comment cannot exceed 5000 characters'),
	fingerprint: z.string().trim().max(100).optional()
});

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

	// Comment text is service-role only (give-first wall); the gate above passed.
	const { data: blogComments, error: commentsError } = await getSupabaseAdminClient()
		.from('blog_comments')
		.select(PUBLIC_COMMENT_COLUMNS)
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

/**
 * Adds the visitor's read to a personality page's discussion.
 *
 * blog_comments has no INSERT policy and its text is service-role only, so the
 * write goes through the service role here (the old `?/createComment` actions
 * used the visitor's session, were refused by RLS from 2026-09-03 on, and still
 * reported success). author_id is the session user, never a form field.
 * Anonymous visitors get one comment per page, the same rule the form states.
 *
 * Request:  { comment: string, fingerprint?: string }
 * Response: { comments: [PublicBlogCommentRow] }, or { error } with 400 / 403 / 404 / 429 / 500.
 */
export const POST: RequestHandler = async (event) => {
	event.setHeaders({ 'Cache-Control': CONTENT_GUARD_CACHE_CONTROL });

	const canonicalSlug = normalizePersonalitySlug(event.params.slug);
	if (!canonicalSlug) {
		return json({ error: 'Page not found' }, { status: 404 });
	}

	let body: unknown;
	try {
		body = await event.request.json();
	} catch {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
	const parsed = postSchema.safeParse(body);
	if (!parsed.success) {
		return json({ error: parsed.error.errors[0]?.message || 'Invalid request' }, { status: 400 });
	}

	const userId = event.locals.session?.user?.id ?? null;
	// The cookie wins so the new comment unlocks GET for this same visitor.
	const fingerprint =
		event.cookies.get(VISITOR_ID_COOKIE_NAME)?.trim() || parsed.data.fingerprint || null;
	if (!userId && !fingerprint) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}

	const clientAddress = event.getClientAddress();
	const rateLimit = await consumeApiRateLimit({
		bucket: 'blog_comment',
		subject: resolveRateLimitSubject({ userId, clientAddress })
	});
	if (!rateLimit.allowed) {
		return json(
			{ error: 'Too many comments. Please wait a minute before trying again.' },
			{ status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
		);
	}

	const admin = getSupabaseAdminClient();

	const { data: person } = await admin
		.from('blogs_famous_people')
		.select('person')
		.eq('person', canonicalSlug)
		.eq('published', true)
		.maybeSingle();
	if (!person) {
		return json({ error: 'Page not found' }, { status: 404 });
	}

	if (!userId) {
		const alreadyAnswered = await hasAnswered({
			supabase: event.locals.supabase,
			userId: null,
			fingerprint,
			commentSlugCandidates: [...new Set([event.params.slug, canonicalSlug])]
		});
		if (alreadyAnswered) {
			return json({ error: 'Sign in to add another comment.' }, { status: 403 });
		}
	}

	if (fingerprint) {
		// blog_comments.fingerprint references visitors.
		const { error: visitorError } = await admin
			.from('visitors')
			.upsert({ fingerprint, updated_at: new Date().toISOString() }, { onConflict: 'fingerprint' });
		if (visitorError) {
			console.warn('Failed to upsert visitor for personality comment', visitorError);
		}
	}

	const { data: inserted, error: insertError } = await admin
		.from('blog_comments')
		.insert({
			comment: parsed.data.comment,
			blog_link: canonicalSlug,
			blog_type: BLOG_TYPE,
			author_id: userId,
			ip: clientAddress,
			fingerprint
		})
		.select(PUBLIC_COMMENT_COLUMNS)
		.single();

	if (insertError || !inserted) {
		console.error('Failed to save personality comment', insertError);
		return json({ error: 'We couldn’t save your comment. Please try again.' }, { status: 500 });
	}

	return json({ comments: [inserted as PublicBlogCommentRow] });
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

		// limit(1): a reader with two comments on the page still counts as answered
		// (maybeSingle alone errors on more than one row, which read as "locked").
		const { data, error } = await query
			.limit(1)
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

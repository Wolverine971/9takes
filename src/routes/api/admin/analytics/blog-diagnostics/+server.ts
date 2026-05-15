// src/routes/api/admin/analytics/blog-diagnostics/+server.ts
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadPeopleBlogPerformanceDiagnostics } from '$lib/server/blogPerformanceDiagnostics';

async function assertAdmin(locals: App.Locals): Promise<void> {
	const session = locals.session;
	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	const { data: user } = await locals.supabase
		.from('profiles')
		.select('admin')
		.eq('id', session.user.id)
		.single();

	if (!user?.admin) {
		throw error(403, 'Admin access required');
	}
}

export const GET: RequestHandler = async ({ locals }) => {
	await assertAdmin(locals);

	try {
		const rows = await loadPeopleBlogPerformanceDiagnostics();
		return json({
			rows,
			generated_at: new Date().toISOString(),
			source: 'src/blog/people/drafts',
			note: 'Frontmatter published is exposed for sanity checking only and is not used for performance scoring.'
		});
	} catch (diagnosticsError) {
		console.error('Failed to load blog performance diagnostics:', diagnosticsError);
		throw error(500, 'Failed to load blog performance diagnostics');
	}
};

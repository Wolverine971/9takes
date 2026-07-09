// src/routes/api/admin/analytics/blog-diagnostics/+server.ts
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import { loadPeopleBlogPerformanceDiagnostics } from '$lib/server/blogPerformanceDiagnostics';

export const GET: RequestHandler = async ({ locals }) => {
	await requireAdmin(locals);

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

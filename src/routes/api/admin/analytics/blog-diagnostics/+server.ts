// src/routes/api/admin/analytics/blog-diagnostics/+server.ts
import { error, json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { requireAdmin } from '$lib/server/adminAuth';
import {
	loadPeopleBlogPerformanceDiagnostics,
	type BlogPerformanceDiagnosticsRow
} from '$lib/server/blogPerformanceDiagnostics';

interface DiagnosticsSnapshot {
	rows: BlogPerformanceDiagnosticsRow[];
	generated_at: string;
}

// A deployed build ships its drafts, so parsing all of them (~550 files, ~18MB of markdown)
// gives the same rows until the next deploy. Parse once per instance. Dev re-reads on every
// request so draft edits show up.
let deployedSnapshot: Promise<DiagnosticsSnapshot> | null = null;

async function buildSnapshot(): Promise<DiagnosticsSnapshot> {
	const rows = await loadPeopleBlogPerformanceDiagnostics();
	return { rows, generated_at: new Date().toISOString() };
}

function loadSnapshot(): Promise<DiagnosticsSnapshot> {
	if (dev) return buildSnapshot();

	deployedSnapshot ??= buildSnapshot().catch((err) => {
		// A failed parse must not stick; the next request retries.
		deployedSnapshot = null;
		throw err;
	});
	return deployedSnapshot;
}

export const GET: RequestHandler = async ({ locals }) => {
	await requireAdmin(locals);

	try {
		const { rows, generated_at } = await loadSnapshot();
		return json({
			rows,
			generated_at,
			source: 'src/blog/people/drafts',
			note: 'Frontmatter published is exposed for sanity checking only and is not used for performance scoring.'
		});
	} catch (diagnosticsError) {
		console.error('Failed to load blog performance diagnostics:', diagnosticsError);
		throw error(500, 'Failed to load blog performance diagnostics');
	}
};

// src/routes/admin/question-distribution/+page.server.ts
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { guardAdminActions, requireAdmin } from '$lib/server/adminAuth';
import { getSupabaseAdminClient } from '$lib/server/supabaseAdmin';

type FeatureQuestion = {
	id: number;
	question: string | null;
	question_formatted: string | null;
	url: string | null;
	comment_count: number | null;
	created_at: string;
	flagged: boolean | null;
	removed: boolean | null;
};

function positiveInteger(value: FormDataEntryValue | null, fallback: number): number {
	if (typeof value !== 'string') return fallback;
	const parsed = Number.parseInt(value, 10);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function requiredInteger(value: FormDataEntryValue | null): number | null {
	if (typeof value !== 'string') return null;
	const parsed = Number.parseInt(value, 10);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function rpcErrorMessage(candidate: unknown, fallback: string): string {
	if (candidate && typeof candidate === 'object' && 'message' in candidate) {
		const message = String((candidate as { message?: unknown }).message ?? '').trim();
		if (message) return message;
	}
	return fallback;
}

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event.locals);
	const admin = getSupabaseAdminClient() as any;

	// Resolve/close an expired or moderated run before reading the history so
	// the control panel cannot render contradictory current and audit states.
	const currentResult = await admin.rpc('get_current_homepage_feature');
	const [settingsResult, runsResult, questionsResult] = await Promise.all([
		admin.from('question_distribution_settings').select('*').eq('id', true).maybeSingle(),
		admin
			.from('question_feature_runs')
			.select(
				'id, question_id, started_at, ends_at, ended_at, paused_at, reason_selected, selection_mode, target_unique_impressions, qualified_unique_impressions, max_duration_days, status, ended_reason, operator_notes, questions(question, question_formatted, url, flagged, removed)'
			)
			.order('started_at', { ascending: false })
			.limit(25),
		admin
			.from('questions')
			.select('id, question, question_formatted, url, comment_count, created_at, flagged, removed')
			.order('created_at', { ascending: false })
			.limit(250)
	]);

	const firstError = [
		currentResult.error,
		settingsResult.error,
		runsResult.error,
		questionsResult.error
	].find(Boolean);
	if (firstError) {
		console.error('Failed to load question distribution admin', { error: firstError });
		throw error(500, 'Failed to load question distribution controls');
	}

	const currentRows = Array.isArray(currentResult.data)
		? currentResult.data
		: currentResult.data
			? [currentResult.data]
			: [];
	const candidates = ((questionsResult.data ?? []) as FeatureQuestion[]).filter(
		(question) =>
			!question.removed &&
			!question.flagged &&
			Boolean((question.question_formatted || question.question)?.trim()) &&
			Boolean(question.url?.trim())
	);

	return {
		current: currentRows[0] ?? null,
		settings: settingsResult.data,
		runs: runsResult.data ?? [],
		candidates
	};
};

const actionHandlers: Actions = {
	start: async (event) => {
		const formData = await event.request.formData();
		const questionId = requiredInteger(formData.get('questionId'));
		const reason = String(formData.get('reason') ?? '').trim();
		const notes = String(formData.get('notes') ?? '').trim();
		const target = positiveInteger(formData.get('targetUniqueImpressions'), 30);
		const maxDurationDays = positiveInteger(formData.get('maxDurationDays'), 7);

		if (!questionId || !reason) {
			return fail(400, { action: 'start', message: 'Choose a question and add a reason.' });
		}
		if (target > 100000 || maxDurationDays > 90 || reason.length > 500 || notes.length > 2000) {
			return fail(400, { action: 'start', message: 'One or more pilot values are out of range.' });
		}

		const admin = getSupabaseAdminClient() as any;
		const { error: rpcError } = await admin.rpc('start_question_feature_run', {
			p_question_id: questionId,
			p_reason_selected: reason,
			p_selection_mode: 'manual',
			p_target_unique_impressions: target,
			p_max_duration_days: maxDurationDays,
			p_operator_notes: notes || null,
			p_created_by: event.locals.session!.user.id
		});

		if (rpcError) {
			return fail(400, {
				action: 'start',
				message: rpcErrorMessage(rpcError, 'The feature run could not be started.')
			});
		}

		return { success: true, action: 'start', message: 'The new homepage feature run is active.' };
	},
	control: async (event) => {
		const formData = await event.request.formData();
		const runId = requiredInteger(formData.get('runId'));
		const controlAction = String(formData.get('controlAction') ?? '');
		const extensionDays =
			controlAction === 'extend' ? positiveInteger(formData.get('extensionDays'), 7) : null;

		if (!runId || !['pause', 'resume', 'extend', 'stop'].includes(controlAction)) {
			return fail(400, { action: 'control', message: 'Invalid feature-run action.' });
		}
		if (extensionDays !== null && extensionDays > 90) {
			return fail(400, { action: 'control', message: 'Extension must be 90 days or less.' });
		}

		const admin = getSupabaseAdminClient() as any;
		const { error: rpcError } = await admin.rpc('control_question_feature_run', {
			p_run_id: runId,
			p_action: controlAction,
			p_extension_days: extensionDays
		});

		if (rpcError) {
			return fail(400, {
				action: 'control',
				message: rpcErrorMessage(rpcError, 'The feature run could not be updated.')
			});
		}

		return {
			success: true,
			action: 'control',
			message: `Feature run ${controlAction} completed.`
		};
	},
	setFallback: async (event) => {
		const formData = await event.request.formData();
		const questionId = requiredInteger(formData.get('questionId'));
		if (!questionId) {
			return fail(400, { action: 'setFallback', message: 'Choose an eligible fallback question.' });
		}

		const admin = getSupabaseAdminClient() as any;
		const { error: rpcError } = await admin.rpc('set_homepage_fallback_question', {
			p_question_id: questionId,
			p_updated_by: event.locals.session!.user.id
		});

		if (rpcError) {
			return fail(400, {
				action: 'setFallback',
				message: rpcErrorMessage(rpcError, 'The fallback question could not be updated.')
			});
		}

		return { success: true, action: 'setFallback', message: 'Homepage fallback updated.' };
	}
};

export const actions = guardAdminActions(actionHandlers);

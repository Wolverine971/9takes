// src/routes/api/questions/feature-impression/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { recordHomepageFeatureImpression } from '$lib/server/questionDistribution';

function parsePositiveInteger(value: unknown): number | null {
	return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : null;
}

export const POST: RequestHandler = async (event) => {
	let body: unknown;
	try {
		body = await event.request.json();
	} catch {
		return json({ recorded: false }, { status: 400 });
	}

	const featureRunId = parsePositiveInteger(
		body && typeof body === 'object' ? (body as Record<string, unknown>).featureRunId : null
	);
	const questionId = parsePositiveInteger(
		body && typeof body === 'object' ? (body as Record<string, unknown>).questionId : null
	);
	const fingerprint = event.cookies.get('9tfingerprint')?.trim();

	if (!featureRunId || !questionId || !fingerprint) {
		return json({ recorded: false }, { status: 400 });
	}

	const recorded = await recordHomepageFeatureImpression({
		featureRunId,
		questionId,
		fingerprint
	});

	return json({ recorded });
};

// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';
import { recordStrategicQuestionImpression } from '$lib/server/giveFirstFunnel';

const featuredQuestion = {
	id: 567,
	question:
		"What's something you do every day to seem 'fine' that nobody knows is costing you effort?",
	url: 'whats-something-every-day-seem-fine-nobody-knows-costing-effort'
} as const;

export const load: PageServerLoad = async (event) => {
	const fingerprint = event.cookies.get('9tfingerprint');

	if (fingerprint) {
		runBestEffortTelemetry(
			event,
			recordStrategicQuestionImpression({
				questionUrl: featuredQuestion.url,
				fingerprint,
				path: event.url.pathname,
				userId: event.locals.session?.user?.id ?? null
			}),
			(telemetryError) => {
				logBestEffortTelemetryFailure(
					'Failed to record homepage question impression',
					telemetryError,
					{ questionUrl: featuredQuestion.url }
				);
			}
		);
	}

	return { featuredQuestion };
};

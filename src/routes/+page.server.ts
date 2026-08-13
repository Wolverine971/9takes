// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import {
	logBestEffortTelemetryFailure,
	runBestEffortTelemetry
} from '$lib/server/bestEffortTelemetry';
import { recordStrategicQuestionImpression } from '$lib/server/giveFirstFunnel';
import { getHomepageFeaturedQuestion } from '$lib/server/questionDistribution';

export const load: PageServerLoad = async (event) => {
	const featuredQuestion = await getHomepageFeaturedQuestion();
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

// src/lib/server/contentAccessStore.ts
import { getSupabaseAdminClient } from './supabaseAdmin';
import type {
	ContentAccessCounters,
	ContentRequestKind,
	TrackableContentRequester
} from './contentAccessGuard';
import { logBestEffortTelemetryFailure } from './bestEffortTelemetry';

type ContentAccessRpcRow = ContentAccessCounters;
const CONTENT_ACCESS_RPC_MAX_ATTEMPTS = 2;
const CONTENT_ACCESS_RPC_RETRY_DELAY_MS = 250;

export async function recordSharedContentAccessEvent({
	requester,
	path,
	requestKind
}: {
	requester: TrackableContentRequester;
	path: string;
	requestKind: ContentRequestKind;
}): Promise<ContentAccessCounters | null> {
	for (let attempt = 1; attempt <= CONTENT_ACCESS_RPC_MAX_ATTEMPTS; attempt += 1) {
		try {
			const supabaseAdmin = getSupabaseAdminClient();
			const { data, error } = await supabaseAdmin.rpc('record_content_access_event', {
				p_actor_key: requester.actorKey,
				p_actor_type: requester.actorType,
				p_actor_name: requester.name,
				p_path: path,
				p_request_kind: requestKind
			});

			if (error) {
				if (attempt < CONTENT_ACCESS_RPC_MAX_ATTEMPTS && isTransientFetchFailure(error)) {
					await wait(CONTENT_ACCESS_RPC_RETRY_DELAY_MS);
					continue;
				}

				logBestEffortTelemetryFailure('Failed to record shared content access event', error, {
					requester: requester.name,
					path,
					requestKind,
					attempt
				});
				return null;
			}

			const row = (data as ContentAccessRpcRow[] | null)?.[0];

			if (!row) {
				return null;
			}

			return row;
		} catch (error) {
			if (attempt < CONTENT_ACCESS_RPC_MAX_ATTEMPTS && isTransientFetchFailure(error)) {
				await wait(CONTENT_ACCESS_RPC_RETRY_DELAY_MS);
				continue;
			}

			logBestEffortTelemetryFailure('Failed to record shared content access event', error, {
				requester: requester.name,
				path,
				requestKind,
				attempt
			});
			return null;
		}
	}

	return null;
}

function isTransientFetchFailure(error: unknown): boolean {
	const message = buildErrorText(error).toLowerCase();
	return message.includes('fetch failed') || message.includes('undici');
}

function buildErrorText(error: unknown): string {
	if (error instanceof Error) {
		return `${error.name} ${error.message} ${error.stack ?? ''}`;
	}

	if (error && typeof error === 'object') {
		return ['name', 'message', 'details', 'hint', 'code', 'status']
			.map((key) => (error as Record<string, unknown>)[key])
			.filter((value) => typeof value === 'string' || typeof value === 'number')
			.join(' ');
	}

	return String(error);
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

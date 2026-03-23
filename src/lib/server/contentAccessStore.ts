// src/lib/server/contentAccessStore.ts
import { getSupabaseAdminClient } from './supabaseAdmin';
import type {
	ContentAccessCounters,
	ContentRequestKind,
	TrackableContentRequester
} from './contentAccessGuard';

type ContentAccessRpcRow = ContentAccessCounters;

export async function recordSharedContentAccessEvent({
	requester,
	path,
	requestKind
}: {
	requester: TrackableContentRequester;
	path: string;
	requestKind: ContentRequestKind;
}): Promise<ContentAccessCounters | null> {
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
			console.error('Failed to record shared content access event', {
				requester: requester.name,
				path,
				requestKind,
				error
			});
			return null;
		}

		const row = (data as ContentAccessRpcRow[] | null)?.[0];

		if (!row) {
			return null;
		}

		return row;
	} catch (error) {
		console.error('Failed to record shared content access event', {
			requester: requester.name,
			path,
			requestKind,
			error
		});
		return null;
	}
}
